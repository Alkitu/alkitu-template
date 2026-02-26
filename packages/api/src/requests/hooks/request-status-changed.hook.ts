/**
 * ALI-120: Request Status Changed Hook
 * Sends multi-channel notifications when request status changes
 *
 * Notification Flow:
 * - Status Change → Notify Client (always)
 * - Status → ONGOING → Notify Assigned Employee (if exists)
 * - Status → COMPLETED → Notify Client with completion message
 * - Status → CANCELLED → Notify Client with cancellation message
 */

import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../../notification/notification.service';
import { EmailTemplateService } from '../../email-templates/email-template.service';
import { NotificationType, RequestStatus } from '@prisma/client';

interface RequestWithRelations {
  id: string;
  userId: string;
  serviceId: string;
  status: RequestStatus;
  assignedToId?: string | null;
  completedAt?: Date | null;
  service?: {
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
    };
  };
  user?: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };
  assignedTo?: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  } | null;
  location?: {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  } | null;
}

@Injectable()
export class RequestStatusChangedHook {
  private readonly logger = new Logger(RequestStatusChangedHook.name);

  constructor(
    private notificationService: NotificationService,
    private emailTemplateService: EmailTemplateService,
  ) {}

  /**
   * Execute hook when request status changes
   * Sends appropriate notifications based on status transition
   *
   * @param request - Request entity with relations
   * @param oldStatus - Previous status before change
   * @param newStatus - New status after change
   */
  async execute(
    request: RequestWithRelations,
    oldStatus: RequestStatus,
    newStatus: RequestStatus,
  ): Promise<void> {
    // Skip if status didn't actually change
    if (oldStatus === newStatus) {
      this.logger.debug(
        `[RequestStatusChangedHook] Status unchanged for request ${request.id}. Skipping notifications.`,
      );
      return;
    }

    this.logger.log(
      `[RequestStatusChangedHook] Processing status change for request ${request.id}: ${oldStatus} → ${newStatus}`,
    );

    try {
      // 1. Always notify the client about status changes
      await this.notifyClient(request, oldStatus, newStatus);

      // 2. Notify assigned employee for specific transitions
      if (newStatus === RequestStatus.ONGOING && request.assignedToId) {
        await this.notifyAssignedEmployee(request);
      }

      this.logger.log(
        `[RequestStatusChangedHook] Successfully sent notifications for request ${request.id}`,
      );

      // 3. Send lifecycle emails (non-blocking)
      try {
        await this.emailTemplateService.sendStatusChangedEmails(
          request as any,
          newStatus,
        );
      } catch (emailError) {
        this.logger.error(
          `[RequestStatusChangedHook] Failed to send email for request ${request.id}`,
          emailError instanceof Error ? emailError.stack : String(emailError),
        );
      }
    } catch (error) {
      this.logger.error(
        `[RequestStatusChangedHook] Failed to send notifications for request ${request.id}`,
        error instanceof Error ? error.stack : String(error),
      );
      // Don't throw - notification failures shouldn't block the request update
    }
  }

  /**
   * Notify client about status change
   * Provides context-aware messaging based on new status
   */
  private async notifyClient(
    request: RequestWithRelations,
    oldStatus: RequestStatus,
    newStatus: RequestStatus,
  ): Promise<void> {
    const serviceName = request.service?.name || 'el servicio solicitado';
    const statusMessages: Record<RequestStatus, string> = {
      PENDING: `Tu solicitud para "${serviceName}" está pendiente de asignación`,
      ONGOING: `Tu solicitud para "${serviceName}" está ahora en progreso`,
      COMPLETED: `Tu solicitud para "${serviceName}" ha sido completada exitosamente`,
      CANCELLED: `Tu solicitud para "${serviceName}" ha sido cancelada`,
    };

    const message =
      statusMessages[newStatus] ||
      `El estado de tu solicitud ha cambiado a ${newStatus}`;

    await this.notificationService.sendMultiChannelNotification(
      request.userId,
      {
        type: NotificationType.REQUEST_STATUS_CHANGED,
        message,
        link: `/client/requests/${request.id}`,
        data: {
          requestId: request.id,
          serviceId: request.serviceId,
          serviceName: request.service?.name,
          previousStatus: oldStatus,
          newStatus: newStatus,
          clientId: request.userId,
          clientName: request.user
            ? `${request.user.firstname} ${request.user.lastname}`
            : undefined,
        },
      },
    );

    this.logger.debug(
      `[RequestStatusChangedHook] Sent client notification to user ${request.userId}`,
    );
  }

  /**
   * Notify assigned employee when request moves to ONGOING status
   */
  private async notifyAssignedEmployee(
    request: RequestWithRelations,
  ): Promise<void> {
    if (!request.assignedToId) {
      return;
    }

    const serviceName = request.service?.name || 'servicio';
    const clientName = request.user
      ? `${request.user.firstname} ${request.user.lastname}`
      : 'un cliente';

    await this.notificationService.sendMultiChannelNotification(
      request.assignedToId,
      {
        type: NotificationType.REQUEST_STATUS_CHANGED,
        message: `La solicitud para "${serviceName}" de ${clientName} está ahora en progreso`,
        link: `/employee/requests/${request.id}`,
        data: {
          requestId: request.id,
          serviceId: request.serviceId,
          serviceName: request.service?.name,
          previousStatus: RequestStatus.PENDING,
          newStatus: RequestStatus.ONGOING,
          employeeId: request.assignedToId,
          employeeName: request.assignedTo
            ? `${request.assignedTo.firstname} ${request.assignedTo.lastname}`
            : undefined,
        },
      },
    );

    this.logger.debug(
      `[RequestStatusChangedHook] Sent employee notification to user ${request.assignedToId}`,
    );
  }
}
