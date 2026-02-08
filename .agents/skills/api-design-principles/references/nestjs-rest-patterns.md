# NestJS REST API Patterns

Comprehensive guide to NestJS REST API patterns in the Alkitu Template project, covering when to use REST vs tRPC, controller design, DTOs, guards, and Swagger documentation.

## Overview

The Alkitu Template uses **tRPC as the primary API layer** for internal frontend-to-backend communication, with REST endpoints serving specific use cases:
- Public APIs for external integrations
- Webhook endpoints
- File uploads/downloads
- Authentication flows (login, registration)
- Health checks and monitoring

This guide covers NestJS REST patterns for these scenarios.

## When to Use REST vs tRPC

### Use tRPC When:
- ✅ Internal frontend-to-backend communication
- ✅ Type safety is critical across boundaries
- ✅ Rapid development with shared types
- ✅ Complex nested data structures
- ✅ Real-time features (subscriptions)

### Use REST When:
- ✅ Public API for external clients
- ✅ Mobile apps (non-TypeScript)
- ✅ Webhook endpoints for third-party integrations
- ✅ File uploads/downloads with multipart forms
- ✅ Traditional authentication flows
- ✅ Need OpenAPI/Swagger documentation
- ✅ Clients that don't use TypeScript

### Decision Matrix

| Use Case | Recommended | Reason |
|----------|-------------|--------|
| Next.js frontend → NestJS backend | **tRPC** | Type safety, shared types |
| React Native/Flutter app → backend | **REST** | Cross-platform, no TypeScript |
| Third-party webhook | **REST** | Standard HTTP, no client library |
| Admin dashboard (internal) | **tRPC** | Rapid development, type safety |
| Partner API integration | **REST** | OpenAPI docs, standard REST |
| Authentication endpoints | **REST** | Standard OAuth flow compatibility |
| File uploads | **REST** | Multipart form data |

## Controller Organization

### Basic Controller Structure

```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

### Route Organization

Group related endpoints under logical controllers:

```typescript
// ✅ Good: Domain-based organization
@Controller('auth')
export class AuthController {
  @Post('register')
  @Post('login')
  @Post('logout')
  @Post('refresh')
  @Post('forgot-password')
  @Post('reset-password')
}

@Controller('users')
export class UsersController {
  @Get()         // GET /users
  @Get(':id')    // GET /users/:id
  @Post()        // POST /users
  @Patch(':id')  // PATCH /users/:id
  @Delete(':id') // DELETE /users/:id
}

// ❌ Bad: Operation-based organization
@Controller('create')
export class CreateController {
  @Post('user')
  @Post('request')
  @Post('service')
}
```

## HTTP Method Decorators

### Standard CRUD Operations

```typescript
@Controller('requests')
export class RequestsController {
  // CREATE
  @Post()
  @HttpCode(HttpStatus.CREATED) // 201
  async create(@Body() dto: CreateRequestDto) {
    return this.requestsService.create(dto);
  }

  // READ - List
  @Get()
  @HttpCode(HttpStatus.OK) // 200 (default)
  async findAll(@Query() query: FilterRequestsDto) {
    return this.requestsService.findAll(query);
  }

  // READ - Single
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  // UPDATE - Full replacement
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRequestDto,
  ) {
    return this.requestsService.update(id, dto);
  }

  // UPDATE - Partial update
  @Patch(':id')
  async partialUpdate(
    @Param('id') id: string,
    @Body() dto: Partial<UpdateRequestDto>,
  ) {
    return this.requestsService.partialUpdate(id, dto);
  }

  // DELETE
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204
  async remove(@Param('id') id: string) {
    await this.requestsService.remove(id);
  }
}
```

### Custom Actions

For non-CRUD operations, use descriptive paths:

```typescript
@Controller('requests')
export class RequestsController {
  // Action endpoints
  @Post(':id/assign')
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignRequestDto,
  ) {
    return this.requestsService.assign(id, dto.assignedToId);
  }

  @Post(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Body() dto: CancelRequestDto,
  ) {
    return this.requestsService.cancel(id, dto.reason);
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string) {
    return this.requestsService.complete(id);
  }

  // Statistics endpoint
  @Get('stats/count')
  async getCount(@Query() query: CountRequestsDto) {
    return this.requestsService.getCount(query);
  }
}
```

## DTOs (Data Transfer Objects)

### Creating DTOs with Zod

Use Zod schemas with nestjs-zod for validation:

```typescript
// dto/create-user.dto.ts
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Zod schema
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).refine(
    (password) => /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password),
    'Password must contain uppercase, lowercase, and number'
  ),
  firstname: z.string(),
  lastname: z.string(),
  role: z.nativeEnum(UserRole).default(UserRole.CLIENT),
});

