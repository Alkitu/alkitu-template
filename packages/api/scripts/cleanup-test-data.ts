import { PrismaClient } from '@prisma/client';

async function cleanupTestData() {
  const prisma = new PrismaClient();

  try {
    console.log('🗑️  Cleaning up E2E test data from Atlas...');

    // Only delete E2E test-created data (soft-deletes and hard deletes)
    // This is safer than deleting ALL data from production Atlas

    // Delete categories created by E2E tests (by name pattern or timestamp)
    const testCategoryPattern = /^(Test Category|E2E Category|Debug|Manual Test)/i;
    const categories = await prisma.category.findMany({
      where: { deletedAt: null },
    });

    const testCategories = categories.filter(c => testCategoryPattern.test(c.name));

    for (const category of testCategories) {
      await prisma.category.delete({ where: { id: category.id } });
    }

    console.log(`✅ Cleaned up ${testCategories.length} test categories`);

    // Clean test services
    const testServicePattern = /^(Test Service|E2E Service|Debug|Manual Test)/i;
    const services = await prisma.service.findMany({
      where: { deletedAt: null },
    });

    const testServices = services.filter(s => testServicePattern.test(s.name));

    for (const service of testServices) {
      await prisma.service.delete({ where: { id: service.id } });
    }

    console.log(`✅ Cleaned up ${testServices.length} test services`);

    console.log('✅ Test data cleanup complete');
  } catch (error) {
    console.error('❌ Failed to cleanup test data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTestData();
