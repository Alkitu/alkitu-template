// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { IEmailChannel } from './email-channel.interface';
import { EmailResult, EmailVerificationData } from '../types/email.types';
import { EmailService } from '../email.service';

/**
 * Email Verification Channel
 *
 * Handles email verification functionality following OCP.
 * This class is CLOSED for modification but OPEN for extension.
 */
@Injectable()
export class EmailVerificationChannel implements IEmailChannel {
  private readonly logger = new Logger(EmailVerificationChannel.name);
  readonly type = 'verification';

  constructor(private readonly emailService: EmailService) {}

  /**
   * Send an email verification email
   */
  async send(data: EmailVerificationData): Promise<EmailResult> {
    try {
      this.logger.log(`Sending email verification to ${data.userEmail}`);

      const result = await this.emailService.sendEmailVerification(data);

      this.logger.log(
        `Email verification ${result.success ? 'sent successfully' : 'failed'} to ${data.userEmail}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send email verification to ${data.userEmail}:`,
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
    return type === 'verification';
  }

  /**
   * Type guard to check if data is EmailVerificationData
   */
  private isEmailVerificationData(
    data: unknown,
  ): data is EmailVerificationData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const emailData = data as Record<string, unknown>;

    return (
      typeof emailData.userName === 'string' &&
      typeof emailData.userEmail === 'string' &&
      typeof emailData.verificationUrl === 'string' &&
      typeof emailData.supportUrl === 'string'
    );
  }

  /**
   * Validate email verification data
   */
  validateData(data: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('Email data is required');
      return { isValid: false, errors };
    }

    if (!this.isEmailVerificationData(data)) {
      errors.push('Invalid email verification data structure');

      if (typeof data === 'object') {
        const emailData = data as Record<string, unknown>;

        if (!emailData.userName || typeof emailData.userName !== 'string') {
          errors.push('userName is required and must be a string');
        }

        if (!emailData.userEmail || typeof emailData.userEmail !== 'string') {
          errors.push('userEmail is required and must be a string');
        }

        if (
          !emailData.verificationUrl ||
          typeof emailData.verificationUrl !== 'string'
        ) {
          errors.push('verificationUrl is required and must be a string');
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

        // URL validation (basic)
        if (
          emailData.verificationUrl &&
          typeof emailData.verificationUrl === 'string' &&
          !this.isValidUrl(emailData.verificationUrl)
        ) {
          errors.push('verificationUrl must be a valid URL');
        }

        if (
          emailData.supportUrl &&
          typeof emailData.supportUrl === 'string' &&
          !this.isValidUrl(emailData.supportUrl)
        ) {
          errors.push('supportUrl must be a valid URL');
        }
      }

      return { isValid: false, errors };
    }

    // Additional validation for valid data
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      errors.push('userEmail must be a valid email address');
    }

    if (!this.isValidUrl(data.verificationUrl)) {
      errors.push('verificationUrl must be a valid URL');
    }

    if (!this.isValidUrl(data.supportUrl)) {
      errors.push('supportUrl must be a valid URL');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
