/**
 * ALI-120: Notification System Types
 * Shared types for notification system with structured payload support
 */

// NotificationType enum (must match Prisma schema exactly)
export enum NotificationType {
  // Generic system notifications
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',

  // Chat notifications
  CHAT_NEW_CONVERSATION = 'CHAT_NEW_CONVERSATION',
  CHAT_NEW_MESSAGE = 'CHAT_NEW_MESSAGE',

  // Request lifecycle notifications (ALI-120)
  REQUEST_CREATED = 'REQUEST_CREATED',
  REQUEST_ASSIGNED = 'REQUEST_ASSIGNED',
  REQUEST_STATUS_CHANGED = 'REQUEST_STATUS_CHANGED',
  REQUEST_CANCELLATION_REQUESTED = 'REQUEST_CANCELLATION_REQUESTED',
  REQUEST_CANCELLED = 'REQUEST_CANCELLED',
  REQUEST_COMPLETED = 'REQUEST_COMPLETED',
}

// Base notification interface
export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: string; // We use string here for flexibility (Prisma generates the enum)
  link?: string;
  data?: NotificationData;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Union type for all possible notification data
export type NotificationData =
  | GenericNotificationData
  | RequestNotificationData;

// Generic notifications (chat, system, info)
export interface GenericNotificationData {
  // Can be empty or have generic fields
  metadata?: Record<string, unknown>;
}

// Request lifecycle notifications (ALI-120)
export interface RequestNotificationData {
  requestId: string;
  serviceId?: string;
  serviceName?: string;
  clientId?: string;
  clientName?: string;
  employeeId?: string;
  employeeName?: string;
  previousStatus?: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  newStatus?: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  cancellationReason?: string;
  completionNotes?: string;
}

// Helper type guards
export function isRequestNotificationData(
  data: NotificationData | undefined,
): data is RequestNotificationData {
  return data != null && 'requestId' in data;
}

export function isGenericNotificationData(
  data: NotificationData | undefined,
): data is GenericNotificationData {
  return data != null && 'metadata' in data;
}
