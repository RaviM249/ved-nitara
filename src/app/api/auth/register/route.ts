import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, role, city, state, phone, otp } = body;

    if (!firstName || !lastName || !email || !password || !role || !otp) {
      return NextResponse.json(
        { error: "All fields including OTP are required." },
        { status: 400 }
      );
    }

    const capitalize = (s: string) => s ? s.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : "";
    const name = `${capitalize(firstName)} ${capitalize(lastName)}`;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    if (phone) {
      // Validate Indian phone number format (assuming +91 is used)
      // Extract the 10-digit part from "+91 9876543210"
      const phoneParts = phone.split(' ');
      const mainNumber = phoneParts.length > 1 ? phoneParts[1] : phoneParts[0];
      
      const indianPhoneRegex = /^[6-9]\d{9}$/;
      if (phone.includes("+91") && !indianPhoneRegex.test(mainNumber)) {
        return NextResponse.json(
          { error: "Invalid phone number" },
          { status: 400 }
        );
      }


      const existingPhone = await prisma.user.findFirst({ where: { phone } });
      if (existingPhone) {
        return NextResponse.json(
          { error: "An account with this phone number already exists." },
          { status: 409 }
        );
      }
    }


    // Verify OTP
    const otpRecord = await prisma.otpVerification.findUnique({ where: { email } });
    if (!otpRecord) {
      return NextResponse.json({ error: "No verification code requested for this email." }, { status: 400 });
    }
    
    if (otpRecord.otp !== otp) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
    }

    // OTP is valid, clear it
    await prisma.otpVerification.delete({ where: { email } });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Capitalize city name
    const capitalizedCity = city ? capitalize(city) : null;
    const fullLocation = capitalizedCity && state ? `${capitalizedCity}, ${state}` : capitalizedCity || null;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: role as "TALENT" | "CLIENT" | "ADMIN",
        isVerified: false,
      },
    });


    // Automatically create an empty profile on registration with location
    if (user.role === "TALENT") {
      await (prisma.talentProfile as any).create({ 
        data: { userId: user.id, city: capitalizedCity, state: state || null, location: fullLocation } 
      });
    } else if (user.role === "CLIENT") {
      await (prisma.clientProfile as any).create({ 
        data: { userId: user.id, city: capitalizedCity, state: state || null, location: fullLocation } 
      });
    }

    // Notify Admins about new signup for verification
    try {
      if (user.role !== "ADMIN") {
        const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
        if (admins.length > 0) {
          await prisma.notification.createMany({
            data: admins.map(admin => ({
              userId: admin.id,
              type: "USER_SIGNUP",
              message: `New ${user.role} signup: ${user.name}. Needs verification.`,
              link: "/admin/users"
            }))
          });
        }
      }
    } catch (notifyErr) {
      console.error("Failed to notify admins:", notifyErr);
      // Don't fail the registration if notification fails
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "Account created successfully.", user: userWithoutPassword, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
