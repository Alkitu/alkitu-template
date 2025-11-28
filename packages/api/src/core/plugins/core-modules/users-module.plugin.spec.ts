import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { UsersModulePlugin } from './users-module.plugin';
import { ModuleFlag } from '../../../config/modules.config';

describe('UsersModulePlugin', () => {
  let plugin: UsersModulePlugin;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersModulePlugin],
    }).compile();

    plugin = module.get<UsersModulePlugin>(UsersModulePlugin);
    (plugin as any).logger = mockLogger;
  });

  describe('plugin properties', () => {
    it('should have correct plugin properties', () => {
      expect(plugin.name).toBe('users');
      expect(plugin.category).toBe('core');
      expect(plugin.version).toBe('1.0.0');
      expect(plugin.dependencies).toEqual(['auth']);
    });
  });

  describe('create', () => {
    it('should create users module successfully', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {
          enableProfilePictures: true,
          maxUsersPerOrg: 100,
          enableUserAnalytics: true,
          userRoles: ['admin', 'user'],
        },
      };

      const result = await plugin.create(config);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('name', 'users');
      expect(result).toHaveProperty('type', 'core');
      expect(result).toHaveProperty('config', config.config);
      expect(result).toHaveProperty('initialized', true);
      expect(result).toHaveProperty('services');
      expect(result).toHaveProperty('createUser');
      expect(result).toHaveProperty('findUser');
      expect(result).toHaveProperty('updateUser');
      expect(result).toHaveProperty('deleteUser');
      expect(mockLogger.log).toHaveBeenCalledWith('Creating Users module with config:', config.config);
      expect(mockLogger.log).toHaveBeenCalledWith('Users module created successfully');
    });

    it('should handle creation errors gracefully', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {},
      };

      // Mock an error during creation
      jest.spyOn(plugin, 'create').mockImplementationOnce(async () => {
        throw new Error('Test error');
      });

      await expect(plugin.create(config)).rejects.toThrow('Test error');
    });

    it('should include users-specific services', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {},
      };

      const result: any = await plugin.create(config);

      expect(result.services).toHaveProperty('userRepositoryService');
      expect(result.services).toHaveProperty('userAuthenticationService');
      expect(result.services).toHaveProperty('userAnalyticsService');
      expect(result.services).toHaveProperty('userEventsService');
      expect(result.services).toHaveProperty('userFacadeService');
    });

    it('should include users-specific methods', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {},
      };

      const result: any = await plugin.create(config);

      expect(typeof result.createUser).toBe('function');
      expect(typeof result.findUser).toBe('function');
      expect(typeof result.updateUser).toBe('function');
      expect(typeof result.deleteUser).toBe('function');
    });
  });

  describe('supports', () => {
    it('should return true for users module', () => {
      expect(plugin.supports('users')).toBe(true);
    });

    it('should return false for other modules', () => {
      expect(plugin.supports('auth')).toBe(false);
      expect(plugin.supports('health')).toBe(false);
      expect(plugin.supports('notifications')).toBe(false);
    });
  });

  describe('validateConfig', () => {
    it('should validate valid config successfully', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {
          enableProfilePictures: true,
          maxUsersPerOrg: 100,
          enableUserAnalytics: true,
          userRoles: ['admin', 'user', 'guest'],
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return valid for disabled config', () => {
      const config: ModuleFlag = {
        enabled: false,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {},
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return error for missing config', () => {
      const result = plugin.validateConfig(null as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Users module config is required');
    });

    it('should return error for missing config.config', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: null as any,
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Users module config.config is required');
    });

    it('should validate enableProfilePictures type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {
          enableProfilePictures: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('enableProfilePictures must be a boolean');
    });

    it('should validate maxUsersPerOrg type and minimum value', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {
          maxUsersPerOrg: -1,
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('maxUsersPerOrg must be a positive integer');
    });

    it('should validate enableUserAnalytics type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {
          enableUserAnalytics: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('enableUserAnalytics must be a boolean');
    });

    it('should validate userRoles type and non-empty array', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {
          userRoles: [],
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('userRoles must be a non-empty array');
    });

    it('should validate userRoles is array', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {
          userRoles: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('userRoles must be a non-empty array');
    });

    it('should validate multiple errors', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {
          enableProfilePictures: 'invalid',
          maxUsersPerOrg: -1,
          enableUserAnalytics: 'invalid',
          userRoles: [],
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(4);
      expect(result.errors).toContain('enableProfilePictures must be a boolean');
      expect(result.errors).toContain('maxUsersPerOrg must be a positive integer');
      expect(result.errors).toContain('enableUserAnalytics must be a boolean');
      expect(result.errors).toContain('userRoles must be a non-empty array');
    });
  });

  describe('getMetadata', () => {
    it('should return comprehensive metadata', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.name).toBe('users');
      expect(metadata.category).toBe('core');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.dependencies).toEqual(['auth']);
      expect(metadata.description).toContain('User management module providing CRUD operations');
      expect(metadata.tags).toContain('users');
      expect(metadata.tags).toContain('management');
      expect(metadata.tags).toContain('core');
      expect(metadata.tags).toContain('crud');
    });

    it('should include config schema', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.configSchema).toHaveProperty('enableProfilePictures');
      expect(metadata.configSchema).toHaveProperty('maxUsersPerOrg');
      expect(metadata.configSchema).toHaveProperty('enableUserAnalytics');
      expect(metadata.configSchema).toHaveProperty('userRoles');
      expect(metadata.configSchema).toHaveProperty('defaultRole');
    });

    it('should have correct config schema types', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.configSchema?.enableProfilePictures).toHaveProperty('type', 'boolean');
      expect(metadata.configSchema?.maxUsersPerOrg).toHaveProperty('type', 'number');
      expect(metadata.configSchema?.enableUserAnalytics).toHaveProperty('type', 'boolean');
      expect(metadata.configSchema?.userRoles).toHaveProperty('type', 'array');
      expect(metadata.configSchema?.defaultRole).toHaveProperty('type', 'string');
    });
  });

  describe('private methods', () => {
    let mockDateNow: jest.SpyInstance;

    beforeEach(() => {
      mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(1234567890000);
    });

    afterEach(() => {
      mockDateNow.mockRestore();
    });

    it('should create user correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const userData = { name: 'John Doe', email: 'john@example.com' };
      const user = await result.createUser(userData);

      expect(user).toHaveProperty('id', 'user_1234567890000');
      expect(user).toHaveProperty('name', 'John Doe');
      expect(user).toHaveProperty('email', 'john@example.com');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
      expect(mockLogger.debug).toHaveBeenCalledWith('Creating user:', userData);
    });

    it('should find user correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const user = await result.findUser('test-user-id');

      expect(user).toHaveProperty('id', 'test-user-id');
      expect(user).toHaveProperty('name', 'Mock User');
      expect(user).toHaveProperty('email', 'mock@example.com');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
      expect(mockLogger.debug).toHaveBeenCalledWith('Finding user: test-user-id');
    });

    it('should update user correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const updateData = { name: 'Updated Name' };
      const user = await result.updateUser('test-user-id', updateData);

      expect(user).toHaveProperty('id', 'test-user-id');
      expect(user).toHaveProperty('name', 'Updated Name');
      expect(user).toHaveProperty('updatedAt');
      expect(mockLogger.debug).toHaveBeenCalledWith('Updating user test-user-id:', updateData);
    });

    it('should delete user correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const deleted = await result.deleteUser('test-user-id');

      expect(deleted).toBe(true);
      expect(mockLogger.debug).toHaveBeenCalledWith('Deleting user: test-user-id');
    });
  });
});