"use client";

import { useState, useEffect, useRef } from "react";
import {
  Globe, MapPin, Wind, CloudRain, Thermometer, AlertTriangle,
  ShieldCheck, Hotel, Activity, Play, Pause, RefreshCw, Info,
  Navigation, Zap, Eye, Layers, ChevronRight, BarChart3, Wifi,
  SlidersHorizontal, Search, Maximize2, Compass, ExternalLink,
  Satellite, Sliders, Radio
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── TYPES & INTERFACES ────────────────────────────────────────────────────────
export type SeverityLevel = "CRITICAL" | "HIGH" | "MODERATE" | "SAFE" | "RADAR";

export interface StateSeverityInfo {
  id: string;
  stateName: string;
  shortCode: string;
  capital: string;
  region: string;
  severity: SeverityLevel;
  color: string;
  glowColor: string;
  weatherCondition: string;
  temp: number;
  precipProb: number;
  humidity: number;
  windSpeed: number;
  riskScore: number;
  resortEntities: string;
  activeGuests: number;
  staffOnDuty: number;
  aiMitigation: string;
  surroundsHotel?: boolean;
  lx: number;
  ly: number;
  pathD: string;
}

// ─── SEVERITY COLOR CONFIG ──────────────────────────────────────────────────────
const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; badge: string; color: string; bg: string; border: string }> = {
  CRITICAL: {
    label: "Critical Zone",
    badge: "🔴 CRITICAL",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.15)",
    border: "rgba(239, 68, 68, 0.5)",
  },
  HIGH: {
    label: "High Risk Watch",
    badge: "🟠 HIGH RISK",
    color: "#f97316",
    bg: "rgba(249, 115, 22, 0.15)",
    border: "rgba(249, 115, 22, 0.5)",
  },
  MODERATE: {
    label: "Moderate Advisory",
    badge: "🟡 MODERATE",
    color: "#eab308",
    bg: "rgba(234, 179, 8, 0.15)",
    border: "rgba(234, 179, 8, 0.5)",
  },
  SAFE: {
    label: "Safe / Optimal",
    badge: "🟢 SAFE",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.15)",
    border: "rgba(16, 185, 129, 0.5)",
  },
  RADAR: {
    label: "Ocean Radar Watch",
    badge: "🔷 RADAR",
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.15)",
    border: "rgba(6, 182, 212, 0.5)",
  },
};

