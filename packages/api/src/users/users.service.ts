import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import {
  BulkDeleteUsersDto,
  BulkUpdateRoleDto,
  BulkUpdateStatusDto,
  AdminResetPasswordDto,
} from './dto/bulk-users.dto';
import * as bcrypt from 'bcryptjs';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/dto/create-notification.dto';
import { UserRole, UserStatus } from '@prisma/client';
import { UpdateUserTagsDto } from './dto/update-user-tags.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private emailService: EmailService,
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

    // Create user (ALI-115: profileComplete defaults to false)
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profileComplete: false, // ALI-115: Users complete profile during onboarding
        ...userData,
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phone: true,
        company: true,
        address: true,
        contactPerson: true,
        profileComplete: true,
        role: true,
        createdAt: true,
        emailVerified: true,
      },
    });

    // Create a notification for the new user (optional, don't fail if it fails)
    try {
      await this.notificationService.createNotification({
        userId: user.id,
        message: `Welcome to Alkitu, ${user.firstname || user.email}!`,
        type: NotificationType.INFO,
        link: '/dashboard',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(
        `Warning: Could not create welcome notification: ${errorMessage}`,
      );
      // Continue without failing the user creation
    }

    const result = user;

    return result;
  }

  /**
   * Find all users (ALI-115: updated field names)
   */
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phone: true,
        company: true,
        address: true,
        contactPerson: true,
        profileComplete: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true,
        emailVerified: true,
      },
    });
  }

  /**
   * Find users with filters (ALI-115: updated field names)
   */
  async findAllWithFilters(filterDto: FilterUsersDto) {
    const {
      search,
      role,
      teamOnly,
      createdFrom,
      createdTo,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;

    // Build where clause using Prisma's UserWhereInput type (ALI-115: updated field names)
    const where: {
      OR?: Array<{
        email?: { contains: string; mode: 'insensitive' };
        firstname?: { contains: string; mode: 'insensitive' };
        lastname?: { contains: string; mode: 'insensitive' };
      }>;
      role?: UserRole | { in: UserRole[] };
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstname: { contains: search, mode: 'insensitive' } },
        { lastname: { contains: search, mode: 'insensitive' } },
      ];
    }

    // ALI-122: Handle teamOnly filter (ADMIN + EMPLOYEE)
    if (teamOnly) {
      where.role = { in: [UserRole.ADMIN, UserRole.EMPLOYEE] };
    } else if (role) {
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
        firstname: true,
        lastname: true,
        phone: true,
        company: true,
        address: true,
        contactPerson: true,
        profileComplete: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true,
        emailVerified: true,
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

  /**
   * Find one user by ID (ALI-115: updated field names)
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phone: true,
        company: true,
        address: true,
        contactPerson: true,
        profileComplete: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true,
        emailVerified: true,
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

  /**
   * Update user (ALI-115: updated field names)
   */
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
        firstname: true,
        lastname: true,
        phone: true,
        company: true,
        address: true,
        contactPerson: true,
        profileComplete: true,
        role: true,
        status: true,
        createdAt: true,
        emailVerified: true,
      },
    });
  }

  /**
   * Update user profile (ALI-116)
   * User self-service profile update with role-based field filtering
   *
   * @param id - User ID (from JWT token)
   * @param updateProfileDto - Profile data to update
   * @returns Updated user data
   */
  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Build update data based on user role
    const updateData: Record<string, any> = {};

    // Basic fields (all roles can update)
    if (updateProfileDto.firstname !== undefined) {
      updateData.firstname = updateProfileDto.firstname;
    }
    if (updateProfileDto.lastname !== undefined) {
      updateData.lastname = updateProfileDto.lastname;
    }
    if (updateProfileDto.phone !== undefined) {
      updateData.phone = updateProfileDto.phone;
    }
    if (updateProfileDto.company !== undefined) {
      updateData.company = updateProfileDto.company;
    }
    if (updateProfileDto.role !== undefined) {
      updateData.role = updateProfileDto.role;
    }

    // Only CLIENT can update address and contactPerson
    if (user.role === UserRole.CLIENT) {
      if (updateProfileDto.address !== undefined) {
        updateData.address = updateProfileDto.address;
      }
      if (updateProfileDto.contactPerson !== undefined) {
        updateData.contactPerson = updateProfileDto.contactPerson;
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        phone: true,
        company: true,
        address: true,
        contactPerson: true,
        profileComplete: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
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
        firstname: true,
        lastname: true,
        phone: true,
        profileComplete: true,
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

  /**
   * Mark email as verified (ALI-115: updated field names)
   */
  async markEmailAsVerified(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { emailVerified: new Date() },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        firstname: true,
        lastname: true,
        profileComplete: true,
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

  async resetUserPassword(resetPasswordDto: AdminResetPasswordDto) {
    const { userId, sendEmail = true } = resetPasswordDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstname: true, lastname: true },
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
        const userName = `${user.firstname} ${user.lastname}`.trim() || user.email;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        
        // 1. Send Email
        await this.emailService.sendNotification(
          user.email,
          userName,
          'Password Reset By Admin',
          `Your password has been reset by an administrator. Your new temporary password is: <strong>${tempPassword}</strong><br>Please log in and change your password immediately.`,
          'Login Now',
          `${frontendUrl}/login`,
        );

        // 2. Create In-App Notification
        await this.notificationService.createNotification({
          userId,
          message: `Your password has been reset. Your temporary password is: ${tempPassword}`,
          type: NotificationType.INFO,
          link: '/auth/new-password',
        });
      } catch (error) {
        this.logger.warn(
          `Warning: Could not send password reset notification: ${error}`,
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

    // Anonymize user data (ALI-115: updated field names)
    const anonymizedEmail = `anonymized_${userId}@deleted.local`;
    const result = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstname: 'Anonymous',
        lastname: 'User',
        email: anonymizedEmail,
        phone: null,
        company: null,
        address: null,
        contactPerson: null,
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

  /**
   * Send message to user (ALI-115: updated field names)
   */
  async sendMessageToUser(userId: string, message: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstname: true, lastname: true },
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
        firstname: user.firstname,
        lastname: user.lastname,
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
    this.logger.log(`Admin ${adminId} is impersonating user ${targetUserId}`);

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
