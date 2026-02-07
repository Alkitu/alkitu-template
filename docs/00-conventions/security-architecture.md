# Security Architecture: RBAC, Feature Flags & Audit System

## Overview

This document describes the security architecture for routing protection, role-based access control (RBAC), feature flags, and audit logging in the Alkitu Template.

## Table of Contents

1. [Role Hierarchy System](#role-hierarchy-system)
2. [Protected Routes](#protected-routes)
3. [Feature Flag Protection](#feature-flag-protection)
4. [Audit Logging](#audit-logging)
5. [Backend Guards](#backend-guards)
6. [Frontend Middleware](#frontend-middleware)
7. [Best Practices](#best-practices)

---

## Role Hierarchy System

### Overview

The role hierarchy system allows roles to inherit permissions from lower-level roles. This prevents code duplication and ensures consistent access control.

### Hierarchy

```
ADMIN
├─ EMPLOYEE
│  └─ CLIENT
├─ LEAD
│  └─ CLIENT
└─ CLIENT
```

**Inheritance Rules:**
- **ADMIN**: Has all permissions (inherits ADMIN, EMPLOYEE, CLIENT, LEAD)
- **EMPLOYEE**: Has employee + client permissions (inherits EMPLOYEE, CLIENT)
- **LEAD**: Has lead + client permissions (inherits LEAD, CLIENT)
- **CLIENT**: Has only client permissions

### Implementation

**Location**: `/packages/shared/src/rbac/role-hierarchy.ts`

```typescript
import { hasRole } from '@alkitu/shared/rbac/role-hierarchy';

// Check if ADMIN can access EMPLOYEE route
hasRole(UserRole.ADMIN, [UserRole.EMPLOYEE]) // true

// Check if CLIENT can access ADMIN route
hasRole(UserRole.CLIENT, [UserRole.ADMIN]) // false
```

### Usage in Code

**Backend (NestJS)**:
```typescript
import { hasRole } from '@alkitu/shared/rbac/role-hierarchy';

// In RolesGuard
canActivate(context: ExecutionContext): boolean {
  const requiredRoles = [...];
  const user = request.user;
  return hasRole(user.role, requiredRoles);
}
```

**Frontend (Next.js Middleware)**:
```typescript
import { hasRole } from '@alkitu/shared/rbac/role-hierarchy';

// In withAuthMiddleware
if (!hasRole(userRoleEnum, requiredRoles)) {
  return NextResponse.redirect('/unauthorized');
}
```

**tRPC Procedures**:
```typescript
import { requireRoles } from '../middlewares/roles.middleware';

const deleteUser = protectedProcedure
  .use(requireRoles(UserRole.ADMIN))
  .mutation(async ({ ctx, input }) => { ... });
```

---

## Protected Routes

### Configuration

**Location**: `/packages/web/src/lib/routes/protected-routes.ts`

All protected routes must be explicitly declared with required roles:

```typescript
export const PROTECTED_ROUTES: ProtectedRoute[] = [
  {
    path: '/admin/users',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/employee/requests',
    roles: [UserRole.EMPLOYEE],
  },
  {
    path: '/client/dashboard',
    roles: [UserRole.CLIENT],
  },
];
```

### Route Protection Flow

```
User Request
    ↓
i18n Middleware (extract locale)
    ↓
Auth Middleware (check JWT + role)
    ↓
Feature Flag Middleware (check required features)
    ↓
Allow Access or Redirect
```

### Adding New Protected Routes

1. **Create the page**: `/app/[lang]/(private)/admin/new-feature/page.tsx`
2. **Add to config**: `/lib/routes/protected-routes.ts`
   ```typescript
   {
     path: '/admin/new-feature',
     roles: [UserRole.ADMIN],
   }
   ```
3. **Run validation**: `npm run validate:routes` (when implemented)

### Route Validation Script

**TODO**: Create `/packages/web/scripts/validate-routes.ts` to auto-generate and validate routes from filesystem.

---

## Feature Flag Protection

### Overview

Feature flags control access to specific features at the platform level. Even if a user has the correct role, they cannot access a feature if its flag is disabled.

### Middleware Chain

**Location**: `/packages/web/middleware.ts`

```typescript
export default chain([
  withI18nMiddleware,      // 1. Extract locale
  withAuthMiddleware,       // 2. Authenticate + check roles
  withFeatureFlagMiddleware, // 3. Check feature flags
]);
```

### Feature-Gated Routes

**Location**: `/packages/web/src/middleware/withFeatureFlagMiddleware.ts`

```typescript
const FEATURE_GATED_ROUTES: Record<string, string> = {
  '/admin/chat': 'support-chat',
  '/admin/channels': 'team-channels',
  '/admin/analytics': 'analytics',
  '/admin/notifications': 'notifications',
};
```

### Adding Feature-Gated Routes

1. **Add to middleware**:
   ```typescript
   '/admin/new-feature': 'new-feature-flag',
   ```

2. **Create feature flag in database**:
   ```typescript
   await prisma.featureFlag.create({
     data: {
       key: 'new-feature-flag',
       name: 'New Feature',
       description: 'Description of the feature',
       status: 'DISABLED',
     },
   });
   ```

3. **Test**: Try accessing the route with flag disabled → should redirect to `/feature-disabled`

### Feature Disabled Page

**Location**: `/app/[lang]/(private)/feature-disabled/page.tsx`

Shows when user tries to access a feature-gated route while the feature is disabled.

### Backend Enforcement

Feature flags MUST also be checked on the backend:

**NestJS Guard**:
```typescript
@Get('conversations')
@UseGuards(JwtAuthGuard, RolesGuard, FeatureFlagGuard)
@Roles(UserRole.ADMIN)
@RequireFeature('support-chat')
async getConversations() { ... }
```

**tRPC Middleware**:
```typescript
const getChatHistory = protectedProcedure
  .use(requireRoles(UserRole.ADMIN))
  .use(requireFeature('support-chat'))
  .query(async ({ ctx }) => { ... });
```

---

## Audit Logging

### Overview

All sensitive operations are logged to the `audit_logs` collection for security, compliance, and debugging.

### What to Log

**ALWAYS log**:
- Role changes (UPDATE_ROLE)
- Feature flag toggles (TOGGLE_FEATURE)
- User creation/deletion (CREATE_USER, DELETE_USER)
- Permission changes (UPDATE_PERMISSIONS)
- Critical data modifications (DELETE_REQUEST, BULK_DELETE)

**OPTIONAL**:
- Read operations on sensitive data
- Failed authentication attempts
- IP address changes

### Implementation

**Location**: `/packages/api/src/audit/audit.service.ts`

```typescript
await auditService.log({
  action: 'UPDATE_ROLE',
  resourceType: 'USER',
  resourceId: userId,
  userId: adminId,
  metadata: {
    oldRole: 'CLIENT',
    newRole: 'EMPLOYEE',
    reason: 'Promotion to employee',
  },
});
```

### Audit Service Methods

```typescript
// Log an action
await auditService.log(entry);

// Get logs for a resource
await auditService.getResourceLogs('USER', userId);

// Get user's actions
await auditService.getUserActions(adminId);

// Get recent logs
await auditService.getRecentLogs(100);

// Search by action
await auditService.searchByAction('UPDATE_ROLE');
```

### Database Schema

**Location**: `/packages/api/prisma/schema.prisma`

```prisma
model AuditLog {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  action       String   // CREATE_USER, UPDATE_ROLE, etc.
  resourceType String   // USER, REQUEST, FEATURE_FLAG, etc.
  resourceId   String   @db.ObjectId
  user         User     @relation("UserAuditLogs", fields: [userId], references: [id])
  userId       String   @db.ObjectId
  metadata     Json?    // Context data
  timestamp    DateTime @default(now())

  @@index([userId])
  @@index([resourceType, resourceId])
  @@index([action])
  @@index([timestamp])
  @@map("audit_logs")
}
```

### Example: Audit in User Service

```typescript
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async updateRole(userId: string, newRole: UserRole, changedBy: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const oldRole = user.role;

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // ✅ Log the role change
    await this.auditService.log({
      action: 'UPDATE_ROLE',
      resourceType: 'USER',
      resourceId: userId,
      userId: changedBy,
      metadata: {
        oldRole,
        newRole,
        targetUserEmail: user.email,
      },
    });

    return updated;
  }
}
```

---

## Backend Guards

### NestJS Guards

**Location**: `/packages/api/src/auth/guards/roles.guard.ts`

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [...]);
    const user = request.user;

    // Use hierarchy-aware checking
    return hasRole(user.role, requiredRoles);
  }
}
```

**Usage**:
```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findAll() { ... }
}
```

### tRPC Middleware

**Location**: `/packages/api/src/trpc/middlewares/roles.middleware.ts`

```typescript
export const requireRoles = (...roles: UserRole[]) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!hasRole(ctx.user.role, roles)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: '...' });
    }
    return next();
  });
};
```

**Convenience Procedures**:
```typescript
export const adminProcedure = t.procedure.use(requireRoles(UserRole.ADMIN));
export const employeeProcedure = t.procedure.use(requireRoles(UserRole.EMPLOYEE, UserRole.ADMIN));
export const clientProcedure = t.procedure.use(requireRoles(UserRole.CLIENT, UserRole.EMPLOYEE, UserRole.ADMIN));
```

**Usage**:
```typescript
// Admin-only endpoint
const deleteUser = adminProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => { ... });

