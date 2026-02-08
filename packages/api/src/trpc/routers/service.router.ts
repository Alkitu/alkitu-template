import { z } from 'zod';
import { t, protectedProcedure } from '../trpc';
import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { handlePrismaError } from '../utils/prisma-error-mapper';
import {
  paginatedSortingSchema,
  createPaginatedResponse,
  calculatePagination,
} from '../schemas/common.schemas';

const prisma = new PrismaClient();

/**
 * Service tRPC Router
 * Handles service catalog queries
 *
 * Security:
 * - All endpoints require authentication
 */
export function createServiceRouter() {
  return t.router({
    /**
     * Get all active services with pagination
     * Security: Requires authentication
     */
    getAllServices: protectedProcedure
      .input(paginatedSortingSchema.optional())
      .query(async ({ input }) => {
        try {
          // Use default values if no input provided
          const page = input?.page || 1;
          const limit = input?.limit || 20;
          const sortBy = input?.sortBy || 'name';
          const sortOrder = input?.sortOrder || 'asc';

          const { skip, take } = calculatePagination(page, limit);

          const where = {
            deletedAt: null, // Only show non-deleted services
          };

          // Get services with pagination
          const [services, total] = await Promise.all([
            prisma.service.findMany({
              where,
              skip,
              take,
              orderBy: { [sortBy]: sortOrder },
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            }),
            prisma.service.count({ where }),
          ]);

          return createPaginatedResponse(services, { page, limit, total });
        } catch (error) {
          handlePrismaError(error, 'fetch all services');
        }
      }),

    /**
     * Get service by ID
     * Security: Requires authentication
     */
    getServiceById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        try {
          const service = await prisma.service.findUnique({
            where: { id: input.id },
            include: {
              category: true,
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
      .input(z.object({ categoryId: z.string() }))
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
  });
}
