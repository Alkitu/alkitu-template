/**
 * Create Screenshot Services
 *
 * Creates test services and categories specifically for taking screenshots
 * These services have predefined request templates for testing
 *
 * Run: npm run create:screenshot-services
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

interface ScreenshotCategory {
  name: string;
  services: ScreenshotService[];
}

interface ScreenshotService {
  name: string;
  thumbnail?: string;
  requestTemplate: any; // JSON schema for the request form
}

// Screenshot categories and services with request templates
const SCREENSHOT_CATEGORIES: ScreenshotCategory[] = [
  {
    name: 'IT Support',
    services: [
      {
        name: 'Software Installation',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
        requestTemplate: {
          fields: [
            {
              id: 'software_name',
              type: 'text',
              label: 'Software Name',
              placeholder: 'e.g., Microsoft Office, Adobe Photoshop',
              required: true,
              validation: {
                minLength: 2,
                maxLength: 100,
              },
            },
            {
              id: 'version',
              type: 'text',
              label: 'Version (Optional)',
              placeholder: 'e.g., 2024, Latest',
              required: false,
            },
            {
              id: 'urgency',
              type: 'select',
              label: 'Urgency Level',
              required: true,
              options: [
                { value: 'low', label: 'Low - Can wait a few days' },
                { value: 'medium', label: 'Medium - Needed this week' },
                { value: 'high', label: 'High - Needed today' },
                { value: 'critical', label: 'Critical - Blocking work' },
              ],
            },
            {
              id: 'license_available',
              type: 'radio',
              label: 'Do you have a license?',
              required: true,
              options: [
                { value: 'yes', label: 'Yes, I have a license' },
                { value: 'no', label: 'No, need to purchase' },
                { value: 'unsure', label: 'Not sure' },
              ],
            },
            {
              id: 'additional_notes',
              type: 'textarea',
              label: 'Additional Notes',
              placeholder: 'Any specific requirements or additional information...',
              required: false,
              validation: {
                maxLength: 500,
              },
            },
          ],
        },
      },
      {
        name: 'Hardware Repair',
        thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
        requestTemplate: {
          fields: [
            {
              id: 'device_type',
              type: 'select',
              label: 'Device Type',
              required: true,
              options: [
                { value: 'laptop', label: 'Laptop' },
                { value: 'desktop', label: 'Desktop Computer' },
                { value: 'monitor', label: 'Monitor' },
                { value: 'printer', label: 'Printer' },
                { value: 'other', label: 'Other' },
              ],
            },
            {
              id: 'problem_description',
              type: 'textarea',
              label: 'Problem Description',
              placeholder: 'Describe the issue you are experiencing...',
              required: true,
              validation: {
                minLength: 10,
                maxLength: 500,
              },
            },
            {
              id: 'warranty',
              type: 'radio',
              label: 'Is the device under warranty?',
              required: true,
              options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'unsure', label: 'Not Sure' },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    name: 'Facilities',
    services: [
      {
        name: 'Office Maintenance',
        thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
        requestTemplate: {
          fields: [
            {
              id: 'location',
              type: 'text',
              label: 'Office Location',
              placeholder: 'e.g., Building A, Floor 3, Room 301',
              required: true,
            },
            {
              id: 'issue_type',
              type: 'select',
              label: 'Type of Issue',
              required: true,
              options: [
                { value: 'electrical', label: 'Electrical' },
                { value: 'plumbing', label: 'Plumbing' },
                { value: 'hvac', label: 'HVAC (Heating/Cooling)' },
                { value: 'furniture', label: 'Furniture' },
                { value: 'cleaning', label: 'Cleaning' },
                { value: 'other', label: 'Other' },
              ],
            },
            {
              id: 'description',
              type: 'textarea',
              label: 'Description',
              placeholder: 'Describe the maintenance issue...',
              required: true,
              validation: {
                minLength: 10,
                maxLength: 500,
              },
            },
            {
              id: 'preferred_time',
              type: 'select',
              label: 'Preferred Time',
              required: false,
              options: [
                { value: 'morning', label: 'Morning (8 AM - 12 PM)' },
                { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
                { value: 'evening', label: 'Evening (After 5 PM)' },
                { value: 'anytime', label: 'Anytime' },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    name: 'HR Services',
    services: [
      {
        name: 'Time Off Request',
        thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400',
        requestTemplate: {
          fields: [
            {
              id: 'leave_type',
              type: 'select',
              label: 'Type of Leave',
              required: true,
              options: [
                { value: 'vacation', label: 'Vacation' },
                { value: 'sick', label: 'Sick Leave' },
                { value: 'personal', label: 'Personal Day' },
                { value: 'other', label: 'Other' },
              ],
            },
            {
              id: 'start_date',
              type: 'date',
              label: 'Start Date',
              required: true,
            },
            {
              id: 'end_date',
              type: 'date',
              label: 'End Date',
              required: true,
            },
            {
              id: 'reason',
              type: 'textarea',
              label: 'Reason (Optional)',
              placeholder: 'Brief reason for time off...',
              required: false,
              validation: {
                maxLength: 300,
              },
            },
          ],
        },
      },
    ],
  },
];

async function main() {
  console.log('🌱 Creating screenshot services and categories...\n');

  let totalCategories = 0;
  let totalServices = 0;

  for (const categoryData of SCREENSHOT_CATEGORIES) {
    console.log(`📁 Creating category: ${categoryData.name}`);

    // Create or update category
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: {
        name: categoryData.name,
      },
    });

    totalCategories++;
    console.log(`  ✅ Category created: ${category.id}`);

    // Create services for this category
    for (const serviceData of categoryData.services) {
      console.log(`  📋 Creating service: ${serviceData.name}`);

      const service = await prisma.service.create({
        data: {
          name: serviceData.name,
          categoryId: category.id,
          thumbnail: serviceData.thumbnail,
          requestTemplate: serviceData.requestTemplate,
          deletedAt: null, // Explicitly set to null for soft delete queries
        },
      });

      totalServices++;
      console.log(`    ✅ Service created: ${service.id}`);
      console.log(`    🔗 URL: /services/${service.id}/request\n`);
    }
  }

  console.log('✅ Screenshot services creation completed!\n');
  console.log('📊 Summary:');
  console.log(`  - Categories created: ${totalCategories}`);
  console.log(`  - Services created: ${totalServices}`);
  console.log('\n💡 You can now use these services for screenshots.');
  console.log('🗑️  Run `npm run delete:screenshot-services` to clean up when done.\n');
}

main()
  .catch((error) => {
    console.error('❌ Error creating screenshot services:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
