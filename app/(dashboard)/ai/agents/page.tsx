"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Brain, Bot, Sparkles, Users, Package, RefreshCw,
  ArrowRight, CheckCircle2, AlertTriangle, Play, Zap,
  Send, Layers, GitBranch, Cpu, Clock, Check, ChevronRight,
  TrendingUp, ShieldCheck, DollarSign, Star, FileText, Database, XCircle
} from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrchestratorResult, OrchestratedActionItem } from "@/lib/ai/agents/OrchestratorAgent";

// ──────────────────────────────────────────────────────────────────────────────
// InventoryApprovedFeed — Live hero section inside Inventory tab
// Shows requests approved by Inventory Staff, synced every 3s
// ──────────────────────────────────────────────────────────────────────────────
function InventoryApprovedFeed() {
  const [approved, setApproved] = useState<any[]>([]);
  const [pending, setPending]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [appRes, pendRes] = await Promise.all([
        fetch("/api/inventory/requests?status=APPROVED"),
        fetch("/api/inventory/requests?status=PENDING"),
      ]);
      const appJson  = await appRes.json();
      const pendJson = await pendRes.json();
      if (appJson.success)  setApproved(appJson.requests);
      if (pendJson.success) setPending(pendJson.requests);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchAll, 3000);
    return () => clearInterval(iv);
  }, [fetchAll]);

  const critical = pending.filter((r) => r.priority === "CRITICAL");

  return (
    <div className="glass-card p-6 space-y-4 border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-surface-900 to-surface-950 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Package className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-display font-bold text-white">
                Inventory Staff · Approved Restock Requests
              </h3>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                LIVE SYNC (3s)
              </span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              Critical inventory restock requests approved by Inventory Staff are streamed here in real-time. Each approved PO triggers immediate supplier dispatch.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
            {approved.length} Approved
          </span>
          {critical.length > 0 && (
            <span className="text-xs px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 font-mono font-bold border border-red-500/30 animate-pulse">
              ⚠ {critical.length} Critical Pending
            </span>
          )}
        </div>
      </div>

      {/* Approved list */}
      {loading ? (
        <div className="p-6 text-center text-white/40 text-sm animate-pulse">Loading approved inventory requests...</div>
      ) : approved.length === 0 ? (
        <div className="p-8 text-center text-white/40 text-sm glass-card bg-black/20">
          No approved inventory requests yet. Go to the <strong className="text-amber-300">Inventory Staff</strong> tab in the Staff section to review and approve AI-raised restock requests.
        </div>
      ) : (
        <div className="space-y-3">
          {approved.map((req) => (
            <div key={req.id} className="p-4 rounded-2xl bg-surface-900/90 border border-amber-500/30 hover:border-amber-400/60 transition-all space-y-3 shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/40">
                    {req.poNumber || "#PO"}
                  </span>
                  <span className="text-sm font-bold text-white">{req.itemName}</span>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    req.priority === "CRITICAL" ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  )}>{req.priority}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  APPROVED & DISPATCHED
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                  <div className="text-sm font-bold text-red-300">{req.currentStock} {req.unit}</div>
                  <div className="text-[10px] text-white/40">Current Stock</div>
                </div>
                <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                  <div className="text-sm font-bold text-emerald-300">{req.requestedQty} {req.unit}</div>
                  <div className="text-[10px] text-white/40">Restocking Qty</div>
                </div>
                <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                  <div className="text-sm font-bold text-white">₹{req.estimatedCost.toLocaleString("en-IN")}</div>
                  <div className="text-[10px] text-white/40">PO Value</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-white/60 flex-wrap gap-2 pt-1 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span>Vendor:</span>
                  <strong className="text-amber-300">{req.vendor || "TBD"}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span>Approved by:</span>
                  <strong className="text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{req.approvedBy}</strong>
                </div>
                <span className="font-mono text-[11px] text-white/40">
                  {req.approvedAt ? new Date(req.approvedAt).toLocaleString() : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending critical warning */}
      {critical.length > 0 && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
          <span>
            <strong>{critical.length} CRITICAL</strong> restock request{critical.length > 1 ? "s are" : " is"} pending approval in the <strong className="text-white/80">Staff → Inventory Staff</strong> tab.
          </span>
        </div>
      )}
    </div>
  );
}

const SCENARIOS = [
  {
    label: "Weekend Monsoon & 98% Occupancy Surge",
    prompt: "Monsoon showers predicted for the weekend with 98% occupancy. Optimize housekeeping shifts, outdoor dining relocation, and F&B stock.",
    icon: Sparkles,
  },
  {
    label: "Emergency VIP Banquet & Kitchen Stock Shortage",
    prompt: "Surge booking of 120 VIP banquet guests for tonight. Rebalance kitchen staff and draft urgent POs for artisan ingredients.",
    icon: Users,
  },
  {
    label: "Turnaround Crisis: 8 Presidential Suites in 2 Hours",
    prompt: "8 presidential suites checkout at 12:00 PM with incoming Diamond VIP guests at 14:00. Reallocate staff to clear backlog.",
    icon: Zap,
  },
];

export default function MultiAgentHubPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OrchestratorResult | null>(null);
  const [activeTab, setActiveTab] = useState<"orchestrator" | "staff" | "inventory" | "thoughts" | "history">("orchestrator");
  const [actionPlan, setActionPlan] = useState<OrchestratedActionItem[]>([]);
  const [approvedPOs, setApprovedPOs] = useState<Record<string, boolean>>({});
  const [dbRuns, setDbRuns] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchDbRuns = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/ai/agents?limit=15");
      const json = await res.json();
      if (json.success && json.runs) {
        setDbRuns(json.runs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const runOrchestrator = async (customPrompt?: string) => {
    const textToRun = customPrompt || prompt || SCENARIOS[0].prompt;
    setLoading(true);

    try {
      const res = await fetch("/api/ai/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToRun, agentType: "orchestrator" }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setActionPlan(json.data.coordinatedActionPlan);
        fetchDbRuns();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runOrchestrator(SCENARIOS[0].prompt);
    fetchDbRuns();

    const interval = setInterval(() => {
      fetchDbRuns();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAction = (id: string) => {
    setActionPlan(prev => prev.map(a => a.id === id ? { ...a, executed: !a.executed } : a));
  };

  const approvePO = (poNumber: string) => {
    setApprovedPOs(prev => ({ ...prev, [poNumber]: true }));
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Multi-Agent Gen AI Command Center" 
        description="Autonomous coordination across Staff Scheduling, Inventory Management, and Master Orchestration Agents" 
        icon={Brain} 
        badge="Autonomous Gen AI"
      />

      {/* Live Database Real-Time Stream Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-surface-900 to-ai-DEFAULT/10 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Database className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Live Real-Time Database Connection</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE SYNC
              </span>
            </div>
            <p className="text-[11px] text-white/60 mt-0.5">
              Agents fetch live records from PMS database (Rooms, Staff, Inventory, Bookings), process in parallel, and automatically store execution results in the <code className="text-ai-light">agent_runs</code> table.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-white/80">
            Live Occ: <strong className="text-emerald-300 font-mono">{data?.liveOccupancyPct ?? 51}%</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-white/80">
            Rooms: <strong className="text-brand-300 font-mono">{data?.liveRoomCount ?? 160}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-white/80">
            Active Staff: <strong className="text-ai-light font-mono">{data?.staffResults?.totalStaffActive ?? 7}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-white/80">
            Persisted Runs: <strong className="text-amber-300 font-mono">{dbRuns.length}</strong>
          </div>
        </div>
      </div>

      {/* Top 3 Agent Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5 border-ai-DEFAULT/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-ai-DEFAULT/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-ai-DEFAULT/20 flex items-center justify-center border border-ai-DEFAULT/40">
              <Brain className="w-5 h-5 text-ai-light" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-ai-DEFAULT/20 text-ai-light border border-ai-DEFAULT/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-ai-light animate-pulse" />
              Master Agent
            </span>
          </div>
          <h3 className="text-base font-display font-bold text-white">Orchestrator Agent</h3>
          <p className="text-white/50 text-xs mt-1">Multi-agent meta-reasoning, goal decomposition & conflict resolution</p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-white/40">Sub-Agents Managed:</span>
            <span className="text-ai-light font-bold">2 Active</span>
          </div>
        </div>

        <div className="glass-card p-5 border-emerald-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
              <Users className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Domain Agent
            </span>
          </div>
          <h3 className="text-base font-display font-bold text-white">Staff Scheduling Agent</h3>
          <p className="text-white/50 text-xs mt-1">Real-time workforce rebalancing, skill matching & shift optimization</p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-white/40">Turnaround Acceleration:</span>
            <span className="text-emerald-400 font-bold">+42% Speed</span>
          </div>
        </div>

        <div className="glass-card p-5 border-amber-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/40">
              <Package className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Domain Agent
            </span>
          </div>
          <h3 className="text-base font-display font-bold text-white">Inventory Management Agent</h3>
          <p className="text-white/50 text-xs mt-1">Predictive stock depletion, lead-time modeling & automated PO drafting</p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-white/40">Stock-out Risk:</span>
            <span className="text-emerald-400 font-bold">0% (Mitigated)</span>
          </div>
        </div>
      </div>

      {/* Multi-Agent Interactive Prompt Console */}
      <div className="glass-card p-6 mb-6 space-y-4 border-white/15 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-ai-light" />
            <h2 className="text-base font-display font-bold text-white">Gen AI Multi-Agent Prompt Directive</h2>
          </div>
          <span className="text-xs text-white/40">Type a scenario or click a preset below</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runOrchestrator()}
            placeholder="e.g., Heavy rain forecast with 98% occupancy: optimize staff rebalancing and draft POs..."
            className="input bg-white/10 border-white/20 text-white placeholder:text-white/40 flex-1 py-3"
          />
          <button
            onClick={() => runOrchestrator()}
            disabled={loading}
            className="btn-ai py-3 px-6 text-sm font-semibold flex items-center justify-center gap-2 whitespace-nowrap shadow-glow-ai"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Orchestrating Agents...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Run Autonomous Agents</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs text-white/40 font-medium">Quick Scenarios:</span>
          {SCENARIOS.map((sc) => (
            <button
              key={sc.label}
              onClick={() => {
                setPrompt(sc.prompt);
                runOrchestrator(sc.prompt);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
            >
              <sc.icon className="w-3.5 h-3.5 text-brand-400" />
              <span>{sc.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Results View */}
      {data && (
        <div className="space-y-6">
          {/* Executive Strategy Banner */}
          <div className="glass-card p-6 border-ai-DEFAULT/40 bg-gradient-to-br from-ai-DEFAULT/15 via-surface-900 to-surface-950">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ai-DEFAULT/20 text-ai-light border border-ai-DEFAULT/30 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Orchestrated Multi-Agent Strategy
                </div>
                <h3 className="text-xl font-display font-bold text-white">{data.scenarioTitle}</h3>
                <p className="text-white/70 text-sm mt-1 max-w-3xl leading-relaxed">{data.overallStrategy}</p>
              </div>

              <div className="flex items-center gap-3 self-start lg:self-center">
                <div className="glass-card px-4 py-2.5 text-center bg-black/40 border-white/10">
                  <div className="text-[10px] text-white/40 uppercase font-bold">Financial Impact</div>
                  <div className="text-base font-bold text-success-light mt-0.5">{data.estimatedFinancialImpact}</div>
                </div>
                <div className="glass-card px-4 py-2.5 text-center bg-black/40 border-white/10">
                  <div className="text-[10px] text-white/40 uppercase font-bold">Confidence</div>
                  <div className="text-base font-bold text-ai-light mt-0.5">{(data.confidenceScore * 100).toFixed(0)}%</div>
                </div>
              </div>
            </div>

            {/* View Switching Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: "orchestrator", label: "Coordinated Action Plan", icon: GitBranch, count: actionPlan.length },
                { id: "staff", label: "Staff Scheduling Output", icon: Users, badge: "⚡ Concierge Sync" },
                { id: "inventory", label: "Inventory Forecast & POs", icon: Package, badge: "Agent 2" },
                { id: "thoughts", label: "Agent Reasoning Log", icon: Cpu, count: data.chainOfThought.length },
                { id: "history", label: "DB Persisted Runs", icon: Database, count: dbRuns.length },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200",
                      isActive
                        ? "bg-white/20 text-white border border-white/30 shadow-lg shadow-black/40"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    )}
                  >
                    <Icon className="w-4 h-4 text-brand-400" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/90">
                        {tab.count}
                      </span>
                    )}
                    {tab.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-ai-DEFAULT/20 text-ai-light border border-ai-DEFAULT/30">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: Coordinated Action Plan */}
          {activeTab === "orchestrator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Action items */}
              <div className="lg:col-span-7 glass-card p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Orchestrated Actions Checklist</span>
                  </h3>
                  <span className="text-xs text-white/50">
                    {actionPlan.filter(a => a.executed).length} of {actionPlan.length} Executed
                  </span>
                </div>

                <div className="space-y-3">
                  {actionPlan.map((action) => (
                    <div
                      key={action.id}
                      className={cn(
                        "p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3",
                        action.executed 
                          ? "bg-emerald-950/20 border-emerald-500/30" 
                          : "bg-surface-900/60 border-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => toggleAction(action.id)}
                          className={cn(
                            "w-6 h-6 rounded-lg border flex items-center justify-center mt-0.5 transition-all",
                            action.executed 
                              ? "bg-emerald-500 border-emerald-400 text-white" 
                              : "border-white/30 text-transparent hover:border-white/60"
                          )}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-white">{action.title}</span>
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                              action.priority === "CRITICAL" ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            )}>
                              {action.priority}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/60">
                              By {action.agentOwner}
                            </span>
                          </div>
                          <p className="text-xs text-white/60 mt-1">Impact: <strong className="text-emerald-300">{action.impact}</strong></p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleAction(action.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                          action.executed 
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                            : "btn-primary"
                        )}
                      >
                        {action.executed ? "Executed ✓" : "Execute Now"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-Agent Delegation Flow Graph */}
              <div className="lg:col-span-5 glass-card p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-ai-light" />
                    <span>Agent Delegation DAG</span>
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-ai-DEFAULT/20 text-ai-light font-bold">
                    Parallel DAG
                  </span>
                </div>

                <div className="space-y-3">
                  {data.subAgentDelegationSteps.map((step, idx) => (
                    <div key={step.id} className="p-3.5 rounded-xl bg-surface-900/80 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white/40">{step.id}</span>
                          <span className="text-xs font-bold text-white">{step.targetAgent}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                          {step.status} in {step.executionTimeMs}ms
                        </span>
                      </div>
                      <p className="text-xs text-white/70">{step.goal}</p>
                      <div className="text-[11px] text-emerald-300/90 font-mono bg-black/30 p-2 rounded-lg border border-white/5">
                        ↳ Output: {step.outputSnippet}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Staff Scheduling Output */}
          {activeTab === "staff" && (
            <div className="space-y-6">
              {/* Synchronized AI Concierge Guest Requests & Dispatches (HERO SECTION AT TOP) */}
              <div className="glass-card p-6 space-y-4 border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-surface-900 to-surface-950 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-glow-ai">
                      <Send className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-display font-bold text-white">
                          Live Synchronized AI Concierge Guest Requests
                        </h3>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                          LIVE CONCIERGE SYNC (3s)
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">
                        Every help request raised by guests in AI Concierge is automatically assigned to on-duty staff by StaffSchedulingAgent and streamed live below.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                      {dbRuns.filter((r) => (r.triggeredBy === "GUEST_CONCIERGE" || r.prompt.includes("Guest Complaint")) && !r.prompt.includes("Monsoon") && !r.prompt.includes("Optimize staff")).length} Guest Requests Dispatched
                    </span>
                  </div>
                </div>

                {dbRuns.filter((r) => (r.triggeredBy === "GUEST_CONCIERGE" || r.prompt.includes("Guest Complaint")) && !r.prompt.includes("Monsoon") && !r.prompt.includes("Optimize staff")).length === 0 ? (
                  <div className="p-8 text-center text-white/40 text-sm glass-card bg-black/20">
                    No active guest requests recorded yet. When guests type requests like &quot;Plumbing leak in bathroom&quot; or &quot;Need room cleaning&quot; in their AI Concierge, StaffSchedulingAgent dispatches will immediately stream here live.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dbRuns
                      .filter((r) => (r.triggeredBy === "GUEST_CONCIERGE" || r.prompt.includes("Guest Complaint")) && !r.prompt.includes("Monsoon") && !r.prompt.includes("Optimize staff"))
                      .map((run) => {
                        let parsed: any = {};
                        try { parsed = JSON.parse(run.resultJson || "{}"); } catch {}
                        return (
                          <div
                            key={run.id}
                            className="p-4 rounded-2xl bg-surface-900/90 border border-emerald-500/30 hover:border-emerald-400/60 transition-all space-y-3 shadow-lg"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                                  {parsed.ticketId ? `#${parsed.ticketId}` : "#DISPATCH"}
                                </span>
                                <span className="text-sm font-bold text-white">
                                  {parsed.category || "Staff Dispatch Request"}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-white/70">
                                  By StaffSchedulingAgent
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-white/50">ETA: <strong className="text-amber-300 font-mono text-sm">{parsed.estimatedArrivalMinutes || 7} min</strong></span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  DISPATCHED & ASSIGNED
                                </span>
                              </div>
                            </div>

                            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white/90 leading-relaxed">
                              <span className="text-white/40 font-bold mr-2">GUEST REQUEST:</span>
                              &quot;{run.prompt.replace("Guest Complaint Dispatch: ", "").replace(/"/g, "")}&quot;
                            </div>

                            <div className="flex items-center justify-between text-xs text-white/60 flex-wrap gap-2 pt-1 border-t border-white/5">
                              <div className="flex items-center gap-2">
                                <span>Assigned On-Duty Staff:</span>
                                <strong className="text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  {parsed.assignedStaff || "On-Duty Staff"} ({parsed.department || "Staff"})
                                </strong>
                              </div>
                              <span className="font-mono text-[11px] text-white/40">
                                Recorded: {new Date(run.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Bottlenecks & Reallocations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning-light" />
                    <span>Bottlenecks Detected by StaffSchedulingAgent</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-white/70">
                    {data.staffResults.bottlenecksIdentified.map((b, i) => (
                      <li key={i} className="p-2.5 rounded-xl bg-black/20 border border-white/5 flex items-start gap-2">
                        <span className="text-warning-light">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-card p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Cross-Department Reallocations Generated</span>
                  </h3>
                  <div className="space-y-2">
                    {data.staffResults.reallocations.map((r, i) => (
                      <div key={i} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
                        <div className="flex items-center justify-between text-white font-bold">
                          <span>{r.staffName}</span>
                          <span className="text-emerald-400">{r.duration}</span>
                        </div>
                        <div className="text-white/60">{r.fromDept} ➔ <strong className="text-white">{r.toDept}</strong></div>
                        <div className="text-[11px] text-emerald-300/80 mt-1">Impact: {r.expectedImpact}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Roster Table */}
              <div className="glass-card p-5 space-y-4">
                <h3 className="text-base font-display font-bold text-white">Synthesized Shift Assignments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.staffResults.optimizedRoster.map((item) => (
                    <div key={item.staffId} className="p-4 rounded-xl bg-surface-900/70 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-white">{item.name}</div>
                          <div className="text-xs text-white/50">{item.department} • {item.shift}</div>
                        </div>
                        <span className="text-xs text-emerald-400 font-semibold">{item.workload}% Load</span>
                      </div>
                      <div className="text-xs text-white/70">Zone: <strong className="text-white">{item.assignedZone}</strong></div>
                      <div className="text-[11px] text-white/40 font-mono">Reason: {item.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Inventory Forecast & POs */}
          {activeTab === "inventory" && (
            <div className="space-y-6">

              {/* ── Hero: Inventory Staff Approved Requests (Live) ── */}
              <InventoryApprovedFeed />

              {/* Draft POs */}
              <div className="glass-card p-6 space-y-4 border-amber-500/30">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-display font-bold text-white">Autonomous Purchase Orders (Ready for Approval)</h3>
                  </div>
                  <span className="text-xs text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full font-bold">
                    {data.inventoryResults.purchaseOrdersToApprove.length} Draft POs
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.inventoryResults.purchaseOrdersToApprove.map((po) => {
                    const isApproved = approvedPOs[po.poNumber];
                    return (
                      <div key={po.poNumber} className="p-4 rounded-2xl bg-surface-900/80 border border-white/10 space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-amber-300 font-bold">{po.poNumber}</span>
                            <span className="text-sm font-bold text-white">₹{po.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="text-xs font-semibold text-white">{po.vendor}</div>
                          <p className="text-xs text-white/70 font-medium">{po.items}</p>
                          <div className="text-[11px] text-white/50 pt-1">Lead Time: {po.leadTimeDays} Day(s) • {po.aiJustification}</div>
                        </div>

                        <button
                          onClick={() => approvePO(po.poNumber)}
                          className={cn(
                            "w-full py-2.5 rounded-xl text-xs font-semibold transition-all mt-2",
                            isApproved 
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                              : "bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-500 hover:to-yellow-500 shadow-md"
                          )}
                        >
                          {isApproved ? "Approved & Dispatched to Supplier ✓" : "1-Click Approve & Send PO"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inventory Forecast Table */}
              <div className="glass-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                    Predictive Stock Depletion Engine
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                      CONNECTED TO INVENTORY STAFF TAB
                    </span>
                  </h3>
                  <Link
                    href="/operations/inventory-staff"
                    className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-all"
                  >
                    Inventory Staff Portal <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.inventoryResults.forecastItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-surface-900/80 border border-white/10 space-y-2 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{item.name}</span>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full",
                            item.stockoutRisk === "CRITICAL" ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-emerald-500/20 text-emerald-300"
                          )}>
                            {item.stockoutRisk}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {item.currentStock} <span className="text-xs text-white/40 font-normal">{item.unit}</span>
                        </div>
                        <div className="text-xs text-white/60">
                          Days Remaining: <strong className="text-amber-300">{item.daysRemaining} days</strong>
                        </div>
                        <div className="text-[11px] text-white/40">
                          Recommended Reorder: {item.recommendedOrder} {item.unit} (₹{item.estimatedCost.toLocaleString()})
                        </div>
                      </div>

                      {item.stockoutRisk === "CRITICAL" && (
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between mt-2">
                          <span className="text-[10px] text-red-300 font-mono flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
                            Auto-Raised to Staff
                          </span>
                          <Link
                            href="/operations/inventory-staff"
                            className="text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-0.5"
                          >
                            Review & Approve ➔
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Agent Reasoning Log */}
          {activeTab === "thoughts" && (
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-ai-light" />
                  <h3 className="text-base font-display font-bold text-white">Multi-Agent Chain-of-Thought Stream</h3>
                </div>
                <span className="text-xs text-white/40">{data.chainOfThought.length} Reasoning Traces</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {data.chainOfThought.map((thought, i) => (
                  <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-ai-light font-bold">[{thought.agent}] ➔ Step {thought.step}: {thought.action}</span>
                      <span className="text-[10px] text-white/40">{thought.timestamp}</span>
                    </div>
                    <p className="text-white/80 leading-relaxed font-sans text-xs">
                      {thought.thought}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Database Persisted Runs (agent_runs table) */}
          {activeTab === "history" && (
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-display font-bold text-white">Database Persisted Runs (agent_runs table)</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchDbRuns}
                    disabled={loadingHistory}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5", loadingHistory && "animate-spin")} />
                    <span>Refresh DB</span>
                  </button>
                  <span className="text-xs text-white/40 font-mono">{dbRuns.length} Records Stored</span>
                </div>
              </div>

              {dbRuns.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm">
                  {loadingHistory ? "Querying database..." : "No persisted agent runs yet. Run an autonomous directive above to persist."}
                </div>
              ) : (
                <div className="space-y-3">
                  {dbRuns.map((run) => (
                    <div
                      key={run.id}
                      className="p-4 rounded-xl bg-surface-900/80 border border-white/10 hover:border-white/20 transition-all space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            {run.agentName}
                          </span>
                          <span className="text-xs text-white/50">{run.agentRole}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono text-[11px] text-ai-light">
                            {Math.round(run.confidence * 100)}% Conf
                          </span>
                          <span className="text-white/30">•</span>
                          <span className="font-mono text-[11px] text-amber-300">
                            {run.durationMs}ms
                          </span>
                          <span className="text-white/30">•</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {run.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-white/80 font-medium">
                        <span className="text-white/40 mr-1.5">Directive:</span>
                        &quot;{run.prompt}&quot;
                      </div>

                      <p className="text-xs text-white/60 bg-black/30 p-2.5 rounded-lg leading-relaxed">
                        {run.summary}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-white/40 pt-1 border-t border-white/5">
                        <span>Triggered by: <code className="text-white/70">{run.triggeredBy}</code></span>
                        <span>{new Date(run.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
