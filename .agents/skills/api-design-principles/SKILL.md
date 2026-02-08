---
name: api-design-principles
description: Master tRPC, NestJS REST, and GraphQL API design to build type-safe, scalable, and maintainable APIs. Use when designing new APIs, establishing standards, or reviewing API specifications for TypeScript/Node.js applications.
---

# API Design Principles

Build type-safe, intuitive, and scalable APIs using tRPC, NestJS REST, and GraphQL that delight developers and stand the test of time.

## When to Use This Skill

- Designing new tRPC routers or NestJS REST endpoints
- Establishing API design standards for your team
- Reviewing API specifications before implementation
- Migrating between API paradigms (REST to tRPC, etc.)
- Creating developer-friendly API documentation
- Optimizing APIs for specific use cases (mobile, web, third-party integrations)
- Implementing authentication and authorization patterns
- Designing pagination, filtering, and sorting strategies

## Core Concepts

### 1. tRPC Design Principles

**Type-Safe RPC Framework:**

- End-to-end type safety from server to client
- No code generation required - TypeScript inference
- Zod schema validation for inputs
- Router-based organization by domain
- Middleware for cross-cutting concerns
- Automatic serialization/deserialization

**When to Use tRPC:**
- Internal APIs (same TypeScript codebase)
- Type-safe client-server communication
- Real-time type inference across stack
- Rapid development with full type safety

### 2. NestJS REST Principles

**Resource-Oriented Architecture:**

- Resources are nouns (users, orders, products)
- HTTP methods for actions (GET, POST, PUT, PATCH, DELETE)
- URLs represent resource hierarchies
- Consistent naming conventions

**When to Use REST:**
- Public APIs for third-party integrations
- APIs consumed by non-TypeScript clients
- Standard HTTP caching strategies
- OpenAPI/Swagger documentation requirements

### 3. GraphQL Design Principles

**Schema-First Development:**

- Types define domain model
- Queries for reading data
- Mutations for modifying data
- Subscriptions for real-time updates
- Strongly typed schema with introspection

**When to Use GraphQL:**
- Complex data fetching requirements
- Multiple related resources in single request
- Client-driven data requirements
- Real-time subscriptions

## tRPC API Design (PRIMARY)

### Router Organization

Organize routers by domain/feature, not by CRUD operations.

```typescript
// trpc/trpc.router.ts - Root router composition
@Injectable()
export class TrpcRouter {
  appRouter() {
    return t.router({
      // Domain-based routers
      user: createUserRouter(this.usersService, this.emailService),
      request: createRequestRouter(),
      chat: chatRouter,
      notification: createNotificationRouter(this.notificationService),
      featureFlags: createFeatureFlagsRouter(this.featureFlagsService),
      theme: createThemeRouter(this.themeService),

      // Simple health check
      hello: t.procedure
        .input(z.object({ name: z.string() }))
        .query(({ input }) => ({ greeting: `Hello ${input.name}!` })),
    });
  }
}

export type AppRouter = ReturnType<TrpcRouter['appRouter']>;
```

### Procedure Types

**Query vs Mutation:**

```typescript
export const userRouter = t.router({
  // Queries - for reading data (idempotent, cacheable)
  list: t.procedure
    .input(listUsersSchema)
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findMany({
        where: buildWhereClause(input),
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      });
    }),

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

  // Mutations - for modifying data
  create: t.procedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.usersService.create(input);
    }),

  update: t.procedure
    .input(updateUserSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.update({
        where: { id: input.id },
        data: input,
      });
    }),

  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});
```

### Zod Schema Validation

**Organize schemas in separate files:**

```typescript
// trpc/schemas/user.schemas.ts
import { z } from 'zod';
import { UserRole } from '@alkitu/shared';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(UserRole).default(UserRole.CLIENT),
  phone: z.string().optional(),
});

export const updateUserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  phone: z.string().optional(),
});

export const listUsersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  role: z.nativeEnum(UserRole).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'email', 'lastname']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type inference from schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ListUsersInput = z.infer<typeof listUsersSchema>;
```

### Middleware Patterns

**Authentication Middleware:**

```typescript
// trpc/middlewares/auth.middleware.ts
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

export const protectedProcedure = t.procedure.use(requireAuth);
```

