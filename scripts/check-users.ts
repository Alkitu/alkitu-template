import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: 'screenshot'
      }
    },
    select: {
      email: true,
      role: true,
      emailVerified: true,
      firstname: true,
      lastname: true
    }
  });

  console.log('Screenshot users:', JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

checkUsers();
