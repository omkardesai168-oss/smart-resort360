import { prisma } from "@/lib/prisma";

export const INDIAN_STAFF_POOL: Record<
  string,
  Array<{ name: string; dept: string; role: string }>
> = {
  MAINTENANCE: [
    { name: "Rajesh Sharma", dept: "MAINTENANCE", role: "Plumbing & Hydraulics Lead" },
    { name: "Vikram Patel", dept: "MAINTENANCE", role: "Senior Maintenance Supervisor" },
    { name: "Suresh Kulkarni", dept: "MAINTENANCE", role: "HVAC & Climate Control Specialist" },
    { name: "Amit Kumar", dept: "MAINTENANCE", role: "Electrical & Power Systems Engineer" },
    { name: "Dinesh Verma", dept: "MAINTENANCE", role: "Equipment Repair Technician" },
    { name: "Manoj Deshmukh", dept: "MAINTENANCE", role: "General Asset & Carpentry Lead" },
  ],
  HOUSEKEEPING: [
    { name: "Meera Singh", dept: "HOUSEKEEPING", role: "Housekeeping Operations Lead" },
    { name: "Priya Rao", dept: "HOUSEKEEPING", role: "Executive Room Turnaround Supervisor" },
    { name: "Sunita Reddy", dept: "HOUSEKEEPING", role: "Hygiene & Linen Specialist" },
    { name: "Kavita Joshi", dept: "HOUSEKEEPING", role: "Amenities & Supplies Coordinator" },
    { name: "Ananya Nair", dept: "HOUSEKEEPING", role: "VIP Villa Turnover Executive" },
  ],
  CONCIERGE: [
    { name: "Rohan Mehta", dept: "CONCIERGE", role: "Senior Guest Experience Specialist" },
    { name: "Arjun Singhania", dept: "CONCIERGE", role: "VIP Guest Relations Executive" },
    { name: "Deepak Prasad", dept: "CONCIERGE", role: "Duty Manager & Response Lead" },
    { name: "Rahul Varma", dept: "CONCIERGE", role: "Concierge Response Officer" },
  ],
};

let dispatchCounter = 0;

export interface AgentThought {
  step: number;
  agent: "StaffSchedulingAgent" | "InventoryAgent" | "OrchestratorAgent";
  action: string;
  thought: string;
  data?: any;
  timestamp: string;
}

export interface ShiftPlan {
  staffId: string;
  name: string;
  department: string;
  shift: string;
  assignedZone: string;
  workload: number;
  reason: string;
}

export interface StaffAgentResult {
  summary: string;
  bottlenecksIdentified: string[];
  reallocations: Array<{
    staffName: string;
    fromDept: string;
    toDept: string;
    duration: string;
    expectedImpact: string;
  }>;
  optimizedRoster: ShiftPlan[];
  confidence: number;
  thoughts: AgentThought[];
  // Real-time data fields
  realOccupancyPct?: number;
  totalStaffActive?: number;
  checkoutsToday?: number;
}

export class StaffSchedulingAgent {
  static readonly agentName = "StaffSchedulingAgent";
  static readonly role = "Workforce Optimization & Dynamic Shift Scheduler";

