'use client';

/**
 * Input Component - Pure Atom (No Label/Description)
 *
 * A theme-aware input atom that handles only the input element itself.
 * For composed inputs with labels and error messages, use FormInput molecule.
 *
 * Features:
 * - Multiple variants (default, filled, outline)
 * - Three sizes (sm, md, lg)
 * - Validation states (default, error, success, warning)
 * - Full HTML input type support
 * - Theme integration with CSS variables
 * - Accessibility built-in (ARIA attributes)
 * - forwardRef for parent component access
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input type="text" placeholder="Enter text..." />
 *
 * // With variant and size
 * <Input variant="filled" size="lg" placeholder="Large filled input" />
 *
 * // Error state
 * <Input state="error" placeholder="Invalid input" />
 *
 * // With ref
 * const inputRef = useRef<HTMLInputElement>(null);
 * <Input ref={inputRef} />
 * ```
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { InputProps, InputVariant, InputSize, InputState } from './Input.types';

// Variant style mappings
const variantClasses: Record<InputVariant, string> = {
  default: 'border-input bg-background',
  filled: 'border-transparent bg-muted',
  outline: 'border-2 border-input bg-transparent',
};

// Size style mappings
const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
};

// State style mappings
const stateClasses: Record<InputState, string> = {
  default: '',
  error: 'border-destructive focus-visible:ring-destructive',
  success: 'border-success focus-visible:ring-success',
  warning: 'border-warning focus-visible:ring-warning',
};

// Base classes applied to all inputs
const baseClasses =
  'flex w-full rounded-md border transition-colors ' +
  'file:border-0 file:bg-transparent file:text-sm file:font-medium ' +
  'placeholder:text-muted-foreground ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Input atom component - Pure input element without label/description composition
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      state = 'default',
      className,
      themeOverride,
      useSystemColors = true,
      type = 'text',
      ...props
    },
    ref,
  ) => {
    // Build class names based on props
    const variantClass = useSystemColors ? variantClasses[variant] : '';
    const sizeClass = sizeClasses[size];
    const stateClass = stateClasses[state];

    return (
      <input
        ref={ref}
        type={type}
        className={cn(baseClasses, variantClass, sizeClass, stateClass, className)}
        style={themeOverride}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
