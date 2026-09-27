import { Room, RoomType, ViewType, Guest, MaintenanceItem, StaffCategory, InventoryItem, OperationalAlert, RevenueMetric } from '../types/resort';

// Real high quality photos for luxury resort previews
const ROOM_IMAGES = {
  Standard: [
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80"
  ],
  Deluxe: [
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"
  ],
  Premium: [
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80"
  ],
  Executive: [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
  ],
  Suite: [
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
  ],
  'Luxury Suite': [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"
  ]
};

// Floor mapping according to specifications
export const FLOOR_CONFIG = [
  { floor: 1, name: 'Lobby & Standard Rooms', type: 'Standard' as RoomType, roomCount: 20, price: 7500 },
  { floor: 2, name: 'Standard Rooms', type: 'Standard' as RoomType, roomCount: 25, price: 7500 },
  { floor: 3, name: 'Standard Rooms', type: 'Standard' as RoomType, roomCount: 25, price: 8000 },
  { floor: 4, name: 'Deluxe Rooms', type: 'Deluxe' as RoomType, roomCount: 25, price: 10500 },
  { floor: 5, name: 'Deluxe Rooms', type: 'Deluxe' as RoomType, roomCount: 25, price: 12500 },
  { floor: 6, name: 'Premium Rooms', type: 'Premium' as RoomType, roomCount: 25, price: 14000 },
  { floor: 7, name: 'Premium Rooms', type: 'Premium' as RoomType, roomCount: 25, price: 15500 },
  { floor: 8, name: 'Executive Rooms', type: 'Executive' as RoomType, roomCount: 25, price: 18000 },
  { floor: 9, name: 'Suites', type: 'Suite' as RoomType, roomCount: 24, price: 25000 },
  { floor: 10, name: 'Luxury Suites & VIP', type: 'Luxury Suite' as RoomType, roomCount: 23, price: 40000 },
];

export const generateRooms = (): Room[] => {
  const rooms: Room[] = [];
  const views: ViewType[] = ['Pool View', 'Ocean View', 'Garden View', 'Mountain View', 'City View'];
  
  // Specific room details for precision matching
  // Room 904 specified as top match (Deluxe / Suite pool view high floor)
  // Let's ensure exact rooms mentioned in prompt exist with high fidelity:
  
  FLOOR_CONFIG.forEach(cfg => {
    for (let i = 1; i <= cfg.roomCount; i++) {
      const roomNumber = cfg.floor * 100 + i;
      const id = `room-${roomNumber}`;
      
      // Distribution for exact ~82% occupancy (approx 200 occupied, 47 available)
      let status: Room['status'] = 'OCCUPIED';
      
      // Highlight specific available rooms for quick demonstration
      if (roomNumber === 904 || roomNumber === 806 || roomNumber === 704 || roomNumber === 502 || roomNumber === 410 || (i % 5 === 0 && i !== 15)) {
        status = 'AVAILABLE';
      } else if (roomNumber === 806) {
        status = 'MAINTENANCE'; // Will set 806 AC risk separately
      } else if (i === 3) {
        status = 'RESERVED';
      } else if (i === 7) {
        status = 'HOUSEKEEPING';
      } else if (i === 13) {
        status = 'MAINTENANCE';
      } else if (i === 19) {
        status = 'BLOCKED';
      }
      
      // Override exact Room 904 for demo scenario
      if (roomNumber === 904) {
        status = 'AVAILABLE';
      }
      if (roomNumber === 806) {
        status = 'AVAILABLE'; // Candidate 2
      }
      if (roomNumber === 704) {
        status = 'AVAILABLE'; // Candidate 3
      }

      const isQuietZone = roomNumber % 2 === 0;
      const view = roomNumber % 2 === 0 ? 'Pool View' : views[i % views.length];
      const bedType = cfg.type === 'Luxury Suite' || cfg.type === 'Suite' || cfg.type === 'Executive' || roomNumber === 904 ? 'King Bed' : (i % 2 === 0 ? 'Queen Bed' : 'Twin Beds');

      let maintenanceStatus: Room['maintenanceStatus'] = 'No Issues';
      let equipmentHealth = 96;
      if (roomNumber === 806) {
        maintenanceStatus = 'AC Risk';
        equipmentHealth = 64;
      } else if (i === 13) {
        maintenanceStatus = 'Plumbing Alert';
        equipmentHealth = 72;
      }

      rooms.push({
        id,
        roomNumber,
        floor: cfg.floor,
        type: cfg.type,
        status,
        price: roomNumber === 904 ? 12500 : cfg.price,
        view,
        bedType,
        sizeSqFt: cfg.floor * 40 + 320,
        amenities: [
          'High-Speed Wi-Fi',
          '55" Smart TV',
          'Mini Bar',
          'Climate Control AC',
          '24/7 Room Service',
          'Private Balcony',
          'Nespresso Machine',
          'Luxury Bathrobes'
        ],
        images: ROOM_IMAGES[cfg.type] || ROOM_IMAGES.Deluxe,
        housekeepingStatus: status === 'HOUSEKEEPING' ? 'In Progress' : 'Ready',
        lastCleaned: '10:42 AM',
        cleanlinessScore: roomNumber === 904 ? 98 : 94 + (i % 5),
        maintenanceStatus,
        lastInspection: 'Today',
        equipmentHealth,
        previousOccupants: 14 + (i % 10),
        isQuietZone,
        isNonSmoking: true,
        distanceFromElevator: i <= 3 ? 'Near' : i >= 18 ? 'Far' : 'Moderate',
        currentGuestName: status === 'OCCUPIED' ? `Guest ${roomNumber}` : undefined
      });
    }
  });

  return rooms;
};