**Role-Based Access Control:**

```typescript
// trpc/middlewares/roles.middleware.ts
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
        message: `Required roles: ${roles.join(', ')}`,
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

**Feature Flag Protection:**

```typescript
export const requireFeature = (featureKey: string) => {
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

### Pagination Pattern

**Standard offset-based pagination:**

```typescript
// trpc/schemas/request.schemas.ts
export const getFilteredRequestsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.nativeEnum(RequestStatus).optional(),
  userId: z.string().optional(),
  serviceId: z.string().optional(),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// trpc/routers/request.router.ts
export const requestRouter = t.router({
  getFiltered: t.procedure
    .input(getFilteredRequestsSchema)
    .query(async ({ input, ctx }) => {
      const { page, limit, status, userId, sortBy, sortOrder } = input;

      // Build where clause
      const where: Prisma.RequestWhereInput = {};
      if (status) where.status = status;
      if (userId) where.userId = userId;

      // Get total count
      const total = await ctx.prisma.request.count({ where });

      // Get paginated results
      const requests = await ctx.prisma.request.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: { select: { id: true, email: true, firstname: true, lastname: true } },
          service: { select: { id: true, name: true } },
          location: true,
        },
      });

      return {
        requests,
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

### Context Design

**Type-safe context with services:**

```typescript
// trpc/trpc.ts
export interface Context {
  prisma: PrismaService;
  chatService: ChatService;
  accessControl: AccessControlService;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// trpc/trpc.service.ts
@Injectable()
export class TrpcService {
  applyMiddleware(app: INestApplication) {
    app.use(
      '/trpc',
      trpcExpress.createExpressMiddleware({
        router: this.trpcRouter.appRouter(),
        createContext: ({ req }): Context => {
          // Parse JWT from cookies
          const token = this.parseAuthToken(req);
          const user = token ? this.jwtService.verify(token) : undefined;

          return {
            prisma: this.prisma,
            chatService: this.chatService,
            accessControl: this.accessControl,
            user: user ? {
              id: user.sub || user.id,
              email: user.email,
              role: user.role,
            } : undefined,
          };
        },
      }),
    );
  }
}
```

### Client Usage

**Type-safe client with React Query:**

```typescript
// lib/trpc.ts (client)
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@alkitu/api/src/trpc/trpc.router';

export const trpc = createTRPCReact<AppRouter>();

// App component - provider setup
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
      credentials: 'include', // Send cookies
    }),
  ],
});

export function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Your app */}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

