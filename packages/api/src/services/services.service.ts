import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { Service } from '@prisma/client';
import { validateRequestTemplate } from './validators/request-template.validator';

/**
 * Service for managing services with dynamic request templates (ALI-118)
 * @class ServicesService
 */
@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new service
   * @param {CreateServiceDto} createServiceDto - Service data
   * @returns {Promise<Service>} Created service
   * @throws {NotFoundException} If category not found
   * @throws {BadRequestException} If requestTemplate is invalid
   * @throws {InternalServerErrorException} On database errors
   */
  async create(createServiceDto: CreateServiceDto, userId?: string): Promise<Service> {
    try {
      // Validate category exists (excluding soft-deleted)
      const category = await this.prisma.category.findFirst({
        where: { id: createServiceDto.categoryId, deletedAt: null },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID "${createServiceDto.categoryId}" not found`,
        );
      }

      // Validate requestTemplate structure
      validateRequestTemplate(createServiceDto.requestTemplate);

      // Create the service with audit logging
      return await this.prisma.service.create({
        data: {
          ...createServiceDto,
          createdBy: userId,
          updatedBy: userId,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create service',
        (error as Error).message,
      );
    }
  }

  /**
   * Find all services (excluding soft-deleted, optionally filter by category)
   * @param {string} categoryId - Optional category ID filter
   * @returns {Promise<Service[]>} List of services
   * @throws {InternalServerErrorException} On database errors
   */
  async findAll(categoryId?: string): Promise<Service[]> {
    try {
      return await this.prisma.service.findMany({
        where: categoryId
          ? { categoryId, deletedAt: null }
          : { deletedAt: null },
        orderBy: { name: 'asc' },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch services',
        (error as Error).message,
      );
    }
  }

  /**
   * Find one service by ID (excluding soft-deleted)
   * @param {string} id - Service ID
   * @returns {Promise<Service>} Service with category
   * @throws {NotFoundException} If service not found
   * @throws {InternalServerErrorException} On database errors
   */
  async findOne(id: string): Promise<Service> {
    try {
      const service = await this.prisma.service.findFirst({
        where: { id, deletedAt: null },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!service) {
        throw new NotFoundException(`Service with ID "${id}" not found`);
      }

      return service;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch service',
        (error as Error).message,
      );
    }
  }

  /**
   * Update a service
   * @param {string} id - Service ID
   * @param {UpdateServiceDto} updateServiceDto - Updated service data
   * @returns {Promise<Service>} Updated service
   * @throws {NotFoundException} If service or new category not found
   * @throws {BadRequestException} If requestTemplate is invalid
   * @throws {InternalServerErrorException} On database errors
   */
  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    userId?: string,
  ): Promise<Service> {
    try {
      // Verify service exists
      await this.findOne(id);

      // If categoryId is being updated, verify it exists (excluding soft-deleted)
      if (updateServiceDto.categoryId) {
        const category = await this.prisma.category.findFirst({
          where: { id: updateServiceDto.categoryId, deletedAt: null },
        });

        if (!category) {
          throw new NotFoundException(
            `Category with ID "${updateServiceDto.categoryId}" not found`,
          );
        }
      }

      // If requestTemplate is being updated, validate it
      if (updateServiceDto.requestTemplate) {
        validateRequestTemplate(updateServiceDto.requestTemplate);
      }

      // Update the service with audit logging
      return await this.prisma.service.update({
        where: { id },
        data: {
          ...updateServiceDto,
          updatedBy: userId,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update service',
        (error as Error).message,
      );
    }
  }

  /**
   * Remove a service (soft delete)
   * @param {string} id - Service ID
   * @returns {Promise<Service>} Deleted service
   * @throws {NotFoundException} If service not found
   * @throws {InternalServerErrorException} On database errors
   */
  async remove(id: string): Promise<Service> {
    try {
      // Verify service exists
      await this.findOne(id);

      // Soft delete the service
      return await this.prisma.service.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete service',
        (error as Error).message,
      );
    }
  }

  /**
   * Count total services (excluding soft-deleted, optionally by category)
   * @param {string} categoryId - Optional category ID filter
   * @returns {Promise<number>} Total service count
   * @throws {InternalServerErrorException} On database errors
   */
  async count(categoryId?: string): Promise<number> {
    try {
      return await this.prisma.service.count({
        where: categoryId
          ? { categoryId, deletedAt: null }
          : { deletedAt: null },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to count services',
        (error as Error).message,
      );
    }
  }
}
