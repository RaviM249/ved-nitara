import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

function getAuthUser(req: NextRequest) {
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
  try {
    const { id: castingCallId } = await params;
    const user = getAuthUser(req);
    if (!user || (user.role !== "CLIENT" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, location, deadline, status, type, roles, tags } = body;

    // Verify ownership
    const existing = await prisma.castingCall.findUnique({
      where: { id: castingCallId },
      select: { clientId: true }
    });

    if (!existing) {
      return NextResponse.json({ error: "Casting call not found." }, { status: 404 });
    }

    if (user.role !== "ADMIN" && existing.clientId !== user.userId) {
      return NextResponse.json({ error: "You do not have permission to edit this posting." }, { status: 403 });
    }

    const updated = await prisma.castingCall.update({
      where: { id: castingCallId },
      data: {
        title,
        description,
        location,
        type,
        roles: Array.isArray(roles) ? roles : undefined,
        tags: Array.isArray(tags) ? tags : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
        status: status || undefined,
      }
    });

    return NextResponse.json({ success: true, job: updated }, { status: 200 });
  } catch (error) {
    console.error("[CASTING CALL PATCH ERROR]", error);
    return NextResponse.json({ error: "Failed to update casting call." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: castingCallId } = await params;
    const user = getAuthUser(req);
    if (!user || (user.role !== "CLIENT" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.castingCall.findUnique({
      where: { id: castingCallId },
      select: { clientId: true }
    });

    if (!existing) {
      return NextResponse.json({ error: "Casting call not found." }, { status: 404 });
    }

    if (user.role !== "ADMIN" && existing.clientId !== user.userId) {
      return NextResponse.json({ error: "You do not have permission to delete this posting." }, { status: 403 });
    }

    await prisma.castingCall.delete({
      where: { id: castingCallId }
    });

    return NextResponse.json({ success: true, message: "Casting call removed." }, { status: 200 });
  } catch (error) {
    console.error("[CASTING CALL DELETE ERROR]", error);
    return NextResponse.json({ error: "Failed to delete casting call." }, { status: 500 });
  }
}

