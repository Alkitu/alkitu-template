// @ts-nocheck
// 
// ✅ SRP COMPLIANT: Single Responsibility - User Data Persistence Only
// packages/api/src/users/services/user-repository.service.ts

import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { UpdateUserTagsDto } from '../dto/update-user-tags.dto';
import { User, UserRole } from '@prisma/client';
import {
  IUserRepository,
  UserResponse,
  UserResponseWithTags,
  EmailVerificationResponse,
  PaginatedUsersResponse,
} from '../interfaces/user-repository.interface';

@Injectable()
export class UserRepositoryService implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { email, password, ...userData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        `An account with email ${email} already exists. Please use a different email or try logging in.`,
      );
    }

    // Create user (password should be hashed by authentication service)
    const user = await this.prisma.user.create({
      data: {
        email,
        password, // Assumes password is already hashed
        ...userData,
      },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        contactNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });

    return user;
  }

  async findById(id: string): Promise<UserResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        contactNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(): Promise<UserResponse[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        contactNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });
  }

  async findAllWithFilters(
    filterDto: FilterUsersDto,
  ): Promise<PaginatedUsersResponse> {
    const {
      search,
      role,
      createdFrom,
      createdTo,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;

    // Build where clause
    const where: {
      OR?: Array<{
        email?: { contains: string; mode: 'insensitive' };
        name?: { contains: string; mode: 'insensitive' };
        lastName?: { contains: string; mode: 'insensitive' };
      }>;
      role?: UserRole;
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) {
        where.createdAt.gte = new Date(createdFrom);
      }
      if (createdTo) {
        where.createdAt.lte = new Date(createdTo);
      }
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await this.prisma.user.count({ where });

    // Get users with pagination and sorting
    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        contactNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      } as Record<string, 'asc' | 'desc'>,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        contactNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });

    return updatedUser;
  }

  async updateTags(
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _updateUserTagsDto: UpdateUserTagsDto,
  ): Promise<UserResponseWithTags> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Note: UserTag table doesn't exist in current schema
    // In production, implement user tags by adding UserTag model to schema
    // For now, we'll skip the tag operations
    // const { tagIds } = updateUserTagsDto; // Commented out since not used

    // Return user with tags (simplified since UserTag doesn't exist)
    const updatedUser = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        contactNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      ...updatedUser,
      tags: [], // Empty array since UserTag table doesn't exist
    };
  }

  async delete(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async markEmailAsVerified(id: string): Promise<EmailVerificationResponse> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { emailVerified: new Date() },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        name: true,
        lastName: true,
      },
    });

    return updatedUser;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }

  async exists(id: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    return !!user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async countByFilters(where: Record<string, any>): Promise<number> {
    return this.prisma.user.count({ where });
  }
}
