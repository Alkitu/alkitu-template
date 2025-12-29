/**
 * Create Screenshot Requests
 *
 * Creates test service requests specifically for taking screenshots
 * These requests have predefined data for testing different states
 *
 * Run: npm run create:screenshot-requests
 */

import { PrismaClient, RequestStatus } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

interface TestRequest {
  serviceName: string;
  status: RequestStatus;
  templateResponses: any;
  executionDateTime: Date;
}

// Test requests to create
const TEST_REQUESTS: TestRequest[] = [
  {
    serviceName: 'Software Installation',
    status: 'PENDING',
    executionDateTime: new Date('2025-01-10T09:00:00'),
    templateResponses: {
      software_name: 'Microsoft Office 365',
      version: '2024',
      urgency: 'high',
      license_available: 'yes',
      additional_notes: 'Need installation before Monday team meeting',
    },
  },
  {
    serviceName: 'Hardware Repair',
    status: 'ONGOING',
    executionDateTime: new Date('2025-01-08T14:00:00'),
    templateResponses: {
      device_type: 'laptop',
      problem_description: 'Screen flickering intermittently, especially when opening graphic-heavy applications',
      warranty: 'yes',
    },
  },
  {
    serviceName: 'Office Maintenance',
    status: 'COMPLETED',
    executionDateTime: new Date('2025-01-05T10:00:00'),
    templateResponses: {
      location: 'Building A, Floor 2, Room 205',
      issue_type: 'hvac',
      description: 'Air conditioning not cooling properly, temperature stays above 26°C',
      preferred_time: 'morning',
    },
  },
  {
    serviceName: 'Time Off Request',
    status: 'PENDING',
    executionDateTime: new Date('2025-01-15T00:00:00'),
    templateResponses: {
      leave_type: 'vacation',
      start_date: '2025-01-15',
      end_date: '2025-01-19',
      reason: 'Family vacation - planned trip to mountains',
    },
  },
];

async function main() {
  console.log('🌱 Creating screenshot requests...\n');

  // Find the screenshot admin user
  const adminUser = await prisma.user.findUnique({
    where: { email: 'screenshot-admin@alkitu.test' },
  });

  if (!adminUser) {
    throw new Error('Screenshot admin user not found. Please create screenshot users first.');
  }

  console.log(`✅ Found admin user: ${adminUser.email} (${adminUser.id})\n`);

  let totalRequests = 0;

  // Get or create a default work location for admin user
  let workLocation = await prisma.workLocation.findFirst({
    where: { userId: adminUser.id },
  });

  if (!workLocation) {
    console.log('📍 Creating default work location...');
    workLocation = await prisma.workLocation.create({
      data: {
        userId: adminUser.id,
        street: '123 Main Street',
        city: 'New York',
        zip: '10001',
        state: 'NY',
        building: 'Building A',
        floor: '3',
      },
    });
    console.log(`  ✅ Work location created: ${workLocation.id}\n`);
  } else {
    console.log(`✅ Using existing work location: ${workLocation.street}, ${workLocation.city} (${workLocation.id})\n`);
  }

  for (const requestData of TEST_REQUESTS) {
    console.log(`📋 Creating request for: ${requestData.serviceName}`);

    // Find the service by name
    const service = await prisma.service.findFirst({
      where: {
        name: requestData.serviceName,
        deletedAt: null
      },
    });

    if (!service) {
      console.log(`  ⚠️  Service not found: ${requestData.serviceName}, skipping...`);
      continue;
    }

    // Create the request
    const request = await prisma.request.create({
      data: {
        userId: adminUser.id,
        serviceId: service.id,
        locationId: workLocation.id,
        status: requestData.status,
        executionDateTime: requestData.executionDateTime,
        templateResponses: requestData.templateResponses,
        deletedAt: null, // Explicitly set to null for soft delete queries
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
        // For ONGOING and COMPLETED, set assignment
        ...(requestData.status !== 'PENDING' && {
          assignedToId: adminUser.id,
        }),
        // For COMPLETED, set completion date
        ...(requestData.status === 'COMPLETED' && {
          completedAt: new Date(),
        }),
      },
    });

    totalRequests++;
    console.log(`  ✅ Request created: ${request.id}`);
    console.log(`  🔗 URL: /requests/${request.id}`);
    console.log(`  📊 Status: ${request.status}\n`);
  }

  console.log('✅ Screenshot requests creation completed!\n');
  console.log('📊 Summary:');
  console.log(`  - Requests created: ${totalRequests}`);
  console.log('  - User: screenshot-admin@alkitu.test');
  console.log('\n💡 You can now use these requests for screenshots.');
  console.log('🗑️  Run `npm run delete:screenshot-requests` to clean up when done.\n');
}

main()
  .catch((error) => {
    console.error('❌ Error creating screenshot requests:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
