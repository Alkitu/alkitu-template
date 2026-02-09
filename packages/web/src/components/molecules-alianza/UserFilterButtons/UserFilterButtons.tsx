'use client';

import React from 'react';
import { Chip } from '@/components/atoms-alianza/Chip';
import { cn } from '@/lib/utils';
import type { UserFilterButtonsProps, UserFilterType } from './UserFilterButtons.types';

const defaultLabels = {
  all: 'Todos',
  admin: 'Administradores',
  employee: 'Employee',
  client: 'Clientes',
};

/**
 * UserFilterButtons - Molecule for filtering users by role
 *
 * Uses Chip atoms to create a filter button group.
 * Active filter uses solid variant, others use outline.
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
    <div
      className={cn("flex flex-wrap gap-[13px]", className)}
      data-testid="user-filter-buttons"
      role="group"
      aria-label="User role filters"
    >
      {filters.map(({ key, label }) => (
        <Chip
          key={key}
          variant={activeFilter === key ? 'solid' : 'outline'}
          onClick={() => onFilterChange(key)}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          data-testid={`filter-${key}`}
          aria-pressed={activeFilter === key}
          role="button"
        >
          {label}
        </Chip>
      ))}
    </div>
  );
}

UserFilterButtons.displayName = 'UserFilterButtons';
