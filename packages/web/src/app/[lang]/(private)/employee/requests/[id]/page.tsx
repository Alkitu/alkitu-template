'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@alkitu/shared';
import { RequestDetailOrganism } from '@/components/organisms/request';

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
  const router = useRouter();

  return (
    <div className="p-6">
      <RequestDetailOrganism
        requestId={id}
        userRole={UserRole.EMPLOYEE}
        lang={lang}
        onBack={() => router.push(`/${lang}/employee/requests`)}
      />
    </div>
  );
}
