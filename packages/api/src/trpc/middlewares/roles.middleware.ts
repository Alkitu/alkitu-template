import { TRPCError } from '@trpc/server';
import { UserRole as PrismaUserRole, AccessLevel } from '@prisma/client';
import { UserRole } from '@alkitu/shared/enums/user-role.enum';
import { hasRole } from '@alkitu/shared/rbac/role-hierarchy';
import { t } from '../trpc';
import { AccessControlService } from '../../access-control/access-control.service';

/**
 * tRPC Middleware for Role-Based Access Control
 *
 * Checks if the authenticated user has one of the required roles.
 * Uses role hierarchy system - ADMIN inherits all permissions.
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
 * const deleteUser = protectedProcedure
 *   .use(requireRoles(UserRole.ADMIN))
 *   .mutation(async ({ ctx, input }) => { ... });
 *
 * // EMPLOYEE or ADMIN can access
 * const getAllRequests = protectedProcedure
 *   .use(requireRoles(UserRole.EMPLOYEE, UserRole.ADMIN))
 *   .query(async ({ ctx }) => { ... });
 * ```
 */
export const requireRoles = (...roles: PrismaUserRole[]) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Convert Prisma enum to shared enum for hierarchy checking
    const userRole = ctx.user.role as unknown as UserRole;
    const sharedRoles = roles.map((role) => role as unknown as UserRole);

    if (!hasRole(userRole, sharedRoles)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Required roles: ${roles.join(', ')}. Current role: ${ctx.user.role}`,
      });
    }

    return next();
  });
};

/**
 * Convenience procedure for admin-only endpoints
 *
 * @example
 * ```typescript
 * const updateSettings = adminProcedure
 *   .input(settingsSchema)
 *   .mutation(async ({ ctx, input }) => { ... });
 * ```
 */
export const adminProcedure = t.procedure.use(
  requireRoles(PrismaUserRole.ADMIN),
);

/**
 * Convenience procedure for employee (or admin) endpoints
 *
 * @example
 * ```typescript
 * const assignRequest = employeeProcedure
 *   .input(assignSchema)
 *   .mutation(async ({ ctx, input }) => { ... });
 * ```
 */
export const employeeProcedure = t.procedure.use(
  requireRoles(PrismaUserRole.EMPLOYEE, PrismaUserRole.ADMIN),
);

/**
 * Convenience procedure for client (or higher role) endpoints
 *
 * @example
 * ```typescript
 * const createRequest = clientProcedure
 *   .input(createRequestSchema)
 *   .mutation(async ({ ctx, input }) => { ... });
 * ```
 */
export const clientProcedure = t.procedure.use(
  requireRoles(
    PrismaUserRole.CLIENT,
    PrismaUserRole.EMPLOYEE,
    PrismaUserRole.ADMIN,
  ),
);

/**
 * Convenience procedure for lead role endpoints
 *
 * @example
 * ```typescript
 * const getTeamStats = leadProcedure
 *   .query(async ({ ctx }) => { ... });
 * ```
 */
export const leadProcedure = t.procedure.use(
  requireRoles(PrismaUserRole.LEAD, PrismaUserRole.ADMIN),
);

/**
 * tRPC Middleware for Feature Flag Protection
 *
 * Checks if a required feature flag is enabled before allowing access.
 * Fail closed: denies access if feature is disabled or not found.
 *
 * @param featureKey - The feature flag key to check (e.g., 'support-chat')
 * @returns tRPC middleware function
 *
 * @throws {TRPCError} FORBIDDEN if feature is disabled or not found
 *
 * @example
 * ```typescript
 * // Protect endpoint with feature flag
 * const getChatHistory = protectedProcedure
 *   .use(requireRoles(UserRole.ADMIN))
 *   .use(requireFeature('support-chat'))
 *   .query(async ({ ctx }) => { ... });
 *
 * // Can also be chained
 * const createChannel = adminProcedure
 *   .use(requireFeature('team-channels'))
 *   .mutation(async ({ ctx, input }) => { ... });
 * ```
 */
export const requireFeature = (featureKey: string) => {
  return t.middleware(async ({ ctx, next }) => {
    try {
      // Check if feature flag exists and is enabled
      const featureFlag = await ctx.prisma.featureFlag.findUnique({
        where: { key: featureKey },
        select: { status: true },
      });

      // Fail closed: if feature not found or disabled, deny access
      if (!featureFlag || featureFlag.status !== 'ENABLED') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `Feature "${featureKey}" is not enabled`,
          cause: {
            feature: featureKey,
            status: featureFlag?.status || 'NOT_FOUND',
            code: 'FEATURE_DISABLED',
          },
        });
      }

      return next();
    } catch (error) {
      // If error is already TRPCError, rethrow it
      if (error instanceof TRPCError) {
        throw error;
      }

      // For database errors or other issues, fail closed (deny access)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Unable to verify feature "${featureKey}"`,
        cause: {
          feature: featureKey,
          code: 'FEATURE_CHECK_FAILED',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  });
};

