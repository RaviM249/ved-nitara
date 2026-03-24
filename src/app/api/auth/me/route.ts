import { NextResponse } from "next/server";
import db from "@/lib/db";

// This is a placeholder for a real session check (e.g. from cookies/JWT)
// For now, we'll simulate an authenticated session using a query param or header for testing
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "talent@example.com"; 

    const user = await db.user.findUnique({
      where: { email },
      include: {
        talentProfile: true,
        clientProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth session error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
