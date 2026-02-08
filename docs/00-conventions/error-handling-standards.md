# Error Handling Standards

**Status**: ✅ Active Convention
**Last Updated**: 2024-01-29
**Owned By**: Backend Team
**AI Skill Reference**: `.claude/skills/error-handling-patterns/SKILL.md`

## Purpose

This document establishes standardized error handling practices across the Alkitu Template project for backend (NestJS/tRPC), frontend (Next.js/React), and their integration.

## Overview

The Alkitu Template uses a **layered error handling approach**:
- **Backend Layer**: GlobalExceptionFilter + TRPCError + Prisma error mapping
- **API Layer**: tRPC error codes with typed error responses
- **Frontend Layer**: React Error Boundaries + Toast notifications + Form errors

## Backend Error Handling

### GlobalExceptionFilter (NestJS)

**Location**: `packages/api/src/common/filters/global-exception.filter.ts`

**Purpose**: Catches all exceptions and transforms them into standardized HTTP responses.

**Handles**:
- Zod validation errors → 400 Bad Request
- Prisma errors (P2002, P2025, P2003) → Appropriate HTTP codes
- NestJS HttpExceptions → Pass-through
- TRPCError → Convert to HTTP
- Unknown errors → 500 Internal Server Error

**Template**: `.agents/skills/error-handling-patterns/templates/global-exception-filter.template.ts`

**Example**:
```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Handles all error types and returns standardized response
  }
}
```

### tRPC Error Handling

**Location**: `packages/api/src/trpc/middlewares/roles.middleware.ts`

**Error Codes**:
- `UNAUTHORIZED` (401) - Not authenticated
- `FORBIDDEN` (403) - Authenticated but insufficient permissions
- `BAD_REQUEST` (400) - Invalid input or business logic violation
- `NOT_FOUND` (404) - Resource doesn't exist
- `CONFLICT` (409) - Duplicate resource or state conflict
- `TOO_MANY_REQUESTS` (429) - Rate limit exceeded
- `INTERNAL_SERVER_ERROR` (500) - Unexpected errors

**Template**: `.agents/skills/error-handling-patterns/templates/trpc-error-middleware.template.ts`

**Example**:
```typescript
throw new TRPCError({
  code: 'NOT_FOUND',
  message: `Resource with ID ${id} not found`,
  cause: {
    resourceType: 'REQUEST',
    resourceId: id,
  },
});
```

**Reference**: `.claude/skills/error-handling-patterns/references/trpc-error-patterns.md`

### Prisma Error Handling

**Common Error Codes**:
- `P2002` - Unique constraint violation → 409 Conflict
- `P2025` - Record not found → 404 Not Found
- `P2003` - Foreign key constraint failed → 400 Bad Request
- `P2014` - Relation violation → 400 Bad Request
- `P2024` - Connection timeout → Retry or 503 Service Unavailable

**Reference**: `.claude/skills/error-handling-patterns/references/prisma-error-handling.md`

**Example**:
```typescript
try {
  await prisma.user.create({ data: { email: 'user@example.com' } });
} catch (error) {
  if (error.code === 'P2002') {
    throw new ConflictException('User already exists');
  }
  throw error;
}
```

## Frontend Error Handling

### React Error Boundaries

**Location**: `packages/web/src/context/providers/ThemeErrorBoundary.tsx`

**Types**:
1. **ErrorBoundary** - Full-page error fallback
2. **CompactErrorBoundary** - Inline errors (cards, sections)
3. **ThemeErrorBoundary** - Theme loading errors

**Template**: `.agents/skills/error-handling-patterns/templates/error-boundary.template.tsx`

**Usage**:
```tsx
<ErrorBoundary fallback={<CustomErrorUI />}>
  <ComponentThatMightError />
</ErrorBoundary>
```

**Reference**: `.claude/skills/error-handling-patterns/references/react-error-boundaries.md`

### Toast Notifications

**Library**: Sonner (`packages/web/src/components/primitives/ui/sonner.tsx`)

**Use For**:
- Mutation success messages
- Network errors
- Validation errors
- Background task completions

**Example**:
```typescript
import { toast } from 'sonner';

// Success
toast.success('Request created successfully');

// Error
toast.error('Failed to create request', {
  description: error.message,
});

// Warning
toast.warning('Feature is in beta');
```

### Form Errors

**Component**: `packages/web/src/components/primitives/ui/form-error.tsx`

**Use For**:
- Inline form validation errors
- Server-side validation errors from tRPC

**Example**:
```tsx
<FormError message={form.formState.errors.email?.message} />
```

## Integration Patterns

### tRPC Client Error Handling

**With React Query**:
```typescript
const createRequest = trpc.request.create.useMutation({
  onSuccess: (data) => {
    toast.success('Request created successfully');
    router.push(`/requests/${data.id}`);
  },
  onError: (error) => {
    // tRPC error is typed and includes code
    if (error.data?.code === 'FORBIDDEN') {
      toast.error('Insufficient permissions');
    } else {
      toast.error('Failed to create request', {
        description: error.message,
      });
    }
  },
});
```

### Result Type Pattern

**Location**: `.agents/skills/error-handling-patterns/templates/result-type.template.ts`

**Use For**:
- Operations where errors are expected
- Avoiding try-catch chains
- Explicit error handling

