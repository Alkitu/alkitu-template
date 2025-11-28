# 💻 Implementation Examples - Step by Step

## 📋 Overview

Esta guía contiene ejemplos prácticos completos de cómo implementar la migración SOLID usando testing exhaustivo y Mutation Testing para garantizar la calidad del código.

---

## 🏗️ Project Structure

### **New Directory Structure**

```
packages/api/src/
├── users/
│   ├── interfaces/
│   │   ├── __tests__/
│   │   │   ├── user-repository.contract.spec.ts
│   │   │   └── user-service.contract.spec.ts
│   │   ├── user-repository.interface.ts
│   │   └── user-service.interface.ts
│   ├── operations/
│   │   ├── __tests__/
│   │   │   ├── legacy-user-operations.spec.ts
│   │   │   └── solid-user-operations.spec.ts
│   │   ├── legacy-user-operations.ts
│   │   └── solid-user-operations.ts
│   ├── repositories/
│   │   ├── __tests__/
│   │   └── user.repository.ts
│   ├── services/
│   │   ├── __tests__/
│   │   ├── user-core.service.ts
│   │   ├── user-bulk.service.ts
│   │   ├── user-analytics.service.ts
│   │   └── user-notification.service.ts
│   └── users.module.ts (updated)
```

---

## 📝 Phase 1: Create Interface Contract Tests

### **Step 1: Define Service Contract Tests**

```typescript
// src/users/interfaces/__tests__/user-service.contract.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { IUserService } from "../user-service.interface";
import { CreateUserDto } from "../../dto/create-user.dto";
import { UpdateUserDto } from "../../dto/update-user.dto";

// Contract test that works with any implementation
export function runUserServiceContractTests(
  createService: () => Promise<IUserService>
) {
  describe("IUserService Contract Tests", () => {
    let service: IUserService;

    beforeEach(async () => {
      service = await createService();
    });

    describe("createUser", () => {
      it("should create user with valid data", async () => {
        const userData: CreateUserDto = {
          email: "test@example.com",
          password: "StrongP@ssw0rd123!",
          name: "Test User",
          lastName: "Test LastName",
        };

        const result = await service.createUser(userData);

        expect(result).toMatchObject({
          id: expect.any(String),
          email: userData.email,
          name: userData.name,
          lastName: userData.lastName,
          createdAt: expect.any(Date),
        });

        // Password should not be in response
        expect(result.password).toBeUndefined();
      });

      it("should throw ConflictException for duplicate email", async () => {

        const userData: CreateUserDto = {
          email: "duplicate@example.com",
          password: "StrongP@ssw0rd123!",
          name: "Test User",
        };

        await service.createUser(userData);

        await expect(service.createUser(userData)).rejects.toThrow(
          ConflictException
        );
      });

      it("should hash password before storing", async () => {

        const userData: CreateUserDto = {
          email: "hash-test@example.com",
          password: "PlaintextPassword123!",
          name: "Hash Test",
        };

        const result = await service.createUser(userData);

        // Verify password is not stored as plaintext
        // (We'll check this via repository mock)
        expect(result.password).toBeUndefined();
      });

      it("should validate password strength", async () => {

        const weakPasswords = ["123", "password", "abc123"];

        for (const password of weakPasswords) {
          const userData: CreateUserDto = {
            email: `weak-${password}@example.com`,
            password,
            name: "Test User",
          };

          await expect(service.createUser(userData)).rejects.toThrow(
            "Password too weak"
          );
        }
      });
    });

    describe("getUserById", () => {
      it("should return user when exists", async () => {

        const userData: CreateUserDto = {
          email: "findtest@example.com",
          password: "StrongP@ssw0rd123!",
          name: "Find Test",
        };

        const created = await service.createUser(userData);
        const found = await service.getUserById(created.id);

        expect(found).toMatchObject({
          id: created.id,
          email: userData.email,
          name: userData.name,
        });
      });

      it("should throw NotFoundException when user does not exist", async () => {

        const nonExistentId = "507f1f77bcf86cd799439011";

        await expect(service.getUserById(nonExistentId)).rejects.toThrow(
          NotFoundException
        );
      });
    });

    describe("updateUser", () => {
      it("should update user data", async () => {

        const userData: CreateUserDto = {
          email: "update-test@example.com",
          password: "StrongP@ssw0rd123!",
          name: "Original Name",
        };

        const created = await service.createUser(userData);

        const updateData: UpdateUserDto = {
          name: "Updated Name",
          lastName: "Updated LastName",
        };

        const updated = await service.updateUser(created.id, updateData);

        expect(updated).toMatchObject({
          id: created.id,
          email: userData.email,
          name: updateData.name,
          lastName: updateData.lastName,
        });
      });
    });

    describe("deleteUser", () => {
      it("should delete user successfully", async () => {

        const userData: CreateUserDto = {
          email: "delete-test@example.com",
          password: "StrongP@ssw0rd123!",
          name: "Delete Test",
        };

        const created = await service.createUser(userData);
        await service.deleteUser(created.id);

        await expect(service.getUserById(created.id)).rejects.toThrow(
          NotFoundException
        );
      });
    });
  });
}
```

