import { z } from 'zod';
import { NotificationType } from '@prisma/client';

/**
 * Notification tRPC Schemas
 *
 * All Zod validation schemas for notification-related tRPC endpoints.
 * Extracted from inline definitions for reusability and maintainability.
 */

const userIdSchema = z.object({ userId: z.string() });
const notificationIdSchema = z.object({ notificationId: z.string() });
const notificationIdsSchema = z.object({
  notificationIds: z.array(z.string()),
});

const notificationFilterFields = {
  search: z.string().optional(),
  types: z.array(z.string()).optional(),
  status: z.enum(['all', 'read', 'unread']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(['newest', 'oldest', 'type']).optional(),
};

export const getNotificationsSchema = userIdSchema;

export const getNotificationsWithFiltersSchema = z.object({
  userId: z.string(),
  ...notificationFilterFields,
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

export const exportNotificationsSchema = z.object({
  userId: z.string(),
  ...notificationFilterFields,
});

export const getNotificationAnalyticsSchema = z.object({
  userId: z.string(),
  days: z.number().min(1).max(365).optional().default(30),
});

export const markAsReadSchema = notificationIdSchema;
export const markAsUnreadSchema = notificationIdSchema;
export const deleteNotificationSchema = notificationIdSchema;

export const bulkMarkAsReadSchema = notificationIdsSchema;
export const bulkMarkAsUnreadSchema = notificationIdsSchema;
export const bulkDeleteSchema = notificationIdsSchema;

export const getUnreadCountSchema = userIdSchema;
export const markAllAsReadSchema = userIdSchema;
export const deleteAllNotificationsSchema = userIdSchema;
export const deleteReadNotificationsSchema = userIdSchema;
export const getNotificationStatsSchema = userIdSchema;
export const getUserPreferencesSchema = userIdSchema;
export const deletePreferencesSchema = userIdSchema;

export const deleteNotificationsByTypeSchema = z.object({
  userId: z.string(),
  type: z.nativeEnum(NotificationType),
});

export const createOrUpdatePreferencesSchema = z.object({
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
});

export const getNotificationsWithCursorSchema = z.object({
  userId: z.string(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  ...notificationFilterFields,
});

export const getRecentNotificationsSchema = z.object({
  userId: z.string(),
  limit: z.number().min(1).max(50).default(10),
});

export const getNotificationCountsOptimizedSchema = userIdSchema;

export const bulkMarkAsReadOptimizedSchema = z.object({
  notificationIds: z.array(z.string()),
  batchSize: z.number().min(10).max(500).default(100),
});
