"use client";

import { Target, Sparkles } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

const SEGMENTS = [
  { name: "Luxury Lovers", count: 18, avgSpend: 285000, color: "#a855f7", x: 85, y: 92 },
  { name: "Business Elite", count: 24, avgSpend: 165000, color: "#6366f1", x: 45, y: 78 },
  { name: "Family Premium", count: 32, avgSpend: 142000, color: "#22c55e", x: 35, y: 70 },
  { name: "Wellness Seekers", count: 21, avgSpend: 128000, color: "#06b6d4", x: 55, y: 82 },
  { name: "Experience Hunters", count: 19, avgSpend: 158000, color: "#f59e0b", x: 75, y: 68 },
  { name: "Value Conscious", count: 28, avgSpend: 68000, color: "#94a3b8", x: 20, y: 55 },
  { name: "Romantic Escapes", count: 14, avgSpend: 195000, color: "#ec4899", x: 80, y: 88 },
  { name: "Group Bookers", count: 11, avgSpend: 320000, color: "#10b981", x: 30, y: 85 },
];

export default function SegmentationPage() {
  return (
    <PageContainer>
      <PageHeader title="Guest Segmentation" description="AI-driven RFM clusters for targeted campaigns" icon={Target} badge="AI" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5 lg:col-span-2">
          <div className="section-header mb-4">Segment Map (Value vs Loyalty)</div>
          <div className="h-80">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" dataKey="x" name="Satisfaction" unit="%" stroke="rgba(255,255,255,0.4)" fontSize={11} domain={[0, 100]} />
                <YAxis type="number" dataKey="y" name="Spend Index" stroke="rgba(255,255,255,0.4)" fontSize={11} domain={[0, 100]} />
                <ZAxis type="number" dataKey="count" range={[200, 1500]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "rgba(15,15,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} formatter={(v: any, n: any) => n === "Satisfaction" || n === "Spend Index" ? `${v}` : v} />
                <Scatter data={SEGMENTS}>
                  {SEGMENTS.map((s, i) => <Cell key={i} fill={s.color} fillOpacity={0.7} />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="section-header mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-ai-light" /> AI Insights</div>
          <div className="space-y-3 text-sm text-white/70">
            <div className="alert-info text-xs">
              <div className="text-brand-300 font-semibold">🎯 Untapped Opportunity</div>
              <div className="text-white/70 mt-1">&quot;Wellness Seekers&quot; segment spending 28% below their potential. Target with spa packages.</div>
            </div>
            <div className="alert-warning text-xs">
              <div className="text-warning-light font-semibold">⚠️ Churn Risk</div>
              <div className="text-white/70 mt-1">&quot;Value Conscious&quot; - 8 guests haven&apos;t returned in 12+ months. Win-back campaign recommended.</div>
            </div>
            <div className="alert-critical text-xs">
              <div className="text-danger-light font-semibold">🚀 Growth Lever</div>
              <div className="text-white/70 mt-1">&quot;Romantic Escapes&quot; - only 14 guests but ₹19.5L revenue. Increase marketing budget by 30%.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="section-header mb-3">Segment Breakdown</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SEGMENTS.map((s) => (
            <div key={s.name} className="glass-card p-3 border-l-4" style={{ borderColor: s.color }}>
              <div className="flex items-center justify-between">
                <div className="text-white font-semibold text-sm">{s.name}</div>
                <div className="text-xs font-mono" style={{ color: s.color }}>●</div>
              </div>
              <div className="text-2xl font-bold text-white mt-2">{s.count}</div>
              <div className="text-white/40 text-xs">guests</div>
              <div className="text-white/80 text-sm mt-2">₹{(s.avgSpend / 1000).toFixed(0)}K avg spend</div>
              <div className="text-white/40 text-[10px] mt-1">Total: ₹{(s.count * s.avgSpend / 100000).toFixed(1)}L</div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
