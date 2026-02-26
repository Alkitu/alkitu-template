import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateRequestDto,
  UpdateRequestDto,
  AssignRequestDto,
  RequestCancellationDto,
  CompleteRequestDto,
} from './dto';
import { Request, RequestStatus, UserRole as PrismaUserRole } from '@prisma/client';
import { UserRole } from '@alkitu/shared/enums/user-role.enum';
import {
  validateStatusTransition,
  validateStatusTransitionRules,
} from './validators/status-transition.validator';
import { NotificationService } from '../notification/notification.service';
import { RequestNotificationBuilder } from './builders/request-notification.builder';
import {
  EmailTemplateService,
  RequestWithRelations,
} from '../email-templates/email-template.service';
import { AccessControlService } from '../access-control/access-control.service';
import { AccessLevel } from '@prisma/client';
import { CounterService } from '../counter/counter.service';
import { DriveFolderService } from '../drive/drive-folder.service';

/**
 * Service for managing service requests lifecycle (ALI-119 + ALI-120 + ALI-121)
 * @class RequestsService
 */
@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly accessControl: AccessControlService,
    private readonly counterService: CounterService,
    private readonly driveFolderService: DriveFolderService,
  ) {}

  /**
   * Get all admin user IDs for notifications (ALI-120)
   * @private
   * @returns {Promise<string[]>} Array of admin user IDs
   */
  private async getAdminUserIds(): Promise<string[]> {
    const admins = await this.prisma.user.findMany({
      where: { role: UserRole.ADMIN },
      select: { id: true },
    });
    return admins.map((admin) => admin.id);
  }

  /**
   * Create a new service request
   * @param {CreateRequestDto} createRequestDto - Request data
   * @param {string} userId - User ID creating the request (CLIENT)
   * @returns {Promise<Request>} Created request
   * @throws {NotFoundException} If service or location not found
   * @throws {BadRequestException} If execution date is in the past or location doesn't belong to user
   * @throws {InternalServerErrorException} On database errors
   */
  async create(
    createRequestDto: CreateRequestDto,
    userId: string,
  ): Promise<Request> {
    try {
      // Validate service exists (excluding soft-deleted)
      const service = await this.prisma.service.findFirst({
        where: { id: createRequestDto.serviceId, deletedAt: null },
        select: { id: true, name: true, categoryId: true, code: true, category: { select: { id: true, name: true } } },
      });

      if (!service) {
        throw new NotFoundException(
          `Service with ID "${createRequestDto.serviceId}" not found`,
        );
      }

      // Validate location exists and belongs to user
      const location = await this.prisma.workLocation.findFirst({
        where: {
          id: createRequestDto.locationId,
          userId: userId,
        },
      });

      if (!location) {
        throw new NotFoundException(
          `Location with ID "${createRequestDto.locationId}" not found or does not belong to you`,
        );
      }

      // Validate execution date is in the future
      const executionDate = new Date(createRequestDto.executionDateTime);
      if (executionDate <= new Date()) {
        throw new BadRequestException('Execution date must be in the future');
      }

      // TODO: Validate templateResponses against service.requestTemplate schema
      // This validation should check if all required fields are filled
      // and if the data matches the expected types

      // Generate customId if service has a code configured
      let customId: string | undefined;
      if (service.code) {
        customId = await this.counterService.generateRequestCustomId(
          service.code,
        );
      }

      // Create the request with audit logging
      const createdRequest = await this.prisma.request.create({
        data: {
          userId,
          serviceId: createRequestDto.serviceId,
          locationId: createRequestDto.locationId,
          executionDateTime: executionDate,
          templateResponses: createRequestDto.templateResponses as any,
          note: createRequestDto.note as any,
          customId,
          status: RequestStatus.PENDING,
          deletedAt: null, // Explicitly set to null for soft delete queries
          createdBy: userId,
          updatedBy: userId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              company: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              categoryId: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          location: {
            select: {
              id: true,
              street: true,
              city: true,
              state: true,
              zip: true,
              building: true,
              tower: true,
              floor: true,
              unit: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },
        },
      });

      // Non-blocking: create Drive folder for this request
      this.driveFolderService
        .ensureRequestFolder(createdRequest.id)
        .catch((error) => {
          this.logger.warn(
            `Failed to create Drive folder for request ${createdRequest.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        });

      // ALI-120: Send multi-channel notifications
      try {
        // Notify client (confirmation)
        const clientNotif = RequestNotificationBuilder.buildCreatedNotification(
          createdRequest,
          'client',
        );
        await this.notificationService.sendMultiChannelNotification(userId, {
          type: clientNotif.type,
          message: clientNotif.message,
          data: clientNotif.data,
          link: clientNotif.link,
        });
        this.logger.log(
          `Sent multi-channel REQUEST_CREATED notification to client ${userId} for request ${createdRequest.id}`,
        );

        // Notify all admins (new request alert)
        const adminIds = await this.getAdminUserIds();
        const adminNotif = RequestNotificationBuilder.buildCreatedNotification(
          createdRequest,
          'admin',
        );
        await Promise.all(
          adminIds.map((adminId) =>
            this.notificationService.sendMultiChannelNotification(adminId, {
              type: adminNotif.type,
              message: adminNotif.message,
              data: adminNotif.data,
              link: adminNotif.link,
            }),
          ),
        );
        this.logger.log(
          `Sent multi-channel REQUEST_CREATED notifications to ${adminIds.length} admins for request ${createdRequest.id}`,
        );
      } catch (error) {
        // Log detailed error for debugging but DON'T throw
        // Request was successfully created - notification failure shouldn't prevent that
        this.logger.error(
          `⚠️  Failed to send request creation notifications (request ${createdRequest.id} created successfully)`,
          {
            error: (error as Error).message,
            stack: (error as Error).stack,
            requestId: createdRequest.id,
            userId,
            serviceName: createdRequest.service?.name,
            timestamp: new Date().toISOString(),
          },
        );
        // Don't throw - request creation succeeded, notification is best-effort
      }

      // ALI-121: Send email templates for request creation
      try {
        // Map location.zip to location.zipCode for email templates
        const requestWithMappedLocation = {
          ...createdRequest,
          location: {
            ...createdRequest.location,
            zipCode: createdRequest.location.zip || '',
          },
        } as any;

        await this.emailTemplateService.sendRequestCreatedEmails(
          requestWithMappedLocation,
        );
        this.logger.log(
          `Sent email templates for request creation ${createdRequest.id}`,
        );
      } catch (error) {
        this.logger.error(
          `⚠️  Failed to send email templates for request ${createdRequest.id}`,
          {
            error: (error as Error).message,
            stack: (error as Error).stack,
            requestId: createdRequest.id,
          },
        );
        // Don't throw - request creation succeeded, email is best-effort
      }

      return createdRequest;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create request',
        (error as Error).message,
      );
    }
  }

  /**
   * Find all requests (with filters and role-based access control)
   * @param {string} userId - User ID making the request
   * @param {UserRole} userRole - User role (CLIENT, EMPLOYEE, ADMIN)
   * @param {object} filters - Optional filters (status, serviceId, assignedToId, dates)
   * @returns {Promise<Request[]>} List of requests
   * @throws {InternalServerErrorException} On database errors
   */
  async findAll(
    userId: string,
    userRole: UserRole,
    filters?: {
      status?: RequestStatus;
      serviceId?: string;
      assignedToId?: string;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<Request[]> {
    try {
      const where: any = { deletedAt: null };

      // Role-based filtering
      if (userRole === UserRole.CLIENT) {
        // Clients can only see their own requests
        where.userId = userId;
      } else if (userRole === UserRole.EMPLOYEE) {
        // Employees can see requests assigned to them or unassigned requests
        where.OR = [{ assignedToId: userId }, { assignedToId: null }];
      }
      // ADMINs can see all requests (no additional filter)

      // Apply optional filters
      if (filters?.status) {
        where.status = filters.status;
      }
      if (filters?.serviceId) {
        where.serviceId = filters.serviceId;
      }
      if (filters?.assignedToId) {
        where.assignedToId = filters.assignedToId;
      }
      if (filters?.startDate || filters?.endDate) {
        where.executionDateTime = {};
        if (filters.startDate) {
          where.executionDateTime.gte = filters.startDate;
        }
        if (filters.endDate) {
          where.executionDateTime.lte = filters.endDate;
        }
      }

      return await this.prisma.request.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              company: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              categoryId: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          location: {
            select: {
              id: true,
              street: true,
              city: true,
              state: true,
              zip: true,
              building: true,
              tower: true,
              floor: true,
              unit: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch requests',
        (error as Error).message,
      );
    }
  }

  /**
   * Find one request by ID (with role-based access control)
   * @param {string} id - Request ID
   * @param {string} userId - User ID making the request
   * @param {UserRole} userRole - User role (CLIENT, EMPLOYEE, ADMIN)
   * @returns {Promise<Request>} Request details
   * @throws {NotFoundException} If request not found or access denied
   * @throws {InternalServerErrorException} On database errors
   */
  async findOne(
    id: string,
    userId: string,
    userRole: UserRole,
  ): Promise<Request> {
    try {
      const request = await this.prisma.request.findFirst({
        where: { id, deletedAt: null },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              company: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              categoryId: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          location: {
            select: {
              id: true,
              street: true,
              city: true,
              state: true,
              zip: true,
              building: true,
              tower: true,
              floor: true,
              unit: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },
        },
      });

      if (!request) {
        throw new NotFoundException(`Request with ID "${id}" not found`);
      }

      // Centralized access control check (uses AccessControlService)
      await this.accessControl.checkAccess({
        userId,
        userRole: userRole as UserRole,
        resourceType: 'REQUEST',
        resourceId: id,
        requiredLevel: AccessLevel.READ,
      });

      // Legacy role-based access control (kept for defense in depth)
      if (userRole === UserRole.CLIENT && request.userId !== userId) {
        throw new NotFoundException(`Request with ID "${id}" not found`);
      }
      if (
        userRole === UserRole.EMPLOYEE &&
        request.assignedToId !== userId &&
        request.assignedToId !== null
      ) {
        throw new NotFoundException(`Request with ID "${id}" not found`);
      }
      // ADMINs can access all requests

      return request;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch request',
        (error as Error).message,
      );
    }
  }

  /**
   * Update a request
   * @param {string} id - Request ID
   * @param {UpdateRequestDto} updateRequestDto - Update data
   * @param {string} userId - User ID making the update
   * @param {UserRole} userRole - User role (CLIENT, EMPLOYEE, ADMIN)
   * @returns {Promise<Request>} Updated request
   * @throws {NotFoundException} If request not found or access denied
   * @throws {BadRequestException} If update violates business rules
   * @throws {ForbiddenException} If user doesn't have permission to update
   * @throws {InternalServerErrorException} On database errors
   */
  async update(
    id: string,
    updateRequestDto: UpdateRequestDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Request> {
    try {
      // First, find and validate access to the request
      const existingRequest = await this.prisma.request.findFirst({
        where: { id, deletedAt: null },
      });

      if (!existingRequest) {
        throw new NotFoundException(`Request with ID "${id}" not found`);
      }

      // Centralized access control check (uses AccessControlService)
      await this.accessControl.checkAccess({
        userId,
        userRole: userRole as UserRole,
        resourceType: 'REQUEST',
        resourceId: id,
        requiredLevel: AccessLevel.WRITE,
      });

      // Legacy role-based access control for updates (kept for defense in depth)
      const isOwner = existingRequest.userId === userId;
      const isAssignee = existingRequest.assignedToId === userId;
      const isAdmin = userRole === UserRole.ADMIN;

      // Clients can only update their own PENDING requests
      if (userRole === UserRole.CLIENT) {
        if (!isOwner) {
          throw new ForbiddenException('You can only update your own requests');
        }
        if (existingRequest.status !== RequestStatus.PENDING) {
          throw new ForbiddenException(
            'You can only update requests in PENDING status',
          );
        }
        // Clients cannot change status or assignedToId
        if (
          updateRequestDto.status ||
          updateRequestDto.assignedToId !== undefined
        ) {
          throw new ForbiddenException(
            'You cannot change status or assignment as a client',
          );
        }
      }

      // Employees can update assigned requests or unassigned ones
      if (userRole === UserRole.EMPLOYEE && !isAdmin) {
        if (!isAssignee && existingRequest.assignedToId !== null) {
          throw new ForbiddenException(
            'You can only update requests assigned to you',
          );
        }
      }

      // Validate location belongs to user (if changing location)
      if (updateRequestDto.locationId) {
        const location = await this.prisma.workLocation.findFirst({
          where: {
            id: updateRequestDto.locationId,
            userId: existingRequest.userId,
          },
        });

        if (!location) {
          throw new NotFoundException(
            `Location with ID "${updateRequestDto.locationId}" not found or does not belong to request owner`,
          );
        }
      }

      // Validate execution date is in the future (if changing)
      if (updateRequestDto.executionDateTime) {
        const executionDate = new Date(updateRequestDto.executionDateTime);
        if (executionDate <= new Date()) {
          throw new BadRequestException('Execution date must be in the future');
        }
      }

      // Validate status transition (if changing status)
      if (updateRequestDto.status) {
        const newAssignedToId =
          updateRequestDto.assignedToId !== undefined
            ? updateRequestDto.assignedToId
            : existingRequest.assignedToId;

        validateStatusTransitionRules(
          existingRequest.status,
          updateRequestDto.status,
          newAssignedToId,
        );
      }

      // Build update data
      const updateData: any = {
        ...updateRequestDto,
        updatedBy: userId,
      };

      // Handle status-specific updates
      if (updateRequestDto.status === RequestStatus.COMPLETED) {
        updateData.completedAt = new Date();
      }

      // Update the request
      return await this.prisma.request.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              company: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              categoryId: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          location: {
            select: {
              id: true,
              street: true,
              city: true,
              state: true,
              zip: true,
              building: true,
              tower: true,
              floor: true,
              unit: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update request',
        (error as Error).message,
      );
    }
  }

  /**
   * Soft delete a request (ADMIN only, or CLIENT for PENDING requests)
   * @param {string} id - Request ID
   * @param {string} userId - User ID making the deletion
   * @param {UserRole} userRole - User role
   * @returns {Promise<Request>} Deleted request
   * @throws {NotFoundException} If request not found
   * @throws {ForbiddenException} If user doesn't have permission
   * @throws {InternalServerErrorException} On database errors
   */
  async remove(
    id: string,
    userId: string,
    userRole: UserRole,
  ): Promise<Request> {
    try {
      const request = await this.prisma.request.findFirst({
        where: { id, deletedAt: null },
      });

      if (!request) {
        throw new NotFoundException(`Request with ID "${id}" not found`);
      }

      // Centralized access control check (uses AccessControlService)
      // Note: We use WRITE level here (not ADMIN) because clients can delete their own PENDING requests
      await this.accessControl.checkAccess({
        userId,
        userRole: userRole as UserRole,
        resourceType: 'REQUEST',
        resourceId: id,
        requiredLevel: AccessLevel.WRITE,
      });

      // Legacy role-based access control for deletion (kept for defense in depth)
      const isOwner = request.userId === userId;
      const isAdmin = userRole === UserRole.ADMIN;

      if (!isAdmin) {
        if (!isOwner) {
          throw new ForbiddenException('You can only delete your own requests');
        }
        if (request.status !== RequestStatus.PENDING) {
          throw new ForbiddenException(
            'You can only delete requests in PENDING status',
          );
        }
      }

      // Soft delete
      return await this.prisma.request.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete request',
        (error as Error).message,
      );
    }
  }

  /**
   * Assign a request to an employee
   * @param {string} id - Request ID
   * @param {AssignRequestDto} assignRequestDto - Assignment data
   * @param {string} userId - User ID making the assignment (EMPLOYEE or ADMIN)
   * @param {UserRole} userRole - User role
   * @returns {Promise<Request>} Updated request
   * @throws {NotFoundException} If request or employee not found
   * @throws {BadRequestException} If request is not in PENDING status or employee is not EMPLOYEE/ADMIN role
   * @throws {ForbiddenException} If user doesn't have permission
   * @throws {InternalServerErrorException} On database errors
   */
  async assign(
    id: string,
    assignRequestDto: AssignRequestDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Request> {
    try {
      // Only EMPLOYEE or ADMIN can assign
      if (userRole === UserRole.CLIENT) {
        throw new ForbiddenException(
          'Only employees and admins can assign requests',
        );
      }

      const request = await this.prisma.request.findFirst({
        where: { id, deletedAt: null },
      });

      if (!request) {
        throw new NotFoundException(`Request with ID "${id}" not found`);
      }

      // Can only assign PENDING requests
      if (request.status !== RequestStatus.PENDING) {
        throw new BadRequestException(
          'Can only assign requests in PENDING status',
        );
      }

      // Validate assignee exists and has EMPLOYEE or ADMIN role
      const assignee = await this.prisma.user.findUnique({
        where: { id: assignRequestDto.assignedToId },
        select: { id: true, role: true },
      });

      if (!assignee) {
        throw new NotFoundException(
          `User with ID "${assignRequestDto.assignedToId}" not found`,
        );
      }

      if (
        assignee.role !== UserRole.EMPLOYEE &&
        assignee.role !== UserRole.ADMIN
      ) {
        throw new BadRequestException(
          'Can only assign to users with EMPLOYEE or ADMIN role',
        );
      }

      // Update request with assignment and change status to ONGOING
      const updatedRequest = await this.prisma.request.update({
        where: { id },
        data: {
          assignedToId: assignRequestDto.assignedToId,
          status: RequestStatus.ONGOING,
          updatedBy: userId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              company: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              categoryId: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          location: {
            select: {
              id: true,
              street: true,
              city: true,
              state: true,
              zip: true,
              building: true,
              tower: true,
              floor: true,
              unit: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },
        },
      });

      // ALI-120: Send multi-channel notifications
      try {
        // Notify assigned employee
        const employeeNotif =
          RequestNotificationBuilder.buildAssignedNotification(
            updatedRequest,
            'employee',
          );
        await this.notificationService.sendMultiChannelNotification(
          assignRequestDto.assignedToId,
          {
            type: employeeNotif.type,
            message: employeeNotif.message,
            data: employeeNotif.data,
            link: employeeNotif.link,
          },
        );
        this.logger.log(
          `Sent multi-channel REQUEST_ASSIGNED notification to employee ${assignRequestDto.assignedToId} for request ${id}`,
        );

        // Notify request creator
        const clientNotif =
          RequestNotificationBuilder.buildAssignedNotification(
            updatedRequest,
            'client',
          );
        await this.notificationService.sendMultiChannelNotification(
          updatedRequest.userId,
          {
            type: clientNotif.type,
            message: clientNotif.message,
            data: clientNotif.data,
            link: clientNotif.link,
          },
        );
        this.logger.log(
          `Sent multi-channel REQUEST_ASSIGNED notification to client ${updatedRequest.userId} for request ${id}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send assignment notifications: ${(error as Error).message}`,
        );
        // Don't fail the assignment if notifications fail
      }

      // ALI-121: Send email templates for status change to ONGOING
      try {
        const requestWithMappedLocation = {
          ...updatedRequest,
          location: {
            ...updatedRequest.location,
            zipCode: updatedRequest.location.zip || '',
          },
        } as any;

        await this.emailTemplateService.sendStatusChangedEmails(
          requestWithMappedLocation,
          RequestStatus.ONGOING,
        );
        this.logger.log(
          `Sent email templates for status change to ONGOING for request ${id}`,
        );
      } catch (error) {
        this.logger.error(
          `⚠️  Failed to send email templates for request ${id} status change to ONGOING`,
          {
            error: (error as Error).message,
            stack: (error as Error).stack,
            requestId: id,
          },
        );
        // Don't throw - assignment succeeded, email is best-effort
      }

      return updatedRequest;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to assign request',
        (error as Error).message,
      );
    }
  }

  /**
   * Request cancellation of a request
   * @param {string} id - Request ID
   * @param {RequestCancellationDto} cancellationDto - Cancellation data
   * @param {string} userId - User ID requesting cancellation
   * @param {UserRole} userRole - User role
   * @returns {Promise<Request>} Updated request
   * @throws {NotFoundException} If request not found
   * @throws {BadRequestException} If request is already in terminal status
   * @throws {ForbiddenException} If user doesn't have permission
   * @throws {InternalServerErrorException} On database errors
   */
  async requestCancellation(
    id: string,
    cancellationDto: RequestCancellationDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Request> {
    try {
      const request = await this.prisma.request.findFirst({
        where: { id, deletedAt: null },
      });

      if (!request) {
        throw new NotFoundException(`Request with ID "${id}" not found`);
      }

      // Access control
      const isOwner = request.userId === userId;
      const isAdmin = userRole === UserRole.ADMIN;

      if (!isOwner && !isAdmin) {
        throw new ForbiddenException(
          'You can only request cancellation of your own requests',
        );
      }

      // Cannot cancel completed or already cancelled requests
      if (
        request.status === RequestStatus.COMPLETED ||
        request.status === RequestStatus.CANCELLED
      ) {
        throw new BadRequestException(
          `Cannot cancel request with status ${request.status}`,
        );
      }

      // Update cancellationRequested flag
      const updatedRequest = await this.prisma.request.update({
        where: { id },
        data: {
          cancellationRequested: true,
          cancellationRequestedAt: new Date(),
          updatedBy: userId,
          // Auto-approve cancellation for PENDING requests or if user is ADMIN
          ...(request.status === RequestStatus.PENDING || isAdmin
            ? { status: RequestStatus.CANCELLED }
            : {}),
        },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              company: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              categoryId: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          location: {
            select: {
              id: true,
              street: true,
              city: true,
              state: true,
              zip: true,
              building: true,
              tower: true,
              floor: true,
              unit: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },
        },
      });

      // ALI-120: Send multi-channel notifications based on status
      try {
        if (updatedRequest.status === RequestStatus.CANCELLED) {
          // Auto-approved (PENDING requests or ADMIN) - notify client
          const cancelledNotif =
            RequestNotificationBuilder.buildCancelledNotification(
              updatedRequest,
            );
          await this.notificationService.sendMultiChannelNotification(
            updatedRequest.userId,
            {
              type: cancelledNotif.type,
              message: cancelledNotif.message,
              data: cancelledNotif.data,
              link: cancelledNotif.link,
            },
          );
          this.logger.log(
            `Sent multi-channel REQUEST_CANCELLED notification to client ${updatedRequest.userId} for request ${id}`,
          );
        } else if (request.status === RequestStatus.ONGOING) {
          // Needs approval - notify admins and assigned employee
          const adminIds = await this.getAdminUserIds();
          const adminNotif =
            RequestNotificationBuilder.buildCancellationRequestedNotification(
              updatedRequest,
              cancellationDto.reason,
              'admin',
            );
          await Promise.all(
            adminIds.map((adminId) =>
              this.notificationService.sendMultiChannelNotification(adminId, {
                type: adminNotif.type,
                message: adminNotif.message,
                data: adminNotif.data,
                link: adminNotif.link,
              }),
            ),
          );
          this.logger.log(
            `Sent multi-channel REQUEST_CANCELLATION_REQUESTED notifications to ${adminIds.length} admins for request ${id}`,
          );

          if (updatedRequest.assignedToId) {
            const employeeNotif =
              RequestNotificationBuilder.buildCancellationRequestedNotification(
                updatedRequest,
                cancellationDto.reason,
                'employee',
              );
            await this.notificationService.sendMultiChannelNotification(
              updatedRequest.assignedToId,
              {
                type: employeeNotif.type,
                message: employeeNotif.message,
                data: employeeNotif.data,
                link: employeeNotif.link,
              },
            );
            this.logger.log(
              `Sent multi-channel REQUEST_CANCELLATION_REQUESTED notification to employee ${updatedRequest.assignedToId} for request ${id}`,
            );
          }
        }
      } catch (error) {
        this.logger.error(
          `Failed to send cancellation notifications: ${(error as Error).message}`,
        );
        // Don't fail the cancellation request if notifications fail
      }

      // ALI-121: Send email templates if status changed to CANCELLED
      if (updatedRequest.status === RequestStatus.CANCELLED) {
        try {
          const requestWithMappedLocation = {
            ...updatedRequest,
            location: {
              ...updatedRequest.location,
              zipCode: updatedRequest.location.zip || '',
            },
          } as any;

          await this.emailTemplateService.sendStatusChangedEmails(
            requestWithMappedLocation,
            RequestStatus.CANCELLED,
          );
          this.logger.log(
            `Sent email templates for status change to CANCELLED for request ${id}`,
          );
        } catch (error) {
          this.logger.error(
            `⚠️  Failed to send email templates for request ${id} status change to CANCELLED`,
            {
              error: (error as Error).message,
              stack: (error as Error).stack,
              requestId: id,
            },
          );
          // Don't throw - cancellation succeeded, email is best-effort
        }
      }

      return updatedRequest;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to request cancellation',
        (error as Error).message,
      );
    }
  }

  /**
   * Complete a request
   * @param {string} id - Request ID
   * @param {CompleteRequestDto} completeDto - Completion data
   * @param {string} userId - User ID completing the request
   * @param {UserRole} userRole - User role
   * @returns {Promise<Request>} Updated request
   * @throws {NotFoundException} If request not found
   * @throws {BadRequestException} If request is not in ONGOING status
   * @throws {ForbiddenException} If user doesn't have permission
   * @throws {InternalServerErrorException} On database errors
   */
  async complete(
    id: string,
    completeDto: CompleteRequestDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Request> {
    try {
      // Only EMPLOYEE or ADMIN can complete
      if (userRole === UserRole.CLIENT) {
        throw new ForbiddenException(
          'Only employees and admins can complete requests',
        );
      }

      const request = await this.prisma.request.findFirst({
        where: { id, deletedAt: null },
      });

      if (!request) {
        throw new NotFoundException(`Request with ID "${id}" not found`);
      }

      // Can only complete ONGOING requests
      if (request.status !== RequestStatus.ONGOING) {
        throw new BadRequestException(
          'Can only complete requests in ONGOING status',
        );
      }

      // Employee can only complete their own assigned requests
      if (userRole === UserRole.EMPLOYEE && request.assignedToId !== userId) {
        throw new ForbiddenException(
          'You can only complete requests assigned to you',
        );
      }

      // Update status to COMPLETED
      const completedRequest = await this.prisma.request.update({
        where: { id },
        data: {
          status: RequestStatus.COMPLETED,
          completedAt: new Date(),
          updatedBy: userId,
          // Optionally store completion notes in the note field
          ...(completeDto.notes
            ? {
                note: {
                  ...((request.note as Record<string, unknown>) || {}),
                  completionNotes: completeDto.notes,
                },
              }
            : {}),
        },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              company: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              categoryId: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          location: {
            select: {
              id: true,
              street: true,
              city: true,
              state: true,
              zip: true,
              building: true,
              tower: true,
              floor: true,
              unit: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },
        },
      });

      // ALI-120: Send multi-channel notification to client
      try {
        const completedNotif =
          RequestNotificationBuilder.buildCompletedNotification(
            completedRequest,
            completeDto.notes,
          );
        await this.notificationService.sendMultiChannelNotification(
          completedRequest.userId,
          {
            type: completedNotif.type,
            message: completedNotif.message,
            data: completedNotif.data,
            link: completedNotif.link,
          },
        );
        this.logger.log(
          `Sent multi-channel REQUEST_COMPLETED notification to client ${completedRequest.userId} for request ${id}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send completion notification: ${(error as Error).message}`,
        );
        // Don't fail the completion if notification fails
      }

      // ALI-121: Send email templates for status change to COMPLETED
      try {
        const requestWithMappedLocation = {
          ...completedRequest,
          location: {
            ...completedRequest.location,
            zipCode: completedRequest.location.zip || '',
          },
        } as any;

        await this.emailTemplateService.sendStatusChangedEmails(
          requestWithMappedLocation,
          RequestStatus.COMPLETED,
        );
        this.logger.log(
          `Sent email templates for status change to COMPLETED for request ${id}`,
        );
      } catch (error) {
        this.logger.error(
          `⚠️  Failed to send email templates for request ${id} status change to COMPLETED`,
          {
            error: (error as Error).message,
            stack: (error as Error).stack,
            requestId: id,
          },
        );
        // Don't throw - completion succeeded, email is best-effort
      }

      return completedRequest;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to complete request',
        (error as Error).message,
      );
    }
  }

  /**
   * Count requests (with optional filters and role-based access)
   * @param {string} userId - User ID making the request
   * @param {UserRole} userRole - User role
   * @param {object} filters - Optional filters
   * @returns {Promise<number>} Count of requests
   * @throws {InternalServerErrorException} On database errors
   */
  async count(
    userId: string,
    userRole: UserRole,
    filters?: {
      status?: RequestStatus;
      serviceId?: string;
      assignedToId?: string;
    },
  ): Promise<number> {
    try {
      const where: any = { deletedAt: null };

      // Role-based filtering
      if (userRole === UserRole.CLIENT) {
        where.userId = userId;
      } else if (userRole === UserRole.EMPLOYEE) {
        where.OR = [{ assignedToId: userId }, { assignedToId: null }];
      }

      // Apply optional filters
      if (filters?.status) {
        where.status = filters.status;
      }
      if (filters?.serviceId) {
        where.serviceId = filters.serviceId;
      }
      if (filters?.assignedToId) {
        where.assignedToId = filters.assignedToId;
      }

      return await this.prisma.request.count({ where });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to count requests',
        (error as Error).message,
      );
    }
  }
}
