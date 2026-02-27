'use client';

import { use } from 'react';
import { UserRole } from '@alkitu/shared';
import { RequestDetailOrganism } from '@/components/organisms/request';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';

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

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Detalles de la Solicitud"
        description="Visualiza y gestiona tu solicitud de servicio"
        backHref={`/${lang}/client/requests`}
        backLabel="Volver a Solicitudes"
      />

      <RequestDetailOrganism
        requestId={requestId}
        userRole={UserRole.CLIENT}
        lang={lang}
      />
    </div>
  );
}
