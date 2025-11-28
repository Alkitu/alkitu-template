// @ts-nocheck
// 
// ✅ USER FACTORY: Generate test user data for mutation testing
// packages/api/src/test/factories/user.factory.ts

import { UserRole, UserStatus } from '@prisma/client';

interface UserData {
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
  twoFactorSecret: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}

export class UserFactory {
  static create(overrides: Partial<UserData> = {}): UserData {
    const defaultUser: UserData = {
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
      twoFactorSecret: null,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      ...overrides,
    };

    return defaultUser;
  }

  static createMany(
    count: number,
    overrides: Partial<UserData> = {},
  ): UserData[] {
    return Array.from({ length: count }, (_, index) =>
      UserFactory.create({
        ...overrides,
        id: `user-batch-${index}-${Math.random().toString(36).substr(2, 6)}`,
        email: `user${index}@example.com`,
      }),
    );
  }

  static createAdmin(overrides: Partial<UserData> = {}): UserData {
    return UserFactory.create({
      role: UserRole.ADMIN,
      name: 'Admin',
      lastName: 'User',
      ...overrides,
    });
  }

  static createSuspendedUser(overrides: Partial<UserData> = {}): UserData {
    return UserFactory.create({
      status: UserStatus.SUSPENDED,
      name: 'Suspended',
      lastName: 'User',
      ...overrides,
    });
  }
}
