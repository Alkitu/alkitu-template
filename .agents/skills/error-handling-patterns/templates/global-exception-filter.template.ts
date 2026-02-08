/**
 * Global Exception Filter Template
 *
 * Production-ready NestJS global exception filter that handles all error types:
 * - Zod validation errors
 * - Prisma database errors
 * - NestJS HTTP exceptions
 * - Unknown errors
 *
 * Usage:
 * 1. Copy this file to your project (e.g., src/common/filters/global-exception.filter.ts)
 * 2. Register in main.ts: app.useGlobalFilters(new GlobalExceptionFilter());
 * 3. Or register in app.module.ts with APP_FILTER token
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Standardized error response interface
 */
export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

/**
 * Global exception filter that catches all unhandled exceptions
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Build error response
    const errorResponse = this.getErrorResponse(exception, request);

    // Log error with appropriate level
    this.logError(exception, errorResponse, request);

    // Send response
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  /**
   * Transform different error types to standardized format
   */
  private getErrorResponse(exception: unknown, request: Request): ErrorResponse {
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

    // Prisma database errors
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

  /**
   * Handle Prisma-specific errors
   */
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

      case 'P2003': // Foreign key constraint violation
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid reference to related record',
          error: 'Bad Request',
          timestamp,
          path,
        };

      case 'P2011': // Null constraint violation
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Required field is missing',
          error: 'Bad Request',
          timestamp,
          path,
        };

      case 'P2014': // Required relation violation
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Cannot modify record with existing dependencies',
          error: 'Bad Request',
          timestamp,
          path,
        };

      case 'P2024': // Connection pool timeout
        return {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Service temporarily unavailable. Please try again.',
          error: 'Service Unavailable',
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

  /**
   * Log error with appropriate level based on severity
   */
  private logError(
    exception: unknown,
    errorResponse: ErrorResponse,
    request: Request,
  ): void {
    const logContext = {
      statusCode: errorResponse.statusCode,
      path: errorResponse.path,
      method: request.method,
      ip: request.ip,
      userAgent: request.get('user-agent'),
      timestamp: errorResponse.timestamp,
    };

    // Server errors (5xx) - error level with stack trace
    if (errorResponse.statusCode >= 500) {
      this.logger.error(
        `Server Error: ${errorResponse.message}`,
        exception instanceof Error ? exception.stack : undefined,
        JSON.stringify(logContext),
      );
      return;
    }

    // Client errors (4xx) - warning level
    if (errorResponse.statusCode >= 400) {
      this.logger.warn(
        `Client Error: ${errorResponse.message}`,
        JSON.stringify(logContext),
      );
      return;
    }

    // Other - info level
    this.logger.log(
      `${errorResponse.message}`,
      JSON.stringify(logContext),
    );
  }
}
