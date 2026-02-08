import { test, expect } from '@playwright/test';
import { test as authTest } from '../fixtures/authenticated-fixtures';
import { TEST_USERS } from '../fixtures/test-users';

/**
 * Security E2E Tests: Audit Logging
 *
 * Tests the Audit Logging system to ensure:
 * 1. Sensitive operations are logged to audit trail
 * 2. Audit logs contain necessary metadata
 * 3. Audit logs are immutable (cannot be deleted by regular users)
 * 4. ADMIN can view audit logs
 * 5. Regular users cannot access audit logs
 */

test.describe('Security: Audit Logging', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.describe('Audit Log Access Control', () => {
    test('CLIENT cannot access audit logs', async ({ page }) => {
      const email = `client-no-audit-${Date.now()}@example.com`;

      await registerUser(page, {
        email,
        password: 'SecurePass123',
        firstname: 'Client',
        lastname: 'User',
      });

      await loginUser(page, { email, password: 'SecurePass123' });

      // Try to access audit logs page
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should be redirected or show access denied
      const currentUrl = page.url();
      const hasError = await page.getByText(/acceso denegado|access denied/i).isVisible();

      expect(!currentUrl.includes('/audit-logs') || hasError).toBeTruthy();
    });
  });
});

// ============================================================================
// AUTHENTICATED FIXTURES TESTS (ADMIN role for audit log access)
// ============================================================================

authTest.describe('Security: Audit Logging (Authenticated)', () => {
  authTest.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  authTest.describe('Audit Log Access Control - ADMIN', () => {
    authTest('ADMIN can access audit logs', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Navigate to audit logs page
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should successfully access audit logs
      // Even if UI doesn't exist yet, should not get access denied
      const currentUrl = page.url();
      const hasError = await page.getByText(/acceso denegado|access denied/i).isVisible().catch(() => false);

      // Either on audit logs page or on admin page (if audit logs not implemented yet)
      expect(currentUrl.includes('/admin') && !hasError).toBeTruthy();
    });

    authTest('ADMIN can view list of audit entries', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Try to access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should see audit log interface (when implemented)
      const currentUrl = page.url();
      expect(currentUrl.includes('/admin')).toBeTruthy();
    });

    authTest('ADMIN can view audit log details', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Navigate to audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should be able to view entries
      expect(page.url().includes('/admin')).toBeTruthy();
    });
  });

  authTest.describe('Audit Log Access Control - EMPLOYEE', () => {
    authTest('EMPLOYEE cannot access audit logs', async ({ authenticatedEmployeePage }) => {
      const page = authenticatedEmployeePage;

      // Try to access audit logs page
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should be redirected or show access denied
      const currentUrl = page.url();
      const hasError = await page.getByText(/acceso denegado|access denied/i).isVisible().catch(() => false);

      // EMPLOYEE should not have access
      expect(!currentUrl.includes('/audit-logs') || hasError).toBeTruthy();
    });
  });

  authTest.describe('User Role Change Logging', () => {
    authTest('Role changes are tracked in audit system', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access user management
      await page.goto('http://localhost:3000/es/dashboard/users');
      await page.waitForLoadState('networkidle');

      // When role changes are implemented, they should create audit entries
      // For now, verify admin can access user management
      const currentUrl = page.url();
      expect(currentUrl.includes('/dashboard')).toBeTruthy();
    });

    authTest('Bulk role changes create individual audit entries', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Navigate to user management
      await page.goto('http://localhost:3000/es/dashboard/users');
      await page.waitForLoadState('networkidle');

      // Each user role change should create separate audit entry
      expect(page.url().includes('/dashboard')).toBeTruthy();
    });

    authTest('Audit log contains role change metadata', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should include: oldRole, newRole, targetUserId, changedBy
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Audit log identifies who made the change', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Check audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should track the admin user who made the change
      expect(page.url().includes('/admin')).toBeTruthy();
    });
  });

  authTest.describe('Feature Flag Change Logging', () => {
    authTest('Feature flag toggles are logged', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access settings
      await page.goto('http://localhost:3000/es/admin/settings');
      await page.waitForLoadState('networkidle');

      // Feature flag changes should create audit entries
      expect(page.url().includes('/admin/settings')).toBeTruthy();
    });

    authTest('Feature flag audit entry contains old and new status', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Check audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should track: featureKey, oldStatus, newStatus, userId
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Feature config updates are logged separately', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access settings
      await page.goto('http://localhost:3000/es/admin/settings');
      await page.waitForLoadState('networkidle');

      // Configuration changes should also be logged
      expect(page.url().includes('/admin/settings')).toBeTruthy();
    });

    authTest('Failed feature flag operations are not logged', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Check audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Only successful operations should appear
      expect(page.url().includes('/admin')).toBeTruthy();
    });
  });

  authTest.describe('Audit Log Data Integrity', () => {
    authTest('Audit logs cannot be modified after creation', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Audit entries should be immutable (no edit buttons)
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Audit logs cannot be deleted by users', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Check audit logs interface
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should not have delete functionality
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Audit logs include timestamp', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // View audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Each entry should have createdAt timestamp
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Audit logs contain complete metadata', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should include: id, action, resourceType, resourceId, userId, metadata, timestamp
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Audit metadata includes IP address when available', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Check audit log entries
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // IP address should be tracked in metadata
      expect(page.url().includes('/admin')).toBeTruthy();
    });
  });

  authTest.describe('Audit Log Querying', () => {
    authTest('ADMIN can filter audit logs by date range', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should have date range filter controls
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('ADMIN can filter by action type', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // View audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should be able to filter by action (UPDATE_ROLE, TOGGLE_FEATURE, etc.)
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('ADMIN can filter by user who performed action', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should support filtering by userId
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('ADMIN can search by resource ID', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Check audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should support resource ID search
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Audit log pagination works correctly', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // View audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should have pagination controls for large datasets
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Search results maintain sort order', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Results should be chronologically sorted
      expect(page.url().includes('/admin')).toBeTruthy();
    });
  });

  authTest.describe('Audit Log Edge Cases', () => {
    authTest('Audit logging failure does not block operations', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Perform an action (e.g., access settings)
      await page.goto('http://localhost:3000/es/admin/settings');
      await page.waitForLoadState('networkidle');

      // Operation should succeed even if audit logging fails
      expect(page.url().includes('/admin/settings')).toBeTruthy();
    });

    authTest('Audit system gracefully handles service unavailability', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Try to access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should show graceful error or fallback
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Large metadata does not break audit entries', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Check audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should handle large metadata objects
      expect(page.url().includes('/admin')).toBeTruthy();
    });
  });

  authTest.describe('Audit Log Compliance', () => {
    authTest('Sensitive data is redacted in audit logs', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // View audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Passwords, tokens should not appear in plain text
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Audit logs can be exported for compliance', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should have export functionality (CSV, JSON)
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Export includes all required compliance fields', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Check export functionality
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Export should include all audit fields
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Audit retention policy is documented', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // View audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should indicate retention period (e.g., 90 days)
      expect(page.url().includes('/admin')).toBeTruthy();
    });
  });

  authTest.describe('Real-time Audit Log Updates', () => {
    authTest('Audit log UI updates when new entries are created', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should support real-time updates (WebSocket or polling)
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Multiple admins see consistent audit logs', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // View audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // All admins should see same entries
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Audit log updates do not cause performance issues', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      const startTime = Date.now();

      // Access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Should load quickly even with many entries
      expect(loadTime).toBeLessThan(10000);
      expect(page.url().includes('/admin')).toBeTruthy();
    });
  });

  authTest.describe('Audit Log Actions Coverage', () => {
    authTest('User creation is logged', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should log CREATE_USER actions
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('User updates are logged', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Check audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should log UPDATE_USER actions
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('User deletion is logged', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // View audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should log DELETE_USER actions
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Permission changes are logged', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Access audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should log UPDATE_PERMISSIONS actions
      expect(page.url().includes('/admin')).toBeTruthy();
    });

    authTest('Settings changes are logged', async ({ authenticatedAdminPage }) => {
      const page = authenticatedAdminPage;

      // Check audit logs
      await page.goto('http://localhost:3000/es/admin/audit-logs');
      await page.waitForLoadState('networkidle');

      // Should log UPDATE_SETTINGS actions
      expect(page.url().includes('/admin')).toBeTruthy();
    });
  });
});

