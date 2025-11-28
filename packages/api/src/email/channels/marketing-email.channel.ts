import { Injectable, Logger } from '@nestjs/common';
import { IEmailChannel } from './email-channel.interface';
import { EmailResult, MarketingEmailData } from '../types/email.types';
import { EmailService } from '../email.service';

/**
 * Marketing Email Channel - OCP EXTENSION EXAMPLE
 *
 * This class demonstrates OCP compliance by extending the email system
 * WITHOUT modifying any existing code. This new channel can be added
 * and registered dynamically.
 *
 * NOTICE: This file is a NEW addition that doesn't modify existing classes.
 */
@Injectable()
export class MarketingEmailChannel implements IEmailChannel {
  private readonly logger = new Logger(MarketingEmailChannel.name);
  readonly type = 'marketing';

  constructor(private readonly emailService: EmailService) {}

  /**
   * Send a marketing email
   *
   * This implementation uses the existing EmailService but adds
   * marketing-specific logic and templates
   */
  async send(data: MarketingEmailData): Promise<EmailResult> {
    try {
      this.logger.log(
        `Sending marketing email to ${data.userEmail} for campaign: ${data.campaignName}`,
      );

      // Marketing emails have additional tracking and formatting
      const enhancedData = this.enhanceMarketingData(data);

      // Use a generic email method or create a new one in EmailService
      // For now, using the notification method as a base
      const result = await this.emailService.sendNotification(
        data.userEmail,
        data.userName,
        `Marketing: ${data.campaignName}`,
        this.convertHtmlToText(data.contentHtml),
        'View Campaign',
        enhancedData.trackingUrl,
      );

      this.logger.log(
        `Marketing email for campaign '${data.campaignName}' ${
          result.success ? 'sent successfully' : 'failed'
        } to ${data.userEmail}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send marketing email for campaign '${data.campaignName}' to ${data.userEmail}:`,
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
    return type === 'marketing';
  }

  /**
   * Type guard to check if data is MarketingEmailData
   */
  private isMarketingEmailData(data: unknown): data is MarketingEmailData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const emailData = data as Record<string, unknown>;

    return (
      typeof emailData.userName === 'string' &&
      typeof emailData.userEmail === 'string' &&
      typeof emailData.supportUrl === 'string' &&
      typeof emailData.campaignName === 'string' &&
      typeof emailData.contentHtml === 'string' &&
      typeof emailData.unsubscribeUrl === 'string'
    );
  }

  /**
   * Validate marketing email data
   */
  validateData(data: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('Email data is required');
      return { isValid: false, errors };
    }

    if (!this.isMarketingEmailData(data)) {
      errors.push('Invalid marketing email data structure');

      if (typeof data === 'object') {
        const emailData = data as Record<string, unknown>;

        // Base validations
        if (!emailData.userName || typeof emailData.userName !== 'string') {
          errors.push('userName is required and must be a string');
        }

        if (!emailData.userEmail || typeof emailData.userEmail !== 'string') {
          errors.push('userEmail is required and must be a string');
        }

        if (!emailData.supportUrl || typeof emailData.supportUrl !== 'string') {
          errors.push('supportUrl is required and must be a string');
        }

        // Marketing-specific validations
        if (
          !emailData.campaignName ||
          typeof emailData.campaignName !== 'string'
        ) {
          errors.push('campaignName is required and must be a string');
        }

        if (
          !emailData.contentHtml ||
          typeof emailData.contentHtml !== 'string'
        ) {
          errors.push('contentHtml is required and must be a string');
        }

        if (
          !emailData.unsubscribeUrl ||
          typeof emailData.unsubscribeUrl !== 'string'
        ) {
          errors.push('unsubscribeUrl is required and must be a string');
        }

        // Optional tracking pixel
        if (
          emailData.trackingPixelUrl &&
          typeof emailData.trackingPixelUrl !== 'string'
        ) {
          errors.push('trackingPixelUrl must be a string if provided');
        }

        // Email format validation
        if (
          emailData.userEmail &&
          typeof emailData.userEmail === 'string' &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.userEmail)
        ) {
          errors.push('userEmail must be a valid email address');
        }

        // URL validation
        if (
          emailData.unsubscribeUrl &&
          typeof emailData.unsubscribeUrl === 'string' &&
          !this.isValidUrl(emailData.unsubscribeUrl)
        ) {
          errors.push('unsubscribeUrl must be a valid URL');
        }

        if (
          emailData.supportUrl &&
          typeof emailData.supportUrl === 'string' &&
          !this.isValidUrl(emailData.supportUrl)
        ) {
          errors.push('supportUrl must be a valid URL');
        }

        if (
          emailData.trackingPixelUrl &&
          typeof emailData.trackingPixelUrl === 'string' &&
          !this.isValidUrl(emailData.trackingPixelUrl)
        ) {
          errors.push('trackingPixelUrl must be a valid URL');
        }

        // Content length validation
        if (
          emailData.campaignName &&
          typeof emailData.campaignName === 'string' &&
          emailData.campaignName.length > 100
        ) {
          errors.push('campaignName must be 100 characters or less');
        }

        if (
          emailData.contentHtml &&
          typeof emailData.contentHtml === 'string' &&
          emailData.contentHtml.length > 50000
        ) {
          errors.push('contentHtml must be 50000 characters or less');
        }

        // HTML content validation (basic)
        if (
          emailData.contentHtml &&
          typeof emailData.contentHtml === 'string' &&
          !this.isValidHtml(emailData.contentHtml)
        ) {
          errors.push('contentHtml must be valid HTML');
        }
      }

      return { isValid: false, errors };
    }

    // Additional validation for valid data
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      errors.push('userEmail must be a valid email address');
    }

    if (!this.isValidUrl(data.unsubscribeUrl)) {
      errors.push('unsubscribeUrl must be a valid URL');
    }

    if (!this.isValidUrl(data.supportUrl)) {
      errors.push('supportUrl must be a valid URL');
    }

    if (data.trackingPixelUrl && !this.isValidUrl(data.trackingPixelUrl)) {
      errors.push('trackingPixelUrl must be a valid URL');
    }

    if (data.campaignName.length > 100) {
      errors.push('campaignName must be 100 characters or less');
    }

    if (data.contentHtml.length > 50000) {
      errors.push('contentHtml must be 50000 characters or less');
    }

    if (!this.isValidHtml(data.contentHtml)) {
      errors.push('contentHtml must be valid HTML');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Enhance marketing data with tracking and campaign-specific features
   */
  private enhanceMarketingData(
    data: MarketingEmailData,
  ): MarketingEmailData & { trackingUrl?: string } {
    const trackingUrl = data.trackingPixelUrl
      ? `${data.trackingPixelUrl}?campaign=${encodeURIComponent(data.campaignName)}&email=${encodeURIComponent(data.userEmail)}&timestamp=${Date.now()}`
      : undefined;

    return {
      ...data,
      trackingUrl,
    };
  }

  /**
   * Convert HTML content to plain text for fallback
   */
  private convertHtmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  /**
   * Basic HTML validation
   */
  private isValidHtml(html: string): boolean {
    // Basic validation: check for balanced opening/closing tags
    const openTags = (html.match(/<[^/][^>]*>/g) || []).length;
    const closeTags = (html.match(/<\/[^>]*>/g) || []).length;
    const selfClosing = (html.match(/<[^>]*\/>/g) || []).length;

    // Should have roughly equal open and close tags (considering self-closing)
    return Math.abs(openTags - closeTags - selfClosing) <= 2; // Allow some tolerance
  }

  /**
   * URL validation utility
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
