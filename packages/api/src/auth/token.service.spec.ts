/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { PrismaService } from '../prisma.service';

// Mock crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('mock-token-123456789'),
  }),
}));

describe('TokenService', () => {
  let service: TokenService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: PrismaService,
          useValue: {
            passwordResetToken: {
              create: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
            },
            verificationToken: {
              create: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
            },
            refreshToken: {
              create: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    prismaService = module.get<PrismaService>(
      PrismaService,
    ) as jest.Mocked<PrismaService>;

    // Setup default mock behaviors using any to bypass TypeScript issues
    (prismaService.passwordResetToken.deleteMany as any).mockResolvedValue({
      count: 0,
    });
    (prismaService.passwordResetToken.create as any).mockResolvedValue({
      id: 'token-id',
      email: 'test@example.com',
      token: 'reset-token-123',
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 3600000),
    });
    (prismaService.passwordResetToken.findUnique as any).mockResolvedValue({
      id: 'token-id',
      email: 'test@example.com',
      token: 'reset-token-123',
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 3600000),
    });
    (prismaService.passwordResetToken.delete as any).mockResolvedValue({
      id: 'token-id',
      token: 'reset-token-123',
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 3600000),
    });

    (prismaService.verificationToken.create as any).mockResolvedValue({
      id: 'token-id',
      email: 'test@example.com',
      token: 'verify-token-123',
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 3600000),
    });
    (prismaService.verificationToken.findUnique as any).mockResolvedValue({
      id: 'token-id',
      email: 'test@example.com',
      token: 'verify-token-123',
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 3600000),
    });

    (prismaService.refreshToken.create as any).mockResolvedValue({
      id: 'token-id',
      token: 'refresh-token-123',
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 86400000),
    });
    (prismaService.refreshToken.findUnique as any).mockResolvedValue({
      id: 'token-id',
      token: 'refresh-token-123',
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 86400000),
    });
    (prismaService.refreshToken.delete as any).mockResolvedValue({
      id: 'token-id',
      token: 'refresh-token-123',
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 86400000),
    });

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('createPasswordResetToken', () => {
    it('should create password reset token successfully', async () => {
      const email = 'test@example.com';

      const result = await service.createPasswordResetToken(email);

      expect(prismaService.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { email },
      });

      expect(prismaService.passwordResetToken.create).toHaveBeenCalledWith({
        data: {
          email,
          token: 'mock-token-123456789',
          expires: expect.any(Date),
        },
      });

      expect(result).toBe('mock-token-123456789');
    });
  });

  describe('validatePasswordResetToken', () => {
    it('should validate valid token successfully', async () => {
      const token = 'valid-token';
      const email = 'test@example.com';
      const futureDate = new Date(Date.now() + 30 * 60 * 1000);

      const mockTokenRecord = {
        id: 'token-id',
        email,
        token,
        expires: futureDate,
      };

      (
        prismaService.passwordResetToken.findUnique as jest.Mock
      ).mockResolvedValue(mockTokenRecord);

      const result = await service.validatePasswordResetToken(token);

      expect(result).toEqual({
        valid: true,
        email,
      });
    });

    it('should return invalid for non-existent token', async () => {
      const token = 'non-existent-token';

      (
        prismaService.passwordResetToken.findUnique as jest.Mock
      ).mockResolvedValue(null);

      const result = await service.validatePasswordResetToken(token);

      expect(result).toEqual({
        valid: false,
      });
    });

    it('should return invalid and delete expired token', async () => {
      const token = 'expired-token';
      const email = 'test@example.com';
      const pastDate = new Date(Date.now() - 30 * 60 * 1000);

      const mockTokenRecord = {
        id: 'token-id',
        email,
        token,
        expires: pastDate,
      };

      (
        prismaService.passwordResetToken.findUnique as jest.Mock
      ).mockResolvedValue(mockTokenRecord);

      const result = await service.validatePasswordResetToken(token);

      expect(prismaService.passwordResetToken.delete).toHaveBeenCalledWith({
        where: { token },
      });

      expect(result).toEqual({
        valid: false,
      });
    });
  });

  describe('consumePasswordResetToken', () => {
    it('should delete token successfully', async () => {
      const token = 'token-to-consume';

      await service.consumePasswordResetToken(token);

      expect(prismaService.passwordResetToken.delete).toHaveBeenCalledWith({
        where: { token },
      });
    });
  });

  describe('createEmailVerificationToken', () => {
    it('should create email verification token successfully', async () => {
      const email = 'test@example.com';

      const result = await service.createEmailVerificationToken(email);

      expect(prismaService.verificationToken.deleteMany).toHaveBeenCalledWith({
        where: { identifier: email },
      });

      expect(prismaService.verificationToken.create).toHaveBeenCalledWith({
        data: {
          identifier: email,
          token: 'mock-token-123456789',
          expires: expect.any(Date),
        },
      });

      expect(result).toBe('mock-token-123456789');
    });
  });

  describe('validateEmailVerificationToken', () => {
    it('should validate valid email verification token successfully', async () => {
      const token = 'valid-token';
      const email = 'test@example.com';
      const futureDate = new Date(Date.now() + 12 * 60 * 60 * 1000);

      const mockTokenRecord = {
        id: 'token-id',
        identifier: email,
        token,
        expires: futureDate,
      };

      (
        prismaService.verificationToken.findUnique as jest.Mock
      ).mockResolvedValue(mockTokenRecord);

      const result = await service.validateEmailVerificationToken(token);

      expect(result).toEqual({
        valid: true,
        email,
      });
    });

    it('should return invalid for non-existent email verification token', async () => {
      const token = 'non-existent-token';

      (
        prismaService.verificationToken.findUnique as jest.Mock
      ).mockResolvedValue(null);

      const result = await service.validateEmailVerificationToken(token);

      expect(result).toEqual({
        valid: false,
      });
    });
  });

  describe('createRefreshToken', () => {
    it('should create a refresh token successfully', async () => {
      const userId = 'user-id-123';
      const result = await service.createRefreshToken(userId);

      expect(prismaService.refreshToken.create).toHaveBeenCalledWith({
        data: {
          userId,
          token: 'mock-token-123456789',
          expires: expect.any(Date),
        },
      });
      expect(result).toBe('mock-token-123456789');
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate a valid refresh token successfully', async () => {
      const token = 'valid-refresh-token';
      const userId = 'user-id-123';
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const mockTokenRecord = {
        id: 'token-id',
        userId,
        token,
        expires: futureDate,
      };

      (prismaService.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        mockTokenRecord,
      );

      const result = await service.validateRefreshToken(token);

      expect(result).toEqual({
        valid: true,
        userId,
      });
    });

    it('should return invalid for non-existent refresh token', async () => {
      const token = 'non-existent-refresh-token';

      (prismaService.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      const result = await service.validateRefreshToken(token);

      expect(result).toEqual({
        valid: false,
      });
    });

    it('should return invalid and delete expired refresh token', async () => {
      const token = 'expired-refresh-token';
      const userId = 'user-id-123';
      const pastDate = new Date(Date.now() - 1 * 60 * 60 * 1000);

      const mockTokenRecord = {
        id: 'token-id',
        userId,
        token,
        expires: pastDate,
      };

      (prismaService.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        mockTokenRecord,
      );

      const result = await service.validateRefreshToken(token);

      expect(prismaService.refreshToken.delete).toHaveBeenCalledWith({
        where: { token },
      });

      expect(result).toEqual({
        valid: false,
      });
    });
  });

  describe('consumeRefreshToken', () => {
    it('should delete refresh token successfully', async () => {
      const token = 'token-to-consume';

      await service.consumeRefreshToken(token);

      expect(prismaService.refreshToken.delete).toHaveBeenCalledWith({
        where: { token },
      });
    });
  });

  describe('validateEmailVerificationToken - expired token', () => {
    it('should return invalid and delete expired email verification token', async () => {
      const token = 'expired-email-verification-token';
      const email = 'test@example.com';
      const pastDate = new Date(Date.now() - 1 * 60 * 60 * 1000);

      const mockTokenRecord = {
        id: 'token-id',
        identifier: email,
        token,
        expires: pastDate,
      };

      (
        prismaService.verificationToken.findUnique as jest.Mock
      ).mockResolvedValue(mockTokenRecord);

      const result = await service.validateEmailVerificationToken(token);

      expect(prismaService.verificationToken.delete).toHaveBeenCalledWith({
        where: { token },
      });

      expect(result).toEqual({
        valid: false,
      });
    });
  });

  describe('consumeEmailVerificationToken', () => {
    it('should delete email verification token successfully', async () => {
      const token = 'token-to-consume';

      await service.consumeEmailVerificationToken(token);

      expect(prismaService.verificationToken.delete).toHaveBeenCalledWith({
        where: { token },
      });
    });
  });

  describe('findRefreshToken', () => {
    it('should find refresh token successfully', async () => {
      const token = 'test-refresh-token';
      const mockTokenRecord = {
        id: 'token-id',
        token,
        userId: 'user-id-123',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      (prismaService.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        mockTokenRecord,
      );

      const result = await service.findRefreshToken(token);

      expect(prismaService.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toEqual(mockTokenRecord);
    });

    it('should return null when refresh token not found', async () => {
      const token = 'non-existent-token';

      (prismaService.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      const result = await service.findRefreshToken(token);

      expect(result).toBeNull();
    });
  });

  describe('userHasValidRefreshTokens', () => {
    it('should return true when user has valid refresh tokens', async () => {
      const userId = 'user-id-123';

      (prismaService.refreshToken.count as jest.Mock).mockResolvedValue(2);

      const result = await service.userHasValidRefreshTokens(userId);

      expect(prismaService.refreshToken.count).toHaveBeenCalledWith({
        where: {
          userId,
          expires: { gt: expect.any(Date) },
        },
      });
      expect(result).toBe(true);
    });

    it('should return false when user has no valid refresh tokens', async () => {
      const userId = 'user-id-456';

      (prismaService.refreshToken.count as jest.Mock).mockResolvedValue(0);

      const result = await service.userHasValidRefreshTokens(userId);

      expect(prismaService.refreshToken.count).toHaveBeenCalledWith({
        where: {
          userId,
          expires: { gt: expect.any(Date) },
        },
      });
      expect(result).toBe(false);
    });
  });

  describe('revokeAllUserSessions', () => {
    it('should revoke all user sessions successfully', async () => {
      const userId = 'user-id-123';

      (prismaService.refreshToken.deleteMany as jest.Mock).mockResolvedValue({
        count: 3,
      });

      const result = await service.revokeAllUserSessions(userId);

      expect(prismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toBe(3);
    });

    it('should handle user with no sessions to revoke', async () => {
      const userId = 'user-id-456';

      (prismaService.refreshToken.deleteMany as jest.Mock).mockResolvedValue({
        count: 0,
      });

      const result = await service.revokeAllUserSessions(userId);

      expect(result).toBe(0);
    });
  });

  describe('revokeAllSessions', () => {
    it('should revoke all sessions successfully', async () => {
      (prismaService.refreshToken.deleteMany as jest.Mock).mockResolvedValue({
        count: 15,
      });

      const result = await service.revokeAllSessions();

      expect(prismaService.refreshToken.deleteMany).toHaveBeenCalledWith({});
      expect(result).toBe(15);
    });

    it('should handle no sessions to revoke', async () => {
      (prismaService.refreshToken.deleteMany as jest.Mock).mockResolvedValue({
        count: 0,
      });

      const result = await service.revokeAllSessions();

      expect(result).toBe(0);
    });
  });

  describe('cleanExpiredTokens', () => {
    it('should clean expired tokens successfully', async () => {
      (
        prismaService.passwordResetToken.deleteMany as jest.Mock
      ).mockResolvedValue({ count: 3 });
      (
        prismaService.verificationToken.deleteMany as jest.Mock
      ).mockResolvedValue({ count: 5 });
      (prismaService.refreshToken.deleteMany as jest.Mock).mockResolvedValue({
        count: 2,
      });

      const result = await service.cleanExpiredTokens();

      expect(prismaService.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { expires: { lt: expect.any(Date) } },
      });

      expect(prismaService.verificationToken.deleteMany).toHaveBeenCalledWith({
        where: { expires: { lt: expect.any(Date) } },
      });

      expect(prismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { expires: { lt: expect.any(Date) } },
      });

      expect(result).toEqual({
        passwordResetTokens: 3,
        verificationTokens: 5,
        refreshTokens: 2,
      });
    });

    it('should handle no expired tokens found', async () => {
      (
        prismaService.passwordResetToken.deleteMany as jest.Mock
      ).mockResolvedValue({ count: 0 });
      (
        prismaService.verificationToken.deleteMany as jest.Mock
      ).mockResolvedValue({ count: 0 });
      (prismaService.refreshToken.deleteMany as jest.Mock).mockResolvedValue({
        count: 0,
      });

      const result = await service.cleanExpiredTokens();

      expect(result).toEqual({
        passwordResetTokens: 0,
        verificationTokens: 0,
        refreshTokens: 0,
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
