import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { WebhookModulePlugin } from './webhook-module.plugin';
import { ModuleFlag } from '../../../config/modules.config';

describe('WebhookModulePlugin', () => {
  let plugin: WebhookModulePlugin;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookModulePlugin],
    }).compile();

    plugin = module.get<WebhookModulePlugin>(WebhookModulePlugin);
    (plugin as any).logger = mockLogger;
  });

  describe('plugin properties', () => {
    it('should have correct plugin properties', () => {
      expect(plugin.name).toBe('webhook');
      expect(plugin.category).toBe('integration');
      expect(plugin.version).toBe('1.0.0');
      expect(plugin.dependencies).toEqual(['users', 'notifications']);
    });
  });

  describe('create', () => {
    it('should create webhook module successfully', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {
          maxRetries: 3,
          timeoutMs: 5000,
          enableSigning: true,
          signingSecret: 'test-secret',
          allowedEvents: ['user.created', 'user.updated'],
          rateLimit: { maxRequests: 100, windowMs: 60000 },
          enableLogging: true,
        },
      };

      const result = await plugin.create(config);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('name', 'webhook');
      expect(result).toHaveProperty('type', 'integration');
      expect(result).toHaveProperty('config', config.config);
      expect(result).toHaveProperty('initialized', true);
      expect(result).toHaveProperty('services');
      expect(result).toHaveProperty('registerWebhook');
      expect(result).toHaveProperty('triggerWebhook');
      expect(result).toHaveProperty('getWebhooks');
      expect(result).toHaveProperty('validateWebhook');
      expect(result).toHaveProperty('retryFailedWebhooks');
      expect(mockLogger.log).toHaveBeenCalledWith('Creating Webhook module with config:', config.config);
      expect(mockLogger.log).toHaveBeenCalledWith('Webhook module created successfully');
    });

    it('should handle creation errors gracefully', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      // Mock an error during creation
      jest.spyOn(plugin, 'create').mockImplementationOnce(async () => {
        throw new Error('Test error');
      });

      await expect(plugin.create(config)).rejects.toThrow('Test error');
    });

    it('should include webhook-specific services', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);

      expect(result.services).toHaveProperty('webhookService');
      expect(result.services).toHaveProperty('webhookRegistry');
      expect(result.services).toHaveProperty('webhookValidator');
      expect(result.services).toHaveProperty('webhookQueue');
    });

    it('should include webhook-specific methods', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);

      expect(typeof result.registerWebhook).toBe('function');
      expect(typeof result.triggerWebhook).toBe('function');
      expect(typeof result.getWebhooks).toBe('function');
      expect(typeof result.validateWebhook).toBe('function');
      expect(typeof result.retryFailedWebhooks).toBe('function');
    });
  });

  describe('supports', () => {
    it('should return true for webhook module', () => {
      expect(plugin.supports('webhook')).toBe(true);
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
        dependencies: ['users', 'notifications'],
        config: {
          maxRetries: 3,
          timeoutMs: 5000,
          enableSigning: true,
          signingSecret: 'test-secret',
          allowedEvents: ['user.created', 'user.updated'],
          rateLimit: { maxRequests: 100, windowMs: 60000 },
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
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return error for missing config', () => {
      const result = plugin.validateConfig(null as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Webhook module config is required');
    });

    it('should return error for missing config.config', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: null as any,
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Webhook module config.config is required');
    });

    it('should validate maxRetries type and minimum value', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {
          maxRetries: -1,
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('maxRetries must be a non-negative integer');
    });

    it('should validate timeoutMs type and minimum value', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {
          timeoutMs: 500,
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('timeoutMs must be an integer >= 1000');
    });

    it('should validate enableSigning type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {
          enableSigning: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('enableSigning must be a boolean');
    });

    it('should validate signingSecret type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {
          signingSecret: 123,
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('signingSecret must be a string');
    });

    it('should validate allowedEvents type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {
          allowedEvents: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('allowedEvents must be an array');
    });

    it('should validate rateLimit type', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {
          rateLimit: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('rateLimit must be an object');
    });

    it('should validate multiple errors', () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {
          maxRetries: -1,
          timeoutMs: 500,
          enableSigning: 'invalid',
          signingSecret: 123,
          allowedEvents: 'invalid',
          rateLimit: 'invalid',
        },
      };

      const result = plugin.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(6);
      expect(result.errors).toContain('maxRetries must be a non-negative integer');
      expect(result.errors).toContain('timeoutMs must be an integer >= 1000');
      expect(result.errors).toContain('enableSigning must be a boolean');
      expect(result.errors).toContain('signingSecret must be a string');
      expect(result.errors).toContain('allowedEvents must be an array');
      expect(result.errors).toContain('rateLimit must be an object');
    });
  });

  describe('getMetadata', () => {
    it('should return comprehensive metadata', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.name).toBe('webhook');
      expect(metadata.category).toBe('integration');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.dependencies).toEqual(['users', 'notifications']);
      expect(metadata.description).toContain('Webhook integration module');
      expect(metadata.tags).toContain('webhook');
      expect(metadata.tags).toContain('integration');
      expect(metadata.tags).toContain('events');
      expect(metadata.tags).toContain('http-callbacks');
    });

    it('should include config schema', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.configSchema).toHaveProperty('maxRetries');
      expect(metadata.configSchema).toHaveProperty('timeoutMs');
      expect(metadata.configSchema).toHaveProperty('enableSigning');
      expect(metadata.configSchema).toHaveProperty('signingSecret');
      expect(metadata.configSchema).toHaveProperty('allowedEvents');
      expect(metadata.configSchema).toHaveProperty('rateLimit');
      expect(metadata.configSchema).toHaveProperty('enableLogging');
    });

    it('should have correct config schema types', () => {
      const metadata = plugin.getMetadata();

      expect(metadata.configSchema?.maxRetries).toHaveProperty('type', 'number');
      expect(metadata.configSchema?.timeoutMs).toHaveProperty('type', 'number');
      expect(metadata.configSchema?.enableSigning).toHaveProperty('type', 'boolean');
      expect(metadata.configSchema?.signingSecret).toHaveProperty('type', 'string');
      expect(metadata.configSchema?.allowedEvents).toHaveProperty('type', 'array');
      expect(metadata.configSchema?.rateLimit).toHaveProperty('type', 'object');
      expect(metadata.configSchema?.enableLogging).toHaveProperty('type', 'boolean');
    });
  });

  describe('private methods', () => {
    let mockDateNow: jest.SpyInstance;
    let mockMathRandom: jest.SpyInstance;

    beforeEach(() => {
      mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(1234567890000);
      mockMathRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
      mockDateNow.mockRestore();
      mockMathRandom.mockRestore();
    });

    it('should register webhook correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const webhookConfig = {
        url: 'https://example.com/webhook',
        events: ['user.created', 'user.updated'],
        active: true,
      };
      const registeredWebhook = await result.registerWebhook(webhookConfig);

      expect(registeredWebhook).toHaveProperty('id', 'webhook_1234567890000');
      expect(registeredWebhook).toHaveProperty('url', 'https://example.com/webhook');
      expect(registeredWebhook).toHaveProperty('events', ['user.created', 'user.updated']);
      expect(registeredWebhook).toHaveProperty('active', true);
      expect(registeredWebhook).toHaveProperty('secret');
      expect(registeredWebhook).toHaveProperty('createdAt');
      expect(registeredWebhook).toHaveProperty('lastTriggered', null);
      expect(registeredWebhook).toHaveProperty('totalCalls', 0);
      expect(registeredWebhook).toHaveProperty('successfulCalls', 0);
      expect(registeredWebhook).toHaveProperty('failedCalls', 0);
      expect(mockLogger.debug).toHaveBeenCalledWith('Registering webhook:', webhookConfig);
      expect(mockLogger.log).toHaveBeenCalledWith(
        `Webhook registered: webhook_1234567890000 -> https://example.com/webhook`
      );
    });

    it('should register webhook with default values', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const webhookConfig = {
        url: 'https://example.com/webhook',
      };
      const registeredWebhook = await result.registerWebhook(webhookConfig);

      expect(registeredWebhook).toHaveProperty('events', ['*']);
      expect(registeredWebhook).toHaveProperty('active', true);
      expect(registeredWebhook).toHaveProperty('secret');
    });

    it('should trigger webhook correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const eventData = { userId: 'user123', action: 'created' };
      const triggerResult = await result.triggerWebhook('user.created', eventData);

      expect(triggerResult).toHaveProperty('event', 'user.created');
      expect(triggerResult).toHaveProperty('triggeredAt');
      expect(triggerResult).toHaveProperty('webhooksTriggered', 3);
      expect(triggerResult).toHaveProperty('successful', 2);
      expect(triggerResult).toHaveProperty('failed', 1);
      expect(triggerResult).toHaveProperty('results');
      expect(triggerResult.results).toHaveLength(3);
      expect(triggerResult.results[0]).toHaveProperty('webhookId', 'webhook_1');
      expect(triggerResult.results[0]).toHaveProperty('status', 'success');
      expect(triggerResult.results[2]).toHaveProperty('status', 'failed');
      expect(mockLogger.debug).toHaveBeenCalledWith('Triggering webhook for event: user.created', eventData);
      expect(mockLogger.log).toHaveBeenCalledWith(
        expect.stringContaining('Webhook event \'user.created\' processed: 2/3 successful')
      );
    });

    it('should get webhooks correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const webhooks = await result.getWebhooks();

      expect(webhooks).toHaveLength(2);
      expect(webhooks[0]).toHaveProperty('id', 'webhook_1');
      expect(webhooks[0]).toHaveProperty('url', 'https://api.example.com/webhooks/user-events');
      expect(webhooks[0]).toHaveProperty('events', ['user.created', 'user.updated']);
      expect(webhooks[0]).toHaveProperty('active', true);
      expect(webhooks[0]).toHaveProperty('totalCalls', 45);
      expect(webhooks[0]).toHaveProperty('successfulCalls', 43);
      expect(webhooks[0]).toHaveProperty('failedCalls', 2);
      expect(webhooks[1]).toHaveProperty('id', 'webhook_2');
      expect(webhooks[1]).toHaveProperty('url', 'https://slack.com/api/webhooks/incoming');
      expect(mockLogger.debug).toHaveBeenCalledWith('Getting webhooks');
    });

    it('should get webhooks for specific user', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const webhooks = await result.getWebhooks('test-user');

      expect(webhooks).toHaveLength(2);
      expect(mockLogger.debug).toHaveBeenCalledWith('Getting webhooks for user: test-user');
    });

    it('should validate webhook correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const validWebhook = {
        url: 'https://example.com/webhook',
        events: ['user.created'],
        active: true,
      };
      const validation = result.validateWebhook(validWebhook);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should validate webhook with invalid URL', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const invalidWebhook = {
        url: 'invalid-url',
      };
      const validation = result.validateWebhook(invalidWebhook);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Webhook URL must be a valid URL');
    });

    it('should validate webhook with missing URL', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const invalidWebhook = {};
      const validation = result.validateWebhook(invalidWebhook);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Webhook URL is required and must be a string');
    });

    it('should validate webhook with invalid events', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const invalidWebhook = {
        url: 'https://example.com/webhook',
        events: 'invalid',
      };
      const validation = result.validateWebhook(invalidWebhook);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Webhook events must be an array');
    });

    it('should validate webhook with invalid active flag', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const invalidWebhook = {
        url: 'https://example.com/webhook',
        active: 'invalid',
      };
      const validation = result.validateWebhook(invalidWebhook);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Webhook active flag must be a boolean');
    });

    it('should retry failed webhooks correctly', async () => {
      const config: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['users', 'notifications'],
        config: {},
      };

      const result: any = await plugin.create(config);
      const retryResult = await result.retryFailedWebhooks();

      expect(retryResult).toHaveProperty('retriedWebhooks', 3);
      expect(retryResult).toHaveProperty('successful', 2);
      expect(retryResult).toHaveProperty('stillFailed', 1);
      expect(retryResult).toHaveProperty('retryTimestamp');
      expect(mockLogger.debug).toHaveBeenCalledWith('Retrying failed webhooks');
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Webhook retry completed: 2/3 now successful'
      );
    });

    it('should generate secret correctly', async () => {
      const secret = (plugin as any).generateSecret();
      
      expect(secret).toMatch(/^whsec_[a-z0-9]+$/);
      expect(secret.length).toBeGreaterThan(6); // whsec_ + at least some characters
    });
  });
});