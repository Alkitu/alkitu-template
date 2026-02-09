'use client';

import { useTranslations } from '@/context/TranslationsContext';
import { NotificationAnalytics } from '@/components/features/notifications/notification-analytics';
import { useParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';

export default function NotificationAnalyticsPage() {
  const t = useTranslations('notifications');
  const { lang } = useParams();

  // Get current user
  const { data: user, isLoading } = trpc.user.me.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title={t('analytics.title')}
        description={t('analytics.description')}
        backHref={`/${lang}/admin/notifications`}
        backLabel={t('analytics.back')}
      />

      {/* Analytics Component */}
      <NotificationAnalytics userId={user.id} />
    </div>
  );
}
