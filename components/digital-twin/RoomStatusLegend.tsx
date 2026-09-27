"use client";

import React from 'react';
import { RoomStatus } from '../../types/resort';
import { CheckCircle2, UserCheck, Bookmark, Sparkles, Wrench, ShieldX } from 'lucide-react';

const LEGEND_ITEMS: { status: RoomStatus; label: string; color: string; bg: string; icon: React.ReactNode }[] = [
  { status: 'AVAILABLE', label: 'Available', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> },
  { status: 'OCCUPIED', label: 'Occupied', color: 'text-rose-400', bg: 'bg-rose-500/20 border-rose-500/40', icon: <UserCheck className="w-3.5 h-3.5 text-rose-400" /> },
  { status: 'RESERVED', label: 'Reserved', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/40', icon: <Bookmark className="w-3.5 h-3.5 text-blue-400" /> },
  { status: 'HOUSEKEEPING', label: 'Housekeeping', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/40', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
  { status: 'MAINTENANCE', label: 'Maintenance Risk', color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/40', icon: <Wrench className="w-3.5 h-3.5 text-orange-400" /> },
  { status: 'BLOCKED', label: 'Blocked / VIP', color: 'text-slate-400', bg: 'bg-slate-500/20 border-slate-500/40', icon: <ShieldX className="w-3.5 h-3.5 text-slate-400" /> }
];

export const RoomStatusLegend: React.FC<{ activeFilter?: RoomStatus | null; onSelectFilter?: (status: RoomStatus | null) => void }> = ({
  activeFilter,
  onSelectFilter
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 glass-panel rounded-xl border border-slate-800">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Filter Status:</span>
      <button
        onClick={() => onSelectFilter && onSelectFilter(null)}
        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
          !activeFilter ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
        }`}
      >
        All Rooms
      </button>

      {LEGEND_ITEMS.map((item) => {
        const isSelected = activeFilter === item.status;
        return (
          <button
            key={item.status}
            onClick={() => onSelectFilter && onSelectFilter(isSelected ? null : item.status)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${item.bg} ${
              isSelected ? 'ring-2 ring-blue-400 shadow-lg scale-105' : 'hover:opacity-90'
            }`}
          >
            {item.icon}
            <span className={item.color}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
