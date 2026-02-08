'use client';

import { DashboardOverview } from '@/components/organisms/dashboard';
import { useTranslations } from '@/context/TranslationsContext';

export default function DashboardPage() {
  const t = useTranslations('dashboard.overview');

  return (
    <div className="min-h-screen bg-background p-6">
      <DashboardOverview
        welcomeMessage={t('welcome')}
        subtitle={t('subtitle')}
        statsLabels={{
          pending: t('stats.pending'),
          active: t('stats.active'),
          completed: t('stats.completed'),
        }}
        isUnderConstruction={true}
        constructionTitle={t('construction.title')}
        constructionMessage={t('construction.message')}
        constructionStatus={t('construction.status')}
      />
    </div>
  );
}
