import React from 'react';
import { Button } from '@/components/molecules-alianza/Button';
import { cn } from '@/lib/utils';

export type ServiceFilterType = 'all' | 'active' | 'inactive';

interface ServiceFilterButtonsProps {
  activeFilter: ServiceFilterType;
  onFilterChange: (filter: ServiceFilterType) => void;
  className?: string;
}

/**
 * ServiceFilterButtons - Molecule for filtering services
 * 
 * Displays a group of pills/tabs to filter the service list.
 * 
 * @example
 * ```tsx
 * <ServiceFilterButtons 
 *   activeFilter={currentFilter} 
 *   onFilterChange={setFilter} 
 * />
 * ```
 */
export function ServiceFilterButtons({ 
  activeFilter, 
  onFilterChange,
  className 
}: ServiceFilterButtonsProps) {
  const filters: { id: ServiceFilterType; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'active', label: 'Activos' },
    { id: 'inactive', label: 'Inactivos' },
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'active' : 'outline'}
          className={cn(
            "rounded-[8px] px-6 h-[32px] text-xs font-medium border",
            activeFilter === filter.id 
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" 
              : "border-input bg-background hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          )}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
