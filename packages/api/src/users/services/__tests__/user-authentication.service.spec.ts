// ✅ Testing Agent: UserAuthenticationService Simplified Tests
// packages/api/src/users/services/__tests__/user-authentication.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthenticationService } from '../user-authentication.service';
import { UserRepositoryService } from '../user-repository.service';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('UserAuthenticationService', () => {
  let service: UserAuthenticationService;
  let userRepository: any;

  beforeEach(async () => {
    const mockUserRepository = {
      findByEmail: jest.fn(),
      updateLastLogin: jest.fn(),
      updatePassword: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthenticationService,
        { provide: UserRepositoryService, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserAuthenticationService>(UserAuthenticationService);
    userRepository = module.get(UserRepositoryService);

    // Setup bcrypt mocks - reset them for each test
    jest.clearAllMocks();
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return authenticated user for valid credentials', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        lastName: 'Last',
        contactNumber: '+1234567890',
        role: UserRole.CLIENT,
        password: 'hashedPassword',
        createdAt: new Date(),
        emailVerified: new Date(),
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      userRepository.updateLastLogin.mockResolvedValue(undefined);

      // Act
      const result = await service.validateUser(loginDto);

      // Assert
      expect(result).toBeDefined();
      expect(result?.id).toBe('user-123');
      expect(result?.email).toBe('test@example.com');
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword',
      );
      expect(userRepository.updateLastLogin).toHaveBeenCalledWith('user-123');
    });

    it('should return null for non-existent user', async () => {
      // Arrange
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      userRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await service.validateUser(loginDto);

      // Assert
      expect(result).toBeNull();
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
    });

    it('should return null for invalid password', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        lastName: 'Last',
        contactNumber: '+1234567890',
        role: UserRole.CLIENT,
        password: 'hashedPassword',
        createdAt: new Date(),
        emailVerified: new Date(),
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.validateUser(loginDto);

      // Assert
      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedPassword',
      );
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      // Arrange
      const userId = 'user-123';
      const plainPassword = 'password123';

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.validatePassword(userId, plainPassword);

      // Assert
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainPassword,
        'hashedPassword',
      );
    });

    it('should return false for invalid password', async () => {
      // Arrange
      const userId = 'user-123';
      const plainPassword = 'wrongpassword';
      const hashedPassword = 'hashedPassword';

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        password: hashedPassword,
      };

      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.validatePassword(userId, plainPassword);

      // Assert
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainPassword,
        hashedPassword,
      );
    });
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      // Arrange
      const plainPassword = 'password123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      // Act
      const result = await service.hashPassword(plainPassword);

      // Assert
      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 12);
    });
  });

  describe('generatePasswordResetToken', () => {
    it('should generate password reset token successfully', async () => {
      // Arrange
      const userId = 'user-123';

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        lastName: 'Last',
        contactNumber: '+1234567890',
        role: UserRole.CLIENT,
        password: 'hashedPassword',
        createdAt: new Date(),
        emailVerified: new Date(),
      };

      userRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await service.generatePasswordResetToken(userId);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      // Arrange
      const userId = 'nonexistent-user';

      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.generatePasswordResetToken(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('validatePasswordResetToken', () => {
    it('should validate password reset token successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const timestamp = Date.now();
      const token = Buffer.from(`${userId}:${timestamp}`).toString('base64');

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        lastName: 'Last',
        contactNumber: '+1234567890',
        role: UserRole.CLIENT,
        password: 'hashedPassword',
        createdAt: new Date(),
        emailVerified: new Date(),
      };

      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);

      // Act
      const result = await service.validatePasswordResetToken(token);

      // Assert
      expect(result).toBeDefined();
      expect(result?.id).toBe(userId);
    });

    it('should return null for expired token', async () => {
      // Arrange
      const userId = 'user-123';
      const expiredTimestamp = Date.now() - 3700000; // More than 1 hour ago
      const token = Buffer.from(`${userId}:${expiredTimestamp}`).toString(
        'base64',
      );

      // Act
      const result = await service.validatePasswordResetToken(token);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for invalid token format', async () => {
      // Arrange
      const token = 'invalid-token';

      // Act
      const result = await service.validatePasswordResetToken(token);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('invalidateUserSessions', () => {
    it('should invalidate user sessions successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        lastName: 'Last',
        contactNumber: '+1234567890',
        role: UserRole.CLIENT,
        password: 'hashedPassword',
        createdAt: new Date(),
        emailVerified: new Date(),
      };

      userRepository.findById.mockResolvedValue(mockUser);

      // Act
      await service.invalidateUserSessions(userId);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      // Arrange
      const userId = 'non-existent-user';

      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.invalidateUserSessions(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const changePasswordDto = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      };

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        lastName: 'Last',
        contactNumber: '+1234567890',
        role: UserRole.CLIENT,
        password: 'hashedOldPassword',
        createdAt: new Date(),
        emailVerified: new Date(),
      };

      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');
      userRepository.updatePassword.mockResolvedValue(mockUser);

      // Act
      await service.changePassword(userId, changePasswordDto);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'oldpassword',
        'hashedOldPassword',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 12);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      // Arrange
      const userId = 'non-existent-user';
      const changePasswordDto = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      };

      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.changePassword(userId, changePasswordDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException for invalid current password', async () => {
      // Arrange
      const userId = 'user-123';
      const changePasswordDto = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      };

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        lastName: 'Last',
        contactNumber: '+1234567890',
        role: UserRole.CLIENT,
        password: 'hashedOldPassword',
        createdAt: new Date(),
        emailVerified: new Date(),
      };

      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.changePassword(userId, changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
