import { z } from 'zod';
import { t, protectedProcedure } from '../trpc';
import { Prisma, PrismaClient, UserRole } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { handlePrismaError } from '../utils/prisma-error-mapper';
import {
  paginatedSortingSchema,
  createPaginatedResponse,
  calculatePagination,
} from '../schemas/common.schemas';

const prisma = new PrismaClient();

/**
 * WorkLocation tRPC Router
 * Handles work location queries
 *
 * Security:
 * - All endpoints require authentication
 * - Users can only access their own locations (except ADMIN)
 */
export function createLocationRouter() {
  return t.router({
    /**
     * Get all locations with pagination (optionally filtered by user)
     * Security: Non-admins only see their own locations
     */
    getAllLocations: protectedProcedure
      .input(
        z
          .object({
            userId: z.string().optional(),
          })
          .merge(paginatedSortingSchema)
          .optional(),
      )
      .query(async ({ input, ctx }) => {
        try {
          // Use default values if no input provided
          const page = input?.page || 1;
          const limit = input?.limit || 20;
          const sortBy = input?.sortBy || 'city';
          const sortOrder = input?.sortOrder || 'asc';

          const { skip, take } = calculatePagination(page, limit);

          const where: Prisma.WorkLocationWhereInput = {};

          // Role-based filtering
          if (ctx.user.role === UserRole.ADMIN) {
            // Admins can filter by userId or see all
            if (input?.userId) {
              where.userId = input.userId;
            }
          } else {
            // Non-admins only see their own locations
            where.userId = ctx.user.id;
          }

          // Get locations with pagination
          const [locations, total] = await Promise.all([
            prisma.workLocation.findMany({
              where,
              skip,
              take,
              orderBy: {
                [sortBy]: sortOrder,
              } as Prisma.WorkLocationOrderByWithRelationInput,
              include: { _count: { select: { requests: true } } },
            }),
            prisma.workLocation.count({ where }),
          ]);

          return createPaginatedResponse(locations, { page, limit, total });
        } catch (error) {
          handlePrismaError(error, 'fetch all locations');
        }
      }),

    /**
     * Get location by ID
     * Security: Users can only access their own locations (except ADMIN)
     */
    getLocationById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input, ctx }) => {
        try {
          const location = await prisma.workLocation.findUnique({
            where: { id: input.id },
          });

          if (!location) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Location not found',
            });
          }

          // Check ownership
          if (
            ctx.user.role !== UserRole.ADMIN &&
            location.userId !== ctx.user.id
          ) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Cannot access location of another user',
            });
          }

          return location;
        } catch (error) {
          handlePrismaError(error, 'fetch location by ID');
        }
      }),

    /**
     * Get locations for a specific user
     * Security: Users can only access their own locations (except ADMIN)
     */
    getUserLocations: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input, ctx }) => {
        try {
          // Check authorization
          if (
            ctx.user.role !== UserRole.ADMIN &&
            ctx.user.id !== input.userId
          ) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Cannot access locations of another user',
            });
          }

          return await prisma.workLocation.findMany({
            where: { userId: input.userId },
            orderBy: {
              createdAt: 'desc',
            },
            include: { _count: { select: { requests: true } } },
          });
        } catch (error) {
          handlePrismaError(error, 'fetch user locations');
        }
      }),
  });
}
