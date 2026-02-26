import { t, protectedProcedure } from '../trpc';
import { type PrismaClient, RequestStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { adminProcedure } from '../middlewares/roles.middleware';
import {
  getAllCategoriesSchema,
  getCategoriesWithStatsSchema,
  getCategoryByIdSchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from '../schemas/category.schemas';

/**
 * Category tRPC Router
 * Handles category catalog queries with stats
 *
 * Security:
 * - All endpoints require authentication
 * - Stats endpoints available to all authenticated users
 * - Admin endpoints for management operations
 */
export function createCategoryRouter(prisma: PrismaClient) {
  return t.router({
    /**
     * Get all categories
     * Security: Requires authentication
     */
    getAllCategories: protectedProcedure
      .input(getAllCategoriesSchema)
      .query(async () => {
        return await prisma.category.findMany({
          where: {
            deletedAt: null,
          },
          include: {
            _count: {
              select: { services: true },
            },
          },
          orderBy: {
            name: 'asc',
          },
        });
      }),

    /**
     * Get categories with full stats (services + requests)
     * Returns Category → Service → Request hierarchy with aggregated statistics
     *
     * Response structure:
     * {
     *   id: string;
     *   name: string;
     *   services: {
     *     id: string;
     *     name: string;
     *     requestStats: {
     *       total: number;
     *       byStatus: { PENDING: number; ONGOING: number; COMPLETED: number; CANCELLED: number; }
     *     }
     *   }[];
     *   totalServices: number;
     *   totalRequests: number;
     * }
     */
    getCategoriesWithStats: protectedProcedure
      .input(getCategoriesWithStatsSchema)
      .query(async () => {
        // Get all non-deleted categories with their services and requests
        const categories = await prisma.category.findMany({
          where: {
            deletedAt: null,
          },
          include: {
            services: {
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
            },
          },
          orderBy: {
            name: 'asc',
          },
        });

        // Transform data to include aggregated stats
        return categories.map((category) => {
          const services = category.services.map((service) => {
            const requests = service.requests;

            return {
              id: service.id,
              name: service.name,
              categoryId: service.categoryId,
              thumbnail: service.thumbnail,
              createdAt: service.createdAt,
              updatedAt: service.updatedAt,
              requestStats: {
                total: requests.length,
                byStatus: {
                  PENDING: requests.filter(
                    (r) => r.status === RequestStatus.PENDING,
                  ).length,
                  ONGOING: requests.filter(
                    (r) => r.status === RequestStatus.ONGOING,
                  ).length,
                  COMPLETED: requests.filter(
                    (r) => r.status === RequestStatus.COMPLETED,
                  ).length,
                  CANCELLED: requests.filter(
                    (r) => r.status === RequestStatus.CANCELLED,
                  ).length,
                },
              },
            };
          });

          const totalRequests = services.reduce(
            (sum, s) => sum + s.requestStats.total,
            0,
          );

          return {
            id: category.id,
            name: category.name,
            services,
            totalServices: services.length,
            totalRequests,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
          };
        });
      }),

    /**
     * Get category by ID
     * Security: Requires authentication
     */
    getCategoryById: protectedProcedure
      .input(getCategoryByIdSchema)
      .query(async ({ input }) => {
        const category = await prisma.category.findUnique({
          where: { id: input.id },
          include: {
            services: {
              where: {
                deletedAt: null,
              },
            },
            _count: {
              select: { services: true },
            },
          },
        });

        if (!category) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          });
        }

        return category;
      }),

    /**
     * Create category
     * Security: ADMIN only
     */
    createCategory: adminProcedure
      .input(createCategorySchema)
      .mutation(async ({ input, ctx }) => {
        return await prisma.category.create({
          data: {
            name: input.name,
            createdBy: input.createdBy || ctx.user.id,
          },
        });
      }),

    /**
     * Update category
     * Security: ADMIN only
     */
    updateCategory: adminProcedure
      .input(updateCategorySchema)
      .mutation(async ({ input, ctx }) => {
        const { id, name, updatedBy } = input;

        return await prisma.category.update({
          where: { id },
          data: {
            name,
            updatedBy: updatedBy || ctx.user.id,
          },
        });
      }),

    /**
     * Delete category (soft delete)
     * Security: ADMIN only
     */
    deleteCategory: adminProcedure
      .input(deleteCategorySchema)
      .mutation(async ({ input }) => {
        // Check if category has services
        const category = await prisma.category.findUnique({
          where: { id: input.id },
          include: {
            _count: {
              select: { services: true },
            },
          },
        });

        if (!category) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          });
        }

        if (category._count.services > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot delete category with existing services',
          });
        }

        return await prisma.category.update({
          where: { id: input.id },
          data: {
            deletedAt: new Date(),
          },
        });
      }),
  });
}
