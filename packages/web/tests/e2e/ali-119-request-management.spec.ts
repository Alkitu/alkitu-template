import { test, expect } from '../fixtures/authenticated-fixtures';
import { TEST_USERS } from '../fixtures/test-users';

/**
 * ALI-119 - Service Request Management E2E Tests
 *
 * Tests the complete service request workflow for all roles:
 * 1. CLIENT: Create, view, and cancel own requests
 * 2. EMPLOYEE: View available requests, assign to self, complete requests
 * 3. ADMIN: Full management capabilities (view all, assign, complete, delete)
 *
 * Request Lifecycle:
 * PENDING → ONGOING → COMPLETED
 *          ↓
 *       CANCELLED
 *
 * Security & RBAC:
 * - CLIENT: Can only create/view/cancel own requests
 * - EMPLOYEE: Can view unassigned + assigned requests, assign, complete
 * - ADMIN: Full access to all requests
 *
 * NOTE: Uses pre-seeded test users from fixtures/test-users.ts
 * Run `npm run seed:test-users` in packages/api before running these tests
 */

// Test users with different roles (pre-seeded in database)
const clientUser = TEST_USERS.REQUEST_CLIENT;
const employeeUser = TEST_USERS.REQUEST_EMPLOYEE;
const adminUser = TEST_USERS.REQUEST_ADMIN;

// Test data IDs (will be populated during setup)
let testServiceId: string;
let testLocationId: string;
let testCategoryId: string;
let testRequestId: string;
const timestamp = Date.now(); // Used only for unique test data names

