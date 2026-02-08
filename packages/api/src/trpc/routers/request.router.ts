import { z } from 'zod';
import { t, protectedProcedure } from '../trpc';
import { PrismaClient, RequestStatus, UserRole, AccessLevel } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import {
  updateRequestSchema,
  createRequestSchema,
  getFilteredRequestsSchema,
  updateRequestStatusSchema,
  assignRequestSchema,
  cancelRequestSchema,
} from '../schemas/request.schemas';
import {
  adminProcedure,
  employeeProcedure,
  requireResourceAccess,
} from '../middlewares/roles.middleware';

const prisma = new PrismaClient();

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
export function createRequestRouter() {
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
        const where: any = {};
        if (status) where.status = status;
        if (serviceId) where.serviceId = serviceId;

        // Role-based filtering
        if (ctx.user.role === UserRole.CLIENT) {
          // Clients only see their own requests
          where.userId = ctx.user.id;
        } else if (ctx.user.role === UserRole.EMPLOYEE || ctx.user.role === UserRole.LEAD) {
          // Employees see assigned requests + own requests
          where.OR = [
            { userId: ctx.user.id },
            { assignedToId: ctx.user.id },
          ];
          // If userId filter is provided, respect it (within their scope)
          if (userId) {
            where.OR.push({ userId });
          }
          if (assignedToId) {
            where.OR.push({ assignedToId });
          }
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
          orderBy: { [sortBy]: sortOrder },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
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
              },
            },
            assignedTo: {
              select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
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
      .input(z.object({}).optional())
      .query(async ({ ctx }) => {
        // Build where clause based on role
        let where: any = {};

        if (ctx.user.role === UserRole.CLIENT) {
          where.userId = ctx.user.id;
        } else if (ctx.user.role === UserRole.EMPLOYEE || ctx.user.role === UserRole.LEAD) {
          where.OR = [
            { userId: ctx.user.id },
            { assignedToId: ctx.user.id },
          ];
        }
        // ADMIN: no filter (sees all)

        const [total, pending, ongoing, completed, cancelled] = await Promise.all([
          prisma.request.count({ where }),
          prisma.request.count({ where: { ...where, status: RequestStatus.PENDING } }),
          prisma.request.count({ where: { ...where, status: RequestStatus.ONGOING } }),
          prisma.request.count({ where: { ...where, status: RequestStatus.COMPLETED } }),
          prisma.request.count({ where: { ...where, status: RequestStatus.CANCELLED } }),
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
      .input(z.object({ id: z.string() }))
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

        return await prisma.request.create({
          data: {
            userId: input.userId,
            serviceId: input.serviceId,
            locationId: input.locationId,
            executionDateTime: new Date(input.executionDateTime),
            templateResponses: input.templateResponses,
            note: input.note,
            status: RequestStatus.PENDING,
            createdBy: input.userId,
          },
        });
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
        const {
          id,
          serviceId,
          executionDateTime,
          locationId,
          locationData,
          templateResponses,
          note,
        } = input;

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
        const updatedRequest = await prisma.request.update({
          where: { id },
          data: {
            serviceId,
            executionDateTime: new Date(executionDateTime),
            locationId: finalLocationId,
            ...(templateResponses !== undefined && { templateResponses }),
            ...(note !== undefined && { note }),
          },
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
        const updateData: any = { status: input.status };

        if (input.status === RequestStatus.COMPLETED) {
          updateData.completedAt = new Date();
        }

        return await prisma.request.update({
          where: { id: input.id },
          data: updateData,
        });
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
        return await prisma.request.update({
          where: { id: input.id },
          data: {
            assignedToId: input.assignedToId,
            status: RequestStatus.ONGOING,
          },
        });
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
          select: { userId: true },
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

        return await prisma.request.update({
          where: { id: input.id },
          data: {
            status: RequestStatus.CANCELLED,
            cancellationRequested: true,
            cancellationRequestedAt: new Date(),
          },
        });
      }),

    /**
     * Delete request
     * Security: ADMIN only
     */
    deleteRequest: adminProcedure
      .input(z.object({ id: z.string() }))
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
  });
}
