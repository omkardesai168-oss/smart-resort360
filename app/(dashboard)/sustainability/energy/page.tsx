"use client";

import { BatteryCharging, Wind, Sparkles, Leaf } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

const ENERGY = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  actual: 180 + Math.sin(h / 3) * 60 + (h >= 8 && h <= 20 ? 80 : 0),
  optimized: 180 + Math.sin(h / 3) * 60 + (h >= 8 && h <= 20 ? 60 : 0),
}));

const ZONES = [
  { name: "Kitchen", consumption: 520, pct: 18.3, color: "#f59e0b" },
  { name: "Main Wing HVAC", consumption: 680, pct: 23.9, color: "#6366f1" },
  { name: "Pool Systems", consumption: 310, pct: 10.9, color: "#06b6d4" },
  { name: "East Wing", consumption: 480, pct: 16.9, color: "#a855f7" },
  { name: "Lighting", consumption: 290, pct: 10.2, color: "#22c55e" },
  { name: "Villa Block", consumption: 380, pct: 13.3, color: "#ec4899" },
  { name: "Other", consumption: 187, pct: 6.5, color: "#94a3b8" },
];

export default function EnergyPage() {
  return (
    <PageContainer>
      <PageHeader title="Energy" description="Real-time energy monitoring and AI optimization" icon={BatteryCharging} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="kpi-card"><div className="metric-label">Energy (24h)</div><div className="metric-value text-warning-light">2,847 kWh</div><div className="text-success-light text-xs">↓ 4.7% vs yesterday</div></div>
        <div className="kpi-card"><div className="metric-label">Cost (24h)</div><div className="metric-value">₹28.5K</div><div className="text-white/40 text-xs">₹10/kWh avg</div></div>
        <div className="kpi-card"><div className="metric-label">Solar Contribution</div><div className="metric-value text-success-light">11.9%</div><div className="text-white/40 text-xs">340 kWh</div></div>
        <div className="kpi-card"><div className="metric-label">Carbon Offset</div><div className="metric-value text-success-light">1.2t</div><div className="text-white/40 text-xs">CO₂ saved today</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="section-header flex items-center gap-2"><BatteryCharging className="w-4 h-4 text-warning-light" /> 24-Hour Energy Curve</div>
            <div className="flex items-center gap-3 text-xs text-white/60">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning-DEFAULT" />Actual</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success-light" />AI Optimized</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={ENERGY}>
                <defs>
                  <linearGradient id="actualG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                  <linearGradient id="optG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.4)" fontSize={10} interval={3} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip contentStyle={{ background: "rgba(15,15,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="actual" stroke="#f59e0b" fill="url(#actualG)" strokeWidth={2} />
                <Area type="monotone" dataKey="optimized" stroke="#22c55e" fill="url(#optG)" strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="section-header mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-ai-light" /> AI Savings</div>
          <div className="space-y-3 text-sm">
            <div className="glass-card p-3"><div className="text-success-light font-semibold text-xs">💡 BLOCK C VACANT</div><div className="text-white mt-1">22 empty rooms. Reduce HVAC 35%.</div><div className="text-success-light text-xs mt-1 font-semibold">Save ₹18,400 today</div></div>
            <div className="glass-card p-3"><div className="text-ai-light font-semibold text-xs">🌡️ PRE-COOLING</div><div className="text-white mt-1">Run chillers 2-5 AM (off-peak).</div><div className="text-success-light text-xs mt-1 font-semibold">Save ₹8,200/day</div></div>
            <button className="btn-ai w-full text-xs">Apply All</button>
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="section-header mb-3 flex items-center gap-2"><Wind className="w-4 h-4 text-cyan-400" /> Energy by Zone</div>
        <div className="space-y-2.5">
          {ZONES.map((z) => (
            <div key={z.name}>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: z.color }} /><span className="text-white/80">{z.name}</span></div>
                <div className="flex items-center gap-3"><span className="text-white/50 text-xs">{z.pct}%</span><span className="text-white font-semibold w-20 text-right">{z.consumption} kWh</span></div>
              </div>
              <div className="progress-bar"><div className="h-full rounded-full" style={{ background: z.color, width: `${(z.consumption / 680) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
