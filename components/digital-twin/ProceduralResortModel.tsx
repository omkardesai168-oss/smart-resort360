"use client";

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useResort } from '../../context/ResortContext';
import { Room, RoomStatus } from '../../types/resort';
import { RESORT_FACILITIES, Facility } from './FacilityDetailModal';

export type TimeOfDay = 'DAYLIGHT' | 'NOON' | 'TWILIGHT' | 'NIGHT_GLOW';

const STATUS_COLORS: Record<RoomStatus, string> = {
  AVAILABLE: '#10B981',   // Soft Emerald Green
  OCCUPIED: '#EF4444',    // Soft Red
  RESERVED: '#3B82F6',    // Electric Blue
  HOUSEKEEPING: '#EAB308',// Soft Yellow
  MAINTENANCE: '#F97316', // Soft Orange
  BLOCKED: '#6B7280'      // Slate Gray
};

interface ProceduralResortProps {
  isCutawayMode: boolean;
  timeOfDay: TimeOfDay;
  hoveredRoom: Room | null;
  setHoveredRoom: (room: Room | null) => void;
  onSelectFacility: (facility: Facility) => void;
}

// Helper: 3D Palm Tree Component with Vibrant Foliage
const PalmTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.28, 3.6, 12]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>
      {/* Fronds / Lush Palm Leaves */}
      {Array.from({ length: 8 }).map((_, idx) => {
        const angle = (idx * Math.PI) / 4;
        return (
          <group key={idx} position={[0, 3.5, 0]} rotation={[0.4, angle, 0]}>
            <mesh position={[0, 0, 1.1]} rotation={[0.25, 0, 0]} castShadow>
              <boxGeometry args={[0.45, 0.06, 2.4]} />
              <meshStandardMaterial color="#16a34a" roughness={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Helper: Sun Lounger Component for Pool Deck
const SunLounger: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Lounger Bed - Pristine White */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.75, 0.12, 1.9]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Reclined Backrest - Bright Azure Blue */}
      <mesh position={[0, 0.42, -0.6]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.75, 0.12, 0.65]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} />
      </mesh>
    </group>
  );
};

