import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting full database cleanup...");

  try {
    // 1. Delete all chat data
    const messages = await prisma.message.deleteMany({});
    const conversations = await prisma.conversation.deleteMany({});
    console.log(`Deleted ${messages.count} messages and ${conversations.count} conversations.`);

    // 2. Delete all job data
    // Applications often depend on CastingCalls, so we delete them first (though Cascade handles it)
    const applications = await prisma.application.deleteMany({});
    const castingCalls = await prisma.castingCall.deleteMany({});
    console.log(`Deleted ${applications.count} applications and ${castingCalls.count} casting calls.`);

    // 3. Delete all social/auth data
    const notifications = await prisma.notification.deleteMany({});
    const announcements = await prisma.announcement.deleteMany({});
    const otps = await prisma.otpVerification.deleteMany({});
    console.log(`Deleted ${notifications.count} notifications, ${announcements.count} announcements, and ${otps.count} OTPs.`);

    // 4. Delete all Profiles (Cascaded, but explicit for logging)
    const talents = await prisma.talentProfile.deleteMany({});
    const clients = await prisma.clientProfile.deleteMany({});
    console.log(`Deleted ${talents.count} talent profiles and ${clients.count} client profiles.`);

    // 5. Delete all Users EXCEPT ADMIN role
    const nonAdmins = await prisma.user.deleteMany({
      where: {
        role: {
          not: "ADMIN"
        }
      }
    });
    console.log(`Deleted ${nonAdmins.count} non-admin users.`);

    const remainingUsers = await prisma.user.findMany({ 
        select: { id: true, name: true, email: true, role: true } 
    });
    console.log("Database now consists of only Admin accounts:");
    console.table(remainingUsers);

    console.log("\n✅ Database cleanup successful!");
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