// DTO class extending Zod schema
export class CreateUserDto extends createZodDto(createUserSchema) {}

// Type inference
export type CreateUserInput = z.infer<typeof createUserSchema>;
```

### DTO Patterns

```typescript
// Create DTO - all required fields
export class CreateRequestDto extends createZodDto(createRequestSchema) {}

// Update DTO - all fields optional
export class UpdateRequestDto extends createZodDto(updateRequestSchema.partial()) {}

// Filter/Query DTO - for query parameters
export class FilterRequestsDto extends createZodDto(
  z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
    status: z.nativeEnum(RequestStatus).optional(),
    userId: z.string().optional(),
    search: z.string().optional(),
  })
) {}
```

### Using DTOs in Controllers

```typescript
@Controller('users')
export class UsersController {
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // createUserDto is validated automatically
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() query: FilterUsersDto) {
    // query parameters are validated and typed
    return this.usersService.findAll(query);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
```

## Guards and Authentication

### JWT Authentication Guard

```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
```

### Role-Based Authorization Guard

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}

// Decorator
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
```

### Using Guards in Controllers

```typescript
@Controller('auth')
export class AuthController {
  // Public endpoint - no guard
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  // Protected endpoint - requires authentication
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  async logout(@Request() req: { user: { id: string } }) {
    return this.authService.logout(req.user.id);
  }

  // Protected + role-based - requires admin role
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('sessions/revoke-all')
  @ApiBearerAuth('JWT-auth')
  async revokeAllSessions() {
    return this.tokenService.revokeAllSessions();
  }
}
```

### Guard Order Matters

```typescript
// ✅ Correct order: Authentication first, then authorization
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async adminEndpoint() {}

// ❌ Wrong order: Role check would run before auth
@UseGuards(RolesGuard, JwtAuthGuard)
@Roles(UserRole.ADMIN)
async adminEndpoint() {}
```

## Rate Limiting

### Configure Throttler

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      name: 'default',
      ttl: 60000, // 1 minute
      limit: 100,  // 100 requests per minute
    }]),
  ],
})
export class AppModule {}
```

### Apply Rate Limiting

```typescript
import { Throttle, SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  // Custom rate limit for sensitive endpoint
  @Post('register')
  @Throttle({
    medium: {
      limit: 20,
      ttl: 3600000, // 20 requests per hour
    },
  })
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  // Skip rate limiting
  @Post('logout')
  @SkipThrottle()
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }

  // Use global rate limit (default)
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}
```

## Swagger Documentation

### Controller-Level Documentation

```typescript
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

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
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '60d5ecb74f3b2c001c8b4566',
          email: 'user@example.com',
          firstname: 'John',
          lastname: 'Doe',
          role: 'CLIENT',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    schema: {
      example: {
        message: 'User with this email already exists',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
```

### Protected Endpoints

```typescript
@UseGuards(JwtAuthGuard)
@Get('me')
@ApiBearerAuth('JWT-auth') // Indicates JWT required
@ApiOperation({ summary: 'Get current user profile' })
@ApiResponse({ status: 200, description: 'Profile retrieved' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async getProfile(@Request() req: { user: { id: string } }) {
  return this.usersService.findOne(req.user.id);
}
```

### DTO Documentation

```typescript
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createUserSchema = z.object({
  email: z.string().email().describe('User email address'),
  password: z.string().min(8).describe('Password (min 8 characters)'),
  firstname: z.string().describe('First name'),
  lastname: z.string().describe('Last name'),
  role: z.nativeEnum(UserRole).default(UserRole.CLIENT).describe('User role'),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
```

## Service Layer

### Service Structure

```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Verify user exists
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    // Verify user exists
    await this.findOne(id);

    // Soft delete
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
```

### Service Patterns

```typescript
@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // Pagination pattern
  async findAll(query: FilterRequestsDto) {
    const { page, limit, status, userId } = query;

    const where: Prisma.RequestWhereInput = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [items, total] = await Promise.all([
      this.prisma.request.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, email: true, firstname: true } },
          service: { select: { id: true, name: true } },
        },
      }),
      this.prisma.request.count({ where }),
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
  }

  // Transaction pattern
  async assign(id: string, assignedToId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Update request
      const request = await tx.request.update({
        where: { id },
        data: { assignedToId },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: assignedToId,
          type: 'REQUEST_ASSIGNED',
          message: `You have been assigned to request ${id}`,
        },
      });

      // Send email (non-transactional)
      try {
        await this.emailService.sendAssignmentNotification(request);
      } catch (error) {
        console.warn('Failed to send assignment email:', error);
      }

      return request;
    });
  }
}
```

## Error Handling

### HTTP Exceptions

```typescript
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

