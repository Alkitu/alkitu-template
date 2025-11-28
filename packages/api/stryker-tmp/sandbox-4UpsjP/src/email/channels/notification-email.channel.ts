// @ts-nocheck
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
   * Type guard to check if data is NotificationEmailData
   */
  private isNotificationEmailData(
    data: unknown,
  ): data is NotificationEmailData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const emailData = data as Record<string, unknown>;

    return (
      typeof emailData.userName === 'string' &&
      typeof emailData.userEmail === 'string' &&
      typeof emailData.subject === 'string' &&
      typeof emailData.message === 'string' &&
      typeof emailData.supportUrl === 'string'
    );
  }

  /**
   * Validate notification email data
   */
  validateData(data: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('Email data is required');
      return { isValid: false, errors };
    }

    if (!this.isNotificationEmailData(data)) {
      errors.push('Invalid notification email data structure');

      if (typeof data === 'object') {
        const emailData = data as Record<string, unknown>;

        if (!emailData.userName || typeof emailData.userName !== 'string') {
          errors.push('userName is required and must be a string');
        }

        if (!emailData.userEmail || typeof emailData.userEmail !== 'string') {
          errors.push('userEmail is required and must be a string');
        }

        if (!emailData.subject || typeof emailData.subject !== 'string') {
          errors.push('subject is required and must be a string');
        }

        if (!emailData.message || typeof emailData.message !== 'string') {
          errors.push('message is required and must be a string');
        }

        if (!emailData.supportUrl || typeof emailData.supportUrl !== 'string') {
          errors.push('supportUrl is required and must be a string');
        }

        // Optional fields validation
        if (emailData.actionText && typeof emailData.actionText !== 'string') {
          errors.push('actionText must be a string if provided');
        }

        if (emailData.actionUrl && typeof emailData.actionUrl !== 'string') {
          errors.push('actionUrl must be a string if provided');
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
          emailData.actionUrl &&
          typeof emailData.actionUrl === 'string' &&
          !this.isValidUrl(emailData.actionUrl)
        ) {
          errors.push('actionUrl must be a valid URL');
        }

        if (
          emailData.supportUrl &&
          typeof emailData.supportUrl === 'string' &&
          !this.isValidUrl(emailData.supportUrl)
        ) {
          errors.push('supportUrl must be a valid URL');
        }

        // Content length validation
        if (
          emailData.subject &&
          typeof emailData.subject === 'string' &&
          emailData.subject.length > 200
        ) {
          errors.push('subject must be 200 characters or less');
        }

        if (
          emailData.message &&
          typeof emailData.message === 'string' &&
          emailData.message.length > 5000
        ) {
          errors.push('message must be 5000 characters or less');
        }
      }

      return { isValid: false, errors };
    }

    // Additional validation for valid data
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      errors.push('userEmail must be a valid email address');
    }

    if (data.actionUrl && !this.isValidUrl(data.actionUrl)) {
      errors.push('actionUrl must be a valid URL');
    }

    if (!this.isValidUrl(data.supportUrl)) {
      errors.push('supportUrl must be a valid URL');
    }

    if (data.subject.length > 200) {
      errors.push('subject must be 200 characters or less');
    }

    if (data.message.length > 5000) {
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
