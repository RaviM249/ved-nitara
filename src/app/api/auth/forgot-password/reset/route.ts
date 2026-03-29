import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    // Verify OTP explicitly
    const otpRecord = await prisma.otpVerification.findUnique({ where: { email } });
    
    if (!otpRecord) {
      return NextResponse.json({ error: "No reset request found for this email." }, { status: 400 });
    }
    
    if (otpRecord.otp !== otp) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "Code has expired. Please request a new one." }, { status: 400 });
    }

    // OTP is completely valid. Let's reset the password.
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User associated with this request not found." }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    // Destroy the OTP record to prevent reuse
    await prisma.otpVerification.delete({ where: { email } });

    return NextResponse.json({ success: true, message: "Password updated successfully." }, { status: 200 });

  } catch (error) {
    console.error("[PASSWORD RESET ERROR]", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
