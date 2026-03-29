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

export async function POST(req: NextRequest) {
  const decoded = getUser(req);
  if (!decoded || decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin access only." }, { status: 403 });
  }

  try {
    const { target, message } = await req.json();

    if (!target || !message) {
      return NextResponse.json({ error: "Target and message are required." }, { status: 400 });
    }

    // 1. Create the Announcement record
    const announcement = await prisma.announcement.create({
      data: {
        adminId: decoded.userId,
        target,
        message,
      },
    });

    // 2. Identify target users
    const whereClause: any = {};
    if (target === "TALENT") whereClause.role = "TALENT";
    else if (target === "CLIENT") whereClause.role = "CLIENT";
    else if (target === "BOTH") whereClause.role = { in: ["TALENT", "CLIENT"] };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: { id: true }
    });

    // 3. Create individual notifications for each user
    if (users.length > 0) {
      await prisma.notification.createMany({
        data: users.map(u => ({
          userId: u.id,
          type: "ANNOUNCEMENT",
          message: message,
          link: "/dashboard" // Or a specific announcements page if ever built
        }))
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Announcement broadcast to ${users.length} users successfully.`,
      announcement 
    }, { status: 201 });

  } catch (error) {
    console.error("[ADMIN ANNOUNCEMENT POST ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const decoded = getUser(req);
  if (!decoded || decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        admin: { select: { name: true } }
      }
    });

    return NextResponse.json({ announcements }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN ANNOUNCEMENT GET ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