// Component usage - fully type-safe!
export function UserList() {
  const { data, isLoading } = trpc.user.list.useQuery({
    page: 1,
    limit: 20,
    role: 'CLIENT',
  });

  const createUser = trpc.user.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch
      trpc.useContext().user.list.invalidate();
    },
  });

  return <div>{/* Render users */}</div>;
}
```

## NestJS REST API Design (SECONDARY)

### Controller Organization

```typescript
// auth/auth.controller.ts
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
```

### DTO with Zod Validation

```typescript
// auth/dto/create-user.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
```

### Service Layer

```typescript
// users/users.service.ts
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    // Check if user exists
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException(
        `User with email ${dto.email} already exists`
      );
    }

    // Create user
    return this.prisma.user.create({
      data: {
        ...dto,
        password: await hash(dto.password, 10),
      },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
```

### REST vs tRPC Decision Matrix

| Criteria | Use tRPC | Use REST |
|----------|----------|----------|
| Client Type | Same TypeScript codebase | Third-party, non-TS clients |
| Type Safety | ✅ Required | ❌ Not critical |
| Development Speed | ✅ Rapid iteration | Standard pace |
| Documentation | Auto-generated types | OpenAPI/Swagger needed |
| Caching | Custom implementation | Standard HTTP caching |
| Public API | ❌ No | ✅ Yes |
| Mobile App (non-TS) | ❌ No | ✅ Yes |

## Authentication & Authorization

### JWT Strategy

```typescript
// auth/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

### Guards

```typescript
// common/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

// Usage with decorator
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('admin/users')
getAdminUsers() {
  // Only accessible by admins
}
```

## GraphQL API Design (TERTIARY)

### Schema Design

```graphql
# schema.graphql
type User {
  id: ID!
  email: String!
  firstname: String!
  lastname: String!
  role: UserRole!
  createdAt: DateTime!
  orders: [Order!]!
}

enum UserRole {
  ADMIN
  EMPLOYEE
  CLIENT
  LEAD
}

type Query {
  users(page: Int, limit: Int, role: UserRole): UserConnection!
  user(id: ID!): User
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}

type Subscription {
  userCreated: User!
}

type UserConnection {
  nodes: [User!]!
  totalCount: Int!
  pageInfo: PageInfo!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

### Resolver Implementation

```typescript
// users/users.resolver.ts
@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => UserConnection)
  async users(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
  ): Promise<UserConnection> {
    const [users, total] = await Promise.all([
      this.usersService.findMany({ page, limit }),
      this.usersService.count(),
    ]);

    return {
      nodes: users,
      totalCount: total,
      pageInfo: {
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.usersService.create(input);
  }

  @ResolveField(() => [Order])
  async orders(@Parent() user: User): Promise<Order[]> {
    return this.ordersService.findByUserId(user.id);
  }
}
```

## Best Practices

### 1. API Design

- **tRPC**: Organize by domain, use middleware for cross-cutting concerns
- **REST**: Use HTTP methods correctly, noun-based resources
- **GraphQL**: Schema-first, avoid N+1 queries with DataLoader
- **All**: Consistent error responses, proper status codes, comprehensive logging

### 2. Type Safety

- Use Zod for runtime validation
- Leverage TypeScript inference
- Share types between client and server
- Use discriminated unions for responses

### 3. Performance

- Implement pagination for large datasets
- Use database indexes appropriately
- Cache frequently accessed data
- Batch database queries when possible
- Use DataLoader for GraphQL to prevent N+1

### 4. Security

- Validate all inputs with Zod
- Use parameterized queries (Prisma handles this)
- Implement rate limiting
- Use HTTPS in production
- Sanitize error messages for production
- Implement proper CORS policies

### 5. Documentation

- tRPC: Types serve as documentation
- REST: OpenAPI/Swagger specs
- GraphQL: Schema with descriptions
- Maintain API changelog
- Provide usage examples

## Common Pitfalls

❌ **Mixing concerns**: Keep routers/controllers focused on routing, business logic in services
❌ **Missing validation**: Always validate inputs with Zod
❌ **Exposing internal errors**: Transform errors to user-friendly messages
❌ **No pagination**: Large datasets without pagination cause performance issues
❌ **Inconsistent naming**: Use camelCase for TypeScript, be consistent
❌ **Missing error handling**: Always handle errors appropriately
❌ **No rate limiting**: Implement rate limiting for public endpoints
❌ **Tight coupling**: Services should not depend on HTTP specifics

## Resources

### Reference Guides

- **references/trpc-design-patterns.md**: Router organization, procedures, middleware patterns
- **references/zod-validation-patterns.md**: Schema composition, type inference, custom refinements
- **references/middleware-patterns.md**: Auth, RBAC, feature flags, resource access control
- **references/nestjs-rest-patterns.md**: Controllers, services, when to use REST vs tRPC
- **references/rest-best-practices.md**: HTTP semantics, status codes, caching strategies
- **references/graphql-schema-design.md**: Schema patterns, resolver design, DataLoader

### Templates

- **templates/trpc-router.template.ts**: Production-ready tRPC router with pagination
- **templates/trpc-schema.template.ts**: Zod schema patterns and type inference
- **templates/nestjs-controller.template.ts**: REST controller with Swagger docs
- **templates/middleware-rbac.template.ts**: Role-based access control middleware
- **templates/nestjs-service.template.ts**: Service layer with error handling

### Assets

- **assets/api-design-checklist.md**: Pre-implementation checklist for all API types
- **assets/pagination-patterns.md**: Offset vs cursor pagination strategies

### See Also

- **Error Handling Patterns Skill**: TRPCError, NestJS exceptions, Prisma errors
- **Testing Strategy**: API testing with Supertest, tRPC testing
- **/docs/00-conventions/api-design-standards.md**: Project-specific API conventions
