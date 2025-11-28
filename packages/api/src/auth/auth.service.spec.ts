/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { TokenService } from './token.service';
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

  const mockUser = {
    id: 'user-123',
    firstname: 'Test',
    lastname: 'User',
    email: 'test@example.com',
    emailVerified: null,
    image: 'https://example.com/avatar.jpg',
    password: 'hashedPassword123',
    phone: '+1234567890',
    company: 'Test Company',
    address: '123 Test St',
    contactPerson: null,
    profileComplete: false,
    role: 'USER' as const,
    status: 'ACTIVE' as const,
    terms: true,
    isTwoFactorEnabled: false,
    groupIds: [],
    tagIds: [],
    resourceIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
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
            sendNotification: jest.fn(),
            sendEmailVerification: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      usersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );

      const { password: _, ...expectedResult } = mockUser;
      expect(result).toEqual(expectedResult);
    });

    it('should return null for invalid password', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      usersService.findByEmail.mockResolvedValue(mockUser);
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

      usersService.findByEmail.mockResolvedValue(userWithoutPassword);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens with user info', async () => {
      const user = {
        id: mockUser.id,
        email: mockUser.email,
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
        role: mockUser.role,
        profileComplete: mockUser.profileComplete,
        emailVerified: mockUser.emailVerified,
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
        firstname: user.firstname,
        lastname: user.lastname,
        profileComplete: user.profileComplete,
        emailVerified: !!user.emailVerified,
      });
      expect(tokenService.createRefreshToken).toHaveBeenCalledWith(user.id);
      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          profileComplete: user.profileComplete,
          emailVerified: !!user.emailVerified,
        },
      });
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens for valid refresh token', async () => {
      const oldRefreshToken = 'old-refresh-token';
      const userId = mockUser.id;
      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';

      tokenService.validateRefreshToken.mockResolvedValue({
        valid: true,
        userId,
      });
      tokenService.consumeRefreshToken.mockResolvedValue(undefined);
      usersService.findOne.mockResolvedValue(mockUser);
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
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
        profileComplete: mockUser.profileComplete,
        emailVerified: !!mockUser.emailVerified,
      });
      expect(tokenService.createRefreshToken).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstname: mockUser.firstname,
          lastname: mockUser.lastname,
          role: mockUser.role,
          profileComplete: mockUser.profileComplete,
          emailVerified: !!mockUser.emailVerified,
        },
      });
    });

    it('should throw BadRequestException for invalid refresh token', async () => {
      const invalidRefreshToken = 'invalid-token';

      tokenService.validateRefreshToken.mockResolvedValue({
        valid: false,
        userId: undefined,
      });

      await expect(service.refreshTokens(invalidRefreshToken)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.refreshTokens(invalidRefreshToken)).rejects.toThrow(
        'Invalid or expired refresh token',
      );

      expect(tokenService.validateRefreshToken).toHaveBeenCalledWith(
        invalidRefreshToken,
      );
    });

    it('should throw NotFoundException if user not found after token validation', async () => {
      const refreshToken = 'valid-token';
      const userId = 'non-existent-user';

      tokenService.validateRefreshToken.mockResolvedValue({
        valid: true,
        userId,
      });
      tokenService.consumeRefreshToken.mockResolvedValue(undefined);
      usersService.findOne.mockResolvedValue(undefined as any);

      await expect(service.refreshTokens(refreshToken)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.refreshTokens(refreshToken)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('register', () => {
    it('should create user and send welcome email', async () => {
      const createUserDto = {
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        password: 'SecurePass123',
        terms: true,
      };
      const createdUser = { ...mockUser, ...createUserDto };

      usersService.create.mockResolvedValue(createdUser);
      emailService.sendWelcomeEmail.mockResolvedValue({ success: true });

      const result = await service.register(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith({
        userName: `${createdUser.firstname} ${createdUser.lastname}`,
        userEmail: createdUser.email,
        registrationDate: expect.any(String),
        loginUrl: expect.stringContaining('/login'),
        unsubscribeUrl: expect.stringContaining('/unsubscribe'),
        supportUrl: expect.stringContaining('/support'),
      });
      expect(result).toEqual(createdUser);
    });

    it('should create user even if welcome email fails', async () => {
      const createUserDto = {
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        password: 'SecurePass123',
        terms: true,
      };
      const createdUser = { ...mockUser, ...createUserDto };

      usersService.create.mockResolvedValue(createdUser);
      emailService.sendWelcomeEmail.mockRejectedValue(
        new Error('Email service error'),
      );

      const result = await service.register(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(emailService.sendWelcomeEmail).toHaveBeenCalled();
      expect(result).toEqual(createdUser);
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email for existing user', async () => {
      const email = 'test@example.com';
      const resetToken = 'reset-token-123';

      usersService.findByEmail.mockResolvedValue(mockUser);
      tokenService.createPasswordResetToken.mockResolvedValue(resetToken);
      emailService.sendPasswordResetEmail.mockResolvedValue({ success: true });

      const result = await service.forgotPassword(email);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(tokenService.createPasswordResetToken).toHaveBeenCalledWith(email);
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith({
        userName: `${mockUser.firstname} ${mockUser.lastname}`,
        userEmail: mockUser.email,
        resetUrl: expect.stringContaining(
          `/reset-password?token=${resetToken}`,
        ),
        supportUrl: expect.stringContaining('/support'),
        securityUrl: expect.stringContaining('/security'),
      });
      expect(result.message).toContain('Se ha enviado un email');
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const email = 'nonexistent@example.com';

      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.forgotPassword(email)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.forgotPassword(email)).rejects.toThrow(
        'No se encontró un usuario con ese email',
      );
    });

    it('should throw BadRequestException if email sending fails', async () => {
      const email = 'test@example.com';
      const resetToken = 'reset-token-123';

      usersService.findByEmail.mockResolvedValue(mockUser);
      tokenService.createPasswordResetToken.mockResolvedValue(resetToken);
      emailService.sendPasswordResetEmail.mockRejectedValue(
        new Error('Email error'),
      );

      await expect(service.forgotPassword(email)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.forgotPassword(email)).rejects.toThrow(
        'Error enviando el email de restablecimiento',
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const token = 'valid-reset-token';
      const newPassword = 'newPassword123';
      const hashedPassword = 'hashedNewPassword';

      tokenService.validatePasswordResetToken.mockResolvedValue({
        valid: true,
        email: mockUser.email,
      });
      usersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      usersService.updatePassword.mockResolvedValue(mockUser);
      tokenService.consumePasswordResetToken.mockResolvedValue(undefined);
      emailService.sendNotification.mockResolvedValue({ success: true });

      const result = await service.resetPassword(token, newPassword);

      expect(tokenService.validatePasswordResetToken).toHaveBeenCalledWith(
        token,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(usersService.updatePassword).toHaveBeenCalledWith(
        mockUser.id,
        hashedPassword,
      );
      expect(tokenService.consumePasswordResetToken).toHaveBeenCalledWith(
        token,
      );
      expect(result.message).toBe('Contraseña actualizada exitosamente');
    });

    it('should throw BadRequestException for invalid token', async () => {
      const token = 'invalid-token';
      const newPassword = 'newPassword123';

      tokenService.validatePasswordResetToken.mockResolvedValue({
        valid: false,
        email: undefined,
      });

      await expect(service.resetPassword(token, newPassword)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.resetPassword(token, newPassword)).rejects.toThrow(
        'Token inválido o expirado',
      );
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const token = 'valid-token';
      const newPassword = 'newPassword123';

      tokenService.validatePasswordResetToken.mockResolvedValue({
        valid: true,
        email: 'nonexistent@example.com',
      });
      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.resetPassword(token, newPassword)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.resetPassword(token, newPassword)).rejects.toThrow(
        'Usuario no encontrado',
      );
    });

    it('should throw error when token validation returns no email', async () => {
      const token = 'token-without-email';
      const newPassword = 'newPassword123';

      tokenService.validatePasswordResetToken.mockResolvedValue({
        valid: true,
        email: null, // No email in token validation
      });

      await expect(service.resetPassword(token, newPassword)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.resetPassword(token, newPassword)).rejects.toThrow(
        'Token inválido - email no encontrado',
      );
    });
  });

  describe('sendEmailVerification', () => {
    it('should send verification email for unverified user', async () => {
      const email = 'test@example.com';
      const verificationToken = 'verification-token-123';

      usersService.findByEmail.mockResolvedValue(mockUser);
      tokenService.createEmailVerificationToken.mockResolvedValue(
        verificationToken,
      );
      emailService.sendEmailVerification.mockResolvedValue({ success: true });

      const result = await service.sendEmailVerification(email);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(tokenService.createEmailVerificationToken).toHaveBeenCalledWith(
        email,
      );
      expect(emailService.sendEmailVerification).toHaveBeenCalledWith({
        userName: `${mockUser.firstname} ${mockUser.lastname}`,
        userEmail: mockUser.email,
        verificationUrl: expect.stringContaining(
          `/verify-email?token=${verificationToken}`,
        ),
        supportUrl: expect.stringContaining('/support'),
      });
      expect(result.message).toBe('Se ha enviado un email de verificación');
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const email = 'nonexistent@example.com';

      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.sendEmailVerification(email)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.sendEmailVerification(email)).rejects.toThrow(
        'No se encontró un usuario con ese email',
      );
    });

    it('should throw BadRequestException for already verified user', async () => {
      const email = 'test@example.com';
      const verifiedUser = { ...mockUser, emailVerified: new Date() };

      usersService.findByEmail.mockResolvedValue(verifiedUser);

      await expect(service.sendEmailVerification(email)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.sendEmailVerification(email)).rejects.toThrow(
        'El email ya está verificado',
      );
    });

    it('should throw BadRequestException if email sending fails', async () => {
      const email = 'test@example.com';
      const verificationToken = 'verification-token-123';

      usersService.findByEmail.mockResolvedValue(mockUser);
      tokenService.createEmailVerificationToken.mockResolvedValue(
        verificationToken,
      );
      emailService.sendEmailVerification.mockRejectedValue(
        new Error('Email error'),
      );

      await expect(service.sendEmailVerification(email)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.sendEmailVerification(email)).rejects.toThrow(
        'Error enviando el email de verificación',
      );
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      const token = 'valid-verification-token';

      tokenService.validateEmailVerificationToken.mockResolvedValue({
        valid: true,
        email: mockUser.email,
      });
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.markEmailAsVerified.mockResolvedValue(mockUser);
      tokenService.consumeEmailVerificationToken.mockResolvedValue(undefined);
      emailService.sendNotification.mockResolvedValue({ success: true });

      const result = await service.verifyEmail(token);

      expect(tokenService.validateEmailVerificationToken).toHaveBeenCalledWith(
        token,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(usersService.markEmailAsVerified).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(tokenService.consumeEmailVerificationToken).toHaveBeenCalledWith(
        token,
      );
      expect(result.message).toBe('Email verificado exitosamente');
    });

    it('should throw BadRequestException for invalid token', async () => {
      const token = 'invalid-token';

      tokenService.validateEmailVerificationToken.mockResolvedValue({
        valid: false,
        email: undefined,
      });

      await expect(service.verifyEmail(token)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.verifyEmail(token)).rejects.toThrow(
        'Token inválido o expirado',
      );
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const token = 'valid-token';

      tokenService.validateEmailVerificationToken.mockResolvedValue({
        valid: true,
        email: 'nonexistent@example.com',
      });
      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.verifyEmail(token)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.verifyEmail(token)).rejects.toThrow(
        'Usuario no encontrado',
      );
    });

    it('should throw error when token validation returns no email', async () => {
      const token = 'token-without-email';

      tokenService.validateEmailVerificationToken.mockResolvedValue({
        valid: true,
        email: null, // No email in token validation
      });

      await expect(service.verifyEmail(token)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.verifyEmail(token)).rejects.toThrow(
        'Token inválido - email no encontrado',
      );
    });

    it('should complete verification even when notification email fails', async () => {
      const token = 'valid-verification-token';

      tokenService.validateEmailVerificationToken.mockResolvedValue({
        valid: true,
        email: mockUser.email,
      });
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.markEmailAsVerified.mockResolvedValue(undefined);
      tokenService.consumeEmailVerificationToken.mockResolvedValue(undefined);
      
      // Mock email service to throw error
      emailService.sendNotification.mockRejectedValue(new Error('Email service error'));

      // Mock console.log to spy on error logging
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.verifyEmail(token);

      expect(result).toEqual({ message: 'Email verificado exitosamente' });
      expect(usersService.markEmailAsVerified).toHaveBeenCalledWith(mockUser.id);
      expect(tokenService.consumeEmailVerificationToken).toHaveBeenCalledWith(token);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error enviando notificación de email verificado:',
        'Email service error',
      );

      consoleSpy.mockRestore();
    });
  });

  describe('completeProfile', () => {
    const userId = 'user-123';
    const onboardingDto = {
      phone: '+1234567890',
      company: 'Acme Inc.',
      address: '123 Main St',
    };

    beforeEach(() => {
      usersService.findOne.mockClear();
      usersService.update.mockClear();
      emailService.sendNotification.mockClear();
    });

    it('should complete user profile successfully', async () => {
      const updatedUser = {
        ...mockUser,
        ...onboardingDto,
        profileComplete: true,
      };

      usersService.findOne.mockResolvedValue(mockUser);
      usersService.update.mockResolvedValue(updatedUser);
      emailService.sendNotification.mockResolvedValue(undefined);

      const result = await service.completeProfile(userId, onboardingDto);

      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(usersService.update).toHaveBeenCalledWith(userId, {
        ...onboardingDto,
        profileComplete: true,
      });
      expect(result).toEqual({
        message: 'Profile completed successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          phone: updatedUser.phone,
          company: updatedUser.company,
          address: updatedUser.address,
          contactPerson: updatedUser.contactPerson,
          profileComplete: true,
          role: updatedUser.role,
        },
      });
      expect(emailService.sendNotification).toHaveBeenCalledWith(
        updatedUser.email,
        `${updatedUser.firstname} ${updatedUser.lastname}`.trim(),
        '¡Perfil completado exitosamente!',
        'Has completado tu perfil en Alkitu. Ahora puedes acceder a todas las funcionalidades de la plataforma.',
        'Ir al Dashboard',
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      usersService.findOne.mockResolvedValue(null);

      await expect(service.completeProfile(userId, onboardingDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.completeProfile(userId, onboardingDto)).rejects.toThrow(
        'Usuario no encontrado',
      );

      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(usersService.update).not.toHaveBeenCalled();
    });

    it('should complete profile even if notification email fails', async () => {
      const updatedUser = {
        ...mockUser,
        ...onboardingDto,
        profileComplete: true,
      };

      usersService.findOne.mockResolvedValue(mockUser);
      usersService.update.mockResolvedValue(updatedUser);
      emailService.sendNotification.mockRejectedValue(
        new Error('Email service error'),
      );

      // Mock console.log to spy on error logging
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await service.completeProfile(userId, onboardingDto);

      expect(result).toEqual({
        message: 'Profile completed successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          phone: updatedUser.phone,
          company: updatedUser.company,
          address: updatedUser.address,
          contactPerson: updatedUser.contactPerson,
          profileComplete: true,
          role: updatedUser.role,
        },
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error enviando notificación de perfil completado:',
        'Email service error',
      );

      consoleSpy.mockRestore();
    });

    it('should handle partial onboarding data (only phone)', async () => {
      const partialDto = {
        phone: '+9876543210',
      };
      const updatedUser = {
        ...mockUser,
        phone: partialDto.phone,
        profileComplete: true,
      };

      usersService.findOne.mockResolvedValue(mockUser);
      usersService.update.mockResolvedValue(updatedUser);
      emailService.sendNotification.mockResolvedValue(undefined);

      const result = await service.completeProfile(userId, partialDto);

      expect(usersService.update).toHaveBeenCalledWith(userId, {
        ...partialDto,
        profileComplete: true,
      });
      expect(result.user.phone).toBe(partialDto.phone);
      expect(result.user.profileComplete).toBe(true);
    });

    it('should handle onboarding with all optional fields', async () => {
      const fullDto = {
        phone: '+1234567890',
        company: 'Test Corp',
        address: '456 Oak Ave',
      };
      const updatedUser = {
        ...mockUser,
        ...fullDto,
        profileComplete: true,
      };

      usersService.findOne.mockResolvedValue(mockUser);
      usersService.update.mockResolvedValue(updatedUser);
      emailService.sendNotification.mockResolvedValue(undefined);

      const result = await service.completeProfile(userId, fullDto);

      expect(result.user.phone).toBe(fullDto.phone);
      expect(result.user.company).toBe(fullDto.company);
      expect(result.user.address).toBe(fullDto.address);
      expect(result.user.profileComplete).toBe(true);
    });
  });
});
