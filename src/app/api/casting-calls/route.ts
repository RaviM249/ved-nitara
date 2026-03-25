import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const jobs = await prisma.castingCall.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error("[CASTING CALLS LIST ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
