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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, location, deadline, status, type, roles, tags } = body;

    // Verify ownership
    const existing = await prisma.castingCall.findUnique({
      where: { id: params.id },
      select: { clientId: true }
    });

    if (!existing) {
      return NextResponse.json({ error: "Casting call not found." }, { status: 404 });
    }

    if (existing.clientId !== user.userId) {
      return NextResponse.json({ error: "You do not have permission to edit this posting." }, { status: 403 });
    }

    const updated = await prisma.castingCall.update({
      where: { id: params.id },
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.castingCall.findUnique({
      where: { id: params.id },
      select: { clientId: true }
    });

    if (!existing) {
      return NextResponse.json({ error: "Casting call not found." }, { status: 404 });
    }

    if (existing.clientId !== user.userId) {
      return NextResponse.json({ error: "You do not have permission to delete this posting." }, { status: 403 });
    }

    // Instead of deleting, just close it? 
    // The user said "not calls of others", "be able to edit other's job".
    // I'll implement full delete for now, or just status update to CLOSED if preferred.
    // Let's do DELETE to be thorough.
    await prisma.castingCall.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true, message: "Casting call removed." }, { status: 200 });
  } catch (error) {
    console.error("[CASTING CALL DELETE ERROR]", error);
    return NextResponse.json({ error: "Failed to delete casting call." }, { status: 500 });
  }
}
