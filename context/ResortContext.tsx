"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Room, RoomStatus, UserRole, ActiveTab, Guest, MaintenanceItem, 
  StaffCategory, InventoryItem, OperationalAlert, RevenueMetric 
} from '../types/resort';
import { 
  generateRooms, INITIAL_GUEST, SAMPLE_GUESTS, 
  SAMPLE_MAINTENANCE, SAMPLE_STAFF, SAMPLE_INVENTORY, 
  SAMPLE_ALERTS, SAMPLE_REVENUE_DATA 
} from '../data/resortData';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertTriangle, Bell, X } from 'lucide-react';
import { dispatchResortAlert } from '@/lib/store/resort-store';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface ResortContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isDemoMode: boolean;
  setIsDemoMode: (demo: boolean) => void;
  rooms: Room[];
  selectedFloor: number | null;
  setSelectedFloor: (floor: number | null) => void;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  selectedGuest: Guest;
  setSelectedGuest: (guest: Guest) => void;
  guests: Guest[];
  maintenanceItems: MaintenanceItem[];
  staffCategories: StaffCategory[];
  inventoryItems: InventoryItem[];
  alerts: OperationalAlert[];
  revenueData: RevenueMetric[];
  
  // Modals
  customerPreviewRoom: Room | null;
  setCustomerPreviewRoom: (room: Room | null) => void;
  assignedSuccessRoom: Room | null;
  setAssignedSuccessRoom: (room: Room | null) => void;

  // Actions
  assignRoom: (roomId: string, guestName?: string) => Promise<boolean>;
  updateRoomStatus: (roomId: string, status: RoomStatus) => void;
  resolveAlert: (alertId: string) => void;
  resetDemoData: () => void;

  // KPIs
  availableCount: number;
  occupiedCount: number;
  occupancyRate: number;
  maintenanceAlertCount: number;

  // Toast Notifications
  notifications: ToastNotification[];
  removeNotification: (id: string) => void;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning') => void;
}

const ResortContext = createContext<ResortContextType | undefined>(undefined);

