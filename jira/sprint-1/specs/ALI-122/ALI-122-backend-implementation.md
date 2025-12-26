# ALI-122: Backend Implementation - SOLID Architecture

## Overview

The Users module follows strict SOLID principles with a facade pattern and specialized services. This document details the backend architecture, service responsibilities, and implementation patterns.

## Service Layer Architecture

### SOLID Principles Applied

**Single Responsibility**: Each service has one clear purpose
**Open/Closed**: Services are extensible without modification
**Liskov Substitution**: All services implement clear contracts
**Interface Segregation**: Focused, specific interfaces
**Dependency Inversion**: Services depend on abstractions

### Service Structure

```
UserFacadeService (Main API)
    ├── UserRepositoryService (Data Access)
    ├── UserAuthenticationService (Password & Auth)
    ├── UserAnalyticsService (Statistics)
    └── UserEventsService (Event Publishing)
```

## Service Implementations

### 1. UserFacadeService

**File**: `packages/api/src/users/services/user-facade.service.ts`

**Responsibility**: Coordinate operations across specialized services

**Key Methods**:
```typescript
@Injectable()
export class UserFacadeService {
  constructor(
    private readonly repository: UserRepositoryService,
    private readonly auth: UserAuthenticationService,
    private readonly analytics: UserAnalyticsService,
    private readonly events: UserEventsService
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.auth.hashPassword(dto.password);
    const user = await this.repository.create({ ...dto, password: hashedPassword });
    await this.events.publishUserCreated(user);
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.repository.update(id, dto);
    await this.events.publishUserUpdated(user);
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
    await this.events.publishUserDeleted(id);
  }

  async changeRole(id: string, role: Role): Promise<User> {
    const user = await this.repository.update(id, { role });
    await this.events.publishRoleChanged(user, role);
    return user;
  }

  async bulkDelete(userIds: string[]): Promise<BulkResult> {
    const results = await this.repository.bulkDelete(userIds);
    await this.events.publishBulkDeleted(userIds);
    return results;
  }
}
```

### 2. UserRepositoryService

**File**: `packages/api/src/users/services/user-repository.service.ts`

**Responsibility**: Data access and Prisma operations

**Key Methods**:
```typescript
@Injectable()
export class UserRepositoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data,
      select: this.getUserSelect()
    });
  }

  async findAll(filters: UserFilters): Promise<PaginatedResult<User>> {
    const where = this.buildWhereClause(filters);
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: this.getUserSelect(),
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { [filters.sortBy]: filters.sortOrder }
      }),
      this.prisma.user.count({ where })
    ]);

    return { data: users, total, page: filters.page, limit: filters.limit };
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
      select: this.getUserSelect()
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async bulkDelete(ids: string[]): Promise<BulkResult> {
    const deleted = await this.prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() }
    });
    return { success: deleted.count, failed: ids.length - deleted.count };
  }

  private getUserSelect() {
    return {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      phone: true,
      company: true,
      address: true,
      contactPerson: true,
      role: true,
      status: true,
      profileComplete: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      password: false // NEVER select password
    };
  }

  private buildWhereClause(filters: UserFilters): Prisma.UserWhereInput {
    return {
      deletedAt: null, // Exclude soft-deleted
      ...(filters.search && {
        OR: [
          { firstname: { contains: filters.search, mode: 'insensitive' } },
          { lastname: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
          { company: { contains: filters.search, mode: 'insensitive' } }
        ]
      }),
      ...(filters.role && { role: filters.role }),
      ...(filters.status && { status: filters.status })
    };
  }
}
```

### 3. UserAuthenticationService

**File**: `packages/api/src/users/services/user-authentication.service.ts`

**Responsibility**: Password hashing and validation

**Key Methods**:
```typescript
@Injectable()
export class UserAuthenticationService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  async generateTempPassword(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    return Array.from({ length: 12 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const hashed = await this.hashPassword(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed }
    });
  }
}
```

### 4. UserAnalyticsService

**File**: `packages/api/src/users/services/user-analytics.service.ts`

**Responsibility**: Statistics and reporting