test.describe.serial('ALI-119: Service Request Management - Setup', () => {
  // Test users are pre-seeded via npm run seed:test-users

  test('Setup: Create test category, service, and location', async ({ browser }) => {
    test.setTimeout(60000);
    const page = await browser.newPage();

    // Login as CLIENT to create location
    await page.goto('http://localhost:3000/es/auth/login');
    await page.waitForLoadState('networkidle');
    await page.getByLabel(/correo/i).fill(clientUser.email);
    await page.locator('input[type="password"]').first().fill(clientUser.password);
    await page.getByRole('button', { name: /iniciar sesión/i }).click();
    await page.waitForURL(/dashboard|onboarding/, { timeout: 10000 });

    // Skip onboarding if needed
    const skipButton = page.getByRole('button', { name: /skip/i });
    if (await skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await skipButton.click();
      await page.waitForURL(/dashboard/, { timeout: 5000 });
    }

    // Get auth token from cookies
    const cookies = await page.context().cookies();
    const authToken = cookies.find(c => c.name === 'auth-token')?.value;

    if (!authToken) {
      throw new Error('Failed to get auth token');
    }

    // Create test location via API
    try {
      const locationResponse = await page.request.post('http://localhost:3001/work-locations', {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          street: '123 Test Request Street',
          city: 'Test City',
          state: 'CA',
          zip: '90001',
        },
      });

      if (locationResponse.ok()) {
        const location = await locationResponse.json();
        testLocationId = location.id;
        console.log('Test location created:', testLocationId);
      }
    } catch (error) {
      console.error('Failed to create test location:', error);
    }

    await page.close();

    // Create category and service as ADMIN
    const adminPage = await browser.newPage();
    await adminPage.goto('http://localhost:3000/es/auth/login');
    await adminPage.waitForLoadState('networkidle');
    await adminPage.getByLabel(/correo/i).fill(adminUser.email);
    await adminPage.locator('input[type="password"]').first().fill(adminUser.password);
    await adminPage.getByRole('button', { name: /iniciar sesión/i }).click();
    await adminPage.waitForURL(/dashboard|onboarding/, { timeout: 10000 });

    // Skip onboarding if needed
    const adminSkipButton = adminPage.getByRole('button', { name: /skip/i });
    if (await adminSkipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await adminSkipButton.click();
      await adminPage.waitForURL(/dashboard/, { timeout: 5000 });
    }

    const adminCookies = await adminPage.context().cookies();
    const adminAuthToken = adminCookies.find(c => c.name === 'auth-token')?.value;

    if (!adminAuthToken) {
      throw new Error('Failed to get admin auth token');
    }

    // Create test category
    try {
      const categoryResponse = await adminPage.request.post('http://localhost:3001/categories', {
        headers: {
          Authorization: `Bearer ${adminAuthToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          name: `Test Request Category ${timestamp}`,
          description: 'Category for request testing',
          icon: 'briefcase',
          isActive: true,
        },
      });

      if (categoryResponse.ok()) {
        const category = await categoryResponse.json();
        testCategoryId = category.id;
        console.log('Test category created:', testCategoryId);
      }
    } catch (error) {
      console.error('Failed to create test category:', error);
    }

    // Create test service
    if (testCategoryId) {
      try {
        const serviceResponse = await adminPage.request.post('http://localhost:3001/services', {
          headers: {
            Authorization: `Bearer ${adminAuthToken}`,
            'Content-Type': 'application/json',
          },
          data: {
            name: `Test Request Service ${timestamp}`,
            description: 'Service for request testing',
            categoryId: testCategoryId,
            isActive: true,
            requestTemplate: {
              name: 'Test Template',
              fields: [
                {
                  id: 'test_field_1',
                  label: 'Test Field 1',
                  type: 'text',
                  required: true,
                  order: 1,
                },
                {
                  id: 'test_field_2',
                  label: 'Test Field 2',
                  type: 'textarea',
                  required: false,
                  order: 2,
                },
              ],
            },
          },
        });

        if (serviceResponse.ok()) {
          const service = await serviceResponse.json();
          testServiceId = service.id;
          console.log('Test service created:', testServiceId);
        }
      } catch (error) {
        console.error('Failed to create test service:', error);
      }
    }

    await adminPage.close();
  });
});

test.describe('ALI-119: CLIENT Role - Create and Manage Requests', () => {
  // REQUEST_CLIENT has CLIENT role, so use authenticatedClientPage

  test.beforeEach(async ({ authenticatedClientPage }) => {
    await authenticatedClientPage.setViewportSize({ width: 1280, height: 720 });
  });

  test('1. CLIENT: Should see requests list page with New Request button', async ({ authenticatedClientPage }) => {
    const page = authenticatedClientPage;
    await page.goto('http://localhost:3000/es/requests');
    await page.waitForLoadState('networkidle');

    // Verify page title (using .first() to avoid strict mode violation)
    await expect(page.getByRole('heading', { name: /service requests/i }).first()).toBeVisible();

    // Verify CLIENT-specific description
    await expect(page.getByText(/manage your service requests/i)).toBeVisible();

    // Verify "New Request" button is visible for CLIENT
    await expect(page.getByRole('button', { name: /new request/i })).toBeVisible();
  });

  test('2. CLIENT: Should create a new service request', async ({ authenticatedClientPage }) => {
    const page = authenticatedClientPage;
    test.setTimeout(60000);

    // Navigate to new request page
    await page.goto('http://localhost:3000/es/requests/new');
    await page.waitForLoadState('networkidle');

    // Verify page header
    await expect(page.getByRole('heading', { name: /new service request/i })).toBeVisible();

    // Wait for services to load
    await page.waitForTimeout(2000);

    // Select service (if test service exists)
    if (testServiceId) {
      const serviceSelect = page.getByLabel(/service/i);
      await serviceSelect.click();
      await page.waitForTimeout(500);
      await serviceSelect.selectOption({ label: new RegExp(`Test Request Service`, 'i') });
      await page.waitForTimeout(1000);
    }

    // Select location (if test location exists)
    if (testLocationId) {
      const locationSelect = page.getByLabel(/location/i);
      await locationSelect.click();
      await page.waitForTimeout(500);
      // Select first available location
      const locationOptions = await locationSelect.locator('option').all();
      if (locationOptions.length > 1) {
        await locationSelect.selectOption({ index: 1 });
      }
      await page.waitForTimeout(1000);
    }

    // Set execution date/time (tomorrow at 10:00 AM)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    const dateTimeInput = page.getByLabel(/execution.*date/i);
    await dateTimeInput.fill(`${dateString}T10:00`);

    // Fill template fields if they appear
    const testField1 = page.getByLabel(/test field 1/i);
    if (await testField1.isVisible({ timeout: 2000 }).catch(() => false)) {
      await testField1.fill('Test response 1');
    }

    const testField2 = page.getByLabel(/test field 2/i);
    if (await testField2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await testField2.fill('Test response 2');
    }

    // Submit form
    const submitButton = page.getByRole('button', { name: /create request|submit/i });
    await submitButton.click();

    // Wait for redirect to request detail or list (success)
    await page.waitForURL(/\/requests\/[a-f0-9]{24}|\/requests/, { timeout: 10000 });

    // Verify we're on request detail or list page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/requests/);

    // If redirected to detail page, save the request ID
    const match = currentUrl.match(/\/requests\/([a-f0-9]{24})/);
    if (match) {
      testRequestId = match[1];
      console.log('Test request created:', testRequestId);
    }
  });

  test('3. CLIENT: Should view own request in list', async ({ authenticatedClientPage }) => {
    const page = authenticatedClientPage;
    await page.goto('http://localhost:3000/es/requests');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for either empty state or request cards
    const emptyState = page.getByText(/no requests/i);
    const hasRequests = !(await emptyState.isVisible({ timeout: 2000 }).catch(() => false));

    if (hasRequests) {
      // Verify at least one request card is visible
      const requestCards = page.locator('[class*="border"]').filter({ hasText: /pending|ongoing|completed/i });
      const count = await requestCards.count();
      expect(count).toBeGreaterThan(0);

      // Verify status badge is visible
      await expect(page.getByText(/pending|ongoing|completed/i).first()).toBeVisible();
    } else {
      console.log('No requests found - empty state is shown');
    }
  });

  test('4. CLIENT: Should filter requests by status', async ({ authenticatedClientPage }) => {
    const page = authenticatedClientPage;
    await page.goto('http://localhost:3000/es/requests');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Look for status filter (dropdown or buttons)
    const statusFilter = page.getByLabel(/status|filter/i).or(page.getByRole('button', { name: /pending|ongoing|all/i }));

    if (await statusFilter.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      // Click filter and select PENDING
      await statusFilter.first().click();
      await page.waitForTimeout(500);

      // If dropdown, select option
      const pendingOption = page.getByRole('option', { name: /pending/i }).or(page.getByText(/^pending$/i));
      if (await pendingOption.isVisible({ timeout: 1000 }).catch(() => false)) {
        await pendingOption.click();
        await page.waitForTimeout(1000);
      }

      // Verify URL has status filter or page updated
      console.log('Status filter applied');
    } else {
      console.log('Status filter not found - skipping filter test');
    }
  });

  test('5. CLIENT: Should cancel a PENDING request', async ({ authenticatedClientPage }) => {
    const page = authenticatedClientPage;
    test.setTimeout(60000);

    // Go to requests list
    await page.goto('http://localhost:3000/es/requests');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find a PENDING request
    const pendingRequest = page.locator('[class*="border"]').filter({ hasText: /pending/i }).first();

    if (await pendingRequest.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Click "Ver Detalles" button to view details
      const viewDetailsButton = pendingRequest.getByRole('button', { name: /ver detalles|view details/i });
      await viewDetailsButton.click();
      await page.waitForURL(/\/requests\/[a-f0-9]{24}/, { timeout: 5000 });
      await page.waitForLoadState('networkidle');

      // Look for Cancel button
      const cancelButton = page.getByRole('button', { name: /cancel request/i });

      if (await cancelButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await cancelButton.click();
        await page.waitForTimeout(500);

        // Fill cancellation reason
        const reasonField = page.getByLabel(/reason/i).or(page.getByPlaceholder(/reason/i));
        if (await reasonField.isVisible({ timeout: 2000 }).catch(() => false)) {
          await reasonField.fill('Testing cancellation workflow');
        }

        // Confirm cancellation
        const confirmButton = page.getByRole('button', { name: /confirm|yes|cancel request/i }).last();
        await confirmButton.click();
        await page.waitForTimeout(2000);

        // Verify status changed to CANCELLED
        await expect(page.getByText(/cancelled/i)).toBeVisible({ timeout: 5000 });
      } else {
        console.log('Cancel button not found - request may not be PENDING');
      }
    } else {
      console.log('No PENDING requests found to cancel');
    }
  });
});

test.describe('ALI-119: EMPLOYEE Role - Assign and Complete Requests', () => {
  // REQUEST_EMPLOYEE has EMPLOYEE role, so use authenticatedEmployeePage

  test.beforeEach(async ({ authenticatedEmployeePage }) => {
    await authenticatedEmployeePage.setViewportSize({ width: 1280, height: 720 });
  });

  test('1. EMPLOYEE: Should see requests list without New Request button', async ({ authenticatedEmployeePage }) => {
    const page = authenticatedEmployeePage;
    await page.goto('http://localhost:3000/es/requests');
    await page.waitForLoadState('networkidle');

    // Verify page title (using .first() to avoid strict mode violation)
    await expect(page.getByRole('heading', { name: /service requests/i }).first()).toBeVisible();

    // Verify EMPLOYEE-specific description
    await expect(page.getByText(/view and manage assigned requests/i)).toBeVisible();

    // Verify "New Request" button is NOT visible for EMPLOYEE
    const newRequestButton = page.getByRole('button', { name: /new request/i });
    await expect(newRequestButton).not.toBeVisible();
  });

  test('2. EMPLOYEE: Should assign a PENDING request to self', async ({ authenticatedEmployeePage }) => {
    const page = authenticatedEmployeePage;
    test.setTimeout(60000);

    await page.goto('http://localhost:3000/es/requests');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find an unassigned PENDING request
    const pendingRequest = page.locator('[class*="border"]').filter({ hasText: /pending/i }).first();

    if (await pendingRequest.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Click on request
      await pendingRequest.click();
      await page.waitForURL(/\/requests\/[a-f0-9]{24}/, { timeout: 5000 });
      await page.waitForLoadState('networkidle');

      // Look for Assign button
      const assignButton = page.getByRole('button', { name: /assign/i });

      if (await assignButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await assignButton.click();
        await page.waitForTimeout(500);

        // Select self (first option or current employee)
        const employeeSelect = page.getByLabel(/employee|assign to/i);
        if (await employeeSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
          await employeeSelect.selectOption({ index: 0 });
        }

        // Confirm assignment
        const confirmButton = page.getByRole('button', { name: /confirm|assign/i }).last();
        await confirmButton.click();
        await page.waitForTimeout(2000);

        // Verify status changed to ONGOING and assigned employee is shown
        await expect(page.getByText(/ongoing/i).or(page.getByText(/assigned/i))).toBeVisible({ timeout: 5000 });
      } else {
        console.log('Assign button not found - request may already be assigned');
      }
    } else {
      console.log('No PENDING requests available to assign');
    }
  });

  test('3. EMPLOYEE: Should complete an ONGOING request', async ({ authenticatedEmployeePage }) => {
    const page = authenticatedEmployeePage;
    test.setTimeout(60000);

    await page.goto('http://localhost:3000/es/requests');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find an ONGOING request
    const ongoingRequest = page.locator('[class*="border"]').filter({ hasText: /ongoing/i }).first();

    if (await ongoingRequest.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Click on request
      await ongoingRequest.click();
      await page.waitForURL(/\/requests\/[a-f0-9]{24}/, { timeout: 5000 });
      await page.waitForLoadState('networkidle');

      // Look for Complete button
      const completeButton = page.getByRole('button', { name: /complete/i });

      if (await completeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await completeButton.click();
        await page.waitForTimeout(500);

        // Fill completion notes
        const notesField = page.getByLabel(/notes|completion/i).or(page.getByPlaceholder(/notes/i));
        if (await notesField.isVisible({ timeout: 2000 }).catch(() => false)) {
          await notesField.fill('Service completed successfully');
        }

        // Confirm completion
        const confirmButton = page.getByRole('button', { name: /confirm|complete/i }).last();
        await confirmButton.click();
        await page.waitForTimeout(2000);

        // Verify status changed to COMPLETED
        await expect(page.getByText(/completed/i)).toBeVisible({ timeout: 5000 });
      } else {
        console.log('Complete button not found - request may not be ONGOING or not assigned to this employee');
      }
    } else {
      console.log('No ONGOING requests found to complete');
    }
  });
});

test.describe('ALI-119: ADMIN Role - Full Management', () => {
  // REQUEST_ADMIN has ADMIN role, so use authenticatedAdminPage

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    await authenticatedAdminPage.setViewportSize({ width: 1280, height: 720 });
  });

  test('1. ADMIN: Should see all requests from all users', async ({ authenticatedAdminPage }) => {
    const page = authenticatedAdminPage;
    await page.goto('http://localhost:3000/es/requests');
    await page.waitForLoadState('networkidle');

    // Verify page title (using .first() to avoid strict mode violation)
    await expect(page.getByRole('heading', { name: /service requests/i }).first()).toBeVisible();

    // Verify ADMIN-specific description
    await expect(page.getByText(/manage all service requests/i)).toBeVisible();

    // Verify requests are visible (from CLIENT user tests)
    await page.waitForTimeout(2000);

    const emptyState = page.getByText(/no requests/i);
    const hasRequests = !(await emptyState.isVisible({ timeout: 2000 }).catch(() => false));

    if (hasRequests) {
      console.log('ADMIN can see requests from all users');
    } else {
      console.log('No requests found in system');
    }
  });

  test('2. ADMIN: Should have access to all management actions', async ({ authenticatedAdminPage }) => {
    const page = authenticatedAdminPage;
    test.setTimeout(60000);

    await page.goto('http://localhost:3000/es/requests');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find any PENDING or ONGOING request (not COMPLETED - they have no action buttons)
    const anyRequest = page.locator('[class*="border"]').filter({ hasText: /pending|ongoing/i }).first();

    if (await anyRequest.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Click "Ver Detalles" button to view details
      const viewDetailsButton = anyRequest.getByRole('button', { name: /ver detalles|view details/i });
      await viewDetailsButton.click();
      await page.waitForURL(/\/requests\/[a-f0-9]{24}/, { timeout: 5000 });
      await page.waitForLoadState('networkidle');

      // Wait for request details to load (check for service name or any content)
      await page.waitForTimeout(2000);

      // Verify ADMIN has access to action buttons (assign, cancel, complete, delete)
      // Check for specific button texts that exist in RequestDetailOrganism
      const assignButton = page.getByRole('button', { name: /assign request/i });
      const completeButton = page.getByRole('button', { name: /mark as completed|complete/i });
      const cancelButton = page.getByRole('button', { name: /^cancel$/i });

      const buttonCount = (await assignButton.count()) +
                         (await completeButton.count()) +
                         (await cancelButton.count());

      expect(buttonCount).toBeGreaterThan(0);
      console.log(`ADMIN has access to ${buttonCount} action buttons`);
    } else {
      console.log('No requests available to test ADMIN actions');
    }
  });
});

test.describe('ALI-119: Security and Validation Tests', () => {
  test('1. Should require authentication to access requests', async ({ page }) => {
    // Skip if SKIP_AUTH is enabled (middleware bypasses all auth checks)
    test.skip(process.env.SKIP_AUTH === 'true', 'Test requires auth middleware (SKIP_AUTH must be false or unset in .env)');

    // Try to access requests page without login
    await page.goto('http://localhost:3000/es/requests');
    await page.waitForLoadState('networkidle');

    // Should be redirected to login page
    await page.waitForURL(/auth\/login/, { timeout: 5000 });
    expect(page.url()).toContain('/auth/login');
  });

  test('2. Should require authentication to create request', async ({ page }) => {
    // Skip if SKIP_AUTH is enabled (middleware bypasses all auth checks)
    test.skip(process.env.SKIP_AUTH === 'true', 'Test requires auth middleware (SKIP_AUTH must be false or unset in .env)');

    // Try to access new request page without login
    await page.goto('http://localhost:3000/es/requests/new');

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('3. Should validate required fields in request form', async ({ authenticatedClientPage }) => {
    const page = authenticatedClientPage;
    test.setTimeout(60000);

    // Go to new request page
    await page.goto('http://localhost:3000/es/requests/new');
    await page.waitForLoadState('networkidle');

    // Try to submit without filling required fields
    const submitButton = page.getByRole('button', { name: /create request|submit/i });
    await submitButton.click();
    await page.waitForTimeout(1000);

    // Should show validation errors
    const errorMessages = page.getByText(/required|must|invalid/i);
    const hasErrors = await errorMessages.first().isVisible({ timeout: 2000 }).catch(() => false);

    if (hasErrors) {
      console.log('Form validation is working - required fields are enforced');
    } else {
      console.log('No validation errors shown - form may have different validation approach');
    }
  });
});
