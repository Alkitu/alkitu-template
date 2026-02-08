import { test, expect, Page } from '@playwright/test';
import { loginAsAdmin, loginAsEmployee, loginAsClient } from '../global-setup';

/**
 * Security Tests - Authentication & Authorization
 *
 * Tests the security improvements implemented to fix critical vulnerabilities:
 * 1. protectedProcedure now requires authentication
 * 2. Billing endpoints require auth + ownership validation
 * 3. Request router has role-based access control
 * 4. Location router has ownership validation
 * 5. User admin operations require ADMIN role
 */

test.describe('Security: Authentication & Authorization', () => {
  test.describe('Unauthenticated Access', () => {
    test('should reject unauthenticated access to billing records', async ({
      request,
    }) => {
      // Try to access billing without authentication
      const response = await request.post(
        '/api/trpc/billing.getBillingRecords',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { userId: 'any-user-id' },
        },
      );

      // Should return 401 UNAUTHORIZED
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.error).toBeDefined();
      expect(body.error.message).toContain('Authentication required');
    });

    test('should reject unauthenticated access to user list', async ({
      request,
    }) => {
      const response = await request.post('/api/trpc/user.getAllUsers', {
        headers: { 'Content-Type': 'application/json' },
        data: {},
      });

      expect(response.status()).toBe(401);
    });

    test('should reject unauthenticated access to requests', async ({
      request,
    }) => {
      const response = await request.post(
        '/api/trpc/request.getFilteredRequests',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { page: 1, limit: 20 },
        },
      );

      expect(response.status()).toBe(401);
    });

    test('should reject unauthenticated access to locations', async ({
      request,
    }) => {
      const response = await request.post(
        '/api/trpc/location.getAllLocations',
        {
          headers: { 'Content-Type': 'application/json' },
          data: {},
        },
      );

      expect(response.status()).toBe(401);
    });

    test('should reject unauthenticated access to services', async ({
      request,
    }) => {
      const response = await request.post('/api/trpc/service.getAllServices', {
        headers: { 'Content-Type': 'application/json' },
        data: {},
      });

      expect(response.status()).toBe(401);
    });

    test('should reject unauthenticated access to notifications', async ({
      request,
    }) => {
      const response = await request.post(
        '/api/trpc/notification.getNotifications',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { userId: 'any-user-id' },
        },
      );

      expect(response.status()).toBe(401);
    });
  });

  test.describe('Billing Access Control', () => {
    let clientPage: Page;
    let adminPage: Page;
    let clientUserId: string;
    let otherUserId: string;

    test.beforeAll(async ({ browser }) => {
      // Setup authenticated pages
      const clientContext = await browser.newContext();
      clientPage = await clientContext.newPage();
      await loginAsClient(clientPage);

      const adminContext = await browser.newContext();
      adminPage = await adminContext.newPage();
      await loginAsAdmin(adminPage);

      // Get user IDs from auth state
      const clientAuth = await clientPage.evaluate(() =>
        localStorage.getItem('auth'),
      );
      clientUserId = JSON.parse(clientAuth || '{}').userId;

      // Create another user for testing
      otherUserId = 'other-user-id-for-testing';
    });

    test('CLIENT cannot access billing records of another user', async () => {
      const response = await clientPage.request.post(
        '/api/trpc/billing.getBillingRecords',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { userId: otherUserId },
        },
      );

      expect(response.status()).toBe(403);

      const body = await response.json();
      expect(body.error).toBeDefined();
      expect(body.error.message).toContain(
        'Cannot access billing records of another user',
      );
    });

    test('CLIENT can access their own billing records', async () => {
      const response = await clientPage.request.post(
        '/api/trpc/billing.getBillingRecords',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { userId: clientUserId },
        },
      );

      // Should succeed (200 or 404 if no records exist)
      expect([200, 404]).toContain(response.status());
    });

    test('ADMIN can access any user billing records', async () => {
      const response = await adminPage.request.post(
        '/api/trpc/billing.getBillingRecords',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { userId: otherUserId },
        },
      );

      // Should succeed
      expect([200, 404]).toContain(response.status());
    });

    test('Only ADMIN can create billing records', async () => {
      // Client attempt
      const clientResponse = await clientPage.request.post(
        '/api/trpc/billing.createBillingRecord',
        {
          headers: { 'Content-Type': 'application/json' },
          data: {
            userId: clientUserId,
            plan: 'Basic',
            status: 'ACTIVE',
            amount: 29.99,
            currency: 'USD',
            startDate: new Date().toISOString(),
          },
        },
      );

      expect(clientResponse.status()).toBe(403);

      // Admin attempt
      const adminResponse = await adminPage.request.post(
        '/api/trpc/billing.createBillingRecord',
        {
          headers: { 'Content-Type': 'application/json' },
          data: {
            userId: clientUserId,
            plan: 'Basic',
            status: 'ACTIVE',
            amount: 29.99,
            currency: 'USD',
            startDate: new Date().toISOString(),
          },
        },
      );

      expect(adminResponse.status()).toBe(200);
    });

    test('Only ADMIN can delete billing records', async () => {
      const billingId = 'test-billing-id';

      // Client attempt
      const clientResponse = await clientPage.request.post(
        '/api/trpc/billing.deleteBillingRecord',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { id: billingId },
        },
      );

      expect(clientResponse.status()).toBe(403);
    });
  });

  test.describe('Request Access Control', () => {
    let clientPage: Page;
    let employeePage: Page;
    let adminPage: Page;

    test.beforeAll(async ({ browser }) => {
      const clientContext = await browser.newContext();
      clientPage = await clientContext.newPage();
      await loginAsClient(clientPage);

      const employeeContext = await browser.newContext();
      employeePage = await employeeContext.newPage();
      await loginAsEmployee(employeePage);

      const adminContext = await browser.newContext();
      adminPage = await adminContext.newPage();
      await loginAsAdmin(adminPage);
    });

    test('CLIENT only sees their own requests', async () => {
      const response = await clientPage.request.post(
        '/api/trpc/request.getFilteredRequests',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { page: 1, limit: 20 },
        },
      );

      expect(response.status()).toBe(200);

      const body = await response.json();
      const requests = body.result?.data?.requests || [];

      // Get current user ID
      const authState = await clientPage.evaluate(() =>
        localStorage.getItem('auth'),
      );
      const userId = JSON.parse(authState || '{}').userId;

      // All requests should belong to this user
      for (const request of requests) {
        expect(request.userId).toBe(userId);
      }
    });

    test('EMPLOYEE sees assigned requests + own requests', async () => {
      const response = await employeePage.request.post(
        '/api/trpc/request.getFilteredRequests',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { page: 1, limit: 20 },
        },
      );

      expect(response.status()).toBe(200);

      const body = await response.json();
      const requests = body.result?.data?.requests || [];

      // Get current user ID
      const authState = await employeePage.evaluate(() =>
        localStorage.getItem('auth'),
      );
      const userId = JSON.parse(authState || '{}').userId;

      // Requests should be either owned by user OR assigned to user
      for (const request of requests) {
        const isOwner = request.userId === userId;
        const isAssignee = request.assignedToId === userId;
        expect(isOwner || isAssignee).toBeTruthy();
      }
    });

    test('ADMIN sees all requests', async () => {
      const response = await adminPage.request.post(
        '/api/trpc/request.getFilteredRequests',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { page: 1, limit: 20 },
        },
      );

      expect(response.status()).toBe(200);
      // Admin can see requests from any user (no filtering)
    });

    test('CLIENT cannot create request for another user', async () => {
      const response = await clientPage.request.post(
        '/api/trpc/request.createRequest',
        {
          headers: { 'Content-Type': 'application/json' },
          data: {
            userId: 'other-user-id',
            serviceId: 'service-id',
            locationId: 'location-id',
            executionDateTime: new Date().toISOString(),
          },
        },
      );

      expect(response.status()).toBe(403);
      const body = await response.json();
      expect(body.error.message).toContain(
        'Cannot create request for another user',
      );
    });

    test('Only ADMIN can delete requests', async () => {
      const requestId = 'test-request-id';

      // Employee attempt
      const employeeResponse = await employeePage.request.post(
        '/api/trpc/request.deleteRequest',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { id: requestId },
        },
      );

      expect(employeeResponse.status()).toBe(403);

      // Client attempt
      const clientResponse = await clientPage.request.post(
        '/api/trpc/request.deleteRequest',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { id: requestId },
        },
      );

      expect(clientResponse.status()).toBe(403);
    });
  });

  test.describe('Location Access Control', () => {
    let clientPage: Page;
    let adminPage: Page;

    test.beforeAll(async ({ browser }) => {
      const clientContext = await browser.newContext();
      clientPage = await clientContext.newPage();
      await loginAsClient(clientPage);

      const adminContext = await browser.newContext();
      adminPage = await adminContext.newPage();
      await loginAsAdmin(adminPage);
    });

    test('CLIENT only sees their own locations', async () => {
      const response = await clientPage.request.post(
        '/api/trpc/location.getAllLocations',
        {
          headers: { 'Content-Type': 'application/json' },
          data: {},
        },
      );

      expect(response.status()).toBe(200);

      const body = await response.json();
      const locations = body.result?.data?.items || [];

      // Get current user ID
      const authState = await clientPage.evaluate(() =>
        localStorage.getItem('auth'),
      );
      const userId = JSON.parse(authState || '{}').userId;

      // All locations should belong to this user
      for (const location of locations) {
        expect(location.userId).toBe(userId);
      }
    });

    test('CLIENT cannot access another user locations', async () => {
      const response = await clientPage.request.post(
        '/api/trpc/location.getUserLocations',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { userId: 'other-user-id' },
        },
      );

      expect(response.status()).toBe(403);
      const body = await response.json();
      expect(body.error.message).toContain(
        'Cannot access locations of another user',
      );
    });

    test('ADMIN can access any user locations', async () => {
      const response = await adminPage.request.post(
        '/api/trpc/location.getUserLocations',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { userId: 'any-user-id' },
        },
      );

      // Should succeed (200 or 404 if no locations)
      expect([200, 404]).toContain(response.status());
    });
  });

  test.describe('User Admin Operations', () => {
    let clientPage: Page;
    let employeePage: Page;
    let adminPage: Page;

    test.beforeAll(async ({ browser }) => {
      const clientContext = await browser.newContext();
      clientPage = await clientContext.newPage();
      await loginAsClient(clientPage);

      const employeeContext = await browser.newContext();
      employeePage = await employeeContext.newPage();
      await loginAsEmployee(employeePage);

      const adminContext = await browser.newContext();
      adminPage = await adminContext.newPage();
      await loginAsAdmin(adminPage);
    });

    test('Only ADMIN can access getAllUsers', async () => {
      // Client attempt
      const clientResponse = await clientPage.request.post(
        '/api/trpc/user.getAllUsers',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { page: 1, limit: 20 },
        },
      );
      expect(clientResponse.status()).toBe(403);

      // Employee attempt
      const employeeResponse = await employeePage.request.post(
        '/api/trpc/user.getAllUsers',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { page: 1, limit: 20 },
        },
      );
      expect(employeeResponse.status()).toBe(403);

      // Admin attempt
      const adminResponse = await adminPage.request.post(
        '/api/trpc/user.getAllUsers',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { page: 1, limit: 20 },
        },
      );
      expect(adminResponse.status()).toBe(200);
    });

    test('Only ADMIN can perform bulk delete users', async () => {
      const userIds = ['user1', 'user2'];

      // Client attempt
      const clientResponse = await clientPage.request.post(
        '/api/trpc/user.bulkDeleteUsers',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { userIds },
        },
      );
      expect(clientResponse.status()).toBe(403);

      // Employee attempt
      const employeeResponse = await employeePage.request.post(
        '/api/trpc/user.bulkDeleteUsers',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { userIds },
        },
      );
      expect(employeeResponse.status()).toBe(403);
    });

    test('Only ADMIN can perform bulk update role', async () => {
      const data = { userIds: ['user1'], role: 'EMPLOYEE' };

      // Client attempt
      const clientResponse = await clientPage.request.post(
        '/api/trpc/user.bulkUpdateRole',
        {
          headers: { 'Content-Type': 'application/json' },
          data,
        },
      );
      expect(clientResponse.status()).toBe(403);

      // Employee attempt
      const employeeResponse = await employeePage.request.post(
        '/api/trpc/user.bulkUpdateRole',
        {
          headers: { 'Content-Type': 'application/json' },
          data,
        },
      );
      expect(employeeResponse.status()).toBe(403);
    });

    test('Only ADMIN can reset user passwords', async () => {
      const data = { userId: 'user-id', sendEmail: true };

      // Client attempt
      const clientResponse = await clientPage.request.post(
        '/api/trpc/user.resetUserPassword',
        {
          headers: { 'Content-Type': 'application/json' },
          data,
        },
      );
      expect(clientResponse.status()).toBe(403);

      // Employee attempt
      const employeeResponse = await employeePage.request.post(
        '/api/trpc/user.resetUserPassword',
        {
          headers: { 'Content-Type': 'application/json' },
          data,
        },
      );
      expect(employeeResponse.status()).toBe(403);
    });

    test('Only ADMIN can create impersonation tokens', async () => {
      const data = { adminId: 'admin-id', targetUserId: 'user-id' };

      // Client attempt
      const clientResponse = await clientPage.request.post(
        '/api/trpc/user.createImpersonationToken',
        {
          headers: { 'Content-Type': 'application/json' },
          data,
        },
      );
      expect(clientResponse.status()).toBe(403);

      // Employee attempt
      const employeeResponse = await employeePage.request.post(
        '/api/trpc/user.createImpersonationToken',
        {
          headers: { 'Content-Type': 'application/json' },
          data,
        },
      );
      expect(employeeResponse.status()).toBe(403);
    });

    test('USER can only update their own profile', async () => {
      // Get current user ID
      const authState = await clientPage.evaluate(() =>
        localStorage.getItem('auth'),
      );
      const userId = JSON.parse(authState || '{}').userId;

      // Try to update own profile - should succeed
      const ownProfileResponse = await clientPage.request.post(
        '/api/trpc/user.updateProfile',
        {
          headers: { 'Content-Type': 'application/json' },
          data: {
            id: userId,
            firstname: 'Updated',
            lastname: 'Name',
          },
        },
      );
      expect([200, 404]).toContain(ownProfileResponse.status());

      // Try to update another user's profile - should fail
      const otherProfileResponse = await clientPage.request.post(
        '/api/trpc/user.updateProfile',
        {
          headers: { 'Content-Type': 'application/json' },
          data: {
            id: 'other-user-id',
            firstname: 'Hacked',
            lastname: 'User',
          },
        },
      );
      expect(otherProfileResponse.status()).toBe(403);
      const body = await otherProfileResponse.json();
      expect(body.error.message).toContain(
        'Cannot update profile of another user',
      );
    });
  });

  test.describe('Notification Access Control', () => {
    let clientPage: Page;

    test.beforeAll(async ({ browser }) => {
      const clientContext = await browser.newContext();
      clientPage = await clientContext.newPage();
      await loginAsClient(clientPage);
    });

    test('All notification endpoints require authentication', async () => {
      const authState = await clientPage.evaluate(() =>
        localStorage.getItem('auth'),
      );
      const userId = JSON.parse(authState || '{}').userId;

      // Test protected notification endpoint
      const response = await clientPage.request.post(
        '/api/trpc/notification.getNotifications',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { userId },
        },
      );

      // Should succeed if authenticated
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Service Access Control', () => {
    let clientPage: Page;

    test.beforeAll(async ({ browser }) => {
      const clientContext = await browser.newContext();
      clientPage = await clientContext.newPage();
      await loginAsClient(clientPage);
    });

    test('Service endpoints require authentication', async () => {
      const response = await clientPage.request.post(
        '/api/trpc/service.getAllServices',
        {
          headers: { 'Content-Type': 'application/json' },
          data: { page: 1, limit: 20 },
        },
      );

      // Should succeed if authenticated
      expect(response.status()).toBe(200);
    });
  });
});
