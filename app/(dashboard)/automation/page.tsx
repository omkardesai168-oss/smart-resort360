"use client";

import { Workflow, Play, Pause, CheckCircle2, Sparkles } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

const RULES = [
  { name: "High Occupancy Response", description: "When occupancy > 90%, auto-adjust staffing and notify revenue manager", trigger: "Occupancy > 90%", actions: ["Notify Revenue Manager", "Increase HK capacity 20%", "Auto-increase inventory orders"], triggered: 14, isActive: true },
  { name: "Guest Friction Alert", description: "When guest friction score > 80, immediately notify concierge and create recovery task", trigger: "Friction > 80", actions: ["Page Concierge", "Create recovery task", "Auto room upgrade if available"], triggered: 7, isActive: true },
  { name: "VIP Arrival Preparation", description: "When VIP check-in within 2 hours, prepare room and assign butler", trigger: "VIP check-in in 2h", actions: ["Priority HK inspection", "Assign butler", "Welcome amenity prep", "Notify manager"], triggered: 23, isActive: true },
  { name: "Rain Weather Response", description: "When rain probability > 70%, reallocate staff and adjust guest comms", trigger: "Rain prob > 70%", actions: ["Notify Ops Manager", "Move activities indoor", "Increase Spa staffing", "Guest notifications"], triggered: 6, isActive: true },
  { name: "Low Stock Alert", description: "When inventory below reorder point, auto-create purchase order", trigger: "Stock < reorder", actions: ["Create PO", "Notify Ops Manager"], triggered: 31, isActive: true },
];

export default function AutomationPage() {
  return (
    <PageContainer>
      <PageHeader title="Automation Rules" description="AI-driven workflows that run your resort" icon={Workflow} badge="AI" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="kpi-card"><div className="metric-label">Active Rules</div><div className="metric-value">{RULES.length}</div></div>
        <div className="kpi-card"><div className="metric-label">Triggers (30d)</div><div className="metric-value text-brand-400">81</div></div>
        <div className="kpi-card"><div className="metric-label">Success Rate</div><div className="metric-value text-success-light">98%</div></div>
        <div className="kpi-card"><div className="metric-label">Hours Saved</div><div className="metric-value text-ai-light">142h</div></div>
      </div>

      <div className="space-y-3">
        {RULES.map((r) => (
          <div key={r.name} className="glass-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{r.name}</span>
                  {r.isActive && <span className="badge-green text-[9px]">ACTIVE</span>}
                </div>
                <div className="text-white/60 text-sm mt-0.5">{r.description}</div>
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  <div className="glass-card px-2.5 py-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-ai-light" />
                    <span className="text-white/60">When:</span>
                    <span className="text-white font-medium">{r.trigger}</span>
                  </div>
                  <span className="text-white/30">→</span>
                  <div className="flex flex-wrap gap-1.5">
                    {r.actions.map((a) => (
                      <span key={a} className="glass-card px-2.5 py-1 text-white/70 text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-success-light" /> {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-white/40 text-xs">Triggered</div>
                <div className="text-white text-2xl font-bold">{r.triggered}</div>
                <div className="text-white/40 text-[10px]">times</div>
                <button className={`mt-2 ${r.isActive ? "btn-secondary" : "btn-success"} text-xs`}>
                  {r.isActive ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Activate</>}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
