import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { WorkLocation } from '@prisma/client';

/**
 * Locations Service (ALI-117)
 * Handles CRUD operations for user work locations
 */
@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

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
  async findAllByUser(userId: string): Promise<WorkLocation[]> {
    try {
      const locations = await this.prisma.workLocation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
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
   * @returns The location
   * @throws NotFoundException if location doesn't exist
   * @throws ForbiddenException if user doesn't own the location
   */
  async findOne(id: string, userId: string): Promise<WorkLocation> {
    try {
      const location = await this.prisma.workLocation.findUnique({
        where: { id },
      });

      if (!location) {
        throw new NotFoundException(`Location with ID ${id} not found`);
      }

      // Verify ownership
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
   * @returns The updated location
   * @throws NotFoundException if location doesn't exist
   * @throws ForbiddenException if user doesn't own the location
   */
  async update(
    id: string,
    userId: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<WorkLocation> {
    try {
      // Verify location exists and user owns it
      const existingLocation = await this.findOne(id, userId);

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
   * @returns The deleted location
   * @throws NotFoundException if location doesn't exist
   * @throws ForbiddenException if user doesn't own the location
   */
  async remove(id: string, userId: string): Promise<WorkLocation> {
    try {
      // Verify location exists and user owns it
      const existingLocation = await this.findOne(id, userId);

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
