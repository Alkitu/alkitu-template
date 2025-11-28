import { Test, TestingModule } from '@nestjs/testing';
import { UserAnalyticsService, UserStats } from '../user-analytics.service.simple';
import { PrismaService } from '../../../prisma.service';

describe('UserAnalyticsService (Simple)', () => {
  let service: UserAnalyticsService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        count: jest.fn().mockResolvedValue(0),
      },
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAnalyticsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserAnalyticsService>(UserAnalyticsService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should inject PrismaService', () => {
      expect(prismaService).toBeDefined();
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics based on total count', async () => {
      const totalUsers = 100;
      (prismaService.user.count as jest.Mock).mockResolvedValue(totalUsers);

      const result = await service.getUserStats();

      expect(prismaService.user.count).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        total: 100,
        active: 80,
        inactive: 20,
        verified: 70,
        unverified: 30,
        recentSignups: 10,
        deletedRecently: 0,
      });
    });

    it('should handle zero users', async () => {
      (prismaService.user.count as jest.Mock).mockResolvedValue(0);

      const result = await service.getUserStats();

      expect(result).toEqual({
        total: 0,
        active: 0,
        inactive: 0,
        verified: 0,
        unverified: 0,
        recentSignups: 0,
        deletedRecently: 0,
      });
    });

    it('should handle odd numbers correctly with Math.floor', async () => {
      (prismaService.user.count as jest.Mock).mockResolvedValue(7);

      const result = await service.getUserStats();

      expect(result).toEqual({
        total: 7,
        active: 5, // Math.floor(7 * 0.8) = 5
        inactive: 1, // Math.floor(7 * 0.2) = 1
        verified: 4, // Math.floor(7 * 0.7) = 4
        unverified: 2, // Math.floor(7 * 0.3) = 2
        recentSignups: 0, // Math.floor(7 * 0.1) = 0
        deletedRecently: 0,
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      (prismaService.user.count as jest.Mock).mockRejectedValue(error);

      await expect(service.getUserStats()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getUserGrowthStats', () => {
    it('should return empty array', async () => {
      const result = await service.getUserGrowthStats();
      expect(result).toEqual([]);
    });
  });

  describe('getUserActivityStats', () => {
    it('should return default activity stats', async () => {
      const result = await service.getUserActivityStats();
      
      expect(result).toEqual({
        totalLogins: 0,
        uniqueActiveUsers: 0,
        averageSessionsPerUser: 0,
        peakActivityDay: expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
        peakActivityHour: 14,
      });
    });

    it('should return today as peak activity day', async () => {
      const result = await service.getUserActivityStats();
      const today = new Date().toISOString().split('T')[0];
      
      expect(result.peakActivityDay).toBe(today);
    });
  });

  describe('getUserDemographics', () => {
    it('should return empty demographics', async () => {
      const result = await service.getUserDemographics();
      
      expect(result).toEqual({
        ageGroups: [],
        genderDistribution: [],
        locationDistribution: [],
      });
    });
  });

  describe('getUserRetentionStats', () => {
    it('should return empty array', async () => {
      const result = await service.getUserRetentionStats();
      expect(result).toEqual([]);
    });
  });

  describe('getUsersByRole', () => {
    it('should return empty array', async () => {
      const result = await service.getUsersByRole();
      expect(result).toEqual([]);
    });
  });

  describe('getUsersByStatus', () => {
    it('should return empty array', async () => {
      const result = await service.getUsersByStatus();
      expect(result).toEqual([]);
    });
  });

  describe('getActiveUsersCount', () => {
    it('should return zero', async () => {
      const result = await service.getActiveUsersCount();
      expect(result).toBe(0);
    });
  });

  describe('getInactiveUsersCount', () => {
    it('should return zero', async () => {
      const result = await service.getInactiveUsersCount();
      expect(result).toBe(0);
    });
  });

  describe('getLoginFrequencyStats', () => {
    it('should return default login frequency stats', async () => {
      const result = await service.getLoginFrequencyStats();
      
      expect(result).toEqual({
        daily: 0,
        weekly: 0,
        monthly: 0,
        rarely: 0,
        never: 0,
      });
    });
  });

  describe('getUserEngagementScore', () => {
    it('should return default engagement score for user', async () => {
      const userId = 'user-123';
      const result = await service.getUserEngagementScore(userId);
      
      expect(result).toEqual({
        userId: 'user-123',
        score: 50,
        level: 'medium',
        factors: {
          loginFrequency: 0,
          featureUsage: 0,
          sessionDuration: 0,
          actionDiversity: 0,
        },
        lastCalculated: expect.any(Date),
      });
    });

    it('should handle different user IDs', async () => {
      const userId = 'different-user';
      const result = await service.getUserEngagementScore(userId);
      
      expect(result.userId).toBe('different-user');
    });
  });

  describe('getTopActiveUsers', () => {
    it('should return empty array', async () => {
      const result = await service.getTopActiveUsers();
      expect(result).toEqual([]);
    });
  });

  describe('getCohortAnalysis', () => {
    it('should return empty array', async () => {
      const result = await service.getCohortAnalysis();
      expect(result).toEqual([]);
    });
  });

  describe('type definitions', () => {
    it('should have correct UserStats interface shape', () => {
      const mockUserStats: UserStats = {
        total: 100,
        active: 80,
        inactive: 20,
        verified: 70,
        unverified: 30,
        recentSignups: 10,
        deletedRecently: 0,
      };

      expect(mockUserStats).toBeDefined();
      expect(typeof mockUserStats.total).toBe('number');
      expect(typeof mockUserStats.active).toBe('number');
      expect(typeof mockUserStats.inactive).toBe('number');
      expect(typeof mockUserStats.verified).toBe('number');
      expect(typeof mockUserStats.unverified).toBe('number');
      expect(typeof mockUserStats.recentSignups).toBe('number');
      expect(typeof mockUserStats.deletedRecently).toBe('number');
    });
  });
});