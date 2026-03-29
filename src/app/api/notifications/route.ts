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

export async function GET(req: NextRequest) {
  const decoded = getUser(req);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    console.error("[NOTIFICATIONS GET ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const decoded = getUser(req);
  if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { notificationId, markAll } = await req.json();

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId: decoded.userId, isRead: false },
        data: { isRead: true }
      });
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId, userId: decoded.userId },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[NOTIFICATIONS PATCH ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
