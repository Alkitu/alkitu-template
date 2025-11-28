// @ts-nocheck
// 
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
   * Validate password reset email data
   */
  validateData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('Email data is required');
      return { isValid: false, errors };
    }

    if (!data.userName || typeof data.userName !== 'string') {
      errors.push('userName is required and must be a string');
    }

    if (!data.userEmail || typeof data.userEmail !== 'string') {
      errors.push('userEmail is required and must be a string');
    }

    if (!data.resetUrl || typeof data.resetUrl !== 'string') {
      errors.push('resetUrl is required and must be a string');
    }

    if (!data.supportUrl || typeof data.supportUrl !== 'string') {
      errors.push('supportUrl is required and must be a string');
    }

    if (!data.securityUrl || typeof data.securityUrl !== 'string') {
      errors.push('securityUrl is required and must be a string');
    }

    // Email format validation
    if (data.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      errors.push('userEmail must be a valid email address');
    }

    // URL validation (basic)
    if (data.resetUrl && !this.isValidUrl(data.resetUrl)) {
      errors.push('resetUrl must be a valid URL');
    }

    if (data.supportUrl && !this.isValidUrl(data.supportUrl)) {
      errors.push('supportUrl must be a valid URL');
    }

    if (data.securityUrl && !this.isValidUrl(data.securityUrl)) {
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
