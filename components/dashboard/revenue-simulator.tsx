"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  TrendingUp, TrendingDown, DollarSign, Sliders, CheckCircle2,
  Zap, ArrowUpRight, ArrowDownRight, Layers, Building2, Eye,
  Sparkles, Check, Hotel, RefreshCw, BarChart3, Search, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { formatINR } from "@/lib/utils";

interface Room {
  id: string;
  number: string;
  type: string;
  status: string;
  floor: number;
  buildingName: string;
  temperature: number;
  basePrice?: number;
  price: number;
  guest: any;
}

const BASE_PRICES: Record<string, number> = {
  STANDARD: 7500,
  DELUXE: 10500,
  PREMIUM: 14000,
  EXECUTIVE: 18000,
  SUITE: 25000,
  "LUXURY SUITE": 40000,
};

// Dynamic pricing algorithm based on simulated occupancy
function calculateDynamicPricing(baseRate: number, occupancyPercent: number) {
  let multiplier = 1.0;
  let reason = "Equilibrium demand. Standard rate applied.";

  if (occupancyPercent <= 40) {
    // 10% -> 0.67 (-33%), 40% -> 0.85 (-15%)
    multiplier = 0.62 + (occupancyPercent / 40) * 0.23;
    reason = "Low occupancy pace. Automatic markdown discount applied to stimulate booking velocity and fill distressed inventory.";
  } else if (occupancyPercent <= 70) {
    // 40% -> 0.85, 70% -> 1.05 (+5%)
    multiplier = 0.85 + ((occupancyPercent - 40) / 30) * 0.20;
    reason = "Healthy booking pace. Price dynamically stabilized around standard target baseline.";
  } else if (occupancyPercent <= 88) {
    // 70% -> 1.05, 88% -> 1.40 (+40%)
    multiplier = 1.05 + ((occupancyPercent - 70) / 18) * 0.35;
    reason = "High demand velocity. Automated surge pricing activated due to reduced room inventory.";
  } else {
    // 88% -> 1.40, 100% -> 1.85 (+85%)
    multiplier = 1.40 + ((occupancyPercent - 88) / 12) * 0.45;
    reason = "Critical scarcity mode. Peak yield surge rates deployed to maximize ADR & RevPAR.";
  }

  const dynamicPrice = Math.round((baseRate * multiplier) / 100) * 100;
  const deltaPercent = ((dynamicPrice - baseRate) / baseRate) * 100;

  return { multiplier, dynamicPrice, deltaPercent, reason };
}