// ─── HIGH-PRECISION REALISTIC INDIA STATES DATA ────────────────────────────────
const INDIAN_STATES_DATA: StateSeverityInfo[] = [
  {
    id: "karnataka",
    stateName: "Karnataka (Coorg Flagship)",
    shortCode: "KA",
    capital: "Bengaluru",
    region: "South-West India / Western Ghats",
    severity: "CRITICAL",
    color: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.7)",
    weatherCondition: "Torrential Monsoon Downpour (88% Precip)",
    temp: 18.4, precipProb: 88, humidity: 95, windSpeed: 28, riskScore: 88,
    resortEntities: "⭐ Azure Hills Resort & Luxury Villas (Coorg)",
    activeGuests: 142, staffOnDuty: 28,
    surroundsHotel: true,
    aiMitigation: "🔴 CRITICAL: Outdoor pool closed. 3 staff reallocated to Spa Pavilion. High-demand indoor tea lounge activated.",
    lx: 295, ly: 575,
    pathD: "M 230,490 L 275,480 L 320,490 L 350,530 L 340,605 L 290,635 L 255,600 L 235,530 Z",
  },
  {
    id: "kerala",
    stateName: "Kerala (Wayanad & Alleppey)",
    shortCode: "KL",
    capital: "Thiruvananthapuram",
    region: "Malabar Coast / Western Ghats",
    severity: "CRITICAL",
    color: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.7)",
    weatherCondition: "Cloudburst Advisory & Mountain Pass Mist (92% Precip)",
    temp: 19.1, precipProb: 92, humidity: 98, windSpeed: 32, riskScore: 92,
    resortEntities: "Wayanad Sanctuary & Alleppey Waterside Resort",
    activeGuests: 140, staffOnDuty: 30,
    surroundsHotel: true,
    aiMitigation: "🔴 CRITICAL: Mountain pass landslide risk. Logistics pre-buffered by Inventory Staff.",
    lx: 265, ly: 685,
    pathD: "M 255,600 L 290,635 L 280,700 L 250,735 L 235,680 L 245,630 Z",
  },
  {
    id: "tamil_nadu",
    stateName: "Tamil Nadu (Nilgiris & Coast)",
    shortCode: "TN",
    capital: "Chennai",
    region: "Coromandel Coast / Eastern Ghats",
    severity: "MODERATE",
    color: "#eab308",
    glowColor: "rgba(234, 179, 8, 0.4)",
    weatherCondition: "Coastal Mist & Intermittent Showers (50% Precip)",
    temp: 28.5, precipProb: 50, humidity: 76, windSpeed: 16, riskScore: 45,
    resortEntities: "Nilgiris Tea Retreat & Chennai Transit Hub",
    activeGuests: 68, staffOnDuty: 14,
    surroundsHotel: true,
    aiMitigation: "🟡 MODERATE: Nilgiri mountain route monitored. Rain gear provided for guest tours.",
    lx: 350, ly: 670,
    pathD: "M 290,635 L 340,605 L 400,580 L 380,685 L 320,735 L 280,700 Z",
  },
  {
    id: "goa",
    stateName: "Goa (Coastal Villas)",
    shortCode: "GA",
    capital: "Panaji",
    region: "Konkan Coast Enclave",
    severity: "HIGH",
    color: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.6)",
    weatherCondition: "High Wind Gusts (42 km/h) & Sea Surge",
    temp: 26.5, precipProb: 75, humidity: 89, windSpeed: 42, riskScore: 68,
    resortEntities: "Azure Coastal Beach Villas & Marina",
    activeGuests: 98, staffOnDuty: 18,
    surroundsHotel: true,
    aiMitigation: "🟠 HIGH: Beach loungers secured. Water sports suspended. Marina telemetry active.",
    lx: 215, ly: 510,
    pathD: "M 220,495 L 240,490 L 235,515 L 215,518 Z",
  },
  {
    id: "maharashtra",
    stateName: "Maharashtra (Mumbai Logistics)",
    shortCode: "MH",
    capital: "Mumbai",
    region: "Western Deccan & Konkan",
    severity: "HIGH",
    color: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.5)",
    weatherCondition: "Heavy Coastal Cloud Band & Rain Watch (70% Precip)",
    temp: 29.4, precipProb: 70, humidity: 84, windSpeed: 24, riskScore: 65,
    resortEntities: "Mumbai Gateway Logistics & Airport Hub",
    activeGuests: 0, staffOnDuty: 8,
    surroundsHotel: false,
    aiMitigation: "🟠 HIGH: Transit supply routes monitoring mist advisories. Pre-clearance for cargo.",
    lx: 290, ly: 425,
    pathD: "M 195,380 L 280,360 L 370,400 L 360,470 L 320,490 L 275,480 L 230,490 L 220,495 L 205,430 Z",
  },
  {
    id: "andhra_telangana",
    stateName: "Andhra Pradesh & Telangana",
    shortCode: "AP/TG",
    capital: "Hyderabad",
    region: "Deccan Plateau & Coromandel",
    severity: "MODERATE",
    color: "#eab308",
    glowColor: "rgba(234, 179, 8, 0.4)",
    weatherCondition: "Overcast Plateau Clouds & Mist (52% Precip)",
    temp: 30.2, precipProb: 52, humidity: 70, windSpeed: 14, riskScore: 48,
    resortEntities: "Deccan Heritage Haveli & Transit Hub",
    activeGuests: 54, staffOnDuty: 11,
    surroundsHotel: false,
    aiMitigation: "🟡 MODERATE: Normal guest activity with indoor option. Spa experiences promoted.",
    lx: 400, ly: 505,
    pathD: "M 360,470 L 370,400 L 450,420 L 435,530 L 400,580 L 340,605 L 350,530 L 320,490 Z",
  },
  {
    id: "gujarat",
    stateName: "Gujarat (Kutch & Kathiawar)",
    shortCode: "GJ",
    capital: "Gandhinagar",
    region: "Western Peninsula",
    severity: "MODERATE",
    color: "#eab308",
    glowColor: "rgba(234, 179, 8, 0.4)",
    weatherCondition: "Coastal Wind Watch & Passing Clouds (45% Precip)",
    temp: 30.5, precipProb: 45, humidity: 62, windSpeed: 26, riskScore: 40,
    resortEntities: "Kutch Desert Heritage Pavilion",
    activeGuests: 45, staffOnDuty: 10,
    surroundsHotel: false,
    aiMitigation: "🟡 MODERATE: Wind advisory active. Outdoor umbrellas anchored.",
    lx: 145, ly: 350,
    pathD: "M 140,270 L 195,300 L 195,380 L 140,395 C 100,385 85,360 100,335 C 118,315 105,295 140,270 Z",
  },
  {
    id: "rajasthan",
    stateName: "Rajasthan (Jaipur Palace)",
    shortCode: "RJ",
    capital: "Jaipur",
    region: "Thar Desert & Aravalli",
    severity: "SAFE",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    weatherCondition: "Clear Dry Sky & Favorable Sun (10% Precip)",
    temp: 32.1, precipProb: 10, humidity: 24, windSpeed: 14, riskScore: 12,
    resortEntities: "Royal Heritage Palace Resort (Jaipur)",
    activeGuests: 110, staffOnDuty: 22,
    surroundsHotel: false,
    aiMitigation: "🟢 SAFE: Normal courtyard, pool & dining operations active. High guest rating.",
    lx: 225, ly: 255,
    pathD: "M 160,205 L 265,185 L 295,245 L 255,325 L 180,315 L 145,270 Z",
  },
  {
    id: "madhya_pradesh",
    stateName: "Madhya Pradesh (Central Hub)",
    shortCode: "MP",
    capital: "Bhopal",
    region: "Central India Plateau",
    severity: "SAFE",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    weatherCondition: "Mild Overcast & Passing Clouds (30% Precip)",
    temp: 29.8, precipProb: 30, humidity: 55, windSpeed: 12, riskScore: 22,
    resortEntities: "Kanha Forest & Central Eco Lodge",
    activeGuests: 40, staffOnDuty: 9,
    surroundsHotel: false,
    aiMitigation: "🟢 SAFE: Jungle safaris and outdoor events operating on schedule.",
    lx: 335, ly: 340,
    pathD: "M 265,245 L 390,260 L 420,330 L 370,400 L 280,360 L 255,325 Z",
  },
  {
    id: "punjab_haryana_delhi",
    stateName: "Punjab, Haryana & Delhi NCR",
    shortCode: "PB/DEL",
    capital: "New Delhi",
    region: "Northern Plains",
    severity: "SAFE",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    weatherCondition: "Clear Sky & Pleasant Airflow (18% Precip)",
    temp: 28.0, precipProb: 18, humidity: 48, windSpeed: 10, riskScore: 18,
    resortEntities: "Northern Transit Lounge & Executive Hub",
    activeGuests: 35, staffOnDuty: 8,
    surroundsHotel: false,
    aiMitigation: "🟢 SAFE: All transit routes open. Seamless guest logistics.",
    lx: 275, ly: 155,
    pathD: "M 215,95 L 255,135 L 285,180 L 230,175 L 210,135 Z",
  },
  {
    id: "himachal_jk_ladakh",
    stateName: "Himachal, J&K & Ladakh",
    shortCode: "JK/HP",
    capital: "Shimla / Srinagar",
    region: "Northern Himalayas",
    severity: "SAFE",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    weatherCondition: "Cool Mountain Air & High Sunshine (15% Precip)",
    temp: 16.8, precipProb: 15, humidity: 40, windSpeed: 8, riskScore: 14,
    resortEntities: "Himalayan Ridge Retreat & Manali Chalet",
    activeGuests: 82, staffOnDuty: 19,
    surroundsHotel: false,
    aiMitigation: "🟢 SAFE: Mountain hiking trails open. High scenic satisfaction score.",
    lx: 280, ly: 65,
    pathD: "M 225,40 C 255,20 295,15 325,30 C 350,45 375,65 355,100 L 325,145 L 255,135 L 215,95 Z",
  },
  {
    id: "uttar_pradesh",
    stateName: "Uttar Pradesh & Bihar",
    shortCode: "UP/BR",
    capital: "Lucknow",
    region: "Gangetic Plains",
    severity: "MODERATE",
    color: "#eab308",
    glowColor: "rgba(234, 179, 8, 0.4)",
    weatherCondition: "Passing Monsoon Mist & Drizzle (48% Precip)",
    temp: 31.0, precipProb: 48, humidity: 68, windSpeed: 12, riskScore: 42,
    resortEntities: "Heritage Cultural Pavilions (Agra/Varanasi)",
    activeGuests: 60, staffOnDuty: 14,
    surroundsHotel: false,
    aiMitigation: "🟡 MODERATE: Indoor heritage experiences active. Weather alerts sent to travelers.",
    lx: 395, ly: 220,
    pathD: "M 285,180 L 400,195 L 485,215 L 475,290 L 390,260 L 295,245 Z",
  },
  {
    id: "west_bengal_odisha",
    stateName: "West Bengal & Odisha",
    shortCode: "WB/OD",
    capital: "Kolkata",
    region: "Bay of Bengal Eastern Coast",
    severity: "MODERATE",
    color: "#eab308",
    glowColor: "rgba(234, 179, 8, 0.4)",
    weatherCondition: "Bay of Bengal Moisture Band (60% Precip)",
    temp: 28.9, precipProb: 60, humidity: 82, windSpeed: 22, riskScore: 50,
    resortEntities: "Sundarbans Eco Pavilion & Puri Beach Resort",
    activeGuests: 50, staffOnDuty: 12,
    surroundsHotel: false,
    aiMitigation: "🟡 MODERATE: Coastal radar watch active. Backup power generators verified.",
    lx: 490, ly: 355,
    pathD: "M 420,330 L 515,310 L 530,390 L 450,420 L 370,400 Z",
  },
  {
    id: "northeast_states",
    stateName: "North-East Seven Sisters",
    shortCode: "NE",
    capital: "Guwahati",
    region: "Eastern Himalayas & Assam",
    severity: "HIGH",
    color: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.5)",
    weatherCondition: "Hill Station Cloudburst (78% Precip)",
    temp: 21.4, precipProb: 78, humidity: 90, windSpeed: 18, riskScore: 65,
    resortEntities: "Assam Tea Estate Pavilion & Sanctuary",
    activeGuests: 48, staffOnDuty: 12,
    surroundsHotel: false,
    aiMitigation: "🟠 HIGH: Heavy rain in tea plantations. Indoor artisanal tea tasting active.",
    lx: 650, ly: 225,
    pathD: "M 535,210 L 610,185 L 720,205 L 690,305 L 620,285 L 570,235 Z",
  },
  {
    id: "andaman_nicobar",
    stateName: "Andaman & Nicobar Islands",
    shortCode: "AN",
    capital: "Port Blair",
    region: "Bay of Bengal Archipelago",
    severity: "RADAR",
    color: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.5)",
    weatherCondition: "Tropical Marine Breeze & Ocean Radar Watch",
    temp: 28.4, precipProb: 40, humidity: 80, windSpeed: 15, riskScore: 35,
    resortEntities: "Havelock Island Luxury Beach Resort",
    activeGuests: 52, staffOnDuty: 10,
    surroundsHotel: false,
    aiMitigation: "🔷 RADAR WATCH: Island marine radar active. Water sports running in calm bays.",
    lx: 670, ly: 640,
    pathD: "M 660,600 A 7,7 0 1,0 660,614 A 7,7 0 1,0 660,600 M 675,645 A 9,9 0 1,0 675,663 A 9,9 0 1,0 675,645 M 690,695 A 8,8 0 1,0 690,711 A 8,8 0 1,0 690,695",
  },
  {
    id: "lakshadweep",
    stateName: "Lakshadweep Islands",
    shortCode: "LD",
    capital: "Kavaratti",
    region: "Arabian Sea Coral Atolls",
    severity: "RADAR",
    color: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.5)",
    weatherCondition: "Coral Atoll Wind Watch & Clear Lagoons",
    temp: 29.0, precipProb: 35, humidity: 78, windSpeed: 12, riskScore: 30,
    resortEntities: "Bangaram Coral Atoll Eco Resort",
    activeGuests: 30, staffOnDuty: 7,
    surroundsHotel: false,
    aiMitigation: "🔷 RADAR WATCH: Lagoon waters calm. Snorkeling & lagoon dining operational.",
    lx: 145, ly: 695,
    pathD: "M 145,675 A 6,6 0 1,0 145,687 A 6,6 0 1,0 145,675 M 160,710 A 7,7 0 1,0 160,724 A 7,7 0 1,0 160,710",
  },
];

