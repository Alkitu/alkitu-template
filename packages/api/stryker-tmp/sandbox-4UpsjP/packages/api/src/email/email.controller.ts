/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { TestEmailDto } from './dto/test-email.dto';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

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
      let result;

      switch (type) {
        case 'welcome':
          result = await this.emailService.sendWelcomeEmail({
            userName,
            userEmail: to,
            registrationDate: new Date().toLocaleDateString('es-ES'),
            loginUrl: 'http://localhost:3000/login',
            unsubscribeUrl: 'http://localhost:3000/unsubscribe',
            supportUrl: 'http://localhost:3000/support',
          });
          break;

        case 'reset':
          result = await this.emailService.sendPasswordResetEmail({
            userName,
            userEmail: to,
            resetUrl:
              'http://localhost:3000/reset-password?token=test-token-123',
            supportUrl: 'http://localhost:3000/support',
            securityUrl: 'http://localhost:3000/security',
          });
          break;

        case 'verification':
          result = await this.emailService.sendEmailVerification({
            userName,
            userEmail: to,
            verificationUrl:
              'http://localhost:3000/verify-email?token=test-token-123',
            supportUrl: 'http://localhost:3000/support',
          });
          break;

        case 'notification':
          result = await this.emailService.sendNotification(
            to,
            userName,
            'Notificación de Prueba',
            'Esta es una notificación de prueba del sistema de emails de Alkitu. Todo está funcionando correctamente.',
            'Ir al Dashboard',
            'http://localhost:3000/dashboard',
          );
          break;

        default:
          return { success: false, error: 'Tipo de email no válido' };
      }

      return {
        success: result.success,
        message: result.success
          ? `Email de ${type} enviado exitosamente`
          : `Error enviando email: ${result.error}`,
        messageId: result.messageId,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
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
}