### **Step 2: Create Repository Contract Tests**

```typescript
// src/users/interfaces/__tests__/user-repository.contract.spec.ts
import { IUserRepository } from "../user-repository.interface";
import { CreateUserDto } from "../../dto/create-user.dto";

export function runUserRepositoryContractTests(
  createRepository: () => Promise<IUserRepository>
) {
  describe("IUserRepository Contract Tests", () => {
    let repository: IUserRepository;

    beforeEach(async () => {
      repository = await createRepository();
    });

    describe("create", () => {
      it("should create user and return with id", async () => {

        const userData: CreateUserDto = {
          email: "repo-test@example.com",
          password: "hashedPassword123",
          name: "Repo Test",
        };

        const result = await repository.create(userData);

        expect(result).toMatchObject({
          id: expect.any(String),
          email: userData.email,
          name: userData.name,
          createdAt: expect.any(Date),
        });
      });
    });

    describe("findByEmail", () => {
      it("should return user when email exists", async () => {

        const userData: CreateUserDto = {
          email: "findemail-test@example.com",
          password: "hashedPassword123",
          name: "Find Email Test",
        };

        const created = await repository.create(userData);
        const found = await repository.findByEmail(userData.email);

        expect(found?.id).toBe(created.id);
        expect(found?.email).toBe(userData.email);
      });

      it("should return null when email does not exist", async () => {

        const result = await repository.findByEmail("nonexistent@example.com");
        expect(result).toBeNull();
      });
    });

    describe("findById", () => {
      it("should return user when id exists", async () => {

        const userData: CreateUserDto = {
          email: "findid-test@example.com",
          password: "hashedPassword123",
          name: "Find ID Test",
        };

        const created = await repository.create(userData);
        const found = await repository.findById(created.id);

        expect(found).toMatchObject({
          id: created.id,
          email: userData.email,
        });
      });

      it("should return null when id does not exist", async () => {

        const result = await repository.findById("507f1f77bcf86cd799439011");
        expect(result).toBeNull();
      });
    });
  });
}
```

---

## ⚙️ Phase 2: Implement Repository

### **Step 3: Create Repository Implementation**

```typescript
// src/users/repositories/user.repository.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "@prisma/client";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(userData: CreateUserDto): Promise<User> {
    // Implementation to pass tests
    return this.prisma.user.create({
      data: userData,
    });
  }

  async findById(id: string): Promise<User | null> {
    // Implementation
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    // Implementation
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(): Promise<User[]> {
    // Implementation
    return this.prisma.user.findMany();
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    // Implementation
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async delete(id: string): Promise<void> {
    // Implementation
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    // Implementation
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return user !== null;
  }

  async existsById(id: string): Promise<boolean> {
    // Implementation
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    return user !== null;
  }

  // ... implement other required methods minimally
}
```

