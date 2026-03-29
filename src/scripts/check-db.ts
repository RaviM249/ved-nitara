import { prisma } from "../lib/db";

async function main() {
  console.log("Checking Database...");
  const count = await prisma.user.count({ 
    where: { role: "TALENT" } 
  });
  const talents = await prisma.user.findMany({
    where: { role: "TALENT" },
    select: { name: true, email: true }
  });
  console.log("TOTAL TALENTS IN DB:", count);
  console.log("NAMES:", talents.map(t => t.name));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
