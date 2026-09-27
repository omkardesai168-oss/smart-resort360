"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, CloudRain, Sun, Wind, AlertTriangle, ShieldCheck,
  Building2, Hotel, Sparkles, Package, Zap, Play, RefreshCw,
  Navigation, Eye, Info, Layers, CheckCircle2, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MapEntity {
  id: string;
  name: string;
  type: "HOTEL" | "POOL" | "SPA" | "DINING" | "VILLA" | "WAREHOUSE" | "UTILITY";
  lat: number;
  lng: number;
  xPct: number; // For SVG map representation
  yPct: number;
  status: "NORMAL" | "WARNING" | "HIGH_RISK" | "SURGE_DEMAND";
  riskScore: number; // 0 - 100
  activeGuests: number;
  assignedStaff: string;
  impactNote: string;
}

const INITIAL_ENTITIES: MapEntity[] = [
  {
    id: "main-hotel",
    name: "Main Hotel Pavilion & Lobby",
    type: "HOTEL",
    lat: 12.3375, lng: 75.8069,
    xPct: 48, yPct: 42,
    status: "NORMAL", riskScore: 12,
    activeGuests: 84, assignedStaff: "Amitabh Sen (Concierge Lead)",
    impactNote: "Central hub operating normally. Indoor guest lounge active.",
  },
  {
    id: "pool-deck",
    name: "Outdoor Infinity Pool & Sun Deck",
    type: "POOL",
    lat: 12.3380, lng: 75.8072,
    xPct: 62, yPct: 28,
    status: "HIGH_RISK", riskScore: 88,
    activeGuests: 4, assignedStaff: "Rajesh Kumar (Safety Tech)",
    impactNote: "High monsoon rain risk. AI recommends evacuating pool deck & securing loungers.",
  },
  {
    id: "spa-sanctuary",
    name: "Ayurvedic Spa & Wellness Pavilion",
    type: "SPA",
    lat: 12.3370, lng: 75.8065,
    xPct: 35, yPct: 58,
    status: "SURGE_DEMAND", riskScore: 25,
    activeGuests: 32, assignedStaff: "Meera Reddy + 2 Reallocated Staff",
    impactNote: "Demand surge +45% due to rain. 3 outdoor staff reallocated here by AI agent.",
  },
  {
    id: "dining-pavilion",
    name: "Azure Fine Dining & Organic Farm",
    type: "DINING",
    lat: 12.3382, lng: 75.8060,
    xPct: 28, yPct: 30,
    status: "NORMAL", riskScore: 20,
    activeGuests: 42, assignedStaff: "Karan Johar (Exec Chef)",
    impactNote: "Indoor dining seating activated. High demand for hot beverages.",
  },
  {
    id: "villas-block",
    name: "Private Luxury Villas 101-115",
    type: "VILLA",
    lat: 12.3368, lng: 75.8080,
    xPct: 78, yPct: 68,
    status: "WARNING", riskScore: 45,
    activeGuests: 52, assignedStaff: "Vikram Patel (Senior Tech)",
    impactNote: "Occupancy at 94%. Roof drainage checked by maintenance agent.",
  },
  {
    id: "warehouse-gate",
    name: "Central Warehouse & Supply Route Gate 1",
    type: "WAREHOUSE",
    lat: 12.3360, lng: 75.8055,
    xPct: 18, yPct: 78,
    status: "WARNING", riskScore: 55,
    activeGuests: 0, assignedStaff: "Ananya Roy (Inventory Staff)",
    impactNote: "Mountain pass mist slowdown. Critical restock requests pre-dispatched.",
  },
  {
    id: "solar-substation",
    name: "Solar Microgrid & Energy Substation",
    type: "UTILITY",
    lat: 12.3388, lng: 75.8050,
    xPct: 15, yPct: 18,
    status: "NORMAL", riskScore: 15,
    activeGuests: 0, assignedStaff: "Automated Sensor Telemetry",
    impactNote: "Battery storage at 94%. Grid backup ready for weather outage.",
  },
];

interface GeospatialWeatherMapProps {
  weatherData?: any;
}

