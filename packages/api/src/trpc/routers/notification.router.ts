import { z } from 'zod';
import { t, protectedProcedure } from '../trpc';
import { NotificationService } from '../../notification/notification.service';
import { NotificationType } from '@prisma/client';
import { handlePrismaError } from '../utils/prisma-error-mapper';

export const createNotificationRouter = (
  notificationService: NotificationService,
) =>
  t.router({
    getNotifications: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        try {
          const notifications = await notificationService.getNotifications(
            input.userId,
          );
          return notifications;
        } catch (error) {
          console.error('Error fetching notifications:', error);
          handlePrismaError(error, 'fetch notifications');
        }
      }),

    getNotificationsWithFilters: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          search: z.string().optional(),
          types: z.array(z.string()).optional(),
          status: z.enum(['all', 'read', 'unread']).optional(),
          dateFrom: z.string().datetime().optional(),
          dateTo: z.string().datetime().optional(),
          sortBy: z.enum(['newest', 'oldest', 'type']).optional(),
          limit: z.number().min(1).max(100).optional(),
          offset: z.number().min(0).optional(),
        }),
      )
      .query(async ({ input }) => {
        try {
          const { userId, dateFrom, dateTo, ...filters } = input;
          return await notificationService.getNotificationsWithFilters(userId, {
            ...filters,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
          });
        } catch (error) {
          console.error('Error getting filtered notifications:', error);
          handlePrismaError(error, 'get filtered notifications');
        }
      }),

    exportNotifications: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          search: z.string().optional(),
          types: z.array(z.string()).optional(),
          status: z.enum(['all', 'read', 'unread']).optional(),
          dateFrom: z.string().datetime().optional(),
          dateTo: z.string().datetime().optional(),
          sortBy: z.enum(['newest', 'oldest', 'type']).optional(),
        }),
      )
      .query(async ({ input }) => {
        try {
          const { userId, dateFrom, dateTo, ...filters } = input;
          return await notificationService.exportNotifications(userId, {
            ...filters,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
          });
        } catch (error) {
          console.error('Error exporting notifications:', error);
          handlePrismaError(error, 'export notifications');
        }
      }),

    getNotificationAnalytics: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          days: z.number().min(1).max(365).optional().default(30),
        }),
      )
      .query(async ({ input }) => {
        try {
          return await notificationService.getNotificationAnalytics(
            input.userId,
            input.days,
          );
        } catch (error) {
          console.error('Error getting notification analytics:', error);
          handlePrismaError(error, 'get notification analytics');
        }
      }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.markAsRead(input.notificationId);
        } catch (error) {
          console.error('Error marking notification as read:', error);
          handlePrismaError(error, 'mark notification as read');
        }
      }),

    markAsUnread: protectedProcedure
      .input(z.object({ notificationId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.markAsUnread(input.notificationId);
        } catch (error) {
          console.error('Error marking notification as unread:', error);
          handlePrismaError(error, 'mark notification as unread');
        }
      }),

    deleteNotification: protectedProcedure
      .input(z.object({ notificationId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deleteNotification(
            input.notificationId,
          );
        } catch (error) {
          console.error('Error deleting notification:', error);
          handlePrismaError(error, 'delete notification');
        }
      }),

    bulkMarkAsRead: protectedProcedure
      .input(z.object({ notificationIds: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.bulkMarkAsRead(
            input.notificationIds,
          );
        } catch (error) {
          console.error('Error bulk marking as read:', error);
          handlePrismaError(error, 'bulk mark notifications as read');
        }
      }),

    bulkMarkAsUnread: protectedProcedure
      .input(z.object({ notificationIds: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.bulkMarkAsUnread(
            input.notificationIds,
          );
        } catch (error) {
          console.error('Error bulk marking as unread:', error);
          handlePrismaError(error, 'bulk mark notifications as unread');
        }
      }),

    bulkDelete: protectedProcedure
      .input(z.object({ notificationIds: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.bulkDelete(input.notificationIds);
        } catch (error) {
          console.error('Error bulk deleting notifications:', error);
          handlePrismaError(error, 'bulk delete notifications');
        }
      }),

    getUnreadCount: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await notificationService.getUnreadCount(input.userId);
        } catch (error) {
          console.error('Error getting unread count:', error);
          handlePrismaError(error, 'get unread notification count');
        }
      }),

    markAllAsRead: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.markAllAsRead(input.userId);
        } catch (error) {
          console.error('Error marking all as read:', error);
          handlePrismaError(error, 'mark all notifications as read');
        }
      }),

    deleteAllNotifications: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deleteAllNotifications(input.userId);
        } catch (error) {
          console.error('Error deleting all notifications:', error);
          handlePrismaError(error, 'delete all notifications');
        }
      }),

    deleteReadNotifications: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deleteReadNotifications(
            input.userId,
          );
        } catch (error) {
          console.error('Error deleting read notifications:', error);
          handlePrismaError(error, 'delete read notifications');
        }
      }),

    deleteNotificationsByType: protectedProcedure
      .input(
        z.object({ userId: z.string(), type: z.nativeEnum(NotificationType) }),
      )
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deleteNotificationsByType(
            input.userId,
            input.type,
          );
        } catch (error) {
          console.error('Error deleting notifications by type:', error);
          handlePrismaError(error, 'delete notifications by type');
        }
      }),

    getNotificationStats: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await notificationService.getNotificationStats(input.userId);
        } catch (error) {
          console.error('Error getting notification stats:', error);
          handlePrismaError(error, 'get notification stats');
        }
      }),

    // Preferences endpoints
    getUserPreferences: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await notificationService.getUserPreferences(input.userId);
        } catch (error) {
          console.error('Error getting user preferences:', error);
          handlePrismaError(error, 'get notification preferences');
        }
      }),

    createOrUpdatePreferences: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          preferences: z.object({
            emailEnabled: z.boolean().optional(),
            emailTypes: z.array(z.string()).optional(),
            pushEnabled: z.boolean().optional(),
            pushTypes: z.array(z.string()).optional(),
            inAppEnabled: z.boolean().optional(),
            inAppTypes: z.array(z.string()).optional(),
            emailFrequency: z
              .enum(['immediate', 'hourly', 'daily', 'weekly'])
              .optional(),
            digestEnabled: z.boolean().optional(),
            quietHoursEnabled: z.boolean().optional(),
            quietHoursStart: z.string().nullable().optional(),
            quietHoursEnd: z.string().nullable().optional(),
            marketingEnabled: z.boolean().optional(),
            promotionalEnabled: z.boolean().optional(),
          }),
        }),
      )
      .mutation(async ({ input }) => {
        try {
          return await notificationService.createOrUpdatePreferences(
            input.userId,
            input.preferences,
          );
        } catch (error) {
          console.error('Error updating preferences:', error);
          handlePrismaError(error, 'update notification preferences');
        }
      }),

    deletePreferences: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deletePreferences(input.userId);
        } catch (error) {
          console.error('Error deleting preferences:', error);
          handlePrismaError(error, 'delete notification preferences');
        }
      }),

    // Optimized pagination endpoints for TICKET #7
    getNotificationsWithCursor: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          cursor: z.string().optional(),
          limit: z.number().min(1).max(100).default(20),
          search: z.string().optional(),
          types: z.array(z.string()).optional(),
          status: z.enum(['all', 'read', 'unread']).optional(),
          dateFrom: z.string().datetime().optional(),
          dateTo: z.string().datetime().optional(),
          sortBy: z.enum(['newest', 'oldest', 'type']).optional(),
        }),
      )
      .query(async ({ input }) => {
        try {
          const { userId, dateFrom, dateTo, ...options } = input;
          return await notificationService.getNotificationsWithCursor(userId, {
            ...options,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
          });
        } catch (error) {
          console.error('Error getting notifications with cursor:', error);
          handlePrismaError(error, 'get notifications with cursor pagination');
        }
      }),

    getRecentNotifications: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          limit: z.number().min(1).max(50).default(10),
        }),
      )
      .query(async ({ input }) => {
        try {
          return await notificationService.getRecentNotifications(
            input.userId,
            input.limit,
          );
        } catch (error) {
          console.error('Error getting recent notifications:', error);
          handlePrismaError(error, 'get recent notifications');
        }
      }),

    getNotificationCountsOptimized: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await notificationService.getNotificationCountsOptimized(
            input.userId,
          );
        } catch (error) {
          console.error('Error getting optimized notification counts:', error);
          handlePrismaError(error, 'get optimized notification counts');
        }
      }),

    bulkMarkAsReadOptimized: protectedProcedure
      .input(
        z.object({
          notificationIds: z.array(z.string()),
          batchSize: z.number().min(10).max(500).default(100),
        }),
      )
      .mutation(async ({ input }) => {
        try {
          return await notificationService.bulkMarkAsReadOptimized(
            input.notificationIds,
            input.batchSize,
          );
        } catch (error) {
          console.error('Error bulk marking as read (optimized):', error);
          handlePrismaError(error, 'bulk mark notifications as read (optimized)');
        }
      }),
  });

// Export will be created in trpc.router.ts with proper dependency injection
