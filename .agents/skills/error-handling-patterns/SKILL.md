---
name: error-handling-patterns
description: Master error handling patterns across languages including exceptions, Result types, error propagation, and graceful degradation to build resilient applications. Use when implementing error handling, designing APIs, or improving application reliability.
---

# Error Handling Patterns

Build resilient applications with robust error handling strategies that gracefully handle failures and provide excellent debugging experiences.

## When to Use This Skill

- Implementing error handling in new features
- Designing error-resilient APIs
- Debugging production issues
- Improving application reliability
- Creating better error messages for users and developers
- Implementing retry and circuit breaker patterns
- Handling async/concurrent errors
- Building fault-tolerant distributed systems

## Core Concepts

### 1. Error Handling Philosophies

**Exceptions vs Result Types:**

- **Exceptions**: Traditional try-catch, disrupts control flow
- **Result Types**: Explicit success/failure, functional approach
- **Error Codes**: C-style, requires discipline
- **Option/Maybe Types**: For nullable values

**When to Use Each:**

- Exceptions: Unexpected errors, exceptional conditions
- Result Types: Expected errors, validation failures
- Panics/Crashes: Unrecoverable errors, programming bugs

### 2. Error Categories

**Recoverable Errors:**

- Network timeouts
- Missing files
- Invalid user input
- API rate limits

**Unrecoverable Errors:**

- Out of memory
- Stack overflow
- Programming bugs (null pointer, etc.)

## Backend Error Handling (NestJS + tRPC)

### NestJS Global Exception Filter

**Centralized Error Handling with @Catch Decorator:**

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const errorResponse = this.getErrorResponse(exception, request);

    // Log error with context
    this.logger.error(
      `${errorResponse.statusCode} ${errorResponse.error}: ${errorResponse.message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private getErrorResponse(exception: unknown, request: any): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;

    // Zod validation errors
    if (exception instanceof ZodError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.errors.map(
          (err) => `${err.path.join('.')}: ${err.message}`
        ),
        error: 'Validation Error',
        timestamp,
        path,
      };
    }

    // Prisma errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaError(exception, timestamp, path);
    }

    // NestJS HTTP exceptions
    if (exception instanceof HttpException) {
      return {
        statusCode: exception.getStatus(),
        message: exception.message,
        error: exception.name,
        timestamp,
        path,
      };
    }

    // Unknown errors
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception instanceof Error ? exception.message : 'Internal server error',
      error: 'Internal Server Error',
      timestamp,
      path,
    };
  }

  private handlePrismaError(
    exception: Prisma.PrismaClientKnownRequestError,
    timestamp: string,
    path: string,
  ): ErrorResponse {
    switch (exception.code) {
      case 'P2002': // Unique constraint violation
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'A record with this value already exists',
          error: 'Conflict',
          timestamp,
          path,
        };
      case 'P2025': // Record not found
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          error: 'Not Found',
          timestamp,
          path,
        };
      case 'P2003': // Foreign key constraint
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid reference to related record',
          error: 'Bad Request',
          timestamp,
          path,
        };
      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database operation failed',
          error: 'Database Error',
          timestamp,
          path,
        };
    }
  }
}
```

**NestJS HTTP Exceptions:**

```typescript
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

// Service with typed exceptions
@Injectable()
export class UsersService {
  async create(email: string, password: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        `An account with email ${email} already exists.`
      );
    }

    return this.prisma.user.create({
      data: { email, password: await hash(password, 10) },
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

### tRPC Error Handling

**TRPCError with Error Codes:**

```typescript
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

// Middleware error handling
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

// Feature flag protection
export const requireFeature = (featureKey: string) => {
  return t.middleware(async ({ ctx, next }) => {
    try {
      const featureFlag = await ctx.prisma.featureFlag.findUnique({
        where: { key: featureKey },
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

// Router with error handling
export const userRouter = t.router({
  register: t.procedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.usersService.create(input);
        return { success: true, user };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : 'Registration failed';

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
          cause: error, // Include original error for debugging
        });
      }
    }),

  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.usersService.findById(input.id);

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `User with ID ${input.id} not found`,
        });
      }

      return user;
    }),
});
```

**Non-Critical Error Handling:**

```typescript
// Service with graceful error handling
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async register(dto: CreateUserDto): Promise<User> {
    const user = await this.usersService.create(dto);

    // Send welcome email - non-critical, don't fail registration
    try {
      await this.emailService.sendWelcomeEmail({
        to: user.email,
        name: user.firstname,
      });
    } catch (error: any) {
      this.logger.warn(
        `Warning: Could not send welcome email to ${user.email}: ${error.message}`
      );
      // Continue - registration succeeds even if email fails
    }

    // Create notification - non-critical
    try {
      await this.notificationService.createNotification({
        userId: user.id,
        type: 'ACCOUNT_CREATED',
        message: 'Welcome to our platform!',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(
        `Warning: Could not create notification: ${errorMessage}`
      );
      // Continue without failing
    }

    return user;
  }
}
```

## Frontend Error Handling (Next.js + React)

### React Error Boundaries

**Class-Based Error Boundary:**

```typescript
'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ThemeErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold text-destructive">
                Something went wrong
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {this.state.error?.message}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Retry
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

**Next.js Error Page:**

```typescript
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        Try again
      </button>
    </div>
  );
}
```

### Toast Notifications for User Errors

**React Query Mutation with Toast:**

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/primitives/ui/use-toast';
import { trpc } from '@/lib/trpc';

export function UserProfileForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (data: ProfileData) =>
      trpc.user.updateProfile.mutate(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    },

    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update profile: ${error.message}`,
        variant: 'destructive', // Red variant for errors
      });
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      updateProfile.mutate(formData);
    }}>
      {/* form fields */}
      <button
        type="submit"
        disabled={updateProfile.isPending}
      >
        {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
```

### Form Validation Errors

**FormError Component:**

```typescript
import { AlertTriangle } from 'lucide-react';

interface FormErrorProps {
  message?: string;
  className?: string;
}

export const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className={`bg-destructive/15 flex items-center gap-2 p-3 rounded-md text-sm text-destructive ${className}`}>
      <AlertTriangle size={20} />
      <span>{message}</span>
    </div>
  );
};
```

**Usage with React Hook Form:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormError } from '@/components/primitives/ui/form-error';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('email')} type="email" />
        <FormError message={errors.email?.message} />
      </div>

      <div>
        <input {...register('password')} type="password" />
        <FormError message={errors.password?.message} />
      </div>

      <button type="submit">Login</button>
    </form>
  );
}
```

### Error Display Components

**Reusable Error Display:**

```typescript
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  title?: string;
}

