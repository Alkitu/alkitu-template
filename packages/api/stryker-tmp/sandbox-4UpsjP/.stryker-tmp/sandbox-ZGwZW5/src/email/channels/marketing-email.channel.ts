// @ts-nocheck
// 
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
   * Validate marketing email data
   */
  validateData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('Email data is required');
      return { isValid: false, errors };
    }

    // Base validations
    if (!data.userName || typeof data.userName !== 'string') {
      errors.push('userName is required and must be a string');
    }

    if (!data.userEmail || typeof data.userEmail !== 'string') {
      errors.push('userEmail is required and must be a string');
    }

    if (!data.supportUrl || typeof data.supportUrl !== 'string') {
      errors.push('supportUrl is required and must be a string');
    }

    // Marketing-specific validations
    if (!data.campaignName || typeof data.campaignName !== 'string') {
      errors.push('campaignName is required and must be a string');
    }

    if (!data.contentHtml || typeof data.contentHtml !== 'string') {
      errors.push('contentHtml is required and must be a string');
    }

    if (!data.unsubscribeUrl || typeof data.unsubscribeUrl !== 'string') {
      errors.push('unsubscribeUrl is required and must be a string');
    }

    // Optional tracking pixel
    if (data.trackingPixelUrl && typeof data.trackingPixelUrl !== 'string') {
      errors.push('trackingPixelUrl must be a string if provided');
    }

    // Email format validation
    if (data.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      errors.push('userEmail must be a valid email address');
    }

    // URL validation
    if (data.unsubscribeUrl && !this.isValidUrl(data.unsubscribeUrl)) {
      errors.push('unsubscribeUrl must be a valid URL');
    }

    if (data.supportUrl && !this.isValidUrl(data.supportUrl)) {
      errors.push('supportUrl must be a valid URL');
    }

    if (data.trackingPixelUrl && !this.isValidUrl(data.trackingPixelUrl)) {
      errors.push('trackingPixelUrl must be a valid URL');
    }

    // Content length validation
    if (data.campaignName && data.campaignName.length > 100) {
      errors.push('campaignName must be 100 characters or less');
    }

    if (data.contentHtml && data.contentHtml.length > 50000) {
      errors.push('contentHtml must be 50000 characters or less');
    }

    // HTML content validation (basic)
    if (data.contentHtml && !this.isValidHtml(data.contentHtml)) {
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
    const openTags = (html.match(/<[^\/][^>]*>/g) || []).length;
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