export function GeospatialWeatherMap({ weatherData }: GeospatialWeatherMapProps) {
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(INITIAL_ENTITIES[1]);
  const [simulationActive, setSimulationActive] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [weatherOverlay, setWeatherOverlay] = useState<"radar" | "risk" | "wind">("radar");

  const currentPrecip = weatherData?.current?.precipitationProb ?? 78;
  const currentTemp = weatherData?.current?.temp ?? 24.5;
  const condition = weatherData?.current?.condition ?? "Monsoon Rain Showers";

  // Simulation steps for Impact Propagation
  const SIMULATION_STEPS = [
    {
      title: "Step 1: Monsoon Cell Arrival",
      desc: "Live radar detects 85mm/h monsoon precipitation band crossing Western Ghats ridge (12.33°N).",
      affectedId: "pool-deck",
      impact: "Pool Risk spikes to 95%. Automated PA advisory triggered.",
    },
    {
      title: "Step 2: Outdoor Activity Evacuation",
      desc: "Pool deck & trail tours suspended. 12 guests routed to Indoor Tea Lounge.",
      affectedId: "main-hotel",
      impact: "Lobby & Lounge guest traffic +40%.",
    },
    {
      title: "Step 3: Indoor Experience & Spa Demand Surge",
      desc: "Spa booking requests increase by +65%. StaffSchedulingAgent dispatches 2 backup therapists.",
      affectedId: "spa-sanctuary",
      impact: "Spa capacity utilized at 98%. Revenue boost +₹48,000.",
    },
    {
      title: "Step 4: Supply Route Delay Mitigation",
      desc: "Madikeri pass mist slows trucks. InventoryManagementAgent auto-escalates critical restock PO.",
      affectedId: "warehouse-gate",
      impact: "Critical inventory PO auto-approved by Inventory Staff.",
    },
  ];

  const triggerSimulation = () => {
    setSimulationActive(true);
    setSimStep(0);

    const interval = setInterval(() => {
      setSimStep((prev) => {
        if (prev >= SIMULATION_STEPS.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);
  };

  return (
    <div className="glass-card p-5 space-y-4 border-brand-500/30 bg-gradient-to-br from-surface-900 via-surface-950 to-black">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow-brand">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-bold text-white">Geospatial Weather & Impact Map</h2>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                12.3375°N, 75.8069°E
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Real-time resort spatial telemetry · Weather impact propagation & simulated event modeling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Overlay switch */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            {(["radar", "risk", "wind"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setWeatherOverlay(m)}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider text-[10px] transition-all",
                  weatherOverlay === m
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-white/50 hover:text-white"
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={triggerSimulation}
            disabled={simulationActive && simStep < SIMULATION_STEPS.length - 1}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-xs text-white font-bold transition-all shadow-md disabled:opacity-60"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {simulationActive && simStep < SIMULATION_STEPS.length - 1 ? `Simulating Step ${simStep + 1}...` : "Simulate Storm Impact"}
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Interactive SVG Geospatial Map Canvas */}
        <div className="lg:col-span-2 relative h-[380px] sm:h-[420px] rounded-2xl bg-surface-950 border border-white/10 overflow-hidden shadow-inner group">
          
          {/* Map Grid Background Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

          {/* Top Live Weather Bar on Map */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-xs text-white font-mono">
            <CloudRain className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>Coorg Live: <strong className="text-cyan-300">{currentTemp}°C</strong></span>
            <span className="text-white/40">|</span>
            <span className="text-amber-300">Precip: {currentPrecip}%</span>
            <span className="text-white/40">|</span>
            <span className="text-emerald-300">{condition}</span>
          </div>

          {/* Animated Weather Radar Ring Overlay */}
          {weatherOverlay === "radar" && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
              <div className="w-[320px] h-[320px] rounded-full border border-cyan-500/30 bg-cyan-500/5 animate-ping opacity-25" />
              <div className="w-[180px] h-[180px] rounded-full border border-amber-500/30 bg-amber-500/5 animate-pulse opacity-40" />
            </div>
          )}

          {/* Wind Overlay Vectors */}
          {weatherOverlay === "wind" && (
            <div className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-around">
              <Wind className="w-12 h-12 text-cyan-400 animate-pulse -rotate-45" />
              <Wind className="w-16 h-16 text-cyan-300 animate-pulse -rotate-45" />
              <Wind className="w-10 h-10 text-cyan-500 animate-pulse -rotate-45" />
            </div>
          )}

          {/* SVG Connection Lines between entities */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="48%" y1="42%" x2="62%" y2="28%" stroke="rgba(239,68,68,0.4)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="48%" y1="42%" x2="35%" y2="58%" stroke="rgba(16,185,129,0.5)" strokeWidth="2" />
            <line x1="48%" y1="42%" x2="28%" y2="30%" stroke="rgba(59,130,246,0.5)" strokeWidth="2" />
            <line x1="48%" y1="42%" x2="78%" y2="68%" stroke="rgba(245,158,11,0.4)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="48%" y1="42%" x2="18%" y2="78%" stroke="rgba(245,158,11,0.5)" strokeWidth="2" />
          </svg>

          {/* Entity Markers */}
          {INITIAL_ENTITIES.map((ent) => {
            const isSelected = selectedEntity?.id === ent.id;
            const isSimAffected = simulationActive && SIMULATION_STEPS[simStep]?.affectedId === ent.id;

            return (
              <motion.div
                key={ent.id}
                style={{ left: `${ent.xPct}%`, top: `${ent.yPct}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                onClick={() => setSelectedEntity(ent)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative flex items-center justify-center">
                  {/* Ping Animation for High Risk or Sim Affected */}
                  {(ent.status === "HIGH_RISK" || isSimAffected) && (
                    <span className="absolute w-8 h-8 rounded-full bg-red-500/40 animate-ping" />
                  )}

                  {/* Marker Pin */}
                  <div className={cn(
                    "w-9 h-9 rounded-2xl flex items-center justify-center border shadow-lg transition-all duration-200",
                    isSelected ? "ring-2 ring-white scale-110 shadow-glow-brand" : "",
                    ent.status === "HIGH_RISK" ? "bg-red-950/80 border-red-500 text-red-300" :
                    ent.status === "SURGE_DEMAND" ? "bg-emerald-950/80 border-emerald-500 text-emerald-300" :
                    ent.status === "WARNING" ? "bg-amber-950/80 border-amber-500 text-amber-300" :
                    "bg-surface-900/90 border-white/20 text-white"
                  )}>
                    {ent.type === "HOTEL" && <Hotel className="w-4 h-4" />}
                    {ent.type === "POOL" && <CloudRain className="w-4 h-4" />}
                    {ent.type === "SPA" && <Sparkles className="w-4 h-4" />}
                    {ent.type === "DINING" && <Building2 className="w-4 h-4" />}
                    {ent.type === "VILLA" && <Hotel className="w-4 h-4 text-amber-300" />}
                    {ent.type === "WAREHOUSE" && <Package className="w-4 h-4" />}
                    {ent.type === "UTILITY" && <Zap className="w-4 h-4" />}
                  </div>

                  {/* Label tooltip */}
                  <div className="absolute top-10 whitespace-nowrap bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-[10px] font-bold text-white shadow-md">
                    {ent.name.split(" ")[0]}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Map Compass & Legend */}
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-white/70">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> High Risk</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Watch</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> AI Boost</span>
          </div>

          <div className="absolute bottom-3 right-3 z-20 text-[10px] font-mono text-white/40 bg-black/60 px-2 py-1 rounded-lg">
            RESORT COORDINATES: 12°20'15"N 75°48'24"E
          </div>
        </div>

        {/* Right Entity Details & Impact Simulation Panel */}
        <div className="space-y-4 flex flex-col justify-between">
          
          {/* Selected Entity Card */}
          {selectedEntity ? (
            <div className="glass-card p-4 border-brand-500/30 bg-surface-900/90 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  <span className="font-bold text-sm text-white">{selectedEntity.name}</span>
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                  selectedEntity.status === "HIGH_RISK" ? "bg-red-500/20 text-red-300 border-red-500/30" :
                  selectedEntity.status === "SURGE_DEMAND" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                  "bg-amber-500/20 text-amber-300 border-amber-500/30"
                )}>
                  {selectedEntity.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <div className="text-white/40 text-[10px]">Active Guests</div>
                  <div className="text-base font-bold text-white">{selectedEntity.activeGuests}</div>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <div className="text-white/40 text-[10px]">Weather Risk Score</div>
                  <div className={cn("text-base font-bold", selectedEntity.riskScore > 60 ? "text-red-300" : "text-emerald-300")}>
                    {selectedEntity.riskScore}/100
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-white/80">
                <div><strong className="text-white/50">Assigned Staff:</strong> {selectedEntity.assignedStaff}</div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-amber-200/90">
                  <strong className="text-amber-300">AI Telemetry Impact:</strong> {selectedEntity.impactNote}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 text-center text-white/40 text-xs">
              Click any map node to inspect geospatial telemetry & risk metrics.
            </div>
          )}

          {/* Simulated Impact Propagation Step Card */}
          {simulationActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-surface-950 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  Impact Propagation Simulation
                </span>
                <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">
                  {simStep + 1} / {SIMULATION_STEPS.length}
                </span>
              </div>
              <div className="text-sm font-bold text-white">{SIMULATION_STEPS[simStep].title}</div>
              <p className="text-xs text-white/70">{SIMULATION_STEPS[simStep].desc}</p>
              <div className="text-xs font-mono font-bold text-emerald-300 bg-black/40 p-2 rounded-lg border border-white/5">
                ⚡ Result: {SIMULATION_STEPS[simStep].impact}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
