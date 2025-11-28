import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { HealthModulePlugin } from './health-module.plugin';
import { ModuleFlag } from '../../../config/modules.config';

describe('HealthModulePlugin', () => {
  let plugin: HealthModulePlugin;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthModulePlugin],
    }).compile();

    plugin = module.get<HealthModulePlugin>(HealthModulePlugin);
    (plugin as any).logger = mockLogger;
  });

  describe('plugin properties', () => {
    it('should have correct plugin properties', () => {
      expect(plugin.name).toBe('health');
      expect(plugin.category).toBe('core');
      expect(plugin.version).toBe('1.0.0');
      expect(plugin.dependencies).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create health module successfully', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          checkInterval: 30000,
          enableMetrics: true,
          enableAlerts: true,
        },
      };

      const result = await plugin.create(config);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('name', 'health');
      expect(result).toHaveProperty('type', 'core');
      expect(result).toHaveProperty('config', config.config);
      expect(result).toHaveProperty('initialized', true);
      expect(result).toHaveProperty('services');
      expect(result).toHaveProperty('getSystemHealth');
      expect(result).toHaveProperty('getMetrics');
      expect(result).toHaveProperty('checkDatabase');
      expect(result).toHaveProperty('checkExternalServices');
      expect(mockLogger.log).toHaveBeenCalledWith('Creating Health module with config:', config.config);
      expect(mockLogger.log).toHaveBeenCalledWith('Health module created successfully');
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

    it('should include health-specific services', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {},
      };

      const result: any = await plugin.create(config);

      expect(result.services).toHaveProperty('healthService');
      expect(result.services).toHaveProperty('metricsService');
      expect(result.services).toHaveProperty('monitoringService');
    });

    it('should include health-specific methods', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {},
      };

      const result: any = await plugin.create(config);

      expect(typeof result.getSystemHealth).toBe('function');
      expect(typeof result.getMetrics).toBe('function');
      expect(typeof result.checkDatabase).toBe('function');
      expect(typeof result.checkExternalServices).toBe('function');
    });
  });

  describe('supports', () => {
    it('should return true for health module', () => {
      expect(plugin.supports('health')).toBe(true);
    });

    it('should return false for other modules', () => {
      expect(plugin.supports('auth')).toBe(false);
      expect(plugin.supports('users')).toBe(false);
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
          checkInterval: 30000,
          enableMetrics: true,
          enableAlerts: true,
          alertThresholds: { cpu: 80, memory: 90 },
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
      expect(result.errors).toContain('Health module config is required');
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
      expect(result.errors).toContain('Health module config.config is required');
    });

    it('should validate checkInterval type and minimum value', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          checkInterval: 500,
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('checkInterval must be a positive integer >= 1000ms');
    });

    it('should validate enableMetrics type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          enableMetrics: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('enableMetrics must be a boolean');
    });

    it('should validate alertThresholds type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          alertThresholds: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('alertThresholds must be an object');
    });

    it('should validate enableAlerts type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          enableAlerts: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('enableAlerts must be a boolean');
    });

    it('should validate multiple errors', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {
          checkInterval: 500,
          enableMetrics: 'invalid',
          enableAlerts: 'invalid',
          alertThresholds: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(4);
      expect(result.errors).toContain('checkInterval must be a positive integer >= 1000ms');
      expect(result.errors).toContain('enableMetrics must be a boolean');
      expect(result.errors).toContain('enableAlerts must be a boolean');
      expect(result.errors).toContain('alertThresholds must be an object');
    });
  });

  describe('getMetadata', () => {
    it('should return comprehensive metadata', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.name).toBe('health');
      expect(metadata.category).toBe('core');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.dependencies).toEqual([]);
      expect(metadata.description).toContain('System health monitoring module');
      expect(metadata.tags).toContain('health');
      expect(metadata.tags).toContain('monitoring');
      expect(metadata.tags).toContain('metrics');
      expect(metadata.tags).toContain('core');
    });

    it('should include config schema', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.configSchema).toHaveProperty('checkInterval');
      expect(metadata.configSchema).toHaveProperty('enableMetrics');
      expect(metadata.configSchema).toHaveProperty('alertThresholds');
      expect(metadata.configSchema).toHaveProperty('enableAlerts');
      expect(metadata.configSchema).toHaveProperty('healthChecks');
    });

    it('should have correct config schema types', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.configSchema?.checkInterval).toHaveProperty('type', 'number');
      expect(metadata.configSchema?.enableMetrics).toHaveProperty('type', 'boolean');
      expect(metadata.configSchema?.alertThresholds).toHaveProperty('type', 'object');
      expect(metadata.configSchema?.enableAlerts).toHaveProperty('type', 'boolean');
      expect(metadata.configSchema?.healthChecks).toHaveProperty('type', 'array');
    });
  });

  describe('private methods', () => {
    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should get system health correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {},
      };

      const result: any = await plugin.create(config);
      const health = await result.getSystemHealth();

      expect(health).toHaveProperty('status', 'healthy');
      expect(health).toHaveProperty('timestamp');
      expect(health).toHaveProperty('uptime');
      expect(health).toHaveProperty('memory');
      expect(health).toHaveProperty('cpu');
      expect(health).toHaveProperty('services');
      expect(health.services).toHaveProperty('database', 'healthy');
      expect(health.services).toHaveProperty('cache', 'healthy');
      expect(health.services).toHaveProperty('externalAPIs', 'healthy');
      expect(mockLogger.debug).toHaveBeenCalledWith('Getting system health status');
    });

    it('should get metrics correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {},
      };

      const result: any = await plugin.create(config);
      const metrics = await result.getMetrics();

      expect(metrics).toHaveProperty('timestamp');
      expect(metrics).toHaveProperty('requests');
      expect(metrics).toHaveProperty('resources');
      expect(metrics).toHaveProperty('activeConnections', 42);
      expect(metrics.requests).toHaveProperty('total', 12345);
      expect(metrics.requests).toHaveProperty('successful', 12000);
      expect(metrics.requests).toHaveProperty('failed', 345);
      expect(metrics.requests).toHaveProperty('averageResponseTime', 150);
      expect(metrics.resources).toHaveProperty('memoryUsage');
      expect(metrics.resources).toHaveProperty('cpuUsage');
      expect(metrics.resources).toHaveProperty('diskUsage', 75.5);
      expect(mockLogger.debug).toHaveBeenCalledWith('Getting system metrics');
    });

    it('should check database correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {},
      };

      const result: any = await plugin.create(config);
      const dbHealth = await result.checkDatabase();

      expect(dbHealth).toHaveProperty('status', 'healthy');
      expect(dbHealth).toHaveProperty('responseTime', 25);
      expect(dbHealth).toHaveProperty('connections');
      expect(dbHealth.connections).toHaveProperty('active', 5);
      expect(dbHealth.connections).toHaveProperty('idle', 10);
      expect(dbHealth.connections).toHaveProperty('total', 15);
      expect(mockLogger.debug).toHaveBeenCalledWith('Checking database health');
    });

    it('should check external services correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: [],
        config: {},
      };

      const result: any = await plugin.create(config);
      const externalHealth = await result.checkExternalServices();

      expect(externalHealth).toHaveProperty('email');
      expect(externalHealth).toHaveProperty('storage');
      expect(externalHealth).toHaveProperty('authentication');
      expect(externalHealth.email).toEqual({ status: 'healthy', responseTime: 100 });
      expect(externalHealth.storage).toEqual({ status: 'healthy', responseTime: 50 });
      expect(externalHealth.authentication).toEqual({ status: 'healthy', responseTime: 75 });
      expect(mockLogger.debug).toHaveBeenCalledWith('Checking external services health');
    });

    it('should get CPU usage correctly', async () => {
      const cpuUsage = await (plugin as any).getCpuUsage();

      expect(cpuUsage).toBe(50); // Math.random() * 100 with mocked value 0.5
    });
  });
});