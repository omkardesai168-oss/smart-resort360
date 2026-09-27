"use client";

import { Flame, AlertTriangle, Activity, Cloud, Zap, Shield, CheckCircle2 } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

const CRISES = [
  {
    type: "WEATHER",
    severity: "HIGH",
    title: "Monsoon Downpour & Western Ghats Mist",
    description: "Rain probability 88%. Outdoor operations impacted. Auto-mitigation plans active.",
    affected: ["Outdoor Infinity Pool", "Garden Yoga Pavilion", "Highway Pass Access Route"],
    status: "MONITORING",
    startedAt: "12m ago",
    aiActions: [
      "StaffSchedulingAgent reallocated 3 outdoor staff to Spa Pavilion",
      "Activated indoor high-tea service at Fine Dining Pavilion",
      "Pre-dispatched critical restock PO for artisan coffee & bath amenities",
      "Sent arrival travel advisory SMS to check-in guests",
    ],
  },
  {
    type: "DEMAND",
    severity: "MEDIUM",
    title: "Presidential Villa Demand Surge",
    description: "Booking velocity +340% in 2 hours following luxury travel feature. Staff notified.",
    affected: ["Presidential Villas", "VIP Concierge Desk"],
    status: "MONITORING",
    startedAt: "45m ago",
    aiActions: [
      "Dynamic Pricing engine adjusted villa tariff by +18%",
      "Housekeeping lead assigned to VIP turnaround",
    ],
  },
];

export default function CrisisPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Crisis Center"
        description="Real-time threat detection and automated response playbook coordination"
        icon={Flame}
        badge="LIVE"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 border-danger-DEFAULT/30"><div className="text-white/50 text-xs">Active Crises</div><div className="text-2xl font-bold text-danger-light">{CRISES.length}</div></div>
        <div className="glass-card p-4 border-warning-DEFAULT/30"><div className="text-white/50 text-xs">Operational Risk</div><div className="text-2xl font-bold text-warning-light">HIGH</div></div>
        <div className="glass-card p-4 border-brand-500/30"><div className="text-white/50 text-xs">AI Response Time</div><div className="text-2xl font-bold text-white">3.2m</div></div>
        <div className="glass-card p-4 border-success-DEFAULT/30"><div className="text-white/50 text-xs">Resolved (30d)</div><div className="text-2xl font-bold text-success-light">14</div></div>
      </div>

      <div className="space-y-4 mb-6">
        {CRISES.map((c, i) => (
          <div key={i} className="glass-card p-5 border-danger-DEFAULT/30 bg-surface-900/90 space-y-4">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-danger-gradient flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold text-sm">{c.title}</span>
                    <span className="badge-red">{c.severity}</span>
                    <span className="badge-yellow">{c.status}</span>
                  </div>
                  <div className="text-white/50 text-xs mt-0.5">Detected {c.startedAt} • Category: {c.type}</div>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all shadow-md">
                Execute Response Playbook
              </button>
            </div>

            <p className="text-white/80 text-xs leading-relaxed">{c.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10">
              <div>
                <div className="text-white/40 text-[10px] uppercase font-bold tracking-wider mb-2">Affected Areas</div>
                <div className="space-y-1">
                  {c.affected.map((a) => (
                    <div key={a} className="text-white/80 text-xs flex items-center gap-2 bg-black/30 p-2 rounded-xl border border-white/5">
                      <Activity className="w-3.5 h-3.5 text-danger-light" /> {a}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-white/40 text-[10px] uppercase font-bold tracking-wider mb-2">AI Auto-Mitigation Actions</div>
                <div className="space-y-1.5">
                  {c.aiActions.map((act, idx) => (
                    <div key={idx} className="text-xs text-white/90 flex items-start gap-2 bg-black/40 p-2 rounded-xl border border-white/5 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-5">
        <div className="text-base font-display font-bold text-white mb-3">Automated Crisis Response Playbooks</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          {[
            { name: "Severe Monsoon Playbook", icon: Cloud, color: "from-brand-500 to-cyan-500", steps: 8, lastTriggered: "Active Now" },
            { name: "Power Outage Playbook", icon: Zap, color: "from-amber-500 to-yellow-600", steps: 12, lastTriggered: "Never" },
            { name: "Security Protocols", icon: Shield, color: "from-red-500 to-pink-600", steps: 15, lastTriggered: "Never" },
          ].map((p) => (
            <div key={p.name} className="glass-card p-4 border-white/10 hover:border-brand-500/30 transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-3 shadow-md`}>
                <p.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-white font-bold text-xs">{p.name}</div>
              <div className="text-white/50 text-[10px] mt-1">{p.steps} automated response steps • Last: {p.lastTriggered}</div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
