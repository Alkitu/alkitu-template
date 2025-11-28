// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { IEmailChannel } from './email-channel.interface';
import { EmailResult, WelcomeEmailData } from '../types/email.types';
import { EmailService } from '../email.service';

/**
 * Welcome Email Channel
 *
 * Handles welcome email functionality following OCP.
 * This class is CLOSED for modification but OPEN for extension.
 */
@Injectable()
export class WelcomeEmailChannel implements IEmailChannel {
  private readonly logger = new Logger(WelcomeEmailChannel.name);
  readonly type = 'welcome';

  constructor(private readonly emailService: EmailService) {}

  /**
   * Send a welcome email
   */
  async send(data: WelcomeEmailData): Promise<EmailResult> {
    try {
      this.logger.log(`Sending welcome email to ${data.userEmail}`);

      const result = await this.emailService.sendWelcomeEmail(data);

      this.logger.log(
        `Welcome email ${result.success ? 'sent successfully' : 'failed'} to ${data.userEmail}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${data.userEmail}:`,
        error,
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check if this channel supports the given type
   */
  supports(type: string): boolean {
    return type === 'welcome';
  }

  /**
   * Type guard to check if data is WelcomeEmailData
   */
  private isWelcomeEmailData(data: unknown): data is WelcomeEmailData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const emailData = data as Record<string, unknown>;

    return (
      typeof emailData.userName === 'string' &&
      typeof emailData.userEmail === 'string' &&
      typeof emailData.registrationDate === 'string' &&
      typeof emailData.loginUrl === 'string' &&
      typeof emailData.unsubscribeUrl === 'string' &&
      typeof emailData.supportUrl === 'string'
    );
  }

  /**
   * Validate welcome email data
   */
  validateData(data: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('Email data is required');
      return { isValid: false, errors };
    }

    if (!this.isWelcomeEmailData(data)) {
      errors.push('Invalid welcome email data structure');

      if (typeof data === 'object') {
        const emailData = data as Record<string, unknown>;

        if (!emailData.userName || typeof emailData.userName !== 'string') {
          errors.push('userName is required and must be a string');
        }

        if (!emailData.userEmail || typeof emailData.userEmail !== 'string') {
          errors.push('userEmail is required and must be a string');
        }

        if (
          !emailData.registrationDate ||
          typeof emailData.registrationDate !== 'string'
        ) {
          errors.push('registrationDate is required and must be a string');
        }

        if (!emailData.loginUrl || typeof emailData.loginUrl !== 'string') {
          errors.push('loginUrl is required and must be a string');
        }

        if (
          !emailData.unsubscribeUrl ||
          typeof emailData.unsubscribeUrl !== 'string'
        ) {
          errors.push('unsubscribeUrl is required and must be a string');
        }

        if (!emailData.supportUrl || typeof emailData.supportUrl !== 'string') {
          errors.push('supportUrl is required and must be a string');
        }

        // Email format validation
        if (
          emailData.userEmail &&
          typeof emailData.userEmail === 'string' &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.userEmail)
        ) {
          errors.push('userEmail must be a valid email address');
        }
      }

      return { isValid: false, errors };
    }

    // Email format validation for valid data
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      errors.push('userEmail must be a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
