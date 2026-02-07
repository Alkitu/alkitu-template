import { z } from 'zod';
import { t } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * WorkLocation tRPC Router
 * Handles work location queries
 */
export function createLocationRouter() {
  return t.router({
    // Get all locations (optionally filtered by user)
    getAllLocations: t.procedure
      .input(
        z
          .object({
            userId: z.string().optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        const where: any = {};
        if (input?.userId) {
          where.userId = input.userId;
        }

        return await prisma.workLocation.findMany({
          where,
          orderBy: {
            city: 'asc',
          },
        });
      }),

    // Get location by ID
    getLocationById: t.procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await prisma.workLocation.findUnique({
          where: { id: input.id },
        });
      }),

    // Get locations for a specific user
    getUserLocations: t.procedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        return await prisma.workLocation.findMany({
          where: { userId: input.userId },
          orderBy: {
            createdAt: 'desc',
          },
        });
      }),
  });
}