**Key Methods**:
```typescript
@Injectable()
export class UserAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<UserStats> {
    const [total, byRole, byStatus, recent] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.getUsersByRole(),
      this.getUsersByStatus(),
      this.getRecentRegistrations()
    ]);

    return { total, byRole, byStatus, recentRegistrations: recent };
  }

  private async getUsersByRole(): Promise<Record<Role, number>> {
    const counts = await this.prisma.user.groupBy({
      by: ['role'],
      where: { deletedAt: null },
      _count: true
    });

    return counts.reduce((acc, { role, _count }) => {
      acc[role] = _count;
      return acc;
    }, {} as Record<Role, number>);
  }

  private async getUsersByStatus(): Promise<Record<UserStatus, number>> {
    const counts = await this.prisma.user.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: true
    });

    return counts.reduce((acc, { status, _count }) => {
      acc[status] = _count;
      return acc;
    }, {} as Record<UserStatus, number>);
  }

  private async getRecentRegistrations(): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.prisma.user.count({
      where: {
        deletedAt: null,
        createdAt: { gte: sevenDaysAgo }
      }
    });
  }
}
```

### 5. UserEventsService

**File**: `packages/api/src/users/services/user-events.service.ts`

**Responsibility**: Event publishing for integrations

**Key Methods**:
```typescript
@Injectable()
export class UserEventsService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService
  ) {}

  async publishUserCreated(user: User): Promise<void> {
    // Send welcome notification
    await this.notificationService.createNotification({
      userId: user.id,
      type: 'INFO',
      message: `Welcome to Alkitu, ${user.firstname}!`,
      data: { userId: user.id }
    });

    // Send welcome email (if email verified)
    if (user.emailVerified) {
      await this.emailService.sendWelcomeEmail(user.email, user.firstname);
    }
  }

  async publishRoleChanged(user: User, newRole: Role): Promise<void> {
    await this.notificationService.createNotification({
      userId: user.id,
      type: 'WARNING',
      message: `Your role has been changed to ${newRole}`,
      data: { oldRole: user.role, newRole }
    });
  }

  async publishUserUpdated(user: User): Promise<void> {
    // Minimal notification for profile updates
    await this.notificationService.createNotification({
      userId: user.id,
      type: 'INFO',
      message: 'Your profile has been updated',
      data: { userId: user.id }
    });
  }

  async publishUserDeleted(userId: string): Promise<void> {
    // Log deletion event (for admin audit)
    this.logger.log(`User ${userId} deleted`);
  }

  async publishBulkDeleted(userIds: string[]): Promise<void> {
    this.logger.log(`Bulk deleted ${userIds.length} users`);
  }
}
```

## DTOs and Validation

### CreateUserDto

```typescript
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
  firstname: z.string().min(2).max(50),
  lastname: z.string().min(2).max(50),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone format'),
  company: z.string().min(2).max(100),
  role: z.enum(['CLIENT', 'EMPLOYEE', 'ADMIN']),
  address: z.string().max(500).optional(),
  contactPerson: z.object({
    name: z.string().min(2),
    lastname: z.string().min(2),
    phone: z.string(),
    email: z.string().email()
  }).optional()
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
```

### UpdateUserDto

```typescript
export const updateUserSchema = createUserSchema.partial().omit({
  email: true, // Email cannot be changed
  password: true // Use separate endpoint for password
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
```

### BulkOperationDto

```typescript
export const bulkDeleteSchema = z.object({
  userIds: z.array(z.string()).min(1).max(100)
});

export const bulkUpdateRoleSchema = z.object({
  userIds: z.array(z.string()).min(1).max(100),
  role: z.enum(['CLIENT', 'EMPLOYEE', 'ADMIN'])
});

export const bulkUpdateStatusSchema = z.object({
  userIds: z.array(z.string()).min(1).max(100),
  status: z.enum(['ACTIVE', 'SUSPENDED'])
});
```

## Business Logic Implementation

### User Creation Workflow

```typescript
async createUser(dto: CreateUserDto) {
  // 1. Validate email uniqueness
  const exists = await this.repository.findByEmail(dto.email);
  if (exists) throw new ConflictException('Email already exists');

  // 2. Hash password
  const hashedPassword = await this.auth.hashPassword(dto.password);

  // 3. Create user
  const user = await this.repository.create({
    ...dto,
    password: hashedPassword,
    role: dto.role || 'CLIENT',
    status: 'ACTIVE',
    profileComplete: false,
    emailVerified: false
  });

  // 4. Send verification email
  await this.emailService.sendVerificationEmail(user.email);

  // 5. Publish event
  await this.events.publishUserCreated(user);

  return user;
}
```

