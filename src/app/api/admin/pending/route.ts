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
    const pendingUsers = await prisma.user.findMany({
      where: {
        isVerified: false,
        role: { in: ["TALENT", "CLIENT"] }
      },
      include: {
        talentProfile: true,
        clientProfile: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ users: pendingUsers }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN PENDING ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
