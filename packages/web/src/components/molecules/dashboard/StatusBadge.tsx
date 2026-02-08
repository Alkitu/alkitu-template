/**
 * StatusBadge - Status indicator badge for requests
 * Atomic Design: Molecule
 *
 * @example
 * <StatusBadge status="PENDING" />
 * <StatusBadge status="COMPLETED" />
 */

import { StatusBadgeProps, RequestStatus } from './StatusBadge.types';

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const configs: Record<RequestStatus, { text: string; className: string }> = {
    PENDING: {
      text: 'Pendiente',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    },
    ONGOING: {
      text: 'En Proceso',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    },
    COMPLETED: {
      text: 'Completada',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    },
    CANCELLED: {
      text: 'Cancelada',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    },
  };

  const config = configs[status] || configs.PENDING;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className} ${className}`}>
      {config.text}
    </span>
  );
}
