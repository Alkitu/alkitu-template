/**
 * tRPC Router Template
 *
 * Production-ready tRPC router template following Alkitu Template patterns.
 * Includes CRUD operations, pagination, filtering, and middleware usage.
 *
 * Usage:
 * 1. Copy this template to packages/api/src/trpc/routers/your-router.ts
 * 2. Update the resource name (replace Resource/resource)
 * 3. Create corresponding Zod schemas in packages/api/src/trpc/schemas/
 * 4. Register router in trpc.router.ts
 * 5. Add service dependencies if needed (update constructor in TrpcRouter)
 */

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { t } from '../trpc';
import { requireRoles, requireResourceAccess } from '../middlewares/roles.middleware';
import { UserRole, AccessLevel } from '@prisma/client';

// ============================================================================
// Import Schemas
// ============================================================================

import {
  createResourceSchema,
  updateResourceSchema,
  getResourceSchema,
  deleteResourceSchema,
  listResourcesSchema,
  // Add more schemas as needed
} from '../schemas/resource.schemas';

// ============================================================================
// Standalone Router (No Service Dependencies)
// ============================================================================

/**
 * Use this pattern for routers with no external service dependencies.
 * Direct Prisma access via context.
 */
export const resourceRouter = t.router({
  // LIST - Get all resources with pagination and filtering
  list: t.procedure
    .input(listResourcesSchema)
    .query(async ({ input, ctx }) => {
      const { page, limit, search, sortBy, sortOrder } = input;

      // Build where clause for filtering
      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Execute queries in parallel
      const [items, total] = await Promise.all([
        ctx.prisma.resource.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            // Include related data
            user: { select: { id: true, email: true, firstname: true, lastname: true } },
          },
        }),
        ctx.prisma.resource.count({ where }),
      ]);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    }),

  // GET BY ID - Get single resource
  get: t.procedure
    .input(getResourceSchema)
    .query(async ({ input, ctx }) => {
      const resource = await ctx.prisma.resource.findUnique({
        where: { id: input.id },
        include: {
          // Include related data
          user: true,
        },
      });

      if (!resource) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Resource with ID ${input.id} not found`,
        });
      }

      return resource;
    }),

  // CREATE - Create new resource
  create: t.procedure
    .use(requireRoles(UserRole.EMPLOYEE, UserRole.ADMIN)) // Require specific roles
    .input(createResourceSchema)
    .mutation(async ({ input, ctx }) => {
      // Check for duplicates if needed
      const existing = await ctx.prisma.resource.findFirst({
        where: { name: input.name },
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Resource with this name already exists',
        });
      }

      // Create resource
      return await ctx.prisma.resource.create({
        data: {
          ...input,
          userId: ctx.user!.id, // Created by current user
        },
      });
    }),

  // UPDATE - Update existing resource
  update: t.procedure
    .use(requireResourceAccess({
      resourceType: 'RESOURCE',
      accessLevel: AccessLevel.WRITE,
    }))
    .input(updateResourceSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      // Verify resource exists
      const existing = await ctx.prisma.resource.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Resource with ID ${id} not found`,
        });
      }

      // Update resource
      return await ctx.prisma.resource.update({
        where: { id },
        data,
      });
    }),

  // DELETE - Soft delete resource
  delete: t.procedure
    .use(requireResourceAccess({
      resourceType: 'RESOURCE',
      accessLevel: AccessLevel.ADMIN,
    }))
    .input(deleteResourceSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify resource exists
      const existing = await ctx.prisma.resource.findUnique({
        where: { id: input.id },
      });

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Resource with ID ${input.id} not found`,
        });
      }

      // Soft delete
      await ctx.prisma.resource.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
      });

      return { success: true };
    }),

  // CUSTOM ACTION - Example of custom business logic
  archive: t.procedure
    .use(requireRoles(UserRole.EMPLOYEE, UserRole.ADMIN))
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const resource = await ctx.prisma.resource.findUnique({
        where: { id: input.id },
      });

      if (!resource) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Resource with ID ${input.id} not found`,
        });
      }

      if (resource.status === 'ARCHIVED') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Resource is already archived',
        });
      }

      return await ctx.prisma.resource.update({
        where: { id: input.id },
        data: { status: 'ARCHIVED' },
      });
    }),

  // STATISTICS - Example of aggregation query
  stats: t.procedure
    .use(requireRoles(UserRole.EMPLOYEE, UserRole.ADMIN))
    .query(async ({ ctx }) => {
      const [total, active, archived] = await Promise.all([
        ctx.prisma.resource.count(),
        ctx.prisma.resource.count({ where: { status: 'ACTIVE' } }),
        ctx.prisma.resource.count({ where: { status: 'ARCHIVED' } }),
      ]);

      return {
        total,
        active,
        archived,
        inactive: total - active - archived,
      };
    }),
});

