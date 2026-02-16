'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from '@/context/TranslationsContext';
import { RequestManagementTable } from '@/components/organisms/admin';

/**
 * Client Requests Page
 *
 * Displays the client's own service requests using the shared
 * RequestManagementTable in client mode (hides admin-only controls).
 * The backend tRPC endpoints already filter by user role automatically.
 *
 * @page
 */
export default function ClientRequestsPage() {
  const { lang } = useParams();
  const t = useTranslations('requests');

  return (
    <div className="flex flex-col gap-[36px] p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <RequestManagementTable
        lang={lang as string}
        mode="client"
      />
    </div>
  );
}
