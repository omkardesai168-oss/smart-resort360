"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, Search, Crown, AlertCircle, Building2, Sparkles, 
  Eye, Compass, BedDouble, Thermometer, Layers, X, ExternalLink, 
  ShieldCheck, Activity, Heart, CheckCircle2, ArrowRight, CalendarClock, Key
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import dynamic from "next/dynamic";
import { cn, formatINR } from "@/lib/utils";
import { Room } from "@/types/resort";

const Room3DInteriorView = dynamic(
  () => import("@/components/digital-twin/Room3DInteriorView").then((mod) => mod.Room3DInteriorView),
  { ssr: false, loading: () => <div className="w-full h-80 flex items-center justify-center bg-slate-950/80 text-cyan-400">Loading 3D Suite Tour...</div> }
);

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  loyaltyTier: string;
  loyaltyPoints: number;
  totalStays: number;
  totalSpend: number;
  isVIP: boolean;
  frictionScore: number;
  satisfactionScore: number;
  currentRoom: string | null;
  currentRoomType?: string | null;
  openIssues: number;
  dna: {
    luxury: number;
    adventure: number;
    food: number;
    spa: number;
    priceSensitivity: number;
    family: number;
  };
}

const TIER_COLORS: Record<string, string> = {
  BRONZE: "text-amber-700",
  SILVER: "text-white/70",
  GOLD: "text-accent-400",
  PLATINUM: "text-cyan-300",
  DIAMOND: "text-purple-300",
};

// Helper: build a mock/live Room object from guest profile
function getRoomForGuest(guest: Guest): Room {
  const roomNum = guest.currentRoom ? parseInt(guest.currentRoom.replace(/\D/g, "")) || 904 : 904;
  const floor = Math.max(1, Math.min(10, Math.floor(roomNum / 100) || 9));

  return {
    id: `room-${roomNum}`,
    roomNumber: roomNum,
    floor: floor,
    type: (guest.currentRoomType as any) || (floor >= 9 ? "Suite" : floor >= 6 ? "Premium" : "Deluxe"),
    status: "OCCUPIED",
    price: floor >= 9 ? 25000 : floor >= 6 ? 14000 : 10500,
    view: "Pool View",
    bedType: "King Bed",
    sizeSqFt: floor >= 9 ? 750 : 520,
    amenities: ["Private Balcony", "Jacuzzi Tub", "Smart Climate AI", "High-speed Wi-Fi", "Espresso Machine", "Ocean View"],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
    ],
    housekeepingStatus: "Ready",
    lastCleaned: "Today, 11:30 AM",
    cleanlinessScore: 98,
    maintenanceStatus: "No Issues",
    lastInspection: "Yesterday",
    equipmentHealth: 96,
    previousOccupants: 12,
    isQuietZone: true,
    isNonSmoking: true,
    distanceFromElevator: "Moderate",
    currentGuestName: guest.name,
    aiMatchScore: 96,
    aiMatchReasons: ["Prefers High Floor", "Quiet Zone match", "Luxury amenity preference"]
  };
}