// Coorg coordinates
const COORG_HOTEL_COORDS = { x: 265, y: 550, label: "Azure Hills Resort & Villas (Coorg)" };

// Simulation Scenarios
const MONSOON_PROPAGATION_STEPS = [
  {
    step: 1,
    phase: "Phase 1: Arabian Sea Cyclone Depression",
    desc: "Satellite telemetry detects deep monsoon low-pressure formation off the Konkan Coast, generating 45+ km/h sustained gusts.",
    activeStateId: "goa",
    severity: "HIGH",
    impact: "Goa Coastal Beach Villas trigger HIGH wind alert. Outdoor water sports secured.",
  },
  {
    step: 2,
    phase: "Phase 2: Monsoon Front Encircles Coorg Western Ghats",
    desc: "Torrential cloudburst cell makes landfall across Coorg highlands directly impacting Azure Hills Resort. Precipitation hits 88%.",
    activeStateId: "karnataka",
    severity: "CRITICAL",
    impact: "🔴 CRITICAL HOTEL IMPACT: Outdoor pool deck evacuated. 3 staff reallocated to Spa Sanctuary. Revenue +₹48,000.",
  },
  {
    step: 3,
    phase: "Phase 3: Kerala Wayanad Mountain Pass Runoff",
    desc: "Flash flood & landslide warning issued for Wayanad-Coorg boundary pass. Mountain delivery corridors impeded.",
    activeStateId: "kerala",
    severity: "CRITICAL",
    impact: "🔴 CRITICAL: Wayanad access logistics pre-dispatched. Central inventory buffer activated by Inventory Staff.",
  },
  {
    step: 4,
    phase: "Phase 4: Eastern Tamil Nadu Rain Shadow Propagation",
    desc: "Moisture band passes across Nilgiri ranges towards Tamil Nadu plains, producing intermittent mist and cool breezes.",
    activeStateId: "tamil_nadu",
    severity: "MODERATE",
    impact: "🟡 MODERATE: Nilgiri route monitored. Guest tea garden tours shifted to covered indoor glass veranda.",
  },
  {
    step: 5,
    phase: "Phase 5: Multi-Hub AI Orchestrator Stabilization",
    desc: "AI Orchestrator Agent synchronizes guest scheduling, dining shifts, and inventory replenishment across all India resorts.",
    activeStateId: "karnataka",
    severity: "CRITICAL",
    impact: "✅ ALL 142 GUESTS SAFE INDOORS: Zero service disruption. Autonomous dining menu pivoted to hot monsoon specials.",
  },
];

