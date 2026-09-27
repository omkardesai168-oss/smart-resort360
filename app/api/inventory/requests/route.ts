import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InventoryAgent } from "@/lib/ai/agents/InventoryAgent";

export const dynamic = "force-dynamic";

// GET — fetch all inventory requests (latest first)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // PENDING | APPROVED | REJECTED | all
  const sync = searchParams.get("sync");

  try {
    // If sync requested or no requests exist yet, run predictive depletion engine
    if (sync === "true") {
      await InventoryAgent.forecastAndOptimize("Auto-sync from Inventory Staff portal");
    }

    const where = status && status !== "all" ? { status } : {};
    let requests = await prisma.inventoryRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // If still empty, trigger initial forecast to populate critical requests
    if (requests.length === 0 && (!status || status === "all" || status === "PENDING")) {
      await InventoryAgent.forecastAndOptimize("Initial forecast populate");
      requests = await prisma.inventoryRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Inventory requests GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inventory requests" },
      { status: 500 }
    );
  }
}

// POST — create a new inventory request or sync predictive engine
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support trigger for sync_engine action
    if (body.action === "sync_engine") {
      const forecastResult = await InventoryAgent.forecastAndOptimize(
        "Predictive Depletion Scan from Inventory Staff Portal",
        "INVENTORY_STAFF"
      );
      const requests = await prisma.inventoryRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      return NextResponse.json({
        success: true,
        requests,
        summary: forecastResult.summary,
        criticalCount: forecastResult.criticalCount,
      });
    }

    const {
      sku, itemName, category, currentStock, requestedQty,
      unit, estimatedCost, priority, reason, vendor, raisedBy,
    } = body;

    const poNumber = `PO-${Date.now().toString(36).toUpperCase()}`;

    const request = await prisma.inventoryRequest.create({
      data: {
        sku: sku || "SKU-000",
        itemName: itemName || "Unknown Item",
        category: category || "GENERAL",
        currentStock: currentStock ?? 0,
        requestedQty: requestedQty ?? 1,
        unit: unit || "Units",
        estimatedCost: estimatedCost ?? 0,
        priority: priority || "HIGH",
        reason: reason || "Critical restock required",
        vendor: vendor || "Pending Vendor Assignment",
        raisedBy: raisedBy || "InventoryManagementAgent (Predictive Engine)",
        status: "PENDING",
        poNumber,
      },
    });

    // Also create an alert so it shows in the system
    await prisma.alert.create({
      data: {
        type: "INVENTORY",
        severity: priority === "CRITICAL" ? "CRITICAL" : "WARNING",
        title: `📦 Inventory Request: ${itemName}`,
        message: `Agent raised a ${priority} restock request for ${itemName} (Qty: ${requestedQty} ${unit}). PO: ${poNumber}. Awaiting Inventory Staff approval.`,
        entityType: "InventoryRequest",
        entityId: request.id,
        isRead: false,
      },
    });

    return NextResponse.json({ success: true, request });
  } catch (error) {
    console.error("Inventory requests POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create inventory request" },
      { status: 500 }
    );
  }
}

// PATCH — approve or reject an inventory request
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, approvedBy, rejectionNote } = body; // action: "approve" | "reject"

    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: "Missing id or action" },
        { status: 400 }
      );
    }

    const existing = await prisma.inventoryRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 });
    }

    const updated = await prisma.inventoryRequest.update({
      where: { id },
      data: {
        status: action === "approve" ? "APPROVED" : "REJECTED",
        approvedBy: approvedBy || "Inventory Staff",
        approvedAt: new Date(),
        rejectionNote: action === "reject" ? rejectionNote : null,
      },
    });

    // If approved → persist an AgentRun so it appears in Multi-Agent Command Center
    if (action === "approve") {
      await prisma.agentRun.create({
        data: {
          agentName: "InventoryManagementAgent",
          agentRole: "Inventory Domain Agent",
          prompt: `Inventory Restock Approved: ${existing.itemName} (PO: ${existing.poNumber})`,
          summary: `Inventory Staff approved restock of ${existing.requestedQty} ${existing.unit} of ${existing.itemName}. Estimated cost: ₹${existing.estimatedCost.toLocaleString()}. Vendor: ${existing.vendor || "TBD"}. Category: ${existing.category}. Priority was ${existing.priority}.`,
          resultJson: JSON.stringify({
            requestId: id,
            poNumber: existing.poNumber,
            itemName: existing.itemName,
            sku: existing.sku,
            category: existing.category,
            requestedQty: existing.requestedQty,
            unit: existing.unit,
            estimatedCost: existing.estimatedCost,
            vendor: existing.vendor,
            priority: existing.priority,
            approvedBy: approvedBy || "Inventory Staff",
            status: "APPROVED",
          }),
          confidence: 0.98,
          durationMs: 120,
          status: "COMPLETED",
          triggeredBy: "INVENTORY_STAFF",
        },
      });

      // Mark alert as read after approval
      await prisma.alert.updateMany({
        where: { entityType: "InventoryRequest", entityId: id },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("Inventory requests PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inventory request" },
      { status: 500 }
    );
  }
}
