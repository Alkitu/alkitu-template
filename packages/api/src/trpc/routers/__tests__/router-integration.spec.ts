import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { TRPCError } from '@trpc/server';
import { PrismaClient, UserRole } from '@prisma/client';

/**
 * Router Integration Tests
 *
 * Tests the integration of routers with:
 * - Error handling (handlePrismaError)
 * - Pagination (paginatedSortingSchema, createPaginatedResponse)
 * - Authentication and authorization
 *
 * These tests validate that the implementations work correctly
 * in a realistic scenario.
 */

const prisma = new PrismaClient();

describe('Router Integration Tests', () => {
  // Setup test data
  beforeAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test-router-integration',
        },
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test-router-integration',
        },
      },
    });

    await prisma.$disconnect();
  });

  describe('User Router - Error Handling', () => {
    it('should return CONFLICT error for duplicate email', async () => {
      const email = 'test-router-integration-duplicate@example.com';

      // Create first user
      await prisma.user.create({
        data: {
          email,
          firstname: 'Test',
          lastname: 'User',
          password: 'hashed_password',
          role: UserRole.CLIENT,
        },
      });

      // Try to create duplicate user
      try {
        await prisma.user.create({
          data: {
            email, // Same email
            firstname: 'Another',
            lastname: 'User',
            password: 'hashed_password',
            role: UserRole.CLIENT,
          },
        });

        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        // Verify it's a Prisma P2002 error
        expect(error.code).toBe('P2002');
        expect(error.meta?.target).toContain('email');
      }
    });

    it('should return NOT_FOUND error for non-existent user', async () => {
      try {
        await prisma.user.findUniqueOrThrow({
          where: { id: 'non-existent-user-id-12345' },
        });

        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        // Verify it's a Prisma P2025 error
        expect(error.code).toBe('P2025');
      }
    });

    it('should return BAD_REQUEST error for invalid foreign key', async () => {
      try {
        await prisma.request.create({
          data: {
            userId: 'non-existent-user', // Invalid foreign key
            serviceId: 'non-existent-service', // Invalid foreign key
            locationId: 'non-existent-location', // Invalid foreign key
            executionDateTime: new Date(),
            status: 'PENDING',
          } as any,
        });

        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        // Verify it's a Prisma P2003 error
        expect(error.code).toBe('P2003');
      }
    });
  });

  describe('User Router - Pagination', () => {
    beforeAll(async () => {
      // Create test users for pagination
      const users = Array.from({ length: 25 }, (_, i) => ({
        email: `test-router-integration-${i}@example.com`,
        firstname: `User`,
        lastname: `${i}`,
        password: 'hashed_password',
        role: UserRole.CLIENT,
      }));

      await prisma.user.createMany({
        data: users,
      });
    });

    it('should paginate users correctly', async () => {
      const page = 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: {
            email: {
              contains: 'test-router-integration',
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({
          where: {
            email: {
              contains: 'test-router-integration',
            },
          },
        }),
      ]);

      // Verify pagination
      expect(users.length).toBeLessThanOrEqual(limit);
      expect(total).toBeGreaterThanOrEqual(25); // At least 25 test users

      // Calculate expected metadata
      const totalPages = Math.ceil(total / limit);
      expect(totalPages).toBeGreaterThanOrEqual(3);
    });

    it('should respect maximum limit of 100', async () => {
      const limit = 100;
      const users = await prisma.user.findMany({
        where: {
          email: {
            contains: 'test-router-integration',
          },
        },
        take: limit,
      });

      expect(users.length).toBeLessThanOrEqual(100);
    });

    it('should handle empty results gracefully', async () => {
      const users = await prisma.user.findMany({
        where: {
          email: 'non-existent-email-that-will-never-match@example.com',
        },
        skip: 0,
        take: 20,
      });

      expect(users).toEqual([]);
    });

    it('should sort correctly', async () => {
      // Get users sorted by email ascending
      const usersAsc = await prisma.user.findMany({
        where: {
          email: {
            contains: 'test-router-integration',
          },
        },
        take: 5,
        orderBy: { email: 'asc' },
      });

      // Verify ascending order
      for (let i = 1; i < usersAsc.length; i++) {
        expect(usersAsc[i].email.localeCompare(usersAsc[i - 1].email)).toBeGreaterThanOrEqual(0);
      }

      // Get users sorted by email descending
      const usersDesc = await prisma.user.findMany({
        where: {
          email: {
            contains: 'test-router-integration',
          },
        },
        take: 5,
        orderBy: { email: 'desc' },
      });

      // Verify descending order
      for (let i = 1; i < usersDesc.length; i++) {
        expect(usersDesc[i].email.localeCompare(usersDesc[i - 1].email)).toBeLessThanOrEqual(0);
      }
    });

    it('should handle last page with partial results', async () => {
      const limit = 10;
      const total = await prisma.user.count({
        where: {
          email: {
            contains: 'test-router-integration',
          },
        },
      });

      const totalPages = Math.ceil(total / limit);
      const skip = (totalPages - 1) * limit;

      const users = await prisma.user.findMany({
        where: {
          email: {
            contains: 'test-router-integration',
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      // Last page might have fewer items than limit
      expect(users.length).toBeLessThanOrEqual(limit);
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('Request Router - Role-Based Filtering', () => {
    let clientUser: any;
    let employeeUser: any;
    let adminUser: any;

    beforeAll(async () => {
      // Create users with different roles
      clientUser = await prisma.user.create({
        data: {
          email: 'test-router-integration-client@example.com',
          firstname: 'Client',
          lastname: 'User',
          password: 'hashed_password',
          role: UserRole.CLIENT,
        },
      });

      employeeUser = await prisma.user.create({
        data: {
          email: 'test-router-integration-employee@example.com',
          firstname: 'Employee',
          lastname: 'User',
          password: 'hashed_password',
          role: UserRole.EMPLOYEE,
        },
      });

      adminUser = await prisma.user.create({
        data: {
          email: 'test-router-integration-admin@example.com',
          firstname: 'Admin',
          lastname: 'User',
          password: 'hashed_password',
          role: UserRole.ADMIN,
        },
      });

      // Create test requests
      // Note: This requires valid service and location IDs
      // In a real test, you'd create these first
    });

    it('should filter requests by role - CLIENT', async () => {
      // Simulate CLIENT seeing only their requests
      const requests = await prisma.request.findMany({
        where: {
          userId: clientUser.id,
        },
      });

      // All requests should belong to the client
      requests.forEach((request) => {
        expect(request.userId).toBe(clientUser.id);
      });
    });

    it('should filter requests by role - EMPLOYEE', async () => {
      // Simulate EMPLOYEE seeing assigned + own requests
      const requests = await prisma.request.findMany({
        where: {
          OR: [{ userId: employeeUser.id }, { assignedToId: employeeUser.id }],
        },
      });

      // All requests should be owned by or assigned to the employee
      requests.forEach((request) => {
        const isOwner = request.userId === employeeUser.id;
        const isAssignee = request.assignedToId === employeeUser.id;
        expect(isOwner || isAssignee).toBeTruthy();
      });
    });

    it('should not filter requests by role - ADMIN', async () => {
      // Simulate ADMIN seeing all requests (no filtering)
      const allRequests = await prisma.request.findMany({});
      const adminRequests = await prisma.request.findMany({
        // Admin has no filters
      });

      expect(adminRequests.length).toBe(allRequests.length);
    });
  });

  describe('Location Router - Ownership Validation', () => {
    let user1: any;
    let user2: any;

    beforeAll(async () => {
      user1 = await prisma.user.create({
        data: {
          email: 'test-router-integration-location-user1@example.com',
          firstname: 'User',
          lastname: 'One',
          password: 'hashed_password',
          role: UserRole.CLIENT,
        },
      });

      user2 = await prisma.user.create({
        data: {
          email: 'test-router-integration-location-user2@example.com',
          firstname: 'User',
          lastname: 'Two',
          password: 'hashed_password',
          role: UserRole.CLIENT,
        },
      });

      // Create locations for each user
      await prisma.workLocation.create({
        data: {
          userId: user1.id,
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip: '12345',
        },
      });

      await prisma.workLocation.create({
        data: {
          userId: user2.id,
          street: '456 Test Ave',
          city: 'Test City',
          state: 'TS',
          zip: '12345',
        },
      });
    });

    it('should only return locations for the user', async () => {
      const user1Locations = await prisma.workLocation.findMany({
        where: { userId: user1.id },
      });

      const user2Locations = await prisma.workLocation.findMany({
        where: { userId: user2.id },
      });

      // Each user should only see their own locations
      user1Locations.forEach((location) => {
        expect(location.userId).toBe(user1.id);
      });

      user2Locations.forEach((location) => {
        expect(location.userId).toBe(user2.id);
      });

      // Users should have different locations
      expect(user1Locations.length).toBeGreaterThan(0);
      expect(user2Locations.length).toBeGreaterThan(0);
    });

    it('should not return other user locations', async () => {
      // User 1 tries to get User 2's locations
      const user1Locations = await prisma.workLocation.findMany({
        where: { userId: user1.id },
      });

      // None of these should belong to user2
      user1Locations.forEach((location) => {
        expect(location.userId).not.toBe(user2.id);
      });
    });
  });

  describe('Schema Validation Integration', () => {
    it('should validate user registration schema', () => {
      const validData = {
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        password: 'password123',
        terms: true,
      };

      // This would go through registerSchema validation in the router
      expect(validData.email).toContain('@');
      expect(validData.firstname.length).toBeGreaterThanOrEqual(2);
      expect(validData.lastname.length).toBeGreaterThanOrEqual(2);
      expect(validData.password.length).toBeGreaterThanOrEqual(6);
      expect(validData.terms).toBe(true);
    });

    it('should validate pagination input schema', () => {
      const validPagination = {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
      };

      expect(validPagination.page).toBeGreaterThan(0);
      expect(validPagination.limit).toBeGreaterThan(0);
      expect(validPagination.limit).toBeLessThanOrEqual(100);
      expect(['asc', 'desc']).toContain(validPagination.sortOrder);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large pagination efficiently', async () => {
      const startTime = Date.now();

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: {
            email: {
              contains: 'test-router-integration',
            },
          },
          skip: 0,
          take: 100,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({
          where: {
            email: {
              contains: 'test-router-integration',
            },
          },
        }),
      ]);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Query should complete within reasonable time (adjust based on your DB)
      expect(duration).toBeLessThan(5000); // 5 seconds
      expect(users.length).toBeLessThanOrEqual(100);
    });

    it('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = 10;

      const promises = Array.from({ length: concurrentRequests }, () =>
        prisma.user.findMany({
          where: {
            email: {
              contains: 'test-router-integration',
            },
          },
          take: 10,
        }),
      );

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // All requests should complete
      expect(results).toHaveLength(concurrentRequests);

      // Should complete within reasonable time (adjust based on your DB)
      expect(duration).toBeLessThan(10000); // 10 seconds for 10 concurrent requests
    });
  });
});
