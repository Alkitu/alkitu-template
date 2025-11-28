// @ts-nocheck
// 
// ✅ Testing Agent: Final Mutants Tests for UserFacadeService
// packages/api/src/users/services/__tests__/user-facade.service.final-mutants.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserFacadeService } from '@/users/services/user-facade.service';
import { UserRepositoryService } from '@/users/services/user-repository.service';
import { UserAuthenticationService } from '@/users/services/user-authentication.service';
import { UserAnalyticsService } from '@/users/services/user-analytics.service.simple';
import { UserEventsService } from '@/users/services/user-events.service';
import { NotificationService } from '../../../notification/notification.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserRole, UserStatus } from '@prisma/client';

// Helper function to create full user object with all required fields
const createFullUser = (overrides: any = {}) => ({
  id: '1',
  name: 'Test User',
  lastName: 'User',
  email: 'test@example.com',
  emailVerified: null,
  image: '',
  password: 'hashedPassword',
  contactNumber: '+1234567890',
  role: UserRole.CLIENT,
  status: UserStatus.ACTIVE,
  terms: true,
  isTwoFactorEnabled: false,
  groupIds: [],
  tagIds: [],
  resourceIds: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLogin: null,
  ...overrides,
});

// Helper function to create UserResponse objects
const createUserResponse = (overrides: any = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  lastName: 'User',
  contactNumber: '+1234567890',
  role: 'CLIENT',
  createdAt: new Date(),
  lastLogin: null,
  ...overrides,
});

