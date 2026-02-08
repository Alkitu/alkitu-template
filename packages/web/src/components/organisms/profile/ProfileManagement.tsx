'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/ui/tabs';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/Input';
import { Label } from '@/components/primitives/ui/label';
import { Switch } from '@/components/primitives/ui/switch';
import { useTranslations } from '@/context/TranslationsContext';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import {
  ProfileFormClientOrganism,
  ProfileFormEmployeeOrganism,
} from '@/components/organisms/profile';
import type {
  ProfileManagementProps,
  UserProfile,
  PasswordChangeFormData,
  UserPreferences,
} from './ProfileManagement.types';

/**
 * ProfileManagement - Organism Component
 *
 * A comprehensive profile management interface with tabbed navigation.
 * Consolidates all profile-related functionality in one component.
 *
 * Features:
 * - Tabbed interface (Profile Info, Security, Preferences)
 * - Role-based profile forms (CLIENT vs EMPLOYEE/ADMIN)
 * - Password change functionality
 * - User preferences management
 * - Data fetching with loading states
 * - Error handling
 * - Internationalization support
 *
 * @example
 * ```tsx
 * <ProfileManagement
 *   tabLabels={{
 *     info: 'Profile Information',
 *     security: 'Security',
 *     preferences: 'Preferences'
 *   }}
 *   onProfileUpdated={() => console.log('Profile updated')}
 * />
 * ```
 */
