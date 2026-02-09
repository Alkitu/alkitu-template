import React from 'react';
import { cn } from '@/lib/utils';
import type { FormTextareaProps } from './FormTextarea.types';

/**
 * FormTextarea Component
 *
 * A form textarea field with label and error message support.
 * Follows Atomic Design methodology as a Molecule component.
 *
 * @example
 * ```tsx
 * <FormTextarea
 *   label="Description"
 *   placeholder="Enter description..."
 *   error="Description is required"
 * />
 * ```
 */
export function FormTextarea({ label, error, className, ...props }: FormTextareaProps) {
  return (
    <div className={cn("flex flex-col gap-2 items-start w-full", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
        {label}
      </label>
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-destructive focus-visible:ring-destructive" : "border-input focus-visible:ring-primary",
          className
        )}
        {...props}
      />
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}
