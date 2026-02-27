'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@alkitu/shared';
import { RequestDetailOrganism } from '@/components/organisms/request';

/**
 * Request Detail Page - CLIENT View
 *
 * Thin wrapper: delegates all rendering and logic to RequestDetailOrganism.
 *
 * @route /[lang]/client/requests/[requestId]
 */
export default function ClientRequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string; lang: string }>;
}) {
  const { requestId, lang } = use(params);
  const router = useRouter();

  return (
    <div className="p-6">
      <RequestDetailOrganism
        requestId={requestId}
        userRole={UserRole.CLIENT}
        lang={lang}
        onBack={() => router.push(`/${lang}/client/requests`)}
      />
    </div>
  );
}
