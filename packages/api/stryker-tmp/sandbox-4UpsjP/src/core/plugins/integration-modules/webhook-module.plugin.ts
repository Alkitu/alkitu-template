// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import {
  IModulePlugin,
  ModuleCategory,
  ModuleMetadata,
} from '../module-plugin.interface';
import { ModuleFlag } from '../../../config/modules.config';

/**
 * Webhook Module Plugin - OCP EXTENSION EXAMPLE
 *
 * This class demonstrates OCP compliance by extending the module system
 * WITHOUT modifying any existing code. This new plugin can be added
 * and registered dynamically.
 *
 * NOTICE: This file is a NEW addition that doesn't modify existing classes.
 */
@Injectable()
export class WebhookModulePlugin implements IModulePlugin {
  private readonly logger = new Logger(WebhookModulePlugin.name);

  readonly name = 'webhook';
  readonly category: ModuleCategory = 'integration';
  readonly version = '1.0.0';
  readonly dependencies: string[] = ['users', 'notifications']; // Depends on users and notifications

  /**
   * Create webhook module instance
   */
  async create(config: ModuleFlag): Promise<any> {
    try {
      this.logger.log('Creating Webhook module with config:', config.config);

      // Create the webhook module with enhanced functionality
      const webhookModule = {
        name: 'webhook',
        type: 'integration',
        config: config.config,
        initialized: true,
        services: {
          webhookService: 'WebhookService instance',
          webhookRegistry: 'WebhookRegistry instance',
          webhookValidator: 'WebhookValidator instance',
          webhookQueue: 'WebhookQueue instance',
        },
        // Add webhook-specific functionality
        registerWebhook: (webhook: any) => this.registerWebhook(webhook),
        triggerWebhook: (event: string, data: any) =>
          this.triggerWebhook(event, data),
        getWebhooks: (userId?: string) => this.getWebhooks(userId),
        validateWebhook: (webhook: any) => this.validateWebhook(webhook),
        retryFailedWebhooks: () => this.retryFailedWebhooks(),
      };

      this.logger.log('Webhook module created successfully');
      return webhookModule;
    } catch (error) {
      this.logger.error('Failed to create Webhook module:', error);
      throw error;
    }
  }

  /**
   * Check if this plugin supports the given module name
   */
  supports(name: string): boolean {
    return name === 'webhook';
  }

