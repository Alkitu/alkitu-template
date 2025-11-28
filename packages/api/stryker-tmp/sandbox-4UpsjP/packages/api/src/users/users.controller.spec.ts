/* eslint-disable @typescript-eslint/unbound-method */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { mockUser, createUserFixture } from '../test/fixtures/user.fixtures';
import { TokenService } from '../auth/token.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;
  let authService: jest.Mocked<AuthService>;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
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
        name: 'Test',
        lastName: 'User',
        password: 'password123',
        contactNumber: '+1234567890',
        terms: true,
      };
      const createdUser = createUserFixture(createUserDto);

      usersService.create.mockResolvedValue(createdUser as any);

      const result = await controller.register(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('login', () => {
    it('should validate and return access and refresh tokens', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const validatedUser = {
        id: mockUser.id!,
        name: mockUser.name || 'Test',
        lastName: mockUser.lastName || 'User',
        email: mockUser.email || 'test@example.com',
        emailVerified: mockUser.emailVerified || null,
        image: mockUser.image || null,
        contactNumber: mockUser.contactNumber || null,
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

      usersService.validateUser.mockResolvedValue(validatedUser);
      usersService.findOne.mockResolvedValue(validatedUser);
      authService.login.mockResolvedValue({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: validatedUser.id,
          email: validatedUser.email,
          name: validatedUser.name,
          lastName: validatedUser.lastName,
          role: validatedUser.role,
        },
      });

      const result = await controller.login(loginDto);

      expect(usersService.validateUser).toHaveBeenCalledWith(loginDto);
      expect(usersService.findOne).toHaveBeenCalledWith(validatedUser.id);
      expect(authService.login).toHaveBeenCalledWith(validatedUser);
      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: validatedUser.id,
          email: validatedUser.email,
          name: validatedUser.name,
          lastName: validatedUser.lastName,
          role: validatedUser.role,
        },
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };

      usersService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.validateUser).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const users = [
        mockUser,
        createUserFixture({ id: '2', email: 'user2@example.com' }),
      ];

      usersService.findAll.mockResolvedValue(users as any);

      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      usersService.findOne.mockResolvedValue(mockUser as any);

      const result = await controller.findOne(mockUser.id!);

      expect(usersService.findOne).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateDto };

      usersService.update.mockResolvedValue(updatedUser as any);

      const result = await controller.update(mockUser.id!, updateDto);

      expect(usersService.update).toHaveBeenCalledWith(mockUser.id, updateDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const deleteResult = { message: 'User deleted successfully' };

      usersService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove(mockUser.id!);

      expect(usersService.remove).toHaveBeenCalledWith(mockUser.id);
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
