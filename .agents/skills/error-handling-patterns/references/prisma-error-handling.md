# Prisma Error Handling

Comprehensive guide to handling Prisma ORM errors in TypeScript applications.

## Overview

Prisma throws specific error types for database operations. Understanding these error codes and handling them appropriately is crucial for building robust applications.

## Error Types

### 1. PrismaClientKnownRequestError

Errors with specific error codes that can be handled programmatically.

```typescript
import { Prisma } from '@prisma/client';

try {
  const user = await prisma.user.create({
    data: { email: 'user@example.com', password: 'hash' },
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log('Error code:', error.code);
    console.log('Meta info:', error.meta);
  }
}
```

### 2. PrismaClientUnknownRequestError

Errors from the database that don't have a specific error code.

### 3. PrismaClientRustPanicError

Internal Prisma engine panics (rare, usually indicates bugs).

### 4. PrismaClientInitializationError

Errors during Prisma Client initialization (connection, configuration).

### 5. PrismaClientValidationError

Schema validation errors (type mismatches, missing required fields).

## Common Error Codes

### P2002: Unique Constraint Violation

**When it occurs**: Attempting to create/update a record with a value that violates a unique constraint.

```typescript
// Error when email already exists
try {
  await prisma.user.create({
    data: {
      email: 'existing@example.com',
      password: 'hash',
    },
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Extract the field that caused the conflict
      const target = error.meta?.target as string[] | undefined;
      throw new ConflictException(
        `A user with this ${target?.join(', ') || 'value'} already exists`
      );
    }
  }
}
```

**Handling Pattern:**

```typescript
function handleUniqueConstraintError(
  error: Prisma.PrismaClientKnownRequestError,
  resourceName: string = 'record',
): never {
  const target = error.meta?.target as string[] | undefined;
  const field = target?.[0] || 'field';

  throw new ConflictException(
    `A ${resourceName} with this ${field} already exists`
  );
}

// Usage
try {
  return await prisma.user.create({ data: input });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    handleUniqueConstraintError(error, 'user');
  }
  throw error;
}
```

### P2025: Record Not Found

**When it occurs**: Operations like `update`, `delete`, `findUniqueOrThrow` fail to find the record.

```typescript
try {
  await prisma.user.update({
    where: { id: 'non-existent-id' },
    data: { name: 'New Name' },
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      throw new NotFoundException('User not found');
    }
  }
}
```

**Alternative Approach**: Use `findUnique` + check

```typescript
const user = await prisma.user.findUnique({ where: { id } });
if (!user) {
  throw new NotFoundException('User not found');
}

// Update user
await prisma.user.update({
  where: { id },
  data: updateData,
});
```

### P2003: Foreign Key Constraint Violation

**When it occurs**: Attempting to create/update a record with an invalid foreign key reference.

```typescript
try {
  await prisma.request.create({
    data: {
      userId: 'non-existent-user-id',
      serviceId: serviceId,
      // ... other fields
    },
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2003') {
      const field = error.meta?.field_name as string | undefined;
      throw new BadRequestException(
        `Invalid reference: ${field || 'related record not found'}`
      );
    }
  }
}
```

### P2014: Required Relation Violation

**When it occurs**: Attempting to delete or update a record that has required dependent records.

```typescript
try {
  await prisma.category.delete({
    where: { id: categoryId },
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2014') {
      throw new BadRequestException(
        'Cannot delete category with existing services'
      );
    }
  }
}
```

### P2015: Related Record Not Found

**When it occurs**: Creating a record with a relation that doesn't exist.

```typescript
try {
  await prisma.service.create({
    data: {
      name: 'Service Name',
      category: {
        connect: { id: 'non-existent-category-id' },
      },
    },
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2015') {
      throw new BadRequestException('Related category not found');
    }
  }
}
```

### P2016: Query Interpretation Error

**When it occurs**: Invalid query parameters or malformed queries.

```typescript
// Usually indicates a programming error
if (error.code === 'P2016') {
  throw new InternalServerErrorException('Invalid query parameters');
}
```

### P2021: Table Not Found

**When it occurs**: Schema and database are out of sync (migrations not applied).

```typescript
if (error.code === 'P2021') {
  throw new InternalServerErrorException(
    'Database schema error. Please contact support.'
  );
}
```

### P2024: Connection Pool Timeout

**When it occurs**: No available connections in the pool (high load).

```typescript
if (error.code === 'P2024') {
  throw new ServiceUnavailableException(
    'Database connection timeout. Please try again.'
  );
}
```

## Complete Error Code Reference

