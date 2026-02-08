# tRPC Design Patterns

Comprehensive guide to building production-ready tRPC APIs with TypeScript, based on patterns from the Alkitu Template project.

## Overview

tRPC provides end-to-end type safety from server to client without code generation. This guide covers router organization, procedure design, middleware patterns, and client integration based on real-world implementation.

## Router Organization

### Domain-Based Router Structure

Organize routers by business domain, not CRUD operations:

```
trpc/
├── trpc.ts                 # tRPC initialization
├── trpc.router.ts         # Root router composition
├── trpc.service.ts        # NestJS service integration
├── routers/               # Domain routers
│   ├── user.router.ts
│   ├── request.router.ts
│   ├── chat.router.ts
│   ├── notification.router.ts
│   ├── feature-flags.router.ts
│   └── theme.router.ts
├── schemas/               # Zod validation schemas
│   ├── user.schemas.ts
│   ├── request.schemas.ts
│   └── chat.schemas.ts
└── middlewares/          # Reusable middleware
    ├── auth.middleware.ts
    └── roles.middleware.ts
```

### Root Router Composition

**File:** `trpc/trpc.router.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { t } from './trpc';
import { createUserRouter } from './routers/user.router';
import { createRequestRouter } from './routers/request.router';
import { chatRouter } from './routers/chat.router';
import { createFeatureFlagsRouter } from './routers/feature-flags.router';

@Injectable()
export class TrpcRouter {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private emailService: EmailService,
    private featureFlagsService: FeatureFlagsService,
  ) {}

  appRouter() {
    return t.router({
      // Domain routers with service injection
      user: createUserRouter(this.usersService, this.emailService),
      request: createRequestRouter(),
      chat: chatRouter,
      featureFlags: createFeatureFlagsRouter(this.featureFlagsService),

      // Simple procedures can be inline
      hello: t.procedure
        .input(z.object({ name: z.string() }))
        .query(({ input }) => ({ greeting: `Hello ${input.name}!` })),
    });
  }
}

// Export type for client
export type AppRouter = ReturnType<TrpcRouter['appRouter']>;
```

### Router Factory Pattern

For routers requiring service injection:

```typescript
// routers/user.router.ts
import { t } from '../trpc';
import { UsersService } from '../../users/users.service';
import { EmailService } from '../../email/email.service';
import { createUserSchema, updateUserSchema } from '../schemas/user.schemas';

export function createUserRouter(
  usersService: UsersService,
  emailService: EmailService,
) {
  return t.router({
    list: t.procedure
      .input(listUsersSchema)
      .query(async ({ input }) => {
        return await usersService.findAll(input);
      }),

    create: t.procedure
      .input(createUserSchema)
      .mutation(async ({ input }) => {
        const user = await usersService.create(input);

        // Send welcome email (non-critical)
        try {
          await emailService.sendWelcomeEmail(user);
        } catch (error) {
          // Log but don't fail
          console.warn('Failed to send welcome email:', error);
        }

        return user;
      }),
  });
}
```

### Standalone Router Pattern

For routers with no external dependencies:

```typescript
// routers/request.router.ts
import { t } from '../trpc';
import { prisma } from '../prisma-singleton';
import { getFilteredRequestsSchema } from '../schemas/request.schemas';

export const requestRouter = t.router({
  getFiltered: t.procedure
    .input(getFilteredRequestsSchema)
    .query(async ({ input, ctx }) => {
      // Direct Prisma access
      return await ctx.prisma.request.findMany({
        where: buildWhereClause(input),
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      });
    }),
});
```

## Procedure Design

### Query Procedures

For reading data (idempotent, safe):

```typescript
export const userRouter = t.router({
  // Simple query
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

  // Paginated list query
  list: t.procedure
    .input(listUsersSchema)
    .query(async ({ input, ctx }) => {
      const { page, limit, role, search, sortBy, sortOrder } = input;

      const where: Prisma.UserWhereInput = {};
      if (role) where.role = role;
      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { firstname: { contains: search, mode: 'insensitive' } },
          { lastname: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await Promise.all([
        ctx.prisma.user.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
            createdAt: true,
          },
        }),
        ctx.prisma.user.count({ where }),
      ]);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    }),
});
```

### Mutation Procedures

For modifying data:

```typescript
export const userRouter = t.router({
  // Create
  create: t.procedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.usersService.create(input);
    }),

  // Update
  update: t.procedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      return await ctx.prisma.user.update({
        where: { id },
        data,
      });
    }),

  // Delete (soft delete)
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
      });

      return { success: true };
    }),

  // Complex mutation with transaction
  transferOwnership: t.procedure
    .input(z.object({
      fromUserId: z.string(),
      toUserId: z.string(),
      resourceIds: z.array(z.string()),
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.$transaction(async (tx) => {
        // Verify both users exist
        const [fromUser, toUser] = await Promise.all([
          tx.user.findUnique({ where: { id: input.fromUserId } }),
          tx.user.findUnique({ where: { id: input.toUserId } }),
        ]);

        if (!fromUser || !toUser) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'One or both users not found',
          });
        }

        // Transfer all resources
        await tx.request.updateMany({
          where: { id: { in: input.resourceIds } },
          data: { userId: input.toUserId },
        });

        return { success: true, transferred: input.resourceIds.length };
      });
    }),
});
```

