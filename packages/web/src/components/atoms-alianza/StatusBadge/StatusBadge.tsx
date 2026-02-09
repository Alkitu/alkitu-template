import React from 'react';
import { UserStatus } from '@alkitu/shared';
import { Badge } from '@/components/atoms-alianza/Badge';
import type { StatusBadgeProps } from './StatusBadge.types';

const statusConfig: Record<
  UserStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  [UserStatus.VERIFIED]: { label: 'Verified', variant: 'default' },
  [UserStatus.PENDING]: { label: 'Pending', variant: 'secondary' },
  [UserStatus.SUSPENDED]: { label: 'Suspended', variant: 'destructive' },
  [UserStatus.ANONYMIZED]: { label: 'Anonymized', variant: 'outline' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isActive }) => {
  const config = statusConfig[status] || { label: status, variant: 'outline' as const };
  const label = isActive ? `${config.label} (Online)` : config.label;

  return <Badge variant={config.variant}>{label}</Badge>;
};
