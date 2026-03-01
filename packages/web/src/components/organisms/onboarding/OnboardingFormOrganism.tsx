'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { Checkbox } from '@/components/primitives/ui/checkbox';
import { useTranslations } from '@/context/TranslationsContext';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { LocationFormOrganism } from '@/components/organisms/location';
import type { LocationFormImperativeHandle } from '@/components/organisms/location';
import type {
  OnboardingFormOrganismProps,
  OnboardingFormData,
} from './OnboardingFormOrganism.types';

/**
 * OnboardingFormOrganism - Organism Component (ALI-115)
 *
 * A complete onboarding form organism that collects additional user profile information.
 * Follows Atomic Design principles as a self-contained feature component.
 *
 * Features:
 * - Phone number input (required for OAuth users)
 * - Company name input
 * - Structured work location form (LocationFormOrganism in onboarding mode)
 * - Contact person details (optional, toggled)
 * - Skip option (user can complete later)
 * - API integration: creates WorkLocation + completes profile
 * - Loading states
 * - Error and success messages
 * - Automatic redirect to dashboard after completion
 *
 * UX Flow:
 * 1. User registers with minimal fields (email, password, firstname, lastname)
 * 2. After email verification and login, user is redirected here
 * 3. User can either complete additional fields or skip
 * 4. On completion, profileComplete flag is set to true
 * 5. User is redirected to dashboard
 */
export const OnboardingFormOrganism = React.forwardRef<
  HTMLFormElement,
  OnboardingFormOrganismProps
>(({ className, onComplete, onSkip, isOAuthUser = false }, ref) => {
  const t = useTranslations();
  const { redirectAfterLogin } = useAuthRedirect();
  const locationFormRef = useRef<LocationFormImperativeHandle>(null);

  const [formData, setFormData] = useState<OnboardingFormData>({
    phone: '',
    company: '',
  });
  const [includeContactPerson, setIncludeContactPerson] = useState(false);
  const [contactPersonData, setContactPersonData] = useState({
    name: '',
    lastname: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof OnboardingFormData, value: string) => {
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
      // Validate phone for OAuth users
      if (isOAuthUser && !formData.phone?.trim()) {
        setError(t('auth.onboarding.phoneRequired'));
        setIsLoading(false);
        return;
      }

      // Step 1: Create WorkLocation via LocationFormOrganism
      const location = await locationFormRef.current?.submit();
      if (!location) {
        setError(t('auth.onboarding.locationError'));
        setIsLoading(false);
        return;
      }

      // Step 2: Complete profile with remaining data
      const submitData: OnboardingFormData = {
        phone: formData.phone || undefined,
        company: formData.company || undefined,
      };

      // Include contact person if toggled
      if (includeContactPerson) {
        if (
          !contactPersonData.name ||
          !contactPersonData.lastname ||
          !contactPersonData.phone ||
          !contactPersonData.email
        ) {
          setError(t('auth.onboarding.contactPersonRequired'));
          setIsLoading(false);
          return;
        }
        submitData.contactPerson = contactPersonData;
      }

      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete profile');
      }

      setSuccess(t('auth.onboarding.success'));

      if (onComplete) {
        onComplete();
      }

      // Redirect to role-specific dashboard after a short delay
      setTimeout(() => {
        redirectAfterLogin({
          profileComplete: true,
          role: data.user?.role,
        });
      }, 1500);
    } catch (err: any) {
      setError(err.message || t('auth.onboarding.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Call API to mark profile as complete (even when skipping)
      // This ensures profileComplete=true is set in database
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty object - user skipped, no additional data
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete profile');
      }

      if (onSkip) {
        onSkip();
      }

      // Redirect to role-specific dashboard after a short delay
      setTimeout(() => {
        redirectAfterLogin({
          profileComplete: true,
          role: data.user?.role,
        });
      }, 1500);
    } catch (err: any) {
      setError(err.message || t('auth.onboarding.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {t('auth.onboarding.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('auth.onboarding.subtitle')}
        </p>
      </div>

      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={className || 'space-y-6'}
      >
        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            {isOAuthUser
              ? t('auth.onboarding.phone').replace(' (optional)', '').replace(' (opcional)', '')
              : t('auth.onboarding.phone')}
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 123 456 7890"
            disabled={isLoading}
            required={isOAuthUser}
          />
          {isOAuthUser && (
            <p className="text-xs text-muted-foreground">
              {t('auth.onboarding.phoneRequired')}
            </p>
          )}
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company">{t('auth.onboarding.company')}</Label>
          <Input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="Acme Inc."
            disabled={isLoading}
          />
        </div>

        {/* Work Location Section */}
        <div className="space-y-2">
          <div className="text-sm font-medium">
            {t('auth.onboarding.locationSection')}
          </div>
          <LocationFormOrganism
            ref={locationFormRef}
            mode="onboarding"
            disabled={isLoading}
            showCancel={false}
          />
        </div>

        {/* Contact Person Toggle */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeContactPerson"
              checked={includeContactPerson}
              onCheckedChange={(checked) =>
                setIncludeContactPerson(checked as boolean)
              }
              disabled={isLoading}
            />
            <Label htmlFor="includeContactPerson" className="font-medium">
              {t('auth.onboarding.addContactPerson')}
            </Label>
          </div>

          {/* Contact Person Fields (conditional) */}
          {includeContactPerson && (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
              <h3 className="font-medium">
                {t('auth.onboarding.contactPersonInfo')}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">
                    {t('auth.onboarding.contactName')}
                  </Label>
                  <Input
                    id="contactName"
                    type="text"
                    value={contactPersonData.name}
                    onChange={(e) =>
                      handleContactPersonChange('name', e.target.value)
                    }
                    placeholder="Jane"
                    disabled={isLoading}
                    required={includeContactPerson}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactLastname">
                    {t('auth.onboarding.contactLastname')}
                  </Label>
                  <Input
                    id="contactLastname"
                    type="text"
                    value={contactPersonData.lastname}
                    onChange={(e) =>
                      handleContactPersonChange('lastname', e.target.value)
                    }
                    placeholder="Smith"
                    disabled={isLoading}
                    required={includeContactPerson}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">
                  {t('auth.onboarding.contactPhone')}
                </Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={contactPersonData.phone}
                  onChange={(e) =>
                    handleContactPersonChange('phone', e.target.value)
                  }
                  placeholder="+1 987 654 321"
                  disabled={isLoading}
                  required={includeContactPerson}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  {t('auth.onboarding.contactEmail')}
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactPersonData.email}
                  onChange={(e) =>
                    handleContactPersonChange('email', e.target.value)
                  }
                  placeholder="jane@example.com"
                  disabled={isLoading}
                  required={includeContactPerson}
                />
              </div>
            </div>
          )}
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={handleSkip}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            {t('auth.onboarding.skipButton')}
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading
              ? t('Common.general.loading')
              : t('auth.onboarding.submitButton')}
          </Button>
        </div>
      </form>
    </div>
  );
});

OnboardingFormOrganism.displayName = 'OnboardingFormOrganism';

export default OnboardingFormOrganism;
