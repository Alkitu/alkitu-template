import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ModulePluginRegistryService } from './module-plugin-registry.service';
import { IModulePlugin, ModuleCategory } from '../plugins/module-plugin.interface';
import { ModuleFlag } from '../../config/modules.config';

describe('ModulePluginRegistryService', () => {
  let service: ModulePluginRegistryService;
  let mockLogger: jest.Mocked<Logger>;
  let mockPlugin: jest.Mocked<IModulePlugin>;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as any;

    mockPlugin = {
      name: 'test-plugin',
      category: 'core' as ModuleCategory,
      version: '1.0.0',
      dependencies: [],
      create: jest.fn(),
      supports: jest.fn(),
      validateConfig: jest.fn(),
      getMetadata: jest.fn(),
      constructor: { name: 'MockPlugin' },
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [ModulePluginRegistryService],
    }).compile();

    service = module.get<ModulePluginRegistryService>(ModulePluginRegistryService);
    (service as any).logger = mockLogger;
  });

  describe('onModuleInit', () => {
    it('should initialize successfully', async () => {
      await service.onModuleInit();

      expect(mockLogger.log).toHaveBeenCalledWith('Module Plugin Registry initialized');
    });

    it('should log registered plugins', async () => {
      service.registerPlugin(mockPlugin);
      
      await service.onModuleInit();

      expect(mockLogger.log).toHaveBeenCalledWith('Module Plugin Registry Status:');
      expect(mockLogger.log).toHaveBeenCalledWith('- Total plugins: 1');
      expect(mockLogger.log).toHaveBeenCalledWith('- Supported modules: test-plugin');
      expect(mockLogger.log).toHaveBeenCalledWith('- core modules: test-plugin');
    });
  });

  describe('registerPlugin', () => {
    it('should register a valid plugin successfully', () => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });

      service.registerPlugin(mockPlugin);

      expect(mockLogger.log).toHaveBeenCalledWith(
        'Module plugin \'test-plugin\' registered successfully (category: core)'
      );
      expect(service.isModuleSupported('test-plugin')).toBe(true);
    });

    it('should override existing plugin with warning', () => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });

      service.registerPlugin(mockPlugin);
      service.registerPlugin(mockPlugin);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Module plugin \'test-plugin\' is already registered. Overriding existing plugin.'
      );
    });

    it('should throw error for invalid plugin', () => {
      const invalidPlugin = {
        name: '',
        category: 'invalid' as ModuleCategory,
        version: '1.0.0',
        dependencies: [],
        create: jest.fn(),
        supports: jest.fn(),
        validateConfig: jest.fn(),
        getMetadata: jest.fn(),
      } as any;

      expect(() => {
        service.registerPlugin(invalidPlugin);
      }).toThrow('Invalid module plugin \'\': Plugin name is required and must be a string, Plugin category must be one of: core, feature, integration');
    });

    it('should validate all plugin properties', () => {
      const invalidPlugin = {
        name: null,
        category: 'invalid',
        version: null,
        dependencies: 'invalid',
        create: 'not a function',
        supports: 'not a function',
        validateConfig: 'not a function',
        getMetadata: 'not a function',
      } as any;

      expect(() => {
        service.registerPlugin(invalidPlugin);
      }).toThrow('Invalid module plugin \'null\'');
    });
  });

  describe('getPlugin', () => {
    beforeEach(() => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });
      service.registerPlugin(mockPlugin);
    });

    it('should return plugin if found and supports module', () => {
      mockPlugin.supports.mockReturnValue(true);

      const result = service.getPlugin('test-plugin');

      expect(result).toBe(mockPlugin);
    });

    it('should return undefined if plugin not found', () => {
      const result = service.getPlugin('non-existent');

      expect(result).toBeUndefined();
      expect(mockLogger.warn).toHaveBeenCalledWith('No module plugin found for: non-existent');
    });

    it('should return undefined if plugin does not support module', () => {
      mockPlugin.supports.mockReturnValue(false);

      const result = service.getPlugin('test-plugin');

      expect(result).toBeUndefined();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Plugin \'test-plugin\' is registered for \'test-plugin\' but doesn\'t support it'
      );
    });
  });

  describe('getPluginsByCategory', () => {
    beforeEach(() => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });
      service.registerPlugin(mockPlugin);
    });

    it('should return plugins by category', () => {
      const result = service.getPluginsByCategory('core');

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockPlugin);
    });

    it('should return empty array for non-existent category', () => {
      const result = service.getPluginsByCategory('feature');

      expect(result).toHaveLength(0);
    });
  });

  describe('getAllPlugins', () => {
    beforeEach(() => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });
      service.registerPlugin(mockPlugin);
    });

    it('should return all registered plugins', () => {
      const result = service.getAllPlugins();

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockPlugin);
    });
  });

  describe('getSupportedModules', () => {
    beforeEach(() => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });
      service.registerPlugin(mockPlugin);
    });

    it('should return supported module names', () => {
      const result = service.getSupportedModules();

      expect(result).toEqual(['test-plugin']);
    });
  });

  describe('isModuleSupported', () => {
    beforeEach(() => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });
      service.registerPlugin(mockPlugin);
    });

    it('should return true for supported module', () => {
      const result = service.isModuleSupported('test-plugin');

      expect(result).toBe(true);
    });

    it('should return false for unsupported module', () => {
      const result = service.isModuleSupported('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('createModule', () => {
    const mockConfig: ModuleFlag = {
      enabled: true,
      version: '1.0.0',
      dependencies: [],
      config: { test: 'value' },
    };

    beforeEach(() => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });
      service.registerPlugin(mockPlugin);
    });

    it('should create module successfully', async () => {
      const mockModule = { name: 'test-module' };
      mockPlugin.create.mockResolvedValue(mockModule);
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });

      const result = await service.createModule('test-plugin', mockConfig);

      expect(result).toBe(mockModule);
      expect(mockPlugin.create).toHaveBeenCalledWith(mockConfig);
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Creating module \'test-plugin\' using MockPlugin'
      );
      expect(mockLogger.log).toHaveBeenCalledWith('Module \'test-plugin\' created successfully');
    });

    it('should throw error if plugin not found', async () => {
      await expect(service.createModule('non-existent', mockConfig)).rejects.toThrow(
        'Module \'non-existent\' is not supported. Supported modules: test-plugin'
      );
    });

    it('should throw error if config validation fails', async () => {
      mockPlugin.validateConfig.mockReturnValue({
        isValid: false,
        errors: ['Invalid config'],
      });

      await expect(service.createModule('test-plugin', mockConfig)).rejects.toThrow(
        'Invalid configuration for module \'test-plugin\': Invalid config'
      );
    });

    it('should throw error if plugin creation fails', async () => {
      mockPlugin.create.mockRejectedValue(new Error('Creation failed'));
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });

      await expect(service.createModule('test-plugin', mockConfig)).rejects.toThrow(
        'Failed to create module \'test-plugin\': Creation failed'
      );
    });

    it('should handle unknown errors during creation', async () => {
      mockPlugin.create.mockRejectedValue('Unknown error');
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });

      await expect(service.createModule('test-plugin', mockConfig)).rejects.toThrow(
        'Failed to create module \'test-plugin\': Unknown error'
      );
    });
  });

  describe('unregisterPlugin', () => {
    beforeEach(() => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });
      service.registerPlugin(mockPlugin);
    });

    it('should unregister existing plugin', () => {
      const result = service.unregisterPlugin('test-plugin');

      expect(result).toBe(true);
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Module plugin \'test-plugin\' unregistered successfully'
      );
      expect(service.isModuleSupported('test-plugin')).toBe(false);
    });

    it('should return false for non-existent plugin', () => {
      const result = service.unregisterPlugin('non-existent');

      expect(result).toBe(false);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Attempted to unregister non-existent module plugin: non-existent'
      );
    });
  });

  describe('getRegistryStats', () => {
    beforeEach(() => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });
      service.registerPlugin(mockPlugin);
    });

    it('should return comprehensive registry statistics', () => {
      const stats = service.getRegistryStats();

      expect(stats).toHaveProperty('totalPlugins', 1);
      expect(stats).toHaveProperty('supportedModules', ['test-plugin']);
      expect(stats).toHaveProperty('pluginsByCategory');
      expect(stats).toHaveProperty('pluginDetails');
      expect(stats.pluginsByCategory).toHaveProperty('core', ['test-plugin']);
      expect(stats.pluginDetails).toHaveLength(1);
      expect(stats.pluginDetails[0]).toHaveProperty('name', 'test-plugin');
      expect(stats.pluginDetails[0]).toHaveProperty('category', 'core');
      expect(stats.pluginDetails[0]).toHaveProperty('version', '1.0.0');
      expect(stats.pluginDetails[0]).toHaveProperty('dependencies', []);
      expect(stats.pluginDetails[0]).toHaveProperty('className', 'MockPlugin');
    });
  });

  describe('getPluginMetadata', () => {
    beforeEach(() => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });
      service.registerPlugin(mockPlugin);
    });

    it('should return plugin metadata', () => {
      const metadata = service.getPluginMetadata();

      expect(metadata).toHaveLength(1);
      expect(mockPlugin.getMetadata).toHaveBeenCalled();
    });
  });

  describe('validateDependencies', () => {
    beforeEach(() => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });
      service.registerPlugin(mockPlugin);
    });

    it('should validate dependencies successfully', () => {
      const result = service.validateDependencies(['test-plugin']);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return error for unsupported module', () => {
      const result = service.validateDependencies(['non-existent']);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Module \'non-existent\' is not supported');
    });

    it('should return error for missing dependencies', () => {
      const pluginWithDeps = {
        ...mockPlugin,
        name: 'plugin-with-deps',
        dependencies: ['missing-dep'],
      };
      
      pluginWithDeps.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      pluginWithDeps.supports.mockReturnValue(true);
      pluginWithDeps.getMetadata.mockReturnValue({
        name: 'plugin-with-deps',
        category: 'core',
        version: '1.0.0',
        dependencies: ['missing-dep'],
        description: 'Plugin with dependencies',
      });
      service.registerPlugin(pluginWithDeps);

      const result = service.validateDependencies(['plugin-with-deps']);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Module \'plugin-with-deps\' depends on unsupported module \'missing-dep\''
      );
    });
  });

  describe('validatePlugin', () => {
    it('should validate plugin with all required properties', () => {
      const validPlugin = {
        name: 'valid-plugin',
        category: 'core' as ModuleCategory,
        version: '1.0.0',
        dependencies: [],
        create: jest.fn(),
        supports: jest.fn(),
        validateConfig: jest.fn(),
        getMetadata: jest.fn(),
      };

      const result = (service as any).validatePlugin(validPlugin);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate plugin with missing name', () => {
      const invalidPlugin = {
        name: '',
        category: 'core' as ModuleCategory,
        version: '1.0.0',
        dependencies: [],
        create: jest.fn(),
        supports: jest.fn(),
        validateConfig: jest.fn(),
        getMetadata: jest.fn(),
      };

      const result = (service as any).validatePlugin(invalidPlugin);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Plugin name is required and must be a string');
    });

    it('should validate plugin with invalid category', () => {
      const invalidPlugin = {
        name: 'test-plugin',
        category: 'invalid' as ModuleCategory,
        version: '1.0.0',
        dependencies: [],
        create: jest.fn(),
        supports: jest.fn(),
        validateConfig: jest.fn(),
        getMetadata: jest.fn(),
      };

      const result = (service as any).validatePlugin(invalidPlugin);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Plugin category must be one of: core, feature, integration');
    });

    it('should validate plugin with missing version', () => {
      const invalidPlugin = {
        name: 'test-plugin',
        category: 'core' as ModuleCategory,
        version: '',
        dependencies: [],
        create: jest.fn(),
        supports: jest.fn(),
        validateConfig: jest.fn(),
        getMetadata: jest.fn(),
      };

      const result = (service as any).validatePlugin(invalidPlugin);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Plugin version is required and must be a string');
    });

    it('should validate plugin with invalid dependencies', () => {
      const invalidPlugin = {
        name: 'test-plugin',
        category: 'core' as ModuleCategory,
        version: '1.0.0',
        dependencies: 'invalid',
        create: jest.fn(),
        supports: jest.fn(),
        validateConfig: jest.fn(),
        getMetadata: jest.fn(),
      };

      const result = (service as any).validatePlugin(invalidPlugin);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Plugin dependencies must be an array');
    });

    it('should validate plugin with missing methods', () => {
      const invalidPlugin = {
        name: 'test-plugin',
        category: 'core' as ModuleCategory,
        version: '1.0.0',
        dependencies: [],
        create: 'not a function',
        supports: 'not a function',
        validateConfig: 'not a function',
        getMetadata: 'not a function',
      };

      const result = (service as any).validatePlugin(invalidPlugin);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Plugin must implement create method');
      expect(result.errors).toContain('Plugin must implement supports method');
      expect(result.errors).toContain('Plugin must implement validateConfig method');
      expect(result.errors).toContain('Plugin must implement getMetadata method');
    });
  });

  describe('logRegisteredPlugins', () => {
    it('should log empty registry status', () => {
      (service as any).logRegisteredPlugins();

      expect(mockLogger.log).toHaveBeenCalledWith('Module Plugin Registry Status:');
      expect(mockLogger.log).toHaveBeenCalledWith('- Total plugins: 0');
      expect(mockLogger.log).toHaveBeenCalledWith('- Supported modules: ');
    });

    it('should log registry status with plugins', () => {
      mockPlugin.validateConfig.mockReturnValue({ isValid: true, errors: [] });
      mockPlugin.supports.mockReturnValue(true);
      mockPlugin.getMetadata.mockReturnValue({
        name: 'test-plugin',
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        description: 'Test plugin',
      });
      service.registerPlugin(mockPlugin);

      (service as any).logRegisteredPlugins();

      expect(mockLogger.log).toHaveBeenCalledWith('Module Plugin Registry Status:');
      expect(mockLogger.log).toHaveBeenCalledWith('- Total plugins: 1');
      expect(mockLogger.log).toHaveBeenCalledWith('- Supported modules: test-plugin');
      expect(mockLogger.log).toHaveBeenCalledWith('- core modules: test-plugin');
      expect(mockLogger.log).toHaveBeenCalledWith(
        '- test-plugin (core): MockPlugin v1.0.0'
      );
    });
  });
});