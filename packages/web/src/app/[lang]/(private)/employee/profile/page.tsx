'use client';

import { useTranslations } from '@/context/TranslationsContext';
import { ProfileManagement } from '@/components/organisms/profile';

/**
 * Employee Profile Page
 *
 * Profile management page for employee users, rendered inside the employee dashboard layout.
 * Delegates all functionality to the ProfileManagement organism.
 *
 * @route /[lang]/employee/profile
 */
export default function EmployeeProfilePage() {
  const t = useTranslations('profile');

  const tabLabels = {
    info: t('tabs.info'),
    security: t('tabs.security'),
    preferences: t('tabs.preferences'),
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('description')}</p>
        </div>

        <ProfileManagement tabLabels={tabLabels} />
      </div>
    </div>
  );
}
