'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from '@/context/TranslationsContext';

// Organisms
import { RequestManagementTable } from '@/components/organisms/admin';

// Atoms
import { Heading } from '@/components/atoms-alianza/Typography';

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
      {/* Page Header */}
      <Heading level={1} className="text-foreground">
        {t('title') || 'Solicitudes de Servicio'}
      </Heading>

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
