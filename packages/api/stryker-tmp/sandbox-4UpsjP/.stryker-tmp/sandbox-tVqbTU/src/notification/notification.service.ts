/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck

// 

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

interface Notification {
  id: string;
  message: string;
  type: string | null;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  link: string | null;
}

interface NotificationGateway {
  sendNotificationToUser(
    userId: string,
    notification: Record<string, unknown>,
  ): Promise<void>;
}

interface WhereClause {
  userId: string;
  AND?: any[];
  OR?: any[];
  type?: any;
  read?: boolean;
  message?: any;
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
  id?: {
    gt?: string;
    lt?: string;
  };
  NOT?: any;
}

interface QueryOptions {
  where: any;
  orderBy: any;
  take?: number;
  skip?: number;
}

@Injectable()
export class NotificationService {
  private notificationGateway?: NotificationGateway;

  constructor(private prisma: PrismaService) {}

  setNotificationGateway(gateway: NotificationGateway) {
    this.notificationGateway = gateway;
  }

  async createNotification(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: createNotificationDto,
    });
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string) {
    const notification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    // Send real-time update for unread count if gateway is available
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationToUser(
        notification.userId,
        {
          type: 'notification_read',
          notificationId: notification.id,
        },
      );
    }

    return notification;
  }

  async markAsUnread(notificationId: string) {
    const notification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: false },
    });

    // Send real-time update for unread count if gateway is available
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationToUser(
        notification.userId,
        {
          type: 'notification_unread',
          notificationId: notification.id,
        },
      );
    }

    return notification;
  }

  async deleteNotification(notificationId: string) {
    const notification = await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    // Send real-time update if gateway is available
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationToUser(
        notification.userId,
        {
          type: 'notification_delete',
          notificationId: notification.id,
        },
      );
    }

    return notification;
  }

  async bulkMarkAsRead(notificationIds: string[]) {
    const result = await this.prisma.notification.updateMany({
      where: { id: { in: notificationIds } },
      data: { read: true },
    });

    // Get affected user IDs for real-time updates
    const notifications = await this.prisma.notification.findMany({
      where: { id: { in: notificationIds } },
      select: { userId: true },
    });

    const userIds = [
      ...new Set(notifications.map((n: { userId: string }) => n.userId)),
    ];

    // Send real-time updates to affected users
    if (this.notificationGateway) {
      for (const userId of userIds) {
        await this.notificationGateway.sendNotificationToUser(userId, {
          type: 'notification_bulk_read_selected',
          notificationIds,
        });
      }
    }

    return result;
  }

  async bulkMarkAsUnread(notificationIds: string[]) {
    const result = await this.prisma.notification.updateMany({
      where: { id: { in: notificationIds } },
      data: { read: false },
    });

    // Get affected user IDs for real-time updates
    const notifications = await this.prisma.notification.findMany({
      where: { id: { in: notificationIds } },
      select: { userId: true },
    });

    const userIds = [
      ...new Set(notifications.map((n: { userId: string }) => n.userId)),
    ];

    // Send real-time updates to affected users
    if (this.notificationGateway) {
      for (const userId of userIds) {
        await this.notificationGateway.sendNotificationToUser(userId, {
          type: 'notification_bulk_unread_selected',
          notificationIds,
        });
      }
    }

    return result;
  }

  async bulkDelete(notificationIds: string[]) {
    // Get affected user IDs before deletion
    const notifications = await this.prisma.notification.findMany({
      where: { id: { in: notificationIds } },
      select: { userId: true },
    });

    const userIds = [
      ...new Set(notifications.map((n: { userId: string }) => n.userId)),
    ];

    const result = await this.prisma.notification.deleteMany({
      where: { id: { in: notificationIds } },
    });

    // Send real-time updates to affected users
    if (this.notificationGateway) {
      for (const userId of userIds) {
        await this.notificationGateway.sendNotificationToUser(userId, {
          type: 'notification_bulk_delete_selected',
          notificationIds,
        });
      }
    }

    return result;
  }

  async getNotificationsWithFilters(
    userId: string,
    filters: {
      search?: string;
      types?: string[];
      status?: 'all' | 'read' | 'unread';
      dateFrom?: Date;
      dateTo?: Date;
      sortBy?: 'newest' | 'oldest' | 'type';
      limit?: number;
      offset?: number;
    } = {},
  ) {
    const {
      search,
      types,
      status,
      dateFrom,
      dateTo,
      sortBy = 'newest',
      limit,
      offset,
    } = filters;

    // Build where clause
    const where: WhereClause = { userId };

    // Advanced search parsing
    if (search) {
      const advancedSearch = this.parseAdvancedSearch(search);
      if (advancedSearch) {
        Object.assign(where, advancedSearch);
      } else {
        // Fallback to simple search
        where.OR = [
          { message: { contains: search, mode: 'insensitive' } },
          { type: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    // Type filter (merge with advanced search type filters)
    if (types && types.length > 0) {
      if (where.AND) {
        // Check if there's already a type filter from advanced search
        const existingTypeFilter = where.AND.find(
          (condition: any) => condition.type?.in,
        );
        if (existingTypeFilter) {
          // Merge type filters
          const existingTypes = existingTypeFilter.type.in;
          const mergedTypes = [...new Set([...existingTypes, ...types])];
          existingTypeFilter.type.in = mergedTypes;
        } else {
          where.AND.push({ type: { in: types } });
        }
      } else {
        where.type = { in: types };
      }
    }

    // Status filter
    if (status === 'read') {
      where.read = true;
    } else if (status === 'unread') {
      where.read = false;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = dateFrom;
      }
      if (dateTo) {
        where.createdAt.lte = dateTo;
      }
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sortBy === 'type') {
      orderBy = [{ type: 'asc' }, { createdAt: 'desc' }];
    }

    // Execute query with pagination
    const query: QueryOptions = {
      where,
      orderBy,
    };

    if (limit) {
      query.take = limit;
    }

    if (offset) {
      query.skip = offset;
    }

    const [notifications, totalCount] = await Promise.all([
      this.prisma.notification.findMany(query),
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      totalCount,
      hasMore: limit ? totalCount > (offset || 0) + limit : false,
    };
  }

  // Export notifications to CSV format
  async exportNotifications(
    userId: string,
    filters: {
      search?: string;
      types?: string[];
      status?: 'all' | 'read' | 'unread';
      dateFrom?: Date;
      dateTo?: Date;
      sortBy?: 'newest' | 'oldest' | 'type';
    } = {},
  ) {
    // Get all notifications without pagination for export
    const result = await this.getNotificationsWithFilters(userId, filters);

    const csvHeader = 'ID,Message,Type,Status,Created At,Updated At,Link\n';
    const csvRows = result.notifications
      .map((notification: Notification) => {
        const escapeCsv = (str: string | null) => {
          if (!str) return '';
          return `"${str.replace(/"/g, '""')}"`;
        };

        return [
          notification.id,
          escapeCsv(notification.message),
          notification.type,
          notification.read ? 'Read' : 'Unread',
          notification.createdAt.toISOString(),
          notification.updatedAt.toISOString(),
          escapeCsv(notification.link),
        ].join(',');
      })
      .join('\n');

    return {
      csv: csvHeader + csvRows,
      filename: `notifications-${userId}-${new Date().toISOString().split('T')[0]}.csv`,
      count: result.notifications.length,
    };
  }

  // Get notification analytics
  async getNotificationAnalytics(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      totalCount,
      unreadCount,
      typeDistribution,
      dailyActivity,
      readCount,
    ] = await Promise.all([
      // Total notifications in period
      this.prisma.notification.count({
        where: {
          userId,
          createdAt: { gte: startDate },
        },
      }),

      // Unread notifications
      this.prisma.notification.count({
        where: {
          userId,
          read: false,
          createdAt: { gte: startDate },
        },
      }),

      // Type distribution
      this.prisma.notification.groupBy({
        by: ['type'],
        where: {
          userId,
          createdAt: { gte: startDate },
        },
        _count: { type: true },
      }),

      // Daily activity (last 7 days)
      this.prisma.notification.groupBy({
        by: ['createdAt'],
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        _count: { id: true },
      }),

      // Read notifications count
      this.prisma.notification.count({
        where: {
          userId,
          read: true,
          createdAt: { gte: startDate },
        },
      }),
    ]);

    // Calculate read rate
    const readRate = totalCount > 0 ? (readCount / totalCount) * 100 : 0;

    return {
      totalCount,
      unreadCount,
      readCount,
      readRate: Math.round(readRate * 100) / 100, // Round to 2 decimal places
      typeDistribution: typeDistribution.map(
        (item: { type: string | null; _count: { type: number } }) => ({
          type: item.type || 'unknown',
          count: item._count.type,
        }),
      ),
      dailyActivity: dailyActivity.map(
        (item: { createdAt: Date; _count: { id: number } }) => ({
          date: item.createdAt,
          count: item._count.id,
        }),
      ),
    };
  }

  // Parse advanced search query
  private parseAdvancedSearch(searchQuery: string): WhereClause | null {
    const conditions: any = {
      AND: [],
      OR: [],
    };

    // Handle type: prefix
    const typeMatch = searchQuery.match(/type:(\w+)/gi);
    if (typeMatch) {
      const types = typeMatch.map((match) => match.split(':')[1].toLowerCase());
      conditions.AND.push({ type: { in: types } });
      // Remove type: patterns from search
      searchQuery = searchQuery.replace(/type:\w+/gi, '').trim();
    }

    // Handle quoted phrases
    const quotedPhrases = searchQuery.match(/"([^"]*)"/g);
    if (quotedPhrases) {
      quotedPhrases.forEach((phrase) => {
        const cleanPhrase = phrase.replace(/"/g, '');
        conditions.AND.push({
          OR: [
            { message: { contains: cleanPhrase, mode: 'insensitive' } },
            { type: { contains: cleanPhrase, mode: 'insensitive' } },
          ],
        });
      });
      // Remove quoted phrases from search
      searchQuery = searchQuery.replace(/"([^"]*)"/g, '').trim();
    }

    // Handle OR conditions
    if (searchQuery.includes(' OR ')) {
      const orTerms = searchQuery
        .split(' OR ')
        .map((term) => term.trim())
        .filter(Boolean);
      const orConditions = orTerms.map((term) => ({
        OR: [
          { message: { contains: term, mode: 'insensitive' } },
          { type: { contains: term, mode: 'insensitive' } },
        ],
      }));
      conditions.OR.push(...orConditions);
    } else if (searchQuery.includes(' AND ')) {
      // Handle AND conditions
      const andTerms = searchQuery
        .split(' AND ')
        .map((term) => term.trim())
        .filter(Boolean);
      andTerms.forEach((term) => {
        if (term.startsWith('-')) {
          // Exclude term
          const excludeTerm = term.substring(1);
          conditions.AND.push({
            NOT: {
              OR: [
                { message: { contains: excludeTerm, mode: 'insensitive' } },
                { type: { contains: excludeTerm, mode: 'insensitive' } },
              ],
            },
          });
        } else {
          conditions.AND.push({
            OR: [
              { message: { contains: term, mode: 'insensitive' } },
              { type: { contains: term, mode: 'insensitive' } },
            ],
          });
        }
      });
    } else {
      // Handle simple search with exclusions
      const terms = searchQuery.split(' ').filter(Boolean);
      terms.forEach((term) => {
        if (term.startsWith('-')) {
          // Exclude term
          const excludeTerm = term.substring(1);
          conditions.AND.push({
            NOT: {
              OR: [
                { message: { contains: excludeTerm, mode: 'insensitive' } },
                { type: { contains: excludeTerm, mode: 'insensitive' } },
              ],
            },
          });
        } else {
          conditions.OR.push({
            OR: [
              { message: { contains: term, mode: 'insensitive' } },
              { type: { contains: term, mode: 'insensitive' } },
            ],
          });
        }
      });
    }

    // Clean up empty arrays
    if (conditions.AND.length === 0) delete conditions.AND;
    if (conditions.OR.length === 0) delete conditions.OR;

    return Object.keys(conditions).length > 0 ? conditions : null;
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, read: false },
    });
  }

  // Bulk operations
  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });

    // Send real-time update for unread count if gateway is available
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationToUser(userId, {
        type: 'notification_bulk_read',
        count: result.count,
      });
    }

    return result;
  }

  async deleteAllNotifications(userId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: { userId },
    });

    // Send real-time update if gateway is available
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationToUser(userId, {
        type: 'notification_bulk_delete',
        count: result.count,
      });
    }

    return result;
  }

  async deleteReadNotifications(userId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: {
        userId,
        read: true,
      },
    });

    // Send real-time update if gateway is available
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationToUser(userId, {
        type: 'notification_bulk_delete_read',
        count: result.count,
      });
    }

    return result;
  }

  async deleteNotificationsByType(userId: string, type: string) {
    const result = await this.prisma.notification.deleteMany({
      where: {
        userId,
        type,
      },
    });

    // Send real-time update if gateway is available
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationToUser(userId, {
        type: 'notification_bulk_delete_by_type',
        notificationType: type,
        count: result.count,
      });
    }

    return result;
  }

  async getNotificationStats(userId: string) {
    const [total, unread, byType] = await Promise.all([
      this.prisma.notification.count({
        where: { userId },
      }),
      this.prisma.notification.count({
        where: { userId, read: false },
      }),
      this.prisma.notification.groupBy({
        by: ['type'],
        where: { userId },
        _count: { type: true },
      }),
    ]);

    return {
      total,
      unread,
      read: total - unread,
      byType: byType.map(
        (item: { type: string | null; _count: { type: number } }) => ({
          type: item.type || 'unknown',
          count: item._count.type,
        }),
      ),
    };
  }

  // Notification Preferences
  async getUserPreferences(userId: string) {
    return this.prisma.notificationPreference.findUnique({
      where: { userId },
    });
  }

  async createOrUpdatePreferences(
    userId: string,
    preferences: Record<string, any>,
  ) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: {
        userId,
        ...preferences,
      },
      update: preferences,
    });
  }

  getDefaultPreferences() {
    return {
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
    };
  }

  async deletePreferences(userId: string) {
    return this.prisma.notificationPreference.delete({
      where: { userId },
    });
  }

  async shouldSendNotification(
    userId: string,
    notificationType: string,
    channel: 'email' | 'push' | 'inApp',
  ): Promise<boolean> {
    const preferences = await this.getUserPreferences(userId);

    if (!preferences) {
      // Use default preferences if none exist
      const defaults = this.getDefaultPreferences();
      switch (channel) {
        case 'email':
          return (
            defaults.emailEnabled &&
            defaults.emailTypes.includes(notificationType)
          );
        case 'push':
          return (
            defaults.pushEnabled &&
            defaults.pushTypes.includes(notificationType)
          );
        case 'inApp':
          return (
            defaults.inAppEnabled &&
            (defaults.inAppTypes.includes('all') ||
              defaults.inAppTypes.includes(notificationType))
          );
        default:
          return false;
      }
    }

    // Check if user is in quiet hours
    if (preferences.quietHoursEnabled && (await this.isInQuietHours(userId))) {
      return false;
    }

    switch (channel) {
      case 'email':
        return (
          preferences.emailEnabled &&
          (preferences.emailTypes.includes('all') ||
            preferences.emailTypes.includes(notificationType))
        );
      case 'push':
        return (
          preferences.pushEnabled &&
          (preferences.pushTypes.includes('all') ||
            preferences.pushTypes.includes(notificationType))
        );
      case 'inApp':
        return (
          preferences.inAppEnabled &&
          (preferences.inAppTypes.includes('all') ||
            preferences.inAppTypes.includes(notificationType))
        );
      default:
        return false;
    }
  }

  async isInQuietHours(userId: string): Promise<boolean> {
    const preferences = await this.getUserPreferences(userId);

    if (
      !preferences ||
      !preferences.quietHoursEnabled ||
      !preferences.quietHoursStart ||
      !preferences.quietHoursEnd
    ) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = preferences.quietHoursStart
      .split(':')
      .map(Number);
    const [endHour, endMin] = preferences.quietHoursEnd.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      // Same day quiet hours (e.g., 22:00 to 08:00 next day)
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight (e.g., 22:00 to 08:00 next day)
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  // TICKET #7: Optimized cursor-based pagination for large datasets
  async getNotificationsWithCursor(
    userId: string,
    options: {
      cursor?: string; // Notification ID to start from
      limit?: number;
      search?: string;
      types?: string[];
      status?: 'all' | 'read' | 'unread';
      dateFrom?: Date;
      dateTo?: Date;
      sortBy?: 'newest' | 'oldest' | 'type';
    } = {},
  ) {
    const {
      cursor,
      limit = 20,
      search,
      types,
      status,
      dateFrom,
      dateTo,
      sortBy = 'newest',
    } = options;

    // Build base where clause
    const where: WhereClause = { userId };

    // Advanced search parsing
    if (search) {
      const advancedSearch = this.parseAdvancedSearch(search);
      if (advancedSearch) {
        Object.assign(where, advancedSearch);
      } else {
        // Fallback to simple search
        where.OR = [
          { message: { contains: search, mode: 'insensitive' } },
          { type: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    // Type filter (merge with advanced search type filters)
    if (types && types.length > 0) {
      if (where.AND) {
        // Check if there's already a type filter from advanced search
        const existingTypeFilter = where.AND.find(
          (condition: any) => condition.type?.in,
        );
        if (existingTypeFilter) {
          // Merge type filters
          const existingTypes = existingTypeFilter.type.in;
          const mergedTypes = [...new Set([...existingTypes, ...types])];
          existingTypeFilter.type.in = mergedTypes;
        } else {
          where.AND.push({ type: { in: types } });
        }
      } else {
        where.type = { in: types };
      }
    }

    // Status filter
    if (status === 'read') {
      where.read = true;
    } else if (status === 'unread') {
      where.read = false;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = dateFrom;
      }
      if (dateTo) {
        where.createdAt.lte = dateTo;
      }
    }

    // Cursor-based pagination
    if (cursor) {
      if (sortBy === 'oldest') {
        where.id = { gt: cursor };
      } else {
        where.id = { lt: cursor };
      }
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sortBy === 'type') {
      orderBy = [{ type: 'asc' }, { createdAt: 'desc' }];
    }

    const notifications = await this.prisma.notification.findMany({
      where,
      orderBy,
      take: limit + 1, // Fetch one extra to check if there are more
    });

    const hasMore = notifications.length > limit;
    if (hasMore) {
      notifications.pop(); // Remove the extra record
    }

    const nextCursor = hasMore
      ? notifications[notifications.length - 1]?.id
      : null;

    return {
      notifications,
      hasMore,
      nextCursor,
    };
  }

  async getNotificationsBatch(userId: string, notificationIds: string[]) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        id: { in: notificationIds },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get recent notifications (optimized for dashboard)
  async getRecentNotifications(userId: string, limit: number = 10) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        message: true,
        type: true,
        read: true,
        createdAt: true,
        link: true,
      },
    });
  }

  // Get optimized notification counts for dashboard
  async getNotificationCountsOptimized(userId: string) {
    const [total, unread, urgent] = await Promise.all([
      this.prisma.notification.count({
        where: { userId },
      }),
      this.prisma.notification.count({
        where: { userId, read: false },
      }),
      this.prisma.notification.count({
        where: { userId, type: 'urgent', read: false },
      }),
    ]);

    return { total, unread, urgent };
  }

  // Optimized bulk operations with batch processing
  async bulkMarkAsReadOptimized(
    notificationIds: string[],
    batchSize: number = 100,
  ) {
    const batches: string[][] = [];
    for (let i = 0; i < notificationIds.length; i += batchSize) {
      batches.push(notificationIds.slice(i, i + batchSize));
    }

    const results: any[] = [];
    for (const batch of batches) {
      const result = await this.prisma.notification.updateMany({
        where: { id: { in: batch } },
        data: { read: true },
      });
      results.push(result);
    }

    const totalUpdated = results.reduce(
      (sum: number, result: any) => sum + result.count,
      0,
    );

    // Get affected user IDs for real-time updates
    const affectedNotifications = await this.prisma.notification.findMany({
      where: { id: { in: notificationIds } },
      select: { userId: true },
    });

    const userIds = [
      ...new Set(
        affectedNotifications.map((n: { userId: string }) => n.userId),
      ),
    ];

    // Send real-time updates to affected users
    if (this.notificationGateway) {
      for (const userId of userIds) {
        await this.notificationGateway.sendNotificationToUser(userId, {
          type: 'notification_bulk_read_optimized',
          count: totalUpdated,
        });
      }
    }

    return { count: totalUpdated, batches: results.length };
  }
}
