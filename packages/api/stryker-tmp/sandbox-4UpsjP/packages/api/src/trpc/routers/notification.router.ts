// @ts-nocheck
import { z } from 'zod';
import { t } from '../trpc';
import { NotificationService } from '../../notification/notification.service';
import { TRPCError } from '@trpc/server';

export const createNotificationRouter = (
  notificationService: NotificationService,
) =>
  t.router({
    getNotifications: t.procedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        try {
          const notifications = await notificationService.getNotifications(
            input.userId,
          );
          return notifications;
        } catch (error) {
          console.error('Error fetching notifications:', error);
          throw new Error('Failed to fetch notifications');
        }
      }),

    getNotificationsWithFilters: t.procedure
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
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to get filtered notifications',
          });
        }
      }),

    exportNotifications: t.procedure
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
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to export notifications',
          });
        }
      }),

    getNotificationAnalytics: t.procedure
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
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to get notification analytics',
          });
        }
      }),

    markAsRead: t.procedure
      .input(z.object({ notificationId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.markAsRead(input.notificationId);
        } catch (error) {
          console.error('Error marking notification as read:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to mark notification as read',
          });
        }
      }),

    markAsUnread: t.procedure
      .input(z.object({ notificationId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.markAsUnread(input.notificationId);
        } catch (error) {
          console.error('Error marking notification as unread:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to mark notification as unread',
          });
        }
      }),

    deleteNotification: t.procedure
      .input(z.object({ notificationId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deleteNotification(
            input.notificationId,
          );
        } catch (error) {
          console.error('Error deleting notification:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete notification',
          });
        }
      }),

    bulkMarkAsRead: t.procedure
      .input(z.object({ notificationIds: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.bulkMarkAsRead(
            input.notificationIds,
          );
        } catch (error) {
          console.error('Error bulk marking as read:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to bulk mark as read',
          });
        }
      }),

    bulkMarkAsUnread: t.procedure
      .input(z.object({ notificationIds: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.bulkMarkAsUnread(
            input.notificationIds,
          );
        } catch (error) {
          console.error('Error bulk marking as unread:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to bulk mark as unread',
          });
        }
      }),

    bulkDelete: t.procedure
      .input(z.object({ notificationIds: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.bulkDelete(input.notificationIds);
        } catch (error) {
          console.error('Error bulk deleting notifications:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to bulk delete notifications',
          });
        }
      }),

    getUnreadCount: t.procedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await notificationService.getUnreadCount(input.userId);
        } catch (error) {
          console.error('Error getting unread count:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to get unread count',
          });
        }
      }),

    markAllAsRead: t.procedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.markAllAsRead(input.userId);
        } catch (error) {
          console.error('Error marking all as read:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to mark all as read',
          });
        }
      }),

    deleteAllNotifications: t.procedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deleteAllNotifications(input.userId);
        } catch (error) {
          console.error('Error deleting all notifications:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete all notifications',
          });
        }
      }),

    deleteReadNotifications: t.procedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deleteReadNotifications(
            input.userId,
          );
        } catch (error) {
          console.error('Error deleting read notifications:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete read notifications',
          });
        }
      }),

    deleteNotificationsByType: t.procedure
      .input(z.object({ userId: z.string(), type: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deleteNotificationsByType(
            input.userId,
            input.type,
          );
        } catch (error) {
          console.error('Error deleting notifications by type:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete notifications by type',
          });
        }
      }),

    getNotificationStats: t.procedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await notificationService.getNotificationStats(input.userId);
        } catch (error) {
          console.error('Error getting notification stats:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to get notification stats',
          });
        }
      }),

    // Preferences endpoints
    getUserPreferences: t.procedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await notificationService.getUserPreferences(input.userId);
        } catch (error) {
          console.error('Error getting user preferences:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to get user preferences',
          });
        }
      }),

    createOrUpdatePreferences: t.procedure
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
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update preferences',
          });
        }
      }),

    deletePreferences: t.procedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deletePreferences(input.userId);
        } catch (error) {
          console.error('Error deleting preferences:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete preferences',
          });
        }
      }),

    // Optimized pagination endpoints for TICKET #7
    getNotificationsWithCursor: t.procedure
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
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to get notifications with cursor',
          });
        }
      }),

    getRecentNotifications: t.procedure
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
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to get recent notifications',
          });
        }
      }),

    getNotificationCountsOptimized: t.procedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await notificationService.getNotificationCountsOptimized(
            input.userId,
          );
        } catch (error) {
          console.error('Error getting optimized notification counts:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to get optimized notification counts',
          });
        }
      }),

    bulkMarkAsReadOptimized: t.procedure
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
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to bulk mark as read (optimized)',
          });
        }
      }),
  });

// Export will be created in trpc.router.ts with proper dependency injection