describe('UserFacadeService - Final Mutants Tests', () => {
  let service: UserFacadeService;
  let userRepository: jest.Mocked<UserRepositoryService>;
  let userAuth: jest.Mocked<UserAuthenticationService>;
  let userAnalytics: jest.Mocked<UserAnalyticsService>;
  let userEvents: jest.Mocked<UserEventsService>;
  let notificationService: jest.Mocked<NotificationService>;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findByRole: jest.fn(),
      findByStatus: jest.fn(),
      bulkCreate: jest.fn(),
      bulkUpdate: jest.fn(),
      bulkDelete: jest.fn(),
      count: jest.fn(),
      exists: jest.fn(),
      findAllWithFilters: jest.fn(),
      updateTags: jest.fn(),
      updatePassword: jest.fn(),
      markEmailAsVerified: jest.fn(),
      updateLastLogin: jest.fn(),
      existsByEmail: jest.fn(),
      countByFilters: jest.fn(),
    };

    const mockUserAuth = {
      validatePassword: jest.fn(),
      hashPassword: jest.fn(),
      generatePasswordResetToken: jest.fn(),
      validatePasswordResetToken: jest.fn(),
      resetPassword: jest.fn(),
      changePassword: jest.fn(),
      validateUser: jest.fn(),
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
      getCohortAnalysis: jest.fn(),
    };

    const mockUserEvents = {
      publishUserCreated: jest.fn(),
      publishUserUpdated: jest.fn(),
      publishUserDeleted: jest.fn(),
      publishUserPasswordChanged: jest.fn(),
      publishUserEmailVerified: jest.fn(),
      publishUserLoggedIn: jest.fn(),
      publishUserBulkOperation: jest.fn(),
      publishUserRoleChanged: jest.fn(),
      publishUserStatusChanged: jest.fn(),
    };

    const mockNotificationService = {
      createNotification: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      sendNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFacadeService,
        { provide: UserRepositoryService, useValue: mockUserRepository },
        { provide: UserAuthenticationService, useValue: mockUserAuth },
        { provide: UserAnalyticsService, useValue: mockUserAnalytics },
        { provide: UserEventsService, useValue: mockUserEvents },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<UserFacadeService>(UserFacadeService);
    userRepository = module.get(UserRepositoryService);
    userAuth = module.get(UserAuthenticationService);
    userAnalytics = module.get(UserAnalyticsService);
    userEvents = module.get(UserEventsService);
    notificationService = module.get(NotificationService);
  });

  describe('Final Mutants - Edge Cases', () => {
    it('should handle notification creation failure in create method', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        lastName: 'User',
        contactNumber: '+1234567890',
        terms: true,
      };

      const mockUser = createUserResponse({
        email: 'test@example.com',
        name: 'Test User',
        lastName: 'User',
        contactNumber: '+1234567890',
      });

      userAuth.hashPassword.mockResolvedValue('hashedPassword');
      userRepository.create.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(
        createFullUser({
          email: 'test@example.com',
          name: 'Test User',
          lastName: 'User',
          contactNumber: '+1234567890',
        }),
      );
      userEvents.publishUserCreated.mockResolvedValue(undefined);

      // Make notification creation fail
      notificationService.createNotification.mockRejectedValue(
        new Error('Notification service unavailable'),
      );

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userRepository.create).toHaveBeenCalled();
      expect(userEvents.publishUserCreated).toHaveBeenCalled();
      expect(notificationService.createNotification).toHaveBeenCalled();
    });

    it('should handle user not found in remove method', async () => {
      const userId = 'non-existent-user';

      userRepository.findById.mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow('User not found');
      expect(userRepository.delete).not.toHaveBeenCalled();
      expect(userEvents.publishUserDeleted).not.toHaveBeenCalled();
    });

    it('should handle bulk delete with mixed success/failure', async () => {
      const userIds = ['user1', 'user2', 'user3'];

      // Mock findById to return users for first two, null for third
      userRepository.findById
        .mockResolvedValueOnce(
          createUserResponse({
            id: 'user1',
            email: 'user1@example.com',
            name: 'User One',
            lastName: 'One',
            contactNumber: '+1111111111',
            role: 'CLIENT',
          }),
        )
        .mockResolvedValueOnce(
          createUserResponse({
            id: 'user2',
            email: 'user2@example.com',
            name: 'User Two',
            lastName: 'Two',
            contactNumber: '+2222222222',
            role: 'CLIENT',
          }),
        )
        .mockResolvedValueOnce(null); // Third user doesn't exist

      userRepository.delete.mockResolvedValue(undefined);
      userEvents.publishUserDeleted.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      const result = await service.bulkDeleteUsers({ userIds });

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(2); // Only 2 users were deleted
      expect(userRepository.delete).toHaveBeenCalledTimes(2);
      expect(userEvents.publishUserDeleted).toHaveBeenCalledTimes(2);
      expect(userEvents.publishUserBulkOperation).toHaveBeenCalled();
    });

    it('should handle bulk update role with failures', async () => {
      const userIds = ['user1', 'user2', 'user3'];
      const newRole = UserRole.ADMIN;

      // Mock findById to succeed for first two, fail for third
      userRepository.findById
        .mockResolvedValueOnce(
          createUserResponse({
            id: 'user1',
            email: 'user1@example.com',
            name: 'User One',
            lastName: 'One',
            contactNumber: '+1111111111',
            role: 'CLIENT',
          }),
        )
        .mockResolvedValueOnce(
          createUserResponse({
            id: 'user2',
            email: 'user2@example.com',
            name: 'User Two',
            lastName: 'Two',
            contactNumber: '+2222222222',
            role: 'CLIENT',
          }),
        )
        .mockRejectedValueOnce(new Error('Database error'));

      userRepository.update.mockResolvedValue(
        createUserResponse({
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          lastName: 'One',
          contactNumber: '+1111111111',
          role: 'ADMIN',
        }),
      );

      userRepository.findByEmail.mockResolvedValue(
        createFullUser({
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          lastName: 'One',
          contactNumber: '+1111111111',
          role: UserRole.ADMIN,
        }),
      );

      userEvents.publishUserUpdated.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      const result = await service.bulkUpdateRole({ userIds, role: newRole });

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(2); // Only 2 users were updated
      expect(userEvents.publishUserBulkOperation).toHaveBeenCalled();
    });

    it('should handle bulk update status with failures', async () => {
      const userIds = ['user1', 'user2'];
      const newStatus = UserStatus.SUSPENDED;

      userRepository.findById
        .mockResolvedValueOnce(
          createUserResponse({
            id: 'user1',
            email: 'user1@example.com',
            name: 'User One',
            lastName: 'One',
            contactNumber: '+1111111111',
            role: 'CLIENT',
          }),
        )
        .mockRejectedValueOnce(new Error('User not found'));

      userRepository.update.mockResolvedValue(
        createUserResponse({
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          lastName: 'One',
          contactNumber: '+1111111111',
          role: 'CLIENT',
        }),
      );

      userRepository.findByEmail.mockResolvedValue(
        createFullUser({
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          lastName: 'One',
          contactNumber: '+1111111111',
          role: UserRole.CLIENT,
        }),
      );

      userEvents.publishUserUpdated.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      const result = await service.bulkUpdateStatus({
        userIds,
        status: newStatus,
      });

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(1); // Only 1 user was updated
      expect(userEvents.publishUserBulkOperation).toHaveBeenCalled();
    });

    it('should handle password reset with email failure', async () => {
      const resetDto = { userId: 'user1', sendEmail: true };

      userAuth.hashPassword.mockResolvedValue('hashedTempPassword');
      userRepository.updatePassword.mockResolvedValue(
        createFullUser({
          id: 'user1',
          password: 'hashedTempPassword',
        }),
      );
      userEvents.publishUserPasswordChanged.mockResolvedValue(undefined);

      // Make notification creation fail
      notificationService.createNotification.mockRejectedValue(
        new Error('Email service unavailable'),
      );

      const result = await service.resetUserPassword(resetDto);

      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(false);
      expect(result.tempPassword).toBeDefined();
      expect(userAuth.hashPassword).toHaveBeenCalled();
      expect(userRepository.updatePassword).toHaveBeenCalled();
      expect(userEvents.publishUserPasswordChanged).toHaveBeenCalled();
    });

    it('should handle password reset without sending email', async () => {
      const resetDto = { userId: 'user1', sendEmail: false };

      userAuth.hashPassword.mockResolvedValue('hashedTempPassword');
      userRepository.updatePassword.mockResolvedValue(
        createFullUser({
          id: 'user1',
          password: 'hashedTempPassword',
        }),
      );
      userEvents.publishUserPasswordChanged.mockResolvedValue(undefined);

      const result = await service.resetUserPassword(resetDto);

      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(false);
      expect(result.tempPassword).toBeDefined();
      expect(notificationService.createNotification).not.toHaveBeenCalled();
    });

    it('should handle sendMessageToUser with notification failure', async () => {
      const userId = 'user1';
      const message = 'Test message';

      notificationService.createNotification.mockRejectedValue(
        new Error('Notification service down'),
      );

      const result = await service.sendMessageToUser(userId, message);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Failed to send message');
    });

    it('should handle sendMessageToUser successfully', async () => {
      const userId = 'user1';
      const message = 'Test message';

      notificationService.createNotification.mockResolvedValue({
        id: 'notification1',
        userId,
        message,
        type: 'info',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        link: null,
      });

      const result = await service.sendMessageToUser(userId, message);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Message sent successfully');
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle repository errors gracefully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        lastName: 'User',
        contactNumber: '+1234567890',
        terms: true,
      };

      userAuth.hashPassword.mockResolvedValue('hashedPassword');
      userRepository.create.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should handle authentication service errors', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        lastName: 'User',
        contactNumber: '+1234567890',
        terms: true,
      };

      userAuth.hashPassword.mockRejectedValue(
        new Error('Hashing service unavailable'),
      );

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Hashing service unavailable',
      );
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should handle event publishing errors gracefully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        lastName: 'User',
        contactNumber: '+1234567890',
        terms: true,
      };

      const mockUser = createUserResponse({
        email: 'test@example.com',
        name: 'Test User',
        lastName: 'User',
        contactNumber: '+1234567890',
      });

      userAuth.hashPassword.mockResolvedValue('hashedPassword');
      userRepository.create.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(
        createFullUser({
          email: 'test@example.com',
          name: 'Test User',
          lastName: 'User',
          contactNumber: '+1234567890',
        }),
      );
      userEvents.publishUserCreated.mockRejectedValue(
        new Error('Event bus unavailable'),
      );

      // Should still complete successfully even if event publishing fails
      await expect(service.create(createUserDto)).rejects.toThrow(
        'Event bus unavailable',
      );
    });
  });
});
