/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const { status, errorResponse } = this.getErrorResponse(exception, request);

    // Log error details for debugging
    this.logger.error(`${request.method} ${request.url}`, {
      exception: exception instanceof Error ? exception.stack : exception,
      body: request.body,
      query: request.query,
      params: request.params,
    });

    response.status(status).json(errorResponse);
  }

  private getErrorResponse(
    exception: unknown,
    request: any,
  ): {
    status: number;
    errorResponse: ErrorResponse;
  } {
    const timestamp = new Date().toISOString();
    const path = request.url;

    // Handle Zod validation errors
    if (exception instanceof ZodError) {
      const messages = exception.errors.map(
        (error) => `${error.path.join('.')}: ${error.message}`,
      );
      return {
        status: HttpStatus.BAD_REQUEST,
        errorResponse: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: messages,
          error: 'Validation Error',
          timestamp,
          path,
        },
      };
    }

    // Handle Prisma errors
    if (exception instanceof PrismaClientKnownRequestError) {
      return this.handlePrismaError(exception, timestamp, path);
    }

    // Handle NestJS HTTP exceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message: string | string[];
      let error: string;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = HttpStatus[status] || 'Error';
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || HttpStatus[status] || 'Error';
      } else {
        message = exception.message;
        error = HttpStatus[status] || 'Error';
      }

      return {
        status,
        errorResponse: {
          statusCode: status,
          message,
          error,
          timestamp,
          path,
        },
      };
    }

    // Handle generic errors
    const message =
      exception instanceof Error ? exception.message : 'Internal server error';
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorResponse: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message,
        error: 'Internal Server Error',
        timestamp,
        path,
      },
    };
  }

  private handlePrismaError(
    exception: PrismaClientKnownRequestError,
    timestamp: string,
    path: string,
  ): { status: number; errorResponse: ErrorResponse } {
    switch (exception.code) {
      case 'P2002': {
        // Unique constraint violation
        const target = exception.meta?.target as string[] | undefined;
        const field = target?.[0] || 'field';
        return {
          status: HttpStatus.CONFLICT,
          errorResponse: {
            statusCode: HttpStatus.CONFLICT,
            message: `A record with this ${field} already exists`,
            error: 'Conflict',
            timestamp,
            path,
          },
        };
      }

      case 'P2025':
        // Record not found
        return {
          status: HttpStatus.NOT_FOUND,
          errorResponse: {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Record not found',
            error: 'Not Found',
            timestamp,
            path,
          },
        };

      case 'P2003':
        // Foreign key constraint violation
        return {
          status: HttpStatus.BAD_REQUEST,
          errorResponse: {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Foreign key constraint failed',
            error: 'Bad Request',
            timestamp,
            path,
          },
        };

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          errorResponse: {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Database error occurred',
            error: 'Internal Server Error',
            timestamp,
            path,
          },
        };
    }
  }
}
