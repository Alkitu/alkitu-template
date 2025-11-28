/* eslint-disable @typescript-eslint/unbound-method */
// @ts-nocheck

// 

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { PrismaService } from '@/prisma.service';

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
    const mockPrismaService = {
      passwordResetToken: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        create: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn(),
        delete: jest.fn().mockResolvedValue({}),
      },
      verificationToken: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        create: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn(),
        delete: jest.fn().mockResolvedValue({}),
      },
      refreshToken: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        create: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn(),
        delete: jest.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: PrismaService,
          useValue: PrismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    prismaService = module.get<PrismaService>(
      PrismaService,
    ) as jest.Mocked<PrismaService>;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
