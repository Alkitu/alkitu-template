import { Injectable, Logger, Optional, Inject } from '@nestjs/common';
import { Resend } from 'resend';
import {
  EmailTemplates,
  WelcomeEmailData,
  PasswordResetEmailData,
  EmailVerificationData,
  LoginCodeEmailData,
} from './email-templates';
import { PrismaService } from '../prisma.service';
import { EmailRendererService } from './services/email-renderer.service';
import { BrandConfigService } from '../brand/brand-config.service';
import type { LocalizedEmailContent } from '@alkitu/shared';

/**
 * Escape HTML special characters to prevent XSS in email templates.
 * Applied to all user-provided values before inserting into HTML.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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

  constructor(
    @Optional() @Inject(PrismaService) private readonly prisma?: PrismaService,
    @Optional() private readonly emailRendererService?: EmailRendererService,
    @Optional() @Inject(BrandConfigService) private readonly brandConfigService?: BrandConfigService,
  ) {
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
   * Look up a template by slug from DB, render with variables, and return HTML+subject.
   * Returns null if no template found or DB unavailable (caller should fallback).
   */
  private async renderTemplateFromDB(
    slug: string,
    variables: Record<string, string>,
    locale?: string,
  ): Promise<{ subject: string; html: string } | null> {
    if (!this.prisma) return null;

    try {
      const template = await this.prisma.emailTemplate.findUnique({
        where: { slug },
      });

      if (!template || !template.active) return null;

      let subject = template.subject;
      let body = template.body;

      // Check for localized content
      if (locale && locale !== template.defaultLocale && template.localizations) {
        const localized = (template.localizations as LocalizedEmailContent[]).find(
          (l) => l.locale === locale,
        );
        if (localized) {
          subject = localized.subject;
          body = localized.body;
        }
      }

      // Replace all {{key}} placeholders (escape values to prevent XSS)
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(
          `\\{\\{${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\}`,
          'g',
        );
        const safeValue = escapeHtml(value);
        subject = subject.replace(regex, safeValue);
        body = body.replace(regex, safeValue);
      }

      // Wrap with React Email layout if renderer is available
      if (this.emailRendererService) {
        body = await this.emailRendererService.renderWithLayout(body, locale);
      }

      return { subject, html: body };
    } catch (error) {
      this.logger.warn(`DB template lookup failed for slug="${slug}": ${error instanceof Error ? error.message : 'unknown'}`);
      return null;
    }
  }

  /**
   * Envía un email con retry logic y soporte para idempotency keys.
   * Retries up to 3 times with exponential backoff for transient errors.
   * Validation errors are not retried.
   */
  async sendEmail(
    options: SendEmailOptions,
    idempotencyKey?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const maxRetries = 3;
    const recipient = Array.isArray(options.to) ? options.to.join(', ') : options.to;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          this.logger.warn(`Retry attempt ${attempt}/${maxRetries} for email to: ${recipient}`);
        } else {
          this.logger.log(`Enviando email a: ${recipient}`);
        }

        const { data, error } = await this.resend.emails.send(
          {
            from: options.from || this.defaultFrom,
            to: options.to,
            subject: options.subject,
            html: options.html,
          },
          idempotencyKey ? { idempotencyKey } : undefined,
        );

        if (!error) {
          this.logger.log(`Email enviado exitosamente. ID: ${data?.id}`);
          return { success: true, messageId: data?.id };
        }

        // Don't retry validation errors or idempotency conflicts
        if (error.name === 'validation_error' || error.name === 'invalid_idempotent_request') {
          this.logger.error(`Non-retryable email error: ${error.message}`);
          return { success: false, error: error.message };
        }

        // Retry transient errors
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          this.logger.warn(`Transient email error (${error.message}), retrying in ${Math.round(delay)}ms...`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }

        this.logger.error(`Email failed after ${maxRetries} retries: ${error.message}`);
        return { success: false, error: error.message };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          this.logger.warn(`Unexpected email error (${errorMessage}), retrying in ${Math.round(delay)}ms...`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }

        this.logger.error(`Email failed after ${maxRetries} retries: ${errorMessage}`);
        return { success: false, error: errorMessage };
      }
    }

    return { success: false, error: 'Max retries exceeded' };
  }

  private async resolveCompanyName(): Promise<string> {
    return await this.brandConfigService?.getCompanyName()
      ?? process.env.APP_NAME ?? 'Alkitu';
  }

  /**
   * Envía email de bienvenida a nuevos usuarios
   * DB-first: tries to load template from DB, falls back to hard-coded HTML
   */
  async sendWelcomeEmail(
    userData: WelcomeEmailData,
    locale?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Try DB template first
      const dbResult = await this.renderTemplateFromDB(
        'welcome',
        {
          'user.firstname': userData.userName,
          'user.email': userData.userEmail,
          'loginUrl': userData.loginUrl,
          'registrationDate': userData.registrationDate,
        },
        locale,
      );

      const idempotencyKey = `welcome-${userData.userEmail}`;

      if (dbResult) {
        return await this.sendEmail({
          to: userData.userEmail,
          subject: dbResult.subject,
          html: dbResult.html,
        }, idempotencyKey);
      }

      // Fallback to hard-coded template
      const companyName = await this.resolveCompanyName();
      const { html, subject } = EmailTemplates.getWelcomeEmail(userData, companyName);
      return await this.sendEmail({
        to: userData.userEmail,
        subject,
        html,
      }, idempotencyKey);
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
   * DB-first: tries to load template from DB, falls back to hard-coded HTML
   */
  async sendPasswordResetEmail(
    userData: PasswordResetEmailData & { userEmail: string },
    locale?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Try DB template first
      const dbResult = await this.renderTemplateFromDB(
        'password_reset',
        {
          'user.firstname': userData.userName,
          'resetUrl': userData.resetUrl,
        },
        locale,
      );

      const idempotencyKey = `password-reset-${userData.userEmail}-${Date.now()}`;

      if (dbResult) {
        return await this.sendEmail({
          to: userData.userEmail,
          subject: dbResult.subject,
          html: dbResult.html,
        }, idempotencyKey);
      }

      // Fallback to hard-coded template
      const companyName = await this.resolveCompanyName();
      const { html, subject } = EmailTemplates.getPasswordResetEmail(userData, companyName);
      return await this.sendEmail({
        to: userData.userEmail,
        subject,
        html,
      }, idempotencyKey);
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
   * DB-first: tries to load template from DB, falls back to hard-coded HTML
   */
  async sendEmailVerification(
    userData: EmailVerificationData & { userEmail: string },
    locale?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Try DB template first
      const dbResult = await this.renderTemplateFromDB(
        'email_verification',
        {
          'user.firstname': userData.userName,
          'verificationUrl': userData.verificationUrl,
        },
        locale,
      );

      const idempotencyKey = `email-verification-${userData.userEmail}`;

      if (dbResult) {
        return await this.sendEmail({
          to: userData.userEmail,
          subject: dbResult.subject,
          html: dbResult.html,
        }, idempotencyKey);
      }

      // Fallback to hard-coded template
      const companyName = await this.resolveCompanyName();
      const { html, subject } =
        EmailTemplates.getEmailVerificationTemplate(userData, companyName);
      return await this.sendEmail({
        to: userData.userEmail,
        subject,
        html,
      }, idempotencyKey);
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
   * Envía email con código de acceso (login code)
   * DB-first: tries to load template from DB, falls back to hard-coded HTML
   */
  async sendLoginCodeEmail(
    userData: LoginCodeEmailData,
    locale?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Try DB template first
      const dbResult = await this.renderTemplateFromDB(
        'login_code',
        {
          'user.firstname': userData.userName,
          'loginCode': userData.code,
        },
        locale,
      );

      const idempotencyKey = `login-code-${userData.userEmail}-${Date.now()}`;

      if (dbResult) {
        return await this.sendEmail({
          to: userData.userEmail,
          subject: dbResult.subject,
          html: dbResult.html,
        }, idempotencyKey);
      }

      // Fallback to hard-coded template
      const companyName = await this.resolveCompanyName();
      const { html, subject } = EmailTemplates.getLoginCodeEmail(userData, companyName);
      return await this.sendEmail({
        to: userData.userEmail,
        subject,
        html,
      }, idempotencyKey);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error al generar email de código de acceso: ${errorMessage}`,
      );
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Envía notificación general
   * DB-first: tries to load template from DB, falls back to hard-coded HTML
   */
  async sendNotification(
    userEmail: string,
    userName: string,
    title: string,
    message: string,
    buttonText?: string,
    buttonUrl?: string,
    locale?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Try DB template first
      const dbResult = await this.renderTemplateFromDB(
        'notification_general',
        {
          'user.firstname': userName,
          'notification.title': title,
          'notification.message': message,
          'notification.actionUrl': buttonUrl || '#',
          'notification.actionText': buttonText || 'Ver',
        },
        locale,
      );

      const idempotencyKey = `notification-${userEmail}-${Date.now()}`;

      if (dbResult) {
        return await this.sendEmail({
          to: userEmail,
          subject: title || dbResult.subject,
          html: dbResult.html,
        }, idempotencyKey);
      }

      // Fallback to hard-coded template
      const companyName = await this.resolveCompanyName();
      const { html, subject } = EmailTemplates.getNotificationEmail(
        title,
        message,
        userName,
        buttonText,
        buttonUrl,
        companyName,
      );

      return await this.sendEmail({
        to: userEmail,
        subject,
        html,
      }, idempotencyKey);
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
      const companyName = await this.resolveCompanyName();
      // Intenta enviar un email de prueba a una dirección válida
      const testResult = await this.sendEmail({
        to: 'test@resend.dev', // Email de prueba de Resend
        subject: `Test de configuración - ${companyName}`,
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
