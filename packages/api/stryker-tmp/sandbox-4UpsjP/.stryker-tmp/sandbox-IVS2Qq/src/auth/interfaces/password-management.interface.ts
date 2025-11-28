// @ts-nocheck
// 
import { IBaseService, ServiceResult } from '../../common/interfaces/base-service.interface';

/**
 * Password Management Interface - ISP Compliant
 * 
 * This interface follows the Interface Segregation Principle by:
 * - Focusing solely on password-related operations
 * - Separating password management from authentication and registration
 * - Providing specialized interface for password operations
 * - Being easily testable with focused responsibilities
 */

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email: string;
  clientInfo?: {
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
  };
}

export interface PasswordResetData {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetResult {
  userId: string;
  email: string;
  resetAt: Date;
  requiresReauth: boolean;
}

export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  forbiddenPasswords: string[];
  forbidCommonPasswords: boolean;
  forbidPersonalInfo: boolean;
  maxRepeatingChars: number;
  passwordHistory: number; // Number of previous passwords to check against
}

export interface PasswordValidation {
  isValid: boolean;
  score: number; // 0-100
  strength: 'very_weak' | 'weak' | 'fair' | 'good' | 'strong';
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface PasswordHistory {
  id: string;
  userId: string;
  passwordHash: string;
  createdAt: Date;
  replacedAt?: Date;
}

/**
 * Password Management Service Interface
 * 
 * ISP Contract:
 * - Only contains methods related to password management
 * - Does not include authentication, registration, or user management
 * - Clients that only need password operations don't depend on unused methods
 * - Focused on password-specific operations
 */
export interface IPasswordManagementService extends IBaseService {
  /**
   * Change user password
   * 
   * ISP Compliance:
   * - Focused solely on password change operation
   * - Does not handle profile or account changes
   * - Single responsibility for password update
   */
  changePassword(userId: string, passwordData: PasswordChangeData): Promise<ServiceResult<void>>;

  /**
   * Request password reset
   * 
   * ISP Compliance:
   * - Focused on password reset initiation
   * - Password-specific operation
   * - Does not handle account recovery or profile changes
   */
  requestPasswordReset(resetRequest: PasswordResetRequest): Promise<ServiceResult<void>>;

  /**
   * Reset password using reset token
   * 
   * ISP Compliance:
   * - Focused on password reset completion
   * - Password-specific operation
   * - Single responsibility for password restoration
   */
  resetPassword(resetData: PasswordResetData): Promise<ServiceResult<PasswordResetResult>>;

  /**
   * Validate password against policy
   * 
   * ISP Compliance:
   * - Password-specific validation logic
   * - Focused on password strength and policy compliance
   * - Single-purpose validation method
   */
  validatePassword(password: string, userId?: string): Promise<ServiceResult<PasswordValidation>>;

  /**
   * Get password policy
   * 
   * ISP Compliance:
   * - Focused on password policy retrieval
   * - Password-specific configuration access
   * - Does not include other security policies
   */
  getPasswordPolicy(): Promise<ServiceResult<PasswordPolicy>>;

  /**
   * Update password policy (admin only)
   * 
   * ISP Compliance:
   * - Specialized method for policy management
   * - Password-specific configuration
   * - Focused on password rules administration
   */
  updatePasswordPolicy(policy: Partial<PasswordPolicy>): Promise<ServiceResult<PasswordPolicy>>;

  /**
   * Check if password has been compromised
   * 
   * ISP Compliance:
   * - Password-specific security check
   * - Focused on password compromise detection
   * - Single-purpose security validation
   */
  checkPasswordCompromise(password: string): Promise<ServiceResult<{ isCompromised: boolean; breachCount?: number }>>;

  /**
   * Get password history for user
   * 
   * ISP Compliance:
   * - Password-specific history retrieval
   * - Focused on password change audit trail
   * - Does not include general user activity
   */
  getPasswordHistory(userId: string): Promise<ServiceResult<PasswordHistory[]>>;

  /**
   * Force password change (admin only)
   * 
   * ISP Compliance:
   * - Specialized method for administrative password management
   * - Password-specific administrative operation
   * - Focused on password security enforcement
   */
  forcePasswordChange(userId: string, reason?: string): Promise<ServiceResult<void>>;

  /**
   * Validate reset token
   * 
   * ISP Compliance:
   * - Password-specific token validation
   * - Focused on reset workflow validation
   * - Single-purpose security check
   */
  validateResetToken(resetToken: string): Promise<ServiceResult<{ isValid: boolean; userId?: string; expiresAt?: Date }>>;

  /**
   * Generate secure password suggestion
   * 
   * ISP Compliance:
   * - Password-specific utility method
   * - Focused on password generation
   * - Single-purpose helper method
   */
  generateSecurePassword(length?: number, includeSymbols?: boolean): Promise<ServiceResult<{ password: string; strength: PasswordValidation }>>;

  /**
   * Bulk password policy check (admin only)
   * 
   * ISP Compliance:
   * - Specialized method for administrative password auditing
   * - Password-specific bulk operation
   * - Focused on security compliance checking
   */
  auditPasswordCompliance(): Promise<ServiceResult<{ usersWithWeakPasswords: string[]; usersNeedingPasswordChange: string[] }>>;
}