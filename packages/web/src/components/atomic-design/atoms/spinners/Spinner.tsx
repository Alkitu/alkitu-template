'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { SpinnerProps } from './Spinner.types';

/**
 * Spinner - Atomic Design Atom
 *
 * PHASE 2 CONSOLIDATION - Merged from multiple implementations:
 * - ui/spinner.tsx (CVA-based, forwardRef)
 * - theme-editor/Spinner.tsx (advanced features, 3 types, 8 variants)
 * - atomic-design/Spinner.tsx (theme integration)
 * - shared/LoadingSpinner.tsx (simple)
 * - shared/ui/loading-indicator.tsx (with label)
 *
 * A versatile loading indicator with multiple styles, sizes, and animation options.
 * Fully integrated with the theme system using CSS variables.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Spinner />
 *
 * // With size and variant
 * <Spinner size="lg" variant="primary" />
 *
 * // With custom speed and type
 * <Spinner type="dots" speed="fast" variant="success" />
 *
 * // With label
 * <Spinner label="Loading..." />
 *
 * // Custom size and color
 * <Spinner customSize={32} customColor="oklch(0.7 0.2 200)" />
 * ```
 */

// CVA variants for circular spinner (maintains backward compatibility with ui/spinner)
const spinnerVariants = cva(
  'inline-block animate-spin rounded-full',
  {
    variants: {
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8',
        '2xl': 'h-10 w-10',
      },
      variant: {
        default: 'text-foreground',
        primary: 'text-primary',
        secondary: 'text-secondary',
        accent: 'text-accent',
        muted: 'text-muted-foreground',
        destructive: 'text-destructive',
        warning: 'text-warning',
        success: 'text-success',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  }
);

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      customSize,
      variant = 'primary',
      customColor,
      speed = 'normal',
      type = 'circular',
      label,
      className,
      themeOverride,
      useSystemColors = true,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    // Get size value in pixels
    const getSizeValue = (): number => {
      if (customSize) return customSize;

      const sizeMap = {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
        '2xl': 40,
      };

      return sizeMap[size];
    };

    // Get color value (CSS variable or custom)
    const getColorValue = (): string => {
      if (customColor) return customColor;
      if (!useSystemColors) return 'currentColor';

      const colorMap = {
        default: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted-foreground)',
        destructive: 'var(--color-destructive)',
        warning: 'var(--color-warning)',
        success: 'var(--color-success)',
      };

      return colorMap[variant];
    };

    // Get animation duration based on speed
    const getAnimationDuration = (): string => {
      const speedMap = {
        slow: '2s',
        normal: '1s',
        fast: '0.5s',
      };
      return speedMap[speed];
    };

    const spinnerSize = getSizeValue();
    const spinnerColor = getColorValue();
    const animationDuration = getAnimationDuration();

    // Common wrapper props
    const wrapperProps = {
      ref,
      role: 'status',
      'aria-label': ariaLabel || label || 'Loading...',
      'data-use-system-colors': useSystemColors,
      'data-spinner-type': type,
      ...props,
    };

    // Circular spinner (default - CVA-based for backward compatibility)
    if (type === 'circular') {
      const spinnerElement = (
        <svg
          className={cn(
            spinnerVariants({ size, variant }),
            !useSystemColors && 'text-current',
            className
          )}
          style={{
            animationDuration,
            ...themeOverride,
          }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );

      if (label) {
        return (
          <div
            {...wrapperProps}
            className={cn('inline-flex items-center gap-2', className)}
          >
            {spinnerElement}
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        );
      }

      return (
        <div {...wrapperProps} className={cn('inline-flex', className)}>
          {spinnerElement}
        </div>
      );
    }

    // Dots spinner
    if (type === 'dots') {
      const dotSize = spinnerSize / 6;

      return (
        <div
          {...wrapperProps}
          className={cn('inline-flex items-center gap-1', className)}
          style={{
            ...themeOverride,
          }}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="rounded-full"
              style={{
                width: dotSize,
                height: dotSize,
                backgroundColor: spinnerColor,
                animation: `pulse-dot ${animationDuration} infinite ease-in-out`,
                animationDelay: `${index * 0.16}s`,
              }}
            />
          ))}
          {label && (
            <span className="ml-2 text-sm text-muted-foreground">{label}</span>
          )}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes pulse-dot {
                0%, 80%, 100% {
                  transform: scale(0.8);
                  opacity: 0.5;
                }
                40% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            `,
          }} />
        </div>
      );
    }

    // Pulse spinner
    if (type === 'pulse') {
      return (
        <div
          {...wrapperProps}
          className={cn('inline-flex items-center gap-2', className)}
        >
          <div
            className="rounded-full"
            style={{
              width: spinnerSize,
              height: spinnerSize,
              backgroundColor: spinnerColor,
              animation: `pulse-scale ${animationDuration} infinite ease-in-out`,
              ...themeOverride,
            }}
          />
          {label && (
            <span className="text-sm text-muted-foreground">{label}</span>
          )}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes pulse-scale {
                0%, 100% {
                  transform: scale(1);
                  opacity: 1;
                }
                50% {
                  transform: scale(1.2);
                  opacity: 0.7;
                }
              }
            `,
          }} />
        </div>
      );
    }

    return null;
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;
export { spinnerVariants };
