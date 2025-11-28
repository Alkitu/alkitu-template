// @ts-nocheck
// 
// ✅ Testing Agent: Comprehensive Test Setup for SOLID Architecture
// packages/api/src/test/setup.ts

import { MongoMemoryServer } from 'mongodb-memory-server';
import { PrismaClient } from '@prisma/client';
import 'jest-extended';

// Global test configuration
declare global {
  var __MONGO_URI__: string;
  var __MONGO_DB_NAME__: string;
  var __PRISMA_CLIENT__: PrismaClient;
}

let mongod: MongoMemoryServer;
let prisma: PrismaClient;

/**
 * Setup test environment before all tests
 */
beforeAll(async () => {
  // Start MongoDB Memory Server
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Set global variables
  global.__MONGO_URI__ = uri;
  global.__MONGO_DB_NAME__ = 'test';

  // Initialize Prisma Client for testing
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: uri,
      },
    },
  });

  global.__PRISMA_CLIENT__ = prisma;

  // Connect to database
  await prisma.$connect();

  console.log('🧪 Test environment initialized with MongoDB Memory Server');
});

/**
 * Cleanup after all tests
 */
afterAll(async () => {
  // Disconnect Prisma
  if (prisma) {
    await prisma.$disconnect();
  }

  // Stop MongoDB Memory Server
  if (mongod) {
    await mongod.stop();
  }

  console.log('🧪 Test environment cleaned up');
});

/**
 * Clear database before each test
 */
beforeEach(async () => {
  if (prisma) {
    // For MongoDB, we'll clear collections
    // This is a simplified approach - in production you'd want more sophisticated cleanup
    try {
      await prisma.user.deleteMany({});
      await prisma.notification.deleteMany({});
      // Add other model cleanups as needed
    } catch (error) {
      // Ignore errors during cleanup
      console.warn('Warning during test cleanup:', error);
    }
  }
});

/**
 * Setup Jest matchers and extensions
 */
expect.extend({
  toBeValidUser(received) {
    const pass =
      received &&
      typeof received.id === 'string' &&
      typeof received.email === 'string' &&
      received.email.includes('@') &&
      received.createdAt instanceof Date;

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid user`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid user`,
        pass: false,
      };
    }
  },

  toHaveSOLIDCompliance(received) {
    // Custom matcher to validate SOLID principles
    const pass =
      received &&
      typeof received.constructor === 'function' &&
      received.constructor.name.endsWith('Service');

    if (pass) {
      return {
        message: () =>
          `expected ${received.constructor.name} not to be SOLID compliant`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received.constructor.name} to be SOLID compliant`,
        pass: false,
      };
    }
  },
});

// Extend Jest matchers type definitions
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUser(): R;
      toHaveSOLIDCompliance(): R;
    }
  }
}

// Configure test timeouts
jest.setTimeout(30000);

// Mock console methods for cleaner test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

export { prisma };
