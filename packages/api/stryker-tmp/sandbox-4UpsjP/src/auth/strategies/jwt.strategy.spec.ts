/* eslint-disable @typescript-eslint/unbound-method */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../../users/users.service';
import { mockUser } from '../../../test/fixtures/user.fixtures';
import { TokenService } from '../token.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
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
  });

  describe('validate', () => {
    it('should return user if found', async () => {
      const payload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      };

      usersService.findOne.mockResolvedValue(mockUser as any);

      const result = await strategy.validate(payload);

      expect(usersService.findOne).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const payload = {
        sub: 'nonexistent',
        email: 'test@example.com',
        role: 'CLIENT',
      };

      usersService.findOne.mockResolvedValue(null as any);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });
});
