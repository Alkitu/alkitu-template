/**
 * Email Types and Interfaces
 *
 * Centralized type definitions for the email system
 */

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface BaseEmailData {
  userName: string;
  userEmail: string;
  supportUrl: string;
}

export interface WelcomeEmailData extends BaseEmailData {
  registrationDate: string;
  loginUrl: string;
  unsubscribeUrl: string;
}

export interface PasswordResetEmailData extends BaseEmailData {
  resetUrl: string;
  securityUrl: string;
}

export interface EmailVerificationData extends BaseEmailData {
  verificationUrl: string;
}

export interface NotificationEmailData extends BaseEmailData {
  subject: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
}

export interface MarketingEmailData extends BaseEmailData {
  campaignName: string;
  contentHtml: string;
  unsubscribeUrl: string;
  trackingPixelUrl?: string;
}

export interface BillingEmailData extends BaseEmailData {
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paymentUrl: string;
  invoiceUrl: string;
}

export interface SecurityEmailData extends BaseEmailData {
  alertType:
    | 'login'
    | 'password_change'
    | 'suspicious_activity'
    | 'account_locked';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  actionUrl?: string;
}

/**
 * Union type for all possible email data types
 */
export type EmailData =
  | WelcomeEmailData
  | PasswordResetEmailData
  | EmailVerificationData
  | NotificationEmailData
  | MarketingEmailData
  | BillingEmailData
  | SecurityEmailData;

/**
 * Email channel configuration
 */
export interface EmailChannelConfig {
  enabled: boolean;
  priority?: number;
  retryAttempts?: number;
  timeout?: number;
}
