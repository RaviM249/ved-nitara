require('dotenv').config({ path: process.argv[2] || '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  console.log(`Starting DB Cleanup using ${process.argv[2] || '.env'}...`);
  
  try {
    const deletedOtps = await prisma.otpVerification.deleteMany({});
    console.log(`Deleted ${deletedOtps.count} OTPs.`);

    const deletedAnns = await prisma.announcement.deleteMany({});
    console.log(`Deleted ${deletedAnns.count} Announcements.`);

    const deletedUsers = await prisma.user.deleteMany({
      where: {
        role: { not: 'ADMIN' }
      }
    });
    console.log(`Deleted ${deletedUsers.count} Non-Admin Users (with cascade dependencies).`);

    console.log("Cleanup completed successfully.");
  } catch (err) {
    console.error("Failed to clean database:", err);
  } finally {
    await prisma.$disconnect();
  }
}

clean();
