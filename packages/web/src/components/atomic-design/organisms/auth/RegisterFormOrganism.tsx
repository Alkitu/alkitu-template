'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from '@/context/TranslationContext';
import { FormError } from '@/components/shared/messages/form-error';
import { FormSuccess } from '@/components/shared/messages/form-success';
import { trpc } from '@/lib/trpc';
import { getCurrentLocalizedRoute } from '@/lib/locale';
import type { RegisterFormOrganismProps } from './RegisterFormOrganism.types';

/**
 * RegisterFormOrganism - Organism Component
 *
 * A complete registration form organism that handles the entire user registration flow.
 * Follows Atomic Design principles as a self-contained feature component.
 *
 * Features:
 * - Multi-field form (name, lastName, email, phone, password, confirmPassword)
 * - Password confirmation validation
 * - Terms and conditions checkbox
 * - tRPC API integration
 * - Loading states
 * - Error and success messages
 * - Automatic redirect to login after successful registration
 * - Locale-aware navigation
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
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    terms: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Use tRPC mutation for registration
  const registerMutation = trpc.user.register.useMutation({
    onSuccess: (data: any) => {
      setSuccess(t('auth.register.success'));

      // Redirect to login with proper locale
      setTimeout(() => {
        const localizedLoginRoute = getCurrentLocalizedRoute(
          '/auth/login',
          pathname,
        );
        window.location.href = localizedLoginRoute;
      }, 2000);
    },
    onError: (error: any) => {
      setError(
        error.message ||
          t('auth.register.error', {}, 'auth') ||
          'Registration failed',
      );
    },
  });

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

    try {
      const { confirmPassword, ...submitData } = formData;

      // Use tRPC mutation
      await registerMutation.mutateAsync(submitData);
    } catch (err: any) {
      // Error handling is done in the mutation's onError callback
      console.error('Registration error:', err);
    }
  };

  const isLoading = registerMutation.isPending;

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className={className || 'space-y-4'}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('auth.register.name')}</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder={t('auth.register.name')}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">{t('auth.register.lastName')}</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder={t('auth.register.lastName')}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t('auth.register.email')}</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder={t('auth.register.email')}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber">{t('auth.register.phone')}</Label>
        <Input
          id="contactNumber"
          type="tel"
          value={formData.contactNumber}
          onChange={(e) => handleChange('contactNumber', e.target.value)}
          placeholder={t('auth.register.phone')}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t('auth.register.password')}</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder={t('auth.register.password')}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          {t('auth.register.confirmPassword')}
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          placeholder={t('auth.register.confirmPassword')}
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formData.terms}
          onCheckedChange={(checked) =>
            handleChange('terms', checked as boolean)
          }
          disabled={isLoading}
        />
        <Label htmlFor="terms" className="text-sm">
          {t('auth.register.terms')}
        </Label>
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t('Common.general.loading') : t('auth.register.submit')}
      </Button>
    </form>
  );
});

RegisterFormOrganism.displayName = 'RegisterFormOrganism';

export default RegisterFormOrganism;