export default function RevenueSimulatorPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [simulatedOccupancy, setSimulatedOccupancy] = useState<number>(85);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [liveOccupancy, setLiveOccupancy] = useState<number | null>(null);

  const scenarioEdited = useRef(false);
  const changeScenario = (value: number) => { scenarioEdited.current = true; setSimulatedOccupancy(value); };
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch('/api/revenue/simulator', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !Array.isArray(data.rooms)) throw new Error('Unable to load Digital Twin bookings');
        if (!active) return;
        setRooms(data.rooms);
        setLiveOccupancy(data.live.occupancyPct);
        if (!scenarioEdited.current) setSimulatedOccupancy(data.live.occupancyPct);
        setSyncError(null);
      } catch (error) { if (active) setSyncError('Unable to refresh Digital Twin bookings. Please try again.'); }
    };
    refresh();
    const timer = setInterval(refresh, 5000);
    window.addEventListener('focus', refresh);
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);

  // Compute simulated dynamic multiplier
  const { multiplier: dynamicMultiplier, deltaPercent: overallDeltaPercent, reason: activeRuleReason } = useMemo(() => {
    return calculateDynamicPricing(10000, simulatedOccupancy);
  }, [simulatedOccupancy]);

  // Determine which rooms are occupied in simulated mode
  const simulatedOccupiedIds = useMemo(() => {
    if (rooms.length === 0) return new Set<string>();
    const count = Math.round((rooms.length * simulatedOccupancy) / 100);
    const sorted = [...rooms].sort((a, b) => a.number.localeCompare(b.number));
    return new Set(sorted.slice(0, count).map((r) => r.id));
  }, [rooms, simulatedOccupancy]);

  // Group by building
  const byBuilding: Record<string, Room[]> = useMemo(() => {
    const map: Record<string, Room[]> = {};
    rooms.forEach((r) => {
      const k = r.buildingName || "Other";
      if (!map[k]) map[k] = [];
      map[k].push(r);
    });
    return map;
  }, [rooms]);

  // Financial metrics
  const financialMetrics = useMemo(() => {
    if (rooms.length === 0) {
      return { adr: 0, dailyRevenue: 0, revpar: 0, occupiedRooms: 0, revenueLift: 0, totalRooms: 0 };
    }
    const occupiedRooms = Math.round((rooms.length * simulatedOccupancy) / 100);
    let totalProjectedRev = 0;
    let totalBaseRev = 0;

    rooms.forEach((r, idx) => {
      const isOcc = simulatedOccupiedIds.has(r.id);
      const base = r.basePrice || BASE_PRICES[r.type] || 12000;
      if (isOcc) {
        const { dynamicPrice } = calculateDynamicPricing(base, simulatedOccupancy);
        totalProjectedRev += dynamicPrice;
        totalBaseRev += base;
      }
    });

    const adr = occupiedRooms > 0 ? Math.round(totalProjectedRev / occupiedRooms) : 0;
    const revpar = rooms.length > 0 ? Math.round(totalProjectedRev / rooms.length) : 0;
    const revenueLift = totalProjectedRev - totalBaseRev;

    return {
      adr,
      dailyRevenue: totalProjectedRev,
      revpar,
      occupiedRooms,
      revenueLift,
      totalRooms: rooms.length,
    };
  }, [rooms, simulatedOccupancy, simulatedOccupiedIds]);

  const handleApplyRates = async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      const response = await fetch("/api/revenue/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulatedOccupancy,
          projectedRevenue: financialMetrics.dailyRevenue,
          projectedADR: financialMetrics.adr,
          projectedRevPAR: financialMetrics.revpar,
          dynamicMultiplier,
        }),
      });
      if (!response.ok) throw new Error('Rate deployment failed');
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (e) {
      setSyncError('Rates could not be synchronized. Please try again.');
    } finally { setSyncing(false); }
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchType = selectedTypeFilter === "ALL" || r.type === selectedTypeFilter;
      const matchSearch =
        r.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.buildingName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [rooms, selectedTypeFilter, searchQuery]);

  return (
    <PageContainer>
      <PageHeader
        title="Revenue Intelligence Simulator"
        description="Predict and set optimal dynamic room pricing based on real-time and simulated resort occupancy"
        icon={TrendingUp}
        badge="AI Dynamic Pricing"
      actions={
          <div className="flex items-center gap-3">
            {liveOccupancy !== null && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live bookings: {liveOccupancy}% Occ
              </div>
            )}
            <button
              onClick={handleApplyRates}
              disabled={syncing || rooms.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-ai-DEFAULT text-white text-xs font-semibold shadow-glow-brand hover:brightness-110 transition-all"
            >
              {syncSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Synced with Digital Twin!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Deploy Dynamic Rates</span>
                </>
              )}
            </button>
          </div>
        }
      />

      {syncError && <div role="alert" className="glass-card p-4 mb-4 text-danger-light">{syncError}</div>}
      <p className="text-sm text-muted mb-4">Live bookings refresh every 5 seconds. The occupancy slider is a forecast; deploying rates changes future booking prices without changing existing reservations.</p>
      <div className="glass-card p-4 mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span>Digital Twin: <strong>{rooms.filter(room => ['OCCUPIED', 'RESERVED'].includes(room.status)).length} booked</strong> · {rooms.filter(room => room.status === 'AVAILABLE').length} available · Booked nightly revenue: <strong>{formatINR(rooms.filter(room => ['OCCUPIED', 'RESERVED'].includes(room.status)).reduce((sum, room) => sum + room.price, 0))}</strong></span>
        <button className="btn-secondary" disabled={liveOccupancy === null} onClick={() => { scenarioEdited.current = false; setSimulatedOccupancy(liveOccupancy ?? 0); }}>Use live occupancy</button>
      </div>
      {/* Top Statistical KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="kpi-card relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="metric-label">Simulated Occupancy</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                simulatedOccupancy >= 80
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : simulatedOccupancy <= 40
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {simulatedOccupancy >= 80 ? "Peak Surge" : simulatedOccupancy <= 40 ? "Low / Discount" : "Equilibrium"}
            </span>
          </div>
          <div className="metric-value text-white flex items-baseline gap-2">
            <span>{simulatedOccupancy}%</span>
            <span className="text-white/40 text-xs font-normal">
              ({financialMetrics.occupiedRooms}/{financialMetrics.totalRooms || 160} rooms)
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                simulatedOccupancy >= 80
                  ? "bg-gradient-to-r from-amber-500 to-purple-500"
                  : simulatedOccupancy <= 40
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                  : "bg-gradient-to-r from-emerald-500 to-teal-400"
              }`}
              style={{ width: `${simulatedOccupancy}%` }}
            />
          </div>
        </div>

        <div className="kpi-card">
          <div className="metric-label mb-2">Predicted ADR</div>
          <div className="metric-value text-brand-300">₹{financialMetrics.adr.toLocaleString()}</div>
          <div className="text-xs text-white/50 mt-1 flex items-center gap-1">
            <span className={overallDeltaPercent >= 0 ? "text-amber-400 font-semibold" : "text-cyan-400 font-semibold"}>
              {overallDeltaPercent >= 0 ? "+" : ""}
              {overallDeltaPercent.toFixed(1)}%
            </span>
            <span>vs standard baseline</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="metric-label mb-2">Projected Daily Revenue</div>
          <div className="metric-value text-success-light">{formatINR(financialMetrics.dailyRevenue)}</div>
          <div className="text-xs text-white/50 mt-1">
            <span className={financialMetrics.revenueLift >= 0 ? "text-success-light font-semibold" : "text-cyan-400 font-semibold"}>
              {financialMetrics.revenueLift >= 0 ? "+" : ""}
              {formatINR(financialMetrics.revenueLift)}
            </span>
            {" "}dynamic lift
          </div>
        </div>

        <div className="kpi-card">
          <div className="metric-label mb-2">Simulated RevPAR</div>
          <div className="metric-value text-ai-light">₹{financialMetrics.revpar.toLocaleString()}</div>
          <div className="text-xs text-white/50 mt-1">Revenue per available room</div>
        </div>
      </div>

      {/* Main Statistics & Simulation Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Occupancy Controls & Pricing Matrix */}
        <div className="lg:col-span-7 space-y-6">
          {/* Occupancy Simulator Controls */}
          <div className="glass-card p-6 space-y-5 border border-brand-500/20 bg-gradient-to-b from-brand-950/20 to-surface-900/80 shadow-glow-brand/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-glow-brand">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-display font-semibold text-lg">Occupancy Level Simulator</div>
                  <div className="text-white/40 text-xs">Simulate room occupancy to trigger dynamic pricing shifts</div>
                </div>
              </div>

              <div
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                  overallDeltaPercent < 0
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                    : overallDeltaPercent > 20
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                }`}
              >
                {overallDeltaPercent < 0
                  ? `📉 Discount Active: ${overallDeltaPercent.toFixed(1)}%`
                  : `🔥 Rate Surge Active: +${overallDeltaPercent.toFixed(1)}%`}
              </div>
            </div>

            {/* Slider with visual indicators */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-white/80 font-medium text-sm">Resort Occupancy:</span>
                <span className="text-3xl font-display font-bold text-white">{simulatedOccupancy}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={simulatedOccupancy}
                onChange={(e) => changeScenario(Number(e.target.value))}
                className="w-full accent-brand-500 h-3 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-white/40">
                <span className="text-cyan-400">5% (Low Demand / Markdown)</span>
                <span className="text-emerald-400">55% (Target Equilibrium)</span>
                <span className="text-purple-400">100% (Full / Peak Scarcity)</span>
              </div>
            </div>

            {/* Demand Scenario Presets */}
            <div className="space-y-2 pt-2">
              <div className="text-white/50 text-xs uppercase font-semibold">Demand Scenario Presets</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => changeScenario(25)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    simulatedOccupancy === 25
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-glow-brand"
                      : "glass-card hover:bg-white/[0.06] text-white/70"
                  }`}
                >
                  <div className="text-sm font-semibold mb-0.5">🌴 Low Demand</div>
                  <div className="text-xs text-white/40">25% Occ • -33% Price</div>
                </button>

                <button
                  onClick={() => changeScenario(55)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    simulatedOccupancy === 55
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-glow-brand"
                      : "glass-card hover:bg-white/[0.06] text-white/70"
                  }`}
                >
                  <div className="text-sm font-semibold mb-0.5">⚖️ Mid-Week</div>
                  <div className="text-xs text-white/40">55% Occ • Standard Rate</div>
                </button>

                <button
                  onClick={() => changeScenario(85)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    simulatedOccupancy === 85
                      ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-glow-brand"
                      : "glass-card hover:bg-white/[0.06] text-white/70"
                  }`}
                >
                  <div className="text-sm font-semibold mb-0.5">🚀 Weekend</div>
                  <div className="text-xs text-white/40">85% Occ • +34% Surge</div>
                </button>

                <button
                  onClick={() => changeScenario(98)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    simulatedOccupancy === 98
                      ? "bg-purple-500/20 border-purple-400 text-purple-200 shadow-glow-brand"
                      : "glass-card hover:bg-white/[0.06] text-white/70"
                  }`}
                >
                  <div className="text-sm font-semibold mb-0.5">👑 Sellout</div>
                  <div className="text-xs text-white/40">98% Occ • +78% Surge</div>
                </button>
              </div>
            </div>

            {/* Active AI Rule Rationale */}
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white/80 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-ai-light flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold">Active AI Policy: </span>
                {activeRuleReason}
              </div>
            </div>
          </div>

          {/* Dynamic Rates by Room Category Grid */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-display font-semibold text-base">Predicted Rates by Room Category</div>
                <div className="text-white/40 text-xs">Simulated dynamic rates currently calculated for PMS sync</div>
              </div>
              <span className="text-xs text-white/50">{simulatedOccupancy}% Occupancy</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(BASE_PRICES).map(([type, base]) => {
                const { dynamicPrice, deltaPercent } = calculateDynamicPricing(base, simulatedOccupancy);
                const isIncrease = deltaPercent >= 0;
                return (
                  <div key={type} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase font-bold text-white/50 tracking-wider">{type} ROOM</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isIncrease
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        }`}
                      >
                        {isIncrease ? "+" : ""}
                        {deltaPercent.toFixed(1)}% {isIncrease ? "Surge" : "Discount"}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-display font-bold text-white">
                        ₹{dynamicPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-white/40 line-through">
                        ₹{base.toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/[0.06] text-[11px] text-white/50 flex justify-between">
                      <span>Rate Differential:</span>
                      <span className={isIncrease ? "text-amber-400 font-medium" : "text-cyan-400 font-medium"}>
                        {isIncrease ? "+₹" : "-₹"}
                        {Math.abs(dynamicPrice - base).toLocaleString()} / night
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Revenue Policy Guidelines */}
          <div className="glass-card p-5 space-y-3">
            <div className="text-white/50 text-xs uppercase font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ai-light" />
              Automated Yield Management Logic
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <div className="text-cyan-400 font-bold flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5" /> Low Occupancy (&le;40%)
                </div>
                <div className="text-white/60 text-[11px]">
                  Prices are automatically lowered by 15% to 35% to undercut competitor rates and accelerate booking volume.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5" /> Equilibrium (41% - 70%)
                </div>
                <div className="text-white/60 text-[11px]">
                  Rates normalize at target baseline (+/- 5%) to maintain optimal margin without dampening steady demand pace.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <div className="text-purple-400 font-bold flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Peak Surge (&gt;70%)
                </div>
                <div className="text-white/60 text-[11px]">
                  Automated yield curve deploys up to +85% surge pricing as rooms become scarce, maximizing ADR and property RevPAR.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Building Distribution, Room Rate Inspector & Financial Stats */}
        <div className="lg:col-span-5 space-y-6">
          {/* Building Distribution Stats */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-white font-display font-semibold text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                Building Occupancy Distribution
              </div>
              <span className="text-xs text-white/50">{Object.keys(byBuilding).length} wings</span>
            </div>

            <div className="space-y-3.5">
              {Object.entries(byBuilding).map(([name, rs]) => {
                const countOccupied = rs.filter((r) => simulatedOccupiedIds.has(r.id)).length;
                const pct = (countOccupied / rs.length) * 100;
                return (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/80 font-medium">{name}</span>
                      <span className="text-white/50">
                        {countOccupied}/{rs.length} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          pct >= 85
                            ? "bg-gradient-to-r from-amber-500 to-purple-500"
                            : pct <= 40
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                            : "bg-brand-gradient"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Room Detailed Inspector */}
          {selectedRoom ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 border border-brand-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="text-white/40 text-xs font-semibold uppercase tracking-wider">Selected Room Rate Breakdown</div>
                <button onClick={() => setSelectedRoom(null)} className="text-white/40 hover:text-white text-xs">
                  Clear
                </button>
              </div>

              <div className="text-2xl font-display font-bold text-white mb-1">
                Room {selectedRoom.number}
              </div>
              <div className="text-white/50 text-xs mb-4">
                {selectedRoom.buildingName} • Floor {selectedRoom.floor} • {selectedRoom.type}
              </div>

              {(() => {
                const base = selectedRoom.basePrice || BASE_PRICES[selectedRoom.type] || 12000;
                const { dynamicPrice, deltaPercent, reason } = calculateDynamicPricing(base, simulatedOccupancy);
                const isSimOcc = simulatedOccupiedIds.has(selectedRoom.id);
                return (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between p-2 rounded bg-white/[0.03]">
                      <span className="text-white/50">Simulated State:</span>
                      <span className={`font-semibold ${isSimOcc ? "text-brand-300" : "text-emerald-400"}`}>
                        {isSimOcc ? "Forecast: occupied" : "Forecast: vacant"} · Live: {selectedRoom.status}
                      </span>
                    </div>

                    <div className="flex justify-between p-2 rounded bg-white/[0.03]">
                      <span className="text-white/50">Base Standard Rate:</span>
                      <span className="text-white/60 line-through">₹{base.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center p-2.5 rounded bg-brand-500/10 border border-brand-500/20">
                      <span className="text-white font-semibold">AI Dynamic Rate:</span>
                      <div className="text-right">
                        <div className="text-lg font-bold font-display text-white">
                          ₹{dynamicPrice.toLocaleString()}
                        </div>
                        <div className={`text-[10px] font-semibold ${deltaPercent >= 0 ? "text-amber-400" : "text-cyan-400"}`}>
                          {deltaPercent >= 0 ? "+" : ""}
                          {deltaPercent.toFixed(1)}% {deltaPercent >= 0 ? "Surge" : "Discount"}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white/[0.04] text-[11px] text-white/70 leading-relaxed border border-white/[0.06]">
                      <span className="text-ai-light font-semibold">AI Rule: </span>
                      {reason}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          ) : (
            <div className="glass-card p-5 text-center text-white/40 text-xs">
              <Eye className="w-5 h-5 mx-auto mb-2 text-white/30" />
              Click any room from the list below to inspect its dynamic rate
            </div>
          )}

          {/* Interactive Room Inventory List */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-white font-display font-semibold text-sm">Room Inventory Rates</div>
              <div className="flex items-center gap-1">
                {(["ALL", "STANDARD", "DELUXE", "PREMIUM", "EXECUTIVE", "SUITE", "LUXURY SUITE"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTypeFilter(t)}
                    className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                      selectedTypeFilter === t ? "bg-brand-500/40 text-white" : "text-white/40 hover:text-white"
                    }`}
                  >
                    {t === "ALL" ? "All" : t.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search room number or wing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto no-scrollbar">
              {filteredRooms.slice(0, 30).map((r) => {
                const base = r.basePrice || BASE_PRICES[r.type] || 12000;
                const { dynamicPrice, deltaPercent } = calculateDynamicPricing(base, simulatedOccupancy);
                const isOcc = simulatedOccupiedIds.has(r.id);
                const isSelected = selectedRoom?.id === r.id;

                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoom(r)}
                    className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between border ${
                      isSelected
                        ? "bg-brand-500/20 border-brand-500/40 text-white"
                        : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] text-white/70"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-white">Room {r.number}</div>
                      <div className="text-[10px] text-white/40">
                        {r.buildingName} • {r.type}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-xs text-white">₹{dynamicPrice.toLocaleString()}</div>
                      <div className={`text-[10px] ${deltaPercent >= 0 ? "text-amber-400" : "text-cyan-400"}`}>
                        {deltaPercent >= 0 ? "+" : ""}
                        {deltaPercent.toFixed(0)}% forecast • {r.status}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