/**
 * Resource Access Middleware Options
 */
export interface RequireResourceAccessOptions {
  resourceType: string; // 'REQUEST', 'CONVERSATION', 'USER', 'WORK_LOCATION'
  accessLevel: AccessLevel; // READ, WRITE, ADMIN
  resourceIdKey?: string; // Key in input object containing resource ID (default: 'id')
}

/**
 * tRPC Middleware for Resource Access Control
 *
 * Checks if the authenticated user has access to a specific resource.
 * Uses AccessControlService to verify ownership and explicit permissions.
 * Fail closed: denies access if resource not found or error occurs.
 *
 * @param options - Resource access configuration
 * @returns tRPC middleware function
 *
 * @throws {TRPCError} UNAUTHORIZED if user is not authenticated
 * @throws {TRPCError} FORBIDDEN if user doesn't have access to resource
 *
 * @example
 * ```typescript
 * // Protect request access
 * const getRequest = protectedProcedure
 *   .use(requireResourceAccess({
 *     resourceType: 'REQUEST',
 *     accessLevel: AccessLevel.READ,
 *     resourceIdKey: 'requestId', // optional, defaults to 'id'
 *   }))
 *   .input(z.object({ requestId: z.string() }))
 *   .query(async ({ ctx, input }) => {
 *     return ctx.requestsService.findOne(input.requestId);
 *   });
 *
 * // Update request (requires WRITE access)
 * const updateRequest = protectedProcedure
 *   .use(requireResourceAccess({
 *     resourceType: 'REQUEST',
 *     accessLevel: AccessLevel.WRITE,
 *   }))
 *   .input(updateRequestSchema)
 *   .mutation(async ({ ctx, input }) => {
 *     return ctx.requestsService.update(input.id, input.data);
 *   });
 *
 * // Delete request (requires ADMIN access)
 * const deleteRequest = protectedProcedure
 *   .use(requireResourceAccess({
 *     resourceType: 'REQUEST',
 *     accessLevel: AccessLevel.ADMIN,
 *   }))
 *   .input(z.object({ id: z.string() }))
 *   .mutation(async ({ ctx, input }) => {
 *     return ctx.requestsService.remove(input.id);
 *   });
 * ```
 *
 * @security
 * - ADMIN role bypasses resource ownership checks (via role hierarchy)
 * - Falls back to resource-specific ownership rules (creator, assignee, etc.)
 * - Supports explicit access rules via AccessControl/AccessRule tables
 * - Fail closed: denies access on any error or missing resource
 */
export const requireResourceAccess = (options: RequireResourceAccessOptions) => {
  const { resourceType, accessLevel, resourceIdKey = 'id' } = options;

  return t.middleware(async ({ ctx, next, input }) => {
    // User must be authenticated (should be handled by protectedProcedure)
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
      // If error is already TRPCError, rethrow it
      if (error instanceof TRPCError) {
        throw error;
      }

      // AccessControlService throws ForbiddenException with metadata
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