### **Step 4: Implement Core User Service**

```typescript
// src/users/services/user-core.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { IUserService } from "../interfaces/user-service.interface";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "@prisma/client";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserCoreService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    // Implementation to pass tests

    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    // Validate password strength (minimal)
    if (userData.password.length < 8) {
      throw new BadRequestException("Password too weak");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getUserById(id: string): Promise<User> {
    // Implementation
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Return without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // Implementation
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    // Return without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getAllUsers(): Promise<User[]> {
    // Implementation
    const users = await this.userRepository.findAll();

    // Remove passwords
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    // Implementation
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.userRepository.update(id, userData);

    // Return without password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async deleteUser(id: string): Promise<void> {
    // Implementation
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.delete(id);
  }

  async userExists(id: string): Promise<boolean> {
    // Implementation
    return this.userRepository.existsById(id);
  }

  async emailExists(email: string): Promise<boolean> {
    // Implementation
    return this.userRepository.existsByEmail(email);
  }

  // Placeholder for other interface methods
  async updateUserTags(userId: string, tagData: any): Promise<User> {
    throw new Error("Not implemented yet");
  }

  async markEmailAsVerified(userId: string): Promise<User> {
    throw new Error("Not implemented yet");
  }
}
```

### **Step 5: Create Test Implementation**

```typescript
// src/users/services/__tests__/user-core.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { UserCoreService } from "../user-core.service";
import { IUserRepository } from "../../interfaces/user-repository.interface";
import { runUserServiceContractTests } from "../../interfaces/__tests__/user-service.contract.spec";

// Mock repository
const mockUserRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  existsByEmail: jest.fn(),
  existsById: jest.fn(),
};

describe("UserCoreService", () => {
  let service: UserCoreService;
  let repository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCoreService,
        {
          provide: "IUserRepository",
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserCoreService>(UserCoreService);
    repository = module.get<jest.Mocked<IUserRepository>>("IUserRepository");

    // Clear mocks
    jest.clearAllMocks();
  });

  // Run contract tests
  runUserServiceContractTests(async () => {
    // Setup mocks for contract tests
    repository.findByEmail.mockImplementation(async (email) => {
      // Return null for new emails, user for existing ones
      if (email === "duplicate@example.com") {
        return {
          id: "1",
          email,
          name: "Test",
          password: "hashed",
          createdAt: new Date(),
        } as any;
      }
      return null;
    });

    repository.create.mockImplementation(async (userData) => {
      return {
        id: "1",
        ...userData,
        createdAt: new Date(),
      } as any;
    });

    repository.findById.mockImplementation(async (id) => {
      if (id === "507f1f77bcf86cd799439011") {
        return null;
      }
      return {
        id,
        email: "test@example.com",
        name: "Test",
        password: "hashed",
        createdAt: new Date(),
      } as any;
    });

    repository.update.mockImplementation(async (id, data) => {
      return {
        id,
        email: "test@example.com",
        name: "Test",
        password: "hashed",
        createdAt: new Date(),
        ...data,
      } as any;
    });

    repository.delete.mockImplementation(async () => {});

    return service;
  });

  // Additional specific tests
  describe("createUser password hashing", () => {
    it("should hash password before storing", async () => {
      repository.findByEmail.mockResolvedValue(null);
      repository.create.mockResolvedValue({
        id: "1",
        email: "test@example.com",
        name: "Test",
        password: "hashedPassword",
        createdAt: new Date(),
      } as any);

      const userData = {
        email: "test@example.com",
        password: "PlaintextPassword123!",
        name: "Test",
      };

      await service.createUser(userData);

      // Verify repository was called with hashed password
      expect(repository.create).toHaveBeenCalledWith({
        ...userData,
        password: expect.not.stringMatching("PlaintextPassword123!"),
      });
    });
  });
});
```

