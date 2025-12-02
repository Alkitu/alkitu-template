/**
 * Seed test users for E2E testing
 * This script creates all necessary test users with fixed credentials
 * Run: npm run seed:test-users
 */

import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface TestUser {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: UserRole;
}

const TEST_USERS: TestUser[] = [
  {
    email: 'client-e2e@alkitu.test',
    password: 'ClientPass123',
    firstname: 'Client',
    lastname: 'User',
    role: UserRole.CLIENT,
  },
  {
    email: 'employee-e2e@alkitu.test',
    password: 'EmployeePass123',
    firstname: 'Employee',
    lastname: 'User',
    role: UserRole.EMPLOYEE,
  },
  {
    email: 'admin-e2e@alkitu.test',
    password: 'Admin123!',
    firstname: 'Admin',
    lastname: 'User',
    role: UserRole.ADMIN,
  },
  {
    email: 'location-test@alkitu.test',
    password: 'LocationTest123',
    firstname: 'Location',
    lastname: 'Tester',
    role: UserRole.CLIENT,
  },
  {
    email: 'catalog-admin@alkitu.test',
    password: 'CatalogAdmin123',
    firstname: 'Catalog',
    lastname: 'Admin',
    role: UserRole.ADMIN,
  },
  {
    email: 'request-client@alkitu.test',
    password: 'RequestClient123',
    firstname: 'Request',
    lastname: 'Client',
    role: UserRole.CLIENT,
  },
  {
    email: 'request-employee@alkitu.test',
    password: 'RequestEmployee123',
    firstname: 'Request',
    lastname: 'Employee',
    role: UserRole.EMPLOYEE,
  },
  {
    email: 'request-admin@alkitu.test',
    password: 'RequestAdmin123',
    firstname: 'Request',
    lastname: 'Admin',
    role: UserRole.ADMIN,
  },
];

async function seedTestUsers() {
  console.log('🌱 Seeding test users for E2E tests...\n');

  let created = 0;
  let existing = 0;

  for (const userData of TEST_USERS) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`✓ User already exists: ${userData.email} (${userData.role})`);
        existing++;
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user with profileComplete=true (skip onboarding)
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstname: userData.firstname,
          lastname: userData.lastname,
          role: userData.role,
          profileComplete: true, // Skip onboarding for E2E tests
        },
      });

      console.log(`✓ Created user: ${user.email} (${user.role})`);
      created++;
    } catch (error) {
      console.error(`✗ Failed to create user ${userData.email}:`, error);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created} users`);
  console.log(`   Existing: ${existing} users`);
  console.log(`   Total: ${TEST_USERS.length} test users\n`);
}

seedTestUsers()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
