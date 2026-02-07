import React from 'react';
import { RequestFilterButtonsProps, RequestFilterType } from './RequestFilterButtons.types';

/**
 * RequestFilterButtons Component (Alianza Design System)
 *
 * Filter buttons for request status filtering
 * Similar to UserFilterButtons but for requests
 */
export const RequestFilterButtons: React.FC<RequestFilterButtonsProps> = ({
  activeFilter,
  onFilterChange,
  className = '',
}) => {
  const filters: { key: RequestFilterType; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'ongoing', label: 'En Progreso' },
    { key: 'completed', label: 'Completadas' },
    { key: 'cancelled', label: 'Canceladas' },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`
            px-4 py-2 rounded-[8px] text-sm font-medium transition-all
            ${
              activeFilter === filter.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
