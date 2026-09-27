"use client";

import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useResort } from '../../context/ResortContext';
import { Room, RoomStatus } from '../../types/resort';
import { ProceduralResortModel, TimeOfDay } from './ProceduralResortModel';
import { Room3DInteriorView } from './Room3DInteriorView';
import { FacilityDetailModal, RESORT_FACILITIES, Facility } from './FacilityDetailModal';
import { 
  Building2, Layers, Move3D, Compass, Sparkles, 
  Eye, CheckCircle2, UserCheck, Wrench, ShieldAlert, Waves, Dumbbell, Utensils, Coffee, Camera,
  Sun, Moon, CloudSun, Sunset, Wind, Thermometer, ShieldCheck
} from 'lucide-react';

const SKETCHFAB_COLONIAL_HOTEL_ID = "0fcf8e21122f4e7da0f188364e7c1419";
const SKETCHFAB_ROOM_INTERIOR_ID = "f5d2584af20c4c778e22544c1c1334c6";

const SKETCHFAB_COLONIAL_HOTEL_EMBED = `https://sketchfab.com/models/${SKETCHFAB_COLONIAL_HOTEL_ID}/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=1&ui_stop=0&ui_theatre=1&ui_watermark=0`;

const SKETCHFAB_ROOM_INTERIOR_EMBED = `https://sketchfab.com/models/${SKETCHFAB_ROOM_INTERIOR_ID}/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=1&ui_stop=0&ui_theatre=1&ui_watermark=0`;

