'use client';

import React from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Calendar, MapPin, User, Building2, Eye, XCircle, UserCheck, CheckCircle } from 'lucide-react';
import { RequestStatus } from '@alkitu/shared';
import { RequestStatusBadgeMolecule } from './RequestStatusBadgeMolecule';
import type { RequestCardMoleculeProps } from './RequestCardMolecule.types';

/**
 * RequestCardMolecule - Molecule Component (ALI-119)
 *
 * Displays a service request in a card format with optional action buttons.
 * Follows Atomic Design principles as a self-contained display component.
 *
 * Features:
 * - Displays request status, service, date, location
 * - Shows user and company information
 * - Optional assigned employee badge
 * - Action buttons (view details, cancel, assign, complete)
 * - Loading states
 * - Responsive layout
 *
 * @example
 * ```tsx
 * <RequestCardMolecule
 *   request={request}
 *   showViewDetails
 *   showCancel
 *   onViewDetails={(req) => router.push(`/requests/${req.id}`)}
 *   onCancel={(req) => handleCancel(req)}
 * />
 * ```
 */
export const RequestCardMolecule: React.FC<RequestCardMoleculeProps> = ({
  request,
  className = '',
  showViewDetails = true,
  showCancel = false,
  showAssign = false,
  showComplete = false,
  onViewDetails,
  onCancel,
  onAssign,
  onComplete,
  isLoading = false,
}) => {
  // Format date
  const executionDate = new Date(request.executionDateTime);
  const formattedDate = executionDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Determine which action buttons to show based on status
  const canCancel = showCancel && (request.status === RequestStatus.PENDING || request.status === RequestStatus.ONGOING);
  const canAssign = showAssign && request.status === RequestStatus.PENDING && !request.assignedToId;
  const canComplete = showComplete && request.status === RequestStatus.ONGOING;

  const hasActions = showViewDetails || canCancel || canAssign || canComplete;

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${className}`}
      data-testid="request-card"
    >
      {/* Header: Status and Service Name */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {request.service?.name || 'Service Request'}
          </h3>
        </div>
        <RequestStatusBadgeMolecule status={request.status} size="sm" />
      </div>

      {/* Request Details */}
      <div className="space-y-2.5">
        {/* Execution Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span>{formattedDate}</span>
        </div>

        {/* User Information */}
        {request.user && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>
              {request.user.firstname} {request.user.lastname}
              {request.user.company && (
                <>
                  <span className="mx-1.5 text-gray-400">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {request.user.company}
                  </span>
                </>
              )}
            </span>
          </div>
        )}

        {/* Assigned Employee */}
        {request.assignedTo && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserCheck className="h-4 w-4 flex-shrink-0 text-blue-600" aria-hidden="true" />
            <span>
              Assigned to: <span className="font-medium text-blue-700">
                {request.assignedTo.firstname} {request.assignedTo.lastname}
              </span>
            </span>
          </div>
        )}

        {/* Created Date */}
        <div className="pt-1 text-xs text-gray-400">
          Created {new Date(request.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Action Buttons */}
      {hasActions && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
          {showViewDetails && onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(request)}
              disabled={isLoading}
              className="flex-1"
            >
              <Eye className="mr-1.5 h-4 w-4" aria-hidden="true" />
              View Details
            </Button>
          )}

          {canAssign && onAssign && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onAssign(request)}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <span className="mr-1.5 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <UserCheck className="mr-1.5 h-4 w-4" aria-hidden="true" />
              )}
              Assign
            </Button>
          )}

          {canComplete && onComplete && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onComplete(request)}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <span className="mr-1.5 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <CheckCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
              )}
              Complete
            </Button>
          )}

          {canCancel && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(request)}
              disabled={isLoading}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              {isLoading ? (
                <span className="mr-1.5 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-600" />
              ) : (
                <XCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
              )}
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
