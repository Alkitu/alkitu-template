// @ts-nocheck
import {
  IBaseService,
  ServiceResult,
} from '../../common/interfaces/base-service.interface';

/**
 * Email Sending Interface - ISP Compliant
 *
 * This interface follows the Interface Segregation Principle by:
 * - Focusing solely on email sending operations
 * - Separating sending from template management and analytics
 * - Providing specialized interface for email delivery
 * - Being easily testable with focused responsibilities
 */

export interface EmailMessage {
  to: string | string[];
  from?: string;
  replyTo?: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: EmailAttachment[];
  headers?: Record<string, string>;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType: string;
  disposition?: 'attachment' | 'inline';
  contentId?: string;
}

export interface EmailSendResult {
  messageId: string;
  status: 'sent' | 'queued' | 'failed';
  timestamp: Date;
  provider: string;
  recipientCount: number;
  failedRecipients?: string[];
  errorMessage?: string;
}

export interface BulkEmailJob {
  jobId: string;
  totalRecipients: number;
  processedRecipients: number;
  failedRecipients: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;
  failureReasons?: Array<{ recipient: string; reason: string }>;
}

export interface EmailValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface EmailQuota {
  dailyLimit: number;
  dailyUsed: number;
  monthlyLimit: number;
  monthlyUsed: number;
  remainingDaily: number;
  remainingMonthly: number;
  resetsAt: Date;
}

/**
 * Email Sending Service Interface
 *
 * ISP Contract:
 * - Only contains methods related to email sending and delivery
 * - Does not include template management, analytics, or configuration
 * - Clients that only need email sending don't depend on unused methods
 * - Focused on email delivery operations
 */
export interface IEmailSendingService extends IBaseService {
  /**
   * Send single email
   *
   * ISP Compliance:
   * - Focused solely on email delivery
   * - Does not handle template processing or analytics
   * - Single responsibility for email sending
   */
  sendEmail(
    emailMessage: EmailMessage,
  ): Promise<ServiceResult<EmailSendResult>>;

  /**
   * Send bulk emails
   *
   * ISP Compliance:
   * - Specialized method for bulk email delivery
   * - Email sending specific operation
   * - Focused on high-volume email processing
   */
  sendBulkEmails(
    emailMessages: EmailMessage[],
  ): Promise<ServiceResult<BulkEmailJob>>;

  /**
   * Send email to multiple recipients (broadcast)
   *
   * ISP Compliance:
   * - Focused on broadcast email delivery
   * - Email sending specific operation
   * - Single responsibility for one-to-many sending
   */
  sendBroadcastEmail(
    recipients: string[],
    emailMessage: Omit<EmailMessage, 'to'>,
  ): Promise<ServiceResult<EmailSendResult>>;

  /**
   * Validate email message before sending
   *
   * ISP Compliance:
   * - Email sending specific validation
   * - Focused on pre-send message validation
   * - Single-purpose validation method
   */
  validateEmailMessage(
    emailMessage: EmailMessage,
  ): Promise<ServiceResult<EmailValidation>>;

  /**
   * Get bulk email job status
   *
   * ISP Compliance:
   * - Focused on bulk sending job tracking
   * - Email sending specific operation
   * - Does not include general analytics data
   */
  getBulkEmailJobStatus(jobId: string): Promise<ServiceResult<BulkEmailJob>>;

  /**
   * Cancel bulk email job
   *
   * ISP Compliance:
   * - Specialized method for bulk job cancellation
   * - Email sending specific operation
   * - Focused on job management
   */
  cancelBulkEmailJob(jobId: string): Promise<ServiceResult<void>>;

  /**
   * Get email sending quota information
   *
   * ISP Compliance:
   * - Email sending specific quota tracking
   * - Focused on sending limits and usage
   * - Does not include general account quotas
   */
  getEmailQuota(): Promise<ServiceResult<EmailQuota>>;

  /**
   * Check if email can be sent (quota and limits)
   *
   * ISP Compliance:
   * - Email sending specific authorization check
   * - Focused on sending permissions
   * - Single-purpose validation method
   */
  canSendEmail(recipientCount?: number): Promise<ServiceResult<boolean>>;

  /**
   * Retry failed email
   *
   * ISP Compliance:
   * - Focused on email delivery retry logic
   * - Email sending specific operation
   * - Single responsibility for delivery retry
   */
  retryFailedEmail(messageId: string): Promise<ServiceResult<EmailSendResult>>;

  /**
   * Get email delivery status
   *
   * ISP Compliance:
   * - Email sending specific status tracking
   * - Focused on delivery confirmation
   * - Does not include analytics or engagement data
   */
  getDeliveryStatus(messageId: string): Promise<
    ServiceResult<{
      status: 'sent' | 'delivered' | 'bounced' | 'failed';
      timestamp: Date;
      details?: string;
    }>
  >;
}
