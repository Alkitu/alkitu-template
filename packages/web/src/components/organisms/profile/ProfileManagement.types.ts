import type { UserRole } from '@alkitu/shared';

/**
 * ProfileManagement Types
 *
 * Type definitions for the ProfileManagement organism component.
 */

export interface ContactPerson {
  name: string;
  lastname: string;
  phone: string;
  email: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  company?: string;
  address?: string;
  contactPerson?: ContactPerson;
  role: UserRole;
}

export interface TabLabels {
  info: string;
  security: string;
  preferences: string;
  locations?: string;
}

export interface ProfileManagementProps {
  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Tab labels for internationalization
   */
  tabLabels: TabLabels;

  /**
   * Callback when profile is successfully updated
   */
  onProfileUpdated?: () => void;

  /**
   * Callback when password is successfully changed
   */
  onPasswordChanged?: () => void;

  /**
   * Callback when preferences are updated
   */
  onPreferencesUpdated?: () => void;
}

export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  marketingEmails: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}
