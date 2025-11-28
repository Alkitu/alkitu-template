// @ts-nocheck
// 
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

export interface SOLIDTestContract {
  singleResponsibility(): Promise<void>;
  openClosed(): Promise<void>;
  liskovSubstitution(): Promise<void>;
  interfaceSegregation(): Promise<void>;
  dependencyInversion(): Promise<void>;
}

export interface SOLIDValidationResult {
  principle: string;
  passed: boolean;
  violations: string[];
}

export class SOLIDTestUtils {
  static async createTestingModule(providers: any[]): Promise<TestingModule> {
    return await Test.createTestingModule({
      providers,
    }).compile();
  }

  static async validateSOLIDCompliance(
    service: any,
    tests: SOLIDTestContract
  ): Promise<SOLIDValidationResult[]> {
    const results: SOLIDValidationResult[] = [];

    try {
      await tests.singleResponsibility();
      results.push({
        principle: "Single Responsibility",
        passed: true,
        violations: [],
      });
    } catch (error) {
      results.push({
        principle: "Single Responsibility",
        passed: false,
        violations: [error.message],
      });
    }

    try {
      await tests.openClosed();
      results.push({
        principle: "Open/Closed",
        passed: true,
        violations: [],
      });
    } catch (error) {
      results.push({
        principle: "Open/Closed",
        passed: false,
        violations: [error.message],
      });
    }

    try {
      await tests.liskovSubstitution();
      results.push({
        principle: "Liskov Substitution",
        passed: true,
        violations: [],
      });
    } catch (error) {
      results.push({
        principle: "Liskov Substitution",
        passed: false,
        violations: [error.message],
      });
    }

    try {
      await tests.interfaceSegregation();
      results.push({
        principle: "Interface Segregation",
        passed: true,
        violations: [],
      });
    } catch (error) {
      results.push({
        principle: "Interface Segregation",
        passed: false,
        violations: [error.message],
      });
    }

    try {
      await tests.dependencyInversion();
      results.push({
        principle: "Dependency Inversion",
        passed: true,
        violations: [],
      });
    } catch (error) {
      results.push({
        principle: "Dependency Inversion",
        passed: false,
        violations: [error.message],
      });
    }

    return results;
  }

  static expectSOLIDCompliance(results: SOLIDValidationResult[]): void {
    const violations = results.filter((result) => !result.passed);

    if (violations.length > 0) {
      const violationMessages = violations
        .map((v) => `${v.principle}: ${v.violations.join(", ")}`)
        .join("\n");

      throw new Error(
        `SOLID principle violations detected:\n${violationMessages}`
      );
    }
  }

  static createMockRepository<T>(entity: string): jest.Mocked<T> {
    return {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
      findFirst: jest.fn(),
      findFirstOrThrow: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      createMany: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
      upsert: jest.fn(),
    } as any;
  }

  static createMockService<T>(methods: string[]): jest.Mocked<T> {
    const mock = {} as any;
    methods.forEach((method) => {
      mock[method] = jest.fn();
    });
    return mock;
  }

  static async testSingleResponsibility(
    service: any,
    expectedResponsibilities: string[]
  ): Promise<void> {
    const serviceMethods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(service)
    ).filter(
      (method) =>
        method !== "constructor" && typeof service[method] === "function"
    );

    // Check if service has more responsibilities than expected
    const actualResponsibilities = serviceMethods.length;
    const maxAllowedResponsibilities = expectedResponsibilities.length;

    if (actualResponsibilities > maxAllowedResponsibilities * 1.5) {
      throw new Error(
        `Service has too many responsibilities (${actualResponsibilities}). Expected around ${maxAllowedResponsibilities}`
      );
    }
  }

  static async testOpenClosed(
    baseService: any,
    extensionTest: () => Promise<boolean>
  ): Promise<void> {
    // Test that service can be extended without modification
    const canExtend = await extensionTest();
    if (!canExtend) {
      throw new Error(
        "Service violates Open/Closed principle - cannot be extended without modification"
      );
    }
  }

  static async testLiskovSubstitution(
    baseInterface: any,
    implementation: any,
    testCases: (() => Promise<boolean>)[]
  ): Promise<void> {
    // Test that implementation can substitute the base interface
    for (const testCase of testCases) {
      const result = await testCase();
      if (!result) {
        throw new Error(
          "Implementation violates Liskov Substitution principle"
        );
      }
    }
  }

  static async testInterfaceSegregation(
    service: any,
    interfaceDefinitions: string[][]
  ): Promise<void> {
    // Test that service doesn't depend on methods it doesn't use
    const serviceMethods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(service)
    ).filter(
      (method) =>
        method !== "constructor" && typeof service[method] === "function"
    );

    for (const interfaceDef of interfaceDefinitions) {
      const unusedMethods = interfaceDef.filter(
        (method) => !serviceMethods.includes(method)
      );
      if (unusedMethods.length > 0) {
        throw new Error(
          `Service depends on unused interface methods: ${unusedMethods.join(", ")}`
        );
      }
    }
  }

  static async testDependencyInversion(
    service: any,
    dependencies: any[]
  ): Promise<void> {
    // Test that service depends on abstractions, not concretions
    for (const dependency of dependencies) {
      if (
        !dependency.constructor.name.includes("Mock") &&
        !dependency.constructor.name.includes("Interface") &&
        !dependency.constructor.name.includes("Abstract")
      ) {
        throw new Error(
          `Service depends on concrete implementation: ${dependency.constructor.name}`
        );
      }
    }
  }
}

export const mockTestingModule = {
  get: jest.fn(),
  select: jest.fn(),
  close: jest.fn(),
  init: jest.fn(),
};

export const createMockApp = (): Partial<INestApplication> => ({
  listen: jest.fn(),
  close: jest.fn(),
  init: jest.fn(),
  get: jest.fn(),
  select: jest.fn(),
  use: jest.fn(),
  setGlobalPrefix: jest.fn(),
  useGlobalPipes: jest.fn(),
  useGlobalFilters: jest.fn(),
  useGlobalInterceptors: jest.fn(),
  useGlobalGuards: jest.fn(),
});
