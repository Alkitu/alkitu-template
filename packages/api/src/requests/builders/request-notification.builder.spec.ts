/**
 * ALI-120: RequestNotificationBuilder Unit Tests
 * Tests for type-safe notification builder with 95%+ coverage
 */

import { RequestNotificationBuilder } from './request-notification.builder';
import { NotificationType, RequestStatus } from '@prisma/client';

describe('RequestNotificationBuilder (ALI-120)', () => {
  // Mock data
  const mockRequestId = '507f1f77bcf86cd799439011';
  const mockUserId = '507f1f77bcf86cd799439020';
  const mockEmployeeId = '507f1f77bcf86cd799439021';
  const mockServiceId = '507f1f77bcf86cd799439012';

  const mockRequestWithRelations = {
    id: mockRequestId,
    userId: mockUserId,
    serviceId: mockServiceId,
    locationId: '507f1f77bcf86cd799439013',
    assignedToId: null,
    executionDateTime: new Date('2024-12-31T10:00:00Z'),
    templateResponses: {},
    note: null,
    status: RequestStatus.PENDING,
    cancellationRequested: false,
    cancellationRequestedAt: null,
    completedAt: null,
    deletedAt: null,
    createdBy: mockUserId,
    updatedBy: mockUserId,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    user: {
      id: mockUserId,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      company: 'ACME Corp',
    },
    service: {
      id: mockServiceId,
      name: 'Emergency Plumbing',
      categoryId: '507f1f77bcf86cd799439014',
      category: {
        id: '507f1f77bcf86cd799439014',
        name: 'Plumbing',
      },
    },
    assignedTo: {
      id: mockEmployeeId,
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'jane@example.com',
    },
  };

  describe('buildCreatedNotification', () => {
    it('should build client notification with correct structure', () => {
      const result = RequestNotificationBuilder.buildCreatedNotification(
        mockRequestWithRelations,
        'client',
      );

      expect(result).toMatchObject({
        userId: mockUserId,
        type: NotificationType.REQUEST_CREATED,
        link: `/requests/${mockRequestId}`,
      });
      expect(result.message).toContain('Emergency Plumbing');
      expect(result.message).toContain('created successfully');
    });

    it('should build admin notification with correct structure', () => {
      const result = RequestNotificationBuilder.buildCreatedNotification(
        mockRequestWithRelations,
        'admin',
      );

      expect(result).toMatchObject({
        userId: '', // Will be set for each admin
        type: NotificationType.REQUEST_CREATED,
        link: `/requests/${mockRequestId}`,
      });
      expect(result.message).toContain('John Doe');
      expect(result.message).toContain('Emergency Plumbing');
    });

    it('should include correct data payload for client', () => {
      const result = RequestNotificationBuilder.buildCreatedNotification(
        mockRequestWithRelations,
        'client',
      );

      expect(result.data).toEqual({
        requestId: mockRequestId,
        serviceId: mockServiceId,
        serviceName: 'Emergency Plumbing',
        clientId: mockUserId,
        clientName: 'John Doe',
      });
    });

    it('should include correct data payload for admin', () => {
      const result = RequestNotificationBuilder.buildCreatedNotification(
        mockRequestWithRelations,
        'admin',
      );

      expect(result.data).toEqual({
        requestId: mockRequestId,
        serviceId: mockServiceId,
        serviceName: 'Emergency Plumbing',
        clientId: mockUserId,
        clientName: 'John Doe',
      });
    });

    it('should handle missing service name gracefully', () => {
      const requestWithoutService = {
        ...mockRequestWithRelations,
        service: undefined,
      };

      const result = RequestNotificationBuilder.buildCreatedNotification(
        requestWithoutService,
        'client',
      );

      expect(result.message).toContain('service');
      expect(result.data?.serviceName).toBeUndefined();
    });

    it('should handle missing user name gracefully', () => {
      const requestWithoutUser = {
        ...mockRequestWithRelations,
        user: undefined,
      };

      const result = RequestNotificationBuilder.buildCreatedNotification(
        requestWithoutUser,
        'admin',
      );

      expect(result.message).toContain('a client');
      expect(result.data?.clientName).toBeUndefined();
    });
  });

  describe('buildAssignedNotification', () => {
    const assignedRequest = {
      ...mockRequestWithRelations,
      assignedToId: mockEmployeeId,
      status: RequestStatus.ONGOING,
    };

    it('should build employee notification with correct structure', () => {
      const result = RequestNotificationBuilder.buildAssignedNotification(
        assignedRequest,
        'employee',
      );

      expect(result).toMatchObject({
        userId: mockEmployeeId,
        type: NotificationType.REQUEST_ASSIGNED,
        link: `/requests/${mockRequestId}`,
      });
      expect(result.message).toContain('assigned');
      expect(result.message).toContain('Emergency Plumbing');
    });

    it('should build client notification with correct structure', () => {
      const result = RequestNotificationBuilder.buildAssignedNotification(
        assignedRequest,
        'client',
      );

      expect(result).toMatchObject({
        userId: mockUserId,
        type: NotificationType.REQUEST_ASSIGNED,
        link: `/requests/${mockRequestId}`,
      });
      expect(result.message).toContain('assigned to');
      expect(result.message).toContain('Jane Smith');
    });

    it('should include status transition in data payload', () => {
      const result = RequestNotificationBuilder.buildAssignedNotification(
        assignedRequest,
        'employee',
      );

      expect(result.data).toMatchObject({
        requestId: mockRequestId,
        previousStatus: 'PENDING',
        newStatus: RequestStatus.ONGOING,
        employeeId: mockEmployeeId,
        employeeName: 'Jane Smith',
      });
    });

    it('should handle missing employee name gracefully', () => {
      const requestWithoutEmployee = {
        ...assignedRequest,
        assignedTo: undefined,
      };

      const result = RequestNotificationBuilder.buildAssignedNotification(
        requestWithoutEmployee,
        'client',
      );

      expect(result.message).toContain('an employee');
      expect(result.data?.employeeName).toBeUndefined();
    });
  });

  describe('buildCancellationRequestedNotification', () => {
    const cancellationReason = 'Client changed their mind';

    it('should build admin notification with correct structure', () => {
      const result =
        RequestNotificationBuilder.buildCancellationRequestedNotification(
          mockRequestWithRelations,
          cancellationReason,
          'admin',
        );

      expect(result).toMatchObject({
        userId: '', // Will be set for each admin
        type: NotificationType.REQUEST_CANCELLATION_REQUESTED,
        link: `/requests/${mockRequestId}`,
      });
      expect(result.message).toContain('Cancellation requested');
      expect(result.message).toContain(cancellationReason);
    });

    it('should build employee notification with correct structure', () => {
      const assignedRequest = {
        ...mockRequestWithRelations,
        assignedToId: mockEmployeeId,
      };

      const result =
        RequestNotificationBuilder.buildCancellationRequestedNotification(
          assignedRequest,
          cancellationReason,
          'employee',
        );

      expect(result).toMatchObject({
        userId: mockEmployeeId,
        type: NotificationType.REQUEST_CANCELLATION_REQUESTED,
        link: `/requests/${mockRequestId}`,
      });
      expect(result.message).toContain('Cancellation requested');
      expect(result.message).toContain(cancellationReason);
    });

    it('should include cancellation reason in data payload', () => {
      const result =
        RequestNotificationBuilder.buildCancellationRequestedNotification(
          mockRequestWithRelations,
          cancellationReason,
          'admin',
        );

      expect(result.data).toMatchObject({
        requestId: mockRequestId,
        cancellationReason: cancellationReason,
      });
    });

    it('should handle missing assigned employee gracefully', () => {
      const requestWithoutEmployee = {
        ...mockRequestWithRelations,
        assignedToId: null,
        assignedTo: undefined,
      };

      const result =
        RequestNotificationBuilder.buildCancellationRequestedNotification(
          requestWithoutEmployee,
          cancellationReason,
          'admin',
        );

      expect(result.data?.employeeId).toBeUndefined();
      expect(result.data?.employeeName).toBeUndefined();
    });
  });

  describe('buildCancelledNotification', () => {
    it('should build notification with correct structure', () => {
      const result =
        RequestNotificationBuilder.buildCancelledNotification(
          mockRequestWithRelations,
        );

      expect(result).toMatchObject({
        userId: mockUserId,
        type: NotificationType.REQUEST_CANCELLED,
        link: `/requests/${mockRequestId}`,
      });
      expect(result.message).toContain('cancelled');
      expect(result.message).toContain('Emergency Plumbing');
    });

    it('should include status transition in data payload', () => {
      const result =
        RequestNotificationBuilder.buildCancelledNotification(
          mockRequestWithRelations,
        );

      expect(result.data).toMatchObject({
        requestId: mockRequestId,
        newStatus: 'CANCELLED',
      });
      expect(['PENDING', 'ONGOING']).toContain(result.data?.previousStatus);
    });

    it('should handle missing service name gracefully', () => {
      const requestWithoutService = {
        ...mockRequestWithRelations,
        service: undefined,
      };

      const result =
        RequestNotificationBuilder.buildCancelledNotification(
          requestWithoutService,
        );

      expect(result.message).toContain('service');
      expect(result.data?.serviceName).toBeUndefined();
    });
  });

  describe('buildCompletedNotification', () => {
    const completionNotes = 'Fixed the leaking pipe successfully';

    it('should build notification with correct structure', () => {
      const result = RequestNotificationBuilder.buildCompletedNotification(
        mockRequestWithRelations,
        completionNotes,
      );

      expect(result).toMatchObject({
        userId: mockUserId,
        type: NotificationType.REQUEST_COMPLETED,
        link: `/requests/${mockRequestId}`,
      });
      expect(result.message).toContain('completed');
      expect(result.message).toContain('Emergency Plumbing');
    });

    it('should include completion notes in data payload', () => {
      const result = RequestNotificationBuilder.buildCompletedNotification(
        mockRequestWithRelations,
        completionNotes,
      );

      expect(result.data).toMatchObject({
        requestId: mockRequestId,
        previousStatus: 'ONGOING',
        newStatus: 'COMPLETED',
        completionNotes: completionNotes,
      });
    });

    it('should handle missing completion notes gracefully', () => {
      const result = RequestNotificationBuilder.buildCompletedNotification(
        mockRequestWithRelations,
      );

      expect(result.data?.completionNotes).toBeUndefined();
    });

    it('should handle missing service name gracefully', () => {
      const requestWithoutService = {
        ...mockRequestWithRelations,
        service: undefined,
      };

      const result = RequestNotificationBuilder.buildCompletedNotification(
        requestWithoutService,
      );

      expect(result.message).toContain('service');
    });
  });

  describe('Type Safety & Validation', () => {
    it('should always return CreateNotificationDto structure', () => {
      const result = RequestNotificationBuilder.buildCreatedNotification(
        mockRequestWithRelations,
        'client',
      );

      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('link');
      expect(result).toHaveProperty('data');
    });

    it('should use correct NotificationType enum values', () => {
      const createdNotif = RequestNotificationBuilder.buildCreatedNotification(
        mockRequestWithRelations,
        'client',
      );
      const assignedNotif = RequestNotificationBuilder.buildAssignedNotification(
        { ...mockRequestWithRelations, assignedToId: mockEmployeeId },
        'employee',
      );
      const cancelledNotif =
        RequestNotificationBuilder.buildCancelledNotification(
          mockRequestWithRelations,
        );
      const completedNotif =
        RequestNotificationBuilder.buildCompletedNotification(
          mockRequestWithRelations,
        );

      expect(Object.values(NotificationType)).toContain(createdNotif.type);
      expect(Object.values(NotificationType)).toContain(assignedNotif.type);
      expect(Object.values(NotificationType)).toContain(cancelledNotif.type);
      expect(Object.values(NotificationType)).toContain(completedNotif.type);
    });

    it('should always include requestId in data payload', () => {
      const methods = [
        () =>
          RequestNotificationBuilder.buildCreatedNotification(
            mockRequestWithRelations,
            'client',
          ),
        () =>
          RequestNotificationBuilder.buildAssignedNotification(
            { ...mockRequestWithRelations, assignedToId: mockEmployeeId },
            'employee',
          ),
        () =>
          RequestNotificationBuilder.buildCancellationRequestedNotification(
            mockRequestWithRelations,
            'reason',
            'admin',
          ),
        () =>
          RequestNotificationBuilder.buildCancelledNotification(
            mockRequestWithRelations,
          ),
        () =>
          RequestNotificationBuilder.buildCompletedNotification(
            mockRequestWithRelations,
          ),
      ];

      methods.forEach((method) => {
        const result = method();
        expect(result.data).toHaveProperty('requestId');
        expect(result.data?.requestId).toBe(mockRequestId);
      });
    });

    it('should always include link to request detail', () => {
      const methods = [
        () =>
          RequestNotificationBuilder.buildCreatedNotification(
            mockRequestWithRelations,
            'client',
          ),
        () =>
          RequestNotificationBuilder.buildAssignedNotification(
            { ...mockRequestWithRelations, assignedToId: mockEmployeeId },
            'employee',
          ),
        () =>
          RequestNotificationBuilder.buildCancellationRequestedNotification(
            mockRequestWithRelations,
            'reason',
            'admin',
          ),
        () =>
          RequestNotificationBuilder.buildCancelledNotification(
            mockRequestWithRelations,
          ),
        () =>
          RequestNotificationBuilder.buildCompletedNotification(
            mockRequestWithRelations,
          ),
      ];

      methods.forEach((method) => {
        const result = method();
        expect(result.link).toBe(`/requests/${mockRequestId}`);
      });
    });
  });
});
