/**
 * Fix User Status - Update ACTIVE to VERIFIED
 * This script updates all users with invalid 'ACTIVE' status to 'VERIFIED'
 * Run: npm run ts-node scripts/fix-user-status.ts
 */

import { MongoClient } from 'mongodb';

const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/alkitu?replicaSet=rs0';

async function fixUserStatus() {
  console.log('🔧 Fixing user status values...\n');

  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();
    const usersCollection = db.collection('User');

    // Find users with ACTIVE status
    const usersWithActive = await usersCollection.find({ status: 'ACTIVE' }).toArray();

    console.log(`Found ${usersWithActive.length} users with ACTIVE status\n`);

    if (usersWithActive.length === 0) {
      console.log('✅ No users with ACTIVE status found. Database is clean!\n');
      return;
    }

    // Display affected users
    console.log('Affected users:');
    usersWithActive.forEach((user: any) => {
      console.log(`  - ${user.email} (${user._id})`);
    });

    console.log('\n🔄 Updating ACTIVE → VERIFIED...\n');

    // Update all ACTIVE users to VERIFIED
    const result = await usersCollection.updateMany(
      { status: 'ACTIVE' },
      { $set: { status: 'VERIFIED' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users from ACTIVE to VERIFIED\n`);

    // Verify the update
    const remainingActive = await usersCollection.find({ status: 'ACTIVE' }).toArray();

    if (remainingActive.length === 0) {
      console.log('✅ All users successfully updated!\n');
    } else {
      console.warn(`⚠️  Still found ${remainingActive.length} users with ACTIVE status\n`);
    }
  } catch (error: any) {
    console.error('❌ Error fixing user status:', error.message);
    throw error;
  } finally {
    await client.close();
  }
}

fixUserStatus()
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
