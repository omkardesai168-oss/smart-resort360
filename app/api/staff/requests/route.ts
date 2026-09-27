import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: Fetch live guest requests, tasks, and agent dispatches from database
export async function GET() {
  try {
    const [tasks, alerts, agentRuns] = await Promise.all([
      prisma.task.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
        include: {
          staff: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
        },
      }),
      prisma.alert.findMany({
        where: { entityType: "GuestComplaint" },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.agentRun.findMany({
        where: {
          OR: [
            { triggeredBy: "GUEST_CONCIERGE" },
            { prompt: { contains: "Guest Complaint" } },
          ],
          NOT: [
            { prompt: { contains: "Monsoon" } },
            { prompt: { contains: "Optimize staff" } },
            { prompt: { contains: "demand surge" } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);

    return NextResponse.json({
      success: true,
      tasks,
      alerts,
      agentRuns,
    });
  } catch (error) {
    console.error("Staff requests GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff requests & tasks" },
      { status: 500 }
    );
  }
}

// POST: Update task status in database
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskId, alertId, status } = body;

    if (taskId) {
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          status: status || "COMPLETED",
          completedAt: status === "COMPLETED" ? new Date() : null,
        },
      });
      return NextResponse.json({ success: true, task: updatedTask });
    }

    if (alertId) {
      const updatedAlert = await prisma.alert.update({
        where: { id: alertId },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, alert: updatedAlert });
    }

    return NextResponse.json({ success: false, error: "Missing taskId or alertId" }, { status: 400 });
  } catch (error) {
    console.error("Staff requests POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
  }
}
