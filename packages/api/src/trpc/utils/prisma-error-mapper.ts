import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';

/**
 * Maps Prisma errors to appropriate tRPC error codes
 *
 * This utility provides consistent error handling across all tRPC endpoints
 * by converting Prisma-specific errors into user-friendly tRPC errors with
 * proper HTTP status codes.
 *
 * @param error - The error caught in the try-catch block
 * @param operation - A description of the operation being performed (e.g., "create user")
 * @throws {TRPCError} Always throws a TRPCError with appropriate code
 *
 * @example
 * ```typescript
 * try {
 *   return await prisma.user.create({ data: input });
 * } catch (error) {
 *   handlePrismaError(error, 'create user');
 * }
 * ```
 *
 * Error Code Mappings:
 * - P2002 (Unique constraint) → 409 CONFLICT
 * - P2025 (Record not found) → 404 NOT_FOUND
 * - P2003 (Foreign key constraint) → 400 BAD_REQUEST
 * - P2014 (Required relation violation) → 400 BAD_REQUEST
 * - P2021 (Table does not exist) → 500 INTERNAL_SERVER_ERROR
 * - P2024 (Connection timeout) → 500 INTERNAL_SERVER_ERROR
 * - TRPCError → Rethrown as-is (preserves original error)
 * - Unknown errors → 500 INTERNAL_SERVER_ERROR
 */
export function handlePrismaError(error: unknown, operation: string): never {
  // Prisma Known Request Errors (P2xxx codes)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        // Unique constraint violation
        const target = error.meta?.target as string[] | undefined;
        const fields = target?.join(', ') || 'resource';

        throw new TRPCError({
          code: 'CONFLICT',
          message: `A ${fields} with this value already exists`,
          cause: {
            prismaCode: error.code,
            fields: target,
            operation,
          },
        });
      }

      case 'P2025': {
        // Record not found (used in update, delete, findUniqueOrThrow)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Resource not found',
          cause: {
            prismaCode: error.code,
            operation,
          },
        });
      }

      case 'P2003': {
        // Foreign key constraint violation
        const fieldName = error.meta?.field_name as string | undefined;

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid reference in ${operation}${fieldName ? `: ${fieldName}` : ''}`,
          cause: {
            prismaCode: error.code,
            field: fieldName,
            operation,
          },
        });
      }

      case 'P2014': {
        // Required relation violation
        const relation = error.meta?.relation_name as string | undefined;

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot ${operation} due to missing required relation${relation ? `: ${relation}` : ''}`,
          cause: {
            prismaCode: error.code,
            relation,
            operation,
          },
        });
      }

      case 'P2021': {
        // Table does not exist
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database schema error',
          cause: {
            prismaCode: error.code,
            table: error.meta?.table,
            operation,
          },
        });
      }

      case 'P2024': {
        // Connection timeout
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database connection timeout',
          cause: {
            prismaCode: error.code,
            operation,
          },
        });
      }

      default: {
        // Unknown Prisma error code
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Database error in ${operation}`,
          cause: {
            prismaCode: error.code,
            message: error.message,
            operation,
          },
        });
      }
    }
  }

  // Prisma Validation Errors (invalid data types, etc.)
  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid data provided',
      cause: {
        type: 'validation',
        message: error.message,
        operation,
      },
    });
  }

  // Prisma Initialization Errors (connection issues, etc.)
  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database connection error',
      cause: {
        type: 'initialization',
        errorCode: error.errorCode,
        operation,
      },
    });
  }

  // TRPCError - rethrow as-is (don't wrap it)
  if (error instanceof TRPCError) {
    throw error;
  }

  // Unknown errors - generic 500
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: `Failed to ${operation}`,
    cause: {
      type: 'unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      operation,
    },
  });
}

/**
 * Type guard to check if an error is a Prisma error
 * Useful for conditional error handling
 *
 * @example
 * ```typescript
 * if (isPrismaError(error)) {
 *   // Handle Prisma-specific logic
 * }
 * ```
 */
export function isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

/**
 * Checks if error is a unique constraint violation (P2002)
 * Useful for specific handling of duplicate entries
 *
 * @example
 * ```typescript
 * if (isUniqueConstraintError(error)) {
 *   // Suggest using different email
 * }
 * ```
 */
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

/**
 * Checks if error is a not found error (P2025)
 *
 * @example
 * ```typescript
 * if (isNotFoundError(error)) {
 *   // Return 404
 * }
 * ```
 */
export function isNotFoundError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  );
}
