# Security Quick Reference Guide

Quick reference for implementing security in the Alkitu Template.

---

## Role Hierarchy

```typescript
import { hasRole } from '@alkitu/shared/rbac/role-hierarchy';

// Check permissions
if (hasRole(user.role, [UserRole.EMPLOYEE])) {
  // User is EMPLOYEE or higher (ADMIN)
}
```

**Hierarchy**:
- ADMIN → All permissions
- EMPLOYEE → EMPLOYEE + CLIENT
- LEAD → LEAD + CLIENT
- CLIENT → CLIENT only

---

## Backend Protection

### NestJS Controllers

```typescript
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  // Admin only
  @Get()
  @Roles(UserRole.ADMIN)
  findAll() { ... }

  // Admin or Employee
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findOne(@Param('id') id: string) { ... }
}
```

### tRPC Procedures

```typescript
import { requireRoles } from '../middlewares/roles.middleware';
import { adminProcedure, employeeProcedure } from '../middlewares/roles.middleware';

// Method 1: Use middleware
const deleteUser = protectedProcedure
  .use(requireRoles(UserRole.ADMIN))
  .mutation(async ({ ctx, input }) => { ... });

// Method 2: Use convenience procedure
const getAllUsers = adminProcedure
  .query(async ({ ctx }) => { ... });

const getRequests = employeeProcedure
  .query(async ({ ctx }) => { ... });
```

**Available Procedures**:
- `adminProcedure` - Admin only
- `employeeProcedure` - Employee or Admin
- `clientProcedure` - Client, Employee, or Admin
- `leadProcedure` - Lead or Admin

---

## Frontend Protection

### Hide UI Elements

```typescript
import { hasRole } from '@alkitu/shared/rbac/role-hierarchy';

function MyComponent({ user }) {
  return (
    <>
      {/* Show to admin only */}
      {hasRole(user.role, [UserRole.ADMIN]) && (
        <DeleteButton />
      )}

      {/* Show to employee or admin */}
      {hasRole(user.role, [UserRole.EMPLOYEE]) && (
        <AssignButton />
      )}
    </>
  );
}
```

### Protected Routes

Add to `/packages/web/src/lib/routes/protected-routes.ts`:

```typescript
{
  path: '/admin/new-feature',
  roles: [UserRole.ADMIN],
},
```

---

## Feature Flags

### Add Feature-Gated Route

1. **Add to middleware** (`/packages/web/src/middleware/withFeatureFlagMiddleware.ts`):
```typescript
const FEATURE_GATED_ROUTES: Record<string, string> = {
  '/admin/new-feature': 'new-feature-key',
};
```

2. **Create feature in database**:
```typescript
await prisma.featureFlag.create({
  data: {
    key: 'new-feature-key',
    name: 'New Feature Name',
    description: 'Feature description',
    status: 'DISABLED',
  },
});
```

### Check Feature in Frontend

```typescript
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

function MyComponent() {
  const { isEnabled, isLoading } = useFeatureFlag('support-chat');

  if (isLoading) return <Spinner />;
  if (!isEnabled) return null;

  return <ChatComponent />;
}
```

### Protect Backend Endpoint

```typescript
// TODO: Create requireFeature middleware
// const getChatHistory = protectedProcedure
//   .use(requireFeature('support-chat'))
//   .query(async ({ ctx }) => { ... });
```

---

## Audit Logging

### Log Sensitive Operations

```typescript
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async updateRole(userId: string, newRole: UserRole, changedBy: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const oldRole = user.role;

    await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // ✅ Log the change
    await this.auditService.log({
      action: 'UPDATE_ROLE',
      resourceType: 'USER',
      resourceId: userId,
      userId: changedBy,
      metadata: { oldRole, newRole, email: user.email },
    });
  }
}
```

### What to Log

**Always log**:
- Role changes
- Feature flag toggles
- User creation/deletion
- Permission changes
- Critical deletions

**Optional**:
- Read operations on sensitive data
- Failed auth attempts

---

## Common Patterns

### Admin-Only Endpoint

```typescript
// tRPC
const endpoint = adminProcedure
  .input(schema)
  .mutation(async ({ ctx, input }) => { ... });

// NestJS
@Roles(UserRole.ADMIN)
async endpoint() { ... }
```

### Employee or Admin

```typescript
// tRPC
const endpoint = employeeProcedure
  .input(schema)
  .query(async ({ ctx }) => { ... });

// NestJS
@Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
async endpoint() { ... }
```

### Feature-Gated + Role-Protected

```typescript
const endpoint = adminProcedure
  .use(requireFeature('support-chat')) // TODO: Implement
  .mutation(async ({ ctx, input }) => { ... });
```

---

## Checklist for New Features

- [ ] Route added to `protected-routes.ts`
- [ ] Backend endpoint protected with `@Roles()` or `requireRoles()`
- [ ] Frontend UI hidden for unauthorized users
- [ ] Feature flag route added (if applicable)
- [ ] Feature flag backend check (if applicable)
- [ ] Audit logging for sensitive operations
- [ ] Error handling with helpful messages
- [ ] Tests for authorization

---

## Quick Links

- **Role Hierarchy**: `/packages/shared/src/rbac/role-hierarchy.ts`
- **tRPC Middleware**: `/packages/api/src/trpc/middlewares/roles.middleware.ts`
- **Protected Routes**: `/packages/web/src/lib/routes/protected-routes.ts`
- **Feature Flag Middleware**: `/packages/web/src/middleware/withFeatureFlagMiddleware.ts`
- **Audit Service**: `/packages/api/src/audit/audit.service.ts`
- **Full Documentation**: `/docs/00-conventions/security-architecture.md`
