"use client";

import React, { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Room } from '../../types/resort';
import { DigitalTwinPaymentModal } from './DigitalTwinPaymentModal';
import { ArrowLeft, Sparkles, Tv, Wifi, Sun, BedDouble, ShieldCheck, Lock, CreditCard } from 'lucide-react';

// Procedural 3D Room Interior Mesh
const RoomInteriorMesh: React.FC<{ room: Room }> = ({ room }) => {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Floor - Hardwood Walnut */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[10, 0.1, 12]} />
        <meshStandardMaterial color="#2c1d11" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 4.05, 0]} receiveShadow>
        <boxGeometry args={[10, 0.1, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>

      {/* Back Wall - Warm Accent Wood Panel */}
      <mesh position={[0, 2, -5.95]} receiveShadow>
        <boxGeometry args={[9.9, 4, 0.1]} />
        <meshStandardMaterial color="#3a2e2b" roughness={0.5} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-4.95, 2, 0]} receiveShadow>
        <boxGeometry args={[0.1, 4, 11.9]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[4.95, 2, 0]} receiveShadow>
        <boxGeometry args={[0.1, 4, 11.9]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Front Balcony Wall with Large Glass Facade */}
      <mesh position={[-3, 2, 5.95]} receiveShadow>
        <boxGeometry args={[3.8, 4, 0.1]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[3, 2, 5.95]} receiveShadow>
        <boxGeometry args={[3.8, 4, 0.1]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Sliding Glass Balcony Doors */}
      <mesh position={[0, 2, 5.95]}>
        <boxGeometry args={[2.2, 3.6, 0.05]} />
        <meshPhysicalMaterial 
          color="#93c5fd" 
          transparent 
          opacity={0.3} 
          roughness={0.1} 
          metalness={0.9} 
          transmission={0.9} 
        />
      </mesh>

      {/* Balcony Deck */}
      <mesh position={[0, -0.05, 7.5]} receiveShadow>
        <boxGeometry args={[8, 0.1, 3]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      {/* Balcony Glass Railing */}
      <mesh position={[0, 1.0, 8.9]}>
        <boxGeometry args={[7.8, 2.0, 0.05]} />
        <meshPhysicalMaterial color="#60a5fa" transparent opacity={0.35} roughness={0.1} transmission={0.9} />
      </mesh>

      {/* KING BED SETUP */}
      <group position={[0, 0, -3.5]}>
        {/* Headboard */}
        <mesh position={[0, 1.6, -1.9]} castShadow>
          <boxGeometry args={[4.2, 2.2, 0.2]} />
          <meshStandardMaterial color="#4a3728" roughness={0.6} />
        </mesh>
        {/* Bed Frame */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[3.8, 0.6, 3.8]} />
          <meshStandardMaterial color="#1e1b18" />
        </mesh>
        {/* Mattress */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[3.6, 0.5, 3.6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        {/* Luxury Duvet / Blanket */}
        <mesh position={[0, 1.0, 0.4]} castShadow>
          <boxGeometry args={[3.62, 0.35, 2.7]} />
          <meshStandardMaterial color="#2563eb" roughness={0.7} />
        </mesh>
        {/* Pillows */}
        <mesh position={[-1.0, 1.25, -1.3]} castShadow rotation={[0.2, 0, 0]}>
          <boxGeometry args={[1.2, 0.25, 0.6]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[1.0, 1.25, -1.3]} castShadow rotation={[0.2, 0, 0]}>
          <boxGeometry args={[1.2, 0.25, 0.6]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* NIGHTSTANDS & BEDSIDE LAMPS */}
      {/* Left Nightstand */}
      <group position={[-2.5, 0.5, -5.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.9, 0.8]} />
          <meshStandardMaterial color="#33241b" />
        </mesh>
        {/* Lamp Base */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 0.4, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Lamp Shade */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.25, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#fffbe6" roughness={0.3} emissive="#fef08a" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[0, 0.9, 0]} color="#fde047" intensity={0.8} distance={5} />
      </group>

      {/* Right Nightstand */}
      <group position={[2.5, 0.5, -5.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.9, 0.8]} />
          <meshStandardMaterial color="#33241b" />
        </mesh>
        {/* Lamp Base */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 0.4, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Lamp Shade */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.25, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#fffbe6" roughness={0.3} emissive="#fef08a" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[0, 0.9, 0]} color="#fde047" intensity={0.8} distance={5} />
      </group>

      {/* SMART TV & CONSOLE UNIT */}
      <group position={[-4.85, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Wall Frame Panel */}
        <mesh castShadow>
          <boxGeometry args={[3.4, 2.0, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* TV Screen */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[3.2, 1.8, 0.02]} />
          <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* 3D Display Text on TV */}
        <Text
          position={[0, 0.2, 0.07]}
          fontSize={0.22}
          color="#60a5fa"
          anchorX="center"
          anchorY="middle"
        >
          SMART RESORT 360
        </Text>
        <Text
          position={[0, -0.2, 0.07]}
          fontSize={0.14}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
        >
          {`Welcome to Room ${room.roomNumber} (${room.type})`}
        </Text>
      </group>

      {/* LUXURY SOFA & COFFEE TABLE */}
      <group position={[3.2, 0, 1.5]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Sofa Base */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[2.4, 0.5, 1.2]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Cushion */}
        <mesh position={[0, 0.6, 0.1]} castShadow>
          <boxGeometry args={[2.2, 0.3, 1.0]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.8} />
        </mesh>
        {/* Sofa Back */}
        <mesh position={[0, 1.0, -0.45]} castShadow>
          <boxGeometry args={[2.4, 0.8, 0.3]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Coffee Table */}
        <mesh position={[-1.2, 0.3, 0.6]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.4, 24]} />
          <meshStandardMaterial color="#d97706" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* AMBIENT CEILING LIGHTING */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, -5]} intensity={1.2} castShadow />
      <pointLight ref={lightRef} position={[0, 3.8, 0]} color="#fbbf24" intensity={1.5} distance={12} />
    </group>
  );
};

export const Room3DInteriorView: React.FC<{
  room: Room;
  onBack: () => void;
  isManager?: boolean;
}> = ({ room, onBack, isManager }) => {
  const pathname = usePathname();
  const isManagerTab = isManager || pathname === "/digital-twin" || pathname.startsWith("/operations");
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  if (showPaymentModal) {
    return (
      <DigitalTwinPaymentModal 
        room={room} 
        onClose={() => {
          setShowPaymentModal(false);
          onBack();
        }} 
      />
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl bg-[#030712]">
      {/* Top Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/90 text-slate-200 border border-slate-800 hover:border-blue-500 hover:text-white transition shadow-2xl backdrop-blur-md text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>Exit Room View</span>
        </button>

        <div className="pointer-events-auto flex items-center gap-3">
          <div className="bg-slate-950/90 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-black text-sm text-white font-mono">ROOM {room.roomNumber}</span>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
              {room.type}
            </span>
          </div>

          {!isManagerTab && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 transition flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Lock className="w-4 h-4" />
              <span>Book & Pay Now</span>
            </button>
          )}
        </div>
      </div>

      {/* 3D WebGL Canvas for Room Interior */}
      <Canvas shadows camera={{ position: [0, 2.2, 4.5], fov: 60 }}>
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          minDistance={1.5} 
          maxDistance={8} 
          maxPolarAngle={Math.PI / 2 - 0.05} 
        />
        <RoomInteriorMesh room={room} />
      </Canvas>

      {/* Bottom Information Legend Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 border border-slate-800 p-3 rounded-2xl backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-amber-400" />
            <span>{room.bedType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tv className="w-4 h-4 text-blue-400" />
            <span>55" Smart TV</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>1 Gbps Mesh Wi-Fi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-yellow-400" />
            <span>Private Balcony</span>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Interactive 3D First-Person Room Engine</span>
        </div>
      </div>
    </div>
  );
};
