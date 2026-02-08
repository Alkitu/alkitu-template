/**
 * NestJS Service Template
 *
 * Production-ready NestJS service following Alkitu Template patterns and SOLID principles.
 * Includes CRUD operations, pagination, transactions, and error handling.
 *
 * Usage:
 * 1. Copy this template to packages/api/src/your-module/your-module.service.ts
 * 2. Update the resource name and implement business logic
 * 3. Register service in module providers
 * 4. Inject into controllers or other services
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ResourceStatus } from '@prisma/client';

// Import DTOs
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { FilterResourcesDto } from './dto/filter-resources.dto';

// ============================================================================
// Service Definition
// ============================================================================

@Injectable()
export class ResourcesService {
  constructor(
    private prisma: PrismaService,
    // Inject other services if needed
    // private notificationService: NotificationService,
    // private emailService: EmailService,
  ) {}

  // ==========================================================================
  // CREATE
  // ==========================================================================

  /**
   * Create a new resource
   *
   * @param createResourceDto - Data for creating resource
   * @param userId - ID of user creating the resource
   * @returns Created resource
   * @throws {ConflictException} If resource with same name already exists
   */
  async create(createResourceDto: CreateResourceDto, userId: string) {
    // Check for duplicates
    const existingResource = await this.prisma.resource.findFirst({
      where: { name: createResourceDto.name },
    });

    if (existingResource) {
      throw new ConflictException(
        `Resource with name "${createResourceDto.name}" already exists`
      );
    }

    // Create resource
    const resource = await this.prisma.resource.create({
      data: {
        ...createResourceDto,
        userId,
        status: ResourceStatus.ACTIVE,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    // Send notification (non-critical)
    // try {
    //   await this.notificationService.sendCreatedNotification(resource);
    // } catch (error) {
    //   console.warn('Failed to send notification:', error);
    // }

    return resource;
  }

  // ==========================================================================
  // READ - LIST WITH PAGINATION
  // ==========================================================================

  /**
   * Get all resources with pagination and filtering
   *
   * @param filterDto - Pagination and filter options
   * @returns Paginated list of resources
   */
  async findAll(filterDto: FilterResourcesDto) {
    const {
      page = 1,
      limit = 20,
      status,
      userId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;

    // Build where clause
    const where: Prisma.ResourceWhereInput = {
      deletedAt: null, // Exclude soft-deleted
    };

    // Apply filters
    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute queries in parallel for performance
    const [items, total] = await Promise.all([
      this.prisma.resource.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstname: true,
              lastname: true,
            },
          },
          // Include other relations as needed
          // category: true,
          // assignees: true,
        },
      }),
      this.prisma.resource.count({ where }),
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
  }

  // ==========================================================================
  // READ - SINGLE RESOURCE
  // ==========================================================================

  /**
   * Get a single resource by ID
   *
   * @param id - Resource ID
   * @returns Resource
   * @throws {NotFoundException} If resource not found
   */
  async findOne(id: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        // Include other relations as needed
      },
    });

    if (!resource || resource.deletedAt) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return resource;
  }

  /**
   * Get resource by ID without throwing if not found
   *
   * @param id - Resource ID
   * @returns Resource or null
   */
  async findOneOrNull(id: string) {
    return this.prisma.resource.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  // ==========================================================================
  // UPDATE
  // ==========================================================================

  /**
   * Update a resource
   *
   * @param id - Resource ID
   * @param updateResourceDto - Update data
   * @param currentUser - User performing the update
   * @returns Updated resource
   * @throws {NotFoundException} If resource not found
   * @throws {ForbiddenException} If user doesn't have permission
   */
  async update(
    id: string,
    updateResourceDto: UpdateResourceDto,
    currentUser: { id: string; role: string },
  ) {
    // Verify resource exists
    const existingResource = await this.findOne(id);

    // Check permissions (unless admin)
    if (
      existingResource.userId !== currentUser.id &&
      currentUser.role !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this resource'
      );
    }

    // Check for name conflicts if name is being updated
    if (
      updateResourceDto.name &&
      updateResourceDto.name !== existingResource.name
    ) {
      const nameConflict = await this.prisma.resource.findFirst({
        where: {
          name: updateResourceDto.name,
          id: { not: id },
        },
      });

      if (nameConflict) {
        throw new ConflictException(
          `Resource with name "${updateResourceDto.name}" already exists`
        );
      }
    }

    // Update resource
    return this.prisma.resource.update({
      where: { id },
      data: updateResourceDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });
  }

  /**
   * Replace a resource (full update)
   *
   * @param id - Resource ID
   * @param createResourceDto - New resource data
   * @param currentUser - User performing the replacement
   * @returns Replaced resource
   */
  async replace(
    id: string,
    createResourceDto: CreateResourceDto,
    currentUser: { id: string; role: string },
  ) {
    // Verify resource exists and check permissions
    const existingResource = await this.findOne(id);

    if (
      existingResource.userId !== currentUser.id &&
      currentUser.role !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'You do not have permission to replace this resource'
      );
    }

    // Replace resource
    return this.prisma.resource.update({
      where: { id },
      data: {
        ...createResourceDto,
        userId: existingResource.userId, // Keep original owner
        updatedAt: new Date(),
      },
      include: {
        user: true,
      },
    });
  }

  // ==========================================================================
  // DELETE
  // ==========================================================================

  /**
   * Soft delete a resource
   *
   * @param id - Resource ID
   * @param userId - ID of user deleting the resource
   * @throws {NotFoundException} If resource not found
   */
  async remove(id: string, userId: string) {
    // Verify resource exists
    await this.findOne(id);

    // Soft delete
    await this.prisma.resource.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }

  /**
   * Hard delete a resource (permanent)
   * Use with caution - only for admin operations
   *
   * @param id - Resource ID
   */
  async hardDelete(id: string) {
    await this.prisma.resource.delete({
      where: { id },
    });
  }

  // ==========================================================================
  // CUSTOM ACTIONS
  // ==========================================================================

  /**
   * Archive a resource
   *
   * @param id - Resource ID
   * @param reason - Reason for archiving
   * @param userId - ID of user archiving the resource
   * @returns Archived resource
   * @throws {NotFoundException} If resource not found
   * @throws {BadRequestException} If resource already archived
   */
  async archive(id: string, reason: string | undefined, userId: string) {
    const resource = await this.findOne(id);

    if (resource.status === ResourceStatus.ARCHIVED) {
      throw new BadRequestException('Resource is already archived');
    }

    return this.prisma.resource.update({
      where: { id },
      data: {
        status: ResourceStatus.ARCHIVED,
        archivedAt: new Date(),
        archivedBy: userId,
        archiveReason: reason,
      },
    });
  }

  /**
   * Restore an archived resource
   *
   * @param id - Resource ID
   * @param userId - ID of user restoring the resource
   * @returns Restored resource
   * @throws {NotFoundException} If resource not found
   * @throws {BadRequestException} If resource is not archived
   */
  async restore(id: string, userId: string) {
    const resource = await this.findOne(id);

    if (resource.status !== ResourceStatus.ARCHIVED) {
      throw new BadRequestException('Resource is not archived');
    }

    return this.prisma.resource.update({
      where: { id },
      data: {
        status: ResourceStatus.ACTIVE,
        archivedAt: null,
        archivedBy: null,
        archiveReason: null,
        restoredAt: new Date(),
        restoredBy: userId,
      },
    });
  }

  /**
   * Assign resource to users
   *
   * @param id - Resource ID
   * @param assignedToIds - Array of user IDs to assign
   * @param notify - Whether to send notification
   * @param userId - ID of user performing assignment
   * @returns Updated resource
   */
  async assign(
    id: string,
    assignedToIds: string[],
    notify: boolean,
    userId: string,
  ) {
    // Use transaction to ensure atomic updates
    return this.prisma.$transaction(async (tx) => {
      // Verify resource exists
      const resource = await tx.resource.findUnique({ where: { id } });

      if (!resource) {
        throw new NotFoundException(`Resource with ID ${id} not found`);
      }

      // Verify all users exist
      const users = await tx.user.findMany({
        where: { id: { in: assignedToIds } },
      });

      if (users.length !== assignedToIds.length) {
        throw new BadRequestException('One or more user IDs are invalid');
      }

      // Update resource assignments
      const updatedResource = await tx.resource.update({
        where: { id },
        data: {
          assignees: {
            set: assignedToIds.map((userId) => ({ id: userId })),
          },
          lastAssignedAt: new Date(),
          lastAssignedBy: userId,
        },
        include: {
          assignees: {
            select: {
              id: true,
              email: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      });

      // Send notifications (non-transactional)
      if (notify) {
        // Note: Don't await to avoid blocking transaction
        // this.sendAssignmentNotifications(updatedResource, assignedToIds)
        //   .catch(err => console.warn('Failed to send notifications:', err));
      }

      return updatedResource;
    });
  }

  // ==========================================================================
  // STATISTICS / ANALYTICS
  // ==========================================================================

  /**
   * Get resource statistics
   *
   * @returns Resource statistics
   */
  async getStats() {
    const [total, byStatus, byCategory] = await Promise.all([
      // Total count
      this.prisma.resource.count({
        where: { deletedAt: null },
      }),

      // Count by status
      this.prisma.resource.groupBy({
        by: ['status'],
        where: { deletedAt: null },
        _count: true,
      }),

      // Count by category (if applicable)
      // this.prisma.resource.groupBy({
      //   by: ['categoryId'],
      //   where: { deletedAt: null },
      //   _count: true,
      // }),
    ]);

    // Format status counts
    const statusCounts = byStatus.reduce((acc, { status, _count }) => {
      acc[status] = _count;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active: statusCounts[ResourceStatus.ACTIVE] || 0,
      archived: statusCounts[ResourceStatus.ARCHIVED] || 0,
      draft: statusCounts[ResourceStatus.DRAFT] || 0,
      // byCategory,
    };
  }

  /**
   * Get count of resources owned by a user
   *
   * @param userId - User ID
   * @returns Resource counts by status
   */
  async getUserResourceCount(userId: string) {
    const byStatus = await this.prisma.resource.groupBy({
      by: ['status'],
      where: {
        userId,
        deletedAt: null,
      },
      _count: true,
    });

    const statusCounts = byStatus.reduce((acc, { status, _count }) => {
      acc[status] = _count;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: Object.values(statusCounts).reduce((sum, count) => sum + count, 0),
      active: statusCounts[ResourceStatus.ACTIVE] || 0,
      archived: statusCounts[ResourceStatus.ARCHIVED] || 0,
      draft: statusCounts[ResourceStatus.DRAFT] || 0,
    };
  }

  // ==========================================================================
  // BULK OPERATIONS
  // ==========================================================================

  /**
   * Bulk delete resources
   *
   * @param ids - Array of resource IDs
   * @param userId - ID of user performing deletion
   * @returns Results of bulk deletion
   */
  async bulkDelete(ids: string[], userId: string) {
    // Use transaction for atomic operation
    return this.prisma.$transaction(async (tx) => {
      const results = {
        deleted: 0,
        failed: 0,
        errors: [] as string[],
      };

      for (const id of ids) {
        try {
          await tx.resource.update({
            where: { id },
            data: {
              deletedAt: new Date(),
              deletedBy: userId,
            },
          });
          results.deleted++;
        } catch (error) {
          results.failed++;
          results.errors.push(`Failed to delete resource ${id}`);
        }
      }

      return results;
    });
  }

  /**
   * Bulk update resource status
   *
   * @param ids - Array of resource IDs
   * @param status - New status
   * @param userId - ID of user performing update
   * @returns Results of bulk update
   */
  async bulkUpdateStatus(ids: string[], status: string, userId: string) {
    const updated = await this.prisma.resource.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data: {
        status: status as ResourceStatus,
        updatedAt: new Date(),
      },
    });

    return {
      updated: updated.count,
      failed: ids.length - updated.count,
    };
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Check if resource exists
   *
   * @param id - Resource ID
   * @returns True if resource exists
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.resource.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }

  /**
   * Check if user has access to resource
   *
   * @param resourceId - Resource ID
   * @param userId - User ID
   * @param userRole - User role
   * @returns True if user has access
   */
  async hasAccess(
    resourceId: string,
    userId: string,
    userRole: string,
  ): Promise<boolean> {
    // Admins have access to everything
    if (userRole === 'ADMIN') {
      return true;
    }

    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
      select: { userId: true },
    });

    // User owns the resource
    return resource?.userId === userId;
  }
}

// ============================================================================
// Module Registration
// ============================================================================

/**
 * Register service in module:
 *
 * import { Module } from '@nestjs/common';
 * import { ResourcesService } from './resources.service';
 * import { ResourcesController } from './resources.controller';
 * import { PrismaModule } from '../prisma/prisma.module';
 *
 * @Module({
 *   imports: [PrismaModule],
 *   controllers: [ResourcesController],
 *   providers: [ResourcesService],
 *   exports: [ResourcesService], // Export if used by other modules
 * })
 * export class ResourcesModule {}
 */
