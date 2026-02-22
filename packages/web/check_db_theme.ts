import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const themes = await prisma.theme.findMany({
    where: { isActive: true }
  });
  console.log("Active Themes:", JSON.stringify(themes, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
