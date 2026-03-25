import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password@123", 10);

  // 1. Create Core Users
  console.log("Seeding users...");
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@vednitara.com" },
    update: { password: await bcrypt.hash("admin@123", 10) },
    create: {
      email: "admin@vednitara.com",
      name: "System Admin",
      password: await bcrypt.hash("admin@123", 10),
      role: "ADMIN",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: { password: await bcrypt.hash("client@123", 10) },
    create: {
      email: "client@example.com",
      name: "Star Productions",
      password: await bcrypt.hash("client@123", 10),
      role: "CLIENT",
      clientProfile: {
        create: {
          companyName: "Star Productions India",
          location: "Mumbai, Maharashtra",
        },
      },
    },
  });

  const mainTalent = await prisma.user.upsert({
    where: { email: "talent@example.com" },
    update: { password: await bcrypt.hash("talent@123", 10) },
    create: {
      email: "talent@example.com",
      name: "Aryan Kapoor",
      password: await bcrypt.hash("talent@123", 10),
      role: "TALENT",
      talentProfile: {
        create: {
          bio: "Professional actor with experience in feature films and commercials.",
          skills: ["Acting", "Dancing", "Action"],
          experience: "5 years",
          location: "Mumbai",
        },
      },
    },
  });

  // 2. Create 9 more Talents (Total 10)
  console.log("Seeding 9 more talents...");
  const talentNames = [
    "Sanya Malhotra", "Rohan Mehra", "Priya Singh", "Vikram Rathore", 
    "Ananya Pandey", "Ishaan Khattar", "Sara Ali", "Varun Dhawan", "Kiara Advani"
  ];

  for (let i = 0; i < talentNames.length; i++) {
    const email = `talent${i + 1}@example.com`;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: talentNames[i],
        password: hashedPassword,
        role: "TALENT",
        talentProfile: {
          create: {
            bio: `Talented ${i % 2 === 0 ? "Actor" : "Model"} looking for great opportunities.`,
            skills: ["Performance", "Stunts"],
            experience: `${Math.floor(Math.random() * 8) + 1} years`,
            location: "Delhi",
          },
        },
      },
    });
  }

  // 3. Create 5 Casting Calls (Jobs)
  console.log("Seeding 5 casting calls...");
  const jobs = [
    { title: "Lead Actor for Feature Film", budget: "₹50,000 - ₹1,00,000" },
    { title: "Fashion Model for Summer Collection", budget: "₹20,000 - ₹40,000" },
    { title: "Commercial Ad - Soft Drink Brand", budget: "₹15,000 - ₹25,000" },
    { title: "Web Series - Supporting Role", budget: "₹30,000 - ₹60,000" },
    { title: "Print Shoot - Luxury Watch", budget: "₹40,000 - ₹70,000" },
  ];

  for (const job of jobs) {
    await prisma.castingCall.create({
      data: {
        title: job.title,
        description: `We are looking for a professional for an upcoming project.`,
        location: "Mumbai, Maharashtra",
        budget: job.budget,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        status: "OPEN",
        clientId: client.id,
      },
    });
  }

  console.log("Seeding completed successfully! 🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
