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
import type { ServiceFilterButtonsProps, ServiceFilterOption } from './ServiceFilterButtons.types';
import type { ServiceFilterType } from './ServiceFilterButtons.types';

/**
 * ServiceFilterButtons - Molecule for filtering services
 *
 * Select dropdown for service status filtering.
 *
 * @example
 * ```tsx
 * <ServiceFilterButtons
 *   activeFilter={currentFilter}
 *   onFilterChange={setFilter}
 * />
 * ```
 */
const defaultLabels = {
  all: 'Todas',
  active: 'Activos',
  inactive: 'Inactivos',
  placeholder: 'Filtrar por estado',
};

export function ServiceFilterButtons({
  activeFilter,
  onFilterChange,
  filterOptions,
  labels: labelsProp,
  className,
  'aria-label': ariaLabel = 'Service filters',
  disabled = false,
}: ServiceFilterButtonsProps) {
  const l = { ...defaultLabels, ...labelsProp };

  const defaultFilters: ServiceFilterOption[] = [
    { id: 'all', label: l.all },
    { id: 'active', label: l.active },
    { id: 'inactive', label: l.inactive },
  ];

  const filters = filterOptions || defaultFilters;

  return (
    <Select
      value={activeFilter}
      onValueChange={(val) => onFilterChange(val as ServiceFilterType)}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn('w-[200px]', className)}
        data-testid="service-filter-select"
        aria-label={ariaLabel}
      >
        <SelectValue placeholder={l.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filters.map((filter) => (
          <SelectItem key={filter.id} value={filter.id}>
            {filter.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

ServiceFilterButtons.displayName = 'ServiceFilterButtons';
