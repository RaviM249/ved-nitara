import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {

      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    
    const { status } = await req.json();
    const validStatuses = ["PENDING", "SHORTLISTED", "REJECTED", "ACCEPTED"];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }


    // Find application and include the casting call to check ownership
    const application = await (prisma.application as any).findUnique({
      where: { id: applicationId },
      include: { castingCall: true }
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }


    // Verify ownership: Only the Client who posted the job or an Admin can update status
    if (application.castingCall.clientId !== decoded.userId && decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized to update this application." }, { status: 403 });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Status updated to ${status}`,
      application: updated 
    }, { status: 200 });

  } catch (error) {
    console.error("[APPLICATION STATUS Error]", error);
    return NextResponse.json({ error: "Failed to update application status." }, { status: 500 });
  }
}