  static async planSchedule(scenario?: string, triggeredBy = "SYSTEM"): Promise<StaffAgentResult> {
    const startTime = Date.now();

    // ─── Step 1: Fetch REAL data from DB ─────────────────────────────────────
    const [allStaff, rooms, bookings] = await Promise.all([
      prisma.staff.findMany({
        include: { user: { select: { name: true, email: true } } },
        where: { status: { in: ["ON_DUTY", "BREAK"] } },
        take: 50,
      }),
      prisma.room.findMany({ select: { id: true, status: true, type: true, floor: true } }),
      prisma.booking.findMany({
        where: {
          status: { in: ["CHECKED_IN", "CONFIRMED"] },
          checkIn: { lte: new Date() },
          checkOut: { gte: new Date() },
        },
        include: { room: { select: { type: true } } },
      }),
    ]);

    const occupiedRooms = rooms.filter((r) => r.status === "OCCUPIED").length;
    const totalRooms = rooms.length || 160;
    const occupancyPct = Math.round((occupiedRooms / totalRooms) * 100);

    const housekeepingStaff = allStaff.filter((s) => s.department === "HOUSEKEEPING");
    const spaStaff = allStaff.filter((s) => s.department === "SPA");

    // ─── Thoughts ────────────────────────────────────────────────────────────
    const thoughts: AgentThought[] = [
      {
        step: 1,
        agent: "StaffSchedulingAgent",
        action: "Fetch Real-Time Workload & Occupancy from Database",
        thought: `Fetched live DB data: ${occupiedRooms} occupied rooms out of ${totalRooms} total (${occupancyPct}% occupancy). Found ${allStaff.length} active staff across departments. ${bookings.length} active bookings loaded.`,
        timestamp: new Date().toLocaleTimeString(),
        data: { occupiedRooms, totalRooms, occupancyPct, activeStaff: allStaff.length },
      },
      {
        step: 2,
        agent: "StaffSchedulingAgent",
        action: "Evaluate Cross-Department Skill Matrix",
        thought: `Housekeeping has ${housekeepingStaff.length} active staff with ${occupancyPct > 80 ? "critically high" : "moderate"} utilization at ${occupancyPct}% occupancy. Spa department has ${spaStaff.length} staff with potential for cross-deployment during peak periods.`,
        timestamp: new Date().toLocaleTimeString(),
        data: { housekeepingCount: housekeepingStaff.length, spaCount: spaStaff.length },
      },
      {
        step: 3,
        agent: "StaffSchedulingAgent",
        action: "Synthesize Optimized Roster",
        thought: `Computing reallocation plan based on ${occupancyPct}% occupancy pressure. ${
          occupancyPct > 80
            ? "Peak surge detected — triggering cross-training deployment from low-utilization spa to housekeeping."
            : "Occupancy is normal. Maintaining standard shifts with minor optimization."
        } Estimating ${Math.max(20, 47 - Math.floor(occupancyPct / 5))} min room wait time reduction.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ];

    // ─── Build roster from real staff ────────────────────────────────────────
    const optimizedRoster: ShiftPlan[] = allStaff.slice(0, 5).map((s, i) => ({
      staffId: s.id,
      name: s.user?.name || `Staff-${i + 1}`,
      department: s.department,
      shift: i % 3 === 0 ? "Morning (07:00 - 15:30)" : i % 3 === 1 ? "Afternoon (14:00 - 22:30)" : "Night (22:00 - 06:30)",
      assignedZone: s.currentZone || `Zone ${String.fromCharCode(65 + (i % 5))}`,
      workload: Math.min(95, 55 + Math.floor(occupancyPct * 0.4) + (i % 3 === 0 ? 5 : 0)),
      reason: `AI-assigned based on ${occupancyPct}% occupancy pressure and dept utilization data`,
    }));

    // Fallback if no real staff exists (demo mode)
    if (optimizedRoster.length === 0) {
      optimizedRoster.push(
        { staffId: "DEMO-01", name: "Meera Singh", department: "Housekeeping", shift: "Morning (07:00 - 15:30)", assignedZone: "Villa Block (01-08)", workload: 85, reason: "Assigned high-touch VIP presidential suites" },
        { staffId: "DEMO-02", name: "Kiran Bose", department: "Housekeeping", shift: "Afternoon (14:00 - 22:30)", assignedZone: "East Wing Floors 1-4", workload: 78, reason: "Evening turndown and guest amenity delivery" }
      );
    }

    const confidence = Math.min(0.99, 0.75 + (allStaff.length > 5 ? 0.15 : 0.05) + (rooms.length > 50 ? 0.09 : 0));
    const durationMs = Date.now() - startTime;

    const result: StaffAgentResult = {
      summary: `AI workforce rebalance generated using live DB data: ${allStaff.length} active staff across ${[...new Set(allStaff.map(s => s.department))].length} departments. Current occupancy: ${occupancyPct}%. ${occupancyPct > 80 ? "Cross-trained staff reallocation triggered for peak surge." : "Standard shifts optimized for current load."}`,
      bottlenecksIdentified: [
        `Housekeeping at ${Math.min(99, occupancyPct + 7)}% capacity (live DB: ${occupiedRooms} occupied rooms)`,
        `${bookings.filter(b => b.room?.type === "VILLA").length} VIP villa bookings require expedited turnover`,
        occupancyPct > 70 ? "Night shift engineering under-allocated for peak energy demand" : "Spa utilization low — reallocation opportunity exists",
      ],
      reallocations: occupancyPct > 70 ? [
        {
          staffName: spaStaff[0]?.user?.name || "Ananya Sharma",
          fromDept: "Spa & Wellness",
          toDept: "Housekeeping (VIP Villa Block)",
          duration: "90 Minutes (12:30 - 14:00)",
          expectedImpact: "Clears 4 pending suites before VIP check-in",
        },
        ...(spaStaff[1] ? [{
          staffName: spaStaff[1]?.user?.name || "Priya Rao",
          fromDept: "Spa & Wellness",
          toDept: "Housekeeping (East Wing)",
          duration: "90 Minutes (12:30 - 14:00)",
          expectedImpact: "Reduces room turnover backlog by 35%",
        }] : []),
      ] : [],
      optimizedRoster,
      confidence,
      thoughts,
      realOccupancyPct: occupancyPct,
      totalStaffActive: allStaff.length,
      checkoutsToday: bookings.length,
    };

    // ─── Persist to DB ────────────────────────────────────────────────────────
    try {
      await prisma.agentRun.create({
        data: {
          agentName: StaffSchedulingAgent.agentName,
          agentRole: StaffSchedulingAgent.role,
          prompt: scenario || "Optimize staff scheduling for current occupancy",
          summary: result.summary,
          resultJson: JSON.stringify(result),
          confidence,
          durationMs,
          status: "COMPLETED",
          triggeredBy,
        },
      });
    } catch (e) {
      console.error("Failed to persist StaffSchedulingAgent run:", e);
    }

    return result;
  }

  /**
   * Immediately assign on-duty staff to handle a guest complaint/request (cleaning, repairs, plumbing, etc.)
   */
  static async assignStaffForGuestIssue(
    issueMessage: string,
    triggeredBy = "GUEST_CONCIERGE"
  ): Promise<{
    success: boolean;
    ticketId: string;
    staffName: string;
    staffDept: string;
    category: string;
    estimatedMinutes: number;
    summary: string;
  }> {
    const startTime = Date.now();
    const lower = issueMessage.toLowerCase();

    // Determine issue type & target department
    let targetDept = "HOUSEKEEPING";
    let category = "Cleaning & Room Service Request";

    if (
      lower.includes("plumb") ||
      lower.includes("leak") ||
      lower.includes("tap") ||
      lower.includes("pipe") ||
      lower.includes("water") ||
      lower.includes("toilet") ||
      lower.includes("flush") ||
      lower.includes("sink") ||
      lower.includes("drain") ||
      lower.includes("clog")
    ) {
      targetDept = "MAINTENANCE";
      category = "Plumbing Emergency & Water Repairs";
    } else if (
      lower.includes("repair") ||
      lower.includes("fix") ||
      lower.includes("ac") ||
      lower.includes("aircon") ||
      lower.includes("cool") ||
      lower.includes("heat") ||
      lower.includes("tv") ||
      lower.includes("light") ||
      lower.includes("switch") ||
      lower.includes("door") ||
      lower.includes("lock") ||
      lower.includes("broken") ||
      lower.includes("damage") ||
      lower.includes("appliance") ||
      lower.includes("geyser") ||
      lower.includes("power")
    ) {
      targetDept = "MAINTENANCE";
      category = "Maintenance & Asset Repair";
    } else if (
      lower.includes("clean") ||
      lower.includes("towel") ||
      lower.includes("linen") ||
      lower.includes("dust") ||
      lower.includes("trash") ||
      lower.includes("garbage") ||
      lower.includes("bed") ||
      lower.includes("pillow") ||
      lower.includes("soap") ||
      lower.includes("shampoo") ||
      lower.includes("room service") ||
      lower.includes("dirty") ||
      lower.includes("stain") ||
      lower.includes("sweep") ||
      lower.includes("mop")
    ) {
      targetDept = "HOUSEKEEPING";
      category = "Housekeeping & Room Turnaround";
    } else {
      targetDept = "CONCIERGE";
      category = "Guest Assistance & Room Support";
    }

    // 1. Query available staff from DB for target department
    let availableStaff = await prisma.staff.findMany({
      where: {
        department: targetDept,
        status: { in: ["ON_DUTY", "BREAK"] },
      },
      include: { user: { select: { name: true, email: true } } },
      take: 10,
    });

    // Fallback: fetch any active staff if none in exact department
    if (availableStaff.length === 0) {
      availableStaff = await prisma.staff.findMany({
        where: { status: { in: ["ON_DUTY", "BREAK"] } },
        include: { user: { select: { name: true, email: true } } },
        take: 10,
      });
    }

    // Pick assigned staff member dynamically from the 15 Indian staff pool
    const pool = INDIAN_STAFF_POOL[targetDept] || INDIAN_STAFF_POOL.CONCIERGE;
    dispatchCounter = (dispatchCounter + 1) % pool.length;
    const poolStaff = pool[dispatchCounter];

    const staffName = poolStaff.name;
    const staffDept = poolStaff.dept;
    const staffRole = poolStaff.role;
    const selectedStaff = availableStaff[0];
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const estimatedMinutes = 5 + Math.floor(Math.random() * 6); // 5-10 mins

    // ── Live Groq AI Reasoning for custom dispatch instructions ──
    let customAiNotes = "";
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
            messages: [
              {
                role: "system",
                content: `You are the Staff Scheduling AI Agent for Azure Hills Resort. A guest reported: "${issueMessage}". Assigned staff: ${staffName} (${staffDept}). In 1 concise sentence, state what tools/action the staff will take to resolve this immediately.`,
              },
            ],
            temperature: 0.5,
            max_tokens: 80,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const text = groqData.choices?.[0]?.message?.content;
          if (text) {
            customAiNotes = text.trim();
          }
        }
      } catch (e) {
        console.error("Groq live dispatch reasoning error:", e);
      }
    }

    const summary = customAiNotes
      ? `StaffSchedulingAgent live AI dispatched ${staffName} (${staffDept}): "${customAiNotes}" (Ticket #${ticketId}, ETA: ${estimatedMinutes} mins)`
      : `StaffSchedulingAgent immediately dispatched ${staffName} (${staffDept}) for ${category}: "${issueMessage}". Ticket #${ticketId}. Estimated arrival: ${estimatedMinutes} mins.`;

    // 2. Persist Alert to DB for Manager/Operations visibility
    try {
      await prisma.alert.create({
        data: {
          type: targetDept === "HOUSEKEEPING" ? "GUEST" : "MAINTENANCE",
          severity: "CRITICAL",
          title: `Dispatch: ${category} (${ticketId})`,
          message: `Guest Complaint: "${issueMessage}". Assigned to ${staffName} (${staffDept}) by StaffSchedulingAgent.`,
          entityType: "GuestComplaint",
          entityId: ticketId,
        },
      });
    } catch (e) {
      console.error("Failed to create alert for guest issue dispatch:", e);
    }

    // 2b. Create Task record in DB for Staff Task Dashboard
    try {
      if (selectedStaff?.id) {
        await prisma.task.create({
          data: {
            staffId: selectedStaff.id,
            title: `[#${ticketId}] ${category}`,
            description: `Guest Complaint: "${issueMessage}". Assigned by StaffSchedulingAgent.`,
            type: targetDept === "HOUSEKEEPING" ? "HOUSEKEEPING" : targetDept === "MAINTENANCE" ? "MAINTENANCE" : "CONCIERGE",
            priority: "URGENT",
            status: "IN_PROGRESS",
            location: "Guest Room / Suite",
            dueAt: new Date(Date.now() + 15 * 60 * 1000),
          },
        });
      }
    } catch (e) {
      console.error("Failed to create task in DB:", e);
    }

    // 3. Persist run to agent_runs table
    try {
      await prisma.agentRun.create({
        data: {
          agentName: StaffSchedulingAgent.agentName,
          agentRole: StaffSchedulingAgent.role,
          prompt: `Guest Complaint Dispatch: "${issueMessage}"`,
          summary,
          resultJson: JSON.stringify({
            ticketId,
            assignedStaff: staffName,
            department: staffDept,
            category,
            estimatedArrivalMinutes: estimatedMinutes,
            status: "DISPATCHED",
          }),
          confidence: 0.99,
          durationMs: Date.now() - startTime,
          status: "COMPLETED",
          triggeredBy,
        },
      });
    } catch (e) {
      console.error("Failed to persist StaffSchedulingAgent dispatch run:", e);
    }

    return {
      success: true,
      ticketId,
      staffName,
      staffDept,
      category,
      estimatedMinutes,
      summary,
    };
  }
}
