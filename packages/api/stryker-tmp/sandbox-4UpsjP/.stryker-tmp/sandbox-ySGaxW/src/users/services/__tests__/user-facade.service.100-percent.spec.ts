// @ts-nocheck
// 
// ✅ 100% MUTATION COVERAGE: Specific tests to kill remaining 9 surviving mutants
// packages/api/src/users/services/__tests__/user-facade.service.100-percent.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserFacadeService } from '../user-facade.service';
import { UserRepositoryService } from '../user-repository.service';
import { UserAuthenticationService } from '../user-authentication.service';
import { UserAnalyticsService } from '../user-analytics.service.simple';
import { UserEventsService } from '../user-events.service';
import { NotificationService } from '../../../notification/notification.service';
import { EmailService } from '../../../email/email.service';
import {
  createMockUser,
  createMockUserResponse,
} from '../../test-utils/user-factory';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { ResetPasswordDto } from '../../dto/bulk-users.dto';
import { UserRole, UserStatus } from '@alkitu/shared';

describe('UserFacadeService - 100% Mutation Coverage', () => {
  let service: UserFacadeService;
  let userRepositoryService: jest.Mocked<UserRepositoryService>;
  let userAuthService: jest.Mocked<UserAuthenticationService>;
  let userAnalyticsService: jest.Mocked<UserAnalyticsService>;
  let userEventsService: jest.Mocked<UserEventsService>;
  let notificationService: jest.Mocked<NotificationService>;
  let emailService: jest.Mocked<EmailService>;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findAll: jest.fn(),
      updateTags: jest.fn(),
      updatePassword: jest.fn(),
      markEmailAsVerified: jest.fn(),
      adminChangePassword: jest.fn(),
      anonymizeUser: jest.fn(),
      bulkDeleteUsers: jest.fn(),
      bulkUpdateRole: jest.fn(),
      bulkUpdateStatus: jest.fn(),
      filterUsers: jest.fn(),
    };

    const mockUserAuth = {
      validateUser: jest.fn(),
      changePassword: jest.fn(),
      resetUserPassword: jest.fn(),
      createImpersonationToken: jest.fn(),
    };

    const mockUserAnalytics = {
      getUserStats: jest.fn(),
    };

    const mockUserEvents = {
      sendMessageToUser: jest.fn(),
    };

    const mockNotificationService = {
      sendWelcomeNotification: jest.fn(),
    };

    const mockEmailService = {
      sendPasswordResetEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFacadeService,
        { provide: UserRepositoryService, useValue: mockUserRepository },
        { provide: UserAuthenticationService, useValue: mockUserAuth },
        { provide: UserAnalyticsService, useValue: mockUserAnalytics },
        { provide: UserEventsService, useValue: mockUserEvents },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<UserFacadeService>(UserFacadeService);
    userRepositoryService = module.get(UserRepositoryService);
    userAuthService = module.get(UserAuthenticationService);
    userAnalyticsService = module.get(UserAnalyticsService);
    userEventsService = module.get(UserEventsService);
    notificationService = module.get(NotificationService);
    emailService = module.get(EmailService);
  });

  describe('Surviving Mutant #1: Catch Block in Create Method (Line 74)', () => {
    it('should execute catch block when notification service throws error', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        terms: true,
      };
      const mockUser = createMockUser();
      const mockUserResponse = createMockUserResponse();

      userRepositoryService.create.mockResolvedValue(mockUser);
      // Force notification service to throw error to trigger catch block
      notificationService.sendWelcomeNotification.mockRejectedValue(
        new Error('Notification service error'),
      );

      // Spy on console.log to verify catch block execution
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(result).toEqual(mockUserResponse);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Warning: Could not create welcome notification:',
        'Notification service error',
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Surviving Mutant #2: If (!user) Block in Update Method (Line 141)', () => {
    it('should throw error when user is not found in update method', async () => {
      // Arrange
      const userId = 'non-existent-user-id';
      const updateUserDto: UpdateUserDto = { firstName: 'Updated' };

      userRepositoryService.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        'User not found',
      );
      expect(userRepositoryService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('Surviving Mutant #3: Catch Block in BulkDeleteUsers (Line 285)', () => {
    it('should execute catch block when individual delete fails', async () => {
      // Arrange
      const userIds = ['user1', 'user2'];

      // Mock first delete to succeed, second to fail
      userRepositoryService.remove
        .mockResolvedValueOnce({ success: true, message: 'User deleted' })
        .mockRejectedValueOnce(new Error('Delete failed'));

      // Spy on console.error to verify catch block execution
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await service.bulkDeleteUsers(userIds);

      // Assert
      expect(result.success).toBe(false);
      expect(result.affectedCount).toBe(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to delete user user2:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Surviving Mutant #4: Object Literal { role } in BulkUpdateRole (Line 309)', () => {
    it('should verify role object literal in bulkUpdateRole', async () => {
      // Arrange
      const userIds = ['user1'];
      const role = UserRole.USER;

      userRepositoryService.update.mockResolvedValue(createMockUser());

      // Act
      await service.bulkUpdateRole(userIds, role);

      // Assert - Verify that update is called with { role } object literal
      expect(userRepositoryService.update).toHaveBeenCalledWith('user1', {
        role,
      });
    });
  });

  describe('Surviving Mutant #5: Catch Block in BulkUpdateRole (Line 311)', () => {
    it('should execute catch block when role update fails', async () => {
      // Arrange
      const userIds = ['user1'];
      const role = UserRole.USER;

      userRepositoryService.update.mockRejectedValue(
        new Error('Update failed'),
      );

      // Spy on console.error to verify catch block execution
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await service.bulkUpdateRole(userIds, role);

      // Assert
      expect(result.success).toBe(false);
      expect(result.affectedCount).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to update role for user user1:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Surviving Mutant #6: Object Literal { status } in BulkUpdateStatus (Line 340)', () => {
    it('should verify status object literal in bulkUpdateStatus', async () => {
      // Arrange
      const userIds = ['user1'];
      const status = UserStatus.ACTIVE;

      userRepositoryService.update.mockResolvedValue(createMockUser());

      // Act
      await service.bulkUpdateStatus(userIds, status);

      // Assert - Verify that update is called with { status } object literal
      expect(userRepositoryService.update).toHaveBeenCalledWith('user1', {
        status,
      });
    });
  });

  describe('Surviving Mutant #7: Catch Block in BulkUpdateStatus (Line 342)', () => {
    it('should execute catch block when status update fails', async () => {
      // Arrange
      const userIds = ['user1'];
      const status = UserStatus.ACTIVE;

      userRepositoryService.update.mockRejectedValue(
        new Error('Status update failed'),
      );

      // Spy on console.error to verify catch block execution
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await service.bulkUpdateStatus(userIds, status);

      // Assert
      expect(result.success).toBe(false);
      expect(result.affectedCount).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to update status for user user1:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Surviving Mutant #8: Boolean Literal sendEmail = true vs false (Line 366)', () => {
    it('should test default sendEmail = true behavior', async () => {
      // Arrange
      const resetPasswordDto: ResetPasswordDto = {
        userId: 'user1',
        // sendEmail not specified, should default to true
      };

      userRepositoryService.findOne.mockResolvedValue(createMockUser());
      userAuthService.resetUserPassword.mockResolvedValue('temp-password');
      emailService.sendPasswordResetEmail.mockResolvedValue(true);

      // Act
      const result = await service.resetUserPassword(resetPasswordDto);

      // Assert - Verify that email is sent when sendEmail defaults to true
      expect(result.emailSent).toBe(true);
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('should test explicit sendEmail = false behavior', async () => {
      // Arrange
      const resetPasswordDto: ResetPasswordDto = {
        userId: 'user1',
        sendEmail: false, // Explicitly set to false
      };

      userRepositoryService.findOne.mockResolvedValue(createMockUser());
      userAuthService.resetUserPassword.mockResolvedValue('temp-password');

      // Act
      const result = await service.resetUserPassword(resetPasswordDto);

      // Assert - Verify that email is NOT sent when sendEmail is false
      expect(result.emailSent).toBe(false);
      expect(result.tempPassword).toBe('temp-password');
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });

  describe('Surviving Mutant #9: Catch Block in ResetUserPassword (Line 388)', () => {
    it('should execute catch block when email send fails', async () => {
      // Arrange
      const resetPasswordDto: ResetPasswordDto = {
        userId: 'user1',
        sendEmail: true,
      };

      userRepositoryService.findOne.mockResolvedValue(createMockUser());
      userAuthService.resetUserPassword.mockResolvedValue('temp-password');
      // Force email service to throw error to trigger catch block
      emailService.sendPasswordResetEmail.mockRejectedValue(
        new Error('Email send failed'),
      );

      // Spy on console.error to verify catch block execution
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await service.resetUserPassword(resetPasswordDto);

      // Assert
      expect(result.emailSent).toBe(false);
      expect(result.tempPassword).toBe('temp-password');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to send password reset email:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });
});