  /**
   * Validate webhook module configuration
   */
  validateConfig(config: ModuleFlag): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config) {
      errors.push('Webhook module config is required');
      return { isValid: false, errors };
    }

    if (!config.enabled) {
      return { isValid: true, errors: [] };
    }

    // Validate webhook-specific configuration
    if (!config.config) {
      errors.push('Webhook module config.config is required');
    } else {
      // Add specific webhook config validations
      if (
        config.config.maxRetries &&
        (!Number.isInteger(config.config.maxRetries) ||
          config.config.maxRetries < 0)
      ) {
        errors.push('maxRetries must be a non-negative integer');
      }

      if (
        config.config.timeoutMs &&
        (!Number.isInteger(config.config.timeoutMs) ||
          config.config.timeoutMs < 1000)
      ) {
        errors.push('timeoutMs must be an integer >= 1000');
      }

      if (
        config.config.enableSigning &&
        typeof config.config.enableSigning !== 'boolean'
      ) {
        errors.push('enableSigning must be a boolean');
      }

      if (
        config.config.signingSecret &&
        typeof config.config.signingSecret !== 'string'
      ) {
        errors.push('signingSecret must be a string');
      }

      if (
        config.config.allowedEvents &&
        !Array.isArray(config.config.allowedEvents)
      ) {
        errors.push('allowedEvents must be an array');
      }

      if (
        config.config.rateLimit &&
        typeof config.config.rateLimit !== 'object'
      ) {
        errors.push('rateLimit must be an object');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get webhook module metadata
   */
  getMetadata(): ModuleMetadata {
    return {
      name: this.name,
      category: this.category,
      version: this.version,
      dependencies: this.dependencies,
      description:
        'Webhook integration module providing event-driven HTTP callbacks to external services',
      configSchema: {
        maxRetries: {
          type: 'number',
          required: false,
          description: 'Maximum retry attempts for failed webhooks',
        },
        timeoutMs: {
          type: 'number',
          required: false,
          description: 'Webhook request timeout in milliseconds',
        },
        enableSigning: {
          type: 'boolean',
          required: false,
          description: 'Enable webhook payload signing',
        },
        signingSecret: {
          type: 'string',
          required: false,
          description: 'Secret key for webhook payload signing',
        },
        allowedEvents: {
          type: 'array',
          required: false,
          description: 'List of events that can trigger webhooks',
        },
        rateLimit: {
          type: 'object',
          required: false,
          description: 'Rate limiting configuration for webhooks',
        },
        enableLogging: {
          type: 'boolean',
          required: false,
          description: 'Enable detailed webhook logging',
        },
      },
      tags: ['webhook', 'integration', 'events', 'http-callbacks'],
    };
  }

  /**
   * Private webhook-specific helper methods
   */
  private async registerWebhook(webhook: any): Promise<any> {
    this.logger.debug('Registering webhook:', webhook);

    const registeredWebhook = {
      id: `webhook_${Date.now()}`,
      url: webhook.url,
      events: webhook.events || ['*'],
      active: webhook.active !== false,
      secret: webhook.secret || this.generateSecret(),
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      ...webhook,
    };

    // Mock webhook registration logic
    this.logger.log(
      `Webhook registered: ${registeredWebhook.id} -> ${registeredWebhook.url}`,
    );
    return registeredWebhook;
  }

  private async triggerWebhook(event: string, data: any): Promise<any> {
    this.logger.debug(`Triggering webhook for event: ${event}`, data);

    // Mock webhook triggering logic
    const webhookResult = {
      event,
      triggeredAt: new Date().toISOString(),
      webhooksTriggered: 3,
      successful: 2,
      failed: 1,
      results: [
        { webhookId: 'webhook_1', status: 'success', responseTime: 150 },
        { webhookId: 'webhook_2', status: 'success', responseTime: 200 },
        {
          webhookId: 'webhook_3',
          status: 'failed',
          error: 'Connection timeout',
        },
      ],
    };

    this.logger.log(
      `Webhook event '${event}' processed: ${webhookResult.successful}/${webhookResult.webhooksTriggered} successful`,
    );
    return webhookResult;
  }

  private async getWebhooks(userId?: string): Promise<any[]> {
    this.logger.debug(
      `Getting webhooks${userId ? ` for user: ${userId}` : ''}`,
    );

    // Mock webhooks retrieval logic
    const mockWebhooks = [
      {
        id: 'webhook_1',
        userId: userId || 'user_123',
        url: 'https://api.example.com/webhooks/user-events',
        events: ['user.created', 'user.updated'],
        active: true,
        createdAt: new Date().toISOString(),
        lastTriggered: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        totalCalls: 45,
        successfulCalls: 43,
        failedCalls: 2,
      },
      {
        id: 'webhook_2',
        userId: userId || 'user_123',
        url: 'https://slack.com/api/webhooks/incoming',
        events: ['notification.sent'],
        active: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        lastTriggered: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        totalCalls: 12,
        successfulCalls: 12,
        failedCalls: 0,
      },
    ];

    return userId
      ? mockWebhooks.filter((w) => w.userId === userId)
      : mockWebhooks;
  }

  private validateWebhook(webhook: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!webhook.url || typeof webhook.url !== 'string') {
      errors.push('Webhook URL is required and must be a string');
    } else {
      try {
        new URL(webhook.url);
      } catch {
        errors.push('Webhook URL must be a valid URL');
      }
    }

    if (webhook.events && !Array.isArray(webhook.events)) {
      errors.push('Webhook events must be an array');
    }

    if (webhook.active !== undefined && typeof webhook.active !== 'boolean') {
      errors.push('Webhook active flag must be a boolean');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private async retryFailedWebhooks(): Promise<any> {
    this.logger.debug('Retrying failed webhooks');

    // Mock retry logic
    const retryResult = {
      retriedWebhooks: 3,
      successful: 2,
      stillFailed: 1,
      retryTimestamp: new Date().toISOString(),
    };

    this.logger.log(
      `Webhook retry completed: ${retryResult.successful}/${retryResult.retriedWebhooks} now successful`,
    );
    return retryResult;
  }

  private generateSecret(): string {
    // Generate a simple secret for webhook signing
    return `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  }
}
