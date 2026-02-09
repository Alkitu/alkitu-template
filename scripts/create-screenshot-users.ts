/**
 * Script to create screenshot test users
 */

import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SCREENSHOT_USERS = [
  {
    email: 'screenshot-admin@alkitu.test',
    password: 'Screenshot123',
    firstname: 'Screenshot',
    lastname: 'Admin',
    role: UserRole.ADMIN
  },
  {
    email: 'screenshot-client@alkitu.test',
    password: 'Screenshot123',
    firstname: 'Screenshot',
    lastname: 'Client',
    role: UserRole.CLIENT
  },
  {
    email: 'screenshot-employee@alkitu.test',
    password: 'Screenshot123',
    firstname: 'Screenshot',
    lastname: 'Employee',
    role: UserRole.EMPLOYEE
  }
];

async function createScreenshotUsers() {
  console.log('🚀 Creating screenshot users...\n');

  try {
    for (const userData of SCREENSHOT_USERS) {
      console.log(`📝 Processing ${userData.email}...`);

      const existing = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existing) {
        console.log(`   ⚠️  User already exists, updating...`);
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        await prisma.user.update({
          where: { email: userData.email },
          data: {
            password: hashedPassword,
            firstname: userData.firstname,
            lastname: userData.lastname,
            role: userData.role,
            emailVerified: new Date(),
            profileComplete: true,
            terms: true
          }
        });

        console.log(`   ✅ User updated: ${userData.email} (${userData.role})\n`);
      } else {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        await prisma.user.create({
          data: {
            email: userData.email,
            password: hashedPassword,
            firstname: userData.firstname,
            lastname: userData.lastname,
            role: userData.role,
            emailVerified: new Date(),
            profileComplete: true,
            terms: true
          }
        });

        console.log(`   ✅ User created: ${userData.email} (${userData.role})\n`);
      }
    }

    console.log('🎉 All screenshot users are ready!\n');
    console.log('📋 Credentials:');
    SCREENSHOT_USERS.forEach(user => {
      console.log(`   - ${user.email} / ${user.password} (${user.role})`);
    });

  } catch (error) {
    console.error('❌ Error creating users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createScreenshotUsers();
