import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { LSPCompliantWelcomeEmailChannel } from './lsp-compliant-welcome-email.channel';
import { EmailService } from '../email.service';
import {
  WelcomeEmailData,
  EmailDeliveryResult,
} from '../interfaces/email-service.interface';
import {
  ServiceUnavailableError,
  ValidationError,
} from '../../common/interfaces/base-service.interface';

describe('LSPCompliantWelcomeEmailChannel', () => {
  let channel: LSPCompliantWelcomeEmailChannel;
  let emailService: jest.Mocked<EmailService>;
  let loggerSpy: jest.SpyInstance;

  const mockEmailService = {
    sendWelcomeEmail: jest.fn(),
    testConfiguration: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LSPCompliantWelcomeEmailChannel,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    channel = module.get<LSPCompliantWelcomeEmailChannel>(
      LSPCompliantWelcomeEmailChannel,
    );
    emailService = module.get<EmailService>(
      EmailService,
    ) as jest.Mocked<EmailService>;

    // Spy on logger
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    loggerSpy.mockRestore();
  });

  describe('Constructor and Properties - LSP Compliance', () => {
    it('should be defined', () => {
      expect(channel).toBeDefined();
    });

    it('should have correct immutable properties', () => {
      expect(channel.serviceId).toBe('welcome-email-channel');
      expect(channel.version).toBe('1.0.0');
      expect(channel.channelType).toBe('welcome');
      expect(channel.supportedDataTypes).toEqual(['welcome']);
    });

    it('should have proper configuration schema', () => {
      expect(channel.configSchema).toBeDefined();
      expect(channel.configSchema.templateId).toBeDefined();
      expect(channel.configSchema.sendDelay).toBeDefined();
      expect(channel.configSchema.enableTracking).toBeDefined();
    });

    it('should have EmailService injected', () => {
      expect(emailService).toBeDefined();
    });
  });

  describe('initialize method - LSP Contract Implementation', () => {
    it('should initialize successfully', async () => {
      emailService.testConfiguration.mockResolvedValue({
        success: true,
      });

      const result = await channel.initialize();

      expect(result.success).toBe(true);
      expect(result.metadata!).toBeDefined();
      expect(result.metadata?.initializedAt).toBeDefined();
      expect(emailService.testConfiguration).toHaveBeenCalled();
    });

    it('should handle email service unavailable', async () => {
      emailService.testConfiguration.mockResolvedValue({
        success: false,
        error: 'Service unavailable',
      });

      const result = await channel.initialize();

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(ServiceUnavailableError);
      expect(result.error?.message).toBe('Email service is not available');
    });

    it('should handle initialization exceptions', async () => {
      emailService.testConfiguration.mockRejectedValue(
        new Error('Connection failed'),
      );

      const result = await channel.initialize();

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(ServiceUnavailableError);
      expect(result.error?.message).toBe(
        'Failed to initialize welcome email channel',
      );
    });

    it('should never throw exceptions', async () => {
      emailService.testConfiguration.mockRejectedValue(
        new Error('Critical error'),
      );

      await expect(channel.initialize()).resolves.not.toThrow();
    });
  });

  describe('isHealthy method - LSP Contract Implementation', () => {
    it('should return false when not initialized', async () => {
      const result = await channel.isHealthy();
      expect(result).toBe(false);
    });

    it('should return true when initialized and email service is healthy', async () => {
      // Initialize first
      emailService.testConfiguration.mockResolvedValue({ success: true });
      await channel.initialize();

      // Then check health
      emailService.testConfiguration.mockResolvedValue({ success: true });
      const result = await channel.isHealthy();
      expect(result).toBe(true);
    });

    it('should return false when email service is unhealthy', async () => {
      // Initialize first
      emailService.testConfiguration.mockResolvedValue({ success: true });
      await channel.initialize();

      // Then simulate unhealthy service
      emailService.testConfiguration.mockResolvedValue({ success: false });
      const result = await channel.isHealthy();
      expect(result).toBe(false);
    });

    it('should handle health check timeouts', async () => {
      // Initialize first
      emailService.testConfiguration.mockResolvedValue({ success: true });
      await channel.initialize();

      // Simulate timeout
      emailService.testConfiguration.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true }), 5000),
          ),
      );

      const result = await channel.isHealthy();
      expect(result).toBe(false);
    });

    it('should never throw exceptions', async () => {
      emailService.testConfiguration.mockRejectedValue(
        new Error('Critical error'),
      );

      await expect(channel.isHealthy()).resolves.not.toThrow();
    });
  });

  describe('cleanup method - LSP Contract Implementation', () => {
    it('should cleanup successfully', async () => {
      const result = await channel.cleanup();

      expect(result.success).toBe(true);
      expect(result.metadata!).toBeDefined();
      expect(result.metadata?.cleanedUpAt).toBeDefined();
    });

    it('should be idempotent', async () => {
      const result1 = await channel.cleanup();
      const result2 = await channel.cleanup();

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    it('should handle cleanup exceptions', async () => {
      // Force an error during cleanup
      jest
        .spyOn(Promise, 'resolve')
        .mockRejectedValueOnce(new Error('Cleanup failed'));

      const result = await channel.cleanup();

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(ServiceUnavailableError);
    });

    it('should never throw exceptions', async () => {
      jest
        .spyOn(Promise, 'resolve')
        .mockRejectedValueOnce(new Error('Critical error'));

      await expect(channel.cleanup()).resolves.not.toThrow();
    });
  });

  describe('getServiceInfo method - LSP Contract Implementation', () => {
    it('should return service information', () => {
      const info = channel.getServiceInfo();

      expect(info.serviceId).toBe('welcome-email-channel');
      expect(info.version).toBe('1.0.0');
      expect(info.status).toBe('stopped'); // Not initialized
      expect(info.uptime).toBeGreaterThanOrEqual(0);
      expect(info.dependencies).toContain('email-service');
      expect(info.capabilities).toContain('welcome-emails');
    });

    it('should show healthy status when initialized', async () => {
      emailService.testConfiguration.mockResolvedValue({ success: true });
      await channel.initialize();

      const info = channel.getServiceInfo();
      expect(info.status).toBe('healthy');
    });

    it('should never throw exceptions', () => {
      expect(() => channel.getServiceInfo()).not.toThrow();
    });
  });

  describe('validateData method - LSP Contract Implementation', () => {
    const validData: WelcomeEmailData = {
      dataType: 'welcome',
      recipientEmail: 'test@example.com',
      recipientName: 'Test User',
      registrationDate: '2024-01-01',
      loginUrl: 'https://example.com/login',
      unsubscribeUrl: 'https://example.com/unsubscribe',
      supportUrl: 'https://example.com/support',
      senderName: 'Welcome Team',
      replyTo: 'reply@example.com',
    };

    it('should validate correct data successfully', () => {
      const result = channel.validateData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate minimal required data', () => {
      const minimalData: WelcomeEmailData = {
        dataType: 'welcome',
        recipientEmail: 'test@example.com',
        recipientName: 'Test User',
        registrationDate: '2024-01-01',
        loginUrl: 'https://example.com/login',
        unsubscribeUrl: 'https://example.com/unsubscribe',
        supportUrl: 'https://example.com/support',
      };
      const result = channel.validateData(minimalData);
      expect(result.isValid).toBe(true);
    });

    it('should reject null/undefined data', () => {
      const result = channel.validateData(null as any);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe('Email data is required');
    });

    it('should validate dataType field', () => {
      const invalidData = { ...validData, dataType: 'invalid' as any };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.message === 'dataType must be "welcome"'),
      ).toBe(true);
    });

    it('should validate recipientEmail field', () => {
      const invalidData = { ...validData, recipientEmail: null as any };
      const result = channel.validateData(invalidData as any);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) =>
            e.message === 'recipientEmail is required and must be a string',
        ),
      ).toBe(true);
    });

    it('should validate email format', () => {
      const invalidData = { ...validData, recipientEmail: 'invalid-email' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.message === 'recipientEmail must be a valid email address',
        ),
      ).toBe(true);
    });

    it('should validate recipientName field', () => {
      const invalidData = { ...validData, recipientName: null as any };
      const result = channel.validateData(invalidData as any);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.message === 'recipientName is required and must be a string',
        ),
      ).toBe(true);
    });

    it('should validate registrationDate field', () => {
      const invalidData = { ...validData, registrationDate: null as any };
      const result = channel.validateData(invalidData as any);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) =>
            e.message === 'registrationDate is required and must be a string',
        ),
      ).toBe(true);
    });

    it('should validate loginUrl field', () => {
      const invalidData = { ...validData, loginUrl: null as any };
      const result = channel.validateData(invalidData as any);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.message === 'loginUrl is required and must be a string',
        ),
      ).toBe(true);
    });

    it('should validate loginUrl format', () => {
      const invalidData = { ...validData, loginUrl: 'invalid-url' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((e) => e.message === 'loginUrl must be a valid URL'),
      ).toBe(true);
    });

    it('should validate unsubscribeUrl field', () => {
      const invalidData = { ...validData, unsubscribeUrl: null as any };
      const result = channel.validateData(invalidData as any);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) =>
            e.message === 'unsubscribeUrl is required and must be a string',
        ),
      ).toBe(true);
    });

    it('should validate unsubscribeUrl format', () => {
      const invalidData = { ...validData, unsubscribeUrl: 'invalid-url' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.message === 'unsubscribeUrl must be a valid URL',
        ),
      ).toBe(true);
    });

    it('should validate supportUrl field', () => {
      const invalidData = { ...validData, supportUrl: null as any };
      const result = channel.validateData(invalidData as any);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.message === 'supportUrl is required and must be a string',
        ),
      ).toBe(true);
    });

    it('should validate supportUrl format', () => {
      const invalidData = { ...validData, supportUrl: 'invalid-url' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.message === 'supportUrl must be a valid URL',
        ),
      ).toBe(true);
    });

    it('should validate optional senderName field', () => {
      const invalidData = { ...validData, senderName: 123 };
      const result = channel.validateData(invalidData as any);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.message === 'senderName must be a string if provided',
        ),
      ).toBe(true);
    });

    it('should validate optional replyTo field', () => {
      const invalidData = { ...validData, replyTo: 'invalid-email' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) =>
            e.message === 'replyTo must be a valid email address if provided',
        ),
      ).toBe(true);
    });

    it('should handle validation exceptions gracefully', () => {
      // Create a data object that will cause an error during validation
      const problematicData = {};
      Object.defineProperty(problematicData, 'recipientEmail', {
        get: () => {
          throw new Error('Property access error');
        },
      });

      const result = channel.validateData(problematicData as any);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.message === 'Validation failed due to unexpected error',
        ),
      ).toBe(true);
    });

    it('should never throw exceptions', () => {
      const problematicData = {};
      Object.defineProperty(problematicData, 'recipientEmail', {
        get: () => {
          throw new Error('Property access error');
        },
      });

      expect(() => channel.validateData(problematicData as any)).not.toThrow();
    });
  });

  describe('send method - LSP Contract Implementation', () => {
    const validData: WelcomeEmailData = {
      dataType: 'welcome',
      recipientEmail: 'test@example.com',
      recipientName: 'Test User',
      registrationDate: '2024-01-01',
      loginUrl: 'https://example.com/login',
      unsubscribeUrl: 'https://example.com/unsubscribe',
      supportUrl: 'https://example.com/support',
    };

    beforeEach(async () => {
      // Initialize channel before each test
      emailService.testConfiguration.mockResolvedValue({ success: true });
      await channel.initialize();
    });

    it('should send welcome email successfully', async () => {
      const mockEmailResult = {
        success: true,
        messageId: 'welcome-123',
      };
      emailService.sendWelcomeEmail.mockResolvedValue(mockEmailResult);

      const result = await channel.send(validData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.messageId).toBe('welcome-123');
      expect(result.data!.status).toBe('sent');
      expect(result.data!.provider).toBe('resend');
      expect(result.metadata).toBeDefined();
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith({
        userName: validData.recipientName,
        userEmail: validData.recipientEmail,
        registrationDate: validData.registrationDate,
        loginUrl: validData.loginUrl,
        unsubscribeUrl: validData.unsubscribeUrl,
        supportUrl: validData.supportUrl,
      });
    });

    it('should handle invalid data validation', async () => {
      const invalidData = { ...validData, recipientEmail: 'invalid-email' };

      const result = await channel.send(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error!.message).toBe('Invalid welcome email data');
    });

    it('should handle uninitialized channel', async () => {
      // Create a new uninitialized channel
      const uninitializedChannel = new LSPCompliantWelcomeEmailChannel(
        emailService,
      );

      const result = await uninitializedChannel.send(validData);

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(ServiceUnavailableError);
      expect(result.error!.message).toBe(
        'Welcome email channel is not initialized',
      );
    });

    it('should handle email service failure', async () => {
      emailService.sendWelcomeEmail.mockResolvedValue({
        success: false,
        error: 'Email service error',
      });

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(ServiceUnavailableError);
      expect(result.error!.message).toBe('Failed to send welcome email');
    });

    it('should handle email service exceptions', async () => {
      emailService.sendWelcomeEmail.mockRejectedValue(
        new Error('Service unavailable'),
      );

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(ServiceUnavailableError);
      expect(result.error!.message).toBe(
        'Unexpected error sending welcome email',
      );
    });

    it('should generate default messageId when not provided', async () => {
      emailService.sendWelcomeEmail.mockResolvedValue({
        success: true,
        // No messageId provided
      });

      const result = await channel.send(validData);

      expect(result.success).toBe(true);
      expect(result.data!.messageId).toMatch(/^welcome_\d+$/);
    });

    it('should never throw exceptions', async () => {
      emailService.sendWelcomeEmail.mockRejectedValue(
        new Error('Critical error'),
      );

      await expect(channel.send(validData)).resolves.not.toThrow();
    });

    it('should log appropriate messages', async () => {
      emailService.sendWelcomeEmail.mockResolvedValue({
        success: true,
        messageId: 'welcome-123',
      });

      await channel.send(validData);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Sending welcome email to ${validData.recipientEmail}`,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        `Welcome email sent successfully to ${validData.recipientEmail}, messageId: welcome-123`,
      );
    });
  });

  describe('supportsDataType method - LSP Contract Implementation', () => {
    it('should return true for welcome data type', () => {
      expect(channel.supportsDataType('welcome')).toBe(true);
    });

    it('should return false for other data types', () => {
      expect(channel.supportsDataType('reset')).toBe(false);
      expect(channel.supportsDataType('verification')).toBe(false);
      expect(channel.supportsDataType('notification')).toBe(false);
      expect(channel.supportsDataType('')).toBe(false);
    });

    it('should never throw exceptions', () => {
      expect(() => channel.supportsDataType(null as any)).not.toThrow();
      expect(() => channel.supportsDataType(undefined as any)).not.toThrow();
    });
  });

  describe('getChannelInfo method - LSP Contract Implementation', () => {
    it('should return channel information', () => {
      const info = channel.getChannelInfo();

      expect(info.channelType).toBe('welcome');
      expect(info.provider).toBe('resend');
      expect(info.maxRecipientsPerMessage).toBe(1);
      expect(info.maxMessageSize).toBe(10 * 1024 * 1024);
      expect(info.supportedFormats).toContain('html');
      expect(info.supportedFormats).toContain('text');
      expect(info.rateLimits).toBeDefined();
      expect(info.features).toBeDefined();
    });

    it('should never throw exceptions', () => {
      expect(() => channel.getChannelInfo()).not.toThrow();
    });
  });

  describe('Liskov Substitution Principle Compliance', () => {
    it('should be fully substitutable for IEmailChannel interface', () => {
      // Should have all required interface methods
      expect(typeof channel.initialize).toBe('function');
      expect(typeof channel.isHealthy).toBe('function');
      expect(typeof channel.cleanup).toBe('function');
      expect(typeof channel.getServiceInfo).toBe('function');
      expect(typeof channel.send).toBe('function');
      expect(typeof channel.validateData).toBe('function');
      expect(typeof channel.supportsDataType).toBe('function');
      expect(typeof channel.getChannelInfo).toBe('function');
    });

    it('should maintain behavioral consistency', async () => {
      // Initialize
      emailService.testConfiguration.mockResolvedValue({ success: true });
      const initResult = await channel.initialize();
      expect(initResult.success).toBe(true);

      // Health check
      const healthResult = await channel.isHealthy();
      expect(typeof healthResult).toBe('boolean');

      // Cleanup
      const cleanupResult = await channel.cleanup();
      expect(cleanupResult.success).toBe(true);
    });

    it('should never strengthen preconditions', () => {
      // Should accept all valid WelcomeEmailData
      const validData: WelcomeEmailData = {
        dataType: 'welcome',
        recipientEmail: 'test@example.com',
        recipientName: 'Test User',
        registrationDate: '2024-01-01',
        loginUrl: 'https://example.com/login',
        unsubscribeUrl: 'https://example.com/unsubscribe',
        supportUrl: 'https://example.com/support',
      };

      const result = channel.validateData(validData);
      expect(result.isValid).toBe(true);
    });

    it('should never weaken postconditions', async () => {
      // Should always return ServiceResult
      emailService.testConfiguration.mockResolvedValue({ success: true });
      await channel.initialize();

      const validData: WelcomeEmailData = {
        dataType: 'welcome',
        recipientEmail: 'test@example.com',
        recipientName: 'Test User',
        registrationDate: '2024-01-01',
        loginUrl: 'https://example.com/login',
        unsubscribeUrl: 'https://example.com/unsubscribe',
        supportUrl: 'https://example.com/support',
      };

      emailService.sendWelcomeEmail.mockResolvedValue({
        success: true,
        messageId: 'test-123',
      });

      const result = await channel.send(validData);
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle all error scenarios gracefully', async () => {
      // Test async methods
      const asyncTestCases = [
        () => channel.initialize(),
        () => channel.isHealthy(),
        () => channel.cleanup(),
        () => channel.send(null as any),
      ];

      for (const testCase of asyncTestCases) {
        await expect(testCase()).resolves.not.toThrow();
      }

      // Test sync methods
      const syncTestCases = [
        () => channel.validateData(null as any),
        () => channel.supportsDataType('test'),
        () => channel.getChannelInfo(),
      ];

      for (const testCase of syncTestCases) {
        expect(testCase).not.toThrow();
      }
    });

    it('should maintain service state consistency', async () => {
      // Test state transitions
      expect(channel.getServiceInfo().status).toBe('stopped');

      emailService.testConfiguration.mockResolvedValue({ success: true });
      await channel.initialize();
      expect(channel.getServiceInfo().status).toBe('healthy');

      await channel.cleanup();
      expect(channel.getServiceInfo().status).toBe('stopped');
    });
  });
});