export default function ErrorDisplay({ message, title = 'Error' }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
}
```

## TypeScript Result Types

**Type-Safe Error Handling:**

```typescript
// Result type for explicit error handling
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Helper functions
function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Usage
function parseJSON<T>(json: string): Result<T, SyntaxError> {
  try {
    const value = JSON.parse(json) as T;
    return Ok(value);
  } catch (error) {
    return Err(error as SyntaxError);
  }
}

// Consuming Result
const result = parseJSON<User>(userJson);
if (result.ok) {
  console.log(result.value.name);
} else {
  console.error("Parse failed:", result.error.message);
}

// Chaining Results
function chain<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  return result.ok ? fn(result.value) : result;
}

// Map and flatMap for composing operations
function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  return result.ok ? Ok(fn(result.value)) : result;
}

function flatMap<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  return result.ok ? fn(result.value) : result;
}
```

**Async/Await with Result Types:**

```typescript
async function fetchUserSafely(id: string): Promise<Result<User, string>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return Err(`HTTP ${response.status}: ${response.statusText}`);
    }
    const user = await response.json();
    return Ok(user);
  } catch (error) {
    return Err(error instanceof Error ? error.message : 'Unknown error');
  }
}

// Usage
const result = await fetchUserSafely('123');
if (result.ok) {
  console.log('User:', result.value.name);
} else {
  console.error('Failed to fetch user:', result.error);
}
```

## Universal Patterns

### Pattern 1: Circuit Breaker

Prevent cascading failures in distributed systems.

```python
from enum import Enum
from datetime import datetime, timedelta
from typing import Callable, TypeVar

T = TypeVar('T')

class CircuitState(Enum):
    CLOSED = "closed"       # Normal operation
    OPEN = "open"          # Failing, reject requests
    HALF_OPEN = "half_open"  # Testing if recovered

