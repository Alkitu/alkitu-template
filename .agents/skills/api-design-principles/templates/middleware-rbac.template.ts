/**
 * RBAC Middleware Template
 *
 * Production-ready Role-Based Access Control middleware for tRPC following
 * Alkitu Template patterns with role hierarchy support.
 *
 * Usage:
 * 1. Copy functions to packages/api/src/trpc/middlewares/roles.middleware.ts
 * 2. Update UserRole enum to match your Prisma schema
 * 3. Configure role hierarchy in @alkitu/shared/rbac/role-hierarchy.ts
 * 4. Use in tRPC procedures and create convenience procedures
 */

import { TRPCError } from '@trpc/server';
import { UserRole as PrismaUserRole, AccessLevel } from '@prisma/client';
import { UserRole } from '@alkitu/shared/enums/user-role.enum';
import { hasRole } from '@alkitu/shared/rbac/role-hierarchy';
import { t } from '../trpc';

// ============================================================================
// Role Hierarchy Configuration
// ============================================================================

/**
 * Example role hierarchy (configure in @alkitu/shared/rbac/role-hierarchy.ts):
 *
 * ADMIN (highest)
 *   ├── EMPLOYEE
 *   │   ├── LEAD
 *   │   └── CLIENT
 *   └── GUEST (lowest)
 *
 * - ADMIN inherits all permissions from all roles
 * - EMPLOYEE inherits from LEAD and CLIENT
 * - LEAD and CLIENT have their own specific permissions
 */

// ============================================================================
// Authentication Middleware
// ============================================================================

/**
 * Middleware that requires user to be authenticated
 * Throws UNAUTHORIZED if no user in context
 *
 * Usage:
 * const protectedProcedure = t.procedure.use(requireAuth);
 */
export const requireAuth = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Type-safe user context
    },
  });
});

// ============================================================================
// Role-Based Access Control (RBAC) Middleware
// ============================================================================

/**
 * Middleware factory that requires specific roles
 * Supports role hierarchy - higher roles inherit permissions
 *
 * @param roles - Array of roles that are allowed to access the procedure
 * @returns tRPC middleware function
 *
 * @throws {TRPCError} UNAUTHORIZED if user is not authenticated
 * @throws {TRPCError} FORBIDDEN if user doesn't have required role
 *
 * @example
 * ```typescript
 * // Admin-only endpoint
 * const deleteUser = t.procedure
 *   .use(requireRoles(UserRole.ADMIN))
 *   .mutation(async ({ ctx, input }) => { ... });
 *
 * // EMPLOYEE or ADMIN can access
 * const getAllRequests = t.procedure
 *   .use(requireRoles(UserRole.EMPLOYEE, UserRole.ADMIN))
 *   .query(async ({ ctx }) => { ... });
 * ```
 */