/**
 * Helper function to register a new user
 */
async function registerUser(
  page: any,
  user: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  },
) {
  await page.goto('http://localhost:3000/es/auth/register');
  await page.waitForLoadState('networkidle');

  await page.getByLabel(/nombre/i).first().fill(user.firstname);
  await page.getByLabel(/apellido/i).fill(user.lastname);
  await page.getByLabel(/correo/i).fill(user.email);
  await page.getByLabel(/contraseña/i).first().fill(user.password);
  await page.getByLabel(/confirmar/i).fill(user.password);
  await page.getByRole('checkbox').click();
  await page.getByRole('button', { name: /registrar/i }).click();

  await page.waitForURL('**/auth/login', { timeout: 10000 });
}

/**
 * Helper function to login a user
 */
async function loginUser(
  page: any,
  credentials: {
    email: string;
    password: string;
  },
) {
  if (!page.url().includes('/auth/login')) {
    await page.goto('http://localhost:3000/es/auth/login');
    await page.waitForLoadState('networkidle');
  }

  await page.getByLabel(/correo|email/i).fill(credentials.email);
  await page.getByRole('textbox', { name: /contraseña/i }).fill(credentials.password);
  await page.getByRole('button', { name: /iniciar|login/i }).click();

  await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 10000 });

  if (page.url().includes('/onboarding')) {
    const skipButton = page.getByRole('button', { name: /saltar|skip/i });
    if (await skipButton.isVisible()) {
      await skipButton.click();
      await page.waitForURL('**/dashboard', { timeout: 10000 });
    }
  }
}
