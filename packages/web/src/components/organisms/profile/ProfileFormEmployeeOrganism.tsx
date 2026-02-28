/**
 * @deprecated Use UserProfileForm from '@/components/molecules-alianza/UserProfileForm' instead.
 * Will be removed in a future cleanup.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { useTranslations } from '@/context/TranslationsContext';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import type {
  ProfileFormEmployeeOrganismProps,
  ProfileFormEmployeeData,
} from './ProfileFormEmployeeOrganism.types';

/**
 * ProfileFormEmployeeOrganism - Organism Component (ALI-116)
 *
 * A simplified profile form for EMPLOYEE/ADMIN role users to update their information.
 * Does NOT include address or contactPerson fields (CLIENT-only).
 *
 * Features:
 * - Basic fields: firstname, lastname, phone, company
 * - Pre-fills with current user data
 * - API integration with /api/users/profile (PUT)
 * - Loading states
 * - Error and success messages
 *
 * @example
 * ```tsx
 * <ProfileFormEmployeeOrganism
 *   initialData={currentUser}
 *   onSuccess={(data) => console.log('Updated', data)}
 * />
 * ```
 */
export const ProfileFormEmployeeOrganism = React.forwardRef<
  HTMLFormElement,
  ProfileFormEmployeeOrganismProps
>(({ className, initialData, onSuccess, onError }, ref) => {
  const t = useTranslations();
  const [formData, setFormData] = useState<ProfileFormEmployeeData>({
    firstname: initialData?.firstname || '',
    lastname: initialData?.lastname || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        firstname: initialData.firstname || '',
        lastname: initialData.lastname || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
      });
    }
  }, [initialData]);

  const handleChange = (
    field: keyof ProfileFormEmployeeData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.firstname || !formData.lastname) {
        setError(t('First name and last name are required'));
        setIsLoading(false);
        return;
      }

      const submitData: ProfileFormEmployeeData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
      };

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess(t('Profile updated successfully'));
      if (onSuccess) {
        onSuccess(submitData);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className || ''}`}
    >
      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}

      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('Basic Information')}</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstname">{t('First Name')}</Label>
            <Input
              id="firstname"
              type="text"
              value={formData.firstname}
              onChange={(e) => handleChange('firstname', e.target.value)}
              required
              disabled={isLoading}
              placeholder={t('John')}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastname">{t('Last Name')}</Label>
            <Input
              id="lastname"
              type="text"
              value={formData.lastname}
              onChange={(e) => handleChange('lastname', e.target.value)}
              required
              disabled={isLoading}
              placeholder={t('Doe')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">{t('Phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={isLoading}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">{t('Company')}</Label>
            <Input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              disabled={isLoading}
              placeholder={t('Acme Inc.')}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="min-w-[150px]">
          {isLoading ? t('Saving...') : t('Save Changes')}
        </Button>
      </div>
    </form>
  );
});

ProfileFormEmployeeOrganism.displayName = 'ProfileFormEmployeeOrganism';
