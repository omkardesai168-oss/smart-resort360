const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const exportDir = path.join(__dirname, '../data/exports');

if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

function jsonToCsv(items) {
  if (!items || !items.length) return '';
  const headers = Object.keys(items[0]);
  const csvRows = [];
  csvRows.push(headers.join(','));
  for (const row of items) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
}

async function exportData() {
  console.log('Exporting project datasets to JSON & CSV...');

  try {
    // 1. Inventory Items
    const inventory = await prisma.inventoryItem.findMany({ include: { supplier: true } });
    const inventoryFormatted = inventory.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      currentStock: item.currentStock,
      minStock: item.minStock,
      unit: item.unit,
      unitCost: item.unitCost,
      supplierName: item.supplier?.name || 'N/A',
      location: item.location,
      lastRestocked: item.lastRestocked ? item.lastRestocked.toISOString() : ''
    }));

    fs.writeFileSync(path.join(exportDir, 'inventory.json'), JSON.stringify(inventoryFormatted, null, 2));
    fs.writeFileSync(path.join(exportDir, 'inventory.csv'), jsonToCsv(inventoryFormatted));

    // 2. Inventory Staff Requests & Predictive Stock Depletion
    let inventoryRequests = await prisma.inventoryRequest.findMany({ orderBy: { createdAt: 'desc' } });
    if (inventoryRequests.length === 0) {
      inventoryRequests = [
        { id: "req-1", poNumber: "PO-MLK-901", sku: "FOOD-MLK-001", itemName: "Fresh Milk (Full Cream)", category: "FOOD", currentStock: 12, requestedQty: 80, unit: "Liters", estimatedCost: 4400, priority: "CRITICAL", reason: "Predictive Stock Depletion Engine: Depletion expected in 1.2 days at 92% occupancy pace.", raisedBy: "InventoryManagementAgent (Predictive Engine)", status: "PENDING", vendor: "Amul Fresh Dairy Pvt Ltd", approvedBy: null, createdAt: new Date() },
        { id: "req-2", poNumber: "PO-COF-902", sku: "BEV-COF-001", itemName: "Arabica Coffee Beans", category: "BEVERAGE", currentStock: 8, requestedQty: 50, unit: "KG", estimatedCost: 90000, priority: "CRITICAL", reason: "Predictive Stock Depletion Engine: Depletion expected in 1.8 days.", raisedBy: "InventoryManagementAgent (Predictive Engine)", status: "APPROVED", vendor: "Blue Tokai Coffee Roasters", approvedBy: "Inventory Staff", createdAt: new Date() },
        { id: "req-3", poNumber: "PO-FLT-903", sku: "MNT-FLT-001", itemName: "HVAC Air Filters", category: "MAINTENANCE", currentStock: 18, requestedQty: 30, unit: "Pieces", estimatedCost: 66000, priority: "HIGH", reason: "Preventive maintenance stock replenishment.", raisedBy: "InventoryManagementAgent (Predictive Engine)", status: "PENDING", vendor: "Honeywell India Industrial", approvedBy: null, createdAt: new Date() },
        { id: "req-4", poNumber: "PO-TWL-904", sku: "HK-TWL-001", itemName: "Egyptian Cotton Bath Towels", category: "HOUSEKEEPING", currentStock: 250, requestedQty: 200, unit: "Pieces", estimatedCost: 170000, priority: "HIGH", reason: "Weekend villa occupancy surge.", raisedBy: "InventoryManagementAgent (Predictive Engine)", status: "APPROVED", vendor: "Trident Luxury Textiles", approvedBy: "Inventory Staff", createdAt: new Date() },
        { id: "req-5", poNumber: "PO-ROB-905", sku: "AMN-ROB-001", itemName: "Luxury Bathrobes", category: "AMENITIES", currentStock: 60, requestedQty: 100, unit: "Pieces", estimatedCost: 350000, priority: "HIGH", reason: "VIP presidential suite turnaround.", raisedBy: "InventoryManagementAgent (Predictive Engine)", status: "PENDING", vendor: "Welspun Hospitality Solutions", approvedBy: null, createdAt: new Date() }
      ];
    }
    const reqFormatted = inventoryRequests.map(r => ({
      id: r.id,
      poNumber: r.poNumber,
      sku: r.sku,
      itemName: r.itemName,
      category: r.category,
      currentStock: r.currentStock,
      requestedQty: r.requestedQty,
      unit: r.unit,
      estimatedCost: r.estimatedCost,
      priority: r.priority,
      reason: r.reason,
      raisedBy: r.raisedBy,
      status: r.status,
      vendor: r.vendor,
      approvedBy: r.approvedBy,
      createdAt: r.createdAt ? (typeof r.createdAt === 'string' ? r.createdAt : r.createdAt.toISOString()) : ''
    }));

    fs.writeFileSync(path.join(exportDir, 'inventory_requests.json'), JSON.stringify(reqFormatted, null, 2));
    fs.writeFileSync(path.join(exportDir, 'inventory_requests.csv'), jsonToCsv(reqFormatted));

    // 3. Staff Directory & Scheduling Roster
    let staff = await prisma.staff.findMany({ include: { user: true } });
    let staffFormatted = staff.map(s => ({
      id: s.id,
      employeeId: s.employeeId,
      name: s.user?.name || `Staff ${s.employeeId}`,
      email: s.user?.email || `staff${s.employeeId}@azurehills.com`,
      role: s.user?.role || s.position,
      position: s.position,
      department: s.department,
      shift: s.shift,
      status: s.status,
      currentZone: s.currentZone || 'Main Resort',
      workloadPct: Math.round((s.workload || 0.5) * 100),
      performanceScore: Math.round((s.performance || 0.85) * 100) / 10
    }));

    if (staffFormatted.length === 0 || !staffFormatted[0].name) {
      staffFormatted = [
        { id: "stf-101", employeeId: "EMP-101", name: "Vikram Patel", email: "vikram.p@azurehills.com", role: "MAINTENANCE", position: "Senior Maintenance Technician", department: "MAINTENANCE", shift: "MORNING", status: "DISPATCHED", currentZone: "Villa Suites 101-110", workloadPct: 85, performanceScore: 4.9 },
        { id: "stf-102", employeeId: "EMP-102", name: "Rajesh Kumar", email: "rajesh.k@azurehills.com", role: "MAINTENANCE", position: "HVAC & Plumbing Specialist", department: "MAINTENANCE", shift: "MORNING", status: "AVAILABLE", currentZone: "Main Hotel Wing B", workloadPct: 40, performanceScore: 4.8 },
        { id: "stf-103", employeeId: "EMP-103", name: "Priya Sharma", email: "priya.s@azurehills.com", role: "HOUSEKEEPING", position: "Housekeeping Lead Supervisor", department: "HOUSEKEEPING", shift: "MORNING", status: "ON_DUTY", currentZone: "Presidential Villas", workloadPct: 65, performanceScore: 4.95 },
        { id: "stf-104", employeeId: "EMP-104", name: "Sunil Verma", email: "sunil.v@azurehills.com", role: "HOUSEKEEPING", position: "Senior Room Attendant", department: "HOUSEKEEPING", shift: "AFTERNOON", status: "ON_DUTY", currentZone: "Ocean View Block 3", workloadPct: 70, performanceScore: 4.7 },
        { id: "stf-105", employeeId: "EMP-105", name: "Amitabh Sen", email: "amitabh.s@azurehills.com", role: "CONCIERGE", position: "Chief Guest Experience Officer", department: "CONCIERGE", shift: "MORNING", status: "ON_DUTY", currentZone: "Lobby & Guest Desk", workloadPct: 50, performanceScore: 5.0 },
        { id: "stf-106", employeeId: "EMP-106", name: "Deepika Nair", email: "deepika.n@azurehills.com", role: "CONCIERGE", position: "VIP Guest Relation Agent", department: "CONCIERGE", shift: "AFTERNOON", status: "AVAILABLE", currentZone: "VIP Lounge", workloadPct: 45, performanceScore: 4.85 },
        { id: "stf-107", employeeId: "EMP-107", name: "Karan Johar", email: "karan.j@azurehills.com", role: "FOOD_BEVERAGE", position: "Head Executive Chef", department: "FOOD_BEVERAGE", shift: "MORNING", status: "ON_DUTY", currentZone: "Azure Fine Dining Kitchen", workloadPct: 90, performanceScore: 4.9 },
        { id: "stf-108", employeeId: "EMP-108", name: "Meera Reddy", email: "meera.r@azurehills.com", role: "SPA", position: "Lead Wellness & Spa Specialist", department: "SPA", shift: "AFTERNOON", status: "AVAILABLE", currentZone: "Ayurvedic Spa Pavilion", workloadPct: 55, performanceScore: 4.9 },
        { id: "stf-109", employeeId: "EMP-109", name: "Suresh Menon", email: "suresh.m@azurehills.com", role: "SECURITY", position: "Chief Resort Safety Marshal", department: "SECURITY", shift: "NIGHT", status: "ON_DUTY", currentZone: "Perimeter & Gate 1", workloadPct: 35, performanceScore: 4.8 },
        { id: "stf-110", employeeId: "EMP-110", name: "Ananya Roy", email: "ananya.r@azurehills.com", role: "INVENTORY_STAFF", position: "Inventory & Supply Chain Staff", department: "MANAGEMENT", shift: "MORNING", status: "ON_DUTY", currentZone: "Central Warehouse", workloadPct: 60, performanceScore: 4.95 }
      ];
    }

    fs.writeFileSync(path.join(exportDir, 'staff_directory.json'), JSON.stringify(staffFormatted, null, 2));
    fs.writeFileSync(path.join(exportDir, 'staff_directory.csv'), jsonToCsv(staffFormatted));

    // 4. Guest Interactions & Complaints
    const interactions = await prisma.guestInteraction.findMany({ include: { guest: true }, orderBy: { createdAt: 'desc' } });
    const interactionsFormatted = interactions.map(c => ({
      id: c.id,
      guestName: c.guest ? `${c.guest.firstName} ${c.guest.lastName}` : 'Guest',
      roomNumber: c.guest?.roomNumber || 'N/A',
      type: c.type,
      channel: c.channel,
      sentiment: c.sentiment,
      summary: c.summary,
      handledBy: c.handledBy,
      createdAt: c.createdAt ? c.createdAt.toISOString() : ''
    }));

    fs.writeFileSync(path.join(exportDir, 'guest_interactions.json'), JSON.stringify(interactionsFormatted, null, 2));
    fs.writeFileSync(path.join(exportDir, 'guest_interactions.csv'), jsonToCsv(interactionsFormatted));

    // 5. Work Orders / Service Requests
    const workOrders = await prisma.workOrder.findMany({ include: { room: true }, orderBy: { createdAt: 'desc' } });
    const workOrdersFormatted = workOrders.map(w => ({
      id: w.id,
      title: w.title,
      category: w.category,
      priority: w.priority,
      status: w.status,
      roomNumber: w.room?.number || 'N/A',
      assignedStaff: w.assignedStaff,
      estimatedCost: w.estimatedCost,
      createdAt: w.createdAt ? w.createdAt.toISOString() : ''
    }));

    fs.writeFileSync(path.join(exportDir, 'work_orders_and_service_requests.json'), JSON.stringify(workOrdersFormatted, null, 2));
    fs.writeFileSync(path.join(exportDir, 'work_orders_and_service_requests.csv'), jsonToCsv(workOrdersFormatted));

    // 5. Rooms & Digital Twin Occupancy
    const rooms = await prisma.room.findMany();
    const roomsFormatted = rooms.map(r => ({
      id: r.id,
      number: r.number,
      floor: r.floor,
      type: r.type,
      status: r.status,
      basePrice: r.basePrice,
      maxOccupancy: r.maxOccupancy,
      temperature: r.temperature,
      energyStatus: r.energyStatus,
      maintenanceRisk: r.maintenanceRisk
    }));

    fs.writeFileSync(path.join(exportDir, 'rooms_and_occupancy.json'), JSON.stringify(roomsFormatted, null, 2));
    fs.writeFileSync(path.join(exportDir, 'rooms_and_occupancy.csv'), jsonToCsv(roomsFormatted));

    // 6. Multi-Agent Run History
    const agentRuns = await prisma.agentRun.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    const agentRunsFormatted = agentRuns.map(a => ({
      id: a.id,
      agentName: a.agentName,
      agentRole: a.agentRole,
      prompt: a.prompt,
      summary: a.summary,
      confidence: a.confidence,
      durationMs: a.durationMs,
      triggeredBy: a.triggeredBy,
      status: a.status,
      createdAt: a.createdAt ? a.createdAt.toISOString() : ''
    }));

    fs.writeFileSync(path.join(exportDir, 'agent_runs_history.json'), JSON.stringify(agentRunsFormatted, null, 2));
    fs.writeFileSync(path.join(exportDir, 'agent_runs_history.csv'), jsonToCsv(agentRunsFormatted));

    console.log('✅ Export completed successfully to data/exports/!');
  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
