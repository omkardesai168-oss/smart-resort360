"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Building2, Eye, Layers, Activity, Sparkles, Sliders, 
  BedDouble, Waves, Star, RefreshCw, Key, ShieldCheck, Thermometer
} from "lucide-react";
import dynamic from "next/dynamic";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { ResortProvider, useResort } from "@/context/ResortContext";
import { FloorSelectorSidebar } from "@/components/digital-twin/FloorSelectorSidebar";
import { RoomDetailModal } from "@/components/digital-twin/RoomDetailModal";
import { RoomStatusLegend } from "@/components/digital-twin/RoomStatusLegend";

const Resort3DCanvas = dynamic(
  () => import("@/components/digital-twin/Resort3DCanvas").then((mod) => mod.Resort3DCanvas),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-950/80 text-cyan-400">Loading 3D Resort Digital Twin...</div> }
);

function ManagerDigitalTwinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("tab") === "revenue") {
      router.replace("/operations/revenue-simulator");
    }
  }, [searchParams, router]);

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
    maintenanceAlertCount,
    resetDemoData
  } = useResort();

  const [statusFilter, setStatusFilter] = useState<any>(null);

  // Quick select an occupied room (e.g. Room 904)
  const sampleVipRoom = rooms.find((r) => r.roomNumber === 904) || rooms.find((r) => r.status === "OCCUPIED");

  return (
    <PageContainer>
      <PageHeader
        title="Digital Twin"
        description="3D immersive spatial model of your entire property in real time with IoT telemetry"
        icon={Building2}
        badge="3D TWIN"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/operations/revenue-simulator"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all flex items-center gap-1.5 border border-white/[0.08] shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-brand-400" />
              <span>Revenue Simulator</span>
            </Link>

            {sampleVipRoom && (
              <button
                onClick={() => {
                  setSelectedFloor(sampleVipRoom.floor);
                  setSelectedRoom(sampleVipRoom);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-xs font-semibold text-brand-300 transition-all shadow-sm active:scale-95"
              >
                <Key className="w-3.5 h-3.5 text-brand-400" />
                <span>Suite 904 (VIP)</span>
              </button>
            )}

            <button
              onClick={resetDemoData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white/70 hover:text-white transition-all active:scale-95"
              title="Reset Twin State"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        }
      />

      {/* Manager KPI Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-white/50 font-medium">Total Property</div>
            <div className="text-sm font-bold text-white">10 Floors • {rooms.length} Suites</div>
          </div>
        </div>

        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BedDouble className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-white/50 font-medium">Occupancy Rate</div>
            <div className="text-sm font-bold text-emerald-400">{occupancyRate}% ({occupiedCount} Occupied)</div>
          </div>
        </div>

        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Star className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-white/50 font-medium">Available Inventory</div>
            <div className="text-sm font-bold text-white">{availableCount} Rooms Ready</div>
          </div>
        </div>

        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-white/50 font-medium">Operational Health</div>
            <div className="text-sm font-bold text-amber-300">
              {maintenanceAlertCount > 0 ? `${maintenanceAlertCount} Alerts` : "All Systems Optimal"}
            </div>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas & Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* 3D Canvas */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <Resort3DCanvas />
          <RoomStatusLegend activeFilter={statusFilter} onSelectFilter={setStatusFilter} />
        </div>

        {/* Right Controls & Insights Column */}
        <div className="space-y-4">
          <FloorSelectorSidebar />

          {/* Operational AI Insights Card (Preserved manager functionality) */}
          <div className="glass-card p-4 space-y-3">
            <div className="text-white/50 text-xs uppercase font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-ai-light" />
              <span>AI Operations Insights</span>
            </div>
            <div className="space-y-2 text-xs text-white/70">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="text-ai-light font-bold">→</span>
                <span>Floor 9 & 10 Luxury Suites demand surging (+22%). Recommend dynamic rate lock.</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="text-ai-light font-bold">→</span>
                <span>HVAC smart telemetry: All zone temperatures stable between 21.5°C and 23.0°C.</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="text-ai-light font-bold">→</span>
                <span>Lotus Wellness Spa afternoon slots open — automatic cross-sell push triggered.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Detail Modal (specs, photo gallery, 3D room interior tour, allocation) */}
      <RoomDetailModal isManager={true} />
    </PageContainer>
  );
}

export default function DigitalTwinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-white/50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center animate-pulse">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm">Loading 3D Digital Twin...</span>
          </div>
        </div>
      }
    >
      <ResortProvider>
        <ManagerDigitalTwinContent />
      </ResortProvider>
    </Suspense>
  );
}