export const INITIAL_GUEST: Guest = {
  id: 'guest-001',
  name: 'Rahul Sharma',
  bookingId: 'BK-2026-0924',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  stayNights: 3,
  adults: 2,
  children: 1,
  roomType: 'Deluxe',
  preferences: {
    quietRoom: true,
    bedType: 'King Bed',
    preferredView: 'Pool View',
    nonSmoking: true,
    highFloor: true,
    nearElevator: false,
    dietary: 'Vegetarian'
  },
  visitHistoryCount: 3,
  totalSpent: 84500,
  satisfactionScore: 4.9,
  vipStatus: true,
  notes: 'Prefers quiet environment away from elevators. Loves pool view and complimentary spa tea.',
  sentiment: 'Positive'
};

export const SAMPLE_GUESTS: Guest[] = [
  INITIAL_GUEST,
  {
    id: 'guest-002',
    name: 'Priya Patel',
    bookingId: 'BK-2026-0925',
    email: 'priya.patel@example.com',
    phone: '+91 98220 11223',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    stayNights: 2,
    adults: 2,
    children: 0,
    roomType: 'Suite',
    preferences: {
      quietRoom: true,
      bedType: 'Super King',
      preferredView: 'Ocean View',
      nonSmoking: true,
      highFloor: true,
      nearElevator: true,
      dietary: 'Vegan'
    },
    visitHistoryCount: 5,
    totalSpent: 142000,
    satisfactionScore: 5.0,
    vipStatus: true,
    notes: 'Anniversary celebration. Requested rose petal turn-down.',
    sentiment: 'Positive'
  },
  {
    id: 'guest-003',
    name: 'Amitabh Sen',
    bookingId: 'BK-2026-0926',
    email: 'amitabh.sen@techcorp.in',
    phone: '+91 99301 44556',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    stayNights: 4,
    adults: 1,
    children: 0,
    roomType: 'Executive',
    preferences: {
      quietRoom: true,
      bedType: 'King Bed',
      preferredView: 'Garden View',
      nonSmoking: true,
      highFloor: false,
      nearElevator: true,
      dietary: 'Non-Vegetarian'
    },
    visitHistoryCount: 1,
    totalSpent: 72000,
    satisfactionScore: 4.2,
    vipStatus: false,
    notes: 'Corporate stay. Requires late check-out & desk working area.',
    sentiment: 'Neutral'
  }
];

