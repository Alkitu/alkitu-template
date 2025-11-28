// @ts-nocheck
// 
// ✅ USER FACTORY: Generate test user data for mutation testing
// packages/api/src/test/factories/user.factory.ts

import { UserRole, UserStatus } from '@prisma/client';

// Simplified interface that matches what's actually used in tests
interface UserResponseData {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  contactNumber: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date | null;
}

// Full Prisma User interface for complex mocks
interface FullUserData {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  contactNumber: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: Date | null;
  image: string | null;
  password: string;
  terms: boolean;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  groupIds: string[];
  tagIds: string[];
  resourceIds: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}

export class UserFactory {
  // Create UserResponse for repository responses
  static create(overrides: Partial<UserResponseData> = {}): UserResponseData {
    const defaultUser: UserResponseData = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      email: `test${Math.random().toString(36).substr(2, 6)}@example.com`,
      name: 'Test',
      lastName: 'User',
      contactNumber: '+1234567890',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      ...overrides,
    };

    return defaultUser;
  }

  static createMany(
    count: number,
    overrides: Partial<UserResponseData> = {},
  ): UserResponseData[] {
    return Array.from({ length: count }, (_, index) =>
      UserFactory.create({
        ...overrides,
        id: `user-batch-${index}-${Math.random().toString(36).substr(2, 6)}`,
        email: `user${index}@example.com`,
      }),
    );
  }

  static createAdmin(
    overrides: Partial<UserResponseData> = {},
  ): UserResponseData {
    return UserFactory.create({
      role: 'ADMIN',
      name: 'Admin',
      lastName: 'User',
      ...overrides,
    });
  }

  // Create full Prisma User for findByEmail mocks that expect User model
  static createFullUser(overrides: Partial<FullUserData> = {}): FullUserData {
    return {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      email: `test${Math.random().toString(36).substr(2, 6)}@example.com`,
      name: 'Test',
      lastName: 'User',
      contactNumber: '+1234567890',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      emailVerified: null,
      image: null,
      password: 'hashedPassword123',
      terms: true,
      isTwoFactorEnabled: false,
      groupIds: [],
      tagIds: [],
      resourceIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      ...overrides,
    };
  }
}
