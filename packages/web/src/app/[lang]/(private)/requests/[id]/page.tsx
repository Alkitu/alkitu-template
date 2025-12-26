'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { RequestDetailOrganism } from '@/components/organisms/request';
import { ArrowLeft } from 'lucide-react';
import type { UserRole } from '@alkitu/shared';

/**
 * Service Request Detail Page (ALI-119)
 *
 * Detailed view of a single service request.
 * Role-based access with different actions and permissions:
 * - CLIENT: View own requests, cancel if PENDING/ONGOING
 * - EMPLOYEE: View assigned/available requests, assign, complete
 * - ADMIN: View all requests, full management capabilities
 *
 * Features:
 * - Complete request details (service, location, user, template responses)
 * - Status timeline and tracking
 * - Role-based action buttons (assign, cancel, complete)
 * - Real-time updates when actions are performed
 * - Breadcrumb navigation
 * - JWT authentication required
 *
 * @route /[lang]/requests/[id]
 */
export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id } = use(params);
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
            router.push('/auth/login');
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
  }, [router]);

  const handleBack = () => {
    router.push('/requests');
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
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </button>

          <h1 className="text-3xl font-bold tracking-tight">
            Request Details
          </h1>
          <p className="mt-2 text-muted-foreground">
            View and manage this service request
          </p>
        </div>

        {/* Request Detail */}
        <RequestDetailOrganism
          requestId={id}
          userRole={userRole}
          onUpdate={handleUpdate}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
