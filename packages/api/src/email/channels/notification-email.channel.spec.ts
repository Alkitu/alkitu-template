import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { NotificationEmailChannel } from './notification-email.channel';
import { EmailService } from '../email.service';
import { NotificationEmailData } from '../types/email.types';

describe('NotificationEmailChannel', () => {
  let channel: NotificationEmailChannel;
  let emailService: jest.Mocked<EmailService>;
  let loggerSpy: jest.SpyInstance;

  const mockEmailService = {
    sendNotification: jest.fn(),
    testConfiguration: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationEmailChannel,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    channel = module.get<NotificationEmailChannel>(NotificationEmailChannel);
    emailService = module.get<EmailService>(
      EmailService,
    ) as jest.Mocked<EmailService>;

    // Spy on logger
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    loggerSpy.mockRestore();
  });

  describe('Constructor and Properties', () => {
    it('should be defined', () => {
      expect(channel).toBeDefined();
    });

    it('should have correct type property', () => {
      expect(channel.type).toBe('notification');
    });

    it('should have EmailService injected', () => {
      expect(emailService).toBeDefined();
    });
  });

  describe('supports method - Interface Segregation Principle', () => {
    it('should return true for "notification" type', () => {
      expect(channel.supports('notification')).toBe(true);
    });

    it('should return false for other types', () => {
      expect(channel.supports('welcome')).toBe(false);
      expect(channel.supports('reset')).toBe(false);
      expect(channel.supports('verification')).toBe(false);
      expect(channel.supports('marketing')).toBe(false);
      expect(channel.supports('')).toBe(false);
    });
  });

  describe('validateData method - Single Responsibility Principle', () => {
    const validData: NotificationEmailData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      subject: 'Test Notification',
      message: 'This is a test notification message',
      supportUrl: 'https://example.com/support',
      actionText: 'View Details',
      actionUrl: 'https://example.com/action',
    };

    it('should validate correct data successfully', () => {
      const result = channel.validateData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate data without optional fields', () => {
      const minimalData = {
        userName: 'Test User',
        userEmail: 'test@example.com',
        subject: 'Test Notification',
        message: 'This is a test notification message',
        supportUrl: 'https://example.com/support',
      };
      const result = channel.validateData(minimalData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject null/undefined data', () => {
      const result = channel.validateData(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email data is required');
    });

    it('should reject empty object', () => {
      const result = channel.validateData({});
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Invalid notification email data structure',
      );
    });

    it('should validate userName field', () => {
      const invalidData = { ...validData, userName: null };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'userName is required and must be a string',
      );
    });

    it('should validate userEmail field', () => {
      const invalidData = { ...validData, userEmail: null };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'userEmail is required and must be a string',
      );
    });

    it('should validate email format', () => {
      const invalidData = { ...validData, userEmail: 'invalid-email' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'userEmail must be a valid email address',
      );
    });

    it('should validate subject field', () => {
      const invalidData = { ...validData, subject: null };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'subject is required and must be a string',
      );
    });

    it('should validate message field', () => {
      const invalidData = { ...validData, message: null };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'message is required and must be a string',
      );
    });

    it('should validate supportUrl field', () => {
      const invalidData = { ...validData, supportUrl: null };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'supportUrl is required and must be a string',
      );
    });

    it('should validate supportUrl format', () => {
      const invalidData = { ...validData, supportUrl: 'invalid-url' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('supportUrl must be a valid URL');
    });

    it('should validate optional actionText field type', () => {
      const invalidData = { ...validData, actionText: 123 as any };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(true); // Should be valid because actionText is optional and handled in type guard
    });

    it('should validate optional actionUrl field type', () => {
      const invalidData = { ...validData, actionUrl: 123 as any };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('actionUrl must be a valid URL');
    });

    it('should validate actionUrl format when provided', () => {
      const invalidData = { ...validData, actionUrl: 'invalid-url' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('actionUrl must be a valid URL');
    });

    it('should validate subject length', () => {
      const invalidData = { ...validData, subject: 'a'.repeat(201) };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('subject must be 200 characters or less');
    });

    it('should validate message length', () => {
      const invalidData = { ...validData, message: 'a'.repeat(5001) };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'message must be 5000 characters or less',
      );
    });

    it('should handle multiple validation errors', () => {
      const invalidData = {
        userName: null,
        userEmail: 'invalid-email',
        subject: 'a'.repeat(201),
        message: null,
        supportUrl: 'invalid-url',
        actionUrl: 'invalid-url',
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(5);
    });
  });

  describe('send method - Open/Closed Principle', () => {
    const validData: NotificationEmailData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      subject: 'Test Notification',
      message: 'This is a test notification message',
      supportUrl: 'https://example.com/support',
      actionText: 'View Details',
      actionUrl: 'https://example.com/action',
    };

    it('should send notification email successfully', async () => {
      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      const result = await channel.send(validData);

      expect(result.success).toBe(true);
      expect(emailService.sendNotification).toHaveBeenCalledWith(
        validData.userEmail,
        validData.userName,
        validData.subject,
        validData.message,
        validData.actionText,
        validData.actionUrl,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        `Sending notification email to ${validData.userEmail}`,
      );
    });

    it('should send notification email without optional fields', async () => {
      const minimalData = {
        userName: 'Test User',
        userEmail: 'test@example.com',
        subject: 'Test Notification',
        message: 'This is a test notification message',
        supportUrl: 'https://example.com/support',
      };

      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      const result = await channel.send(minimalData);

      expect(result.success).toBe(true);
      expect(emailService.sendNotification).toHaveBeenCalledWith(
        minimalData.userEmail,
        minimalData.userName,
        minimalData.subject,
        minimalData.message,
        undefined,
        undefined,
      );
    });

    it('should handle email service failure', async () => {
      emailService.sendNotification.mockResolvedValue({
        success: false,
        error: 'Email service error',
      });

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(emailService.sendNotification).toHaveBeenCalledWith(
        validData.userEmail,
        validData.userName,
        validData.subject,
        validData.message,
        validData.actionText,
        validData.actionUrl,
      );
    });

    it('should handle email service exception', async () => {
      const error = new Error('Service unavailable');
      emailService.sendNotification.mockRejectedValue(error);

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Service unavailable');
    });

    it('should handle unknown error types', async () => {
      emailService.sendNotification.mockRejectedValue('String error');

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });

    it('should log success message', async () => {
      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      await channel.send(validData);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Notification email sent successfully to ${validData.userEmail}`,
      );
    });

    it('should log failure message', async () => {
      emailService.sendNotification.mockResolvedValue({
        success: false,
        error: 'Email service error',
      });

      await channel.send(validData);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Notification email failed to ${validData.userEmail}`,
      );
    });
  });

  describe('Dependency Inversion Principle', () => {
    it('should depend on EmailService abstraction', () => {
      expect(channel).toHaveProperty('emailService');
    });

    it('should not be tightly coupled to concrete implementations', () => {
      // The channel should work with any EmailService implementation
      expect(typeof channel['emailService'].sendNotification).toBe('function');
    });
  });

  describe('Liskov Substitution Principle', () => {
    it('should be substitutable for IEmailChannel', () => {
      // Should have all required interface methods
      expect(typeof channel.send).toBe('function');
      expect(typeof channel.supports).toBe('function');
      expect(typeof channel.validateData).toBe('function');
      expect(typeof channel.type).toBe('string');
    });

    it('should maintain interface contracts', async () => {
      const validData: NotificationEmailData = {
        userName: 'Test User',
        userEmail: 'test@example.com',
        subject: 'Test Notification',
        message: 'This is a test notification message',
        supportUrl: 'https://example.com/support',
      };

      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      const result = await channel.send(validData);
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Error Handling and Resilience', () => {
    const validData: NotificationEmailData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      subject: 'Test Notification',
      message: 'This is a test notification message',
      supportUrl: 'https://example.com/support',
    };

    it('should handle network timeouts gracefully', async () => {
      emailService.sendNotification.mockRejectedValue(
        new Error('Network timeout'),
      );

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network timeout');
    });

    it('should handle malformed responses', async () => {
      emailService.sendNotification.mockResolvedValue(null as any);

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
    });

    it('should never throw unhandled exceptions', async () => {
      emailService.sendNotification.mockRejectedValue(
        new Error('Critical error'),
      );

      await expect(channel.send(validData)).resolves.not.toThrow();
    });
  });

  describe('Integration with Email Service', () => {
    const validData: NotificationEmailData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      subject: 'Test Notification',
      message: 'This is a test notification message',
      supportUrl: 'https://example.com/support',
      actionText: 'View Details',
      actionUrl: 'https://example.com/action',
    };

    it('should pass correct parameters to email service', async () => {
      emailService.sendNotification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      await channel.send(validData);

      expect(emailService.sendNotification).toHaveBeenCalledWith(
        validData.userEmail,
        validData.userName,
        validData.subject,
        validData.message,
        validData.actionText,
        validData.actionUrl,
      );
      expect(emailService.sendNotification).toHaveBeenCalledTimes(1);
    });

    it('should handle email service response correctly', async () => {
      const mockResponse = {
        success: true,
        messageId: 'notification-123',
      };
      emailService.sendNotification.mockResolvedValue(mockResponse);

      const result = await channel.send(validData);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('notification-123');
    });
  });

  describe('Content Validation Edge Cases', () => {
    const baseData: NotificationEmailData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      subject: 'Test Notification',
      message: 'This is a test notification message',
      supportUrl: 'https://example.com/support',
    };

    it('should accept maximum allowed subject length', () => {
      const validData = { ...baseData, subject: 'a'.repeat(200) };
      const result = channel.validateData(validData);
      expect(result.isValid).toBe(true);
    });

    it('should accept maximum allowed message length', () => {
      const validData = { ...baseData, message: 'a'.repeat(5000) };
      const result = channel.validateData(validData);
      expect(result.isValid).toBe(true);
    });

    it('should validate various email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example-domain.com',
      ];

      validEmails.forEach((email) => {
        const validData = { ...baseData, userEmail: email };
        const result = channel.validateData(validData);
        expect(result.isValid).toBe(true);
      });
    });

    it('should validate various URL formats', () => {
      const validUrls = [
        'https://example.com',
        'http://example.com/path',
        'https://subdomain.example.com/path?query=value',
        'https://example.com:8080/path',
      ];

      validUrls.forEach((url) => {
        const validData = { ...baseData, supportUrl: url, actionUrl: url };
        const result = channel.validateData(validData);
        expect(result.isValid).toBe(true);
      });
    });

    it('should handle non-object data in type guard', () => {
      const result = channel.validateData('string-data');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid notification email data structure');
    });

    it('should hit intermediate validation for non-string actionText', () => {
      // Create data that fails isNotificationEmailData but has invalid actionText type
      const invalidData = {
        userName: 123, // This makes isNotificationEmailData return false
        userEmail: 'test@example.com',
        subject: 'Test Subject',
        message: 'a'.repeat(5001), // Exceeds length limit
        supportUrl: 'https://example.com/support',
        actionText: 123, // Not a string
        actionUrl: 456, // Not a string
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid notification email data structure');
      expect(result.errors).toContain('actionText must be a string if provided');
      expect(result.errors).toContain('actionUrl must be a string if provided');
      expect(result.errors).toContain('message must be 5000 characters or less');
    });
  });
});
