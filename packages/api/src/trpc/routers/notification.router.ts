import { t, protectedProcedure } from '../trpc';
import { NotificationService } from '../../notification/notification.service';
import { handlePrismaError } from '../utils/prisma-error-mapper';
import {
  getNotificationsSchema,
  getNotificationsWithFiltersSchema,
  exportNotificationsSchema,
  getNotificationAnalyticsSchema,
  markAsReadSchema,
  markAsUnreadSchema,
  deleteNotificationSchema,
  bulkMarkAsReadSchema,
  bulkMarkAsUnreadSchema,
  bulkDeleteSchema,
  getUnreadCountSchema,
  markAllAsReadSchema,
  deleteAllNotificationsSchema,
  deleteReadNotificationsSchema,
  deleteNotificationsByTypeSchema,
  getNotificationStatsSchema,
  getUserPreferencesSchema,
  createOrUpdatePreferencesSchema,
  deletePreferencesSchema,
  getNotificationsWithCursorSchema,
  getRecentNotificationsSchema,
  getNotificationCountsOptimizedSchema,
  bulkMarkAsReadOptimizedSchema,
} from '../schemas/notification.schemas';

/**
 * Notification Router
 * All schemas are imported from '../schemas/notification.schemas.ts'
 */
export const createNotificationRouter = (
  notificationService: NotificationService,
) =>
  t.router({
    getNotifications: protectedProcedure
      .input(getNotificationsSchema)
      .query(async ({ input }) => {
        try {
          return await notificationService.getNotifications(input.userId);
        } catch (error) {
          handlePrismaError(error, 'fetch notifications');
        }
      }),

    getNotificationsWithFilters: protectedProcedure
      .input(getNotificationsWithFiltersSchema)
      .query(async ({ input }) => {
        try {
          const { userId, dateFrom, dateTo, ...filters } = input;
          return await notificationService.getNotificationsWithFilters(userId, {
            ...filters,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
          });
        } catch (error) {
          handlePrismaError(error, 'get filtered notifications');
        }
      }),

    exportNotifications: protectedProcedure
      .input(exportNotificationsSchema)
      .query(async ({ input }) => {
        try {
          const { userId, dateFrom, dateTo, ...filters } = input;
          return await notificationService.exportNotifications(userId, {
            ...filters,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
          });
        } catch (error) {
          handlePrismaError(error, 'export notifications');
        }
      }),

    getNotificationAnalytics: protectedProcedure
      .input(getNotificationAnalyticsSchema)
      .query(async ({ input }) => {
        try {
          return await notificationService.getNotificationAnalytics(
            input.userId,
            input.days,
          );
        } catch (error) {
          handlePrismaError(error, 'get notification analytics');
        }
      }),

    markAsRead: protectedProcedure
      .input(markAsReadSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.markAsRead(input.notificationId);
        } catch (error) {
          handlePrismaError(error, 'mark notification as read');
        }
      }),

    markAsUnread: protectedProcedure
      .input(markAsUnreadSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.markAsUnread(input.notificationId);
        } catch (error) {
          handlePrismaError(error, 'mark notification as unread');
        }
      }),

    deleteNotification: protectedProcedure
      .input(deleteNotificationSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deleteNotification(
            input.notificationId,
          );
        } catch (error) {
          handlePrismaError(error, 'delete notification');
        }
      }),

    bulkMarkAsRead: protectedProcedure
      .input(bulkMarkAsReadSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.bulkMarkAsRead(
            input.notificationIds,
          );
        } catch (error) {
          handlePrismaError(error, 'bulk mark notifications as read');
        }
      }),

    bulkMarkAsUnread: protectedProcedure
      .input(bulkMarkAsUnreadSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.bulkMarkAsUnread(
            input.notificationIds,
          );
        } catch (error) {
          handlePrismaError(error, 'bulk mark notifications as unread');
        }
      }),

    bulkDelete: protectedProcedure
      .input(bulkDeleteSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.bulkDelete(input.notificationIds);
        } catch (error) {
          handlePrismaError(error, 'bulk delete notifications');
        }
      }),

    getUnreadCount: protectedProcedure
      .input(getUnreadCountSchema)
      .query(async ({ input }) => {
        try {
          return await notificationService.getUnreadCount(input.userId);
        } catch (error) {
          handlePrismaError(error, 'get unread notification count');
        }
      }),

    markAllAsRead: protectedProcedure
      .input(markAllAsReadSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.markAllAsRead(input.userId);
        } catch (error) {
          handlePrismaError(error, 'mark all notifications as read');
        }
      }),

    deleteAllNotifications: protectedProcedure
      .input(deleteAllNotificationsSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deleteAllNotifications(input.userId);
        } catch (error) {
          handlePrismaError(error, 'delete all notifications');
        }
      }),

    deleteReadNotifications: protectedProcedure
      .input(deleteReadNotificationsSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deleteReadNotifications(
            input.userId,
          );
        } catch (error) {
          handlePrismaError(error, 'delete read notifications');
        }
      }),

    deleteNotificationsByType: protectedProcedure
      .input(deleteNotificationsByTypeSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deleteNotificationsByType(
            input.userId,
            input.type,
          );
        } catch (error) {
          handlePrismaError(error, 'delete notifications by type');
        }
      }),

    getNotificationStats: protectedProcedure
      .input(getNotificationStatsSchema)
      .query(async ({ input }) => {
        try {
          return await notificationService.getNotificationStats(input.userId);
        } catch (error) {
          handlePrismaError(error, 'get notification stats');
        }
      }),

    // Preferences endpoints
    getUserPreferences: protectedProcedure
      .input(getUserPreferencesSchema)
      .query(async ({ input }) => {
        try {
          return await notificationService.getUserPreferences(input.userId);
        } catch (error) {
          handlePrismaError(error, 'get notification preferences');
        }
      }),

    createOrUpdatePreferences: protectedProcedure
      .input(createOrUpdatePreferencesSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.createOrUpdatePreferences(
            input.userId,
            input.preferences,
          );
        } catch (error) {
          handlePrismaError(error, 'update notification preferences');
        }
      }),

    deletePreferences: protectedProcedure
      .input(deletePreferencesSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.deletePreferences(input.userId);
        } catch (error) {
          handlePrismaError(error, 'delete notification preferences');
        }
      }),

    // Optimized pagination endpoints
    getNotificationsWithCursor: protectedProcedure
      .input(getNotificationsWithCursorSchema)
      .query(async ({ input }) => {
        try {
          const { userId, dateFrom, dateTo, ...options } = input;
          return await notificationService.getNotificationsWithCursor(userId, {
            ...options,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
          });
        } catch (error) {
          handlePrismaError(error, 'get notifications with cursor pagination');
        }
      }),

    getRecentNotifications: protectedProcedure
      .input(getRecentNotificationsSchema)
      .query(async ({ input }) => {
        try {
          return await notificationService.getRecentNotifications(
            input.userId,
            input.limit,
          );
        } catch (error) {
          handlePrismaError(error, 'get recent notifications');
        }
      }),

    getNotificationCountsOptimized: protectedProcedure
      .input(getNotificationCountsOptimizedSchema)
      .query(async ({ input }) => {
        try {
          return await notificationService.getNotificationCountsOptimized(
            input.userId,
          );
        } catch (error) {
          handlePrismaError(error, 'get optimized notification counts');
        }
      }),

    bulkMarkAsReadOptimized: protectedProcedure
      .input(bulkMarkAsReadOptimizedSchema)
      .mutation(async ({ input }) => {
        try {
          return await notificationService.bulkMarkAsReadOptimized(
            input.notificationIds,
            input.batchSize,
          );
        } catch (error) {
          handlePrismaError(
            error,
            'bulk mark notifications as read (optimized)',
          );
        }
      }),
  });
