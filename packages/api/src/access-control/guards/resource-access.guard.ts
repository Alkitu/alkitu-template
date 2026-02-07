import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControlService } from '../access-control.service';
import { AccessLevel } from '@prisma/client';

/**
 * Metadata key for resource access requirements
 */
export const REQUIRE_RESOURCE_ACCESS = 'requireResourceAccess';

/**
 * Resource Access Metadata Interface
 */
export interface ResourceAccessMetadata {
  resourceType: string;
  accessLevel: AccessLevel;
  resourceIdParam?: string; // Name of the param containing resource ID (default: 'id')
  resourceIdBody?: string; // Name of the body field containing resource ID
}

/**
 * Decorator to mark endpoints that require resource access
 *
 * @param metadata - Resource access requirements
 *
 * @example
 * ```typescript
 * @Get(':id')
 * @UseGuards(JwtAuthGuard, RolesGuard, ResourceAccessGuard)
 * @RequireResourceAccess({
 *   resourceType: 'REQUEST',
 *   accessLevel: AccessLevel.READ,
 * })
 * async findOne(@Param('id') id: string) {
 *   return this.requestsService.findOne(id);
 * }
 * ```
 */
export const RequireResourceAccess = (metadata: ResourceAccessMetadata) =>
  SetMetadata(REQUIRE_RESOURCE_ACCESS, metadata);

/**
 * Resource Access Guard for NestJS
 *
 * Protects endpoints by checking resource ownership and access permissions.
 * Uses AccessControlService to verify if user has access to the resource.
 *
 * @usage
 * ```typescript
 * @Controller('requests')
 * @UseGuards(JwtAuthGuard, RolesGuard, ResourceAccessGuard)
 * export class RequestsController {
 *   @Get(':id')
 *   @RequireResourceAccess({
 *     resourceType: 'REQUEST',
 *     accessLevel: AccessLevel.READ,
 *   })
 *   findOne(@Param('id') id: string) { ... }
 *
 *   @Patch(':id')
 *   @RequireResourceAccess({
 *     resourceType: 'REQUEST',
 *     accessLevel: AccessLevel.WRITE,
 *   })
 *   update(@Param('id') id: string, @Body() dto: UpdateDto) { ... }
 * }
 * ```
 *
 * @security
 * - Always use AFTER JwtAuthGuard (requires authenticated user)
 * - Use AFTER RolesGuard if role checks are also needed
 * - Fail closed: denies access if resource not found or error occurs
 */
@Injectable()
export class ResourceAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControl: AccessControlService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required resource access from @RequireResourceAccess() decorator
    const metadata = this.reflector.getAllAndOverride<ResourceAccessMetadata>(
      REQUIRE_RESOURCE_ACCESS,
      [context.getHandler(), context.getClass()],
    );

    // If no resource access required, allow
    if (!metadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // User must be authenticated (should be caught by JwtAuthGuard)
    if (!user || !user.id || !user.role) {
      throw new ForbiddenException({
        message: 'Authentication required for resource access',
        code: 'AUTH_REQUIRED',
      });
    }

    // Get resource ID from request params or body
    let resourceId: string | undefined;

    if (metadata.resourceIdParam) {
      resourceId = request.params[metadata.resourceIdParam];
    } else if (metadata.resourceIdBody) {
      resourceId = request.body[metadata.resourceIdBody];
    } else {
      // Default to 'id' param
      resourceId = request.params.id || request.params.resourceId;
    }

    if (!resourceId) {
      throw new ForbiddenException({
        message: 'Resource ID not provided',
        code: 'RESOURCE_ID_MISSING',
        metadata: {
          expectedParam: metadata.resourceIdParam || 'id',
          expectedBody: metadata.resourceIdBody,
        },
      });
    }

    try {
      // Check access using AccessControlService
      await this.accessControl.checkAccess({
        userId: user.id,
        userRole: user.role,
        resourceType: metadata.resourceType,
        resourceId,
        requiredLevel: metadata.accessLevel,
      });

      return true;
    } catch (error) {
      // If already ForbiddenException, rethrow it
      if (error instanceof ForbiddenException) {
        throw error;
      }

      // For other errors, fail closed (deny access)
      throw new ForbiddenException({
        message: `Access denied to ${metadata.resourceType}`,
        code: 'ACCESS_DENIED',
        resourceType: metadata.resourceType,
        resourceId,
        requiredLevel: metadata.accessLevel,
      });
    }
  }
}
