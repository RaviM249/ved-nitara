import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

function isAdmin(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    return decoded.role === "ADMIN";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin access only." }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        talentProfile: true, // Fetch all data
        clientProfile: true  // Fetch all data including panNumber/gstNumber
      },
      orderBy: { createdAt: "desc" }
    });

    const formattedUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isVerified: u.isVerified,
      isPremium: u.isPremium,
      isDisabled: u.isDisabled,
      isSuspended: u.isSuspended,
      phone: u.phone,
      city: u.talentProfile?.location || u.clientProfile?.location || u.talentProfile?.city || u.clientProfile?.city || "Not Set",
      createdAt: u.createdAt,
      talentProfile: u.talentProfile,
      clientProfile: u.clientProfile,
    }));

    return NextResponse.json({ users: formattedUsers }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN USERS GET ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
