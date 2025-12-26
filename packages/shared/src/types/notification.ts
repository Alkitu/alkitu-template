/**
 * ALI-120: Notification System Types
 * Shared types for notification system with structured payload support
 */

// Re-export NotificationType from Prisma (will be available after prisma generate)
// This ensures type consistency across the application
export {  NotificationType } from '@prisma/client';

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
  metadata?: Record<string, any>;
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
