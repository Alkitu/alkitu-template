'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { ProgressBarProps } from './ProgressBar.types';

/**
 * ProgressBar - Atomic Design Atom
 *
 * A linear progress indicator that shows task completion or loading state.
 * Supports multiple variants, sizes, and optional label/percentage display.
 *
 * @example
 * ```tsx
 * // Basic progress bar
 * <ProgressBar value={65} />
 *
 * // With label and percentage
 * <ProgressBar
 *   value={75}
 *   label="Profile completion"
 *   showLabel
 *   showPercentage
 * />
 *
 * // Animated loading
 * <ProgressBar
 *   value={progress}
 *   variant="success"
 *   animated
 * />
 * ```
 */
export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      variant = 'default',
      size = 'md',
      showLabel = false,
      showPercentage = false,
      label,
      className = '',
      animated = false,
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    // Calculate percentage with min/max constraints
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    // Variant classes for container and bar
    const variantClasses = {
      default: {
        container: 'bg-muted',
        bar: 'bg-primary',
      },
      success: {
        container: 'bg-success/20',
        bar: 'bg-success',
      },
      warning: {
        container: 'bg-warning/20',
        bar: 'bg-warning',
      },
      error: {
        container: 'bg-destructive/20',
        bar: 'bg-destructive',
      },
    }[variant];

    // Size classes for height
    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-4',
    }[size];

    // Typography styles for labels
    const typographyStyles = {
      fontFamily: 'var(--typography-emphasis-font-family)',
      fontSize: 'var(--typography-emphasis-font-size)',
      fontWeight: 'var(--typography-emphasis-font-weight)',
      letterSpacing: 'var(--typography-emphasis-letter-spacing)',
    };

    // Border radius style
    const borderRadiusStyle = {
      borderRadius: 'var(--radius-progress, var(--radius))',
    };

    return (
      <div
        ref={ref}
        className={cn('w-full', className)}
        data-testid={dataTestId}
        {...props}
      >
        {/* Label and percentage */}
        {(showLabel || showPercentage) && (
          <div className="flex items-center justify-between mb-2">
            {showLabel && label && (
              <span
                className="text-sm text-foreground"
                style={typographyStyles}
                data-testid={dataTestId ? `${dataTestId}-label` : undefined}
              >
                {label}
              </span>
            )}
            {showPercentage && (
              <span
                className="text-sm text-muted-foreground"
                style={typographyStyles}
                data-testid={dataTestId ? `${dataTestId}-percentage` : undefined}
              >
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}

        {/* Progress container */}
        <div
          className={cn(
            variantClasses.container,
            sizeClasses,
            'rounded-full overflow-hidden',
          )}
          style={borderRadiusStyle}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progress: ${Math.round(percentage)}%`}
          data-testid={dataTestId ? `${dataTestId}-container` : undefined}
        >
          {/* Progress bar */}
          <div
            className={cn(
              variantClasses.bar,
              sizeClasses,
              'transition-all duration-500 ease-out rounded-full',
              animated && 'animate-pulse',
            )}
            style={{
              width: `${percentage}%`,
              borderRadius: 'var(--radius-progress, var(--radius))',
            }}
            data-testid={dataTestId ? `${dataTestId}-bar` : undefined}
          />
        </div>
      </div>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
