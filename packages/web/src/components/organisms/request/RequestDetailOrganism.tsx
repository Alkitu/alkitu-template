'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/primitives/ui/button';
import {
  Loader2,
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Building2,
  Briefcase,
  UserCheck,
  AlertCircle,
  XCircle,
  CheckCircle,
} from 'lucide-react';
import { RequestStatus } from '@alkitu/shared';
import { RequestStatusBadgeMolecule } from '@/components/molecules/request';
import type { RequestDetailOrganismProps } from './RequestDetailOrganism.types';

/**
 * RequestDetailOrganism - Organism Component (ALI-119)
 *
 * Complete detail view for a service request.
 * Follows Atomic Design principles as a complete feature component.
 *
 * Features:
 * - Fetches and displays full request details
 * - Shows all request information (service, location, user, responses)
 * - Role-based action buttons (assign, complete, cancel)
 * - Loading and error states
 * - Auto-refresh after actions
 *
 * @example
 * ```tsx
 * <RequestDetailOrganism
 *   requestId="123"
 *   userRole="EMPLOYEE"
 *   onBack={() => router.back()}
 * />
 * ```
 */
export const RequestDetailOrganism: React.FC<RequestDetailOrganismProps> = ({
  requestId,
  userRole,
  className = '',
  onUpdate,
  onBack,
}) => {
  const [request, setRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch request details
  const fetchRequest = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/requests/${requestId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch request');
      }

      const data = await response.json();
      setRequest(data);
      onUpdate?.(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load request');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRequest();
  }, [requestId]);

  // Handle assign
  const handleAssign = async () => {
    alert('Assign modal would open here');
  };

  // Handle complete
  const handleComplete = async () => {
    if (!confirm('Mark this request as completed?')) return;

    try {
      setActionLoading('complete');
      const response = await fetch(`/api/requests/${requestId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: 'Completed successfully' }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete request');
      }

      await fetchRequest();
    } catch (err: any) {
      alert(err.message || 'Failed to complete request');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      setActionLoading('cancel');
      const response = await fetch(`/api/requests/${requestId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel request');
      }

      await fetchRequest();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel request');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
          <div className="flex-1">
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error || 'Request not found'}</p>
            {onBack && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="mt-3"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const executionDate = new Date(request.executionDateTime);
  const canCancel = request.status === RequestStatus.PENDING || request.status === RequestStatus.ONGOING;
  const canAssign = userRole !== 'CLIENT' && request.status === RequestStatus.PENDING && !request.assignedToId;
  const canComplete = userRole !== 'CLIENT' && request.status === RequestStatus.ONGOING;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>
            <p className="text-sm text-gray-500">ID: {request.id}</p>
          </div>
        </div>
        <RequestStatusBadgeMolecule status={request.status} size="lg" />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Service Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Briefcase className="h-5 w-5" />
              Service Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Service</label>
                <p className="mt-1 text-gray-900">{request.service?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <p className="mt-1 text-gray-900">{request.service?.category?.name}</p>
              </div>
            </div>
          </div>

          {/* Execution Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Calendar className="h-5 w-5" />
              Execution Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Scheduled Date & Time</label>
                <p className="mt-1 text-gray-900">
                  {executionDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <MapPin className="h-5 w-5" />
              Location
            </h2>
            <div className="space-y-1">
              {request.location.building && (
                <p className="text-sm text-gray-600">
                  <Building2 className="mr-1 inline h-4 w-4" />
                  {[request.location.building, request.location.tower, request.location.floor, request.location.unit]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
              <p className="text-gray-900">{request.location.street}</p>
              <p className="text-gray-600">
                {request.location.city}, {request.location.state} {request.location.zip}
              </p>
            </div>
          </div>

          {/* Service Details (Template Responses) */}
          {request.templateResponses && Object.keys(request.templateResponses).length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Service Details</h2>
              <div className="space-y-3">
                {Object.entries(request.templateResponses).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <p className="mt-1 text-gray-900">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Meta Info */}
        <div className="space-y-6">
          {/* Client Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <User className="h-5 w-5" />
              Client
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-900">
                  {request.user.firstname} {request.user.lastname}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{request.user.email}</p>
              </div>
              {request.user.company && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <p className="mt-1 text-gray-900">{request.user.company}</p>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Employee */}
          {request.assignedTo && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <UserCheck className="h-5 w-5" />
                Assigned To
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-gray-900">
                    {request.assignedTo.firstname} {request.assignedTo.lastname}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{request.assignedTo.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="font-medium text-gray-700">Created</label>
                <p className="mt-1 text-gray-600">
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>
              {request.completedAt && (
                <div>
                  <label className="font-medium text-gray-700">Completed</label>
                  <p className="mt-1 text-gray-600">
                    {new Date(request.completedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {(canAssign || canComplete || canCancel) && (
            <div className="space-y-2">
              {canAssign && (
                <Button
                  onClick={handleAssign}
                  disabled={!!actionLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {actionLoading === 'assign' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserCheck className="mr-2 h-4 w-4" />
                  )}
                  Assign Request
                </Button>
              )}

              {canComplete && (
                <Button
                  onClick={handleComplete}
                  disabled={!!actionLoading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {actionLoading === 'complete' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Mark as Completed
                </Button>
              )}

              {canCancel && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={!!actionLoading}
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  {actionLoading === 'cancel' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  Cancel Request
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
