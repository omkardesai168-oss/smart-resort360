"use client";

import { useEffect, useState } from "react";
import { Wrench, AlertTriangle, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { cn, timeAgo } from "@/lib/utils";

interface Asset { id: string; assetId: string; name: string; category: string; location: string; healthScore: number; failureProbability: number; criticalityLevel: string; status: string; openWorkOrders: number; estimatedFailure: string; }
interface WorkOrder { id: string; title: string; description: string; type: string; priority: string; status: string; estimatedHours: number; createdAt: string; }

export default function MaintenancePage() {
  const [data, setData] = useState<{ assets: Asset[]; workOrders: WorkOrder[] } | null>(null);

  useEffect(() => {
    fetch("/api/maintenance").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return <PageContainer><div className="space-y-4"><div className="h-20 shimmer rounded-2xl" /><div className="h-96 shimmer rounded-2xl" /></div></PageContainer>;
  }

  const critical = data.assets.filter((a) => a.failureProbability > 0.3).length;
  const degraded = data.assets.filter((a) => a.status === "DEGRADED").length;
  const open = data.workOrders.filter((w) => w.status !== "COMPLETED").length;

  return (
    <PageContainer>
      <PageHeader title="Maintenance & Assets" description="Predictive asset health and work order management" icon={Wrench} badge="AI" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="kpi-card"><div className="metric-label">Total Assets</div><div className="metric-value">{data.assets.length}</div></div>
        <div className="kpi-card"><div className="metric-label">Critical Risk</div><div className="metric-value text-danger-light">{critical}</div></div>
        <div className="kpi-card"><div className="metric-label">Degraded</div><div className="metric-value text-warning-light">{degraded}</div></div>
        <div className="kpi-card"><div className="metric-label">Open Work Orders</div><div className="metric-value text-brand-400">{open}</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-5">
          <div className="section-header mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-ai-light" /> Predictive Asset Health</div>
          <div className="space-y-2.5 max-h-96 overflow-y-auto">
            {data.assets.map((a) => (
              <div key={a.id} className="glass-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{a.name}</span>
                      {a.criticalityLevel === "CRITICAL" && <span className="badge-red text-[9px]">CRITICAL</span>}
                    </div>
                    <div className="text-white/40 text-xs mt-0.5">{a.category} • {a.location}</div>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-lg font-bold", a.healthScore > 80 ? "text-success-light" : a.healthScore > 60 ? "text-warning-light" : "text-danger-light")}>
                      {a.healthScore.toFixed(0)}%
                    </div>
                    <div className="text-white/40 text-[10px]">health</div>
                  </div>
                </div>
                <div className="mt-2 progress-bar">
                  <div className={cn("h-full rounded-full", a.healthScore > 80 ? "bg-success-gradient" : a.healthScore > 60 ? "bg-gradient-to-r from-warning-DEFAULT to-accent-500" : "bg-danger-gradient")} style={{ width: `${a.healthScore}%` }} />
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px]">
                  <span className="text-white/50">Failure: <span className={cn("font-semibold", a.failureProbability > 0.3 ? "text-danger-light" : a.failureProbability > 0.15 ? "text-warning-light" : "text-white/60")}>{(a.failureProbability * 100).toFixed(0)}%</span></span>
                  <span className="text-white/50">ETA: <span className="text-white/80 font-medium">{a.estimatedFailure}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="section-header mb-3 flex items-center gap-2"><Wrench className="w-4 h-4 text-warning-light" /> Active Work Orders</div>
          <div className="space-y-2.5 max-h-96 overflow-y-auto">
            {data.workOrders.map((w) => (
              <div key={w.id} className="glass-card p-3 border-l-4" style={{ borderColor: w.priority === "CRITICAL" ? "#ef4444" : w.priority === "HIGH" ? "#f59e0b" : "#6366f1" }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold">{w.title}</div>
                    <div className="text-white/50 text-xs mt-0.5 line-clamp-2">{w.description}</div>
                  </div>
                  <span className={cn(w.priority === "CRITICAL" ? "badge-red" : w.priority === "HIGH" ? "badge-yellow" : "badge-blue")}>{w.priority}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-white/50">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(w.createdAt)}</span>
                  <span>•</span>
                  <span>{w.type}</span>
                  <span>•</span>
                  <span>{w.estimatedHours}h est.</span>
                  <span className="ml-auto"><span className={cn(w.status === "IN_PROGRESS" ? "badge-blue" : "badge-yellow")}>{w.status.replace("_", " ")}</span></span>
                </div>
              </div>
            ))}
            {data.workOrders.length === 0 && <div className="text-white/30 text-sm text-center py-6">No active work orders ✨</div>}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="section-header mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning-light" /> AI Cost-Benefit Analysis</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="glass-card p-3 border-success-DEFAULT/30">
            <div className="text-success-light text-xs font-semibold">PREVENT NOW</div>
            <div className="text-white text-2xl font-bold my-1">₹1.1L</div>
            <div className="text-white/50 text-xs">Total PM cost for 3 at-risk assets</div>
          </div>
          <div className="glass-card p-3 border-danger-DEFAULT/30">
            <div className="text-danger-light text-xs font-semibold">IF IGNORED</div>
            <div className="text-white text-2xl font-bold my-1">₹8.4L</div>
            <div className="text-white/50 text-xs">Estimated emergency repair + revenue loss</div>
          </div>
          <div className="glass-card p-3 border-ai-DEFAULT/30">
            <div className="text-ai-light text-xs font-semibold">SAVINGS</div>
            <div className="text-white text-2xl font-bold my-1">₹7.3L</div>
            <div className="text-white/50 text-xs">Net benefit (87% ROI)</div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
