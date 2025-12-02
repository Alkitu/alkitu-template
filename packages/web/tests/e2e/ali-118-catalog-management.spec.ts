import { test, expect } from '../fixtures/authenticated-fixtures';
import { TEST_USERS } from '../fixtures/test-users';

/**
 * ALI-118 - Service Catalog Management E2E Tests
 *
 * Tests the complete service catalog management system:
 * 1. Categories CRUD (create, read, update, delete)
 * 2. Services CRUD with request templates
 * 3. Dynamic form rendering
 * 4. Validation and error handling
 * 5. Delete protection (categories with services)
 *
 * Security:
 * - All operations require authentication
 * - Admin-only access to catalog management
 *
 * NOTE: Uses pre-seeded ADMIN test user from fixtures/test-users.ts
 * Run `npm run seed:test-users` in packages/api before running these tests
 */

// Test user credentials (ADMIN role, pre-seeded in database)
const testUser = TEST_USERS.CATALOG_ADMIN;

// Test data
const timestamp = Date.now(); // Used only for unique test data names
const testCategory = {
  name: `E2E Test Category ${timestamp}`,
};

const updatedCategoryName = `Updated Category ${timestamp}`;

const testService = {
  name: `E2E Test Service ${timestamp}`,
  thumbnail: 'https://via.placeholder.com/150',
  requestTemplate: {
    version: '1.0',
    fields: [
      {
        id: 'issue_description',
        type: 'textarea',
        label: 'Describe the Issue',
        required: true,
        validation: {
          minLength: 10,
          maxLength: 500,
        },
      },
      {
        id: 'urgency',
        type: 'select',
        label: 'Urgency Level',
        required: true,
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ],
      },
      {
        id: 'preferred_date',
        type: 'date',
        label: 'Preferred Service Date',
        required: false,
      },
    ],
  },
};

