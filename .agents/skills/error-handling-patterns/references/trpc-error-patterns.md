# tRPC Error Patterns

Guide to error handling in tRPC for building type-safe, robust APIs.

## Overview

tRPC provides `TRPCError` for throwing errors in procedures and middleware. These errors are automatically serialized and typed on the client, providing end-to-end type safety.

## TRPCError Error Codes

### Available Error Codes

| Code | HTTP Status | Use Case |
|------|-------------|----------|
| `BAD_REQUEST` | 400 | Invalid input data, malformed requests |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Authenticated but insufficient permissions |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `TIMEOUT` | 408 | Request took too long |
| `CONFLICT` | 409 | Resource already exists, state conflict |
| `PRECONDITION_FAILED` | 412 | Precondition not met |
| `PAYLOAD_TOO_LARGE` | 413 | Request payload exceeds limit |
| `METHOD_NOT_SUPPORTED` | 405 | HTTP method not allowed |
| `UNPROCESSABLE_CONTENT` | 422 | Semantic errors in request |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded |
| `CLIENT_CLOSED_REQUEST` | 499 | Client cancelled request |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## Basic Usage

### Throwing TRPCError

```typescript
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const userRouter = t.router({
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `User with ID ${input.id} not found`,
        });
      }

      return user;
    }),

  create: t.procedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.usersService.create(input);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : 'Failed to create user';

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
          cause: error, // Include original error for logging
        });
      }
    }),
});
```

### Error with Metadata

```typescript
throw new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Invalid user age',
  cause: {
    field: 'age',
    value: input.age,
    constraint: 'Must be 18 or older',
  },
});
```

## Middleware Error Handling

### Authentication Middleware

```typescript
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
export const protectedProcedure = t.procedure.use(requireAuth);
```

### Role-Based Authorization

```typescript
import { UserRole } from '@alkitu/shared';

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

// Convenience procedures
export const adminProcedure = t.procedure.use(requireRoles(UserRole.ADMIN));
export const employeeProcedure = t.procedure.use(
  requireRoles(UserRole.EMPLOYEE, UserRole.ADMIN)
);
```

### Feature Flag Protection

```typescript
export const requireFeature = (featureKey: string) => {
  return t.middleware(async ({ ctx, next }) => {
    try {
      const featureFlag = await ctx.prisma.featureFlag.findUnique({
        where: { key: featureKey },
        select: { status: true },
      });

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

      // Fail closed (deny access on errors)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Unable to verify feature "${featureKey}"`,
      });
    }
  });
};

// Usage
export const chatRouter = t.router({
  getConversations: t.procedure
    .use(requireFeature('support-chat'))
    .input(getConversationsSchema)
    .query(async ({ input, ctx }) => {
      return await ctx.chatService.getConversations(input);
    }),
});
```

### Resource Access Control

```typescript
export interface RequireResourceAccessOptions {
  resourceType: string; // 'REQUEST', 'CONVERSATION', 'USER'
  accessLevel: 'READ' | 'WRITE' | 'ADMIN';
  resourceIdKey?: string; // Key in input (default: 'id')
}

export const requireResourceAccess = (options: RequireResourceAccessOptions) => {
  const { resourceType, accessLevel, resourceIdKey = 'id' } = options;

  return t.middleware(async ({ ctx, next, input }) => {
    if (!ctx.user) {
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
      const hasAccess = await ctx.accessControl.checkAccess({
        userId: ctx.user.id,
        resourceType,
        resourceId,
        accessLevel,
      });

      if (!hasAccess) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `Insufficient permissions to ${accessLevel} ${resourceType}`,
          cause: {
            userId: ctx.user.id,
            resourceType,
            resourceId,
            accessLevel,
          },
        });
      }

      return next();
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      // Fail closed on access check errors
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unable to verify resource access',
      });
    }
  });
};

// Usage
export const requestRouter = t.router({
  update: t.procedure
    .use(requireResourceAccess({
      resourceType: 'REQUEST',
      accessLevel: 'WRITE',
      resourceIdKey: 'id',
    }))
    .input(updateRequestSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.request.update({
        where: { id: input.id },
        data: input,
      });
    }),
});
```

## Client-Side Error Handling

### React Query with tRPC

```typescript
'use client';

import { trpc } from '@/lib/trpc';
import { useToast } from '@/components/primitives/ui/use-toast';

