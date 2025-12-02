'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Loader2, Filter, X, Plus, AlertCircle } from 'lucide-react';
import { RequestStatus } from '@alkitu/shared';
import { RequestCardMolecule } from '@/components/molecules/request';
import type { RequestListOrganismProps, RequestFilters } from './RequestListOrganism.types';

/**
 * RequestListOrganism - Organism Component (ALI-119)
 *
 * Complete list interface for service requests with filtering.
 * Follows Atomic Design principles as a complete feature component.
 *
 * Features:
 * - Fetches and displays requests
 * - Status filter dropdown
 * - Role-based action buttons
 * - Empty state with call-to-action
 * - Loading and error states
 * - Auto-refresh after actions
 *
 * @example
 * ```tsx
 * <RequestListOrganism
 *   userRole="CLIENT"
 *   onRequestClick={(req) => router.push(`/requests/${req.id}`)}
 * />
 * ```
 */
export const RequestListOrganism: React.FC<RequestListOrganismProps> = ({
  userRole,
  className = '',
  onRequestClick,
  initialStatusFilter,
}) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<RequestFilters>({
    status: initialStatusFilter,
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch requests
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.serviceId) params.append('serviceId', filters.serviceId);
      if (filters.assignedToId) params.append('assignedToId', filters.assignedToId);

      const response = await fetch(`/api/requests?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load requests');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRequests();
  }, [filters]);

  // Handle assign request
  const handleAssign = async (request: any) => {
    // In a real app, you'd open a modal to select employee
    // For now, we'll just show a placeholder
    alert('Assign modal would open here');
  };

  // Handle complete request
  const handleComplete = async (request: any) => {
    if (!confirm('Mark this request as completed?')) return;

    try {
      setActionLoading(request.id);
      const response = await fetch(`/api/requests/${request.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: 'Completed successfully' }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete request');
      }

      await fetchRequests(); // Refresh list
    } catch (err: any) {
      alert(err.message || 'Failed to complete request');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle cancel request
  const handleCancel = async (request: any) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      setActionLoading(request.id);
      const response = await fetch(`/api/requests/${request.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel request');
      }

      await fetchRequests(); // Refresh list
    } catch (err: any) {
      alert(err.message || 'Failed to cancel request');
    } finally {
      setActionLoading(null);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
    setShowFilters(false);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Service Requests</h2>

        <div className="flex items-center gap-2">
          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-0 text-sm text-gray-600 hover:text-gray-900"
              >
                <X className="mr-1 h-3 w-3" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value as RequestStatus | undefined,
                  }))
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value={RequestStatus.PENDING}>Pending</option>
                <option value={RequestStatus.ONGOING}>Ongoing</option>
                <option value={RequestStatus.COMPLETED}>Completed</option>
                <option value={RequestStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void fetchRequests()}
                className="mt-3"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && requests.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
            <p className="mt-2 text-sm text-gray-600">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating your first service request.'}
            </p>
            {userRole === 'CLIENT' && !hasActiveFilters && (
              <Button className="mt-6 gap-2">
                <Plus className="h-4 w-4" />
                Create Request
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Request List */}
      {!isLoading && !error && requests.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <RequestCardMolecule
              key={request.id}
              request={request}
              showViewDetails
              showCancel={userRole !== 'CLIENT' || request.status === RequestStatus.PENDING}
              showAssign={userRole !== 'CLIENT' && request.status === RequestStatus.PENDING}
              showComplete={userRole !== 'CLIENT' && request.status === RequestStatus.ONGOING}
              onViewDetails={onRequestClick}
              onAssign={handleAssign}
              onComplete={handleComplete}
              onCancel={handleCancel}
              isLoading={actionLoading === request.id}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      {!isLoading && !error && requests.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Showing {requests.length} request{requests.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};
