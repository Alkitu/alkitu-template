import { chromium, FullConfig } from '@playwright/test';
import { TEST_USERS } from './fixtures/test-users';
import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Global Setup for E2E Tests
 *
 * Authenticates all test users via API once and stores their authentication state.
 * This avoids rate limiting issues by preventing repeated UI logins across tests.
 *
 * Each user type gets authenticated and their cookies/tokens are saved to:
 * - .auth/client.json
 * - .auth/employee.json
 * - .auth/admin.json
 *
 * Tests can then reuse these authentication states without hitting rate limits.
 */
async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  console.log('🔐 Starting global authentication setup...');
  console.log(`📍 Frontend URL: ${baseURL}`);
  console.log(`📍 Backend URL: ${apiURL}`);

  // Create .auth directory if it doesn't exist
  const authDir = path.join(__dirname, '../.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();

  // Authenticate each user type
  const userTypes = [
    { type: 'CLIENT', user: TEST_USERS.CLIENT },
    { type: 'EMPLOYEE', user: TEST_USERS.EMPLOYEE },
    { type: 'ADMIN', user: TEST_USERS.ADMIN },
  ];

  for (const { type, user } of userTypes) {
    console.log(`🔑 Authenticating ${type}: ${user.email}...`);

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Navigate to login page
      await page.goto(`${baseURL}/es/auth/login`, { waitUntil: 'networkidle' });

      // Wait for page to be fully loaded and any overlays to disappear
      await page.waitForTimeout(3000);

      // Close any Next.js development overlays if present
      const closeOverlayButton = page.locator('[data-nextjs-dialog-overlay]');
      if (await closeOverlayButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await closeOverlayButton.click();
        await page.waitForTimeout(500);
      }

      // Fill login form - using placeholder as backup selector
      const emailInput = page.getByPlaceholder(/correo electrónico/i);
      await emailInput.waitFor({ state: 'visible', timeout: 10000 });
      await emailInput.fill(user.email);

      const passwordInput = page.getByPlaceholder(/contraseña/i);
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
      await passwordInput.fill(user.password);

      // Submit login - use the form submit button specifically
      const submitButton = page.getByRole('button', { name: /iniciar sesión con correo/i });
      await submitButton.click({ force: true });

      // Wait a moment for the request to process
      await page.waitForTimeout(2000);

      console.log(`📍 Current URL after login attempt: ${page.url()}`);

      // Take screenshot if still on login page
      if (page.url().includes('/auth/login')) {
        await page.screenshot({ path: `/tmp/login-failed-${type}.png`, fullPage: true });
        console.log(`📸 Login failed screenshot saved to /tmp/login-failed-${type}.png`);
      }

      // Check for error messages
      const hasError = await page.getByText(/error|incorrecto|inválido/i).isVisible({ timeout: 3000 }).catch(() => false);
      if (hasError) {
        const errorText = await page.getByText(/error|incorrecto|inválido/i).textContent();
        console.error(`❌ Login error visible: ${errorText}`);
      }

      // Wait for successful redirect to any dashboard or onboarding
      // Note: We don't validate the specific role dashboard since
      // users in DB might have different roles than expected
      await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30000 });

      // If on onboarding, skip it
      if (page.url().includes('/onboarding')) {
        const skipButton = page.getByRole('button', { name: /saltar|skip/i });
        if (await skipButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          await skipButton.click();
          await page.waitForURL(/\/dashboard/, { timeout: 15000 });
        }
      }

      // Save authentication state
      const authFile = path.join(authDir, `${type.toLowerCase()}.json`);
      await context.storageState({ path: authFile });

      console.log(`✅ ${type} authenticated successfully`);
    } catch (error) {
      console.error(`❌ Failed to authenticate ${type}:`, error);
      throw error;
    } finally {
      await context.close();
    }
  }

  await browser.close();

  console.log('✅ Global authentication setup complete!\n');
}

export default globalSetup;