export function UserProfile() {
  const { toast } = useToast();

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    },

    onError: (error) => {
      // Handle specific error codes
      if (error.data?.code === 'UNAUTHORIZED') {
        toast({
          title: 'Session Expired',
          description: 'Please log in again',
          variant: 'destructive',
        });
        // Redirect to login
        return;
      }

      if (error.data?.code === 'FORBIDDEN') {
        toast({
          title: 'Access Denied',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      // Generic error handling
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  return (
    <button
      onClick={() => updateProfile.mutate({ name: 'New Name' })}
      disabled={updateProfile.isPending}
    >
      {updateProfile.isPending ? 'Saving...' : 'Save'}
    </button>
  );
}
```

### Query Error States

```typescript
export function UserList() {
  const { data, error, isLoading, isError } = trpc.user.list.useQuery();

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (isError) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
        <h3 className="font-semibold text-destructive">Error Loading Users</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {error.message}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-sm text-primary hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <div>{/* render users */}</div>;
}
```

### Optimistic Updates with Error Rollback

```typescript
export function TodoList() {
  const utils = trpc.useContext();
  const { toast } = useToast();

  const toggleTodo = trpc.todo.toggle.useMutation({
    onMutate: async ({ id }) => {
      // Cancel outgoing refetches
      await utils.todo.list.cancel();

      // Snapshot previous value
      const previousTodos = utils.todo.list.getData();

      // Optimistically update
      utils.todo.list.setData(undefined, (old) =>
        old?.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );

      return { previousTodos };
    },

    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        utils.todo.list.setData(undefined, context.previousTodos);
      }

      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },

    onSettled: () => {
      // Refetch after error or success
      utils.todo.list.invalidate();
    },
  });

  return <div>{/* render todos */}</div>;
}
```

## Error Transformation Patterns

### Converting NestJS Exceptions

```typescript
// In router
try {
  return await ctx.usersService.findById(input.id);
} catch (error) {
  // Convert NestJS HTTP exceptions to TRPCError
  if (error instanceof NotFoundException) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: error.message,
    });
  }

  if (error instanceof BadRequestException) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedException) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: error.message,
    });
  }

  // Generic server error
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An error occurred',
    cause: error,
  });
}
```

### Prisma Error Transformation

```typescript
import { Prisma } from '@prisma/client';

try {
  return await ctx.prisma.user.create({ data: input });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'A user with this email already exists',
        cause: { field: error.meta?.target },
      });
    }

    if (error.code === 'P2025') {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Record not found',
      });
    }
  }

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Database error occurred',
    cause: error,
  });
}
```

## Best Practices

1. **Use Specific Error Codes**: Choose the most accurate code for the error type
2. **Include Context**: Add `cause` field with debugging information
3. **User-Friendly Messages**: Write clear, actionable error messages
4. **Fail Closed**: Deny access when authorization/feature checks fail
5. **Log Errors**: Use `cause` field for detailed server-side logging
6. **Type Safety**: Leverage TypeScript to catch errors at compile time
7. **Client Handling**: Always handle errors in mutations and queries
8. **Optimistic Updates**: Use rollback patterns for better UX

## Common Patterns

### Error Factory Functions

```typescript
export const createNotFoundError = (resource: string, id: string) => {
  return new TRPCError({
    code: 'NOT_FOUND',
    message: `${resource} with ID ${id} not found`,
    cause: { resource, id },
  });
};

export const createValidationError = (field: string, message: string) => {
  return new TRPCError({
    code: 'BAD_REQUEST',
    message: `Validation failed: ${message}`,
    cause: { field, constraint: message },
  });
};

// Usage
if (!user) {
  throw createNotFoundError('User', input.id);
}
```

### Error Logging

```typescript
import { Logger } from '@nestjs/common';

const logger = new Logger('tRPC');

try {
  return await operation();
} catch (error) {
  logger.error(
    `Operation failed: ${error instanceof Error ? error.message : 'Unknown'}`,
    error instanceof Error ? error.stack : undefined,
  );

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Operation failed',
    cause: error,
  });
}
```

## Testing

### Testing Error Scenarios

```typescript
import { createCallerFactory } from '@trpc/server';
import { appRouter } from './trpc.router';

describe('User Router', () => {
  const createCaller = createCallerFactory(appRouter);

  it('should throw NOT_FOUND for non-existent user', async () => {
    const caller = createCaller({ prisma: mockPrisma, user: null });

    await expect(
      caller.user.getById({ id: 'non-existent' })
    ).rejects.toThrow('User with ID non-existent not found');
  });

  it('should throw UNAUTHORIZED when not authenticated', async () => {
    const caller = createCaller({ prisma: mockPrisma, user: null });

    await expect(
      caller.user.updateProfile({ name: 'New Name' })
    ).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
  });
});
```

## See Also

- [NestJS Exception Filters](./nestjs-exception-filters.md)
- [Prisma Error Handling](./prisma-error-handling.md)
- [tRPC Error Middleware Template](../templates/trpc-error-middleware.template.ts)
- [React Error Boundaries](./react-error-boundaries.md)
