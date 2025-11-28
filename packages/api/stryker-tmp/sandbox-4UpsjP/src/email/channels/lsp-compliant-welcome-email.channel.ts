// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import {
  IEmailChannel,
  WelcomeEmailData,
  EmailDeliveryResult,
  EmailChannelInfo,
} from '../interfaces/email-service.interface';
import {
  ServiceResult,
  ValidationResult,
  ValidationError,
  ServiceUnavailableError,
} from '../../common/interfaces/base-service.interface';
import { EmailService } from '../email.service';

/**
 * Welcome Email Channel - LSP Compliant Implementation
 *
 * This implementation strictly follows the Liskov Substitution Principle by:
 * - Never strengthening preconditions (accepts all valid WelcomeEmailData)
 * - Never weakening postconditions (always returns ServiceResult)
 * - Maintaining behavioral consistency with IEmailChannel contract
 * - Being fully substitutable with any other IEmailChannel implementation
 */
@Injectable()
export class LSPCompliantWelcomeEmailChannel
  implements IEmailChannel<WelcomeEmailData>
{
  private readonly logger = new Logger(LSPCompliantWelcomeEmailChannel.name);

  // LSP: Immutable properties as required by interface
  readonly serviceId = 'welcome-email-channel';
  readonly version = '1.0.0';
  readonly channelType = 'welcome';
  readonly supportedDataTypes = ['welcome'];
  readonly configSchema = {
    templateId: { type: 'string', required: true },
    sendDelay: { type: 'number', required: false, default: 0 },
    enableTracking: { type: 'boolean', required: false, default: true },
  };

  private isInitialized = false;
  private startTime = Date.now();
  private lastHealthCheck = new Date();

  constructor(private readonly emailService: EmailService) {}

  /**
   * Initialize the service
   *
   * LSP Contract Implementation:
   * - Returns ServiceResult<void> as required
   * - Never throws exceptions
   * - Sets up service state properly
   */
  async initialize(): Promise<ServiceResult<void>> {
    try {
      this.logger.log('Initializing Welcome Email Channel');

      // Verify email service is available
      const emailServiceHealth = await this.emailService.testConfiguration();

      if (!emailServiceHealth.success) {
        return {
          success: false,
          error: new ServiceUnavailableError('Email service is not available', {
            emailServiceError: emailServiceHealth.error,
          }),
        };
      }

      this.isInitialized = true;
      this.logger.log('Welcome Email Channel initialized successfully');

      return {
        success: true,
        metadata: {
          initializedAt: new Date().toISOString(),
          emailServiceVersion: 'latest',
        },
      };
    } catch (error) {
      this.logger.error('Failed to initialize Welcome Email Channel', error);
      return {
        success: false,
        error: new ServiceUnavailableError(
          'Failed to initialize welcome email channel',
          {
            originalError:
              error instanceof Error ? error.message : 'Unknown error',
          },
        ),
      };
    }
  }

  /**
   * Check service health
   *
   * LSP Contract Implementation:
   * - Returns boolean as required
   * - Never throws exceptions
   * - Completes within reasonable time
   */
  async isHealthy(): Promise<boolean> {
    try {
      this.lastHealthCheck = new Date();

      if (!this.isInitialized) {
        return false;
      }

      // Quick health check of email service
      const emailServiceTest = await Promise.race([
        this.emailService.testConfiguration(),
        new Promise<{ success: boolean }>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 3000),
        ),
      ]);

      return emailServiceTest.success;
    } catch (error) {
      this.logger.warn('Health check failed', error);
      return false;
    }
  }

  /**
   * Cleanup resources
   *
   * LSP Contract Implementation:
   * - Returns ServiceResult<void> as required
   * - Never throws exceptions
   * - Idempotent operation
   */
  async cleanup(): Promise<ServiceResult<void>> {
    try {
      this.logger.log('Cleaning up Welcome Email Channel');
      this.isInitialized = false;

      // Perform any async cleanup operations if needed
      await Promise.resolve(); // Ensure this is properly async

      return {
        success: true,
        metadata: {
          cleanedUpAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.logger.error('Cleanup failed', error);
      return {
        success: false,
        error: new ServiceUnavailableError(
          'Failed to cleanup welcome email channel',
          {
            originalError:
              error instanceof Error ? error.message : 'Unknown error',
          },
        ),
      };
    }
  }

  /**
   * Get service information
   *
   * LSP Contract Implementation:
   * - Returns ServiceInfo as required
   * - Never throws exceptions
   * - Provides current status
   */
  getServiceInfo() {
    return {
      serviceId: this.serviceId,
      version: this.version,
      status: this.isInitialized
        ? ((this.lastHealthCheck.getTime() > Date.now() - 60000
            ? 'healthy'
            : 'degraded') as 'healthy' | 'degraded' | 'stopped')
        : ('stopped' as 'healthy' | 'degraded' | 'stopped'),
      uptime: Date.now() - this.startTime,
      lastHealthCheck: this.lastHealthCheck,
      dependencies: ['email-service'],
      capabilities: ['welcome-emails', 'template-rendering', 'tracking'],
    };
  }

  /**
   * Send welcome email
   *
   * LSP Contract Implementation:
   * - Accepts all valid WelcomeEmailData (doesn't strengthen preconditions)
   * - Always returns ServiceResult<EmailDeliveryResult> (doesn't weaken postconditions)
   * - Never throws exceptions
   * - Validates data before processing
   */
  async send(
    data: WelcomeEmailData,
  ): Promise<ServiceResult<EmailDeliveryResult>> {
    const startTime = Date.now();

    try {
      this.logger.log(`Sending welcome email to ${data.recipientEmail}`);

      // LSP: Validate data using standard validation (no strengthened preconditions)
      const validation = this.validateData(data);
      if (!validation.isValid) {
        return {
          success: false,
          error: new ValidationError('Invalid welcome email data', {
            validationErrors: validation.errors.map((e) => e.message),
            recipientEmail: data.recipientEmail,
          }),
        };
      }

      // Check service health before processing
      if (!this.isInitialized) {
        return {
          success: false,
          error: new ServiceUnavailableError(
            'Welcome email channel is not initialized',
          ),
        };
      }

      // Send email using underlying email service
      const emailResult = await this.emailService.sendWelcomeEmail({
        userName: data.recipientName,
        userEmail: data.recipientEmail,
        registrationDate: data.registrationDate,
        loginUrl: data.loginUrl,
        unsubscribeUrl: data.unsubscribeUrl,
        supportUrl: data.supportUrl,
      });

      // LSP: Always return ServiceResult (never throw exceptions)
      if (emailResult.success) {
        const deliveryResult: EmailDeliveryResult = {
          messageId: emailResult.messageId || `welcome_${Date.now()}`,
          status: 'sent',
          timestamp: new Date(),
          deliveryTime: Date.now() - startTime,
          provider: 'resend',
        };

        this.logger.log(
          `Welcome email sent successfully to ${data.recipientEmail}, messageId: ${deliveryResult.messageId}`,
        );

        return {
          success: true,
          data: deliveryResult,
          metadata: {
            channelType: this.channelType,
            processedAt: new Date().toISOString(),
          },
        };
      } else {
        return {
          success: false,
          error: new ServiceUnavailableError('Failed to send welcome email', {
            emailServiceError: emailResult.error,
            recipientEmail: data.recipientEmail,
          }),
        };
      }
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${data.recipientEmail}:`,
        error,
      );

      // LSP: Never throw exceptions, always return ServiceResult
      return {
        success: false,
        error: new ServiceUnavailableError(
          'Unexpected error sending welcome email',
          {
            originalError:
              error instanceof Error ? error.message : 'Unknown error',
            recipientEmail: data.recipientEmail,
          },
        ),
      };
    }
  }

  /**
   * Validate email data
   *
   * LSP Contract Implementation:
   * - Uses consistent validation criteria for base fields
   * - Only adds validation for welcome-specific fields
   * - Returns ValidationResult as required
   * - Never throws exceptions
   */
  validateData(data: WelcomeEmailData): ValidationResult {
    const errors: ValidationError[] = [];

    try {
      // Base validation (consistent across all channels)
      if (!data) {
        errors.push(new ValidationError('Email data is required'));
        return { isValid: false, errors };
      }

      // Validate base fields (cannot strengthen these preconditions)
      if (!data.recipientEmail || typeof data.recipientEmail !== 'string') {
        errors.push(
          new ValidationError(
            'recipientEmail is required and must be a string',
          ),
        );
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.recipientEmail)) {
        errors.push(
          new ValidationError('recipientEmail must be a valid email address'),
        );
      }

      if (!data.recipientName || typeof data.recipientName !== 'string') {
        errors.push(
          new ValidationError('recipientName is required and must be a string'),
        );
      }

      // Validate data type
      if (data.dataType !== 'welcome') {
        errors.push(new ValidationError('dataType must be "welcome"'));
      }

      // Welcome-specific validation (only for fields specific to this channel)
      if (!data.registrationDate || typeof data.registrationDate !== 'string') {
        errors.push(
          new ValidationError(
            'registrationDate is required and must be a string',
          ),
        );
      }

      if (!data.loginUrl || typeof data.loginUrl !== 'string') {
        errors.push(
          new ValidationError('loginUrl is required and must be a string'),
        );
      } else if (!this.isValidUrl(data.loginUrl)) {
        errors.push(new ValidationError('loginUrl must be a valid URL'));
      }

      if (!data.unsubscribeUrl || typeof data.unsubscribeUrl !== 'string') {
        errors.push(
          new ValidationError(
            'unsubscribeUrl is required and must be a string',
          ),
        );
      } else if (!this.isValidUrl(data.unsubscribeUrl)) {
        errors.push(new ValidationError('unsubscribeUrl must be a valid URL'));
      }

      if (!data.supportUrl || typeof data.supportUrl !== 'string') {
        errors.push(
          new ValidationError('supportUrl is required and must be a string'),
        );
      } else if (!this.isValidUrl(data.supportUrl)) {
        errors.push(new ValidationError('supportUrl must be a valid URL'));
      }

      // Optional fields validation
      if (data.senderName && typeof data.senderName !== 'string') {
        errors.push(
          new ValidationError('senderName must be a string if provided'),
        );
      }

      if (
        data.replyTo &&
        (typeof data.replyTo !== 'string' ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.replyTo))
      ) {
        errors.push(
          new ValidationError(
            'replyTo must be a valid email address if provided',
          ),
        );
      }
    } catch (error) {
      // LSP: Never throw exceptions from validation
      errors.push(
        new ValidationError('Validation failed due to unexpected error', {
          originalError:
            error instanceof Error ? error.message : 'Unknown error',
        }),
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings:
        errors.length > 0
          ? [`Found ${errors.length} validation errors`]
          : undefined,
    };
  }

  /**
   * Check if channel supports data type
   *
   * LSP Contract Implementation:
   * - Returns boolean as required
   * - Never throws exceptions
   * - Consistent with supportedDataTypes
   */
  supportsDataType(dataType: string): boolean {
    return this.supportedDataTypes.includes(dataType as any);
  }

  /**
   * Get channel information
   *
   * LSP Contract Implementation:
   * - Returns EmailChannelInfo as required
   * - Never throws exceptions
   * - Consistent across instances
   */
  getChannelInfo(): EmailChannelInfo {
    return {
      channelType: this.channelType,
      provider: 'resend',
      maxRecipientsPerMessage: 1,
      maxMessageSize: 10 * 1024 * 1024, // 10MB
      supportedFormats: ['html', 'text'],
      rateLimits: {
        messagesPerHour: 100,
        messagesPerDay: 1000,
      },
      features: {
        tracking: true,
        templates: true,
        attachments: false,
        scheduling: false,
      },
    };
  }

  /**
   * Private helper methods
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
