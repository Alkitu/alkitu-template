'use client';

import React, { useState } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Loader2, Filter, X, Plus, AlertCircle } from 'lucide-react';
import { RequestStatus } from '@alkitu/shared';
import { trpc } from '@/lib/trpc';
import {
  RequestCardMolecule,
  CancelRequestModal,
} from '@/components/molecules/request';
import type { ClientRequestsViewProps } from './ClientRequestsView.types';

/**
 * ClientRequestsView - Organism Component
 *
 * Client-specific view for managing service requests.
 * Follows Atomic Design principles as a complete feature component.
 *
 * Features:
 * - Fetches and displays client's requests
 * - Status filter (all, pending, active, completed)
 * - Request cards with status badges
 * - Cancel request action
 * - Empty state with create request CTA
 * - Loading and error states
 * - Auto-refresh after actions
 *
 * @example
 * ```tsx
 * <ClientRequestsView
 *   onRequestClick={(req) => router.push(`/requests/${req.id}`)}
 *   onCreateRequest={() => router.push('/requests/new')}
 *   filterLabels={{
 *     all: 'All Requests',
 *     pending: 'Pending',
 *     active: 'Active',
 *     completed: 'Completed'
 *   }}
 *   emptyStateMessage="You haven't created any requests yet."
 *   emptyStateAction="Create Your First Request"
 * />
 * ```
 */
export const ClientRequestsView: React.FC<ClientRequestsViewProps> = ({
  className = '',
  onRequestClick,
  onCreateRequest,
  filterLabels = {
    all: 'All',
    pending: 'Pending',
    active: 'Active',
    completed: 'Completed',
  },
  emptyStateMessage = 'No requests found',
  emptyStateAction = 'Create Request',
  loadingMessage = 'Loading requests...',
  errorMessage = 'Failed to load requests',
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedRequestForCancel, setSelectedRequestForCancel] = useState<any | null>(null);

  // Fetch requests using tRPC
  const {
    data: requestsData,
    isLoading,
    isError,
    error,
    refetch,
  } = (trpc.request.getFilteredRequests as any).useQuery({
    page: 1,
    limit: 100,
    status: statusFilter,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  }) as { data: any; isLoading: boolean; isError: boolean; error: any; refetch: () => void };

  const requests = requestsData?.requests || [];

  // Handle cancel request
  const handleCancel = async (request: any) => {
    setSelectedRequestForCancel(request);
    setCancelModalOpen(true);
  };

  // Handle cancel confirmation from modal
  const handleCancelConfirm = async (requestId: string, reason: string) => {
    try {
      setActionLoading(requestId);

      const response = await fetch(`/api/requests/${requestId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to cancel request');
      }

      // Refresh the request list
      await refetch();

      // Close modal
      setCancelModalOpen(false);
      setSelectedRequestForCancel(null);
    } catch (err: any) {
      console.error('Error canceling request:', err);
      alert(err.message || 'Failed to cancel request');
      throw err; // Re-throw so modal can handle error state
    } finally {
      setActionLoading(null);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setStatusFilter(undefined);
    setShowFilters(false);
  };

  const hasActiveFilters = statusFilter !== undefined;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void refetch()}
            disabled={isLoading}
            className="gap-2"
            title="Refresh requests"
          >
            <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

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
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                1
              </span>
            )}
          </Button>
        </div>

        {/* Create New Request Button */}
        {onCreateRequest && (
          <Button
            onClick={onCreateRequest}
            className="gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            {emptyStateAction}
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium text-foreground">Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
              >
                <X className="mr-1 h-3 w-3" />
                Clear all
              </Button>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80">Status</label>
            <select
              value={statusFilter || ''}
              onChange={(e) =>
                setStatusFilter(e.target.value ? (e.target.value as RequestStatus) : undefined)
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">{filterLabels.all}</option>
              <option value={RequestStatus.PENDING}>{filterLabels.pending}</option>
              <option value={RequestStatus.ONGOING}>{filterLabels.active}</option>
              <option value={RequestStatus.COMPLETED}>{filterLabels.completed}</option>
            </select>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
            <div className="flex-1">
              <h3 className="font-medium text-destructive-foreground">Error</h3>
              <p className="mt-1 text-sm text-destructive">
                {error?.message || errorMessage}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
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
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
            <p className="mt-4 text-muted-foreground">{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && requests.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-border bg-muted/10 p-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-medium text-foreground">
              {hasActiveFilters ? 'No matching requests' : emptyStateMessage}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating your first service request.'}
            </p>
            {onCreateRequest && !hasActiveFilters && (
              <Button onClick={onCreateRequest} className="mt-6 gap-2">
                <Plus className="h-4 w-4" />
                {emptyStateAction}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Request List */}
      {!isLoading && !isError && requests.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((request: any) => (
            <RequestCardMolecule
              key={request.id}
              request={request as any}
              showViewDetails
              showCancel={request.status === RequestStatus.PENDING}
              showAssign={false}
              showComplete={false}
              onViewDetails={onRequestClick}
              onCancel={handleCancel}
              isLoading={actionLoading === request.id}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      {!isLoading && !isError && requests.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {requests.length} request{requests.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Cancel Request Modal */}
      <CancelRequestModal
        open={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedRequestForCancel(null);
        }}
        request={selectedRequestForCancel}
        onConfirm={handleCancelConfirm}
        isLoading={!!actionLoading}
      />
    </div>
  );
};
