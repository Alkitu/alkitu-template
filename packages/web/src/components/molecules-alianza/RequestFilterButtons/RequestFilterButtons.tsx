import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import { cn } from '@/lib/utils';
import { RequestFilterButtonsProps, RequestFilterType } from './RequestFilterButtons.types';

const filters: { key: RequestFilterType; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'ongoing', label: 'En Progreso' },
  { key: 'completed', label: 'Completadas' },
  { key: 'cancelled', label: 'Canceladas' },
];

/**
 * RequestFilterButtons Component (Alianza Design System)
 *
 * Select dropdown for request status filtering.
 */
export const RequestFilterButtons: React.FC<RequestFilterButtonsProps> = ({
  activeFilter,
  onFilterChange,
  className = '',
}) => {
  return (
    <Select
      value={activeFilter}
      onValueChange={(val) => onFilterChange(val as RequestFilterType)}
    >
      <SelectTrigger className={cn('w-[200px]', className)} data-testid="request-filter-select" aria-label="Request status filters">
        <SelectValue placeholder="Filtrar por estado" />
      </SelectTrigger>
      <SelectContent>
        {filters.map((filter) => (
          <SelectItem key={filter.key} value={filter.key}>
            {filter.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
