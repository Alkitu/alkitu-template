# tRPC Middleware Patterns

Comprehensive guide to tRPC middleware patterns used in the Alkitu Template project for authentication, authorization, feature flags, and resource access control.

## Overview

tRPC middleware functions as a pipeline that processes requests before they reach procedure handlers. Middleware can:
- Validate authentication and authorization
- Check feature flags
- Verify resource access permissions
- Rate limit requests
- Log and monitor activity
- Transform context for downstream procedures

## Middleware Architecture

### Basic Middleware Structure

```typescript
import { t } from '../trpc';
import { TRPCError } from '@trpc/server';

// Basic middleware function
const myMiddleware = t.middleware(async ({ ctx, next }) => {
  // Pre-processing logic
  console.log('Before procedure');

  // Validate conditions
  if (!someCondition) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Condition not met',
    });
  }

  // Call next middleware or procedure
  const result = await next();

  // Post-processing logic
  console.log('After procedure');

  return result;
});

// Usage in procedure
const myProcedure = t.procedure
  .use(myMiddleware)
  .query(async ({ ctx }) => {
    // Procedure logic
  });
```

### Context Extension

Middleware can extend context for downstream procedures:

```typescript
const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // Extend context with type-safe user
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Now guaranteed to exist
    },
  });
});
```

## Authentication Middleware

### Basic Authentication Check

```typescript
/**
 * Require user to be authenticated
 * Throws UNAUTHORIZED if no user in context
 */
export const requireAuth = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Type-safe user context
    },
  });
});

// Usage
const protectedProcedure = t.procedure.use(requireAuth);
```

### Creating Protected Procedures

```typescript
// In trpc.ts
export const protectedProcedure = t.procedure.use(requireAuth);

// In routers
export const userRouter = t.router({
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      // ctx.user is guaranteed to exist
      return await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
      });
    }),
});
```

## Role-Based Access Control (RBAC)

### requireRoles Middleware

From `roles.middleware.ts`:

```typescript
import { UserRole, hasRole } from '@alkitu/shared/rbac/role-hierarchy';

/**
 * Middleware that requires specific roles
 * Supports role hierarchy - ADMIN inherits all permissions
 */
export const requireRoles = (...roles: UserRole[]) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    if (!hasRole(ctx.user.role, roles)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Required roles: ${roles.join(', ')}. Current role: ${ctx.user.role}`,
      });
    }

    return next();
  });
};
```

### Usage in Routers

```typescript
// Direct usage
const deleteUser = t.procedure
  .use(requireRoles(UserRole.ADMIN))
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Only ADMIN can access
  });

// Multiple roles
const getAllRequests = t.procedure
  .use(requireRoles(UserRole.EMPLOYEE, UserRole.ADMIN))
  .query(async ({ ctx }) => {
    // EMPLOYEE or ADMIN can access
  });
```

### Convenience Procedures

Create reusable procedures for common role combinations:

```typescript
// Admin-only procedure
export const adminProcedure = t.procedure.use(
  requireRoles(UserRole.ADMIN)
);

// Employee or admin
export const employeeProcedure = t.procedure.use(
  requireRoles(UserRole.EMPLOYEE, UserRole.ADMIN)
);

// Client, employee, or admin
export const clientProcedure = t.procedure.use(
  requireRoles(UserRole.CLIENT, UserRole.EMPLOYEE, UserRole.ADMIN)
);

// Lead or admin
export const leadProcedure = t.procedure.use(
  requireRoles(UserRole.LEAD, UserRole.ADMIN)
);
```

### Usage of Convenience Procedures

```typescript
export const settingsRouter = t.router({
  // Admin-only
  update: adminProcedure
    .input(settingsSchema)
    .mutation(async ({ ctx, input }) => {
      // Only admins can update settings
    }),

  // Employee or admin
  getAll: employeeProcedure
    .query(async ({ ctx }) => {
      // Employees and admins can view all settings
    }),

  // Any authenticated user
  getCurrent: clientProcedure
    .query(async ({ ctx }) => {
      // Clients, employees, and admins can view current settings
    }),
});
```

## Feature Flag Protection

### requireFeature Middleware

Fail-closed middleware for feature flag protection:

```typescript
/**
 * Require feature flag to be enabled
 * Fail closed: denies access if feature is disabled or not found
 */
