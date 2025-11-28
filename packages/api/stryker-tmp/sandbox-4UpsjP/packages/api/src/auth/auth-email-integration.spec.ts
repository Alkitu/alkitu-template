/* eslint-disable @typescript-eslint/unbound-method */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService Email Integration', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let emailService: jest.Mocked<EmailService>;
  let tokenService: jest.Mocked<TokenService>;

  const mockUser = {
    id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    name: 'Test',
    lastName: 'User',
    password: 'hashed-password',
    contactNumber: '+1234567890',
    terms: true,
    emailVerified: null,
    image: null,
    isTwoFactorEnabled: false,
    role: UserRole.CLIENT,
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: null,
    groupIds: [],
    tagIds: [],
    resourceIds: [],
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
            updatePassword: jest.fn(),
            markEmailAsVerified: jest.fn(),
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
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
    emailService = module.get<EmailService>(
      EmailService,
    ) as jest.Mocked<EmailService>;
    tokenService = module.get<TokenService>(
      TokenService,
    ) as jest.Mocked<TokenService>;

    jest.clearAllMocks();
  });

  describe('Registration Flow with Welcome Email', () => {
    it('should complete full registration flow with welcome email', async () => {
      const createUserDto = {
        email: 'newuser@example.com',
        name: 'New',
        lastName: 'User',
        password: 'password123',
        contactNumber: '+1234567890',
        terms: true,
      };

      const createdUser = { ...mockUser, ...createUserDto };

      usersService.create.mockResolvedValue(createdUser);
      emailService.sendWelcomeEmail.mockResolvedValue({
        success: true,
        messageId: 'welcome-123',
      });

      const result = await authService.register(createUserDto);

      // Verify user creation
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);

      // Verify welcome email sent
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith({
        userName: 'New User',
        userEmail: 'newuser@example.com',
        registrationDate: expect.any(String),
        loginUrl: expect.stringContaining('/login'),
        unsubscribeUrl: expect.stringContaining('/unsubscribe'),
        supportUrl: expect.stringContaining('/support'),
      });

      expect(result).toEqual(createdUser);
    });

    it('should not fail registration if welcome email fails', async () => {
      const createUserDto = {
        email: 'newuser@example.com',
        name: 'New',
        lastName: 'User',
        password: 'password123',
        contactNumber: '+1234567890',
        terms: true,
      };

      const createdUser = { ...mockUser, ...createUserDto };

      usersService.create.mockResolvedValue(createdUser);
      emailService.sendWelcomeEmail.mockRejectedValue(
        new Error('Email service down'),
      );

      // Should not throw error
      const result = await authService.register(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(emailService.sendWelcomeEmail).toHaveBeenCalled();
      expect(result).toEqual(createdUser);
    });
  });

  describe('Password Reset Flow', () => {
    it('should complete full password reset flow', async () => {
      const email = 'test@example.com';
      const newPassword = 'newpassword123';
      const resetToken = 'reset-token-123';

      // Step 1: Forgot password
      usersService.findByEmail.mockResolvedValue(mockUser);
      tokenService.createPasswordResetToken.mockResolvedValue(resetToken);
      emailService.sendPasswordResetEmail.mockResolvedValue({
        success: true,
        messageId: 'reset-123',
      });

      const forgotResult = await authService.forgotPassword(email);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(tokenService.createPasswordResetToken).toHaveBeenCalledWith(email);
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith({
        userName: 'Test User',
        userEmail: email,
        resetUrl: expect.stringContaining(`token=${resetToken}`),
        supportUrl: expect.stringContaining('/support'),
        securityUrl: expect.stringContaining('/security'),
      });
      expect(forgotResult.message).toContain('instrucciones para restablecer');

      // Step 2: Reset password with token
      tokenService.validatePasswordResetToken.mockResolvedValue({
        valid: true,
        email,
      });
      usersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.hash.mockResolvedValue('new-hashed-password' as never);
      usersService.updatePassword.mockResolvedValue(mockUser);
      tokenService.consumePasswordResetToken.mockResolvedValue();
      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'notification-123',
      });

      const resetResult = await authService.resetPassword(
        resetToken,
        newPassword,
      );

      expect(tokenService.validatePasswordResetToken).toHaveBeenCalledWith(
        resetToken,
      );
      expect(usersService.updatePassword).toHaveBeenCalledWith(
        mockUser.id,
        'new-hashed-password',
      );
      expect(tokenService.consumePasswordResetToken).toHaveBeenCalledWith(
        resetToken,
      );
      expect(emailService.sendNotification).toHaveBeenCalledWith(
        email,
        'Test User',
        'Contraseña actualizada',
        expect.stringContaining('actualizada exitosamente'),
        'Ir a Login',
        expect.stringContaining('/login'),
      );
      expect(resetResult.message).toContain('actualizada exitosamente');
    });

    it('should handle invalid reset token', async () => {
      const invalidToken = 'invalid-token';
      const newPassword = 'newpassword123';

      tokenService.validatePasswordResetToken.mockResolvedValue({
        valid: false,
      });

      await expect(
        authService.resetPassword(invalidToken, newPassword),
      ).rejects.toThrow(BadRequestException);
      await expect(
        authService.resetPassword(invalidToken, newPassword),
      ).rejects.toThrow('Token inválido o expirado');

      expect(usersService.updatePassword).not.toHaveBeenCalled();
      expect(tokenService.consumePasswordResetToken).not.toHaveBeenCalled();
    });

    it('should handle user not found in forgot password', async () => {
      const email = 'notfound@example.com';

      usersService.findByEmail.mockResolvedValue(null);

      await expect(authService.forgotPassword(email)).rejects.toThrow(
        NotFoundException,
      );
      await expect(authService.forgotPassword(email)).rejects.toThrow(
        'No se encontró un usuario con ese email',
      );

      expect(tokenService.createPasswordResetToken).not.toHaveBeenCalled();
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });

  describe('Email Verification Flow', () => {
    it('should complete full email verification flow', async () => {
      const email = 'test@example.com';
      const verificationToken = 'verification-token-123';

      // Step 1: Send verification email
      const unverifiedUser = { ...mockUser, emailVerified: null };
      usersService.findByEmail.mockResolvedValue(unverifiedUser);
      tokenService.createEmailVerificationToken.mockResolvedValue(
        verificationToken,
      );
      emailService.sendEmailVerification.mockResolvedValue({
        success: true,
        messageId: 'verification-123',
      });

      const sendResult = await authService.sendEmailVerification(email);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(tokenService.createEmailVerificationToken).toHaveBeenCalledWith(
        email,
      );
      expect(emailService.sendEmailVerification).toHaveBeenCalledWith({
        userName: 'Test User',
        userEmail: email,
        verificationUrl: expect.stringContaining(`token=${verificationToken}`),
        supportUrl: expect.stringContaining('/support'),
      });
      expect(sendResult.message).toContain('email de verificación');

      // Step 2: Verify email with token
      tokenService.validateEmailVerificationToken.mockResolvedValue({
        valid: true,
        email,
      });
      usersService.findByEmail.mockResolvedValue(unverifiedUser);
      usersService.markEmailAsVerified.mockResolvedValue({
        ...mockUser,
        emailVerified: new Date(),
      });
      tokenService.consumeEmailVerificationToken.mockResolvedValue();
      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'notification-123',
      });

      const verifyResult = await authService.verifyEmail(verificationToken);

      expect(tokenService.validateEmailVerificationToken).toHaveBeenCalledWith(
        verificationToken,
      );
      expect(usersService.markEmailAsVerified).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(tokenService.consumeEmailVerificationToken).toHaveBeenCalledWith(
        verificationToken,
      );
      expect(emailService.sendNotification).toHaveBeenCalledWith(
        email,
        'Test User',
        '¡Email verificado exitosamente!',
        expect.stringContaining('verificada'),
        'Ir al Dashboard',
        expect.stringContaining('/dashboard'),
      );
      expect(verifyResult.message).toContain('verificado exitosamente');
    });

    it('should handle already verified email', async () => {
      const email = 'verified@example.com';
      const verifiedUser = { ...mockUser, emailVerified: new Date() };

      usersService.findByEmail.mockResolvedValue(verifiedUser);

      await expect(authService.sendEmailVerification(email)).rejects.toThrow(
        BadRequestException,
      );
      await expect(authService.sendEmailVerification(email)).rejects.toThrow(
        'El email ya está verificado',
      );

      expect(tokenService.createEmailVerificationToken).not.toHaveBeenCalled();
      expect(emailService.sendEmailVerification).not.toHaveBeenCalled();
    });

    it('should handle invalid verification token', async () => {
      const invalidToken = 'invalid-verification-token';

      tokenService.validateEmailVerificationToken.mockResolvedValue({
        valid: false,
      });

      await expect(authService.verifyEmail(invalidToken)).rejects.toThrow(
        BadRequestException,
      );
      await expect(authService.verifyEmail(invalidToken)).rejects.toThrow(
        'Token inválido o expirado',
      );

      expect(usersService.markEmailAsVerified).not.toHaveBeenCalled();
      expect(tokenService.consumeEmailVerificationToken).not.toHaveBeenCalled();
    });

    it('should handle user not found in email verification', async () => {
      const email = 'notfound@example.com';

      usersService.findByEmail.mockResolvedValue(null);

      await expect(authService.sendEmailVerification(email)).rejects.toThrow(
        NotFoundException,
      );
      await expect(authService.sendEmailVerification(email)).rejects.toThrow(
        'No se encontró un usuario con ese email',
      );

      expect(tokenService.createEmailVerificationToken).not.toHaveBeenCalled();
      expect(emailService.sendEmailVerification).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling in Email Integration', () => {
    it('should handle email service failure in password reset', async () => {
      const email = 'test@example.com';

      usersService.findByEmail.mockResolvedValue(mockUser);
      tokenService.createPasswordResetToken.mockResolvedValue('token-123');
      emailService.sendPasswordResetEmail.mockRejectedValue(
        new Error('Email service unavailable'),
      );

      await expect(authService.forgotPassword(email)).rejects.toThrow(
        BadRequestException,
      );
      await expect(authService.forgotPassword(email)).rejects.toThrow(
        'Error enviando el email de restablecimiento',
      );
    });

    it('should handle email service failure in email verification', async () => {
      const email = 'test@example.com';
      const unverifiedUser = { ...mockUser, emailVerified: null };

      usersService.findByEmail.mockResolvedValue(unverifiedUser);
      tokenService.createEmailVerificationToken.mockResolvedValue('token-123');
      emailService.sendEmailVerification.mockRejectedValue(
        new Error('Email service unavailable'),
      );

      await expect(authService.sendEmailVerification(email)).rejects.toThrow(
        BadRequestException,
      );
      await expect(authService.sendEmailVerification(email)).rejects.toThrow(
        'Error enviando el email de verificación',
      );
    });

    it('should handle notification email failures gracefully', async () => {
      const resetToken = 'reset-token-123';
      const newPassword = 'newpassword123';

      tokenService.validatePasswordResetToken.mockResolvedValue({
        valid: true,
        email: mockUser.email,
      });
      usersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.hash.mockResolvedValue('new-hashed-password' as never);
      usersService.updatePassword.mockResolvedValue(mockUser);
      tokenService.consumePasswordResetToken.mockResolvedValue();
      emailService.sendNotification.mockRejectedValue(
        new Error('Notification failed'),
      );

      // Should not throw error even if notification fails
      const result = await authService.resetPassword(resetToken, newPassword);

      expect(result.message).toContain('actualizada exitosamente');
      expect(usersService.updatePassword).toHaveBeenCalled();
      expect(tokenService.consumePasswordResetToken).toHaveBeenCalled();
    });
  });
});