export const ResortProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default active tab set directly to 'dashboard' (Command Center) as requested
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Manager');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  
  const [rooms, setRooms] = useState<Room[]>(() => generateRooms());
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch('/api/digital-twin/rooms', { cache: 'no-store' });
        const data = await response.json();
        if (active && response.ok && Array.isArray(data.rooms)) setRooms(data.rooms);
      } catch { /* Keep the last successfully loaded inventory. */ }
    };
    refresh();
    const timer = setInterval(refresh, 5000);
    window.addEventListener('focus', refresh);
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);
  useEffect(() => {
    setSelectedRoom(previous => previous ? rooms.find(room => room.id === previous.id) || null : null);
  }, [rooms]);

  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest>(INITIAL_GUEST);
  const [guests] = useState<Guest[]>(SAMPLE_GUESTS);
  const [maintenanceItems] = useState<MaintenanceItem[]>(SAMPLE_MAINTENANCE);
  const [staffCategories] = useState<StaffCategory[]>(SAMPLE_STAFF);
  const [inventoryItems] = useState<InventoryItem[]>(SAMPLE_INVENTORY);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(SAMPLE_ALERTS);
  const [revenueData] = useState<RevenueMetric[]>(SAMPLE_REVENUE_DATA);

  const [customerPreviewRoom, setCustomerPreviewRoom] = useState<Room | null>(null);
  const [assignedSuccessRoom, setAssignedSuccessRoom] = useState<Room | null>(null);

  // Toast Notifications
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Calculated KPIs
  const totalRooms = rooms.length;
  const occupiedCount = rooms.filter(r => r.status === 'OCCUPIED' || r.status === 'RESERVED').length;
  const availableCount = rooms.filter(r => r.status === 'AVAILABLE').length;
  const occupancyRate = Math.round((occupiedCount / totalRooms) * 100);
  const maintenanceAlertCount = alerts.filter(a => a.module === 'Maintenance' && a.status === 'PENDING').length;

  // Assign Room Action
  const assignRoom = async (roomId: string, guestName = selectedGuest.name) => {
    try {
      const response = await fetch('/api/digital-twin/rooms', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'book', roomId, guestName, expectedPrice: rooms.find(room => room.id === roomId)?.price }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Booking failed');
      setRooms(previous => previous.map(room => room.id === roomId ? data.room : room));
    } catch (error) {
      addNotification('Booking not completed', error instanceof Error ? error.message : 'Please try again.', 'warning');
      return false;
    }

    const targetRoom = rooms.find(r => r.id === roomId);
    if (targetRoom) {
      setAssignedSuccessRoom({ ...targetRoom, status: 'OCCUPIED', currentGuestName: guestName });
    }

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const roomLabel = targetRoom ? `Room ${targetRoom.roomNumber}` : 'your room';

    // 1. Guest Notification:
    addNotification(
      'Booking Successful!',
      `Your booking has been successful! ${roomLabel} has been reserved for you.`,
      'success'
    );

    // 2. Manager Notification:
    addNotification(
      'Manager Notification',
      `${guestName} has booked ${roomLabel} of the hotel.`,
      'info'
    );

    // 3. Manager Alert System (Zustand store -> feeds dashboard navbar bell and overview alerts)
    try {
      dispatchResortAlert({
        type: 'BOOKING',
        severity: 'INFO',
        title: 'New Room Booking',
        message: `${guestName} has booked ${roomLabel} of the hotel.`,
        actionUrl: '/digital-twin',
      });
    } catch (e) {
      // ignore
    }

    // 4. Update operational alerts in ResortContext
    setAlerts(prev => [
      {
        id: `alert-booking-${Date.now()}`,
        severity: 'INFO',
        title: 'New Room Booking',
        description: `${guestName} has booked ${roomLabel} of the hotel.`,
        timestamp: 'Just now',
        module: 'Operations',
        status: 'PENDING',
        actionText: 'View in Twin'
      },
      ...prev
    ]);
    return true;
  };

  const updateRoomStatus = async (roomId: string, status: RoomStatus) => {
    try {
      const response = await fetch('/api/digital-twin/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'status', roomId, status }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setRooms(previous => previous.map(room => room.id === roomId ? data.room : room));
      addNotification('Room Status Updated', 'Room status synchronized.', 'info');
    } catch { addNotification('Update failed', 'Unable to update room status.', 'warning'); }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'RESOLVED' } : a));
    addNotification('Alert Resolved', 'Operational alert marked as resolved.', 'success');
  };

  const resetDemoData = () => {
    fetch('/api/digital-twin/rooms').then(r => r.json()).then(data => { if (Array.isArray(data.rooms)) setRooms(data.rooms); });
    setSelectedGuest(INITIAL_GUEST);
    setAlerts(SAMPLE_ALERTS);
    setSelectedRoom(null);
    setSelectedFloor(null);
    setCustomerPreviewRoom(null);
    setAssignedSuccessRoom(null);
    addNotification('Demo Data Reset', 'View reset. Saved bookings and rates are preserved.', 'info');
  };

  return (
    <ResortContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        isDemoMode,
        setIsDemoMode,
        rooms,
        selectedFloor,
        setSelectedFloor,
        selectedRoom,
        setSelectedRoom,
        selectedGuest,
        setSelectedGuest,
        guests,
        maintenanceItems,
        staffCategories,
        inventoryItems,
        alerts,
        revenueData,
        customerPreviewRoom,
        setCustomerPreviewRoom,
        assignedSuccessRoom,
        setAssignedSuccessRoom,
        assignRoom,
        updateRoomStatus,
        resolveAlert,
        resetDemoData,
        availableCount,
        occupiedCount,
        occupancyRate,
        maintenanceAlertCount,
        notifications,
        removeNotification,
        addNotification
      }}
    >
      {/* Real-time Floating Toast Notifications */}
      <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 ${
              n.type === 'success'
                ? 'bg-slate-950/95 border-emerald-500/50 text-white shadow-emerald-500/20'
                : n.type === 'warning'
                ? 'bg-slate-950/95 border-amber-500/50 text-white shadow-amber-500/20'
                : 'bg-slate-950/95 border-blue-500/50 text-white shadow-blue-500/20'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
              n.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
              n.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {n.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
               n.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
               <Bell className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>{n.title}</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {n.message}
              </div>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {children}
    </ResortContext.Provider>
  );
};

export const useResort = () => {
  const context = useContext(ResortContext);
  if (!context) throw new Error('useResort must be used within ResortProvider');
  return context;
};
