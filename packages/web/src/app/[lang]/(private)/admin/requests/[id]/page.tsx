'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@alkitu/shared';
import { RequestDetailOrganism } from '@/components/organisms/request';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';

/**
 * Admin Service Request Detail Page
 *
 * Thin wrapper: passes ADMIN role directly (route guarantees role via middleware).
 *
 * @route /[lang]/admin/requests/[id]
 */
export default function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = use(params);
  const router = useRouter();

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Request Details"
        description="View and manage this service request"
        backHref={`/${lang}/admin/requests`}
        backLabel="Back to Requests"
      />

      <RequestDetailOrganism
        requestId={id}
        userRole={UserRole.ADMIN}
        lang={lang}
      />
    </div>
  );
}
