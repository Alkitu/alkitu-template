// @ts-nocheck
// 
// ✅ Test Factory: Notification Model Factory
// packages/api/src/test/factories/notification.factory.ts

import { Notification } from '@prisma/client';

export class NotificationFactory {
  static create(overrides: Partial<Notification> = {}): Notification {
    const defaultNotification: Notification = {
      id: '507f1f77bcf86cd799439012',
      userId: '507f1f77bcf86cd799439011',
      message: 'Test notification message',
      type: 'info',
      link: null,
      read: false,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      ...overrides,
    };

    return defaultNotification;
  }

  static createWelcome(overrides: Partial<Notification> = {}): Notification {
    return this.create({
      message: 'Welcome to our platform!',
      type: 'welcome',
      link: '/dashboard',
      ...overrides,
    });
  }

  static createSecurity(overrides: Partial<Notification> = {}): Notification {
    return this.create({
      message: 'Security alert: Password changed',
      type: 'security',
      link: '/security',
      ...overrides,
    });
  }

  static createRead(overrides: Partial<Notification> = {}): Notification {
    return this.create({
      read: true,
      ...overrides,
    });
  }

  static createUnread(overrides: Partial<Notification> = {}): Notification {
    return this.create({
      read: false,
      ...overrides,
    });
  }
}

// Export common notification instances for tests
export const testNotifications = {
  basic: NotificationFactory.create(),
  welcome: NotificationFactory.createWelcome(),
  security: NotificationFactory.createSecurity(),
  read: NotificationFactory.createRead(),
  unread: NotificationFactory.createUnread(),
};
