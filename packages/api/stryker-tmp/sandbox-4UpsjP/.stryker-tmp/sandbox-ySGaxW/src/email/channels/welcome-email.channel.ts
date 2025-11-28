// @ts-nocheck
// 
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
        `Welcome email ${result.success ? 'sent successfully' : 'failed'} to ${data.userEmail}`
      );
      
      return result;
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${data.userEmail}:`, error);
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
   * Validate welcome email data
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

    if (!data.registrationDate || typeof data.registrationDate !== 'string') {
      errors.push('registrationDate is required and must be a string');
    }

    if (!data.loginUrl || typeof data.loginUrl !== 'string') {
      errors.push('loginUrl is required and must be a string');
    }

    if (!data.unsubscribeUrl || typeof data.unsubscribeUrl !== 'string') {
      errors.push('unsubscribeUrl is required and must be a string');
    }

    if (!data.supportUrl || typeof data.supportUrl !== 'string') {
      errors.push('supportUrl is required and must be a string');
    }

    // Email format validation
    if (data.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      errors.push('userEmail must be a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}