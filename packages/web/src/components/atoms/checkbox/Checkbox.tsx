'use client';

import React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CheckboxProps } from './Checkbox.types';

/**
 * Checkbox - Atomic Design Atom
 *
 * An interactive checkbox component with support for checked, unchecked, and indeterminate states.
 * Fully accessible with keyboard navigation and ARIA attributes.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   id="terms"
 *   label="Accept terms and conditions"
 *   checked={accepted}
 *   onChange={setAccepted}
 * />
 * ```
 *
 * @example Indeterminate state
 * ```tsx
 * <Checkbox
 *   id="select-all"
 *   label="Select all"
 *   checked={someSelected}
 *   indeterminate={someSelected && !allSelected}
 *   onChange={handleSelectAll}
 * />
 * ```
 */
export const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  (
    {
      id,
      name,
      checked = false,
      indeterminate = false,
      disabled = false,
      variant = 'default',
      size = 'md',
      label,
      description,
      onChange,
      className = '',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-required': ariaRequired,
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(checked);

    React.useEffect(() => {
      setInternalChecked(checked);
    }, [checked]);

    const handleChange = () => {
      if (disabled) return;
      const newChecked = !internalChecked;
      setInternalChecked(newChecked);
      onChange?.(newChecked);
    };

    // Variant classes
    const variantClasses = {
      default: disabled
        ? 'bg-muted border-muted text-muted-foreground'
        : 'border-input hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20',
      error: disabled
        ? 'bg-muted border-muted text-muted-foreground'
        : 'border-destructive hover:border-destructive/80 focus:border-destructive focus:ring-2 focus:ring-destructive/20',
      success: disabled
        ? 'bg-muted border-muted text-muted-foreground'
        : 'border-success hover:border-success/80 focus:border-success focus:ring-2 focus:ring-success/20',
      warning: disabled
        ? 'bg-muted border-muted text-muted-foreground'
        : 'border-warning hover:border-warning/80 focus:border-warning focus:ring-2 focus:ring-warning/20',
    }[variant];

    // Size classes
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    }[size];

    // Icon size classes
    const iconSizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-3.5 w-3.5',
      lg: 'h-4 w-4',
    }[size];

    const showCheck = internalChecked && !indeterminate;
    const showIndeterminate = indeterminate;

    return (
      <div
        ref={ref}
        className={cn('flex items-start gap-3', className)}
        data-testid={dataTestId}
        {...props}
      >
        {/* Hidden native checkbox for accessibility */}
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={internalChecked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          aria-describedby={description ? `${id}-description` : undefined}
          data-testid={dataTestId ? `${dataTestId}-input` : undefined}
        />

        {/* Custom checkbox */}
        <div
          role="checkbox"
          aria-checked={indeterminate ? 'mixed' : internalChecked}
          aria-disabled={disabled}
          aria-label={ariaLabel || (label ? undefined : 'Checkbox')}
          aria-labelledby={label && id ? `${id}-label` : undefined}
          aria-describedby={ariaDescribedby || (description ? `${id}-description` : undefined)}
          aria-required={ariaRequired}
          tabIndex={disabled ? -1 : 0}
          onClick={handleChange}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              handleChange();
            }
          }}
          className={cn(
            // Base classes
            'flex items-center justify-center',
            'transition-all duration-200',
            'border-2 rounded',
            'focus:outline-none',
            'relative',

            // Variant classes
            variantClasses,

            // Size classes
            sizeClasses,

            // State classes
            internalChecked ? 'bg-primary border-primary' : 'bg-background',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
          style={{
            borderRadius: 'var(--radius-checkbox, var(--radius))',
          }}
          data-testid={dataTestId ? `${dataTestId}-box` : undefined}
        >
          {/* Check icon */}
          {showCheck && (
            <Check
              className={cn(
                iconSizeClasses,
                'text-primary-foreground transition-all duration-200',
              )}
              strokeWidth={3}
              data-testid={dataTestId ? `${dataTestId}-check-icon` : undefined}
            />
          )}

          {/* Indeterminate icon */}
          {showIndeterminate && (
            <Minus
              className={cn(
                iconSizeClasses,
                'text-primary-foreground transition-all duration-200',
              )}
              strokeWidth={3}
              data-testid={dataTestId ? `${dataTestId}-indeterminate-icon` : undefined}
            />
          )}
        </div>

        {/* Label and description */}
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                id={id ? `${id}-label` : undefined}
                htmlFor={id}
                className={cn(
                  'text-foreground cursor-pointer',
                  disabled && 'text-muted-foreground cursor-not-allowed',
                )}
                style={{
                  fontFamily: 'var(--typography-emphasis-font-family)',
                  fontSize: 'var(--typography-emphasis-font-size)',
                  fontWeight: 'var(--typography-emphasis-font-weight)',
                  letterSpacing: 'var(--typography-emphasis-letter-spacing)',
                  lineHeight: 'var(--typography-emphasis-line-height)',
                }}
                data-testid={dataTestId ? `${dataTestId}-label` : undefined}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={`${id}-description`}
                className="text-muted-foreground text-sm"
                style={{
                  fontFamily: 'var(--typography-paragraph-font-family)',
                  fontSize: 'var(--typography-paragraph-font-size)',
                  fontWeight: 'var(--typography-paragraph-font-weight)',
                  letterSpacing: 'var(--typography-paragraph-letter-spacing)',
                  lineHeight: 'var(--typography-paragraph-line-height)',
                }}
                data-testid={dataTestId ? `${dataTestId}-description` : undefined}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
