// @ts-nocheck
import {
  IBaseService,
  ServiceResult,
} from '../../common/interfaces/base-service.interface';

/**
 * User Profile Interface - ISP Compliant
 *
 * This interface follows the Interface Segregation Principle by:
 * - Focusing solely on user profile management
 * - Separating profile concerns from basic user management
 * - Providing specialized interface for profile-related operations
 * - Being easily testable with focused responsibilities
 */

export interface ProfileData {
  bio?: string;
  website?: string;
  location?: string;
  timezone?: string;
  language?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    weeklyDigest: boolean;
  };
  customFields?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  website?: string;
  location?: string;
  timezone?: string;
  language?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  avatarUrl?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    weeklyDigest: boolean;
  };
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AvatarUploadResult {
  avatarUrl: string;
  fileSize: number;
  uploadedAt: Date;
}

/**
 * User Profile Service Interface
 *
 * ISP Contract:
 * - Only contains methods related to user profile management
 * - Does not include basic user CRUD or subscription methods
 * - Clients that only need profile management don't depend on unused methods
 * - Focused on profile-specific operations
 */
export interface IUserProfileService extends IBaseService {
  /**
   * Get user profile
   *
   * ISP Compliance:
   * - Focused solely on profile retrieval
   * - Does not include basic user data
   * - Single responsibility for profile data access
   */
  getProfile(userId: string): Promise<ServiceResult<UserProfile>>;

  /**
   * Update user profile
   *
   * ISP Compliance:
   * - Only handles profile-specific updates
   * - Does not modify basic user information (email, name, role)
   * - Focused on profile data management
   */
  updateProfile(
    userId: string,
    profileData: Partial<ProfileData>,
  ): Promise<ServiceResult<UserProfile>>;

  /**
   * Upload user avatar
   *
   * ISP Compliance:
   * - Specialized method for avatar management
   * - Handles file upload and processing
   * - Profile-specific operation
   */
  uploadAvatar(
    userId: string,
    file: Buffer,
    filename: string,
    mimeType: string,
  ): Promise<ServiceResult<AvatarUploadResult>>;

  /**
   * Delete user avatar
   *
   * ISP Compliance:
   * - Focused on avatar removal
   * - Profile-specific cleanup operation
   * - Single responsibility method
   */
  deleteAvatar(userId: string): Promise<ServiceResult<void>>;

  /**
   * Update profile preferences
   *
   * ISP Compliance:
   * - Specialized method for preference management
   * - Focused on notification and communication settings
   * - Profile-specific operation
   */
  updatePreferences(
    userId: string,
    preferences: Partial<ProfileData['preferences']>,
  ): Promise<ServiceResult<UserProfile>>;

  /**
   * Update social links
   *
   * ISP Compliance:
   * - Specialized method for social media link management
   * - Focused on external profile connections
   * - Profile-specific operation
   */
  updateSocialLinks(
    userId: string,
    socialLinks: Partial<ProfileData['socialLinks']>,
  ): Promise<ServiceResult<UserProfile>>;

  /**
   * Validate profile data
   *
   * ISP Compliance:
   * - Profile-specific validation logic
   * - Does not handle basic user validation
   * - Focused on profile field validation
   */
  validateProfileData(
    profileData: ProfileData,
  ): Promise<ServiceResult<{ isValid: boolean; errors: string[] }>>;

  /**
   * Check if profile is complete
   *
   * ISP Compliance:
   * - Profile-specific completeness check
   * - Useful for onboarding flows
   * - Focused single-purpose method
   */
  isProfileComplete(
    userId: string,
  ): Promise<ServiceResult<{ isComplete: boolean; missingFields: string[] }>>;
}