export const SAMPLE_MAINTENANCE: MaintenanceItem[] = [
  {
    id: 'maint-01',
    equipmentName: 'Room 806 Air Conditioner',
    location: 'Floor 8 — Room 806',
    category: 'AC',
    healthScore: 64,
    failureProbability: 72,
    riskLevel: 'High',
    lastMaintenance: '2026-08-14',
    nextMaintenance: '2026-09-27',
    recommendedAction: 'Schedule preventive maintenance before next check-in.'
  },
  {
    id: 'maint-02',
    equipmentName: 'Main Tower Elevator #2',
    location: 'Central Elevator Shaft',
    category: 'Elevators',
    healthScore: 81,
    failureProbability: 38,
    riskLevel: 'Medium',
    lastMaintenance: '2026-09-01',
    nextMaintenance: '2026-10-01',
    recommendedAction: 'Inspect motor alignment during off-peak hours (2 AM).'
  },
  {
    id: 'maint-03',
    equipmentName: 'Backup Diesel Generator A',
    location: 'Sub-Basement Utility Room',
    category: 'Generators',
    healthScore: 94,
    failureProbability: 8,
    riskLevel: 'Low',
    lastMaintenance: '2026-09-10',
    nextMaintenance: '2026-11-10',
    recommendedAction: 'Optimal health. Regular monthly fuel filter routine.'
  },
  {
    id: 'maint-04',
    equipmentName: 'Infinity Pool Filtration System',
    location: 'Level 1 Resort Garden',
    category: 'Pool System',
    healthScore: 76,
    failureProbability: 45,
    riskLevel: 'Medium',
    lastMaintenance: '2026-09-15',
    nextMaintenance: '2026-09-30',
    recommendedAction: 'Backwash filter sand and calibrate pH sensor.'
  },
  {
    id: 'maint-05',
    equipmentName: 'Commercial Laundry Boiler #1',
    location: 'Service Building',
    category: 'Boilers',
    healthScore: 58,
    failureProbability: 79,
    riskLevel: 'Critical',
    lastMaintenance: '2026-07-20',
    nextMaintenance: '2026-09-27',
    recommendedAction: 'Replace pressure safety valve immediately.'
  }
];

export const SAMPLE_STAFF: StaffCategory[] = [
  {
    id: 'staff-01',
    category: 'Housekeeping',
    required: 18,
    available: 15,
    onLeave: 2,
    workloadScore: 88,
    aiRecommendation: 'Reallocate 2 staff from Floor 2 (low-demand) to Floor 9 (high turn-over).'
  },
  {
    id: 'staff-02',
    category: 'Reception',
    required: 8,
    available: 8,
    onLeave: 1,
    workloadScore: 65,
    aiRecommendation: 'Optimal coverage. 3 agents dedicated to VIP Smart Check-In peak.'
  },
  {
    id: 'staff-03',
    category: 'Maintenance',
    required: 6,
    available: 5,
    onLeave: 1,
    workloadScore: 92,
    aiRecommendation: 'Dispatch Engineer to Room 806 AC inspection before 3 PM.'
  },
  {
    id: 'staff-04',
    category: 'Kitchen',
    required: 14,
    available: 13,
    onLeave: 1,
    workloadScore: 78,
    aiRecommendation: 'Prepare additional breakfast buffet capacity for 94% forecast.'
  },
  {
    id: 'staff-05',
    category: 'Spa',
    required: 6,
    available: 6,
    onLeave: 0,
    workloadScore: 70,
    aiRecommendation: 'Cross-sell afternoon aromatherapy slots to arriving couples.'
  }
];

