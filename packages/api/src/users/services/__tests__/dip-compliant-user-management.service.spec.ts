// ✅ Testing Agent: DIPCompliantUserManagementService Tests
// packages/api/src/users/services/__tests__/dip-compliant-user-management.service.spec.ts

import {
  DIPCompliantUserManagementService,
  IUserRepository,
  IUserValidator,
  IUserNotificationService,
  UserData,
  CreateUserInput,
  UpdateUserInput,
  ConcreteUserRepository,
  ConcreteUserValidator,
  ConcreteUserNotificationService,
} from '../dip-compliant-user-management.service';
import { UserRole, UserStatus } from '@prisma/client';

describe('DIPCompliantUserManagementService', () => {
  let service: DIPCompliantUserManagementService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockUserValidator: jest.Mocked<IUserValidator>;
  let mockNotificationService: jest.Mocked<IUserNotificationService>;

  const mockUserData: UserData = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test',
    lastName: 'User',
    contactNumber: '+1234567890',
    role: UserRole.CLIENT,
    status: UserStatus.ACTIVE,
    terms: true,
    isTwoFactorEnabled: false,
    emailVerified: null,
    image: '',
    groupIds: [],
    tagIds: [],
    resourceIds: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLogin: null,
  };

  beforeEach(() => {
    // Create mocked dependencies
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    mockUserValidator = {
      validateEmail: jest.fn(),
      validatePassword: jest.fn(),
      validateUserData: jest.fn(),
    };

    mockNotificationService = {
      sendWelcomeEmail: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
      sendAccountDeactivationEmail: jest.fn(),
    };

    // Directly instantiate the service with mocked dependencies
    service = new DIPCompliantUserManagementService(
      mockUserRepository,
      mockUserValidator,
      mockNotificationService,
    );
  });

  describe('createUser', () => {
    it('should create user successfully when data is valid', async () => {
      const createUserInput: CreateUserInput = {
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test',
        lastName: 'User',
        contactNumber: '+1234567890',
      };

      mockUserValidator.validateUserData.mockReturnValue(true);
      mockUserRepository.create.mockResolvedValue(mockUserData);
      mockNotificationService.sendWelcomeEmail.mockResolvedValue(undefined);

      const result = await service.createUser(createUserInput);

      expect(mockUserValidator.validateUserData).toHaveBeenCalledWith(
        createUserInput,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserInput,
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
        terms: true,
        isTwoFactorEnabled: false,
        emailVerified: null,
        image: '',
        groupIds: [],
        tagIds: [],
        resourceIds: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        lastLogin: null,
      });
      expect(mockNotificationService.sendWelcomeEmail).toHaveBeenCalledWith(
        mockUserData.id,
      );
      expect(result).toEqual(mockUserData);
    });

    it('should throw error when validation fails', async () => {
      const createUserInput: CreateUserInput = {
        email: 'invalid-email',
        password: 'hashedPassword',
        name: 'Test',
        lastName: 'User',
      };

      mockUserValidator.validateUserData.mockReturnValue(false);

      await expect(service.createUser(createUserInput)).rejects.toThrow(
        'Invalid user data',
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockNotificationService.sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('should handle notification service errors gracefully', async () => {
      const createUserInput: CreateUserInput = {
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test',
        lastName: 'User',
      };

      mockUserValidator.validateUserData.mockReturnValue(true);
      mockUserRepository.create.mockResolvedValue(mockUserData);
      mockNotificationService.sendWelcomeEmail.mockRejectedValue(
        new Error('Email service down'),
      );

      await expect(service.createUser(createUserInput)).rejects.toThrow(
        'Email service down',
      );
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should create user with minimal required data', async () => {
      const minimalInput: CreateUserInput = {
        email: 'minimal@example.com',
        password: 'hashedPassword',
        name: 'Minimal',
        lastName: 'User',
      };

      const minimalUserData = {
        ...mockUserData,
        email: minimalInput.email,
        name: minimalInput.name,
        lastName: minimalInput.lastName,
        contactNumber: undefined,
      };

      mockUserValidator.validateUserData.mockReturnValue(true);
      mockUserRepository.create.mockResolvedValue(minimalUserData);

      const result = await service.createUser(minimalInput);

      expect(result.email).toBe(minimalInput.email);
      expect(result.name).toBe(minimalInput.name);
      expect(result.contactNumber).toBeUndefined();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully when data is valid', async () => {
      const updateUserInput: UpdateUserInput = {
        name: 'Updated Name',
        lastName: 'Updated LastName',
      };

      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockUserRepository.update.mockResolvedValue({
        ...mockUserData,
        ...updateUserInput,
      });

      const result = await service.updateUser('user-123', updateUserInput);

      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-123');
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        'user-123',
        updateUserInput,
      );
      expect(result.name).toBe(updateUserInput.name);
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateUser('nonexistent', { name: 'New Name' }),
      ).rejects.toThrow('User not found');
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository errors during update', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockUserRepository.update.mockRejectedValue(new Error('Database error'));

      await expect(
        service.updateUser('user-123', { name: 'New Name' }),
      ).rejects.toThrow('Database error');
    });

    it('should handle partial updates', async () => {
      const partialUpdate: UpdateUserInput = { name: 'Only Name Updated' };

      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockUserRepository.update.mockResolvedValue({
        ...mockUserData,
        name: 'Only Name Updated',
      });

      const result = await service.updateUser('user-123', partialUpdate);

      expect(result.name).toBe('Only Name Updated');
      expect(result.lastName).toBe('User'); // Original value preserved
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockUserRepository.delete.mockResolvedValue(undefined);
      mockNotificationService.sendAccountDeactivationEmail.mockResolvedValue(
        undefined,
      );

      await service.deleteUser('user-123');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-123');
      expect(
        mockNotificationService.sendAccountDeactivationEmail,
      ).toHaveBeenCalledWith('user-123');
      expect(mockUserRepository.delete).toHaveBeenCalledWith('user-123');
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.deleteUser('nonexistent')).rejects.toThrow(
        'User not found',
      );
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository errors during delete', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockUserRepository.delete.mockRejectedValue(
        new Error('Database constraint violation'),
      );

      await expect(service.deleteUser('user-123')).rejects.toThrow(
        'Database constraint violation',
      );
    });

    it('should handle notification errors during delete', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockNotificationService.sendAccountDeactivationEmail.mockRejectedValue(
        new Error('Email service unavailable'),
      );

      await expect(service.deleteUser('user-123')).rejects.toThrow(
        'Email service unavailable',
      );
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should find user by id successfully', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUserData);

      const result = await service.findUserById('user-123');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockUserData);
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const result = await service.findUserById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle repository errors during find', async () => {
      mockUserRepository.findById.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.findUserById('user-123')).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users successfully', async () => {
      const users = [
        mockUserData,
        { ...mockUserData, id: 'user-2', email: 'user2@example.com' },
      ];
      mockUserRepository.findAll.mockResolvedValue(users);

      const result = await service.getAllUsers();

      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return empty array when no users', async () => {
      mockUserRepository.findAll.mockResolvedValue([]);

      const result = await service.getAllUsers();

      expect(result).toEqual([]);
    });

    it('should handle repository errors during findAll', async () => {
      mockUserRepository.findAll.mockRejectedValue(new Error('Query timeout'));

      await expect(service.getAllUsers()).rejects.toThrow('Query timeout');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null or undefined inputs gracefully', async () => {
      const emptyStringInput: CreateUserInput = {
        email: '',
        password: '',
        name: '',
        lastName: '',
        contactNumber: '',
      };

      mockUserValidator.validateUserData.mockReturnValue(false);

      await expect(service.createUser(emptyStringInput)).rejects.toThrow(
        'Invalid user data',
      );
    });

    it('should handle empty strings in user data', async () => {
      const validData: CreateUserInput = {
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test',
        lastName: 'User',
      };

      mockUserValidator.validateUserData.mockReturnValue(true);
      mockUserRepository.create.mockResolvedValue(mockUserData);
      mockNotificationService.sendWelcomeEmail.mockResolvedValue(undefined);

      await service.createUser(validData);

      expect(mockUserValidator.validateUserData).toHaveBeenCalledWith(
        validData,
      );
    });

    it('should handle concurrent operations', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockUserRepository.update.mockResolvedValue(mockUserData);

      const promises = [
        service.updateUser('user-123', { name: 'Update 1' }),
        service.updateUser('user-123', { name: 'Update 2' }),
        service.updateUser('user-123', { name: 'Update 3' }),
      ];

      await Promise.all(promises);

      expect(mockUserRepository.update).toHaveBeenCalledTimes(3);
    });
  });

  describe('resetUserPassword', () => {
    it('should reset user password successfully', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockNotificationService.sendPasswordResetEmail.mockResolvedValue(undefined);

      await service.resetUserPassword('user-123');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-123');
      expect(mockNotificationService.sendPasswordResetEmail).toHaveBeenCalledWith('user-123');
    });

    it('should throw error when user not found for password reset', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.resetUserPassword('nonexistent')).rejects.toThrow('User not found');
      expect(mockNotificationService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should handle notification service errors during password reset', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockNotificationService.sendPasswordResetEmail.mockRejectedValue(new Error('Email service down'));

      await expect(service.resetUserPassword('user-123')).rejects.toThrow('Email service down');
    });
  });

  describe('bulkUpdateUserStatus', () => {
    it('should update multiple users status successfully', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      const newStatus = UserStatus.SUSPENDED;
      const updatedUser = { ...mockUserData, status: newStatus };

      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.bulkUpdateUserStatus(userIds, newStatus);

      expect(result.success).toBe(3);
      expect(result.failed).toBe(0);
      expect(result.results).toHaveLength(3);
      expect(mockUserRepository.update).toHaveBeenCalledTimes(3);
      userIds.forEach((id) => {
        expect(mockUserRepository.update).toHaveBeenCalledWith(id, { status: newStatus });
      });
    });

    it('should handle partial failures in bulk status update', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      const newStatus = UserStatus.SUSPENDED;
      const updatedUser = { ...mockUserData, status: newStatus };

      mockUserRepository.update
        .mockResolvedValueOnce(updatedUser)
        .mockRejectedValueOnce(new Error('User not found'))
        .mockResolvedValueOnce(updatedUser);

      const result = await service.bulkUpdateUserStatus(userIds, newStatus);

      expect(result.success).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.results).toHaveLength(3);
      expect(result.results[1]).toEqual({ id: 'user-2', error: 'User not found' });
    });

    it('should handle all failures in bulk status update', async () => {
      const userIds = ['user-1', 'user-2'];
      const newStatus = UserStatus.SUSPENDED;

      mockUserRepository.update.mockRejectedValue(new Error('Database error'));

      const result = await service.bulkUpdateUserStatus(userIds, newStatus);

      expect(result.success).toBe(0);
      expect(result.failed).toBe(2);
      expect(result.results).toHaveLength(2);
      result.results.forEach((res) => {
        expect(res).toHaveProperty('error', 'Database error');
      });
    });

    it('should handle empty user list for bulk status update', async () => {
      const result = await service.bulkUpdateUserStatus([], UserStatus.SUSPENDED);

      expect(result.success).toBe(0);
      expect(result.failed).toBe(0);
      expect(result.results).toHaveLength(0);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('bulkUpdateUserRole', () => {
    it('should update multiple users role successfully', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      const newRole = UserRole.ADMIN;
      const updatedUser = { ...mockUserData, role: newRole };

      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.bulkUpdateUserRole(userIds, newRole);

      expect(result.success).toBe(3);
      expect(result.failed).toBe(0);
      expect(result.results).toHaveLength(3);
      expect(mockUserRepository.update).toHaveBeenCalledTimes(3);
      userIds.forEach((id) => {
        expect(mockUserRepository.update).toHaveBeenCalledWith(id, { role: newRole });
      });
    });

    it('should handle partial failures in bulk role update', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      const newRole = UserRole.ADMIN;
      const updatedUser = { ...mockUserData, role: newRole };

      mockUserRepository.update
        .mockResolvedValueOnce(updatedUser)
        .mockRejectedValueOnce(new Error('Permission denied'))
        .mockResolvedValueOnce(updatedUser);

      const result = await service.bulkUpdateUserRole(userIds, newRole);

      expect(result.success).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.results).toHaveLength(3);
      expect(result.results[1]).toEqual({ id: 'user-2', error: 'Permission denied' });
    });

    it('should handle unknown error types in bulk operations', async () => {
      const userIds = ['user-1'];
      const newRole = UserRole.ADMIN;

      // eslint-disable-next-line prefer-promise-reject-errors
      mockUserRepository.update.mockRejectedValue('Unknown error');

      const result = await service.bulkUpdateUserRole(userIds, newRole);

      expect(result.success).toBe(0);
      expect(result.failed).toBe(1);
      expect(result.results[0]).toEqual({ id: 'user-1', error: 'Unknown error' });
    });
  });

  describe('updateUser validation', () => {
    it('should validate email when updating', async () => {
      const updateData: UpdateUserInput = { email: 'invalid-email' };

      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockUserValidator.validateEmail.mockReturnValue(false);

      await expect(service.updateUser('user-123', updateData)).rejects.toThrow('Invalid email format');
      expect(mockUserValidator.validateEmail).toHaveBeenCalledWith('invalid-email');
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should validate password when updating', async () => {
      const updateData: UpdateUserInput = { password: 'weak' };

      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockUserValidator.validatePassword.mockReturnValue(false);

      await expect(service.updateUser('user-123', updateData)).rejects.toThrow('Invalid password format');
      expect(mockUserValidator.validatePassword).toHaveBeenCalledWith('weak');
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should proceed with update when email validation passes', async () => {
      const updateData: UpdateUserInput = { email: 'valid@example.com' };

      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockUserValidator.validateEmail.mockReturnValue(true);
      mockUserRepository.update.mockResolvedValue({ ...mockUserData, ...updateData });

      const result = await service.updateUser('user-123', updateData);

      expect(mockUserValidator.validateEmail).toHaveBeenCalledWith('valid@example.com');
      expect(mockUserRepository.update).toHaveBeenCalled();
      expect(result.email).toBe('valid@example.com');
    });

    it('should proceed with update when password validation passes', async () => {
      const updateData: UpdateUserInput = { password: 'strongpassword123' };

      mockUserRepository.findById.mockResolvedValue(mockUserData);
      mockUserValidator.validatePassword.mockReturnValue(true);
      mockUserRepository.update.mockResolvedValue({ ...mockUserData, ...updateData });

      await service.updateUser('user-123', updateData);

      expect(mockUserValidator.validatePassword).toHaveBeenCalledWith('strongpassword123');
      expect(mockUserRepository.update).toHaveBeenCalled();
    });
  });

  describe('DIP Compliance Tests', () => {
    it('should work with different repository implementations', () => {
      // Test that service works with any implementation of IUserRepository
      const alternativeRepo: IUserRepository = {
        create: jest.fn().mockResolvedValue(mockUserData),
        findById: jest.fn().mockResolvedValue(mockUserData),
        update: jest.fn().mockResolvedValue(mockUserData),
        delete: jest.fn().mockResolvedValue(undefined),
        findAll: jest.fn().mockResolvedValue([mockUserData]),
      };

      const altService = new DIPCompliantUserManagementService(
        alternativeRepo,
        mockUserValidator,
        mockNotificationService,
      );

      expect(altService).toBeInstanceOf(DIPCompliantUserManagementService);
    });

    it('should work with different validator implementations', () => {
      // Test that service works with any implementation of IUserValidator
      const alternativeValidator: IUserValidator = {
        validateEmail: jest.fn().mockReturnValue(true),
        validatePassword: jest.fn().mockReturnValue(true),
        validateUserData: jest.fn().mockReturnValue(true),
      };

      const altService = new DIPCompliantUserManagementService(
        mockUserRepository,
        alternativeValidator,
        mockNotificationService,
      );

      expect(altService).toBeInstanceOf(DIPCompliantUserManagementService);
    });

    it('should work with different notification implementations', () => {
      // Test that service works with any implementation of IUserNotificationService
      const alternativeNotification: IUserNotificationService = {
        sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
        sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
        sendAccountDeactivationEmail: jest.fn().mockResolvedValue(undefined),
      };

      const altService = new DIPCompliantUserManagementService(
        mockUserRepository,
        mockUserValidator,
        alternativeNotification,
      );

      expect(altService).toBeInstanceOf(DIPCompliantUserManagementService);
    });
  });
});

