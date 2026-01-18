'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/primitives/ui/button';
import { InputGroup } from '@/components/molecules-alianza/InputGroup';
import { Label } from '@/components/primitives/ui/label';
import { Checkbox } from '@/components/primitives/ui/checkbox';
import { useTranslations } from '@/context/TranslationsContext';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import { PasswordStrengthIndicator } from '@/components/atoms/password-strength-indicator';
import { getCurrentLocalizedRoute } from '@/lib/locale';
import { Icon } from '@/components/atoms/icons/Icon';
import type { RegisterFormOrganismProps } from './RegisterFormOrganism.types';

/**
 * RegisterFormOrganism - Organism Component (ALI-115)
 *
 * A complete registration form organism that handles the entire user registration flow.
 * Follows Atomic Design principles as a self-contained feature component.
 *
 * Features:
 * - Minimal registration fields (firstname, lastname, email, password, terms)
 * - Password complexity validation (8+ chars, uppercase, lowercase, number)
 * - Real-time password strength indicator
 * - Password confirmation validation
 * - Terms and conditions checkbox
 * - tRPC API integration
 * - Loading states
 * - Error and success messages
 * - Automatic redirect to login after successful registration
 * - Locale-aware navigation
 * - Additional fields (phone, company, address) collected in onboarding
 *
 * Changes in ALI-115:
 * - Renamed: name → firstname, lastName → lastname
 * - Removed: contactNumber/phone (now in onboarding)
 * - Added: Password strength indicator
 * - Added: Password complexity requirements
 *
 * @example
 * ```tsx
 * <AuthPageOrganism
 *   headerLabel={t('auth.register.title')}
 *   backButtonLabel={t('auth.register.backButton')}
 *   backButtonHref="/auth/login"
 * >
 *   <RegisterFormOrganism />
 * </AuthPageOrganism>
 * ```
 */
export const RegisterFormOrganism = React.forwardRef<
  HTMLFormElement,
  RegisterFormOrganismProps
>(({ className }, ref) => {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.newPassword.passwordMismatch'));
      return;
    }

    if (!formData.terms) {
      setError(t('auth.register.termsRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;

      // Use fetch to call Next.js API route
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(t('auth.register.success'));

      // Redirect to login with proper locale
      setTimeout(() => {
        const localizedLoginRoute = getCurrentLocalizedRoute(
          '/auth/login',
          pathname,
        );
        router.push(localizedLoginRoute);
      }, 1500);
    } catch (err: any) {
      setError(err.message || t('auth.register.error', {}, 'auth') || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className={className || 'space-y-4'}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <InputGroup
           label={t('auth.register.name')}
           id="firstname"
           type="text"
           value={formData.firstname}
           onChange={(e) => handleChange('firstname', e.target.value)}
           placeholder={t('auth.register.name') || 'Juan Pérez'}
           required
           disabled={isLoading}
           iconLeft={<Icon name="user" size="sm" className="text-muted-foreground" />}
        />

        {/* Last Name */}
        <InputGroup
           label={t('auth.register.lastName')}
           id="lastname"
           type="text"
           value={formData.lastname}
           onChange={(e) => handleChange('lastname', e.target.value)}
           placeholder={t('auth.register.lastName') || 'Apellido'}
           required
           disabled={isLoading}
           iconLeft={<Icon name="user" size="sm" className="text-muted-foreground" />}
        />
      </div>

      {/* Email */}
      <InputGroup
         label={t('auth.register.email')}
         id="email"
         type="email"
         value={formData.email}
         onChange={(e) => handleChange('email', e.target.value)}
         placeholder={t('auth.register.email') || 'tu@email.com'}
         required
         disabled={isLoading}
         iconLeft={<Icon name="mail" size="sm" className="text-muted-foreground" />}
      />

      {/* Password */}
      <div className="space-y-2">
         <InputGroup
            label={t('auth.register.password')}
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder={t('auth.register.password') || '••••••••'}
            required
            disabled={isLoading}
            minLength={8}
            iconLeft={<Icon name="lock" size="sm" className="text-muted-foreground" />}
         />
         <PasswordStrengthIndicator password={formData.password} minLength={8} />
      </div>

      {/* Confirm Password */}
      <InputGroup
         label={t('auth.register.confirmPassword')}
         id="confirmPassword"
         type="password"
         value={formData.confirmPassword}
         onChange={(e) => handleChange('confirmPassword', e.target.value)}
         placeholder={t('auth.register.confirmPassword') || '••••••••'}
         required
         disabled={isLoading}
         iconLeft={<Icon name="lock" size="sm" className="text-muted-foreground" />}
      />

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="terms"
          checked={formData.terms}
          onCheckedChange={(checked) =>
            handleChange('terms', checked as boolean)
          }
          disabled={isLoading}
        />
        <Label htmlFor="terms" className="text-body-sm font-light text-foreground">
          {t('auth.register.terms')}
        </Label>
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-[48px] rounded-lg mt-4" disabled={isLoading}>
        {isLoading ? t('Common.general.loading') : t('auth.register.submit') || 'Crear Cuenta'}
      </Button>
    </form>
  );
});

RegisterFormOrganism.displayName = 'RegisterFormOrganism';

export default RegisterFormOrganism;