export const ProfileManagement = React.forwardRef<HTMLDivElement, ProfileManagementProps>(
  (
    {
      className,
      tabLabels,
      onProfileUpdated,
      onPasswordChanged,
      onPreferencesUpdated,
    },
    ref
  ) => {
    const t = useTranslations();
    const router = useRouter();

    // User profile state
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Password change state
    const [passwordData, setPasswordData] = useState<PasswordChangeFormData>({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    // Preferences state
    const [preferences, setPreferences] = useState<UserPreferences>({
      emailNotifications: true,
      marketingEmails: false,
      theme: 'system',
      language: 'en',
    });
    const [preferencesError, setPreferencesError] = useState('');
    const [preferencesSuccess, setPreferencesSuccess] = useState('');
    const [isPreferencesLoading, setIsPreferencesLoading] = useState(false);

    // Fetch user profile on mount
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await fetch('/api/users/profile');

          if (!response.ok) {
            if (response.status === 401) {
              router.push('/auth/login');
              return;
            }
            throw new Error('Failed to fetch profile');
          }

          const data = await response.json();
          setUser(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          console.error('Failed to fetch profile:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }, [router]);

    // Handle profile update success
    const handleProfileSuccess = () => {
      if (onProfileUpdated) {
        onProfileUpdated();
      }
      // Navigate to role-appropriate dashboard after update
      setTimeout(() => {
        const dashboardPath =
          user?.role === 'CLIENT' ? '/dashboard' : '/admin/dashboard';
        router.push(dashboardPath);
      }, 2000);
    };

    // Handle password change
    const handlePasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsPasswordLoading(true);
      setPasswordError('');
      setPasswordSuccess('');

      try {
        // Validate passwords match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setPasswordError(t('Passwords do not match'));
          setIsPasswordLoading(false);
          return;
        }

        // Validate password strength (minimum 8 characters)
        if (passwordData.newPassword.length < 8) {
          setPasswordError(t('Password must be at least 8 characters long'));
          setIsPasswordLoading(false);
          return;
        }

        const response = await fetch('/api/users/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to change password');
        }

        setPasswordSuccess(t('Password changed successfully'));
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        if (onPasswordChanged) {
          onPasswordChanged();
        }

        // Clear success message after 3 seconds
        setTimeout(() => {
          setPasswordSuccess('');
        }, 3000);
      } catch (err: any) {
        setPasswordError(err.message || 'An error occurred');
      } finally {
        setIsPasswordLoading(false);
      }
    };

    // Handle preferences update
    const handlePreferencesUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsPreferencesLoading(true);
      setPreferencesError('');
      setPreferencesSuccess('');

      try {
        const response = await fetch('/api/users/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferences),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update preferences');
        }

        setPreferencesSuccess(t('Preferences updated successfully'));

        if (onPreferencesUpdated) {
          onPreferencesUpdated();
        }

        // Clear success message after 3 seconds
        setTimeout(() => {
          setPreferencesSuccess('');
        }, 3000);
      } catch (err: any) {
        setPreferencesError(err.message || 'An error occurred');
      } finally {
        setIsPreferencesLoading(false);
      }
    };

    // Loading state
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={`flex items-center justify-center py-12 ${className || ''}`}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">{t('Loading profile...')}</p>
          </div>
        </div>
      );
    }

    // Error state
    if (error || !user) {
      return (
        <div
          ref={ref}
          className={`flex items-center justify-center py-12 ${className || ''}`}
        >
          <div className="text-center">
            <p className="text-destructive">{error || t('Failed to load profile')}</p>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={className}>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">{tabLabels.info}</TabsTrigger>
            <TabsTrigger value="security">{tabLabels.security}</TabsTrigger>
            <TabsTrigger value="preferences">{tabLabels.preferences}</TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="info" className="mt-6">
            <div className="bg-card rounded-lg shadow-sm border p-6">
              {user.role === 'CLIENT' ? (
                <ProfileFormClientOrganism
                  initialData={{
                    firstname: user.firstname,
                    lastname: user.lastname,
                    phone: user.phone,
                    company: user.company,
                    address: user.address,
                    contactPerson: user.contactPerson,
                  }}
                  onSuccess={handleProfileSuccess}
                />
              ) : (
                <ProfileFormEmployeeOrganism
                  initialData={{
                    firstname: user.firstname,
                    lastname: user.lastname,
                    phone: user.phone,
                    company: user.company,
                  }}
                  onSuccess={handleProfileSuccess}
                />
              )}
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              <p>
                <strong>{t('Note')}:</strong> {t('Your email address cannot be changed for security reasons. If you need to update your email, please contact support.')}
              </p>
              {user.role === 'CLIENT' && (
                <p className="mt-2">
                  {t('As a')} <strong>{t('Client')}</strong>, {t('you can also update your main address and contact person details.')}.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6">
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">{t('Change Password')}</h3>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                {passwordError && <FormError message={passwordError} />}
                {passwordSuccess && <FormSuccess message={passwordSuccess} />}

                <div className="space-y-2">
                  <Label htmlFor="current-password">{t('Current Password')}</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    required
                    disabled={isPasswordLoading}
                    placeholder={t('Enter your current password')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('New Password')}</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    required
                    disabled={isPasswordLoading}
                    placeholder={t('Enter your new password')}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('Must be at least 8 characters long')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('Confirm New Password')}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                    disabled={isPasswordLoading}
                    placeholder={t('Confirm your new password')}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isPasswordLoading}
                    className="min-w-[150px]"
                  >
                    {isPasswordLoading ? t('Changing...') : t('Change Password')}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="mt-6">
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">{t('User Preferences')}</h3>

              <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                {preferencesError && <FormError message={preferencesError} />}
                {preferencesSuccess && <FormSuccess message={preferencesSuccess} />}

                {/* Notifications Section */}
                <div className="space-y-4">
                  <h4 className="font-medium">{t('Notifications')}</h4>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">
                        {t('Email Notifications')}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t('Receive notifications about your account activity')}
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({
                          ...prev,
                          emailNotifications: checked,
                        }))
                      }
                      disabled={isPreferencesLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">{t('Marketing Emails')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('Receive emails about new features and updates')}
                      </p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={preferences.marketingEmails}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({
                          ...prev,
                          marketingEmails: checked,
                        }))
                      }
                      disabled={isPreferencesLoading}
                    />
                  </div>
                </div>

                {/* Appearance Section */}
                <div className="space-y-4">
                  <h4 className="font-medium">{t('Appearance')}</h4>

                  <div className="space-y-2">
                    <Label htmlFor="theme">{t('Theme')}</Label>
                    <select
                      id="theme"
                      value={preferences.theme}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          theme: e.target.value as 'light' | 'dark' | 'system',
                        }))
                      }
                      disabled={isPreferencesLoading}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="light">{t('Light')}</option>
                      <option value="dark">{t('Dark')}</option>
                      <option value="system">{t('System')}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">{t('Language')}</Label>
                    <select
                      id="language"
                      value={preferences.language}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                      disabled={isPreferencesLoading}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="en">{t('English')}</option>
                      <option value="es">{t('Spanish')}</option>
                      <option value="fr">{t('French')}</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isPreferencesLoading}
                    className="min-w-[150px]"
                  >
                    {isPreferencesLoading
                      ? t('Saving...')
                      : t('Save Preferences')}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
);

ProfileManagement.displayName = 'ProfileManagement';
