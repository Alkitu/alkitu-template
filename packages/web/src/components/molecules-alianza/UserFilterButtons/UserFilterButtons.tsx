'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import { cn } from '@/lib/utils';
import type { UserFilterButtonsProps, UserFilterType } from './UserFilterButtons.types';

const defaultLabels = {
  all: 'Todos',
  admin: 'Administradores',
  employee: 'Empleados',
  client: 'Clientes',
};

/**
 * UserFilterButtons - Molecule for filtering users by role
 *
 * Select dropdown for user role filtering.
 *
 * @example
 * ```tsx
 * <UserFilterButtons
 *   activeFilter="all"
 *   onFilterChange={(filter) => setActiveFilter(filter)}
 * />
 * ```
 */
export function UserFilterButtons({
  activeFilter,
  onFilterChange,
  labels = defaultLabels,
  className,
}: UserFilterButtonsProps) {
  const filters: { key: UserFilterType; label: string }[] = [
    { key: 'all', label: labels.all },
    { key: 'admin', label: labels.admin },
    { key: 'employee', label: labels.employee },
    { key: 'client', label: labels.client },
  ];

  return (
    <Select
      value={activeFilter}
      onValueChange={(val) => onFilterChange(val as UserFilterType)}
    >
      <SelectTrigger
        className={cn('w-[200px]', className)}
        data-testid="user-filter-select"
        aria-label="User role filters"
      >
        <SelectValue placeholder="Filtrar por rol" />
      </SelectTrigger>
      <SelectContent>
        {filters.map(({ key, label }) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

UserFilterButtons.displayName = 'UserFilterButtons';
