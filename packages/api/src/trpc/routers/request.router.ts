import { z } from 'zod';
import { t } from '../trpc';
import { PrismaClient, RequestStatus } from '@prisma/client';
import {
  updateRequestSchema,
  createRequestSchema,
  getFilteredRequestsSchema,
  updateRequestStatusSchema,
  assignRequestSchema,
  cancelRequestSchema,
} from '../schemas/request.schemas';

const prisma = new PrismaClient();

/**
 * Request tRPC Router
 * Handles all request-related queries and mutations
 */
export function createRequestRouter() {
  return t.router({
    // Get all requests with optional filters
    getFilteredRequests: t.procedure
      .input(getFilteredRequestsSchema)
      .query(async ({ input }) => {
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

        // Build where clause
        const where: any = {};
        if (status) where.status = status;
        if (userId) where.userId = userId;
        if (serviceId) where.serviceId = serviceId;
        if (assignedToId) where.assignedToId = assignedToId;

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

    // Get request stats (counts by status)
    getRequestStats: t.procedure.input(z.object({})).query(async () => {
      const [total, pending, ongoing, completed, cancelled] = await Promise.all([
        prisma.request.count(),
        prisma.request.count({ where: { status: RequestStatus.PENDING } }),
        prisma.request.count({ where: { status: RequestStatus.ONGOING } }),
        prisma.request.count({ where: { status: RequestStatus.COMPLETED } }),
        prisma.request.count({ where: { status: RequestStatus.CANCELLED } }),
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

    // Get single request by ID
    getRequestById: t.procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await prisma.request.findUnique({
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
      }),

    // Create a new request
    createRequest: t.procedure
      .input(createRequestSchema)
      .mutation(async ({ input }) => {
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

    // Update request (full edit)
    updateRequest: t.procedure
      .input(updateRequestSchema)
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
          throw new Error('Request not found');
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

    // Update request status
    updateRequestStatus: t.procedure
      .input(updateRequestStatusSchema)
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

    // Assign request to employee
    assignRequest: t.procedure
      .input(assignRequestSchema)
      .mutation(async ({ input }) => {
        return await prisma.request.update({
          where: { id: input.id },
          data: {
            assignedToId: input.assignedToId,
            status: RequestStatus.ONGOING,
          },
        });
      }),

    // Cancel request
    cancelRequest: t.procedure
      .input(cancelRequestSchema)
      .mutation(async ({ input }) => {
        return await prisma.request.update({
          where: { id: input.id },
          data: {
            status: RequestStatus.CANCELLED,
            cancellationRequested: true,
            cancellationRequestedAt: new Date(),
          },
        });
      }),

    // Delete request
    deleteRequest: t.procedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await prisma.request.delete({
          where: { id: input.id },
        });
      }),
  });
}
