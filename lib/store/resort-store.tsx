"use client";

import { create, useStore } from "zustand";
import { createContext, useContext, useRef, type ReactNode } from "react";
import React from "react";

// ============================================
// TYPES
// ============================================

export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "CLEANING" | "MAINTENANCE" | "OUT_OF_ORDER";
export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";
export type SimulationSpeed = 1 | 5 | 20;

export interface RoomState {
  id: string;
  number: string;
  floor: number;
  type: string;
  status: RoomStatus;
  guestName?: string;
  temperature: number;
  energyStatus: string;
  maintenanceRisk: number;
  guestScore: number;
  buildingId: string;
  positionX: number;
  positionY: number;
  positionZ: number;
}

export interface AlertState {
  id: string;
  type: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface WeatherState {
  temperature: number;
  humidity: number;
  condition: string;
  rainProbability: number;
  windSpeed: number;
}

export interface DashboardMetrics {
  occupancyRate: number;
  adr: number;
  revpar: number;
  revenue: number;
  guestSatisfaction: number;
  nps: number;
  staffUtilization: number;
  energyConsumption: number;
  // Previous period
  prevOccupancy: number;
  prevAdr: number;
  prevRevpar: number;
  prevRevenue: number;
  prevSatisfaction: number;
  prevNps: number;
  prevStaffUtil: number;
  prevEnergy: number;
}

export interface ResortStore {
  // Core State
  metrics: DashboardMetrics;
  rooms: RoomState[];
  alerts: AlertState[];
  weather: WeatherState;
  intelligenceScore: number;
  
  // Simulation
  isSimulating: boolean;
  simSpeed: SimulationSpeed;
  demoModeActive: boolean;
  demoEventIndex: number;
  
  // UI State
  selectedRoomId: string | null;
  heatmapMode: string;
  sidebarCollapsed: boolean;
  
