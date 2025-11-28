// @ts-nocheck
import {
  IBaseService,
  ServiceResult,
} from '../../common/interfaces/base-service.interface';

/**
 * Authentication Interface - ISP Compliant
 *
 * This interface follows the Interface Segregation Principle by:
 * - Focusing solely on user authentication operations
 * - Separating authentication from registration and password management
 * - Providing specialized interface for login/logout operations
 * - Being easily testable with focused responsibilities
 */

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceId?: string;
  userAgent?: string;
}

export interface AuthenticationResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  sessionId: string;
  lastLoginAt: Date;
}

export interface SessionInfo {
  sessionId: string;
  userId: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  lastActiveAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface AuthenticationAttempt {
  id: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  failureReason?: string;
  timestamp: Date;
  blocked: boolean;
}

/**
 * Authentication Service Interface
 *
 * ISP Contract:
 * - Only contains methods related to user authentication
 * - Does not include registration, password reset, or user management
 * - Clients that only need authentication don't depend on unused methods
 * - Focused on login/logout operations
 */
export interface IAuthenticationService extends IBaseService {
  /**
   * Authenticate user with credentials
   *
   * ISP Compliance:
   * - Focused solely on credential validation and session creation
   * - Does not handle registration or password reset
   * - Single responsibility for authentication
   */
  authenticate(
    credentials: LoginCredentials,
  ): Promise<ServiceResult<AuthenticationResult>>;

  /**
   * Logout user and invalidate session
   *
   * ISP Compliance:
   * - Focused on session termination
   * - Does not handle account deletion or profile changes
   * - Single responsibility for logout
   */
  logout(sessionId: string): Promise<ServiceResult<void>>;

  /**
   * Logout user from all devices
   *
   * ISP Compliance:
   * - Specialized method for multi-device logout
   * - Authentication-specific operation
   * - Focused on session management
   */
  logoutAllDevices(userId: string): Promise<ServiceResult<void>>;

  /**
   * Validate session
   *
   * ISP Compliance:
   * - Focused on session validation
   * - Authentication-specific operation
   * - Does not modify user or profile data
   */
  validateSession(sessionId: string): Promise<ServiceResult<SessionInfo>>;

  /**
   * Refresh authentication token
   *
   * ISP Compliance:
   * - Specialized method for token renewal
   * - Authentication-specific operation
   * - Focused on session extension
   */
  refreshToken(
    refreshToken: string,
  ): Promise<ServiceResult<{ accessToken: string; expiresIn: number }>>;

  /**
   * Get active sessions for user
   *
   * ISP Compliance:
   * - Focused on session listing
   * - Authentication-specific data retrieval
   * - Does not include user profile or activity data
   */
  getActiveSessions(userId: string): Promise<ServiceResult<SessionInfo[]>>;

  /**
   * Terminate specific session
   *
   * ISP Compliance:
   * - Focused on specific session termination
   * - Authentication-specific operation
   * - Does not affect other user data
   */
  terminateSession(
    userId: string,
    sessionId: string,
  ): Promise<ServiceResult<void>>;

  /**
   * Check if user is currently authenticated
   *
   * ISP Compliance:
   * - Simple authentication status check
   * - Focused single-purpose method
   * - Authentication-specific validation
   */
  isAuthenticated(userId: string): Promise<ServiceResult<boolean>>;

  /**
   * Get authentication attempts history
   *
   * ISP Compliance:
   * - Focused on authentication audit trail
   * - Authentication-specific logging
   * - Does not include general user activity
   */
  getAuthenticationAttempts(
    userId: string,
    limit?: number,
  ): Promise<ServiceResult<AuthenticationAttempt[]>>;
}
