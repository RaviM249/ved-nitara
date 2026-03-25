import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");

    const talents = await prisma.user.findMany({
      where: {
        role: "TALENT",
        talentProfile: {
          isNot: null,
          ...(category ? { category } : {}),
          ...(city ? { location: { contains: city, mode: 'insensitive' } } : {}),
        },
      },
      include: {
        talentProfile: true,
      },
    });

    // Transform to frontend-friendly format
    const formattedTalents = talents.map(t => ({
      id: t.id,
      name: t.name,
      role: t.role,
      city: t.talentProfile?.location || "Unknown",
      roles: t.talentProfile?.skills || [],
      skills: t.talentProfile?.skills || [],
      profilePhoto: t.talentProfile?.imageUrl || "/placeholder-avatar.png",
      isVerified: true, // For demo, we mark them verified
      rating: 4.8, 
    }));

    return NextResponse.json({ talents: formattedTalents }, { status: 200 });
  } catch (error) {
    console.error("[TALENT LIST ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
