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
      label: 'Pendiente',
      icon: Clock,
      bgColor: 'bg-warning/10',
      textColor: 'text-warning',
      borderColor: 'border-warning/20',
    },
    [RequestStatus.ONGOING]: {
      label: 'En Proceso',
      icon: Play,
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
      borderColor: 'border-primary/20',
    },
    [RequestStatus.COMPLETED]: {
      label: 'Completada',
      icon: CheckCircle,
      bgColor: 'bg-success/10',
      textColor: 'text-success',
      borderColor: 'border-success/20',
    },
    [RequestStatus.CANCELLED]: {
      label: 'Cancelada',
      icon: XCircle,
      bgColor: 'bg-destructive/10',
      textColor: 'text-destructive',
      borderColor: 'border-destructive/20',
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
