const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.talentProfile.findMany({
    include: { user: true }
  });

  console.log(`Found ${profiles.length} talent profiles to refresh.`);

  const rolesData = [
    {
      roles: ["Actor"],
      skills: ["Method Acting", "Dialogue Delivery", "Drama", "Action"],
      maleImages: [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop"
      ],
      femaleImages: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      roles: ["Model"],
      skills: ["Ramp Walk", "Editorial", "Commercial Photography", "Fitness"],
      maleImages: [
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1488161628813-244a1ca12d9b?q=80&w=1000&auto=format&fit=crop"
      ],
      femaleImages: [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      roles: ["Dancer"],
      skills: ["Contemporary", "Classical", "Hip Hop", "Choreography", "Flexibility"],
      maleImages: [
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop"
      ],
      femaleImages: [
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1000&auto=format&fit=crop"
      ]
    }
  ];

  const genders = ["Male", "Female"];

  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];
    const gender = genders[i % 2];
    const dataIndex = i % rolesData.length;
    const rd = rolesData[dataIndex];
    
    const imageUrl = gender === "Male" 
      ? rd.maleImages[i % rd.maleImages.length] 
      : rd.femaleImages[i % rd.femaleImages.length];

    await prisma.talentProfile.update({
      where: { id: profile.id },
      data: {
        gender: gender,
        roles: rd.roles,
        skills: rd.skills,
        imageUrl: imageUrl,
        age: 20 + (i % 15),
        experience: `${(i % 10) + 1} Years`,
        languages: ["English", "Hindi"]
      }
    });
    console.log(`Updated profile for ${profile.user.name} (${gender} ${rd.roles[0]})`);
  }

  console.log("All profiles updated successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
