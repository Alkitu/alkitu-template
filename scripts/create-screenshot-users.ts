/**
 * Create Screenshot Users
 *
 * Creates test users specifically for taking screenshots of routes
 * These users have simple, memorable credentials stored in .env
 *
 * Run: npm run create:screenshot-users
 */

import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

interface ScreenshotUser {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  company?: string;
  phone?: string;
}

// Screenshot users with simple, memorable credentials
const SCREENSHOT_USERS: ScreenshotUser[] = [
  {
    email: 'screenshot-admin@alkitu.test',
    password: 'Screenshot123',
    firstname: 'Admin',
    lastname: 'Screenshot',
    role: UserRole.ADMIN,
    company: 'Alkitu Screenshots',
    phone: '+1234567890',
  },
  {
    email: 'screenshot-client@alkitu.test',
    password: 'Screenshot123',
    firstname: 'Client',
    lastname: 'Screenshot',
    role: UserRole.CLIENT,
    company: 'Client Co.',
    phone: '+1234567891',
  },
  {
    email: 'screenshot-employee@alkitu.test',
    password: 'Screenshot123',
    firstname: 'Employee',
    lastname: 'Screenshot',
    role: UserRole.EMPLOYEE,
    company: 'Alkitu Screenshots',
    phone: '+1234567892',
  },
];

async function createScreenshotUsers() {
  console.log('📸 Creating screenshot users...\n');

  let created = 0;
  let existing = 0;
  let failed = 0;

  for (const userData of SCREENSHOT_USERS) {
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
          company: userData.company,
          phone: userData.phone,
          profileComplete: true, // Skip onboarding for screenshots
          emailVerified: new Date(), // Mark as verified
          terms: true,
        },
      });

      console.log(`✅ Created: ${user.email} (${user.role})`);
      created++;
    } catch (error) {
      console.error(`❌ Failed to create ${userData.email}:`, error);
      failed++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Created: ${created} users`);
  console.log(`   ✓  Existing: ${existing} users`);
  console.log(`   ❌ Failed: ${failed} users`);
  console.log(`   📝 Total: ${SCREENSHOT_USERS.length} screenshot users\n`);

  if (created > 0 || existing > 0) {
    console.log('📝 Add these credentials to your .env file:\n');
    console.log('# Screenshot Users (for automated screenshots)');
    console.log('SCREENSHOT_ADMIN_EMAIL="screenshot-admin@alkitu.test"');
    console.log('SCREENSHOT_ADMIN_PASSWORD="Screenshot123"');
    console.log('SCREENSHOT_CLIENT_EMAIL="screenshot-client@alkitu.test"');
    console.log('SCREENSHOT_CLIENT_PASSWORD="Screenshot123"');
    console.log('SCREENSHOT_EMPLOYEE_EMAIL="screenshot-employee@alkitu.test"');
    console.log('SCREENSHOT_EMPLOYEE_PASSWORD="Screenshot123"\n');
  }
}

createScreenshotUsers()
  .catch((error) => {
    console.error('❌ Screenshot user creation failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
