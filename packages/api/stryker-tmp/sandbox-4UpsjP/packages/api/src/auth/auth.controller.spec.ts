/* eslint-disable @typescript-eslint/unbound-method */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { mockUser, createUserFixture } from '../test/fixtures/user.fixtures';
import { TokenService } from './token.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            validateUser: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
            sendEmailVerification: jest.fn(),
            verifyEmail: jest.fn(),
            refreshTokens: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            revokeAllSessions: jest.fn(),
            revokeAllUserSessions: jest.fn(),
            cleanExpiredTokens: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(
      AuthService,
    ) as jest.Mocked<AuthService>;
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        password: 'password123',
        contactNumber: '+1234567890',
        terms: true,
      };
      const registeredUser = createUserFixture(createUserDto);

      authService.register.mockResolvedValue(registeredUser as any);

      const result = await controller.register(createUserDto);

      expect(authService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(registeredUser);
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const loginResult = {
        access_token: 'jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          lastName: mockUser.lastName,
          role: mockUser.role,
        },
      };
      const req = { user: mockUser };

      authService.login.mockResolvedValue(loginResult as any);

      const result = await controller.login(req as any, loginDto);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(loginResult);
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      const forgotPasswordDto = { email: 'test@example.com' };
      const expectedResponse = {
        message:
          'Se ha enviado un email con las instrucciones para restablecer tu contraseña',
      };

      authService.forgotPassword.mockResolvedValue(expectedResponse);

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(authService.forgotPassword).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle user not found error', async () => {
      const forgotPasswordDto = { email: 'notfound@example.com' };

      authService.forgotPassword.mockRejectedValue(
        new Error('No se encontró un usuario con ese email'),
      );

      await expect(
        controller.forgotPassword(forgotPasswordDto),
      ).rejects.toThrow('No se encontró un usuario con ese email');
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const resetPasswordDto = {
        token: 'valid-token',
        newPassword: 'newpassword123',
      };
      const expectedResponse = {
        message: 'Contraseña actualizada exitosamente',
      };

      authService.resetPassword.mockResolvedValue(expectedResponse);

      const result = await controller.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledWith(
        'valid-token',
        'newpassword123',
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle invalid token error', async () => {
      const resetPasswordDto = {
        token: 'invalid-token',
        newPassword: 'newpassword123',
      };

      authService.resetPassword.mockRejectedValue(
        new Error('Token inválido o expirado'),
      );

      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(
        'Token inválido o expirado',
      );
    });
  });

  describe('sendEmailVerification', () => {
    it('should send email verification', async () => {
      const emailDto = { email: 'test@example.com' };
      const expectedResponse = {
        message: 'Se ha enviado un email de verificación',
      };

      authService.sendEmailVerification.mockResolvedValue(expectedResponse);

      const result = await controller.sendEmailVerification(emailDto);

      expect(authService.sendEmailVerification).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle email already verified error', async () => {
      const emailDto = { email: 'verified@example.com' };

      authService.sendEmailVerification.mockRejectedValue(
        new Error('El email ya está verificado'),
      );

      await expect(controller.sendEmailVerification(emailDto)).rejects.toThrow(
        'El email ya está verificado',
      );
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const verifyEmailDto = { token: 'valid-verification-token' };
      const expectedResponse = { message: 'Email verificado exitosamente' };

      authService.verifyEmail.mockResolvedValue(expectedResponse);

      const result = await controller.verifyEmail(verifyEmailDto);

      expect(authService.verifyEmail).toHaveBeenCalledWith(
        'valid-verification-token',
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle invalid verification token error', async () => {
      const verifyEmailDto = { token: 'invalid-token' };

      authService.verifyEmail.mockRejectedValue(
        new Error('Token inválido o expirado'),
      );

      await expect(controller.verifyEmail(verifyEmailDto)).rejects.toThrow(
        'Token inválido o expirado',
      );
    });
  });

  describe('logout', () => {
    it('should logout user successfully and revoke sessions', async () => {
      const req = {
        user: {
          id: mockUser.id,
          jti: 'jwt-token-id',
        },
      };
      const expectedResponse = {
        message: 'Logout successful',
        revokedSessions: 2,
      };

      const tokenService = controller['tokenService'] as jest.Mocked<TokenService>;
      tokenService.revokeAllUserSessions = jest.fn().mockResolvedValue(2);

      const result = await controller.logout(req as any);

      expect(tokenService.revokeAllUserSessions).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle logout even if no sessions are revoked', async () => {
      const req = {
        user: {
          id: mockUser.id,
          jti: 'jwt-token-id',
        },
      };
      const expectedResponse = {
        message: 'Logout successful',
        revokedSessions: 0,
      };

      const tokenService = controller['tokenService'] as jest.Mocked<TokenService>;
      tokenService.revokeAllUserSessions = jest.fn().mockResolvedValue(0);

      const result = await controller.logout(req as any);

      expect(tokenService.revokeAllUserSessions).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle token service errors during logout', async () => {
      const req = {
        user: {
          id: mockUser.id,
          jti: 'jwt-token-id',
        },
      };

      const tokenService = controller['tokenService'] as jest.Mocked<TokenService>;
      tokenService.revokeAllUserSessions = jest.fn().mockRejectedValue(
        new Error('Database connection failed')
      );

      await expect(controller.logout(req as any)).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
