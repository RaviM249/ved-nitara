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
        isSuspended: false,
        isDisabled: false,
        talentProfile: {
          isNot: null,
          ...(category ? { category } : {}),
          ...(city ? {
            OR: [
              { city: { contains: city, mode: 'insensitive' } },
              { state: { contains: city, mode: 'insensitive' } },
              { location: { contains: city, mode: 'insensitive' } }
            ]
          } as any : {}),
        },
      } as any,
      include: {
        talentProfile: true,
      },
    });

    // Transform to frontend-friendly format
    const formattedTalents = (talents as any).map((t: any) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      city: t.talentProfile?.city || t.talentProfile?.location?.split(',')[0] || "Unknown",
      state: t.talentProfile?.state || t.talentProfile?.location?.split(',')[1]?.trim() || "",
      roles: t.talentProfile?.roles || [],
      skills: t.talentProfile?.skills || [],
      gender: t.talentProfile?.gender || "Unknown",
      profilePhoto: t.talentProfile?.imageUrl || "/placeholder-avatar.png",
      isVerified: t.isVerified, 
      rating: 4.8, 
    }));

    return NextResponse.json({ talents: formattedTalents }, { status: 200 });
  } catch (error) {
    console.error("[TALENT LIST ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
