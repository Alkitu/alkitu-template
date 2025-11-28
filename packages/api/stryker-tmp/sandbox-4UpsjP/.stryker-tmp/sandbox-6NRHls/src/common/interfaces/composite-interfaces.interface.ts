/**
 * Composite Interfaces - ISP Compliant
 * 
 * These interfaces combine segregated interfaces for clients that need multiple functionalities.
 * This follows ISP by:
 * - Providing convenience interfaces for common use cases
 * - Allowing clients to depend only on what they need
 * - Using composition instead of large monolithic interfaces
 * - Maintaining the ability to use individual interfaces when needed
 */
// @ts-nocheck

// 


// User-related composite interfaces
import { IUserManagementService } from '../../users/interfaces/user-management.interface';
import { IUserProfileService } from '../../users/interfaces/user-profile.interface';
import { IUserSubscriptionService } from '../../users/interfaces/user-subscription.interface';
import { IUserAnalyticsService } from '../../users/interfaces/user-analytics.interface';

// Auth-related composite interfaces
import { IAuthenticationService } from '../../auth/interfaces/authentication.interface';
import { IRegistrationService } from '../../auth/interfaces/registration.interface';
import { IPasswordManagementService } from '../../auth/interfaces/password-management.interface';

// Email-related composite interfaces
import { IEmailSendingService } from '../../email/interfaces/email-sending.interface';
import { IEmailTemplatesService } from '../../email/interfaces/email-templates.interface';
import { IEmailAnalyticsService } from '../../email/interfaces/email-analytics.interface';

/**
 * Complete User Service Composite
 * 
 * ISP Compliance:
 * - Combines all user-related interfaces
 * - Used by clients that need full user functionality
 * - Clients can still use individual interfaces if they only need specific functionality
 */
export interface ICompleteUserService extends 
  IUserManagementService,
  IUserProfileService,
  IUserSubscriptionService,
  IUserAnalyticsService {
  // Composite interface - no additional methods
  // All functionality comes from composed interfaces
}

/**
 * User Management + Profile Composite
 * 
 * ISP Compliance:
 * - Common combination for user management workflows
 * - Excludes subscription and analytics for lighter dependency
 * - Clients that don't need subscription/analytics can use this
 */
export interface IUserManagementAndProfileService extends 
  IUserManagementService,
  IUserProfileService {
  // Composite interface - no additional methods
}

/**
 * Complete Auth Service Composite
 * 
 * ISP Compliance:
 * - Combines all authentication-related interfaces
 * - Used by clients that need full auth functionality
 * - Individual interfaces still available for specific needs
 */
export interface ICompleteAuthService extends 
  IAuthenticationService,
  IRegistrationService,
  IPasswordManagementService {
  // Composite interface - no additional methods
}

/**
 * Basic Auth Service Composite
 * 
 * ISP Compliance:
 * - Common combination for basic auth workflows
 * - Excludes password management for lighter dependency
 * - Used by clients that only need login/registration
 */
export interface IBasicAuthService extends 
  IAuthenticationService,
  IRegistrationService {
  // Composite interface - no additional methods
}

/**
 * Auth + Password Management Composite
 * 
 * ISP Compliance:
 * - Common combination for user account management
 * - Excludes registration for existing user workflows
 * - Used by account settings and security features
 */
export interface IAuthAndPasswordService extends 
  IAuthenticationService,
  IPasswordManagementService {
  // Composite interface - no additional methods
}

/**
 * Complete Email Service Composite
 * 
 * ISP Compliance:
 * - Combines all email-related interfaces
 * - Used by clients that need full email functionality
 * - Individual interfaces still available for specific needs
 */
export interface ICompleteEmailService extends 
  IEmailSendingService,
  IEmailTemplatesService,
  IEmailAnalyticsService {
  // Composite interface - no additional methods
}

/**
 * Email Sending + Templates Composite
 * 
 * ISP Compliance:
 * - Common combination for email campaign workflows
 * - Excludes analytics for lighter dependency
 * - Used by clients that send templated emails but don't need analytics
 */
export interface IEmailSendingAndTemplatesService extends 
  IEmailSendingService,
  IEmailTemplatesService {
  // Composite interface - no additional methods
}

/**
 * Email Templates + Analytics Composite
 * 
 * ISP Compliance:
 * - Common combination for email optimization workflows
 * - Excludes sending for content management and analysis
 * - Used by marketing teams optimizing email content
 */
export interface IEmailTemplatesAndAnalyticsService extends 
  IEmailTemplatesService,
  IEmailAnalyticsService {
  // Composite interface - no additional methods
}

/**
 * Email Sending + Analytics Composite
 * 
 * ISP Compliance:
 * - Common combination for simple email + tracking workflows
 * - Excludes templates for clients using external template systems
 * - Used by transactional email services with basic analytics
 */
export interface IEmailSendingAndAnalyticsService extends 
  IEmailSendingService,
  IEmailAnalyticsService {
  // Composite interface - no additional methods
}

/**
 * ISP Usage Examples:
 * 
 * // Client that only needs user management - uses specific interface
 * class UserAdminController {
 *   constructor(private userService: IUserManagementService) {}
 * }
 * 
 * // Client that needs user management + profiles - uses lightweight composite
 * class UserProfileController {
 *   constructor(private userService: IUserManagementAndProfileService) {}
 * }
 * 
 * // Client that needs full user functionality - uses complete composite
 * class UserDashboardService {
 *   constructor(private userService: ICompleteUserService) {}
 * }
 * 
 * // Client that only needs email sending - uses specific interface
 * class NotificationService {
 *   constructor(private emailService: IEmailSendingService) {}
 * }
 * 
 * // Client that manages email campaigns - uses sending + templates
 * class CampaignService {
 *   constructor(private emailService: IEmailSendingAndTemplatesService) {}
 * }
 * 
 * // Client that analyzes email performance - uses templates + analytics
 * class EmailOptimizationService {
 *   constructor(private emailService: IEmailTemplatesAndAnalyticsService) {}
 * }
 */

/**
 * Interface Aggregation Utility Types
 * 
 * These types help with dependency injection and service composition
 */

export type UserServiceComponents = {
  userManagement: IUserManagementService;
  userProfile: IUserProfileService;
  userSubscription: IUserSubscriptionService;
  userAnalytics: IUserAnalyticsService;
};

export type AuthServiceComponents = {
  authentication: IAuthenticationService;
  registration: IRegistrationService;
  passwordManagement: IPasswordManagementService;
};

export type EmailServiceComponents = {
  emailSending: IEmailSendingService;
  emailTemplates: IEmailTemplatesService;
  emailAnalytics: IEmailAnalyticsService;
};

/**
 * Service Factory Types for Dependency Injection
 * 
 * These help create services that implement multiple interfaces
 */

export interface ServiceFactory {
  createUserService(components: Partial<UserServiceComponents>): ICompleteUserService;
  createAuthService(components: Partial<AuthServiceComponents>): ICompleteAuthService;
  createEmailService(components: Partial<EmailServiceComponents>): ICompleteEmailService;
}

/**
 * ISP Compliance Checker Types
 * 
 * These utility types help ensure ISP compliance during development
 */

// Checks if a client type uses all methods of an interface (should be >80% for good ISP compliance)
export type InterfaceUsageAnalysis<TClient, TInterface> = {
  clientType: TClient;
  interfaceType: TInterface;
  // This would be implemented by static analysis tools
  // to ensure clients use most methods of their dependent interfaces
};