/* eslint-disable @typescript-eslint/unbound-method */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { mockUser } from '../../../test/fixtures/user.fixtures';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(
      AuthService,
    ) as jest.Mocked<AuthService>;
  });

  describe('validate', () => {
    it('should return user if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      authService.validateUser.mockResolvedValue(mockUser as any);

      const result = await strategy.validate(email, password);

      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      authService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });
});
