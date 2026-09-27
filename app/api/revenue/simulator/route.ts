import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { readInventory, rateAtOccupancy, MANAGER_ROLES } from '@/lib/digital-twin/inventory';
async function authorized(req: NextRequest) {
  const token = await getToken({ req });
  return token && MANAGER_ROLES.includes(String(token.role)) ? token : null;
}
export async function GET(req: NextRequest) {
  if (!await authorized(req)) return NextResponse.json({ error: 'Manager access required' }, { status: 403 });
  const rooms = await readInventory();
  const occupied = rooms.filter(room => room.status === 'OCCUPIED' || room.status === 'RESERVED');
  return NextResponse.json({ success: true, rooms: rooms.map(room => ({
    ...room, number: String(room.roomNumber), type: room.type.toUpperCase(),
    buildingName: 'Digital Twin', temperature: 22, guest: room.currentGuestName || null,
  })), live: {
    totalRooms: rooms.length, occupiedRooms: occupied.length,
    occupancyPct: rooms.length ? Math.round(occupied.length / rooms.length * 100) : 0,
    bookedNightlyRevenue: occupied.reduce((sum, room) => sum + room.price, 0),
  } });
}
export async function POST(req: NextRequest) {
  const token = await authorized(req);
  if (!token) return NextResponse.json({ error: 'Manager access required' }, { status: 403 });
  const { simulatedOccupancy } = await req.json();
  if (typeof simulatedOccupancy !== 'number' || !Number.isFinite(simulatedOccupancy) || simulatedOccupancy < 0 || simulatedOccupancy > 100) return NextResponse.json({ error: 'Occupancy must be between 0 and 100' }, { status: 400 });
  const rooms = await readInventory();
  // Update only the price JSON field, preserving concurrent bookings and locked booked rates.
  await prisma.$transaction(rooms.map(room => {
    const price = rateAtOccupancy(room.basePrice, simulatedOccupancy);
    return prisma.$executeRaw`UPDATE digital_twin_rooms SET payload = json_set(payload, '$.price', ${price}) WHERE id = ${room.id} AND json_extract(payload, '$.status') NOT IN ('OCCUPIED', 'RESERVED')`;
  }));
  return NextResponse.json({ success: true, message: 'Rates synchronized with Digital Twin booking prices' });
}
