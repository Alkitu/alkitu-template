import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking for existing employees...');
  
  const employees = await prisma.user.count({
    where: {
      role: UserRole.EMPLOYEE,
    },
  });

  if (employees > 0) {
    console.log(`Found ${employees} existing employees.`);
    return;
  }

  console.log('No employees found. Creating default employees...');

  const password = await bcrypt.hash('password123', 10);

  const newEmployees = [
    {
      email: 'employee1@example.com',
      firstname: 'John',
      lastname: 'Doe',
      role: UserRole.EMPLOYEE,
      password,
      profileComplete: true,
      emailVerified: new Date(),
    },
    {
      email: 'employee2@example.com',
      firstname: 'Jane',
      lastname: 'Smith',
      role: UserRole.EMPLOYEE,
      password,
      profileComplete: true,
      emailVerified: new Date(),
    },
     { // An employee that is already assigned to some requests maybe?
      email: 'technician@example.com',
      firstname: 'Bob',
      lastname: 'fixer',
      role: UserRole.EMPLOYEE,
      password,
      profileComplete: true,
      emailVerified: new Date(),
    }
  ];

  for (const emp of newEmployees) {
    const user = await prisma.user.create({
      data: emp,
    });
    console.log(`Created employee: ${user.email} (${user.firstname} ${user.lastname})`);
  }

  console.log('Employee seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
