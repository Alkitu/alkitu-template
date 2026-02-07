import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AccessLevel } from '@prisma/client';
import { UserRole } from '@alkitu/shared/enums/user-role.enum';
import { hasRole } from '@alkitu/shared/rbac/role-hierarchy';

/**
 * Check Access Parameters
 */
export interface CheckAccessParams {
  userId: string;
  userRole: UserRole;
  resourceType: string; // 'REQUEST', 'CONVERSATION', 'USER', etc.
  resourceId: string;
  requiredLevel: AccessLevel;
}

/**
 * Access Control Service
 *
 * Provides row-level security and resource ownership checks.
 * Ensures users can only access resources they own or have explicit permission to access.
 *
 * @example
 * ```typescript
 * // Check if user can access a request
 * await accessControlService.checkAccess({
 *   userId: ctx.user.id,
 *   userRole: ctx.user.role,
 *   resourceType: 'REQUEST',
 *   resourceId: requestId,
 *   requiredLevel: AccessLevel.READ,
 * });
 * ```
 */
@Injectable()
export class AccessControlService {
  constructor(private prisma: PrismaService) {}

  /**
   * Check if user has access to a resource
   *
   * @throws {ForbiddenException} if user doesn't have access
   */
  async checkAccess(params: CheckAccessParams): Promise<void> {
    const { userId, userRole, resourceType, resourceId, requiredLevel } = params;

    // ADMIN has access to everything
    if (hasRole(userRole, [UserRole.ADMIN])) {
      return;
    }

    // Check resource-specific ownership
    const hasAccess = await this.checkResourceOwnership(
      userId,
      userRole,
      resourceType,
      resourceId,
      requiredLevel,
    );

    if (!hasAccess) {
      throw new ForbiddenException({
        message: `Access denied to ${resourceType}`,
        resourceType,
        resourceId,
        requiredLevel,
        code: 'ACCESS_DENIED',
      });
    }
  }

  /**
   * Check resource ownership or explicit access rules
   *
   * @returns true if user has access, false otherwise
   */
  private async checkResourceOwnership(
    userId: string,
    userRole: UserRole,
    resourceType: string,
    resourceId: string,
    requiredLevel: AccessLevel,
  ): Promise<boolean> {
    try {
      // Check for explicit access rules first
      const hasExplicitAccess = await this.checkExplicitAccess(
        userId,
        userRole,
        resourceId,
        requiredLevel,
      );

      if (hasExplicitAccess) {
        return true;
      }

      // Check resource-specific ownership based on type
      switch (resourceType.toUpperCase()) {
        case 'REQUEST':
          return await this.checkRequestAccess(userId, userRole, resourceId);

        case 'CONVERSATION':
          return await this.checkConversationAccess(userId, userRole, resourceId);

        case 'USER':
          return await this.checkUserAccess(userId, userRole, resourceId, requiredLevel);

        case 'WORK_LOCATION':
          return await this.checkWorkLocationAccess(userId, resourceId);

        default:
          // Unknown resource type, deny by default (fail closed)
          return false;
      }
    } catch (error) {
      // On error, fail closed (deny access)
      console.error('[ACCESS CONTROL] Error checking access:', error);
      return false;
    }
  }

  /**
   * Check for explicit access rules in AccessControl/AccessRule tables
   */
  private async checkExplicitAccess(
    userId: string,
    userRole: UserRole,
    resourceId: string,
    requiredLevel: AccessLevel,
  ): Promise<boolean> {
    // Find resource in Resource table
    const resource = await this.prisma.resource.findFirst({
      where: { id: resourceId },
      include: {
        accessControls: {
          where: { isActive: true },
          include: { accessRules: true },
        },
      },
    });

    if (!resource || resource.accessControls.length === 0) {
      return false;
    }

    // Check access rules
    for (const accessControl of resource.accessControls) {
      for (const rule of accessControl.accessRules) {
        // Check if rule matches user or role
        const matchesUser = rule.subjectType === 'USER' && rule.subjectValue === userId;
        const matchesRole = rule.subjectType === 'ROLE' && rule.subjectValue === userRole;

        if (matchesUser || matchesRole) {
          // Check if access level is sufficient
          if (this.isAccessLevelSufficient(rule.accessLevel, requiredLevel)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Check if granted access level is sufficient for required level
   * Hierarchy: ADMIN > WRITE > READ
   */
  private isAccessLevelSufficient(
    granted: AccessLevel,
    required: AccessLevel,
  ): boolean {
    const levels = {
      [AccessLevel.READ]: 1,
      [AccessLevel.WRITE]: 2,
      [AccessLevel.ADMIN]: 3,
    };

    return levels[granted] >= levels[required];
  }

  /**
   * Check if user has access to a Request
   * - User is the creator
   * - User is assigned to the request (for EMPLOYEE/ADMIN)
   * - User is EMPLOYEE or ADMIN (can see all requests)
   */
  private async checkRequestAccess(
    userId: string,
    userRole: UserRole,
    requestId: string,
  ): Promise<boolean> {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      select: { userId: true, assignedToId: true },
    });

    if (!request) {
      return false;
    }

    // User is the creator
    if (request.userId === userId) {
      return true;
    }

    // User is assigned to the request
    if (request.assignedToId === userId) {
      return true;
    }

    // EMPLOYEE can see all requests
    if (hasRole(userRole, [UserRole.EMPLOYEE])) {
      return true;
    }

    return false;
  }

  /**
   * Check if user has access to a Conversation
   * - User is the owner (via ContactInfo)
   * - User is assigned to the conversation
   * - User is EMPLOYEE or ADMIN
   */
  private async checkConversationAccess(
    userId: string,
    userRole: UserRole,
    conversationId: string,
  ): Promise<boolean> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        assignedToId: true,
        contactInfo: {
          select: { userId: true },
        },
      },
    });

