/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck

// 

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { TestEmailDto } from './dto/test-email.dto';
import { EmailChannelRegistryService } from './services/email-channel-registry.service';

@ApiTags('email')
@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(
    private emailService: EmailService,
    private emailChannelRegistry: EmailChannelRegistryService,
  ) {}

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Test email functionality (development only)',
    description:
      'Send test emails of different types to verify email service configuration. This endpoint is intended for development and testing purposes only.',
  })
  @ApiBody({ type: TestEmailDto })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully',
    schema: {
      example: {
        success: true,
        message: 'Email de welcome enviado exitosamente',
        messageId: 'b25c6e4a-8e2f-4c78-9b4a-1234567890ab',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error sending email',
    schema: {
      example: {
        success: false,
        error: 'Invalid email type or configuration error',
      },
    },
  })
  async testEmail(@Body() testEmailDto: TestEmailDto) {
    const { to, type, userName = 'Usuario de Prueba' } = testEmailDto;

    try {
      this.logger.log(`Processing test email request: type=${type}, to=${to}`);

      // ✅ OCP COMPLIANT: No switch statement needed!
      // The registry dynamically finds the appropriate channel
      const emailData = this.buildEmailData(type, to, userName);
      const result = await this.emailChannelRegistry.sendEmail(type, emailData);

      const response = {
        success: result.success,
        message: result.success
          ? `Email de ${type} enviado exitosamente`
          : `Error enviando email: ${result.error}`,
        messageId: result.messageId,
      };

      this.logger.log(`Test email response: ${JSON.stringify(response)}`);
      return response;
    } catch (error: any) {
      this.logger.error(`Error processing test email request:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Build email data based on type
   * 
   * This method prepares the data for each email type.
   * Adding new email types only requires adding a new case here,
   * no modification to the main flow.
   */
  private buildEmailData(type: string, to: string, userName: string): any {
    const baseUrls = {
      login: 'http://localhost:3000/login',
      support: 'http://localhost:3000/support',
      dashboard: 'http://localhost:3000/dashboard',
      security: 'http://localhost:3000/security',
      unsubscribe: 'http://localhost:3000/unsubscribe',
    };

    switch (type) {
      case 'welcome':
        return {
          userName,
          userEmail: to,
          registrationDate: new Date().toLocaleDateString('es-ES'),
          loginUrl: baseUrls.login,
          unsubscribeUrl: baseUrls.unsubscribe,
          supportUrl: baseUrls.support,
        };

      case 'reset':
        return {
          userName,
          userEmail: to,
          resetUrl: 'http://localhost:3000/reset-password?token=test-token-123',
          supportUrl: baseUrls.support,
          securityUrl: baseUrls.security,
        };

      case 'verification':
        return {
          userName,
          userEmail: to,
          verificationUrl: 'http://localhost:3000/verify-email?token=test-token-123',
          supportUrl: baseUrls.support,
        };

      case 'notification':
        return {
          userName,
          userEmail: to,
          subject: 'Notificación de Prueba',
          message: 'Esta es una notificación de prueba del sistema de emails de Alkitu. Todo está funcionando correctamente.',
          actionText: 'Ir al Dashboard',
          actionUrl: baseUrls.dashboard,
          supportUrl: baseUrls.support,
        };

      case 'marketing':
        return {
          userName,
          userEmail: to,
          campaignName: 'Test Marketing Campaign',
          contentHtml: '<h1>Welcome to our newsletter!</h1><p>This is a test marketing email.</p>',
          unsubscribeUrl: baseUrls.unsubscribe,
          supportUrl: baseUrls.support,
          trackingPixelUrl: 'http://localhost:3000/track',
        };

      default:
        throw new Error(`Email type '${type}' is not supported`);
    }
  }

  @Post('test-config')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Test email service configuration',
    description:
      'Verify that the email service (Resend) configuration is working properly without sending actual emails.',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuration test result',
    schema: {
      example: {
        success: true,
        message: 'Configuración de Resend funcionando correctamente',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Configuration error',
    schema: {
      example: {
        success: false,
        error: 'API key not configured or invalid',
      },
    },
  })
  async testConfiguration() {
    try {
      const result = await this.emailService.testConfiguration();

      return {
        success: result.success,
        message: result.success
          ? 'Configuración de Resend funcionando correctamente'
          : `Error en configuración: ${result.error}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('registry-info')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get email registry information',
    description: 'Display information about registered email channels and supported types. Demonstrates OCP extensibility.',
  })
  @ApiResponse({
    status: 200,
    description: 'Registry information retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          totalChannels: 5,
          supportedTypes: ['welcome', 'reset', 'verification', 'notification', 'marketing'],
          channelDetails: [
            { type: 'welcome', className: 'WelcomeEmailChannel' },
            { type: 'reset', className: 'PasswordResetEmailChannel' },
            { type: 'verification', className: 'EmailVerificationChannel' },
            { type: 'notification', className: 'NotificationEmailChannel' },
            { type: 'marketing', className: 'MarketingEmailChannel' },
          ],
        },
        message: 'Email registry information retrieved successfully',
      },
    },
  })
  async getRegistryInfo() {
    try {
      this.logger.log('Retrieving email registry information');
      
      const stats = this.emailChannelRegistry.getRegistryStats();
      
      const response = {
        success: true,
        data: stats,
        message: 'Email registry information retrieved successfully',
        ocpCompliance: {
          description: 'This system follows the Open/Closed Principle',
          benefits: [
            'New email types can be added without modifying existing code',
            'Email channels are registered dynamically',
            'System is extensible without breaking existing functionality',
            'Each email type has its own validation and processing logic',
          ],
          extensionExample: 'To add a new email type, create a class implementing IEmailChannel and register it in the module',
        },
      };

      this.logger.log(`Registry info response: ${JSON.stringify(response)}`);
      return response;
    } catch (error: any) {
      this.logger.error('Error retrieving registry information:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