export const Resort3DCanvas: React.FC = () => {
  const { rooms, selectedFloor, setSelectedFloor, selectedRoom, setSelectedRoom, setActiveTab } = useResort();
  const controlsRef = useRef<any>(null);

  // View modes
  const [twinViewMode, setTwinViewMode] = useState<'PROCEDURAL_BUILDING_3D' | 'REAL_COLONIAL_HOTEL_3D' | 'SKETCHFAB_ROOM_3D'>('PROCEDURAL_BUILDING_3D');
  
  // Cutaway / Exploded View State ("EXPLORE FLOORS")
  const [isCutawayMode, setIsCutawayMode] = useState<boolean>(false);

  // Time of Day State for Bright Real-Time Environment
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('DAYLIGHT');

  // Hovered Room state for Framer Motion floating info card
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);

  // Active 3D Room Interior view state (Triggered by "ENTER ROOM")
  const [isInsideRoomMode, setIsInsideRoomMode] = useState<boolean>(false);

  // Active Facility Inspection State
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const room904 = rooms.find(r => r.roomNumber === 904);
  const room806 = rooms.find(r => r.roomNumber === 806);

  const toggleCutaway = () => {
    setIsCutawayMode(!isCutawayMode);
  };

  // Background Gradient Classes based on TimeOfDay
  const bgGradients: Record<TimeOfDay, string> = {
    DAYLIGHT: 'from-amber-100/90 via-sky-200/90 to-blue-400/90',
    NOON: 'from-sky-200 via-sky-300 to-blue-500',
    TWILIGHT: 'from-amber-300 via-rose-400 to-purple-800',
    NIGHT_GLOW: 'from-slate-900 via-indigo-950 to-slate-950'
  };

  if (isInsideRoomMode && selectedRoom) {
    return (
      <Room3DInteriorView 
        room={selectedRoom} 
        onBack={() => setIsInsideRoomMode(false)} 
      />
    );
  }

  return (
    <div className={`relative w-full h-[690px] rounded-3xl overflow-hidden glass-panel border border-slate-700/80 shadow-2xl transition-all duration-700 bg-gradient-to-b ${bgGradients[timeOfDay]}`}>
      
      {/* REAL-TIME FRAMER MOTION ATMOSPHERIC ENVIRONMENT LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Sun Disk Glow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: timeOfDay === 'NIGHT_GLOW' ? 0.2 : [0.8, 0.95, 0.8]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute rounded-full filter blur-2xl ${
            timeOfDay === 'NOON' ? 'top-6 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-100/80' :
            timeOfDay === 'DAYLIGHT' ? 'top-10 right-24 w-80 h-80 bg-amber-200/70' :
            timeOfDay === 'TWILIGHT' ? 'top-32 right-12 w-96 h-96 bg-rose-400/60' :
            'top-10 right-10 w-48 h-48 bg-blue-500/20'
          }`}
        />

        {/* Floating Framer Motion Clouds */}
        <motion.div
          initial={{ x: '-20%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
          className="absolute top-12 left-0 w-80 h-24 bg-white/40 backdrop-blur-3xl rounded-full filter blur-xl opacity-70"
        />
        <motion.div
          initial={{ x: '-40%' }}
          animate={{ x: '110%' }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear', delay: 12 }}
          className="absolute top-24 left-0 w-96 h-28 bg-white/30 backdrop-blur-3xl rounded-full filter blur-xl opacity-60"
        />
      </div>

      {/* Top Header Control Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left View Mode Selector */}
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 shadow-2xl">
          <button
            onClick={() => setTwinViewMode('PROCEDURAL_BUILDING_3D')}
            aria-label="3D Digital Twin WebGL Resort"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              twinViewMode === 'PROCEDURAL_BUILDING_3D' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-300" />
            <span>Interactive 3D Twin</span>
          </button>

          <button
            onClick={() => setTwinViewMode('REAL_COLONIAL_HOTEL_3D')}
            aria-label="Photorealistic Colonial Hotel Model"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              twinViewMode === 'REAL_COLONIAL_HOTEL_3D' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg ring-1 ring-purple-400/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Move3D className="w-4 h-4 text-purple-300" />
            <span>Colonial 3D Arch</span>
          </button>

          <button
            onClick={() => setTwinViewMode('SKETCHFAB_ROOM_3D')}
            aria-label="3D Room Interior Hallway Tour"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              twinViewMode === 'SKETCHFAB_ROOM_3D' 
                ? 'bg-slate-800 text-slate-100 shadow' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-300" />
            <span>Room Interior 3D</span>
          </button>
        </div>

        {/* Center: Real-time Time of Day Environment Switcher */}
        {twinViewMode === 'PROCEDURAL_BUILDING_3D' && (
          <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 p-1 rounded-2xl flex items-center gap-1 shadow-2xl">
            <button
              onClick={() => setTimeOfDay('DAYLIGHT')}
              title="Bright Golden Daylight"
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                timeOfDay === 'DAYLIGHT' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Daylight</span>
            </button>

            <button
              onClick={() => setTimeOfDay('NOON')}
              title="Sunny Noon"
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                timeOfDay === 'NOON' ? 'bg-sky-500 text-white font-black shadow' : 'text-slate-400 hover:text-sky-300'
              }`}
            >
              <CloudSun className="w-3.5 h-3.5" />
              <span>Noon</span>
            </button>

            <button
              onClick={() => setTimeOfDay('TWILIGHT')}
              title="Sunset Golden Hour"
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                timeOfDay === 'TWILIGHT' ? 'bg-rose-500 text-white font-black shadow' : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
              <span>Sunset</span>
            </button>

            <button
              onClick={() => setTimeOfDay('NIGHT_GLOW')}
              title="Architectural Night Glow"
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                timeOfDay === 'NIGHT_GLOW' ? 'bg-indigo-600 text-white font-black shadow' : 'text-slate-400 hover:text-indigo-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Night</span>
            </button>
          </div>
        )}

        {/* Right Actions Bar: "EXPLORE FLOORS" Cutaway Toggle Button */}
        {twinViewMode === 'PROCEDURAL_BUILDING_3D' && (
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={toggleCutaway}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xl backdrop-blur-md border ${
                isCutawayMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20 ring-2 ring-amber-400/50'
                  : 'bg-slate-950/90 text-amber-300 border-amber-500/40 hover:bg-amber-600 hover:text-slate-950'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isCutawayMode ? 'CLOSE CUTAWAY' : 'EXPLORE FLOORS (CUTAWAY)'}</span>
              <span className="bg-slate-950/40 text-[10px] font-black px-1.5 py-0.5 rounded">
                10-Floors
              </span>
            </button>
          </div>
        )}
      </div>

      {/* RENDER MAIN CONTENT */}
      {twinViewMode === 'PROCEDURAL_BUILDING_3D' ? (
        <div className="w-full h-full relative z-10">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[28, 18, 34]} fov={45} />
            <OrbitControls 
              ref={controlsRef} 
              enablePan={true} 
              enableZoom={true} 
              minDistance={8} 
              maxDistance={60} 
              maxPolarAngle={Math.PI / 2 - 0.05} 
            />
            <ProceduralResortModel 
              isCutawayMode={isCutawayMode}
              timeOfDay={timeOfDay}
              hoveredRoom={hoveredRoom}
              setHoveredRoom={setHoveredRoom}
              onSelectFacility={(fac) => setSelectedFacility(fac)}
            />
          </Canvas>

          {/* Real-time Environment Telemetry Badge powered by Framer Motion */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-20 left-6 z-20 pointer-events-auto glass-panel p-3 rounded-2xl border border-slate-700/80 bg-slate-950/90 backdrop-blur-md shadow-2xl text-xs space-y-1.5 text-slate-200"
          >
            <div className="flex items-center gap-2 font-bold text-amber-400 pb-1 border-b border-slate-800">
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>Live Environment Telemetry</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                Outdoor Temp:
              </span>
              <span className="font-bold font-mono text-emerald-400">27°C / 81°F</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                Ocean Breeze:
              </span>
              <span className="font-bold font-mono text-cyan-300">8 km/h NW</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                Air Quality Index:
              </span>
              <span className="font-bold font-mono text-purple-300">AQI 12 Pristine</span>
            </div>
          </motion.div>

          {/* Hotspot Facility Buttons Overlay on 3D Canvas */}
          <div className="absolute bottom-6 left-6 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setSelectedFacility(RESORT_FACILITIES.find(f => f.id === 'fac-pool') || null)}
              className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/60 text-cyan-300 text-xs font-bold backdrop-blur-md shadow-xl hover:scale-105 transition flex items-center gap-1.5"
            >
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <span>Infinity Pool & Deck</span>
            </button>

            <button
              onClick={() => setSelectedFacility(RESORT_FACILITIES.find(f => f.id === 'fac-spa') || null)}
              className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-purple-500/60 text-purple-300 text-xs font-bold backdrop-blur-md shadow-xl hover:scale-105 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Lotus Spa</span>
            </button>

            <button
              onClick={() => setSelectedFacility(RESORT_FACILITIES.find(f => f.id === 'fac-gym') || null)}
              className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-500/60 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-xl hover:scale-105 transition flex items-center gap-1.5"
            >
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pulse Fitness Gym</span>
            </button>

            <button
              onClick={() => setSelectedFacility(RESORT_FACILITIES.find(f => f.id === 'fac-restaurant') || null)}
              className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-amber-500/60 text-amber-300 text-xs font-bold backdrop-blur-md shadow-xl hover:scale-105 transition flex items-center gap-1.5"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span>Azure Dining</span>
            </button>
          </div>

          {/* Framer Motion Floating Hover Information Card */}
          <AnimatePresence>
            {hoveredRoom && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-20 right-6 z-30 pointer-events-none w-72 glass-panel p-4 rounded-2xl border border-slate-700 shadow-2xl bg-slate-950/95 backdrop-blur-md text-slate-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-white font-mono">
                      ROOM {hoveredRoom.roomNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {hoveredRoom.type}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
                    hoveredRoom.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}>
                    {hoveredRoom.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">View:</span>
                    <span className="font-semibold text-slate-200">{hoveredRoom.view}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Housekeeping:</span>
                    <span className="font-semibold text-emerald-400">{hoveredRoom.housekeepingStatus}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Maintenance:</span>
                    <span className="font-semibold text-slate-200">{hoveredRoom.maintenanceStatus}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      AI Match Score:
                    </span>
                    <span className="font-black text-emerald-400 font-mono">
                      {hoveredRoom.aiMatchScore || (hoveredRoom.roomNumber === 904 ? '96%' : '88%')}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : twinViewMode === 'REAL_COLONIAL_HOTEL_3D' ? (
        <div className="w-full h-full pt-16 pb-2 px-2 relative bg-slate-950">
          <iframe
            title="Real Colonial Style Hotel Residential Building 3D Digital Twin"
            src={SKETCHFAB_COLONIAL_HOTEL_EMBED}
            className="w-full h-full rounded-2xl border border-slate-800 shadow-2xl"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true"
            web-share="true"
          />

          {/* Telemetry Hotspots */}
          <div className="absolute top-[26%] left-[44%] z-20">
            <button
              onClick={() => room904 && setSelectedRoom(room904)}
              className="bg-slate-950/95 border border-emerald-500/90 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-2xl backdrop-blur-md flex items-center gap-1.5 hover:scale-110 transition animate-bounce"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-emerald-300">Room 904</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-black">
                96% AI Match
              </span>
            </button>
          </div>

          <div className="absolute top-[38%] left-[60%] z-20">
            <button
              onClick={() => room806 && setSelectedRoom(room806)}
              className="bg-slate-950/95 border border-rose-500/90 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-2xl backdrop-blur-md flex items-center gap-1.5 hover:scale-110 transition"
            >
              <Wrench className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span className="font-mono text-rose-300">Room 806</span>
              <span className="bg-rose-500/20 text-rose-300 text-[10px] px-1.5 py-0.5 rounded font-black">
                72% AC Risk
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full pt-16 pb-2 px-2 relative bg-slate-950">
          <iframe
            title="Hotel Room Hallway 3D Digital Twin Model"
            src={SKETCHFAB_ROOM_INTERIOR_EMBED}
            className="w-full h-full rounded-2xl border border-slate-800 shadow-2xl"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true"
            web-share="true"
          />
        </div>
      )}

      {/* Bottom Status Hint Bar */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none text-[11px] text-slate-900 bg-white/90 border border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-2xl font-semibold">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Click any floor or room to inspect live telemetry and trigger camera zoom</span>
      </div>

      {/* Facility Detail Modal */}
      <FacilityDetailModal 
        facility={selectedFacility} 
        onClose={() => setSelectedFacility(null)} 
      />
    </div>
  );
};