export const requireFeature = (featureKey: string) => {
  return t.middleware(async ({ ctx, next }) => {
    try {
      const featureFlag = await ctx.prisma.featureFlag.findUnique({
        where: { key: featureKey },
        select: { status: true },
      });

      // Fail closed - deny if not found or disabled
      if (!featureFlag || featureFlag.status !== 'ENABLED') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `Feature "${featureKey}" is not enabled`,
          cause: {
            feature: featureKey,
            status: featureFlag?.status || 'NOT_FOUND',
            code: 'FEATURE_DISABLED',
          },
        });
      }

      return next();
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      // Fail closed on errors - deny access
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Unable to verify feature "${featureKey}"`,
      });
    }
  });
};
```

### Usage with Feature Flags

```typescript
export const chatRouter = t.router({
  // Protect with feature flag
  getConversations: protectedProcedure
    .use(requireRoles(UserRole.ADMIN))
    .use(requireFeature('support-chat'))
    .query(async ({ ctx }) => {
      // Only accessible if 'support-chat' feature is enabled
    }),

  // Chain with other middleware
  createChannel: adminProcedure
    .use(requireFeature('team-channels'))
    .input(createChannelSchema)
    .mutation(async ({ ctx, input }) => {
      // Admin-only + feature flag protected
    }),
});
```

## Resource-Based Access Control

### requireResourceAccess Middleware

Check if user has access to specific resource:

```typescript
export interface RequireResourceAccessOptions {
  resourceType: string; // 'REQUEST', 'CONVERSATION', 'USER'
  accessLevel: AccessLevel; // READ, WRITE, ADMIN
  resourceIdKey?: string; // Key in input (default: 'id')
}

/**
 * Middleware for resource access control
 * Uses AccessControlService to verify ownership and permissions
 * Fail closed: denies access if resource not found or error occurs
 */
export const requireResourceAccess = (options: RequireResourceAccessOptions) => {
  const { resourceType, accessLevel, resourceIdKey = 'id' } = options;

  return t.middleware(async ({ ctx, next, input }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Extract resource ID from input
    const resourceId = (input as any)[resourceIdKey];

    if (!resourceId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Resource ID not provided in input.${resourceIdKey}`,
      });
    }

    try {
      // Check access using AccessControlService
      await ctx.accessControl.checkAccess({
        userId: ctx.user.id,
        userRole: ctx.user.role,
        resourceType,
        resourceId,
        requiredLevel: accessLevel,
      });

      return next();
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Insufficient permissions to ${accessLevel} ${resourceType}`,
        cause: {
          resourceType,
          resourceId,
          requiredLevel: accessLevel,
        },
      });
    }
  });
};
```

### Usage for Resource Access

```typescript
export const requestRouter = t.router({
  // Read access to request
  get: protectedProcedure
    .use(requireResourceAccess({
      resourceType: 'REQUEST',
      accessLevel: AccessLevel.READ,
      resourceIdKey: 'requestId',
    }))
    .input(z.object({ requestId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.requestsService.findOne(input.requestId);
    }),

  // Write access required
  update: protectedProcedure
    .use(requireResourceAccess({
      resourceType: 'REQUEST',
      accessLevel: AccessLevel.WRITE,
    }))
    .input(updateRequestSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.requestsService.update(input.id, input.data);
    }),

  // Admin access required
  delete: protectedProcedure
    .use(requireResourceAccess({
      resourceType: 'REQUEST',
      accessLevel: AccessLevel.ADMIN,
    }))
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.requestsService.remove(input.id);
    }),
});
```

## Middleware Composition

### Chaining Middleware

Stack multiple middleware in sequence:

```typescript
const updateRequest = t.procedure
  .use(requireAuth)                    // First: check authentication
  .use(requireRoles(UserRole.EMPLOYEE)) // Second: check role
  .use(requireFeature('requests-v2'))  // Third: check feature flag
  .use(requireResourceAccess({         // Fourth: check resource access
    resourceType: 'REQUEST',
    accessLevel: AccessLevel.WRITE,
  }))
  .input(updateRequestSchema)
  .mutation(async ({ ctx, input }) => {
    // All checks passed - execute mutation
  });
```

### Order Matters

Middleware executes in order - optimize for early exit:

```typescript
// ✅ Good: Fast checks first
const procedure = t.procedure
  .use(requireAuth)           // Fast: check context
  .use(requireFeature('foo')) // Medium: single DB query
  .use(requireResourceAccess({ // Slow: complex access check
    resourceType: 'REQUEST',
    accessLevel: AccessLevel.WRITE,
  }))
  .mutation(handler);

// ❌ Bad: Slow checks first
const procedure = t.procedure
  .use(requireResourceAccess({ // Runs even if user not authenticated
    resourceType: 'REQUEST',
    accessLevel: AccessLevel.WRITE,
  }))
  .use(requireAuth)
  .mutation(handler);
```

### Reusable Composed Procedures

Create commonly-used procedure combinations:

```typescript
// Admin with feature flag
const adminFeatureProcedure = (featureKey: string) =>
  adminProcedure.use(requireFeature(featureKey));

// Usage
export const chatRouter = t.router({
  createChannel: adminFeatureProcedure('team-channels')
    .input(createChannelSchema)
    .mutation(handler),

  deleteChannel: adminFeatureProcedure('team-channels')
    .input(z.object({ id: z.string() }))
    .mutation(handler),
});
```

## Rate Limiting

### Simple In-Memory Rate Limiter

```typescript
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = (options: { maxRequests: number; windowMs: number }) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      return next(); // Skip for unauthenticated
    }

    const key = `ratelimit:${ctx.user.id}`;
    const now = Date.now();

    let bucket = rateLimitStore.get(key);

    if (!bucket || now > bucket.resetAt) {
      bucket = {
        count: 1,
        resetAt: now + options.windowMs,
      };
      rateLimitStore.set(key, bucket);
      return next();
    }

    if (bucket.count >= options.maxRequests) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded',
        cause: {
          retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
        },
      });
    }

    bucket.count++;
    return next();
  });
};
```

### Usage

```typescript
// Rate-limited procedure
const sendEmail = protectedProcedure
  .use(rateLimit({ maxRequests: 10, windowMs: 60000 })) // 10 per minute
  .input(sendEmailSchema)
  .mutation(async ({ ctx, input }) => {
    await ctx.emailService.send(input);
  });
```

## Logging and Monitoring

### Request Logging Middleware

```typescript
const logRequest = t.middleware(async ({ ctx, path, type, next }) => {
  const start = Date.now();

  console.log('➡️', type, path, {
    user: ctx.user?.id,
    timestamp: new Date().toISOString(),
  });

  try {
    const result = await next();
    const duration = Date.now() - start;

    console.log('✅', type, path, {
      duration: `${duration}ms`,
      user: ctx.user?.id,
    });

    return result;
  } catch (error) {
    const duration = Date.now() - start;

    console.error('❌', type, path, {
      duration: `${duration}ms`,
      user: ctx.user?.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
});

// Apply to all procedures
export const procedure = t.procedure.use(logRequest);
```

## Error Handling in Middleware

### TRPCError Codes

Use appropriate error codes:

```typescript
// UNAUTHORIZED - Not authenticated
throw new TRPCError({
  code: 'UNAUTHORIZED',
  message: 'Authentication required',
});

// FORBIDDEN - Authenticated but insufficient permissions
throw new TRPCError({
  code: 'FORBIDDEN',
  message: 'Insufficient permissions',
});

// BAD_REQUEST - Invalid input
throw new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Resource ID not provided',
});

// NOT_FOUND - Resource doesn't exist
throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'Resource not found',
});

// TOO_MANY_REQUESTS - Rate limit exceeded
throw new TRPCError({
  code: 'TOO_MANY_REQUESTS',
  message: 'Rate limit exceeded',
  cause: { retryAfter: 60 },
});

// INTERNAL_SERVER_ERROR - Unexpected errors
throw new TRPCError({
  code: 'INTERNAL_SERVER_ERROR',
  message: 'Unable to process request',
});
```

### Error Context

Include helpful context in errors:

```typescript
throw new TRPCError({
  code: 'FORBIDDEN',
  message: `Feature "${featureKey}" is not enabled`,
  cause: {
    feature: featureKey,
    status: 'DISABLED',
    code: 'FEATURE_DISABLED',
  },
});
```

### Fail-Closed Security

Always fail closed on security checks:

```typescript
try {
  const hasAccess = await checkAccess();
  if (!hasAccess) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
} catch (error) {
  // Re-throw TRPCError as-is
  if (error instanceof TRPCError) throw error;

  // Deny access on any other error
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Unable to verify access',
  });
}
```

## Best Practices

1. **Order Middleware Efficiently**
   - Fast checks first (auth, feature flags)
   - Expensive checks last (database lookups, resource access)
   - Exit early on failures

2. **Reuse Middleware**
   - Create convenience procedures for common patterns
   - Compose middleware into reusable combinations
   - Keep middleware focused and single-purpose

3. **Fail Closed on Security**
   - Deny access if check fails or errors occur
   - Never assume access is granted by default
   - Log security denials for monitoring

4. **Provide Clear Error Messages**
   - Use appropriate TRPCError codes
   - Include helpful context in error causes
   - Guide users on how to resolve issues

5. **Type-Safe Context Extension**
   - Extend context in middleware for downstream type safety
   - Use `next({ ctx: { ...ctx, newField } })`
   - Leverage TypeScript for compile-time checks

6. **Test Middleware Thoroughly**
   - Test authentication failures
   - Test authorization edge cases
   - Test error handling paths
   - Verify fail-closed behavior

7. **Monitor and Log**
   - Log security-related events
   - Track rate limit hits
   - Monitor slow middleware performance
   - Alert on suspicious patterns

## Common Patterns

### Protected Admin Procedure

```typescript
const protectedAdminProcedure = adminProcedure
  .use(requireFeature('admin-panel'))
  .use(logRequest);
```

### Resource Update Pattern

```typescript
const updateResourceProcedure = (resourceType: string) =>
  protectedProcedure
    .use(requireResourceAccess({
      resourceType,
      accessLevel: AccessLevel.WRITE,
    }));
```

### Rate-Limited Public API

```typescript
const publicApiProcedure = t.procedure
  .use(rateLimit({ maxRequests: 100, windowMs: 60000 }))
  .use(logRequest);
```

## See Also

- [tRPC Design Patterns](./trpc-design-patterns.md)
- [Zod Validation Patterns](./zod-validation-patterns.md)
- [tRPC Error Patterns](../../error-handling-patterns/references/trpc-error-patterns.md)
- [Middleware Template](../../error-handling-patterns/templates/trpc-error-middleware.template.ts)
