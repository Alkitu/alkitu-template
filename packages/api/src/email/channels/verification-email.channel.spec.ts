import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { EmailVerificationChannel } from './verification-email.channel';
import { EmailService } from '../email.service';
import { EmailVerificationData } from '../types/email.types';

describe('EmailVerificationChannel', () => {
  let channel: EmailVerificationChannel;
  let emailService: jest.Mocked<EmailService>;
  let loggerSpy: jest.SpyInstance;

  const mockEmailService = {
    sendEmailVerification: jest.fn(),
    testConfiguration: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailVerificationChannel,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    channel = module.get<EmailVerificationChannel>(EmailVerificationChannel);
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
      expect(channel.type).toBe('verification');
    });

    it('should have EmailService injected', () => {
      expect(emailService).toBeDefined();
    });
  });

  describe('supports method - Interface Segregation Principle', () => {
    it('should return true for "verification" type', () => {
      expect(channel.supports('verification')).toBe(true);
    });

    it('should return false for other types', () => {
      expect(channel.supports('welcome')).toBe(false);
      expect(channel.supports('reset')).toBe(false);
      expect(channel.supports('notification')).toBe(false);
      expect(channel.supports('marketing')).toBe(false);
      expect(channel.supports('')).toBe(false);
    });
  });

  describe('validateData method - Single Responsibility Principle', () => {
    const validData: EmailVerificationData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      verificationUrl: 'https://example.com/verify',
      supportUrl: 'https://example.com/support',
    };

    it('should validate correct data successfully', () => {
      const result = channel.validateData(validData);
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
        'Invalid email verification data structure',
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

    it('should validate verificationUrl field', () => {
      const invalidData = { ...validData, verificationUrl: null };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'verificationUrl is required and must be a string',
      );
    });

    it('should validate verificationUrl format', () => {
      const invalidData = { ...validData, verificationUrl: 'invalid-url' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('verificationUrl must be a valid URL');
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

    it('should handle multiple validation errors', () => {
      const invalidData = {
        userName: null,
        userEmail: 'invalid-email',
        verificationUrl: 'invalid-url',
        supportUrl: null,
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(3);
    });
  });

  describe('send method - Open/Closed Principle', () => {
    const validData: EmailVerificationData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      verificationUrl: 'https://example.com/verify',
      supportUrl: 'https://example.com/support',
    };

    it('should send email successfully', async () => {
      emailService.sendEmailVerification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      const result = await channel.send(validData);

      expect(result.success).toBe(true);
      expect(emailService.sendEmailVerification).toHaveBeenCalledWith(
        validData,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        `Sending email verification to ${validData.userEmail}`,
      );
    });

    it('should handle email service failure', async () => {
      emailService.sendEmailVerification.mockResolvedValue({
        success: false,
        error: 'Email service error',
      });

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(emailService.sendEmailVerification).toHaveBeenCalledWith(
        validData,
      );
    });

    it('should handle email service exception', async () => {
      const error = new Error('Service unavailable');
      emailService.sendEmailVerification.mockRejectedValue(error);

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Service unavailable');
    });

    it('should handle unknown error types', async () => {
      emailService.sendEmailVerification.mockRejectedValue('String error');

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });

    it('should log success message', async () => {
      emailService.sendEmailVerification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      await channel.send(validData);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Email verification sent successfully to ${validData.userEmail}`,
      );
    });

    it('should log failure message', async () => {
      emailService.sendEmailVerification.mockResolvedValue({
        success: false,
        error: 'Email service error',
      });

      await channel.send(validData);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Email verification failed to ${validData.userEmail}`,
      );
    });
  });

  describe('Dependency Inversion Principle', () => {
    it('should depend on EmailService abstraction', () => {
      expect(channel).toHaveProperty('emailService');
    });

    it('should not be tightly coupled to concrete implementations', () => {
      // The channel should work with any EmailService implementation
      expect(typeof channel['emailService'].sendEmailVerification).toBe(
        'function',
      );
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
      const validData: EmailVerificationData = {
        userName: 'Test User',
        userEmail: 'test@example.com',
        verificationUrl: 'https://example.com/verify',
        supportUrl: 'https://example.com/support',
      };

      emailService.sendEmailVerification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      const result = await channel.send(validData);
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Error Handling and Resilience', () => {
    const validData: EmailVerificationData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      verificationUrl: 'https://example.com/verify',
      supportUrl: 'https://example.com/support',
    };

    it('should handle network timeouts gracefully', async () => {
      emailService.sendEmailVerification.mockRejectedValue(
        new Error('Network timeout'),
      );

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network timeout');
    });

    it('should handle malformed responses', async () => {
      emailService.sendEmailVerification.mockResolvedValue(null as any);

      const result = await channel.send(validData);

      expect(result.success).toBe(false);
    });

    it('should never throw unhandled exceptions', async () => {
      emailService.sendEmailVerification.mockRejectedValue(
        new Error('Critical error'),
      );

      await expect(channel.send(validData)).resolves.not.toThrow();
    });
  });

  describe('Integration with Email Service', () => {
    const validData: EmailVerificationData = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      verificationUrl: 'https://example.com/verify',
      supportUrl: 'https://example.com/support',
    };

    it('should pass correct parameters to email service', async () => {
      emailService.sendEmailVerification.mockResolvedValue({
        success: true,
        messageId: 'test-message-id',
      });

      await channel.send(validData);

      expect(emailService.sendEmailVerification).toHaveBeenCalledWith(
        validData,
      );
      expect(emailService.sendEmailVerification).toHaveBeenCalledTimes(1);
    });

    it('should handle email service response correctly', async () => {
      const mockResponse = {
        success: true,
        messageId: 'verification-123',
      };
      emailService.sendEmailVerification.mockResolvedValue(mockResponse);

      const result = await channel.send(validData);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('verification-123');
    });
  });
});
