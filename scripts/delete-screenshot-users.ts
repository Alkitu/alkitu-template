/**
 * Delete Screenshot Users
 *
 * Removes all screenshot test users from the database
 * Run after screenshot generation is complete
 *
 * Run: npm run delete:screenshot-users
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

// Screenshot user emails to delete
const SCREENSHOT_USER_EMAILS = [
  'screenshot-admin@alkitu.test',
  'screenshot-client@alkitu.test',
  'screenshot-employee@alkitu.test',
];

async function deleteScreenshotUsers() {
  console.log('🗑️  Deleting screenshot users...\n');

  let deleted = 0;
  let notFound = 0;
  let failed = 0;

  for (const email of SCREENSHOT_USER_EMAILS) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        console.log(`⚠️  User not found: ${email}`);
        notFound++;
        continue;
      }

      // Delete user (cascade will handle related records)
      await prisma.user.delete({
        where: { email },
      });

      console.log(`✅ Deleted: ${email}`);
      deleted++;
    } catch (error) {
      console.error(`❌ Failed to delete ${email}:`, error);
      failed++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Deleted: ${deleted} users`);
  console.log(`   ⚠️  Not Found: ${notFound} users`);
  console.log(`   ❌ Failed: ${failed} users`);
  console.log(`   📝 Total: ${SCREENSHOT_USER_EMAILS.length} screenshot users\n`);

  if (deleted > 0) {
    console.log('💡 Tip: You can remove these from your .env file:');
    console.log('   SCREENSHOT_ADMIN_EMAIL');
    console.log('   SCREENSHOT_ADMIN_PASSWORD');
    console.log('   SCREENSHOT_CLIENT_EMAIL');
    console.log('   SCREENSHOT_CLIENT_PASSWORD');
    console.log('   SCREENSHOT_EMPLOYEE_EMAIL');
    console.log('   SCREENSHOT_EMPLOYEE_PASSWORD\n');
  }
}

deleteScreenshotUsers()
  .catch((error) => {
    console.error('❌ Screenshot user deletion failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
