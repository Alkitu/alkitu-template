import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma.service';

/**
 * Metadata key for storing required feature flag
 */
export const REQUIRE_FEATURE_KEY = 'requireFeature';

/**
 * Decorator to mark endpoints that require a specific feature flag
 *
 * @param featureKey - The feature flag key to check
 *
 * @example
 * ```typescript
 * @Get('conversations')
 * @UseGuards(JwtAuthGuard, RolesGuard, FeatureFlagGuard)
 * @Roles(UserRole.ADMIN)
 * @RequireFeature('support-chat')
 * async getConversations() {
 *   // This endpoint only works if support-chat is enabled
 * }
 * ```
 */
export const RequireFeature = (featureKey: string) =>
  SetMetadata(REQUIRE_FEATURE_KEY, featureKey);

/**
 * Feature Flag Guard for NestJS
 *
 * Protects endpoints by checking if a required feature flag is enabled.
 * If the feature is disabled, throws ForbiddenException.
 *
 * @usage
 * ```typescript
 * @Controller('chat')
 * @UseGuards(JwtAuthGuard, RolesGuard, FeatureFlagGuard)
 * export class ChatController {
 *   @Get()
 *   @RequireFeature('support-chat')
 *   findAll() { ... }
 * }
 * ```
 *
 * @security
 * - Always use after JwtAuthGuard (requires authentication)
 * - Use with RolesGuard for role + feature protection
 * - Fail closed: denies access if feature flag not found
 *
 * @performance
 * - Queries database on every request (consider caching)
 * - Indexed query on `key` field (fast lookup)
 */
@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required feature key from @RequireFeature() decorator
    const requiredFeature = this.reflector.getAllAndOverride<string>(
      REQUIRE_FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no feature required, allow access
    if (!requiredFeature) {
      return true;
    }

    try {
      // Check if feature flag exists and is enabled
      const featureFlag = await this.prisma.featureFlag.findUnique({
        where: { key: requiredFeature },
        select: { status: true },
      });

      // Fail closed: if feature not found or disabled, deny access
      if (!featureFlag || featureFlag.status !== 'ENABLED') {
        throw new ForbiddenException({
          message: `Feature "${requiredFeature}" is not enabled`,
          feature: requiredFeature,
          status: featureFlag?.status || 'NOT_FOUND',
          code: 'FEATURE_DISABLED',
        });
      }

      return true;
    } catch (error) {
      // If error is already ForbiddenException, rethrow it
      if (error instanceof ForbiddenException) {
        throw error;
      }

      // For database errors or other issues, fail closed (deny access)
      throw new ForbiddenException({
        message: `Unable to verify feature "${requiredFeature}"`,
        feature: requiredFeature,
        code: 'FEATURE_CHECK_FAILED',
        error: error.message,
      });
    }
  }
}
