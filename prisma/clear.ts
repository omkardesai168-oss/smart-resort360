import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.energyReading.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.maintenanceAsset.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.guestInteraction.deleteMany();
  await prisma.guestPreference.deleteMany();
  await prisma.review.deleteMany();
  await prisma.task.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.aIRecommendation.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.crisisEvent.deleteMany();
  await prisma.revenueForecast.deleteMany();
  await prisma.pricingRecommendation.deleteMany();
  await prisma.weatherReading.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.room.deleteMany();
  await prisma.building.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.user.deleteMany();
  await prisma.resort.deleteMany();
  console.log('Cleared.');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
