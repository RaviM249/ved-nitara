import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "talent@example.com";

    const user = await db.user.findUnique({
      where: { email },
      include: {
        talentProfile: true,
      },
    });

    if (!user || user.role !== "TALENT") {
      return NextResponse.json({ error: "Talent not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: user.talentProfile });
  } catch (error) {
    console.error("Talent profile fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, ...profileData } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = await db.artistProfile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: {
        ...profileData,
        userId: user.id,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Talent profile update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
