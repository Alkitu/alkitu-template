'use client';

import { use } from 'react';
import { UserRole } from '@alkitu/shared';
import { RequestDetailOrganism } from '@/components/organisms/request';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';

/**
 * Employee Service Request Detail Page
 *
 * Thin wrapper: passes EMPLOYEE role (route guarantees role via middleware).
 *
 * @route /[lang]/employee/requests/[id]
 */
export default function EmployeeRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = use(params);

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Detalles de la Solicitud"
        description="Visualiza y gestiona esta solicitud de servicio"
        backHref={`/${lang}/employee/requests`}
        backLabel="Volver a Solicitudes"
      />

      <RequestDetailOrganism
        requestId={id}
        userRole={UserRole.EMPLOYEE}
        lang={lang}
      />
    </div>
  );
}
