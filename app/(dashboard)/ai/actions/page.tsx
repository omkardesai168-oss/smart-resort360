"use client";

import { useEffect, useState } from "react";
import { Sparkles, Check, X, Clock, AlertCircle } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { formatINR } from "@/lib/utils";

interface Rec { id: string; type: string; title: string; description: string; reasoning: string; expectedImpact: string; impactValue: number; priority: number; }

export default function ActionsPage() {
  const [recs, setRecs] = useState<Rec[]>([]);
  useEffect(() => {
    fetch("/api/dashboard/kpis").then((r) => r.json()).then((d) => setRecs(d.aiRecommendations || []));
  }, []);

  const grouped = {
    CRITICAL: recs.filter((r) => r.priority <= 2).sort((a, b) => a.priority - b.priority),
    HIGH: recs.filter((r) => r.priority === 3),
    MEDIUM: recs.filter((r) => r.priority >= 4),
  };

  return (
    <PageContainer>
      <PageHeader title="Next Best Actions" description="AI-prioritized recommendations across all operations" icon={Sparkles} badge="AI" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="kpi-card border-danger-DEFAULT/30"><div className="metric-label">Critical Priority</div><div className="metric-value text-danger-light">{grouped.CRITICAL.length}</div></div>
        <div className="kpi-card border-warning-DEFAULT/30"><div className="metric-label">High Priority</div><div className="metric-value text-warning-light">{grouped.HIGH.length}</div></div>
        <div className="kpi-card border-brand-500/30"><div className="metric-label">Total Value</div><div className="metric-value text-success-light">{formatINR(recs.reduce((s, r) => s + (r.impactValue || 0), 0))}</div></div>
      </div>

      {(["CRITICAL", "HIGH", "MEDIUM"] as const).map((level) => (
        grouped[level].length > 0 && (
          <div key={level} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className={`w-4 h-4 ${level === "CRITICAL" ? "text-danger-light" : level === "HIGH" ? "text-warning-light" : "text-brand-400"}`} />
              <span className="text-white font-semibold text-sm">{level} PRIORITY</span>
              <span className="text-white/40 text-xs">({grouped[level].length})</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {grouped[level].map((r) => (
                <div key={r.id} className="glass-card p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">{r.type}</span>
                        <span className="badge-blue text-[9px]">P{r.priority}</span>
                      </div>
                      <div className="text-white font-semibold mt-1.5">{r.title}</div>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">{r.description}</p>
                  <div className="mt-2 text-xs text-white/50">
                    <span className="text-ai-light font-medium">Reasoning:</span> {r.reasoning}
                  </div>
                  <div className="mt-2 flex items-center justify-between glass-card p-2">
                    <span className="text-white/60 text-xs flex items-center gap-1"><Sparkles className="w-3 h-3 text-ai-light" /> Expected Impact</span>
                    <span className="text-success-light text-sm font-semibold">{r.expectedImpact}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="btn-success flex-1 text-xs"><Check className="w-3.5 h-3.5" /> Approve</button>
                    <button className="btn-secondary text-xs"><Clock className="w-3.5 h-3.5" /> Snooze</button>
                    <button className="btn-danger text-xs"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      {recs.length === 0 && <div className="glass-card p-12 text-center text-white/40">No pending recommendations. AI is monitoring... ✨</div>}
    </PageContainer>
  );
}