export default function GuestsListPage() {
  const [data, setData] = useState<{ guests: Guest[]; total: number } | null>(null);
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<string>("");
  
  // Selected guest for detailed profile modal
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "digital-twin" | "journey">("overview");
  const [isInside3DRoom, setIsInside3DRoom] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tier) params.set("tier", tier);
    params.set("limit", "30");
    const t = setTimeout(() => {
      fetch(`/api/guests?${params}`).then((r) => r.json()).then(setData);
    }, 200);
    return () => clearTimeout(t);
  }, [search, tier]);

  const openGuestProfile = (guest: Guest, tab: "overview" | "digital-twin" | "journey" = "overview") => {
    setSelectedGuest(guest);
    setActiveTab(tab);
    setIsInside3DRoom(false);
  };

  const closeGuestProfile = () => {
    setSelectedGuest(null);
    setIsInside3DRoom(false);
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Guest Directory" 
        description="Active guest profiles with AI-driven insights, Journey DNA, and 3D Digital Twin visualization" 
        icon={Users}
        actions={
          <Link
            href="/guests/digital-twin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-xs font-semibold text-brand-300 transition-all shadow-sm active:scale-95"
          >
            <Building2 className="w-3.5 h-3.5 text-brand-400" />
            <span>Open 3D Digital Twin</span>
          </Link>
        }
      />

      <div className="glass-card p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search by name, email..." 
            className="input pl-9" 
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {["", "DIAMOND", "PLATINUM", "GOLD", "SILVER", "BRONZE"].map((t) => (
            <button 
              key={t || "ALL"} 
              onClick={() => setTier(t)} 
              className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors", tier === t ? "bg-brand-500/30 text-white border border-brand-500/40" : "bg-white/5 text-white/60 hover:text-white")}
            >
              {t || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {(data?.guests || []).map((g) => (
          <div 
            key={g.id} 
            onClick={() => openGuestProfile(g)}
            className="glass-card-hover p-4 cursor-pointer relative group border border-white/5 hover:border-brand-500/40 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold shadow-md">
                  {g.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="text-white font-semibold flex items-center gap-1.5 group-hover:text-brand-300 transition-colors">
                    {g.name}
                    {g.isVIP && <Crown className="w-3.5 h-3.5 text-accent-400" />}
                  </div>
                  <div className={cn("text-xs font-semibold", TIER_COLORS[g.loyaltyTier])}>{g.loyaltyTier}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {g.openIssues > 0 && (
                  <span className="badge-red text-[9px] flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" />{g.openIssues}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openGuestProfile(g, "digital-twin");
                  }}
                  title="View in 3D Digital Twin"
                  className="px-2 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/30 text-[10px] font-bold text-blue-300 flex items-center gap-1 transition-all"
                >
                  <Building2 className="w-3 h-3 text-blue-400" />
                  <span>3D Twin</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-white/40">Nationality</span><span className="text-white/80">{g.nationality}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Stays</span><span className="text-white/80">{g.totalStays}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Total Spend</span><span className="text-white/80 font-semibold">{formatINR(g.totalSpend)}</span></div>
              <div className="flex justify-between">
                <span className="text-white/40">Current Room</span>
                <span className="text-white/80 font-medium flex items-center gap-1">
                  {g.currentRoom || "—"}
                  {g.currentRoom && <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold">Suite</span>}
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
              <div className="text-center glass-card p-1.5">
                <div className="text-white/40">Satis.</div>
                <div className={cn("font-bold", g.satisfactionScore > 85 ? "text-success-light" : g.satisfactionScore > 70 ? "text-warning-light" : "text-danger-light")}>
                  {g.satisfactionScore.toFixed(0)}
                </div>
              </div>
              <div className="text-center glass-card p-1.5">
                <div className="text-white/40">Friction</div>
                <div className={cn("font-bold", g.frictionScore < 30 ? "text-success-light" : g.frictionScore < 60 ? "text-warning-light" : "text-danger-light")}>
                  {g.frictionScore.toFixed(0)}
                </div>
              </div>
              <div className="text-center glass-card p-1.5">
                <div className="text-white/40">Pts</div>
                <div className="text-white font-bold">{g.loyaltyPoints}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================== */}
      {/* DETAILED GUEST PROFILE MODAL WITH DIGITAL TWIN TAB */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedGuest && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
            onClick={closeGuestProfile}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl glass-panel border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden my-8 bg-slate-950 text-white"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center text-xl font-bold shadow-lg text-white">
                    {selectedGuest.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-white">{selectedGuest.name}</h2>
                      {selectedGuest.isVIP && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-amber-400" /> VIP
                        </span>
                      )}
                      <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border", TIER_COLORS[selectedGuest.loyaltyTier], "bg-white/5 border-white/10")}>
                        {selectedGuest.loyaltyTier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedGuest.email} • {selectedGuest.phone} • {selectedGuest.nationality}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/guests/digital-twin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-xs font-semibold text-blue-300 transition-all shadow-sm"
                  >
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Open Full 3D Twin</span>
                    <ExternalLink className="w-3 h-3 text-blue-400" />
                  </Link>

                  <button
                    onClick={closeGuestProfile}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-2 pt-4 pb-3 border-b border-slate-800">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    activeTab === "overview" 
                      ? "bg-brand-500/30 text-white border border-brand-500/40 shadow-glow-brand/20" 
                      : "text-slate-400 hover:text-white bg-white/[0.03] border border-transparent"
                  )}
                >
                  <Users className="w-4 h-4" />
                  <span>Profile & DNA</span>
                </button>

                <button
                  onClick={() => setActiveTab("digital-twin")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    activeTab === "digital-twin" 
                      ? "bg-blue-500/30 text-blue-200 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                      : "text-slate-400 hover:text-white bg-white/[0.03] border border-transparent"
                  )}
                >
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>3D Digital Twin</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    3D
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("journey")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    activeTab === "journey" 
                      ? "bg-brand-500/30 text-white border border-brand-500/40 shadow-glow-brand/20" 
                      : "text-slate-400 hover:text-white bg-white/[0.03] border border-transparent"
                  )}
                >
                  <Activity className="w-4 h-4" />
                  <span>Stay & Touchpoints</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="pt-4 min-h-[380px]">
                {/* 1. OVERVIEW & DNA TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Top KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="text-slate-400 text-xs font-medium">Total Spend</div>
                        <div className="text-lg font-bold text-white mt-1">{formatINR(selectedGuest.totalSpend)}</div>
                        <div className="text-[10px] text-emerald-400 mt-0.5">{selectedGuest.totalStays} lifetime visits</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="text-slate-400 text-xs font-medium">Loyalty Points</div>
                        <div className="text-lg font-bold text-brand-300 mt-1">{selectedGuest.loyaltyPoints} pts</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{selectedGuest.loyaltyTier} Tier Tier</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="text-slate-400 text-xs font-medium">Satisfaction Score</div>
                        <div className="text-lg font-bold text-emerald-400 mt-1">{selectedGuest.satisfactionScore.toFixed(0)}/100</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Friction index: {selectedGuest.frictionScore.toFixed(0)}</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="text-slate-400 text-xs font-medium">Current Allocation</div>
                        <div className="text-lg font-bold text-blue-400 mt-1">
                          Room {selectedGuest.currentRoom || "904"}
                        </div>
                        <div className="text-[10px] text-blue-300 mt-0.5">Floor 9 • Luxury Suite</div>
                      </div>
                    </div>

                    {/* AI Guest DNA */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 mb-3 text-white font-semibold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-brand-400" />
                        <span>AI Guest Persona & Preference DNA</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        {Object.entries(selectedGuest.dna).map(([trait, score]) => (
                          <div key={trait} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-slate-300 capitalize">{trait}</span>
                              <span className="font-bold text-white">{score.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-brand-gradient h-1.5 rounded-full" 
                                style={{ width: `${Math.min(100, Math.max(10, score))}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. DIGITAL TWIN TAB */}
                {activeTab === "digital-twin" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Room Overview Highlight */}
                    {(() => {
                      const room = getRoomForGuest(selectedGuest);

                      return (
                        <div>
                          {isInside3DRoom ? (
                            <div className="rounded-2xl overflow-hidden border border-blue-500/40 bg-slate-950 p-2">
                              <Room3DInteriorView 
                                room={room} 
                                onBack={() => setIsInside3DRoom(false)} 
                              />
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              {/* 3D Visual Preview / Banner */}
                              <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-950 p-5 flex flex-col justify-between relative shadow-xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none" />

                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                      ROOM {room.roomNumber}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      {room.type}
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">
                                      Floor {room.floor}
                                    </span>
                                  </div>

                                  <h3 className="text-xl font-bold text-white mb-1">
                                    Digital Twin: {selectedGuest.name}’s Suite
                                  </h3>
                                  <p className="text-xs text-slate-300 max-w-md">
                                    Real-time 3D spatial model synced with property IoT sensors. Inspect layout, climate, amenities, and step inside the room in WebGL 3D.
                                  </p>
                                </div>

                                {/* Room specs badges */}
                                <div className="grid grid-cols-3 gap-2 my-4 text-xs">
                                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                                    <div className="text-slate-400 text-[10px]">Bed & Size</div>
                                    <div className="font-bold text-white">{room.bedType} • {room.sizeSqFt} sq.ft</div>
                                  </div>
                                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                                    <div className="text-slate-400 text-[10px]">Climate / Temp</div>
                                    <div className="font-bold text-emerald-400 flex items-center gap-1">
                                      <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                                      22.5°C Optimal
                                    </div>
                                  </div>
                                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                                    <div className="text-slate-400 text-[10px]">Housekeeping</div>
                                    <div className="font-bold text-brand-300 flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                                      {room.housekeepingStatus}
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-2">
                                  <button
                                    onClick={() => setIsInside3DRoom(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
                                  >
                                    <Compass className="w-4 h-4" />
                                    <span>Enter 3D Room Interior Tour</span>
                                  </button>

                                  <Link
                                    href="/guests/digital-twin"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-bold text-xs active:scale-95 transition-all"
                                  >
                                    <Building2 className="w-4 h-4 text-blue-400" />
                                    <span>Full Property Twin</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </div>

                              {/* Amenities & AI Match Reasons */}
                              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                                <div className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Suite Amenities</span>
                                </div>

                                <div className="space-y-1.5">
                                  {room.amenities.map((amenity) => (
                                    <div key={amenity} className="flex items-center gap-2 text-xs text-slate-300 p-1.5 rounded-lg bg-white/[0.02]">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                      <span>{amenity}</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="pt-2 border-t border-slate-800">
                                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                    AI Matching Factors
                                  </div>
                                  <div className="space-y-1">
                                    {room.aiMatchReasons?.map((reason, idx) => (
                                      <div key={idx} className="text-[11px] text-blue-300 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        <span>{reason}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 3. JOURNEY & TOUCHPOINTS TAB */}
                {activeTab === "journey" && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <div className="text-xs font-semibold text-white uppercase tracking-wider">
                        Recent Stays & Guest Touchpoints
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                          <div>
                            <div className="font-semibold text-white">Current Stay • Room {selectedGuest.currentRoom || "904"}</div>
                            <div className="text-slate-400 text-[11px]">Checked in Today • 3 Nights Booked</div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            Active In-House
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-slate-400">
                          <div>
                            <div className="font-semibold text-slate-300">Previous Stay • Villa 102</div>
                            <div className="text-slate-500 text-[11px]">3 months ago • 5 Nights • Satisfaction: 5/5</div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
