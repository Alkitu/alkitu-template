# NestJS Exception Filters

Comprehensive guide to implementing exception filters in NestJS for centralized error handling.

## Overview

NestJS exception filters provide a way to catch and handle all errors in a single location, ensuring consistent error responses across your entire API. The `@Catch()` decorator can catch all exceptions or specific exception types.

## Global Exception Filter Pattern

### Basic Structure

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch() // Catches all exceptions
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const errorResponse = this.getErrorResponse(exception, request);

    // Log the error
    this.logger.error(
      `${errorResponse.statusCode} ${errorResponse.error}: ${errorResponse.message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Send response
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private getErrorResponse(exception: unknown, request: any): ErrorResponse {
    // Transform different error types to standardized format
  }
}
```

### Error Response Interface

Standardized error response structure:

```typescript
interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}
```

## Handling Different Error Types

### 1. Zod Validation Errors

```typescript
import { ZodError } from 'zod';

if (exception instanceof ZodError) {
  return {
    statusCode: HttpStatus.BAD_REQUEST,
    message: exception.errors.map(
      (err) => `${err.path.join('.')}: ${err.message}`
    ),
    error: 'Validation Error',
    timestamp: new Date().toISOString(),
    path: request.url,
  };
}
```

**Example Response:**

```json
{
  "statusCode": 400,
  "message": [
    "email: Invalid email address",
    "password: String must contain at least 8 character(s)"
  ],
  "error": "Validation Error",
  "timestamp": "2024-02-08T01:30:00.000Z",
  "path": "/api/auth/register"
}
```

### 2. Prisma Database Errors

```typescript
import { Prisma } from '@prisma/client';

if (exception instanceof Prisma.PrismaClientKnownRequestError) {
  return this.handlePrismaError(exception, timestamp, path);
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
```

### 3. NestJS HTTP Exceptions

```typescript
if (exception instanceof HttpException) {
  return {
    statusCode: exception.getStatus(),
    message: exception.message,
    error: exception.name,
    timestamp: new Date().toISOString(),
    path: request.url,
  };
}
```

**Supported HTTP Exceptions:**

- `BadRequestException` (400)
- `UnauthorizedException` (401)
- `ForbiddenException` (403)
- `NotFoundException` (404)
- `ConflictException` (409)
- `UnprocessableEntityException` (422)
- `InternalServerErrorException` (500)

### 4. Generic Errors

```typescript
// Fallback for unknown errors
return {
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  message: exception instanceof Error ? exception.message : 'Internal server error',
  error: 'Internal Server Error',
  timestamp: new Date().toISOString(),
  path: request.url,
};
```

## Registration

### Global Filter (Application Level)

```typescript
// main.ts
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(3000);
}
```

### Module Level

```typescript
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
```

## Logging Strategy

### Log Levels by Error Type

```typescript
private logError(exception: unknown, errorResponse: ErrorResponse) {
  const logContext = {
    statusCode: errorResponse.statusCode,
    path: errorResponse.path,
    timestamp: errorResponse.timestamp,
  };

  // Log based on status code
  if (errorResponse.statusCode >= 500) {
    // Server errors - full logging
    this.logger.error(
      `Server Error: ${errorResponse.message}`,
      exception instanceof Error ? exception.stack : undefined,
      JSON.stringify(logContext),
    );
  } else if (errorResponse.statusCode >= 400) {
    // Client errors - warning level
    this.logger.warn(
      `Client Error: ${errorResponse.message}`,
      JSON.stringify(logContext),
    );
  } else {
    // Other - info level
    this.logger.log(
      `${errorResponse.message}`,
      JSON.stringify(logContext),
    );
  }
}
```

### Include Request Context

```typescript
private getRequestContext(request: any) {
  return {
    method: request.method,
    url: request.url,
    ip: request.ip,
    userAgent: request.get('user-agent'),
    body: request.body,
    query: request.query,
    params: request.params,
    userId: request.user?.id, // If authenticated
  };
}
```

## Best Practices

1. **Standardize Error Format**: Always return the same error structure
2. **Log with Context**: Include request details, user info, timestamps
3. **Sanitize Sensitive Data**: Never log passwords, tokens, or PII
4. **User-Friendly Messages**: Transform technical errors to user-friendly messages
5. **Include Error Codes**: Add custom error codes for frontend handling
6. **Stack Traces in Development**: Include stack traces only in dev environment
7. **Monitor Error Rates**: Track error patterns for debugging
8. **Rate Limit Error Logs**: Prevent log spam from repeated errors

## Security Considerations

### Don't Expose Internal Details

```typescript
// ❌ BAD: Exposes database schema
{
  "message": "Invalid FK constraint on user.companyId references company._id"
}

// ✅ GOOD: User-friendly message
{
  "message": "Invalid reference to related record"
}
```

### Environment-Based Error Details

```typescript
private getErrorResponse(exception: unknown, request: any): ErrorResponse {
  const baseResponse = {
    statusCode: this.getStatusCode(exception),
    message: this.getMessage(exception),
    error: this.getErrorName(exception),
    timestamp: new Date().toISOString(),
    path: request.url,
  };

  // Include stack traces only in development
  if (process.env.NODE_ENV === 'development') {
    return {
      ...baseResponse,
      stack: exception instanceof Error ? exception.stack : undefined,
      details: exception instanceof Error ? exception : undefined,
    };
  }

  return baseResponse;
}
```

## Testing Exception Filters

```typescript
import { Test } from '@nestjs/testing';
import { GlobalExceptionFilter } from './global-exception.filter';
import { ArgumentsHost, BadRequestException } from '@nestjs/common';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GlobalExceptionFilter],
    }).compile();

    filter = module.get<GlobalExceptionFilter>(GlobalExceptionFilter);
  });

  it('should handle BadRequestException', () => {
    const exception = new BadRequestException('Invalid input');
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockRequest = { url: '/api/test' };
    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as ArgumentsHost;

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Invalid input',
        error: 'Bad Request',
      }),
    );
  });
});
```

## Common Patterns

### Retry on Specific Errors

```typescript
// In service layer
async function fetchWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      // Retry on transient errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (['P1001', 'P1002'].includes(error.code) && i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
          continue;
        }
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Error Context Enrichment

```typescript
// Custom error class with context
export class ApplicationError extends Error {
  constructor(
    message: string,
    public context: Record<string, any>,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Usage in service
throw new ApplicationError(
  'Failed to process payment',
  {
    orderId: order.id,
    amount: order.total,
    customerId: order.customerId,
  },
  HttpStatus.BAD_GATEWAY,
);
```

## See Also

- [Prisma Error Handling](./prisma-error-handling.md)
- [tRPC Error Patterns](./trpc-error-patterns.md)
- [Global Exception Filter Template](../templates/global-exception-filter.template.ts)