export const ProceduralResortModel: React.FC<ProceduralResortProps> = ({
  isCutawayMode,
  timeOfDay,
  hoveredRoom,
  setHoveredRoom,
  onSelectFacility
}) => {
  const { rooms, selectedFloor, setSelectedFloor, selectedRoom, setSelectedRoom } = useResort();
  const mainGroupRef = useRef<THREE.Group>(null);
  const poolWaterRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Slow ambient rotation when in default view
  useFrame((state, delta) => {
    if (mainGroupRef.current && selectedFloor === null && !selectedRoom && !isCutawayMode) {
      mainGroupRef.current.rotation.y += delta * 0.035;
    }
    if (poolWaterRef.current) {
      poolWaterRef.current.roughness = 0.08 + Math.sin(state.clock.elapsedTime * 3) * 0.03;
    }
  });

  const baseFloorHeight = 1.6;
  const cutawayGap = isCutawayMode ? 1.5 : 0; // Vertical separation gap in cutaway mode!
  const buildingWidth = 18;
  const buildingDepth = 10;

  // Environment Lighting Config based on TimeOfDay
  const lightConfig = {
    DAYLIGHT: { sunPos: [35, 55, 30] as [number, number, number], sunColor: '#FFF7ED', sunIntensity: 3.0, ambient: 1.3, skyColor: '#38BDF8' },
    NOON: { sunPos: [10, 70, 10] as [number, number, number], sunColor: '#FFFFFF', sunIntensity: 3.5, ambient: 1.5, skyColor: '#7DD3FC' },
    TWILIGHT: { sunPos: [55, 20, 40] as [number, number, number], sunColor: '#F59E0B', sunIntensity: 2.2, ambient: 1.1, skyColor: '#FDBA74' },
    NIGHT_GLOW: { sunPos: [20, 30, -20] as [number, number, number], sunColor: '#38BDF8', sunIntensity: 1.0, ambient: 0.8, skyColor: '#1E1B4B' }
  }[timeOfDay];

  return (
    <group ref={mainGroupRef} position={[0, -8, 0]}>
      {/* BASE GROUND & LANDSCAPING TERRAIN - Vibrant Daylight Park & Sandstone Paving */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <boxGeometry args={[44, 0.6, 36]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} /> {/* Bright White Sandstone Terrace Base */}
      </mesh>
      
      {/* Lush Emerald Green Lawn */}
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <boxGeometry args={[40, 0.05, 32]} />
        <meshStandardMaterial color="#16a34a" roughness={0.6} />
      </mesh>

      {/* DRIVEWAY & ENTRANCE CIRCLE - Marble & Paved Stone */}
      <mesh position={[0, 0.02, 10]} receiveShadow>
        <cylinderGeometry args={[5.2, 5.2, 0.04, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.03, 10]} receiveShadow>
        <cylinderGeometry args={[2.6, 2.6, 0.05, 32]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>

      {/* INFINITY SWIMMING POOL & LUXURY POOL DECK */}
      <group position={[0, 0, -11]}>
        {/* Pool Deck Platform - Golden Teak Wood */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[23, 0.2, 10.5]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Shimmering Ocean Blue Pool Water */}
        <mesh 
          position={[0, 0.16, 0]} 
          onClick={(e) => {
            e.stopPropagation();
            const poolFac = RESORT_FACILITIES.find(f => f.id === 'fac-pool');
            if (poolFac) onSelectFacility(poolFac);
          }}
        >
          <boxGeometry args={[17, 0.1, 7.5]} />
          <meshPhysicalMaterial 
            ref={poolWaterRef}
            color="#0ea5e9" 
            roughness={0.08} 
            metalness={0.2} 
            transmission={0.9} 
            opacity={0.92} 
            transparent 
            clearcoat={1.0}
          />
        </mesh>

        {/* Sun Loungers along Pool Deck */}
        <SunLounger position={[-6.5, 0.25, 3.2]} />
        <SunLounger position={[-4.2, 0.25, 3.2]} />
        <SunLounger position={[-2.0, 0.25, 3.2]} />
        <SunLounger position={[2.0, 0.25, 3.2]} />
        <SunLounger position={[4.2, 0.25, 3.2]} />
        <SunLounger position={[6.5, 0.25, 3.2]} />
      </group>

      {/* TROPICAL PALM TREES AROUND RESORT */}
      <PalmTree position={[-15, 0, 11]} scale={1.25} />
      <PalmTree position={[15, 0, 11]} scale={1.25} />
      <PalmTree position={[-16, 0, -8]} scale={1.15} />
      <PalmTree position={[16, 0, -8]} scale={1.15} />
      <PalmTree position={[-9, 0, -14.5]} scale={1.1} />
      <PalmTree position={[9, 0, -14.5]} scale={1.1} />

      {/* GROUND FLOOR (FLOOR 1): GRAND LOBBY, RECEPTION & CANOPY */}
      <group position={[0, 0.8, 0]}>
        {/* Floor 1 Polish White Marble Slab */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[buildingWidth + 2.2, 0.4, buildingDepth + 2.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.1} />
        </mesh>

        {/* Grand Reception Atrium Crystal Glass Enclosure */}
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[buildingWidth, 1.4, buildingDepth]} />
          <meshPhysicalMaterial 
            color="#e0f2fe" 
            roughness={0.05} 
            metalness={0.3} 
            transmission={0.88} 
            opacity={0.85} 
            transparent 
            clearcoat={1.0}
          />
        </mesh>

        {/* Entrance Portico Canopy - Champagne Gold & White Polish */}
        <mesh position={[0, 1.4, buildingDepth / 2 + 2.6]} castShadow receiveShadow>
          <boxGeometry args={[8.5, 0.35, 5.2]} />
          <meshStandardMaterial color="#ffffff" metalness={0.4} roughness={0.2} />
        </mesh>
        {/* Gold Border Trim on Canopy */}
        <mesh position={[0, 1.6, buildingDepth / 2 + 5.15]}>
          <boxGeometry args={[8.6, 0.1, 0.1]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Canopy Support Columns - Polished Gold Pillars */}
        <mesh position={[-3.8, 0.6, buildingDepth / 2 + 4.7]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 1.4, 20]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[3.8, 0.6, buildingDepth / 2 + 4.7]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 1.4, 20]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* ILLUMINATED GOLD HOTEL SIGNAGE: "SMART RESORT 360" */}
        <Text
          position={[0, 1.75, buildingDepth / 2 + 5.25]}
          fontSize={0.58}
          color="#0284c7"
          anchorX="center"
          anchorY="middle"
        >
          SMART RESORT 360
        </Text>
      </group>

      {/* FLOORS 2 THROUGH 10 (10 FLOORS TOTAL) */}
      {Array.from({ length: 10 }).map((_, fIdx) => {
        const floorNum = fIdx + 1;
        if (floorNum === 1) return null; // Floor 1 rendered above

        // Compute dynamic height with Cutaway Gap Spacing!
        const posY = (floorNum - 1) * (baseFloorHeight + cutawayGap) + 1.2;
        const isSelected = selectedFloor === floorNum;
        const floorRooms = rooms.filter(r => r.floor === floorNum);

        return (
          <group 
            key={floorNum} 
            position={[0, posY, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFloor(isSelected ? null : floorNum);
            }}
          >
            {/* Bright Floor Slab - Pure Crisp White & Gold Edge */}
            <mesh castShadow receiveShadow position={[0, -0.15, 0]}>
              <boxGeometry args={[buildingWidth + 0.8, 0.32, buildingDepth + 0.8]} />
              <meshStandardMaterial 
                color={isSelected ? "#2563eb" : "#ffffff"} 
                roughness={0.2} 
                metalness={0.2} 
                emissive={isSelected ? "#1d4ed8" : "#000000"}
                emissiveIntensity={isSelected ? 0.35 : 0}
              />
            </mesh>

            {/* Crystal Glass Facade Exterior Shell */}
            <mesh position={[0, baseFloorHeight / 2 - 0.15, 0]}>
              <boxGeometry args={[buildingWidth - 0.1, baseFloorHeight - 0.08, buildingDepth - 0.1]} />
              <meshPhysicalMaterial 
                color={isSelected ? "#93c5fd" : "#e0f2fe"} 
                roughness={0.05} 
                metalness={0.3} 
                transmission={0.8} 
                opacity={0.7} 
                transparent 
                clearcoat={1.0}
              />
            </mesh>

            {/* Individual Room Modules on Floor */}
            {floorRooms.map((room, rIdx) => {
              const isFront = rIdx < 12;
              const col = rIdx % 12;
              const xPos = -7.2 + col * 1.3;
              const zPos = isFront ? buildingDepth / 2 - 0.6 : -buildingDepth / 2 + 0.6;
              const statusColor = STATUS_COLORS[room.status];
              const isRoomSelected = selectedRoom?.id === room.id;
              const isRoomHovered = hoveredRoom?.id === room.id;

              return (
                <group 
                  key={room.id} 
                  position={[xPos, baseFloorHeight / 2 - 0.15, zPos]}
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    setHoveredRoom(room);
                  }}
                  onPointerOut={() => setHoveredRoom(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoom(room);
                  }}
                >
                  {/* Room Box Module */}
                  <mesh castShadow>
                    <boxGeometry args={[1.1, 1.1, 0.9]} />
                    <meshStandardMaterial 
                      color={statusColor} 
                      roughness={0.2} 
                      metalness={0.2} 
                      emissive={statusColor} 
                      emissiveIntensity={isRoomSelected ? 0.85 : isRoomHovered ? 0.65 : 0.3} 
                    />
                  </mesh>

                  {/* Bright Glass Balcony Railing */}
                  <mesh position={[0, -0.1, isFront ? 0.55 : -0.55]}>
                    <boxGeometry args={[1.05, 0.45, 0.05]} />
                    <meshPhysicalMaterial color="#38bdf8" transparent opacity={0.6} roughness={0.05} transmission={0.95} />
                  </mesh>

                  {/* Room Number Badge Text */}
                  <Text
                    position={[0, 0, isFront ? 0.48 : -0.48]}
                    rotation={[0, isFront ? 0 : Math.PI, 0]}
                    fontSize={0.24}
                    color="#FFFFFF"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {`${room.roomNumber}`}
                  </Text>
                </group>
              );
            })}

            {/* Floor Number Indicator Text Label */}
            <Text
              position={[-buildingWidth / 2 - 0.85, 0.4, 0]}
              rotation={[0, -Math.PI / 2, 0]}
              fontSize={0.52}
              color={isSelected ? "#2563eb" : "#0284c7"}
              anchorX="center"
              anchorY="middle"
            >
              {`F${floorNum}`}
            </Text>
          </group>
        );
      })}

      {/* ROOFTOP SUNSET LOUNGE & SKY DECK (LEVEL 10 TOP) */}
      <group position={[0, 10 * (baseFloorHeight + cutawayGap) + 0.8, 0]}>
        {/* Roof Deck Slab - Pure White & Gold Accent */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[buildingWidth + 1.0, 0.35, buildingDepth + 1.0]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Rooftop Glass Parapet */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[buildingWidth + 0.8, 0.85, buildingDepth + 0.8]} />
          <meshPhysicalMaterial color="#38bdf8" transparent opacity={0.4} roughness={0.05} transmission={0.95} />
        </mesh>
      </group>

      {/* DYNAMIC ATMOSPHERIC LIGHTING SETUP */}
      <ambientLight intensity={lightConfig.ambient} />
      <directionalLight 
        position={lightConfig.sunPos} 
        color={lightConfig.sunColor}
        intensity={lightConfig.sunIntensity} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
      />
      <pointLight position={[0, 3, 12]} color="#0284c7" intensity={2.2} distance={18} />
      <pointLight position={[-16, 22, 16]} color="#f59e0b" intensity={1.5} />
      <pointLight position={[16, 22, -16]} color="#38bdf8" intensity={1.5} />
    </group>
  );
};
