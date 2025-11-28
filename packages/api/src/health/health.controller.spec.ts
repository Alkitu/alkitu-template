/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: jest.Mocked<HealthService>;

  beforeEach(async () => {
    const mockHealthService = {
      check: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(
      HealthService,
    ) as jest.Mocked<HealthService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should inject HealthService', () => {
      expect(healthService).toBeDefined();
    });
  });

  describe('check', () => {
    it('should return healthy status from service', async () => {
      const mockHealthResponse = {
        status: 'ok',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 123.45,
        checks: {
          database: 'healthy',
        },
      };

      healthService.check.mockResolvedValue(mockHealthResponse);

      const result = await controller.check();

      expect(result).toEqual(mockHealthResponse);
      expect(healthService.check).toHaveBeenCalledTimes(1);
      expect(healthService.check).toHaveBeenCalledWith();
    });

    it('should return error status from service', async () => {
      const mockErrorResponse = {
        status: 'error',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 123.45,
        checks: {
          database: 'unhealthy',
        },
        error: 'Database connection failed',
      };

      healthService.check.mockResolvedValue(mockErrorResponse);

      const result = await controller.check();

      expect(result).toEqual(mockErrorResponse);
      expect(healthService.check).toHaveBeenCalledTimes(1);
    });

    it('should handle service exceptions', async () => {
      const serviceError = new Error('Service unavailable');
      healthService.check.mockRejectedValue(serviceError);

      await expect(controller.check()).rejects.toThrow('Service unavailable');
      expect(healthService.check).toHaveBeenCalledTimes(1);
    });

    it('should handle service returning null', async () => {
      healthService.check.mockResolvedValue(null as any);

      const result = await controller.check();

      expect(result).toBeNull();
      expect(healthService.check).toHaveBeenCalledTimes(1);
    });

    it('should handle service returning undefined', async () => {
      healthService.check.mockResolvedValue(undefined as any);

      const result = await controller.check();

      expect(result).toBeUndefined();
      expect(healthService.check).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple concurrent requests', async () => {
      const mockHealthResponse = {
        status: 'ok',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 123.45,
        checks: {
          database: 'healthy',
        },
      };

      healthService.check.mockResolvedValue(mockHealthResponse);

      const promises = Array.from({ length: 5 }, () => controller.check());
      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result) => {
        expect(result).toEqual(mockHealthResponse);
      });
      expect(healthService.check).toHaveBeenCalledTimes(5);
    });

    it('should handle slow service responses', async () => {
      const mockHealthResponse = {
        status: 'ok',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 123.45,
        checks: {
          database: 'healthy',
        },
      };

      healthService.check.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockHealthResponse), 100),
          ),
      );

      const start = Date.now();
      const result = await controller.check();
      const end = Date.now();

      expect(result).toEqual(mockHealthResponse);
      expect(end - start).toBeGreaterThanOrEqual(100);
      expect(healthService.check).toHaveBeenCalledTimes(1);
    });

    it('should handle service timeout', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';

      healthService.check.mockRejectedValue(timeoutError);

      await expect(controller.check()).rejects.toThrow('Request timeout');
      expect(healthService.check).toHaveBeenCalledTimes(1);
    });

    it('should not modify service response', async () => {
      const originalResponse = {
        status: 'ok',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 123.45,
        checks: {
          database: 'healthy',
        },
      };

      const mockHealthResponse = { ...originalResponse };
      healthService.check.mockResolvedValue(mockHealthResponse);

      const result = await controller.check();

      expect(result).toEqual(originalResponse);
      // Note: NestJS controllers directly return the service response
    });

    it('should handle complex health response structure', async () => {
      const complexResponse = {
        status: 'ok',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 123.45,
        checks: {
          database: 'healthy',
          redis: 'healthy',
          external_api: 'degraded',
        },
        metadata: {
          version: '1.0.0',
          environment: 'production',
          region: 'us-east-1',
        },
        metrics: {
          memory_usage: 85.6,
          cpu_usage: 12.3,
          request_count: 1000,
        },
      };

      healthService.check.mockResolvedValue(complexResponse);

      const result = await controller.check();

      expect(result).toEqual(complexResponse);
      expect(healthService.check).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration scenarios', () => {
    it('should handle rapid successive health checks', async () => {
      const mockHealthResponse = {
        status: 'ok',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 123.45,
        checks: {
          database: 'healthy',
        },
      };

      healthService.check.mockResolvedValue(mockHealthResponse);

      const start = Date.now();
      const promises = Array.from({ length: 10 }, () => controller.check());
      const results = await Promise.all(promises);
      const end = Date.now();

      expect(results).toHaveLength(10);
      results.forEach((result) => {
        expect(result).toEqual(mockHealthResponse);
      });

      // Should complete within reasonable time
      expect(end - start).toBeLessThan(1000);
      expect(healthService.check).toHaveBeenCalledTimes(10);
    });

    it('should handle mixed success/failure scenarios', async () => {
      const successResponse = {
        status: 'ok',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 123.45,
        checks: { database: 'healthy' },
      };

      const errorResponse = {
        status: 'error',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 123.45,
        checks: { database: 'unhealthy' },
        error: 'Database connection failed',
      };

      healthService.check
        .mockResolvedValueOnce(successResponse)
        .mockResolvedValueOnce(errorResponse)
        .mockResolvedValueOnce(successResponse);

      const results = await Promise.all([
        controller.check(),
        controller.check(),
        controller.check(),
      ]);

      expect(results[0]).toEqual(successResponse);
      expect(results[1]).toEqual(errorResponse);
      expect(results[2]).toEqual(successResponse);
      expect(healthService.check).toHaveBeenCalledTimes(3);
    });
  });

  describe('error handling', () => {
    it('should propagate service errors', async () => {
      const serviceError = new Error('Internal service error');
      healthService.check.mockRejectedValue(serviceError);

      await expect(controller.check()).rejects.toThrow(
        'Internal service error',
      );
    });

    it('should handle non-Error exceptions from service', async () => {
      healthService.check.mockRejectedValue('String error');

      await expect(controller.check()).rejects.toBe('String error');
    });

    it('should handle service returning invalid data types', async () => {
      healthService.check.mockResolvedValue('invalid response' as any);

      const result = await controller.check();

      expect(result).toBe('invalid response');
      expect(healthService.check).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    it('should handle service method being undefined', async () => {
      const controllerWithBrokenService = new HealthController({
        check: undefined,
      } as any);

      await expect(controllerWithBrokenService.check()).rejects.toThrow();
    });

    it('should handle service being null', async () => {
      const controllerWithNullService = new HealthController(null as any);

      await expect(controllerWithNullService.check()).rejects.toThrow();
    });

    it('should handle very large response objects', async () => {
      const largeResponse = {
        status: 'ok',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 123.45,
        checks: {
          database: 'healthy',
        },
        largeData: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          data: `data-${i}`,
        })),
      };

      healthService.check.mockResolvedValue(largeResponse);

      const result = await controller.check();

      expect(result).toEqual(largeResponse);
      expect((result as any).largeData).toHaveLength(1000);
      expect(healthService.check).toHaveBeenCalledTimes(1);
    });
  });
});
