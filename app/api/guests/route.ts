import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const tier = searchParams.get("tier") || "";
    const isVip = searchParams.get("isVip");
    const sortBy = searchParams.get("sortBy") || "totalSpend";

    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (tier) where.loyaltyTier = tier;
    if (isVip === "true") where.isVIP = true;

    const [guests, total] = await Promise.all([
      prisma.guest.findMany({
        where,
        include: {
          bookings: { where: { status: "CHECKED_IN" }, take: 1, include: { room: true } },
          interactions: { where: { status: { not: "RESOLVED" } }, take: 3 },
        },
        orderBy: { [sortBy]: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.guest.count({ where }),
    ]);

    return NextResponse.json({
      guests: guests.map(g => ({
        id: g.id,
        name: `${g.firstName} ${g.lastName}`,
        email: g.email,
        phone: g.phone,
        nationality: g.nationality,
        loyaltyTier: g.loyaltyTier,
        loyaltyPoints: g.loyaltyPoints,
        totalStays: g.totalStays,
        totalSpend: g.totalSpend,
        isVIP: g.isVIP,
        frictionScore: g.frictionScore,
        satisfactionScore: g.satisfactionScore,
        currentRoom: g.bookings[0]?.room?.number || null,
        currentRoomType: g.bookings[0]?.room?.type || null,
        openIssues: g.interactions.length,
        dna: {
          luxury: g.luxuryPreference,
          adventure: g.adventureScore,
          food: g.foodSpending,
          spa: g.spaPreference,
          priceSensitivity: g.priceSensitivity,
          family: g.familyActivities,
        },
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Guests API error:", error);
    return NextResponse.json({ guests: [], total: 0, page: 1, totalPages: 0 }, { status: 500 });
  }
}
