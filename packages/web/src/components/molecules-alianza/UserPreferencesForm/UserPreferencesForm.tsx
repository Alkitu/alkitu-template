'use client';

import React, { useState, useEffect } from 'react';
import { FormSelect } from '@/components/molecules-alianza/FormSelect';
import { Button } from '@/components/molecules-alianza/Button';
import { Save, Sun, Globe } from 'lucide-react';
import type {
  UserPreferencesFormProps,
  UserPreferencesFormValues,
} from './UserPreferencesForm.types';

/**
 * UserPreferencesForm — Alianza Molecule
 *
 * Presentational form for editing theme and language preferences.
 */
export const UserPreferencesForm: React.FC<UserPreferencesFormProps> = ({
  defaultValues,
  onSubmit,
  loading = false,
  t,
}) => {
  const [values, setValues] =
    useState<UserPreferencesFormValues>(defaultValues);

  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const themeOptions = [
    { value: 'system', label: t('preferences.theme.system') },
    { value: 'light', label: t('preferences.theme.light') },
    { value: 'dark', label: t('preferences.theme.dark') },
  ];

  const languageOptions = [
    { value: 'es', label: t('preferences.language.es') },
    { value: 'en', label: t('preferences.language.en') },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label={t('preferences.theme.label')}
          options={themeOptions}
          value={values.theme}
          onValueChange={(v) =>
            setValues((prev) => ({
              ...prev,
              theme: v as UserPreferencesFormValues['theme'],
            }))
          }
          icon={<Sun className="h-4 w-4" />}
        />
        <FormSelect
          label={t('preferences.language.label')}
          options={languageOptions}
          value={values.language}
          onValueChange={(v) =>
            setValues((prev) => ({
              ...prev,
              language: v as UserPreferencesFormValues['language'],
            }))
          }
          icon={<Globe className="h-4 w-4" />}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        iconLeft={<Save className="h-4 w-4" />}
      >
        {loading ? t('preferences.saving') : t('preferences.save')}
      </Button>
    </form>
  );
};

UserPreferencesForm.displayName = 'UserPreferencesForm';
