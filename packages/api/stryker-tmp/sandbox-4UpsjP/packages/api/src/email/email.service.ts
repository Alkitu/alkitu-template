// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import {
  EmailTemplates,
  WelcomeEmailData,
  PasswordResetEmailData,
  EmailVerificationData,
} from './email-templates';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly defaultFrom: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      this.logger.error(
        'RESEND_API_KEY no está configurada en las variables de entorno',
      );
      throw new Error('RESEND_API_KEY is required');
    }

    this.resend = new Resend(apiKey);
    this.defaultFrom = process.env.EMAIL_FROM || 'noreply@alkitu.com';

    this.logger.log(`EmailService inicializado con from: ${this.defaultFrom}`);
  }

  /**
   * Envía un email genérico
   */
  async sendEmail(
    options: SendEmailOptions,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      this.logger.log(
        `Enviando email a: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`,
      );

      const result = await this.resend.emails.send({
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (result.error) {
        this.logger.error(`Error al enviar email: ${result.error.message}`);
        return { success: false, error: result.error.message };
      }

      this.logger.log(`Email enviado exitosamente. ID: ${result.data?.id}`);
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error inesperado al enviar email: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Envía email de bienvenida a nuevos usuarios
   */
  async sendWelcomeEmail(
    userData: WelcomeEmailData,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const { html, subject } = EmailTemplates.getWelcomeEmail(userData);

      return await this.sendEmail({
        to: userData.userEmail,
        subject,
        html,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error al generar email de bienvenida: ${errorMessage}`,
      );
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Envía email para restablecer contraseña
   */
  async sendPasswordResetEmail(
    userData: PasswordResetEmailData & { userEmail: string },
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const { html, subject } = EmailTemplates.getPasswordResetEmail(userData);

      return await this.sendEmail({
        to: userData.userEmail,
        subject,
        html,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error al generar email de reset de contraseña: ${errorMessage}`,
      );
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Envía email de verificación de cuenta
   */
  async sendEmailVerification(
    userData: EmailVerificationData & { userEmail: string },
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const { html, subject } =
        EmailTemplates.getEmailVerificationTemplate(userData);

      return await this.sendEmail({
        to: userData.userEmail,
        subject,
        html,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error al generar email de verificación: ${errorMessage}`,
      );
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Envía notificación general
   */
  async sendNotification(
    userEmail: string,
    userName: string,
    title: string,
    message: string,
    buttonText?: string,
    buttonUrl?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const { html, subject } = EmailTemplates.getNotificationEmail(
        title,
        message,
        userName,
        buttonText,
        buttonUrl,
      );

      return await this.sendEmail({
        to: userEmail,
        subject,
        html,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error al enviar notificación: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Envía emails en lote (máximo 100 destinatarios por lote)
   */
  async sendBulkEmails(
    recipients: string[],
    subject: string,
    html: string,
  ): Promise<{
    success: boolean;
    results: Array<{ email: string; success: boolean; error?: string }>;
  }> {
    const results: Array<{ email: string; success: boolean; error?: string }> =
      [];
    const batchSize = 100; // Límite de Resend

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      try {
        const result = await this.sendEmail({
          to: batch,
          subject,
          html,
        });

        batch.forEach((email) => {
          results.push({
            email,
            success: result.success,
            error: result.error,
          });
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        batch.forEach((email) => {
          results.push({
            email,
            success: false,
            error: errorMessage,
          });
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    this.logger.log(
      `Envío masivo completado: ${successCount}/${recipients.length} emails enviados`,
    );

    return {
      success: successCount > 0,
      results,
    };
  }

  /**
   * Verifica la configuración del servicio
   */
  async testConfiguration(): Promise<{ success: boolean; error?: string }> {
    try {
      // Intenta enviar un email de prueba a una dirección válida
      const testResult = await this.sendEmail({
        to: 'test@resend.dev', // Email de prueba de Resend
        subject: 'Test de configuración - Alkitu',
        html: '<h1>Test exitoso</h1><p>La configuración de Resend está funcionando correctamente.</p>',
      });

      return testResult;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }
}