**Example**:
```typescript
import { Result, Ok, Err } from '@/lib/result';

function parseJSON<T>(json: string): Result<T, Error> {
  try {
    const value = JSON.parse(json) as T;
    return Ok(value);
  } catch (error) {
    return Err(error as Error);
  }
}

const result = parseJSON<User>(userJson);
if (result.ok) {
  console.log(result.value); // Type-safe access
} else {
  console.error(result.error.message);
}
```

## Error Response Standards

### Standardized Error Response

All errors should follow this structure:

```typescript
interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  details?: any; // Optional additional context
}
```

**Example**:
```json
{
  "statusCode": 404,
  "message": "Request with ID 12345 not found",
  "error": "Not Found",
  "timestamp": "2024-01-29T12:00:00.000Z",
  "path": "/api/requests/12345",
  "details": {
    "resourceType": "REQUEST",
    "resourceId": "12345"
  }
}
```

## Best Practices

### ✅ DO

1. **Use appropriate error codes**
   - 400 for validation errors
   - 401 for authentication required
   - 403 for insufficient permissions
   - 404 for not found
   - 409 for conflicts (duplicates)
   - 500 for unexpected errors

2. **Provide helpful error messages**
   - Clear and actionable
   - Include relevant context
   - Don't expose sensitive information

3. **Log errors appropriately**
   - ERROR for 5xx errors
   - WARN for 4xx errors
   - Include error context and stack traces

4. **Handle errors at the right level**
   - Validation errors at input
   - Business logic errors in services
   - Technical errors in middleware/filters

5. **Use Error Boundaries for React components**
   - Wrap feature components
   - Provide fallback UI
   - Log errors for monitoring

6. **Fail closed on security checks**
   - Deny access if check fails
   - Never assume access is granted
   - Log security denials

### ❌ DON'T

1. **Don't swallow errors silently**
   ```typescript
   // ❌ Bad
   try {
     await someOperation();
   } catch (error) {
     // Silent failure
   }

   // ✅ Good
   try {
     await someOperation();
   } catch (error) {
     console.error('Operation failed:', error);
     throw new InternalServerErrorException('Failed to process request');
   }
   ```

2. **Don't expose internal details in production**
   ```typescript
   // ❌ Bad
   throw new Error(`Database connection failed: ${dbError.stack}`);

   // ✅ Good
   logger.error('Database connection failed', { error: dbError });
   throw new InternalServerErrorException('Service temporarily unavailable');
   ```

3. **Don't use generic error messages**
   ```typescript
   // ❌ Bad
   throw new Error('An error occurred');

   // ✅ Good
   throw new NotFoundException(`User with ID ${id} not found`);
   ```

4. **Don't catch errors you can't handle**
   ```typescript
   // ❌ Bad
   try {
     await prisma.user.create({ data });
   } catch (error) {
     // What should we do here?
     console.log(error);
   }

   // ✅ Good - Let GlobalExceptionFilter handle it
   await prisma.user.create({ data });
   ```

5. **Don't mix error handling paradigms**
   - Use Result type OR exceptions, not both randomly
   - Be consistent within a module/feature

## Testing Error Handling

### Unit Tests

```typescript
// Test error throwing
it('should throw NotFoundException when user not found', async () => {
  await expect(service.findOne('invalid-id')).rejects.toThrow(
    NotFoundException
  );
});

// Test error messages
it('should include resource ID in error message', async () => {
  await expect(service.findOne('12345')).rejects.toThrow(
    'User with ID 12345 not found'
  );
});
```

### Integration Tests

```typescript
// Test HTTP error responses
it('should return 404 when resource not found', async () => {
  const response = await request(app.getHttpServer())
    .get('/api/users/invalid-id')
    .expect(404);

  expect(response.body).toMatchObject({
    statusCode: 404,
    message: expect.stringContaining('not found'),
    error: 'Not Found',
  });
});
```

## Monitoring and Alerting

### Error Logging

- **ERROR level**: 5xx errors, critical failures
- **WARN level**: 4xx errors, business rule violations
- **INFO level**: Expected errors (e.g., validation failures)

### Metrics to Track

- Error rate by endpoint
- Error rate by user
- Error response times
- Most common error types
- Error recovery rate

### Alert Triggers

- ERROR rate > 5% in 5 minutes
- 500 errors > 10 in 1 minute
- Critical path failures (auth, payments)
- Database connection failures

## References

### AI Skills
- **Main Skill**: `.claude/skills/error-handling-patterns/SKILL.md`
- **NestJS Patterns**: `.claude/skills/error-handling-patterns/references/nestjs-exception-filters.md`
- **tRPC Patterns**: `.claude/skills/error-handling-patterns/references/trpc-error-patterns.md`
- **Prisma Errors**: `.claude/skills/error-handling-patterns/references/prisma-error-handling.md`
- **React Patterns**: `.claude/skills/error-handling-patterns/references/react-error-boundaries.md`

### Templates
- **GlobalExceptionFilter**: `.agents/skills/error-handling-patterns/templates/global-exception-filter.template.ts`
- **tRPC Middleware**: `.agents/skills/error-handling-patterns/templates/trpc-error-middleware.template.ts`
- **Error Boundary**: `.agents/skills/error-handling-patterns/templates/error-boundary.template.tsx`
- **Result Type**: `.agents/skills/error-handling-patterns/templates/result-type.template.ts`

### Related Conventions
- [API Design Standards](./api-design-standards.md)
- [Testing Strategy](../05-testing/frontend-testing-guide.md)

## Changelog

- **2024-01-29**: Initial version - Adapted from Python/FastAPI to TypeScript/NestJS stack
