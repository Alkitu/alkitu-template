import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

// Mock Resend
const mockResend = {
  emails: {
    send: jest.fn(),
  },
};

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => mockResend),
}));

// Mock file system para templates
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  readdirSync: jest.fn(),
}));

import * as fs from 'fs';
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    // Setup environment variables
    process.env.RESEND_API_KEY = 'test-api-key';
    process.env.EMAIL_FROM = 'test@example.com';

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);

    // Reset all mocks
    jest.clearAllMocks();
    mockResend.emails.send.mockReset();
    mockedFs.existsSync.mockReset();
    mockedFs.readFileSync.mockReset();
    mockedFs.readdirSync.mockReset();
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
  });

  describe('constructor', () => {
    it('should throw error if RESEND_API_KEY is not provided', () => {
      delete process.env.RESEND_API_KEY;

      expect(() => {
        new EmailService();
      }).toThrow('RESEND_API_KEY is required');
    });

    it('should initialize with correct configuration', () => {
      expect(service).toBeDefined();
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const mockResponse = {
        data: { id: 'email-id-123' },
        error: null,
      };
      mockResend.emails.send.mockResolvedValue(mockResponse);

      const options = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<h1>Test Email</h1>',
      };

      const result = await service.sendEmail(options);

      expect(mockResend.emails.send).toHaveBeenCalledWith(
        {
          from: 'test@example.com',
          to: 'test@example.com',
          subject: 'Test Subject',
          html: '<h1>Test Email</h1>',
        },
        undefined,
      );

      expect(result).toEqual({
        success: true,
        messageId: 'email-id-123',
      });
    });

    it('should handle Resend API errors', async () => {
      const mockResponse = {
        data: null,
        error: { message: 'API Error' },
      };
      mockResend.emails.send.mockResolvedValue(mockResponse);

      const options = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<h1>Test Email</h1>',
      };

      const result = await service.sendEmail(options);

      expect(result).toEqual({
        success: false,
        error: 'API Error',
      });
    });

    it('should handle unexpected errors', async () => {
      mockResend.emails.send.mockRejectedValue(new Error('Network Error'));

      const options = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<h1>Test Email</h1>',
      };

      const result = await service.sendEmail(options);

      expect(result).toEqual({
        success: false,
        error: 'Network Error',
      });
    });

    it('should send to multiple recipients', async () => {
      const mockResponse = {
        data: { id: 'email-id-123' },
        error: null,
      };
      mockResend.emails.send.mockResolvedValue(mockResponse);

      const options = {
        to: ['test1@example.com', 'test2@example.com'],
        subject: 'Test Subject',
        html: '<h1>Test Email</h1>',
      };

      const result = await service.sendEmail(options);

      expect(mockResend.emails.send).toHaveBeenCalledWith(
        {
          from: 'test@example.com',
          to: ['test1@example.com', 'test2@example.com'],
          subject: 'Test Subject',
          html: '<h1>Test Email</h1>',
        },
        undefined,
      );

      expect(result.success).toBe(true);
    });
  });

  describe('sendWelcomeEmail', () => {
    beforeEach(() => {
      // Mock template file reading
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(`
        <h1>Bienvenido {{userName}}</h1>
        <p>Email: {{userEmail}}</p>
        <p>Fecha: {{registrationDate}}</p>
        <a href="{{loginUrl}}">Login</a>
      `);
    });

    it('should send welcome email successfully', async () => {
      const mockResponse = {
        data: { id: 'welcome-email-123' },
        error: null,
      };
      mockResend.emails.send.mockResolvedValue(mockResponse);

      const userData = {
        userName: 'Juan Pérez',
        userEmail: 'juan@example.com',
        registrationDate: '28/06/2024',
        loginUrl: 'http://localhost:3000/login',
        unsubscribeUrl: 'http://localhost:3000/unsubscribe',
        supportUrl: 'http://localhost:3000/support',
      };

      const result = await service.sendWelcomeEmail(userData);

      expect(mockResend.emails.send).toHaveBeenCalledWith(
        {
          from: 'test@example.com',
          to: 'juan@example.com',
          subject: '¡Bienvenido a Alkitu, Juan Pérez!',
          html: expect.stringContaining('Juan Pérez'),
        },
        { idempotencyKey: 'welcome-juan@example.com' },
      );

      expect(result).toEqual({
        success: true,
        messageId: 'welcome-email-123',
      });
    });

    it('should handle email sending errors gracefully', async () => {
      const mockError = new Error('Email service down');
      mockResend.emails.send.mockRejectedValue(mockError);

      const userData = {
        userName: 'Juan Pérez',
        userEmail: 'juan@example.com',
        registrationDate: '28/06/2024',
        loginUrl: 'http://localhost:3000/login',
        unsubscribeUrl: 'http://localhost:3000/unsubscribe',
        supportUrl: 'http://localhost:3000/support',
      };

      const result = await service.sendWelcomeEmail(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email service down');
    });
  });

  describe('sendPasswordResetEmail', () => {
    beforeEach(() => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(`
        <h1>Reset Password {{userName}}</h1>
        <a href="{{resetUrl}}">Reset</a>
      `);
    });

    it('should send password reset email successfully', async () => {
      const mockResponse = {
        data: { id: 'reset-email-123' },
        error: null,
      };
      mockResend.emails.send.mockResolvedValue(mockResponse);

      const userData = {
        userName: 'Juan Pérez',
        userEmail: 'juan@example.com',
        resetUrl: 'http://localhost:3000/reset?token=123',
        supportUrl: 'http://localhost:3000/support',
        securityUrl: 'http://localhost:3000/security',
      };

      const result = await service.sendPasswordResetEmail(userData);

      expect(mockResend.emails.send).toHaveBeenCalledWith(
        {
          from: 'test@example.com',
          to: 'juan@example.com',
          subject: 'Restablecer tu contraseña - Alkitu',
          html: expect.stringContaining('Juan Pérez'),
        },
        expect.objectContaining({ idempotencyKey: expect.stringContaining('password-reset-juan@example.com') }),
      );

      expect(result.success).toBe(true);
    });
  });

  describe('sendEmailVerification', () => {
    it('should send email verification successfully', async () => {
      const mockResponse = {
        data: { id: 'verification-email-123' },
        error: null,
      };
      mockResend.emails.send.mockResolvedValue(mockResponse);

      const userData = {
        userName: 'Juan Pérez',
        userEmail: 'juan@example.com',
        verificationUrl: 'http://localhost:3000/verify?token=123',
        supportUrl: 'http://localhost:3000/support',
      };

      const result = await service.sendEmailVerification(userData);

      expect(mockResend.emails.send).toHaveBeenCalledWith(
        {
          from: 'test@example.com',
          to: 'juan@example.com',
          subject: 'Verifica tu email - Alkitu',
          html: expect.stringContaining('Juan Pérez'),
        },
        { idempotencyKey: 'email-verification-juan@example.com' },
      );

      expect(result.success).toBe(true);
    });
  });

  describe('sendNotification', () => {
    it('should send notification email successfully', async () => {
      const mockResponse = {
        data: { id: 'notification-email-123' },
        error: null,
      };
      mockResend.emails.send.mockResolvedValue(mockResponse);

      const result = await service.sendNotification(
        'juan@example.com',
        'Juan Pérez',
        'Test Notification',
        'This is a test message',
        'Click Here',
        'http://localhost:3000/action',
      );

      expect(mockResend.emails.send).toHaveBeenCalledWith(
        {
          from: 'test@example.com',
          to: 'juan@example.com',
          subject: 'Test Notification',
          html: expect.stringContaining('Juan Pérez'),
        },
        expect.objectContaining({ idempotencyKey: expect.stringContaining('notification-juan@example.com') }),
      );

      expect(result.success).toBe(true);
    });

    it('should send notification without button', async () => {
      const mockResponse = {
        data: { id: 'notification-email-123' },
        error: null,
      };
      mockResend.emails.send.mockResolvedValue(mockResponse);

      const result = await service.sendNotification(
        'juan@example.com',
        'Juan Pérez',
        'Test Notification',
        'This is a test message',
      );

      expect(result.success).toBe(true);
    });
  });

  describe('sendBulkEmails', () => {
    it('should send bulk emails successfully', async () => {
      const mockResponse = {
        data: { id: 'bulk-email-123' },
        error: null,
      };
      mockResend.emails.send.mockResolvedValue(mockResponse);

      const recipients = ['user1@example.com', 'user2@example.com'];
      const subject = 'Bulk Email';
      const html = '<h1>Bulk Email Content</h1>';

      const result = await service.sendBulkEmails(recipients, subject, html);

      expect(mockResend.emails.send).toHaveBeenCalledWith(
        {
          from: 'test@example.com',
          to: recipients,
          subject,
          html,
        },
        undefined,
      );

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(2);
      expect(result.results[0].success).toBe(true);
      expect(result.results[1].success).toBe(true);
    });

    it('should handle bulk email errors', async () => {
      mockResend.emails.send.mockRejectedValue(new Error('Bulk send failed'));

      const recipients = ['user1@example.com', 'user2@example.com'];
      const subject = 'Bulk Email';
      const html = '<h1>Bulk Email Content</h1>';

      const result = await service.sendBulkEmails(recipients, subject, html);

      expect(result.success).toBe(false);
      expect(result.results).toHaveLength(2);
      expect(result.results[0].success).toBe(false);
      expect(result.results[1].success).toBe(false);
    });

    it('should handle large recipient lists (batching)', async () => {
      const mockResponse = {
        data: { id: 'bulk-email-123' },
        error: null,
      };
      mockResend.emails.send.mockResolvedValue(mockResponse);

      // Create 150 recipients to test batching (max 100 per batch)
      const recipients = Array.from(
        { length: 150 },
        (_, i) => `user${i}@example.com`,
      );
      const subject = 'Bulk Email';
      const html = '<h1>Bulk Email Content</h1>';

      const result = await service.sendBulkEmails(recipients, subject, html);

      // Should make 2 API calls (100 + 50)
      expect(mockResend.emails.send).toHaveBeenCalledTimes(2);
      expect(result.results).toHaveLength(150);
    });
  });

  describe('testConfiguration', () => {
    it('should test configuration successfully', async () => {
      const mockResponse = {
        data: { id: 'test-email-123' },
        error: null,
      };
      mockResend.emails.send.mockResolvedValue(mockResponse);

      const result = await service.testConfiguration();

      expect(mockResend.emails.send).toHaveBeenCalledWith(
        {
          from: 'test@example.com',
          to: 'test@resend.dev',
          subject: 'Test de configuración - Alkitu',
          html: expect.stringContaining('Test exitoso'),
        },
        undefined,
      );

      expect(result.success).toBe(true);
    });

    it('should handle test configuration errors', async () => {
      mockResend.emails.send.mockRejectedValue(
        new Error('Configuration test failed'),
      );

      const result = await service.testConfiguration();

      expect(result).toEqual({
        success: false,
        error: 'Configuration test failed',
      });
    });
  });
});
