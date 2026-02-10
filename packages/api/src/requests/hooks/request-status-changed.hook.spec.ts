import { Test, TestingModule } from '@nestjs/testing';
import { RequestStatusChangedHook } from './request-status-changed.hook';
import { NotificationService } from '../../notification/notification.service';
import { RequestStatus, NotificationType } from '@prisma/client';

describe('RequestStatusChangedHook', () => {
  let hook: RequestStatusChangedHook;
  let notificationService: jest.Mocked<NotificationService>;

  const mockRequest = {
    id: 'request-123',
    userId: 'user-123',
    serviceId: 'service-123',
    status: RequestStatus.ONGOING,
    assignedToId: 'employee-123',
    service: {
      id: 'service-123',
      name: 'Limpieza de Oficina',
      category: {
        id: 'cat-123',
        name: 'Limpieza',
      },
    },
    user: {
      id: 'user-123',
      email: 'client@example.com',
      firstname: 'John',
      lastname: 'Doe',
    },
    assignedTo: {
      id: 'employee-123',
      email: 'employee@example.com',
      firstname: 'Jane',
      lastname: 'Smith',
    },
  };

  beforeEach(async () => {
    const mockNotificationService = {
      sendMultiChannelNotification: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestStatusChangedHook,
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    hook = module.get<RequestStatusChangedHook>(RequestStatusChangedHook);
    notificationService = module.get(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should skip notifications if status did not change', async () => {
      await hook.execute(
        mockRequest,
        RequestStatus.ONGOING,
        RequestStatus.ONGOING,
      );

      expect(notificationService.sendMultiChannelNotification).not.toHaveBeenCalled();
    });

    it('should notify client when status changes', async () => {
      await hook.execute(
        mockRequest,
        RequestStatus.PENDING,
        RequestStatus.ONGOING,
      );

      expect(notificationService.sendMultiChannelNotification).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({
          type: NotificationType.REQUEST_STATUS_CHANGED,
          message: expect.stringContaining('en progreso'),
          link: '/client/requests/request-123',
        }),
      );
    });

    it('should notify assigned employee when status changes to ONGOING', async () => {
      await hook.execute(
        mockRequest,
        RequestStatus.PENDING,
        RequestStatus.ONGOING,
      );

      // Should notify both client and employee
      expect(notificationService.sendMultiChannelNotification).toHaveBeenCalledTimes(2);

      // Check employee notification
      expect(notificationService.sendMultiChannelNotification).toHaveBeenCalledWith(
        'employee-123',
        expect.objectContaining({
          type: NotificationType.REQUEST_STATUS_CHANGED,
          message: expect.stringContaining('en progreso'),
          link: '/employee/requests/request-123',
        }),
      );
    });

    it('should not notify employee if no assignedToId', async () => {
      const requestWithoutAssignee = {
        ...mockRequest,
        assignedToId: null,
        assignedTo: null,
      };

      await hook.execute(
        requestWithoutAssignee,
        RequestStatus.PENDING,
        RequestStatus.ONGOING,
      );

      // Should only notify client
      expect(notificationService.sendMultiChannelNotification).toHaveBeenCalledTimes(1);
      expect(notificationService.sendMultiChannelNotification).toHaveBeenCalledWith(
        'user-123',
        expect.any(Object),
      );
    });

    it('should notify client with completion message', async () => {
      await hook.execute(
        mockRequest,
        RequestStatus.ONGOING,
        RequestStatus.COMPLETED,
      );

      expect(notificationService.sendMultiChannelNotification).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({
          type: NotificationType.REQUEST_STATUS_CHANGED,
          message: expect.stringContaining('completada exitosamente'),
          link: '/client/requests/request-123',
        }),
      );
    });

    it('should notify client with cancellation message', async () => {
      await hook.execute(
        mockRequest,
        RequestStatus.PENDING,
        RequestStatus.CANCELLED,
      );

      expect(notificationService.sendMultiChannelNotification).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({
          type: NotificationType.REQUEST_STATUS_CHANGED,
          message: expect.stringContaining('cancelada'),
          link: '/client/requests/request-123',
        }),
      );
    });

    it('should include request data in notifications', async () => {
      await hook.execute(
        mockRequest,
        RequestStatus.PENDING,
        RequestStatus.ONGOING,
      );

      expect(notificationService.sendMultiChannelNotification).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({
          data: expect.objectContaining({
            requestId: 'request-123',
            serviceId: 'service-123',
            serviceName: 'Limpieza de Oficina',
            previousStatus: RequestStatus.PENDING,
            newStatus: RequestStatus.ONGOING,
          }),
        }),
      );
    });

    it('should handle notification failures gracefully', async () => {
      notificationService.sendMultiChannelNotification.mockRejectedValueOnce(
        new Error('Notification failed'),
      );

      // Should not throw - notification failures shouldn't block the request update
      await expect(
        hook.execute(mockRequest, RequestStatus.PENDING, RequestStatus.ONGOING),
      ).resolves.not.toThrow();
    });

    it('should handle request without service name', async () => {
      const requestWithoutService = {
        ...mockRequest,
        service: {
          id: 'service-123',
          name: null as any,
          category: null,
        },
      };

      await hook.execute(
        requestWithoutService,
        RequestStatus.PENDING,
        RequestStatus.ONGOING,
      );

      expect(notificationService.sendMultiChannelNotification).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({
          message: expect.stringContaining('el servicio solicitado'),
        }),
      );
    });

    it('should handle request without user name', async () => {
      const requestWithoutUser = {
        ...mockRequest,
        user: {
          id: 'user-123',
          email: 'client@example.com',
          firstname: null as any,
          lastname: null as any,
        },
      };

      await hook.execute(
        requestWithoutUser,
        RequestStatus.PENDING,
        RequestStatus.ONGOING,
      );

      expect(notificationService.sendMultiChannelNotification).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          data: expect.objectContaining({
            clientName: undefined,
          }),
        }),
      );
    });
  });
});
