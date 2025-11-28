/* eslint-disable @typescript-eslint/unbound-method */
// @ts-nocheck

// 

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { TokenService } from './token.service';
import { mockUser } from '../test/fixtures/user.fixtures';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let emailService: jest.Mocked<EmailService>;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            updatePassword: jest.fn(),
            markEmailAsVerified: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendWelcomeEmail: jest.fn(),
            sendPasswordResetEmail: jest.fn(),
            sendEmailVerification: jest.fn(),
            sendNotification: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            createPasswordResetToken: jest.fn(),
            validatePasswordResetToken: jest.fn(),
            consumePasswordResetToken: jest.fn(),
            createEmailVerificationToken: jest.fn(),
            validateEmailVerificationToken: jest.fn(),
            consumeEmailVerificationToken: jest.fn(),
            createRefreshToken: jest.fn(),
            validateRefreshToken: jest.fn(),
            consumeRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
    emailService = module.get<EmailService>(
      EmailService,
    ) as jest.Mocked<EmailService>;
    tokenService = module.get<TokenService>(
      TokenService,
    ) as jest.Mocked<TokenService>;
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      usersService.findByEmail.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...expectedResult } = mockUser;
      expect(result).toEqual(expectedResult);
    });

    it('should return null for invalid password', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      usersService.findByEmail.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      const email = 'notfound@example.com';
      const password = 'password123';

      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });

    it('should return null if user has no password', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const userWithoutPassword = { ...mockUser, password: null };

      usersService.findByEmail.mockResolvedValue(userWithoutPassword as any);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens and user info', async () => {
      const user = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        lastName: mockUser.lastName,
        role: mockUser.role,
      };
      const accessToken = 'jwt-access-token';
      const refreshToken = 'jwt-refresh-token';

      jwtService.sign.mockReturnValue(accessToken);
      tokenService.createRefreshToken.mockResolvedValue(refreshToken);

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
        role: user.role,
      });
      expect(tokenService.createRefreshToken).toHaveBeenCalledWith(user.id);
      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          role: user.role,
        },
      });
    });
  });

  describe('refreshTokens', () => {
    it('should return new access and refresh tokens if valid', async () => {
      const oldRefreshToken = 'old-refresh-token';
      const userId = mockUser.id;
      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';

      tokenService.validateRefreshToken.mockResolvedValue({
        valid: true,
        userId,
      });
      tokenService.consumeRefreshToken.mockResolvedValue(undefined);
      usersService.findOne.mockResolvedValue(mockUser as any);
      jwtService.sign.mockReturnValue(newAccessToken);
      tokenService.createRefreshToken.mockResolvedValue(newRefreshToken);

      const result = await service.refreshTokens(oldRefreshToken);

      expect(tokenService.validateRefreshToken).toHaveBeenCalledWith(
        oldRefreshToken,
      );
      expect(tokenService.consumeRefreshToken).toHaveBeenCalledWith(
        oldRefreshToken,
      );
      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
      expect(tokenService.createRefreshToken).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          lastName: mockUser.lastName,
          role: mockUser.role,
        },
      });
    });

    it('should throw BadRequestException if refresh token is invalid', async () => {
      const oldRefreshToken = 'invalid-refresh-token';

      tokenService.validateRefreshToken.mockResolvedValue({
        valid: false,
      });

      await expect(service.refreshTokens(oldRefreshToken)).rejects.toThrow(
        BadRequestException,
      );
      expect(tokenService.consumeRefreshToken).not.toHaveBeenCalled();
      expect(usersService.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      const oldRefreshToken = 'valid-refresh-token';
      const userId = 'non-existent-user';

      tokenService.validateRefreshToken.mockResolvedValue({
        valid: true,
        userId,
      });
      tokenService.consumeRefreshToken.mockResolvedValue(undefined);
      usersService.findOne.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(service.refreshTokens(oldRefreshToken)).rejects.toThrow(
        NotFoundException,
      );
      expect(tokenService.consumeRefreshToken).toHaveBeenCalledWith(
        oldRefreshToken,
      );
    });
  });

  describe('register', () => {
    it('should create a new user and send welcome email', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        password: 'password123',
        contactNumber: '+1234567890',
        terms: true,
      };
      const createdUser = { ...mockUser, ...createUserDto };

      usersService.create.mockResolvedValue(createdUser as any);
      emailService.sendWelcomeEmail.mockResolvedValue({ success: true });

      const result = await service.register(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith({
        userName: `${createdUser.name} ${createdUser.lastName}`,
        userEmail: createdUser.email,
        registrationDate: expect.any(String),
        loginUrl: expect.stringContaining('/login'),
        unsubscribeUrl: expect.stringContaining('/unsubscribe'),
        supportUrl: expect.stringContaining('/support'),
      });
      expect(result).toEqual(createdUser);
    });
  });
});
