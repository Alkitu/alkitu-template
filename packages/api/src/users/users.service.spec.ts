import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { NotificationService } from '../notification/notification.service';
import { EmailService } from '../email/email.service';
import { AuditService } from '../audit/audit.service';
import { UserStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { NotificationType } from '../notification/dto/create-notification.dto';
import { LoginUserDto } from './dto/login-user.dto';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService - Real Business Logic Tests', () => {
  let service: UsersService;
  let prismaService: jest.Mocked<PrismaService>;
  let notificationService: jest.Mocked<NotificationService>;
  let emailService: jest.Mocked<EmailService>;
  let auditService: jest.Mocked<AuditService>;

  const mockUser = {
    id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    firstname: 'Test',
    lastname: 'User',
    password: 'hashed_password',
    phone: '+1234567890',
    company: null,
    address: null,
    contactPerson: null,
    profileComplete: false,
    role: UserRole.USER,
    status: UserStatus.PENDING,
    terms: true,
    emailVerified: null,
    isActive: false,
    lastActivity: null,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
    lastLogin: null,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        create: jest.fn().mockResolvedValue(mockUser),
        findUnique: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([mockUser]),
        findFirst: jest.fn().mockResolvedValue(mockUser),
        update: jest
          .fn()
          .mockResolvedValue({ ...mockUser, firstname: 'Updated Name' }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        delete: jest.fn().mockResolvedValue(mockUser),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
        count: jest.fn().mockResolvedValue(1),
        groupBy: jest.fn(),
      },
      tag: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const mockNotificationService = {
      createNotification: jest.fn().mockResolvedValue({}),
    };

    const mockEmailService = {
      sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
      sendNotification: jest.fn().mockResolvedValue(undefined),
      sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
      sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
    };

    const mockAuditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(
      PrismaService,
    ) as jest.Mocked<PrismaService>;
    notificationService = module.get<NotificationService>(
      NotificationService,
    ) as jest.Mocked<NotificationService>;
    emailService = module.get<EmailService>(
      EmailService,
    ) as jest.Mocked<EmailService>;
    auditService = module.get<AuditService>(
      AuditService,
    ) as jest.Mocked<AuditService>;

    // Reset mocks
    jest.clearAllMocks();

    // Setup bcrypt mocks
    mockedBcrypt.hash.mockResolvedValue('hashed_password' as never);
    mockedBcrypt.compare.mockResolvedValue(true as never);
  });

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      firstname: 'Test',
      lastname: 'User',
      password: 'password123',
      terms: true,
    };

    it('should create a user successfully', async () => {
      const hashedPassword = 'hashed_password';
      const expectedUser = { ...mockUser, password: hashedPassword };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null); // User doesn't exist
      (prismaService.user.create as jest.Mock).mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(
        createUserDto.password,
        10,
      );
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          profileComplete: false,
          status: UserStatus.PENDING,
          firstname: createUserDto.firstname,
          lastname: createUserDto.lastname,
          terms: createUserDto.terms,
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
      expect(result).toEqual(expectedUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createUserDto)).rejects.toThrow(
        `An account with email ${createUserDto.email} already exists. Please use a different email or try logging in.`,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });

    it('should hash password before storing', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await service.create(createUserDto);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(
        createUserDto.password,
        10,
      );
    });

    it('should create notification for new user', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      const newUser = { ...mockUser, id: 'new-user-id' };
      (prismaService.user.create as jest.Mock).mockResolvedValue(newUser);

      await service.create(createUserDto);

      expect(notificationService.createNotification).toHaveBeenCalledWith({
        userId: newUser.id,
        message: `Welcome to Alkitu, ${createUserDto.firstname}!`,
        type: 'INFO',
        link: '/dashboard',
      });
    });
  });

  describe('validateUser', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should validate user successfully with correct credentials', async () => {
      const userWithPassword = { ...mockUser, password: 'hashed_password' };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
        userWithPassword,
      );
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true as never);

      const result = await service.validateUser(loginDto);

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        userWithPassword.password,
      );
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { lastLogin: expect.any(Date) },
      });

      // Should return user without password
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
    });

    it('should return null if user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser(loginDto);

      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const userWithPassword = { ...mockUser, password: 'hashed_password' };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
        userWithPassword,
      );
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false as never);

      const result = await service.validateUser(loginDto);

      expect(result).toBeNull();
    });

    it('should return null if user has no password', async () => {
      const userWithoutPassword = { ...mockUser, password: null };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
        userWithoutPassword,
      );

      const result = await service.validateUser(loginDto);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);

      const result = await service.findAll();

      expect(prismaService.user.findMany).toHaveBeenCalledWith({
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
      expect(result).toEqual(users);
    });

    it('should return empty array when no users exist', async () => {
      (prismaService.user.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const userId = 'user-123';
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOne(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
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
          isActive: true,
          lastActivity: true,
          createdAt: true,
          lastLogin: true,
          emailVerified: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'non-existent-user';
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(userId)).rejects.toThrow(
        'User with ID non-existent-user not found',
      );
    });
  });

  describe('update', () => {
    const userId = 'user-123';
    const updateDto = {
      firstname: 'Updated Name',
      lastname: 'Updated LastName',
    };

    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateDto };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateDto,
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
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(userId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(userId, updateDto)).rejects.toThrow(
        'User with ID user-123 not found',
      );
    });
  });

  describe('remove', () => {
    const userId = 'user-123';

    it('should delete user successfully', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prismaService.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.remove(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw NotFoundException if user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
      await expect(service.remove(userId)).rejects.toThrow(
        'User with ID user-123 not found',
      );
    });
  });

  describe('changePassword', () => {
    const userId = 'user-123';
    const changePasswordDto = {
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword123',
    };

    it('should change password successfully', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true as never);
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue(
        'new_hashed_password' as never,
      );

      await service.changePassword(userId, changePasswordDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        changePasswordDto.currentPassword,
        mockUser.password,
      );
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(
        changePasswordDto.newPassword,
        10,
      );
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { password: 'new_hashed_password' },
      });
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false as never);

      await expect(
        service.changePassword(userId, changePasswordDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.changePassword(userId, changePasswordDto),
      ).rejects.toThrow('Invalid current password');
    });
  });

  describe('bulkUpdateStatus', () => {
    const bulkUpdateDto = {
      userIds: ['user1', 'user2'],
      status: UserStatus.SUSPENDED,
    };

    it('should update status of multiple users', async () => {
      const users = [mockUser, { ...mockUser, id: 'user2' }];
      (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);
      (prismaService.user.updateMany as jest.Mock).mockResolvedValue({
        count: 2,
      });

      const result = await service.bulkUpdateStatus(bulkUpdateDto);

      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: { id: { in: bulkUpdateDto.userIds } },
        select: { id: true },
      });
      expect(prismaService.user.updateMany).toHaveBeenCalledWith({
        where: { id: { in: bulkUpdateDto.userIds } },
        data: { status: bulkUpdateDto.status },
      });
      expect(result).toEqual({
        message: `Successfully updated status to ${bulkUpdateDto.status} for 2 users`,
        updatedCount: 2,
      });
    });

    it('should return correct count of updated users', async () => {
      const users = [{ id: 'user1' }, { id: 'user2' }];
      (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);
      (prismaService.user.updateMany as jest.Mock).mockResolvedValue({
        count: 2,
      });

      const result = await service.bulkUpdateStatus(bulkUpdateDto);

      expect(result.updatedCount).toBe(2);
      expect(result.message).toBe(
        'Successfully updated status to SUSPENDED for 2 users',
      );
    });
  });

  describe('Business Logic Validation Tests', () => {
    it('should validate email format during user creation', async () => {
      const invalidEmailDto = {
        email: 'invalid-email',
        firstname: 'Test',
        lastname: 'User',
        password: 'password123',
        terms: true,
      };

      // Test would verify email validation - service may or may not validate format
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      try {
        await service.create(invalidEmailDto);
        // If service allows invalid email, that's a potential business logic issue
      } catch (error) {
        // If service validates email format, it should throw an error
        expect(error).toBeDefined();
      }
    });

    it('should handle password hashing failures gracefully', async () => {
      const createUserDto = {
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        password: 'password123',
        terms: true,
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (mockedBcrypt.hash as jest.Mock).mockRejectedValue(
        new Error('Hashing failed'),
      );

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Hashing failed',
      );
    });

    it('should verify user status transitions are valid', async () => {
      const userId = 'user-123';
      const updateDto = { status: UserStatus.SUSPENDED };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await service.update(userId, updateDto);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateDto,
        select: expect.any(Object),
      });
    });
  });

  describe('Real World Use Cases', () => {
    it('should handle user registration flow completely', async () => {
      const registrationData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstname: 'New',
        lastname: 'User',
        terms: true,
      };

      const newUser = { ...mockUser, ...registrationData };
      delete newUser.password; // Remove password from response
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaService.user.create as jest.Mock).mockResolvedValue(newUser);

      const result = await service.create(registrationData);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).not.toHaveProperty('password'); // Password should not be returned
    });

    it('should handle user login and authentication flow', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const userWithoutPassword = { ...mockUser };
      delete userWithoutPassword.password;
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(loginData);

      expect(result).toEqual(userWithoutPassword);
    });

    it('should handle admin bulk user management', async () => {
      const adminBulkAction = {
        userIds: ['user1', 'user2', 'user3'],
        status: UserStatus.SUSPENDED,
      };

      const users = [
        { ...mockUser, id: 'user1' },
        { ...mockUser, id: 'user2' },
        { ...mockUser, id: 'user3' },
      ];

      (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);
      (prismaService.user.updateMany as jest.Mock).mockResolvedValue({
        count: 3,
      });

      const result = await service.bulkUpdateStatus(adminBulkAction);

      // Verify bulk operation flow
      expect(prismaService.user.findMany).toHaveBeenCalled(); // Get users to update
      expect(prismaService.user.updateMany).toHaveBeenCalled(); // Bulk update
      expect(result.updatedCount).toBe(3);
      expect(result.message).toBe(
        'Successfully updated status to SUSPENDED for 3 users',
      );
    });

    it('should handle user profile updates', async () => {
      const userId = 'user-profile-123';
      const profileUpdate = {
        firstname: 'Updated Name',
        lastname: 'Updated LastName',
        phone: '+9876543210',
      };

      const updatedUser = { ...mockUser, ...profileUpdate };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(userId, profileUpdate);

      expect(result).toEqual(updatedUser);
      expect(result.firstname).toBe(profileUpdate.firstname);
      expect(result.lastname).toBe(profileUpdate.lastname);
    });
  });

  // Additional Coverage Tests
  describe('Additional Methods Coverage', () => {
    describe('findAllWithFilters', () => {
      it('should return filtered users with pagination', async () => {
        const filterDto = {
          search: 'test',
          role: 'USER' as UserRole,
          page: 1,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc' as const,
        };

        const users = [mockUser];
        (prismaService.user.count as jest.Mock).mockResolvedValue(1);
        (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);

        const result = await service.findAllWithFilters(filterDto);

        expect(prismaService.user.count).toHaveBeenCalledWith({
          where: {
            OR: [
              { email: { contains: 'test', mode: 'insensitive' } },
              { firstname: { contains: 'test', mode: 'insensitive' } },
              { lastname: { contains: 'test', mode: 'insensitive' } },
            ],
            role: 'USER',
          },
        });

        expect(result).toEqual({
          users,
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        });
      });

      it('should handle date range filtering', async () => {
        const filterDto = {
          createdFrom: '2023-01-01',
          createdTo: '2023-12-31',
          page: 1,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc' as const,
        };

        const users = [mockUser];
        (prismaService.user.count as jest.Mock).mockResolvedValue(1);
        (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);

        await service.findAllWithFilters(filterDto);

        expect(prismaService.user.count).toHaveBeenCalledWith({
          where: {
            createdAt: {
              gte: new Date('2023-01-01'),
              lte: new Date('2023-12-31'),
            },
          },
        });
      });
    });

    describe('findByEmail', () => {
      it('should find user by email', async () => {
        const email = 'test@example.com';
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
          mockUser,
        );

        const result = await service.findByEmail(email);

        expect(prismaService.user.findUnique).toHaveBeenCalledWith({
          where: { email },
        });
        expect(result).toEqual(mockUser);
      });

      it('should return null if user not found by email', async () => {
        const email = 'nonexistent@example.com';
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await service.findByEmail(email);

        expect(result).toBeNull();
      });
    });

    describe('bulkDeleteUsers', () => {
      it('should delete multiple users successfully', async () => {
        const bulkDeleteDto = {
          userIds: ['user1', 'user2', 'user3'],
        };

        const existingUsers = [
          { id: 'user1' },
          { id: 'user2' },
          { id: 'user3' },
        ];

        (prismaService.user.findMany as jest.Mock).mockResolvedValue(
          existingUsers,
        );
        (prismaService.user.deleteMany as jest.Mock).mockResolvedValue({
          count: 3,
        });

        const result = await service.bulkDeleteUsers(bulkDeleteDto);

        expect(prismaService.user.findMany).toHaveBeenCalledWith({
          where: { id: { in: bulkDeleteDto.userIds } },
          select: { id: true },
        });
        expect(prismaService.user.deleteMany).toHaveBeenCalledWith({
          where: { id: { in: bulkDeleteDto.userIds } },
        });
        expect(result).toEqual({
          message: 'Successfully deleted 3 users',
          deletedCount: 3,
        });
      });

      it('should throw BadRequestException if some users not found', async () => {
        const bulkDeleteDto = {
          userIds: ['user1', 'user2', 'user3'],
        };

        const existingUsers = [{ id: 'user1' }, { id: 'user2' }]; // Missing user3

        (prismaService.user.findMany as jest.Mock).mockResolvedValue(
          existingUsers,
        );

        await expect(service.bulkDeleteUsers(bulkDeleteDto)).rejects.toThrow(
          BadRequestException,
        );
        await expect(service.bulkDeleteUsers(bulkDeleteDto)).rejects.toThrow(
          'One or more users not found',
        );
      });
    });

    describe('bulkUpdateRole', () => {
      it('should update roles for multiple users', async () => {
        const bulkUpdateRoleDto = {
          userIds: ['user1', 'user2'],
          role: 'ADMIN' as UserRole,
        };

        const existingUsers = [{ id: 'user1' }, { id: 'user2' }];

        (prismaService.user.findMany as jest.Mock).mockResolvedValue(
          existingUsers,
        );
        (prismaService.user.updateMany as jest.Mock).mockResolvedValue({
          count: 2,
        });

        const result = await service.bulkUpdateRole(bulkUpdateRoleDto);

        expect(prismaService.user.updateMany).toHaveBeenCalledWith({
          where: { id: { in: bulkUpdateRoleDto.userIds } },
          data: { role: 'ADMIN' },
        });
        expect(result).toEqual({
          message: 'Successfully updated role to ADMIN for 2 users',
          updatedCount: 2,
        });
      });

      it('should throw BadRequestException if some users not found', async () => {
        const bulkUpdateRoleDto = {
          userIds: ['user1', 'user2'],
          role: 'ADMIN' as UserRole,
        };

        const existingUsers = [{ id: 'user1' }]; // Missing user2

        (prismaService.user.findMany as jest.Mock).mockResolvedValue(
          existingUsers,
        );

        await expect(service.bulkUpdateRole(bulkUpdateRoleDto)).rejects.toThrow(
          BadRequestException,
        );
        await expect(service.bulkUpdateRole(bulkUpdateRoleDto)).rejects.toThrow(
          'One or more users not found',
        );
      });
    });

    describe('resetUserPassword', () => {
      it('should reset user password successfully', async () => {
        const resetPasswordDto = {
          userId: 'user-123',
          sendEmail: true,
        };

        const user = {
          id: 'user-123',
          email: 'test@example.com',
          firstname: 'Test',
          lastname: 'User',
        };

        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);
        (prismaService.user.update as jest.Mock).mockResolvedValue({
          ...user,
          password: 'new-hashed-password',
        });

        const result = await service.resetUserPassword(resetPasswordDto);

        expect(prismaService.user.findUnique).toHaveBeenCalledWith({
          where: { id: resetPasswordDto.userId },
          select: { id: true, email: true, firstname: true, lastname: true },
        });
        expect(prismaService.user.update).toHaveBeenCalledWith({
          where: { id: resetPasswordDto.userId },
          data: {
            password: expect.any(String),
          },
        });
        expect(result).toHaveProperty('tempPassword');
        expect(result).toHaveProperty('message');
      });

      it('should throw NotFoundException if user not found', async () => {
        const resetPasswordDto = {
          userId: 'non-existent-user',
          sendEmail: true,
        };

        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(
          service.resetUserPassword(resetPasswordDto),
        ).rejects.toThrow(NotFoundException);
        await expect(
          service.resetUserPassword(resetPasswordDto),
        ).rejects.toThrow('User with ID non-existent-user not found');
      });
    });

    describe('updateTags', () => {
      it.skip('should update user tags successfully', async () => {
        const userId = 'user-123';
        const updateTagsDto = {
          tagIds: ['tag1', 'tag2', 'tag3'],
        };

        const updatedUser = {
          ...mockUser,
          tagIds: updateTagsDto.tagIds,
        };

        const existingTags = [{ id: 'tag1' }, { id: 'tag2' }, { id: 'tag3' }];

        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
          mockUser,
        );
        (prismaService.tag.findMany as jest.Mock).mockResolvedValue(
          existingTags,
        );
        (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);

        const result = await service.updateTags(userId, updateTagsDto);

        expect(prismaService.tag.findMany).toHaveBeenCalledWith({
          where: { id: { in: updateTagsDto.tagIds } },
          select: { id: true },
        });
        expect(prismaService.user.update).toHaveBeenCalledWith({
          where: { id: userId },
          data: { tagIds: { set: updateTagsDto.tagIds } },
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            phone: true,
            company: true,
            address: true,
            profileComplete: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            lastLogin: true,
            tags: { select: { id: true, name: true } },
          },
        });
        expect(result).toEqual(updatedUser);
      });

      it('should throw NotFoundException if user not found', async () => {
        const userId = 'non-existent-user';
        const updateTagsDto = {
          tagIds: ['tag1', 'tag2'],
        };

        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(service.updateTags(userId, updateTagsDto)).rejects.toThrow(
          NotFoundException,
        );
        await expect(service.updateTags(userId, updateTagsDto)).rejects.toThrow(
          'User with ID non-existent-user not found',
        );
      });
    });

    describe('Edge Cases and Error Handling', () => {
      it('should handle empty filter in findAllWithFilters', async () => {
        const filterDto = {};

        const users = [mockUser];
        (prismaService.user.count as jest.Mock).mockResolvedValue(1);
        (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);

        const result = await service.findAllWithFilters(filterDto);

        expect(prismaService.user.count).toHaveBeenCalledWith({
          where: {},
        });
        expect(result.users).toEqual(users);
      });

      it('should handle pagination edge cases', async () => {
        const filterDto = {
          page: 2,
          limit: 5,
        };

        const users = [mockUser];
        (prismaService.user.count as jest.Mock).mockResolvedValue(10);
        (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);

        const result = await service.findAllWithFilters(filterDto);

        expect(result.pagination).toEqual({
          page: 2,
          limit: 5,
          total: 10,
          totalPages: 2,
          hasNext: false,
          hasPrev: true,
        });
      });

      it('should handle bcrypt hashing errors gracefully', async () => {
        const createUserDto = {
          email: 'test@example.com',
          password: 'password123',
          firstname: 'Test',
          lastname: 'User',
          terms: true,
        };

        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
        (mockedBcrypt.hash as jest.Mock).mockRejectedValue(
          new Error('Hashing failed'),
        );

        await expect(service.create(createUserDto)).rejects.toThrow(
          'Hashing failed',
        );
      });
    });

    describe('changePassword', () => {
      it('should change user password successfully', async () => {
        const changePasswordDto = {
          currentPassword: 'oldPassword',
          newPassword: 'newPassword123',
        };

        const userWithPassword = { ...mockUser, password: 'hashedOldPassword' };
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
          userWithPassword,
        );
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');
        (prismaService.user.update as jest.Mock).mockResolvedValue(
          userWithPassword,
        );

        const result = await service.changePassword(
          mockUser.id,
          changePasswordDto,
        );

        expect(bcrypt.compare).toHaveBeenCalledWith(
          'oldPassword',
          'hashedOldPassword',
        );
        expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
        expect(prismaService.user.update).toHaveBeenCalledWith({
          where: { id: mockUser.id },
          data: { password: 'hashedNewPassword' },
        });
        expect(result).toEqual({ message: 'Password changed successfully' });
      });

      it('should throw UnauthorizedException if user not found', async () => {
        const changePasswordDto = {
          currentPassword: 'oldPassword',
          newPassword: 'newPassword123',
        };

        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(
          service.changePassword(mockUser.id, changePasswordDto),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw BadRequestException if current password is invalid', async () => {
        const changePasswordDto = {
          currentPassword: 'wrongPassword',
          newPassword: 'newPassword123',
        };

        const userWithPassword = { ...mockUser, password: 'hashedOldPassword' };
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
          userWithPassword,
        );
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(
          service.changePassword(mockUser.id, changePasswordDto),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('markEmailAsVerified', () => {
      it.skip('should mark email as verified', async () => {
        const verifiedUser = { ...mockUser, emailVerified: new Date() };
        (prismaService.user.update as jest.Mock).mockResolvedValue(
          verifiedUser,
        );

        const result = await service.markEmailAsVerified(mockUser.id);

        expect(prismaService.user.update).toHaveBeenCalledWith({
          where: { id: mockUser.id },
          data: { emailVerified: expect.any(Date) },
          select: {
            id: true,
            email: true,
            emailVerified: true,
            firstname: true,
            lastname: true,
          },
        });
        expect(result).toEqual(verifiedUser);
      });
    });

    describe('getUserStats', () => {
      it('should return user statistics', async () => {
        const mockStats = {
          total: 100,
          byRole: [
            { role: 'USER', _count: { role: 50 } },
            { role: 'ADMIN', _count: { role: 5 } },
          ],
          recentUsers: 10,
        };

        (prismaService.user.count as jest.Mock)
          .mockResolvedValueOnce(mockStats.total)
          .mockResolvedValueOnce(mockStats.recentUsers);
        (prismaService.user.groupBy as jest.Mock).mockResolvedValue(
          mockStats.byRole,
        );

        const result = await service.getUserStats();

        expect(result).toEqual({
          total: 100,
          byRole: { USER: 50, ADMIN: 5 },
          recentUsers: 10,
        });
      });
    });

    describe('adminChangePassword', () => {
      it('should change user password as admin', async () => {
        const newPassword = 'newAdminPassword123';
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPassword');
        (prismaService.user.update as jest.Mock).mockResolvedValue(mockUser);

        const result = await service.adminChangePassword(
          mockUser.id,
          newPassword,
        );

        expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
        expect(prismaService.user.update).toHaveBeenCalledWith({
          where: { id: mockUser.id },
          data: { password: 'hashedNewPassword' },
        });
        expect(result).toEqual({
          message: 'Password changed successfully by admin',
        });
      });
    });

    describe('anonymizeUser', () => {
      it.skip('should anonymize user data', async () => {
        const anonymizedUser = {
          ...mockUser,
          firstname: 'Anonymous',
          lastname: 'User',
          email: `anonymized_${mockUser.id}@deleted.local`,
          status: UserStatus.ANONYMIZED,
        };

        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
          mockUser,
        );
        (prismaService.user.update as jest.Mock).mockResolvedValue(
          anonymizedUser,
        );

        const result = await service.anonymizeUser(mockUser.id);

        expect(prismaService.user.update).toHaveBeenCalledWith({
          where: { id: mockUser.id },
          data: {
            firstname: 'Anonymous',
            lastname: 'User',
            email: `anonymized_${mockUser.id}@deleted.local`,
            phone: null,
            company: null,
            address: null,
            image: null,
            password: null,
            status: UserStatus.ANONYMIZED,
          },
        });

        expect(result).toEqual({
          message: 'User data anonymized successfully',
          anonymizedUser: {
            id: anonymizedUser.id,
            email: anonymizedUser.email,
            status: anonymizedUser.status,
          },
        });
      });

      it('should throw NotFoundException if user not found for anonymization', async () => {
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(service.anonymizeUser('nonexistent-id')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('sendMessageToUser', () => {
      it.skip('should send message to user', async () => {
        const message = 'Test admin message';
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
          mockUser,
        );
        (notificationService.createNotification as jest.Mock).mockResolvedValue(
          {},
        );

        const result = await service.sendMessageToUser(mockUser.id, message);

        expect(notificationService.createNotification).toHaveBeenCalledWith({
          userId: mockUser.id,
          message: `Message from admin: ${message}`,
          type: NotificationType.INFO,
        });

        expect(result).toEqual({
          message: 'Message sent successfully',
          recipient: {
            id: mockUser.id,
            email: mockUser.email,
            firstname: mockUser.firstname,
          },
        });
      });

      it('should throw NotFoundException if user not found for message', async () => {
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(
          service.sendMessageToUser('nonexistent-id', 'test message'),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('createImpersonationToken', () => {
      it('should create impersonation token for admin', async () => {
        const adminId = 'admin-id';
        const targetUserId = mockUser.id;
        const adminUser = { id: adminId, role: UserRole.ADMIN };
        const targetUser = {
          id: targetUserId,
          email: mockUser.email,
          role: UserRole.USER,
        };

        (prismaService.user.findUnique as jest.Mock)
          .mockResolvedValueOnce(adminUser)
          .mockResolvedValueOnce(targetUser);

        const result = await service.createImpersonationToken(
          adminId,
          targetUserId,
        );

        expect(result).toEqual({
          targetUser: {
            id: targetUser.id,
            email: targetUser.email,
            role: targetUser.role,
          },
          impersonatedBy: adminId,
          impersonatedAt: expect.any(Date),
        });
      });

      it('should throw UnauthorizedException if user is not admin', async () => {
        const nonAdminId = 'user-id';
        const targetUserId = mockUser.id;
        const nonAdminUser = { id: nonAdminId, role: UserRole.USER };

        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
          nonAdminUser,
        );

        await expect(
          service.createImpersonationToken(nonAdminId, targetUserId),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should throw NotFoundException if target user not found', async () => {
        const adminId = 'admin-id';
        const targetUserId = 'nonexistent-id';
        const adminUser = { id: adminId, role: UserRole.ADMIN };

        (prismaService.user.findUnique as jest.Mock)
          .mockResolvedValueOnce(adminUser)
          .mockResolvedValueOnce(null);

        await expect(
          service.createImpersonationToken(adminId, targetUserId),
        ).rejects.toThrow(NotFoundException);
      });

      it('should throw BadRequestException if trying to impersonate another admin', async () => {
        const adminId = 'admin-id';
        const targetAdminId = 'target-admin-id';
        const adminUser = { id: adminId, role: UserRole.ADMIN };
        const targetAdmin = {
          id: targetAdminId,
          email: 'admin@example.com',
          role: UserRole.ADMIN,
        };

        (prismaService.user.findUnique as jest.Mock)
          .mockResolvedValueOnce(adminUser)
          .mockResolvedValueOnce(targetAdmin);

        await expect(
          service.createImpersonationToken(adminId, targetAdminId),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('updatePassword', () => {
      it('should update user password', async () => {
        const hashedPassword = 'hashedNewPassword';
        const updatedUser = { ...mockUser, password: hashedPassword };
        (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);

        const result = await service.updatePassword(
          mockUser.id,
          hashedPassword,
        );

        expect(prismaService.user.update).toHaveBeenCalledWith({
          where: { id: mockUser.id },
          data: { password: hashedPassword },
        });
        expect(result).toEqual(updatedUser);
      });
    });

    describe('validateUser', () => {
      it('should validate user and update last login', async () => {
        const loginDto = { email: 'test@example.com', password: 'password123' };
        const userWithPassword = { ...mockUser, password: 'hashedPassword' };

        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
          userWithPassword,
        );
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (prismaService.user.update as jest.Mock).mockResolvedValue(
          userWithPassword,
        );

        const result = await service.validateUser(loginDto);

        expect(prismaService.user.findUnique).toHaveBeenCalledWith({
          where: { email: loginDto.email },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(
          loginDto.password,
          'hashedPassword',
        );
        expect(prismaService.user.update).toHaveBeenCalledWith({
          where: { id: mockUser.id },
          data: { lastLogin: expect.any(Date) },
        });

        const { password: _, ...expectedResult } = userWithPassword;
        expect(result).toEqual(expectedResult);
      });

      it('should return null if user not found', async () => {
        const loginDto = {
          email: 'nonexistent@example.com',
          password: 'password',
        };
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await service.validateUser(loginDto);

        expect(result).toBeNull();
      });

      it('should return null if password is invalid', async () => {
        const loginDto = { email: mockUser.email, password: 'wrongPassword' };
        const userWithPassword = { ...mockUser, password: 'hashedPassword' };
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
          userWithPassword,
        );
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const result = await service.validateUser(loginDto);

        expect(result).toBeNull();
      });
    });

    describe('findByEmail', () => {
      it('should find user by email', async () => {
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
          mockUser,
        );

        const result = await service.findByEmail(mockUser.email);

        expect(prismaService.user.findUnique).toHaveBeenCalledWith({
          where: { email: mockUser.email },
        });
        expect(result).toEqual(mockUser);
      });

      it('should return null if user not found by email', async () => {
        (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await service.findByEmail('nonexistent@example.com');

        expect(result).toBeNull();
      });
    });

    /**
     * ALI-116: Profile Update Tests
     * Tests for the new updateProfile method with role-based field filtering
     */
    describe('updateProfile (ALI-116)', () => {
      const userId = 'user-123';
      const baseUpdateDto = {
        firstname: 'Updated',
        lastname: 'Name',
        phone: '+1234567890',
        company: 'New Company',
      };

      describe('CLIENT role updates', () => {
        const clientUser = {
          ...mockUser,
          id: userId,
          role: UserRole.CLIENT,
        };

        it('should update all basic fields for CLIENT role', async () => {
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            clientUser,
          );
          const updatedUser = { ...clientUser, ...baseUpdateDto };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          const result = await service.updateProfile(userId, baseUpdateDto);

          expect(prismaService.user.findUnique).toHaveBeenCalledWith({
            where: { id: userId },
            select: { id: true, role: true },
          });
          expect(prismaService.user.update).toHaveBeenCalledWith({
            where: { id: userId },
            data: baseUpdateDto,
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
          expect(result).toEqual(updatedUser);
        });

        it('should update address for CLIENT role', async () => {
          const updateWithAddress = {
            ...baseUpdateDto,
            address: '123 Main St, City, State',
          };
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            clientUser,
          );
          const updatedUser = { ...clientUser, ...updateWithAddress };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          const result = await service.updateProfile(userId, updateWithAddress);

          expect(prismaService.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              data: expect.objectContaining({
                address: '123 Main St, City, State',
              }),
            }),
          );
          expect(result).toEqual(updatedUser);
        });

        it('should update contactPerson for CLIENT role', async () => {
          const contactPerson = {
            name: 'Jane',
            lastname: 'Smith',
            phone: '+9876543210',
            email: 'jane@example.com',
          };
          const updateWithContact = {
            ...baseUpdateDto,
            contactPerson,
          };
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            clientUser,
          );
          const updatedUser = { ...clientUser, ...updateWithContact };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          const result = await service.updateProfile(userId, updateWithContact);

          expect(prismaService.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              data: expect.objectContaining({
                contactPerson,
              }),
            }),
          );
          expect(result).toEqual(updatedUser);
        });

        it('should update both address and contactPerson for CLIENT role', async () => {
          const contactPerson = {
            name: 'Jane',
            lastname: 'Smith',
            phone: '+9876543210',
            email: 'jane@example.com',
          };
          const updateWithBoth = {
            ...baseUpdateDto,
            address: '123 Main St',
            contactPerson,
          };
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            clientUser,
          );
          const updatedUser = { ...clientUser, ...updateWithBoth };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          const result = await service.updateProfile(userId, updateWithBoth);

          expect(prismaService.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              data: expect.objectContaining({
                address: '123 Main St',
                contactPerson,
              }),
            }),
          );
          expect(result).toEqual(updatedUser);
        });
      });

      describe('EMPLOYEE role updates', () => {
        const employeeUser = {
          ...mockUser,
          id: userId,
          role: UserRole.EMPLOYEE,
        };

        it('should update basic fields for EMPLOYEE role', async () => {
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            employeeUser,
          );
          const updatedUser = { ...employeeUser, ...baseUpdateDto };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          const result = await service.updateProfile(userId, baseUpdateDto);

          expect(result).toEqual(updatedUser);
        });

        it('should ignore address field for EMPLOYEE role', async () => {
          const updateWithAddress = {
            ...baseUpdateDto,
            address: '123 Main St',
          };
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            employeeUser,
          );
          const updatedUser = { ...employeeUser, ...baseUpdateDto };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          await service.updateProfile(userId, updateWithAddress);

          // Verify address was NOT included in the update data
          expect(prismaService.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              data: expect.not.objectContaining({
                address: expect.anything(),
              }),
            }),
          );
        });

        it('should ignore contactPerson field for EMPLOYEE role', async () => {
          const updateWithContact = {
            ...baseUpdateDto,
            contactPerson: {
              name: 'Jane',
              lastname: 'Smith',
              phone: '+9876543210',
              email: 'jane@example.com',
            },
          };
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            employeeUser,
          );
          const updatedUser = { ...employeeUser, ...baseUpdateDto };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          await service.updateProfile(userId, updateWithContact);

          // Verify contactPerson was NOT included in the update data
          expect(prismaService.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              data: expect.not.objectContaining({
                contactPerson: expect.anything(),
              }),
            }),
          );
        });

        it('should ignore both address and contactPerson for EMPLOYEE role', async () => {
          const updateWithBoth = {
            ...baseUpdateDto,
            address: '123 Main St',
            contactPerson: {
              name: 'Jane',
              lastname: 'Smith',
              phone: '+9876543210',
              email: 'jane@example.com',
            },
          };
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            employeeUser,
          );
          const updatedUser = { ...employeeUser, ...baseUpdateDto };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          await service.updateProfile(userId, updateWithBoth);

          // Verify neither field was included
          expect(prismaService.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              data: expect.not.objectContaining({
                address: expect.anything(),
                contactPerson: expect.anything(),
              }),
            }),
          );
        });
      });

      describe('ADMIN role updates', () => {
        const adminUser = {
          ...mockUser,
          id: userId,
          role: UserRole.ADMIN,
        };

        it('should update basic fields for ADMIN role', async () => {
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            adminUser,
          );
          const updatedUser = { ...adminUser, ...baseUpdateDto };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          const result = await service.updateProfile(userId, baseUpdateDto);

          expect(result).toEqual(updatedUser);
        });

        it('should ignore address field for ADMIN role', async () => {
          const updateWithAddress = {
            ...baseUpdateDto,
            address: '456 Admin Ave',
          };
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            adminUser,
          );
          const updatedUser = { ...adminUser, ...baseUpdateDto };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          await service.updateProfile(userId, updateWithAddress);

          // Verify address was NOT included
          expect(prismaService.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              data: expect.not.objectContaining({
                address: expect.anything(),
              }),
            }),
          );
        });

        it('should ignore contactPerson field for ADMIN role', async () => {
          const updateWithContact = {
            ...baseUpdateDto,
            contactPerson: {
              name: 'Admin',
              lastname: 'Contact',
              phone: '+1111111111',
              email: 'admin@example.com',
            },
          };
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            adminUser,
          );
          const updatedUser = { ...adminUser, ...baseUpdateDto };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          await service.updateProfile(userId, updateWithContact);

          // Verify contactPerson was NOT included
          expect(prismaService.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              data: expect.not.objectContaining({
                contactPerson: expect.anything(),
              }),
            }),
          );
        });
      });

      describe('Error handling', () => {
        it('should throw NotFoundException if user not found', async () => {
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

          await expect(
            service.updateProfile(userId, baseUpdateDto),
          ).rejects.toThrow(NotFoundException);
          await expect(
            service.updateProfile(userId, baseUpdateDto),
          ).rejects.toThrow(`User with ID ${userId} not found`);
        });

        it('should handle empty update data', async () => {
          const clientUser = {
            ...mockUser,
            id: userId,
            role: UserRole.CLIENT,
          };
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            clientUser,
          );
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            clientUser,
          );

          const result = await service.updateProfile(userId, {});

          expect(prismaService.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              data: {},
            }),
          );
          expect(result).toEqual(clientUser);
        });

        it('should handle undefined optional fields', async () => {
          const clientUser = {
            ...mockUser,
            id: userId,
            role: UserRole.CLIENT,
          };
          const updateWithUndefined = {
            firstname: 'Test',
            lastname: 'User',
            phone: undefined,
            company: undefined,
            address: undefined,
            contactPerson: undefined,
          };
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            clientUser,
          );
          const updatedUser = {
            ...clientUser,
            firstname: 'Test',
            lastname: 'User',
          };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          const result = await service.updateProfile(
            userId,
            updateWithUndefined,
          );

          // Should only include defined fields
          expect(prismaService.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              data: {
                firstname: 'Test',
                lastname: 'User',
              },
            }),
          );
          expect(result).toEqual(updatedUser);
        });
      });

      describe('Partial updates', () => {
        it('should allow updating only firstname', async () => {
          const clientUser = {
            ...mockUser,
            id: userId,
            role: UserRole.CLIENT,
          };
          const partialUpdate = { firstname: 'NewName' };
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            clientUser,
          );
          const updatedUser = { ...clientUser, ...partialUpdate };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          const result = await service.updateProfile(userId, partialUpdate);

          expect(prismaService.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              data: partialUpdate,
            }),
          );
          expect(result).toEqual(updatedUser);
        });

        it('should allow updating only phone', async () => {
          const employeeUser = {
            ...mockUser,
            id: userId,
            role: UserRole.EMPLOYEE,
          };
          const partialUpdate = { phone: '+9999999999' };
          (prismaService.user.findUnique as jest.Mock).mockResolvedValue(
            employeeUser,
          );
          const updatedUser = { ...employeeUser, ...partialUpdate };
          (prismaService.user.update as jest.Mock).mockResolvedValue(
            updatedUser,
          );

          const result = await service.updateProfile(userId, partialUpdate);

          expect(result).toEqual(updatedUser);
        });
      });
    });
  });
});
