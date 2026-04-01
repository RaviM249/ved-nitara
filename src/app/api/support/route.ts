import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, contact, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required." },
        { status: 400 }
      );
    }

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

      const mailOptions = {
        from: `"Help and Support" <${process.env.SMTP_USER}>`,
        to: "vednitara@gmail.com",
        replyTo: email,
        subject: `Support Request: ${subject}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background-color: #00A8E1; padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 700;">Support Request</h1>
            </div>
            <div style="padding: 30px; color: #333333;">
              <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #f0f0f0;">
                <h2 style="color: #00A8E1; font-size: 18px; margin-top: 0; margin-bottom: 15px;">User Details</h2>
                <p style="margin: 5px 0;"><strong style="color: #555;">Name:</strong> ${name}</p>
                <p style="margin: 5px 0;"><strong style="color: #555;">Email:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong style="color: #555;">Contact:</strong> ${contact || "Not provided"}</p>
              </div>
              
              <div style="margin-bottom: 25px;">
                <h2 style="color: #00A8E1; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Message Details</h2>
                <p style="margin: 5px 0;"><strong style="color: #555;">Subject:</strong> ${subject}</p>
                <div style="margin-top: 15px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #00A8E1; line-height: 1.6;">
                  ${message.replace(/\n/g, '<br/>')}
                </div>
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <a href="mailto:${email}" style="background-color: #00A8E1; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Reply Directly</a>
              </div>
            </div>
            <div style="background-color: #fdfdfd; padding: 20px; border-top: 1px solid #eeeeee; text-align: center; color: #888888; font-size: 12px;">
              <p style="margin: 0;">This email was sent from the Ved Nitara Support Form.</p>
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} Ved Nitara. All rights reserved.</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } else {
      // For Local Dev / Test Mode
      console.log(`\n\n=======================================\n[DEV MODE] Support Request received:\nFrom: ${name} (${email})\nContact: ${contact}\nSubject: ${subject}\nMessage: ${message}\n=======================================\n\n`);
    }

    return NextResponse.json({ success: true, message: "Support request sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("[SUPPORT API ERROR]", error);
    return NextResponse.json({ error: "Failed to send support request. Please try again." }, { status: 500 });
  }
}
