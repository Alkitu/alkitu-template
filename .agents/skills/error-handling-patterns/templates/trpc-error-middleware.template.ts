/**
 * tRPC Error Middleware Template
 *
 * Production-ready tRPC middleware patterns for authentication, authorization,
 * feature flags, and resource access control.
 *
 * Usage:
 * 1. Copy the middleware functions you need to your trpc setup file
 * 2. Create convenience procedures (e.g., protectedProcedure, adminProcedure)
 * 3. Use in routers: t.procedure.use(middleware).query(...)
 */

import { TRPCError } from '@trpc/server';
import { initTRPC } from '@trpc/server';

// Example Context type - adjust to match your application
interface Context {
  prisma: any; // Your Prisma client
  user?: {
    id: string;
    email: string;
    role: string;
  };
  // Add other context properties as needed
}

// Initialize tRPC with your context
const t = initTRPC.context<Context>().create();

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
// Role-Based Access Control (RBAC)
// ============================================================================

/**
 * User roles enum - adjust to match your application
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT',
  LEAD = 'LEAD',
}

/**
 * Check if user has required role (supports role hierarchy)
 */
function hasRole(userRole: string, requiredRoles: string[]): boolean {
  // Admin has access to everything
  if (userRole === UserRole.ADMIN) return true;

  // Check if user's role is in required roles
  return requiredRoles.includes(userRole);
}

/**
 * Middleware factory that requires specific roles
 * Throws UNAUTHORIZED if not authenticated, FORBIDDEN if insufficient permissions
 *
 * Usage:
 * const adminOnly = requireRoles(UserRole.ADMIN);
 * const adminOrEmployee = requireRoles(UserRole.ADMIN, UserRole.EMPLOYEE);
 */
export const requireRoles = (...roles: UserRole[]) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    if (!hasRole(ctx.user.role, roles as string[])) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Required roles: ${roles.join(', ')}. Current role: ${ctx.user.role}`,
      });
    }

    return next();
  });
};

/**
 * Convenience procedures for common role combinations
 */
export const adminProcedure = t.procedure.use(requireRoles(UserRole.ADMIN));

export const employeeProcedure = t.procedure.use(
  requireRoles(UserRole.EMPLOYEE, UserRole.ADMIN)
);

export const clientProcedure = t.procedure.use(
  requireRoles(UserRole.CLIENT, UserRole.EMPLOYEE, UserRole.ADMIN)
);

// ============================================================================
// Feature Flag Protection
// ============================================================================

/**
 * Middleware factory that requires a feature flag to be enabled
 * Fail-closed: Denies access if feature flag check fails
 *
 * Usage:
 * export const chatRouter = t.router({
 *   getConversations: t.procedure
 *     .use(requireFeature('support-chat'))
 *     .query(async ({ ctx }) => {
 *       // Feature-protected logic
 *     }),
 * });
 */
export const requireFeature = (featureKey: string) => {
  return t.middleware(async ({ ctx, next }) => {
    try {
      // Check feature flag in database
      const featureFlag = await ctx.prisma.featureFlag.findUnique({
        where: { key: featureKey },
        select: { status: true },
      });

      // Fail closed - deny if feature not found or disabled
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
      // Re-throw TRPCError as-is
      if (error instanceof TRPCError) throw error;

      // Fail closed on errors - deny access
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Unable to verify feature "${featureKey}"`,
      });
    }
  });
};

// ============================================================================
// Resource-Based Access Control
// ============================================================================

/**
 * Access levels for resources
 */
export enum AccessLevel {
  READ = 'READ',
  WRITE = 'WRITE',
  ADMIN = 'ADMIN',
}

/**
 * Options for resource access control
 */
export interface RequireResourceAccessOptions {
  resourceType: string; // e.g., 'REQUEST', 'CONVERSATION', 'USER'
  accessLevel: AccessLevel;
  resourceIdKey?: string; // Key in input (default: 'id')
}

/**
 * Middleware factory for resource-based access control
 * Checks if authenticated user has permission to access specific resource
 * Fail-closed: Denies access if permission check fails
 *
 * Usage:
 * export const requestRouter = t.router({
 *   update: t.procedure
 *     .use(requireResourceAccess({
 *       resourceType: 'REQUEST',
 *       accessLevel: AccessLevel.WRITE,
 *       resourceIdKey: 'id',
 *     }))
 *     .input(updateRequestSchema)
 *     .mutation(async ({ input, ctx }) => {
 *       // User has write access to this request
 *     }),
 * });
 */
export const requireResourceAccess = (options: RequireResourceAccessOptions) => {
  const { resourceType, accessLevel, resourceIdKey = 'id' } = options;

  return t.middleware(async ({ ctx, next, input }) => {
    // Require authentication
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Extract resource ID from input
    const resourceId = (input as any)[resourceIdKey];
    if (!resourceId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Resource ID not provided in input.${resourceIdKey}`,
      });
    }

    try {
      // Check access control (implement based on your access control system)
      // This is a placeholder - replace with your actual implementation
      const hasAccess = await checkUserHasResourceAccess({
        userId: ctx.user.id,
        resourceType,
        resourceId,
        accessLevel,
        prisma: ctx.prisma,
      });

      if (!hasAccess) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `Insufficient permissions to ${accessLevel} ${resourceType}`,
          cause: {
            userId: ctx.user.id,
            resourceType,
            resourceId,
            accessLevel,
          },
        });
      }

      return next();
    } catch (error) {
      // Re-throw TRPCError as-is
      if (error instanceof TRPCError) throw error;

      // Fail closed on errors - deny access
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unable to verify resource access',
      });
    }
  });
};

/**
 * Placeholder function for checking resource access
 * Replace with your actual access control implementation
 */
async function checkUserHasResourceAccess(params: {
  userId: string;
  resourceType: string;
  resourceId: string;
  accessLevel: AccessLevel;
  prisma: any;
}): Promise<boolean> {
  // Example implementation:
  // - Check if resource exists
  // - Check if user owns resource
  // - Check user role permissions
  // - Check explicit access grants
  // - Return true if user has required access level

  // TODO: Implement your access control logic here
  return true;
}

// ============================================================================
// Rate Limiting Middleware
// ============================================================================

/**
 * Simple in-memory rate limiter
 * For production, use Redis-based solution like ioredis + rate-limiter-flexible
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Middleware factory for rate limiting
 * Throws TOO_MANY_REQUESTS if rate limit exceeded
 *
 * Usage:
 * const rateLimitedProcedure = t.procedure.use(rateLimit({
 *   maxRequests: 10,
 *   windowMs: 60000, // 1 minute
 * }));
 */
export const rateLimit = (options: { maxRequests: number; windowMs: number }) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      // Skip rate limiting for unauthenticated requests
      return next();
    }

    const key = `ratelimit:${ctx.user.id}`;
    const now = Date.now();

    let bucket = rateLimitStore.get(key);

    if (!bucket || now > bucket.resetAt) {
      // Create new bucket
      bucket = {
        count: 1,
        resetAt: now + options.windowMs,
      };
      rateLimitStore.set(key, bucket);
      return next();
    }

    if (bucket.count >= options.maxRequests) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded. Please try again later.',
        cause: {
          retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
        },
      });
    }

    bucket.count++;
    return next();
  });
};

// ============================================================================
// Export all middleware and procedures
// ============================================================================

export {
  t,
  requireAuth,
  requireRoles,
  requireFeature,
  requireResourceAccess,
  rateLimit,
  // Convenience procedures
  adminProcedure,
  employeeProcedure,
  clientProcedure,
};
