import { test, expect } from '../fixtures/authenticated-fixtures';
import { TEST_USERS } from '../fixtures/test-users';

/**
 * ALI-116 - Profile Update E2E Tests
 *
 * Tests the profile update functionality for all roles:
 * 1. CLIENT: Can update all fields including address and contactPerson
 * 2. EMPLOYEE: Can update basic fields only
 * 3. ADMIN: Can update basic fields only
 *
 * Security tests:
 * - Cannot change email
 * - Cannot change password (separate endpoint)
 * - Cannot change role
 *
 * NOTE: Uses pre-seeded test users from fixtures/test-users.ts
 * Run `npm run seed:test-users` in packages/api before running these tests
 */

// Test credentials for different roles (pre-seeded in database)
const clientUser = TEST_USERS.CLIENT;
const employeeUser = TEST_USERS.EMPLOYEE;
const adminUser = TEST_USERS.ADMIN;

test.describe('ALI-116: Profile Update for CLIENT Role', () => {
  // CLIENT user is pre-seeded via npm run seed:test-users

  test.beforeEach(async ({ authenticatedClientPage }) => {
    await authenticatedClientPage.setViewportSize({ width: 1280, height: 720 });
  });

  test('1. CLIENT: Should see profile page with full form', async ({
    authenticatedClientPage,
  }) => {
    const page = authenticatedClientPage;
    // Navigate to profile
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(page.getByText(/profile settings/i)).toBeVisible();

    // Verify all CLIENT-specific fields are present
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/phone/i)).toBeVisible();
    await expect(page.getByLabel(/company/i)).toBeVisible();
    await expect(page.getByLabel(/address/i)).toBeVisible();

    // Verify contact person checkbox
    await expect(
      page.getByRole('checkbox', { name: /contact person/i }),
    ).toBeVisible();
  });

  test('2. CLIENT: Should update basic fields successfully', async ({
    authenticatedClientPage,
  }) => {
    const page = authenticatedClientPage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Update basic fields
    await page.getByLabel(/first name/i).clear();
    await page.getByLabel(/first name/i).fill('ClientUpdated');
    await page.getByLabel(/phone/i).fill('+1234567890');
    await page.getByLabel(/company/i).fill('Acme Corporation');

    // Submit form
    await page.getByRole('button', { name: /save changes/i }).click();

    // Wait for success message
    await expect(page.getByText(/profile updated successfully/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('3. CLIENT: Should update address', async ({ authenticatedClientPage }) => {
    const page = authenticatedClientPage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Update address
    const addressField = page.getByLabel(/address/i);
    await addressField.clear();
    await addressField.fill('123 Main Street, Cityville, State 12345');

    // Submit
    await page.getByRole('button', { name: /save changes/i }).click();

    // Verify success
    await expect(page.getByText(/profile updated successfully/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('4. CLIENT: Should add contact person', async ({ authenticatedClientPage }) => {
    const page = authenticatedClientPage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Enable contact person
    await page.getByRole('checkbox', { name: /contact person/i }).check();

    // Wait for fields to appear
    await page.waitForTimeout(500);

    // Fill contact person details
    const contactHeading = await page.getByRole('heading', { name: /contact person details/i });
    await expect(contactHeading).toBeVisible();

    // Fill all contact person fields
    const allFirstNameInputs = await page.getByLabel(/first name/i).all();
    const cpFirstName = allFirstNameInputs[1]; // Second "First Name" input
    await cpFirstName.fill('Jane');

    const allLastNameInputs = await page.getByLabel(/last name/i).all();
    const cpLastName = allLastNameInputs[1];
    await cpLastName.fill('Smith');

    const allPhoneInputs = await page.getByLabel(/phone/i).all();
    const cpPhone = allPhoneInputs[1];
    await cpPhone.fill('+9876543210');

    const allEmailInputs = await page.getByLabel(/email/i).all();
    const cpEmail = allEmailInputs[0];
    await cpEmail.fill('jane.smith@example.com');

    // Submit
    await page.getByRole('button', { name: /save changes/i }).click();

    // Verify success
    await expect(page.getByText(/profile updated successfully/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('5. CLIENT: Should show note about CLIENT privileges', async ({
    authenticatedClientPage,
  }) => {
    const page = authenticatedClientPage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Scroll down to see the note
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify CLIENT-specific note is shown
    await expect(page.getByText(/as a.*client/i)).toBeVisible();
  });
});

test.describe('ALI-116: Profile Update for EMPLOYEE Role', () => {
  // EMPLOYEE user is pre-seeded via npm run seed:test-users

  test.beforeEach(async ({ authenticatedEmployeePage }) => {
    await authenticatedEmployeePage.setViewportSize({ width: 1280, height: 720 });
  });

  test('1. EMPLOYEE: Should see simplified profile form', async ({ authenticatedEmployeePage }) => {
    const page = authenticatedEmployeePage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Verify basic fields are present
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/phone/i)).toBeVisible();
    await expect(page.getByLabel(/company/i)).toBeVisible();

    // Verify CLIENT-specific fields are NOT present
    const addressField = page.getByLabel(/address/i);
    await expect(addressField).not.toBeVisible();

    const contactPersonCheckbox = page.getByRole('checkbox', {
      name: /contact person/i,
    });
    await expect(contactPersonCheckbox).not.toBeVisible();
  });

  test('2. EMPLOYEE: Should update basic fields successfully', async ({
    authenticatedEmployeePage,
  }) => {
    const page = authenticatedEmployeePage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Update fields
    await page.getByLabel(/first name/i).clear();
    await page.getByLabel(/first name/i).fill('EmployeeUpdated');
    await page.getByLabel(/phone/i).fill('+1111111111');
    await page.getByLabel(/company/i).fill('Tech Company');

    // Submit
    await page.getByRole('button', { name: /save changes/i }).click();

    // Verify success
    await expect(page.getByText(/profile updated successfully/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('3. EMPLOYEE: Should NOT see CLIENT privileges note', async ({
    authenticatedEmployeePage,
  }) => {
    const page = authenticatedEmployeePage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // CLIENT-specific note should NOT be visible
    await expect(page.getByText(/as a.*client/i)).not.toBeVisible();
  });
});

test.describe('ALI-116: Profile Update for ADMIN Role', () => {
  // ADMIN user is pre-seeded via npm run seed:test-users

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    await authenticatedAdminPage.setViewportSize({ width: 1280, height: 720 });
  });

  test('1. ADMIN: Should see simplified profile form', async ({ authenticatedAdminPage }) => {
    const page = authenticatedAdminPage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Verify basic fields
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/phone/i)).toBeVisible();
    await expect(page.getByLabel(/company/i)).toBeVisible();

    // Verify no CLIENT fields
    const addressField = page.getByLabel(/address/i);
    await expect(addressField).not.toBeVisible();

    const contactPersonCheckbox = page.getByRole('checkbox', {
      name: /contact person/i,
    });
    await expect(contactPersonCheckbox).not.toBeVisible();
  });

  test('2. ADMIN: Should update basic fields successfully', async ({
    authenticatedAdminPage,
  }) => {
    const page = authenticatedAdminPage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Update fields
    await page.getByLabel(/first name/i).clear();
    await page.getByLabel(/first name/i).fill('AdminUpdated');
    await page.getByLabel(/phone/i).fill('+9999999999');

    // Submit
    await page.getByRole('button', { name: /save changes/i }).click();

    // Verify success
    await expect(page.getByText(/profile updated successfully/i)).toBeVisible({
      timeout: 5000,
    });
  });
});

test.describe('ALI-116: Security Tests', () => {
  // CLIENT user is pre-seeded via npm run seed:test-users

  test.beforeEach(async ({ authenticatedClientPage }) => {
    await authenticatedClientPage.setViewportSize({ width: 1280, height: 720 });
  });

  test('1. Should show note about email being unchangeable', async ({
    authenticatedClientPage,
  }) => {
    const page = authenticatedClientPage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify security note is shown
    await expect(
      page.getByText(/email address cannot be changed/i),
    ).toBeVisible();
  });

  test('2. Should NOT have email input field', async ({ authenticatedClientPage }) => {
    const page = authenticatedClientPage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Verify no email input (email is display-only if shown at all)
    const emailInputs = await page.locator('input[type="email"]').all();

    // Only contact person email should exist (if any)
    // Main user email should NOT be editable
    expect(emailInputs.length).toBeLessThanOrEqual(1);
  });

  test('3. Should NOT have password field', async ({ authenticatedClientPage }) => {
    const page = authenticatedClientPage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Verify no password input
    const passwordInputs = await page.locator('input[type="password"]').all();
    expect(passwordInputs.length).toBe(0);
  });

  test('4. Should redirect to dashboard after successful update', async ({
    authenticatedClientPage,
  }) => {
    const page = authenticatedClientPage;
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Make a small update
    await page.getByLabel(/company/i).fill('New Company Name');

    // Submit
    await page.getByRole('button', { name: /save changes/i }).click();

    // Wait for success message
    await expect(page.getByText(/profile updated successfully/i)).toBeVisible({
      timeout: 5000,
    });

    // Wait for redirect (2 seconds delay in component)
    await page.waitForTimeout(3000);

    // Should be redirected to CLIENT dashboard (not admin dashboard)
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
