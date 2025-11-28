// @ts-nocheck
// 
import { IBaseService, ServiceResult, ValidationResult } from '../../common/interfaces/base-service.interface';

/**
 * Email Service Interfaces - LSP Compliant
 * 
 * These interfaces follow the Liskov Substitution Principle by:
 * - Defining clear behavioral contracts
 * - Not allowing subclasses to strengthen preconditions
 * - Not allowing subclasses to weaken postconditions
 * - Ensuring all implementations are fully substitutable
 */

/**
 * Base email data interface that all email types must extend
 * 
 * LSP Contract: All extending interfaces must include these fields
 * and must not make any of these optional
 */
export interface IBaseEmailData {
  readonly recipientEmail: string;
  readonly recipientName: string;
  readonly senderName?: string;
  readonly replyTo?: string;
  readonly metadata?: Record<string, any>;
}

/**
 * Email delivery result interface
 * 
 * Standardizes return types across all email operations
 */
export interface EmailDeliveryResult {
  messageId: string;
  status: 'sent' | 'queued' | 'failed';
  timestamp: Date;
  deliveryTime?: number; // milliseconds
  provider?: string;
  error?: string;
}

/**
 * Email channel interface following LSP
 * 
 * All email channel implementations must follow this contract exactly:
 * - Cannot add additional required parameters
 * - Cannot remove or change return types
 * - Cannot throw different exceptions
 * - Must handle all valid input data
 */
export interface IEmailChannel<T extends IBaseEmailData = IBaseEmailData> extends IBaseService {
  /**
   * Channel type identifier
   * 
   * LSP Contract:
   * - Must be immutable
   * - Must be unique across all channels
   * - Must match the channel's actual functionality
   */
  readonly channelType: string;

  /**
   * Supported email data types
   * 
   * LSP Contract:
   * - Must accurately reflect what data types this channel can handle
   * - Must not change during runtime
   */
  readonly supportedDataTypes: readonly string[];

  /**
   * Channel configuration schema
   * 
   * LSP Contract:
   * - Must define all required and optional configuration fields
   * - Must be consistent across all channel instances
   */
  readonly configSchema: Record<string, any>;

  /**
   * Send email using this channel
   * 
   * LSP Contract:
   * - Must accept any valid T data type
   * - Must return ServiceResult<EmailDeliveryResult>
   * - Must not throw exceptions (use ServiceResult.error instead)
   * - Must validate data before sending
   * - Must not strengthen preconditions (all valid T must be accepted)
   * - Must not weaken postconditions (always return ServiceResult)
   */
  send(data: T): Promise<ServiceResult<EmailDeliveryResult>>;

  /**
   * Validate email data for this channel
   * 
   * LSP Contract:
   * - Must accept any T data type
   * - Must return ValidationResult with consistent structure
   * - Must not throw exceptions
   * - All implementations must use same validation criteria for base fields
   * - Can only add validation for channel-specific fields
   */
  validateData(data: T): ValidationResult;

  /**
   * Check if this channel supports a specific data type
   * 
   * LSP Contract:
   * - Must return boolean indicating support
   * - Must not throw exceptions
   * - Must be consistent with supportedDataTypes
   */
  supportsDataType(dataType: string): boolean;

  /**
   * Get channel capabilities and limitations
   * 
   * LSP Contract:
   * - Must return current channel information
   * - Must not throw exceptions
   * - Must be consistent across all instances of same channel type
   */
  getChannelInfo(): EmailChannelInfo;
}

/**
 * Email channel information
 */
export interface EmailChannelInfo {
  channelType: string;
  provider: string;
  maxRecipientsPerMessage: number;
  maxMessageSize: number; // bytes
  supportedFormats: ('text' | 'html' | 'template')[];
  rateLimits: {
    messagesPerHour: number;
    messagesPerDay: number;
  };
  features: {
    tracking: boolean;
    templates: boolean;
    attachments: boolean;
    scheduling: boolean;
  };
}

/**
 * Email registry interface following LSP
 * 
 * Manages email channels while maintaining substitutability
 */
