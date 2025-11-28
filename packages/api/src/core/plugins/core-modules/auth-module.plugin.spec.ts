import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { AuthModulePlugin } from './auth-module.plugin';
import { ModuleFlag } from '../../../config/modules.config';

describe('AuthModulePlugin', () => {
  let plugin: AuthModulePlugin;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthModulePlugin],
    }).compile();

    plugin = module.get<AuthModulePlugin>(AuthModulePlugin);
    (plugin as any).logger = mockLogger;
  });

  describe('plugin properties', () => {
    it('should have correct plugin properties', () => {
      expect(plugin.name).toBe('auth');
      expect(plugin.category).toBe('core');
      expect(plugin.version).toBe('1.0.0');
      expect(plugin.dependencies).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create auth module successfully', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          jwtSecret: 'test-secret',
          jwtExpiresIn: '24h',
          bcryptRounds: 12,
        },
      };

      const result = await plugin.create(config);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('name', 'auth');
      expect(result).toHaveProperty('type', 'core');
      expect(result).toHaveProperty('config', config.config);
      expect(result).toHaveProperty('initialized', true);
      expect(result).toHaveProperty('services');
      expect(result).toHaveProperty('validateToken');
      expect(result).toHaveProperty('generateToken');
      expect(mockLogger.log).toHaveBeenCalledWith('Creating Auth module with config:', config.config);
      expect(mockLogger.log).toHaveBeenCalledWith('Auth module created successfully');
    });

    it('should handle creation errors gracefully', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {},
      };

      // Mock an error during creation
      jest.spyOn(plugin, 'create').mockImplementationOnce(async () => {
        throw new Error('Test error');
      });

      await expect(plugin.create(config)).rejects.toThrow('Test error');
    });

    it('should include auth-specific services', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {},
      };

      const result: any = await plugin.create(config);

      expect(result.services).toHaveProperty('authService');
      expect(result.services).toHaveProperty('jwtService');
      expect(result.services).toHaveProperty('passportService');
    });

    it('should include auth-specific methods', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {},
      };

      const result: any = await plugin.create(config);

      expect(typeof result.validateToken).toBe('function');
      expect(typeof result.generateToken).toBe('function');
    });
  });

  describe('supports', () => {
    it('should return true for auth module', () => {
      expect(plugin.supports('auth')).toBe(true);
    });

    it('should return false for other modules', () => {
      expect(plugin.supports('users')).toBe(false);
      expect(plugin.supports('health')).toBe(false);
      expect(plugin.supports('notifications')).toBe(false);
    });
  });

  describe('validateConfig', () => {
    it('should validate valid config successfully', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          jwtSecret: 'test-secret',
          jwtExpiresIn: '24h',
          bcryptRounds: 12,
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
        dependencies: [],
        config: {},
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return error for missing config', () => {
      const result = plugin.validateConfig(null as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Auth module config is required');
    });

    it('should return error for missing config.config', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: null as any,
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Auth module config.config is required');
    });

    it('should validate jwtSecret type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          jwtSecret: 123,
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('jwtSecret must be a string');
    });

    it('should validate jwtExpiresIn type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          jwtExpiresIn: 123,
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('jwtExpiresIn must be a string');
    });

    it('should validate bcryptRounds type and value', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          bcryptRounds: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('bcryptRounds must be a positive integer');
    });

    it('should validate bcryptRounds minimum value', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          bcryptRounds: -1,
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('bcryptRounds must be a positive integer');
    });

    it('should validate multiple errors', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          jwtSecret: 123,
          jwtExpiresIn: 456,
          bcryptRounds: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('jwtSecret must be a string');
      expect(result.errors).toContain('jwtExpiresIn must be a string');
      expect(result.errors).toContain('bcryptRounds must be a positive integer');
    });
  });

  describe('getMetadata', () => {
    it('should return comprehensive metadata', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.name).toBe('auth');
      expect(metadata.category).toBe('core');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.dependencies).toEqual([]);
      expect(metadata.description).toContain('Authentication and authorization module');
      expect(metadata.tags).toContain('authentication');
      expect(metadata.tags).toContain('security');
      expect(metadata.tags).toContain('core');
    });

    it('should include config schema', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.configSchema).toHaveProperty('jwtSecret');
      expect(metadata.configSchema).toHaveProperty('jwtExpiresIn');
      expect(metadata.configSchema).toHaveProperty('bcryptRounds');
      expect(metadata.configSchema).toHaveProperty('providers');
    });

    it('should have correct config schema types', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.configSchema?.jwtSecret).toHaveProperty('type', 'string');
      expect(metadata.configSchema?.jwtExpiresIn).toHaveProperty('type', 'string');
      expect(metadata.configSchema?.bcryptRounds).toHaveProperty('type', 'number');
      expect(metadata.configSchema?.providers).toHaveProperty('type', 'array');
    });
  });

  describe('private methods', () => {
    it('should validate token correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {},
      };

      const result: any = await plugin.create(config);
      const isValid = result.validateToken('valid-token');

      expect(isValid).toBe(true);
      expect(mockLogger.debug).toHaveBeenCalledWith(
        expect.stringContaining('Validating token: valid-toke...')
      );
    });

    it('should reject invalid token', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {},
      };

      const result: any = await plugin.create(config);
      const isValid = result.validateToken('');

      expect(isValid).toBe(false);
    });

    it('should generate token correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {},
      };

      const result: any = await plugin.create(config);
      const token = result.generateToken({ userId: 'test-user' });

      expect(token).toContain('mock_jwt_token_');
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Generating token for payload:',
        { userId: 'test-user' }
      );
    });
  });
});