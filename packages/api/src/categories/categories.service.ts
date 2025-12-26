import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from '@prisma/client';

/**
 * Service for managing service categories (ALI-118)
 * @class CategoriesService
 */
@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new category
   * @param {CreateCategoryDto} createCategoryDto - Category data
   * @returns {Promise<Category>} Created category
   * @throws {ConflictException} If category name already exists
   * @throws {InternalServerErrorException} On database errors
   */
  async create(
    createCategoryDto: CreateCategoryDto,
    userId?: string,
  ): Promise<Category> {
    try {
      // Check if category with this name already exists (excluding soft-deleted)
      const existing = await this.prisma.category.findFirst({
        where: { name: createCategoryDto.name, deletedAt: null },
      });

      if (existing) {
        throw new ConflictException(
          `Category with name "${createCategoryDto.name}" already exists`,
        );
      }

      // Create the category with audit logging
      return await this.prisma.category.create({
        data: {
          ...createCategoryDto,
          deletedAt: null, // Explicitly set to null for soft delete filtering
          createdBy: userId,
          updatedBy: userId,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create category',
        (error as Error).message,
      );
    }
  }

  /**
   * Find all categories (excluding soft-deleted)
   * @returns {Promise<Category[]>} List of all categories
   * @throws {InternalServerErrorException} On database errors
   */
  async findAll(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { services: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch categories',
        (error as Error).message,
      );
    }
  }

  /**
   * Find one category by ID (excluding soft-deleted)
   * @param {string} id - Category ID
   * @returns {Promise<Category>} Category with services
   * @throws {NotFoundException} If category not found
   * @throws {InternalServerErrorException} On database errors
   */
  async findOne(id: string): Promise<Category> {
    try {
      const category = await this.prisma.category.findFirst({
        where: { id, deletedAt: null },
        include: {
          services: {
            where: { deletedAt: null },
            select: {
              id: true,
              name: true,
              thumbnail: true,
              createdAt: true,
            },
            orderBy: { name: 'asc' },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID "${id}" not found`);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch category',
        (error as Error).message,
      );
    }
  }

  /**
   * Update a category
   * @param {string} id - Category ID
   * @param {UpdateCategoryDto} updateCategoryDto - Updated category data
   * @returns {Promise<Category>} Updated category
   * @throws {NotFoundException} If category not found
   * @throws {ConflictException} If new name already exists
   * @throws {InternalServerErrorException} On database errors
   */
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId?: string,
  ): Promise<Category> {
    try {
      // Verify category exists
      await this.findOne(id);

      // If name is being updated, check it's not taken (excluding soft-deleted)
      if (updateCategoryDto.name) {
        const existing = await this.prisma.category.findFirst({
          where: { name: updateCategoryDto.name, deletedAt: null },
        });

        if (existing && existing.id !== id) {
          throw new ConflictException(
            `Category with name "${updateCategoryDto.name}" already exists`,
          );
        }
      }

      // Update the category with audit logging
      return await this.prisma.category.update({
        where: { id },
        data: {
          ...updateCategoryDto,
          updatedBy: userId,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update category',
        (error as Error).message,
      );
    }
  }

  /**
   * Remove a category (soft delete)
   * @param {string} id - Category ID
   * @returns {Promise<Category>} Deleted category
   * @throws {NotFoundException} If category not found
   * @throws {ConflictException} If category has services
   * @throws {InternalServerErrorException} On database errors
   */
  async remove(id: string): Promise<Category> {
    try {
      // Verify category exists and get service count
      const category = await this.prisma.category.findUnique({
        where: { id, deletedAt: null },
        include: {
          services: {
            where: { deletedAt: null },
            select: {
              id: true,
              name: true,
              thumbnail: true,
              createdAt: true,
            },
            orderBy: { name: 'asc' },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID "${id}" not found`);
      }

      // Check if category has services
      if (category.services && category.services.length > 0) {
        throw new ConflictException(
          `Cannot delete category with ${category.services.length} service(s). Delete or reassign services first.`,
        );
      }

      // Soft delete the category
      return await this.prisma.category.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete category',
        (error as Error).message,
      );
    }
  }

  /**
   * Count total categories (excluding soft-deleted)
   * @returns {Promise<number>} Total category count
   * @throws {InternalServerErrorException} On database errors
   */
  async count(): Promise<number> {
    try {
      return await this.prisma.category.count({
        where: { deletedAt: null },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to count categories',
        (error as Error).message,
      );
    }
  }
}
