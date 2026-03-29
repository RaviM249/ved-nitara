import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Check if a highly verified user already exists with this email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Upsert into OTP table
    await prisma.otpVerification.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    });

    // Check if we have real SMTP configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465", // true for 465
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Ved Nitara" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Your Ved Nitara Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
            <h2 style="color: #00A8E1; text-align: center;">Ved Nitara Verification</h2>
            <p style="color: #333; font-size: 16px;">Hello,</p>
            <p style="color: #333; font-size: 16px;">Please use the following 6-digit code to complete your registration. This code will expire in 10 minutes.</p>
            <div style="background-color: #fff; border: 2px dashed #00A8E1; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #00A8E1; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px; text-align: center;">If you did not request this code, please ignore this email.</p>
          </div>
        `
      });
    } else {
      // For Local Dev / Test Mode
      console.log(`\n\n=======================================\n[DEV MODE] OTP Generated for ${email}: ${otp}\n=======================================\n\n`);
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("[SEND OTP ERROR]", error);
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 });
  }
}
