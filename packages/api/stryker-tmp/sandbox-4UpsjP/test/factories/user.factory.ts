// @ts-nocheck
import { User, UserRole, UserStatus } from "@prisma/client";

export interface CreateUserData {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: Status;
  emailVerified?: boolean;
  phone?: string;
  organizationId?: string;
}

export class UserFactory {
  private static defaultUser: Partial<User> = {
    email: "test@example.com",
    password: "$2b$10$hashedpassword",
    firstName: "Test",
    lastName: "User",
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    emailVerified: null,
    phone: "+1234567890",
  };

  static create(overrides: CreateUserData = {}): User {
    return {
      id: this.generateId(),
      ...this.defaultUser,
      ...overrides,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
  }

  static createMany(count: number, overrides: CreateUserData = {}): User[] {
    return Array.from({ length: count }, (_, index) =>
      this.create({
        ...overrides,
        email: overrides.email || `test${index + 1}@example.com`,
      })
    );
  }

  static createAdmin(overrides: CreateUserData = {}): User {
    return this.create({
      ...overrides,
      role: UserRole.ADMIN,
      email: overrides.email || "admin@example.com",
      lastName: overrides.lastName || "User",
    });
  }

  static createModerator(overrides: CreateUserData = {}): User {
    return this.create({
      ...overrides,
      role: UserRole.MODERATOR,
      email: overrides.email || "moderator@example.com",
      lastName: overrides.lastName || "User",
    });
  }

  static createVerifiedUser(overrides: CreateUserData = {}): User {
    return this.create({
      ...overrides,
      emailVerified: true,
      status: UserStatus.ACTIVE,
    });
  }

  static createInactiveUser(overrides: CreateUserData = {}): User {
    return this.create({
      ...overrides,
      status: UserStatus.INACTIVE,
    });
  }

  static createSuspendedUser(overrides: CreateUserData = {}): User {
    return this.create({
      ...overrides,
      status: UserStatus.SUSPENDED,
    });
  }

  static createWithOrganization(
    organizationId: string,
    overrides: CreateUserData = {}
  ): User {
    return this.create({
      ...overrides,
      organizationId,
    });
  }

  static createBatch(configs: CreateUserData[]): User[] {
    return configs.map((config) => this.create(config));
  }

  private static generateId(): string {
    return `user_${Math.random().toString(36).substr(2, 9)}`;
  }

  static createMinimal(overrides: Partial<CreateUserData> = {}): Partial<User> {
    return {
      id: this.generateId(),
      email: overrides.email || "minimal@example.com",
      lastName: overrides.lastName || "User",
      role: overrides.role || UserRole.USER,
      status: overrides.status || UserStatus.ACTIVE,
    };
  }

  static createForAuth(overrides: CreateUserData = {}): User {
    return this.create({
      ...overrides,
      emailVerified: true,
      status: UserStatus.ACTIVE,
      password: "$2b$10$validhashedpassword",
    });
  }

  static createWithEmailVerification(
    verified: boolean,
    overrides: CreateUserData = {}
  ): User {
    return this.create({
      ...overrides,
      emailVerified: verified,
    });
  }

  static createTestUserSet(): {
    admin: User;
    moderator: User;
    user: User;
    inactiveUser: User;
    suspendedUser: User;
  } {
    return {
      admin: this.createAdmin(),
      moderator: this.createModerator(),
      user: this.createVerifiedUser(),
      inactiveUser: this.createInactiveUser(),
      suspendedUser: this.createSuspendedUser(),
    };
  }
}