### Bulk Operations with Transactions

```typescript
async bulkUpdateRole(userIds: string[], role: Role): Promise<BulkResult> {
  // Validate: Cannot change own role
  const currentUserId = this.request.user.id;
  if (userIds.includes(currentUserId)) {
    throw new BadRequestException('Cannot change your own role');
  }

  // Validate: Must keep at least one ADMIN
  if (role !== 'ADMIN') {
    const adminCount = await this.repository.countByRole('ADMIN');
    const adminsInList = await this.repository.countAdminsInList(userIds);
    if (adminCount - adminsInList < 1) {
      throw new BadRequestException('Must keep at least one administrator');
    }
  }

  // Execute in transaction
  return this.prisma.$transaction(async (tx) => {
    const results = await Promise.allSettled(
      userIds.map(id =>
        tx.user.update({
          where: { id },
          data: { role, updatedBy: currentUserId }
        })
      )
    );

    const success = results.filter(r => r.status === 'fulfilled').length;
    return { success, failed: userIds.length - success };
  });
}
```

## Testing Strategy

### Unit Tests

**UserFacadeService.spec.ts**:
```typescript
describe('UserFacadeService', () => {
  let service: UserFacadeService;
  let repository: MockType<UserRepositoryService>;
  let auth: MockType<UserAuthenticationService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserFacadeService,
        { provide: UserRepositoryService, useFactory: mockRepository },
        { provide: UserAuthenticationService, useFactory: mockAuth }
      ]
    }).compile();

    service = module.get(UserFacadeService);
    repository = module.get(UserRepositoryService);
    auth = module.get(UserAuthenticationService);
  });

  describe('create', () => {
    it('should hash password before creating user', async () => {
      auth.hashPassword.mockResolvedValue('hashed123');
      repository.create.mockResolvedValue(mockUser);

      await service.create({ password: 'plain123', ...createUserDto });

      expect(auth.hashPassword).toHaveBeenCalledWith('plain123');
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashed123' })
      );
    });
  });

  describe('bulkDelete', () => {
    it('should prevent deleting own account', async () => {
      const currentUserId = 'current-user-id';

      await expect(
        service.bulkDelete([currentUserId, 'other-id'])
      ).rejects.toThrow('Cannot delete your own account');
    });
  });
});
```

### Integration Tests

```typescript
describe('Users Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  it('POST /users - creates user with hashed password', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createUserDto)
      .expect(201);

    const user = await prisma.user.findUnique({
      where: { id: response.body.id }
    });

    expect(user.password).not.toBe(createUserDto.password);
    expect(await bcrypt.compare(createUserDto.password, user.password)).toBe(true);
  });
});
```

## Performance Considerations

### Database Queries
- Always exclude `password` field in select
- Use indexes for filtering (role, status, email)
- Pagination max limit: 100
- Soft delete filter applied globally

### Caching Strategy
```typescript
@Injectable()
export class UserCacheService {
  constructor(private readonly redis: RedisService) {}

  async getUserRole(userId: string): Promise<Role> {
    const cached = await this.redis.get(`user:${userId}:role`);
    if (cached) return cached as Role;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    await this.redis.set(`user:${userId}:role`, user.role, { ttl: 300 }); // 5 min
    return user.role;
  }
}
```

## Error Handling

```typescript
try {
  return await this.repository.create(data);
} catch (error) {
  if (error.code === 'P2002') { // Prisma unique constraint
    throw new ConflictException('Email already exists');
  }
  if (error.code === 'P2025') { // Record not found
    throw new NotFoundException('User not found');
  }
  this.logger.error('User creation failed', error);
  throw new InternalServerErrorException('Failed to create user');
}
```

## References

- [Main Spec](./ALI-122-spec.md)
- [RBAC Permissions](./ALI-122-rbac-permissions.md)
- [Testing Migration](./ALI-122-testing-migration.md)

---

**Version**: 1.0
**Last Updated**: 2025-12-26
