// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { IEmailChannel } from './email-channel.interface';
import { EmailResult, PasswordResetEmailData } from '../types/email.types';
import { EmailService } from '../email.service';

/**
 * Password Reset Email Channel
 *
 * Handles password reset email functionality following OCP.
 * This class is CLOSED for modification but OPEN for extension.
 */
@Injectable()
export class PasswordResetEmailChannel implements IEmailChannel {
  private readonly logger = new Logger(PasswordResetEmailChannel.name);
  readonly type = 'reset';

  constructor(private readonly emailService: EmailService) {}

  /**
   * Send a password reset email
   */
  async send(data: PasswordResetEmailData): Promise<EmailResult> {
    try {
      this.logger.log(`Sending password reset email to ${data.userEmail}`);

      const result = await this.emailService.sendPasswordResetEmail(data);

      this.logger.log(
        `Password reset email ${result.success ? 'sent successfully' : 'failed'} to ${data.userEmail}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${data.userEmail}:`,
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
    return type === 'reset';
  }

  /**
   * Type guard to check if data is PasswordResetEmailData
   */
  private isPasswordResetEmailData(
    data: unknown,
  ): data is PasswordResetEmailData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const emailData = data as Record<string, unknown>;

    return (
      typeof emailData.userName === 'string' &&
      typeof emailData.userEmail === 'string' &&
      typeof emailData.resetUrl === 'string' &&
      typeof emailData.supportUrl === 'string' &&
      typeof emailData.securityUrl === 'string'
    );
  }

  /**
   * Validate password reset email data
   */
  validateData(data: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('Email data is required');
      return { isValid: false, errors };
    }

    if (!this.isPasswordResetEmailData(data)) {
      errors.push('Invalid password reset email data structure');

      if (typeof data === 'object') {
        const emailData = data as Record<string, unknown>;

        if (!emailData.userName || typeof emailData.userName !== 'string') {
          errors.push('userName is required and must be a string');
        }

        if (!emailData.userEmail || typeof emailData.userEmail !== 'string') {
          errors.push('userEmail is required and must be a string');
        }

        if (!emailData.resetUrl || typeof emailData.resetUrl !== 'string') {
          errors.push('resetUrl is required and must be a string');
        }

        if (!emailData.supportUrl || typeof emailData.supportUrl !== 'string') {
          errors.push('supportUrl is required and must be a string');
        }

        if (
          !emailData.securityUrl ||
          typeof emailData.securityUrl !== 'string'
        ) {
          errors.push('securityUrl is required and must be a string');
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
          emailData.resetUrl &&
          typeof emailData.resetUrl === 'string' &&
          !this.isValidUrl(emailData.resetUrl)
        ) {
          errors.push('resetUrl must be a valid URL');
        }

        if (
          emailData.supportUrl &&
          typeof emailData.supportUrl === 'string' &&
          !this.isValidUrl(emailData.supportUrl)
        ) {
          errors.push('supportUrl must be a valid URL');
        }

        if (
          emailData.securityUrl &&
          typeof emailData.securityUrl === 'string' &&
          !this.isValidUrl(emailData.securityUrl)
        ) {
          errors.push('securityUrl must be a valid URL');
        }
      }

      return { isValid: false, errors };
    }

    // Additional validation for valid data
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      errors.push('userEmail must be a valid email address');
    }

    if (!this.isValidUrl(data.resetUrl)) {
      errors.push('resetUrl must be a valid URL');
    }

    if (!this.isValidUrl(data.supportUrl)) {
      errors.push('supportUrl must be a valid URL');
    }

    if (!this.isValidUrl(data.securityUrl)) {
      errors.push('securityUrl must be a valid URL');
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
