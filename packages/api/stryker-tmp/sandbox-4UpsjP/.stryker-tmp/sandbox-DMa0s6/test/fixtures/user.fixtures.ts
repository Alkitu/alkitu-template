// @ts-nocheck
// 
import { User, UserRole, UserStatus } from "@prisma/client";

// Mock user data for testing
export const mockUser: User = {
  id: '1',
  name: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  emailVerified: new Date(),
  image: 'https://example.com/avatar.jpg',
  password: 'hashedPassword123',
  contactNumber: '+1234567890',
  role: 'USER' as UserRole,
  status: 'ACTIVE' as UserStatus,
  terms: true,
  privacy: true,
  emailSubscription: true,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockAdminUser: User = {
  ...mockUser,
  id: "admin-user-id",
  email: "admin@example.com",
  role: UserRole.ADMIN,
  lastName: "User",
};

export const mockModeratorUser: User = {
  ...mockUser,
  id: "moderator-user-id",
  email: "moderator@example.com",
  role: UserRole.MODERATOR,
  lastName: "User",
};

export const mockInactiveUser: User = {
  ...mockUser,
  id: "inactive-user-id",
  email: "inactive@example.com",
  status: UserStatus.SUSPENDED,
  lastName: "User",
};

export const mockSuspendedUser: User = {
  ...mockUser,
  id: "suspended-user-id",
  email: "suspended@example.com",
  status: UserStatus.SUSPENDED,
  lastName: "User",
};

export const mockUnverifiedUser: User = {
  ...mockUser,
  id: "unverified-user-id",
  email: "unverified@example.com",
  emailVerified: null,
  lastName: "User",
};

// User creation utilities
export function createUserFixture(overrides: Partial<User> = {}): User {
  return {
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    name: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    emailVerified: null,
    image: 'https://example.com/default.jpg',
    password: 'hashedPassword',
    contactNumber: '+1234567890',
    role: 'USER' as UserRole,
    status: 'ACTIVE' as UserStatus,
    terms: true,
    privacy: true,
    emailSubscription: false,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Auth-specific fixtures
export function createAuthUserFixture(overrides: Partial<User> = {}): User {
  return createUserFixture({
    ...overrides,
    emailVerified: new Date(),
    status: UserStatus.ACTIVE,
    password: "$2b$10$validhashedpassword",
  });
}

export function createJWTPayloadFixture(user: User = mockUser) {
  return {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
  };
}

// Minimal user fixtures for specific test scenarios
export function createMinimalUserFixture(): Partial<User> {
  return {
    id: "minimal-user-id",
    email: "minimal@example.com",
    lastName: "User",
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
  };
}

export function createUserWithoutOptionalFields(): User {
  return {
    id: "basic-user-id",
    email: "basic@example.com",
    password: "$2b$10$hashedpassword",
    lastName: "User",
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    emailVerified: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Factory pattern user creation
export class UserFixtureFactory {
  static create(
    role: UserRole = UserRole.USER,
    overrides: Partial<User> = {}
  ): User {
    switch (role) {
      case UserRole.ADMIN:
        return createAdminFixture(overrides);
      case UserRole.MODERATOR:
        return createModeratorFixture(overrides);
      default:
        return createUserFixture({ ...overrides, role });
    }
  }

  static createByStatus(status: UserStatus, overrides: Partial<User> = {}): User {
    switch (status) {
      case UserStatus.SUSPENDED:
        return createInactiveUserFixture(overrides);
      case UserStatus.SUSPENDED:
        return createSuspendedUserFixture(overrides);
      default:
        return createUserFixture({ ...overrides, status });
    }
  }
}
