// @ts-nocheck
// 
// ✅ Testing Agent: SOLID Principles Test Utilities
// packages/api/src/test/utils/solid-test-utils.ts

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { NotificationService } from '../../notification/notification.service';

/**
 * SOLID Principles Test Utilities
 * Provides testing helpers for validating SOLID compliance
 */
export class SOLIDTestUtils {
  /**
   * Validates Single Responsibility Principle (SRP)
   * Each service should have only one reason to change
   */
  static validateSRP(
    serviceClass: any,
    expectedResponsibility: string,
  ): boolean {
    const methods = Object.getOwnPropertyNames(serviceClass.prototype);
    const publicMethods = methods.filter(
      (method) => !method.startsWith('_') && method !== 'constructor',
    );

    // Check if all methods are related to the same responsibility
    const responsibilityKeywords = expectedResponsibility
      .toLowerCase()
      .split(' ');
    const relevantMethods = publicMethods.filter((method) =>
      responsibilityKeywords.some((keyword) =>
        method.toLowerCase().includes(keyword),
      ),
    );

    // At least 80% of methods should be related to the main responsibility
    return relevantMethods.length >= publicMethods.length * 0.8;
  }

  /**
   * Validates Open/Closed Principle (OCP)
   * Services should be open for extension, closed for modification
   */
  static validateOCP(serviceClass: any): boolean {
    // Check if service uses dependency injection (constructor parameters)
    const constructorParams =
      Reflect.getMetadata('design:paramtypes', serviceClass) || [];

    // Check if service has extensible patterns (interfaces, abstract methods)
    const hasInterfaces = constructorParams.length > 0;
    const hasExtensibleMethods = Object.getOwnPropertyNames(
      serviceClass.prototype,
    ).some(
      (method) => method.includes('Strategy') || method.includes('Handler'),
    );

    return hasInterfaces || hasExtensibleMethods;
  }

  /**
   * Validates Liskov Substitution Principle (LSP)
   * Derived classes must be substitutable for their base classes
   */
  static validateLSP(implementationClass: any, interfaceClass: any): boolean {
    const implementationMethods = Object.getOwnPropertyNames(
      implementationClass.prototype,
    );
    const interfaceMethods = Object.getOwnPropertyNames(
      interfaceClass.prototype,
    );

    // Check if implementation has all interface methods
    return interfaceMethods.every(
      (method) =>
        implementationMethods.includes(method) || method === 'constructor',
    );
  }

  /**
   * Validates Interface Segregation Principle (ISP)
   * Clients should not be forced to depend on interfaces they don't use
   */
  static validateISP(
    interfaceClass: any,
    expectedMethodCount: number,
  ): boolean {
    const methods = Object.getOwnPropertyNames(interfaceClass.prototype);
    const publicMethods = methods.filter(
      (method) => !method.startsWith('_') && method !== 'constructor',
    );

    // Interface should have a focused set of methods (not too many)
    return publicMethods.length <= expectedMethodCount;
  }

  /**
   * Validates Dependency Inversion Principle (DIP)
   * High-level modules should not depend on low-level modules
   */
  static validateDIP(serviceClass: any): boolean {
    const constructorParams =
      Reflect.getMetadata('design:paramtypes', serviceClass) || [];

    // Check if dependencies are injected through constructor
    // and if they are likely interfaces/abstractions (not concrete classes)
    return (
      constructorParams.length > 0 &&
      constructorParams.some(
        (param: any) =>
          param.name.startsWith('I') || param.name.includes('Service'),
      )
    );
  }

