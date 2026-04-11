import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password@123", 10);

  console.log("🔥 Starting Database Core Cleanup...");
  
  // 1. DANGER ZONE: Nuke all non-admins. This cascades through Talents, Clients, Jobs, and Apps.
  const deletedUsers = await prisma.user.deleteMany({
    where: { role: { not: "ADMIN" } },
  });
  console.log(`✅ Nuked ${deletedUsers.count} non-admin accounts and all their cascaded data.`);

  // Clear orphan OTPs just in case
  await prisma.otpVerification.deleteMany({});

  // 2. Inject Fresh Precision Data
  console.log("🌱 Injecting Base Precision Accounts...");

  // CLIENT 1
  const client1 = await prisma.user.create({
    data: {
      email: "client1@example.com",
      name: "Star Productions India",
      password: hashedPassword,
      role: "CLIENT",
      isVerified: true,
      clientProfile: {
        create: {
          companyName: "Star Productions India",
          location: "Mumbai, Maharashtra",
          state: "Maharashtra",
          city: "Mumbai"
        },
      },
    },
  });
  console.log("✅ Client 1 Created (client1@example.com)");

  // CLIENT 2
  const client2 = await prisma.user.create({
    data: {
      email: "client2@example.com",
      name: "Neon Lights Casting",
      password: hashedPassword,
      role: "CLIENT",
      isVerified: true,
      clientProfile: {
        create: {
          companyName: "Neon Lights Casting",
          location: "Bangalore, Karnataka",
          state: "Karnataka",
          city: "Bangalore"
        },
      },
    },
  });
  console.log("✅ Client 2 Created (client2@example.com)");

  // TALENT 1
  const talent1 = await prisma.user.create({
    data: {
      email: "talent1@example.com",
      name: "Aryan Kapoor",
      password: hashedPassword,
      role: "TALENT",
      isVerified: true,
      talentProfile: {
        create: {
          bio: "Professional actor with experience in feature films and big-budget commercial shoots.",
          skills: ["Acting", "Dancing", "Action Sequences"],
          experience: "5 years",
          location: "Mumbai, Maharashtra",
          state: "Maharashtra",
          city: "Mumbai"
        },
      },
    },
  });
  console.log("✅ Talent 1 Created (talent1@example.com)");

  // TALENT 2
  const talent2 = await prisma.user.create({
    data: {
      email: "talent2@example.com",
      name: "Sanya Malhotra",
      password: hashedPassword,
      role: "TALENT",
      isVerified: true,
      talentProfile: {
        create: {
          bio: "Versatile model and performer seeking dynamic roles in OTT series and ad campaigns.",
          skills: ["Modeling", "Performance Art", "Kathak"],
          experience: "3 years",
          location: "Delhi",
          state: "Delhi",
          city: "New Delhi"
        },
      },
    },
  });
  console.log("✅ Talent 2 Created (talent2@example.com)");

  console.log("✅ Database Reset and Precision Seeding Completed Successfully! 🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
