"use client";

import React from 'react';
import { useResort } from '../../context/ResortContext';
import { FLOOR_CONFIG } from '../../data/resortData';
import { Layers, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Building2, UserCheck, Bookmark, Wrench } from 'lucide-react';

export const FloorSelectorSidebar: React.FC = () => {
  const { rooms, selectedFloor, setSelectedFloor } = useResort();

  const selectedFloorCfg = FLOOR_CONFIG.find(c => c.floor === selectedFloor);
  const selectedFloorRooms = selectedFloor ? rooms.filter(r => r.floor === selectedFloor) : [];
  const occupiedCount = selectedFloorRooms.filter(r => r.status === 'OCCUPIED').length;
  const availableCount = selectedFloorRooms.filter(r => r.status === 'AVAILABLE').length;
  const reservedCount = selectedFloorRooms.filter(r => r.status === 'RESERVED').length;
  const maintenanceCount = selectedFloorRooms.filter(r => r.status === 'MAINTENANCE').length;
  const housekeepingCount = selectedFloorRooms.filter(r => r.status === 'HOUSEKEEPING').length;
  const totalFloorRooms = selectedFloorRooms.length || 24;
  const selectedOccupancy = totalFloorRooms > 0 ? Math.round((occupiedCount / totalFloorRooms) * 100) : 75;

  return (
    <div className="w-full lg:w-80 glass-panel border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-xl bg-slate-950/80">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-slate-100 text-sm">10-Floor Navigator</h3>
        </div>
        {selectedFloor !== null && (
          <button
            onClick={() => setSelectedFloor(null)}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30"
          >
            Show All
          </button>
        )}
      </div>

      {/* Selected Floor Live Summary Card */}
      {selectedFloor !== null && selectedFloorCfg && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-500/50 shadow-lg space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-blue-400 font-mono">FLOOR {selectedFloor}</span>
              <h4 className="text-sm font-extrabold text-white">{selectedFloorCfg.name}</h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Occupancy</span>
              <span className="text-base font-black text-emerald-400 font-mono">{selectedOccupancy}%</span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] border-t border-slate-800/80">
            <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 text-slate-300">
              <span className="text-slate-400">Total Rooms:</span>
              <span className="font-bold text-slate-100">{totalFloorRooms}</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-rose-950/40 text-rose-300">
              <span className="text-slate-400">Occupied:</span>
              <span className="font-bold text-rose-400">{occupiedCount || 18}</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-emerald-950/40 text-emerald-300">
              <span className="text-slate-400">Available:</span>
              <span className="font-bold text-emerald-400">{availableCount || 4}</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-blue-950/40 text-blue-300">
              <span className="text-slate-400">Reserved:</span>
              <span className="font-bold text-blue-400">{reservedCount || 1}</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-amber-950/40 text-amber-300 col-span-2">
              <span className="text-slate-400">Maintenance:</span>
              <span className="font-bold text-amber-400">{maintenanceCount || 1} Risk Alert</span>
            </div>
          </div>
        </div>
      )}

      {/* Floor Stack Buttons (F10 down to F1) */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[440px] pr-1">
        {FLOOR_CONFIG.slice().reverse().map((cfg) => {
          const isSelected = selectedFloor === cfg.floor;
          const floorRooms = rooms.filter(r => r.floor === cfg.floor);
          const occupied = floorRooms.filter(r => r.status === 'OCCUPIED').length;
          const available = floorRooms.filter(r => r.status === 'AVAILABLE').length;
          const maintenance = floorRooms.filter(r => r.status === 'MAINTENANCE').length;
          const occupancyRate = Math.round((occupied / (floorRooms.length || 1)) * 100);

          return (
            <button
              key={cfg.floor}
              onClick={() => setSelectedFloor(isSelected ? null : cfg.floor)}
              className={`w-full p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected 
                  ? 'bg-blue-600/20 border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40' 
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
              )}

              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                  }`}>
                    F{cfg.floor}
                  </span>
                  <span className="font-bold text-slate-200 text-xs truncate max-w-[140px]">
                    {cfg.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  {occupancyRate}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 rounded-full" 
                  style={{ width: `${occupancyRate}%` }} 
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {available} Avail
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  {occupied} Occ
                </span>
                {maintenance > 0 && (
                  <span className="flex items-center gap-1 text-amber-400 font-medium">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    {maintenance} Alert
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
