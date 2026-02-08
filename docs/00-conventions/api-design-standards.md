# API Design Standards

**Status**: ✅ Active Convention
**Last Updated**: 2024-01-29
**Owned By**: Backend Team
**AI Skill Reference**: `.claude/skills/api-design-principles/SKILL.md`

## Purpose

This document establishes standardized API design practices for the Alkitu Template project, covering tRPC (primary), NestJS REST (secondary), and GraphQL (tertiary) APIs.

## API Layer Hierarchy

### Primary: tRPC

**Use For**:
- ✅ Internal frontend-to-backend communication (Next.js → NestJS)
- ✅ Type-safe API calls with shared types
- ✅ Rapid development with automatic type inference
- ✅ Complex nested data structures
- ✅ Real-time features (subscriptions)

**Stats**: 13+ routers, 2200+ lines of router code

**Reference**: `.claude/skills/api-design-principles/references/trpc-design-patterns.md`

### Secondary: NestJS REST

**Use For**:
- ✅ Public APIs for external clients
- ✅ Mobile apps (non-TypeScript)
- ✅ Webhook endpoints for third-party integrations
- ✅ File uploads/downloads
- ✅ Traditional authentication flows
- ✅ OpenAPI/Swagger documentation requirements

**Reference**: `.claude/skills/api-design-principles/references/nestjs-rest-patterns.md`

### Tertiary: GraphQL

**Use For**:
- ✅ Complex relational queries
- ✅ Mobile apps requiring flexible data fetching
- ✅ Data aggregation across multiple resources

**Note**: Not covered extensively in this document. See existing GraphQL schema design patterns.

## tRPC Design Standards

### Router Organization

**Pattern**: Domain-based, not CRUD-based

**Structure**:
```
trpc/
├── trpc.ts                 # tRPC initialization
├── trpc.router.ts         # Root router composition
├── routers/               # Domain routers
│   ├── user.router.ts
│   ├── request.router.ts
│   ├── chat.router.ts
│   ├── feature-flags.router.ts
│   └── theme.router.ts
├── schemas/               # Zod validation schemas
│   ├── user.schemas.ts
│   ├── request.schemas.ts
│   └── chat.schemas.ts
└── middlewares/          # Reusable middleware
    └── roles.middleware.ts
```

**Example**:
```typescript
// ✅ Good: Domain-based
export const requestRouter = t.router({
  list,
  get,
  create,
  update,
  delete,
  assign,
  cancel,
  complete,
});

// ❌ Bad: CRUD-based
export const createRouter = t.router({
  user,
  request,
  service,
});
```

### Router Patterns

**Standalone Router** (No service dependencies):
```typescript
export const resourceRouter = t.router({
  list: t.procedure
    .input(listResourcesSchema)
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.resource.findMany();
    }),
});
```

**Factory Router** (With service injection):
```typescript
export function createResourceRouter(resourceService: ResourceService) {
  return t.router({
    list: t.procedure
      .input(listResourcesSchema)
      .query(async ({ input }) => {
        return await resourceService.findAll(input);
      }),
  });
}
```

**Template**: `.claude/skills/api-design-principles/templates/trpc-router.template.ts`

### Procedure Design

**Query** (Read operations - idempotent, safe):
```typescript
// List with pagination
list: t.procedure
  .input(listResourcesSchema)
  .query(async ({ input, ctx }) => {
    const [items, total] = await Promise.all([
      ctx.prisma.resource.findMany({ ... }),
      ctx.prisma.resource.count({ ... }),
    ]);

    return {
      items,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
        totalPages: Math.ceil(total / input.limit),
      },
    };
  }),

// Single resource
get: t.procedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const resource = await ctx.prisma.resource.findUnique({
      where: { id: input.id },
    });

    if (!resource) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Resource with ID ${input.id} not found`,
      });
    }

    return resource;
  }),
```

**Mutation** (Write operations):
```typescript
// Create
create: t.procedure
  .use(requireRoles(UserRole.EMPLOYEE, UserRole.ADMIN))
  .input(createResourceSchema)
  .mutation(async ({ input, ctx }) => {
    return await ctx.prisma.resource.create({ data: input });
  }),

