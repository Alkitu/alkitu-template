import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { NotificationsModulePlugin } from './notifications-module.plugin';
import { ModuleFlag } from '../../../config/modules.config';

describe('NotificationsModulePlugin', () => {
  let plugin: NotificationsModulePlugin;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsModulePlugin],
    }).compile();

    plugin = module.get<NotificationsModulePlugin>(NotificationsModulePlugin);
    (plugin as any).logger = mockLogger;
  });

  describe('plugin properties', () => {
    it('should have correct plugin properties', () => {
      expect(plugin.name).toBe('notifications');
      expect(plugin.category).toBe('feature');
      expect(plugin.version).toBe('1.0.0');
      expect(plugin.dependencies).toEqual(['users', 'email']);
    });
  });

  describe('create', () => {
    it('should create notifications module successfully', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {
          enableEmail: true,
          enablePush: true,
          enableInApp: true,
          retentionDays: 30,
          channels: ['email', 'push', 'inApp'],
        },
      };

      const result = await plugin.create(config);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('name', 'notifications');
      expect(result).toHaveProperty('type', 'feature');
      expect(result).toHaveProperty('config', config.config);
      expect(result).toHaveProperty('initialized', true);
      expect(result).toHaveProperty('services');
      expect(result).toHaveProperty('sendNotification');
      expect(result).toHaveProperty('getNotifications');
      expect(result).toHaveProperty('markAsRead');
      expect(result).toHaveProperty('getUserPreferences');
      expect(mockLogger.log).toHaveBeenCalledWith('Creating Notifications module with config:', config.config);
      expect(mockLogger.log).toHaveBeenCalledWith('Notifications module created successfully');
    });

    it('should handle creation errors gracefully', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {},
      };

      // Mock an error during creation
      jest.spyOn(plugin, 'create').mockImplementationOnce(async () => {
        throw new Error('Test error');
      });

      await expect(plugin.create(config)).rejects.toThrow('Test error');
    });

    it('should include notifications-specific services', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {},
      };

      const result: any = await plugin.create(config);

      expect(result.services).toHaveProperty('notificationService');
      expect(result.services).toHaveProperty('notificationChannelRegistry');
      expect(result.services).toHaveProperty('emailNotificationChannel');
      expect(result.services).toHaveProperty('pushNotificationChannel');
      expect(result.services).toHaveProperty('inAppNotificationChannel');
    });

    it('should include notifications-specific methods', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {},
      };

      const result: any = await plugin.create(config);

      expect(typeof result.sendNotification).toBe('function');
      expect(typeof result.getNotifications).toBe('function');
      expect(typeof result.markAsRead).toBe('function');
      expect(typeof result.getUserPreferences).toBe('function');
    });
  });

  describe('supports', () => {
    it('should return true for notifications module', () => {
      expect(plugin.supports('notifications')).toBe(true);
    });

    it('should return false for other modules', () => {
      expect(plugin.supports('auth')).toBe(false);
      expect(plugin.supports('users')).toBe(false);
      expect(plugin.supports('health')).toBe(false);
    });
  });

  describe('validateConfig', () => {
    it('should validate valid config successfully', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {
          enableEmail: true,
          enablePush: false,
          enableInApp: true,
          retentionDays: 30,
          channels: ['email', 'inApp'],
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return valid for disabled config', () => {
      const config: ModuleFlag = {
        enabled: false,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {},
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return error for missing config', () => {
      const result = plugin.validateConfig(null as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Notifications module config is required');
    });

    it('should return error for missing config.config', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: null as any,
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Notifications module config.config is required');
    });

    it('should validate enableEmail type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {
          enableEmail: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('enableEmail must be a boolean');
    });

    it('should validate enablePush type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {
          enablePush: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('enablePush must be a boolean');
    });

    it('should validate enableInApp type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {
          enableInApp: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('enableInApp must be a boolean');
    });

    it('should validate retentionDays type and minimum value', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {
          retentionDays: -1,
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('retentionDays must be a positive integer');
    });

    it('should validate channels type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {
          channels: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('channels must be an array');
    });

    it('should validate multiple errors', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {
          enableEmail: 'invalid',
          enablePush: 'invalid',
          enableInApp: 'invalid',
          retentionDays: -1,
          channels: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(5);
      expect(result.errors).toContain('enableEmail must be a boolean');
      expect(result.errors).toContain('enablePush must be a boolean');
      expect(result.errors).toContain('enableInApp must be a boolean');
      expect(result.errors).toContain('retentionDays must be a positive integer');
      expect(result.errors).toContain('channels must be an array');
    });
  });

  describe('getMetadata', () => {
    it('should return comprehensive metadata', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.name).toBe('notifications');
      expect(metadata.category).toBe('feature');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.dependencies).toEqual(['users', 'email']);
      expect(metadata.description).toContain('Multi-channel notification system');
      expect(metadata.tags).toContain('notifications');
      expect(metadata.tags).toContain('messaging');
      expect(metadata.tags).toContain('feature');
      expect(metadata.tags).toContain('multi-channel');
    });

    it('should include config schema', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.configSchema).toHaveProperty('enableEmail');
      expect(metadata.configSchema).toHaveProperty('enablePush');
      expect(metadata.configSchema).toHaveProperty('enableInApp');
      expect(metadata.configSchema).toHaveProperty('retentionDays');
      expect(metadata.configSchema).toHaveProperty('channels');
      expect(metadata.configSchema).toHaveProperty('defaultChannel');
    });

    it('should have correct config schema types', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.configSchema?.enableEmail).toHaveProperty('type', 'boolean');
      expect(metadata.configSchema?.enablePush).toHaveProperty('type', 'boolean');
      expect(metadata.configSchema?.enableInApp).toHaveProperty('type', 'boolean');
      expect(metadata.configSchema?.retentionDays).toHaveProperty('type', 'number');
      expect(metadata.configSchema?.channels).toHaveProperty('type', 'array');
      expect(metadata.configSchema?.defaultChannel).toHaveProperty('type', 'string');
    });
  });

  describe('private methods', () => {
    let mockDateNow: jest.SpyInstance;

    beforeEach(() => {
      mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(1234567890000);
    });

    afterEach(() => {
      mockDateNow.mockRestore();
    });

    it('should send notification correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const notificationData = {
        userId: 'user123',
        title: 'Test Notification',
        message: 'This is a test notification',
      };
      const sentNotification = await result.sendNotification(notificationData);

      expect(sentNotification).toHaveProperty('id', 'notification_1234567890000');
      expect(sentNotification).toHaveProperty('status', 'sent');
      expect(sentNotification).toHaveProperty('channels', ['email', 'inApp']);
      expect(sentNotification).toHaveProperty('sentAt');
      expect(sentNotification).toHaveProperty('userId', 'user123');
      expect(sentNotification).toHaveProperty('title', 'Test Notification');
      expect(sentNotification).toHaveProperty('message', 'This is a test notification');
      expect(mockLogger.debug).toHaveBeenCalledWith('Sending notification:', notificationData);
    });

    it('should get notifications correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const notifications = await result.getNotifications('user123');

      expect(notifications).toHaveLength(2);
      expect(notifications[0]).toHaveProperty('id', 'notif_1');
      expect(notifications[0]).toHaveProperty('userId', 'user123');
      expect(notifications[0]).toHaveProperty('title', 'Welcome to the platform!');
      expect(notifications[0]).toHaveProperty('message', 'Thank you for joining us.');
      expect(notifications[0]).toHaveProperty('type', 'welcome');
      expect(notifications[0]).toHaveProperty('read', false);
      expect(notifications[1]).toHaveProperty('id', 'notif_2');
      expect(notifications[1]).toHaveProperty('userId', 'user123');
      expect(notifications[1]).toHaveProperty('title', 'Security Alert');
      expect(notifications[1]).toHaveProperty('type', 'security');
      expect(notifications[1]).toHaveProperty('read', true);
      expect(mockLogger.debug).toHaveBeenCalledWith('Getting notifications for user: user123');
    });

    it('should mark notification as read correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const marked = await result.markAsRead('notif_123');

      expect(marked).toBe(true);
      expect(mockLogger.debug).toHaveBeenCalledWith('Marking notification as read: notif_123');
    });

    it('should get user preferences correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'email'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const preferences = await result.getUserPreferences('user123');

      expect(preferences).toHaveProperty('userId', 'user123');
      expect(preferences).toHaveProperty('emailEnabled', true);
      expect(preferences).toHaveProperty('pushEnabled', false);
      expect(preferences).toHaveProperty('inAppEnabled', true);
      expect(preferences).toHaveProperty('frequency', 'immediate');
      expect(preferences).toHaveProperty('categories');
      expect(preferences.categories).toHaveProperty('security', true);
      expect(preferences.categories).toHaveProperty('marketing', false);
      expect(preferences.categories).toHaveProperty('updates', true);
      expect(preferences.categories).toHaveProperty('social', false);
      expect(mockLogger.debug).toHaveBeenCalledWith('Getting notification preferences for user: user123');
    });
  });
});