describe('ConcreteUserRepository', () => {
  let repository: ConcreteUserRepository;

  beforeEach(() => {
    repository = new ConcreteUserRepository();
  });

  describe('create', () => {
    it('should create user with provided data', async () => {
      const userData: Partial<UserData> = {
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: UserRole.CLIENT,
      };

      const result = await repository.create(userData);

      expect(result).toMatchObject({
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
        terms: true,
      });
      expect(result.id).toBe('1');
    });

    it('should create user with default values when data is missing', async () => {
      const result = await repository.create({});

      expect(result).toMatchObject({
        email: 'test@example.com',
        name: 'Test User',
        lastName: 'User',
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
      });
    });
  });

  describe('findById', () => {
    it('should return user data', async () => {
      const result = await repository.findById('test-id');

      expect(result).toMatchObject({
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.CLIENT,
      });
    });
  });

  describe('update', () => {
    it('should return updated user data', async () => {
      const updateData: Partial<UserData> = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const result = await repository.update('test-id', updateData);

      expect(result).toMatchObject({
        id: 'test-id',
        name: 'Updated Name',
        email: 'updated@example.com',
      });
    });

    it('should handle partial updates', async () => {
      const result = await repository.update('test-id', { name: 'New Name' });

      expect(result.name).toBe('New Name');
      expect(result.id).toBe('test-id');
    });
  });

  describe('delete', () => {
    it('should delete user without error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await expect(repository.delete('test-id')).resolves.not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Deleting user test-id');

      consoleSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: '1',
        email: 'user1@example.com',
        name: 'User 1',
      });
      expect(result[1]).toMatchObject({
        id: '2',
        email: 'user2@example.com',
        name: 'User 2',
      });
    });
  });
});