export const requireRoles = (...roles: PrismaUserRole[]) => {
  return t.middleware(async ({ ctx, next }) => {
    // Check authentication
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Convert Prisma enum to shared enum for hierarchy checking
    const userRole = ctx.user.role as unknown as UserRole;
    const sharedRoles = roles.map((role) => role as unknown as UserRole);

    // Check role with hierarchy support
    if (!hasRole(userRole, sharedRoles)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Required roles: ${roles.join(', ')}. Current role: ${ctx.user.role}`,
        cause: {
          userRole: ctx.user.role,
          requiredRoles: roles,
          code: 'INSUFFICIENT_ROLE',
        },
      });
    }

    return next();
  });
};

// ============================================================================
// Convenience Procedures (Reusable Role Combinations)
// ============================================================================

/**
 * Procedure for admin-only endpoints
 *
 * @example
 * ```typescript
 * export const settingsRouter = t.router({
 *   update: adminProcedure
 *     .input(settingsSchema)
 *     .mutation(async ({ ctx, input }) => {
 *       // Only admins can update settings
 *     }),
 * });
 * ```
 */
export const adminProcedure = t.procedure.use(
  requireRoles(PrismaUserRole.ADMIN)
);

/**
 * Procedure for employee (or admin) endpoints
 * ADMIN inherits EMPLOYEE permissions via role hierarchy
 *
 * @example
 * ```typescript
 * export const requestRouter = t.router({
 *   assign: employeeProcedure
 *     .input(assignSchema)
 *     .mutation(async ({ ctx, input }) => {
 *       // Employees and admins can assign requests
 *     }),
 * });
 * ```
 */
export const employeeProcedure = t.procedure.use(
  requireRoles(PrismaUserRole.EMPLOYEE, PrismaUserRole.ADMIN)
);

/**
 * Procedure for client (or higher role) endpoints
 * EMPLOYEE and ADMIN inherit CLIENT permissions
 *
 * @example
 * ```typescript
 * export const requestRouter = t.router({
 *   create: clientProcedure
 *     .input(createRequestSchema)
 *     .mutation(async ({ ctx, input }) => {
 *       // Clients, employees, and admins can create requests
 *     }),
 * });
 * ```
 */
export const clientProcedure = t.procedure.use(
  requireRoles(
    PrismaUserRole.CLIENT,
    PrismaUserRole.EMPLOYEE,
    PrismaUserRole.ADMIN
  )
);

/**
 * Procedure for lead role endpoints
 * ADMIN inherits LEAD permissions
 *
 * @example
 * ```typescript
 * export const analyticsRouter = t.router({
 *   teamStats: leadProcedure
 *     .query(async ({ ctx }) => {
 *       // Leads and admins can view team statistics
 *     }),
 * });
 * ```
 */
export const leadProcedure = t.procedure.use(
  requireRoles(PrismaUserRole.LEAD, PrismaUserRole.ADMIN)
);

// ============================================================================
// Resource-Based Access Control
// ============================================================================

/**
 * Options for resource access middleware
 */
export interface RequireResourceAccessOptions {
  resourceType: string; // 'REQUEST', 'CONVERSATION', 'USER', 'WORK_LOCATION'
  accessLevel: AccessLevel; // READ, WRITE, ADMIN
  resourceIdKey?: string; // Key in input object (default: 'id')
}

/**
 * Middleware for resource-based access control
 * Checks if authenticated user has access to specific resource
 *
 * @param options - Resource access configuration
 * @returns tRPC middleware function
 *
 * @throws {TRPCError} UNAUTHORIZED if user is not authenticated
 * @throws {TRPCError} BAD_REQUEST if resource ID not provided
 * @throws {TRPCError} FORBIDDEN if user doesn't have access to resource
 *
 * @example
 * ```typescript
 * // Read access to request
 * const getRequest = t.procedure
 *   .use(requireResourceAccess({
 *     resourceType: 'REQUEST',
 *     accessLevel: AccessLevel.READ,
 *     resourceIdKey: 'requestId', // optional
 *   }))
 *   .input(z.object({ requestId: z.string() }))
 *   .query(async ({ ctx, input }) => {
 *     return ctx.requestsService.findOne(input.requestId);
 *   });
 *
 * // Write access required
 * const updateRequest = t.procedure
 *   .use(requireResourceAccess({
 *     resourceType: 'REQUEST',
 *     accessLevel: AccessLevel.WRITE,
 *   }))
 *   .input(updateRequestSchema)
 *   .mutation(async ({ ctx, input }) => {
 *     return ctx.requestsService.update(input.id, input.data);
 *   });
 * ```
 *
 * @security
 * - ADMIN role bypasses resource ownership checks (via role hierarchy)
 * - Falls back to resource-specific ownership rules (creator, assignee)
 * - Supports explicit access rules via AccessControl/AccessRule tables
 * - Fail closed: denies access on any error or missing resource
 */
export const requireResourceAccess = (options: RequireResourceAccessOptions) => {
  const { resourceType, accessLevel, resourceIdKey = 'id' } = options;

  return t.middleware(async ({ ctx, next, input }) => {
    // User must be authenticated
    if (!ctx.user || !ctx.user.id || !ctx.user.role) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required for resource access',
      });
    }

    // Extract resource ID from input
    const resourceId = (input as any)?.[resourceIdKey];

    if (!resourceId || typeof resourceId !== 'string') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Resource ID not provided in input.${resourceIdKey}`,
        cause: {
          expectedKey: resourceIdKey,
          receivedInput: input,
          code: 'RESOURCE_ID_MISSING',
        },
      });
    }

    try {
      // Check access using AccessControlService from context
      await ctx.accessControl.checkAccess({
        userId: ctx.user.id,
        userRole: ctx.user.role as UserRole,
        resourceType,
        resourceId,
        requiredLevel: accessLevel,
      });

      return next();
    } catch (error) {
      // Re-throw TRPCError as-is
      if (error instanceof TRPCError) {
        throw error;
      }

      // AccessControlService throws exception with metadata
      if (error && typeof error === 'object' && 'message' in error) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: error.message as string,
          cause: {
            resourceType,
            resourceId,
            requiredLevel: accessLevel,
            code: 'ACCESS_DENIED',
            ...(error as any),
          },
        });
      }

      // For other errors, fail closed (deny access)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Unable to verify access to ${resourceType}`,
        cause: {
          resourceType,
          resourceId,
          requiredLevel: accessLevel,
          code: 'ACCESS_CHECK_FAILED',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  });
};

