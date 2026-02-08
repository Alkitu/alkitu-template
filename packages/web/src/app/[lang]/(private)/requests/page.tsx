'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '@/context/TranslationsContext';
import { Heading } from '@/components/atoms-alianza/Typography';
import { ClientRequestsView } from '@/components/organisms/request';
import type { RequestListItem } from '@alkitu/shared';

/**
 * Service Requests List Page - Client View
 *
 * Client-facing page for viewing and managing service requests.
 * Follows composition-only pattern with minimal UI code.
 *
 * Features:
 * - View own requests
 * - Filter by status
 * - Create new requests
 * - View request details
 * - Cancel pending requests
 * - Internationalization support
 *
 * @route /[lang]/requests
 */
export default function RequestsPage() {
  const router = useRouter();
  const t = useTranslations('requests');

  const handleRequestClick = (request: RequestListItem) => {
    router.push(`/requests/${request.id}`);
  };

  const handleCreateRequest = () => {
    router.push('/requests/new');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Heading level={1}>{t('title')}</Heading>
          <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* Client Requests View */}
        <ClientRequestsView
          onRequestClick={handleRequestClick}
          onCreateRequest={handleCreateRequest}
          filterLabels={{
            all: t('filters.all'),
            pending: t('filters.pending'),
            active: t('filters.active'),
            completed: t('filters.completed'),
          }}
          emptyStateMessage={t('empty.message')}
          emptyStateAction={t('empty.action')}
          loadingMessage={t('loading')}
          errorMessage={t('error')}
        />
      </div>
    </div>
  );
}
