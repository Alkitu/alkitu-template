import { z } from 'zod';
import { t } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Service tRPC Router
 * Handles service catalog queries
 */
export function createServiceRouter() {
  return t.router({
    // Get all active services
    getAllServices: t.procedure.query(async () => {
      return await prisma.service.findMany({
        where: {
          deletedAt: null, // Only show non-deleted services
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    }),

    // Get service by ID
    getServiceById: t.procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await prisma.service.findUnique({
          where: { id: input.id },
          include: {
            category: true,
          },
        });
      }),

    // Get services by category
    getServicesByCategory: t.procedure
      .input(z.object({ categoryId: z.string() }))
      .query(async ({ input }) => {
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
      }),
  });
}