class CircuitBreaker:
    def __init__(
        self,
        failure_threshold: int = 5,
        timeout: timedelta = timedelta(seconds=60),
        success_threshold: int = 2
    ):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.success_threshold = success_threshold
        self.failure_count = 0
        self.success_count = 0
        self.state = CircuitState.CLOSED
        self.last_failure_time = None

    def call(self, func: Callable[[], T]) -> T:
        if self.state == CircuitState.OPEN:
            if datetime.now() - self.last_failure_time > self.timeout:
                self.state = CircuitState.HALF_OPEN
                self.success_count = 0
            else:
                raise Exception("Circuit breaker is OPEN")

        try:
            result = func()
            self.on_success()
            return result
        except Exception as e:
            self.on_failure()
            raise

    def on_success(self):
        self.failure_count = 0
        if self.state == CircuitState.HALF_OPEN:
            self.success_count += 1
            if self.success_count >= self.success_threshold:
                self.state = CircuitState.CLOSED
                self.success_count = 0

    def on_failure(self):
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN

# Usage
circuit_breaker = CircuitBreaker()

def fetch_data():
    return circuit_breaker.call(lambda: external_api.get_data())
```

### Pattern 2: Error Aggregation

Collect multiple errors instead of failing on first error.

```typescript
class ErrorCollector {
  private errors: Error[] = [];

  add(error: Error): void {
    this.errors.push(error);
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): Error[] {
    return [...this.errors];
  }

  throw(): never {
    if (this.errors.length === 1) {
      throw this.errors[0];
    }
    throw new AggregateError(
      this.errors,
      `${this.errors.length} errors occurred`,
    );
  }
}

// Usage: Validate multiple fields
function validateUser(data: any): User {
  const errors = new ErrorCollector();

  if (!data.email) {
    errors.add(new ValidationError("Email is required"));
  } else if (!isValidEmail(data.email)) {
    errors.add(new ValidationError("Email is invalid"));
  }

  if (!data.name || data.name.length < 2) {
    errors.add(new ValidationError("Name must be at least 2 characters"));
  }

  if (!data.age || data.age < 18) {
    errors.add(new ValidationError("Age must be 18 or older"));
  }

  if (errors.hasErrors()) {
    errors.throw();
  }

  return data as User;
}
```

### Pattern 3: Graceful Degradation

Provide fallback functionality when errors occur.

```python
from typing import Optional, Callable, TypeVar

T = TypeVar('T')

def with_fallback(
    primary: Callable[[], T],
    fallback: Callable[[], T],
    log_error: bool = True
) -> T:
    """Try primary function, fall back to fallback on error."""
    try:
        return primary()
    except Exception as e:
        if log_error:
            logger.error(f"Primary function failed: {e}")
        return fallback()

# Usage
def get_user_profile(user_id: str) -> UserProfile:
    return with_fallback(
        primary=lambda: fetch_from_cache(user_id),
        fallback=lambda: fetch_from_database(user_id)
    )

# Multiple fallbacks
def get_exchange_rate(currency: str) -> float:
    return (
        try_function(lambda: api_provider_1.get_rate(currency))
        or try_function(lambda: api_provider_2.get_rate(currency))
        or try_function(lambda: cache.get_rate(currency))
        or DEFAULT_RATE
    )

def try_function(func: Callable[[], Optional[T]]) -> Optional[T]:
    try:
        return func()
    except Exception:
        return None
