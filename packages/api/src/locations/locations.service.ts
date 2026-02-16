import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { WorkLocation, AccessLevel } from '@prisma/client';
import { UserRole } from '@alkitu/shared/enums/user-role.enum';
import { AccessControlService } from '../access-control/access-control.service';

/**
 * Locations Service (ALI-117)
 * Handles CRUD operations for user work locations
 */
@Injectable()
export class LocationsService {
  constructor(
    private prisma: PrismaService,
    private readonly accessControl: AccessControlService,
  ) {}

  /**
   * Create a new work location for a user
   * @param userId - The ID of the user creating the location
   * @param createLocationDto - The location data
   * @returns The created location
   */
  async create(
    userId: string,
    createLocationDto: CreateLocationDto,
  ): Promise<WorkLocation> {
    try {
      // Verify user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // If setting as default, unset others for this user
      if (createLocationDto.isDefault) {
        await this.prisma.workLocation.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      // Create the location
      const location = await this.prisma.workLocation.create({
        data: {
          ...createLocationDto,
          userId,
        },
      });

      return location;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create location: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get all locations for a specific user
   * @param userId - The ID of the user
   * @returns Array of locations
   */
  async findAllByUser(userId: string) {
    try {
      const locations = await this.prisma.workLocation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { requests: true } } },
      });

      return locations;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch locations: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get a specific location by ID
   * @param id - The location ID
   * @param userId - The ID of the user (for authorization)
   * @param userRole - The role of the user (optional, will be fetched if not provided)
   * @returns The location
   * @throws NotFoundException if location doesn't exist
   * @throws ForbiddenException if user doesn't own the location
   */
  async findOne(
    id: string,
    userId: string,
    userRole?: UserRole,
  ): Promise<WorkLocation> {
    try {
      const location = await this.prisma.workLocation.findUnique({
        where: { id },
      });

      if (!location) {
        throw new NotFoundException(`Location with ID ${id} not found`);
      }

      // Fetch user role if not provided (for backward compatibility)
      let role = userRole;
      if (!role) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
        role = user.role as UserRole;
      }

      // Centralized access control check (uses AccessControlService)
      await this.accessControl.checkAccess({
        userId,
        userRole: role as UserRole,
        resourceType: 'WORK_LOCATION',
        resourceId: id,
        requiredLevel: AccessLevel.READ,
      });

      // Legacy ownership verification (kept for defense in depth)
      if (location.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to access this location',
        );
      }

      return location;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch location: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Update a location
   * @param id - The location ID
   * @param userId - The ID of the user (for authorization)
   * @param updateLocationDto - The updated location data
   * @param userRole - The role of the user (optional, will be fetched if not provided)
   * @returns The updated location
   * @throws NotFoundException if location doesn't exist
   * @throws ForbiddenException if user doesn't own the location
   */
  async update(
    id: string,
    userId: string,
    updateLocationDto: UpdateLocationDto,
    userRole?: UserRole,
  ): Promise<WorkLocation> {
    try {
      // Resolve role if not provided
      let role = userRole;
      if (!role) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
        role = user.role as UserRole;
      }

      // EMPLOYEE cannot edit any client location
      if (role === UserRole.EMPLOYEE) {
        throw new ForbiddenException(
          'Employees cannot edit client locations',
        );
      }

      // CLIENT can only edit locations with zero associated requests
      if (role === UserRole.CLIENT) {
        const requestCount = await this.prisma.request.count({
          where: { locationId: id },
        });
        if (requestCount > 0) {
          throw new ForbiddenException(
            'This location cannot be edited because it has associated service requests',
          );
        }
      }

      // ADMIN: no restriction on editing

      // Verify location exists and user owns it (includes access control check)
      const existingLocation = await this.findOne(id, userId, role);

      // If setting as default, unset others for this user
      if (updateLocationDto.isDefault) {
        await this.prisma.workLocation.updateMany({
          where: { userId, isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
      }

      // Update the location
      const updatedLocation = await this.prisma.workLocation.update({
        where: { id: existingLocation.id },
        data: updateLocationDto,
      });

      return updatedLocation;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update location: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Delete a location
   * @param id - The location ID
   * @param userId - The ID of the user (for authorization)
   * @param userRole - The role of the user (optional, will be fetched if not provided)
   * @returns The deleted location
   * @throws NotFoundException if location doesn't exist
   * @throws ForbiddenException if user doesn't own the location
   */
  async remove(
    id: string,
    userId: string,
    userRole?: UserRole,
  ): Promise<WorkLocation> {
    try {
      // Resolve role if not provided
      let role = userRole;
      if (!role) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
        role = user.role as UserRole;
      }

      // EMPLOYEE cannot delete any client location
      if (role === UserRole.EMPLOYEE) {
        throw new ForbiddenException(
          'Employees cannot delete client locations',
        );
      }

      // CLIENT and ADMIN cannot delete locations with associated requests
      const requestCount = await this.prisma.request.count({
        where: { locationId: id },
      });
      if (requestCount > 0) {
        throw new ForbiddenException(
          'This location cannot be deleted because it has associated service requests',
        );
      }

      // Verify location exists and user owns it (includes access control check)
      const existingLocation = await this.findOne(id, userId, role);

      // Delete the location
      const deletedLocation = await this.prisma.workLocation.delete({
        where: { id: existingLocation.id },
      });

      return deletedLocation;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete location: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get location count for a user
   * @param userId - The ID of the user
   * @returns The count of locations
   */
  async count(userId: string): Promise<number> {
    try {
      const count = await this.prisma.workLocation.count({
        where: { userId },
      });

      return count;
    } catch (error) {
      throw new BadRequestException(
        `Failed to count locations: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