    if (!conversation) {
      return false;
    }

    // User is the owner
    if (conversation.contactInfo?.userId === userId) {
      return true;
    }

    // User is assigned
    if (conversation.assignedToId === userId) {
      return true;
    }

    // EMPLOYEE can see all conversations
    if (hasRole(userRole, [UserRole.EMPLOYEE])) {
      return true;
    }

    return false;
  }

  /**
   * Check if user has access to another User's data
   * - User is accessing their own data (always allowed)
   * - User is ADMIN (can access any user)
   * - For WRITE/ADMIN: Only ADMIN can modify other users
   */
  private async checkUserAccess(
    userId: string,
    userRole: UserRole,
    targetUserId: string,
    requiredLevel: AccessLevel,
  ): Promise<boolean> {
    // User can always access their own data
    if (userId === targetUserId) {
      return true;
    }

    // Only ADMIN can access other users' data
    if (hasRole(userRole, [UserRole.ADMIN])) {
      return true;
    }

    // EMPLOYEE can READ other users (for assignment, etc.)
    if (requiredLevel === AccessLevel.READ && hasRole(userRole, [UserRole.EMPLOYEE])) {
      return true;
    }

    return false;
  }

  /**
   * Check if user has access to a WorkLocation
   * - User is the owner
   */
  private async checkWorkLocationAccess(
    userId: string,
    locationId: string,
  ): Promise<boolean> {
    const location = await this.prisma.workLocation.findUnique({
      where: { id: locationId },
      select: { userId: true },
    });

    if (!location) {
      return false;
    }

    return location.userId === userId;
  }

  /**
   * Create a resource with access control
   */
  async createResource(data: {
    name: string;
    description?: string;
    resourceType: string;
    ownerId: string;
  }) {
    return this.prisma.resource.create({
      data: {
        name: data.name,
        description: data.description,
        resourceType: data.resourceType as any,
        userIds: [data.ownerId],
        users: {
          connect: { id: data.ownerId },
        },
      },
    });
  }

  /**
   * Grant access to a user or role
   */
  async grantAccess(params: {
    resourceId: string;
    subjectType: 'USER' | 'ROLE';
    subjectValue: string;
    accessLevel: AccessLevel;
    grantedBy: string;
  }) {
    // Create or get AccessControl for resource
    let accessControl = await this.prisma.accessControl.findFirst({
      where: { resourceId: params.resourceId },
    });

    if (!accessControl) {
      accessControl = await this.prisma.accessControl.create({
        data: {
          resourceId: params.resourceId,
          name: 'Default Access Control',
          isActive: true,
        },
      });
    }

    // Create access rule
    return this.prisma.accessRule.create({
      data: {
        accessControlId: accessControl.id,
        subjectType: params.subjectType,
        subjectValue: params.subjectValue,
        accessLevel: params.accessLevel,
      },
    });
  }

  /**
   * Revoke access from a user or role
   */
  async revokeAccess(params: {
    resourceId: string;
    subjectType: 'USER' | 'ROLE';
    subjectValue: string;
  }) {
    const accessControl = await this.prisma.accessControl.findFirst({
      where: { resourceId: params.resourceId },
    });

    if (!accessControl) {
      return;
    }

    await this.prisma.accessRule.deleteMany({
      where: {
        accessControlId: accessControl.id,
        subjectType: params.subjectType,
        subjectValue: params.subjectValue,
      },
    });
  }
}
