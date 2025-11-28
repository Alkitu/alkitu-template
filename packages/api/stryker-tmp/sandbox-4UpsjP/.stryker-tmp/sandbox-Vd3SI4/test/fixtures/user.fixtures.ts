// @ts-nocheck
// 
import { User, UserRole, UserStatus } from "@prisma/client";

// Mock user data for testing
export const mockUser: User = {
  id: "test-user-id",
  email: "test@example.com",
  password: "$2b$10$hashedpassword",
  lastName: "User",
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  emailVerified: new Date(),organizationId: null,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
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
  status: UserStatus.INACTIVE,
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
    ...mockUser,
    ...overrides,
    id: overrides.id || `user-${Math.random().toString(36).substr(2, 9)}`,
  };
}

export function createAdminFixture(overrides: Partial<User> = {}): User {
  return createUserFixture({
    ...overrides,
    role: UserRole.ADMIN,
    email: overrides.email || "admin@example.com",
  });
}

export function createModeratorFixture(overrides: Partial<User> = {}): User {
  return createUserFixture({
    ...overrides,
    role: UserRole.MODERATOR,
    email: overrides.email || "moderator@example.com",
  });
}

export function createVerifiedUserFixture(overrides: Partial<User> = {}): User {
  return createUserFixture({
    ...overrides,
    emailVerified: new Date(),
    status: UserStatus.ACTIVE,
  });
}

export function createUnverifiedUserFixture(
  overrides: Partial<User> = {}
): User {
  return createUserFixture({
    ...overrides,
    emailVerified: null,
  });
}

export function createInactiveUserFixture(overrides: Partial<User> = {}): User {
  return createUserFixture({
    ...overrides,
    status: UserStatus.INACTIVE,
  });
}

export function createSuspendedUserFixture(
  overrides: Partial<User> = {}
): User {
  return createUserFixture({
    ...overrides,
    status: UserStatus.SUSPENDED,
  });
}

export function createUserWithOrganizationFixture(
  organizationId: string,
  overrides: Partial<User> = {}
): User {
  return createUserFixture({
    ...overrides,
    });
}

// Batch user creation
export function createMultipleUsersFixture(
  count: number,
  overrides: Partial<User> = {}
): User[] {
  return Array.from({ length: count }, (_, index) =>
    createUserFixture({
      ...overrides,
      email: overrides.email || `user${index + 1}@example.com`,
    })
  );
}

// User sets for comprehensive testing
export function createUserTestSet(): {
  admin: User;
  moderator: User;
  user: User;
  inactiveUser: User;
  suspendedUser: User;
  unverifiedUser: User;
} {
  return {
    admin: mockAdminUser,
    moderator: mockModeratorUser,
    user: mockUser,
    inactiveUser: mockInactiveUser,
    suspendedUser: mockSuspendedUser,
    unverifiedUser: mockUnverifiedUser,
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
    emailVerified: null,organizationId: null,
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
      case UserStatus.INACTIVE:
        return createInactiveUserFixture(overrides);
      case UserStatus.SUSPENDED:
        return createSuspendedUserFixture(overrides);
      default:
        return createUserFixture({ ...overrides, status });
    }
  }
}
