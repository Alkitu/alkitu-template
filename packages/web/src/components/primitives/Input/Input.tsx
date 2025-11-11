'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { InputProps } from './Input.types';

/**
 * Input - Design System Primitive
 *
 * A themeable input component with CSS variable support.
 * Supports all standard HTML input types and attributes.
 *
 * @example
 * ```tsx
 * <Input type="text" placeholder="Enter text..." />
 * <Input type="email" placeholder="your@email.com" />
 * <Input type="password" placeholder="Password" />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          // Base styles
          'flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none',
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
