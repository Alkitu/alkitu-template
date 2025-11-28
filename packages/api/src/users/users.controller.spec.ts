/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserFacadeService } from './services';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { mockUser, createUserFixture } from '../../test/fixtures/user.fixtures';
import { TokenService } from '../auth/token.service';
import { UserRole, UserStatus } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let userFacadeService: jest.Mocked<UserFacadeService>;
  let usersService: jest.Mocked<UsersService>;
  let authService: jest.Mocked<AuthService>;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        // ✅ SOLID: UserFacadeService mock
        {
          provide: UserFacadeService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            validateUser: jest.fn(),
            findAllWithFilters: jest.fn(),
            getUserStats: jest.fn(),
            updateTags: jest.fn(),
            changePassword: jest.fn(),
            bulkDeleteUsers: jest.fn(),
            bulkUpdateRole: jest.fn(),
            bulkUpdateStatus: jest.fn(),
            resetUserPassword: jest.fn(),
          },
        },
        // Legacy service (maintained for compatibility)
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            validateUser: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            revokeAllUserSessions: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    userFacadeService = module.get<UserFacadeService>(
      UserFacadeService,
    ) as jest.Mocked<UserFacadeService>;
    usersService = module.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
    authService = module.get<AuthService>(
      AuthService,
    ) as jest.Mocked<AuthService>;
    tokenService = module.get<TokenService>(
      TokenService,
    ) as jest.Mocked<TokenService>;
  });

  describe('register', () => {
    it('should create a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        password: 'password123',
        terms: true,
      };
      const createdUser = createUserFixture(createUserDto);

      // ✅ SOLID: Using UserFacadeService
      userFacadeService.create.mockResolvedValue(createdUser as any);

      const result = await controller.register(createUserDto);

      expect(userFacadeService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('login', () => {
    it('should validate and return access and refresh tokens', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const validatedUser = {
        id: mockUser.id!,
        firstname: mockUser.firstname || 'Test',
        lastname: mockUser.lastname || 'User',
        email: mockUser.email || 'test@example.com',
        phone: mockUser.phone || null,
        company: mockUser.company || null,
        address: mockUser.address || null,
        contactPerson: mockUser.contactPerson || null,
        profileComplete: mockUser.profileComplete || false,
        emailVerified: mockUser.emailVerified || null,
        image: mockUser.image || null,
        role: mockUser.role!,
        status: mockUser.status!,
        terms: mockUser.terms || true,
        isTwoFactorEnabled: mockUser.isTwoFactorEnabled || false,
        groupIds: mockUser.groupIds || [],
        tagIds: mockUser.tagIds || [],
        resourceIds: mockUser.resourceIds || [],
        createdAt: mockUser.createdAt || new Date(),
        updatedAt: mockUser.updatedAt || new Date(),
        password: mockUser.password || 'hashed-password',
        lastLogin: mockUser.lastLogin || null,
      } as any;
      const accessToken = 'mock-access-token';
      const refreshToken = 'mock-refresh-token';

      // ✅ SOLID: Using UserFacadeService
      userFacadeService.validateUser.mockResolvedValue(validatedUser);
      userFacadeService.findOne.mockResolvedValue(validatedUser);
      authService.login.mockResolvedValue({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: validatedUser.id,
          email: validatedUser.email,
          firstname: validatedUser.firstname,
          lastname: validatedUser.lastname,
          role: validatedUser.role,
          profileComplete: validatedUser.profileComplete,
          emailVerified: validatedUser.emailVerified !== null,
        },
      });

      const result = await controller.login(loginDto);

      expect(userFacadeService.validateUser).toHaveBeenCalledWith(loginDto);
      expect(userFacadeService.findOne).toHaveBeenCalledWith(validatedUser.id);
      expect(authService.login).toHaveBeenCalledWith(validatedUser);
      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: validatedUser.id,
          email: validatedUser.email,
          firstname: validatedUser.firstname,
          lastname: validatedUser.lastname,
          role: validatedUser.role,
          profileComplete: validatedUser.profileComplete,
          emailVerified: validatedUser.emailVerified !== null,
        },
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };

      // ✅ SOLID: Using UserFacadeService
      userFacadeService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userFacadeService.validateUser).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const users = [
        mockUser,
        createUserFixture({ id: '2', email: 'user2@example.com' }),
      ];

      // ✅ SOLID: Using UserFacadeService
      userFacadeService.findAll.mockResolvedValue(users as any);

      const result = await controller.findAll();

      expect(userFacadeService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      // ✅ SOLID: Using UserFacadeService
      userFacadeService.findOne.mockResolvedValue(mockUser as any);

      const result = await controller.findOne(mockUser.id!);

      expect(userFacadeService.findOne).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = { firstname: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateDto };

      // ✅ SOLID: Using UserFacadeService
      userFacadeService.update.mockResolvedValue(updatedUser as any);

      const result = await controller.update(mockUser.id!, updateDto);

      expect(userFacadeService.update).toHaveBeenCalledWith(
        mockUser.id,
        updateDto,
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const deleteResult = { message: 'User deleted successfully' };

      // ✅ SOLID: Using UserFacadeService
      userFacadeService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove(mockUser.id!);

      expect(userFacadeService.remove).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(deleteResult);
    });
  });

  describe('getMeRole', () => {
    it('should return user role', () => {
      const req = { user: { role: 'CLIENT' } } as any;

      const result = controller.getMeRole(req);

      expect(result).toEqual({ role: 'CLIENT' });
    });
  });

  describe('revokeMySessions', () => {
    it('should revoke all user sessions', async () => {
      const req = { user: { id: 'test-id' } } as any;
      const revokedCount = 3;

      tokenService.revokeAllUserSessions.mockResolvedValue(revokedCount);

      const result = await controller.revokeMySessions(req);

      expect(tokenService.revokeAllUserSessions).toHaveBeenCalledWith(
        'test-id',
      );
      expect(result).toEqual({
        message: 'All your sessions have been revoked. Please log in again.',
        revokedSessions: revokedCount,
      });
    });
  });

  describe('findAllFiltered', () => {
    it('should return filtered users with pagination', async () => {
      const filterDto = {
        page: 1,
        limit: 10,
        search: 'test',
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
      };
      const filteredResult = {
        users: [mockUser],
        total: 1,
        totalPages: 1,
        currentPage: 1,
      };

      userFacadeService.findAllWithFilters.mockResolvedValue(filteredResult as any);

      const result = await controller.findAllFiltered(filterDto);

      expect(userFacadeService.findAllWithFilters).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(filteredResult);
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      const stats = {
        totalUsers: 100,
        activeUsers: 80,
        inactiveUsers: 20,
        usersByRole: {
          CLIENT: 70,
          ADMIN: 10,
          EMPLOYEE: 20,
        },
      };

      userFacadeService.getUserStats.mockResolvedValue(stats as any);

      const result = await controller.getUserStats();

      expect(userFacadeService.getUserStats).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });

  describe('updateTags', () => {
    it('should update user tags', async () => {
      const updateTagsDto = {
        tagIds: ['tag1', 'tag2', 'tag3'],
      };
      const updatedUser = { ...mockUser, tagIds: updateTagsDto.tagIds };

      userFacadeService.updateTags.mockResolvedValue(updatedUser as any);

      const result = await controller.updateTags(mockUser.id!, updateTagsDto);

      expect(userFacadeService.updateTags).toHaveBeenCalledWith(
        mockUser.id,
        updateTagsDto,
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      const req = { user: { id: 'test-id' } } as any;
      const changePasswordDto = {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword123',
      };

      userFacadeService.changePassword.mockResolvedValue(undefined);

      const result = await controller.changePassword(req, changePasswordDto);

      expect(userFacadeService.changePassword).toHaveBeenCalledWith(
        'test-id',
        changePasswordDto,
      );
      expect(result).toEqual({ message: 'Password changed successfully' });
    });
  });

  describe('bulkDeleteUsers', () => {
    it('should bulk delete users', async () => {
      const bulkDeleteDto = {
        userIds: ['user1', 'user2', 'user3'],
      };
      const deleteResult = {
        success: true,
        message: 'Users deleted successfully',
        affectedCount: 3,
      };

      userFacadeService.bulkDeleteUsers.mockResolvedValue(deleteResult);

      const result = await controller.bulkDeleteUsers(bulkDeleteDto);

      expect(userFacadeService.bulkDeleteUsers).toHaveBeenCalledWith(bulkDeleteDto);
      expect(result).toEqual(deleteResult);
    });
  });

  describe('bulkUpdateRole', () => {
    it('should bulk update user roles', async () => {
      const bulkUpdateRoleDto = {
        userIds: ['user1', 'user2'],
        role: UserRole.EMPLOYEE,
      };
      const updateResult = {
        success: true,
        message: 'User roles updated successfully',
        affectedCount: 2,
      };

      userFacadeService.bulkUpdateRole.mockResolvedValue(updateResult);

      const result = await controller.bulkUpdateRole(bulkUpdateRoleDto);

      expect(userFacadeService.bulkUpdateRole).toHaveBeenCalledWith(bulkUpdateRoleDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('bulkUpdateStatus', () => {
    it('should bulk update user status', async () => {
      const bulkUpdateStatusDto = {
        userIds: ['user1', 'user2'],
        status: UserStatus.SUSPENDED,
      };
      const updateResult = {
        success: true,
        message: 'User status updated successfully',
        affectedCount: 2,
      };

      userFacadeService.bulkUpdateStatus.mockResolvedValue(updateResult);

      const result = await controller.bulkUpdateStatus(bulkUpdateStatusDto);

      expect(userFacadeService.bulkUpdateStatus).toHaveBeenCalledWith(bulkUpdateStatusDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('resetUserPassword', () => {
    it('should reset user password', async () => {
      const resetPasswordDto = {
        userId: 'user-id',
        newPassword: 'newPassword123',
      };
      const resetResult = {
        success: true,
        message: 'Password reset successfully',
        tempPassword: 'temp123',
        emailSent: true,
      };

      userFacadeService.resetUserPassword.mockResolvedValue(resetResult);

      const result = await controller.resetUserPassword(resetPasswordDto);

      expect(userFacadeService.resetUserPassword).toHaveBeenCalledWith(resetPasswordDto);
      expect(result).toEqual(resetResult);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
