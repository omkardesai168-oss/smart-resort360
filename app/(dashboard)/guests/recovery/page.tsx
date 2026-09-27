"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Activity, AlertCircle, CheckCircle2, Clock, Sparkles, MessageSquare } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { cn } from "@/lib/utils";

const FRICTION = [
  { name: "Rahul Sharma", room: "412", score: 87, issue: "AC not cooling, 18 min unresolved", priority: "CRITICAL", tier: "DIAMOND" },
  { name: "Priya Kapoor", room: "V03", score: 74, issue: "Room change requested, pending", priority: "HIGH", tier: "PLATINUM" },
  { name: "James Thompson", room: "305", score: 68, issue: "Late checkout denied", priority: "MEDIUM", tier: "GOLD" },
  { name: "Sarah Mitchell", room: "208", score: 71, issue: "Pool towel shortage, 2nd complaint", priority: "HIGH", tier: "PLATINUM" },
];

const RECOVERIES = [
  { guest: "Rahul Sharma", action: "Manager intervention + complimentary upgrade", status: "IN_PROGRESS", time: "12 min ago", impact: "+18% satisfaction" },
  { guest: "Priya Kapoor", action: "Villa upgrade V03 → V08, butler briefing", status: "APPROVED", time: "23 min ago", impact: "+25% satisfaction" },
  { guest: "Aryan Mittal", action: "Spa voucher ₹5,000 + apology letter", status: "DELIVERED", time: "1h ago", impact: "Friction: 71→32" },
  { guest: "Meera Pillai", action: "Free breakfast + late checkout", status: "DELIVERED", time: "2h ago", impact: "Friction: 65→18" },
];

const SENTIMENT_COLORS: Record<string, string> = {
  CRITICAL: "border-danger-DEFAULT bg-danger-DEFAULT/10",
  HIGH: "border-warning-DEFAULT bg-warning-DEFAULT/10",
  MEDIUM: "border-brand-500 bg-brand-500/10",
};

export default function RecoveryPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if ((session?.user as any)?.role === "GUEST") {
      router.replace("/guests/concierge");
    }
  }, [session, router]);

  return (
    <PageContainer>
      <PageHeader title="Service Recovery" description="AI-detected friction with automatic resolution workflows" icon={Activity} badge="AI" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="kpi-card"><div className="metric-label">High Friction</div><div className="metric-value text-danger-light">{FRICTION.length}</div></div>
        <div className="kpi-card"><div className="metric-label">Recoveries (24h)</div><div className="metric-value text-success-light">12</div></div>
        <div className="kpi-card"><div className="metric-label">Avg Response</div><div className="metric-value">8m</div></div>
        <div className="kpi-card"><div className="metric-label">Recovery Rate</div><div className="metric-value text-success-light">94%</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-5">
          <div className="section-header mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-danger-light" /> High Friction Guests</div>
          <div className="space-y-2.5">
            {FRICTION.map((g) => (
              <div key={g.name} className={cn("glass-card p-3 border-l-4", SENTIMENT_COLORS[g.priority])}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-white font-semibold text-sm flex items-center gap-2">
                      {g.name}
                      <span className="text-xs text-purple-300 font-normal">{g.tier}</span>
                    </div>
                    <div className="text-white/50 text-xs mt-0.5">Room {g.room}</div>
                    <div className="text-white/80 text-xs mt-1.5">{g.issue}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-danger-light font-bold text-2xl">{g.score}</div>
                    <div className="text-white/40 text-[10px]">friction</div>
                  </div>
                </div>
                <button className="btn-primary w-full mt-3 text-xs">Execute Recovery</button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="section-header mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-ai-light" /> Active Recovery Workflows</div>
          <div className="space-y-2.5">
            {RECOVERIES.map((r) => (
              <div key={r.guest} className="glass-card p-3">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="text-white font-semibold text-sm">{r.guest}</div>
                  <span className={cn(r.status === "DELIVERED" ? "badge-green" : r.status === "APPROVED" ? "badge-blue" : "badge-yellow")}>{r.status}</span>
                </div>
                <div className="text-white/70 text-sm">{r.action}</div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" /> {r.time}</span>
                  <span className="text-success-light font-medium">{r.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="section-header mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-brand-400" /> AI Recovery Engine</div>
        <div className="text-sm text-white/70 space-y-2">
          <p>The AI engine continuously monitors guest interactions across WhatsApp, app, in-person, and phone channels. It assigns a friction score (0-100) based on:</p>
          <ul className="space-y-1 pl-5 list-disc text-white/60">
            <li>Unresolved complaint duration (10 pts per 5 min)</li>
            <li>Sentiment drop in messages (-15 pts per negative shift)</li>
            <li>Service request count (5 pts per request)</li>
            <li>VIP status (2x multiplier)</li>
            <li>Property damage / safety concerns (immediate CRITICAL)</li>
          </ul>
          <p className="text-white/50 text-xs mt-3">When friction exceeds 80, an automatic service recovery workflow is triggered and a duty manager is paged.</p>
        </div>
      </div>
    </PageContainer>
  );
}
