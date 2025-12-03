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
      await page.goto(`${baseURL}/es/auth/login`);

      // Fill login form
      await page.getByLabel(/correo/i).fill(user.email);
      await page.locator('input[type="password"]').first().fill(user.password);

      // Submit login
      await page.getByRole('button', { name: /iniciar sesión/i }).click();

      // Wait for successful redirect to any dashboard
      // Note: We don't validate the specific role dashboard since
      // users in DB might have different roles than expected
      await page.waitForURL(/\/dashboard/, { timeout: 15000 });

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