// Update
update: t.procedure
  .use(requireResourceAccess({
    resourceType: 'RESOURCE',
    accessLevel: AccessLevel.WRITE,
  }))
  .input(updateResourceSchema)
  .mutation(async ({ input, ctx }) => {
    const { id, ...data } = input;
    return await ctx.prisma.resource.update({
      where: { id },
      data,
    });
  }),

// Delete (soft delete)
delete: t.procedure
  .use(requireRoles(UserRole.ADMIN))
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    await ctx.prisma.resource.update({
      where: { id: input.id },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  }),
```

### Middleware Standards

**Authentication**:
```typescript
const requireAuth = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
```

**Role-Based Access Control**:
```typescript
const requireRoles = (...roles: UserRole[]) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    if (!hasRole(ctx.user.role, roles)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Required roles: ${roles.join(', ')}`,
      });
    }

    return next();
  });
};
```

**Feature Flags**:
```typescript
const requireFeature = (featureKey: string) => {
  return t.middleware(async ({ ctx, next }) => {
    const featureFlag = await ctx.prisma.featureFlag.findUnique({
      where: { key: featureKey },
    });

    if (!featureFlag || featureFlag.status !== 'ENABLED') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Feature "${featureKey}" is not enabled`,
      });
    }

    return next();
  });
};
```

**Resource Access**:
```typescript
const requireResourceAccess = (options: {
  resourceType: string;
  accessLevel: AccessLevel;
  resourceIdKey?: string;
}) => {
  return t.middleware(async ({ ctx, next, input }) => {
    // Check if user has access to specific resource
    await ctx.accessControl.checkAccess({
      userId: ctx.user.id,
      resourceType: options.resourceType,
      resourceId: input[options.resourceIdKey || 'id'],
      requiredLevel: options.accessLevel,
    });

    return next();
  });
};
```

**Reference**: `.claude/skills/api-design-principles/references/middleware-patterns.md`

**Template**: `.claude/skills/api-design-principles/templates/middleware-rbac.template.ts`

### Zod Validation Standards

**Schema Organization**:
- One schema file per router domain
- Export both schema and inferred type
- Use descriptive names (createUserSchema, not userInput)

**Reusable Components**:
```typescript
// Pagination schema (reuse across routers)
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Sorting schema
export const sortingSchema = z.object({
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Compose into specific schemas
export const listUsersSchema = paginationSchema
  .merge(sortingSchema)
  .extend({
    role: z.nativeEnum(UserRole).optional(),
    search: z.string().optional(),
  });
```

**Enum Handling**:
```typescript
// Use z.nativeEnum() for Prisma enums
import { RequestStatus } from '@prisma/client';

export const updateStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(RequestStatus),
});

// Use z.enum() for string literals
export const sortOrderSchema = z.enum(['asc', 'desc']);
```

**Type Inference**:
```typescript
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstname: z.string(),
  lastname: z.string(),
});

// Always export inferred type
export type CreateUserInput = z.infer<typeof createUserSchema>;
```

**Reference**: `.claude/skills/api-design-principles/references/zod-validation-patterns.md`

**Template**: `.claude/skills/api-design-principles/templates/trpc-schema.template.ts`

### Pagination Patterns

**Offset-Based** (Standard):
```typescript
const listSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Implementation
const [items, total] = await Promise.all([
  ctx.prisma.resource.findMany({
    skip: (input.page - 1) * input.limit,
    take: input.limit,
  }),
  ctx.prisma.resource.count(),
]);

return {
  items,
  pagination: {
    page: input.page,
    limit: input.limit,
    total,
    totalPages: Math.ceil(total / input.limit),
    hasNext: input.page < Math.ceil(total / input.limit),
    hasPrev: input.page > 1,
  },
};
```

**Cursor-Based** (Infinite scroll):
```typescript
const cursorSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
});

// Implementation
const items = await ctx.prisma.resource.findMany({
  take: input.limit + 1, // Fetch one extra
  cursor: input.cursor ? { id: input.cursor } : undefined,
  orderBy: { createdAt: 'desc' },
});

let nextCursor: string | undefined;
if (items.length > input.limit) {
  const nextItem = items.pop();
  nextCursor = nextItem!.id;
}