export interface IEmailRegistry extends IBaseService {
  /**
   * Register new email channel
   * 
   * LSP Contract:
   * - Must accept any valid IEmailChannel implementation
   * - Must return ServiceResult indicating success/failure
   * - Must not throw exceptions
   * - Must validate channel before registration
   */
  registerChannel<T extends IBaseEmailData>(channel: IEmailChannel<T>): Promise<ServiceResult<void>>;

  /**
   * Get channel by type
   * 
   * LSP Contract:
   * - Returns channel if found, null if not found
   * - Never throws exceptions
   * - Returned channel must be fully substitutable
   */
  getChannel<T extends IBaseEmailData>(channelType: string): Promise<IEmailChannel<T> | null>;

  /**
   * Send email using appropriate channel
   * 
   * LSP Contract:
   * - Must find appropriate channel for data type
   * - Must return ServiceResult with delivery result
   * - Must not throw exceptions
   * - Must validate data before sending
   */
  sendEmail<T extends IBaseEmailData>(data: T): Promise<ServiceResult<EmailDeliveryResult>>;

  /**
   * Get all registered channels
   * 
   * LSP Contract:
   * - Returns array of all registered channels
   * - Returns empty array if no channels registered
   * - Never throws exceptions
   */
  getAllChannels(): Promise<IEmailChannel[]>;

  /**
   * Unregister channel
   * 
   * LSP Contract:
   * - Returns true if channel was found and removed
   * - Returns false if channel was not found
   * - Never throws exceptions
   * - Must be idempotent
   */
  unregisterChannel(channelType: string): Promise<boolean>;
}

/**
 * Specific email data types following LSP
 * 
 * These extend IBaseEmailData without violating LSP by:
 * - Not making base fields optional
 * - Only adding new required fields that are specific to the email type
 * - Maintaining behavioral consistency
 */

export interface WelcomeEmailData extends IBaseEmailData {
  readonly dataType: 'welcome';
  readonly registrationDate: string;
  readonly loginUrl: string;
  readonly unsubscribeUrl: string;
  readonly supportUrl: string;
}

export interface PasswordResetEmailData extends IBaseEmailData {
  readonly dataType: 'passwordReset';
  readonly resetUrl: string;
  readonly expirationTime: string;
  readonly securityUrl: string;
  readonly supportUrl: string;
}

export interface NotificationEmailData extends IBaseEmailData {
  readonly dataType: 'notification';
  readonly subject: string;
  readonly message: string;
  readonly priority: 'low' | 'normal' | 'high' | 'urgent';
  readonly actionUrl?: string;
  readonly actionText?: string;
}

export interface MarketingEmailData extends IBaseEmailData {
  readonly dataType: 'marketing';
  readonly campaignId: string;
  readonly subject: string;
  readonly contentHtml: string;
  readonly unsubscribeUrl: string;
  readonly trackingPixelUrl?: string;
  readonly segmentId?: string;
}

export interface TransactionalEmailData extends IBaseEmailData {
  readonly dataType: 'transactional';
  readonly transactionId: string;
  readonly subject: string;
  readonly templateId: string;
  readonly templateData: Record<string, any>;
  readonly attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  readonly filename: string;
  readonly contentType: string;
  readonly content: Buffer | string;
  readonly size: number;
}

/**
 * Email template interface following LSP
 */
export interface IEmailTemplate {
  readonly templateId: string;
  readonly templateType: string;
  readonly version: string;
  
  /**
   * Render template with data
   * 
   * LSP Contract:
   * - Must accept any valid template data
   * - Must return ServiceResult with rendered content
   * - Must not throw exceptions
   * - Must validate template data before rendering
   */
  render(data: Record<string, any>): ServiceResult<RenderedTemplate>;

  /**
   * Validate template data
   * 
   * LSP Contract:
   * - Must return ValidationResult
   * - Must not throw exceptions
   * - Must validate against template schema
   */
  validateTemplateData(data: Record<string, any>): ValidationResult;
}

export interface RenderedTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
  metadata: Record<string, any>;
}