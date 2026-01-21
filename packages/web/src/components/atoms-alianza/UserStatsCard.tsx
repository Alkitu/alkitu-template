import React from 'react';
import { cn } from '@/lib/utils';

export interface UserStatsCardProps {
  label: string;
  value: number;
  variant?: 'default' | 'accent';
  className?: string;
}

/**
 * UserStatsCard - Atom for displaying user statistics
 * 
 * Displays a label and numeric value in a bordered card.
 * Uses accent color for role-specific counts (Admins, Employees, Clients).
 * 
 * @example
 * ```tsx
 * <UserStatsCard label="Total de Usuarios" value={24} />
 * <UserStatsCard label="Administradores" value={3} variant="accent" />
 * ```
 */
export function UserStatsCard({ 
  label, 
  value, 
  variant = 'default',
  className 
}: UserStatsCardProps) {
  return (
    <div 
      className={cn(
        "flex flex-col gap-[5px] pl-[18px] pr-[5px] py-[15px]",
        "border border-ring rounded-[14px]",
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
