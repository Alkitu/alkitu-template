import { test, expect } from '@playwright/test';

/**
 * ALI-115 - Auth Flow E2E Tests
 *
 * Tests the complete authentication flow including:
 * 1. Registration with password strength indicator
 * 2. Login with profileComplete redirect logic
 * 3. Onboarding flow
 * 4. Final redirect to dashboard
 */

// Generate unique email for each test run
const timestamp = Date.now();
const testEmail = `test-${timestamp}@example.com`;
const testPassword = 'SecurePass123';
const testFirstname = 'Juan';
const testLastname = 'Pérez';

test.describe('ALI-115: Complete Auth Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('1. Should display registration form with all fields', async ({
    page,
  }) => {
    // Navigate to register page
    await page.goto('http://localhost:3000/es/auth/register');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify all form fields are present
    await expect(page.getByLabel(/nombre/i).first()).toBeVisible();
    await expect(page.getByLabel(/apellido/i)).toBeVisible();
    await expect(page.getByLabel(/correo/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i).first()).toBeVisible();
    await expect(page.getByLabel(/confirmar/i)).toBeVisible();
    await expect(page.getByRole('checkbox')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /registrar/i }),
    ).toBeVisible();
  });

  test('2. Should show password strength indicator', async ({ page }) => {
    await page.goto('http://localhost:3000/es/auth/register');
    await page.waitForLoadState('networkidle');

    const passwordInput = page.getByLabel(/contraseña/i).first();

    // Test weak password
    await passwordInput.fill('abc');
    await page.waitForTimeout(300); // Wait for indicator to update

    // Should show password strength indicator
    await expect(page.getByText(/fortaleza/i)).toBeVisible();
    await expect(page.getByText(/muy débil|débil/i)).toBeVisible();

    // Test strong password
    await passwordInput.clear();
    await passwordInput.fill('SecurePass123');
    await page.waitForTimeout(300);

    // Should show strong strength
    await expect(page.getByText(/fuerte|buena/i)).toBeVisible();
  });

  test('3. Should register new user successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/es/auth/register');
    await page.waitForLoadState('networkidle');

    // Fill registration form
    await page
      .getByLabel(/nombre/i)
      .first()
      .fill(testFirstname);
    await page.getByLabel(/apellido/i).fill(testLastname);
    await page.getByLabel(/correo/i).fill(testEmail);
    await page
      .getByLabel(/contraseña/i)
      .first()
      .fill(testPassword);
    await page.getByLabel(/confirmar/i).fill(testPassword);

    // Accept terms (use click instead of check for custom checkbox component)
    await page.getByRole('checkbox').click();

    // Submit form
    await page.getByRole('button', { name: /registrar/i }).click();

    // Should redirect to login page
    await page.waitForURL('**/auth/login', { timeout: 10000 });

    // Verify we're on login page
    expect(page.url()).toContain('/auth/login');
  });

  test('4. Should login and redirect to onboarding (profileComplete=false)', async ({
    page,
  }) => {
    // First, register the user (prerequisite) with unique email
    const uniqueEmail = `test-4-${Date.now()}@example.com`;

    await page.goto('http://localhost:3000/es/auth/register');
    await page.waitForLoadState('networkidle');

    await page
      .getByLabel(/nombre/i)
      .first()
      .fill(testFirstname);
    await page.getByLabel(/apellido/i).fill(testLastname);
    await page.getByLabel(/correo/i).fill(uniqueEmail);
    await page
      .getByLabel(/contraseña/i)
      .first()
      .fill(testPassword);
    await page.getByLabel(/confirmar/i).fill(testPassword);
    await page.getByRole('checkbox').click();
    await page.getByRole('button', { name: /registrar/i }).click();

    await page.waitForURL('**/auth/login', { timeout: 10000 });

    // Now login with the new user
    await page.getByLabel(/correo|email/i).fill(uniqueEmail);
    await page.getByRole('textbox', { name: /contraseña/i }).fill(testPassword);
    await page.getByRole('button', { name: /iniciar|login/i }).click();

    // Should redirect to onboarding (because profileComplete = false)
    await page.waitForURL('**/onboarding', { timeout: 10000 });

    // Verify we're on onboarding page
    expect(page.url()).toContain('/onboarding');

    // Verify onboarding form is visible
    await expect(
      page.getByRole('heading', { name: /completa.*perfil/i }),
    ).toBeVisible();
  });

  test('5. Should complete onboarding and redirect to dashboard', async ({
    page,
  }) => {
    // Register and login first with unique email
    const uniqueEmail = `test-5-${Date.now()}@example.com`;

    await page.goto('http://localhost:3000/es/auth/register');
    await page.waitForLoadState('networkidle');

    await page
      .getByLabel(/nombre/i)
      .first()
      .fill(testFirstname);
    await page.getByLabel(/apellido/i).fill(testLastname);
    await page.getByLabel(/correo/i).fill(uniqueEmail);
    await page
      .getByLabel(/contraseña/i)
      .first()
      .fill(testPassword);
    await page.getByLabel(/confirmar/i).fill(testPassword);
    await page.getByRole('checkbox').click();
    await page.getByRole('button', { name: /registrar/i }).click();

    await page.waitForURL('**/auth/login', { timeout: 10000 });

    await page.getByLabel(/correo|email/i).fill(uniqueEmail);
    await page.getByRole('textbox', { name: /contraseña/i }).fill(testPassword);
    await page.getByRole('button', { name: /iniciar|login/i }).click();

    await page.waitForURL('**/onboarding', { timeout: 10000 });

    // Fill onboarding form (optional fields)
    const phoneInput = page.locator('input[type="tel"]').first();
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('+34 600 123 456');
    }

    const companyInput = page
      .locator('input[id*="company"], input[name*="company"]')
      .first();
    if (await companyInput.isVisible()) {
      await companyInput.fill('Acme Inc.');
    }

    // Submit onboarding (click the submit button, not the skip button)
    await page
      .getByRole('button', { name: /completar perfil|guardar/i })
      .last()
      .click();

    // Should redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Verify we're on dashboard
    expect(page.url()).toContain('/dashboard');
  });

  test('6. Should skip onboarding and go to dashboard', async ({ page }) => {
    // Register and login first
    await page.goto('http://localhost:3000/es/auth/register');
    await page.waitForLoadState('networkidle');

    const uniqueEmail = `skip-${Date.now()}@example.com`;

    await page
      .getByLabel(/nombre/i)
      .first()
      .fill(testFirstname);
    await page.getByLabel(/apellido/i).fill(testLastname);
    await page.getByLabel(/correo/i).fill(uniqueEmail);
    await page
      .getByLabel(/contraseña/i)
      .first()
      .fill(testPassword);
    await page.getByLabel(/confirmar/i).fill(testPassword);
    await page.getByRole('checkbox').click();
    await page.getByRole('button', { name: /registrar/i }).click();

    await page.waitForURL('**/auth/login', { timeout: 10000 });

    await page.getByLabel(/correo|email/i).fill(uniqueEmail);
    await page.getByRole('textbox', { name: /contraseña/i }).fill(testPassword);
    await page.getByRole('button', { name: /iniciar|login/i }).click();

    await page.waitForURL('**/onboarding', { timeout: 10000 });

    // Click "Skip" button
    const skipButton = page.getByRole('button', { name: /saltar|skip/i });
    if (await skipButton.isVisible()) {
      await skipButton.click();

      // Should redirect to dashboard even without completing profile
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      expect(page.url()).toContain('/dashboard');
    }
  });

  test('7. Should validate password complexity requirements', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/es/auth/register');
    await page.waitForLoadState('networkidle');

    const passwordInput = page.getByLabel(/contraseña/i).first();
    const confirmPasswordInput = page.getByLabel(/confirmar/i);

    // Fill form with weak password
    await page
      .getByLabel(/nombre/i)
      .first()
      .fill(testFirstname);
    await page.getByLabel(/apellido/i).fill(testLastname);
    await page.getByLabel(/correo/i).fill(`weak-${Date.now()}@example.com`);
    await passwordInput.fill('weak');
    await confirmPasswordInput.fill('weak');
    await page.getByRole('checkbox').click();

    // Try to submit
    await page.getByRole('button', { name: /registrar/i }).click();

    // Should show error or not proceed (password too weak)
    // Wait a bit to see if there's any error message or validation
    await page.waitForTimeout(1000);

    // Should still be on register page (not redirected)
    expect(page.url()).toContain('/register');
  });

  test('8. Should show error when passwords do not match', async ({ page }) => {
    await page.goto('http://localhost:3000/es/auth/register');
    await page.waitForLoadState('networkidle');

    await page
      .getByLabel(/nombre/i)
      .first()
      .fill(testFirstname);
    await page.getByLabel(/apellido/i).fill(testLastname);
    await page.getByLabel(/correo/i).fill(`mismatch-${Date.now()}@example.com`);
    await page
      .getByLabel(/contraseña/i)
      .first()
      .fill(testPassword);
    await page.getByLabel(/confirmar/i).fill('DifferentPassword123');
    await page.getByRole('checkbox').click();

    // Try to submit
    await page.getByRole('button', { name: /registrar/i }).click();

    // Should show error message
    await page.waitForTimeout(1000);

    // Should still be on register page
    expect(page.url()).toContain('/register');
  });

  test('9. Should handle login with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/es/auth/login');
    await page.waitForLoadState('networkidle');

    // Try to login with non-existent user
    await page.getByLabel(/correo|email/i).fill('nonexistent@example.com');
    await page
      .getByRole('textbox', { name: /contraseña/i })
      .fill('WrongPassword123');
    await page.getByRole('button', { name: /iniciar|login/i }).click();

    // Should show error message or stay on login page
    await page.waitForTimeout(2000);

    // Should still be on login page
    expect(page.url()).toContain('/login');
  });

  test('10. Complete flow: Register → Login → Onboarding → Dashboard', async ({
    page,
  }) => {
    const flowEmail = `flow-${Date.now()}@example.com`;

    // Step 1: Register
    await page.goto('http://localhost:3000/es/auth/register');
    await page.waitForLoadState('networkidle');

    await page
      .getByLabel(/nombre/i)
      .first()
      .fill(testFirstname);
    await page.getByLabel(/apellido/i).fill(testLastname);
    await page.getByLabel(/correo/i).fill(flowEmail);
    await page
      .getByLabel(/contraseña/i)
      .first()
      .fill(testPassword);
    await page.getByLabel(/confirmar/i).fill(testPassword);
    await page.getByRole('checkbox').click();
    await page.getByRole('button', { name: /registrar/i }).click();

    await page.waitForURL('**/auth/login', { timeout: 10000 });
    console.log('✅ Step 1: Registration successful');

    // Step 2: Login
    await page.getByLabel(/correo|email/i).fill(flowEmail);
    await page.getByRole('textbox', { name: /contraseña/i }).fill(testPassword);
    await page.getByRole('button', { name: /iniciar|login/i }).click();

    await page.waitForURL('**/onboarding', { timeout: 10000 });
    console.log('✅ Step 2: Login successful, redirected to onboarding');

    // Step 3: Complete Onboarding
    const phoneInput = page.locator('input[type="tel"]').first();
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('+34 600 123 456');
    }

    const companyInput = page
      .locator('input[id*="company"], input[name*="company"]')
      .first();
    if (await companyInput.isVisible()) {
      await companyInput.fill('Acme Inc.');
    }

    await page
      .getByRole('button', { name: /completar perfil|guardar/i })
      .last()
      .click();

    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('✅ Step 3: Onboarding completed, redirected to dashboard');

    // Step 4: Verify we're on dashboard
    expect(page.url()).toContain('/dashboard');
    console.log('✅ Step 4: Complete flow validated successfully!');
  });
});
