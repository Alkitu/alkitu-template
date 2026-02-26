import { t, protectedProcedure } from '../trpc';
import { adminProcedure } from '../middlewares/roles.middleware';
import { Prisma, type PrismaClient, RequestStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { handlePrismaError } from '../utils/prisma-error-mapper';
import { createPaginatedResponse, calculatePagination } from '../schemas/common.schemas';
import {
  getAllServicesSchema,
  getServiceByIdSchema,
  getServicesByCategorySchema,
  createServiceSchema,
  updateServiceSchema,
  deleteServiceSchema,
  getServiceRequestStatsSchema,
} from '../schemas/service.schemas';

/**
 * Service tRPC Router
 * Handles service catalog queries
 *
 * Security:
 * - All endpoints require authentication
 */
export function createServiceRouter(prisma: PrismaClient) {
  return t.router({
    /**
     * Get all active services with pagination
     * Security: Requires authentication
     */
    getAllServices: protectedProcedure
      .input(getAllServicesSchema)
      .query(async ({ input }) => {
        try {
          // Use default values if no input provided
          const page = input?.page || 1;
          const limit = input?.limit || 20;
          const sortBy = input?.sortBy || 'name';
          const sortOrder = input?.sortOrder || 'asc';
          const statusFilter = input?.statusFilter || 'active';

          const { skip, take } = calculatePagination(page, limit);

          const where: Prisma.ServiceWhereInput = {};
          if (statusFilter === 'active') {
            where.deletedAt = null;
          } else if (statusFilter === 'inactive') {
            where.deletedAt = { not: null };
          }
          // 'all' → no deletedAt filter

          // Get services with pagination, including formTemplates for field count
          const [services, total] = await Promise.all([
            prisma.service.findMany({
              where,
              skip,
              take,
              orderBy: {
                [sortBy]: sortOrder,
              } as Prisma.ServiceOrderByWithRelationInput,
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                formTemplates: {
                  select: {
                    id: true,
                    formSettings: true,
                  },
                },
                _count: {
                  select: { requests: true },
                },
              },
            }),
            prisma.service.count({ where }),
          ]);

          // Recursively count actual question fields (not groups)
          function countFields(fields: unknown): number {
            if (!Array.isArray(fields)) return 0;
            return (fields as Record<string, unknown>[]).reduce(
              (count: number, field: Record<string, unknown>) => {
                if (field.type === 'group') {
                  const groupOptions = field.groupOptions as
                    | Record<string, unknown>
                    | undefined;
                  if (groupOptions?.fields) {
                    return count + countFields(groupOptions.fields);
                  }
                }
                return count + 1;
              },
              0,
            );
          }

          // Compute total field count and request count
          const servicesWithFieldCount = services.map((service) => ({
            ...service,
            fieldCount: service.formTemplates.reduce((total, tmpl) => {
              const settings = tmpl.formSettings as Record<
                string,
                unknown
              > | null;
              return total + countFields(settings?.fields);
            }, 0),
            requestCount: service._count.requests,
          }));

          return createPaginatedResponse(servicesWithFieldCount, {
            page,
            limit,
            total,
          });
        } catch (error) {
          handlePrismaError(error, 'fetch all services');
        }
      }),

    /**
     * Get service by ID
     * Security: Requires authentication
     */
    getServiceById: protectedProcedure
      .input(getServiceByIdSchema)
      .query(async ({ input }) => {
        try {
          const service = await prisma.service.findUnique({
            where: { id: input.id },
            include: {
              category: true,
              formTemplates: true,
            },
          });

          if (!service) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Service not found',
            });
          }

          return service;
        } catch (error) {
          handlePrismaError(error, 'fetch service by ID');
        }
      }),

    /**
     * Get services by category
     * Security: Requires authentication
     */
    getServicesByCategory: protectedProcedure
      .input(getServicesByCategorySchema)
      .query(async ({ input }) => {
        try {
          return await prisma.service.findMany({
            where: {
              categoryId: input.categoryId,
              deletedAt: null,
            },
            include: {
              category: true,
            },
            orderBy: {
              name: 'asc',
            },
          });
        } catch (error) {
          handlePrismaError(error, 'fetch services by category');
        }
      }),

    /**
     * Get request stats for all services
     * Returns aggregated request counts per service by status
     *
     * Response structure:
     * {
     *   [serviceId: string]: {
     *     total: number;
     *     pending: number;
     *     ongoing: number;
     *     completed: number;
     *     cancelled: number;
     *   }
     * }
     *
     * Security: Requires authentication
     */
    /**
     * Create a new service
     * Security: Requires admin role
     */
    createService: adminProcedure
      .input(createServiceSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          // Validate code uniqueness if provided
          if (input.code) {
            const existingWithCode = await prisma.service.findFirst({
              where: { code: input.code },
            });
            if (existingWithCode) {
              throw new TRPCError({
                code: 'CONFLICT',
                message: `Service code "${input.code}" is already in use`,
              });
            }
          }

          const service = await prisma.service.create({
            data: {
              name: input.name,
              categoryId: input.categoryId,
              formTemplateIds: input.formTemplateIds || [],
              thumbnail: input.thumbnail,
              iconColor: input.iconColor,
              code: input.code,
              createdBy: ctx.user?.id,
              deletedAt: input.isActive ? null : new Date(),
            },
            include: {
              category: {
                select: { id: true, name: true },
              },
            },
          });

          return service;
        } catch (error) {
          handlePrismaError(error, 'create service');
        }
      }),

    /**
     * Update an existing service
     * Security: Requires admin role
     */
    updateService: adminProcedure
      .input(updateServiceSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          const {
            id,
            isActive,
            name,
            categoryId,
            formTemplateIds,
            thumbnail,
            iconColor,
            code,
          } = input;

          // Check if service exists
          const existing = await prisma.service.findUnique({
            where: { id },
          });

          if (!existing) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Service not found',
            });
          }

          // Validate code uniqueness if being changed
          if (code !== undefined && code !== null && code !== existing.code) {
            const existingWithCode = await prisma.service.findFirst({
              where: { code, id: { not: id } },
            });
            if (existingWithCode) {
              throw new TRPCError({
                code: 'CONFLICT',
                message: `Service code "${code}" is already in use`,
              });
            }
          }

          // Build update data explicitly to avoid XOR type issues with Prisma
          const data: Prisma.ServiceUncheckedUpdateInput = {
            updatedBy: ctx.user.id,
          };
          if (name !== undefined) data.name = name;
          if (categoryId !== undefined) data.categoryId = categoryId;
          if (thumbnail !== undefined) data.thumbnail = thumbnail;
          if (iconColor !== undefined) data.iconColor = iconColor;
          if (code !== undefined) data.code = code;
          if (formTemplateIds !== undefined)
            data.formTemplateIds = formTemplateIds;
          if (isActive !== undefined)
            data.deletedAt = isActive ? null : new Date();

          const service = await prisma.service.update({
            where: { id },
            data,
            include: {
              category: {
                select: { id: true, name: true },
              },
              formTemplates: true,
            },
          });

          return service;
        } catch (error) {
          handlePrismaError(error, 'update service');
        }
      }),

    /**
     * Delete a service
     * - Hard delete if the service has no associated requests
     * - Soft delete (deactivate) if the service has associated requests
     * Security: Requires admin role
     */
    deleteService: adminProcedure
      .input(deleteServiceSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          const existing = await prisma.service.findUnique({
            where: { id: input.id },
            include: {
              _count: { select: { requests: true } },
            },
          });

          if (!existing) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Service not found',
            });
          }

          const hasRequests = existing._count.requests > 0;

          if (hasRequests) {
            // Soft delete: deactivate the service
            await prisma.service.update({
              where: { id: input.id },
              data: {
                deletedAt: new Date(),
                updatedBy: ctx.user?.id,
              },
            });

            return {
              success: true,
              action: 'deactivated' as const,
              requestCount: existing._count.requests,
            };
          } else {
            // Hard delete: permanently remove the service
            await prisma.service.delete({
              where: { id: input.id },
            });

            return {
              success: true,
              action: 'deleted' as const,
              requestCount: 0,
            };
          }
        } catch (error) {
          handlePrismaError(error, 'delete service');
        }
      }),

    getServiceRequestStats: protectedProcedure
      .input(getServiceRequestStatsSchema)
      .query(async () => {
        try {
          // Get all services with their requests
          const services = await prisma.service.findMany({
            where: {
              deletedAt: null,
            },
            include: {
              requests: {
                select: {
                  id: true,
                  status: true,
                },
              },
            },
          });

          // Build stats object keyed by service ID
          return services.reduce(
            (acc, service) => {
              const requests = service.requests;

              acc[service.id] = {
                total: requests.length,
                pending: requests.filter(
                  (r) => r.status === RequestStatus.PENDING,
                ).length,
                ongoing: requests.filter(
                  (r) => r.status === RequestStatus.ONGOING,
                ).length,
                completed: requests.filter(
                  (r) => r.status === RequestStatus.COMPLETED,
                ).length,
                cancelled: requests.filter(
                  (r) => r.status === RequestStatus.CANCELLED,
                ).length,
              };

              return acc;
            },
            {} as Record<
              string,
              {
                total: number;
                pending: number;
                ongoing: number;
                completed: number;
                cancelled: number;
              }
            >,
          );
        } catch (error) {
          handlePrismaError(error, 'fetch service request stats');
        }
      }),
  });
}
