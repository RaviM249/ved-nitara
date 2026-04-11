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

export async function GET(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: user.userId },
          { user2Id: user.userId }
        ]
      },
      include: {
        user1: { select: { id: true, name: true, role: true } },
        user2: { select: { id: true, name: true, role: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    // Format for frontend
    const formatted = conversations.map(conv => {
      const partner = conv.user1Id === user.userId ? conv.user2 : conv.user1;
      const lastMessage = conv.messages[0] || null;
      const hasUnread = lastMessage && !lastMessage.isRead && lastMessage.senderId !== user.userId;
      
      return {
        id: conv.id,
        partnerId: partner.id,
        partnerName: partner.name,
        partnerRole: partner.role,
        lastMessage,
        hasUnread,
        updatedAt: conv.updatedAt
      };
    });


    return NextResponse.json({ conversations: formatted }, { status: 200 });
  } catch (error) {
    console.error("[CONVERSATIONS GET ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { partnerId } = await req.json();
    if (!partnerId) return NextResponse.json({ error: "Partner ID required" }, { status: 400 });

    // Canonical order for IDs to match unique constraint
    const [u1, u2] = [user.userId, partnerId].sort();

    const conversation = await prisma.conversation.upsert({
      where: {
        user1Id_user2Id: {
          user1Id: u1,
          user2Id: u2
        }
      },
      update: {}, // No update needed if exists
      create: {
        user1Id: u1,
        user2Id: u2
      },
      include: {
        user1: { select: { id: true, name: true, role: true } },
        user2: { select: { id: true, name: true, role: true } }
      }
    });

    const partner = conversation.user1Id === user.userId ? conversation.user2 : conversation.user1;

    return NextResponse.json({ 
      success: true, 
      conversation: {
        id: conversation.id,
        partnerId: partner.id,
        partnerName: partner.name,
        partnerRole: partner.role
      } 
    }, { status: 201 });
  } catch (error) {
    console.error("[CONVERSATIONS POST ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
