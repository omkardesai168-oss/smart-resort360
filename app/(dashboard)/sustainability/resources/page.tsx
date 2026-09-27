"use client";

import { Wind, Droplets, Recycle, Leaf } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

export default function ResourcesPage() {
  return (
    <PageContainer>
      <PageHeader title="Resources" description="Water, waste, and recycling management" icon={Leaf} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="kpi-card"><div className="metric-label">Water (24h)</div><div className="metric-value text-brand-400">42 KL</div><div className="text-success-light text-xs">within target</div></div>
        <div className="kpi-card"><div className="metric-label">Waste Recycled</div><div className="metric-value text-success-light">68%</div><div className="text-white/40 text-xs">↑ 4% vs last month</div></div>
        <div className="kpi-card"><div className="metric-label">Food Waste</div><div className="metric-value text-warning-light">2.1%</div><div className="text-white/40 text-xs">target: 3%</div></div>
        <div className="kpi-card"><div className="metric-label">Linens Reused</div><div className="metric-value text-cyan-400">142</div><div className="text-white/40 text-xs">guest opt-ins</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <div className="section-header mb-3 flex items-center gap-2"><Droplets className="w-4 h-4 text-brand-400" /> Water Usage by Area</div>
          <div className="space-y-3">
            {[
              { area: "Guest Rooms", usage: 18000, pct: 42.8, color: "#6366f1" },
              { area: "Pool & Spa", usage: 12000, pct: 28.6, color: "#06b6d4" },
              { area: "Kitchen & F&B", usage: 7000, pct: 16.7, color: "#f59e0b" },
              { area: "Laundry", usage: 3500, pct: 8.3, color: "#a855f7" },
              { area: "Gardens", usage: 1500, pct: 3.6, color: "#22c55e" },
            ].map((a) => (
              <div key={a.area}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }} /><span className="text-white/80">{a.area}</span></div>
                  <div className="flex items-center gap-3"><span className="text-white/50 text-xs">{a.pct}%</span><span className="text-white font-semibold w-20 text-right">{(a.usage / 1000).toFixed(1)} KL</span></div>
                </div>
                <div className="progress-bar"><div className="h-full rounded-full" style={{ background: a.color, width: `${a.pct * 2}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="section-header mb-3 flex items-center gap-2"><Recycle className="w-4 h-4 text-success-light" /> Waste Diversion</div>
          <div className="space-y-3 text-sm">
            <div className="glass-card p-3 flex items-center justify-between">
              <div><div className="text-white font-medium">Composted (organic)</div><div className="text-white/50 text-xs">Garden fertilizer</div></div>
              <div className="text-success-light font-bold text-2xl">42%</div>
            </div>
            <div className="glass-card p-3 flex items-center justify-between">
              <div><div className="text-white font-medium">Recycled (paper/plastic)</div><div className="text-white/50 text-xs">Sent to local recycler</div></div>
              <div className="text-brand-400 font-bold text-2xl">18%</div>
            </div>
            <div className="glass-card p-3 flex items-center justify-between">
              <div><div className="text-white font-medium">Reused / Donated</div><div className="text-white/50 text-xs">Linens, amenities</div></div>
              <div className="text-cyan-400 font-bold text-2xl">8%</div>
            </div>
            <div className="glass-card p-3 flex items-center justify-between">
              <div><div className="text-white font-medium">Landfill</div><div className="text-white/50 text-xs">Non-recyclable</div></div>
              <div className="text-danger-light font-bold text-2xl">32%</div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
