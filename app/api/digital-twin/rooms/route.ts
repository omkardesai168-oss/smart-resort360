import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { readInventory, MANAGER_ROLES } from '@/lib/digital-twin/inventory';

export async function GET(req: NextRequest) {
  if (!await getToken({ req })) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  return NextResponse.json({ rooms: await readInventory() });
}
export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  const body = await req.json();
  const rooms = await readInventory();
  const room = rooms.find(r => r.id === body.roomId);
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  if (body.action === 'book' && body.expectedPrice !== undefined && body.expectedPrice !== room.price) return NextResponse.json({ error: 'The room rate changed. Review the updated price before booking.' }, { status: 409 });
  const manager = MANAGER_ROLES.includes(String(token.role));
  if (body.action === 'status' && !manager) return NextResponse.json({ error: 'Manager access required' }, { status: 403 });
  if (!['book', 'status'].includes(body.action)) return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  if (body.action === 'book' && room.status !== 'AVAILABLE') return NextResponse.json({ error: 'This room is no longer available' }, { status: 409 });
  if (body.action === 'status' && !['AVAILABLE','OCCUPIED','RESERVED','HOUSEKEEPING','MAINTENANCE','BLOCKED'].includes(body.status)) return NextResponse.json({ error: 'Invalid room status' }, { status: 400 });
  const updated = body.action === 'book'
    ? { ...room, status: 'OCCUPIED', currentGuestName: manager ? String(body.guestName || token.name) : String(token.name), housekeepingStatus: 'Ready', checkInDate: new Date().toISOString() }
    : { ...room, status: body.status };
  const previous = JSON.stringify(room);
  const payload = JSON.stringify(updated);
  const changed = await prisma.$executeRaw`UPDATE digital_twin_rooms SET payload = ${payload} WHERE id = ${room.id} AND payload = ${previous}`;
  if (!changed) return NextResponse.json({ error: 'Room changed. Refresh and try again.' }, { status: 409 });
  return NextResponse.json({ room: updated });
}