// Employee or admin
const assignRequest = employeeProcedure
  .input(assignSchema)
  .mutation(async ({ ctx, input }) => { ... });
```

---

## Frontend Middleware

### Auth Middleware

**Location**: `/packages/web/src/middleware/withAuthMiddleware.ts`

**Responsibilities**:
1. Extract JWT from cookies
2. Validate JWT expiration
3. Refresh token if expired
4. Extract user role from JWT payload
5. Check if user role matches required roles (using hierarchy)
6. Redirect to `/unauthorized` if unauthorized

**Security Features**:
- ✅ Role hierarchy checking
- ✅ Token refresh flow
- ✅ Auth bypass protection (development only)
- ✅ Detailed logging

### Feature Flag Middleware

**Location**: `/packages/web/src/middleware/withFeatureFlagMiddleware.ts`

**Responsibilities**:
1. Check if route requires a feature flag
2. Query feature flag status from backend
3. Redirect to `/feature-disabled` if disabled

**Security Decision**:
- **Fail Closed**: If API call fails, deny access (more secure, worse UX)
- Change to **Fail Open** if you prefer to allow access when API is down

---

## Best Practices

### 1. Always Use Role Hierarchy

❌ **Bad**:
```typescript
if (user.role === UserRole.ADMIN || user.role === UserRole.EMPLOYEE) {
  // Allow access
}
```

✅ **Good**:
```typescript
if (hasRole(user.role, [UserRole.EMPLOYEE, UserRole.ADMIN])) {
  // Allow access
}
```

### 2. Protect Both Frontend and Backend

❌ **Bad**: Only hide UI elements
```typescript
{user.role === 'ADMIN' && <DeleteButton />}
```

✅ **Good**: Protect routes AND endpoints
```typescript
// Frontend: Hide UI
{hasRole(user.role, [UserRole.ADMIN]) && <DeleteButton />}

