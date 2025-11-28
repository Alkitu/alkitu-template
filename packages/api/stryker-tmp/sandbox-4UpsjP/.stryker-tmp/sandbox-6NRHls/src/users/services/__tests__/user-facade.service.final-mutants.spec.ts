// @ts-nocheck
// 
// ✅ Final Mutant Tests for UserFacadeService - Targeting Remaining 8 Mutants
// packages/api/src/users/services/__tests__/user-facade.service.final-mutants.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserFacadeService } from '../user-facade.service';
import { UserRepositoryService } from '../user-repository.service';
import { UserAuthenticationService } from '../user-authentication.service';
import { UserAnalyticsService } from '../user-analytics.service.simple';
import { UserEventsService } from '../user-events.service';
import { NotificationService } from '../../../notification/notification.service';

describe('UserFacadeService - Final Mutant Tests', () => {
  let service: UserFacadeService;
  let userRepository: jest.Mocked<UserRepositoryService>;
  let userAuthentication: jest.Mocked<UserAuthenticationService>;
  let userAnalytics: jest.Mocked<UserAnalyticsService>;
  let userEvents: jest.Mocked<UserEventsService>;
  let notificationService: jest.Mocked<NotificationService>;
  let module: TestingModule;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findAllWithFilters: jest.fn(),
      update: jest.fn(),
      updateTags: jest.fn(),
      delete: jest.fn(),
      updatePassword: jest.fn(),
      markEmailAsVerified: jest.fn(),
      updateLastLogin: jest.fn(),
      exists: jest.fn(),
      existsByEmail: jest.fn(),
      count: jest.fn(),
      countByFilters: jest.fn(),
    };

    const mockUserAuthentication = {
      validateUser: jest.fn(),
      validatePassword: jest.fn(),
      changePassword: jest.fn(),
      hashPassword: jest.fn(),
      generatePasswordResetToken: jest.fn(),
      validatePasswordResetToken: jest.fn(),
      invalidateUserSessions: jest.fn(),
    };

    const mockUserAnalytics = {
      getUserStats: jest.fn(),
      getUserGrowthStats: jest.fn(),
      getUserActivityStats: jest.fn(),
      getUserDemographics: jest.fn(),
      getUserRetentionStats: jest.fn(),
      getUsersByRole: jest.fn(),
      getUsersByStatus: jest.fn(),
      getActiveUsersCount: jest.fn(),
      getInactiveUsersCount: jest.fn(),
      getLoginFrequencyStats: jest.fn(),
      getUserEngagementScore: jest.fn(),
      getTopActiveUsers: jest.fn(),
    };

    const mockUserEvents = {
      publishUserCreated: jest.fn(),
      publishUserUpdated: jest.fn(),
      publishUserDeleted: jest.fn(),
      publishUserPasswordChanged: jest.fn(),
      publishUserEmailVerified: jest.fn(),
      publishUserLoggedIn: jest.fn(),
      publishUserRoleChanged: jest.fn(),
      publishUserBulkOperation: jest.fn(),
    };

    const mockNotificationService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      sendNotification: jest.fn(),
      createNotification: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        UserFacadeService,
        { provide: UserRepositoryService, useValue: mockUserRepository },
        {
          provide: UserAuthenticationService,
          useValue: mockUserAuthentication,
        },
        { provide: UserAnalyticsService, useValue: mockUserAnalytics },
        { provide: UserEventsService, useValue: mockUserEvents },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<UserFacadeService>(UserFacadeService);
    userRepository = module.get<UserRepositoryService>(
      UserRepositoryService,
    ) as jest.Mocked<UserRepositoryService>;
    userAuthentication = module.get<UserAuthenticationService>(
      UserAuthenticationService,
    ) as jest.Mocked<UserAuthenticationService>;
    userAnalytics = module.get<UserAnalyticsService>(
      UserAnalyticsService,
    ) as jest.Mocked<UserAnalyticsService>;
    userEvents = module.get<UserEventsService>(
      UserEventsService,
    ) as jest.Mocked<UserEventsService>;
    notificationService = module.get<NotificationService>(
      NotificationService,
    ) as jest.Mocked<NotificationService>;

    jest.clearAllMocks();
  });

  afterEach(async () => {
    await module.close();
  });

  // Target Mutant 1: Error handling in create method catch block
  describe('create - Error Handling Mutants', () => {
    it('should test notification creation error handling with Error instance', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        lastName: 'User',
        contactNumber: '+1234567890',
        terms: true,
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };
      const fullUser = {
        ...createdUser,
        password: hashedPassword,
        emailVerified: null,
      };

      userAuthentication.hashPassword.mockResolvedValue(hashedPassword);
      userRepository.create.mockResolvedValue(createdUser);
      userRepository.findByEmail.mockResolvedValue(fullUser);
      userEvents.publishUserCreated.mockResolvedValue(undefined);

      // Mock notification service to throw Error instance
      const notificationError = new Error('Notification service unavailable');
      notificationService.createNotification.mockRejectedValue(
        notificationError,
      );

      // Spy on console.log to verify error handling
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Warning: Could not create welcome notification:',
        'Notification service unavailable',
      );

      consoleSpy.mockRestore();
    });

    it('should test notification creation error handling with non-Error object', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        lastName: 'User',
        contactNumber: '+1234567890',
        terms: true,
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };
      const fullUser = {
        ...createdUser,
        password: hashedPassword,
        emailVerified: null,
      };

      userAuthentication.hashPassword.mockResolvedValue(hashedPassword);
      userRepository.create.mockResolvedValue(createdUser);
      userRepository.findByEmail.mockResolvedValue(fullUser);
      userEvents.publishUserCreated.mockResolvedValue(undefined);

      // Mock notification service to throw non-Error object
      notificationService.createNotification.mockRejectedValue(
        'String error message',
      );

      // Spy on console.log to verify error handling
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Warning: Could not create welcome notification:',
        'Unknown error',
      );

      consoleSpy.mockRestore();
    });
  });

  // Target Mutant 2: Error handling in bulkDeleteUsers catch block
  describe('bulkDeleteUsers - Error Handling Mutants', () => {
    it('should test error handling in bulk delete loop', async () => {
      const bulkDeleteDto = {
        userIds: ['user1', 'user2'],
      };

      // Mock first user to exist and delete successfully
      const mockUser1 = {
        id: 'user1',
        email: 'user1@example.com',
        name: 'User 1',
        lastName: 'One',
        contactNumber: '+1111111111',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      // Mock second user to cause error during deletion
      userRepository.findById
        .mockResolvedValueOnce(mockUser1)
        .mockRejectedValueOnce(new Error('Database connection failed'));

      userRepository.delete.mockResolvedValue(undefined);
      userEvents.publishUserDeleted.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      // Spy on console.error to verify error handling
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.bulkDeleteUsers(bulkDeleteDto);

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(1); // Only one user deleted successfully
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to delete user user2:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  // Target Mutant 3 & 4: Empty object literals in bulkUpdateRole and bulkUpdateStatus
  describe('bulkUpdateRole - Empty Object Mutants', () => {
    it('should test role update with actual role value (not empty object)', async () => {
      const bulkUpdateRoleDto = {
        userIds: ['user1'],
        role: 'admin' as const,
      };

      const mockUser = {
        id: 'user1',
        email: 'user1@example.com',
        name: 'User 1',
        lastName: 'One',
        contactNumber: '+1111111111',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      const updatedUser = { ...mockUser, role: 'admin' as const };

      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue(updatedUser);
      userRepository.findByEmail.mockResolvedValue({
        ...updatedUser,
        password: 'hash',
        emailVerified: null,
      });
      userEvents.publishUserUpdated.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      await service.bulkUpdateRole(bulkUpdateRoleDto);

      // Verify that update was called with the actual role, not an empty object
      expect(userRepository.update).toHaveBeenCalledWith('user1', {
        role: 'admin',
      });
    });

    it('should test error handling in bulk role update loop', async () => {
      const bulkUpdateRoleDto = {
        userIds: ['user1', 'user2'],
        role: 'admin' as const,
      };

      const mockUser1 = {
        id: 'user1',
        email: 'user1@example.com',
        name: 'User 1',
        lastName: 'One',
        contactNumber: '+1111111111',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      userRepository.findById
        .mockResolvedValueOnce(mockUser1)
        .mockRejectedValueOnce(new Error('Update failed'));

      userRepository.update.mockResolvedValue({
        ...mockUser1,
        role: 'admin' as const,
      });
      userRepository.findByEmail.mockResolvedValue({
        ...mockUser1,
        role: 'admin' as const,
        password: 'hash',
        emailVerified: null,
      });
      userEvents.publishUserUpdated.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      // Spy on console.error to verify error handling
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.bulkUpdateRole(bulkUpdateRoleDto);

      expect(result.affectedCount).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to update role for user user2:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  // Target Mutant 5 & 6: Empty object literals in bulkUpdateStatus
  describe('bulkUpdateStatus - Empty Object Mutants', () => {
    it('should test status update with actual status value (not empty object)', async () => {
      const bulkUpdateStatusDto = {
        userIds: ['user1'],
        status: 'active' as const,
      };

      const mockUser = {
        id: 'user1',
        email: 'user1@example.com',
        name: 'User 1',
        lastName: 'One',
        contactNumber: '+1111111111',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      const updatedUser = { ...mockUser, status: 'active' };

      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue(updatedUser);
      userRepository.findByEmail.mockResolvedValue({
        ...updatedUser,
        password: 'hash',
        emailVerified: null,
      });
      userEvents.publishUserUpdated.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      await service.bulkUpdateStatus(bulkUpdateStatusDto);

      // Verify that update was called with the actual status, not an empty object
      expect(userRepository.update).toHaveBeenCalledWith('user1', {
        status: 'active',
      });
    });

    it('should test error handling in bulk status update loop', async () => {
      const bulkUpdateStatusDto = {
        userIds: ['user1', 'user2'],
        status: 'active' as const,
      };

      const mockUser1 = {
        id: 'user1',
        email: 'user1@example.com',
        name: 'User 1',
        lastName: 'One',
        contactNumber: '+1111111111',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      userRepository.findById
        .mockResolvedValueOnce(mockUser1)
        .mockRejectedValueOnce(new Error('Status update failed'));

      userRepository.update.mockResolvedValue({
        ...mockUser1,
        status: 'active',
      });
      userRepository.findByEmail.mockResolvedValue({
        ...mockUser1,
        status: 'active',
        password: 'hash',
        emailVerified: null,
      });
      userEvents.publishUserUpdated.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      // Spy on console.error to verify error handling
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.bulkUpdateStatus(bulkUpdateStatusDto);

      expect(result.affectedCount).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to update status for user user2:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  // Target Mutant 7 & 8: Error handling in resetUserPassword
  describe('resetUserPassword - Error Handling Mutants', () => {
    it('should test notification creation with actual parameters (not empty object)', async () => {
      const resetPasswordDto = {
        userId: 'user1',
        sendEmail: true,
      };

      const hashedPassword = 'hashedTempPassword';
      const tempPassword = expect.any(String);

      userAuthentication.hashPassword.mockResolvedValue(hashedPassword);
      userRepository.updatePassword.mockResolvedValue({
        id: 'user1',
        email: 'user1@example.com',
        name: 'User 1',
        lastName: 'One',
        contactNumber: '+1111111111',
        role: 'user',
        createdAt: new Date(),
        lastLogin: null,
        password: hashedPassword,
        emailVerified: null,
      });
      userEvents.publishUserPasswordChanged.mockResolvedValue(undefined);
      notificationService.createNotification.mockResolvedValue({});

      await service.resetUserPassword(resetPasswordDto);

      // Verify that createNotification was called with actual parameters, not empty object
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        userId: 'user1',
        message: expect.stringContaining(
          'Your password has been reset. Your temporary password is:',
        ),
        type: 'warning',
      });
    });

    it('should test error handling in resetUserPassword email sending', async () => {
      const resetPasswordDto = {
        userId: 'user1',
        sendEmail: true,
      };

      const hashedPassword = 'hashedTempPassword';

      userAuthentication.hashPassword.mockResolvedValue(hashedPassword);
      userRepository.updatePassword.mockResolvedValue({
        id: 'user1',
        email: 'user1@example.com',
        name: 'User 1',
        lastName: 'One',
        contactNumber: '+1111111111',
        role: 'user',
        createdAt: new Date(),
        lastLogin: null,
        password: hashedPassword,
        emailVerified: null,
      });
      userEvents.publishUserPasswordChanged.mockResolvedValue(undefined);

      // Mock notification service to fail
      notificationService.createNotification.mockRejectedValue(
        new Error('Email service down'),
      );

      // Spy on console.error to verify error handling
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.resetUserPassword(resetPasswordDto);

      expect(result.emailSent).toBe(false);
      expect(result.tempPassword).toBeDefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to send password reset email:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
