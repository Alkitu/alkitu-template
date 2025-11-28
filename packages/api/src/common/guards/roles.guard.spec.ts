import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

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
              role: [UserRole.CLIENT],
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
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return true when user has required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.CLIENT]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return true when user has one of multiple required roles', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN, UserRole.CLIENT]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when user has none of multiple required roles', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN, UserRole.MODERATOR]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false when user role is undefined', () => {
      context.switchToHttp().getRequest().user = { 
        id: '1', 
        email: 'test@example.com' 
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false when user role is null', () => {
      context.switchToHttp().getRequest().user = { 
        id: '1', 
        email: 'test@example.com', 
        role: null 
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false when user role is empty array', () => {
      context.switchToHttp().getRequest().user = { 
        id: '1', 
        email: 'test@example.com', 
        role: [] 
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should handle user with multiple roles', () => {
      context.switchToHttp().getRequest().user = { 
        id: '1', 
        email: 'test@example.com', 
        role: [UserRole.CLIENT, UserRole.MODERATOR] 
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return true when user has one of their multiple roles matching required role', () => {
      context.switchToHttp().getRequest().user = { 
        id: '1', 
        email: 'test@example.com', 
        role: [UserRole.CLIENT, UserRole.MODERATOR] 
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.MODERATOR]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should handle string role instead of array', () => {
      context.switchToHttp().getRequest().user = { 
        id: '1', 
        email: 'test@example.com', 
        role: UserRole.CLIENT 
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.CLIENT]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should handle string role that does not match', () => {
      context.switchToHttp().getRequest().user = { 
        id: '1', 
        email: 'test@example.com', 
        role: UserRole.CLIENT 
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should handle role as non-array, non-string value', () => {
      context.switchToHttp().getRequest().user = { 
        id: '1', 
        email: 'test@example.com', 
        role: 123 
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      expect(() => guard.canActivate(context)).toThrow('user.role.includes is not a function');
    });

    it('should return false when user has no roles and roles are required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return true when no roles are required (null)', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when no roles are required (empty array)', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should handle all UserRole enum values', () => {
      const allRoles = [UserRole.ADMIN, UserRole.CLIENT, UserRole.EMPLOYEE, UserRole.MODERATOR, UserRole.USER];
      
      allRoles.forEach(role => {
        context.switchToHttp().getRequest().user = { 
          id: '1', 
          email: 'test@example.com', 
          role: [role] 
        };
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([role]);

        const result = guard.canActivate(context);

        expect(result).toBe(true);
      });
    });

    it('should use ROLES_KEY constant for metadata lookup', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.CLIENT]);

      guard.canActivate(context);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });
  });
});