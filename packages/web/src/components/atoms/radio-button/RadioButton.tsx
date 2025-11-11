'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { RadioButtonProps } from './RadioButton.types';

/**
 * RadioButton - Atomic Design Atom
 *
 * A custom-styled radio button with optional label and description.
 * Provides single-selection functionality with full keyboard navigation
 * and accessibility support.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('option1');
 *
 * <RadioButton
 *   name="options"
 *   value="option1"
 *   label="Option 1"
 *   checked={value === 'option1'}
 *   onChange={setValue}
 * />
 * ```
 */
export const RadioButton = React.forwardRef<HTMLDivElement, RadioButtonProps>(
  (
    {
      id,
      name,
      value,
      checked = false,
      disabled = false,
      variant = 'default',
      size = 'md',
      label,
      description,
      onChange,
      className = '',
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    const handleChange = () => {
      if (disabled) return;
      onChange?.(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleChange();
      }
    };

    // Variant classes for radio button border and focus ring
    const variantClasses = {
      default:
        'border-input hover:border-primary/50 focus:border-primary focus:ring-primary/20',
      error:
        'border-destructive hover:border-destructive/80 focus:border-destructive focus:ring-destructive/20',
      success:
        'border-success hover:border-success/80 focus:border-success focus:ring-success/20',
      warning:
        'border-warning hover:border-warning/80 focus:border-warning focus:ring-warning/20',
    }[variant];

    // Size classes for radio button
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    }[size];

    // Size classes for inner dot
    const dotSizeClasses = {
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
    }[size];

    // Color for inner dot based on variant
    const dotColorClasses = {
      default: 'bg-primary',
      error: 'bg-destructive',
      success: 'bg-success',
      warning: 'bg-warning',
    }[variant];

    // Disabled classes
    const disabledClasses = disabled
      ? 'bg-muted border-muted text-muted-foreground cursor-not-allowed'
      : 'bg-background cursor-pointer';

    return (
      <div
        ref={ref}
        className={cn('flex items-start gap-3', className)}
        data-testid={dataTestId}
        {...props}
      >
        {/* Hidden native radio for accessibility */}
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          aria-describedby={description ? `${id}-description` : undefined}
          data-testid={dataTestId ? `${dataTestId}-input` : undefined}
        />

        {/* Custom radio button */}
        <div
          role="radio"
          aria-checked={checked}
          aria-disabled={disabled}
          aria-label={label || value}
          tabIndex={disabled ? -1 : 0}
          onClick={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            // Base classes
            'flex items-center justify-center',
            'rounded-full border-2',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2',
            'relative',

            // Size
            sizeClasses,

            // Variant and state
            disabled ? disabledClasses : variantClasses,
          )}
          data-testid={dataTestId ? `${dataTestId}-custom` : undefined}
        >
          {/* Radio dot - only visible when checked */}
          {checked && (
            <div
              className={cn(
                'rounded-full transition-all duration-200',
                dotSizeClasses,
                dotColorClasses,
              )}
              data-testid={dataTestId ? `${dataTestId}-dot` : undefined}
            />
          )}
        </div>

        {/* Label and description */}
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
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
                data-testid={
                  dataTestId ? `${dataTestId}-description` : undefined
                }
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

RadioButton.displayName = 'RadioButton';

export default RadioButton;
