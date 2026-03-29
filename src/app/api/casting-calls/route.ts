import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    let userRole: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
        userId = decoded.userId;
        userRole = decoded.role;
      } catch (err) {
        // Token invalid, treat as unauthenticated
      }
    }

    // Auto-close any open listings where the deadline is strictly in the past
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    await prisma.castingCall.updateMany({
      where: {
        status: "OPEN",
        deadline: { lt: startOfToday }
      },
      data: { status: "CLOSED" }
    });

    const where: any = { status: "OPEN" };

    // If it's a client, show THEIR jobs (even closed ones, maybe? 
    // Actually the user said "they should be only seeing their own posted casting calls").
    // Let's make it so Clients see all of their own, but others only see OPEN ones.
    if (userRole === "CLIENT" && userId) {
      where.clientId = userId;
      delete where.status; // Client sees all their jobs, open or closed
    }

    const jobs = await prisma.castingCall.findMany({
      where,
      include: {
        applications: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error("[CASTING CALLS LIST ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    if (decoded.role !== "CLIENT") {
      return NextResponse.json({ error: "Only clients/production houses can post requirements." }, { status: 403 });
    }

    // Check user's premium status and posting limit
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { isPremium: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (!user.isPremium) {
      const totalPostings = await prisma.castingCall.count({
        where: { clientId: decoded.userId }
      });

      if (totalPostings >= 5) {
        return NextResponse.json({ 
          error: "Posting limit reached.", 
          message: "Free accounts can post a maximum of 5 requirements. Upgrade to Pro for unlimited postings.",
          limitReached: true
        }, { status: 403 });
      }
    }

    const body = await req.json();
    const { title, description, location, budget, deadline, roles, tags, type } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
    }

    const job = await prisma.castingCall.create({
      data: {
        clientId: decoded.userId,
        title,
        description,
        type: type || "Film",
        roles: roles || [],
        tags: Array.isArray(tags) ? tags : [],
        location: location || "",
        budget: budget || "",
        deadline: deadline ? new Date(deadline) : null,
      }
    });

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error) {
    console.error("[CASTING CALL POST ERROR]", error);
    return NextResponse.json({ error: "Failed to post requirement." }, { status: 500 });
  }
}
