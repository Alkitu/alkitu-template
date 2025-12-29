/**
 * Delete Screenshot Services
 *
 * Removes test services and categories created for screenshots
 * This ensures clean state after screenshot sessions
 *
 * Run: npm run delete:screenshot-services
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

// Category names to delete (must match create-screenshot-services.ts)
const SCREENSHOT_CATEGORY_NAMES = ['IT Support', 'Facilities', 'HR Services'];

async function main() {
  console.log('🗑️  Deleting screenshot services and categories...\n');

  let deletedServices = 0;
  let deletedCategories = 0;

  // Delete services by category
  for (const categoryName of SCREENSHOT_CATEGORY_NAMES) {
    console.log(`📁 Processing category: ${categoryName}`);

    const category = await prisma.category.findUnique({
      where: { name: categoryName },
      include: { services: true },
    });

    if (category) {
      console.log(`  Found ${category.services.length} services in category`);

      // Delete all services in this category
      const result = await prisma.service.deleteMany({
        where: { categoryId: category.id },
      });

      deletedServices += result.count;
      console.log(`  ✅ Deleted ${result.count} services`);

      // Delete the category
      await prisma.category.delete({
        where: { id: category.id },
      });

      deletedCategories++;
      console.log(`  ✅ Deleted category: ${categoryName}\n`);
    } else {
      console.log(`  ⚠️  Category not found: ${categoryName}\n`);
    }
  }

  console.log('✅ Screenshot services deletion completed!\n');
  console.log('📊 Summary:');
  console.log(`  - Categories deleted: ${deletedCategories}`);
  console.log(`  - Services deleted: ${deletedServices}\n`);
}

main()
  .catch((error) => {
    console.error('❌ Error deleting screenshot services:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
