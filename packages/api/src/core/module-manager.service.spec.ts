import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ModuleManagerService, ModuleDefinition } from './module-manager.service';
import { ModulePluginRegistryService } from './services/module-plugin-registry.service';
import { ModuleConfig, ModuleFlag, getModuleConfig } from '../config/modules.config';

jest.mock('../config/modules.config');

describe('ModuleManagerService', () => {
  let service: ModuleManagerService;
  let mockRegistry: jest.Mocked<ModulePluginRegistryService>;
  let mockLogger: jest.Mocked<Logger>;

  const mockModuleConfig: ModuleConfig = {
    core: {
      auth: {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users'],
        config: { jwtSecret: 'test-secret' }
      },
      users: {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: { defaultRole: 'CLIENT' }
      },
      health: {
        enabled: false,
        version: '1.0.0',
        dependencies: [],
        config: { checkInterval: 30000 }
      }
    },
    features: {
      notifications: {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users'],
        config: { channels: ['email'] }
      },
      billing: {
        enabled: false,
        version: '1.0.0',
        dependencies: ['users'],
        config: { currency: 'USD' }
      },
      analytics: {
        enabled: false,
        version: '1.0.0',
        dependencies: ['users'],
        config: { provider: 'internal' }
      },
      websocket: {
        enabled: false,
        version: '1.0.0',
        dependencies: ['auth'],
        config: { namespace: '/notifications' }
      },
      email: {
        enabled: false,
        version: '1.0.0',
        dependencies: [],
        config: { provider: 'resend' }
      }
    },
    integrations: {
      tRPC: {
        enabled: true,
        version: '1.0.0',
        dependencies: ['auth', 'users'],
        config: { basePath: '/trpc' }
      },
      graphQL: {
        enabled: false,
        version: '1.0.0',
        dependencies: ['auth', 'users'],
        config: { basePath: '/graphql' }
      },
      rest: {
        enabled: false,
        version: '1.0.0',
        dependencies: ['auth', 'users'],
        config: { basePath: '/api' }
      },
      mcp: {
        enabled: false,
        version: '1.0.0',
        dependencies: ['auth'],
        config: { basePath: '/mcp' }
      }
    },
    platforms: {
      web: {
        enabled: false,
        version: '1.0.0',
        dependencies: ['tRPC', 'auth'],
        config: { url: 'http://localhost:3000' }
      },
      mobile: {
        enabled: false,
        version: '1.0.0',
        dependencies: ['graphQL', 'auth'],
        config: { platforms: ['ios', 'android'] }
      },
      desktop: {
        enabled: false,
        version: '1.0.0',
        dependencies: ['rest', 'auth'],
        config: { platforms: ['windows', 'macos', 'linux'] }
      }
    }
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    mockRegistry = {
      createModule: jest.fn(),
      getRegistryStats: jest.fn(),
      getPluginMetadata: jest.fn(),
    } as any;

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as any;

    (getModuleConfig as jest.Mock).mockReturnValue(mockModuleConfig);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuleManagerService,
        {
          provide: ModulePluginRegistryService,
          useValue: mockRegistry,
        },
      ],
    }).compile();

    service = module.get<ModuleManagerService>(ModuleManagerService);
    
    // Mock the logger
    (service as any).logger = mockLogger;
  });

  describe('onModuleInit', () => {
    it('should initialize modules on module init', async () => {
      mockRegistry.createModule.mockResolvedValue({ name: 'test-module' });
      
      await service.onModuleInit();
      
      expect(getModuleConfig).toHaveBeenCalled();
      expect(mockLogger.log).toHaveBeenCalledWith('Initializing modules...');
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining('Module initialization complete'));
    });

    it('should handle module loading errors gracefully', async () => {
      mockRegistry.createModule.mockRejectedValue(new Error('Test error'));
      
      await service.onModuleInit();
      
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create module'),
        expect.any(Error)
      );
    });
  });

  describe('getEnabledModules', () => {
    it('should return only enabled modules', async () => {
      await service.onModuleInit();
      
      const enabledModules = (service as any).getEnabledModules();
      
      expect(enabledModules).toHaveLength(4); // auth, users, notifications, tRPC
      expect(enabledModules.map((m: ModuleDefinition) => m.name)).toContain('auth');
      expect(enabledModules.map((m: ModuleDefinition) => m.name)).toContain('users');
      expect(enabledModules.map((m: ModuleDefinition) => m.name)).toContain('notifications');
      expect(enabledModules.map((m: ModuleDefinition) => m.name)).toContain('tRPC');
    });

    it('should include modules from all categories', async () => {
      await service.onModuleInit();
      
      const enabledModules = (service as any).getEnabledModules();
      const moduleNames = enabledModules.map((m: ModuleDefinition) => m.name);
      
      // Core modules
      expect(moduleNames).toContain('auth');
      expect(moduleNames).toContain('users');
      // Feature modules
      expect(moduleNames).toContain('notifications');
      // Integration modules
      expect(moduleNames).toContain('tRPC');
    });
  });

  describe('sortModulesByDependencies', () => {
    it('should sort modules by dependencies correctly', async () => {
      const modules: ModuleDefinition[] = [
        {
          name: 'auth',
          version: '1.0.0',
          dependencies: ['users'],
          factory: jest.fn(),
          config: {}
        },
        {
          name: 'users',
          version: '1.0.0',
          dependencies: [],
          factory: jest.fn(),
          config: {}
        }
      ];

      const sorted = (service as any).sortModulesByDependencies(modules);
      
      expect(sorted[0].name).toBe('users');
      expect(sorted[1].name).toBe('auth');
    });

    it('should detect circular dependencies', async () => {
      const modules: ModuleDefinition[] = [
        {
          name: 'moduleA',
          version: '1.0.0',
          dependencies: ['moduleB'],
          factory: jest.fn(),
          config: {}
        },
        {
          name: 'moduleB',
          version: '1.0.0',
          dependencies: ['moduleA'],
          factory: jest.fn(),
          config: {}
        }
      ];

      expect(() => {
        (service as any).sortModulesByDependencies(modules);
      }).toThrow('Circular dependency detected');
    });
  });

  describe('loadModule', () => {
    it('should load module successfully when dependencies are met', async () => {
      const moduleDefinition: ModuleDefinition = {
        name: 'test-module',
        version: '1.0.0',
        dependencies: [],
        factory: jest.fn().mockResolvedValue({ name: 'test-module' }),
        config: {}
      };

      await (service as any).loadModule(moduleDefinition);
      
      expect(moduleDefinition.factory).toHaveBeenCalled();
      expect(service.isModuleLoaded('test-module')).toBe(true);
    });

    it('should throw error when dependencies are not met', async () => {
      const moduleDefinition: ModuleDefinition = {
        name: 'test-module',
        version: '1.0.0',
        dependencies: ['missing-module'],
        factory: jest.fn(),
        config: {}
      };

      await expect((service as any).loadModule(moduleDefinition)).rejects.toThrow(
        'Dependencies not met for module: test-module'
      );
    });
  });

  describe('checkDependencies', () => {
    it('should return true when all dependencies are loaded', async () => {
      // Load a module first
      const firstModule: ModuleDefinition = {
        name: 'dependency-module',
        version: '1.0.0',
        dependencies: [],
        factory: jest.fn().mockResolvedValue({ name: 'dependency-module' }),
        config: {}
      };
      await (service as any).loadModule(firstModule);

      const moduleDefinition: ModuleDefinition = {
        name: 'test-module',
        version: '1.0.0',
        dependencies: ['dependency-module'],
        factory: jest.fn(),
        config: {}
      };

      const result = (service as any).checkDependencies(moduleDefinition);
      
      expect(result).toBe(true);
    });

    it('should return false when dependencies are missing', async () => {
      const moduleDefinition: ModuleDefinition = {
        name: 'test-module',
        version: '1.0.0',
        dependencies: ['missing-module'],
        factory: jest.fn(),
        config: {}
      };

      const result = (service as any).checkDependencies(moduleDefinition);
      
      expect(result).toBe(false);
    });
  });

  describe('createModuleUsingRegistry', () => {
    it('should create module using registry successfully', async () => {
      const mockModule = { name: 'test-module', type: 'core' };
      mockRegistry.createModule.mockResolvedValue(mockModule);

      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {}
      };

      const result = await (service as any).createModuleUsingRegistry('test-module', config);
      
      expect(mockRegistry.createModule).toHaveBeenCalledWith('test-module', config);
      expect(result).toBe(mockModule);
      expect(mockLogger.log).toHaveBeenCalledWith(
        expect.stringContaining('Creating module \'test-module\' using plugin registry')
      );
    });

    it('should fallback to legacy methods when registry fails', async () => {
      mockRegistry.createModule.mockRejectedValue(new Error('Registry error'));

      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {}
      };

      const result = await (service as any).createModuleUsingRegistry('auth', config);
      
      expect(mockRegistry.createModule).toHaveBeenCalledWith('auth', config);
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create module \'auth\' via plugin registry'),
        expect.any(Error)
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Attempting to create module \'auth\' using legacy methods')
      );
      expect(result).toEqual({ name: 'auth', config: config.config });
    });
  });

  describe('legacy module creation', () => {
    it('should create core modules using legacy methods', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: { test: 'value' }
      };

      const result = (service as any).createModuleLegacy('auth', config);
      
      expect(result).toEqual({ name: 'auth', config: config.config });
      expect(mockLogger.warn).toHaveBeenCalledWith('Using legacy module creation for: auth');
    });

    it('should create feature modules using legacy methods', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: { test: 'value' }
      };

      const result = (service as any).createModuleLegacy('notifications', config);
      
      expect(result).toEqual({ name: 'notifications', config: config.config });
    });

    it('should create integration modules using legacy methods', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: { test: 'value' }
      };

      const result = (service as any).createModuleLegacy('tRPC', config);
      
      expect(result).toEqual({ name: 'tRPC', config: config.config });
    });

    it('should throw error for unknown modules', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {}
      };

      expect(() => {
        (service as any).createModuleLegacy('unknown-module', config);
      }).toThrow('Unknown module: unknown-module. Please register a plugin for this module.');
    });
  });

  describe('all legacy module creation methods', () => {
    const config: ModuleFlag = {
      enabled: true,
      version: '1.0.0',
      dependencies: [],
      config: { test: 'value' }
    };

    it('should create auth module', () => {
      const result = (service as any).createAuthModule(config);
      expect(result).toEqual({ name: 'auth', config: config.config });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating Auth module with config:', config.config);
    });

    it('should create users module', () => {
      const result = (service as any).createUsersModule(config);
      expect(result).toEqual({ name: 'users', config: config.config });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating Users module with config:', config.config);
    });

    it('should create health module', () => {
      const result = (service as any).createHealthModule(config);
      expect(result).toEqual({ name: 'health', config: config.config });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating Health module with config:', config.config);
    });

    it('should create notifications module', () => {
      const result = (service as any).createNotificationsModule(config);
      expect(result).toEqual({ name: 'notifications', config: config.config });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating Notifications module with config:', config.config);
    });

    it('should create billing module', () => {
      const result = (service as any).createBillingModule(config);
      expect(result).toEqual({ name: 'billing', config: config.config });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating Billing module with config:', config.config);
    });

    it('should create analytics module', () => {
      const result = (service as any).createAnalyticsModule(config);
      expect(result).toEqual({ name: 'analytics', config: config.config });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating Analytics module with config:', config.config);
    });

    it('should create websocket module', () => {
      const result = (service as any).createWebSocketModule(config);
      expect(result).toEqual({ name: 'websocket', config: config.config });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating WebSocket module with config:', config.config);
    });

    it('should create email module', () => {
      const result = (service as any).createEmailModule(config);
      expect(result).toEqual({ name: 'email', config: config.config });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating Email module with config:', config.config);
    });

    it('should create tRPC module', () => {
      const result = (service as any).createTRPCModule(config);
      expect(result).toEqual({ name: 'tRPC', config: config.config });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating tRPC module with config:', config.config);
    });

    it('should create GraphQL module', () => {
      const result = (service as any).createGraphQLModule(config);
      expect(result).toEqual({ name: 'graphQL', config: config.config });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating GraphQL module with config:', config.config);
    });

    it('should create REST module', () => {
      const result = (service as any).createRESTModule(config);
      expect(result).toEqual({ name: 'rest', config: config.config });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating REST module with config:', config.config);
    });

    it('should create MCP module', () => {
      const result = (service as any).createMCPModule(config);
      expect(result).toEqual({ name: 'mcp', config: config.config });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating MCP module with config:', config.config);
    });
  });

  describe('public methods', () => {
    beforeEach(async () => {
      mockRegistry.createModule.mockResolvedValue({ name: 'test-module' });
      await service.onModuleInit();
    });

    it('should get module by name', () => {
      const result = service.getModule('auth');
      expect(result).toBeDefined();
    });

    it('should check if module is loaded', () => {
      const result = service.isModuleLoaded('auth');
      expect(result).toBe(true);
    });

    it('should get all loaded modules', () => {
      const result = service.getLoadedModules();
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBeGreaterThan(0);
    });

    it('should get module configuration', () => {
      const result = service.getModuleConfig();
      expect(result).toBe(mockModuleConfig);
    });

    it('should update module configuration and reload', async () => {
      const newConfig = { 
        core: { 
          auth: { 
            enabled: false,
            version: '1.0.0',
            dependencies: [],
            config: {}
          },
          users: {
            enabled: true,
            version: '1.0.0',
            dependencies: [],
            config: {}
          },
          health: {
            enabled: true,
            version: '1.0.0',
            dependencies: [],
            config: {}
          }
        } 
      };
      
      await service.updateModuleConfig(newConfig);
      
      expect(mockLogger.log).toHaveBeenCalledWith('Initializing modules...');
    });

    it('should unload module successfully', () => {
      service.unloadModule('notifications');
      
      expect(service.isModuleLoaded('notifications')).toBe(false);
      expect(mockLogger.log).toHaveBeenCalledWith('Module unloaded: notifications');
    });

    it('should throw error when unloading module with dependents', () => {
      expect(() => {
        service.unloadModule('users');
      }).toThrow('Cannot unload module users: depended on by auth, notifications, tRPC');
    });

    it('should handle unloading non-existent module', () => {
      service.unloadModule('non-existent');
      
      expect(service.isModuleLoaded('non-existent')).toBe(false);
    });
  });

  describe('legacy module creation error handling', () => {
    beforeEach(async () => {
      mockRegistry.createModule.mockRejectedValue(new Error('Plugin registry failed'));
      await service.onModuleInit();
    });

    it('should handle unknown core module gracefully', () => {
      try {
        (service as any).createCoreModuleLegacy('unknown', { enabled: true, version: '1.0.0', dependencies: [], config: {} });
      } catch (error) {
        expect(error.message).toBe('Unknown core module: unknown');
      }
    });

    it('should handle unknown feature module gracefully', () => {
      try {
        (service as any).createFeatureModuleLegacy('unknown', { enabled: true, version: '1.0.0', dependencies: [], config: {} });
      } catch (error) {
        expect(error.message).toBe('Unknown feature module: unknown');
      }
    });

    it('should handle unknown integration module gracefully', () => {
      try {
        (service as any).createIntegrationModuleLegacy('unknown', { enabled: true, version: '1.0.0', dependencies: [], config: {} });
      } catch (error) {
        expect(error.message).toBe('Unknown integration module: unknown');
      }
    });


    it('should successfully load health module via legacy method', () => {
      const result = (service as any).createCoreModuleLegacy('health', { 
        enabled: true, 
        version: '1.0.0', 
        dependencies: [], 
        config: { checkInterval: 30000 } 
      });
      
      expect(result).toBeDefined();
    });

    it('should successfully load billing module via legacy method', () => {
      const result = (service as any).createFeatureModuleLegacy('billing', { 
        enabled: true, 
        version: '1.0.0', 
        dependencies: ['users'], 
        config: { provider: 'stripe' } 
      });
      
      expect(result).toBeDefined();
    });

    it('should successfully load analytics module via legacy method', () => {
      const result = (service as any).createFeatureModuleLegacy('analytics', { 
        enabled: true, 
        version: '1.0.0', 
        dependencies: ['users'], 
        config: { provider: 'internal' } 
      });
      
      expect(result).toBeDefined();
    });

    it('should successfully load websocket module via legacy method', () => {
      const result = (service as any).createFeatureModuleLegacy('websocket', { 
        enabled: true, 
        version: '1.0.0', 
        dependencies: ['auth'], 
        config: { namespace: '/notifications' } 
      });
      
      expect(result).toBeDefined();
    });

    it('should successfully load email module via legacy method', () => {
      const result = (service as any).createFeatureModuleLegacy('email', { 
        enabled: true, 
        version: '1.0.0', 
        dependencies: [], 
        config: { provider: 'resend' } 
      });
      
      expect(result).toBeDefined();
    });

    it('should successfully load graphQL module via legacy method', () => {
      const result = (service as any).createIntegrationModuleLegacy('graphQL', { 
        enabled: true, 
        version: '1.0.0', 
        dependencies: ['auth', 'users'], 
        config: { basePath: '/graphql' } 
      });
      
      expect(result).toBeDefined();
    });

    it('should successfully load rest module via legacy method', () => {
      const result = (service as any).createIntegrationModuleLegacy('rest', { 
        enabled: true, 
        version: '1.0.0', 
        dependencies: ['auth', 'users'], 
        config: { basePath: '/api' } 
      });
      
      expect(result).toBeDefined();
    });

    it('should successfully load mcp module via legacy method', () => {
      const result = (service as any).createIntegrationModuleLegacy('mcp', { 
        enabled: true, 
        version: '1.0.0', 
        dependencies: ['auth'], 
        config: { basePath: '/mcp' } 
      });
      
      expect(result).toBeDefined();
    });
  });

  describe('getModuleStatus', () => {
    beforeEach(async () => {
      mockRegistry.createModule.mockResolvedValue({ name: 'test-module' });
      mockRegistry.getRegistryStats.mockReturnValue({
        totalPlugins: 5,
        supportedModules: ['auth', 'users', 'notifications'],
        pluginsByCategory: {
          core: ['auth', 'users'],
          feature: ['notifications'],
          integration: []
        },
        pluginDetails: [
          {
            name: 'auth',
            category: 'core',
            version: '1.0.0',
            dependencies: [],
            className: 'AuthPlugin'
          },
          {
            name: 'users',
            category: 'core',
            version: '1.0.0',
            dependencies: ['auth'],
            className: 'UsersPlugin'
          },
          {
            name: 'notifications',
            category: 'feature',
            version: '1.0.0',
            dependencies: ['users'],
            className: 'NotificationsPlugin'
          }
        ]
      });
      await service.onModuleInit();
    });

    it('should return comprehensive module status', () => {
      const status = service.getModuleStatus();
      
      expect(status).toHaveProperty('loaded');
      expect(status).toHaveProperty('available');
      expect(status).toHaveProperty('loadedCount');
      expect(status).toHaveProperty('availableCount');
      expect(status).toHaveProperty('config');
      expect(status).toHaveProperty('ocpCompliance');
      expect(status.ocpCompliance).toHaveProperty('registeredPlugins');
      expect(status.ocpCompliance).toHaveProperty('supportedModules');
      expect(status.ocpCompliance).toHaveProperty('pluginsByCategory');
      expect(status.ocpCompliance).toHaveProperty('benefits');
      expect(status.ocpCompliance).toHaveProperty('extensionExample');
    });

    it('should include registry stats', () => {
      const status = service.getModuleStatus();
      
      expect(mockRegistry.getRegistryStats).toHaveBeenCalled();
      expect(status.ocpCompliance.registeredPlugins).toBe(5);
      expect(status.ocpCompliance.supportedModules).toEqual(['auth', 'users', 'notifications']);
    });
  });

  describe('getPluginInfo', () => {
    beforeEach(async () => {
      mockRegistry.createModule.mockResolvedValue({ name: 'test-module' });
      mockRegistry.getRegistryStats.mockReturnValue({
        totalPlugins: 5,
        supportedModules: ['auth', 'users'],
        pluginsByCategory: { core: ['auth', 'users'], feature: [], integration: [] },
        pluginDetails: [
          {
            name: 'auth',
            category: 'core',
            version: '1.0.0',
            dependencies: [],
            className: 'AuthPlugin'
          },
          {
            name: 'users',
            category: 'core',
            version: '1.0.0',
            dependencies: ['auth'],
            className: 'UsersPlugin'
          }
        ]
      });
      mockRegistry.getPluginMetadata.mockReturnValue([
        { name: 'auth', category: 'core', version: '1.0.0' }
      ]);
      await service.onModuleInit();
    });

    it('should return plugin information', () => {
      const pluginInfo = service.getPluginInfo();
      
      expect(pluginInfo).toHaveProperty('registryStats');
      expect(pluginInfo).toHaveProperty('pluginMetadata');
      expect(pluginInfo).toHaveProperty('ocpDemonstration');
      expect(pluginInfo.ocpDemonstration).toHaveProperty('title');
      expect(pluginInfo.ocpDemonstration).toHaveProperty('description');
      expect(pluginInfo.ocpDemonstration).toHaveProperty('examples');
      expect(pluginInfo.ocpDemonstration).toHaveProperty('architecture');
      
      expect(mockRegistry.getRegistryStats).toHaveBeenCalled();
      expect(mockRegistry.getPluginMetadata).toHaveBeenCalled();
    });
  });
});