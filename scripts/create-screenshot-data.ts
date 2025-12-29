/**
 * Create Screenshot Test Data
 *
 * Creates real database records for screenshot testing of dynamic routes:
 * - Request (for /requests/[id] and /requests/[serviceId])
 * - Service (for service requests)
 * - WorkLocation (for requests)
 * - Category (for services)
 * - Channel (for /admin/channels/[channelId])
 * - Conversation (for /admin/chat/[conversationId])
 *
 * Prerequisites:
 * - Screenshot users created (npm run create:screenshot-users)
 * - MongoDB running
 *
 * Run: npm run create:screenshot-data
 * Cleanup: npm run delete:screenshot-data
 */

import { PrismaClient, UserRole, ChannelType, ConversationStatus, RequestStatus, Priority } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

interface ScreenshotData {
  categoryId: string;
  serviceId: string;
  locationId: string;
  requestId: string;
  channelId: string;
  conversationId: string;
  contactInfoId: string;
}

const DATA_FILE = path.join(__dirname, '../.screenshot-data.json');

async function createScreenshotData() {
  console.log('📸 Creating screenshot test data...\n');

  try {
    // Get screenshot users
    const employeeUser = await prisma.user.findUnique({
      where: { email: 'screenshot-employee@alkitu.test' }
    });

    const adminUser = await prisma.user.findUnique({
      where: { email: 'screenshot-admin@alkitu.test' }
    });

    const clientUser = await prisma.user.findUnique({
      where: { email: 'screenshot-client@alkitu.test' }
    });

    if (!employeeUser || !adminUser || !clientUser) {
      throw new Error('Screenshot users not found. Run: npm run create:screenshot-users first');
    }

    console.log('✅ Found screenshot users\n');

    // 1. Create Category
    console.log('1️⃣  Creating Category...');
    const category = await prisma.category.upsert({
      where: { name: 'Screenshot Test Category' },
      update: {},
      create: {
        name: 'Screenshot Test Category',
        createdBy: adminUser.id,
      }
    });
    console.log(`   ✅ Category: ${category.id}\n`);

    // 2. Create Service
    console.log('2️⃣  Creating Service...');
    const service = await prisma.service.upsert({
      where: { id: '000000000000000000000001' },
      update: {},
      create: {
        id: '000000000000000000000001',
        name: 'Screenshot Test Service',
        categoryId: category.id,
        requestTemplate: {
          fields: [
            {
              id: 'description',
              type: 'textarea',
              label: 'Service Description',
              required: true
            }
          ]
        },
        createdBy: adminUser.id,
      }
    });
    console.log(`   ✅ Service: ${service.id}\n`);

    // 3. Create WorkLocation
    console.log('3️⃣  Creating WorkLocation...');
    const location = await prisma.workLocation.upsert({
      where: { id: '000000000000000000000002' },
      update: {},
      create: {
        id: '000000000000000000000002',
        userId: employeeUser.id,
        street: '123 Screenshot Street',
        city: 'Test City',
        zip: '12345',
        state: 'NY',
        building: 'Test Building',
        floor: '5',
      }
    });
    console.log(`   ✅ WorkLocation: ${location.id}\n`);

    // 4. Create Request
    console.log('4️⃣  Creating Request...');
    const request = await prisma.request.upsert({
      where: { id: '000000000000000000000003' },
      update: {},
      create: {
        id: '000000000000000000000003',
        userId: clientUser.id,
        serviceId: service.id,
        locationId: location.id,
        assignedToId: employeeUser.id,
        executionDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        templateResponses: {
          description: 'This is a test request for screenshot purposes'
        },
        status: RequestStatus.ONGOING,
        createdBy: clientUser.id,
      }
    });
    console.log(`   ✅ Request: ${request.id}\n`);

    // 5. Create Channel
    console.log('5️⃣  Creating Channel...');
    const channel = await prisma.channel.upsert({
      where: { id: '000000000000000000000004' },
      update: {},
      create: {
        id: '000000000000000000000004',
        name: 'screenshot-test-channel',
        description: 'Test channel for screenshots',
        type: ChannelType.PUBLIC,
        allowedRoles: [UserRole.ADMIN, UserRole.EMPLOYEE],
      }
    });
    console.log(`   ✅ Channel: ${channel.id}\n`);

    // Add admin as channel member
    await prisma.channelMember.upsert({
      where: {
        channelId_userId: {
          channelId: channel.id,
          userId: adminUser.id,
        }
      },
      update: {},
      create: {
        channelId: channel.id,
        userId: adminUser.id,
        role: 'OWNER',
      }
    });

    // Add a test message to the channel
    await prisma.channelMessage.create({
      data: {
        channelId: channel.id,
        senderId: adminUser.id,
        content: 'This is a test message for screenshot purposes.',
      }
    });

    // 6. Create ContactInfo for Conversation
    console.log('6️⃣  Creating ContactInfo...');
    const contactInfo = await prisma.contactInfo.upsert({
      where: { id: '000000000000000000000005' },
      update: {},
      create: {
        id: '000000000000000000000005',
        email: 'test-contact@screenshot.test',
        phone: '+1234567890',
        name: 'Test Contact',
        company: 'Screenshot Test Co.',
        userId: clientUser.id,
      }
    });
    console.log(`   ✅ ContactInfo: ${contactInfo.id}\n`);

    // 7. Create Conversation
    console.log('7️⃣  Creating Conversation...');
    const conversation = await prisma.conversation.upsert({
      where: { id: '000000000000000000000006' },
      update: {},
      create: {
        id: '000000000000000000000006',
        contactInfoId: contactInfo.id,
        assignedToId: adminUser.id,
        clientUserId: clientUser.id,
        status: ConversationStatus.OPEN,
        priority: Priority.NORMAL,
        source: 'website',
        tags: ['screenshot', 'test'],
      }
    });
    console.log(`   ✅ Conversation: ${conversation.id}\n`);

    // Add a test message to the conversation
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        content: 'This is a test message for screenshot purposes.',
        isFromVisitor: true,
        senderUserId: clientUser.id,
      }
    });

    // Save IDs to file for cleanup
    const screenshotData: ScreenshotData = {
      categoryId: category.id,
      serviceId: service.id,
      locationId: location.id,
      requestId: request.id,
      channelId: channel.id,
      conversationId: conversation.id,
      contactInfoId: contactInfo.id,
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(screenshotData, null, 2));
    console.log(`💾 Saved IDs to: ${DATA_FILE}\n`);

    // Print summary
    console.log('=' .repeat(80));
    console.log('✅ Screenshot test data created successfully!\n');
    console.log('📋 Use these IDs in screenshot URLs:\n');
    console.log(`   Request ID:      ${request.id}`);
    console.log(`   Service ID:      ${service.id}`);
    console.log(`   Channel ID:      ${channel.id}`);
    console.log(`   Conversation ID: ${conversation.id}\n`);
    console.log('🔗 Screenshot URLs:');
    console.log(`   /en/requests/${request.id}`);
    console.log(`   /en/requests/${service.id}`);
    console.log(`   /en/admin/channels/${channel.id}`);
    console.log(`   /en/admin/chat/${conversation.id}\n`);
    console.log('🧹 Cleanup: npm run delete:screenshot-data\n');

  } catch (error) {
    console.error('❌ Error creating screenshot data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run
createScreenshotData()
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
