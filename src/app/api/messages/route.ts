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

  const dbUser = await prisma.user.findUnique({ where: { id: user.userId }, select: { isPremium: true } });
  if (!dbUser?.isPremium) return NextResponse.json({ error: "Premium feature only" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) return NextResponse.json({ error: "Conversation ID required" }, { status: 400 });

  try {
    // Verify participation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation || (conversation.user1Id !== user.userId && conversation.user2Id !== user.userId)) {
      return NextResponse.json({ error: "Unauthorized access to conversation" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    console.error("[MESSAGES GET ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.userId }, select: { isPremium: true } });
  if (!dbUser?.isPremium) return NextResponse.json({ error: "Premium feature only" }, { status: 403 });

  try {
    const { conversationId, content } = await req.json();
    if (!conversationId || !content) return NextResponse.json({ error: "Conversation ID and content required" }, { status: 400 });

    // Verify participation and find recipient
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation || (conversation.user1Id !== user.userId && conversation.user2Id !== user.userId)) {
      return NextResponse.json({ error: "Unauthorized access to conversation" }, { status: 403 });
    }

    const recipientId = conversation.user1Id === user.userId ? conversation.user2Id : conversation.user1Id;

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.userId,
        content
      }
    });

    // Update conversation updatedAt for sorting
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    // Notify recipient
    try {
      const link = user.role === 'CLIENT' 
        ? `/talent/inbox?convId=${conversationId}` // For Talent
        : `/client/inbox?convId=${conversationId}`; // For Client

      await prisma.notification.create({
        data: {
          userId: recipientId,
          type: "NEW_MESSAGE",
          message: `New message from ${user.role === 'CLIENT' ? 'Client' : 'Artist'}`,
          link
        }
      });
    } catch (notifyErr) {

      console.error("Failed to notify recipient:", notifyErr);
    }

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    console.error("[MESSAGES POST ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.userId }, select: { isPremium: true } });
  if (!dbUser?.isPremium) return NextResponse.json({ error: "Premium feature only" }, { status: 403 });

  try {
    const { conversationId } = await req.json();
    if (!conversationId) return NextResponse.json({ error: "Conversation ID required" }, { status: 400 });

    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: user.userId },
        isRead: false
      },
      data: { isRead: true }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[MESSAGES PATCH ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
