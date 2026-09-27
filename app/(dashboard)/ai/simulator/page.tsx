"use client";

import { useState } from "react";
import { Target, Play, RotateCcw, TrendingUp, TrendingDown } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { formatINR } from "@/lib/utils";

export default function SimulatorPage() {
  const [occupancyBoost, setOccupancyBoost] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [staffCost, setStaffCost] = useState(0);
  const [energyReduction, setEnergyReduction] = useState(0);

  const baseRevenue = 1812000;
  const baseCost = 920000;
  const newRevenue = baseRevenue * (1 + occupancyBoost / 100) * (1 + priceChange / 100);
  const newCost = baseCost * (1 + staffCost / 100) * (1 - energyReduction / 200);
  const newProfit = newRevenue - newCost;
  const baseProfit = baseRevenue - baseCost;
  const delta = ((newProfit - baseProfit) / baseProfit) * 100;

  return (
    <PageContainer>
      <PageHeader title="Scenario Simulator" description="What-if analysis for operational decisions" icon={Target} badge="AI" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5 space-y-5">
          <div className="section-header flex items-center justify-between">
            <span>Adjust Variables</span>
            <button onClick={() => { setOccupancyBoost(0); setPriceChange(0); setStaffCost(0); setEnergyReduction(0); }} className="btn-secondary text-xs"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/80 text-sm font-medium">Occupancy Boost</label>
              <span className="text-brand-400 font-bold">+{occupancyBoost}%</span>
            </div>
            <input type="range" min="-30" max="30" value={occupancyBoost} onChange={(e) => setOccupancyBoost(Number(e.target.value))} className="w-full accent-brand-500" />
            <div className="text-white/40 text-xs mt-1">From promotions, marketing, or pricing changes</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/80 text-sm font-medium">Price Change (ADR)</label>
              <span className="text-accent-400 font-bold">{priceChange > 0 ? "+" : ""}{priceChange}%</span>
            </div>
            <input type="range" min="-30" max="30" value={priceChange} onChange={(e) => setPriceChange(Number(e.target.value))} className="w-full accent-accent-500" />
            <div className="text-white/40 text-xs mt-1">Apply across all room types</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/80 text-sm font-medium">Staff Cost Change</label>
              <span className="text-warning-light font-bold">{staffCost > 0 ? "+" : ""}{staffCost}%</span>
            </div>
            <input type="range" min="-20" max="50" value={staffCost} onChange={(e) => setStaffCost(Number(e.target.value))} className="w-full accent-warning-DEFAULT" />
            <div className="text-white/40 text-xs mt-1">Overtime, hiring, or contractor costs</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/80 text-sm font-medium">Energy Reduction</label>
              <span className="text-success-light font-bold">-{energyReduction}%</span>
            </div>
            <input type="range" min="0" max="40" value={energyReduction} onChange={(e) => setEnergyReduction(Number(e.target.value))} className="w-full accent-success-DEFAULT" />
            <div className="text-white/40 text-xs mt-1">HVAC optimization, smart sensors</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5">
            <div className="section-header mb-4">Simulated Outcome</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between glass-card p-3">
                <span className="text-white/60 text-sm">Projected Revenue</span>
                <span className="text-success-light text-xl font-bold">{formatINR(newRevenue)}</span>
              </div>
              <div className="flex items-center justify-between glass-card p-3">
                <span className="text-white/60 text-sm">Projected Cost</span>
                <span className="text-danger-light text-xl font-bold">{formatINR(newCost)}</span>
              </div>
              <div className="flex items-center justify-between glass-card p-3 border-ai-DEFAULT/40">
                <span className="text-white/60 text-sm">Net Profit</span>
                <span className="text-ai-light text-2xl font-bold">{formatINR(newProfit)}</span>
              </div>
            </div>
          </div>

          <div className={`glass-card p-5 ${delta > 0 ? "border-success-DEFAULT/30" : "border-danger-DEFAULT/30"}`}>
            <div className="flex items-center gap-2 mb-2">
              {delta >= 0 ? <TrendingUp className="w-5 h-5 text-success-light" /> : <TrendingDown className="w-5 h-5 text-danger-light" />}
              <span className={`font-semibold ${delta > 0 ? "text-success-light" : "text-danger-light"}`}>
                {delta > 0 ? "+" : ""}{delta.toFixed(1)}% vs baseline
              </span>
            </div>
            <div className="text-white/70 text-sm">
              {delta > 5 ? "Strong positive impact. Recommend executing this scenario." :
                delta > 0 ? "Marginal positive impact. Consider further optimization." :
                "Negative impact. Adjust variables."}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="section-header mb-2 text-sm">AI Recommendation</div>
            <div className="text-sm text-white/70">
              Based on your inputs, the optimal combination is: <span className="text-ai-light font-semibold">+5% occupancy, +8% ADR, -10% energy</span>. This would deliver ~+18% profit uplift.
            </div>
            <button className="btn-ai w-full mt-3"><Play className="w-3.5 h-3.5" /> Apply AI-Optimized Scenario</button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
