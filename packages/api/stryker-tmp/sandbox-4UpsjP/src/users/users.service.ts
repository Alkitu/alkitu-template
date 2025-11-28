// @ts-nocheck
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import {
  BulkDeleteUsersDto,
  BulkUpdateRoleDto,
  BulkUpdateStatusDto,
  ResetPasswordDto,
} from './dto/bulk-users.dto';
import * as bcrypt from 'bcryptjs';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/dto/create-notification.dto';
import { UserRole, UserStatus } from '@prisma/client';
import { UpdateUserTagsDto } from './dto/update-user-tags.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(createUserDto: CreateUserDto) {
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
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
      },
    });

    // Create a notification for the new user (optional, don't fail if it fails)
    try {
      await this.notificationService.createNotification({
        userId: user.id,
        message: `Welcome to Alkitu, ${user.name || user.email}!`,
        type: NotificationType.INFO,
        link: '/dashboard',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.log(
        'Warning: Could not create welcome notification:',
        errorMessage,
      );
      // Continue without failing the user creation
    }

    const result = user;

    return result;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        contactNumber: true,
        role: true,
        createdAt: true,
        lastLogin: true,
      },
    });
  }

  async findAllWithFilters(filterDto: FilterUsersDto) {
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

    // Build where clause using Prisma's UserWhereInput type
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

  async findOne(id: string) {
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
        lastLogin: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
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
      },
    });
  }

  async updateTags(id: string, updateUserTagsDto: UpdateUserTagsDto) {
    const { tagIds } = updateUserTagsDto;

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Validate that all tagIds exist
    const existingTags = await this.prisma.tag.findMany({
      where: { id: { in: tagIds } },
      select: { id: true },
    });

    if (existingTags.length !== tagIds.length) {
      throw new BadRequestException('One or more tag IDs are invalid');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        tagIds: { set: tagIds }, // Overwrite existing tags with the new set
      },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        contactNumber: true,
        role: true,
        createdAt: true,
        tags: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  async validateUser(loginDto: LoginUserDto) {
    const { email, password } = loginDto;

    const user = await this.findByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async updatePassword(id: string, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid current password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async markEmailAsVerified(id: string) {
    return this.prisma.user.update({
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
  }

  // Bulk Operations
  async bulkDeleteUsers(bulkDeleteDto: BulkDeleteUsersDto) {
    const { userIds } = bulkDeleteDto;

    // Validate that users exist
    const existingUsers = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    if (existingUsers.length !== userIds.length) {
      throw new BadRequestException('One or more users not found');
    }

    // Delete users
    const result = await this.prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });

    return {
      message: `Successfully deleted ${result.count} users`,
      deletedCount: result.count,
    };
  }

  async bulkUpdateRole(bulkUpdateRoleDto: BulkUpdateRoleDto) {
    const { userIds, role } = bulkUpdateRoleDto;

    // Validate that users exist
    const existingUsers = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    if (existingUsers.length !== userIds.length) {
      throw new BadRequestException('One or more users not found');
    }

    // Update user roles
    const result = await this.prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { role },
    });

    return {
      message: `Successfully updated role to ${role} for ${result.count} users`,
      updatedCount: result.count,
    };
  }

  async bulkUpdateStatus(bulkUpdateStatusDto: BulkUpdateStatusDto) {
    const { userIds, status } = bulkUpdateStatusDto;

    // Validate that users exist
    const existingUsers = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    if (existingUsers.length !== userIds.length) {
      throw new BadRequestException('One or more users not found');
    }

    // Update user status
    const result = await this.prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { status },
    });

    return {
      message: `Successfully updated status to ${status} for ${result.count} users`,
      updatedCount: result.count,
    };
  }

  async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
    const { userId, sendEmail = true } = resetPasswordDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update user password
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        // You might want to add a flag to force password change on next login
      },
    });

    if (sendEmail) {
      try {
        await this.notificationService.createNotification({
          userId,
          message: `Your password has been reset. Your temporary password is: ${tempPassword}`,
          type: NotificationType.INFO,
          link: '/auth/new-password',
        });
      } catch (error) {
        console.log(
          'Warning: Could not send password reset notification:',
          error,
        );
      }
    }

    return {
      message: 'Password reset successfully',
      tempPassword: sendEmail ? undefined : tempPassword, // Only return if email not sent
    };
  }

  async getUserStats() {
    const [total, byRole, recentUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    return {
      total,
      byRole: byRole.reduce(
        (acc, item) => {
          acc[item.role] = item._count.role;
          return acc;
        },
        {} as Record<string, number>,
      ),
      recentUsers,
    };
  }

  // Admin-specific methods
  async adminChangePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully by admin' };
  }

  async anonymizeUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Anonymize user data
    const anonymizedEmail = `anonymized_${userId}@deleted.local`;
    const result = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: 'Anonymous',
        lastName: 'User',
        email: anonymizedEmail,
        contactNumber: null,
        image: null,
        password: null,
        status: UserStatus.ANONYMIZED,
        // Keep role for audit purposes
        // groupIds and tagIds can be kept for analytics
      },
    });

    return {
      message: 'User data anonymized successfully',
      anonymizedUser: {
        id: result.id,
        email: result.email,
        status: result.status,
      },
    };
  }

  async sendMessageToUser(userId: string, message: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create a notification for the user
    await this.notificationService.createNotification({
      userId,
      message: `Message from admin: ${message}`,
      type: NotificationType.INFO,
    });

    return {
      message: 'Message sent successfully',
      recipient: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // Impersonation methods
  async createImpersonationToken(adminId: string, targetUserId: string) {
    // Verify admin permissions
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { id: true, role: true },
    });

    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can impersonate users');
    }

    // Verify target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, role: true },
    });

    if (!targetUser) {
      throw new NotFoundException(
        `Target user with ID ${targetUserId} not found`,
      );
    }

    // Prevent impersonating other admins
    if (targetUser.role === UserRole.ADMIN) {
      throw new BadRequestException('Cannot impersonate other admin users');
    }

    // Log the impersonation attempt
    console.log(`Admin ${adminId} is impersonating user ${targetUserId}`);

    // Return target user info for session creation
    return {
      targetUser: {
        id: targetUser.id,
        email: targetUser.email,
        role: targetUser.role,
      },
      impersonatedBy: adminId,
      impersonatedAt: new Date(),
    };
  }
}
