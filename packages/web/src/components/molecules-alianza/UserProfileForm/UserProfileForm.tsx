'use client';

import React, { useState, useEffect } from 'react';
import { FormInput } from '@/components/molecules-alianza/FormInput';
import { Button } from '@/components/molecules-alianza/Button';
import { Label } from '@/components/primitives/ui/label';
import { Save, User, Building, MapPin, Contact } from 'lucide-react';
import type {
  UserProfileFormProps,
  UserProfileFormValues,
} from './UserProfileForm.types';

/**
 * UserProfileForm — Alianza Molecule
 *
 * Presentational form for editing user profile info.
 * Shows address/contactPerson fields only for CLIENT role.
 */
export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  defaultValues,
  onSubmit,
  loading = false,
  role,
  disabled = false,
  email,
  t,
}) => {
  const [values, setValues] = useState<UserProfileFormValues>(defaultValues);
  const [showContactPerson, setShowContactPerson] = useState(
    !!defaultValues.contactPerson,
  );

  useEffect(() => {
    setValues(defaultValues);
    setShowContactPerson(!!defaultValues.contactPerson);
  }, [defaultValues]);

  const handleChange = (field: keyof UserProfileFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactPersonChange = (
    field: keyof NonNullable<UserProfileFormValues['contactPerson']>,
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      contactPerson: {
        name: prev.contactPerson?.name ?? '',
        lastname: prev.contactPerson?.lastname ?? '',
        phone: prev.contactPerson?.phone ?? '',
        email: prev.contactPerson?.email ?? '',
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitValues = { ...values };
    if (!showContactPerson) {
      delete submitValues.contactPerson;
    }
    onSubmit(submitValues);
  };

  const isClient = role === 'CLIENT';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {email && (
          <FormInput
            label={t('form.email')}
            type="email"
            value={email}
            disabled
            icon={<User className="h-4 w-4" />}
          />
        )}
        <FormInput
          label={t('form.firstname')}
          value={values.firstname}
          onChange={(e) => handleChange('firstname', e.target.value)}
          disabled={disabled}
          required
        />
        <FormInput
          label={t('form.lastname')}
          value={values.lastname}
          onChange={(e) => handleChange('lastname', e.target.value)}
          disabled={disabled}
          required
        />
        <FormInput
          label={t('form.phone')}
          value={values.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          disabled={disabled}
        />
        <FormInput
          label={t('form.company')}
          value={values.company}
          onChange={(e) => handleChange('company', e.target.value)}
          disabled={disabled}
          icon={<Building className="h-4 w-4" />}
        />
      </div>

      {/* CLIENT-only: Address */}
      {isClient && (
        <div className="space-y-4">
          <FormInput
            label={t('form.address')}
            value={values.address ?? ''}
            onChange={(e) => handleChange('address', e.target.value)}
            disabled={disabled}
            icon={<MapPin className="h-4 w-4" />}
          />

          {/* Contact Person Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={showContactPerson}
              disabled={disabled}
              onClick={() => !disabled && setShowContactPerson(!showContactPerson)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showContactPerson ? 'bg-primary' : 'bg-input'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-lg transition-transform ${
                  showContactPerson ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <Label className="flex items-center gap-2 cursor-pointer" onClick={() => !disabled && setShowContactPerson(!showContactPerson)}>
              <Contact className="h-4 w-4" />
              {t('form.contactPerson.toggle')}
            </Label>
          </div>

          {showContactPerson && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-muted">
              <FormInput
                label={t('form.contactPerson.name')}
                value={values.contactPerson?.name ?? ''}
                onChange={(e) =>
                  handleContactPersonChange('name', e.target.value)
                }
                disabled={disabled}
              />
              <FormInput
                label={t('form.contactPerson.lastname')}
                value={values.contactPerson?.lastname ?? ''}
                onChange={(e) =>
                  handleContactPersonChange('lastname', e.target.value)
                }
                disabled={disabled}
              />
              <FormInput
                label={t('form.contactPerson.phone')}
                value={values.contactPerson?.phone ?? ''}
                onChange={(e) =>
                  handleContactPersonChange('phone', e.target.value)
                }
                disabled={disabled}
              />
              <FormInput
                label={t('form.contactPerson.email')}
                type="email"
                value={values.contactPerson?.email ?? ''}
                onChange={(e) =>
                  handleContactPersonChange('email', e.target.value)
                }
                disabled={disabled}
              />
            </div>
          )}
        </div>
      )}

      {!disabled && (
        <Button
          type="submit"
          disabled={loading}
          iconLeft={<Save className="h-4 w-4" />}
        >
          {loading ? t('form.saving') : t('form.save')}
        </Button>
      )}
    </form>
  );
};

UserProfileForm.displayName = 'UserProfileForm';
