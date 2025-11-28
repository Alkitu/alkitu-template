// @ts-nocheck
// 
// ✅ STRING & CONDITIONAL MUTANT TESTS: Targeting excluded mutations
// packages/api/src/users/services/__tests__/user-facade.service.string-conditional-mutants.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserFacadeService } from '../user-facade.service';
import { UserRepositoryService } from '../user-repository.service';
import { UserAuthenticationService } from '../user-authentication.service';
import { UserAnalyticsService } from '../user-analytics.service.simple';
import { UserEventsService } from '../user-events.service';
import { NotificationService } from '../../../notification/notification.service';
import { UserRole, UserStatus } from '@prisma/client';
import { UserFactory } from '../../../test/factories';

describe('UserFacadeService - String Literal & Conditional Expression Mutants', () => {
  let service: UserFacadeService;
  let userRepository: jest.Mocked<UserRepositoryService>;
  let userAuthentication: jest.Mocked<UserAuthenticationService>;
  let userAnalytics: jest.Mocked<UserAnalyticsService>;
  let userEvents: jest.Mocked<UserEventsService>;
  let notificationService: jest.Mocked<NotificationService>;

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
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
      changePassword: jest.fn(),
      generatePasswordResetToken: jest.fn(),
      verifyPasswordResetToken: jest.fn(),
    };

    const mockUserAnalytics = {
      getUserStats: jest.fn(),
      getEngagementMetrics: jest.fn(),
      getActivityHistory: jest.fn(),
      getGrowthStats: jest.fn(),
    };

    const mockUserEvents = {
      publishUserCreated: jest.fn(),
      publishUserUpdated: jest.fn(),
      publishUserDeleted: jest.fn(),
      publishUserLoggedIn: jest.fn(),
      publishUserPasswordChanged: jest.fn(),
      publishUserEmailVerified: jest.fn(),
      publishUserBulkOperation: jest.fn(),
    };

    const mockNotificationService = {
      createNotification: jest.fn(),
      findByUserId: jest.fn(),
      markAsRead: jest.fn(),
      deleteNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
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
    userRepository = module.get(UserRepositoryService);
    userAuthentication = module.get(UserAuthenticationService);
    userAnalytics = module.get(UserAnalyticsService);
    userEvents = module.get(UserEventsService);
    notificationService = module.get(NotificationService);
  });

  describe('String Literal Mutations - Welcome Messages', () => {
    it('should verify exact welcome message string for user with name', async () => {
      const createUserDto = {
        email: 'testuser@example.com',
        password: 'password123',
        name: 'John',
        lastName: 'Doe',
        contactNumber: '+1234567890',
        terms: true,
      };

      const mockUser = UserFactory.create({
        id: 'user-123',
        email: 'testuser@example.com',
        name: 'John',
        lastName: 'Doe',
      });

      userAuthentication.hashPassword.mockResolvedValue('hashed-password');
      userRepository.create.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userEvents.publishUserCreated.mockResolvedValue();
      notificationService.createNotification.mockResolvedValue();

      await service.create(createUserDto);

      // Verify exact string literal: 'Welcome to Alkitu, John!'
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        userId: 'user-123',
        message: 'Welcome to Alkitu, John!',
        type: 'info',
        link: '/dashboard',
      });

      // Test string mutation: if name becomes email fallback
      expect(notificationService.createNotification).not.toHaveBeenCalledWith({
        userId: 'user-123',
        message: 'Welcome to Alkitu, testuser@example.com!',
        type: 'info',
        link: '/dashboard',
      });
    });

    it('should verify exact welcome message string for user without name', async () => {
      const createUserDto = {
        email: 'noname@example.com',
        password: 'password123',
        name: undefined,
        lastName: 'User',
        contactNumber: null,
        terms: true,
      };

      const mockUser = UserFactory.create({
        id: 'user-456',
        email: 'noname@example.com',
        name: null,
        lastName: 'User',
      });

      userAuthentication.hashPassword.mockResolvedValue('hashed-password');
      userRepository.create.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userEvents.publishUserCreated.mockResolvedValue();
      notificationService.createNotification.mockResolvedValue();

      await service.create(createUserDto);

      // Verify exact string literal when name is null/undefined: 'Welcome to Alkitu, noname@example.com!'
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        userId: 'user-456',
        message: 'Welcome to Alkitu, noname@example.com!',
        type: 'info',
        link: '/dashboard',
      });
    });

    it('should verify exact welcome message string for empty name', async () => {
      const createUserDto = {
        email: 'empty@example.com',
        password: 'password123',
        name: '',
        lastName: 'User',
        contactNumber: null,
        terms: true,
      };

      const mockUser = UserFactory.create({
        id: 'user-789',
        email: 'empty@example.com',
        name: '',
        lastName: 'User',
      });

      userAuthentication.hashPassword.mockResolvedValue('hashed-password');
      userRepository.create.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userEvents.publishUserCreated.mockResolvedValue();
      notificationService.createNotification.mockResolvedValue();

      await service.create(createUserDto);

      // Verify exact string literal when name is empty: 'Welcome to Alkitu, empty@example.com!'
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        userId: 'user-789',
        message: 'Welcome to Alkitu, empty@example.com!',
        type: 'info',
        link: '/dashboard',
      });
    });
  });

  describe('String Literal Mutations - Error Messages', () => {
    it('should verify exact error message string for user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        'User not found',
      );

      // Verify exact string literal is thrown
      try {
        await service.remove('non-existent-id');
      } catch (error) {
        expect(error.message).toBe('User not found');
        expect(error.message).not.toBe(''); // Test empty string mutation
        expect(error.message).not.toBe('User'); // Test partial string mutation
        expect(error.message).not.toBe('not found'); // Test partial string mutation
      }
    });

    it('should verify exact success message strings in return objects', async () => {
      const mockUser = UserFactory.create();
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.delete.mockResolvedValue();
      userEvents.publishUserDeleted.mockResolvedValue();

      const result = await service.remove('test-id');

      // Verify exact string literal: 'User deleted successfully'
      expect(result.message).toBe('User deleted successfully');
      expect(result.message).not.toBe(''); // Test empty string mutation
      expect(result.message).not.toBe('User deleted'); // Test partial string mutation
      expect(result.message).not.toBe('deleted successfully'); // Test partial string mutation
    });

    it('should verify exact password change success message', async () => {
      userAuthentication.changePassword.mockResolvedValue();
      userEvents.publishUserPasswordChanged.mockResolvedValue();

      const result = await service.changePassword('user-id', {
        currentPassword: 'old',
        newPassword: 'new',
      });

      // Verify exact string literal: 'Password changed successfully'
      expect(result.message).toBe('Password changed successfully');
      expect(result.message).not.toBe(''); // Test empty string mutation
      expect(result.message).not.toBe('Password changed'); // Test partial string mutation
      expect(result.message).not.toBe('changed successfully'); // Test partial string mutation
    });

    it('should verify exact message sending success strings', async () => {
      notificationService.createNotification.mockResolvedValue();

      const result = await service.sendMessageToUser('user-id', 'test message');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Message sent successfully');
      expect(result.message).not.toBe(''); // Test empty string mutation
      expect(result.message).not.toBe('Message sent'); // Test partial string mutation
      expect(result.message).not.toBe('sent successfully'); // Test partial string mutation
    });

    it('should verify exact error prefix in message sending failures', async () => {
      const errorMessage = 'Service temporarily unavailable';
      notificationService.createNotification.mockRejectedValue(
        new Error(errorMessage),
      );

      const result = await service.sendMessageToUser('user-id', 'test message');

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        'Failed to send message: Service temporarily unavailable',
      );
      expect(result.message).toContain('Failed to send message:'); // Test string prefix
      expect(result.message).not.toBe(''); // Test empty string mutation
    });
  });

  describe('String Literal Mutations - Bulk Operation Messages', () => {
    it('should verify exact bulk delete success message format', async () => {
      const userIds = ['user1', 'user2', 'user3'];

      userRepository.findById
        .mockResolvedValueOnce(UserFactory.create())
        .mockResolvedValueOnce(UserFactory.create())
        .mockResolvedValueOnce(UserFactory.create());

      userRepository.delete
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Delete failed'));

      userEvents.publishUserDeleted.mockResolvedValue();
      userEvents.publishUserBulkOperation.mockResolvedValue();

      const result = await service.bulkDeleteUsers({ userIds });

      // Verify exact string template: 'Successfully deleted {count} out of {total} users'
      expect(result.message).toBe('Successfully deleted 2 out of 3 users');
      expect(result.message).toContain('Successfully deleted');
      expect(result.message).toContain('out of');
      expect(result.message).toContain('users');
      expect(result.message).not.toBe(''); // Test empty string mutation
    });

    it('should verify exact bulk role update message format', async () => {
      const userIds = ['user1', 'user2'];

      userRepository.findById
        .mockResolvedValueOnce(UserFactory.create())
        .mockResolvedValueOnce(UserFactory.create());

      userRepository.update
        .mockResolvedValueOnce(UserFactory.create())
        .mockResolvedValueOnce(UserFactory.create());

      userRepository.findByEmail
        .mockResolvedValueOnce(UserFactory.create())
        .mockResolvedValueOnce(UserFactory.create());

      userEvents.publishUserUpdated.mockResolvedValue();
      userEvents.publishUserBulkOperation.mockResolvedValue();

      const result = await service.bulkUpdateRole({
        userIds,
        role: UserRole.ADMIN,
      });

      // Verify exact string template: 'Successfully updated role for {count} out of {total} users'
      expect(result.message).toBe(
        'Successfully updated role for 2 out of 2 users',
      );
      expect(result.message).toContain('Successfully updated role for');
      expect(result.message).toContain('out of');
      expect(result.message).toContain('users');
      expect(result.message).not.toBe(''); // Test empty string mutation
    });

    it('should verify exact bulk status update message format', async () => {
      const userIds = ['user1'];

      userRepository.findById.mockResolvedValueOnce(UserFactory.create());
      userRepository.update.mockResolvedValueOnce(UserFactory.create());
      userRepository.findByEmail.mockResolvedValueOnce(UserFactory.create());
      userEvents.publishUserUpdated.mockResolvedValue();
      userEvents.publishUserBulkOperation.mockResolvedValue();

      const result = await service.bulkUpdateStatus({
        userIds,
        status: UserStatus.ACTIVE,
      });

      // Verify exact string template: 'Successfully updated status for {count} out of {total} users'
      expect(result.message).toBe(
        'Successfully updated status for 1 out of 1 users',
      );
      expect(result.message).toContain('Successfully updated status for');
      expect(result.message).toContain('out of');
      expect(result.message).toContain('users');
      expect(result.message).not.toBe(''); // Test empty string mutation
    });
  });

  describe('String Literal Mutations - Anonymization Strings', () => {
    it('should verify exact anonymization field values', async () => {
      const userId = 'anon-user-123';
      const mockUser = UserFactory.create();

      userRepository.update.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userEvents.publishUserUpdated.mockResolvedValue();

      await service.anonymizeUser(userId);

      // Verify exact string literals in anonymization data
      expect(userRepository.update).toHaveBeenCalledWith(userId, {
        name: 'Anonymous User',
        lastName: 'Anonymous',
        email: `anonymous_${userId}@example.com`,
        contactNumber: undefined,
      });

      // Test individual string literals
      const updateCall = userRepository.update.mock.calls[0][1];
      expect(updateCall.name).toBe('Anonymous User');
      expect(updateCall.name).not.toBe(''); // Test empty string mutation
      expect(updateCall.name).not.toBe('Anonymous'); // Test partial string mutation
      expect(updateCall.name).not.toBe('User'); // Test partial string mutation

      expect(updateCall.lastName).toBe('Anonymous');
      expect(updateCall.lastName).not.toBe(''); // Test empty string mutation
      expect(updateCall.lastName).not.toBe('User'); // Test different string mutation

      expect(updateCall.email).toBe(`anonymous_${userId}@example.com`);
      expect(updateCall.email).toContain('anonymous_');
      expect(updateCall.email).toContain('@example.com');
    });

    it('should verify exact anonymization result field arrays', async () => {
      const mockUser = UserFactory.create();
      userRepository.update.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userEvents.publishUserUpdated.mockResolvedValue();

      const result = await service.anonymizeUser('test-id');

      // Verify exact string arrays
      expect(result.anonymizedFields).toEqual([
        'name',
        'lastName',
        'email',
        'contactNumber',
      ]);

      expect(result.retainedFields).toEqual(['id', 'role', 'createdAt']);

      // Test individual field names
      expect(result.anonymizedFields).toContain('name');
      expect(result.anonymizedFields).toContain('lastName');
      expect(result.anonymizedFields).toContain('email');
      expect(result.anonymizedFields).toContain('contactNumber');

      expect(result.retainedFields).toContain('id');
      expect(result.retainedFields).toContain('role');
      expect(result.retainedFields).toContain('createdAt');
    });
  });

  describe('Conditional Expression Mutations - User Existence Checks', () => {
    it('should verify user existence conditional in remove method', async () => {
      // Test the conditional: if (!user) throw new Error('User not found')

      // Case 1: User exists (condition is false, !user = false)
      const existingUser = UserFactory.create();
      userRepository.findById.mockResolvedValue(existingUser);
      userRepository.delete.mockResolvedValue();
      userEvents.publishUserDeleted.mockResolvedValue();

      const result = await service.remove('existing-user-id');
      expect(result.message).toBe('User deleted successfully');

      // Case 2: User doesn't exist (condition is true, !user = true)
      userRepository.findById.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        'User not found',
      );
    });

    it('should verify full user conditional in create method event publishing', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test',
        lastName: 'User',
        contactNumber: null,
        terms: true,
      };

      const mockUser = UserFactory.create();
      userAuthentication.hashPassword.mockResolvedValue('hashed');
      userRepository.create.mockResolvedValue(mockUser);
      userEvents.publishUserCreated.mockResolvedValue();
      notificationService.createNotification.mockResolvedValue();

      // Case 1: User found after creation (condition is true, if (fullUser))
      userRepository.findByEmail.mockResolvedValue(mockUser);

      await service.create(createUserDto);

      expect(userEvents.publishUserCreated).toHaveBeenCalledWith(mockUser);

      // Case 2: User not found after creation (condition is false, if (fullUser))
      userRepository.findByEmail.mockResolvedValue(null);

      await service.create(createUserDto);

      // Event should only have been called once (first case)
      expect(userEvents.publishUserCreated).toHaveBeenCalledTimes(1);
    });

    it('should verify previous user conditional in update method', async () => {
      const updateData = { name: 'Updated Name' };
      const mockUser = UserFactory.create();

      userRepository.update.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userEvents.publishUserUpdated.mockResolvedValue();

      // Case 1: Previous user exists (condition is true, if (fullUser && previousUser))
      const previousUser = UserFactory.create();
      userRepository.findById.mockResolvedValue(previousUser);

      await service.update('user-id', updateData);

      expect(userEvents.publishUserUpdated).toHaveBeenCalledWith(mockUser, {
        id: previousUser.id,
        email: previousUser.email,
        name: previousUser.name,
        lastName: previousUser.lastName,
        contactNumber: previousUser.contactNumber,
      });

      // Case 2: Previous user doesn't exist (condition is false)
      userRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateData),
      ).rejects.toThrow();
    });

    it('should verify authenticated user conditional in validateUser method', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      // Case 1: Authentication succeeds (condition is true, if (authenticatedUser))
      const authenticatedUser = UserFactory.create();
      userAuthentication.validateUser.mockResolvedValue(authenticatedUser);
      userEvents.publishUserLoggedIn.mockResolvedValue();

      const result1 = await service.validateUser(loginDto);

      expect(result1).toBe(authenticatedUser);
      expect(userEvents.publishUserLoggedIn).toHaveBeenCalledWith(
        authenticatedUser.id,
      );

      // Case 2: Authentication fails (condition is false, if (authenticatedUser))
      userAuthentication.validateUser.mockResolvedValue(null);

      const result2 = await service.validateUser(loginDto);

      expect(result2).toBeNull();
      // Event should only be called once (first case)
      expect(userEvents.publishUserLoggedIn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Conditional Expression Mutations - Password Reset Email Logic', () => {
    it('should verify sendEmail conditional in resetUserPassword method', async () => {
      userAuthentication.hashPassword.mockResolvedValue('hashed-temp-pass');
      userRepository.updatePassword.mockResolvedValue(UserFactory.create());
      userEvents.publishUserPasswordChanged.mockResolvedValue();

      // Case 1: sendEmail is true (condition is true, if (sendEmail))
      notificationService.createNotification.mockResolvedValue();

      const result1 = await service.resetUserPassword({
        userId: 'user-id',
        sendEmail: true,
      });

      expect(result1.emailSent).toBe(true);
      expect(result1.message).toBe('Password reset email sent');
      expect(result1.tempPassword).toBeUndefined();

      // Case 2: sendEmail is false (condition is false, if (sendEmail))
      const result2 = await service.resetUserPassword({
        userId: 'user-id',
        sendEmail: false,
      });

      expect(result2.emailSent).toBe(false);
      expect(result2.message).toBe('Password reset completed');
      expect(result2.tempPassword).toBeDefined();

      // Case 3: sendEmail is undefined/default (condition is false)
      const result3 = await service.resetUserPassword({
        userId: 'user-id',
      });

      expect(result3.emailSent).toBe(false);
      expect(result3.message).toBe('Password reset completed');
    });

    it('should verify nested conditional for email success in resetUserPassword', async () => {
      userAuthentication.hashPassword.mockResolvedValue('hashed-temp-pass');
      userRepository.updatePassword.mockResolvedValue(UserFactory.create());
      userEvents.publishUserPasswordChanged.mockResolvedValue();

      // Case 1: sendEmail true AND notification succeeds
      notificationService.createNotification.mockResolvedValue();

      const result1 = await service.resetUserPassword({
        userId: 'user-id',
        sendEmail: true,
      });

      expect(result1.emailSent).toBe(true);
      expect(result1.message).toBe('Password reset email sent');

      // Case 2: sendEmail true BUT notification fails
      notificationService.createNotification.mockRejectedValue(
        new Error('Email service down'),
      );

      const result2 = await service.resetUserPassword({
        userId: 'user-id',
        sendEmail: true,
      });

      expect(result2.emailSent).toBe(false);
      expect(result2.message).toBe('Password reset completed');
    });
  });

  describe('Conditional Expression Mutations - Notification Type Strings', () => {
    it('should verify exact notification type strings', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test',
        lastName: 'User',
        contactNumber: null,
        terms: true,
      };

      const mockUser = UserFactory.create();
      userAuthentication.hashPassword.mockResolvedValue('hashed');
      userRepository.create.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userEvents.publishUserCreated.mockResolvedValue();
      notificationService.createNotification.mockResolvedValue();

      await service.create(createUserDto);

      // Verify exact type string literal: 'info'
      expect(notificationService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
        }),
      );

      // Test type string mutations
      expect(notificationService.createNotification).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: '', // Empty string mutation
        }),
      );

      expect(notificationService.createNotification).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'warning', // Different string mutation
        }),
      );
    });

    it('should verify notification type in message sending', async () => {
      notificationService.createNotification.mockResolvedValue();

      await service.sendMessageToUser('user-id', 'test message');

      expect(notificationService.createNotification).toHaveBeenCalledWith({
        userId: 'user-id',
        message: 'test message',
        type: 'info',
      });

      // Test type string mutations
      expect(notificationService.createNotification).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });

    it('should verify notification type in password reset warnings', async () => {
      userAuthentication.hashPassword.mockResolvedValue('hashed');
      userRepository.updatePassword.mockResolvedValue(UserFactory.create());
      userEvents.publishUserPasswordChanged.mockResolvedValue();
      notificationService.createNotification.mockResolvedValue();

      await service.resetUserPassword({
        userId: 'user-id',
        sendEmail: true,
      });

      expect(notificationService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'warning',
        }),
      );

      // Test type string mutations
      expect(notificationService.createNotification).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
        }),
      );

      expect(notificationService.createNotification).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: '',
        }),
      );
    });
  });

  describe('Conditional Expression Mutations - Dashboard Link Strings', () => {
    it('should verify exact dashboard link string', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test',
        lastName: 'User',
        contactNumber: null,
        terms: true,
      };

      const mockUser = UserFactory.create();
      userAuthentication.hashPassword.mockResolvedValue('hashed');
      userRepository.create.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userEvents.publishUserCreated.mockResolvedValue();
      notificationService.createNotification.mockResolvedValue();

      await service.create(createUserDto);

      // Verify exact link string literal: '/dashboard'
      expect(notificationService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          link: '/dashboard',
        }),
      );

      // Test link string mutations
      expect(notificationService.createNotification).not.toHaveBeenCalledWith(
        expect.objectContaining({
          link: '', // Empty string mutation
        }),
      );

      expect(notificationService.createNotification).not.toHaveBeenCalledWith(
        expect.objectContaining({
          link: '/home', // Different string mutation
        }),
      );

      expect(notificationService.createNotification).not.toHaveBeenCalledWith(
        expect.objectContaining({
          link: 'dashboard', // Missing slash mutation
        }),
      );
    });
  });
});
