'use client';

import React from 'react';
import { RequestStatus } from '@alkitu/shared';
import { Clock, Play, CheckCircle, XCircle } from 'lucide-react';
import type { RequestStatusBadgeMoleculeProps } from './RequestStatusBadgeMolecule.types';

/**
 * RequestStatusBadgeMolecule - Molecule Component (ALI-119)
 *
 * Displays request status as a colored badge with icon.
 * Follows Atomic Design principles as a reusable status indicator.
 *
 * Features:
 * - Color-coded status badges (yellow, blue, green, gray)
 * - Status-specific icons
 * - Three size variants (sm, md, lg)
 * - Accessible with proper ARIA labels
 *
 * @example
 * ```tsx
 * <RequestStatusBadgeMolecule status="PENDING" size="md" />
 * <RequestStatusBadgeMolecule status="ONGOING" />
 * <RequestStatusBadgeMolecule status="COMPLETED" size="sm" />
 * ```
 */
export const RequestStatusBadgeMolecule: React.FC<
  RequestStatusBadgeMoleculeProps
> = ({ status, className = '', size = 'md' }) => {
  // Status configurations
  const statusConfig = {
    [RequestStatus.PENDING]: {
      label: 'Pending',
      icon: Clock,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
    },
    [RequestStatus.ONGOING]: {
      label: 'Ongoing',
      icon: Play,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    [RequestStatus.COMPLETED]: {
      label: 'Completed',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
    [RequestStatus.CANCELLED]: {
      label: 'Cancelled',
      icon: XCircle,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'h-3 w-3',
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'h-4 w-4',
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'h-5 w-5',
    },
  };

  const sizes = sizeConfig[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizes.container} ${className}`}
      data-testid="request-status-badge"
      role="status"
      aria-label={`Request status: ${config.label}`}
    >
      <Icon className={sizes.icon} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
