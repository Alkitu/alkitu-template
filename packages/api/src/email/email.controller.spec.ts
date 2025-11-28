/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailChannelRegistryService } from './services/email-channel-registry.service';

describe('EmailController', () => {
  let controller: EmailController;
  let emailService: jest.Mocked<EmailService>;
  let emailChannelRegistry: jest.Mocked<EmailChannelRegistryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: {
            sendWelcomeEmail: jest.fn(),
            sendPasswordResetEmail: jest.fn(),
            sendEmailVerification: jest.fn(),
            sendNotification: jest.fn(),
            testConfiguration: jest.fn(),
          },
        },
        {
          provide: EmailChannelRegistryService,
          useValue: {
            sendEmail: jest.fn(),
            registerChannel: jest.fn(),
            getChannel: jest.fn(),
            getAllChannels: jest.fn(),
            getSupportedTypes: jest.fn(),
            unregisterChannel: jest.fn(),
            isTypeSupported: jest.fn(),
            getRegistryStats: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    emailService = module.get<EmailService>(
      EmailService,
    ) as jest.Mocked<EmailService>;
    emailChannelRegistry = module.get<EmailChannelRegistryService>(
      EmailChannelRegistryService,
    ) as jest.Mocked<EmailChannelRegistryService>;
  });

  describe('testEmail', () => {
    const baseTestDto = {
      to: 'test@example.com',
      userName: 'Test User',
    };

    it('should send welcome email test successfully', async () => {
      const testEmailDto = { ...baseTestDto, type: 'welcome' as const };
      const mockResponse = { success: true, messageId: 'welcome-123' };

      emailChannelRegistry.sendEmail.mockResolvedValue(mockResponse);

      const result = await controller.testEmail(testEmailDto);

      expect(emailChannelRegistry.sendEmail).toHaveBeenCalledWith('welcome', {
        userName: 'Test User',
        userEmail: 'test@example.com',
        registrationDate: expect.any(String),
        loginUrl: 'http://localhost:3000/login',
        unsubscribeUrl: 'http://localhost:3000/unsubscribe',
        supportUrl: 'http://localhost:3000/support',
      });

      expect(result).toEqual({
        success: true,
        message: 'Email de welcome enviado exitosamente',
        messageId: 'welcome-123',
      });
    });

    it('should send password reset email test successfully', async () => {
      const testEmailDto = { ...baseTestDto, type: 'reset' as const };
      const mockResponse = { success: true, messageId: 'reset-123' };

      emailChannelRegistry.sendEmail.mockResolvedValue(mockResponse);

      const result = await controller.testEmail(testEmailDto);

      expect(emailChannelRegistry.sendEmail).toHaveBeenCalledWith('reset', {
        userName: 'Test User',
        userEmail: 'test@example.com',
        resetUrl: 'http://localhost:3000/reset-password?token=test-token-123',
        supportUrl: 'http://localhost:3000/support',
        securityUrl: 'http://localhost:3000/security',
      });

      expect(result).toEqual({
        success: true,
        message: 'Email de reset enviado exitosamente',
        messageId: 'reset-123',
      });
    });

    it('should send verification email test successfully', async () => {
      const testEmailDto = { ...baseTestDto, type: 'verification' as const };
      const mockResponse = { success: true, messageId: 'verification-123' };

      emailChannelRegistry.sendEmail.mockResolvedValue(mockResponse);

      const result = await controller.testEmail(testEmailDto);

      expect(emailChannelRegistry.sendEmail).toHaveBeenCalledWith(
        'verification',
        {
          userName: 'Test User',
          userEmail: 'test@example.com',
          verificationUrl:
            'http://localhost:3000/verify-email?token=test-token-123',
          supportUrl: 'http://localhost:3000/support',
        },
      );

      expect(result).toEqual({
        success: true,
        message: 'Email de verification enviado exitosamente',
        messageId: 'verification-123',
      });
    });

    it('should send notification email test successfully', async () => {
      const testEmailDto = { ...baseTestDto, type: 'notification' as const };
      const mockResponse = { success: true, messageId: 'notification-123' };

      emailChannelRegistry.sendEmail.mockResolvedValue(mockResponse);

      const result = await controller.testEmail(testEmailDto);

      expect(emailChannelRegistry.sendEmail).toHaveBeenCalledWith(
        'notification',
        {
          userEmail: 'test@example.com',
          userName: 'Test User',
          subject: 'Notificación de Prueba',
          message:
            'Esta es una notificación de prueba del sistema de emails de Alkitu. Todo está funcionando correctamente.',
          actionText: 'Ir al Dashboard',
          actionUrl: 'http://localhost:3000/dashboard',
          supportUrl: 'http://localhost:3000/support',
        },
      );

      expect(result).toEqual({
        success: true,
        message: 'Email de notification enviado exitosamente',
        messageId: 'notification-123',
      });
    });

    it('should use default userName when not provided', async () => {
      const testEmailDto = { to: 'test@example.com', type: 'welcome' as const };
      const mockResponse = { success: true, messageId: 'welcome-123' };

      emailChannelRegistry.sendEmail.mockResolvedValue(mockResponse);

      await controller.testEmail(testEmailDto);

      expect(emailChannelRegistry.sendEmail).toHaveBeenCalledWith('welcome', {
        userName: 'Usuario de Prueba',
        userEmail: 'test@example.com',
        registrationDate: expect.any(String),
        loginUrl: 'http://localhost:3000/login',
        unsubscribeUrl: 'http://localhost:3000/unsubscribe',
        supportUrl: 'http://localhost:3000/support',
      });
    });

    it('should return error for invalid email type', async () => {
      const testEmailDto = { ...baseTestDto, type: 'invalid' as any };

      const result = await controller.testEmail(testEmailDto);

      expect(result).toEqual({
        success: false,
        error: "Email type 'invalid' is not supported",
      });
    });

    it('should handle email service errors', async () => {
      const testEmailDto = { ...baseTestDto, type: 'welcome' as const };
      const mockResponse = { success: false, error: 'Email service error' };

      emailChannelRegistry.sendEmail.mockResolvedValue(mockResponse);

      const result = await controller.testEmail(testEmailDto);

      expect(result).toEqual({
        success: false,
        message: 'Error enviando email: Email service error',
        messageId: undefined,
      });
    });

    it('should send marketing email test successfully', async () => {
      const testEmailDto = { ...baseTestDto, type: 'marketing' as const };
      const mockResponse = { success: true, messageId: 'marketing-123' };

      emailChannelRegistry.sendEmail.mockResolvedValue(mockResponse);

      const result = await controller.testEmail(testEmailDto);

      expect(emailChannelRegistry.sendEmail).toHaveBeenCalledWith('marketing', {
        userName: 'Test User',
        userEmail: 'test@example.com',
        campaignName: 'Test Marketing Campaign',
        contentHtml: '<h1>Welcome to our newsletter!</h1><p>This is a test marketing email.</p>',
        unsubscribeUrl: 'http://localhost:3000/unsubscribe',
        supportUrl: 'http://localhost:3000/support',
        trackingPixelUrl: 'http://localhost:3000/track',
      });

      expect(result).toEqual({
        success: true,
        message: 'Email de marketing enviado exitosamente',
        messageId: 'marketing-123',
      });
    });

    it('should handle unexpected errors', async () => {
      const testEmailDto = { ...baseTestDto, type: 'welcome' as const };

      emailChannelRegistry.sendEmail.mockRejectedValue(
        new Error('Unexpected error'),
      );

      const result = await controller.testEmail(testEmailDto);

      expect(result).toEqual({
        success: false,
        error: 'Unexpected error',
      });
    });
  });

  describe('testConfiguration', () => {
    it('should test configuration successfully', async () => {
      const mockResponse = { success: true };

      emailService.testConfiguration.mockResolvedValue(mockResponse);

      const result = await controller.testConfiguration();

      expect(emailService.testConfiguration).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'Configuración de Resend funcionando correctamente',
      });
    });

    it('should handle configuration test errors', async () => {
      const mockResponse = { success: false, error: 'Configuration error' };

      emailService.testConfiguration.mockResolvedValue(mockResponse);

      const result = await controller.testConfiguration();

      expect(result).toEqual({
        success: false,
        message: 'Error en configuración: Configuration error',
      });
    });

    it('should handle unexpected configuration errors', async () => {
      emailService.testConfiguration.mockRejectedValue(
        new Error('Network error'),
      );

      const result = await controller.testConfiguration();

      expect(result).toEqual({
        success: false,
        error: 'Network error',
      });
    });
  });

  describe('getRegistryInfo', () => {
    it('should return registry information successfully', async () => {
      const mockStats = {
        totalChannels: 5,
        supportedTypes: ['welcome', 'reset', 'verification', 'notification', 'marketing'],
        channelDetails: [
          { type: 'welcome', className: 'WelcomeEmailChannel' },
          { type: 'reset', className: 'PasswordResetEmailChannel' },
          { type: 'verification', className: 'EmailVerificationChannel' },
          { type: 'notification', className: 'NotificationEmailChannel' },
          { type: 'marketing', className: 'MarketingEmailChannel' },
        ],
      };

      emailChannelRegistry.getRegistryStats.mockReturnValue(mockStats);

      const result = await controller.getRegistryInfo();

      expect(emailChannelRegistry.getRegistryStats).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        data: mockStats,
        message: 'Email registry information retrieved successfully',
        ocpCompliance: {
          description: 'This system follows the Open/Closed Principle',
          benefits: [
            'New email types can be added without modifying existing code',
            'Email channels are registered dynamically',
            'System is extensible without breaking existing functionality',
            'Each email type has its own validation and processing logic',
          ],
          extensionExample:
            'To add a new email type, create a class implementing IEmailChannel and register it in the module',
        },
      });
    });

    it('should handle errors when retrieving registry information', async () => {
      emailChannelRegistry.getRegistryStats.mockImplementation(() => {
        throw new Error('Registry error');
      });

      const result = await controller.getRegistryInfo();

      expect(result).toEqual({
        success: false,
        error: 'Registry error',
      });
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
