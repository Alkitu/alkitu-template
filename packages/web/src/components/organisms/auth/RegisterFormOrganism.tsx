'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/molecules-alianza/Button';
import { FormInput } from '@/components/molecules-alianza/FormInput';
import { Checkbox } from '@/components/molecules-alianza/Checkbox';
import { useTranslations } from '@/context/TranslationsContext';
import { FormError } from '@/components/primitives/ui/form-error';
import { FormSuccess } from '@/components/primitives/ui/form-success';
import { PasswordStrengthIndicator } from '@/components/atoms-alianza/PasswordStrengthIndicator';
import { getCurrentLocalizedRoute } from '@/lib/locale';
import { User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import type { RegisterFormOrganismProps } from './RegisterFormOrganism.types';

/**
 * RegisterFormOrganism - Organism Component (ALI-115)
 *
 * A complete registration form organism that handles the entire user registration flow.
 * Follows Atomic Design principles as a self-contained feature component.
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
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
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

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submitData,
          phone: submitData.phone || undefined, // Ensure empty string becomes undefined if necessary
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(t('auth.register.success'));

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
        <FormInput
           label={t('auth.register.name')}
           id="firstname"
           type="text"
           value={formData.firstname}
           onChange={(e) => handleChange('firstname', e.target.value)}
           placeholder={t('auth.register.name') || 'Juan Pérez'}
           required
           disabled={isLoading}
           icon={<User className="h-4 w-4" />}
        />

        {/* Last Name */}
        <FormInput
           label={t('auth.register.lastName')}
           id="lastname"
           type="text"
           value={formData.lastname}
           onChange={(e) => handleChange('lastname', e.target.value)}
           placeholder={t('auth.register.lastName') || 'Apellido'}
           required
           disabled={isLoading}
           icon={<User className="h-4 w-4" />}
        />
      </div>

      {/* Email */}
      <FormInput
         label={t('auth.register.email')}
         id="email"
         type="email"
         value={formData.email}
         onChange={(e) => handleChange('email', e.target.value)}
         placeholder={t('auth.register.email') || 'tu@email.com'}
         required
         disabled={isLoading}
         icon={<Mail className="h-4 w-4" />}
      />

      {/* Contact Number */}
      <FormInput
         label={t('auth.register.phone') || 'Teléfono'}
         id="phone"
         type="tel"
         value={formData.phone}
         onChange={(e) => handleChange('phone', e.target.value)}
         placeholder="+1234567890"
         disabled={isLoading}
         icon={<Phone className="h-4 w-4" />}
      />

      {/* Password */}
      <div className="space-y-2">
         <FormInput
            label={t('auth.register.password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder={t('auth.register.password') || '••••••••'}
            required
            disabled={isLoading}
            minLength={8}
            icon={<Lock className="h-4 w-4" />}
            iconRight={
              <Button
                type="button"
                variant="nude"
                size="sm"
                iconOnly
                iconLeft={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                onClick={() => setShowPassword(!showPassword)}
              />
            }
         />
         <PasswordStrengthIndicator password={formData.password} minLength={8} />
      </div>

      {/* Confirm Password */}
      <FormInput
         label={t('auth.register.confirmPassword')}
         id="confirmPassword"
         type={showPassword ? 'text' : 'password'}
         value={formData.confirmPassword}
         onChange={(e) => handleChange('confirmPassword', e.target.value)}
         placeholder={t('auth.register.confirmPassword') || '••••••••'}
         required
         disabled={isLoading}
         icon={<Lock className="h-4 w-4" />}
      />

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          checked={formData.terms}
          onCheckedChange={(checked) =>
            handleChange('terms', checked)
          }
          disabled={isLoading}
        />
        <label 
          className="text-body-sm font-light text-foreground cursor-pointer select-none"
          onClick={() => !isLoading && handleChange('terms', !formData.terms)}
        >
          {t('auth.register.terms')}
        </label>
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      <Button type="submit" className="w-full mt-4" disabled={isLoading}>
        {isLoading ? t('Common.general.loading') : t('auth.register.submit') || 'Crear Cuenta'}
      </Button>
    </form>
  );
});

RegisterFormOrganism.displayName = 'RegisterFormOrganism';

export default RegisterFormOrganism;
