import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Only clients can increment views (prevents talents from inflating their own stats)
    if (decoded.role !== "CLIENT" && decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Views only tracked for client visits" }, { status: 200 });
    }

    // Resolve params (Next.js 15+ compatible)
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "Missing artist ID" }, { status: 400 });
    }

    // Attempt to increment natively using Prisma
    await prisma.talentProfile.update({
      where: { userId: id },
      data: {
        profileViews: {
          increment: 1,
        },
      },
      select: { id: true } // We just want to execute quickly, without large payloads
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("[TRACK VIEW ERROR]", error);
    // Silent fail in UI, just return success false so it doesn't break the client app
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
