import React from 'react';
import { cn } from '@/lib/utils';

export interface UserStatsCardProps {
  label: string;
  value: number;
  variant?: 'default' | 'accent';
  valueClassName?: string;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
  activeClassName?: string;
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
  valueClassName,
  className,
  onClick,
  isActive,
  activeClassName,
}: UserStatsCardProps) {
  const isInteractive = !!onClick;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.key === ' ') e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-[5px] pl-[18px] pr-[5px] py-[15px]",
        "border border-ring rounded-[var(--radius-card)]",
        "bg-card min-w-[200px]",
        isInteractive && "cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isActive && (activeClassName || "border-primary shadow-sm bg-primary/10"),
        className
      )}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      {...(isInteractive ? { role: 'button', tabIndex: 0, 'aria-pressed': isActive } : {})}
    >
      <span className="body-xs text-muted-foreground-m font-light whitespace-nowrap">
        {label}
      </span>
      <span
        className={cn(
          "text-heading-lg font-extrabold",
          valueClassName ?? (variant === 'accent' ? "text-primary" : "text-foreground")
        )}
      >
        {value}
      </span>
    </div>
  );
}
