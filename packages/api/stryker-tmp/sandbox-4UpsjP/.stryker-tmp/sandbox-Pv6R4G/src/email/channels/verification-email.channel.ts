// @ts-nocheck
// 
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
        `Email verification ${result.success ? 'sent successfully' : 'failed'} to ${data.userEmail}`
      );
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email verification to ${data.userEmail}:`, error);
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
   * Validate email verification data
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

    if (!data.verificationUrl || typeof data.verificationUrl !== 'string') {
      errors.push('verificationUrl is required and must be a string');
    }

    if (!data.supportUrl || typeof data.supportUrl !== 'string') {
      errors.push('supportUrl is required and must be a string');
    }

    // Email format validation
    if (data.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      errors.push('userEmail must be a valid email address');
    }

    // URL validation (basic)
    if (data.verificationUrl && !this.isValidUrl(data.verificationUrl)) {
      errors.push('verificationUrl must be a valid URL');
    }

    if (data.supportUrl && !this.isValidUrl(data.supportUrl)) {
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