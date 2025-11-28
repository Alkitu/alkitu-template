// @ts-nocheck
// 
// ✅ Testing Agent: UserFacadeService Mutation Tests (GREEN Phase)
// packages/api/src/users/services/__tests__/user-facade.service.mutation.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserFacadeService } from '../user-facade.service';
import { UserRepositoryService } from '../user-repository.service';
import { UserAuthenticationService } from '../user-authentication.service';
import { UserAnalyticsService } from '../user-analytics.service.simple';
import { UserEventsService } from '../user-events.service';
import { NotificationService } from '../../../notification/notification.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserRole, UserStatus } from '@prisma/client';

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

describe('UserFacadeService - Mutation Tests', () => {
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

  describe('Mutation Testing - Critical Path Coverage', () => {
    it('should create user with all required services called', async () => {
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
      notificationService.createNotification.mockResolvedValue({
        id: 'notification1',
        userId: mockUser.id,
        message: `Welcome to Alkitu, ${mockUser.name}!`,
        type: 'info',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        link: '/dashboard',
      });

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userAuth.hashPassword).toHaveBeenCalledWith('password123');
      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        lastName: 'User',
        contactNumber: '+1234567890',
        terms: true,
        password: 'hashedPassword',
      });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(userEvents.publishUserCreated).toHaveBeenCalled();
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        userId: mockUser.id,
        message: 'Welcome to Alkitu, Test User!',
        type: 'info',
        link: '/dashboard',
      });
    });

    it('should update user and publish events', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        lastName: 'Updated LastName',
      };

      const existingUser = createUserResponse({
        id: '1',
        email: 'test@example.com',
        name: 'Original Name',
        lastName: 'Original LastName',
      });

      const updatedUser = createUserResponse({
        id: '1',
        email: 'test@example.com',
        name: 'Updated Name',
        lastName: 'Updated LastName',
      });

      userRepository.findById.mockResolvedValue(existingUser);
      userRepository.update.mockResolvedValue(updatedUser);
      userRepository.findByEmail.mockResolvedValue(
        createFullUser({
          id: '1',
          email: 'test@example.com',
          name: 'Updated Name',
          lastName: 'Updated LastName',
        }),
      );
      userEvents.publishUserUpdated.mockResolvedValue(undefined);

      const result = await service.update('1', updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(userRepository.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(userEvents.publishUserUpdated).toHaveBeenCalled();
    });

    it('should remove user and publish events', async () => {
      const userId = '1';
      const existingUser = createUserResponse({
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        lastName: 'User',
      });

      userRepository.findById.mockResolvedValue(existingUser);
      userRepository.delete.mockResolvedValue(undefined);
      userEvents.publishUserDeleted.mockResolvedValue(undefined);

      const result = await service.remove(userId);

      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.delete).toHaveBeenCalledWith(userId);
      expect(userEvents.publishUserDeleted).toHaveBeenCalledWith(userId, {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        lastName: existingUser.lastName,
        contactNumber: existingUser.contactNumber,
      });
    });

    it('should handle bulk delete users', async () => {
      const userIds = ['user1', 'user2', 'user3'];
      const mockUsers = [
        createUserResponse({
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          lastName: 'One',
        }),
        createUserResponse({
          id: 'user2',
          email: 'user2@example.com',
          name: 'User Two',
          lastName: 'Two',
        }),
        createUserResponse({
          id: 'user3',
          email: 'user3@example.com',
          name: 'User Three',
          lastName: 'Three',
        }),
      ];

      userRepository.findById
        .mockResolvedValueOnce(mockUsers[0])
        .mockResolvedValueOnce(mockUsers[1])
        .mockResolvedValueOnce(mockUsers[2]);

      userRepository.delete.mockResolvedValue(undefined);
      userEvents.publishUserDeleted.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      const result = await service.bulkDeleteUsers({ userIds });

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(3);
      expect(userRepository.delete).toHaveBeenCalledTimes(3);
      expect(userEvents.publishUserDeleted).toHaveBeenCalledTimes(3);
      expect(userEvents.publishUserBulkOperation).toHaveBeenCalledWith(
        'bulk_delete',
        userIds,
        {
          requestedCount: 3,
          successCount: 3,
        },
      );
    });

    it('should handle bulk update user roles', async () => {
      const userIds = ['user1', 'user2'];
      const newRole = UserRole.ADMIN;
      const mockUsers = [
        createUserResponse({
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          lastName: 'One',
          role: 'CLIENT',
        }),
        createUserResponse({
          id: 'user2',
          email: 'user2@example.com',
          name: 'User Two',
          lastName: 'Two',
          role: 'CLIENT',
        }),
      ];

      const updatedUsers = [
        createUserResponse({
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          lastName: 'One',
          role: 'ADMIN',
        }),
        createUserResponse({
          id: 'user2',
          email: 'user2@example.com',
          name: 'User Two',
          lastName: 'Two',
          role: 'ADMIN',
        }),
      ];

      userRepository.findById
        .mockResolvedValueOnce(mockUsers[0])
        .mockResolvedValueOnce(mockUsers[1]);

      userRepository.update
        .mockResolvedValueOnce(updatedUsers[0])
        .mockResolvedValueOnce(updatedUsers[1]);

      userRepository.findByEmail
        .mockResolvedValueOnce(
          createFullUser({
            id: 'user1',
            email: 'user1@example.com',
            name: 'User One',
            lastName: 'One',
            role: UserRole.ADMIN,
          }),
        )
        .mockResolvedValueOnce(
          createFullUser({
            id: 'user2',
            email: 'user2@example.com',
            name: 'User Two',
            lastName: 'Two',
            role: UserRole.ADMIN,
          }),
        );

      userEvents.publishUserUpdated.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      const result = await service.bulkUpdateRole({ userIds, role: newRole });

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(2);
      expect(userRepository.update).toHaveBeenCalledTimes(2);
      expect(userRepository.update).toHaveBeenCalledWith('user1', {
        role: newRole,
      });
      expect(userRepository.update).toHaveBeenCalledWith('user2', {
        role: newRole,
      });
      expect(userEvents.publishUserBulkOperation).toHaveBeenCalledWith(
        'bulk_update_role',
        userIds,
        {
          newRole,
          requestedCount: 2,
          successCount: 2,
        },
      );
    });

    it('should handle bulk update user status', async () => {
      const userIds = ['user1', 'user2'];
      const newStatus = UserStatus.SUSPENDED;
      const mockUsers = [
        createUserResponse({
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          lastName: 'One',
          role: 'CLIENT',
        }),
        createUserResponse({
          id: 'user2',
          email: 'user2@example.com',
          name: 'User Two',
          lastName: 'Two',
          role: 'CLIENT',
        }),
      ];

      const updatedUsers = [
        createUserResponse({
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          lastName: 'One',
          role: 'CLIENT',
        }),
        createUserResponse({
          id: 'user2',
          email: 'user2@example.com',
          name: 'User Two',
          lastName: 'Two',
          role: 'CLIENT',
        }),
      ];

      userRepository.findById
        .mockResolvedValueOnce(mockUsers[0])
        .mockResolvedValueOnce(mockUsers[1]);

      userRepository.update
        .mockResolvedValueOnce(updatedUsers[0])
        .mockResolvedValueOnce(updatedUsers[1]);

      userRepository.findByEmail
        .mockResolvedValueOnce(
          createFullUser({
            id: 'user1',
            email: 'user1@example.com',
            name: 'User One',
            lastName: 'One',
            status: UserStatus.SUSPENDED,
          }),
        )
        .mockResolvedValueOnce(
          createFullUser({
            id: 'user2',
            email: 'user2@example.com',
            name: 'User Two',
            lastName: 'Two',
            status: UserStatus.SUSPENDED,
          }),
        );

      userEvents.publishUserUpdated.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      const result = await service.bulkUpdateStatus({
        userIds,
        status: newStatus,
      });

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(2);
      expect(userRepository.update).toHaveBeenCalledTimes(2);
      expect(userRepository.update).toHaveBeenCalledWith('user1', {
        status: newStatus,
      });
      expect(userRepository.update).toHaveBeenCalledWith('user2', {
        status: newStatus,
      });
      expect(userEvents.publishUserBulkOperation).toHaveBeenCalledWith(
        'bulk_update_status',
        userIds,
        {
          newStatus,
          requestedCount: 2,
          successCount: 2,
        },
      );
    });

    it('should handle password reset with email', async () => {
      const resetDto = { userId: 'user1', sendEmail: true };

      userAuth.hashPassword.mockResolvedValue('hashedTempPassword');
      userRepository.updatePassword.mockResolvedValue(
        createFullUser({
          id: 'user1',
          password: 'hashedTempPassword',
        }),
      );
      userEvents.publishUserPasswordChanged.mockResolvedValue(undefined);
      notificationService.createNotification.mockResolvedValue({
        id: 'notification1',
        userId: 'user1',
        message: 'Your password has been reset.',
        type: 'warning',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        link: null,
      });

      const result = await service.resetUserPassword(resetDto);

      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(true);
      expect(result.tempPassword).toBeUndefined();
      expect(result.message).toBe('Password reset email sent');
      expect(userAuth.hashPassword).toHaveBeenCalled();
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        'user1',
        'hashedTempPassword',
      );
      expect(userEvents.publishUserPasswordChanged).toHaveBeenCalledWith(
        'user1',
      );
      expect(notificationService.createNotification).toHaveBeenCalled();
    });

    it('should handle password reset without email', async () => {
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
      expect(result.message).toBe('Password reset completed');
      expect(userAuth.hashPassword).toHaveBeenCalled();
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        'user1',
        'hashedTempPassword',
      );
      expect(userEvents.publishUserPasswordChanged).toHaveBeenCalledWith(
        'user1',
      );
      expect(notificationService.createNotification).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should throw error when user not found for update', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { name: 'New Name' }),
      ).rejects.toThrow('User not found');
    });

    it('should throw error when user not found for removal', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        'User not found',
      );
    });

    it('should handle notification creation failure gracefully', async () => {
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
      notificationService.createNotification.mockRejectedValue(
        new Error('Notification service unavailable'),
      );

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userRepository.create).toHaveBeenCalled();
      expect(userEvents.publishUserCreated).toHaveBeenCalled();
    });
  });
});
