"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  CheckSquare, CalendarClock, MessageSquare, Bell, Sparkles, 
  Clock, MapPin, CheckCircle2, AlertTriangle, Filter, Search,
  Users, Coffee, ChevronRight, ArrowUpRight, Zap, RefreshCw,
  Plus, Check, X, Star, Calendar, ShieldAlert, PhoneCall,
  BedDouble, UserCheck, Flame, Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Initial Mock Tasks
const INITIAL_TASKS = [
  {
    id: "TSK-101",
    title: "Deep Clean & Turnaround",
    location: "Villa 04 (Presidential)",
    dept: "Housekeeping",
    priority: "URGENT",
    status: "IN_PROGRESS",
    assignee: "Meera Singh",
    dueTime: "15 mins remaining",
    isStarred: true,
  },
  {
    id: "TSK-102",
    title: "AC Thermostat Inspection & Filter Replacement",
    location: "Room 308 (Deluxe Suite)",
    dept: "Maintenance",
    priority: "HIGH",
    status: "PENDING",
    assignee: "Arjun Das",
    dueTime: "45 mins remaining",
    isStarred: true,
  },
  {
    id: "TSK-103",
    title: "Minibar Restock & Luxury Amenities Kit",
    location: "East Wing, Room 215",
    dept: "Housekeeping",
    priority: "NORMAL",
    status: "IN_PROGRESS",
    assignee: "Kiran Bose",
    dueTime: "1 hour remaining",
    isStarred: false,
  },
  {
    id: "TSK-104",
    title: "Pool Chemistry & Heat Pump Check",
    location: "Azure Infinity Pool",
    dept: "Maintenance",
    priority: "NORMAL",
    status: "COMPLETED",
    assignee: "Arjun Das",
    dueTime: "Completed at 11:20 AM",
    isStarred: false,
  },
  {
    id: "TSK-105",
    title: "Evening Turndown & Herbal Aromatherapy",
    location: "Villa 01, 02, 03",
    dept: "Housekeeping",
    priority: "NORMAL",
    status: "PENDING",
    assignee: "Meera Singh",
    dueTime: "Due 06:30 PM",
    isStarred: false,
  },
];

// AI-Generated Schedule Roster
const SHIFTS = [
  {
    id: "SHF-1",
    name: "Meera Singh",
    role: "Senior Attendant",
    dept: "Housekeeping",
    shift: "Morning (07:00 - 15:30)",
    zone: "Villa Block (01-08)",
    status: "ACTIVE",
    workload: 88,
    aiOptimized: true,
  },
  {
    id: "SHF-2",
    name: "Arjun Das",
    role: "Maintenance Specialist",
    dept: "Engineering",
    shift: "Morning (08:00 - 16:30)",
    zone: "Main Wing & Pool HVAC",
    status: "ACTIVE",
    workload: 74,
    aiOptimized: true,
  },
  {
    id: "SHF-3",
    name: "Kiran Bose",
    role: "Floor Supervisor",
    dept: "Housekeeping",
    shift: "Afternoon (14:30 - 23:00)",
    zone: "East Wing Floors 1-4",
    status: "UPCOMING",
    workload: 65,
    aiOptimized: true,
  },
  {
    id: "SHF-4",
    name: "Vikram Iyer",
    role: "Room Service Captain",
    dept: "F&B Operations",
    shift: "Afternoon (15:00 - 23:30)",
    zone: "Spice Garden & Villas",
    status: "UPCOMING",
    workload: 82,
    aiOptimized: true,
  },
  {
    id: "SHF-5",
    name: "Priya Nair",
    role: "Duty Manager",
    dept: "Operations",
    shift: "Night (22:30 - 07:00)",
    zone: "Full Resort Sanctuary",
    status: "SCHEDULED",
    workload: 45,
    aiOptimized: true,
  },
];

// Guest Requests Feed
const INITIAL_REQUESTS = [
  {
    id: "REQ-301",
    room: "Villa 04",
    guest: "Dr. Rajesh K.",
    vip: true,
    request: "Extra organic feather pillows & Coorg artisan coffee pods",
    category: "Housekeeping",
    status: "URGENT",
    timeAgo: "4 mins ago",
  },
  {
    id: "REQ-302",
    room: "Room 412",
    guest: "Sophia Martinez",
    vip: false,
    request: "Luggage pickup assistance for 12:00 PM checkout",
    category: "Concierge / Porter",
    status: "PENDING",
    timeAgo: "12 mins ago",
  },
  {
    id: "REQ-303",
    room: "Villa 02",
    guest: "Vikram Singhania",
    vip: true,
    request: "Spa aromatherapy bath setup for 07:00 PM",
    category: "Spa & Wellness",
    status: "ASSIGNED",
    timeAgo: "25 mins ago",
  },
  {
    id: "REQ-304",
    room: "Room 205",
    guest: "Anand Verma",
    vip: false,
    request: "HDMI cable for conference room display",
    category: "IT / Maintenance",
    status: "RESOLVED",
    timeAgo: "1 hour ago",
  },
];

