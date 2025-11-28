/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../../users/users.service';
import { mockUser } from '../../../test/fixtures/user.fixtures';
import { TokenService } from '../token.service';
import { UserRole } from '@prisma/client';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: jest.Mocked<UsersService>;
  let tokenService: jest.Mocked<TokenService>;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(async () => {
    // Store original environment
    originalEnv = process.env;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            userHasValidRefreshTokens: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
    tokenService = module.get<TokenService>(
      TokenService,
    ) as jest.Mocked<TokenService>;
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('validate', () => {
    it('should return user if found', async () => {
      const payload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
        profileComplete: mockUser.profileComplete,
        emailVerified: !!mockUser.emailVerified,
      };

      usersService.findOne.mockResolvedValue(mockUser as any);

      const result = await strategy.validate(payload);

      expect(usersService.findOne).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual({
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
        firstname: payload.firstname,
        lastname: payload.lastname,
        profileComplete: payload.profileComplete,
        emailVerified: payload.emailVerified,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const payload = {
        sub: 'nonexistent',
        email: 'test@example.com',
        role: UserRole.CLIENT,
        firstname: 'Test',
        lastname: 'User',
        profileComplete: false,
        emailVerified: false,
      };

      usersService.findOne.mockResolvedValue(null as any);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return user when refresh token validation is disabled', async () => {
      // Explicitly set environment variable to false
      process.env.ENFORCE_REFRESH_TOKEN_VALIDATION = 'false';

      const payload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
        profileComplete: mockUser.profileComplete,
        emailVerified: !!mockUser.emailVerified,
      };

      usersService.findOne.mockResolvedValue(mockUser as any);

      const result = await strategy.validate(payload);

      expect(usersService.findOne).toHaveBeenCalledWith(payload.sub);
      expect(tokenService.userHasValidRefreshTokens).not.toHaveBeenCalled();
      expect(result).toEqual({
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
        firstname: payload.firstname,
        lastname: payload.lastname,
        profileComplete: payload.profileComplete,
        emailVerified: payload.emailVerified,
      });
    });

    it('should return user when refresh token validation is enabled and user has valid tokens', async () => {
      // Enable refresh token validation
      process.env.ENFORCE_REFRESH_TOKEN_VALIDATION = 'true';

      const payload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
        profileComplete: mockUser.profileComplete,
        emailVerified: !!mockUser.emailVerified,
      };

      usersService.findOne.mockResolvedValue(mockUser as any);
      tokenService.userHasValidRefreshTokens.mockResolvedValue(true);

      const result = await strategy.validate(payload);

      expect(usersService.findOne).toHaveBeenCalledWith(payload.sub);
      expect(tokenService.userHasValidRefreshTokens).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual({
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
        firstname: payload.firstname,
        lastname: payload.lastname,
        profileComplete: payload.profileComplete,
        emailVerified: payload.emailVerified,
      });
    });

    it('should throw UnauthorizedException when refresh token validation is enabled and user has no valid tokens', async () => {
      // Enable refresh token validation
      process.env.ENFORCE_REFRESH_TOKEN_VALIDATION = 'true';

      const payload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
        profileComplete: mockUser.profileComplete,
        emailVerified: !!mockUser.emailVerified,
      };

      usersService.findOne.mockResolvedValue(mockUser as any);
      tokenService.userHasValidRefreshTokens.mockResolvedValue(false);

      await expect(strategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Session has been revoked'),
      );

      expect(usersService.findOne).toHaveBeenCalledWith(payload.sub);
      expect(tokenService.userHasValidRefreshTokens).toHaveBeenCalledWith(payload.sub);
    });
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });
});
