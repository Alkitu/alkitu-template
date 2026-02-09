'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import type { ChipProps } from './Chip.types';

/**
 * Chip - Atomic Design Atom (Alianza Design System)
 *
 * A compact, visually distinct element used to represent tags, labels,
 * categories, or small pieces of information. Supports multiple variants,
 * sizes, removable functionality, and custom icons.
 *
 * @example
 * ```tsx
 * // Basic chip
 * <Chip variant="primary">Active</Chip>
 *
 * // Deletable chip
 * <Chip variant="success" deletable onDelete={() => console.log('Removed')}>
 *   Tag Name
 * </Chip>
 *
 * // Chip with icons
 * <Chip startIcon={<Star />} variant="warning">
 *   Featured
 * </Chip>
 *
 * // Selectable chip
 * <Chip selected variant="info">
 *   Selected Item
 * </Chip>
 * ```
 */
export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      variant = 'default',
      size = 'md',
      deletable = false,
      onDelete,
      selected = false,
      disabled = false,
      startIcon,
      endIcon,
      children,
      className,
      themeOverride,
      useSystemColors = true,
      onClick,
      ...props
    },
    ref,
  ) => {
    // Variant classes - merging color schemes from both implementations
    const variantClasses = {
      default: 'bg-secondary text-secondary-foreground',
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-muted text-muted-foreground',
      success:
        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      warning:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      error:
        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      outline:
        'border border-secondary-foreground text-secondary-foreground bg-secondary',
      solid: 'bg-primary text-primary-foreground border border-transparent',
      destructive:
        'bg-destructive text-destructive-foreground border border-transparent',
    }[variant];

    // Size classes - optimized from both implementations
    const sizeClasses = {
      sm: 'h-6 px-2 py-1 text-xs gap-1',
      md: 'h-8 px-3 py-1.5 text-sm gap-1.5',
      lg: 'h-10 px-4 py-2 text-base gap-2',
    }[size];

    // Icon size based on chip size
    const iconSizeClass = {
      sm: 'h-3 w-3',
      md: 'h-3.5 w-3.5',
      lg: 'h-4 w-4',
    }[size];

    // Compose classes
    const classes = cn(
      // Base classes
      'inline-flex items-center justify-center',
      'rounded-full font-medium whitespace-nowrap overflow-hidden',
      'transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

      // Variant and size
      useSystemColors && variantClasses,
      sizeClasses,

      // Selected state
      selected && 'ring-2 ring-ring ring-offset-2',

      // Disabled state
      disabled && 'opacity-50 cursor-not-allowed pointer-events-none',

      // Clickable state
      onClick && !disabled && 'cursor-pointer hover:opacity-80',

      // User-provided classes
      className,
    );

    // Apply theme overrides if provided
    const style = themeOverride ? { ...themeOverride } : undefined;

    // Handle chip click
    const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (onClick && !disabled) {
        onClick(e);
      }
    };

    // Handle delete button click
    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (onDelete && !disabled) {
        onDelete();
      }
    };

    // Handle keyboard events for delete button
    const handleDeleteKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && onDelete && !disabled) {
        e.preventDefault();
        e.stopPropagation();
        onDelete();
      }
    };

    return (
      <span
        ref={ref}
        className={classes}
        style={style}
        onClick={handleClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        aria-disabled={disabled}
        aria-selected={selected}
        data-use-system-colors={useSystemColors}
        data-slot="chip"
        {...props}
      >
        {/* Start icon */}
        {startIcon && (
          <span className={cn('inline-flex shrink-0', iconSizeClass)}>
            {startIcon}
          </span>
        )}

        {/* Content */}
        {children && <span className="truncate">{children}</span>}

        {/* End icon */}
        {endIcon && !deletable && (
          <span className={cn('inline-flex shrink-0', iconSizeClass)}>
            {endIcon}
          </span>
        )}

        {/* Delete button */}
        {deletable && (
          <button
            type="button"
            className={cn(
              'ml-0.5 inline-flex items-center justify-center shrink-0',
              'rounded-full transition-colors',
              'hover:bg-black/10 dark:hover:bg-white/10',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              size === 'sm' ? 'p-0.5' : size === 'md' ? 'p-1' : 'p-1.5',
            )}
            onClick={handleDelete}
            onKeyDown={handleDeleteKeyDown}
            disabled={disabled}
            aria-label="Remove chip"
            tabIndex={disabled ? -1 : 0}
          >
            <X className={iconSizeClass} />
          </button>
        )}
      </span>
    );
  },
);

Chip.displayName = 'Chip';

export default Chip;