// ============================================================================
// Ownership Middleware
// ============================================================================

/**
 * Middleware that checks if user owns the resource
 * Simpler alternative to full resource access control
 *
 * @param options - Configuration for ownership check
 * @returns tRPC middleware function
 *
 * @example
 * ```typescript
 * const updateProfile = t.procedure
 *   .use(requireOwnership({
 *     resourceType: 'user',
 *     userIdKey: 'userId',
 *   }))
 *   .input(z.object({ userId: z.string(), data: updateUserSchema }))
 *   .mutation(async ({ ctx, input }) => {
 *     // User can only update their own profile
 *   });
 * ```
 */
export const requireOwnership = (options: {
  resourceType: string;
  userIdKey?: string;
}) => {
  const { resourceType, userIdKey = 'userId' } = options;

  return t.middleware(async ({ ctx, next, input }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    const resourceUserId = (input as any)?.[userIdKey];

    if (!resourceUserId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `User ID not provided in input.${userIdKey}`,
      });
    }

    // Check if user owns the resource
    if (ctx.user.id !== resourceUserId) {
      // Allow admins to bypass ownership check
      const userRole = ctx.user.role as unknown as UserRole;
      if (userRole !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `You can only access your own ${resourceType}`,
          cause: {
            resourceType,
            resourceUserId,
            currentUserId: ctx.user.id,
            code: 'NOT_OWNER',
          },
        });
      }
    }

    return next();
  });
};

// ============================================================================
// Permission-Based Middleware
// ============================================================================

/**
 * Middleware that checks for specific permissions
 * Use when permissions are more granular than roles
 *
 * @param permissions - Array of required permissions
 * @returns tRPC middleware function
 *
 * @example
 * ```typescript
 * const deleteUser = t.procedure
 *   .use(requirePermissions('users.delete', 'users.manage'))
 *   .mutation(async ({ ctx, input }) => {
 *     // User needs either 'users.delete' OR 'users.manage' permission
 *   });
 * ```
 */
export const requirePermissions = (...permissions: string[]) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Fetch user permissions from database or cache
    const userPermissions = await ctx.prisma.userPermission.findMany({
      where: { userId: ctx.user.id },
      select: { permission: true },
    });

    const userPermissionSet = new Set(
      userPermissions.map((p) => p.permission)
    );

    // Check if user has any of the required permissions
    const hasPermission = permissions.some((perm) =>
      userPermissionSet.has(perm)
    );

    if (!hasPermission) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Required permissions: ${permissions.join(' OR ')}`,
        cause: {
          requiredPermissions: permissions,
          userPermissions: Array.from(userPermissionSet),
          code: 'INSUFFICIENT_PERMISSIONS',
        },
      });
    }

    return next();
  });
};

// ============================================================================
// Usage Example
// ============================================================================

/**
 * Example router using RBAC middleware:
 *
 * export const requestRouter = t.router({
 *   // Public endpoint - no middleware
 *   list: t.procedure
 *     .input(listRequestsSchema)
 *     .query(async ({ ctx, input }) => {
 *       return await ctx.prisma.request.findMany();
 *     }),
 *
 *   // Authenticated users only
 *   myRequests: t.procedure
 *     .use(requireAuth)
 *     .query(async ({ ctx }) => {
 *       return await ctx.prisma.request.findMany({
 *         where: { userId: ctx.user.id },
 *       });
 *     }),
 *
 *   // Clients and higher can create
 *   create: clientProcedure
 *     .input(createRequestSchema)
 *     .mutation(async ({ ctx, input }) => {
 *       return await ctx.prisma.request.create({ data: input });
 *     }),
 *
 *   // Employees and higher can assign
 *   assign: employeeProcedure
 *     .input(assignRequestSchema)
 *     .mutation(async ({ ctx, input }) => {
 *       return await ctx.prisma.request.update({
 *         where: { id: input.id },
 *         data: { assignedToId: input.assignedToId },
 *       });
 *     }),
 *
 *   // Resource access control for updates
 *   update: t.procedure
 *     .use(requireResourceAccess({
 *       resourceType: 'REQUEST',
 *       accessLevel: AccessLevel.WRITE,
 *     }))
 *     .input(updateRequestSchema)
 *     .mutation(async ({ ctx, input }) => {
 *       return await ctx.prisma.request.update({
 *         where: { id: input.id },
 *         data: input,
 *       });
 *     }),
 *
 *   // Admin-only delete
 *   delete: adminProcedure
 *     .input(z.object({ id: z.string() }))
 *     .mutation(async ({ ctx, input }) => {
 *       await ctx.prisma.request.delete({ where: { id: input.id } });
 *       return { success: true };
 *     }),
 * });
 */