## Context Patterns

### Basic Context

```typescript
// trpc/trpc.ts
export interface Context {
  prisma: PrismaService;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const t = initTRPC.context<Context>().create();
```

### Extended Context with Services

```typescript
export interface Context {
  // Core services
  prisma: PrismaService;

  // Business services
  chatService: ChatService;
  accessControl: AccessControlService;
  notificationService: NotificationService;

  // User context
  user?: {
    id: string;
    email: string;
    role: string;
  };

  // Request metadata
  req: Request;
  res: Response;
}
```

### Context Creation

```typescript
// trpc/trpc.service.ts
@Injectable()
export class TrpcService {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  applyMiddleware(app: INestApplication) {
    app.use(
      '/trpc',
      trpcExpress.createExpressMiddleware({
        router: this.trpcRouter.appRouter(),
        createContext: ({ req, res }): Context => {
          // Parse authentication token
          const token = this.extractToken(req);
          let user: Context['user'] | undefined;

          if (token) {
            try {
              const decoded = this.jwtService.verify(token);
              user = {
                id: decoded.sub || decoded.id,
                email: decoded.email,
                role: decoded.role,
              };
            } catch {
              // Invalid token - continue as unauthenticated
            }
          }

          return {
            prisma: this.prisma,
            chatService: this.chatService,
            user,
            req,
            res,
          };
        },
      }),
    );
  }

  private extractToken(req: any): string | undefined {
    // Try cookie first
    if (req.cookies?.['auth-token']) {
      return req.cookies['auth-token'];
    }

    // Try Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    return undefined;
  }
}
```

## Pagination Strategies

### Offset-Based Pagination

Standard approach for most use cases:

```typescript
const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export const listProcedure = t.procedure
  .input(paginationSchema)
  .query(async ({ input, ctx }) => {
    const { page, limit } = input;
    const offset = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ctx.prisma.item.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      ctx.prisma.item.count(),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: offset + limit < total,
        hasPrev: page > 1,
      },
    };
  });
```

### Cursor-Based Pagination

For infinite scroll and real-time feeds:

```typescript
const cursorSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
});

export const listInfinite = t.procedure
  .input(cursorSchema)
  .query(async ({ input, ctx }) => {
    const { cursor, limit } = input;

    const items = await ctx.prisma.item.findMany({
      take: limit + 1, // Fetch one extra to check if there's more
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: string | undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem!.id;
    }

    return {
      items,
      nextCursor,
    };
  });
```

## Filtering and Sorting

```typescript
const filterSchema = z.object({
  // Pagination
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),

  // Filters
  status: z.nativeEnum(RequestStatus).optional(),
  userId: z.string().optional(),
  serviceId: z.string().optional(),
  search: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),

  // Sorting
  sortBy: z.enum(['createdAt', 'updatedAt', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const getFiltered = t.procedure
  .input(filterSchema)
  .query(async ({ input, ctx }) => {
    const { page, limit, status, userId, search, dateFrom, dateTo, sortBy, sortOrder } = input;

    // Build where clause
    const where: Prisma.RequestWhereInput = {};

    if (status) where.status = status;
    if (userId) where.userId = userId;

    if (search) {
      where.OR = [
        { note: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [items, total] = await Promise.all([
      ctx.prisma.request.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: { select: { id: true, email: true, firstname: true, lastname: true } },
          service: { select: { id: true, name: true } },
        },
      }),
      ctx.prisma.request.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  });
```

## Best Practices

1. **Router Organization**
   - Organize by domain, not CRUD
   - Keep routers focused and cohesive
   - Use factory functions for service injection

2. **Procedure Design**
   - Use `.query()` for reads, `.mutation()` for writes
   - Always validate inputs with Zod
   - Return consistent response structures
   - Include pagination for lists

3. **Error Handling**
   - Use TRPCError with appropriate codes
   - Provide helpful error messages
   - Include error context in cause field
   - Handle errors at the right level

4. **Performance**
   - Use parallel queries with Promise.all()
   - Implement pagination for large datasets
   - Use Prisma select to fetch only needed fields
   - Use database indexes appropriately

5. **Type Safety**
   - Export AppRouter type for client
   - Use Zod schema inference
   - Share types via @alkitu/shared package
   - Leverage TypeScript strict mode

## See Also

- [Zod Validation Patterns](./zod-validation-patterns.md)
- [Middleware Patterns](./middleware-patterns.md)
- [tRPC Error Patterns](../../error-handling-patterns/references/trpc-error-patterns.md)
- [tRPC Router Template](../templates/trpc-router.template.ts)