  // Actions
  setMetrics: (metrics: Partial<DashboardMetrics>) => void;
  setRooms: (rooms: RoomState[]) => void;
  updateRoom: (id: string, updates: Partial<RoomState>) => void;
  addAlert: (alert: Omit<AlertState, "id" | "createdAt" | "isRead">) => void;
  markAlertRead: (id: string) => void;
  clearAlerts: () => void;
  setWeather: (weather: Partial<WeatherState>) => void;
  setSimulating: (val: boolean) => void;
  setSimSpeed: (speed: SimulationSpeed) => void;
  setSelectedRoom: (id: string | null) => void;
  setHeatmapMode: (mode: string) => void;
  toggleSidebar: () => void;
  triggerDemoMode: () => void;
  triggerDemo: () => void;
  stepDemo: () => void;
  updateMetricsFromRooms: () => void;
}

// ============================================
// INITIAL DATA
// ============================================

const initialMetrics: DashboardMetrics = {
  occupancyRate: 87.4,
  adr: 14800,
  revpar: 12935,
  revenue: 1812000,
  guestSatisfaction: 88.2,
  nps: 72,
  staffUtilization: 76.4,
  energyConsumption: 2847,
  prevOccupancy: 81.9,
  prevAdr: 13900,
  prevRevpar: 11386,
  prevRevenue: 1650000,
  prevSatisfaction: 85.7,
  prevNps: 68,
  prevStaffUtil: 71.2,
  prevEnergy: 2980,
};

const initialWeather: WeatherState = {
  temperature: 26.4,
  humidity: 72,
  condition: "CLOUDY",
  rainProbability: 0.68,
  windSpeed: 14.2,
};

// Demo event chain
const DEMO_EVENTS = [
  {
    title: "🌧️ Heavy Rain Detected",
    description: "Monsoon intensifying. Rain probability 92%.",
    action: "weather_rain",
  },
  {
    title: "📉 Outdoor Activities Cancelled",
    description: "Pool deck, garden tours, and outdoor yoga suspended.",
    action: "outdoor_down",
  },
  {
    title: "📈 Spa Demand Spike",
    description: "Spa bookings up 24% in last 15 minutes.",
    action: "spa_up",
  },
  {
    title: "🍽️ Restaurant Forecast Updated",
    description: "Dinner covers projected to increase 18%.",
    action: "restaurant_up",
  },
  {
    title: "👥 AI Reallocates Staff",
    description: "3 outdoor staff moved to Spa and Restaurant.",
    action: "staff_realloc",
  },
  {
    title: "💡 Revenue Opportunity Detected",
    description: "Spa packages can drive +₹42,000 additional revenue today.",
    action: "revenue_opportunity",
  },
  {
    title: "🤖 Guest Recommendations Updated",
    description: "AI sending personalized indoor activity suggestions to 47 guests.",
    action: "guest_notify",
  },
];

// ============================================
// STORE CREATOR
// ============================================

const createResortStore = () =>
  create<ResortStore>()((set, get) => ({
    metrics: initialMetrics,
    rooms: [],
    alerts: [],
    weather: initialWeather,
    intelligenceScore: 87,
    isSimulating: false,
    simSpeed: 1,
    demoModeActive: false,
    demoEventIndex: 0,
    selectedRoomId: null,
    heatmapMode: "normal",
    sidebarCollapsed: false,

    setMetrics: (m) =>
      set((state) => ({ metrics: { ...state.metrics, ...m } })),

    setRooms: (rooms) => set({ rooms }),

    updateRoom: (id, updates) =>
      set((state) => ({
        rooms: state.rooms.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      })),

    addAlert: (alert) =>
      set((state) => ({
        alerts: [
          {
            ...alert,
            id: `alert-${Date.now()}-${Math.random()}`,
            createdAt: new Date(),
            isRead: false,
          },
          ...state.alerts.slice(0, 49),
        ],
      })),

    markAlertRead: (id) =>
      set((state) => ({
        alerts: state.alerts.map((a) =>
          a.id === id ? { ...a, isRead: true } : a
        ),
      })),

    clearAlerts: () => set({ alerts: [] }),

    setWeather: (w) =>
      set((state) => ({ weather: { ...state.weather, ...w } })),

    setSimulating: (val) => set({ isSimulating: val }),
    setSimSpeed: (speed) => set({ simSpeed: speed }),
    setSelectedRoom: (id) => set({ selectedRoomId: id }),
    setHeatmapMode: (mode) => set({ heatmapMode: mode }),
    toggleSidebar: () =>
      set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    triggerDemoMode: () => {
      set({ demoModeActive: true, demoEventIndex: 0 });
      get().stepDemo();
    },

    triggerDemo: () => {
      set({ demoModeActive: true, demoEventIndex: 0 });
      get().stepDemo();
    },

    stepDemo: () => {
      const { demoEventIndex, addAlert, setWeather, setMetrics } = get();
      const event = DEMO_EVENTS[demoEventIndex];
      if (!event) {
        set({ demoModeActive: false, demoEventIndex: 0 });
        return;
      }

      // Apply event effects
      switch (event.action) {
        case "weather_rain":
          setWeather({ condition: "RAINY", rainProbability: 0.92, humidity: 88 });
          addAlert({ type: "CRISIS", severity: "WARNING", title: "🌧️ Heavy Rain Alert", message: "Monsoon intensifying. Outdoor activities suspended. AI activating indoor protocols.", actionUrl: "/crisis" });
          break;
        case "outdoor_down":
          setMetrics({ occupancyRate: get().metrics.occupancyRate - 2 });
          addAlert({ type: "AI", severity: "INFO", title: "Outdoor Demand Dropping", message: "Pool occupancy down 42%. Garden tours cancelled. Staff reallocation recommended.", actionUrl: "/operations/staff" });
          break;
        case "spa_up":
          addAlert({ type: "REVENUE", severity: "INFO", title: "Spa Demand Spike +24%", message: "AI detected opportunity: Spa at 94% capacity. Recommend extending hours and adding mobile therapists.", actionUrl: "/revenue/pricing" });
          break;
        case "restaurant_up":
          setMetrics({ revenue: get().metrics.revenue * 1.03 });
          addAlert({ type: "AI", severity: "INFO", title: "Restaurant Forecast Updated", message: "Dinner covers up 18%. F&B team notified. Inventory auto-order triggered for key items.", actionUrl: "/operations/inventory" });
          break;
        case "staff_realloc":
          setMetrics({ staffUtilization: get().metrics.staffUtilization + 4 });
          addAlert({ type: "STAFF", severity: "INFO", title: "AI Staff Reallocation Complete", message: "3 staff moved from Outdoor Recreation → Spa (2) + Restaurant (1). Approved by Operations Manager.", actionUrl: "/operations/staff" });
          break;
        case "revenue_opportunity":
          addAlert({ type: "REVENUE", severity: "INFO", title: "💰 Revenue Opportunity: +₹42,000", message: "Premium spa packages for rainy day. AI recommends targeted push notification to 23 price-insensitive guests.", actionUrl: "/revenue/pricing" });
          break;
        case "guest_notify":
          setMetrics({ guestSatisfaction: get().metrics.guestSatisfaction + 1.2 });
          addAlert({ type: "GUEST", severity: "INFO", title: "AI Guest Outreach Sent", message: "47 personalized recommendations sent via app. Indoor cooking class, spa, and board games fully booked.", actionUrl: "/guests" });
          break;
      }

      set({ demoEventIndex: demoEventIndex + 1 });
    },

    updateMetricsFromRooms: () => {
      const { rooms } = get();
      if (!rooms.length) return;
      const occupied = rooms.filter((r) => r.status === "OCCUPIED").length;
      const occupancyRate = (occupied / rooms.length) * 100;
      set((state) => ({
        metrics: { ...state.metrics, occupancyRate },
      }));
    },
  }));

// ============================================
// CONTEXT PROVIDER
// ============================================

type ResortStoreType = ReturnType<typeof createResortStore>;
const ResortStoreContext = createContext<ResortStoreType | null>(null);

let activeStoreInstance: ResortStoreType | null = null;

export const dispatchResortAlert = (alert: Omit<AlertState, "id" | "createdAt" | "isRead">) => {
  if (activeStoreInstance) {
    activeStoreInstance.getState().addAlert(alert);
  }
};

export function ResortStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ResortStoreType>();
  if (!storeRef.current) {
    storeRef.current = createResortStore();
    activeStoreInstance = storeRef.current;
  }
  return (
    <ResortStoreContext.Provider value={storeRef.current}>
      {children}
    </ResortStoreContext.Provider>
  );
}

export function useResortStore<T>(selector: (store: ResortStore) => T): T {
  const store = useContext(ResortStoreContext);
  if (!store) throw new Error("useResortStore must be used within ResortStoreProvider");
  return useStore(store, selector);
}
