/**
 * @deprecated Use UserProfileForm from '@/components/molecules-alianza/UserProfileForm' instead.
 * Will be removed in a future cleanup.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { Checkbox } from '@/components/primitives/ui/checkbox';
import { useTranslations } from '@/context/TranslationsContext';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import type {
  ProfileFormClientOrganismProps,
  ProfileFormClientData,
} from './ProfileFormClientOrganism.types';

/**
 * ProfileFormClientOrganism - Organism Component (ALI-116)
 *
 * A complete profile form for CLIENT role users to update their information.
 * Follows Atomic Design principles as a self-contained feature component.
 *
 * Features:
 * - All basic fields: firstname, lastname, phone, company
 * - CLIENT-specific fields: address, contactPerson
 * - Pre-fills with current user data
 * - Optional contact person (toggled)
 * - API integration with /api/users/profile (PUT)
 * - Loading states
 * - Error and success messages
 *
 * @example
 * ```tsx
 * <ProfileFormClientOrganism
 *   initialData={currentUser}
 *   onSuccess={(data) => console.log('Updated', data)}
 * />
 * ```
 */
export const ProfileFormClientOrganism = React.forwardRef<
  HTMLFormElement,
  ProfileFormClientOrganismProps
>(({ className, initialData, onSuccess, onError }, ref) => {
  const t = useTranslations();
  const [formData, setFormData] = useState<ProfileFormClientData>({
    firstname: initialData?.firstname || '',
    lastname: initialData?.lastname || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
    address: initialData?.address || '',
  });
  const [includeContactPerson, setIncludeContactPerson] = useState(
    !!initialData?.contactPerson,
  );
  const [contactPersonData, setContactPersonData] = useState({
    name: initialData?.contactPerson?.name || '',
    lastname: initialData?.contactPerson?.lastname || '',
    phone: initialData?.contactPerson?.phone || '',
    email: initialData?.contactPerson?.email || '',
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
        address: initialData.address || '',
      });
      if (initialData.contactPerson) {
        setIncludeContactPerson(true);
        setContactPersonData(initialData.contactPerson);
      }
    }
  }, [initialData]);

  const handleChange = (field: keyof ProfileFormClientData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactPersonChange = (field: string, value: string) => {
    setContactPersonData((prev) => ({ ...prev, [field]: value }));
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

      const submitData: ProfileFormClientData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        address: formData.address || undefined,
      };

      // Include contact person if toggled and fields are filled
      if (includeContactPerson) {
        if (
          contactPersonData.name &&
          contactPersonData.lastname &&
          contactPersonData.phone &&
          contactPersonData.email
        ) {
          submitData.contactPerson = contactPersonData;
        }
      }

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
            <Label htmlFor="firstname">
              {t('First Name')}
            </Label>
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
            <Label htmlFor="lastname">
              {t('Last Name')}
            </Label>
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

      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('Main Address')}</h3>

        <div className="space-y-2">
          <Label htmlFor="address">{t('Address')}</Label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            disabled={isLoading}
            placeholder={t('123 Main St, City, State, ZIP')}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={3}
          />
        </div>
      </div>

      {/* Contact Person Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-contact-person"
            checked={includeContactPerson}
            onCheckedChange={(checked) =>
              setIncludeContactPerson(checked as boolean)
            }
            disabled={isLoading}
          />
          <Label
            htmlFor="include-contact-person"
            className="cursor-pointer font-normal"
          >
            {t('Include Contact Person')}
          </Label>
        </div>

        {includeContactPerson && (
          <div className="space-y-4 rounded-lg border p-4">
            <h4 className="font-medium">{t('Contact Person Details')}</h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cp-name">{t('First Name')}</Label>
                <Input
                  id="cp-name"
                  type="text"
                  value={contactPersonData.name}
                  onChange={(e) =>
                    handleContactPersonChange('name', e.target.value)
                  }
                  disabled={isLoading}
                  placeholder={t('Jane')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cp-lastname">{t('Last Name')}</Label>
                <Input
                  id="cp-lastname"
                  type="text"
                  value={contactPersonData.lastname}
                  onChange={(e) =>
                    handleContactPersonChange('lastname', e.target.value)
                  }
                  disabled={isLoading}
                  placeholder={t('Smith')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cp-phone">{t('Phone')}</Label>
                <Input
                  id="cp-phone"
                  type="tel"
                  value={contactPersonData.phone}
                  onChange={(e) =>
                    handleContactPersonChange('phone', e.target.value)
                  }
                  disabled={isLoading}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cp-email">{t('Email')}</Label>
                <Input
                  id="cp-email"
                  type="email"
                  value={contactPersonData.email}
                  onChange={(e) =>
                    handleContactPersonChange('email', e.target.value)
                  }
                  disabled={isLoading}
                  placeholder="jane@example.com"
                />
              </div>
            </div>
          </div>
        )}
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

ProfileFormClientOrganism.displayName = 'ProfileFormClientOrganism';


