'use client';

import { useTranslations } from '@/context/TranslationsContext';
import { ProfileManagement } from '@/components/organisms/profile';

/**
 * Profile Page
 *
 * User profile management page with tabbed interface.
 * Delegates all functionality to the ProfileManagement organism.
 *
 * Features:
 * - Profile information management
 * - Password change
 * - User preferences
 * - Internationalization support
 *
 * @route /[lang]/profile
 */
export default function ProfilePage() {
  const t = useTranslations('profile');

  const tabLabels = {
    info: t('tabs.info'),
    security: t('tabs.security'),
    preferences: t('tabs.preferences'),
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
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