// Notifications Feed
const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-1",
    title: "VIP Arrival Alert: Villa 06",
    message: "Diamond Tier Guest checking in at 14:00. Priority welcome tea & fruit basket required.",
    type: "URGENT",
    time: "10 mins ago",
    unread: true,
  },
  {
    id: "NOTIF-2",
    title: "AI Shift Optimization Applied",
    message: "2 staff dynamically reallocated to Housekeeping from 13:00 to 15:00 for accelerated check-in turnover.",
    type: "AI",
    time: "25 mins ago",
    unread: true,
  },
  {
    id: "NOTIF-3",
    title: "Weather Advisory: Afternoon Mist & Showers",
    message: "Cover open-air lounge cushions and ensure umbrella stands are stocked at all villa entrances.",
    type: "WEATHER",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: "NOTIF-4",
    title: "Maintenance Completed: Heat Pump #2",
    message: "Spa temperature stabilized at 38°C. Normal operational parameters restored.",
    type: "SUCCESS",
    time: "2 hours ago",
    unread: false,
  },
];

export default function StaffPortalPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"tasks" | "schedule" | "requests" | "notifications">("tasks");

  useEffect(() => {
    if (tabParam === "schedule") setActiveTab("schedule");
    else if (tabParam === "requests") setActiveTab("requests");
    else if (tabParam === "notifications") setActiveTab("notifications");
    else if (tabParam === "tasks") setActiveTab("tasks");
  }, [tabParam]);

  // Tasks state
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [taskFilter, setTaskFilter] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [optimizingSchedule, setOptimizingSchedule] = useState(false);
  const [scheduleOptimized, setScheduleOptimized] = useState(false);

  const fetchStaffData = async () => {
    try {
      const res = await fetch("/api/staff/requests");
      const json = await res.json();
      if (json.success) {
        if (json.tasks && json.tasks.length > 0) {
          const mappedTasks = json.tasks.map((t: any) => ({
            id: t.id,
            title: t.title,
            priority: t.priority || "URGENT",
            status: t.status || "IN_PROGRESS",
            assignee: t.staff?.user?.name || "Staff Agent",
            dueTime: "15 min",
            location: t.location || "Guest Suite",
            isStarred: true,
          }));
          setTasks((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const newTasks = mappedTasks.filter((m: any) => !ids.has(m.id));
            return [...newTasks, ...prev];
          });
        }

        if (json.agentRuns && json.agentRuns.length > 0) {
          const filteredRuns = json.agentRuns.filter((run: any) =>
            (run.triggeredBy === "GUEST_CONCIERGE" || run.prompt.includes("Guest Complaint")) &&
            !run.prompt.includes("Monsoon") &&
            !run.prompt.includes("Optimize staff")
          );

          const mappedRequests = filteredRuns.map((run: any) => {
            let parsed: any = {};
            try { parsed = JSON.parse(run.resultJson || "{}"); } catch {}
            return {
              id: run.id,
              room: parsed.ticketId ? `#${parsed.ticketId}` : "Suite",
              guest: "AI Concierge Guest",
              vip: true,
              category: parsed.category || "Guest Request",
              request: run.prompt.replace("Guest Complaint Dispatch: ", "").replace(/"/g, ""),
              timeAgo: new Date(run.createdAt).toLocaleTimeString(),
              status: parsed.status === "COMPLETED" ? "RESOLVED" : "IN_PROGRESS",
              assignedStaff: parsed.assignedStaff || "Staff Agent",
            };
          });

          setRequests((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const newReqs = mappedRequests.filter((m: any) => !ids.has(m.id));
            return [...newReqs, ...prev];
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStaffData();

    const interval = setInterval(() => {
      fetchStaffData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleTaskStatus = async (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === "PENDING" ? "IN_PROGRESS" : t.status === "IN_PROGRESS" ? "COMPLETED" : "PENDING";
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    try {
      await fetch("/api/staff/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: id, status: "COMPLETED" }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const resolveRequest = async (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "RESOLVED" } : r));
    try {
      await fetch("/api/staff/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId: id, status: "RESOLVED" }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const runAIOptimization = () => {
    setOptimizingSchedule(true);
    setTimeout(() => {
      setOptimizingSchedule(false);
      setScheduleOptimized(true);
    }, 1200);
  };

  const filteredTasks = tasks.filter(t => taskFilter === "ALL" || t.status === taskFilter);
  const completedCount = tasks.filter(t => t.status === "COMPLETED").length;
  const inProgressCount = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const pendingCount = tasks.filter(t => t.status === "PENDING").length;
  const unreadNotifsCount = notifications.filter(n => n.unread).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-900/60 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                Staff Operations Portal
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                On Duty
              </span>
            </div>
            <p className="text-white/50 text-xs sm:text-sm mt-0.5">
              Assigned to: <span className="text-white/80 font-medium">Azure Hills Operations Team</span> • Shift: <span className="text-emerald-400 font-medium">Morning 08:00 - 16:30</span>
            </p>
          </div>
        </div>

        {/* 4 Feature Tabs */}
        <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: "tasks", label: "Task Dashboard", icon: CheckSquare, badge: "⭐" },
            { id: "schedule", label: "AI Schedule", icon: CalendarClock, badge: "⭐ AI" },
            { id: "requests", label: "Guest Requests", icon: MessageSquare, count: requests.filter(r => r.status !== "RESOLVED").length },
            { id: "notifications", label: "Notifications", icon: Bell, count: unreadNotifsCount },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="text-[10px] w-4 h-4 rounded-full bg-danger-DEFAULT text-white flex items-center justify-center font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Task Dashboard ⭐ */}
      {activeTab === "tasks" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Active Tasks", value: tasks.length, color: "from-blue-500 to-indigo-600", desc: "Total scheduled today" },
              { label: "In Progress", value: inProgressCount, color: "from-amber-500 to-orange-600", desc: "Currently executing" },
              { label: "Pending", value: pendingCount, color: "from-purple-500 to-pink-600", desc: "Awaiting start" },
              { label: "Completed", value: completedCount, color: "from-emerald-500 to-teal-600", desc: "Turnarounds verified" },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-4 sm:p-5 relative overflow-hidden">
                <div className={`w-2 h-full absolute left-0 top-0 bg-gradient-to-b ${stat.color}`} />
                <div className="text-white/50 text-xs font-medium uppercase tracking-wider">{stat.label}</div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">{stat.value}</div>
                <div className="text-white/40 text-[11px] mt-1">{stat.desc}</div>
              </div>
            ))}
          </div>

          {/* Task Control & Filters */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-display font-bold text-white">Daily Operational Task List</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                  {filteredTasks.length} Visible
                </span>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/10 text-xs">
                {(["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setTaskFilter(filter)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg font-medium transition-all",
                      taskFilter === filter ? "bg-white/20 text-white font-semibold shadow" : "text-white/50 hover:text-white"
                    )}
                  >
                    {filter.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Items */}
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                    task.status === "COMPLETED" 
                      ? "bg-emerald-950/20 border-emerald-500/20 opacity-75" 
                      : task.priority === "URGENT"
                      ? "bg-red-950/20 border-red-500/30 hover:border-red-500/50"
                      : "bg-surface-900/60 border-white/10 hover:border-white/20"
                  )}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={cn(
                        "w-7 h-7 rounded-xl border flex items-center justify-center mt-0.5 transition-all",
                        task.status === "COMPLETED" 
                          ? "bg-emerald-500 border-emerald-400 text-white"
                          : task.status === "IN_PROGRESS"
                          ? "bg-amber-500/20 border-amber-400 text-amber-300"
                          : "border-white/20 hover:border-white/40 text-transparent"
                      )}
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-white/40">{task.id}</span>
                        <h3 className={cn("text-sm font-semibold text-white", task.status === "COMPLETED" && "line-through text-white/50")}>
                          {task.title}
                        </h3>
                        {task.priority === "URGENT" && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-danger-DEFAULT/20 text-danger-light border border-danger-DEFAULT/30">
                            Urgent
                          </span>
                        )}
                        {task.isStarred && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-300" /> Key Task
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-white/50 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-white/80">
                          <MapPin className="w-3.5 h-3.5 text-brand-400" />
                          {task.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-white/40" />
                          {task.dueTime}
                        </span>
                        <span>Assignee: <strong className="text-white/70">{task.assignee}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
                        task.status === "COMPLETED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : task.status === "IN_PROGRESS"
                          ? "bg-amber-500 text-black hover:bg-amber-400"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      )}
                    >
                      {task.status === "COMPLETED" ? "Completed ✓" : task.status === "IN_PROGRESS" ? "Mark Done" : "Start Task"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: AI-Generated Schedule ⭐ */}
      {activeTab === "schedule" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* AI Banner */}
          <div className="glass-card p-6 border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-surface-900 to-surface-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-display font-bold text-white">AI-Generated Shift Schedule</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Autonomous Allocation
                  </span>
                </div>
                <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-2xl">
                  Calculated based on real-time guest arrivals (87% occupancy), checkout volume at 12:00 PM, and active maintenance sensor alerts.
                </p>
              </div>
            </div>

            <button
              onClick={runAIOptimization}
              disabled={optimizingSchedule}
              className="btn-ai py-3 px-5 text-xs font-semibold flex items-center gap-2 whitespace-nowrap self-stretch md:self-auto justify-center"
            >
              {optimizingSchedule ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Balancing Roster...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Regenerate AI Schedule</span>
                </>
              )}
            </button>
          </div>

          {scheduleOptimized && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              AI Schedule updated successfully! Workloads rebalanced across 18 staff members.
            </div>
          )}

          {/* Schedule Roster Table */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-brand-400" />
                <span>Today's Shift Roster</span>
              </h3>
              <span className="text-xs text-white/50">{SHIFTS.length} On Duty Assigned</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SHIFTS.map((staff) => (
                <div
                  key={staff.id}
                  className="p-4 rounded-2xl bg-surface-900/80 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold text-sm">{staff.name}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-white/70">
                          {staff.dept}
                        </span>
                      </div>
                      <div className="text-white/50 text-xs mt-0.5">{staff.role}</div>
                    </div>

                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border",
                      staff.status === "ACTIVE" 
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" 
                        : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    )}>
                      {staff.status}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-white/60">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-white/80">
                        <Clock className="w-3.5 h-3.5 text-brand-400" />
                        {staff.shift}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Sparkles className="w-3 h-3" /> AI Optimized
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Zone: <strong className="text-white/80">{staff.zone}</strong></span>
                      <span>Workload: <strong className="text-white/90">{staff.workload}%</strong></span>
                    </div>

                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          staff.workload > 85 ? "bg-red-500" : staff.workload > 70 ? "bg-amber-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${staff.workload}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: Guest Requests */}
      {activeTab === "requests" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-display font-bold text-white">Live Guest Requests Queue</h2>
              </div>
              <span className="text-xs text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30 font-semibold">
                Fast Action Feed
              </span>
            </div>

            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={cn(
                    "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                    req.status === "RESOLVED" 
                      ? "bg-surface-900/30 border-white/5 opacity-60" 
                      : req.vip 
                      ? "bg-amber-950/20 border-amber-500/30 hover:border-amber-400/50"
                      : "bg-surface-900/60 border-white/10 hover:border-white/20"
                  )}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      req.vip ? "bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg" : "bg-white/10"
                    )}>
                      {req.vip ? <Star className="w-5 h-5 text-white" /> : <BedDouble className="w-5 h-5 text-white/70" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{req.room}</span>
                        <span className="text-xs text-white/60">({req.guest})</span>
                        {req.vip && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            VIP Guest
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/70">
                          {req.category}
                        </span>
                      </div>

                      <p className="text-sm text-white/90 font-medium mt-1">
                        "{req.request}"
                      </p>

                      <div className="text-[11px] text-white/40 mt-1 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>Requested {req.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {req.status === "RESOLVED" ? (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => resolveRequest(req.id)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md active:scale-95 transition-all"
                      >
                        Fulfill & Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 4: Notifications */}
      {activeTab === "notifications" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-display font-bold text-white">Staff Operational Notifications</h2>
                {unreadNotifsCount > 0 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                    {unreadNotifsCount} New
                  </span>
                )}
              </div>

              <button
                onClick={markAllNotifsRead}
                className="text-xs text-white/60 hover:text-white px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
              >
                Mark All as Read
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "p-4 rounded-2xl border transition-all flex items-start justify-between gap-3",
                    notif.unread ? "bg-surface-900/90 border-blue-500/30" : "bg-surface-900/40 border-white/5 opacity-75"
                  )}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                      notif.type === "URGENT" ? "bg-red-500/20 text-red-300 border border-red-500/30" :
                      notif.type === "AI" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                      "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    )}>
                      {notif.type === "URGENT" ? <AlertTriangle className="w-4 h-4" /> :
                       notif.type === "AI" ? <Sparkles className="w-4 h-4" /> :
                       <Bell className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">{notif.title}</h3>
                        {notif.unread && (
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                        )}
                      </div>
                      <p className="text-xs text-white/70 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[11px] text-white/40 mt-2 block">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
