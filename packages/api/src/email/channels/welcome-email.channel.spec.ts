/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeEmailChannel } from './welcome-email.channel';
import { EmailService } from '../email.service';
import { EmailResult, WelcomeEmailData } from '../types/email.types';

describe('WelcomeEmailChannel', () => {
  let channel: WelcomeEmailChannel;
  let mockEmailService: jest.Mocked<EmailService>;

  const validWelcomeData: WelcomeEmailData = {
    userName: 'John Doe',
    userEmail: 'john@example.com',
    registrationDate: '2024-01-15',
    loginUrl: 'https://app.example.com/login',
    unsubscribeUrl: 'https://app.example.com/unsubscribe',
    supportUrl: 'https://app.example.com/support',
  };

  beforeEach(async () => {
    mockEmailService = {
      sendWelcomeEmail: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WelcomeEmailChannel,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    channel = module.get<WelcomeEmailChannel>(WelcomeEmailChannel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('type', () => {
    it('should return "welcome" as the channel type', () => {
      expect(channel.type).toBe('welcome');
    });
  });

  describe('supports', () => {
    it('should return true for "welcome" type', () => {
      expect(channel.supports('welcome')).toBe(true);
    });

    it('should return false for other types', () => {
      expect(channel.supports('password-reset')).toBe(false);
      expect(channel.supports('notification')).toBe(false);
      expect(channel.supports('marketing')).toBe(false);
    });
  });

  describe('validateData', () => {
    it('should validate correct welcome email data', () => {
      const result = channel.validateData(validWelcomeData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject null or undefined data', () => {
      const result = channel.validateData(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email data is required');
    });

    it('should reject data with missing userName', () => {
      const invalidData = { ...validWelcomeData, userName: undefined };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'userName is required and must be a string',
      );
    });

    it('should reject data with missing userEmail', () => {
      const invalidData = { ...validWelcomeData, userEmail: undefined };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'userEmail is required and must be a string',
      );
    });

    it('should reject data with invalid email format', () => {
      const invalidData = { ...validWelcomeData, userEmail: 'invalid-email' };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'userEmail must be a valid email address',
      );
    });

    it('should reject data with missing registrationDate', () => {
      const invalidData = { ...validWelcomeData, registrationDate: undefined };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'registrationDate is required and must be a string',
      );
    });

    it('should reject data with missing loginUrl', () => {
      const invalidData = { ...validWelcomeData, loginUrl: undefined };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'loginUrl is required and must be a string',
      );
    });

    it('should reject data with missing unsubscribeUrl', () => {
      const invalidData = { ...validWelcomeData, unsubscribeUrl: undefined };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'unsubscribeUrl is required and must be a string',
      );
    });

    it('should reject data with missing supportUrl', () => {
      const invalidData = { ...validWelcomeData, supportUrl: undefined };
      const result = channel.validateData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'supportUrl is required and must be a string',
      );
    });
  });

  describe('send', () => {
    it('should send welcome email successfully', async () => {
      const mockResult: EmailResult = {
        success: true,
        messageId: 'test-message-id',
      };

      mockEmailService.sendWelcomeEmail.mockResolvedValue(mockResult);

      const result = await channel.send(validWelcomeData);

      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        validWelcomeData,
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle email service errors gracefully', async () => {
      const error = new Error('Email service error');
      mockEmailService.sendWelcomeEmail.mockRejectedValue(error);

      const result = await channel.send(validWelcomeData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email service error');
    });

    it('should handle unknown errors gracefully', async () => {
      mockEmailService.sendWelcomeEmail.mockRejectedValue('Unknown error');

      const result = await channel.send(validWelcomeData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });

    it('should handle email service failure response', async () => {
      const mockResult: EmailResult = {
        success: false,
        error: 'SMTP connection failed',
      };

      mockEmailService.sendWelcomeEmail.mockResolvedValue(mockResult);

      const result = await channel.send(validWelcomeData);

      expect(result).toEqual(mockResult);
    });
  });

  describe('SOLID Principles Compliance', () => {
    it('should follow Single Responsibility Principle - only handles welcome emails', () => {
      expect(channel.type).toBe('welcome');
      expect(channel.supports('welcome')).toBe(true);
      expect(channel.supports('password-reset')).toBe(false);
    });

    it('should follow Open/Closed Principle - can extend functionality without modification', () => {
      // The channel implements IEmailChannel interface, allowing extension
      expect(channel.send).toBeDefined();
      expect(channel.supports).toBeDefined();
      expect(channel.validateData).toBeDefined();
    });

    it('should follow Dependency Inversion Principle - depends on EmailService abstraction', () => {
      // Channel depends on EmailService interface, not concrete implementation
      expect(mockEmailService.sendWelcomeEmail).toBeDefined();
    });
  });
});