```

## Best Practices

1. **Fail Fast**: Validate input early with Zod schemas
2. **Preserve Context**: Include stack traces, error codes, metadata
3. **Meaningful Messages**: Explain what happened and how to fix it
4. **Log Appropriately**: Error-level for failures, warn for non-critical issues
5. **Handle at Right Level**: Catch where you can meaningfully handle
6. **Clean Up Resources**: Use try-finally for cleanup operations
7. **Don't Swallow Errors**: Log or re-throw, never silently ignore
8. **Type-Safe Errors**: Use TRPCError, HttpException, and typed Result types
9. **User-Friendly Frontend**: Show toast notifications, not raw error messages
10. **Fail Closed**: Deny access on authorization/feature check errors

**Example: Comprehensive Error Handling:**

```typescript
// NestJS Service with comprehensive error handling
@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService,
  ) {}

  async processOrder(orderId: string): Promise<Order> {
    // Validate input
    if (!orderId) {
      throw new BadRequestException('Order ID is required');
    }

    try {
      // Fetch order
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      // Process payment - wrap external service errors
      try {
        const paymentResult = await this.paymentService.charge({
          amount: order.total,
          currency: 'USD',
        });

        // Update order
        const updatedOrder = await this.prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'COMPLETED',
            paymentId: paymentResult.id,
          },
        });

        this.logger.log(`Order ${orderId} processed successfully`);
        return updatedOrder;

      } catch (error) {
        // Log external service failure
        this.logger.error(
          `Payment failed for order ${orderId}`,
          error instanceof Error ? error.stack : undefined,
        );

        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_GATEWAY,
            message: 'Payment processing failed',
            error: 'External Service Error',
            details: {
              orderId,
              amount: order.total,
              service: 'payment_service',
            },
          },
          HttpStatus.BAD_GATEWAY,
        );
      }

    } catch (error) {
      // Re-throw known HTTP exceptions
      if (error instanceof HttpException) {
        throw error;
      }

      // Log unexpected errors
      this.logger.error(
        `Unexpected error processing order ${orderId}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new InternalServerErrorException(
        'Order processing failed due to an internal error',
      );
    }
  }
}
```

**Example: tRPC with Error Handling:**

```typescript
export const orderRouter = t.router({
  process: t.procedure
    .input(z.object({ orderId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const order = await ctx.orderService.processOrder(input.orderId);
        return { success: true, order };
      } catch (error) {
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

        // Log and throw internal server error
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process order',
          cause: error,
        });
      }
    }),
});
```

## Common Pitfalls

- **Catching Too Broadly**: `catch (error)` without type checking hides bugs
- **Empty Catch Blocks**: Silently swallowing errors without logging
- **Logging and Re-throwing**: Creates duplicate log entries (log OR throw, not both)
- **Not Cleaning Up**: Forgetting to close connections, clear timeouts
- **Poor Error Messages**: "Error occurred" is not helpful - explain what and why
- **Exposing Internal Details**: Don't show stack traces or database errors to users
- **Ignoring Async Errors**: Unhandled promise rejections crash Node.js
- **Missing Error Boundaries**: Frontend crashes without fallback UI
- **Not Using Zod**: Manual validation is error-prone
- **Fail Open Security**: Allowing access when authorization check fails

**Common TypeScript Mistakes:**

```typescript
// ❌ BAD: Catching without type checking
try {
  await fetchData();
} catch (error) {
  console.log(error.message); // error is 'unknown', this will fail
}

// ✅ GOOD: Type check before using
try {
  await fetchData();
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.log(message);
}

// ❌ BAD: Swallowing errors
try {
  await saveData();
} catch (error) {
  // Empty catch - data not saved but no indication to user
}

// ✅ GOOD: Handle or propagate
try {
  await saveData();
} catch (error) {
  logger.error('Failed to save data:', error);
  throw error; // Or show user-friendly message
}

// ❌ BAD: Exposing internal errors to users
toast({
  title: 'Error',
  description: error.stack, // Never show stack traces to users
  variant: 'destructive',
});

// ✅ GOOD: User-friendly messages
toast({
  title: 'Error',
  description: 'Failed to save your changes. Please try again.',
  variant: 'destructive',
});
```

## Resources

### Reference Guides

- **references/nestjs-exception-filters.md**: Global exception filter patterns with Zod and Prisma error handling
- **references/trpc-error-patterns.md**: TRPCError codes, middleware patterns, and client-side handling
- **references/prisma-error-handling.md**: Prisma error code reference (P2002, P2025, P2003) and transformation strategies
- **references/react-error-boundaries.md**: Error boundary patterns for Next.js, fallback UI design
- **references/error-recovery-strategies.md**: Retry patterns, circuit breakers, graceful degradation
- **references/async-error-handling.md**: Promise error handling, async/await patterns, unhandled rejection handling

### Templates

- **templates/global-exception-filter.template.ts**: Production-ready NestJS global exception filter
- **templates/trpc-error-middleware.template.ts**: tRPC middleware with error handling
- **templates/error-boundary.template.tsx**: React error boundary component
- **templates/result-type.template.ts**: TypeScript Result type with helper functions

### Assets

- **assets/error-handling-checklist.md**: Review checklist for backend and frontend error handling
- **assets/error-message-guide.md**: Writing helpful error messages for users and developers
- **assets/frontend-error-patterns.md**: Toast notifications, form errors, loading states

### See Also

- **API Design Principles Skill**: Error responses in API design, status codes, error schemas
- **Testing Strategy**: Testing error conditions, edge cases, error boundaries
- **/docs/00-conventions/error-handling-standards.md**: Project-specific error handling conventions