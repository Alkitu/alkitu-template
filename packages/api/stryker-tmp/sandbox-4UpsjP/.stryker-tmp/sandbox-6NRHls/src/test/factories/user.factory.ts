// @ts-nocheck
// 
// ✅ Test Factory: User Model Factory
// packages/api/src/test/factories/user.factory.ts

import { User, UserRole, UserStatus } from '@prisma/client';

export class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    const defaultUser: User = {
      id: '507f1f77bcf86cd799439011',
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      emailVerified: null,
      image: null,
      password: 'hashed-password',
      contactNumber: '+1234567890',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      terms: true,
      isTwoFactorEnabled: false,
      groupIds: [],
      tagIds: [],
      resourceIds: [],
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      lastLogin: new Date('2024-01-01T00:00:00.000Z'),
      ...overrides,
    };

    return defaultUser;
  }

  static createMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, (_, index) =>
      this.create({
        id: `507f1f77bcf86cd79943901${index}`,
        email: `user${index}@example.com`,
        name: `User${index}`,
        ...overrides,
      }),
    );
  }

  static createAdmin(overrides: Partial<User> = {}): User {
    return this.create({
      role: UserRole.ADMIN,
      email: 'admin@example.com',
      name: 'Admin',
      lastName: 'User',
      ...overrides,
    });
  }

  static createEmployee(overrides: Partial<User> = {}): User {
    return this.create({
      role: UserRole.EMPLOYEE,
      email: 'employee@example.com',
      name: 'Employee',
      lastName: 'User',
      ...overrides,
    });
  }

  static createClient(overrides: Partial<User> = {}): User {
    return this.create({
      role: UserRole.CLIENT,
      email: 'client@example.com',
      name: 'Client',
      lastName: 'User',
      ...overrides,
    });
  }

  static createSuspended(overrides: Partial<User> = {}): User {
    return this.create({
      status: UserStatus.SUSPENDED,
      email: 'suspended@example.com',
      name: 'Suspended',
      lastName: 'User',
      ...overrides,
    });
  }

  static createVerified(overrides: Partial<User> = {}): User {
    return this.create({
      emailVerified: new Date('2024-01-01T00:00:00.000Z'),
      email: 'verified@example.com',
      name: 'Verified',
      lastName: 'User',
      ...overrides,
    });
  }

  static createUnverified(overrides: Partial<User> = {}): User {
    return this.create({
      emailVerified: null,
      email: 'unverified@example.com',
      name: 'Unverified',
      lastName: 'User',
      ...overrides,
    });
  }
}

// Export common user instances for tests
export const testUsers = {
  john: UserFactory.create(),
  admin: UserFactory.createAdmin(),
  employee: UserFactory.createEmployee(),
  client: UserFactory.createClient(),
  suspended: UserFactory.createSuspended(),
  verified: UserFactory.createVerified(),
  unverified: UserFactory.createUnverified(),
};
