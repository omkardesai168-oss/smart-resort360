"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useResort } from '../../context/ResortContext';
import { Room } from '../../types/resort';
import { Room3DInteriorView } from './Room3DInteriorView';
import { DigitalTwinPaymentModal } from './DigitalTwinPaymentModal';
import { 
  X, CheckCircle2, Sparkles, Wrench, ShieldAlert, 
  Wifi, Tv, Coffee, Wind, Eye, Bed, Maximize2, DollarSign,
  UserCheck, Layers, ChevronRight, ArrowRight, Move3D, Camera, LogIn, Lock, CreditCard
} from 'lucide-react';

const SKETCHFAB_EMBED_URL = `https://sketchfab.com/models/f5d2584af20c4c778e22544c1c1334c6/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=1&ui_stop=0&ui_theatre=1&ui_watermark=0`;

export const RoomDetailModal: React.FC<{ isManager?: boolean }> = ({ isManager }) => {
  const pathname = usePathname();
  const isManagerTab = isManager || pathname === "/digital-twin" || pathname.startsWith("/operations");

  const { 
    selectedRoom, 
    setSelectedRoom, 
    selectedGuest, 
    assignRoom, 
    updateRoomStatus,
    setCustomerPreviewRoom,
    setActiveTab 
  } = useResort();

  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [viewTab, setViewTab] = useState<'PHOTOS' | '3D_TOUR'>('PHOTOS');
  const [isFullRoomTour, setIsFullRoomTour] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  if (!selectedRoom) return null;

  const room = selectedRoom;
  const isAvailable = room.status === 'AVAILABLE';
  const matchScore = room.aiMatchScore || (room.roomNumber === 904 ? 96 : 88);

  const handleAssign = async () => {
    if (!await assignRoom(room.id, selectedGuest.name)) return;
    setSelectedRoom(null);
  };

  const handleShowToGuest = () => {
    setCustomerPreviewRoom(room);
  };

  const handleStartCheckIn = () => {
    setSelectedRoom(null);
    setActiveTab('check-in');
  };

  if (showPaymentModal) {
    return (
      <DigitalTwinPaymentModal 
        room={room} 
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedRoom(null);
        }} 
      />
    );
  }

  if (isFullRoomTour) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-5xl my-4">
          <Room3DInteriorView room={room} onBack={() => setIsFullRoomTour(false)} isManager={isManagerTab} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl glass-panel border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl font-black text-white glow-text">
                ROOM {room.roomNumber}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {room.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isAvailable ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}>
                {room.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Floor {room.floor} • {room.sizeSqFt} sq.ft. • {room.view} • {room.bedType} • Private Balcony
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* ENTER ROOM BUTTON */}
            <button
              onClick={() => setIsFullRoomTour(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:scale-105 transition flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4 text-blue-300" />
              <span>ENTER ROOM (3D)</span>
            </button>

            <button
              onClick={() => setSelectedRoom(null)}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Match Highlight & Quick Booking Banner */}
        {isAvailable && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-blue-950/70 border border-emerald-500/50 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-lg">
                {matchScore}%
              </div>
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  AI Suitability Match for {selectedGuest.name}
                </div>
                <p className="text-xs text-slate-300">
                  Matches {selectedGuest.preferences.quietRoom ? 'Quiet zone' : ''}, {selectedGuest.preferences.preferredView}, {selectedGuest.preferences.bedType}, and high floor preference.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* BOOK & PAY NOW BUTTON - ONLY VISIBLE TO GUESTS */}
              {!isManagerTab && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-5 py-2.5 text-xs font-black rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30 transition flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <Lock className="w-4 h-4" />
                  Book & Pay Now
                </button>
              )}

              <button
                onClick={handleAssign}
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Assign Room
              </button>
            </div>
          </div>
        )}

        {/* Modal Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column: Photos Gallery or Interactive 3D Tour (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* View Mode Selector: Photo Gallery vs Interactive 3D Model Tour */}
            <div className="flex items-center justify-between bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewTab('PHOTOS')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  viewTab === 'PHOTOS' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>PHOTO VIEW</span>
              </button>

              <button
                onClick={() => setViewTab('3D_TOUR')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  viewTab === '3D_TOUR' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow ring-1 ring-purple-400/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Move3D className="w-3.5 h-3.5 text-purple-300" />
                <span>3D VIEW</span>
              </button>
            </div>

            {viewTab === 'PHOTOS' ? (
              <>
                <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
                  <img 
                    src={room.images[activePhotoIdx] || room.images[0]} 
                    alt={`Room ${room.roomNumber}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-xs font-bold text-slate-200 border border-slate-800">
                    Photo {activePhotoIdx + 1} of {room.images.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="grid grid-cols-3 gap-3">
                  {room.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`h-20 rounded-xl overflow-hidden border transition ${
                        activePhotoIdx === idx ? 'border-blue-500 ring-2 ring-blue-500/40 scale-95' : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-80 w-full rounded-2xl overflow-hidden border border-purple-500/40 bg-slate-950 relative shadow-2xl">
                <iframe
                  title="3D Room & Hallway Model"
                  src={SKETCHFAB_EMBED_URL}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  execution-while-out-of-viewport="true"
                  execution-while-not-rendered="true"
                  web-share="true"
                />
              </div>
            )}

            {/* Quick Specs Cards */}
            <div className="grid grid-cols-3 gap-3 mt-1">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-[11px] text-slate-400">Nightly Rate</span>
                <span className="text-base font-black text-amber-400">₹{room.price.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-[11px] text-slate-400">Floor Level</span>
                <span className="text-base font-bold text-slate-200">Floor {room.floor}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="block text-[11px] text-slate-400">Room Size</span>
                <span className="text-base font-bold text-slate-200">{room.sizeSqFt} sq.ft.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Operational Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Amenities Grid */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Included Amenities</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {room.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Housekeeping & Maintenance Status Cards */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Housekeeping Status
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Last Cleaned: {room.lastCleaned}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    {room.cleanlinessScore}% Clean
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Wrench className="w-4 h-4 text-blue-400" />
                    Equipment Health
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Status: {room.maintenanceStatus}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black px-2 py-1 rounded ${
                    room.equipmentHealth >= 90 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                  }`}>
                    {room.equipmentHealth}% Health
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions - Manager vs Guest Options */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              {isManagerTab ? (
                <>
                  <button
                    onClick={handleAssign}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Assign Room to Guest</span>
                  </button>

                  <button
                    onClick={() => {
                      updateRoomStatus(room.id, room.status === 'AVAILABLE' ? 'HOUSEKEEPING' : 'AVAILABLE');
                      setSelectedRoom(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <span>{room.status === 'AVAILABLE' ? 'Mark Housekeeping' : 'Mark Available'}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Reserve Room (Pay Now)</span>
                  </button>

                  <button
                    onClick={handleStartCheckIn}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
                  >
                    <span>Express Check-In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
