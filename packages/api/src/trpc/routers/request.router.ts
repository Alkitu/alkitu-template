import { t, protectedProcedure } from '../trpc';
import {
  Prisma,
  type PrismaClient,
  RequestStatus,
  UserRole,
  AccessLevel,
} from '@prisma/client';
import { TRPCError } from '@trpc/server';
import {
  updateRequestSchema,
  createRequestSchema,
  getFilteredRequestsSchema,
  updateRequestStatusSchema,
  assignRequestSchema,
  cancelRequestSchema,
  requestCancellationSchema,
  getRequestStatsSchema,
  getRequestByIdSchema,
  deleteRequestSchema,
} from '../schemas/request.schemas';
import {
  adminProcedure,
  employeeProcedure,
  requireResourceAccess,
} from '../middlewares/roles.middleware';
import { RequestStatusChangedHook } from '../../requests/hooks/request-status-changed.hook';
import { NotificationService } from '../../notification/notification.service';
import { EmailTemplateService } from '../../email-templates/email-template.service';
import { CounterService } from '../../counter/counter.service';
import { DriveFolderService } from '../../drive/drive-folder.service';
import { DriveService } from '../../drive/drive.service';
import { z } from 'zod';

/**
 * Request tRPC Router
 * Handles all request-related queries and mutations
 *
 * Security:
 * - All endpoints require authentication
 * - CLIENT role: can only view/create/cancel their own requests
 * - EMPLOYEE role: can view assigned requests + own requests, update status, assign
 * - ADMIN role: full access to all requests
 */
