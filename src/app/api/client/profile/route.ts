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
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: decoded.userId },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("[CLIENT PROFILE GET ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const decoded = getUserFromRequest(req);
  if (!decoded) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await req.json();
    const { companyName, contactPerson, location, website, bio, imageUrl, city, state } = body;

    const capitalize = (s: string) => s ? s.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : "";
    
    // Determine city and state
    let finalCity = city;
    let finalState = state;

    if (!finalCity && location && location.includes(',')) {
      const parts = location.split(',');
      finalCity = parts[0].trim();
      finalState = parts[1].trim();
    } else if (!finalCity && location) {
      finalCity = location;
    }

    // Capitalize city
    if (finalCity) {
      finalCity = capitalize(finalCity);
    }

    const finalLocation = finalCity && finalState ? `${finalCity}, ${finalState}` : finalCity || location;

    const profile = await prisma.clientProfile.upsert({
      where: { userId: decoded.userId },
      create: {
        userId: decoded.userId,
        companyName, contactPerson: capitalize(contactPerson), 
        location: finalLocation, 
        city: finalCity,
        state: finalState,
        website, bio, imageUrl,
      },
      update: {
        companyName, contactPerson: capitalize(contactPerson), 
        location: finalLocation, 
        city: finalCity,
        state: finalState,
        website, bio, imageUrl,
      },
    });

    return NextResponse.json({ message: "Profile updated.", profile }, { status: 200 });
  } catch (error) {
    console.error("[CLIENT PROFILE PUT ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
