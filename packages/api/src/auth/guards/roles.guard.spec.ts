/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole as Role } from '@prisma/client';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  describe('canActivate', () => {
    let context: ExecutionContext;

    beforeEach(() => {
      context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: {
              id: '1',
              email: 'test@example.com',
              role: Role.CLIENT,
            },
          }),
        }),
      } as any;
    });

    it('should be defined', () => {
      expect(guard).toBeDefined();
    });

    it('should return true when no roles are required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return true when user has required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.CLIENT]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return true when user has one of multiple required roles', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([Role.ADMIN, Role.CLIENT]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when user has none of multiple required roles', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([Role.ADMIN, Role.MODERATOR]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should handle user with ADMIN role accessing CLIENT-only resource', () => {
      // Update the user to be ADMIN
      context.switchToHttp().getRequest().user.role = Role.ADMIN;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.CLIENT]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should handle user with EMPLOYEE role', () => {
      context.switchToHttp().getRequest().user.role = Role.EMPLOYEE;
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([Role.EMPLOYEE, Role.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should handle user with USER role', () => {
      context.switchToHttp().getRequest().user.role = Role.USER;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.USER]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should handle user with MODERATOR role', () => {
      context.switchToHttp().getRequest().user.role = Role.MODERATOR;
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([Role.MODERATOR, Role.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when user is undefined', () => {
      context.switchToHttp().getRequest().user = undefined;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false when user role is undefined', () => {
      context.switchToHttp().getRequest().user = { id: '1', email: 'test@example.com' };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false when user exists but role is null', () => {
      context.switchToHttp().getRequest().user = { 
        id: '1', 
        email: 'test@example.com', 
        role: null 
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });
  });
});
