// @ts-nocheck
// 
import {
  Notification,
  NotificationType,
  NotificationStatus,
} from "@prisma/client";

export interface CreateNotificationData {
  userId?: string;
  type?: NotificationType;
  title?: string;
  message?: string;
  status?: NotificationStatus;
  metadata?: Record<string, any>;
  readAt?: Date;
  expiresAt?: Date;
}

export class NotificationFactory {
  private static defaultNotification: Partial<Notification> = {
    type: NotificationType.INFO,
    title: "Test Notification",
    message: "This is a test notification message",
    status: NotificationStatus.UNREAD,
    metadata: {},
  };

  static create(overrides: CreateNotificationData = {}): Notification {
    return {
      id: this.generateId(),
      ...this.defaultNotification,
      ...overrides,
      userId: overrides.userId || this.generateUserId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Notification;
  }

  static createMany(
    count: number,
    overrides: CreateNotificationData = {}
  ): Notification[] {
    return Array.from({ length: count }, (_, index) =>
      this.create({
        ...overrides,
        title: overrides.title || `Test Notification ${index + 1}`,
      })
    );
  }

  static createInfo(overrides: CreateNotificationData = {}): Notification {
    return this.create({
      ...overrides,
      type: NotificationType.INFO,
      title: overrides.title || "Information",
      message: overrides.message || "This is an information notification",
    });
  }

  static createWarning(overrides: CreateNotificationData = {}): Notification {
    return this.create({
      ...overrides,
      type: NotificationType.WARNING,
      title: overrides.title || "Warning",
      message: overrides.message || "This is a warning notification",
    });
  }

  static createError(overrides: CreateNotificationData = {}): Notification {
    return this.create({
      ...overrides,
      type: NotificationType.ERROR,
      title: overrides.title || "Error",
      message: overrides.message || "This is an error notification",
    });
  }

  static createSuccess(overrides: CreateNotificationData = {}): Notification {
    return this.create({
      ...overrides,
      type: NotificationType.SUCCESS,
      title: overrides.title || "Success",
      message: overrides.message || "This is a success notification",
    });
  }

  static createRead(overrides: CreateNotificationData = {}): Notification {
    return this.create({
      ...overrides,
      status: NotificationStatus.READ,
      readAt: new Date(),
    });
  }

  static createUnread(overrides: CreateNotificationData = {}): Notification {
    return this.create({
      ...overrides,
      status: NotificationStatus.UNREAD,
      readAt: null,
    });
  }

  static createForUser(
    userId: string,
    overrides: CreateNotificationData = {}
  ): Notification {
    return this.create({
      ...overrides,
      userId,
    });
  }

  static createWithMetadata(
    metadata: Record<string, any>,
    overrides: CreateNotificationData = {}
  ): Notification {
    return this.create({
      ...overrides,
      metadata,
    });
  }

  static createExpiring(
    expiresAt: Date,
    overrides: CreateNotificationData = {}
  ): Notification {
    return this.create({
      ...overrides,
      expiresAt,
    });
  }

  static createExpired(overrides: CreateNotificationData = {}): Notification {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    return this.create({
      ...overrides,
      expiresAt: pastDate,
    });
  }

  static createBatch(configs: CreateNotificationData[]): Notification[] {
    return configs.map((config) => this.create(config));
  }

  static createNotificationSet(userId: string): {
    info: Notification;
    warning: Notification;
    error: Notification;
    success: Notification;
    read: Notification;
    unread: Notification;
  } {
    return {
      info: this.createInfo({ userId }),
      warning: this.createWarning({ userId }),
      error: this.createError({ userId }),
      success: this.createSuccess({ userId }),
      read: this.createRead({ userId }),
      unread: this.createUnread({ userId }),
    };
  }

  static createUserNotifications(
    userId: string,
    count: number
  ): Notification[] {
    return this.createMany(count, { userId });
  }

  private static generateId(): string {
    return `notif_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateUserId(): string {
    return `user_${Math.random().toString(36).substr(2, 9)}`;
  }

  static createMinimal(
    overrides: Partial<CreateNotificationData> = {}
  ): Partial<Notification> {
    return {
      id: this.generateId(),
      userId: overrides.userId || this.generateUserId(),
      type: overrides.type || NotificationType.INFO,
      title: overrides.title || "Minimal Notification",
      message: overrides.message || "Minimal message",
      status: overrides.status || NotificationStatus.UNREAD,
    };
  }

  static createSystemNotification(
    overrides: CreateNotificationData = {}
  ): Notification {
    return this.create({
      ...overrides,
      type: NotificationType.INFO,
      title: overrides.title || "System Notification",
      message: overrides.message || "This is a system notification",
      metadata: {
        ...overrides.metadata,
        source: "system",
        automated: true,
      },
    });
  }
}