return { items, nextCursor };
```

## NestJS REST Standards

### When to Use REST

**Decision Matrix**:

| Use Case | tRPC | REST |
|----------|------|------|
| Next.js frontend → NestJS backend | ✅ | ❌ |
| React Native/Flutter app → backend | ❌ | ✅ |
| Third-party webhook | ❌ | ✅ |
| Admin dashboard (internal) | ✅ | ❌ |
| Partner API integration | ❌ | ✅ |
| Authentication endpoints | ❌ | ✅ |
| File uploads | ❌ | ✅ |

### Controller Organization

**Pattern**: Domain-based routes

```typescript
@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get()        // GET /users
  @Get(':id')   // GET /users/:id
  @Post()       // POST /users
  @Patch(':id') // PATCH /users/:id
  @Delete(':id')// DELETE /users/:id

  // Custom actions
  @Post(':id/activate')   // POST /users/:id/activate
  @Get('stats/overview')  // GET /users/stats/overview
}
```

### Guard Usage

**Order**: Authentication → Authorization → Resource Access

```typescript
// ✅ Correct order
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Delete(':id')
async deleteUser(@Param('id') id: string) {}

// ❌ Wrong order
@UseGuards(RolesGuard, JwtAuthGuard) // Role check before auth!
```

### Swagger Documentation

**Required for all public REST endpoints**:

```typescript
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        access_token: 'eyJhbG...',
        user: { id: '...', email: '...' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async register(@Body() createUserDto: CreateUserDto) {}
}
```

**Reference**: `.claude/skills/api-design-principles/references/nestjs-rest-patterns.md`

**Templates**:
- **Controller**: `.claude/skills/api-design-principles/templates/nestjs-controller.template.ts`
- **Service**: `.claude/skills/api-design-principles/templates/nestjs-service.template.ts`

## Best Practices

### ✅ DO

1. **Use tRPC for internal APIs**
   - Next.js frontend → NestJS backend
   - Leverage end-to-end type safety
   - Share types via `@alkitu/shared`

2. **Organize by domain, not CRUD**
   - `user.router.ts` not `create.router.ts`
   - Group related operations together
   - Keep routers focused and cohesive

3. **Always validate inputs with Zod**
   - Never trust unvalidated data
   - Use specific validators (.email(), .url(), .uuid())
   - Add constraints (.min(), .max(), .regex())

4. **Return consistent response structures**
   - Include pagination metadata
   - Use standardized error format
   - Type responses with Zod inference

5. **Use middleware for cross-cutting concerns**
   - Authentication, authorization
   - Feature flags, rate limiting
   - Logging, monitoring

6. **Implement proper pagination**
   - Offset-based for standard use cases
   - Cursor-based for infinite scroll
   - Always include total count

7. **Document public REST APIs with Swagger**
   - All endpoints must have @ApiOperation
   - Include example responses
   - Document error cases

8. **Use transactions for multi-step operations**
   ```typescript
   return this.prisma.$transaction(async (tx) => {
     const request = await tx.request.update({ ... });
     await tx.notification.create({ ... });
     return request;
   });
   ```

### ❌ DON'T

1. **Don't use REST for internal APIs**
   - Prefer tRPC for Next.js → NestJS
   - Only use REST when required (external, mobile, webhooks)

2. **Don't skip input validation**
   ```typescript
   // ❌ Bad
   async create(input: any) {
     return await this.prisma.user.create({ data: input });
   }

   // ✅ Good
   async create(input: CreateUserInput) {
     // input is validated by Zod schema
     return await this.prisma.user.create({ data: input });
   }
   ```

3. **Don't hardcode pagination limits**
   ```typescript
   // ❌ Bad
   .take(20)

   // ✅ Good
   .take(input.limit)
   ```

4. **Don't fetch more data than needed**
   ```typescript
   // ❌ Bad - fetches all fields
   await this.prisma.user.findMany();

   // ✅ Good - only needed fields
   await this.prisma.user.findMany({
     select: {
       id: true,
       email: true,
       firstname: true,
       lastname: true,
     },
   });
   ```

5. **Don't create routers without schemas**
   - Every router should have a corresponding schema file
   - Co-locate schemas with routers (schemas/ folder)

6. **Don't mix authentication and authorization**
   ```typescript
   // ❌ Bad - checking role in route handler
   async deleteUser(id: string, currentUser: User) {
     if (currentUser.role !== 'ADMIN') {
       throw new ForbiddenException();
     }
     // ...
   }

   // ✅ Good - use middleware
   delete: adminProcedure
     .input(z.object({ id: z.string() }))
     .mutation(async ({ input, ctx }) => {
       // Admin check already done by middleware
     }),
   ```

## Performance Considerations

1. **Use parallel queries with Promise.all()**
   ```typescript
   const [items, total] = await Promise.all([
     ctx.prisma.resource.findMany({ ... }),
     ctx.prisma.resource.count({ ... }),
   ]);
   ```

2. **Implement database indexes**
   - Index frequently queried fields
   - Composite indexes for multi-field queries
   - Document indexes in schema

3. **Use Prisma select to limit fields**
   - Only fetch what you need
   - Reduces payload size
   - Improves query performance

4. **Cache frequently accessed data**
   - Redis for session data
   - In-memory cache for config
   - Consider stale-while-revalidate

5. **Implement rate limiting**
   - Protect sensitive endpoints
   - Different limits for different operations
   - Use Redis for distributed rate limiting

## Testing Standards

### Unit Tests

```typescript
describe('RequestsService', () => {
  it('should create a request', async () => {
    const input = { ... };
    const result = await service.create(input, 'user-id');
    expect(result).toMatchObject({ ... });
  });

  it('should throw NotFoundException when request not found', async () => {
    await expect(service.findOne('invalid-id')).rejects.toThrow(
      NotFoundException
    );
  });
});
```

### Integration Tests

```typescript
describe('tRPC request router', () => {
  it('should create a request', async () => {
    const input = createRequestSchema.parse({ ... });
    const result = await caller.request.create(input);
    expect(result).toMatchObject({ ... });
  });

  it('should require authentication', async () => {
    const unauthenticatedCaller = createCaller({ user: null });
    await expect(
      unauthenticatedCaller.request.create(input)
    ).rejects.toThrow('Authentication required');
  });
});
```

## Client Usage

### React Query with tRPC

```typescript
// Query
const { data, isLoading, error } = trpc.request.list.useQuery({
  page: 1,
  limit: 20,
  status: 'PENDING',
});

