'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from '@/context/TranslationsContext';

// Organisms
import { RequestManagementTable } from '@/components/organisms/admin';

// Molecules
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { BreadcrumbNavigation } from '@/components/molecules-alianza/Breadcrumb';

/**
 * Admin Service Requests Page
 *
 * Displays comprehensive request management interface for administrators.
 * Follows Atomic Design composition pattern.
 *
 * @page
 */
export default function AdminRequestsPage() {
  const { lang } = useParams();
  const t = useTranslations('admin.requests');

  const handleRequestUpdated = () => {
    // Optional: Add any global side effects after request updates
    console.log('Request updated');
  };

  const handleRequestCancelled = () => {
    // Optional: Add any global side effects after request cancellation
    console.log('Request cancelled');
  };

  const handleRequestCompleted = () => {
    // Optional: Add any global side effects after request completion
    console.log('Request completed');
  };

  return (
    <div className="flex flex-col gap-[36px] p-6">
      {/* Page Header with Breadcrumbs */}
      <AdminPageHeader
        title={t('title')}
        description={t('description')}
        breadcrumbs={
          <BreadcrumbNavigation
            items={[
              { label: t('breadcrumbs.dashboard'), href: `/${lang}/admin` },
              { label: t('breadcrumbs.requests'), current: true },
            ]}
            separator="chevron"
            size="sm"
          />
        }
      />

      {/* Request Management Table Organism */}
      <RequestManagementTable
        lang={lang as string}
        onRequestUpdated={handleRequestUpdated}
        onRequestCancelled={handleRequestCancelled}
        onRequestCompleted={handleRequestCompleted}
      />
    </div>
  );
}
