/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma.service';

describe('HealthService', () => {
  let service: HealthService;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('check', () => {
    it('should return healthy status when database is accessible', async () => {
      // Mock successful database connection
      prismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.check();

      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
      expect(result.uptime).toBeDefined();
      expect(result.checks.database).toBe('healthy');
      expect(result.error).toBeUndefined();
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({ take: 1 });
    });

    it('should return error status when database is not accessible', async () => {
      const databaseError = new Error('Database connection failed');
      prismaService.user.findFirst.mockRejectedValue(databaseError);

      const result = await service.check();

      expect(result.status).toBe('error');
      expect(result.timestamp).toBeDefined();
      expect(result.uptime).toBeDefined();
      expect(result.checks.database).toBe('unhealthy');
      expect(result.error).toBe('Database connection failed');
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({ take: 1 });
    });

    it('should handle non-Error exceptions', async () => {
      prismaService.user.findFirst.mockRejectedValue('String error');

      const result = await service.check();

      expect(result.status).toBe('error');
      expect(result.checks.database).toBe('unhealthy');
      expect(result.error).toBe('Unknown error');
    });

    it('should return valid timestamp format', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.check();

      expect(result.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('should return positive uptime', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.check();

      expect(result.uptime).toBeGreaterThan(0);
      expect(typeof result.uptime).toBe('number');
    });

    it('should handle multiple concurrent health checks', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);

      const promises = Array.from({ length: 3 }, () => service.check());
      const results = await Promise.all(promises);

      results.forEach((result) => {
        expect(result.status).toBe('ok');
        expect(result.checks.database).toBe('healthy');
      });

      expect(prismaService.user.findFirst).toHaveBeenCalledTimes(3);
    });

    it('should handle database connection recovery', async () => {
      // First call fails
      prismaService.user.findFirst.mockRejectedValueOnce(
        new Error('Connection failed'),
      );

      // Second call succeeds
      prismaService.user.findFirst.mockResolvedValueOnce(null);

      const firstResult = await service.check();
      expect(firstResult.status).toBe('error');
      expect(firstResult.checks.database).toBe('unhealthy');

      const secondResult = await service.check();
      expect(secondResult.status).toBe('ok');
      expect(secondResult.checks.database).toBe('healthy');
    });

    it('should have consistent structure for healthy response', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.check();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('checks');
      expect(result.checks).toHaveProperty('database');
      expect(result).not.toHaveProperty('error');
    });

    it('should have consistent structure for error response', async () => {
      prismaService.user.findFirst.mockRejectedValue(new Error('Test error'));

      const result = await service.check();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('checks');
      expect(result.checks).toHaveProperty('database');
      expect(result).toHaveProperty('error');
    });
  });
});
