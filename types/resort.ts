export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'HOUSEKEEPING' | 'MAINTENANCE' | 'BLOCKED';

export type RoomType = 'Standard' | 'Deluxe' | 'Premium' | 'Executive' | 'Suite' | 'Luxury Suite';

export type ViewType = 'Pool View' | 'Ocean View' | 'Garden View' | 'Mountain View' | 'City View';

export type UserRole = 'Manager' | 'Receptionist' | 'Housekeeping' | 'Maintenance' | 'Revenue Manager' | 'Admin';

export type ActiveTab = 
  | 'landing'
  | 'dashboard'
  | 'digital-twin'
  | 'check-in'
  | 'guests'
  | 'rooms'
  | 'operations'
  | 'maintenance'
  | 'staff'
  | 'inventory'
  | 'concierge'
  | 'sentiment'
  | 'revenue'
  | 'analytics'
  | 'alerts'
  | 'settings';

export interface Room {
  id: string;
  roomNumber: number;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  price: number;
  view: ViewType;
  bedType: 'King Bed' | 'Queen Bed' | 'Twin Beds' | 'Super King';
  sizeSqFt: number;
  amenities: string[];
  images: string[];
  housekeepingStatus: 'Ready' | 'In Progress' | 'Needs Cleaning' | 'Inspected';
  lastCleaned: string;
  cleanlinessScore: number;
  maintenanceStatus: 'No Issues' | 'Minor Wear' | 'AC Risk' | 'Plumbing Alert' | 'Under Repair';
  lastInspection: string;
  equipmentHealth: number;
  previousOccupants: number;
  isQuietZone: boolean;
  isNonSmoking: boolean;
  distanceFromElevator: 'Near' | 'Moderate' | 'Far';
  aiMatchScore?: number;
  aiMatchReasons?: string[];
  currentGuestName?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

export interface GuestPreference {
  quietRoom: boolean;
  bedType: string;
  preferredView: ViewType;
  nonSmoking: boolean;
  highFloor: boolean;
  nearElevator: boolean;
  dietary: string;
}

export interface Guest {
  id: string;
  name: string;
  bookingId: string;
  email: string;
  phone: string;
  avatar: string;
  stayNights: number;
  adults: number;
  children: number;
  roomType: RoomType;
  preferences: GuestPreference;
  visitHistoryCount: number;
  totalSpent: number;
  satisfactionScore: number;
  vipStatus: boolean;
  notes: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface MaintenanceItem {
  id: string;
  equipmentName: string;
  location: string;
  category: 'AC' | 'Elevators' | 'Generators' | 'Water Pumps' | 'Boilers' | 'Kitchen Equipment' | 'Pool System' | 'Appliances';
  healthScore: number;
  failureProbability: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  lastMaintenance: string;
  nextMaintenance: string;
  recommendedAction: string;
}

export interface StaffCategory {
  id: string;
  category: 'Housekeeping' | 'Reception' | 'Maintenance' | 'Kitchen' | 'Security' | 'Room Service' | 'Spa' | 'Pool Staff';
  required: number;
  available: number;
  onLeave: number;
  workloadScore: number;
  aiRecommendation: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Food' | 'Beverages' | 'Housekeeping' | 'Bathroom Supplies' | 'Linens' | 'Maintenance Parts';
  currentStock: number;
  unit: string;
  dailyUsage: number;
  predictedDemand: number;
  reorderLevel: number;
  daysRemaining: number;
  aiAlert: string;
  isLow: boolean;
}

export interface OperationalAlert {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  title: string;
  description: string;
  timestamp: string;
  module: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';
  actionText: string;
}

export interface RevenueMetric {
  date: string;
  roomRevenue: number;
  foodRevenue: number;
  spaRevenue: number;
  activityRevenue: number;
  occupancyPercent: number;
  adr: number; // Average Daily Rate
  revpar: number; // Revenue Per Available Room
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
