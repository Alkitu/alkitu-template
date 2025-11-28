// @ts-nocheck
// 
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaServiceMock, resetAllMocks } from '../../test/mocks/prisma.mock';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService, PrismaServiceMock],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    resetAllMocks();
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const message = 'Test notification';
      const type = 'info';
      const link = '/test';

      const mockNotification = {
        id: '507f1f77bcf86cd799439012',
        userId,
        message,
        type,
        link,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      PrismaServiceMock.useValue.notification.create.mockResolvedValue(mockNotification);

      const result = await service.createNotification({
        userId,
        message,
        type,
        link,
      });

      expect(PrismaServiceMock.useValue.notification.create).toHaveBeenCalledWith({
        data: {
          userId,
          message,
          type,
          link,
        },
      });
      expect(result).toEqual(mockNotification);
    });

    it('should create notification without optional parameters', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const message = 'Test notification';
      const type = 'info';

      const mockNotification = {
        id: '507f1f77bcf86cd799439012',
        userId,
        message,
        type,
        link: undefined,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      PrismaServiceMock.useValue.notification.create.mockResolvedValue(mockNotification);

      const result = await service.createNotification({
        userId,
        message,
        type,
      });

      expect(PrismaServiceMock.useValue.notification.create).toHaveBeenCalledWith({
        data: {
          userId,
          message,
          type,
        },
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('getNotifications', () => {
    it('should get notifications for user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockNotifications = [
        {
          id: '507f1f77bcf86cd799439012',
          userId,
          message: 'Test notification',
          type: 'info',
          link: null,
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      PrismaServiceMock.useValue.notification.findMany.mockResolvedValue(
        mockNotifications,
      );

      const result = await service.getNotifications(userId);

      expect(PrismaServiceMock.useValue.notification.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockNotifications);
    });

    it('should return empty array when no notifications', async () => {
      const userId = '507f1f77bcf86cd799439011';

      PrismaServiceMock.useValue.notification.findMany.mockResolvedValue([]);

      const result = await service.getNotifications(userId);

      expect(result).toEqual([]);
    });
  });

  describe('getNotificationsWithFilters', () => {
    it('should get notifications with search filter', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockNotifications = [
        {
          id: '507f1f77bcf86cd799439012',
          message: 'Important update',
          type: 'info',
        },
      ];

      PrismaServiceMock.useValue.notification.findMany.mockResolvedValue(
        mockNotifications,
      );
      PrismaServiceMock.useValue.notification.count.mockResolvedValue(1);

      const result = await service.getNotificationsWithFilters(userId, {
        search: 'important',
      });

      expect(PrismaServiceMock.useValue.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          OR: [
            {
              OR: [
                { message: { contains: 'important', mode: 'insensitive' } },
                { type: { contains: 'important', mode: 'insensitive' } },
              ],
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result.notifications).toEqual(mockNotifications);
      expect(result.totalCount).toBe(1);
    });

    it('should get notifications with type filter', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockNotifications = [
        { id: '1', type: 'system', message: 'System update' },
      ];

      PrismaServiceMock.useValue.notification.findMany.mockResolvedValue(
        mockNotifications,
      );
      PrismaServiceMock.useValue.notification.count.mockResolvedValue(1);

      const result = await service.getNotificationsWithFilters(userId, {
        types: ['system', 'urgent'],
      });

      expect(PrismaServiceMock.useValue.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          type: { in: ['system', 'urgent'] },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result.notifications).toEqual(mockNotifications);
    });

    it('should get notifications with status filter', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockNotifications = [
        { id: '1', read: false, message: 'Unread notification' },
      ];

      PrismaServiceMock.useValue.notification.findMany.mockResolvedValue(
        mockNotifications,
      );
      PrismaServiceMock.useValue.notification.count.mockResolvedValue(1);

      const result = await service.getNotificationsWithFilters(userId, {
        status: 'unread',
      });

      expect(PrismaServiceMock.useValue.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          read: false,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result.notifications).toEqual(mockNotifications);
    });

    it('should get notifications with pagination', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockNotifications = [
        { id: '1', message: 'Notification 1' },
        { id: '2', message: 'Notification 2' },
      ];

      PrismaServiceMock.useValue.notification.findMany.mockResolvedValue(
        mockNotifications,
      );
      PrismaServiceMock.useValue.notification.count.mockResolvedValue(10);

      const result = await service.getNotificationsWithFilters(userId, {
        limit: 2,
        offset: 5,
      });

      expect(PrismaServiceMock.useValue.notification.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 2,
        skip: 5,
      });
      expect(result.notifications).toEqual(mockNotifications);
      expect(result.totalCount).toBe(10);
      expect(result.hasMore).toBe(true);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = '507f1f77bcf86cd799439012';
      const mockNotification = {
        id: notificationId,
        userId: '507f1f77bcf86cd799439011',
        message: 'Test notification',
        type: 'info',
        link: null,
        read: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      PrismaServiceMock.useValue.notification.update.mockResolvedValue(mockNotification);

      const result = await service.markAsRead(notificationId);

      expect(PrismaServiceMock.useValue.notification.update).toHaveBeenCalledWith({
        where: { id: notificationId },
        data: { read: true },
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('getUnreadCount', () => {
    it('should get unread count for user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const count = 5;

      PrismaServiceMock.useValue.notification.count.mockResolvedValue(count);

      const result = await service.getUnreadCount(userId);

      expect(PrismaServiceMock.useValue.notification.count).toHaveBeenCalledWith({
        where: { userId, read: false },
      });
      expect(result).toBe(count);
    });

    it('should return 0 when no unread notifications', async () => {
      const userId = '507f1f77bcf86cd799439011';

      PrismaServiceMock.useValue.notification.count.mockResolvedValue(0);

      const result = await service.getUnreadCount(userId);

      expect(result).toBe(0);
    });
  });

  describe('Notification Preferences', () => {
    describe('getUserPreferences', () => {
      it('should get user preferences', async () => {
        const userId = '507f1f77bcf86cd799439011';
        const mockPreferences = {
          id: '507f1f77bcf86cd799439013',
          userId,
          emailEnabled: true,
          emailTypes: ['welcome', 'security'],
          pushEnabled: true,
          pushTypes: ['urgent'],
          inAppEnabled: true,
          inAppTypes: ['all'],
          emailFrequency: 'immediate',
          digestEnabled: false,
          quietHoursEnabled: false,
          quietHoursStart: null,
          quietHoursEnd: null,
          marketingEnabled: false,
          promotionalEnabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        PrismaServiceMock.useValue.notificationPreference.findUnique.mockResolvedValue(
          mockPreferences,
        );

        const result = await service.getUserPreferences(userId);

        expect(
          PrismaServiceMock.useValue.notificationPreference.findUnique,
        ).toHaveBeenCalledWith({
          where: { userId },
        });
        expect(result).toEqual(mockPreferences);
      });

      it('should return null when no preferences found', async () => {
        const userId = '507f1f77bcf86cd799439011';

        PrismaServiceMock.useValue.notificationPreference.findUnique.mockResolvedValue(
          null,
        );

        const result = await service.getUserPreferences(userId);

        expect(result).toBeNull();
      });
    });

    describe('createOrUpdatePreferences', () => {
      it('should create or update user preferences', async () => {
        const userId = '507f1f77bcf86cd799439011';
        const preferences = {
          emailEnabled: true,
          emailTypes: ['welcome', 'security'],
          pushEnabled: false,
          pushTypes: [],
          inAppEnabled: true,
          inAppTypes: ['all'],
          emailFrequency: 'daily',
          digestEnabled: true,
          quietHoursEnabled: true,
          quietHoursStart: '22:00',
          quietHoursEnd: '08:00',
          marketingEnabled: false,
          promotionalEnabled: false,
        };

        const mockResult = {
          id: '507f1f77bcf86cd799439013',
          userId,
          ...preferences,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        PrismaServiceMock.useValue.notificationPreference.upsert.mockResolvedValue(
          mockResult,
        );

        const result = await service.createOrUpdatePreferences(
          userId,
          preferences,
        );

        expect(
          PrismaServiceMock.useValue.notificationPreference.upsert,
        ).toHaveBeenCalledWith({
          where: { userId },
          create: {
            userId,
            ...preferences,
          },
          update: preferences,
        });
        expect(result).toEqual(mockResult);
      });
    });

    describe('getDefaultPreferences', () => {
      it('should return default preferences', () => {
        const result = service.getDefaultPreferences();

        expect(result).toEqual({
          emailEnabled: true,
          emailTypes: ['welcome', 'security', 'billing'],
          pushEnabled: true,
          pushTypes: ['urgent', 'reminders'],
          inAppEnabled: true,
          inAppTypes: ['all'],
          emailFrequency: 'immediate',
          digestEnabled: false,
          quietHoursEnabled: false,
          quietHoursStart: null,
          quietHoursEnd: null,
          marketingEnabled: false,
          promotionalEnabled: false,
        });
      });
    });

    describe('shouldSendNotification', () => {
      it('should return true when no preferences exist', async () => {
        const userId = '507f1f77bcf86cd799439011';

        PrismaServiceMock.useValue.notificationPreference.findUnique.mockResolvedValue(
          null,
        );

        const result = await service.shouldSendNotification(
          userId,
          'welcome',
          'email',
        );

        expect(result).toBe(true);
      });

      it('should respect email preferences', async () => {
        const userId = '507f1f77bcf86cd799439011';
        const mockPreferences = {
          emailEnabled: true,
          emailTypes: ['welcome', 'security'],
          pushEnabled: true,
          pushTypes: ['urgent'],
          inAppEnabled: true,
          inAppTypes: ['all'],
        };

        PrismaServiceMock.useValue.notificationPreference.findUnique.mockResolvedValue(
          mockPreferences,
        );

        const shouldSendWelcome = await service.shouldSendNotification(
          userId,
          'welcome',
          'email',
        );
        const shouldSendReport = await service.shouldSendNotification(
          userId,
          'report',
          'email',
        );

        expect(shouldSendWelcome).toBe(true);
        expect(shouldSendReport).toBe(false);
      });
    });

    describe('isInQuietHours', () => {
      it('should return false when quiet hours disabled', async () => {
        const userId = '507f1f77bcf86cd799439011';
        const mockPreferences = {
          quietHoursEnabled: false,
          quietHoursStart: '22:00',
          quietHoursEnd: '08:00',
        };

        PrismaServiceMock.useValue.notificationPreference.findUnique.mockResolvedValue(
          mockPreferences,
        );

        const result = await service.isInQuietHours(userId);

        expect(result).toBe(false);
      });

      it('should return false when no preferences found', async () => {
        const userId = '507f1f77bcf86cd799439011';

        PrismaServiceMock.useValue.notificationPreference.findUnique.mockResolvedValue(
          null,
        );

        const result = await service.isInQuietHours(userId);

        expect(result).toBe(false);
      });
    });
  });

  // Bulk operations tests
  describe('Bulk Operations', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('markAllAsRead', () => {
      it('should mark all unread notifications as read for a user', async () => {
        const userId = 'user123';
        const mockResult = { count: 5 };

        PrismaServiceMock.useValue.notification.updateMany.mockResolvedValue(mockResult);

        const result = await service.markAllAsRead(userId);

        expect(PrismaServiceMock.useValue.notification.updateMany).toHaveBeenCalledWith({
          where: { userId, read: false },
          data: { read: true },
        });
        expect(result).toEqual(mockResult);
      });

      it('should send real-time update when gateway is available', async () => {
        const userId = 'user123';
        const mockResult = { count: 3 };
        const mockGateway = {
          sendNotificationToUser: jest.fn().mockResolvedValue(undefined),
        };

        service['notificationGateway'] = mockGateway;
        PrismaServiceMock.useValue.notification.updateMany.mockResolvedValue(mockResult);

        await service.markAllAsRead(userId);

        expect(mockGateway.sendNotificationToUser).toHaveBeenCalledWith(
          userId,
          {
            type: 'notification_bulk_read',
            count: 3,
          },
        );
      });
    });

    describe('deleteAllNotifications', () => {
      it('should delete all notifications for a user', async () => {
        const userId = 'user123';
        const mockResult = { count: 10 };

        PrismaServiceMock.useValue.notification.deleteMany.mockResolvedValue(mockResult);

        const result = await service.deleteAllNotifications(userId);

        expect(PrismaServiceMock.useValue.notification.deleteMany).toHaveBeenCalledWith({
          where: { userId },
        });
        expect(result).toEqual(mockResult);
      });
    });

    describe('deleteReadNotifications', () => {
      it('should delete only read notifications for a user', async () => {
        const userId = 'user123';
        const mockResult = { count: 7 };

        PrismaServiceMock.useValue.notification.deleteMany.mockResolvedValue(mockResult);

        const result = await service.deleteReadNotifications(userId);

        expect(PrismaServiceMock.useValue.notification.deleteMany).toHaveBeenCalledWith({
          where: { userId, read: true },
        });
        expect(result).toEqual(mockResult);
      });
    });

    describe('bulkMarkAsRead', () => {
      it('should mark multiple notifications as read', async () => {
        const notificationIds = ['id1', 'id2', 'id3'];
        const mockResult = { count: 3 };
        const mockNotifications = [
          { userId: 'user1' },
          { userId: 'user2' },
          { userId: 'user1' },
        ];

        PrismaServiceMock.useValue.notification.updateMany.mockResolvedValue(mockResult);
        PrismaServiceMock.useValue.notification.findMany.mockResolvedValue(
          mockNotifications,
        );

        const result = await service.bulkMarkAsRead(notificationIds);

        expect(PrismaServiceMock.useValue.notification.updateMany).toHaveBeenCalledWith({
          where: { id: { in: notificationIds } },
          data: { read: true },
        });
        expect(result).toEqual(mockResult);
      });
    });

    describe('bulkDelete', () => {
      it('should delete multiple notifications', async () => {
        const notificationIds = ['id1', 'id2', 'id3'];
        const mockResult = { count: 3 };
        const mockNotifications = [{ userId: 'user1' }, { userId: 'user2' }];

        PrismaServiceMock.useValue.notification.findMany.mockResolvedValue(
          mockNotifications,
        );
        PrismaServiceMock.useValue.notification.deleteMany.mockResolvedValue(mockResult);

        const result = await service.bulkDelete(notificationIds);

        expect(PrismaServiceMock.useValue.notification.findMany).toHaveBeenCalledWith({
          where: { id: { in: notificationIds } },
          select: { userId: true },
        });
        expect(PrismaServiceMock.useValue.notification.deleteMany).toHaveBeenCalledWith({
          where: { id: { in: notificationIds } },
        });
        expect(result).toEqual(mockResult);
      });
    });

    describe('deleteNotificationsByType', () => {
      it('should delete notifications by type for a user', async () => {
        const userId = 'user123';
        const type = 'system';
        const mockResult = { count: 4 };

        PrismaServiceMock.useValue.notification.deleteMany.mockResolvedValue(mockResult);

        const result = await service.deleteNotificationsByType(userId, type);

        expect(PrismaServiceMock.useValue.notification.deleteMany).toHaveBeenCalledWith({
          where: { userId, type },
        });
        expect(result).toEqual(mockResult);
      });
    });

    describe('getNotificationStats', () => {
      it('should return notification statistics for a user', async () => {
        const userId = 'user123';
        const mockTotal = 15;
        const mockUnread = 5;
        const mockByType = [
          { type: 'system', _count: { type: 8 } },
          { type: 'user', _count: { type: 4 } },
          { type: 'alert', _count: { type: 3 } },
        ];

        PrismaServiceMock.useValue.notification.count
          .mockResolvedValueOnce(mockTotal)
          .mockResolvedValueOnce(mockUnread);
        PrismaServiceMock.useValue.notification.groupBy.mockResolvedValue(mockByType);

        const result = await service.getNotificationStats(userId);

        expect(result).toEqual({
          total: 15,
          unread: 5,
          read: 10,
          byType: [
            { type: 'system', count: 8 },
            { type: 'user', count: 4 },
            { type: 'alert', count: 3 },
          ],
        });
      });
    });
  });

  describe('setNotificationGateway', () => {
    it('should set notification gateway', () => {
      const mockGateway = {
        sendNotificationToUser: jest.fn(),
      };

      service.setNotificationGateway(mockGateway);

      // Access private property for testing
      expect(service['notificationGateway']).toBe(mockGateway);
    });
  });
});
