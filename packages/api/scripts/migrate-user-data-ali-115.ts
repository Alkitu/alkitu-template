import { PrismaClient } from '@prisma/client';

/**
 * ALI-115: User Data Migration Script
 *
 * This script migrates existing user data after ALI-115 schema changes:
 * - Marks all existing users as profileComplete=false
 * - Forces existing users to complete onboarding on next login
 *
 * Run after: npx prisma migrate dev --name ali-115-user-model-refactor
 */
async function migrateUserData() {
  const prisma = new PrismaClient();

  try {
    console.log('🚀 Starting ALI-115 user data migration...\n');

    // Count total users before migration
    const totalUsers = await prisma.user.count();
    console.log(`📊 Found ${totalUsers} total users in database`);

    if (totalUsers === 0) {
      console.log('✅ No users to migrate - database is empty');
      return;
    }

    // Mark all users with undefined/null profileComplete as false
    const result = await prisma.user.updateMany({
      where: {
        OR: [
          { profileComplete: { not: true } },
          { profileComplete: { equals: null } },
        ],
      },
      data: {
        profileComplete: false,
      },
    });

    console.log(`\n✅ Successfully migrated ${result.count} users`);
    console.log('📝 All existing users marked as profileComplete=false');
    console.log('🔄 Users will be redirected to onboarding on next login');

    // Verify migration
    const verifyIncomplete = await prisma.user.count({
      where: { profileComplete: false },
    });
    const verifyComplete = await prisma.user.count({
      where: { profileComplete: true },
    });

    console.log('\n📊 Migration Verification:');
    console.log(`   - Users with incomplete profiles: ${verifyIncomplete}`);
    console.log(`   - Users with complete profiles: ${verifyComplete}`);
    console.log(`   - Total: ${verifyIncomplete + verifyComplete}`);

    if (verifyIncomplete + verifyComplete !== totalUsers) {
      console.warn('\n⚠️  Warning: User count mismatch after migration!');
    } else {
      console.log('\n✅ Migration verification passed!');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute migration
migrateUserData()
  .then(() => {
    console.log('\n🎉 ALI-115 migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error during migration:', error);
    process.exit(1);
  });
