import { test as base, Page } from '@playwright/test';
import path from 'path';

/**
 * Authenticated Test Fixtures
 *
 * Provides pre-authenticated page contexts for each user role.
 * Uses storage state from global setup to avoid rate limiting.
 *
 * Usage:
 * ```typescript
 * import { test } from '../fixtures/authenticated-fixtures';
 *
 * test('CLIENT test', async ({ authenticatedClientPage }) => {
 *   await authenticatedClientPage.goto('/client/profile');
 *   // Already authenticated as CLIENT
 * });
 * ```
 */

type AuthenticatedFixtures = {
  authenticatedClientPage: Page;
  authenticatedEmployeePage: Page;
  authenticatedAdminPage: Page;
};

export const test = base.extend<AuthenticatedFixtures>({
  authenticatedClientPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '../../.auth/client.json'),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  authenticatedEmployeePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '../../.auth/employee.json'),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  authenticatedAdminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '../../.auth/admin.json'),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
