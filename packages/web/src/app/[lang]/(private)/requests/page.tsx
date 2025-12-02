'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RequestListOrganism } from '@/components/organisms/request';
import type { UserRole } from '@alkitu/shared';

/**
 * Service Requests List Page (ALI-119)
 *
 * Main page for viewing and managing service requests.
 * Role-based access with different views and permissions:
 * - CLIENT: View own requests, create new requests
 * - EMPLOYEE: View assigned/unassigned requests, assign, complete
 * - ADMIN: View all requests, full management capabilities
 *
 * Features:
 * - Role-based request list
 * - Status filtering
 * - Quick actions (assign, cancel, complete)
 * - Navigation to detail view
 * - Create new request button
 * - JWT authentication required
 *
 * @route /[lang]/requests
 */
export default function RequestsPage() {
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

  const handleRequestClick = (requestId: string) => {
    router.push(`/requests/${requestId}`);
  };

  const handleCreateRequest = () => {
    router.push('/requests/new');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading requests...</p>
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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Service Requests
            </h1>
            <p className="mt-2 text-muted-foreground">
              {userRole === 'CLIENT' && 'Manage your service requests'}
              {userRole === 'EMPLOYEE' && 'View and manage assigned requests'}
              {userRole === 'ADMIN' && 'Manage all service requests'}
            </p>
          </div>

          {/* Create button - only for CLIENT */}
          {userRole === 'CLIENT' && (
            <button
              onClick={handleCreateRequest}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Request
            </button>
          )}
        </div>

        {/* Request List */}
        <RequestListOrganism
          userRole={userRole}
          onRequestClick={handleRequestClick}
        />
      </div>
    </div>
  );
}