// ============================================================================
// Router Factory (With Service Dependencies)
// ============================================================================

/**
 * Use this pattern when router needs service injection.
 * Services are passed from TrpcRouter in trpc.router.ts
 */
export function createResourceRouter(
  resourceService: any, // Replace with your service type
  notificationService?: any, // Optional services
) {
  return t.router({
    list: t.procedure
      .input(listResourcesSchema)
      .query(async ({ input }) => {
        return await resourceService.findAll(input);
      }),

    get: t.procedure
      .input(getResourceSchema)
      .query(async ({ input }) => {
        return await resourceService.findOne(input.id);
      }),

    create: t.procedure
      .use(requireRoles(UserRole.EMPLOYEE, UserRole.ADMIN))
      .input(createResourceSchema)
      .mutation(async ({ input, ctx }) => {
        const resource = await resourceService.create(input);

        // Send notification (non-critical)
        if (notificationService) {
          try {
            await notificationService.sendCreatedNotification(resource);
          } catch (error) {
            console.warn('Failed to send notification:', error);
          }
        }

        return resource;
      }),

    update: t.procedure
      .use(requireResourceAccess({
        resourceType: 'RESOURCE',
        accessLevel: AccessLevel.WRITE,
      }))
      .input(updateResourceSchema)
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await resourceService.update(id, data);
      }),

    delete: t.procedure
      .use(requireResourceAccess({
        resourceType: 'RESOURCE',
        accessLevel: AccessLevel.ADMIN,
      }))
      .input(deleteResourceSchema)
      .mutation(async ({ input }) => {
        await resourceService.remove(input.id);
        return { success: true };
      }),
  });
}

// ============================================================================
// Error Handling Patterns
// ============================================================================

/**
 * Common error patterns to use in routers
 */

// Not found error
function throwNotFound(resourceType: string, id: string): never {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: `${resourceType} with ID ${id} not found`,
  });
}

// Conflict error (duplicate)
function throwConflict(message: string): never {
  throw new TRPCError({
    code: 'CONFLICT',
    message,
  });
}

// Bad request error
function throwBadRequest(message: string): never {
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message,
  });
}

// Unauthorized error
function throwUnauthorized(message = 'Authentication required'): never {
  throw new TRPCError({
    code: 'UNAUTHORIZED',
    message,
  });
}

// Forbidden error
function throwForbidden(message = 'Insufficient permissions'): never {
  throw new TRPCError({
    code: 'FORBIDDEN',
    message,
  });
}

// ============================================================================
// Usage in trpc.router.ts
// ============================================================================

/**
 * Register router in packages/api/src/trpc/trpc.router.ts:
 *
 * import { resourceRouter } from './routers/resource.router';
 * // OR
 * import { createResourceRouter } from './routers/resource.router';
 *
 * @Injectable()
 * export class TrpcRouter {
 *   constructor(
 *     private prisma: PrismaService,
 *     private resourceService: ResourceService, // If using factory
 *   ) {}
 *
 *   appRouter() {
 *     return t.router({
 *       // Standalone router
 *       resource: resourceRouter,
 *
 *       // OR Factory router
 *       resource: createResourceRouter(this.resourceService),
 *
 *       // ... other routers
 *     });
 *   }
 * }
 */
