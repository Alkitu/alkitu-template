import { test, expect } from '@playwright/test';

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
 */

// Test credentials for different roles
const timestamp = Date.now();

const clientUser = {
  email: `client-${timestamp}@example.com`,
  password: 'ClientPass123',
  firstname: 'Client',
  lastname: 'User',
  role: 'CLIENT',
};

const employeeUser = {
  email: `employee-${timestamp}@example.com`,
  password: 'EmployeePass123',
  firstname: 'Employee',
  lastname: 'User',
  role: 'EMPLOYEE',
};

const adminUser = {
  email: 'admin@alkitu.com', // Use existing admin
  password: 'Admin123!',
  firstname: 'Admin',
  lastname: 'User',
  role: 'ADMIN',
};

test.describe('ALI-116: Profile Update for CLIENT Role', () => {
  test.beforeAll(async ({ browser }) => {
    // Register CLIENT user
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/es/auth/register');
    await page.waitForLoadState('networkidle');

    // Fill registration
    await page
      .getByLabel(/nombre/i)
      .first()
      .fill(clientUser.firstname);
    await page.getByLabel(/apellido/i).fill(clientUser.lastname);
    await page.getByLabel(/correo/i).fill(clientUser.email);
    await page
      .locator('input[type="password"]')
      .first()
      .fill(clientUser.password);
    await page
      .locator('input[type="password"]')
      .nth(1)
      .fill(clientUser.password);
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: /registrar/i }).click();

    // Wait for success
    await page.waitForTimeout(3000);
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Login as CLIENT
    await page.goto('http://localhost:3000/es/auth/login');
    await page.waitForLoadState('networkidle');
    await page.getByLabel(/correo/i).fill(clientUser.email);
    await page
      .locator('input[type="password"]')
      .first()
      .fill(clientUser.password);
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Wait for login to complete
    await page.waitForTimeout(2000);
  });

  test('1. CLIENT: Should see profile page with full form', async ({
    page,
  }) => {
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
    page,
  }) => {
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

  test('3. CLIENT: Should update address', async ({ page }) => {
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

  test('4. CLIENT: Should add contact person', async ({ page }) => {
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Enable contact person
    await page.getByRole('checkbox', { name: /contact person/i }).check();

    // Wait for fields to appear
    await page.waitForTimeout(500);

    // Fill contact person details
    const contactFields = await page.getByText(/contact person details/i);
    await expect(contactFields).toBeVisible();

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
    page,
  }) => {
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Scroll down to see the note
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify CLIENT-specific note is shown
    await expect(page.getByText(/as a.*client/i)).toBeVisible();
  });
});

test.describe('ALI-116: Profile Update for EMPLOYEE Role', () => {
  test.beforeAll(async ({ browser }) => {
    // Register EMPLOYEE user
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/es/auth/register');
    await page.waitForLoadState('networkidle');

    await page
      .getByLabel(/nombre/i)
      .first()
      .fill(employeeUser.firstname);
    await page.getByLabel(/apellido/i).fill(employeeUser.lastname);
    await page.getByLabel(/correo/i).fill(employeeUser.email);
    await page
      .locator('input[type="password"]')
      .first()
      .fill(employeeUser.password);
    await page
      .locator('input[type="password"]')
      .nth(1)
      .fill(employeeUser.password);
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: /registrar/i }).click();

    await page.waitForTimeout(3000);
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Login as EMPLOYEE
    await page.goto('http://localhost:3000/es/auth/login');
    await page.waitForLoadState('networkidle');
    await page.getByLabel(/correo/i).fill(employeeUser.email);
    await page
      .locator('input[type="password"]')
      .first()
      .fill(employeeUser.password);
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await page.waitForTimeout(2000);
  });

  test('1. EMPLOYEE: Should see simplified profile form', async ({ page }) => {
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
    page,
  }) => {
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
    page,
  }) => {
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // CLIENT-specific note should NOT be visible
    await expect(page.getByText(/as a.*client/i)).not.toBeVisible();
  });
});

test.describe('ALI-116: Profile Update for ADMIN Role', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Login as ADMIN
    await page.goto('http://localhost:3000/es/auth/login');
    await page.waitForLoadState('networkidle');
    await page.getByLabel(/correo/i).fill(adminUser.email);
    await page
      .locator('input[type="password"]')
      .first()
      .fill(adminUser.password);
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await page.waitForTimeout(2000);
  });

  test('1. ADMIN: Should see simplified profile form', async ({ page }) => {
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
    page,
  }) => {
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
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Login as CLIENT for security tests
    await page.goto('http://localhost:3000/es/auth/login');
    await page.waitForLoadState('networkidle');
    await page.getByLabel(/correo/i).fill(clientUser.email);
    await page
      .locator('input[type="password"]')
      .first()
      .fill(clientUser.password);
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await page.waitForTimeout(2000);
  });

  test('1. Should show note about email being unchangeable', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify security note is shown
    await expect(
      page.getByText(/email address cannot be changed/i),
    ).toBeVisible();
  });

  test('2. Should NOT have email input field', async ({ page }) => {
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Verify no email input (email is display-only if shown at all)
    const emailInputs = await page.locator('input[type="email"]').all();

    // Only contact person email should exist (if any)
    // Main user email should NOT be editable
    expect(emailInputs.length).toBeLessThanOrEqual(1);
  });

  test('3. Should NOT have password field', async ({ page }) => {
    await page.goto('http://localhost:3000/es/profile');
    await page.waitForLoadState('networkidle');

    // Verify no password input
    const passwordInputs = await page.locator('input[type="password"]').all();
    expect(passwordInputs.length).toBe(0);
  });

  test('4. Should redirect to dashboard after successful update', async ({
    page,
  }) => {
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

    // Should be redirected to dashboard
    await expect(page).toHaveURL(/admin\/dashboard/);
  });
});
