'use client';

import { useRouter } from 'next/navigation';
import { RequestListOrganism } from '@/components/organisms/request';

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
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Service Requests
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage all service requests
          </p>
        </div>

        {/* Request List */}
        <RequestListOrganism
          userRole="ADMIN"
          onRequestClick={handleRequestClick}
        />
      </div>
    </div>
  );
}
