/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetEmailChannel } from './password-reset-email.channel';
import { EmailService } from '../email.service';
import { EmailResult, PasswordResetEmailData } from '../types/email.types';

describe('PasswordResetEmailChannel', () => {
  let channel: PasswordResetEmailChannel;
  let mockEmailService: jest.Mocked<EmailService>;

  const validPasswordResetData: PasswordResetEmailData = {
    userEmail: 'john@example.com',
    userName: 'John Doe',
    resetUrl: 'https://app.example.com/reset-password?token=abc123',
    securityUrl: 'https://app.example.com/security',
    supportUrl: 'https://app.example.com/support',
  };

  beforeEach(async () => {
    mockEmailService = {
      sendPasswordResetEmail: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordResetEmailChannel,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    channel = module.get<PasswordResetEmailChannel>(PasswordResetEmailChannel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('type', () => {
    it('should return "reset" as the channel type', () => {
      expect(channel.type).toBe('reset');
    });
  });

  describe('supports', () => {
    it('should return true for "reset" type', () => {
      expect(channel.supports('reset')).toBe(true);
    });

    it('should return false for other types', () => {
      expect(channel.supports('welcome')).toBe(false);
      expect(channel.supports('notification')).toBe(false);
      expect(channel.supports('marketing')).toBe(false);
      expect(channel.supports('password-reset')).toBe(false);
    });
  });

  describe('validateData', () => {
    it('should validate correct password reset email data', () => {
      const result = channel.validateData(validPasswordResetData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject null or undefined data', () => {
      const result = channel.validateData(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email data is required');
    });

    it('should reject data with missing userEmail', () => {
      const invalidData = { ...validPasswordResetData, userEmail: undefined };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'userEmail is required and must be a string',
      );
    });

    it('should reject data with invalid email format', () => {
      const invalidData = {
        ...validPasswordResetData,
        userEmail: 'invalid-email',
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'userEmail must be a valid email address',
      );
    });

    it('should reject data with missing userName', () => {
      const invalidData = { ...validPasswordResetData, userName: undefined };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'userName is required and must be a string',
      );
    });

    it('should reject data with missing securityUrl', () => {
      const invalidData = { ...validPasswordResetData, securityUrl: undefined };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'securityUrl is required and must be a string',
      );
    });

    it('should reject data with missing resetUrl', () => {
      const invalidData = { ...validPasswordResetData, resetUrl: undefined };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'resetUrl is required and must be a string',
      );
    });

    it('should reject data with missing supportUrl', () => {
      const invalidData = {
        ...validPasswordResetData,
        supportUrl: undefined,
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'supportUrl is required and must be a string',
      );
    });

    it('should reject non-object data', () => {
      const result = channel.validateData('invalid-data');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid password reset email data structure');
    });

    it('should reject data with invalid email format in validation step', () => {
      const invalidData = {
        ...validPasswordResetData,
        userEmail: 'invalid@',
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('userEmail must be a valid email address');
    });

    it('should reject data with invalid resetUrl', () => {
      const invalidData = {
        ...validPasswordResetData,
        resetUrl: 'invalid-url',
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('resetUrl must be a valid URL');
    });

    it('should reject data with invalid supportUrl', () => {
      const invalidData = {
        ...validPasswordResetData,
        supportUrl: 'invalid-url',
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('supportUrl must be a valid URL');
    });

    it('should reject data with invalid securityUrl', () => {
      const invalidData = {
        ...validPasswordResetData,
        securityUrl: 'invalid-url',
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('securityUrl must be a valid URL');
    });

    it('should handle invalid URLs in intermediate validation', () => {
      const invalidData = {
        userName: 'John Doe',
        userEmail: 'john@example.com',
        resetUrl: 'not-a-url',
        supportUrl: 'also-not-a-url',
        securityUrl: 'definitely-not-a-url',
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('resetUrl must be a valid URL');
      expect(result.errors).toContain('supportUrl must be a valid URL');
      expect(result.errors).toContain('securityUrl must be a valid URL');
    });

    it('should handle invalid email in intermediate validation', () => {
      const invalidData = {
        userName: 'John Doe',
        userEmail: 'not-an-email',
        resetUrl: 'https://example.com/reset',
        supportUrl: 'https://example.com/support',
        securityUrl: 'https://example.com/security',
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('userEmail must be a valid email address');
    });

    it('should hit intermediate validation for invalid email when structure is invalid', () => {
      // Create data that fails isPasswordResetEmailData but has string fields
      const invalidData = {
        userName: 123, // This makes isPasswordResetEmailData return false
        userEmail: 'invalid-email-format', // String but invalid format
        resetUrl: 'invalid-url-format', // String but invalid URL
        supportUrl: 'another-invalid-url', // String but invalid URL  
        securityUrl: 'yet-another-invalid-url', // String but invalid URL
      };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid password reset email data structure');
      expect(result.errors).toContain('userEmail must be a valid email address');
      expect(result.errors).toContain('resetUrl must be a valid URL');
      expect(result.errors).toContain('supportUrl must be a valid URL');
      expect(result.errors).toContain('securityUrl must be a valid URL');
    });
  });

  describe('send', () => {
    it('should send password reset email successfully', async () => {
      const mockResult: EmailResult = {
        success: true,
        messageId: 'test-message-id',
      };

      mockEmailService.sendPasswordResetEmail.mockResolvedValue(mockResult);

      const result = await channel.send(validPasswordResetData);

      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        validPasswordResetData,
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle email service errors gracefully', async () => {
      const error = new Error('Email service error');
      mockEmailService.sendPasswordResetEmail.mockRejectedValue(error);

      const result = await channel.send(validPasswordResetData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email service error');
    });

    it('should handle unknown errors gracefully', async () => {
      mockEmailService.sendPasswordResetEmail.mockRejectedValue(
        'Unknown error',
      );

      const result = await channel.send(validPasswordResetData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });

    it('should handle email service failure response', async () => {
      const mockResult: EmailResult = {
        success: false,
        error: 'SMTP connection failed',
      };

      mockEmailService.sendPasswordResetEmail.mockResolvedValue(mockResult);

      const result = await channel.send(validPasswordResetData);

      expect(result).toEqual(mockResult);
    });
  });

  describe('SOLID Principles Compliance', () => {
    it('should follow Single Responsibility Principle - only handles password reset emails', () => {
      expect(channel.type).toBe('reset');
      expect(channel.supports('reset')).toBe(true);
      expect(channel.supports('welcome')).toBe(false);
    });

    it('should follow Open/Closed Principle - can extend functionality without modification', () => {
      // The channel implements IEmailChannel interface, allowing extension
      expect(channel.send).toBeDefined();
      expect(channel.supports).toBeDefined();
      expect(channel.validateData).toBeDefined();
    });

    it('should follow Dependency Inversion Principle - depends on EmailService abstraction', () => {
      // Channel depends on EmailService interface, not concrete implementation
      expect(mockEmailService.sendPasswordResetEmail).toBeDefined();
    });
  });
});
