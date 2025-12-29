/**
 * Delete Screenshot Test Data
 *
 * Removes all test data created by create-screenshot-data.ts script.
 * Deletes in correct order to respect foreign key constraints.
 *
 * Prerequisites:
 * - Screenshot data created (npm run create:screenshot-data)
 *
 * Run: npm run delete:screenshot-data
 */

import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

const DATA_FILE = path.join(__dirname, '../.screenshot-data.json');

async function deleteScreenshotData() {
  console.log('🧹 Deleting screenshot test data...\n');

  try {
    // Read saved IDs
    if (!fs.existsSync(DATA_FILE)) {
      console.log('⚠️  No screenshot data file found. Nothing to delete.');
      console.log(`   Expected file: ${DATA_FILE}\n`);
      return;
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    console.log('📋 Found screenshot data file\n');

    // Delete in reverse order of creation (respecting foreign keys)

    // 1. Delete ChatMessages (references Conversation)
    console.log('1️⃣  Deleting ChatMessages...');
    const deletedChatMessages = await prisma.chatMessage.deleteMany({
      where: { conversationId: data.conversationId }
    });
    console.log(`   ✅ Deleted ${deletedChatMessages.count} chat messages\n`);

    // 2. Delete Conversation
    console.log('2️⃣  Deleting Conversation...');
    await prisma.conversation.delete({
      where: { id: data.conversationId }
    }).catch(() => console.log('   ⚠️  Conversation not found or already deleted'));
    console.log(`   ✅ Conversation deleted\n`);

    // 3. Delete ContactInfo
    console.log('3️⃣  Deleting ContactInfo...');
    await prisma.contactInfo.delete({
      where: { id: data.contactInfoId }
    }).catch(() => console.log('   ⚠️  ContactInfo not found or already deleted'));
    console.log(`   ✅ ContactInfo deleted\n`);

    // 4. Delete ChannelMessages (references Channel)
    console.log('4️⃣  Deleting ChannelMessages...');
    const deletedChannelMessages = await prisma.channelMessage.deleteMany({
      where: { channelId: data.channelId }
    });
    console.log(`   ✅ Deleted ${deletedChannelMessages.count} channel messages\n`);

    // 5. Delete ChannelMembers (references Channel)
    console.log('5️⃣  Deleting ChannelMembers...');
    const deletedChannelMembers = await prisma.channelMember.deleteMany({
      where: { channelId: data.channelId }
    });
    console.log(`   ✅ Deleted ${deletedChannelMembers.count} channel members\n`);

    // 6. Delete Channel
    console.log('6️⃣  Deleting Channel...');
    await prisma.channel.delete({
      where: { id: data.channelId }
    }).catch(() => console.log('   ⚠️  Channel not found or already deleted'));
    console.log(`   ✅ Channel deleted\n`);

    // 7. Delete Request (references Service and WorkLocation)
    console.log('7️⃣  Deleting Request...');
    await prisma.request.delete({
      where: { id: data.requestId }
    }).catch(() => console.log('   ⚠️  Request not found or already deleted'));
    console.log(`   ✅ Request deleted\n`);

    // 8. Delete WorkLocation
    console.log('8️⃣  Deleting WorkLocation...');
    await prisma.workLocation.delete({
      where: { id: data.locationId }
    }).catch(() => console.log('   ⚠️  WorkLocation not found or already deleted'));
    console.log(`   ✅ WorkLocation deleted\n`);

    // 9. Delete Service (references Category)
    console.log('9️⃣  Deleting Service...');
    await prisma.service.delete({
      where: { id: data.serviceId }
    }).catch(() => console.log('   ⚠️  Service not found or already deleted'));
    console.log(`   ✅ Service deleted\n`);

    // 10. Delete Category
    console.log('🔟 Deleting Category...');
    await prisma.category.delete({
      where: { id: data.categoryId }
    }).catch(() => console.log('   ⚠️  Category not found or already deleted'));
    console.log(`   ✅ Category deleted\n`);

    // Remove the data file
    fs.unlinkSync(DATA_FILE);
    console.log(`🗑️  Removed data file: ${DATA_FILE}\n`);

    console.log('=' .repeat(80));
    console.log('✅ Screenshot test data deleted successfully!\n');

  } catch (error) {
    console.error('❌ Error deleting screenshot data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run
deleteScreenshotData()
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
