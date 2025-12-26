/**
 * ALI-120: Request Notification Builder
 * Type-safe builder for creating request lifecycle notifications
 */

import { NotificationType } from '@prisma/client';
import { CreateNotificationDto } from '../../notification/dto/create-notification.dto';
import { Request, User, Service } from '@prisma/client';

/**
 * Request with related entities for building notifications
 * Matches the Prisma select fields from RequestsService
 */
type RequestWithRelations = Request & {
  user?: Pick<User, 'id' | 'firstname' | 'lastname' | 'email' | 'company'>;
  service?: Pick<Service, 'id' | 'name' | 'categoryId'> & {
    category?: { id: string; name: string };
  };
  assignedTo?: Pick<User, 'id' | 'firstname' | 'lastname' | 'email'>;
};

/**
 * Builder class for creating type-safe request notifications
 * Centralizes notification creation logic and ensures consistency
 */
export class RequestNotificationBuilder {
  /**
   * Build notification for request creation
   * Sent to: Request creator (confirmation) + All admins (new request alert)
   *
   * @param request - Request with user and service relations
   * @param recipient - 'client' for request creator, 'admin' for administrators
   * @returns CreateNotificationDto ready to send
   */
  static buildCreatedNotification(
    request: RequestWithRelations,
    recipient: 'client' | 'admin',
  ): CreateNotificationDto {
    const data = {
      requestId: request.id,
      serviceId: request.serviceId,
      serviceName: request.service?.name,
      clientId: request.userId,
      clientName: request.user
        ? `${request.user.firstname} ${request.user.lastname}`
        : undefined,
    };

    if (recipient === 'client') {
      return {
        userId: request.userId,
        message: `Your service request for "${request.service?.name || 'service'}" has been created successfully`,
        type: NotificationType.REQUEST_CREATED,
        link: `/requests/${request.id}`,
        data,
      };
    } else {
      // Admin notification
      return {
        userId: '', // Will be set for each admin
        message: `New service request from ${data.clientName || 'a client'} for "${request.service?.name || 'service'}"`,
        type: NotificationType.REQUEST_CREATED,
        link: `/requests/${request.id}`,
        data,
      };
    }
  }

  /**
   * Build notification for request assignment
   * Sent to: Assigned employee (task assigned) + Request creator (update on their request)
   *
   * @param request - Request with user, service, and assignedTo relations
   * @param recipient - 'employee' for assigned worker, 'client' for request creator
   * @returns CreateNotificationDto ready to send
   */
  static buildAssignedNotification(
    request: RequestWithRelations,
    recipient: 'employee' | 'client',
  ): CreateNotificationDto {
    const data = {
      requestId: request.id,
      serviceId: request.serviceId,
      serviceName: request.service?.name,
      clientId: request.userId,
      clientName: request.user
        ? `${request.user.firstname} ${request.user.lastname}`
        : undefined,
      employeeId: request.assignedToId!,
      employeeName: request.assignedTo
        ? `${request.assignedTo.firstname} ${request.assignedTo.lastname}`
        : undefined,
      previousStatus: 'PENDING' as const,
      newStatus: request.status,
    };

    if (recipient === 'employee') {
      return {
        userId: request.assignedToId!,
        message: `You have been assigned to a service request for "${request.service?.name || 'service'}"`,
        type: NotificationType.REQUEST_ASSIGNED,
        link: `/requests/${request.id}`,
        data,
      };
    } else {
      // Client notification
      return {
        userId: request.userId,
        message: `Your service request has been assigned to ${data.employeeName || 'an employee'}`,
        type: NotificationType.REQUEST_ASSIGNED,
        link: `/requests/${request.id}`,
        data,
      };
    }
  }

  /**
   * Build notification for cancellation request
   * Sent to: Admins (approval needed) + Assigned employee (if exists)
   *
   * @param request - Request with user, service, and assignedTo relations
   * @param reason - Cancellation reason provided by requester
   * @param recipient - 'admin' for administrators, 'employee' for assigned worker
   * @returns CreateNotificationDto ready to send
   */
  static buildCancellationRequestedNotification(
    request: RequestWithRelations,
    reason: string,
    recipient: 'admin' | 'employee',
  ): CreateNotificationDto {
    const data = {
      requestId: request.id,
      serviceId: request.serviceId,
      serviceName: request.service?.name,
      clientId: request.userId,
      clientName: request.user
        ? `${request.user.firstname} ${request.user.lastname}`
        : undefined,
      employeeId: request.assignedToId || undefined,
      employeeName: request.assignedTo
        ? `${request.assignedTo.firstname} ${request.assignedTo.lastname}`
        : undefined,
      cancellationReason: reason,
    };

    if (recipient === 'admin') {
      return {
        userId: '', // Will be set for each admin
        message: `Cancellation requested for service request #${request.id.slice(-6)} - ${reason}`,
        type: NotificationType.REQUEST_CANCELLATION_REQUESTED,
        link: `/requests/${request.id}`,
        data,
      };
    } else {
      // Employee notification
      return {
        userId: request.assignedToId!,
        message: `Cancellation requested for your assigned service request - ${reason}`,
        type: NotificationType.REQUEST_CANCELLATION_REQUESTED,
        link: `/requests/${request.id}`,
        data,
      };
    }
  }

  /**
   * Build notification for request cancellation (approved)
   * Sent to: Request creator (confirmation of cancellation)
   *
   * @param request - Request with user and service relations
   * @returns CreateNotificationDto ready to send
   */
  static buildCancelledNotification(
    request: RequestWithRelations,
  ): CreateNotificationDto {
    const data = {
      requestId: request.id,
      serviceId: request.serviceId,
      serviceName: request.service?.name,
      previousStatus: request.status === 'PENDING' ? ('PENDING' as const) : ('ONGOING' as const),
      newStatus: 'CANCELLED' as const,
    };

    return {
      userId: request.userId,
      message: `Your service request for "${request.service?.name || 'service'}" has been cancelled`,
      type: NotificationType.REQUEST_CANCELLED,
      link: `/requests/${request.id}`,
      data,
    };
  }

  /**
   * Build notification for request completion
   * Sent to: Request creator (work completed notification)
   *
   * @param request - Request with user and service relations
   * @param completionNotes - Optional notes about the completion
   * @returns CreateNotificationDto ready to send
   */
  static buildCompletedNotification(
    request: RequestWithRelations,
    completionNotes?: string,
  ): CreateNotificationDto {
    const data = {
      requestId: request.id,
      serviceId: request.serviceId,
      serviceName: request.service?.name,
      previousStatus: 'ONGOING' as const,
      newStatus: 'COMPLETED' as const,
      completionNotes,
    };

    return {
      userId: request.userId,
      message: `Your service request for "${request.service?.name || 'service'}" has been completed`,
      type: NotificationType.REQUEST_COMPLETED,
      link: `/requests/${request.id}`,
      data,
    };
  }
}
