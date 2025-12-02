/**
 * Test user fixtures for E2E tests
 * These users should be seeded in the database before running E2E tests
 * Run: npm run seed:test-users (in packages/api)
 */

export const TEST_USERS = {
  CLIENT: {
    email: 'client-e2e@alkitu.test',
    password: 'ClientPass123',
    firstname: 'Client',
    lastname: 'User',
    role: 'CLIENT' as const,
  },
  EMPLOYEE: {
    email: 'employee-e2e@alkitu.test',
    password: 'EmployeePass123',
    firstname: 'Employee',
    lastname: 'User',
    role: 'EMPLOYEE' as const,
  },
  ADMIN: {
    email: 'admin-e2e@alkitu.test',
    password: 'Admin123!',
    firstname: 'Admin',
    lastname: 'User',
    role: 'ADMIN' as const,
  },
  // Additional test users for specific test suites
  LOCATION_TESTER: {
    email: 'location-test@alkitu.test',
    password: 'LocationTest123',
    firstname: 'Location',
    lastname: 'Tester',
    role: 'CLIENT' as const,
  },
  CATALOG_ADMIN: {
    email: 'catalog-admin@alkitu.test',
    password: 'CatalogAdmin123',
    firstname: 'Catalog',
    lastname: 'Admin',
    role: 'ADMIN' as const,
  },
  REQUEST_CLIENT: {
    email: 'request-client@alkitu.test',
    password: 'RequestClient123',
    firstname: 'Request',
    lastname: 'Client',
    role: 'CLIENT' as const,
  },
  REQUEST_EMPLOYEE: {
    email: 'request-employee@alkitu.test',
    password: 'RequestEmployee123',
    firstname: 'Request',
    lastname: 'Employee',
    role: 'EMPLOYEE' as const,
  },
  REQUEST_ADMIN: {
    email: 'request-admin@alkitu.test',
    password: 'RequestAdmin123',
    firstname: 'Request',
    lastname: 'Admin',
    role: 'ADMIN' as const,
  },
} as const;

export type TestUserKey = keyof typeof TEST_USERS;
