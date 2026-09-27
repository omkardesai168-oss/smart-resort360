"use client";

import { Shield, Lock, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

const ALERTS = [
  { type: "Unusual Login", severity: "WARNING", detail: "manager@azurehills.com login from new device (Mumbai)", time: "12m ago", status: "INVESTIGATING" },
  { type: "Payment Anomaly", severity: "CRITICAL", detail: "Booking #2847 — Card velocity check failed (3 attempts/hour)", time: "34m ago", status: "BLOCKED" },
  { type: "Rate Manipulation", severity: "INFO", detail: "Bot detected: 47 scraper hits to /rooms endpoint in 60s", time: "1h ago", status: "RATE_LIMITED" },
  { type: "Account Takeover Risk", severity: "WARNING", detail: "Guest #1042 — Password reset + booking cancellation in 5 min", time: "2h ago", status: "VERIFIED" },
];

const SCORE = { overall: 96, components: [{ name: "Auth Security", score: 98 }, { name: "Payment Integrity", score: 99 }, { name: "Bot Protection", score: 91 }, { name: "Data Privacy", score: 95 }, { name: "API Security", score: 97 }] };

export default function FraudPage() {
  return (
    <PageContainer>
      <PageHeader title="Fraud Detection" description="Real-time security monitoring and threat prevention" icon={Shield} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="kpi-card"><div className="metric-label">Security Score</div><div className="metric-value text-success-light">{SCORE.overall}/100</div></div>
        <div className="kpi-card"><div className="metric-label">Threats Blocked (24h)</div><div className="metric-value text-brand-400">142</div></div>
        <div className="kpi-card"><div className="metric-label">Active Investigations</div><div className="metric-value text-warning-light">1</div></div>
        <div className="kpi-card"><div className="metric-label">Avg Response</div><div className="metric-value">2.4m</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5">
          <div className="section-header mb-3">Security Components</div>
          <div className="space-y-3">
            {SCORE.components.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-white/80">{c.name}</span>
                  <span className="text-success-light font-bold">{c.score}</span>
                </div>
                <div className="progress-bar"><div className="progress-fill bg-success-gradient" style={{ width: `${c.score}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 lg:col-span-2">
          <div className="section-header mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning-light" /> Security Events</div>
          <div className="space-y-2">
            {ALERTS.map((a, i) => (
              <div key={i} className={`glass-card p-3 border-l-4 ${a.severity === "CRITICAL" ? "border-danger-DEFAULT" : a.severity === "WARNING" ? "border-warning-DEFAULT" : "border-brand-500"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-sm">{a.type}</span>
                      <span className={a.severity === "CRITICAL" ? "badge-red" : a.severity === "WARNING" ? "badge-yellow" : "badge-blue"}>{a.severity}</span>
                    </div>
                    <div className="text-white/70 text-sm mt-1">{a.detail}</div>
                    <div className="text-white/40 text-xs mt-1">{a.time}</div>
                  </div>
                  <span className={a.status === "BLOCKED" ? "badge-red" : a.status === "VERIFIED" ? "badge-green" : "badge-yellow"}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