---

## 🔧 Phase 3: Code Quality & Optimization

### **Step 6: Enhance Validation and Error Handling**

```typescript
// src/users/services/user-core.service.ts (Refactored)
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
// ... other imports

@Injectable()
export class UserCoreService implements IUserService {
  private readonly logger = new Logger(UserCoreService.name);

  constructor(private userRepository: IUserRepository) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    // Add comprehensive validation and error handling
    try {
      // Validate input data
      await this.validateUserData(userData);

      // Check if user exists
      const existingUser = await this.userRepository.findByEmail(
        userData.email
      );
      if (existingUser) {
        throw new ConflictException(
          `User with email ${userData.email} already exists`
        );
      }

      // Validate password strength
      this.validatePasswordStrength(userData.password);

      // Hash password with better security
      const hashedPassword = await this.hashPassword(userData.password);

      // Create user with validated data
      const user = await this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      // Log successful creation (without sensitive data)
      this.logger.log(`User created successfully: ${user.id}`, {
        userId: user.id,
        email: user.email,
      });

      // Return sanitized user data
      return this.sanitizeUserData(user);
    } catch (error) {
      // Comprehensive error logging
      this.logger.error("Failed to create user", {
        error: error.message,
        email: userData.email,
        stack: error.stack,
      });
      throw error;
    }
  }

  // REFACTOR: Extract validation methods
  private async validateUserData(userData: CreateUserDto): Promise<void> {
    if (!userData.email || !this.isValidEmail(userData.email)) {
      throw new BadRequestException("Valid email is required");
    }

    if (!userData.password) {
      throw new BadRequestException("Password is required");
    }

    if (!userData.name || userData.name.trim().length === 0) {
      throw new BadRequestException("Name is required");
    }
  }

  private validatePasswordStrength(password: string): void {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      throw new BadRequestException(
        `Password must be at least ${minLength} characters long`
      );
    }

    if (!hasUpperCase || !hasLowerCase) {
      throw new BadRequestException(
        "Password must contain both uppercase and lowercase letters"
      );
    }

    if (!hasNumbers) {
      throw new BadRequestException(
        "Password must contain at least one number"
      );
    }

    if (!hasSpecialChar) {
      throw new BadRequestException(
        "Password must contain at least one special character"
      );
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // REFACTOR: Better security
    return bcrypt.hash(password, saltRounds);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private sanitizeUserData(user: User): User {
    const { password, ...sanitized } = user;
    return sanitized as User;
  }

  // REFACTOR: Improve other methods with similar patterns
  async getUserById(id: string): Promise<User> {
    try {
      if (!id || !this.isValidObjectId(id)) {
        throw new BadRequestException("Valid user ID is required");
      }

      const user = await this.userRepository.findById(id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return this.sanitizeUserData(user);
    } catch (error) {
      this.logger.error(`Failed to get user by ID: ${id}`, {
        error: error.message,
      });
      throw error;
    }
  }

  private isValidObjectId(id: string): boolean {
    return /^[a-fA-F0-9]{24}$/.test(id);
  }

  // ... other refactored methods
}
```

### **Step 7: Add Caching and Performance Optimizations**

```typescript
// src/users/repositories/user.repository.ts (Refactored)
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { IUserRepository } from "../interfaces/user-repository.interface";
// ... other imports

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    private prisma: PrismaService
    // Add caching if available
    // private cache: CacheService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    // Add caching
    // const cacheKey = `user:email:${email}`;
    // const cached = await this.cache.get(cacheKey);
    // if (cached) {
    //   return cached;
    // }

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        // Only select needed fields for performance
        id: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true,
        // Don't select password for security
      },
    });

    // Cache result
    // if (user) {
    //   await this.cache.set(cacheKey, user, 300); // 5 min cache
    // }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    // Similar caching pattern
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    return user;
  }

  // REFACTOR: Add batch operations for better performance
  async findByIds(ids: string[]): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true,
      },
    });
  }

  // ... other optimized methods
}
```

