// @ts-nocheck
// 
// ✅ Comprehensive Mutation Tests for UserFacadeService
// packages/api/src/users/services/__tests__/user-facade.service.comprehensive.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserFacadeService } from '../user-facade.service';
import { UserRepositoryService } from '../user-repository.service';
import { UserAuthenticationService } from '../user-authentication.service';
import { UserAnalyticsService } from '../user-analytics.service.simple';
import { UserEventsService } from '../user-events.service';
import { NotificationService } from '../../../notification/notification.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { LoginUserDto } from '../../dto/login-user.dto';
import { FilterUsersDto } from '../../dto/filter-users.dto';
import { UpdateUserTagsDto } from '../../dto/update-user-tags.dto';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import {
  BulkDeleteUsersDto,
  BulkUpdateRoleDto,
  BulkUpdateStatusDto,
  ResetPasswordDto,
} from '../../dto/bulk-users.dto';

describe('UserFacadeService - Comprehensive Mutation Tests', () => {
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

  describe('create - Comprehensive Tests', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test',
      lastName: 'User',
      contactNumber: '+1234567890',
      terms: true,
    };

    it('should test notification creation with all fields', async () => {
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
      notificationService.createNotification.mockResolvedValue({});

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        userId: '1',
        message: 'Welcome to Alkitu, Test!',
        type: 'info',
        link: '/dashboard',
      });
    });

    it('should test notification creation with email fallback when name is null', async () => {
      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: '1',
        email: 'test@example.com',
        name: null,
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
      notificationService.createNotification.mockResolvedValue({});

      await service.create(createUserDto);

      expect(notificationService.createNotification).toHaveBeenCalledWith({
        userId: '1',
        message: 'Welcome to Alkitu, test@example.com!',
        type: 'info',
        link: '/dashboard',
      });
    });

    it('should handle notification creation failure gracefully', async () => {
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
      notificationService.createNotification.mockRejectedValue(
        new Error('Notification service down'),
      );

      // Should not throw error despite notification failure
      const result = await service.create(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should handle notification creation failure with non-Error object', async () => {
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
      notificationService.createNotification.mockRejectedValue('String error');

      // Should not throw error despite notification failure
      const result = await service.create(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should handle case when findByEmail returns null after creation', async () => {
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

      userAuthentication.hashPassword.mockResolvedValue(hashedPassword);
      userRepository.create.mockResolvedValue(createdUser);
      userRepository.findByEmail.mockResolvedValue(null);
      notificationService.createNotification.mockResolvedValue({});

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(userEvents.publishUserCreated).not.toHaveBeenCalled();
    });
  });

  describe('findAllWithFilters - Comprehensive Tests', () => {
    it('should call userRepository.findAllWithFilters with correct parameters', async () => {
      const filterDto: FilterUsersDto = {
        search: 'test',
        role: 'user',
        page: 1,
        limit: 10,
      };
      const expectedResult = {
        users: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };

      userRepository.findAllWithFilters.mockResolvedValue(expectedResult);

      const result = await service.findAllWithFilters(filterDto);

      expect(result).toEqual(expectedResult);
      expect(userRepository.findAllWithFilters).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('findByEmail - Comprehensive Tests', () => {
    it('should call userRepository.findByEmail with correct email', async () => {
      const email = 'test@example.com';
      const expectedUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user',
        createdAt: new Date(),
        lastLogin: null,
        password: 'hashedPassword',
        emailVerified: null,
      };

      userRepository.findByEmail.mockResolvedValue(expectedUser);

      const result = await service.findByEmail(email);

      expect(result).toEqual(expectedUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('update - Comprehensive Tests', () => {
    it('should handle update when previousUser is null', async () => {
      const userId = '1';
      const updateDto: UpdateUserDto = { name: 'Updated Name' };
      const updatedUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Updated Name',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      userRepository.findById.mockResolvedValue(null);
      userRepository.update.mockResolvedValue(updatedUser);
      userRepository.findByEmail.mockResolvedValue({
        ...updatedUser,
        password: 'hashedPassword',
        emailVerified: null,
      });

      const result = await service.update(userId, updateDto);

      expect(result).toEqual(updatedUser);
      expect(userEvents.publishUserUpdated).not.toHaveBeenCalled();
    });

    it('should handle update when fullUser is null', async () => {
      const userId = '1';
      const updateDto: UpdateUserDto = { name: 'Updated Name' };
      const previousUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Original Name',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };
      const updatedUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Updated Name',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      userRepository.findById.mockResolvedValue(previousUser);
      userRepository.update.mockResolvedValue(updatedUser);
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await service.update(userId, updateDto);

      expect(result).toEqual(updatedUser);
      expect(userEvents.publishUserUpdated).not.toHaveBeenCalled();
    });

    it('should test logical OR condition (should be AND)', async () => {
      const userId = '1';
      const updateDto: UpdateUserDto = { name: 'Updated Name' };
      const previousUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Original Name',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };
      const updatedUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Updated Name',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };
      const fullUser = {
        ...updatedUser,
        password: 'hashedPassword',
        emailVerified: null,
      };

      userRepository.findById.mockResolvedValue(previousUser);
      userRepository.update.mockResolvedValue(updatedUser);
      userRepository.findByEmail.mockResolvedValue(fullUser);

      const result = await service.update(userId, updateDto);

      expect(result).toEqual(updatedUser);
      expect(userEvents.publishUserUpdated).toHaveBeenCalledWith(fullUser, {
        id: previousUser.id,
        email: previousUser.email,
        name: previousUser.name,
        lastName: previousUser.lastName,
        contactNumber: previousUser.contactNumber,
      });
    });
  });

  describe('updateTags - Comprehensive Tests', () => {
    it('should call userRepository.updateTags with correct parameters', async () => {
      const userId = '1';
      const updateTagsDto: UpdateUserTagsDto = { tagIds: ['tag1', 'tag2'] };
      const expectedResult = {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
        tags: [
          { id: 'tag1', name: 'Tag 1' },
          { id: 'tag2', name: 'Tag 2' },
        ],
      };

      userRepository.updateTags.mockResolvedValue(expectedResult);

      const result = await service.updateTags(userId, updateTagsDto);

      expect(result).toEqual(expectedResult);
      expect(userRepository.updateTags).toHaveBeenCalledWith(
        userId,
        updateTagsDto,
      );
    });
  });

  describe('remove - Comprehensive Tests', () => {
    it('should throw error when user not found', async () => {
      const userId = '1';

      userRepository.findById.mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow('User not found');
      expect(userRepository.delete).not.toHaveBeenCalled();
      expect(userEvents.publishUserDeleted).not.toHaveBeenCalled();
    });

    it('should verify returned message object', async () => {
      const userId = '1';
      const user = {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      userRepository.findById.mockResolvedValue(user);
      userRepository.delete.mockResolvedValue(undefined);
      userEvents.publishUserDeleted.mockResolvedValue(undefined);

      const result = await service.remove(userId);

      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(result.message).toBe('User deleted successfully');
    });
  });

  describe('validateUser - Comprehensive Tests', () => {
    it('should handle null authenticated user', async () => {
      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      userAuthentication.validateUser.mockResolvedValue(null);

      const result = await service.validateUser(loginDto);

      expect(result).toBeNull();
      expect(userEvents.publishUserLoggedIn).not.toHaveBeenCalled();
    });

    it('should publish login event when user is authenticated', async () => {
      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const authenticatedUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: new Date(),
        emailVerified: new Date(),
      };

      userAuthentication.validateUser.mockResolvedValue(authenticatedUser);
      userEvents.publishUserLoggedIn.mockResolvedValue(undefined);

      const result = await service.validateUser(loginDto);

      expect(result).toEqual(authenticatedUser);
      expect(userEvents.publishUserLoggedIn).toHaveBeenCalledWith('1');
    });
  });

  describe('updatePassword - Comprehensive Tests', () => {
    it('should call userRepository.updatePassword with correct parameters', async () => {
      const userId = '1';
      const hashedPassword = 'newHashedPassword';
      const expectedUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user',
        createdAt: new Date(),
        lastLogin: null,
        password: hashedPassword,
        emailVerified: null,
      };

      userRepository.updatePassword.mockResolvedValue(expectedUser);

      const result = await service.updatePassword(userId, hashedPassword);

      expect(result).toEqual(expectedUser);
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        userId,
        hashedPassword,
      );
    });
  });

  describe('changePassword - Comprehensive Tests', () => {
    it('should call authentication service and publish event', async () => {
      const userId = '1';
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
      };

      userAuthentication.changePassword.mockResolvedValue(undefined);
      userEvents.publishUserPasswordChanged.mockResolvedValue(undefined);

      const result = await service.changePassword(userId, changePasswordDto);

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(result.message).toBe('Password changed successfully');
      expect(userAuthentication.changePassword).toHaveBeenCalledWith(
        userId,
        changePasswordDto,
      );
      expect(userEvents.publishUserPasswordChanged).toHaveBeenCalledWith(
        userId,
      );
    });
  });

  describe('markEmailAsVerified - Comprehensive Tests', () => {
    it('should call repository and publish event', async () => {
      const userId = '1';
      const expectedResult = {
        id: '1',
        email: 'test@example.com',
        emailVerified: new Date(),
        name: 'Test',
        lastName: 'User',
      };

      userRepository.markEmailAsVerified.mockResolvedValue(expectedResult);
      userEvents.publishUserEmailVerified.mockResolvedValue(undefined);

      const result = await service.markEmailAsVerified(userId);

      expect(result).toEqual(expectedResult);
      expect(userRepository.markEmailAsVerified).toHaveBeenCalledWith(userId);
      expect(userEvents.publishUserEmailVerified).toHaveBeenCalledWith(userId);
    });
  });

  describe('getUserStats - Comprehensive Tests', () => {
    it('should call userAnalytics.getUserStats', async () => {
      const expectedStats = {
        total: 100,
        active: 80,
        inactive: 20,
        verified: 75,
        unverified: 25,
        recentSignups: 10,
        deletedRecently: 2,
      };

      userAnalytics.getUserStats.mockResolvedValue(expectedStats);

      const result = await service.getUserStats();

      expect(result).toEqual(expectedStats);
      expect(userAnalytics.getUserStats).toHaveBeenCalled();
    });
  });

  describe('adminChangePassword - Comprehensive Tests', () => {
    it('should hash password, update, and publish event', async () => {
      const userId = '1';
      const newPassword = 'newPassword123';
      const hashedPassword = 'hashedNewPassword';

      userAuthentication.hashPassword.mockResolvedValue(hashedPassword);
      userRepository.updatePassword.mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        contactNumber: '+1234567890',
        role: 'user',
        createdAt: new Date(),
        lastLogin: null,
        password: hashedPassword,
        emailVerified: null,
      });
      userEvents.publishUserPasswordChanged.mockResolvedValue(undefined);

      await service.adminChangePassword(userId, newPassword);

      expect(userAuthentication.hashPassword).toHaveBeenCalledWith(newPassword);
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        userId,
        hashedPassword,
      );
      expect(userEvents.publishUserPasswordChanged).toHaveBeenCalledWith(
        userId,
      );
    });
  });

  describe('anonymizeUser - Comprehensive Tests', () => {
    it('should anonymize user data and return complete result', async () => {
      const userId = '1';
      const anonymizedUser = {
        id: '1',
        email: 'anonymous_1@example.com',
        name: 'Anonymous User',
        lastName: 'Anonymous',
        contactNumber: '+1234567890',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };
      const fullUser = {
        ...anonymizedUser,
        password: 'hashedPassword',
        emailVerified: null,
      };

      userRepository.update.mockResolvedValue(anonymizedUser);
      userRepository.findByEmail.mockResolvedValue(fullUser);
      userEvents.publishUserUpdated.mockResolvedValue(undefined);

      const result = await service.anonymizeUser(userId);

      expect(result.success).toBe(true);
      expect(result.userId).toBe(userId);
      expect(result.anonymizedFields).toEqual([
        'name',
        'lastName',
        'email',
        'contactNumber',
      ]);
      expect(result.retainedFields).toEqual(['id', 'role', 'createdAt']);
      expect(result.timestamp).toBeInstanceOf(Date);

      expect(userRepository.update).toHaveBeenCalledWith(userId, {
        name: 'Anonymous User',
        lastName: 'Anonymous',
        email: `anonymous_${userId}@example.com`,
        contactNumber: undefined,
      });
      expect(userEvents.publishUserUpdated).toHaveBeenCalledWith(fullUser, {
        id: userId,
      });
    });

    it('should handle case when findByEmail returns null', async () => {
      const userId = '1';
      const anonymizedUser = {
        id: '1',
        email: 'anonymous_1@example.com',
        name: 'Anonymous User',
        lastName: 'Anonymous',
        contactNumber: '+1234567890',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      userRepository.update.mockResolvedValue(anonymizedUser);
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await service.anonymizeUser(userId);

      expect(result.success).toBe(true);
      expect(userEvents.publishUserUpdated).not.toHaveBeenCalled();
    });
  });

  describe('sendMessageToUser - Comprehensive Tests', () => {
    it('should send message successfully', async () => {
      const userId = '1';
      const message = 'Test message';

      notificationService.createNotification.mockResolvedValue({});

      const result = await service.sendMessageToUser(userId, message);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Message sent successfully');
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        userId,
        message,
        type: 'info',
      });
    });

    it('should handle notification service failure with Error object', async () => {
      const userId = '1';
      const message = 'Test message';
      const error = new Error('Service unavailable');

      notificationService.createNotification.mockRejectedValue(error);

      const result = await service.sendMessageToUser(userId, message);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'Failed to send message: Service unavailable',
      );
    });

    it('should handle notification service failure with non-Error object', async () => {
      const userId = '1';
      const message = 'Test message';

      notificationService.createNotification.mockRejectedValue('String error');

      const result = await service.sendMessageToUser(userId, message);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to send message: Unknown error');
    });
  });

  describe('createImpersonationToken - Comprehensive Tests', () => {
    it('should create impersonation token with all fields', async () => {
      const adminId = 'admin1';
      const targetUserId = 'user1';
      const mockToken = 'mock-token-123';

      userAuthentication.generatePasswordResetToken.mockResolvedValue(
        mockToken,
      );

      const result = await service.createImpersonationToken(
        adminId,
        targetUserId,
      );

      expect(result.token).toBe(mockToken);
      expect(result.targetUserId).toBe(targetUserId);
      expect(result.adminId).toBe(adminId);
      expect(result.restrictions).toEqual(['read-only', 'no-admin-actions']);
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('bulkDeleteUsers - Comprehensive Tests', () => {
    it('should delete all users successfully', async () => {
      const bulkDeleteDto: BulkDeleteUsersDto = {
        userIds: ['user1', 'user2', 'user3'],
      };

      // Mock successful removal for all users
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
      const mockUser2 = {
        id: 'user2',
        email: 'user2@example.com',
        name: 'User 2',
        lastName: 'Two',
        contactNumber: '+2222222222',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };
      const mockUser3 = {
        id: 'user3',
        email: 'user3@example.com',
        name: 'User 3',
        lastName: 'Three',
        contactNumber: '+3333333333',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      userRepository.findById
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser2)
        .mockResolvedValueOnce(mockUser3);

      userRepository.delete.mockResolvedValue(undefined);
      userEvents.publishUserDeleted.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      const result = await service.bulkDeleteUsers(bulkDeleteDto);

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(3);
      expect(result.message).toBe('Successfully deleted 3 out of 3 users');
      expect(userEvents.publishUserBulkOperation).toHaveBeenCalledWith(
        'bulk_delete',
        ['user1', 'user2', 'user3'],
        {
          requestedCount: 3,
          successCount: 3,
        },
      );
    });

    it('should handle partial failures in bulk delete', async () => {
      const bulkDeleteDto: BulkDeleteUsersDto = {
        userIds: ['user1', 'user2', 'user3'],
      };

      // Mock successful removal for first user, failure for second, success for third
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
      const mockUser3 = {
        id: 'user3',
        email: 'user3@example.com',
        name: 'User 3',
        lastName: 'Three',
        contactNumber: '+3333333333',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      userRepository.findById
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(null) // User 2 not found
        .mockResolvedValueOnce(mockUser3);

      userRepository.delete.mockResolvedValue(undefined);
      userEvents.publishUserDeleted.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      const result = await service.bulkDeleteUsers(bulkDeleteDto);

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(2);
      expect(result.message).toBe('Successfully deleted 2 out of 3 users');
    });

    it('should handle all failures in bulk delete', async () => {
      const bulkDeleteDto: BulkDeleteUsersDto = {
        userIds: ['user1', 'user2'],
      };

      // Mock failures for all users
      userRepository.findById.mockResolvedValue(null);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      const result = await service.bulkDeleteUsers(bulkDeleteDto);

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(0);
      expect(result.message).toBe('Successfully deleted 0 out of 2 users');
    });
  });

  describe('bulkUpdateRole - Comprehensive Tests', () => {
    it('should update all user roles successfully', async () => {
      const bulkUpdateRoleDto: BulkUpdateRoleDto = {
        userIds: ['user1', 'user2'],
        role: 'admin',
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
      const mockUser2 = {
        id: 'user2',
        email: 'user2@example.com',
        name: 'User 2',
        lastName: 'Two',
        contactNumber: '+2222222222',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      const updatedUser1 = { ...mockUser1, role: 'admin' as const };
      const updatedUser2 = { ...mockUser2, role: 'admin' as const };

      userRepository.findById
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser2);

      userRepository.update
        .mockResolvedValueOnce(updatedUser1)
        .mockResolvedValueOnce(updatedUser2);

      userRepository.findByEmail
        .mockResolvedValueOnce({
          ...updatedUser1,
          password: 'hash1',
          emailVerified: null,
        })
        .mockResolvedValueOnce({
          ...updatedUser2,
          password: 'hash2',
          emailVerified: null,
        });

      userEvents.publishUserUpdated.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      const result = await service.bulkUpdateRole(bulkUpdateRoleDto);

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(2);
      expect(result.message).toBe(
        'Successfully updated role for 2 out of 2 users',
      );
      expect(userEvents.publishUserBulkOperation).toHaveBeenCalledWith(
        'bulk_update_role',
        ['user1', 'user2'],
        {
          newRole: 'admin',
          requestedCount: 2,
          successCount: 2,
        },
      );
    });

    it('should handle partial failures in bulk role update', async () => {
      const bulkUpdateRoleDto: BulkUpdateRoleDto = {
        userIds: ['user1', 'user2'],
        role: 'admin',
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
        .mockResolvedValueOnce(null); // User 2 not found

      userRepository.update.mockResolvedValueOnce({
        ...mockUser1,
        role: 'admin' as const,
      });
      userRepository.findByEmail.mockResolvedValueOnce({
        ...mockUser1,
        role: 'admin' as const,
        password: 'hash1',
        emailVerified: null,
      });
      userEvents.publishUserUpdated.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      const result = await service.bulkUpdateRole(bulkUpdateRoleDto);

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(1);
      expect(result.message).toBe(
        'Successfully updated role for 1 out of 2 users',
      );
    });
  });

  describe('bulkUpdateStatus - Comprehensive Tests', () => {
    it('should update all user statuses successfully', async () => {
      const bulkUpdateStatusDto: BulkUpdateStatusDto = {
        userIds: ['user1', 'user2'],
        status: 'active',
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
      const mockUser2 = {
        id: 'user2',
        email: 'user2@example.com',
        name: 'User 2',
        lastName: 'Two',
        contactNumber: '+2222222222',
        role: 'user' as const,
        createdAt: new Date(),
        lastLogin: null,
      };

      const updatedUser1 = { ...mockUser1, status: 'active' };
      const updatedUser2 = { ...mockUser2, status: 'active' };

      userRepository.findById
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser2);

      userRepository.update
        .mockResolvedValueOnce(updatedUser1)
        .mockResolvedValueOnce(updatedUser2);

      userRepository.findByEmail
        .mockResolvedValueOnce({
          ...updatedUser1,
          password: 'hash1',
          emailVerified: null,
        })
        .mockResolvedValueOnce({
          ...updatedUser2,
          password: 'hash2',
          emailVerified: null,
        });

      userEvents.publishUserUpdated.mockResolvedValue(undefined);
      userEvents.publishUserBulkOperation.mockResolvedValue(undefined);

      const result = await service.bulkUpdateStatus(bulkUpdateStatusDto);

      expect(result.success).toBe(true);
      expect(result.affectedCount).toBe(2);
      expect(result.message).toBe(
        'Successfully updated status for 2 out of 2 users',
      );
      expect(userEvents.publishUserBulkOperation).toHaveBeenCalledWith(
        'bulk_update_status',
        ['user1', 'user2'],
        {
          newStatus: 'active',
          requestedCount: 2,
          successCount: 2,
        },
      );
    });
  });

  describe('resetUserPassword - Comprehensive Tests', () => {
    it('should reset password and send email successfully', async () => {
      const resetPasswordDto: ResetPasswordDto = {
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
      notificationService.createNotification.mockResolvedValue({});

      const result = await service.resetUserPassword(resetPasswordDto);

      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(true);
      expect(result.message).toBe('Password reset email sent');
      expect(result.tempPassword).toBeUndefined();
      expect(userEvents.publishUserPasswordChanged).toHaveBeenCalledWith(
        'user1',
      );
    });

    it('should reset password without sending email', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        userId: 'user1',
        sendEmail: false,
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

      const result = await service.resetUserPassword(resetPasswordDto);

      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(false);
      expect(result.message).toBe('Password reset completed');
      expect(result.tempPassword).toBeDefined();
      expect(typeof result.tempPassword).toBe('string');
      expect(result.tempPassword!.length).toBe(8);
    });

    it('should handle email sending failure', async () => {
      const resetPasswordDto: ResetPasswordDto = {
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
      notificationService.createNotification.mockRejectedValue(
        new Error('Email service down'),
      );

      const result = await service.resetUserPassword(resetPasswordDto);

      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(false);
      expect(result.message).toBe('Password reset completed');
      expect(result.tempPassword).toBeDefined();
    });

    it('should test default sendEmail value', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        userId: 'user1',
        // sendEmail not specified, should default to true
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
      notificationService.createNotification.mockResolvedValue({});

      const result = await service.resetUserPassword(resetPasswordDto);

      expect(result.success).toBe(true);
      expect(result.emailSent).toBe(true);
      expect(notificationService.createNotification).toHaveBeenCalled();
    });

    it('should test temp password generation', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        userId: 'user1',
        sendEmail: false,
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

      const result = await service.resetUserPassword(resetPasswordDto);

      expect(result.tempPassword).toBeDefined();
      expect(typeof result.tempPassword).toBe('string');
      expect(result.tempPassword!.length).toBe(8);
    });
  });
});
