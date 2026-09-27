import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OrchestratorAgent } from "@/lib/ai/agents/OrchestratorAgent";
import { StaffSchedulingAgent } from "@/lib/ai/agents/StaffSchedulingAgent";
import { InventoryAgent } from "@/lib/ai/agents/InventoryAgent";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession().catch(() => null);
    const triggeredBy = (session?.user as any)?.email || "SYSTEM";

    const body = await req.json();
    const { prompt, agentType = "orchestrator", scenario } = body;

    const queryPrompt = prompt || scenario || "Optimize resort operations for current occupancy and upcoming demand";

    if (agentType === "staff") {
      const result = await StaffSchedulingAgent.planSchedule(queryPrompt, triggeredBy);
      return NextResponse.json({ success: true, agent: "StaffSchedulingAgent", data: result });
    }

    if (agentType === "inventory") {
      const result = await InventoryAgent.forecastAndOptimize(queryPrompt, triggeredBy);
      return NextResponse.json({ success: true, agent: "InventoryAgent", data: result });
    }

    // Default: Orchestrator (runs all sub-agents + persists)
    const result = await OrchestratorAgent.orchestrate(queryPrompt, {}, triggeredBy);
    return NextResponse.json({ success: true, agent: "OrchestratorAgent", data: result });
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json(
      { success: false, error: "Agent orchestration failed", details: String(error) },
      { status: 500 }
    );
  }
}

// GET: Return last N agent runs from DB
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20", 10));
    const agentName = searchParams.get("agent");

    const runs = await prisma.agentRun.findMany({
      where: agentName ? { agentName } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        agentName: true,
        agentRole: true,
        prompt: true,
        summary: true,
        confidence: true,
        durationMs: true,
        status: true,
        triggeredBy: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, runs, total: runs.length });
  } catch (error) {
    console.error("Agent runs fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch agent runs" }, { status: 500 });
  }
}
