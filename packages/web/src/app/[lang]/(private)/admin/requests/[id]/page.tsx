'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { RequestDetailOrganism } from '@/components/organisms/request';
import { ArrowLeft } from 'lucide-react';
import type { UserRole } from '@alkitu/shared';
import { AdminPageHeader } from '@/components/molecules/admin-page-header';

/**
 * Admin Service Request Detail Page
 *
 * Detailed view of a single service request for admins.
 * Full management capabilities including assign, complete, and cancel.
 *
 * Features:
 * - Complete request details (service, location, user, template responses)
 * - Status timeline and tracking
 * - Full admin action buttons (assign, cancel, complete)
 * - Real-time updates when actions are performed
 * - Breadcrumb navigation
 * - JWT authentication required
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
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user role from profile endpoint
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/users/profile');

        if (!response.ok) {
          if (response.status === 401) {
            router.push(`/${lang}/auth/login`);
            return;
          }
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUserRole(data.role);
      } catch (err) {
        console.error('Failed to fetch user role:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchUserRole();
  }, [router, lang]);

  const handleBack = () => {
    router.push(`/${lang}/admin/requests`);
  };

  const handleUpdate = () => {
    // Re-fetch can be handled by RequestDetailOrganism
    // This callback is just for notifications or additional actions
    console.log('Request updated successfully');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load user information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Request Details"
        description="View and manage this service request"
        backHref={`/${lang}/admin/requests`}
        backLabel="Back to Requests"
      />

        {/* Request Detail */}
        <RequestDetailOrganism
          requestId={id}
          userRole={userRole}
          onUpdate={handleUpdate}
          onBack={handleBack}
        />
      </div>
  );
}
