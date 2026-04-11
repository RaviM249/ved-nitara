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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const decoded = getUser(req);
  if (!decoded || decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id: userId } = await params;
    const { isSuspended } = await req.json();

    // @ts-ignore - types not updated yet due to EPERM
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isSuspended }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("[ADMIN USER PATCH ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const decoded = getUser(req);
  if (!decoded || decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id: userId } = await params;

    // Delete user (cascade will handle profiles, casting calls, etc)
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ success: true, message: "User deleted permanently" });
  } catch (error) {
    console.error("[ADMIN USER DELETE ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
