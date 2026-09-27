"use client";

import { DollarSign, Sparkles, TrendingUp, CheckCircle2, X, Sliders, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { cn, formatINR } from "@/lib/utils";

const PRICING = [
  { type: "STANDARD", current: 8500, recommended: 7800, change: -8.2, reason: "Occupancy 12% below target. Price elasticity analysis suggests 8% reduction drives +15% bookings.", impact: 65000, status: "PENDING", confidence: 0.78 },
  { type: "PREMIUM", current: 15500, recommended: 17200, change: 11, reason: "Booking pace 18% above forecast. Only 4 remaining this weekend. Competitor rates up ₹1,200.", impact: 180000, status: "PENDING", confidence: 0.87 },
  { type: "SUITE", current: 22000, recommended: 24500, change: 11.4, reason: "Festival season. 3 suites left. High demand from corporate segment.", impact: 210000, status: "PENDING", confidence: 0.91 },
  { type: "VILLA", current: 35000, recommended: 38500, change: 10, reason: "Anniversary season. Luxury segment strong. 4 villas booked in 24h.", impact: 308000, status: "APPROVED", confidence: 0.83 },
];

export default function PricingPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dynamic Pricing"
        description="AI-recommended rate adjustments with revenue impact"
        icon={DollarSign}
        badge="AI"
        actions={
          <Link
            href="/operations/revenue-simulator"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-ai-DEFAULT text-white text-xs font-semibold shadow-glow-brand hover:brightness-110 transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Launch Occupancy Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="kpi-card"><div className="metric-label">Active Recommendations</div><div className="metric-value">{PRICING.length}</div></div>
        <div className="kpi-card"><div className="metric-label">Total Opportunity</div><div className="metric-value text-success-light">{formatINR(PRICING.reduce((s, p) => s + p.impact, 0))}</div></div>
        <div className="kpi-card"><div className="metric-label">Avg Confidence</div><div className="metric-value text-ai-light">85%</div></div>
        <div className="kpi-card"><div className="metric-label">Approval Rate (30d)</div><div className="metric-value text-success-light">78%</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {PRICING.map((p) => (
          <div key={p.type} className="glass-card p-5 relative overflow-hidden">
            {p.status === "APPROVED" && <div className="absolute top-0 right-0 bg-success-DEFAULT text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">APPROVED</div>}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-white/40 text-xs uppercase">{p.type} Room</div>
                <div className="text-2xl font-display font-bold text-white mt-1">₹{p.recommended.toLocaleString()}</div>
                <div className="text-white/40 text-sm line-through">₹{p.current.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className={cn("text-3xl font-display font-bold", p.change > 0 ? "text-success-light" : "text-danger-light")}>
                  {p.change > 0 ? "+" : ""}{p.change.toFixed(1)}%
                </div>
                <div className="text-white/40 text-xs">change</div>
              </div>
            </div>
            <div className="text-white/70 text-sm mb-3">{p.reason}</div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="glass-card p-2 text-center">
                <div className="text-white/40">Confidence</div>
                <div className="text-ai-light font-bold">{(p.confidence * 100).toFixed(0)}%</div>
              </div>
              <div className="glass-card p-2 text-center">
                <div className="text-white/40">Impact</div>
                <div className="text-success-light font-bold">+{formatINR(p.impact)}</div>
              </div>
            </div>
            {p.status === "PENDING" && (
              <div className="flex gap-2">
                <button className="btn-success flex-1 text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Approve</button>
                <button className="btn-secondary text-xs"><X className="w-3.5 h-3.5" /> Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card p-5 mt-4">
        <div className="section-header mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-ai-light" /> Pricing Engine</div>
        <div className="text-sm text-white/70 space-y-2">
          <p>Our AI pricing engine considers 14 variables including:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-5 list-disc text-white/60">
            <li>Booking pace (vs. same period last year)</li>
            <li>Competitor rates (scraped hourly)</li>
            <li>Day-of-week & seasonality patterns</li>
            <li>Local events & weather forecast</li>
            <li>Guest segment mix & price elasticity</li>
            <li>Length-of-stay discounts</li>
            <li>Channel-specific margin optimization</li>
            <li>Inventory remaining vs. forecast</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}
