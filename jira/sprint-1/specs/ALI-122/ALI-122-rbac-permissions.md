# ALI-122: Role-Based Access Control (RBAC) - Permissions System

## Overview

Complete RBAC implementation for the Users & Roles Management system, defining permissions, guards, and field-level access control.

## Role Hierarchy

```
ADMIN (Highest authority)
  ↓
EMPLOYEE (Service execution)
  ↓
CLIENT (Service requests)
  ↓
LEAD (Future: Team management)
  ↓
USER (Future: Basic access)
  ↓
MODERATOR (Future: Content moderation)
```

## Permission Matrix

### User Management

| Action | CLIENT | EMPLOYEE | ADMIN |
|--------|--------|----------|-------|
| View all users list | ❌ | ✅ (limited) | ✅ (full) |
| View user details | ❌ (own only) | ❌ | ✅ |
| Create user | ❌ | ❌ | ✅ |
| Update user | ❌ (own profile) | ❌ (own profile) | ✅ (any) |
| Delete user | ❌ | ❌ | ✅ |
| Change role | ❌ | ❌ | ✅ |
| Change status (suspend/activate) | ❌ | ❌ | ✅ |
| Reset password | ❌ (own only) | ❌ (own only) | ✅ (any) |
| Bulk operations | ❌ | ❌ | ✅ |
| Export users | ❌ | ❌ | ✅ |
| Import users | ❌ | ❌ | ✅ |
| Impersonate user | ❌ | ❌ | ✅ |
| Anonymize user | ❌ | ❌ | ✅ |
| View activity log | ❌ | ❌ | ✅ |

### Request Management

| Action | CLIENT | EMPLOYEE | ADMIN |
|--------|--------|----------|-------|
| Create request | ✅ | ❌ | ✅ |
| View requests | ✅ (own) | ✅ (assigned) | ✅ (all) |
| Update request | ❌ | ❌ (assigned) | ✅ |
| Assign request | ❌ | ❌ | ✅ |
| Complete request | ❌ | ✅ (assigned) | ✅ |
| Cancel request | ✅ (request) | ❌ | ✅ (approve) |

### Profile Management

| Action | CLIENT | EMPLOYEE | ADMIN |
|--------|--------|----------|-------|
| View own profile | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ |
| Change own password | ✅ | ✅ | ✅ |
| Enable 2FA | ✅ | ✅ | ✅ |
| Manage locations | ✅ (own) | ❌ | ✅ (all) |
| View notifications | ✅ (own) | ✅ (own) | ✅ (all) |

## Field-Level Permissions

### User Profile Fields by Role

**CLIENT can see/edit**:
- firstname, lastname, email, phone, company
- **address** (main address)
- **contactPerson** (business contact)
- locations (work locations)

**EMPLOYEE can see/edit**:
- firstname, lastname, email, phone, company
- ❌ No address field
- ❌ No contactPerson field

**ADMIN can see/edit (any user)**:
- All fields
- role (can change)
- status (can change)
- Audit fields (createdBy, updatedBy, deletedAt)

### Protected Fields (Never exposed to frontend)

- `password` - Never returned in API responses
- `deletedAt` - Only visible to ADMIN
- Internal IDs for relations

## Guard Implementation

### JwtAuthGuard

**File**: `packages/api/src/auth/guards/jwt-auth.guard.ts`

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
```

### RolesGuard

**File**: `packages/api/src/auth/guards/roles.guard.ts`

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles) {
      return true; // No roles required
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.role === role);
  }
}
```

### @Roles Decorator

**File**: `packages/api/src/auth/decorators/roles.decorator.ts`

```typescript
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
```

### Usage in Controllers

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  // Public endpoint (all authenticated users)
  @Get()
  async findAll() {
    // Role-based filtering handled in service
  }

  // ADMIN only
  @Post()
  @Roles('ADMIN')
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // ADMIN only
  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  // EMPLOYEE or ADMIN
  @Get('stats')
  @Roles('EMPLOYEE', 'ADMIN')
  async getStats() {
    return this.usersService.getStats();
  }
}
```

## Resource Ownership Checks

### Check Own Resource

```typescript
async updateProfile(userId: string, currentUserId: string, dto: UpdateProfileDto) {
  // Ensure user can only update own profile (unless ADMIN)
  if (userId !== currentUserId && currentUser.role !== 'ADMIN') {
    throw new ForbiddenException('Cannot update other user profiles');
  }

  return this.update(userId, dto);
}
```

### Check Request Ownership (CLIENT)

```typescript
async getRequest(requestId: string, user: JwtPayload) {
  const request = await this.requestsRepository.findOne(requestId);

  if (!request) {
    throw new NotFoundException('Request not found');
  }

  // CLIENT can only see own requests
  if (user.role === 'CLIENT' && request.userId !== user.id) {
    throw new ForbiddenException('Access denied');
  }

  // EMPLOYEE can only see assigned requests
  if (user.role === 'EMPLOYEE' && request.assignedToId !== user.id) {
    throw new ForbiddenException('Access denied');
  }

  // ADMIN can see all
  return request;
}
```

## Audit Logging

### Audit Fields

Every sensitive operation is tracked:

```typescript
interface AuditFields {
  createdBy: string; // User ID who created
  updatedBy: string; // User ID who last updated
  deletedAt: Date;   // Soft delete timestamp
  createdAt: Date;   // Creation timestamp
  updatedAt: Date;   // Last update timestamp
}
```

### Audit Implementation

```typescript
async update(id: string, dto: UpdateUserDto, currentUserId: string) {
  return this.prisma.user.update({
    where: { id },
    data: {
      ...dto,
      updatedBy: currentUserId,
      updatedAt: new Date()
    }
  });
}

