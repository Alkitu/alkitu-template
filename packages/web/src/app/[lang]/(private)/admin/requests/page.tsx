'use client';

import { useRouter } from 'next/navigation';
import { RequestListOrganism } from '@/components/organisms/request';
import { AdminPageHeader } from '@/components/molecules/admin-page-header';

/**
 * Admin Service Requests Page (ALI-119)
 *
 * Admin-specific page for viewing and managing all service requests.
 * Admins can view all requests regardless of status or assignment.
 *
 * Features:
 * - View all service requests
 * - Full management capabilities (assign, cancel, complete)
 * - Advanced filtering
 * - Navigation to detail view
 *
 * @route /[lang]/admin/requests
 */
export default function AdminRequestsPage() {
  const router = useRouter();

  const handleRequestClick = (request: any) => {
    router.push(`/admin/requests/${request.id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Service Requests"
        description="Manage all service requests"
      />

        {/* Request List */}
        <RequestListOrganism
          userRole="ADMIN"
          onRequestClick={handleRequestClick}
        />
      </div>
  );
}
