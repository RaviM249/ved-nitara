import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

function getUser(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function PATCH(req: NextRequest) {
  const decoded = getUser(req);
  if (!decoded || decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin access only." }, { status: 403 });
  }

  try {
    const { userId, isVerified } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified }
    });

    return NextResponse.json({ 
      success: true, 
      message: `User ${isVerified ? "verified" : "unverified"} successfully.`,
      user: updatedUser 
    }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN VERIFY ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
