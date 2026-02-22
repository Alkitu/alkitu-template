import React from 'react';
import { cn } from '@/lib/utils';
import type { ServiceStatsCardProps } from './ServiceStatsCard.types';

/**
 * ServiceStatsCard - Atom for displaying service statistics
 * 
 * Displays a label and numeric value in a bordered card.
 * Uses accent color for specific counts if needed.
 * 
 * @example
 * ```tsx
 * <ServiceStatsCard label="Servicios" value={24} />
 * <ServiceStatsCard label="Categorías" value={3} variant="accent" />
 * ```
 */
export function ServiceStatsCard({
  label,
  value,
  variant = 'default',
  className
}: ServiceStatsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[5px] pl-[18px] pr-[5px] py-[15px]",
        "border border-ring rounded-xl",
        "bg-card min-w-[200px]",
        className
      )}
    >
      <span className="body-xs text-muted-foreground-m font-light whitespace-nowrap">
        {label}
      </span>
      <span
        className={cn(
          "text-heading-lg font-extrabold",
          variant === 'accent' ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}
