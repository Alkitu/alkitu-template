'use client';

import React from 'react';
import { Button } from '@/components/molecules-alianza/Button';
import { cn } from '@/lib/utils';
import type { ServiceFilterButtonsProps, ServiceFilterOption } from './ServiceFilterButtons.types';
import type { ServiceFilterType } from './ServiceFilterButtons.types';

/**
 * ServiceFilterButtons - Molecule for filtering services
 *
 * Displays a group of pills/tabs to filter the service list.
 * Supports single and multi-select modes, count badges, and responsive layouts.
 *
 * @example
 * ```tsx
 * // Single selection mode
 * <ServiceFilterButtons
 *   activeFilter={currentFilter}
 *   onFilterChange={setFilter}
 * />
 *
 * // With counts
 * <ServiceFilterButtons
 *   activeFilter="all"
 *   onFilterChange={setFilter}
 *   showCounts
 *   counts={{ all: 10, active: 5, inactive: 5 }}
 * />
 *
 * // Multi-select mode
 * <ServiceFilterButtons
 *   activeFilter="all"
 *   onFilterChange={handleChange}
 *   multiSelect
 *   selectedFilters={['active', 'inactive']}
 * />
 * ```
 */
export function ServiceFilterButtons({
  activeFilter,
  onFilterChange,
  filterOptions,
  showCounts = false,
  counts,
  disabledFilters = [],
  multiSelect = false,
  selectedFilters = [],
  showClearAll = false,
  onClearAll,
  className,
  variant = 'default',
  size = 'md',
  responsive = 'wrap',
  'aria-label': ariaLabel = 'Service filters',
  disabled = false,
}: ServiceFilterButtonsProps) {
  // Default filter options
  const defaultFilters: ServiceFilterOption[] = [
    { id: 'all', label: 'Todas' },
    { id: 'active', label: 'Activos' },
    { id: 'inactive', label: 'Inactivos' },
  ];

  const filters = filterOptions || defaultFilters;

  // Check if a filter is active
  const isFilterActive = (filterId: ServiceFilterType): boolean => {
    if (multiSelect) {
      return selectedFilters.includes(filterId);
    }
    return activeFilter === filterId;
  };

  // Check if a filter is disabled
  const isFilterDisabled = (filterId: ServiceFilterType): boolean => {
    return disabled || disabledFilters.includes(filterId);
  };

  // Handle filter click
  const handleFilterClick = (filterId: ServiceFilterType) => {
    if (isFilterDisabled(filterId)) return;
    onFilterChange(filterId);
  };

  // Handle clear all
  const handleClearAll = () => {
    if (disabled) return;
    onClearAll?.();
  };

  // Get count for a filter
  const getFilterCount = (filterId: ServiceFilterType): number | undefined => {
    if (!showCounts || !counts) return undefined;
    return counts[filterId];
  };

  // Size classes for buttons
  const sizeClasses: Record<string, string> = {
    sm: 'h-[28px] px-4 text-xs',
    md: 'h-[32px] px-6 text-xs',
    lg: 'h-[36px] px-8 text-sm',
  };

  // Variant classes
  const variantClasses: Record<string, string> = {
    default: 'rounded-[8px]',
    compact: 'rounded-[6px]',
    pill: 'rounded-full',
  };

  // Responsive classes
  const responsiveClasses: Record<string, string> = {
    wrap: 'flex-wrap',
    scroll: 'flex-nowrap overflow-x-auto',
  };

  return (
    <div
      className={cn('flex gap-2', responsiveClasses[responsive], className)}
      role="group"
      aria-label={ariaLabel}
      data-testid="service-filter-buttons"
    >
      {filters.map((filter) => {
        const isActive = isFilterActive(filter.id);
        const isDisabled = isFilterDisabled(filter.id);
        const count = getFilterCount(filter.id);

        return (
          <Button
            key={filter.id}
            variant={isActive ? 'active' : 'outline'}
            className={cn(
              'font-medium border',
              variantClasses[variant],
              sizeClasses[size],
              isActive
                ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border-input bg-background hover:bg-accent hover:text-accent-foreground text-muted-foreground',
              isDisabled && 'opacity-50 cursor-not-allowed',
            )}
            onClick={() => handleFilterClick(filter.id)}
            disabled={isDisabled}
            aria-pressed={isActive}
            data-testid={`filter-button-${filter.id}`}
            data-filter-id={filter.id}
          >
            {filter.label}
            {count !== undefined && (
              <span
                className={cn(
                  'ml-1.5 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-[10px] font-semibold',
                  isActive
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
                data-testid={`filter-count-${filter.id}`}
              >
                {count}
              </span>
            )}
          </Button>
        );
      })}

      {showClearAll && (multiSelect ? selectedFilters.length > 0 : activeFilter !== 'all') && (
        <Button
          variant="nude"
          className={cn('font-medium text-xs text-muted-foreground hover:text-foreground', sizeClasses[size])}
          onClick={handleClearAll}
          disabled={disabled}
          data-testid="clear-all-button"
        >
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}

ServiceFilterButtons.displayName = 'ServiceFilterButtons';
