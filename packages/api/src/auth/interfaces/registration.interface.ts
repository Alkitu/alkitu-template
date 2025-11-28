import {
  IBaseService,
  ServiceResult,
} from '../../common/interfaces/base-service.interface';

/**
 * Registration Interface - ISP Compliant
 *
 * This interface follows the Interface Segregation Principle by:
 * - Focusing solely on user registration operations
 * - Separating registration from authentication and password management
 * - Providing specialized interface for account creation
 * - Being easily testable with focused responsibilities
 */

export interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  marketingConsent?: boolean;
  referralCode?: string;
  source?: string;
}

export interface RegistrationResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    createdAt: Date;
  };
  verificationToken?: string;
  requiresVerification: boolean;
}

export interface EmailVerificationResult {
  userId: string;
  email: string;
  verifiedAt: Date;
  wasAlreadyVerified: boolean;
}

export interface RegistrationValidation {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  suggestions?: string[];
}

export interface InvitationData {
  email: string;
  invitedBy: string;
  role?: string;
  expiresAt?: Date;
  customMessage?: string;
  metadata?: Record<string, any>;
}

export interface Invitation {
  id: string;
  email: string;
  invitedBy: string;
  role: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expiresAt: Date;
  createdAt: Date;
  acceptedAt?: Date;
  customMessage?: string;
  metadata?: Record<string, any>;
}

/**
 * Registration Service Interface
 *
 * ISP Contract:
 * - Only contains methods related to user registration
 * - Does not include authentication, password reset, or profile management
 * - Clients that only need registration don't depend on unused methods
 * - Focused on account creation and verification
 */
export interface IRegistrationService extends IBaseService {
  /**
   * Register new user
   *
   * ISP Compliance:
   * - Focused solely on user account creation
   * - Does not handle authentication or profile setup
   * - Single responsibility for registration
   */
  registerUser(
    registrationData: RegistrationData,
  ): Promise<ServiceResult<RegistrationResult>>;

  /**
   * Verify email address
   *
   * ISP Compliance:
   * - Focused on email verification process
   * - Registration-specific operation
   * - Does not handle password or profile changes
   */
  verifyEmail(
    verificationToken: string,
  ): Promise<ServiceResult<EmailVerificationResult>>;

  /**
   * Resend verification email
   *
   * ISP Compliance:
   * - Specialized method for verification email resending
   * - Registration-specific operation
   * - Focused on verification workflow
   */
  resendVerificationEmail(email: string): Promise<ServiceResult<void>>;

  /**
   * Validate registration data
   *
   * ISP Compliance:
   * - Registration-specific validation logic
   * - Does not handle authentication validation
   * - Focused on registration field validation
   */
  validateRegistrationData(
    registrationData: RegistrationData,
  ): Promise<ServiceResult<RegistrationValidation>>;

  /**
   * Check if email is available for registration
   *
   * ISP Compliance:
   * - Registration-specific availability check
   * - Focused on registration workflow
   * - Single-purpose validation method
   */
  isEmailAvailable(email: string): Promise<ServiceResult<boolean>>;

  /**
   * Send invitation to register
   *
   * ISP Compliance:
   * - Specialized method for invitation-based registration
   * - Registration-specific operation
   * - Focused on invitation workflow
   */
  sendInvitation(
    invitationData: InvitationData,
  ): Promise<ServiceResult<Invitation>>;

  /**
   * Accept invitation and register
   *
   * ISP Compliance:
   * - Focused on invitation acceptance flow
   * - Registration-specific operation
   * - Combines invitation acceptance with registration
   */
  acceptInvitation(
    invitationToken: string,
    registrationData: Omit<RegistrationData, 'email'>,
  ): Promise<ServiceResult<RegistrationResult>>;

  /**
   * Get invitation details
   *
   * ISP Compliance:
   * - Focused on invitation information retrieval
   * - Registration-specific data access
   * - Does not include user or profile data
   */
  getInvitation(invitationToken: string): Promise<ServiceResult<Invitation>>;

  /**
   * Cancel invitation
   *
   * ISP Compliance:
   * - Focused on invitation cancellation
   * - Registration-specific operation
   * - Does not affect existing users
   */
  cancelInvitation(invitationId: string): Promise<ServiceResult<void>>;

  /**
   * Get pending invitations for an inviter
   *
   * ISP Compliance:
   * - Registration-specific data retrieval
   * - Focused on invitation management
   * - Does not include user management data
   */
  getPendingInvitations(
    inviterId: string,
  ): Promise<ServiceResult<Invitation[]>>;
}
