/**
 * ALI-120: Notification Schema Validation Tests
 * Tests for Zod schemas with 100% validation coverage
 */

import { describe, it, expect } from 'vitest';
import {
  RequestNotificationDataSchema,
  GenericNotificationDataSchema,
  NotificationDataSchema,
  CreateNotificationSchema,
  UpdateNotificationSchema,
  BulkMarkAsReadSchema,
  BulkDeleteSchema,
  NotificationIdSchema,
} from './notification';

describe('Notification Schemas (ALI-120)', () => {
  describe('RequestNotificationDataSchema', () => {
    it('should validate valid request notification data', () => {
      const validData = {
        requestId: '507f1f77bcf86cd799439011',
        serviceId: '507f1f77bcf86cd799439012',
        serviceName: 'Emergency Plumbing',
        clientId: '507f1f77bcf86cd799439020',
        clientName: 'John Doe',
        employeeId: '507f1f77bcf86cd799439021',
        employeeName: 'Jane Smith',
        previousStatus: 'PENDING' as const,
        newStatus: 'ONGOING' as const,
        cancellationReason: 'Client changed mind',
        completionNotes: 'Work completed successfully',
      };

      const result = RequestNotificationDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with only required requestId', () => {
      const minimalData = {
        requestId: '507f1f77bcf86cd799439011',
      };

      const result = RequestNotificationDataSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid requestId type', () => {
      const invalidData = {
        requestId: 123, // Should be string
      };

      const result = RequestNotificationDataSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate previousStatus enum values', () => {
      const validStatuses = ['PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

      validStatuses.forEach((status) => {
        const data = {
          requestId: '507f1f77bcf86cd799439011',
          previousStatus: status,
        };

        const result = RequestNotificationDataSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid previousStatus values', () => {
      const data = {
        requestId: '507f1f77bcf86cd799439011',
        previousStatus: 'INVALID_STATUS',
      };

      const result = RequestNotificationDataSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should validate newStatus enum values', () => {
      const validStatuses = ['PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

      validStatuses.forEach((status) => {
        const data = {
          requestId: '507f1f77bcf86cd799439011',
          newStatus: status,
        };

        const result = RequestNotificationDataSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should allow optional fields to be undefined', () => {
      const data = {
        requestId: '507f1f77bcf86cd799439011',
        // All other fields omitted
      };

      const result = RequestNotificationDataSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.serviceName).toBeUndefined();
        expect(result.data.clientName).toBeUndefined();
      }
    });
  });

  describe('GenericNotificationDataSchema', () => {
    it('should validate empty generic data', () => {
      const data = {};

      const result = GenericNotificationDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should validate generic data with metadata', () => {
      const data = {
        metadata: {
          key1: 'value1',
          key2: 123,
          key3: true,
        },
      };

      const result = GenericNotificationDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept any metadata structure', () => {
      const data = {
        metadata: {
          nested: {
            deeply: {
              value: 'test',
            },
          },
        },
      };

      const result = GenericNotificationDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('NotificationDataSchema', () => {
    it('should accept generic notification data', () => {
      const genericData = {
        metadata: { test: 'value' },
      };

      const result = NotificationDataSchema.safeParse(genericData);
      expect(result.success).toBe(true);
    });

    it('should accept request notification data', () => {
      const requestData = {
        requestId: '507f1f77bcf86cd799439011',
        serviceName: 'Test Service',
      };

      const result = NotificationDataSchema.safeParse(requestData);
      expect(result.success).toBe(true);
    });
  });

  describe('CreateNotificationSchema', () => {
    it('should validate complete valid notification', () => {
      const validNotification = {
        userId: '507f1f77bcf86cd799439020',
        message: 'Your request has been created',
        type: 'REQUEST_CREATED',
        link: 'https://example.com/requests/123',
        data: {
          requestId: '507f1f77bcf86cd799439011',
          serviceName: 'Emergency Plumbing',
        },
      };

      const result = CreateNotificationSchema.safeParse(validNotification);
      expect(result.success).toBe(true);
    });

    it('should reject missing userId', () => {
      const invalidNotification = {
        message: 'Test message',
        type: 'INFO',
      };

      const result = CreateNotificationSchema.safeParse(invalidNotification);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required');
      }
    });

    it('should reject empty userId', () => {
      const invalidNotification = {
        userId: '',
        message: 'Test message',
        type: 'INFO',
      };

      const result = CreateNotificationSchema.safeParse(invalidNotification);
      expect(result.success).toBe(false);
    });

    it('should reject missing message', () => {
      const invalidNotification = {
        userId: '507f1f77bcf86cd799439020',
        type: 'INFO',
      };

      const result = CreateNotificationSchema.safeParse(invalidNotification);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required');
      }
    });

    it('should enforce message length limits (max 500 characters)', () => {
      const longMessage = 'a'.repeat(501);
      const invalidNotification = {
        userId: '507f1f77bcf86cd799439020',
        message: longMessage,
        type: 'INFO',
      };

      const result = CreateNotificationSchema.safeParse(invalidNotification);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('cannot exceed 500 characters');
      }
    });

    it('should trim message whitespace', () => {
      const notification = {
        userId: '507f1f77bcf86cd799439020',
        message: '  Test message  ',
        type: 'INFO',
      };

      const result = CreateNotificationSchema.safeParse(notification);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toBe('Test message');
      }
    });

    it('should accept valid URL for link', () => {
      const notification = {
        userId: '507f1f77bcf86cd799439020',
        message: 'Test message',
        type: 'INFO',
        link: 'https://example.com/path',
      };

      const result = CreateNotificationSchema.safeParse(notification);
      expect(result.success).toBe(true);
    });

    it('should accept empty string for link', () => {
      const notification = {
        userId: '507f1f77bcf86cd799439020',
        message: 'Test message',
        type: 'INFO',
        link: '',
      };

      const result = CreateNotificationSchema.safeParse(notification);
      expect(result.success).toBe(true);
    });

    it('should reject invalid URL for link', () => {
      const notification = {
        userId: '507f1f77bcf86cd799439020',
        message: 'Test message',
        type: 'INFO',
        link: 'not-a-valid-url',
      };

      const result = CreateNotificationSchema.safeParse(notification);
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateNotificationSchema', () => {
    it('should validate with read status', () => {
      const update = {
        read: true,
      };

      const result = UpdateNotificationSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    it('should validate with read as false', () => {
      const update = {
        read: false,
      };

      const result = UpdateNotificationSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    it('should validate empty update object', () => {
      const update = {};

      const result = UpdateNotificationSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    it('should reject non-boolean read value', () => {
      const update = {
        read: 'true', // Should be boolean
      };

      const result = UpdateNotificationSchema.safeParse(update);
      expect(result.success).toBe(false);
    });
  });

  describe('BulkMarkAsReadSchema', () => {
    it('should validate with valid notification IDs array', () => {
      const bulkRead = {
        notificationIds: ['id1', 'id2', 'id3'],
      };

      const result = BulkMarkAsReadSchema.safeParse(bulkRead);
      expect(result.success).toBe(true);
    });

    it('should reject empty array', () => {
      const bulkRead = {
        notificationIds: [],
      };

      const result = BulkMarkAsReadSchema.safeParse(bulkRead);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('At least one notification ID is required');
      }
    });

    it('should reject non-string IDs', () => {
      const bulkRead = {
        notificationIds: [123, 456],
      };

      const result = BulkMarkAsReadSchema.safeParse(bulkRead);
      expect(result.success).toBe(false);
    });
  });

  describe('BulkDeleteSchema', () => {
    it('should validate with valid notification IDs array', () => {
      const bulkDelete = {
        notificationIds: ['id1', 'id2', 'id3'],
      };

      const result = BulkDeleteSchema.safeParse(bulkDelete);
      expect(result.success).toBe(true);
    });

    it('should reject empty array', () => {
      const bulkDelete = {
        notificationIds: [],
      };

      const result = BulkDeleteSchema.safeParse(bulkDelete);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('At least one notification ID is required');
      }
    });
  });

  describe('NotificationIdSchema', () => {
    it('should validate valid notification ID', () => {
      const result = NotificationIdSchema.safeParse('507f1f77bcf86cd799439011');
      expect(result.success).toBe(true);
    });

    it('should reject empty string', () => {
      const result = NotificationIdSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Notification ID is required');
      }
    });

    it('should reject non-string values', () => {
      const result = NotificationIdSchema.safeParse(123);
      expect(result.success).toBe(false);
    });
  });
});
