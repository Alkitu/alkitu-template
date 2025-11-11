'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { SpacerProps } from './Spacer.types';

/**
 * Spacer - Atomic Design Atom
 *
 * Provides consistent spacing based on the theme's spacing system.
 * Used to create visual separation between components.
 *
 * @example
 * ```tsx
 * // Vertical spacer (default)
 * <Spacer size="md" />
 *
 * // Horizontal spacer
 * <Spacer size="lg" direction="horizontal" />
 *
 * // Custom spacing
 * <Spacer spacing="32px" />
 *
 * // Both directions (square spacer)
 * <Spacer size="sm" direction="both" />
 * ```
 */
export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  (
    {
      size = 'md',
      direction = 'vertical',
      spacing,
      className = '',
      style = {},
      ...props
    },
    ref,
  ) => {
    // Get spacing from CSS variables
    // The base spacing is controlled by --spacing or defaults to 2.2rem (35.2px)
    const getSpacingValue = React.useCallback(() => {
      if (spacing) return spacing; // Custom spacing overrides size

      // Calculate spacing values based on CSS variable
      // These multipliers create a consistent spacing scale
      const spacingMap: Record<string, string> = {
        xs: 'calc(var(--spacing, 2.2rem) * 0.5)', // 0.5x base (11px default)
        sm: 'calc(var(--spacing, 2.2rem) * 1)', // 1x base (22px default)
        md: 'calc(var(--spacing, 2.2rem) * 2)', // 2x base (44px default)
        lg: 'calc(var(--spacing, 2.2rem) * 4)', // 4x base (88px default)
        xl: 'calc(var(--spacing, 2.2rem) * 6)', // 6x base (132px default)
        '2xl': 'calc(var(--spacing, 2.2rem) * 8)', // 8x base (176px default)
      };

      return spacingMap[size];
    }, [size, spacing]);

    const spacingValue = getSpacingValue();

    // Calculate dimensions based on direction
    const dimensions = React.useMemo(() => {
      switch (direction) {
        case 'horizontal':
          return {
            width: spacingValue,
            height: '1px',
            minWidth: spacingValue,
          };
        case 'vertical':
          return {
            width: '1px',
            height: spacingValue,
            minHeight: spacingValue,
          };
        case 'both':
          return {
            width: spacingValue,
            height: spacingValue,
            minWidth: spacingValue,
            minHeight: spacingValue,
          };
        default:
          return {
            width: '1px',
            height: spacingValue,
            minHeight: spacingValue,
          };
      }
    }, [direction, spacingValue]);

    return (
      <div
        ref={ref}
        className={cn('spacer', className)}
        style={{
          ...dimensions,
          flexShrink: 0, // Prevent spacer from shrinking in flex containers
          ...style,
        }}
        aria-hidden="true" // Spacer is decorative, hide from screen readers
        data-spacing-size={size}
        data-spacing-direction={direction}
        data-spacing-value={spacingValue}
        {...props}
      />
    );
  },
);

Spacer.displayName = 'Spacer';

export default Spacer;