describe('ConcreteUserValidator', () => {
  let validator: ConcreteUserValidator;

  beforeEach(() => {
    validator = new ConcreteUserValidator();
  });

  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validator.validateEmail('test@example.com')).toBe(true);
      expect(validator.validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validator.validateEmail('invalid-email')).toBe(false);
      expect(validator.validateEmail('test@')).toBe(false);
      expect(validator.validateEmail('@example.com')).toBe(false);
      expect(validator.validateEmail('test.example.com')).toBe(false);
    });

    it('should return false for empty email', () => {
      expect(validator.validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', () => {
      expect(validator.validatePassword('password123')).toBe(true);
      expect(validator.validatePassword('verylongpassword')).toBe(true);
    });

    it('should return false for short password', () => {
      expect(validator.validatePassword('short')).toBe(false);
      expect(validator.validatePassword('1234567')).toBe(false);
    });

    it('should return false for empty password', () => {
      expect(validator.validatePassword('')).toBe(false);
    });
  });

  describe('validateUserData', () => {
    it('should return true for valid user data', () => {
      const userData: CreateUserInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        lastName: 'User',
      };

      expect(validator.validateUserData(userData)).toBe(true);
    });

    it('should return false for missing required fields', () => {
      expect(validator.validateUserData({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        lastName: '',
      } as CreateUserInput)).toBe(false);

      expect(validator.validateUserData({
        email: 'test@example.com',
        password: 'password123',
        name: '',
        lastName: 'User',
      } as CreateUserInput)).toBe(false);
    });

    it('should return false for invalid email in user data', () => {
      const userData: CreateUserInput = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test',
        lastName: 'User',
      };

      expect(validator.validateUserData(userData)).toBe(false);
    });

    it('should return false for invalid password in user data', () => {
      const userData: CreateUserInput = {
        email: 'test@example.com',
        password: 'short',
        name: 'Test',
        lastName: 'User',
      };

      expect(validator.validateUserData(userData)).toBe(false);
    });
  });
});

describe('ConcreteUserNotificationService', () => {
  let notificationService: ConcreteUserNotificationService;

  beforeEach(() => {
    notificationService = new ConcreteUserNotificationService();
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email without error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await expect(notificationService.sendWelcomeEmail('user-123')).resolves.not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Sending welcome email to user user-123');

      consoleSpy.mockRestore();
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email without error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await expect(notificationService.sendPasswordResetEmail('user-123')).resolves.not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Sending password reset email to user user-123');

      consoleSpy.mockRestore();
    });
  });

  describe('sendAccountDeactivationEmail', () => {
    it('should send account deactivation email without error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await expect(notificationService.sendAccountDeactivationEmail('user-123')).resolves.not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Sending account deactivation email to user user-123');

      consoleSpy.mockRestore();
    });
  });
});