export function createRequestRouter(
  prisma: PrismaClient,
  notificationService: NotificationService,
  emailTemplateService: EmailTemplateService,
  counterService: CounterService,
  driveFolderService: DriveFolderService,
  driveService: DriveService,
) {
  const requestStatusChangedHook = new RequestStatusChangedHook(
    notificationService,
    emailTemplateService,
  );
  return t.router({
    /**
     * Get filtered requests with role-based access control
     * - CLIENT: only sees their own requests
     * - EMPLOYEE: sees assigned requests + own requests
     * - ADMIN: sees all requests
     */
    getFilteredRequests: protectedProcedure
      .input(getFilteredRequestsSchema)
      .query(async ({ input, ctx }) => {
        const {
          page,
          limit,
          status,
          userId,
          serviceId,
          assignedToId,
          sortBy,
          sortOrder,
        } = input;

        // Build where clause based on role
        const where: Prisma.RequestWhereInput = {};
        if (status) where.status = status;
        if (serviceId) where.serviceId = serviceId;

        // Role-based filtering
        if (ctx.user.role === UserRole.CLIENT) {
          // Clients only see their own requests
          where.userId = ctx.user.id;
        } else if (
          ctx.user.role === UserRole.EMPLOYEE ||
          ctx.user.role === UserRole.LEAD
        ) {
          // Employees see assigned requests + own requests
          const orConditions: Prisma.RequestWhereInput[] = [
            { userId: ctx.user.id },
            { assignedToId: ctx.user.id },
          ];
          // If userId filter is provided, respect it (within their scope)
          if (userId) {
            orConditions.push({ userId });
          }
          if (assignedToId) {
            orConditions.push({ assignedToId });
          }
          where.OR = orConditions;
        } else if (ctx.user.role === UserRole.ADMIN) {
          // Admins see everything, respect all filters
          if (userId) where.userId = userId;
          if (assignedToId) where.assignedToId = assignedToId;
        }

        // Get total count
        const total = await prisma.request.count({ where });

        // Get paginated requests with relations
        const requests = await prisma.request.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            [sortBy || 'createdAt']: sortOrder || 'desc',
          } as Prisma.RequestOrderByWithRelationInput,
          include: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                thumbnail: true,
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
                building: true,
                city: true,
                state: true,
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

        return {
          requests,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      }),

    /**
     * Get request stats
     * - CLIENT: only their own stats
     * - EMPLOYEE: assigned + own stats
     * - ADMIN: global stats
     */
    getRequestStats: protectedProcedure
      .input(getRequestStatsSchema)
      .query(async ({ ctx }) => {
        // Build where clause based on role
        const where: Record<string, unknown> = {};

        if (ctx.user.role === UserRole.CLIENT) {
          where.userId = ctx.user.id;
        } else if (
          ctx.user.role === UserRole.EMPLOYEE ||
          ctx.user.role === UserRole.LEAD
        ) {
          where.OR = [{ userId: ctx.user.id }, { assignedToId: ctx.user.id }];
        }
        // ADMIN: no filter (sees all)

        const [total, pending, ongoing, completed, cancelled] =
          await Promise.all([
            prisma.request.count({ where }),
            prisma.request.count({
              where: { ...where, status: RequestStatus.PENDING },
            }),
            prisma.request.count({
              where: { ...where, status: RequestStatus.ONGOING },
            }),
            prisma.request.count({
              where: { ...where, status: RequestStatus.COMPLETED },
            }),
            prisma.request.count({
              where: { ...where, status: RequestStatus.CANCELLED },
            }),
          ]);

        return {
          total,
          byStatus: {
            PENDING: pending,
            ONGOING: ongoing,
            COMPLETED: completed,
            CANCELLED: cancelled,
          },
        };
      }),

    /**
     * Get single request by ID
     * Security: Uses requireResourceAccess middleware
     */
    getRequestById: protectedProcedure
      .input(getRequestByIdSchema)
      .use(
        requireResourceAccess({
          resourceType: 'REQUEST',
          accessLevel: AccessLevel.READ,
          resourceIdKey: 'id',
        }),
      )
      .query(async ({ input }) => {
        const request = await prisma.request.findUnique({
          where: { id: input.id },
          include: {
            user: true,
            service: {
              include: {
                category: true,
                formTemplates: true,
              },
            },
            location: true,
            assignedTo: true,
          },
        });

        if (!request) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          });
        }

        return request;
      }),

    /**
     * Create a new request
     * Security: Users can only create requests for themselves (unless ADMIN)
     */
    createRequest: protectedProcedure
      .input(createRequestSchema)
      .mutation(async ({ input, ctx }) => {
        // Validate user can create request for this userId
        if (ctx.user.role !== UserRole.ADMIN && ctx.user.id !== input.userId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Cannot create request for another user',
          });
        }

        // Lookup service to get the code for customId generation
        const service = await prisma.service.findUnique({
          where: { id: input.serviceId },
          select: { id: true, code: true },
        });

        if (!service) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Service not found',
          });
        }

        // Generate customId if service has a code configured
        let customId: string | undefined;
        if (service.code) {
          customId = await counterService.generateRequestCustomId(service.code);
        }

        // Extract title from templateResponses or use default
        const responses = input.templateResponses as
          | Record<string, unknown>
          | null
          | undefined;
        const title = (responses?.title as string) || 'Nueva Solicitud';

        const createdRequest = await prisma.request.create({
          data: {
            userId: input.userId,
            serviceId: input.serviceId,
            locationId: input.locationId,
            title,
            customId,
            executionDateTime: new Date(input.executionDateTime),
            templateResponses: (input.templateResponses ?? {}) as Prisma.InputJsonValue,
            ...(input.note != null && {
              note: input.note as Prisma.InputJsonValue,
            }),
            status: RequestStatus.PENDING,
            createdBy: input.userId,
          },
        });

        // Non-blocking: create Drive folder for this request
        driveFolderService
          .ensureRequestFolder(createdRequest.id)
          .catch(() => {});

        // Send request creation emails (non-blocking)
        prisma.request
          .findUnique({
            where: { id: createdRequest.id },
            include: {
              user: true,
              service: { include: { category: true } },
              location: true,
              assignedTo: true,
            },
          })
          .then((fullRequest) => {
            if (fullRequest) {
              emailTemplateService
                .sendRequestCreatedEmails(fullRequest as any)
                .catch(() => {});
            }
          })
          .catch(() => {});

        return createdRequest;
      }),

    /**
     * Update request (full edit)
     * Security: EMPLOYEE+ role required, uses resource access control
     */
    updateRequest: employeeProcedure
      .input(updateRequestSchema)
      .use(
        requireResourceAccess({
          resourceType: 'REQUEST',
          accessLevel: AccessLevel.WRITE,
          resourceIdKey: 'id',
        }),
      )
      .mutation(async ({ input }) => {
        const id = input.id;
        const serviceId = input.serviceId;
        const executionDateTime = input.executionDateTime;
        const locationId = input.locationId;
        const locationData = input.locationData;
        const templateResponses = input.templateResponses as
          | Record<string, unknown>
          | undefined;
        const note = input.note as string | undefined;

        // Verify request exists
        const existingRequest = await prisma.request.findUnique({
          where: { id },
          include: { user: true },
        });

        if (!existingRequest) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          });
        }

        // Handle location (use existing or create new)
        let finalLocationId = locationId;
        if (locationData && !locationId) {
          const location = await prisma.workLocation.create({
            data: {
              userId: existingRequest.userId,
              street: locationData.street,
              city: locationData.city,
              state: locationData.state,
              zip: locationData.zip,
              building: locationData.building,
              tower: locationData.tower,
              floor: locationData.floor,
              unit: locationData.unit,
            },
          });
          finalLocationId = location.id;
        }

        // Update request
        const updateData: Record<string, unknown> = {
          serviceId,
          executionDateTime: new Date(executionDateTime),
          locationId: finalLocationId,
        };
        if (templateResponses !== undefined) {
          updateData.templateResponses = templateResponses;
        }
        if (note !== undefined) {
          updateData.note = note;
        }
        const updatedRequest = await prisma.request.update({
          where: { id },
          data: updateData,
          include: {
            service: { include: { category: true } },
            location: true,
            user: true,
            assignedTo: true,
          },
        });

        return updatedRequest;
      }),

    /**
     * Update request status
     * Security: EMPLOYEE+ role required, uses resource access control
     * Triggers: REQUEST_STATUS_CHANGED notification hook
     */
    updateRequestStatus: employeeProcedure
      .input(updateRequestStatusSchema)
      .use(
        requireResourceAccess({
          resourceType: 'REQUEST',
          accessLevel: AccessLevel.WRITE,
          resourceIdKey: 'id',
        }),
      )
      .mutation(async ({ input }) => {
        // Get old status before updating
        const oldRequest = await prisma.request.findUnique({
          where: { id: input.id },
          select: { status: true },
        });

        if (!oldRequest) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          });
        }

        const updateData: Record<string, unknown> = { status: input.status };

        if (input.status === RequestStatus.COMPLETED) {
          updateData.completedAt = new Date();
        }

        // Update request with full relations for notification hook
        const updatedRequest = await prisma.request.update({
          where: { id: input.id },
          data: updateData,
          include: {
            service: {
              include: {
                category: true,
              },
            },
            user: true,
            assignedTo: true,
            location: true,
          },
        });

        // Trigger notification hook (non-blocking)
        await requestStatusChangedHook
          .execute(updatedRequest, oldRequest.status, input.status)
          .catch(() => {
            // Non-blocking: notification failures shouldn't block the mutation
          });

        return updatedRequest;
      }),

    /**
     * Assign request to employee
     * Security: EMPLOYEE+ role required
     */
    assignRequest: employeeProcedure
      .input(assignRequestSchema)
      .use(
        requireResourceAccess({
          resourceType: 'REQUEST',
          accessLevel: AccessLevel.WRITE,
          resourceIdKey: 'id',
        }),
      )
      .mutation(async ({ input }) => {
        const updatedRequest = await prisma.request.update({
          where: { id: input.id },
          data: {
            assignedToId: input.assignedToId,
            status: RequestStatus.ONGOING,
          },
          include: {
            service: { include: { category: true } },
            user: true,
            assignedTo: true,
            location: true,
          },
        });

        // Send notifications to employee and client
        await requestStatusChangedHook.execute(
          updatedRequest,
          RequestStatus.PENDING,
          RequestStatus.ONGOING,
        );

        return updatedRequest;
      }),

    /**
     * Cancel request
     * Security: Users can cancel their own requests, EMPLOYEE+ can cancel any
     */
    cancelRequest: protectedProcedure
      .input(cancelRequestSchema)
      .mutation(async ({ input, ctx }) => {
        // Check if user owns the request or has EMPLOYEE+ role
        const request = await prisma.request.findUnique({
          where: { id: input.id },
          select: { userId: true, status: true },
        });

        if (!request) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          });
        }

        const canCancel =
          ctx.user.id === request.userId ||
          ctx.user.role === UserRole.EMPLOYEE ||
          ctx.user.role === UserRole.LEAD ||
          ctx.user.role === UserRole.ADMIN;

        if (!canCancel) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Cannot cancel this request',
          });
        }

        const oldStatus = request.status;
        const updatedRequest = await prisma.request.update({
          where: { id: input.id },
          data: {
            status: RequestStatus.CANCELLED,
            cancellationRequested: true,
            cancellationRequestedAt: new Date(),
          },
          include: {
            service: { include: { category: true } },
            user: true,
            assignedTo: true,
            location: true,
          },
        });

        // Send cancellation notifications
        await requestStatusChangedHook.execute(
          updatedRequest,
          oldStatus,
          RequestStatus.CANCELLED,
        );

        return updatedRequest;
      }),

    /**
     * Request cancellation (CLIENT only)
     * Security: User must own the request. Does NOT change status —
     * sets cancellationRequested flag so ADMIN/EMPLOYEE can approve.
     */
    requestCancellation: protectedProcedure
      .input(requestCancellationSchema)
      .mutation(async ({ input, ctx }) => {
        const request = await prisma.request.findUnique({
          where: { id: input.id },
          select: { userId: true, status: true },
        });

        if (!request) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          });
        }

        // Only the request owner can request cancellation
        if (ctx.user.id !== request.userId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only the request owner can request cancellation',
          });
        }

        // Cannot request cancellation for already cancelled/completed requests
        if (
          request.status === RequestStatus.CANCELLED ||
          request.status === RequestStatus.COMPLETED
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot request cancellation for this request',
          });
        }

        const updatedRequest = await prisma.request.update({
          where: { id: input.id },
          data: {
            cancellationRequested: true,
            cancellationRequestedAt: new Date(),
          },
          include: {
            service: { include: { category: true } },
            user: true,
            assignedTo: true,
            location: true,
          },
        });

        return updatedRequest;
      }),

    /**
     * Delete request
     * Security: ADMIN only
     */
    deleteRequest: adminProcedure
      .input(deleteRequestSchema)
      .use(
        requireResourceAccess({
          resourceType: 'REQUEST',
          accessLevel: AccessLevel.ADMIN,
          resourceIdKey: 'id',
        }),
      )
      .mutation(async ({ input }) => {
        return await prisma.request.delete({
          where: { id: input.id },
        });
      }),

    /**
     * Upload files to a request's Drive folder
     * Security: User must own the request or be EMPLOYEE+
     */
    uploadRequestFiles: protectedProcedure
      .input(
        z.object({
          requestId: z.string(),
          files: z.array(
            z.object({
              name: z.string(),
              data: z.string(), // base64
              mimeType: z.string(),
              size: z.number(),
            }),
          ),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        // Verify request exists and user has access
        const request = await prisma.request.findUnique({
          where: { id: input.requestId },
          select: { id: true, userId: true, attachments: true },
        });

        if (!request) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Request not found',
          });
        }

        const canUpload =
          ctx.user.id === request.userId ||
          ctx.user.role === UserRole.EMPLOYEE ||
          ctx.user.role === UserRole.LEAD ||
          ctx.user.role === UserRole.ADMIN;

        if (!canUpload) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Cannot upload files to this request',
          });
        }

        // Ensure request folder exists (lazy creation for existing requests)
        const folderId = await driveFolderService.ensureRequestFolder(
          input.requestId,
        );

        // Upload each file
        const uploadedFiles = [];
        for (const file of input.files) {
          const buffer = Buffer.from(file.data, 'base64');
          const driveFile = await driveService.uploadBuffer(
            buffer,
            file.name,
            file.mimeType,
            { parentId: folderId },
          );
          uploadedFiles.push({
            fileId: driveFile.id,
            name: file.name,
            mimeType: file.mimeType,
            webViewLink: driveFile.webViewLink,
            size: file.size,
          });
        }

        // Merge with existing attachments
        const existingAttachments = Array.isArray(request.attachments)
          ? (request.attachments as Record<string, unknown>[])
          : [];
        const allAttachments = [...existingAttachments, ...uploadedFiles];

        // Update request with attachments
        await prisma.request.update({
          where: { id: input.requestId },
          data: { attachments: allAttachments as Prisma.InputJsonValue },
        });

        return { uploaded: uploadedFiles, total: allAttachments.length };
      }),
  });
}
