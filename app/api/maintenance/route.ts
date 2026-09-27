import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const assets = await prisma.maintenanceAsset.findMany({
      include: {
        workOrders: { where: { status: { in: ["OPEN", "IN_PROGRESS"] } }, orderBy: { createdAt: "desc" } },
      },
      orderBy: { healthScore: "asc" },
    });

    const openWorkOrders = await prisma.workOrder.findMany({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
      take: 20,
    });

    return NextResponse.json({
      assets: assets.map(a => ({
        id: a.id,
        assetId: a.assetId,
        name: a.name,
        category: a.category,
        location: a.location,
        healthScore: a.healthScore,
        failureProbability: a.failureProbability,
        criticalityLevel: a.criticalityLevel,
        status: a.status,
        lastServiceDate: a.lastServiceDate?.toISOString(),
        nextServiceDate: a.nextServiceDate?.toISOString(),
        openWorkOrders: a.workOrders.length,
        estimatedFailure:
          a.failureProbability > 0.3 ? "Within 12 days" :
          a.failureProbability > 0.15 ? "Within 30 days" :
          "Healthy",
      })),
      workOrders: openWorkOrders.map(wo => ({
        id: wo.id,
        title: wo.title,
        description: wo.description,
        type: wo.type,
        priority: wo.priority,
        status: wo.status,
        assignedTo: wo.assignedTo,
        estimatedHours: wo.estimatedHours,
        scheduledAt: wo.scheduledAt?.toISOString(),
        createdAt: wo.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Maintenance API error:", error);
    return NextResponse.json({ assets: [], workOrders: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const workOrder = await prisma.workOrder.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type || "CORRECTIVE",
        priority: body.priority || "MEDIUM",
        status: "OPEN",
        assetId: body.assetId,
        roomId: body.roomId,
        assignedTo: body.assignedTo,
        estimatedHours: body.estimatedHours,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
      },
    });

    return NextResponse.json({ success: true, workOrder });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create work order" }, { status: 500 });
  }
}