  /**
   * Creates a comprehensive SOLID compliance report
   */
  static generateSOLIDReport(
    serviceClass: any,
    interfaceClass?: any,
  ): SOLIDReport {
    const className = serviceClass.name;

    return {
      className,
      srp: {
        compliant: this.validateSRP(
          serviceClass,
          className.replace('Service', ''),
        ),
        description: 'Single Responsibility Principle - One reason to change',
      },
      ocp: {
        compliant: this.validateOCP(serviceClass),
        description:
          'Open/Closed Principle - Open for extension, closed for modification',
      },
      lsp: {
        compliant: interfaceClass
          ? this.validateLSP(serviceClass, interfaceClass)
          : true,
        description:
          'Liskov Substitution Principle - Substitutable implementations',
      },
      isp: {
        compliant: interfaceClass ? this.validateISP(interfaceClass, 10) : true,
        description: 'Interface Segregation Principle - Focused interfaces',
      },
      dip: {
        compliant: this.validateDIP(serviceClass),
        description: 'Dependency Inversion Principle - Depend on abstractions',
      },
    };
  }
}

/**
 * SOLID Compliance Report Interface
 */
export interface SOLIDReport {
  className: string;
  srp: SOLIDPrincipleResult;
  ocp: SOLIDPrincipleResult;
  lsp: SOLIDPrincipleResult;
  isp: SOLIDPrincipleResult;
  dip: SOLIDPrincipleResult;
}

export interface SOLIDPrincipleResult {
  compliant: boolean;
  description: string;
}

/**
 * Mock Factory for SOLID Services
 */
export class SOLIDMockFactory {
  /**
   * Creates a mock Prisma service for testing
   */
  static createMockPrismaService(): any {
    return {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        deleteMany: jest.fn(),
      },
      notification: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $queryRaw: jest.fn(),
    };
  }

  /**
   * Creates a mock Notification service for testing
   */
  static createMockNotificationService(): any {
    return {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      sendNotification: jest.fn(),
    };
  }

  /**
   * Creates a testing module with common mocks
   */
  static async createTestingModule(providers: any[]): Promise<TestingModule> {
    return Test.createTestingModule({
      providers: [
        ...providers,
        {
          provide: PrismaService,
          useValue: this.createMockPrismaService(),
        },
        {
          provide: NotificationService,
          useValue: this.createMockNotificationService(),
        },
      ],
    }).compile();
  }
}

/**
 * Test Data Factory for consistent test data
 */
export class TestDataFactory {
  /**
   * Creates a test user object
   */
  static createTestUser(overrides: Partial<any> = {}): any {
    return {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test',
      lastName: 'User',
      password: 'hashed-password',
      role: 'CLIENT',
      status: 'ACTIVE',
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      contactNumber: '+1234567890',
      terms: true,
      isTwoFactorEnabled: false,
      groupIds: [],
      tagIds: [],
      resourceIds: [],
      image: null,
      ...overrides,
    };
  }

  /**
   * Creates a test CreateUserDto
   */
  static createTestUserDto(overrides: Partial<any> = {}): any {
    return {
      email: 'test@example.com',
      name: 'Test',
      lastName: 'User',
      password: 'password123',
      contactNumber: '+1234567890',
      terms: true,
      ...overrides,
    };
  }

  /**
   * Creates a test login dto
   */
  static createTestLoginDto(overrides: Partial<any> = {}): any {
    return {
      email: 'test@example.com',
      password: 'password123',
      ...overrides,
    };
  }

  /**
   * Creates test filter dto
   */
  static createTestFilterDto(overrides: Partial<any> = {}): any {
    return {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...overrides,
    };
  }
}

/**
 * Performance Testing Utilities
 */
export class PerformanceTestUtils {
  /**
   * Measures execution time of a function
   */
  static async measureExecutionTime<T>(
    fn: () => Promise<T>,
  ): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();

    return {
      result,
      duration: end - start,
    };
  }

  /**
   * Validates that a function executes within expected time
   */
  static async validatePerformance<T>(
    fn: () => Promise<T>,
    maxDurationMs: number,
  ): Promise<{ passed: boolean; duration: number; result: T }> {
    const { result, duration } = await this.measureExecutionTime(fn);

    return {
      passed: duration <= maxDurationMs,
      duration,
      result,
    };
  }
}