| Code | Error | HTTP Status | User Message |
|------|-------|-------------|--------------|
| P2000 | Value too long | 400 | Value exceeds maximum length |
| P2001 | Record not found (condition) | 404 | Record not found |
| P2002 | Unique constraint | 409 | Value already exists |
| P2003 | Foreign key constraint | 400 | Invalid reference to related record |
| P2004 | Constraint failed | 400 | Operation violates database constraint |
| P2005 | Invalid value | 400 | Invalid value provided |
| P2006 | Invalid value (type) | 400 | Invalid data type |
| P2007 | Data validation error | 400 | Data validation failed |
| P2008 | Query parse failed | 500 | Query parsing failed |
| P2009 | Query validation failed | 500 | Query validation failed |
| P2010 | Raw query failed | 500 | Database query failed |
| P2011 | Null constraint violation | 400 | Required field is missing |
| P2012 | Missing required value | 400 | Required field is missing |
| P2013 | Missing required argument | 400 | Required argument missing |
| P2014 | Required relation violation | 400 | Cannot modify record with dependencies |
| P2015 | Related record not found | 400 | Related record not found |
| P2016 | Query interpretation error | 500 | Invalid query |
| P2017 | Relations not connected | 400 | Records not properly connected |
| P2018 | Required connected records | 400 | Required connections missing |
| P2019 | Input error | 400 | Invalid input provided |
| P2020 | Value out of range | 400 | Value out of acceptable range |
| P2021 | Table not found | 500 | Database schema error |
| P2022 | Column not found | 500 | Database schema error |
| P2023 | Inconsistent column data | 500 | Database inconsistency |
| P2024 | Connection pool timeout | 503 | Service temporarily unavailable |
| P2025 | Record not found (operation) | 404 | Record not found |
| P2026 | Unsupported database feature | 500 | Feature not supported |
| P2027 | Multiple errors | 400 | Multiple validation errors |

## Error Handling Strategies

### Strategy 1: Centralized Handler

```typescript
import { Prisma } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'A record with this value already exists',
            error: 'Conflict',
          },
          HttpStatus.CONFLICT,
        );

      case 'P2025':
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Record not found',
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );

      case 'P2003':
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid reference to related record',
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );

      case 'P2024':
        throw new HttpException(
          {
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
            message: 'Service temporarily unavailable',
            error: 'Service Unavailable',
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );

      default:
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Database operation failed',
            error: 'Database Error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  // Rethrow if not a Prisma error
  throw error;
}

// Usage in service
@Injectable()
export class UsersService {
  async create(dto: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({ data: dto });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
```

### Strategy 2: Service-Level Wrapping

```typescript
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async create(dto: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({ data: dto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `User with email ${dto.email} already exists`
          );
        }
      }

      this.logger.error('Failed to create user', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
```

### Strategy 3: Global Exception Filter

Already documented in [NestJS Exception Filters](./nestjs-exception-filters.md).

## Transaction Error Handling

### Interactive Transactions

```typescript
try {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: userData });
    await tx.profile.create({
      data: {
        userId: user.id,
        ...profileData,
      },
    });
    await tx.notification.create({
      data: {
        userId: user.id,
        type: 'WELCOME',
      },
    });
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictException('User already exists');
    }
  }

  throw new InternalServerErrorException('Transaction failed');
}
```

### Sequential Transactions

```typescript
try {
  await prisma.$transaction([
    prisma.user.create({ data: userData }),
    prisma.settings.create({ data: settingsData }),
  ]);
} catch (error) {
  handlePrismaError(error);
}
```

## Retry Logic for Transient Errors

```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
): Promise<T> {
  const retryableCodes = ['P1001', 'P1002', 'P1008', 'P1017', 'P2024'];

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        retryableCodes.includes(error.code) &&
        attempt < maxRetries - 1
      ) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }

  throw new Error('Max retries exceeded');
}

// Usage
const user = await withRetry(() =>
  prisma.user.findUnique({ where: { id: userId } })
);
```

## Best Practices

1. **Use Specific Handlers**: Handle known error codes explicitly
2. **User-Friendly Messages**: Transform technical errors to user-friendly messages
3. **Log Original Errors**: Always log the original error for debugging
4. **Fail Fast**: Validate inputs before database operations
5. **Use Transactions**: Group related operations in transactions
6. **Handle Connection Errors**: Implement retry logic for transient errors
7. **Monitor Error Rates**: Track P2024 (connection timeout) errors
8. **Don't Expose Schema**: Don't leak database structure in error messages

## Testing

### Testing Prisma Errors

```typescript
import { Prisma } from '@prisma/client';

describe('UsersService', () => {
  it('should handle duplicate email error', async () => {
    const mockPrisma = {
      user: {
        create: jest.fn().mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError(
            'Unique constraint failed',
            {
              code: 'P2002',
              clientVersion: '5.0.0',
              meta: { target: ['email'] },
            },
          )
        ),
      },
    };

    const service = new UsersService(mockPrisma as any);

    await expect(
      service.create({ email: 'test@example.com' })
    ).rejects.toThrow(ConflictException);
  });
});
```

## Common Patterns

### Upsert with Error Handling

```typescript
async function upsertUser(email: string, data: UserData): Promise<User> {
  try {
    return await prisma.user.upsert({
      where: { email },
      update: data,
      create: { email, ...data },
    });
  } catch (error) {
    handlePrismaError(error);
  }
}
```

### Soft Delete Pattern

```typescript
async function softDelete(id: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
    throw error;
  }
}
```

## See Also

- [NestJS Exception Filters](./nestjs-exception-filters.md)
- [tRPC Error Patterns](./trpc-error-patterns.md)
- [Prisma Documentation](https://www.prisma.io/docs/reference/api-reference/error-reference)
