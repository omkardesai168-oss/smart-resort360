"use client";

import { Megaphone, Sparkles, TrendingUp, Eye, MousePointerClick, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { formatINR } from "@/lib/utils";

const CAMPAIGNS = [
  { name: "Monsoon Spa Escape", status: "ACTIVE", sent: 2400, open: 68, click: 22, conv: 4.2, spend: 85000, revenue: 420000, channel: "WhatsApp" },
  { name: "Anniversary Package", status: "ACTIVE", sent: 680, open: 82, click: 38, conv: 12.5, spend: 25000, revenue: 312000, channel: "Email" },
  { name: "Last-Minute Villas", status: "ACTIVE", sent: 1200, open: 71, click: 28, conv: 6.8, spend: 35000, revenue: 245000, channel: "Push" },
  { name: "F&B Festival Promo", status: "SCHEDULED", sent: 0, open: 0, click: 0, conv: 0, spend: 50000, revenue: 0, channel: "Multi" },
  { name: "Loyalty Reactivation", status: "COMPLETED", sent: 850, open: 42, click: 11, conv: 2.1, spend: 15000, revenue: 78000, channel: "Email" },
];

const ATTRIBUTION = [
  { channel: "Direct", value: 38 },
  { channel: "Booking.com", value: 22 },
  { channel: "Expedia", value: 14 },
  { channel: "Email", value: 9 },
  { channel: "WhatsApp", value: 8 },
  { channel: "Social", value: 5 },
  { channel: "Travel Agent", value: 4 },
];

export default function MarketingPage() {
  return (
    <PageContainer>
      <PageHeader title="Marketing & Campaigns" description="Multi-channel campaigns with revenue attribution" icon={Megaphone} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="kpi-card"><div className="metric-label">Active Campaigns</div><div className="metric-value">{CAMPAIGNS.filter((c) => c.status === "ACTIVE").length}</div></div>
        <div className="kpi-card"><div className="metric-label">Revenue (30d)</div><div className="metric-value text-success-light">{formatINR(CAMPAIGNS.reduce((s, c) => s + c.revenue, 0))}</div></div>
        <div className="kpi-card"><div className="metric-label">Avg Open Rate</div><div className="metric-value text-brand-400">68%</div></div>
        <div className="kpi-card"><div className="metric-label">Marketing ROI</div><div className="metric-value text-success-light">4.2x</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5 lg:col-span-2">
          <div className="section-header mb-3">Active & Recent Campaigns</div>
          <div className="space-y-2.5">
            {CAMPAIGNS.map((c) => (
              <div key={c.name} className="glass-card p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-white font-semibold text-sm">{c.name}</div>
                    <div className="text-white/40 text-xs">{c.channel} • {c.sent.toLocaleString()} sent</div>
                  </div>
                  <span className={c.status === "ACTIVE" ? "badge-green" : c.status === "SCHEDULED" ? "badge-blue" : "badge-gray"}>{c.status}</span>
                </div>
                {c.sent > 0 && (
                  <div className="grid grid-cols-4 gap-2 text-[10px]">
                    <div className="text-center"><div className="text-white/40">Open</div><div className="text-white font-bold">{c.open}%</div></div>
                    <div className="text-center"><div className="text-white/40">Click</div><div className="text-white font-bold">{c.click}%</div></div>
                    <div className="text-center"><div className="text-white/40">Conv</div><div className="text-success-light font-bold">{c.conv}%</div></div>
                    <div className="text-center"><div className="text-white/40">Revenue</div><div className="text-success-light font-bold">{formatINR(c.revenue)}</div></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="section-header mb-3">Channel Attribution</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={ATTRIBUTION} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <YAxis dataKey="channel" type="category" stroke="rgba(255,255,255,0.4)" fontSize={10} width={80} />
                <Tooltip contentStyle={{ background: "rgba(15,15,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} formatter={(v: any) => [`${v}%`, "Share"]} />
                <Bar dataKey="value" fill="#7c3aed" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="section-header mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-ai-light" /> AI Campaign Suggestions</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="glass-card p-3 border-ai-DEFAULT/30">
            <div className="text-ai-light font-semibold text-xs">🎯 SUGGEST: Win-back Campaign</div>
            <div className="text-white mt-1">Target 23 high-value guests who haven&apos;t returned in 12+ months. Predicted revenue: ₹6.8L.</div>
            <button className="btn-ai text-xs mt-3">Generate Campaign</button>
          </div>
          <div className="glass-card p-3 border-brand-500/30">
            <div className="text-brand-300 font-semibold text-xs">⏰ URGENT: Fill tomorrow</div>
            <div className="text-white mt-1">8 premium suites available. WhatsApp blast to top 200 spenders — 4-hour flash sale.</div>
            <button className="btn-primary text-xs mt-3">Launch Now</button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
