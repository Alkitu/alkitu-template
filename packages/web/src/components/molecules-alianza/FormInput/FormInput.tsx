import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { FormInputProps } from './FormInput.types';

/**
 * FormInput Component
 *
 * A molecule component that combines a label, input field, optional icons,
 * and error message display into a complete form input element.
 *
 * This component follows the Atomic Design methodology and provides:
 * - Accessible label-input association
 * - Optional left and right icons
 * - Error state with visual feedback
 * - Disabled state support
 * - Full HTML input attributes support via props spreading
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <FormInput label="Email" type="email" placeholder="Enter your email" />
 *
 * // With icons
 * <FormInput
 *   label="Password"
 *   type="password"
 *   icon={<LockIcon />}
 *   iconRight={<EyeIcon />}
 * />
 *
 * // With error
 * <FormInput
 *   label="Username"
 *   error="Username is required"
 *   value=""
 * />
 * ```
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon, iconRight, error, className, id, ...props }, ref) => {
    // Generate a unique ID for proper label-input association
    const inputId = id || `form-input-${React.useId()}`;

    return (
      <div className={cn("flex flex-col gap-2 items-start w-full", className)} data-testid="form-input-wrapper">
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
          data-testid="form-input-label"
        >
          {label}
        </label>
        <div
          className={cn(
            "flex h-10 w-full rounded-[var(--radius-input)] border bg-background px-3 items-center gap-2 ring-offset-background transition-colors relative",
            error ? "border-destructive focus-within:ring-destructive" : "border-input focus-within:ring-primary",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2",
            props.disabled && "cursor-not-allowed opacity-50 bg-muted"
          )}
          data-testid="form-input-container"
        >
          {icon && (
            <div className="shrink-0 flex items-center justify-center text-muted-foreground [&>svg]:size-4" data-testid="form-input-icon-left">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className="flex-1 w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            data-testid="form-input-field"
            {...props}
          />
          {iconRight && (
            <div className="shrink-0 flex items-center justify-center text-muted-foreground" data-testid="form-input-icon-right">
              {iconRight}
            </div>
          )}
        </div>
        {error && (
          <span
            id={`${inputId}-error`}
            className="text-sm text-destructive"
            role="alert"
            data-testid="form-input-error"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