export function IndiaGeospatialMap() {
  const [selectedState, setSelectedState] = useState<StateSeverityInfo>(INDIAN_STATES_DATA[0]);
  const [satelliteOpacity, setSatelliteOpacity] = useState<number>(0.75);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-run simulation
  const handleStartSimulation = () => {
    if (simTimerRef.current) clearInterval(simTimerRef.current);
    setIsSimulating(true);
    setSimStepIndex(0);
    const firstStep = MONSOON_PROPAGATION_STEPS[0];
    const match = INDIAN_STATES_DATA.find((s) => s.id === firstStep.activeStateId);
    if (match) setSelectedState(match);

    let idx = 0;
    simTimerRef.current = setInterval(() => {
      idx++;
      if (idx >= MONSOON_PROPAGATION_STEPS.length) {
        clearInterval(simTimerRef.current!);
        setIsSimulating(false);
      } else {
        setSimStepIndex(idx);
        const nextStep = MONSOON_PROPAGATION_STEPS[idx];
        const stateMatch = INDIAN_STATES_DATA.find((s) => s.id === nextStep.activeStateId);
        if (stateMatch) setSelectedState(stateMatch);
      }
    }, 3200);
  };

  const handleStopSimulation = () => {
    if (simTimerRef.current) clearInterval(simTimerRef.current);
    setIsSimulating(false);
  };

  const filteredStates = INDIAN_STATES_DATA.filter((s) =>
    s.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const satelliteSrc = "/api/satellite-image?product=insat_ctbt";

  return (
    <div className="glass-card p-0 border border-cyan-500/30 bg-gradient-to-br from-[#020817] via-[#040f24] to-[#010612] overflow-hidden rounded-2xl shadow-2xl shadow-cyan-950/40">
      
      {/* ── TOP CONTROL HEADER ── */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-surface-900 to-indigo-950/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30 flex-shrink-0">
            <Satellite className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
                Live Satellite Weather · India Geospatial Map
              </h2>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                INSAT-3DS DOPPLER RADAR ACTIVE
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Real-time INSAT-3DS satellite precipitation radar & meteorological severity zones
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs text-cyan-300 font-mono font-bold">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            INSAT-3DS Cloud & Storm Radar
          </div>

          {/* Simulation Button */}
          <button
            onClick={isSimulating ? handleStopSimulation : handleStartSimulation}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg",
              isSimulating
                ? "bg-red-600 hover:bg-red-500 text-white border border-red-400/50"
                : "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white"
            )}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Stop Sim
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                Simulate Monsoon
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── SATELLITE PHOTO CONTROLS & SEVERITY LEGEND BAR ── */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-black/60 border-b border-white/10 text-xs flex-wrap gap-3">
        {/* Opacity Slider for Satellite Photo */}
        <div className="flex items-center gap-2.5 text-xs text-white/70 bg-white/5 px-3 py-1 rounded-xl border border-white/10">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono">Radar Satellite Opacity:</span>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={satelliteOpacity}
            onChange={(e) => setSatelliteOpacity(parseFloat(e.target.value))}
            className="w-24 accent-cyan-400 cursor-pointer"
          />
          <span className="text-[11px] font-mono text-cyan-300 font-bold">{Math.round(satelliteOpacity * 100)}%</span>
        </div>

        {/* Severity Legend */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <span className="flex items-center gap-1.5 text-red-400 font-bold text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500 animate-ping" />
            🔴 Critical (KA, KL)
          </span>
          <span className="flex items-center gap-1.5 text-orange-400 font-bold text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500" />
            🟠 High Risk (GA, MH)
          </span>
          <span className="flex items-center gap-1.5 text-yellow-400 font-bold text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400" />
            🟡 Moderate (GJ, AP, TN)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
            🟢 Safe (RJ, MP, HP)
          </span>
        </div>

        {/* Coorg Coordinates */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-lg border border-cyan-500/20">
          <MapPin className="w-3 h-3 text-cyan-400" />
          <span>COORG: 12.3375° N, 75.8069° E</span>
        </div>
      </div>

      {/* ── MAIN MAP BODY: SATELLITE PHOTO CANVAS + TELEMETRY PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[640px]">
        
        {/* ══ MAP CANVAS (8 Cols) ══ */}
        <div className="lg:col-span-7 xl:col-span-8 relative bg-gradient-to-b from-[#01091a] via-[#020e24] to-[#010610] p-0 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 group min-h-[580px]">
          
          {/* SATELLITE PHOTO OVERLAY FROM INSAT */}
          <div
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center overflow-hidden"
            style={{ opacity: satelliteOpacity }}
          >
            <img
              src={satelliteSrc}
              alt="INSAT-3DS Live Weather Satellite Radar"
              className="w-full h-full object-cover object-center filter contrast-125 brightness-95"
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-[#020817] opacity-60" />
          </div>

          {/* Tactical Coordinate Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70f_1px,transparent_1px),linear-gradient(to_bottom,#0284c70f_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none z-10" />

          {/* Compass Indicator */}
          <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 shadow-xl text-center flex flex-col items-center">
            <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <span className="text-[9px] font-mono font-bold text-white/60 mt-1">N 37°</span>
          </div>

          {/* Top Left Live Satellite Badge */}
          <div className="absolute top-4 left-4 z-20 bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-cyan-500/30 text-xs shadow-xl space-y-0.5">
            <div className="flex items-center gap-1.5 text-white font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              INSAT-3DS COLOR DOPPLER RADAR
            </div>
            <div className="text-[10px] text-cyan-300 font-mono">
              Live Weather Satellite Telemetry · Real-time Orbit
            </div>
          </div>

          {/* Scale Indicator */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-white/60">
            <div className="w-12 h-1 bg-cyan-400 rounded-full" />
            <span>Scale: ≈ 450 KM</span>
          </div>

          {/* INTERACTIVE SVG VECTOR LAYER OVERLAY */}
          <svg
            className="relative z-10 w-full h-full max-h-[660px] select-none transition-all duration-500"
            viewBox="0 0 800 920"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ocean Water Typography */}
            <text x="60" y="580" fill="rgba(56, 189, 248, 0.45)" fontSize="14" fontWeight="bold" fontFamily="monospace" letterSpacing="4">
              ARABIAN SEA
            </text>
            <text x="540" y="580" fill="rgba(56, 189, 248, 0.45)" fontSize="14" fontWeight="bold" fontFamily="monospace" letterSpacing="4">
              BAY OF BENGAL
            </text>
            <text x="320" y="870" fill="rgba(56, 189, 248, 0.45)" fontSize="14" fontWeight="bold" fontFamily="monospace" letterSpacing="4">
              INDIAN OCEAN
            </text>

            {/* Coastline Boundary Contour */}
            <path
              d="
                M 225,40 C 255,20 295,15 325,30 C 350,45 375,65 355,100 L 325,145 L 285,180 L 400,195 
                L 485,215 L 535,210 L 610,185 L 720,205 L 690,305 L 620,285 L 570,235 L 515,310 
                L 530,390 L 450,420 L 435,530 L 400,580 L 380,685 L 320,735 L 280,700 L 250,735 
                L 235,680 L 255,600 L 235,530 L 215,518 L 205,430 L 195,380 L 140,395 
                C 100,385 85,360 100,335 C 118,315 105,295 140,270 L 160,205 L 215,95 Z
              "
              fill="none"
              stroke="rgba(56, 189, 248, 0.6)"
              strokeWidth="2.5"
            />

            {/* ALL 16 INDIAN STATE POLYGONS */}
            {INDIAN_STATES_DATA.map((st) => {
              const isSelected = selectedState.id === st.id;
              const isSimActive = isSimulating && MONSOON_PROPAGATION_STEPS[simStepIndex]?.activeStateId === st.id;

              return (
                <g key={st.id} className="cursor-pointer" onClick={() => setSelectedState(st)}>
                  {/* Outer Glow Halo on Selection */}
                  {(isSelected || isSimActive) && (
                    <path
                      d={st.pathD}
                      fill={st.color}
                      fillOpacity={0.3}
                      stroke={st.color}
                      strokeWidth="5"
                      strokeOpacity="0.5"
                      filter="url(#activeGlow)"
                    />
                  )}

                  {/* State SVG Boundary Path */}
                  <path
                    d={st.pathD}
                    fill={st.color}
                    fillOpacity={
                      isSelected || isSimActive
                        ? 0.75
                        : 0.22 // Elegant semi-transparent so satellite radar photo shows through
                    }
                    stroke={st.color}
                    strokeWidth={isSelected || isSimActive ? "3.2" : "1.8"}
                    strokeOpacity={isSelected ? 1 : 0.85}
                    className="transition-all duration-300 hover:fill-opacity-70"
                  />

                  {/* State Name Label */}
                  <text
                    x={st.lx}
                    y={st.ly}
                    fill="#ffffff"
                    fontSize={isSelected ? "11" : "9"}
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="pointer-events-none select-none drop-shadow-md tracking-wider uppercase"
                  >
                    {st.shortCode}
                  </text>
                </g>
              );
            })}

            {/* HOTEL SURROUNDING RADIUS RINGS (Coorg epicenter) */}
            <g>
              {/* 40 KM Immediate Zone */}
              <circle
                cx={COORG_HOTEL_COORDS.x}
                cy={COORG_HOTEL_COORDS.y}
                r="45"
                fill="rgba(239, 68, 68, 0.12)"
                stroke="#ef4444"
                strokeWidth="1.8"
                strokeDasharray="4 3"
                className="animate-spin-slow"
              />
              {/* 100 KM Regional Buffer */}
              <circle
                cx={COORG_HOTEL_COORDS.x}
                cy={COORG_HOTEL_COORDS.y}
                r="85"
                fill="none"
                stroke="rgba(239, 68, 68, 0.45)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              {/* 180 KM Macro Western Ghats Corridor */}
              <circle
                cx={COORG_HOTEL_COORDS.x}
                cy={COORG_HOTEL_COORDS.y}
                r="130"
                fill="none"
                stroke="rgba(56, 189, 248, 0.35)"
                strokeWidth="1.2"
                strokeDasharray="8 6"
              />

              {/* Pulse Ring for Hotel */}
              <circle
                cx={COORG_HOTEL_COORDS.x}
                cy={COORG_HOTEL_COORDS.y}
                r="24"
                fill="#ef4444"
                opacity="0.4"
                className="animate-ping"
              />

              {/* Golden Star Hotel Marker Pin */}
              <circle
                cx={COORG_HOTEL_COORDS.x}
                cy={COORG_HOTEL_COORDS.y}
                r="13"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="2.5"
                className="shadow-2xl"
              />
              <text
                x={COORG_HOTEL_COORDS.x}
                y={COORG_HOTEL_COORDS.y + 4.5}
                fill="#000000"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                className="pointer-events-none select-none font-bold"
              >
                ★
              </text>

              {/* Hotel Flag Callout Badge */}
              <g className="cursor-pointer" onClick={() => setSelectedState(INDIAN_STATES_DATA[0])}>
                <rect
                  x={COORG_HOTEL_COORDS.x - 90}
                  y={COORG_HOTEL_COORDS.y - 42}
                  width="180"
                  height="26"
                  rx="6"
                  fill="rgba(0,0,0,0.9)"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <text
                  x={COORG_HOTEL_COORDS.x}
                  y={COORG_HOTEL_COORDS.y - 25}
                  fill="#fcd34d"
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="select-none"
                >
                  ⭐ AZURE HILLS RESORT (COORG)
                </text>
              </g>
            </g>

            {/* Connecting Supply Logistics Lines to Regional Nodes */}
            <g stroke="rgba(245, 158, 11, 0.5)" strokeWidth="1.8" strokeDasharray="5 3" fill="none">
              <line x1={COORG_HOTEL_COORDS.x} y1={COORG_HOTEL_COORDS.y} x2="225" y2="505" />
              <line x1={COORG_HOTEL_COORDS.x} y1={COORG_HOTEL_COORDS.y} x2="265" y2="650" />
              <line x1={COORG_HOTEL_COORDS.x} y1={COORG_HOTEL_COORDS.y} x2="250" y2="430" />
              <line x1={COORG_HOTEL_COORDS.x} y1={COORG_HOTEL_COORDS.y} x2="330" y2="640" />
            </g>
          </svg>
        </div>

        {/* ══ RIGHT TELEMETRY & SIMULATION INSPECTOR PANEL (4-5 Cols) ══ */}
        <div className="lg:col-span-5 xl:col-span-4 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-gradient-to-b from-surface-900/95 via-black/80 to-surface-950">
          

          {/* Search / State Switcher Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Indian state or resort entity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Quick State Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filteredStates.slice(0, 5).map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedState(st)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all border",
                  selectedState.id === st.id
                    ? "bg-white text-black font-bold border-white"
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                )}
              >
                {st.shortCode}
              </button>
            ))}
          </div>

          {/* Selected State Telemetry Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedState.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-4 border transition-all space-y-3.5 bg-surface-900/90 shadow-xl"
              style={{ borderColor: selectedState.color }}
            >
              {/* State Header Title */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-white/10">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: selectedState.color }} />
                    <span>{selectedState.stateName}</span>
                  </div>
                  <div className="text-[10px] text-white/50 mt-0.5">
                    {selectedState.region} · Capital: {selectedState.capital}
                  </div>
                </div>
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full font-mono text-white flex-shrink-0"
                  style={{
                    backgroundColor: `${selectedState.color}33`,
                    border: `1px solid ${selectedState.color}`,
                    color: selectedState.color,
                  }}
                >
                  {SEVERITY_CONFIG[selectedState.severity].badge}
                </span>
              </div>

              {/* Weather Telemetry KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <div className="text-white/40 text-[9px] uppercase font-mono">Temp</div>
                  <div className="text-base font-bold text-white mt-0.5">{selectedState.temp}°C</div>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <div className="text-white/40 text-[9px] uppercase font-mono">Precipitation</div>
                  <div className="text-base font-bold text-cyan-300 mt-0.5">{selectedState.precipProb}%</div>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <div className="text-white/40 text-[9px] uppercase font-mono">Wind Speed</div>
                  <div className="text-base font-bold text-amber-300 mt-0.5">{selectedState.windSpeed} km/h</div>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <div className="text-white/40 text-[9px] uppercase font-mono">Risk Index</div>
                  <div className="text-base font-bold text-red-300 mt-0.5">{selectedState.riskScore}/100</div>
                </div>
              </div>

              {/* Resort Operations & Weather Description */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-start justify-between text-white/70">
                  <span className="text-white/40">Resort Entity:</span>
                  <strong className="text-white font-mono text-right">{selectedState.resortEntities}</strong>
                </div>
                <div className="flex items-start justify-between text-white/70">
                  <span className="text-white/40">Weather Condition:</span>
                  <strong className="text-white text-right">{selectedState.weatherCondition}</strong>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span className="text-white/40">Active Guests:</span>
                  <strong className="text-emerald-300">{selectedState.activeGuests} Guests Checked In</strong>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span className="text-white/40">On-Duty Staff:</span>
                  <strong className="text-cyan-300">{selectedState.staffOnDuty} Hospitality Agents</strong>
                </div>
              </div>

              {/* AI Autonomous Mitigation Advisory */}
              <div
                className="p-3 rounded-xl text-xs font-mono font-bold leading-relaxed border shadow-sm"
                style={{
                  backgroundColor: `${selectedState.color}15`,
                  borderColor: `${selectedState.color}45`,
                  color: selectedState.color,
                }}
              >
                {selectedState.aiMitigation}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Simulation Progress Card */}
          {isSimulating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-4 border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 via-surface-950 to-black space-y-2 border"
            >
              <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Monsoon Propagation Vector
                </span>
                <span className="font-mono text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-300 border border-cyan-500/30">
                  Phase {simStepIndex + 1} / {MONSOON_PROPAGATION_STEPS.length}
                </span>
              </div>
              <div className="text-xs font-bold text-white">
                {MONSOON_PROPAGATION_STEPS[simStepIndex].phase}
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {MONSOON_PROPAGATION_STEPS[simStepIndex].desc}
              </p>
              <div className="text-xs font-mono font-bold text-emerald-300 bg-black/60 p-2.5 rounded-lg border border-white/5">
                ⚡ Operational Action: {MONSOON_PROPAGATION_STEPS[simStepIndex].impact}
              </div>
            </motion.div>
          )}

          {/* Quick Action Footer */}
          <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/5">
            <span>Click any state polygon to sync telemetry</span>
            <button
              onClick={() => setSelectedState(INDIAN_STATES_DATA[0])}
              className="text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1"
            >
              Reset to Coorg
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
