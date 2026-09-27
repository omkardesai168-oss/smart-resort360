"use client";

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LineChart as LineIcon, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { formatINR } from "@/lib/utils";

const FORECAST = Array.from({ length: 30 }, (_, i) => {
  const isWeekend = i % 7 === 5 || i % 7 === 6;
  const occ = 72 + (isWeekend ? 12 : 0) + Math.sin(i / 3) * 5 + (Math.random() - 0.5) * 4;
  const adr = 14500 + (isWeekend ? 2000 : 0) + Math.cos(i / 4) * 800;
  return {
    day: `Day ${i + 1}`,
    date: new Date(Date.now() + i * 86400000).toLocaleDateString("en", { weekday: "short", day: "numeric" }),
    revenue: Math.max(0, occ / 100 * 140 * adr),
    occupancy: Math.max(40, Math.min(100, occ)),
    adr,
    lower: Math.max(0, occ / 100 * 140 * adr * 0.88),
    upper: occ / 100 * 140 * adr * 1.12,
  };
});

export default function ForecastPage() {
  return (
    <PageContainer>
      <PageHeader title="Revenue Forecast" description="30-day AI predictions with confidence intervals" icon={LineIcon} badge="AI" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="kpi-card"><div className="metric-label">Predicted (30d)</div><div className="metric-value text-success-light">{formatINR(FORECAST.reduce((s, f) => s + f.revenue, 0))}</div></div>
        <div className="kpi-card"><div className="metric-label">Avg Occupancy</div><div className="metric-value">{(FORECAST.reduce((s, f) => s + f.occupancy, 0) / FORECAST.length).toFixed(1)}%</div></div>
        <div className="kpi-card"><div className="metric-label">Avg ADR</div><div className="metric-value">{formatINR(FORECAST.reduce((s, f) => s + f.adr, 0) / FORECAST.length)}</div></div>
        <div className="kpi-card"><div className="metric-label">Confidence</div><div className="metric-value text-ai-light">87%</div></div>
      </div>

      <div className="glass-card p-5 mb-4">
        <div className="section-header mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-success-light" /> Revenue Forecast (30 days)</div>
        <div className="h-80">
          <ResponsiveContainer>
            <AreaChart data={FORECAST}>
              <defs>
                <linearGradient id="fcast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={10} interval={3} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ background: "rgba(15,15,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} formatter={(v: any) => [formatINR(v), "Revenue"]} />
              <Area type="monotone" dataKey="upper" stroke="none" fill="url(#band)" />
              <Area type="monotone" dataKey="lower" stroke="none" fill="rgba(0,0,0,0)" />
              <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2.5} fill="url(#fcast)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="section-header mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-ai-light" /> Forecast Drivers</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="glass-card p-3">
            <div className="text-success-light font-semibold text-xs">📈 Positive Drivers</div>
            <ul className="text-white/70 mt-2 space-y-1 text-xs">
              <li>• Festival demand +18% (week 2)</li>
              <li>• Corporate bookings surge (week 3)</li>
              <li>• Wedding block (5 villas, 3 nights)</li>
            </ul>
          </div>
          <div className="glass-card p-3">
            <div className="text-danger-light font-semibold text-xs">📉 Risk Factors</div>
            <ul className="text-white/70 mt-2 space-y-1 text-xs">
              <li>• Monsoon week 1 (-12% occupancy)</li>
              <li>• Local event competition (week 4)</li>
              <li>• Flight delays from BOM (ongoing)</li>
            </ul>
          </div>
          <div className="glass-card p-3">
            <div className="text-ai-light font-semibold text-xs">🤖 Model Inputs</div>
            <ul className="text-white/70 mt-2 space-y-1 text-xs">
              <li>• 3 years historical data</li>
              <li>• 14 macroeconomic signals</li>
              <li>• Competitor pricing feed (hourly)</li>
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
