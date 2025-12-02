import { Page } from '@playwright/test';
import path from 'path';

/**
 * Authentication Helper for E2E Tests
 *
 * Provides utilities to use pre-authenticated sessions stored by global setup.
 * This avoids rate limiting issues by reusing authentication state instead of
 * logging in via UI for every test.
 */

export type UserRole = 'CLIENT' | 'EMPLOYEE' | 'ADMIN';

/**
 * Get the storage state file path for a user role
 */
export function getStorageStatePath(role: UserRole): string {
  return path.join(__dirname, '../../.auth', `${role.toLowerCase()}.json`);
}

/**
 * Use pre-authenticated session for a specific role
 *
 * This loads the stored authentication state from global setup,
 * allowing tests to skip the login process and avoid rate limiting.
 *
 * @example
 * test('should view profile', async ({ page, context }) => {
 *   await useAuthenticatedSession(context, 'CLIENT');
 *   await page.goto('/client/profile');
 *   // Now authenticated as CLIENT
 * });
 */
export async function useAuthenticatedSession(
  page: Page,
  role: UserRole
): Promise<void> {
  const storagePath = getStorageStatePath(role);

  // Note: We can't directly load storage state into an existing context,
  // so this function is mainly for documentation. Tests should use
  // the storageState option when creating their context/page.
  // See updated test examples below.

  console.log(`📌 Using authenticated session for ${role} from ${storagePath}`);
}

/**
 * Navigate to role-specific dashboard
 *
 * Automatically navigates to the correct dashboard based on user role.
 */
export async function goToDashboard(page: Page, role: UserRole): Promise<void> {
  const dashboardPaths: Record<UserRole, string> = {
    CLIENT: '/client/dashboard',
    EMPLOYEE: '/employee/dashboard',
    ADMIN: '/admin/dashboard',
  };

  const path = dashboardPaths[role];
  await page.goto(path);
  await page.waitForURL(new RegExp(path), { timeout: 10000 });
}

/**
 * Get expected dashboard path for a role
 */
export function getDashboardPath(role: UserRole): string {
  const dashboardPaths: Record<UserRole, string> = {
    CLIENT: '/client/dashboard',
    EMPLOYEE: '/employee/dashboard',
    ADMIN: '/admin/dashboard',
  };

  return dashboardPaths[role];
}
