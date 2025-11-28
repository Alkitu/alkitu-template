import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from '../notification.controller';
import { NotificationService } from '../notification.service';
import { CreateNotificationDto, BulkMarkAsReadDto, BulkDeleteDto } from '../dto/create-notification.dto';
import { NotificationPreferencesDto, EmailFrequency } from '../dto/notification-preferences.dto';

describe('NotificationController', () => {
  let controller: NotificationController;
  let notificationService: NotificationService;

  const mockNotificationService = {
    createNotification: jest.fn(),
    getNotifications: jest.fn(),
    markAsRead: jest.fn(),
    getUnreadCount: jest.fn(),
    getUserPreferences: jest.fn(),
    getDefaultPreferences: jest.fn(),
    createOrUpdatePreferences: jest.fn(),
    deletePreferences: jest.fn(),
    markAllAsRead: jest.fn(),
    deleteAllNotifications: jest.fn(),
    deleteReadNotifications: jest.fn(),
    bulkMarkAsRead: jest.fn(),
    bulkDelete: jest.fn(),
    deleteNotificationsByType: jest.fn(),
    getNotificationStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    notificationService = module.get<NotificationService>(NotificationService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const createDto: CreateNotificationDto = {
        userId: 'user123',
        message: 'Test notification',
        type: 'info' as any,
        link: 'https://example.com',
      };

      const expectedResult = {
        id: 'notification123',
        ...createDto,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNotificationService.createNotification.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(mockNotificationService.createNotification).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUserNotifications', () => {
    it('should get user notifications', async () => {
      const userId = 'user123';
      const expectedNotifications = [
        {
          id: 'notification1',
          userId,
          message: 'Test notification 1',
          type: 'info',
          read: false,
          createdAt: new Date(),
        },
        {
          id: 'notification2',
          userId,
          message: 'Test notification 2',
          type: 'warning',
          read: true,
          createdAt: new Date(),
        },
      ];

      mockNotificationService.getNotifications.mockResolvedValue(expectedNotifications);

      const result = await controller.getUserNotifications(userId);

      expect(mockNotificationService.getNotifications).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedNotifications);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = 'notification123';
      const expectedResult = {
        id: notificationId,
        read: true,
        updatedAt: new Date(),
      };

      mockNotificationService.markAsRead.mockResolvedValue(expectedResult);

      const result = await controller.markAsRead(notificationId);

      expect(mockNotificationService.markAsRead).toHaveBeenCalledWith(notificationId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUnreadCount', () => {
    it('should get unread notification count', async () => {
      const userId = 'user123';
      const unreadCount = 5;

      mockNotificationService.getUnreadCount.mockResolvedValue(unreadCount);

      const result = await controller.getUnreadCount(userId);

      expect(mockNotificationService.getUnreadCount).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ count: unreadCount });
    });
  });

  describe('getUserPreferences', () => {
    it('should get user notification preferences', async () => {
      const userId = 'user123';
      const preferences = {
        emailEnabled: true,
        emailTypes: ['welcome', 'security'],
        pushEnabled: false,
        pushTypes: ['urgent'],
        inAppEnabled: true,
        inAppTypes: ['all'],
        emailFrequency: EmailFrequency.DAILY,
        digestEnabled: false,
        quietHoursEnabled: false,
        quietHoursStart: null,
        quietHoursEnd: null,
        marketingEnabled: false,
        promotionalEnabled: false,
      };

      mockNotificationService.getUserPreferences.mockResolvedValue(preferences);

      const result = await controller.getUserPreferences(userId);

      expect(mockNotificationService.getUserPreferences).toHaveBeenCalledWith(userId);
      expect(result).toEqual(preferences);
    });

    it('should return default preferences when user preferences not found', async () => {
      const userId = 'user123';
      const defaultPreferences = {
        emailEnabled: true,
        emailTypes: ['welcome', 'security', 'system'],
        pushEnabled: true,
        pushTypes: ['urgent', 'mentions', 'system'],
        inAppEnabled: true,
        inAppTypes: ['all'],
        emailFrequency: EmailFrequency.IMMEDIATE,
        digestEnabled: false,
        quietHoursEnabled: false,
        quietHoursStart: null,
        quietHoursEnd: null,
        marketingEnabled: false,
        promotionalEnabled: false,
      };

      mockNotificationService.getUserPreferences.mockResolvedValue(null);
      mockNotificationService.getDefaultPreferences.mockReturnValue(defaultPreferences);

      const result = await controller.getUserPreferences(userId);

      expect(mockNotificationService.getUserPreferences).toHaveBeenCalledWith(userId);
      expect(mockNotificationService.getDefaultPreferences).toHaveBeenCalled();
      expect(result).toEqual(defaultPreferences);
    });
  });

  describe('updateUserPreferences', () => {
    it('should update user notification preferences', async () => {
      const userId = 'user123';
      const preferencesDto: NotificationPreferencesDto = {
        emailEnabled: false,
        emailTypes: ['security'],
        pushEnabled: true,
        pushTypes: ['urgent', 'mentions'],
        inAppEnabled: true,
        inAppTypes: ['all'],
        emailFrequency: EmailFrequency.HOURLY,
        digestEnabled: true,
        quietHoursEnabled: true,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00',
        marketingEnabled: false,
        promotionalEnabled: false,
      };

      mockNotificationService.createOrUpdatePreferences.mockResolvedValue(preferencesDto);

      const result = await controller.updateUserPreferences(userId, preferencesDto);

      expect(mockNotificationService.createOrUpdatePreferences).toHaveBeenCalledWith(userId, preferencesDto);
      expect(result).toEqual(preferencesDto);
    });
  });

  describe('resetUserPreferences', () => {
    it('should reset user preferences successfully', async () => {
      const userId = 'user123';

      mockNotificationService.deletePreferences.mockResolvedValue(undefined);

      const result = await controller.resetUserPreferences(userId);

      expect(mockNotificationService.deletePreferences).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ message: 'Preferences reset to default successfully' });
    });

    it('should handle case when no preferences found to reset', async () => {
      const userId = 'user123';

      mockNotificationService.deletePreferences.mockRejectedValue(new Error('Not found'));

      const result = await controller.resetUserPreferences(userId);

      expect(mockNotificationService.deletePreferences).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ message: 'No preferences found to reset' });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const userId = 'user123';
      const expectedResult = { updated: 5 };

      mockNotificationService.markAllAsRead.mockResolvedValue(expectedResult);

      const result = await controller.markAllAsRead(userId);

      expect(mockNotificationService.markAllAsRead).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteAllNotifications', () => {
    it('should delete all user notifications', async () => {
      const userId = 'user123';
      const expectedResult = { deleted: 10 };

      mockNotificationService.deleteAllNotifications.mockResolvedValue(expectedResult);

      const result = await controller.deleteAllNotifications(userId);

      expect(mockNotificationService.deleteAllNotifications).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteReadNotifications', () => {
    it('should delete read notifications', async () => {
      const userId = 'user123';
      const expectedResult = { deleted: 3 };

      mockNotificationService.deleteReadNotifications.mockResolvedValue(expectedResult);

      const result = await controller.deleteReadNotifications(userId);

      expect(mockNotificationService.deleteReadNotifications).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('bulkMarkAsRead', () => {
    it('should bulk mark notifications as read', async () => {
      const bulkMarkAsReadDto: BulkMarkAsReadDto = {
        notificationIds: ['notification1', 'notification2', 'notification3'],
      };
      const expectedResult = { updated: 3 };

      mockNotificationService.bulkMarkAsRead.mockResolvedValue(expectedResult);

      const result = await controller.bulkMarkAsRead(bulkMarkAsReadDto);

      expect(mockNotificationService.bulkMarkAsRead).toHaveBeenCalledWith(bulkMarkAsReadDto.notificationIds);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('bulkDeleteNotifications', () => {
    it('should bulk delete notifications', async () => {
      const bulkDeleteDto: BulkDeleteDto = {
        notificationIds: ['notification1', 'notification2'],
      };
      const expectedResult = { deleted: 2 };

      mockNotificationService.bulkDelete.mockResolvedValue(expectedResult);

      const result = await controller.bulkDeleteNotifications(bulkDeleteDto);

      expect(mockNotificationService.bulkDelete).toHaveBeenCalledWith(bulkDeleteDto.notificationIds);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteNotificationsByType', () => {
    it('should delete notifications by type', async () => {
      const userId = 'user123';
      const type = 'info';
      const expectedResult = { deleted: 4 };

      mockNotificationService.deleteNotificationsByType.mockResolvedValue(expectedResult);

      const result = await controller.deleteNotificationsByType(userId, type);

      expect(mockNotificationService.deleteNotificationsByType).toHaveBeenCalledWith(userId, type);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getNotificationStats', () => {
    it('should get notification statistics', async () => {
      const userId = 'user123';
      const expectedStats = {
        total: 25,
        unread: 5,
        read: 20,
        byType: {
          info: 15,
          warning: 5,
          error: 3,
          success: 2,
        },
      };

      mockNotificationService.getNotificationStats.mockResolvedValue(expectedStats);

      const result = await controller.getNotificationStats(userId);

      expect(mockNotificationService.getNotificationStats).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedStats);
    });
  });
});