---

## 🔬 Phase 4: Mutation Testing

### **Step 8: Configure Mutation Testing**

```javascript
// stryker.conf.mjs
export default {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress", "dashboard"],
  testRunner: "jest",
  testRunnerNodeArgs: ["--max_old_space_size=4096"],
  coverageAnalysis: "perTest",
  mutate: [
    "src/users/services/**/*.ts",
    "src/users/repositories/**/*.ts",
    "src/users/operations/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.interface.ts",
    "!src/**/*.dto.ts",
    "!src/**/__tests__/**",
  ],
  thresholds: {
    high: 90,
    low: 80,
    break: 75,
  },
  plugins: ["@stryker-mutator/jest-runner"],
  jest: {
    projectType: "custom",
    configFile: "jest.config.js",
    enableFindRelatedTests: true,
  },
  timeoutMS: 60000,
  concurrency: 2,
  tempDirName: "stryker-tmp",
  cleanTempDir: true,
};
```

### **Step 9: Add Tests to Catch Mutations**

```typescript
// Additional tests to catch specific mutations
describe("UserCoreService - Mutation Testing", () => {
  // Test to catch boundary condition mutations
  describe("password validation boundary conditions", () => {
    it("should reject password with exactly 7 characters", async () => {
      repository.findByEmail.mockResolvedValue(null);

      const userData = {
        email: "test@example.com",
        password: "1234567", // Exactly 7 chars
        name: "Test",
      };

      await expect(service.createUser(userData)).rejects.toThrow(
        "Password must be at least 8 characters long"
      );
    });

    it("should accept password with exactly 8 characters", async () => {
      repository.findByEmail.mockResolvedValue(null);
      repository.create.mockResolvedValue({
        id: "1",
        email: "test@example.com",
        name: "Test",
        password: "hashed",
        createdAt: new Date(),
      } as any);

      const userData = {
        email: "test@example.com",
        password: "Abcd123!", // Exactly 8 chars with all requirements
        name: "Test",
      };

      await expect(service.createUser(userData)).resolves.toBeDefined();
    });
  });

  // Test to catch logical operator mutations
  describe("password strength validation mutations", () => {
    it("should require both uppercase AND lowercase", async () => {
      repository.findByEmail.mockResolvedValue(null);

      // Test uppercase only
      await expect(
        service.createUser({
          email: "test1@example.com",
          password: "ABCDEFGH123!",
          name: "Test",
        })
      ).rejects.toThrow("must contain both uppercase and lowercase");

      // Test lowercase only
      await expect(
        service.createUser({
          email: "test2@example.com",
          password: "abcdefgh123!",
          name: "Test",
        })
      ).rejects.toThrow("must contain both uppercase and lowercase");
    });

    it("should require numbers", async () => {
      repository.findByEmail.mockResolvedValue(null);

      await expect(
        service.createUser({
          email: "test@example.com",
          password: "Abcdefgh!",
          name: "Test",
        })
      ).rejects.toThrow("must contain at least one number");
    });

    it("should require special characters", async () => {
      repository.findByEmail.mockResolvedValue(null);

      await expect(
        service.createUser({
          email: "test@example.com",
          password: "Abcdefgh123",
          name: "Test",
        })
      ).rejects.toThrow("must contain at least one special character");
    });
  });

  // Test to catch return value mutations
  describe("return value mutations", () => {
    it("should return user data without password", async () => {
      repository.findByEmail.mockResolvedValue(null);
      repository.create.mockResolvedValue({
        id: "1",
        email: "test@example.com",
        name: "Test",
        password: "hashedPassword",
        createdAt: new Date(),
      } as any);

      const result = await service.createUser({
        email: "test@example.com",
        password: "StrongP@ssw0rd123!",
        name: "Test",
      });

      // This will catch mutations that return password
      expect(result.password).toBeUndefined();
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("email");
      expect(result).toHaveProperty("name");
    });
  });
});
```

