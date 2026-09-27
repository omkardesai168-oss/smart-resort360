import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Azure Hills Resort database...');

  // ============================================
  // RESORT
  // ============================================
  const resort = await prisma.resort.create({
    data: {
      name: 'Azure Hills Resort',
      location: 'Coorg, Karnataka, India',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      totalRooms: 120,
      totalVillas: 20,
      starRating: 5,
      checkInTime: '14:00',
      checkOutTime: '12:00',
    },
  });

  console.log('✅ Resort created:', resort.name);

  // ============================================
  // BUILDINGS
  // ============================================
  const mainBuilding = await prisma.building.create({
    data: { resortId: resort.id, name: 'Main Wing', type: 'MAIN_HOTEL', floors: 5, positionX: 0, positionY: 0, positionZ: 0 },
  });
  const eastWing = await prisma.building.create({
    data: { resortId: resort.id, name: 'East Wing', type: 'MAIN_HOTEL', floors: 4, positionX: 20, positionY: 0, positionZ: 0 },
  });
  const villaBlock = await prisma.building.create({
    data: { resortId: resort.id, name: 'Villa Block', type: 'VILLA', floors: 1, positionX: -15, positionY: 0, positionZ: 20 },
  });
  const spaBuilding = await prisma.building.create({
    data: { resortId: resort.id, name: 'Azure Spa', type: 'SPA', floors: 1, positionX: 15, positionY: 0, positionZ: -15 },
  });
  const gymBuilding = await prisma.building.create({
    data: { resortId: resort.id, name: 'Fitness Center', type: 'GYM', floors: 1, positionX: -15, positionY: 0, positionZ: -10 },
  });

  // ============================================
  // ROOMS (120 rooms + 20 villas)
  // ============================================
  const roomTypes = [
    { type: 'STANDARD', price: 8500, sqft: 320, bedType: 'King' },
    { type: 'DELUXE', price: 11000, sqft: 420, bedType: 'King' },
    { type: 'PREMIUM', price: 15500, sqft: 560, bedType: 'King' },
    { type: 'SUITE', price: 22000, sqft: 820, bedType: 'King' },
    { type: 'VILLA', price: 35000, sqft: 1400, bedType: 'King' },
  ];

  const roomStatuses = ['AVAILABLE', 'OCCUPIED', 'OCCUPIED', 'OCCUPIED', 'CLEANING', 'MAINTENANCE'];
  const rooms: any[] = [];

  // Main Building rooms (floors 1-5, 20 rooms each)
  for (let floor = 1; floor <= 5; floor++) {
    for (let num = 1; num <= 20; num++) {
      const roomNum = `${floor}${String(num).padStart(2, '0')}`;
      const typeIndex = floor <= 2 ? 0 : floor === 3 ? 1 : floor === 4 ? 2 : 3;
      const rt = roomTypes[typeIndex];
      const status = roomStatuses[Math.floor(Math.random() * roomStatuses.length)];
      rooms.push({
        buildingId: mainBuilding.id,
        number: roomNum,
        floor,
        type: rt.type,
        status,
        basePrice: rt.price,
        maxOccupancy: 3,
        bedType: rt.bedType,
        sqft: rt.sqft,
        amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Mini Bar', 'Safe', 'Balcony']),
        temperature: 22 + Math.random() * 3,
        maintenanceRisk: Math.random() * 0.4,
        positionX: (num - 10) * 1.2,
        positionY: (floor - 1) * 3.5,
        positionZ: 0,
      });
    }
  }

  // East Wing rooms (floors 1-4, 10 rooms each) - Premium
  for (let floor = 1; floor <= 4; floor++) {
    for (let num = 1; num <= 10; num++) {
      const roomNum = `E${floor}${String(num).padStart(2, '0')}`;
      const rt = roomTypes[floor <= 2 ? 2 : 3];
      const status = roomStatuses[Math.floor(Math.random() * roomStatuses.length)];
      rooms.push({
        buildingId: eastWing.id,
        number: roomNum,
        floor,
        type: rt.type,
        status,
        basePrice: rt.price,
        maxOccupancy: 2,
        bedType: rt.bedType,
        sqft: rt.sqft,
        amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Mini Bar', 'Safe', 'Balcony', 'Jacuzzi']),
        temperature: 22 + Math.random() * 3,
        maintenanceRisk: Math.random() * 0.35,
        positionX: 20 + (num - 5) * 1.2,
        positionY: (floor - 1) * 3.5,
        positionZ: 0,
      });
    }
  }

  // Villas
  for (let i = 1; i <= 20; i++) {
    const status = i <= 14 ? 'OCCUPIED' : i <= 17 ? 'AVAILABLE' : 'CLEANING';
    rooms.push({
      buildingId: villaBlock.id,
      number: `V${String(i).padStart(2, '0')}`,
      floor: 1,
      type: 'VILLA',
      status,
      basePrice: roomTypes[4].price,
      maxOccupancy: 6,
      bedType: 'King',
      sqft: roomTypes[4].sqft,
      amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Full Kitchen', 'Private Pool', 'Butler Service', 'Golf Cart']),
      temperature: 23 + Math.random() * 2,
      maintenanceRisk: Math.random() * 0.25,
      positionX: -15 + ((i - 1) % 5) * 4,
      positionY: 0,
      positionZ: 20 + Math.floor((i - 1) / 5) * 5,
    });
  }

  await prisma.room.createMany({ data: rooms });
  const createdRooms = await prisma.room.findMany();
  console.log(`✅ ${createdRooms.length} rooms created`);

  // ============================================
  // RESTAURANTS
  // ============================================
  await prisma.restaurant.createMany({
    data: [
      { resortId: resort.id, name: 'Azure Terrace', type: 'MAIN', capacity: 120, openTime: '07:00', closeTime: '23:00' },
      { resortId: resort.id, name: 'Spice Garden', type: 'FINE_DINING', capacity: 60, openTime: '18:00', closeTime: '23:30' },
      { resortId: resort.id, name: 'Infinity Pool Bar', type: 'POOL_BAR', capacity: 40, openTime: '09:00', closeTime: '21:00' },
    ],
  });
  console.log('✅ Restaurants created');

  // ============================================
  // USERS
  // ============================================
  const hashedPassword = await bcrypt.hash('resort360', 10);
  const users = await prisma.user.createMany({
    data: [
      { name: 'Admin User', email: 'admin@azurehills.com', password: hashedPassword, role: 'SUPER_ADMIN', department: 'Management' },
      { name: 'Ananya Mehta', email: 'manager@azurehills.com', password: hashedPassword, role: 'RESORT_MANAGER', department: 'Management' },
      { name: 'Vikram Patel', email: 'revenue@azurehills.com', password: hashedPassword, role: 'REVENUE_MANAGER', department: 'Revenue' },
      { name: 'Priya Nair', email: 'operations@azurehills.com', password: hashedPassword, role: 'OPERATIONS_MANAGER', department: 'Operations' },
      { name: 'Staff Member', email: 'staff@azurehills.com', password: hashedPassword, role: 'OPERATIONS_MANAGER', department: 'Operations' },
      { name: 'Aarav Sharma', email: 'guest@azurehills.com', password: hashedPassword, role: 'GUEST', department: 'Guest' },
      { name: 'Suresh Kumar', email: 'housekeeping@azurehills.com', password: hashedPassword, role: 'HOUSEKEEPING', department: 'Housekeeping' },
      { name: 'Ravi Sharma', email: 'maintenance@azurehills.com', password: hashedPassword, role: 'MAINTENANCE', department: 'Maintenance' },
      { name: 'Deepa Iyer', email: 'concierge@azurehills.com', password: hashedPassword, role: 'CONCIERGE', department: 'Concierge' },
      // Staff users
      { name: 'Kiran Bose', email: 'kiran.bose@azurehills.com', password: hashedPassword, role: 'HOUSEKEEPING', department: 'Housekeeping' },
      { name: 'Meera Singh', email: 'meera.singh@azurehills.com', password: hashedPassword, role: 'HOUSEKEEPING', department: 'Housekeeping' },
      { name: 'Arjun Das', email: 'arjun.das@azurehills.com', password: hashedPassword, role: 'MAINTENANCE', department: 'Maintenance' },
    ],
  });
  const createdUsers = await prisma.user.findMany();
  console.log(`✅ ${createdUsers.length} users created`);

  // ============================================
  // STAFF
  // ============================================
  const departments = ['HOUSEKEEPING', 'FOOD_BEVERAGE', 'MAINTENANCE', 'CONCIERGE', 'SECURITY', 'SPA', 'FRONT_DESK'];
  const positions: Record<string, string[]> = {
    HOUSEKEEPING: ['Room Attendant', 'Floor Supervisor', 'Laundry Supervisor'],
    FOOD_BEVERAGE: ['Waiter', 'Chef', 'Bartender', 'F&B Manager'],
    MAINTENANCE: ['Technician', 'Engineer', 'Supervisor'],
    CONCIERGE: ['Concierge', 'Bell Boy', 'Driver'],
    SECURITY: ['Security Guard', 'Supervisor'],
    SPA: ['Therapist', 'Receptionist', 'Manager'],
    FRONT_DESK: ['Receptionist', 'Supervisor', 'Night Auditor'],
  };

  const staffData = createdUsers.slice(0, 7).map((u, i) => ({
    userId: u.id,
    employeeId: `EMP${String(1000 + i).padStart(4, '0')}`,
    department: departments[i % departments.length],
    position: positions[departments[i % departments.length]][0],
    skills: JSON.stringify(['Communication', 'Customer Service']),
    shift: ['MORNING', 'AFTERNOON', 'NIGHT'][i % 3],
    status: 'ON_DUTY',
    currentZone: ['Lobby', 'Floor 2', 'Pool Area', 'Restaurant', 'Main Gate'][i % 5],
    workload: 0.4 + Math.random() * 0.5,
    performance: 0.7 + Math.random() * 0.3,
    joinDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    salary: 25000 + Math.random() * 50000,
  }));
  await prisma.staff.createMany({ data: staffData });
  console.log('✅ Staff created');

  // ============================================
  // GUESTS (50 realistic profiles)
  // ============================================
  const guestNames = [
    ['Rahul', 'Sharma'], ['Priya', 'Kapoor'], ['Arjun', 'Mehta'], ['Ananya', 'Singh'],
    ['Vikram', 'Patel'], ['Deepika', 'Nair'], ['Rohit', 'Bose'], ['Kavya', 'Iyer'],
    ['Siddharth', 'Verma'], ['Pooja', 'Gupta'], ['Aditya', 'Kumar'], ['Shreya', 'Das'],
    ['Karan', 'Joshi'], ['Isha', 'Sharma'], ['Varun', 'Malhotra'], ['Nisha', 'Reddy'],
    ['Rishi', 'Chatterjee'], ['Meera', 'Pillai'], ['Nikhil', 'Rao'], ['Amrita', 'Desai'],
    ['Sameer', 'Khan'], ['Divya', 'Mishra'], ['Akash', 'Tiwari'], ['Smita', 'Patil'],
    ['Vishal', 'Jain'], ['Anjali', 'Shah'], ['Mihir', 'Trivedi'], ['Sunita', 'Kulkarni'],
    ['Dev', 'Saxena'], ['Neha', 'Agarwal'], ['Gaurav', 'Choudhary'], ['Ritu', 'Bajaj'],
    ['Aryan', 'Mittal'], ['Pallavi', 'Sen'], ['Abhishek', 'Roy'], ['Tina', 'Mathur'],
    ['Rajesh', 'Krishnan'], ['Mala', 'Nambiar'], ['Suresh', 'Srinivasan'], ['Geetha', 'Menon'],
    ['James', 'Thompson'], ['Sarah', 'Mitchell'], ['David', 'Chen'], ['Emily', 'Watson'],
    ['Michael', 'Park'], ['Jennifer', 'Lee'], ['William', 'Anderson'], ['Christine', 'Brown'],
    ['Robert', 'Taylor'], ['Lisa', 'Johnson'],
  ];
  const nationalities = ['Indian', 'Indian', 'Indian', 'Indian', 'British', 'American', 'German', 'Singaporean', 'Australian', 'Japanese'];
  const loyaltyTiers = ['BRONZE', 'SILVER', 'SILVER', 'GOLD', 'GOLD', 'PLATINUM', 'DIAMOND'];

  const guestsData = guestNames.map(([firstName, lastName], i) => ({
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
    phone: `+91 ${9800000000 + i * 11111}`,
    nationality: nationalities[i % nationalities.length],
    loyaltyTier: loyaltyTiers[i % loyaltyTiers.length],
    loyaltyPoints: Math.floor(Math.random() * 50000),
    totalStays: Math.floor(Math.random() * 20),
    totalSpend: 50000 + Math.random() * 500000,
    isVIP: i < 8,
    frictionScore: Math.random() * 100,
    satisfactionScore: 60 + Math.random() * 40,
    luxuryPreference: 50 + Math.random() * 50,
    adventureScore: 30 + Math.random() * 70,
    foodSpending: 40 + Math.random() * 60,
    spaPreference: 20 + Math.random() * 80,
    priceSensitivity: 10 + Math.random() * 90,
    familyActivities: 20 + Math.random() * 80,
  }));

  await prisma.guest.createMany({ data: guestsData });
  const createdGuests = await prisma.guest.findMany();
  console.log(`✅ ${createdGuests.length} guests created`);

  // ============================================
  // BOOKINGS (create active bookings for occupied rooms)
  // ============================================
  const occupiedRooms = createdRooms.filter(r => r.status === 'OCCUPIED').slice(0, Math.min(35, createdGuests.length));
  const today = new Date();
  
  const bookingsData = occupiedRooms.map((room, i) => {
    const guest = createdGuests[i % createdGuests.length];
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() - Math.floor(Math.random() * 5));
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 2 + Math.floor(Math.random() * 7));
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    return {
      guestId: guest.id,
      roomId: room.id,
      checkIn,
      checkOut,
      status: 'CHECKED_IN',
      adults: 1 + Math.floor(Math.random() * 3),
      children: Math.floor(Math.random() * 3),
      ratePerNight: room.basePrice * (0.9 + Math.random() * 0.3),
      totalAmount: room.basePrice * nights,
      discount: Math.random() * 0.15,
      paymentStatus: 'PAID',
      source: ['DIRECT', 'BOOKING_COM', 'EXPEDIA', 'TRAVEL_AGENT'][Math.floor(Math.random() * 4)],
    };
  });
  
  await prisma.booking.createMany({ data: bookingsData });
  console.log(`✅ ${bookingsData.length} bookings created`);

  // ============================================
  // GUEST INTERACTIONS
  // ============================================
  const interactionTypes = ['REQUEST', 'COMPLAINT', 'COMPLIMENT', 'INQUIRY'];
  const subjects = [
    'Wi-Fi connectivity issue', 'Room temperature adjustment', 'Extra towels request',
    'Restaurant reservation', 'Airport transfer', 'Late checkout request',
    'AC not working properly', 'Noisy neighbors', 'Excellent spa experience',
    'Housekeeping timing', 'Pool schedule inquiry', 'Birthday decoration request',
  ];

  const interactionsData = createdGuests.slice(0, 30).map((guest, i) => ({
    guestId: guest.id,
    type: interactionTypes[i % interactionTypes.length],
    channel: ['PHONE', 'APP', 'IN_PERSON'][i % 3],
    subject: subjects[i % subjects.length],
    description: `Guest reported: ${subjects[i % subjects.length]}. Needs immediate attention.`,
    status: ['OPEN', 'IN_PROGRESS', 'RESOLVED'][i % 3],
    priority: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][i % 4],
    department: ['HOUSEKEEPING', 'FRONT_DESK', 'MAINTENANCE', 'CONCIERGE'][i % 4],
    responseTime: 5 + Math.random() * 30,
  }));
  await prisma.guestInteraction.createMany({ data: interactionsData });
  console.log('✅ Guest interactions created');

  // ============================================
  // MAINTENANCE ASSETS
  // ============================================
  const assets = [
    { assetId: 'HVAC-M01', name: 'Main Lobby HVAC Unit', category: 'HVAC', location: 'Main Building - Basement', healthScore: 92, failureProbability: 0.05, criticalityLevel: 'HIGH' },
    { assetId: 'HVAC-A01', name: 'Block A HVAC System', category: 'HVAC', location: 'East Wing - Rooftop', healthScore: 71, failureProbability: 0.34, criticalityLevel: 'HIGH' },
    { assetId: 'HVAC-B01', name: 'Block B HVAC System', category: 'HVAC', location: 'Main Wing - Rooftop', healthScore: 85, failureProbability: 0.12, criticalityLevel: 'HIGH' },
    { assetId: 'ELEV-01', name: 'Main Building Elevator 1', category: 'ELEVATOR', location: 'Main Building', healthScore: 94, failureProbability: 0.03, criticalityLevel: 'CRITICAL' },
    { assetId: 'ELEV-02', name: 'Main Building Elevator 2', category: 'ELEVATOR', location: 'Main Building', healthScore: 88, failureProbability: 0.08, criticalityLevel: 'CRITICAL' },
    { assetId: 'GEN-01', name: 'Primary Generator', category: 'GENERATOR', location: 'Power Room B1', healthScore: 97, failureProbability: 0.02, criticalityLevel: 'CRITICAL' },
    { assetId: 'GEN-02', name: 'Backup Generator', category: 'GENERATOR', location: 'Power Room B2', healthScore: 78, failureProbability: 0.18, criticalityLevel: 'CRITICAL' },
    { assetId: 'PUMP-P01', name: 'Main Pool Pump', category: 'PUMP', location: 'Pool Area', healthScore: 83, failureProbability: 0.15, criticalityLevel: 'MEDIUM' },
    { assetId: 'PUMP-P02', name: 'Villa Pool Pump', category: 'PUMP', location: 'Villa Area', healthScore: 91, failureProbability: 0.06, criticalityLevel: 'MEDIUM' },
    { assetId: 'REFR-K01', name: 'Main Kitchen Refrigeration', category: 'REFRIGERATION', location: 'Azure Terrace Kitchen', healthScore: 89, failureProbability: 0.09, criticalityLevel: 'HIGH' },
    { assetId: 'REFR-K02', name: 'Spice Garden Refrigeration', category: 'REFRIGERATION', location: 'Spice Garden Kitchen', healthScore: 76, failureProbability: 0.22, criticalityLevel: 'HIGH' },
    { assetId: 'WTR-01', name: 'Water Treatment Plant', category: 'PLUMBING', location: 'Utility Block', healthScore: 95, failureProbability: 0.04, criticalityLevel: 'CRITICAL' },
    { assetId: 'WTR-02', name: 'STP Unit', category: 'PLUMBING', location: 'Utility Block', healthScore: 87, failureProbability: 0.11, criticalityLevel: 'HIGH' },
    { assetId: 'POOL-CHR-01', name: 'Pool Chlorination System', category: 'POOL', location: 'Pool Area', healthScore: 93, failureProbability: 0.05, criticalityLevel: 'HIGH' },
    { assetId: 'POOL-HTR-01', name: 'Pool Heater', category: 'POOL', location: 'Pool Area', healthScore: 80, failureProbability: 0.17, criticalityLevel: 'MEDIUM' },
  ];

  await prisma.maintenanceAsset.createMany({
    data: assets.map(a => ({
      ...a,
      status: a.healthScore > 80 ? 'OPERATIONAL' : a.healthScore > 60 ? 'DEGRADED' : 'UNDER_MAINTENANCE',
      lastServiceDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      nextServiceDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
    })),
  });
  console.log('✅ Maintenance assets created');

  // ============================================
  // WORK ORDERS
  // ============================================
  await prisma.workOrder.createMany({
    data: [
      { title: 'HVAC Filter Replacement - Block A', description: 'Replace air filters in Block A HVAC system. Due for preventive maintenance.', type: 'PREVENTIVE', priority: 'HIGH', status: 'OPEN', scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), estimatedHours: 4 },
      { title: 'Elevator 2 Annual Inspection', description: 'Scheduled annual safety inspection for Main Building Elevator 2', type: 'INSPECTION', priority: 'HIGH', status: 'OPEN', scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), estimatedHours: 6 },
      { title: 'Villa V07 AC Unit Repair', description: 'Guest complaint about insufficient cooling. AC unit not reaching set temperature.', type: 'CORRECTIVE', priority: 'CRITICAL', status: 'IN_PROGRESS', scheduledAt: new Date(), estimatedHours: 2, assignedTo: 'Ravi Sharma' },
      { title: 'Pool Pump Lubrication', description: 'Routine lubrication of main pool pump bearings', type: 'PREVENTIVE', priority: 'MEDIUM', status: 'COMPLETED', estimatedHours: 1.5, actualHours: 1.5, completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { title: 'Kitchen Refrigeration - Temperature Calibration', description: 'Spice Garden refrigeration running 2°C above spec. Needs calibration.', type: 'CORRECTIVE', priority: 'HIGH', status: 'OPEN', scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), estimatedHours: 3 },
      { title: 'Backup Generator Test Run', description: 'Monthly test run to ensure backup generator starts within 10 seconds', type: 'INSPECTION', priority: 'HIGH', status: 'OPEN', scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), estimatedHours: 2 },
    ],
  });
  console.log('✅ Work orders created');

  // ============================================
  // INVENTORY
  // ============================================
  const suppliers = await prisma.supplier.createMany({
    data: [
      { name: 'Coorg Fresh Farms', contact: 'Ramesh Kumar', email: 'info@coorgfresh.com', phone: '+91 82120 00001', category: 'FOOD', leadTimeDays: 1, reliability: 0.97 },
      { name: 'Premier Beverages', contact: 'Sunil Mehta', email: 'supply@premierbev.com', phone: '+91 82120 00002', category: 'BEVERAGE', leadTimeDays: 2, reliability: 0.94 },
      { name: 'CleanPro Supplies', contact: 'Anita Rao', email: 'orders@cleanpro.in', phone: '+91 82120 00003', category: 'HOUSEKEEPING', leadTimeDays: 3, reliability: 0.92 },
      { name: 'TechParts India', contact: 'Vijay Menon', email: 'parts@techpartsindia.com', phone: '+91 82120 00004', category: 'MAINTENANCE', leadTimeDays: 5, reliability: 0.88 },
      { name: 'Luxury Amenities Co', contact: 'Preethi Nair', email: 'info@luxamen.com', phone: '+91 82120 00005', category: 'AMENITIES', leadTimeDays: 7, reliability: 0.95 },
    ],
  });
  const createdSuppliers = await prisma.supplier.findMany();

  const inventoryItems = [
    // Food
    { sku: 'FOOD-MLK-001', name: 'Fresh Milk (Full Cream)', category: 'FOOD', unit: 'Liters', currentStock: 62, minStock: 30, maxStock: 200, reorderPoint: 50, unitCost: 55, supplierId: createdSuppliers[0].id, predictedDemand: 81 },
    { sku: 'FOOD-EGG-001', name: 'Farm Fresh Eggs', category: 'FOOD', unit: 'Dozen', currentStock: 180, minStock: 60, maxStock: 400, reorderPoint: 100, unitCost: 120, supplierId: createdSuppliers[0].id, predictedDemand: 210 },
    { sku: 'FOOD-BRD-001', name: 'Artisan Bread Loaves', category: 'FOOD', unit: 'Pieces', currentStock: 45, minStock: 20, maxStock: 100, reorderPoint: 30, unitCost: 180, supplierId: createdSuppliers[0].id, predictedDemand: 55 },
    { sku: 'FOOD-CHK-001', name: 'Chicken (Fresh)', category: 'FOOD', unit: 'KG', currentStock: 85, minStock: 30, maxStock: 200, reorderPoint: 50, unitCost: 320, supplierId: createdSuppliers[0].id, predictedDemand: 110 },
    { sku: 'FOOD-VEG-001', name: 'Mixed Vegetables', category: 'FOOD', unit: 'KG', currentStock: 120, minStock: 50, maxStock: 300, reorderPoint: 80, unitCost: 85, supplierId: createdSuppliers[0].id, predictedDemand: 145 },
    // Beverages
    { sku: 'BEV-WTR-001', name: 'Mineral Water (500ml)', category: 'BEVERAGE', unit: 'Cases', currentStock: 240, minStock: 80, maxStock: 500, reorderPoint: 120, unitCost: 450, supplierId: createdSuppliers[1].id, predictedDemand: 280 },
    { sku: 'BEV-JCE-001', name: 'Fresh Juice Concentrates', category: 'BEVERAGE', unit: 'Liters', currentStock: 55, minStock: 20, maxStock: 150, reorderPoint: 40, unitCost: 220, supplierId: createdSuppliers[1].id, predictedDemand: 72 },
    { sku: 'BEV-COF-001', name: 'Arabica Coffee Beans', category: 'BEVERAGE', unit: 'KG', currentStock: 28, minStock: 10, maxStock: 80, reorderPoint: 20, unitCost: 1800, supplierId: createdSuppliers[1].id, predictedDemand: 35 },
    // Housekeeping
    { sku: 'HK-TWL-001', name: 'Bath Towels (Premium)', category: 'HOUSEKEEPING', unit: 'Pieces', currentStock: 450, minStock: 200, maxStock: 800, reorderPoint: 300, unitCost: 850, supplierId: createdSuppliers[2].id, predictedDemand: 500 },
    { sku: 'HK-BED-001', name: 'Bed Linen Sets', category: 'HOUSEKEEPING', unit: 'Sets', currentStock: 320, minStock: 150, maxStock: 600, reorderPoint: 200, unitCost: 2400, supplierId: createdSuppliers[2].id, predictedDemand: 350 },
    { sku: 'HK-SHP-001', name: 'Shampoo (100ml)', category: 'HOUSEKEEPING', unit: 'Pieces', currentStock: 1200, minStock: 500, maxStock: 2000, reorderPoint: 700, unitCost: 85, supplierId: createdSuppliers[2].id, predictedDemand: 1350 },
    { sku: 'HK-SOP-001', name: 'Soap Bars (Premium)', category: 'HOUSEKEEPING', unit: 'Pieces', currentStock: 900, minStock: 400, maxStock: 1800, reorderPoint: 600, unitCost: 65, supplierId: createdSuppliers[2].id, predictedDemand: 1050 },
    // Maintenance
    { sku: 'MNT-FLT-001', name: 'HVAC Air Filters', category: 'MAINTENANCE', unit: 'Pieces', currentStock: 18, minStock: 10, maxStock: 50, reorderPoint: 15, unitCost: 2200, supplierId: createdSuppliers[3].id, predictedDemand: 24 },
    { sku: 'MNT-OIL-001', name: 'Industrial Lubricant', category: 'MAINTENANCE', unit: 'Liters', currentStock: 45, minStock: 20, maxStock: 100, reorderPoint: 30, unitCost: 380, supplierId: createdSuppliers[3].id, predictedDemand: 55 },
    // Amenities
    { sku: 'AMN-ROB-001', name: 'Luxury Bathrobes', category: 'AMENITIES', unit: 'Pieces', currentStock: 180, minStock: 80, maxStock: 400, reorderPoint: 120, unitCost: 3500, supplierId: createdSuppliers[4].id, predictedDemand: 210 },
    { sku: 'AMN-SLP-001', name: 'Premium Slippers', category: 'AMENITIES', unit: 'Pairs', currentStock: 320, minStock: 150, maxStock: 600, reorderPoint: 200, unitCost: 450, supplierId: createdSuppliers[4].id, predictedDemand: 380 },
  ];

  await prisma.inventoryItem.createMany({ data: inventoryItems });
  console.log(`✅ ${inventoryItems.length} inventory items created`);

  // ============================================
  // REVIEWS
  // ============================================
  const reviewsData = [
    { platform: 'GOOGLE', rating: 4.8, title: 'Exceptional stay!', content: 'Everything was perfect. The spa is world-class and the staff went above and beyond. Room was spotless.', sentiment: 'POSITIVE', sentimentScore: 0.92, department: 'SPA', categories: JSON.stringify(['spa', 'staff', 'cleanliness']) },
    { platform: 'BOOKING_COM', rating: 4.2, title: 'Great resort but Wi-Fi issues', content: 'Beautiful property. Rooms are gorgeous. However, the Wi-Fi was unreliable in Block C. Had to use mobile data for work calls.', sentiment: 'NEUTRAL', sentimentScore: 0.15, department: 'IT', categories: JSON.stringify(['wifi', 'rooms', 'location']) },
    { platform: 'TRIPADVISOR', rating: 5.0, title: 'Best resort in South India', content: 'Absolutely breathtaking. The infinity pool views, the food, the hospitality - 10/10 in everything.', sentiment: 'POSITIVE', sentimentScore: 0.98, department: 'F&B', categories: JSON.stringify(['pool', 'food', 'hospitality']) },
    { platform: 'BOOKING_COM', rating: 3.5, title: 'Room AC malfunction', content: 'AC was not working properly in our room. Maintenance came but took 3 hours. Staff were apologetic though.', sentiment: 'NEGATIVE', sentimentScore: -0.42, department: 'MAINTENANCE', categories: JSON.stringify(['maintenance', 'ac', 'response_time']) },
    { platform: 'GOOGLE', rating: 4.5, title: 'Wonderful family holiday', content: 'Kids loved the pool. Great activities. Food was amazing. The villa was spacious and private.', sentiment: 'POSITIVE', sentimentScore: 0.85, department: 'F&B', categories: JSON.stringify(['pool', 'food', 'family', 'villa']) },
    { platform: 'INTERNAL', rating: 2.5, title: 'Disappointed with Wi-Fi again', content: 'Third time staying here. Wi-Fi in Block C is still unreliable. Needs urgent upgrade. Everything else is great.', sentiment: 'NEGATIVE', sentimentScore: -0.35, department: 'IT', categories: JSON.stringify(['wifi', 'returning_guest']) },
    { platform: 'TRIPADVISOR', rating: 4.7, title: 'Romantic getaway', content: 'Perfect for anniversaries. Staff surprised us with rose petals and champagne. Dinner at Spice Garden was incredible.', sentiment: 'POSITIVE', sentimentScore: 0.93, department: 'F&B', categories: JSON.stringify(['romance', 'dining', 'staff']) },
    { platform: 'BOOKING_COM', rating: 3.8, title: 'Housekeeping timing issue', content: 'Housekeeping came when we had asked for late service. Minor issue but disrupted our afternoon rest.', sentiment: 'NEUTRAL', sentimentScore: -0.12, department: 'HOUSEKEEPING', categories: JSON.stringify(['housekeeping', 'timing']) },
    { platform: 'GOOGLE', rating: 4.9, title: 'Luxury redefined', content: 'From airport transfer to checkout, every touchpoint was flawless. The butler service for our villa was outstanding.', sentiment: 'POSITIVE', sentimentScore: 0.96, department: 'CONCIERGE', categories: JSON.stringify(['butler', 'villa', 'service']) },
    { platform: 'INTERNAL', rating: 4.0, title: 'Good but pool temperature cold', content: 'Overall great stay. The main pool water was a bit cold in the morning. Heated pool would be appreciated.', sentiment: 'NEUTRAL', sentimentScore: 0.22, department: 'RECREATION', categories: JSON.stringify(['pool', 'temperature']) },
  ];

  await prisma.review.createMany({
    data: reviewsData.map((r, i) => ({
      ...r,
      guestId: createdGuests[i % createdGuests.length].id,
      isVerified: true,
      publishedAt: new Date(Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000),
    })),
  });
  console.log('✅ Reviews created');

  // ============================================
  // PRICING RECOMMENDATIONS
  // ============================================
  const pricingData = [
    { roomType: 'PREMIUM', currentPrice: 15500, recommendedPrice: 17200, confidence: 0.87, reason: 'Booking pace 18% above forecast for next weekend. Competitor rates up ₹1,200.', expectedOccupancy: 0.84, expectedRevenue: 2890000, revenueImpact: 180000, status: 'PENDING', expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) },
    { roomType: 'SUITE', currentPrice: 22000, recommendedPrice: 24500, confidence: 0.91, reason: 'Only 3 suites available. High demand from corporate segment. Festival season approaching.', expectedOccupancy: 0.92, expectedRevenue: 1102500, revenueImpact: 210000, status: 'PENDING', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    { roomType: 'STANDARD', currentPrice: 8500, recommendedPrice: 7800, confidence: 0.78, reason: 'Occupancy 12% below target. Price elasticity analysis suggests 8% reduction drives +15% bookings.', expectedOccupancy: 0.75, expectedRevenue: 1560000, revenueImpact: 65000, status: 'PENDING', expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000) },
    { roomType: 'VILLA', currentPrice: 35000, recommendedPrice: 38500, confidence: 0.83, reason: 'Anniversary season. Luxury segment showing strong demand. 4 villas booked in last 24 hours.', expectedOccupancy: 0.88, expectedRevenue: 3388000, revenueImpact: 308000, status: 'APPROVED', expiresAt: new Date(Date.now() + 36 * 60 * 60 * 1000) },
  ];
  await prisma.pricingRecommendation.createMany({ data: pricingData });
  console.log('✅ Pricing recommendations created');

  // ============================================
  // REVENUE FORECASTS (30 days)
  // ============================================
  const forecastData = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseOcc = 0.72 + (isWeekend ? 0.12 : 0) + (Math.random() - 0.5) * 0.1;
    const baseADR = 14500 + (isWeekend ? 2000 : 0) + (Math.random() - 0.5) * 1000;
    forecastData.push({
      date,
      predictedRevenue: baseOcc * 140 * baseADR,
      predictedOccupancy: Math.max(0.4, Math.min(1, baseOcc)),
      predictedADR: baseADR,
      confidence: 0.75 + Math.random() * 0.2,
    });
  }
  await prisma.revenueForecast.createMany({ data: forecastData });
  console.log('✅ Revenue forecasts created');

  // ============================================
  // ALERTS
  // ============================================
  await prisma.alert.createMany({
    data: [
      { type: 'GUEST', severity: 'CRITICAL', title: 'VIP Guest Arriving Soon', message: 'Rahul Sharma (Diamond) arriving in 42 minutes. Suite upgrade pending confirmation.', entityType: 'Guest', actionUrl: '/guests' },
      { type: 'MAINTENANCE', severity: 'WARNING', title: 'Room 204 - AC Issue', message: 'Guest complaint: AC not cooling properly. Work order #WO-0003 created.', entityType: 'Room', entityId: '204', actionUrl: '/operations/maintenance' },
      { type: 'REVENUE', severity: 'INFO', title: 'Revenue Forecast Upgraded', message: 'Weekend revenue forecast upgraded by 8.3% based on new bookings in last 2 hours.', entityType: 'Revenue', actionUrl: '/revenue/forecast' },
      { type: 'STAFF', severity: 'WARNING', title: 'Housekeeping Shortage - Block B', message: '3 rooms pending cleaning. 2 staff on break simultaneously. Reallocation recommended.', entityType: 'Staff', actionUrl: '/operations/staff' },
      { type: 'AI', severity: 'INFO', title: 'Pricing Opportunity Detected', message: 'Premium Suites 14% underpriced vs market. Apply recommendation to capture ₹1.8L revenue.', entityType: 'Pricing', actionUrl: '/revenue/pricing' },
      { type: 'MAINTENANCE', severity: 'WARNING', title: 'HVAC-A01 Health Degraded', message: 'Block A HVAC health at 71%. Failure probability 34%. Schedule maintenance within 7 days.', entityType: 'Asset', entityId: 'HVAC-A01', actionUrl: '/operations/maintenance' },
    ],
  });
  console.log('✅ Alerts created');

  // ============================================
  // AI RECOMMENDATIONS
  // ============================================
  await prisma.aIRecommendation.createMany({
    data: [
      { type: 'PRICING', title: 'Increase Premium Suite rates by ₹1,700', description: 'Current booking pace for this weekend is 18% above forecast. Market analysis shows competitor rates have increased.', reasoning: 'Booking velocity + competitor pricing gap + seasonal demand', expectedImpact: '+₹2.1L revenue, +2.4% RevPAR', impactValue: 210000, priority: 1, entityType: 'RoomType', entityId: 'PREMIUM', expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) },
      { type: 'STAFFING', title: 'Move 2 spa staff to housekeeping', description: 'Housekeeping demand spike detected. 12 rooms queued for cleaning. Spa has 3 idle therapists until 3 PM.', reasoning: 'Demand imbalance + idle resource identification', expectedImpact: 'Reduce room wait time by 45 min, +12% guest satisfaction', impactValue: 45, priority: 2, entityType: 'Department', entityId: 'HOUSEKEEPING' },
      { type: 'GUEST', title: 'Proactive outreach to Rahul Sharma', description: 'Guest has 87/100 friction score. AC issue unresolved for 18 minutes. Risk of negative review very high.', reasoning: 'Friction score + unresolved complaint + VIP status + response time', expectedImpact: '+18% satisfaction recovery, prevent 1-star review', impactValue: 18, priority: 1, entityType: 'Guest', entityId: createdGuests[0].id },
      { type: 'ENERGY', title: 'Reduce Block C HVAC load', description: '22 rooms in Block C are vacant and projected to stay vacant until tomorrow. HVAC running at full capacity.', reasoning: 'Occupancy forecast + vacancy pattern + energy consumption data', expectedImpact: 'Save ₹18,400 in energy costs', impactValue: 18400, priority: 3, entityType: 'Building', entityId: 'Block C' },
      { type: 'INVENTORY', title: 'Reorder Fresh Milk — 45 Liters', description: 'Current stock: 62L. Predicted weekend demand: 81L. Lead time 1 day. Risk of stockout in 18 hours.', reasoning: 'Consumption rate + occupancy forecast + lead time', expectedImpact: 'Prevent breakfast service disruption', impactValue: 0, priority: 2, entityType: 'InventoryItem', entityId: 'FOOD-MLK-001' },
      { type: 'MAINTENANCE', title: 'Schedule HVAC-A01 maintenance', description: 'Block A HVAC shows 34% failure probability. Historical data suggests failure within 8-12 days if not serviced.', reasoning: 'Sensor data + historical failure patterns + predictive model', expectedImpact: 'Prevent 3-day outage affecting 40 rooms, save ₹4.2L in emergency costs', impactValue: 420000, priority: 1, entityType: 'Asset', entityId: 'HVAC-A01' },
    ],
  });
  console.log('✅ AI recommendations created');

  // ============================================
  // AUTOMATION RULES
  // ============================================
  await prisma.automationRule.createMany({
    data: [
      {
        name: 'High Occupancy Response',
        description: 'When occupancy exceeds 90%, automatically adjust staffing and notify revenue manager',
        trigger: JSON.stringify({ type: 'METRIC', condition: 'GREATER_THAN', metric: 'occupancy', value: 0.90 }),
        actions: JSON.stringify([
          { type: 'NOTIFY', target: 'REVENUE_MANAGER', message: 'Occupancy above 90%. Review pricing.' },
          { type: 'TASK', department: 'HOUSEKEEPING', message: 'Increase housekeeping capacity by 20%' },
          { type: 'INVENTORY', items: ['FOOD-MLK-001', 'FOOD-EGG-001'], action: 'INCREASE_ORDER', factor: 1.15 },
        ]),
        isActive: true,
        triggerCount: 14,
      },
      {
        name: 'Guest Friction Alert',
        description: 'When guest friction score exceeds 80, immediately notify concierge and create recovery task',
        trigger: JSON.stringify({ type: 'METRIC', condition: 'GREATER_THAN', metric: 'frictionScore', value: 80 }),
        actions: JSON.stringify([
          { type: 'NOTIFY', target: 'CONCIERGE', message: 'High friction guest detected. Immediate action required.' },
          { type: 'TASK', department: 'CONCIERGE', message: 'Execute service recovery protocol' },
          { type: 'UPGRADE_ROOM', condition: 'IF_AVAILABLE' },
        ]),
        isActive: true,
        triggerCount: 7,
      },
      {
        name: 'VIP Arrival Preparation',
        description: 'When VIP guest check-in within 2 hours, prepare room, assign butler, notify manager',
        trigger: JSON.stringify({ type: 'EVENT', condition: 'VIP_CHECKIN_APPROACHING', value: 120 }),
        actions: JSON.stringify([
          { type: 'TASK', department: 'HOUSEKEEPING', message: 'Priority room inspection for VIP arrival' },
          { type: 'ASSIGN_BUTLER', trigger: 'VIP_ARRIVAL' },
          { type: 'NOTIFY', target: 'RESORT_MANAGER', message: 'VIP arriving in 2 hours. Room prepared.' },
          { type: 'F_AND_B', message: 'Prepare welcome amenity basket' },
        ]),
        isActive: true,
        triggerCount: 23,
      },
      {
        name: 'Rain Weather Response',
        description: 'When rain probability > 70%, adjust staffing, inventory and guest communication',
        trigger: JSON.stringify({ type: 'WEATHER', condition: 'RAIN_PROBABILITY', value: 0.70 }),
        actions: JSON.stringify([
          { type: 'NOTIFY', target: 'OPERATIONS_MANAGER', message: 'High rain probability. Activate indoor protocols.' },
          { type: 'ACTIVITY', action: 'MOVE_OUTDOOR_INDOOR' },
          { type: 'INVENTORY', items: ['BEV-JCE-001', 'FOOD-VEG-001'], action: 'INCREASE_ORDER', factor: 1.20 },
          { type: 'STAFFING', department: 'SPA', action: 'INCREASE', count: 2 },
        ]),
        isActive: true,
        triggerCount: 6,
      },
      {
        name: 'Low Stock Alert',
        description: 'When any inventory item falls below reorder point, create purchase order',
        trigger: JSON.stringify({ type: 'INVENTORY', condition: 'BELOW_REORDER_POINT' }),
        actions: JSON.stringify([
          { type: 'PURCHASE_ORDER', action: 'CREATE_AUTOMATIC' },
          { type: 'NOTIFY', target: 'OPERATIONS_MANAGER', message: 'Auto-PO created for low stock item.' },
        ]),
        isActive: true,
        triggerCount: 31,
      },
    ],
  });
  console.log('✅ Automation rules created');

  // ============================================
  // ENERGY READINGS (last 24 hours)
  // ============================================
  const zones = ['Lobby', 'Main Wing Floors 1-3', 'Main Wing Floors 4-5', 'East Wing', 'Villa Block', 'Pool Area', 'Restaurant', 'Spa', 'Kitchen'];
  const energyData: any[] = [];
  for (let h = 0; h < 24; h++) {
    const ts = new Date(Date.now() - (23 - h) * 60 * 60 * 1000);
    zones.forEach(zone => {
      const baseLoad = zone === 'Kitchen' ? 45 : zone === 'Pool Area' ? 30 : zone === 'Main Wing Floors 1-3' ? 65 : 25;
      const hourFactor = h >= 7 && h <= 22 ? 1.3 : 0.7;
      energyData.push({
        zone,
        consumption: baseLoad * hourFactor * (0.85 + Math.random() * 0.3),
        timestamp: ts,
        type: 'TOTAL',
      });
    });
  }
  await prisma.energyReading.createMany({ data: energyData });
  console.log('✅ Energy readings created');

  // ============================================
  // WEATHER READING
  // ============================================
  await prisma.weatherReading.create({
    data: {
      temperature: 26.4,
      humidity: 72,
      condition: 'CLOUDY',
      windSpeed: 14.2,
      rainProbability: 0.68,
      forecast: JSON.stringify([
        { day: 'Today', condition: 'CLOUDY', high: 28, low: 22, rain: 0.68 },
        { day: 'Tomorrow', condition: 'RAINY', high: 25, low: 20, rain: 0.85 },
        { day: 'Day 3', condition: 'RAINY', high: 24, low: 19, rain: 0.91 },
        { day: 'Day 4', condition: 'CLOUDY', high: 27, low: 21, rain: 0.45 },
        { day: 'Day 5', condition: 'SUNNY', high: 30, low: 22, rain: 0.12 },
        { day: 'Day 6', condition: 'SUNNY', high: 31, low: 23, rain: 0.08 },
        { day: 'Day 7', condition: 'SUNNY', high: 32, low: 24, rain: 0.05 },
      ]),
    },
  });
  console.log('✅ Weather data created');

  console.log('\n🎉 Azure Hills Resort database seeded successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Super Admin:       admin@azurehills.com / resort360');
  console.log('   Resort Manager:    manager@azurehills.com / resort360');
  console.log('   Revenue Manager:   revenue@azurehills.com / resort360');
  console.log('   Operations Mgr:    operations@azurehills.com / resort360');
  console.log('   Housekeeping:      housekeeping@azurehills.com / resort360');
  console.log('   Maintenance:       maintenance@azurehills.com / resort360');
  console.log('   Concierge:         concierge@azurehills.com / resort360');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