async create(dto: CreateUserDto, currentUserId: string) {
  return this.prisma.user.create({
    data: {
      ...dto,
      createdBy: currentUserId,
      createdAt: new Date()
    }
  });
}
```

### Activity Log

For admin operations, log to activity table:

```typescript
async logAction(action: AdminAction) {
  await this.prisma.adminActivityLog.create({
    data: {
      adminId: action.adminId,
      action: action.type, // 'USER_CREATED', 'ROLE_CHANGED', etc.
      targetUserId: action.targetUserId,
      metadata: action.metadata,
      ip: action.ip,
      userAgent: action.userAgent
    }
  });
}
```

## Business Rules Enforcement

### Rule 1: Cannot Delete Own Account

```typescript
async delete(id: string, currentUserId: string) {
  if (id === currentUserId) {
    throw new BadRequestException('Cannot delete your own account');
  }
  await this.repository.softDelete(id);
}
```

### Rule 2: Must Keep At Least One ADMIN

```typescript
async bulkUpdateRole(userIds: string[], newRole: Role) {
  if (newRole !== 'ADMIN') {
    const totalAdmins = await this.countByRole('ADMIN');
    const affectedAdmins = await this.countAdminsInList(userIds);

    if (totalAdmins - affectedAdmins < 1) {
      throw new BadRequestException('Must keep at least one administrator');
    }
  }

  return this.repository.bulkUpdate(userIds, { role: newRole });
}
```

### Rule 3: Cannot Change Own Role

```typescript
async changeRole(userId: string, newRole: Role, currentUserId: string) {
  if (userId === currentUserId) {
    throw new BadRequestException('Cannot change your own role');
  }

  return this.repository.update(userId, { role: newRole });
}
```

### Rule 4: Suspended Users Cannot Login

```typescript
async validateUser(email: string, password: string) {
  const user = await this.findByEmail(email);

  if (user.status === 'SUSPENDED') {
    throw new UnauthorizedException('Account suspended. Contact support.');
  }

  if (user.status === 'ANONYMIZED') {
    throw new UnauthorizedException('Account not found');
  }

  // Verify password...
}
```

## JWT Payload Structure

```typescript
interface JwtPayload {
  sub: string;        // User ID
  email: string;      // User email
  role: Role;         // User role
  firstname: string;  // For display
  lastname: string;   // For display
  profileComplete: boolean;
  emailVerified: boolean;
  iat: number;        // Issued at
  exp: number;        // Expires at
}
```

## tRPC Middleware

```typescript
export const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { user: ctx.user } });
});

export const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx: { user: ctx.user } });
});

// Usage in tRPC router
export const userRouter = t.router({
  getAll: t.procedure
    .use(isAuthenticated)
    .query(({ ctx }) => {
      // Automatically filter by role
      return getUsersBasedOnRole(ctx.user);
    }),

  create: t.procedure
    .use(isAdmin)
    .input(createUserSchema)
    .mutation(({ input }) => {
      return createUser(input);
    })
});
```

## Security Checklist

- [ ] All endpoints protected with JwtAuthGuard
- [ ] Role requirements enforced with RolesGuard
- [ ] Ownership checks for resource access
- [ ] Password never returned in responses
- [ ] Soft deletes exclude from queries
- [ ] Audit fields populated on all changes
- [ ] Activity log for admin operations
- [ ] Business rules validated before operations
- [ ] Rate limiting on authentication endpoints
- [ ] Input validation on all endpoints

## References

- [Main Spec](./ALI-122-spec.md)
- [Backend Implementation](./ALI-122-backend-implementation.md)
- [Integration Guide](./ALI-122-integration-guide.md)

---

**Version**: 1.0
**Last Updated**: 2025-12-26
