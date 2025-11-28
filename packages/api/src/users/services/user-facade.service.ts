// ✅ SOLID COMPLIANT: Facade Pattern - Maintains backward compatibility
// packages/api/src/users/services/user-facade.service.ts

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { UpdateUserTagsDto } from '../dto/update-user-tags.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import {
  BulkDeleteUsersDto,
  BulkUpdateRoleDto,
  BulkUpdateStatusDto,
  AdminResetPasswordDto,
} from '../dto/bulk-users.dto';

import { UserRepositoryService } from './user-repository.service';
import { UserAuthenticationService } from './user-authentication.service';
import { UserAnalyticsService } from './user-analytics.service';
import { UserEventsService } from './user-events.service';
import { NotificationService } from '../../notification/notification.service';
import { NotificationType } from '../../notification/dto/create-notification.dto';

/**
 * ✅ SOLID COMPLIANT: Facade Pattern Implementation
 *
 * This service maintains backward compatibility with the original UserService
 * while delegating responsibilities to specialized SRP-compliant services.
 *
 * Benefits:
 * - Maintains existing API contracts
 * - Enables gradual migration to SOLID architecture
 * - Provides single entry point for user operations
 * - Coordinates between specialized services
 */
@Injectable()
export class UserFacadeService {
  constructor(
    private userRepository: UserRepositoryService,
    private userAuthentication: UserAuthenticationService,
    private userAnalytics: UserAnalyticsService,
    private userEvents: UserEventsService,
    private notificationService: NotificationService,
  ) {}

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    // Hash password using authentication service
    const hashedPassword = await this.userAuthentication.hashPassword(password);

    // Create user using repository service
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Get full user data for events
    const fullUser = await this.userRepository.findByEmail(user.email);
    if (fullUser) {
      // Publish user created event
      await this.userEvents.publishUserCreated(fullUser);
    }