// Mutation
const createRequest = trpc.request.create.useMutation({
  onSuccess: (data) => {
    toast.success('Request created');
    queryClient.invalidateQueries(['request', 'list']);
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

// Execute mutation
createRequest.mutate({
  serviceId: 'service-id',
  userId: 'user-id',
  // ... fully typed
});
```

## Migration Guide

### From REST to tRPC

1. Create Zod schema from DTO
2. Create tRPC router from controller
3. Move business logic to service (if not already there)
4. Update frontend to use tRPC client
5. Remove REST controller once migration complete

### From Python/FastAPI to TypeScript/tRPC

1. Identify Pydantic models → Create Zod schemas
2. Convert FastAPI routes → tRPC procedures
3. Map Python dependencies → NestJS services
4. Update error handling → TRPCError
5. Migrate middleware → tRPC middleware

## References

### AI Skills
- **Main Skill**: `.claude/skills/api-design-principles/SKILL.md`
- **tRPC Patterns**: `.claude/skills/api-design-principles/references/trpc-design-patterns.md`
- **Zod Validation**: `.claude/skills/api-design-principles/references/zod-validation-patterns.md`
- **Middleware**: `.claude/skills/api-design-principles/references/middleware-patterns.md`
- **NestJS REST**: `.claude/skills/api-design-principles/references/nestjs-rest-patterns.md`

### Templates
- **tRPC Router**: `.claude/skills/api-design-principles/templates/trpc-router.template.ts`
- **tRPC Schema**: `.claude/skills/api-design-principles/templates/trpc-schema.template.ts`
- **NestJS Controller**: `.claude/skills/api-design-principles/templates/nestjs-controller.template.ts`
- **RBAC Middleware**: `.claude/skills/api-design-principles/templates/middleware-rbac.template.ts`
- **NestJS Service**: `.claude/skills/api-design-principles/templates/nestjs-service.template.ts`

### Related Conventions
- [Error Handling Standards](./error-handling-standards.md)
- [Testing Strategy](../05-testing/backend-testing-guide.md)

## Changelog

- **2024-01-29**: Initial version - Adapted from Python/FastAPI to TypeScript/NestJS/tRPC stack
