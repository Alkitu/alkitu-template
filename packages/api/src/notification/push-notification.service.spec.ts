import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { PushNotificationService, PushNotificationPayload } from './push-notification.service';
import { PrismaService } from '../prisma.service';
import * as webPush from 'web-push';

// Mock web-push module
jest.mock('web-push');

describe('PushNotificationService', () => {
  let service: PushNotificationService;
  let prismaService: jest.Mocked<PrismaService>;
  let loggerSpy: jest.SpyInstance;
  let webPushSetVapidDetailsSpy: jest.SpyInstance;
  let webPushSendNotificationSpy: jest.SpyInstance;

  const mockUserId = 'user-123';
  const mockSubscription = {
    id: 'sub-1',
    userId: mockUserId,
    endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
    p256dh: 'key-p256dh',
    auth: 'key-auth',
    deviceType: 'desktop',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPayload: PushNotificationPayload = {
    title: 'Test Notification',
    body: 'This is a test message',
    icon: '/test-icon.png',
    data: { notificationId: '123' },
  };

  // Store original env vars
  const originalEnv = process.env;

  beforeEach(async () => {
    // Reset environment variables
    process.env = {
      ...originalEnv,
      VAPID_SUBJECT: 'mailto:test@alkitu.com',
      NEXT_PUBLIC_VAPID_PUBLIC_KEY: 'test-public-key',
      VAPID_PRIVATE_KEY: 'test-private-key',
    };

    // Spy on logger methods BEFORE module creation (constructor runs during compile)
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'debug').mockImplementation();

    // Spy on web-push methods
    webPushSetVapidDetailsSpy = jest.spyOn(webPush, 'setVapidDetails');
    webPushSendNotificationSpy = jest.spyOn(webPush, 'sendNotification');

    // Create mock Prisma service
    const mockPrismaService = {
      pushSubscription: {
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushNotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PushNotificationService>(PushNotificationService);
    prismaService = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Restore original env
    process.env = originalEnv;
  });

  // 1. CONSTRUCTOR AND INITIALIZATION TESTS
  describe('Constructor and Initialization', () => {
    it('should initialize with VAPID keys configured', () => {
      expect(webPushSetVapidDetailsSpy).toHaveBeenCalledWith(
        'mailto:test@alkitu.com',
        'test-public-key',
        'test-private-key',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Push notification service initialized with VAPID keys',
      );
    });

    it('should warn when VAPID keys are not configured', async () => {
      // Reset env vars
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = '';
      process.env.VAPID_PRIVATE_KEY = '';

      const warnSpy = jest.spyOn(Logger.prototype, 'warn');

      // Create new instance without VAPID keys
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PushNotificationService,
          {
            provide: PrismaService,
            useValue: prismaService,
          },
        ],
      }).compile();

      expect(warnSpy).toHaveBeenCalledWith(
        'VAPID keys not configured. Push notifications will not work.',
      );
      expect(warnSpy).toHaveBeenCalledWith(
        'Generate keys with: npx web-push generate-vapid-keys',
      );
    });

    it('should use default VAPID subject if not provided', async () => {
      delete process.env.VAPID_SUBJECT;

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PushNotificationService,
          {
            provide: PrismaService,
            useValue: prismaService,
          },
        ],
      }).compile();

      expect(webPushSetVapidDetailsSpy).toHaveBeenCalledWith(
        'mailto:admin@alkitu.com',
        'test-public-key',
        'test-private-key',
      );
    });
  });

  // 2. SEND TO USER TESTS
  describe('sendToUser', () => {
    it('should send notification successfully to user with one subscription', async () => {
      prismaService.pushSubscription.findMany = jest.fn().mockResolvedValue([mockSubscription]);
      webPushSendNotificationSpy.mockResolvedValue(undefined);

      const result = await service.sendToUser(mockUserId, mockPayload);

      expect(prismaService.pushSubscription.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, active: true },
      });
      expect(webPushSendNotificationSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ sent: 1, failed: 0 });
      expect(loggerSpy).toHaveBeenCalledWith(
        `Push notification sent to user ${mockUserId}: 1 sent, 0 failed`,
      );
    });

    it('should send to multiple subscriptions for same user', async () => {
      const subscription2 = { ...mockSubscription, id: 'sub-2', deviceType: 'mobile' };
      prismaService.pushSubscription.findMany = jest.fn().mockResolvedValue([
        mockSubscription,
        subscription2,
      ]);
      webPushSendNotificationSpy.mockResolvedValue(undefined);

      const result = await service.sendToUser(mockUserId, mockPayload);

      expect(webPushSendNotificationSpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ sent: 2, failed: 0 });
    });

    it('should return zero counts when user has no active subscriptions', async () => {
      prismaService.pushSubscription.findMany = jest.fn().mockResolvedValue([]);
      const warnSpy = jest.spyOn(Logger.prototype, 'warn');

      const result = await service.sendToUser(mockUserId, mockPayload);

      expect(webPushSendNotificationSpy).not.toHaveBeenCalled();
      expect(result).toEqual({ sent: 0, failed: 0 });
      expect(warnSpy).toHaveBeenCalledWith(
        `No active push subscriptions for user ${mockUserId}`,
      );
    });

    it('should deactivate subscription on HTTP 410 Gone error', async () => {
      prismaService.pushSubscription.findMany = jest.fn().mockResolvedValue([mockSubscription]);
      const gone410Error = new Error('Gone');
      (gone410Error as any).statusCode = 410;
      webPushSendNotificationSpy.mockRejectedValue(gone410Error);
      prismaService.pushSubscription.update = jest.fn().mockResolvedValue(mockSubscription);

      const result = await service.sendToUser(mockUserId, mockPayload);

      expect(prismaService.pushSubscription.update).toHaveBeenCalledWith({
        where: { id: mockSubscription.id },
        data: { active: false },
      });
      expect(result).toEqual({ sent: 0, failed: 1 });
    });

    it('should handle network errors without deactivating subscription', async () => {
      prismaService.pushSubscription.findMany = jest.fn().mockResolvedValue([mockSubscription]);
      const networkError = new Error('Network failure');
      (networkError as any).statusCode = 500;
      webPushSendNotificationSpy.mockRejectedValue(networkError);
      const errorSpy = jest.spyOn(Logger.prototype, 'error');

      const result = await service.sendToUser(mockUserId, mockPayload);

      expect(prismaService.pushSubscription.update).not.toHaveBeenCalled();
      expect(result).toEqual({ sent: 0, failed: 1 });
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should build correct notification payload with defaults', async () => {
      prismaService.pushSubscription.findMany = jest.fn().mockResolvedValue([mockSubscription]);
      webPushSendNotificationSpy.mockResolvedValue(undefined);

      const minimalPayload: PushNotificationPayload = {
        title: 'Test',
        body: 'Body',
      };

      await service.sendToUser(mockUserId, minimalPayload);

      const sentPayload = JSON.parse(webPushSendNotificationSpy.mock.calls[0][1]);
      expect(sentPayload).toMatchObject({
        title: 'Test',
        body: 'Body',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: {},
        actions: [],
        vibrate: [200, 100, 200],
        requireInteraction: false,
        tag: 'default',
      });
    });

    it('should use custom payload data when provided', async () => {
      prismaService.pushSubscription.findMany = jest.fn().mockResolvedValue([mockSubscription]);
      webPushSendNotificationSpy.mockResolvedValue(undefined);

      const customPayload: PushNotificationPayload = {
        title: 'Custom',
        body: 'Body',
        icon: '/custom-icon.png',
        badge: '/custom-badge.png',
        data: { notificationType: 'custom-type', extra: 'data' },
        actions: [{ action: 'view', title: 'View' }],
      };

      await service.sendToUser(mockUserId, customPayload);

      const sentPayload = JSON.parse(webPushSendNotificationSpy.mock.calls[0][1]);
      expect(sentPayload.icon).toBe('/custom-icon.png');
      expect(sentPayload.badge).toBe('/custom-badge.png');
      expect(sentPayload.tag).toBe('custom-type');
      expect(sentPayload.actions).toEqual([{ action: 'view', title: 'View' }]);
    });

    it('should handle partial failures in multiple subscriptions', async () => {
      const subscription2 = { ...mockSubscription, id: 'sub-2' };
      prismaService.pushSubscription.findMany = jest.fn().mockResolvedValue([
        mockSubscription,
        subscription2,
      ]);

      // First succeeds, second fails
      webPushSendNotificationSpy
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Failed'));

      const result = await service.sendToUser(mockUserId, mockPayload);

      expect(result).toEqual({ sent: 1, failed: 1 });
    });
  });

  // 3. SEND TO USERS (BATCH) TESTS
  describe('sendToUsers', () => {
    it('should send to multiple users and aggregate results', async () => {
      const userId1 = 'user-1';
      const userId2 = 'user-2';

      prismaService.pushSubscription.findMany = jest
        .fn()
        .mockResolvedValueOnce([mockSubscription])
        .mockResolvedValueOnce([{ ...mockSubscription, id: 'sub-2', userId: userId2 }]);

      webPushSendNotificationSpy.mockResolvedValue(undefined);

      const result = await service.sendToUsers([userId1, userId2], mockPayload);

      expect(result).toEqual({ sent: 2, failed: 0 });
      expect(loggerSpy).toHaveBeenCalledWith(
        `Batch push sent to 2 users: 2 sent, 0 failed`,
      );
    });

    it('should handle empty user array', async () => {
      const result = await service.sendToUsers([], mockPayload);

      expect(result).toEqual({ sent: 0, failed: 0 });
      expect(prismaService.pushSubscription.findMany).not.toHaveBeenCalled();
    });

    it('should aggregate partial failures across users', async () => {
      const userId1 = 'user-1';
      const userId2 = 'user-2';

      prismaService.pushSubscription.findMany = jest
        .fn()
        .mockResolvedValueOnce([mockSubscription]) // user-1: 1 subscription
        .mockResolvedValueOnce([
          { ...mockSubscription, id: 'sub-2', userId: userId2 },
          { ...mockSubscription, id: 'sub-3', userId: userId2 },
        ]); // user-2: 2 subscriptions

      // user-1 succeeds, user-2 first succeeds second fails
      webPushSendNotificationSpy
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Failed'));

      const result = await service.sendToUsers([userId1, userId2], mockPayload);

      expect(result).toEqual({ sent: 2, failed: 1 });
    });

    it('should continue sending even if one user fails completely', async () => {
      const userId1 = 'user-1';
      const userId2 = 'user-2';
      const userId3 = 'user-3';

      prismaService.pushSubscription.findMany = jest
        .fn()
        .mockResolvedValueOnce([mockSubscription]) // user-1: success
        .mockResolvedValueOnce([]) // user-2: no subscriptions
        .mockResolvedValueOnce([{ ...mockSubscription, id: 'sub-3' }]); // user-3: success

      webPushSendNotificationSpy.mockResolvedValue(undefined);

      const result = await service.sendToUsers([userId1, userId2, userId3], mockPayload);

      expect(result).toEqual({ sent: 2, failed: 0 });
    });
  });

  // 4. HAS ACTIVE SUBSCRIPTIONS TESTS
  describe('hasActiveSubscriptions', () => {
    it('should return true when user has active subscriptions', async () => {
      prismaService.pushSubscription.count = jest.fn().mockResolvedValue(2);

      const result = await service.hasActiveSubscriptions(mockUserId);

      expect(result).toBe(true);
      expect(prismaService.pushSubscription.count).toHaveBeenCalledWith({
        where: { userId: mockUserId, active: true },
      });
    });

    it('should return false when user has no subscriptions', async () => {
      prismaService.pushSubscription.count = jest.fn().mockResolvedValue(0);

      const result = await service.hasActiveSubscriptions(mockUserId);

      expect(result).toBe(false);
    });

    it('should handle database errors gracefully', async () => {
      prismaService.pushSubscription.count = jest.fn().mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.hasActiveSubscriptions(mockUserId)).rejects.toThrow(
        'Database error',
      );
    });
  });

  // 5. GET ACTIVE SUBSCRIPTION COUNT TESTS
  describe('getActiveSubscriptionCount', () => {
    it('should return correct count of active subscriptions', async () => {
      prismaService.pushSubscription.count = jest.fn().mockResolvedValue(3);

      const result = await service.getActiveSubscriptionCount(mockUserId);

      expect(result).toBe(3);
      expect(prismaService.pushSubscription.count).toHaveBeenCalledWith({
        where: { userId: mockUserId, active: true },
      });
    });

    it('should return 0 when user has no subscriptions', async () => {
      prismaService.pushSubscription.count = jest.fn().mockResolvedValue(0);

      const result = await service.getActiveSubscriptionCount(mockUserId);

      expect(result).toBe(0);
    });
  });

  // 6. DEACTIVATE USER SUBSCRIPTIONS TESTS
  describe('deactivateUserSubscriptions', () => {
    it('should deactivate all active subscriptions for user', async () => {
      prismaService.pushSubscription.updateMany = jest.fn().mockResolvedValue({ count: 3 });

      const result = await service.deactivateUserSubscriptions(mockUserId);

      expect(prismaService.pushSubscription.updateMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, active: true },
        data: { active: false },
      });
      expect(result).toBe(3);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Deactivated 3 subscriptions for user ${mockUserId}`,
      );
    });

    it('should return 0 when user has no active subscriptions', async () => {
      prismaService.pushSubscription.updateMany = jest.fn().mockResolvedValue({ count: 0 });

      const result = await service.deactivateUserSubscriptions(mockUserId);

      expect(result).toBe(0);
    });

    it('should handle database errors', async () => {
      prismaService.pushSubscription.updateMany = jest.fn().mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(service.deactivateUserSubscriptions(mockUserId)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  // 7. ERROR HANDLING TESTS
  describe('Error Handling', () => {
    it('should handle web-push library errors with details', async () => {
      prismaService.pushSubscription.findMany = jest.fn().mockResolvedValue([mockSubscription]);
      const webPushError = new Error('Web push library error');
      (webPushError as any).statusCode = 400;
      webPushSendNotificationSpy.mockRejectedValue(webPushError);
      const errorSpy = jest.spyOn(Logger.prototype, 'error');

      await service.sendToUser(mockUserId, mockPayload);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to send push'),
        'Web push library error',
      );
    });

    it('should handle malformed subscription data', async () => {
      const malformedSub = { ...mockSubscription, p256dh: null, auth: null };
      prismaService.pushSubscription.findMany = jest.fn().mockResolvedValue([malformedSub as any]);
      webPushSendNotificationSpy.mockRejectedValue(new Error('Invalid keys'));

      const result = await service.sendToUser(mockUserId, mockPayload);

      expect(result).toEqual({ sent: 0, failed: 1 });
    });

    it('should handle promise rejection in sendNotification', async () => {
      prismaService.pushSubscription.findMany = jest.fn().mockResolvedValue([mockSubscription]);
      webPushSendNotificationSpy.mockImplementation(() => {
        return Promise.reject(new Error('Promise rejected'));
      });

      const result = await service.sendToUser(mockUserId, mockPayload);

      expect(result.failed).toBe(1);
    });
  });
});
