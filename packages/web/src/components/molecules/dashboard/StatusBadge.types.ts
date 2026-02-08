/**
 * StatusBadge - Type definitions
 * Atomic Design: Molecule
 */

export type RequestStatus = 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}
