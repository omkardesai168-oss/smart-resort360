import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        building: true,
        bookings: {
          where: { status: "CHECKED_IN" },
          include: { guest: { select: { firstName: true, lastName: true, isVIP: true, loyaltyTier: true, frictionScore: true, satisfactionScore: true } } },
          take: 1,
        },
        workOrders: { where: { status: { in: ["OPEN", "IN_PROGRESS"] } }, take: 1 },
      },
    });

    return NextResponse.json({
      rooms: rooms.map(r => ({
        id: r.id,
        number: r.number,
        floor: r.floor,
        type: r.type,
        status: r.status,
        basePrice: r.basePrice,
        sqft: r.sqft,
        bedType: r.bedType,
        buildingId: r.buildingId,
        buildingName: r.building.name,
        temperature: r.temperature,
        energyStatus: r.energyStatus,
        maintenanceRisk: r.maintenanceRisk,
        amenities: (() => { try { return JSON.parse(r.amenities as string); } catch { return []; } })(),
        positionX: r.positionX,
        positionY: r.positionY,
        positionZ: r.positionZ,
        guest: r.bookings[0]?.guest ? {
          name: `${r.bookings[0].guest.firstName} ${r.bookings[0].guest.lastName}`,
          isVIP: r.bookings[0].guest.isVIP,
          loyaltyTier: r.bookings[0].guest.loyaltyTier,
          frictionScore: r.bookings[0].guest.frictionScore,
          satisfactionScore: r.bookings[0].guest.satisfactionScore,
          checkIn: r.bookings[0].checkIn,
          checkOut: r.bookings[0].checkOut,
          ratePerNight: r.bookings[0].ratePerNight,
        } : null,
        activeWorkOrder: r.workOrders[0] ? {
          title: r.workOrders[0].title,
          priority: r.workOrders[0].priority,
          status: r.workOrders[0].status,
        } : null,
      })),
    });
  } catch (error) {
    console.error("Rooms API error:", error);
    return NextResponse.json({ rooms: [] }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, status, temperature } = body;

    const updates: any = {};
    if (status) updates.status = status;
    if (temperature !== undefined) updates.temperature = temperature;

    const room = await prisma.room.update({
      where: { id: roomId },
      data: updates,
    });

    return NextResponse.json({ success: true, room });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}