test.describe('ALI-118: Service Catalog Management', () => {
  let createdCategoryId: string;
  let createdServiceId: string;

  // ADMIN test user is pre-seeded via npm run seed:test-users
  // CATALOG_ADMIN has ADMIN role, so use authenticatedAdminPage

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    await authenticatedAdminPage.setViewportSize({ width: 1280, height: 720 });
  });

  test.describe('Categories CRUD', () => {
    test('1. Create new category', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;
      // Navigate to categories page
      await page.goto('http://localhost:3000/es/admin/catalog/categories');
      await page.waitForLoadState('networkidle');

      // Click "Add New Category" button
      await page.click('button:has-text("Add New Category")');

      // Fill category name
      await page.fill('input[name="name"]', testCategory.name);

      // Submit form
      await page.click('button:has-text("Create Category")');

      // Wait for success and list refresh
      await page.waitForTimeout(1000);

      // Verify category appears in list
      const categoryCard = page.locator(
        `[data-testid="category-card"]:has-text("${testCategory.name}")`,
      );
      await expect(categoryCard).toBeVisible();

      // Verify service count is 0
      await expect(categoryCard.locator('text=0 services')).toBeVisible();

      // Extract category ID for later tests
      const categoryElement = await categoryCard.first();
      const categoryText = await categoryElement.textContent();
      console.log('Created category:', categoryText);
    });

    test('2. List all categories', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;
      await page.goto('http://localhost:3000/es/admin/catalog/categories');
      await page.waitForLoadState('networkidle');

      // Should show at least our test category
      const categoryCards = page.locator('[data-testid="category-card"]');
      await expect(categoryCards.first()).toBeVisible();

      // Verify our test category is in the list
      await expect(
        page.locator(`text=${testCategory.name}`).first(),
      ).toBeVisible();
    });

    test('3. Edit category', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;
      await page.goto('http://localhost:3000/es/admin/catalog/categories');
      await page.waitForLoadState('networkidle');

      // Find our test category and click edit
      const categoryCard = page
        .locator('[data-testid="category-card"]')
        .filter({ hasText: testCategory.name })
        .first();
      await categoryCard.locator('button[aria-label="Edit category"]').click();

      // Wait for edit form
      await page.waitForSelector('h3:has-text("Edit Category")');

      // Update name
      await page.fill('input[name="name"]', updatedCategoryName);

      // Submit
      await page.click('button:has-text("Update Category")');

      // Wait for update
      await page.waitForTimeout(1000);

      // Verify updated name appears
      await expect(
        page.locator(`text=${updatedCategoryName}`).first(),
      ).toBeVisible();
    });

    test('4. Cannot delete category with services (will test after creating service)', async ({
      authenticatedAdminPage,
    }) => {
      const page = authenticatedAdminPage;
      // This test will be verified in the service tests
      // When we try to delete a category that has services, it should be disabled
    });
  });

  test.describe('Services CRUD', () => {
    test('5. Create new service', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;
      // Navigate to services page
      await page.goto('http://localhost:3000/es/admin/catalog/services');
      await page.waitForLoadState('networkidle');

      // Click "Add New Service"
      await page.click('button:has-text("Add New Service")');

      // Wait for form to load categories
      await page.waitForSelector('select[name="categoryId"]');

      // Fill service details
      await page.fill('input[name="name"]', testService.name);

      // Select category (our test category)
      await page.selectOption('select[name="categoryId"]', {
        label: updatedCategoryName,
      });

      // Fill thumbnail
      await page.fill('input[name="thumbnail"]', testService.thumbnail);

      // Update request template JSON
      const templateJson = JSON.stringify(testService.requestTemplate, null, 2);
      await page.fill('textarea[name="requestTemplate"]', templateJson);

      // Submit
      await page.click('button:has-text("Create Service")');

      // Wait for success
      await page.waitForTimeout(1500);

      // Verify service appears in list
      const serviceCard = page.locator(
        `[data-testid="service-card"]:has-text("${testService.name}")`,
      );
      await expect(serviceCard).toBeVisible();

      // Verify category name is shown
      await expect(
        serviceCard.locator(`text=${updatedCategoryName}`),
      ).toBeVisible();

      // Verify field count
      await expect(
        serviceCard.locator('text=3 fields in form template'),
      ).toBeVisible();
    });

    test('6. List all services', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;
      await page.goto('http://localhost:3000/es/admin/catalog/services');
      await page.waitForLoadState('networkidle');

      // Should show our test service
      const serviceCard = page.locator('[data-testid="service-card"]').first();
      await expect(serviceCard).toBeVisible();

      // Verify our service is there
      await expect(
        page.locator(`text=${testService.name}`).first(),
      ).toBeVisible();
    });

    test('7. Edit service', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;
      await page.goto('http://localhost:3000/es/admin/catalog/services');
      await page.waitForLoadState('networkidle');

      // Find our service and click edit
      const serviceCard = page
        .locator('[data-testid="service-card"]')
        .filter({ hasText: testService.name })
        .first();
      await serviceCard.locator('button[aria-label="Edit service"]').click();

      // Wait for edit form
      await page.waitForSelector('h3:has-text("Edit Service")');

      // Update name
      const updatedName = `${testService.name} - Updated`;
      await page.fill('input[name="name"]', updatedName);

      // Submit
      await page.click('button:has-text("Update Service")');

      // Wait for update
      await page.waitForTimeout(1000);

      // Verify updated name
      await expect(page.locator(`text=${updatedName}`).first()).toBeVisible();
    });

    test('8. Delete service', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;
      await page.goto('http://localhost:3000/es/admin/catalog/services');
      await page.waitForLoadState('networkidle');

      // Find our service
      const updatedName = `${testService.name} - Updated`;
      const serviceCard = page
        .locator('[data-testid="service-card"]')
        .filter({ hasText: updatedName })
        .first();

      // Click delete and confirm
      page.on('dialog', (dialog) => dialog.accept());
      await serviceCard.locator('button[aria-label="Delete service"]').click();

      // Wait for deletion
      await page.waitForTimeout(1000);

      // Verify service is gone
      await expect(
        page.locator(`text=${updatedName}`).first(),
      ).not.toBeVisible();
    });
  });

  test.describe('Dynamic Form Rendering', () => {
    test('9. Create service with form template and test rendering', async ({
      authenticatedAdminPage,
    }) => {
      const page = authenticatedAdminPage;
      // First, create a service with our test template
      await page.goto('http://localhost:3000/es/admin/catalog/services');
      await page.waitForLoadState('networkidle');

      await page.click('button:has-text("Add New Service")');
      await page.waitForSelector('select[name="categoryId"]');

      await page.fill('input[name="name"]', 'Form Renderer Test Service');
      await page.selectOption('select[name="categoryId"]', {
        label: updatedCategoryName,
      });

      const templateJson = JSON.stringify(testService.requestTemplate, null, 2);
      await page.fill('textarea[name="requestTemplate"]', templateJson);

      await page.click('button:has-text("Create Service")');
      await page.waitForTimeout(1500);

      // Get the service ID from the card (we'll need to fetch it via API or extract from DOM)
      const serviceCard = page
        .locator('[data-testid="service-card"]')
        .filter({ hasText: 'Form Renderer Test Service' })
        .first();
      await expect(serviceCard).toBeVisible();

      // TODO: Navigate to service request page when we have service listing
      // For now, verify the template is stored correctly
      await page.click('button[aria-label="Edit service"]');
      await page.waitForSelector('textarea[name="requestTemplate"]');

      const templateValue = await page.inputValue(
        'textarea[name="requestTemplate"]',
      );
      const parsedTemplate = JSON.parse(templateValue);

      expect(parsedTemplate.fields).toHaveLength(3);
      expect(parsedTemplate.fields[0].id).toBe('issue_description');
      expect(parsedTemplate.fields[1].id).toBe('urgency');
      expect(parsedTemplate.fields[2].id).toBe('preferred_date');
    });
  });

  test.describe('Validation and Error Handling', () => {
    test('10. Category name validation - required field', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;
      await page.goto('http://localhost:3000/es/admin/catalog/categories');
      await page.waitForLoadState('networkidle');

      await page.click('button:has-text("Add New Category")');

      // Try to submit without name
      await page.click('button:has-text("Create Category")');

      // Should show validation error
      await expect(
        page.locator('text=/Category name.*required/i'),
      ).toBeVisible();
    });

    test('11. Service validation - required fields', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;
      await page.goto('http://localhost:3000/es/admin/catalog/services');
      await page.waitForLoadState('networkidle');

      await page.click('button:has-text("Add New Service")');
      await page.waitForSelector('select[name="categoryId"]');

      // Try to submit without required fields
      await page.click('button:has-text("Create Service")');

      // Should show validation errors
      await expect(page.locator('text=/required/i').first()).toBeVisible();
    });

    test('12. Delete protection - cannot delete category with services', async ({
      authenticatedAdminPage,
    }) => {
      const page = authenticatedAdminPage;
      await page.goto('http://localhost:3000/es/admin/catalog/categories');
      await page.waitForLoadState('networkidle');

      // Find our category (it should have services)
      const categoryCard = page
        .locator('[data-testid="category-card"]')
        .filter({ hasText: updatedCategoryName })
        .first();

      // Check if it has services
      const serviceCountText = await categoryCard
        .locator('text=/\\d+ service/i')
        .textContent();
      const hasServices = !serviceCountText?.includes('0 service');

      if (hasServices) {
        // Delete button should be disabled
        const deleteButton = categoryCard.locator(
          'button[aria-label*="delete"]',
        );
        await expect(deleteButton).toBeDisabled();
      }
    });
  });

  test.describe('Cleanup', () => {
    test('13. Clean up test data', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;
      // Delete remaining test services first
      await page.goto('http://localhost:3000/es/admin/catalog/services');
      await page.waitForLoadState('networkidle');

      const testServices = page.locator('[data-testid="service-card"]').filter({
        hasText: /Form Renderer Test Service|E2E Test Service/,
      });

      const count = await testServices.count();
      for (let i = 0; i < count; i++) {
        const serviceCard = testServices.first();
        if (await serviceCard.isVisible()) {
          page.on('dialog', (dialog) => dialog.accept());
          await serviceCard
            .locator('button[aria-label="Delete service"]')
            .click();
          await page.waitForTimeout(500);
        }
      }

      // Now delete test category
      await page.goto('http://localhost:3000/es/admin/catalog/categories');
      await page.waitForLoadState('networkidle');

      const categoryCard = page
        .locator('[data-testid="category-card"]')
        .filter({ hasText: updatedCategoryName })
        .first();

      if (await categoryCard.isVisible()) {
        page.on('dialog', (dialog) => dialog.accept());
        await categoryCard
          .locator('button[aria-label="Delete category"]')
          .click();
        await page.waitForTimeout(500);
      }
    });
  });
});
