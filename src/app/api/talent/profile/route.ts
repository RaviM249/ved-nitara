import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const decoded = getUserFromRequest(req);
  if (!decoded) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const profile = await prisma.talentProfile.findUnique({
      where: { userId: decoded.userId },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("[TALENT PROFILE GET ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const decoded = getUserFromRequest(req);
  if (!decoded) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await req.json();
    const { bio, location, skills, languages, experience, age, gender, imageUrl } = body;

    const profile = await prisma.talentProfile.upsert({
      where: { userId: decoded.userId },
      create: {
        userId: decoded.userId,
        bio, location, skills, languages, experience, age, gender, imageUrl,
      },
      update: {
        bio, location, skills, languages, experience, age, gender, imageUrl,
      },
    });

    return NextResponse.json({ message: "Profile updated.", profile }, { status: 200 });
  } catch (error) {
    console.error("[TALENT PROFILE PUT ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