// Bad request - invalid input
throw new BadRequestException('Invalid email format');

// Not found - resource doesn't exist
throw new NotFoundException(`User with ID ${id} not found`);

// Conflict - resource already exists
throw new ConflictException('Email already in use');

// Unauthorized - not authenticated
throw new UnauthorizedException('Invalid credentials');

// Forbidden - authenticated but insufficient permissions
throw new ForbiddenException('Admin access required');

// Internal server error - unexpected errors
throw new InternalServerErrorException('Failed to process request');
```

### Global Exception Filter

Handled by `GlobalExceptionFilter` (see error-handling-patterns skill):

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Handle Zod validation errors
    // Handle Prisma errors (P2002, P2025, etc.)
    // Handle HTTP exceptions
    // Handle unknown errors

    response.status(status).json({
      statusCode: status,
      message: message,
      error: error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

## Request/Response Interceptors

### Transform Response

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      }))
    );
  }
}

// Usage
@UseInterceptors(TransformInterceptor)
@Controller('users')
export class UsersController {}
```

### Logging Interceptor

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        console.log(`${method} ${url} ${response.statusCode} - ${delay}ms`);
      })
    );
  }
}
```

## Best Practices

1. **Prefer tRPC for Internal APIs**
   - Use tRPC as primary API layer
   - REST only for external/public APIs

2. **Use DTOs with Zod**
   - Leverage nestjs-zod for validation
   - Share schemas between tRPC and REST when possible

3. **Guard Order**
   - Authentication guards before authorization guards
   - Apply guards at method level for granular control

4. **Swagger Documentation**
   - Document all public endpoints
   - Include example responses
   - Mark protected endpoints with @ApiBearerAuth

5. **Service Layer Logic**
   - Keep controllers thin - delegate to services
   - Services handle business logic and database operations
   - Use transactions for multi-step operations

6. **Error Handling**
   - Use specific HTTP exceptions
   - Let GlobalExceptionFilter standardize responses
   - Log errors appropriately

7. **Rate Limiting**
   - Apply throttling to sensitive endpoints
   - Use different limits for different operations
   - Skip throttling for operations that don't need it

8. **Response Formatting**
   - Return consistent response structures
   - Include pagination metadata
   - Use proper HTTP status codes

## Common Patterns

### CRUD Controller Template

```typescript
@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create resource' })
  async create(@Body() dto: CreateResourceDto) {
    return this.resourcesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List resources' })
  async findAll(@Query() query: FilterResourcesDto) {
    return this.resourcesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource by ID' })
  async findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update resource' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateResourceDto,
  ) {
    return this.resourcesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete resource' })
  async remove(@Param('id') id: string) {
    await this.resourcesService.remove(id);
  }
}
```

### Protected Admin Endpoint

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Delete(':id')
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'Delete user (Admin only)' })
@ApiResponse({ status: 204, description: 'User deleted' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
async remove(@Param('id') id: string) {
  await this.usersService.remove(id);
}
```

## See Also

- [tRPC Design Patterns](./trpc-design-patterns.md) - Primary API layer
- [Zod Validation Patterns](./zod-validation-patterns.md) - Shared validation
- [Middleware Patterns](./middleware-patterns.md) - tRPC middleware
- [NestJS Documentation](https://docs.nestjs.com/)
- [Swagger/OpenAPI](https://docs.nestjs.com/openapi/introduction)
