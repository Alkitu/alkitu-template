'use client';

import { useTranslations } from '@/context/TranslationsContext';
import { Button } from '@/components/primitives/ui/button';
import { Typography } from '@/components/atoms-alianza/Typography';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { NotificationAnalytics } from '@/components/features/notifications/notification-analytics';

import { useParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';

// Test user ID - En una aplicación real, esto vendría de la sesión del usuario
const TEST_USER_ID = '6861ea1a1c0cf932169adce4';

// (keep existing imports except Button/Link/Typography/ArrowLeft if unused)

// ...

export default function NotificationAnalyticsPage() {
  const t = useTranslations('notifications');
  const { lang } = useParams();

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title={t('analytics.title')}
        description={t('analytics.description')}
        backHref={`/${lang}/admin/notifications`}
        backLabel={t('analytics.back')}
      />

      {/* Analytics Component */}
      <NotificationAnalytics userId={TEST_USER_ID} />
    </div>
  );
}
