import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    
    if (decoded.role !== "TALENT") {
      return NextResponse.json({ error: "Only talents can apply to casting calls." }, { status: 403 });
    }

    const { castingCallId, message } = await req.json();

    if (!castingCallId) {
      return NextResponse.json({ error: "Casting call ID is required." }, { status: 400 });
    }

    // Check user's premium status
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { isPremium: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // If not premium, check daily limit (10 applications)
    if (!user.isPremium) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const applicationsToday = await prisma.application.count({
        where: {
          talentId: decoded.userId,
          createdAt: {
            gte: today
          }
        }
      });

      if (applicationsToday >= 10) {
        return NextResponse.json({ 
          error: "Daily limit reached.", 
          message: "Free users can apply to up to 10 jobs per day. Upgrade to Pro for unlimited applications.",
          limitReached: true
        }, { status: 403 });
      }
    }

    // Check if already applied
    const existing = await prisma.application.findFirst({
      where: {
        talentId: decoded.userId,
        castingCallId: castingCallId
      }
    });

    if (existing) {
      return NextResponse.json({ error: "You have already applied to this casting call." }, { status: 400 });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        talentId: decoded.userId,
        castingCallId: castingCallId,
        message: message || "",
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Application submitted successfully!",
      application 
    }, { status: 201 });

  } catch (error) {
    console.error("[APPLY Error]", error);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}
