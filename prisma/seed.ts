import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a default Talent user
  const talentUser = await prisma.user.upsert({
    where: { email: "talent@example.com" },
    update: {},
    create: {
      email: "talent@example.com",
      name: "John Artist",
      role: UserRole.TALENT,
      talentProfile: {
        create: {
          bio: "Passionate actor and performer with 5 years of experience in regional cinema.",
          category: "Actor",
          subCategory: "Lead / Character Artist",
          location: "Mumbai, Maharashtra",
          experience: "5 Years",
          skills: ["Acting", "Dancing", "Martial Arts"],
          images: [
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop"
          ],
          socialLinks: {
            instagram: "https://instagram.com/johnartist",
            youtube: "https://youtube.com/johnartist"
          }
        }
      }
    }
  });

  // Create a default Client user
  const clientUser = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      email: "client@example.com",
      name: "Sarah Producer",
      role: UserRole.CLIENT,
      clientProfile: {
        create: {
          companyName: "Starlight Productions",
          contactPerson: "Sarah Jenkins",
          location: "Hyderabad, Telangana",
          website: "https://starlightproductions.in",
          bio: "Leading production house specialized in commercial ads and regional feature films."
        }
      }
    }
  });

  // Create a sample Casting Call
  const castingCall = await prisma.castingCall.create({
    data: {
      clientId: (await prisma.clientProfile.findUnique({ where: { userId: clientUser.id } }))!.id,
      title: "Lead Female Actor for TV Commercial",
      description: "Looking for a female actor (age 20-25) for a high-end luxury watch commercial. Previous experience in modeling or acting preferred.",
      location: "Bangalore",
      budget: "₹25,000 - ₹40,000",
      role: "Lead",
      status: "OPEN"
    }
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
