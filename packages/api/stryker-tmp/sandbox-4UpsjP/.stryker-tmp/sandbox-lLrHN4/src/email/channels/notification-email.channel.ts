// @ts-nocheck
// 
import { Injectable, Logger } from '@nestjs/common';
import { IEmailChannel } from './email-channel.interface';
import { EmailResult, NotificationEmailData } from '../types/email.types';
import { EmailService } from '../email.service';

/**
 * Notification Email Channel
 *
 * Handles notification email functionality following OCP.
 * This class is CLOSED for modification but OPEN for extension.
 */
@Injectable()
export class NotificationEmailChannel implements IEmailChannel {
  private readonly logger = new Logger(NotificationEmailChannel.name);
  readonly type = 'notification';

  constructor(private readonly emailService: EmailService) {}

  /**
   * Send a notification email
   */
  async send(data: NotificationEmailData): Promise<EmailResult> {
    try {
      this.logger.log(`Sending notification email to ${data.userEmail}`);

      const result = await this.emailService.sendNotification(
        data.userEmail,
        data.userName,
        data.subject,
        data.message,
        data.actionText,
        data.actionUrl,
      );

      this.logger.log(
        `Notification email ${result.success ? 'sent successfully' : 'failed'} to ${data.userEmail}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send notification email to ${data.userEmail}:`,
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
    return type === 'notification';
  }

  /**
   * Validate notification email data
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

    if (!data.subject || typeof data.subject !== 'string') {
      errors.push('subject is required and must be a string');
    }

    if (!data.message || typeof data.message !== 'string') {
      errors.push('message is required and must be a string');
    }

    if (!data.supportUrl || typeof data.supportUrl !== 'string') {
      errors.push('supportUrl is required and must be a string');
    }

    // Optional fields validation
    if (data.actionText && typeof data.actionText !== 'string') {
      errors.push('actionText must be a string if provided');
    }

    if (data.actionUrl && typeof data.actionUrl !== 'string') {
      errors.push('actionUrl must be a string if provided');
    }

    // Email format validation
    if (data.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      errors.push('userEmail must be a valid email address');
    }

    // URL validation (basic)
    if (data.actionUrl && !this.isValidUrl(data.actionUrl)) {
      errors.push('actionUrl must be a valid URL');
    }

    if (data.supportUrl && !this.isValidUrl(data.supportUrl)) {
      errors.push('supportUrl must be a valid URL');
    }

    // Content length validation
    if (data.subject && data.subject.length > 200) {
      errors.push('subject must be 200 characters or less');
    }

    if (data.message && data.message.length > 5000) {
      errors.push('message must be 5000 characters or less');
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