export const SAMPLE_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-01',
    name: 'Luxury Bath Towels (Set of 4)',
    category: 'Linens',
    currentStock: 420,
    unit: 'Sets',
    dailyUsage: 95,
    predictedDemand: 118,
    reorderLevel: 200,
    daysRemaining: 3.5,
    aiAlert: 'Reorder recommended to prevent weekend stockout.',
    isLow: true
  },
  {
    id: 'inv-02',
    name: 'Organic Breakfast Eggs',
    category: 'Food',
    currentStock: 180,
    unit: 'Dozen',
    dailyUsage: 45,
    predictedDemand: 62,
    reorderLevel: 100,
    daysRemaining: 2.9,
    aiAlert: 'High demand alert for tomorrow morning. Auto-PO drafted.',
    isLow: true
  },
  {
    id: 'inv-03',
    name: 'Artisanal Coffee Pods',
    category: 'Beverages',
    currentStock: 1250,
    unit: 'Pods',
    dailyUsage: 140,
    predictedDemand: 160,
    reorderLevel: 500,
    daysRemaining: 7.8,
    aiAlert: 'Stock levels healthy for the next 7 days.',
    isLow: false
  },
  {
    id: 'inv-04',
    name: 'Botanical Shampoo Bottles (300ml)',
    category: 'Bathroom Supplies',
    currentStock: 680,
    unit: 'Bottles',
    dailyUsage: 80,
    predictedDemand: 95,
    reorderLevel: 300,
    daysRemaining: 7.1,
    aiAlert: 'Stock adequate. Replenish room baskets on Floor 5-8.',
    isLow: false
  }
];

export const SAMPLE_ALERTS: OperationalAlert[] = [
  {
    id: 'alert-1',
    severity: 'HIGH',
    title: 'Room 806 AC Failure Risk (72%)',
    description: 'Compressor vibration anomaly detected. Preventive check recommended prior to guest arrival.',
    timestamp: '10 min ago',
    module: 'Maintenance',
    status: 'PENDING',
    actionText: 'Schedule Technician'
  },
  {
    id: 'alert-2',
    severity: 'MEDIUM',
    title: 'Housekeeping Demand Spike Expected (11:00 AM - 2:00 PM)',
    description: '38 check-ins & 29 check-outs overlap today. Shortage of 3 housekeepers on Floors 8-10.',
    timestamp: '25 min ago',
    module: 'Staff Scheduling',
    status: 'PENDING',
    actionText: 'Reallocate Staff'
  },
  {
    id: 'alert-3',
    severity: 'LOW',
    title: 'Breakfast Inventory Approaching Safety Level',
    description: 'Fresh milk & organic eggs projected to drop below minimum safety stock by 8:00 AM tomorrow.',
    timestamp: '1 hour ago',
    module: 'Inventory',
    status: 'ACKNOWLEDGED',
    actionText: 'Confirm Restock PO'
  },
  {
    id: 'alert-4',
    severity: 'INFO',
    title: 'Weekend High Demand Dynamic Surge Alert',
    description: 'Resort occupancy projected to reach 94% tomorrow. Recommended price adjustment: +8% to +12%.',
    timestamp: '2 hours ago',
    module: 'Revenue',
    status: 'PENDING',
    actionText: 'Apply Dynamic Pricing'
  }
];

export const SAMPLE_REVENUE_DATA: RevenueMetric[] = [
  { date: 'Mon', roomRevenue: 1420000, foodRevenue: 310000, spaRevenue: 95000, activityRevenue: 45000, occupancyPercent: 78, adr: 12400, revpar: 9672 },
  { date: 'Tue', roomRevenue: 1510000, foodRevenue: 340000, spaRevenue: 102000, activityRevenue: 52000, occupancyPercent: 80, adr: 12600, revpar: 10080 },
  { date: 'Wed', roomRevenue: 1650000, foodRevenue: 380000, spaRevenue: 115000, activityRevenue: 60000, occupancyPercent: 82, adr: 12800, revpar: 10496 },
  { date: 'Thu', roomRevenue: 1720000, foodRevenue: 410000, spaRevenue: 128000, activityRevenue: 68000, occupancyPercent: 85, adr: 13200, revpar: 11220 },
  { date: 'Fri (Today)', roomRevenue: 1840000, foodRevenue: 450000, spaRevenue: 140000, activityRevenue: 75000, occupancyPercent: 88, adr: 13800, revpar: 12144 },
  { date: 'Sat (Forecast)', roomRevenue: 2150000, foodRevenue: 520000, spaRevenue: 180000, activityRevenue: 95000, occupancyPercent: 94, adr: 14900, revpar: 14006 },
  { date: 'Sun (Forecast)', roomRevenue: 1980000, foodRevenue: 480000, spaRevenue: 160000, activityRevenue: 85000, occupancyPercent: 91, adr: 14200, revpar: 12922 }
];
