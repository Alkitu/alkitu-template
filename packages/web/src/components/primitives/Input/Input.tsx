'use client';

/**
 * Input Component - Theme-Aware Implementation
 *
 * Uses comprehensive CSS variable system for dynamic theming:
 * - Typography: --typography-input-* variables
 * - Border Radius: --radius-input
 * - Spacing: --spacing-* variables
 * - Transitions: --transition-base
 * - Colors: Tailwind classes with CSS variables (--input, --ring, etc.)
 *
 * All variables automatically respond to theme changes via DynamicThemeProvider.
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 *
 * @example
 * ```tsx
 * <Input type="text" placeholder="Enter text..." />
 * <Input type="email" placeholder="your@email.com" />
 * <Input type="password" placeholder="Password" />
 * ```
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { InputProps } from './Input.types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', style, ...props }, ref) => {
    // Base input styles using comprehensive CSS variable system
    const baseStyles: React.CSSProperties = {
      // Typography - Use component-specific input typography variables
      fontFamily: 'var(--typography-input-family, var(--font-sans))',
      fontSize: 'var(--typography-input-size, 0.875rem)',
      fontWeight: 'var(--typography-input-weight, 400)',
      lineHeight: 'var(--typography-input-line-height, 1.25rem)',

      // Border radius - Use component-specific input radius
      borderRadius: 'var(--radius-input, var(--radius, 0.375rem))',

      // Transitions - Use standardized transition variables
      transition: 'all var(--transition-base, 200ms cubic-bezier(0.4, 0, 0.2, 1))',
    };

    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        style={{
          ...baseStyles,
          ...style,
        }}
        className={cn(
          // Base styles
          'flex h-9 w-full min-w-0 border px-3 py-1 text-base outline-none',
          // Border and background
          'border-input bg-input-background',
          // Text colors
          'text-foreground placeholder:text-muted-foreground',
          // Selection
          'selection:bg-primary selection:text-primary-foreground',
          // Focus states
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          // Invalid states
          'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
          'dark:aria-invalid:ring-destructive/40',
          // Disabled states
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          // File input specific styles
          'file:inline-flex file:h-7 file:border-0 file:bg-transparent',
          'file:text-sm file:font-medium file:text-foreground',
          // Dark mode
          'dark:bg-input/30',
          // Custom className
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