// Backend: Protect endpoint
@Roles(UserRole.ADMIN)
async deleteUser() { ... }
```

### 3. Log All Sensitive Operations

❌ **Bad**: No logging
```typescript
await this.prisma.user.update({ data: { role: newRole } });
```

✅ **Good**: Log with context
```typescript
await this.auditService.log({
  action: 'UPDATE_ROLE',
  resourceType: 'USER',
  resourceId: userId,
  userId: changedBy,
  metadata: { oldRole, newRole },
});
```

### 4. Use Convenience Procedures

❌ **Bad**: Repeat middleware everywhere
```typescript
const endpoint1 = protectedProcedure.use(requireRoles(UserRole.ADMIN))...
const endpoint2 = protectedProcedure.use(requireRoles(UserRole.ADMIN))...
const endpoint3 = protectedProcedure.use(requireRoles(UserRole.ADMIN))...
```

✅ **Good**: Use adminProcedure
```typescript
const endpoint1 = adminProcedure...
const endpoint2 = adminProcedure...
const endpoint3 = adminProcedure...
```

### 5. Feature Flags Require Backend Enforcement

❌ **Bad**: Only frontend check
```typescript
const { isEnabled } = useFeatureFlag('support-chat');
if (isEnabled) {
  return <ChatComponent />;
}
```

✅ **Good**: Backend enforcement too
```typescript
// Frontend check
if (isEnabled) {
  return <ChatComponent />;
}

// Backend endpoint protection
const getChatHistory = protectedProcedure
  .use(requireFeature('support-chat'))
  .query(async ({ ctx }) => { ... });
```

---

## Migration Checklist

When adding new features, ensure:

- [ ] Protected routes added to `/lib/routes/protected-routes.ts`
- [ ] Role checks use `hasRole()` from hierarchy system
- [ ] Backend endpoints protected with `@Roles()` or `requireRoles()`
- [ ] Feature-gated routes added to `FEATURE_GATED_ROUTES`
- [ ] Feature flags checked in backend services/controllers
- [ ] Sensitive operations logged with `auditService.log()`
- [ ] Frontend UI hidden for unauthorized roles
- [ ] Error pages show helpful messages

---

## Security Principles

1. **Defense in Depth**: Protect at multiple layers (middleware, guards, services)
2. **Fail Securely**: Default to denying access on errors
3. **Least Privilege**: Users should have minimum necessary permissions
4. **Audit Everything**: Log all sensitive operations for forensics
5. **Never Trust Input**: Validate and sanitize all user input
6. **Keep Secrets Safe**: Never log tokens, passwords, or sensitive data

---

## Additional Resources

- **Role Hierarchy Implementation**: `/packages/shared/src/rbac/role-hierarchy.ts`
- **Auth Middleware**: `/packages/web/src/middleware/withAuthMiddleware.ts`
- **Feature Flag Middleware**: `/packages/web/src/middleware/withFeatureFlagMiddleware.ts`
- **Audit Service**: `/packages/api/src/audit/audit.service.ts`
- **tRPC Roles Middleware**: `/packages/api/src/trpc/middlewares/roles.middleware.ts`
- **Protected Routes Config**: `/packages/web/src/lib/routes/protected-routes.ts`
