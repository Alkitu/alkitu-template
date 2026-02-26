import { z } from 'zod';

/**
 * ALI-120: Notification Zod Schemas
 * Validation schemas for notification system with structured payload support
 */

/**
 * Request notification data schema
 * Used for REQUEST_* notification types
 */
export const RequestNotificationDataSchema = z.object({
  requestId: z.string(),
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  employeeId: z.string().optional(),
  employeeName: z.string().optional(),
  previousStatus: z
    .enum(['PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED'])
    .optional(),
  newStatus: z
    .enum(['PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED'])
    .optional(),
  cancellationReason: z.string().optional(),
  completionNotes: z.string().optional(),
});

/**
 * Generic notification data schema
 * Used for INFO, WARNING, ERROR, SUCCESS, CHAT_* notification types
 */
export const GenericNotificationDataSchema = z.object({
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Union schema for all notification data types
 */
export const NotificationDataSchema = z.union([
  GenericNotificationDataSchema,
  RequestNotificationDataSchema,
]);

/**
 * Create notification schema
 * Used for creating new notifications
 */
export const CreateNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message cannot exceed 500 characters')
    .trim(),
  type: z.string(), // We use string here instead of enum for flexibility
  link: z.string().url('Link must be a valid URL').optional().or(z.literal('')),
  data: NotificationDataSchema.optional(),
});

/**
 * Update notification schema
 * Currently only supports updating read status
 */
export const UpdateNotificationSchema = z.object({
  read: z.boolean().optional(),
});

/**
 * Bulk mark as read schema
 */
export const BulkMarkAsReadSchema = z.object({
  notificationIds: z
    .array(z.string())
    .min(1, 'At least one notification ID is required'),
});

/**
 * Bulk delete schema
 */
export const BulkDeleteSchema = z.object({
  notificationIds: z
    .array(z.string())
    .min(1, 'At least one notification ID is required'),
});

/**
 * Notification ID param schema
 */
export const NotificationIdSchema = z
  .string()
  .min(1, 'Notification ID is required');

/**
 * Inferred types from schemas
 */
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof UpdateNotificationSchema>;
export type BulkMarkAsReadInput = z.infer<typeof BulkMarkAsReadSchema>;
export type BulkDeleteInput = z.infer<typeof BulkDeleteSchema>;
export type NotificationIdInput = z.infer<typeof NotificationIdSchema>;
export type RequestNotificationDataInput = z.infer<
  typeof RequestNotificationDataSchema
>;
export type GenericNotificationDataInput = z.infer<
  typeof GenericNotificationDataSchema
>;
export type NotificationDataInput = z.infer<typeof NotificationDataSchema>;
