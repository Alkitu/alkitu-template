import { describe, it, expect } from '@jest/globals';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import {
  handlePrismaError,
  isPrismaError,
  isUniqueConstraintError,
  isNotFoundError,
} from '../prisma-error-mapper';

/**
 * Tests for Prisma Error Mapper
 *
 * Validates that Prisma errors are correctly mapped to tRPC error codes
 * with appropriate HTTP status codes and error messages.
 */
describe('Prisma Error Mapper', () => {
  describe('handlePrismaError', () => {
    describe('P2002 - Unique Constraint Violation', () => {
      it('should map P2002 to CONFLICT error', () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Unique constraint failed',
          {
            code: 'P2002',
            clientVersion: '5.0.0',
            meta: { target: ['email'] },
          },
        );

        try {
          handlePrismaError(prismaError, 'create user');
          // Should not reach here
          expect(true).toBe(false);
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError);
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('CONFLICT');
          expect(trpcError.message).toContain('already exists');
          expect(trpcError.cause).toMatchObject({
            prismaCode: 'P2002',
            fields: ['email'],
          });
        }
      });

      it('should include field names in error metadata', () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Unique constraint failed',
          {
            code: 'P2002',
            clientVersion: '5.0.0',
            meta: { target: ['email', 'username'] },
          },
        );

        try {
          handlePrismaError(prismaError, 'create user');
        } catch (error) {
          const trpcError = error as TRPCError;
          expect(trpcError.message).toContain('email, username');
          expect(trpcError.cause).toMatchObject({
            fields: ['email', 'username'],
          });
        }
      });

      it('should handle missing target metadata gracefully', () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Unique constraint failed',
          {
            code: 'P2002',
            clientVersion: '5.0.0',
            meta: {},
          },
        );

        try {
          handlePrismaError(prismaError, 'create user');
        } catch (error) {
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('CONFLICT');
          expect(trpcError.message).toContain('already exists');
        }
      });
    });

    describe('P2025 - Record Not Found', () => {
      it('should map P2025 to NOT_FOUND error', () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Record to update not found',
          {
            code: 'P2025',
            clientVersion: '5.0.0',
            meta: {},
          },
        );

        try {
          handlePrismaError(prismaError, 'update user');
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError);
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('NOT_FOUND');
          expect(trpcError.message).toContain('not found');
          expect(trpcError.cause).toMatchObject({
            prismaCode: 'P2025',
            operation: 'update user',
          });
        }
      });
    });

    describe('P2003 - Foreign Key Constraint Violation', () => {
      it('should map P2003 to BAD_REQUEST error', () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Foreign key constraint failed',
          {
            code: 'P2003',
            clientVersion: '5.0.0',
            meta: { field_name: 'userId' },
          },
        );

        try {
          handlePrismaError(prismaError, 'create request');
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError);
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('BAD_REQUEST');
          expect(trpcError.message).toContain('Invalid reference');
          expect(trpcError.message).toContain('userId');
          expect(trpcError.cause).toMatchObject({
            prismaCode: 'P2003',
            field: 'userId',
          });
        }
      });

      it('should handle missing field_name metadata', () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Foreign key constraint failed',
          {
            code: 'P2003',
            clientVersion: '5.0.0',
            meta: {},
          },
        );

        try {
          handlePrismaError(prismaError, 'create request');
        } catch (error) {
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('BAD_REQUEST');
          expect(trpcError.message).toContain('Invalid reference');
        }
      });
    });

    describe('P2014 - Required Relation Violation', () => {
      it('should map P2014 to BAD_REQUEST error', () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Required relation violation',
          {
            code: 'P2014',
            clientVersion: '5.0.0',
            meta: { relation_name: 'UserToRequest' },
          },
        );

        try {
          handlePrismaError(prismaError, 'delete user');
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError);
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('BAD_REQUEST');
          expect(trpcError.message).toContain('missing required relation');
          expect(trpcError.message).toContain('UserToRequest');
        }
      });
    });

    describe('P2021 - Table Does Not Exist', () => {
      it('should map P2021 to INTERNAL_SERVER_ERROR', () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Table does not exist',
          {
            code: 'P2021',
            clientVersion: '5.0.0',
            meta: { table: 'NonExistentTable' },
          },
        );

        try {
          handlePrismaError(prismaError, 'query table');
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError);
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('INTERNAL_SERVER_ERROR');
          expect(trpcError.message).toContain('Database schema error');
        }
      });
    });

    describe('P2024 - Connection Timeout', () => {
      it('should map P2024 to INTERNAL_SERVER_ERROR', () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Connection timeout',
          {
            code: 'P2024',
            clientVersion: '5.0.0',
            meta: {},
          },
        );

        try {
          handlePrismaError(prismaError, 'fetch data');
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError);
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('INTERNAL_SERVER_ERROR');
          expect(trpcError.message).toContain('Database connection timeout');
        }
      });
    });

    describe('Unknown Prisma Error Codes', () => {
      it('should map unknown Prisma errors to INTERNAL_SERVER_ERROR', () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Unknown error',
          {
            code: 'P9999',
            clientVersion: '5.0.0',
            meta: {},
          },
        );

        try {
          handlePrismaError(prismaError, 'unknown operation');
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError);
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('INTERNAL_SERVER_ERROR');
          expect(trpcError.message).toContain('Database error');
          expect(trpcError.cause).toMatchObject({
            prismaCode: 'P9999',
          });
        }
      });
    });

    describe('Prisma Validation Errors', () => {
      it('should map validation errors to BAD_REQUEST', () => {
        const validationError = new Prisma.PrismaClientValidationError(
          'Invalid data provided',
          { clientVersion: '5.0.0' },
        );

        try {
          handlePrismaError(validationError, 'validate input');
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError);
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('BAD_REQUEST');
          expect(trpcError.message).toContain('Invalid data provided');
        }
      });
    });

    describe('Prisma Initialization Errors', () => {
      it('should map initialization errors to INTERNAL_SERVER_ERROR', () => {
        const initError = new Prisma.PrismaClientInitializationError(
          'Database connection failed',
          '5.0.0',
          'DB_CONN_ERROR',
        );

        try {
          handlePrismaError(initError, 'connect to database');
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError);
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('INTERNAL_SERVER_ERROR');
          expect(trpcError.message).toContain('Database connection error');
        }
      });
    });

    describe('TRPCError Passthrough', () => {
      it('should rethrow TRPCError without wrapping', () => {
        const originalError = new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });

        try {
          handlePrismaError(originalError, 'check permission');
        } catch (error) {
          expect(error).toBe(originalError);
          expect(error).toBeInstanceOf(TRPCError);
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('FORBIDDEN');
          expect(trpcError.message).toBe('Access denied');
        }
      });
    });

    describe('Unknown Errors', () => {
      it('should map generic Error to INTERNAL_SERVER_ERROR', () => {
        const genericError = new Error('Something went wrong');

        try {
          handlePrismaError(genericError, 'process request');
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError);
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('INTERNAL_SERVER_ERROR');
          expect(trpcError.message).toContain('Failed to process request');
          expect(trpcError.cause).toMatchObject({
            message: 'Something went wrong',
          });
        }
      });

      it('should handle non-Error objects', () => {
        const unknownError = 'String error';

        try {
          handlePrismaError(unknownError, 'handle unknown');
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError);
          const trpcError = error as TRPCError;
          expect(trpcError.code).toBe('INTERNAL_SERVER_ERROR');
          expect(trpcError.message).toContain('Failed to handle unknown');
        }
      });
    });
  });

  describe('Helper Functions', () => {
    describe('isPrismaError', () => {
      it('should return true for Prisma errors', () => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Error',
          {
            code: 'P2002',
            clientVersion: '5.0.0',
            meta: {},
          },
        );

        expect(isPrismaError(prismaError)).toBe(true);
      });

      it('should return false for non-Prisma errors', () => {
        const genericError = new Error('Not a Prisma error');
        expect(isPrismaError(genericError)).toBe(false);

        const trpcError = new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Not a Prisma error',
        });
        expect(isPrismaError(trpcError)).toBe(false);
      });
    });

    describe('isUniqueConstraintError', () => {
      it('should return true for P2002 errors', () => {
        const uniqueError = new Prisma.PrismaClientKnownRequestError(
          'Unique constraint',
          {
            code: 'P2002',
            clientVersion: '5.0.0',
            meta: {},
          },
        );

        expect(isUniqueConstraintError(uniqueError)).toBe(true);
      });

      it('should return false for other error codes', () => {
        const notFoundError = new Prisma.PrismaClientKnownRequestError(
          'Not found',
          {
            code: 'P2025',
            clientVersion: '5.0.0',
            meta: {},
          },
        );

        expect(isUniqueConstraintError(notFoundError)).toBe(false);
      });

      it('should return false for non-Prisma errors', () => {
        const genericError = new Error('Generic error');
        expect(isUniqueConstraintError(genericError)).toBe(false);
      });
    });

    describe('isNotFoundError', () => {
      it('should return true for P2025 errors', () => {
        const notFoundError = new Prisma.PrismaClientKnownRequestError(
          'Not found',
          {
            code: 'P2025',
            clientVersion: '5.0.0',
            meta: {},
          },
        );

        expect(isNotFoundError(notFoundError)).toBe(true);
      });

      it('should return false for other error codes', () => {
        const uniqueError = new Prisma.PrismaClientKnownRequestError(
          'Unique constraint',
          {
            code: 'P2002',
            clientVersion: '5.0.0',
            meta: {},
          },
        );

        expect(isNotFoundError(uniqueError)).toBe(false);
      });

      it('should return false for non-Prisma errors', () => {
        const genericError = new Error('Generic error');
        expect(isNotFoundError(genericError)).toBe(false);
      });
    });
  });

  describe('Operation Context', () => {
    it('should include operation name in error cause', () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: { target: ['email'] },
        },
      );

      try {
        handlePrismaError(prismaError, 'register new user');
      } catch (error) {
        const trpcError = error as TRPCError;
        expect(trpcError.cause).toMatchObject({
          operation: 'register new user',
        });
      }
    });

    it('should provide descriptive operation names', () => {
      const operations = [
        'create user',
        'update user profile',
        'delete user',
        'fetch all users',
        'find user by email',
      ];

      operations.forEach((operation) => {
        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Error',
          {
            code: 'P2025',
            clientVersion: '5.0.0',
            meta: {},
          },
        );

        try {
          handlePrismaError(prismaError, operation);
        } catch (error) {
          const trpcError = error as TRPCError;
          expect(trpcError.cause).toMatchObject({
            operation,
          });
        }
      });
    });
  });
});
