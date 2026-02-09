'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { ToggleProps, ToggleVariant, ToggleSize } from './Toggle.types';

/**
 * Toggle - Atomic Design Atom
 *
 * A toggle switch component for boolean on/off states with support for labels,
 * descriptions, variants, and sizes. Supports both controlled and uncontrolled modes.
 * Merges the best features from Standard and Alianza implementations.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Toggle
 *   label="Enable notifications"
 *   description="Receive email notifications"
 *   onChange={(checked) => console.log(checked)}
 * />
 *
 * // Controlled
 * <Toggle
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 *   variant="success"
 *   size="lg"
 * />
 *
 * // Radix-compatible API
 * <Toggle
 *   checked={isEnabled}
 *   onCheckedChange={setIsEnabled}
 * />
 * ```
 */
export const Toggle = React.forwardRef<HTMLDivElement, ToggleProps>(
  (
    {
      id,
      name,
      checked,
      defaultChecked = false,
      disabled = false,
      variant = 'default',
      size = 'md',
      label,
      description,
      onChange,
      onCheckedChange,
      className = '',
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    // Internal state for uncontrolled mode
    const [internalChecked, setInternalChecked] = React.useState(
      checked !== undefined ? checked : defaultChecked,
    );

    // Use controlled value if provided, otherwise use internal state
    const isChecked = checked !== undefined ? checked : internalChecked;

    // Sync internal state with controlled prop
    React.useEffect(() => {
      if (checked !== undefined) {
        setInternalChecked(checked);
      }
    }, [checked]);

    const handleToggle = () => {
      if (disabled) return;

      const newChecked = !isChecked;

      // Update internal state if uncontrolled
      if (checked === undefined) {
        setInternalChecked(newChecked);
      }

      // Call onChange callback (support both APIs)
      onChange?.(newChecked);
      onCheckedChange?.(newChecked);
    };

    // Variant classes for the toggle switch
    const getVariantClasses = (
      variant: ToggleVariant,
      disabled: boolean,
      checked: boolean,
    ): string => {
      const baseClasses =
        'relative inline-flex cursor-pointer transition-colors duration-300 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2';

      if (disabled) {
        return cn(baseClasses, 'bg-muted cursor-not-allowed focus:ring-muted');
      }

      if (!checked) {
        return cn(baseClasses, 'bg-input hover:bg-muted focus:ring-primary/20');
      }

      const variantMap = {
        default: 'bg-primary hover:bg-primary/90 focus:ring-primary/20',
        success: 'bg-success hover:bg-success/90 focus:ring-success/20',
        warning: 'bg-warning hover:bg-warning/90 focus:ring-warning/20',
        error: 'bg-destructive hover:bg-destructive/90 focus:ring-destructive/20',
      };

      return cn(baseClasses, variantMap[variant]);
    };

    // Size classes for container and thumb
    const getSizeClasses = (size: ToggleSize) => {
      const sizeMap = {
        sm: {
          container: 'h-5 w-9',
          thumb: 'h-3.5 w-3.5',
          translate: 'translate-x-4',
        },
        md: {
          container: 'h-6 w-11',
          thumb: 'h-4.5 w-4.5',
          translate: 'translate-x-5',
        },
        lg: {
          container: 'h-7 w-12',
          thumb: 'h-5.5 w-5.5',
          translate: 'translate-x-5',
        },
      };

      return sizeMap[size];
    };

    const toggleClasses = getVariantClasses(variant, disabled, isChecked);
    const sizeClasses = getSizeClasses(size);

    return (
      <div
        ref={ref}
        className={cn('flex items-start gap-3', className)}
        data-testid={dataTestId}
        {...props}
      >
        {/* Hidden native checkbox for accessibility and form integration */}
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={isChecked}
          disabled={disabled}
          onChange={handleToggle}
          className="sr-only"
          aria-describedby={description ? `${id}-description` : undefined}
          tabIndex={-1}
        />

        {/* Toggle switch button */}
        <button
          type="button"
          role="switch"
          aria-checked={isChecked}
          aria-disabled={disabled}
          aria-label={label || 'Toggle switch'}
          onClick={handleToggle}
          disabled={disabled}
          className={cn(toggleClasses, sizeClasses.container, 'relative')}
          data-testid={dataTestId ? `${dataTestId}-button` : undefined}
        >
          {/* Toggle thumb */}
          <span
            className={cn(
              'absolute rounded-full bg-background shadow-lg',
              'transition-transform duration-300 ease-in-out',
              'top-1/2 left-1 -translate-y-1/2',
              sizeClasses.thumb,
              isChecked ? sizeClasses.translate : 'translate-x-0',
            )}
            data-testid={dataTestId ? `${dataTestId}-thumb` : undefined}
          />
        </button>

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
                className="text-muted-foreground text-sm mt-1"
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

Toggle.displayName = 'Toggle';

export default Toggle;
