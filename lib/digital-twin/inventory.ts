import { prisma } from '@/lib/prisma';
import { generateRooms } from '@/data/resortData';
import type { Room } from '@/types/resort';

export const MANAGER_ROLES = ['SUPER_ADMIN', 'RESORT_MANAGER', 'OPERATIONS_MANAGER', 'REVENUE_MANAGER'];
export type TwinRoom = Room & { basePrice: number };
let initialization: Promise<void> | undefined;
export function initializeInventory() {
  if (!initialization) initialization = (async () => {
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS digital_twin_rooms (id TEXT PRIMARY KEY, payload TEXT NOT NULL)`;
    await prisma.$transaction(generateRooms().map(room => {
      const payload = JSON.stringify({ ...room, basePrice: room.price });
      return prisma.$executeRaw`INSERT OR IGNORE INTO digital_twin_rooms (id, payload) VALUES (${room.id}, ${payload})`;
    }));
  })().catch(error => { initialization = undefined; throw error; });
  return initialization;
}
export async function readInventory(): Promise<TwinRoom[]> {
  await initializeInventory();
  const rows = await prisma.$queryRaw<{ payload: string }[]>`SELECT payload FROM digital_twin_rooms ORDER BY id`;
  return rows.map(row => JSON.parse(row.payload));
}
export function rateAtOccupancy(base: number, occupancy: number) {
  const multiplier = occupancy <= 40 ? 0.62 + occupancy / 40 * 0.23
    : occupancy <= 70 ? 0.85 + (occupancy - 40) / 30 * 0.20
    : occupancy <= 88 ? 1.05 + (occupancy - 70) / 18 * 0.35
    : 1.40 + (occupancy - 88) / 12 * 0.45;
  return Math.round(base * multiplier / 100) * 100;
}
