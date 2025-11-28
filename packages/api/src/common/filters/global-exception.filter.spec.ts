import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { GlobalExceptionFilter } from './global-exception.filter';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: any;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalExceptionFilter],
    }).compile();

    filter = module.get<GlobalExceptionFilter>(GlobalExceptionFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      method: 'GET',
      url: '/test',
      body: { test: 'data' },
      query: { page: 1 },
      params: { id: '123' },
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as any;

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('catch', () => {
    it('should be defined', () => {
      expect(filter).toBeDefined();
    });

    it('should handle ZodError with multiple validation errors', () => {
      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['email'],
          message: 'Expected string, received number',
        },
        {
          code: 'too_small',
          minimum: 8,
          type: 'string',
          inclusive: true,
          path: ['password'],
          message: 'String must contain at least 8 character(s)',
        },
      ]);

      filter.catch(zodError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['email: Expected string, received number', 'password: String must contain at least 8 character(s)'],
        error: 'Validation Error',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle ZodError with nested path', () => {
      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['user', 'profile', 'name'],
          message: 'Expected string, received number',
        },
      ]);

      filter.catch(zodError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['user.profile.name: Expected string, received number'],
        error: 'Validation Error',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle PrismaClientKnownRequestError P2002 (unique constraint)', () => {
      const prismaError = new PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.0.0',
        meta: { target: ['email'] },
      });

      filter.catch(prismaError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.CONFLICT,
        message: 'A record with this email already exists',
        error: 'Conflict',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle PrismaClientKnownRequestError P2002 without target', () => {
      const prismaError = new PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.0.0',
        meta: {},
      });

      filter.catch(prismaError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.CONFLICT,
        message: 'A record with this field already exists',
        error: 'Conflict',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle PrismaClientKnownRequestError P2025 (record not found)', () => {
      const prismaError = new PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '5.0.0',
        meta: {},
      });

      filter.catch(prismaError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Record not found',
        error: 'Not Found',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle PrismaClientKnownRequestError P2003 (foreign key constraint)', () => {
      const prismaError = new PrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        clientVersion: '5.0.0',
        meta: {},
      });

      filter.catch(prismaError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Foreign key constraint failed',
        error: 'Bad Request',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle PrismaClientKnownRequestError with unknown code', () => {
      const prismaError = new PrismaClientKnownRequestError('Unknown error', {
        code: 'P9999',
        clientVersion: '5.0.0',
        meta: {},
      });

      filter.catch(prismaError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Database error occurred',
        error: 'Internal Server Error',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle HttpException with string response', () => {
      const httpException = new HttpException('Not found', HttpStatus.NOT_FOUND);

      filter.catch(httpException, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not found',
        error: 'NOT_FOUND',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle HttpException with object response', () => {
      const httpException = new HttpException(
        { message: 'Validation failed', error: 'Bad Request' },
        HttpStatus.BAD_REQUEST
      );

      filter.catch(httpException, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: 'Bad Request',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle HttpException with object response without error field', () => {
      const httpException = new HttpException(
        { message: 'Custom message' },
        HttpStatus.FORBIDDEN
      );

      filter.catch(httpException, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Custom message',
        error: 'FORBIDDEN',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle HttpException with non-object, non-string response', () => {
      const httpException = new HttpException(null, HttpStatus.INTERNAL_SERVER_ERROR);

      filter.catch(httpException, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Http Exception',
        error: 'INTERNAL_SERVER_ERROR',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle generic Error', () => {
      const error = new Error('Something went wrong');

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        error: 'Internal Server Error',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle unknown exception type', () => {
      const unknownError = 'string error';

      filter.catch(unknownError, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Internal Server Error',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should log error details', () => {
      const error = new Error('Test error');
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      filter.catch(error, mockArgumentsHost);

      expect(loggerSpy).toHaveBeenCalledWith('GET /test', {
        exception: error.stack,
        body: { test: 'data' },
        query: { page: 1 },
        params: { id: '123' },
      });
    });

    it('should log non-Error exceptions', () => {
      const error = 'string error';
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      filter.catch(error, mockArgumentsHost);

      expect(loggerSpy).toHaveBeenCalledWith('GET /test', {
        exception: error,
        body: { test: 'data' },
        query: { page: 1 },
        params: { id: '123' },
      });
    });

    it('should handle different request methods', () => {
      mockRequest.method = 'POST';
      const error = new Error('Test error');

      filter.catch(error, mockArgumentsHost);

      expect(Logger.prototype.error).toHaveBeenCalledWith('POST /test', expect.any(Object));
    });

    it('should handle different request URLs', () => {
      mockRequest.url = '/api/users/123';
      const error = new Error('Test error');

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/api/users/123',
        })
      );
    });

    it('should generate proper timestamp format', () => {
      const error = new Error('Test error');
      const beforeTime = new Date();
      
      filter.catch(error, mockArgumentsHost);
      
      const afterTime = new Date();
      const callArgs = (mockResponse.json as jest.Mock).mock.calls[0][0];
      
      expect(callArgs.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(new Date(callArgs.timestamp).getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(new Date(callArgs.timestamp).getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should handle HttpException with array message', () => {
      const httpException = new HttpException(
        { message: ['First error', 'Second error'] },
        HttpStatus.BAD_REQUEST
      );

      filter.catch(httpException, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['First error', 'Second error'],
        error: 'BAD_REQUEST',
        timestamp: expect.any(String),
        path: '/test',
      });
    });

    it('should handle HttpException with unknown status code', () => {
      const httpException = new HttpException('Test error', 999);

      filter.catch(httpException, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 999,
        message: 'Test error',
        error: 'Error',
        timestamp: expect.any(String),
        path: '/test',
      });
    });
  });
});