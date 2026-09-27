"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ResortProvider, useResort } from "@/context/ResortContext";
import { FloorSelectorSidebar } from "@/components/digital-twin/FloorSelectorSidebar";
import { RoomDetailModal } from "@/components/digital-twin/RoomDetailModal";
import { RoomStatusLegend } from "@/components/digital-twin/RoomStatusLegend";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";

const Resort3DCanvas = dynamic(
  () => import("@/components/digital-twin/Resort3DCanvas").then((mod) => mod.Resort3DCanvas),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-950/80 text-cyan-400">Loading 3D Resort Digital Twin...</div> }
);
import { 
  Building2, Sparkles, BedDouble, Eye, Compass, ShieldCheck, 
  Layers, Waves, CheckCircle2, Star, Key, RefreshCw
} from "lucide-react";

function GuestDigitalTwinContent() {
  const { 
    rooms, 
    selectedRoom, 
    setSelectedRoom, 
    selectedFloor, 
    setSelectedFloor, 
    selectedGuest,
    availableCount, 
    occupiedCount, 
    occupancyRate,
    resetDemoData
  } = useResort();

  const [statusFilter, setStatusFilter] = useState<any>(null);

  // Quick select guest's room (Room 904 or 806)
  const guestAssignedRoom = rooms.find(r => r.roomNumber === 904) || rooms.find(r => r.status === "OCCUPIED");

  return (
    <PageContainer>
      <PageHeader 
        title="3D Guest Digital Twin" 
        description="Immersive 3D interactive property model — inspect suites, experience 3D room tours, and explore resort facilities" 
        icon={Building2} 
        badge="3D TWIN"
        actions={
          <div className="flex items-center gap-2">
            {guestAssignedRoom && (
              <button
                onClick={() => {
                  setSelectedFloor(guestAssignedRoom.floor);
                  setSelectedRoom(guestAssignedRoom);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-xs font-semibold text-brand-300 transition-all shadow-sm active:scale-95"
              >
                <Key className="w-3.5 h-3.5 text-brand-400" />
                <span>My Room ({guestAssignedRoom.roomNumber})</span>
              </button>
            )}
            <button
              onClick={resetDemoData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white/70 hover:text-white transition-all"
              title="Reset Twin State"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        }
      />

      {/* Guest Experience Highlight Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-white/50 font-medium">Resort Property</div>
            <div className="text-sm font-bold text-white">10 Floors • 240 Rooms</div>
          </div>
        </div>

        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BedDouble className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-white/50 font-medium">Available Rooms</div>
            <div className="text-sm font-bold text-emerald-400">{availableCount} Suites Ready</div>
          </div>
        </div>

        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Star className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-white/50 font-medium">Guest Profile</div>
            <div className="text-sm font-bold text-white truncate max-w-[140px]">{selectedGuest.name}</div>
          </div>
        </div>

        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-white/50 font-medium">Amenities Live</div>
            <div className="text-sm font-bold text-amber-300">Pool, Spa & Gym Open</div>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas & Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* 3D Canvas Area */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <Resort3DCanvas />
          <RoomStatusLegend activeFilter={statusFilter} onSelectFilter={setStatusFilter} />
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-4">
          <FloorSelectorSidebar />

          {/* Guest 3D Feature Guide Card */}
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>3D Guest Features</span>
            </div>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5">
                <Eye className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Click Any Room</div>
                  <div className="text-[11px] text-white/50">Inspect live room specifications, pricing, amenities, and photos.</div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5">
                <Compass className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">3D Room Interior Tour</div>
                  <div className="text-[11px] text-white/50">Step inside any suite to explore the bedroom, lighting, and balcony view in full 3D.</div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5">
                <Layers className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Explore Floors & Facilities</div>
                  <div className="text-[11px] text-white/50">Switch to exploded cutaway floor view or click on the Pool, Spa, and Gym.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Room Details Modal rendered automatically via ResortContext */}
      <RoomDetailModal />
    </PageContainer>
  );
}

export default function GuestDigitalTwinPage() {
  return (
    <ResortProvider>
      <GuestDigitalTwinContent />
    </ResortProvider>
  );
}
