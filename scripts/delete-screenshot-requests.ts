/**
 * Delete Screenshot Requests
 *
 * Removes test service requests created for screenshots
 * This ensures clean state after screenshot sessions
 *
 * Run: npm run delete:screenshot-requests
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Deleting screenshot requests...\n');

  // Find the screenshot admin user
  const adminUser = await prisma.user.findUnique({
    where: { email: 'screenshot-admin@alkitu.test' },
  });

  if (!adminUser) {
    console.log('⚠️  Screenshot admin user not found. Nothing to delete.\n');
    return;
  }

  console.log(`📁 Found admin user: ${adminUser.email} (${adminUser.id})`);

  // Find all requests created by this user
  const requests = await prisma.request.findMany({
    where: { userId: adminUser.id },
  });

  console.log(`  Found ${requests.length} requests\n`);

  if (requests.length === 0) {
    console.log('✅ No screenshot requests to delete.\n');
    return;
  }

  // Delete all requests (hard delete for test data)
  const result = await prisma.request.deleteMany({
    where: { userId: adminUser.id },
  });

  console.log(`✅ Deleted ${result.count} requests\n`);

  console.log('✅ Screenshot requests deletion completed!');
  console.log('📊 Summary:');
  console.log(`  - Requests deleted: ${result.count}\n`);
}

main()
  .catch((error) => {
    console.error('❌ Error deleting screenshot requests:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
