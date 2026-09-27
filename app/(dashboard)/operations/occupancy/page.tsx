"use client";

import { useEffect, useState } from "react";
import { Hotel, Filter } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/dashboard/page-header";
import { cn } from "@/lib/utils";

interface Room { id: string; number: string; type: string; status: string; floor: number; buildingName: string; guest: any; temperature: number; basePrice: number; }

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "border-success-DEFAULT/40 bg-success-DEFAULT/10",
  OCCUPIED: "border-brand-500/40 bg-brand-500/10",
  CLEANING: "border-warning-DEFAULT/40 bg-warning-DEFAULT/10",
  MAINTENANCE: "border-danger-DEFAULT/40 bg-danger-DEFAULT/10",
  OUT_OF_ORDER: "border-white/20 bg-white/5",
};

const FILTERS = ["ALL", "AVAILABLE", "OCCUPIED", "CLEANING", "MAINTENANCE"] as const;

export default function OccupancyPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState<typeof FILTERS[number]>("ALL");
  const [floor, setFloor] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/rooms").then((r) => r.json()).then((d) => setRooms(d.rooms || []));
  }, []);

  const filtered = rooms.filter((r) => {
    if (filter !== "ALL" && r.status !== filter) return false;
    if (floor !== null && r.floor !== floor) return false;
    return true;
  });

  const summary = {
    total: rooms.length,
    occupied: rooms.filter((r) => r.status === "OCCUPIED").length,
    available: rooms.filter((r) => r.status === "AVAILABLE").length,
    cleaning: rooms.filter((r) => r.status === "CLEANING").length,
    maintenance: rooms.filter((r) => r.status === "MAINTENANCE").length,
  };

  return (
    <PageContainer>
      <PageHeader title="Occupancy" description={`Live room status across ${summary.total} rooms & villas`} icon={Hotel} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total", value: summary.total, color: "text-white" },
          { label: "Occupied", value: summary.occupied, color: "text-brand-400" },
          { label: "Available", value: summary.available, color: "text-success-light" },
          { label: "Cleaning", value: summary.cleaning, color: "text-warning-light" },
          { label: "Maintenance", value: summary.maintenance, color: "text-danger-light" },
        ].map((s) => (
          <div key={s.label} className="kpi-card">
            <div className="metric-label">{s.label}</div>
            <div className={cn("text-3xl font-display font-bold", s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 mb-4 flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-white/40" />
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                filter === f ? "bg-brand-500/30 text-white border border-brand-500/40" : "bg-white/5 text-white/60 hover:text-white border border-transparent"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-white/40 text-xs">Floor:</span>
          <button onClick={() => setFloor(null)} className={cn("px-2 py-1 rounded text-xs", floor === null ? "bg-brand-500/30 text-white" : "bg-white/5 text-white/60")}>All</button>
          {[1, 2, 3, 4, 5].map((f) => (
            <button key={f} onClick={() => setFloor(f)} className={cn("px-2 py-1 rounded text-xs", floor === f ? "bg-brand-500/30 text-white" : "bg-white/5 text-white/60")}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filtered.slice(0, 120).map((r) => (
          <div key={r.id} className={cn("glass-card p-3 border-l-4", STATUS_STYLES[r.status])}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-white font-display font-bold">#{r.number}</div>
              <span className="text-[9px] text-white/40 uppercase">{r.type}</span>
            </div>
            <div className="text-white/50 text-[11px]">{r.buildingName} • Fl {r.floor}</div>
            {r.guest && <div className="text-brand-300 text-xs mt-1.5 truncate">👤 {r.guest.name}</div>}
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-white/40 text-[10px]">{r.temperature?.toFixed(1)}°C</span>
              <span className={cn("text-[10px] font-semibold",
                r.status === "OCCUPIED" ? "text-brand-300" :
                r.status === "AVAILABLE" ? "text-success-light" :
                r.status === "CLEANING" ? "text-warning-light" : "text-danger-light"
              )}>{r.status}</span>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
