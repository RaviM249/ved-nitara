import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const { isDisabled } = await req.json();

    // @ts-ignore - types not updated yet due to EPERM
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { isDisabled: !!isDisabled }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[USER ACCOUNT PATCH ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