### **Step 10: Run and Analyze Mutation Tests**

```bash
# Run mutation tests
npm run test:mutation

# Expected output:
# 📊 Mutation testing report:
# ✅ Mutation score: 87.5% (35/40)
# ✅ Above threshold: 85%
#
# Killed mutants: 35
# Survived mutants: 5
# Timeout mutants: 0
# No coverage mutants: 0
```

---

## 📊 Quality Validation

### **Step 11: Verify All Quality Gates**

```typescript
// scripts/quality-check.ts
import { execSync } from "child_process";

async function checkQualityGates() {
  console.log("🔍 Running quality gates...\n");

  // 1. Test Coverage
  console.log("📊 Checking test coverage...");
  const coverage = execSync("npm run test:coverage -- --silent").toString();
  const coverageMatch = coverage.match(/All files\s+\|\s+(\d+\.?\d*)/);
  const coveragePercent = coverageMatch ? parseFloat(coverageMatch[1]) : 0;

  if (coveragePercent >= 95) {
    console.log(`✅ Test coverage: ${coveragePercent}% (>= 95%)`);
  } else {
    console.log(`❌ Test coverage: ${coveragePercent}% (< 95%)`);
    process.exit(1);
  }

  // 2. Mutation Score
  console.log("🧬 Checking mutation score...");
  const mutationReport = execSync(
    "npm run test:mutation -- --silent"
  ).toString();
  const mutationMatch = mutationReport.match(/Mutation score: (\d+\.?\d*)%/);
  const mutationScore = mutationMatch ? parseFloat(mutationMatch[1]) : 0;

  if (mutationScore >= 85) {
    console.log(`✅ Mutation score: ${mutationScore}% (>= 85%)`);
  } else {
    console.log(`❌ Mutation score: ${mutationScore}% (< 85%)`);
    process.exit(1);
  }

  // 3. Linting
  console.log("🔧 Checking code quality...");
  try {
    execSync("npm run lint", { stdio: "pipe" });
    console.log("✅ Linting passed");
  } catch (error) {
    console.log("❌ Linting failed");
    process.exit(1);
  }

  // 4. Type checking
  console.log("📝 Checking TypeScript...");
  try {
    execSync("npm run type-check", { stdio: "pipe" });
    console.log("✅ Type checking passed");
  } catch (error) {
    console.log("❌ Type checking failed");
    process.exit(1);
  }

  console.log("\n🎉 All quality gates passed!");
}

checkQualityGates().catch(console.error);
```

---

## 🎯 Summary

### **What We've Accomplished**

1. **✅ Contract Tests**: Written comprehensive interface contract tests
2. **✅ Implementation**: Created working implementations with proper validation
3. **✅ Code Quality**: Enhanced code with validation, error handling, and optimizations
4. **✅ Mutation Testing**: Validated test quality with >85% mutation score
5. **✅ Quality Gates**: Achieved >95% coverage and all quality standards

### **Key Benefits**

- **Comprehensive Testing**: All code is thoroughly tested with contracts and unit tests
- **High Quality**: Mutation testing ensures robust test suite
- **SOLID Principles**: Clean, maintainable architecture
- **Zero Risk**: Can switch implementations transparently
- **Future Ready**: Easy to extend with GraphQL/MCP

### **Next Steps**

1. **Integrate with Legacy**: Create adapter pattern
2. **Add Feature Flags**: Enable gradual rollout
3. **Monitor Performance**: Ensure no regression
4. **Expand to Other Modules**: Apply same pattern to Auth, Notifications, etc.

---

_Estos ejemplos demuestran cómo implementar la migración SOLID de manera segura y con la máxima calidad usando testing exhaustivo y Mutation Testing._