    // Create welcome notification (optional, don't fail if it fails)
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
      console.log(
        'Warning: Could not create welcome notification:',
        errorMessage,
      );
    }

    return user;
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAll() {
    return this.userRepository.findAll();
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAllWithFilters(filterDto: FilterUsersDto) {
    return this.userRepository.findAllWithFilters(filterDto);
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findOne(id: string) {
    return this.userRepository.findById(id);
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Get previous data for events
    const previousUser = await this.userRepository.findById(id);

    // Check if user exists
    if (!previousUser) {
      throw new Error('User not found');
    }

    // Update user
    const updatedUser = await this.userRepository.update(id, updateUserDto);

    // Get full user data for events
    const fullUser = await this.userRepository.findByEmail(updatedUser.email);
    if (fullUser && previousUser) {
      // Publish user updated event - convert UserResponse to User for events
      await this.userEvents.publishUserUpdated(fullUser, {
        id: previousUser.id,
        email: previousUser.email,
        firstname: previousUser.firstname,
        lastname: previousUser.lastname,
        phone: previousUser.phone,
      });
    }

    return updatedUser;
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async updateTags(id: string, updateUserTagsDto: UpdateUserTagsDto) {
    return this.userRepository.updateTags(id, updateUserTagsDto);
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async remove(id: string) {
    // Get user data before deletion for events
    const user = await this.userRepository.findById(id);

    // Check if user exists
    if (!user) {
      throw new Error('User not found');
    }

    // Delete user
    await this.userRepository.delete(id);

    // Publish user deleted event
    await this.userEvents.publishUserDeleted(id, {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
    });

    // Return success message for backward compatibility
    return { message: 'User deleted successfully' };
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async validateUser(loginDto: LoginUserDto) {
    const authenticatedUser =
      await this.userAuthentication.validateUser(loginDto);

    if (authenticatedUser) {
      // Publish login event
      await this.userEvents.publishUserLoggedIn(authenticatedUser.id);
    }

    return authenticatedUser;
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async updatePassword(id: string, hashedPassword: string) {
    return this.userRepository.updatePassword(id, hashedPassword);
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    await this.userAuthentication.changePassword(id, changePasswordDto);

    // Publish password changed event
    await this.userEvents.publishUserPasswordChanged(id);

    return { message: 'Password changed successfully' };
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async markEmailAsVerified(id: string) {
    const result = await this.userRepository.markEmailAsVerified(id);

    // Publish email verified event
    await this.userEvents.publishUserEmailVerified(id);

    return result;
  }

  // ✅ SRP: Delegates to UserAnalyticsService
  async getUserStats() {
    return this.userAnalytics.getUserStats();
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async adminChangePassword(userId: string, newPassword: string) {
    const hashedPassword =
      await this.userAuthentication.hashPassword(newPassword);
    await this.userRepository.updatePassword(userId, hashedPassword);

    // Publish password changed event
    await this.userEvents.publishUserPasswordChanged(userId);
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async anonymizeUser(userId: string) {
    const anonymizedData = {
      firstname: 'Anonymous',
      lastname: 'User',
      email: `anonymous_${userId}@example.com`,
      phone: undefined, // Use undefined instead of null for UpdateUserDto
    };

    const user = await this.userRepository.update(userId, anonymizedData);

    // Publish user updated event
    const fullUser = await this.userRepository.findByEmail(user.email);
    if (fullUser) {
      await this.userEvents.publishUserUpdated(fullUser, { id: userId });
    }

    return {
      success: true,
      userId,
      anonymizedFields: Object.keys(anonymizedData),
      retainedFields: ['id', 'role', 'createdAt'],
      timestamp: new Date(),
    };
  }

  // ✅ SRP: Delegates to NotificationService
  async sendMessageToUser(userId: string, message: string) {
    try {
      await this.notificationService.createNotification({
        userId,
        message,
        type: NotificationType.INFO,
      });
      return { success: true, message: 'Message sent successfully' };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        message: `Failed to send message: ${errorMessage}`,
      };
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async createImpersonationToken(adminId: string, targetUserId: string) {
    // Simplified implementation - in production, use proper JWT
    const token =
      await this.userAuthentication.generatePasswordResetToken(targetUserId);

    return {
      token,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
      targetUserId,
      adminId,
      restrictions: ['read-only', 'no-admin-actions'],
    };
  }

  // Bulk operations - these would be implemented by separate bulk services
  // For now, we'll provide simplified implementations

  async bulkDeleteUsers(bulkDeleteDto: BulkDeleteUsersDto) {
    const { userIds } = bulkDeleteDto;
    let deletedCount = 0;

    for (const userId of userIds) {
      try {
        await this.remove(userId);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete user ${userId}:`, error);
      }
    }

    // Publish bulk operation event
    await this.userEvents.publishUserBulkOperation('bulk_delete', userIds, {
      requestedCount: userIds.length,
      successCount: deletedCount,
    });

    return {
      success: true,
      message: `Successfully deleted ${deletedCount} out of ${userIds.length} users`,
      affectedCount: deletedCount,
    };
  }

  async bulkUpdateRole(bulkUpdateRoleDto: BulkUpdateRoleDto) {
    const { userIds, role } = bulkUpdateRoleDto;
    let updatedCount = 0;

    for (const userId of userIds) {
      try {
        await this.update(userId, { role });
        updatedCount++;
      } catch (error) {
        console.error(`Failed to update role for user ${userId}:`, error);
      }
    }

    // Publish bulk operation event
    await this.userEvents.publishUserBulkOperation(
      'bulk_update_role',
      userIds,
      {
        newRole: role,
        requestedCount: userIds.length,
        successCount: updatedCount,
      },
    );

    return {
      success: true,
      message: `Successfully updated role for ${updatedCount} out of ${userIds.length} users`,
      affectedCount: updatedCount,
    };
  }

  async bulkUpdateStatus(bulkUpdateStatusDto: BulkUpdateStatusDto) {
    const { userIds, status } = bulkUpdateStatusDto;
    let updatedCount = 0;

    for (const userId of userIds) {
      try {
        await this.update(userId, { status });
        updatedCount++;
      } catch (error) {
        console.error(`Failed to update status for user ${userId}:`, error);
      }
    }

    // Publish bulk operation event
    await this.userEvents.publishUserBulkOperation(
      'bulk_update_status',
      userIds,
      {
        newStatus: status,
        requestedCount: userIds.length,
        successCount: updatedCount,
      },
    );

    return {
      success: true,
      message: `Successfully updated status for ${updatedCount} out of ${userIds.length} users`,
      affectedCount: updatedCount,
    };
  }

  async resetUserPassword(resetPasswordDto: AdminResetPasswordDto) {
    const { userId, sendEmail = true } = resetPasswordDto;

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);

    // Hash and update password
    const hashedPassword =
      await this.userAuthentication.hashPassword(tempPassword);
    await this.userRepository.updatePassword(userId, hashedPassword);

    // Publish password changed event
    await this.userEvents.publishUserPasswordChanged(userId);

    let emailSent = false;
    if (sendEmail) {
      try {
        await this.notificationService.createNotification({
          userId,
          message: `Your password has been reset. Your temporary password is: ${tempPassword}`,
          type: NotificationType.WARNING,
        });
        emailSent = true;
      } catch (error) {
        console.error('Failed to send password reset email:', error);
      }
    }

    return {
      success: true,
      message: emailSent
        ? 'Password reset email sent'
        : 'Password reset completed',
      tempPassword: emailSent ? undefined : tempPassword,
      emailSent,
    };
  }
}
