import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ROLES_KEY, Roles } from './roles.decorator';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('Roles Decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ROLES_KEY', () => {
    it('should export the correct roles key', () => {
      expect(ROLES_KEY).toBe('roles');
    });
  });

  describe('Roles decorator', () => {
    it('should be defined', () => {
      expect(Roles).toBeDefined();
      expect(typeof Roles).toBe('function');
    });

    it('should call SetMetadata with single role', () => {
      const mockSetMetadata = SetMetadata as jest.Mock;
      mockSetMetadata.mockReturnValue('metadata');

      const result = Roles(UserRole.ADMIN);

      expect(mockSetMetadata).toHaveBeenCalledWith('roles', [UserRole.ADMIN]);
      expect(result).toBe('metadata');
    });

    it('should call SetMetadata with multiple roles', () => {
      const mockSetMetadata = SetMetadata as jest.Mock;
      mockSetMetadata.mockReturnValue('metadata');

      const result = Roles(UserRole.ADMIN, UserRole.CLIENT);

      expect(mockSetMetadata).toHaveBeenCalledWith('roles', [UserRole.ADMIN, UserRole.CLIENT]);
      expect(result).toBe('metadata');
    });

    it('should call SetMetadata with all available roles', () => {
      const mockSetMetadata = SetMetadata as jest.Mock;
      mockSetMetadata.mockReturnValue('metadata');

      const result = Roles(UserRole.ADMIN, UserRole.CLIENT, UserRole.EMPLOYEE, UserRole.MODERATOR, UserRole.USER);

      expect(mockSetMetadata).toHaveBeenCalledWith('roles', [
        UserRole.ADMIN,
        UserRole.CLIENT,
        UserRole.EMPLOYEE,
        UserRole.MODERATOR,
        UserRole.USER,
      ]);
      expect(result).toBe('metadata');
    });

    it('should call SetMetadata with no roles', () => {
      const mockSetMetadata = SetMetadata as jest.Mock;
      mockSetMetadata.mockReturnValue('metadata');

      const result = Roles();

      expect(mockSetMetadata).toHaveBeenCalledWith('roles', []);
      expect(result).toBe('metadata');
    });

    it('should call SetMetadata with duplicate roles', () => {
      const mockSetMetadata = SetMetadata as jest.Mock;
      mockSetMetadata.mockReturnValue('metadata');

      const result = Roles(UserRole.ADMIN, UserRole.ADMIN, UserRole.CLIENT);

      expect(mockSetMetadata).toHaveBeenCalledWith('roles', [UserRole.ADMIN, UserRole.ADMIN, UserRole.CLIENT]);
      expect(result).toBe('metadata');
    });

    it('should work with different role combinations', () => {
      const mockSetMetadata = SetMetadata as jest.Mock;
      mockSetMetadata.mockReturnValue('metadata');

      const result = Roles(UserRole.EMPLOYEE, UserRole.MODERATOR);

      expect(mockSetMetadata).toHaveBeenCalledWith('roles', [UserRole.EMPLOYEE, UserRole.MODERATOR]);
      expect(result).toBe('metadata');
    });
  });
});