'use client';

/**
 * InputGroup Component - Versatile Molecule (Multi-type input with label)
 *
 * A flexible form field molecule that can render as input, textarea, or select
 * with label, icons, and validation messages. Maintains backward compatibility
 * with the original InputGroup component.
 *
 * Features:
 * - Multiple input types (input, textarea, select)
 * - Label with optional required indicator
 * - Left and right icon support
 * - Error and success states
 * - Helper/error message display
 * - Full HTML input attribute support
 * - Accessibility built-in (ARIA)
 * - forwardRef for parent component access
 *
 * For standard form inputs without textarea/select support, consider using
 * the more specialized FormInput molecule.
 *
 * @example
 * ```tsx
 * // Basic input
 * <InputGroup label="Email" type="email" placeholder="your@email.com" />
 *
 * // With icons and error
 * <InputGroup
 *   label="Password"
 *   type="password"
 *   iconLeft={<Lock />}
 *   iconRight={<Eye />}
 *   onIconRightClick={togglePassword}
 *   variant="error"
 *   message="Password is required"
 * />
 *
 * // As textarea
 * <InputGroup
 *   label="Description"
 *   as="textarea"
 *   placeholder="Enter description..."
 * />
 *
 * // As select
 * <InputGroup
 *   label="Country"
 *   as="select"
 *   selectOptions={[
 *     { label: 'USA', value: 'us' },
 *     { label: 'Canada', value: 'ca' }
 *   ]}
 * />
 * ```
 */

import React, { forwardRef, useMemo, useId } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '../../primitives/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../primitives/ui/select';
import TextareaAutosize from 'react-textarea-autosize';
import type { InputGroupProps } from './InputGroup.types';

/**
 * InputGroup molecule - Versatile input component for various field types
 */
export const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
  (
    {
      label,
      message,
      iconLeft,
      iconRight,
      onIconRightClick,
      variant = 'default',
      as = 'input',
      className,
      selectOptions,
      disabled,
      required = false,
      id,
      ...props
    },
    ref,
  ) => {
    // Generate unique ID for label association if not provided
    const generatedId = useId();
    const inputId = id || generatedId;

    // Determine border styling based on variant
    const borderClass = useMemo(() => {
      switch (variant) {
        case 'error':
          return 'border-destructive focus-visible:ring-destructive/20';
        case 'success':
          return 'border-success focus-visible:ring-success/20';
        default:
          return 'border-input';
      }
    }, [variant]);

    // Determine message text color
    const messageClass = useMemo(() => {
      switch (variant) {
        case 'error':
          return 'text-body-xs text-destructive';
        case 'success':
          return 'text-body-xs text-success';
        default:
          return 'text-body-xs text-muted-foreground-m';
      }
    }, [variant]);

    return (
      <div className={cn('flex flex-col gap-[5px] w-full min-w-[200px]', className)}>
        {/* Label with required indicator */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-body-sm font-light text-foreground"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Input variant */}
          {as === 'input' && (
            <>
              {iconLeft && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                  {iconLeft}
                </div>
              )}
              <Input
                ref={ref}
                id={inputId}
                className={cn(
                  'h-input py-[10px] text-body-sm font-light rounded-[var(--radius-input)]',
                  iconLeft && 'pl-[36px]',
                  iconRight && 'pr-[36px]',
                  borderClass,
                  'transition-colors',
                  disabled && 'bg-muted opacity-100 cursor-not-allowed',
                  !disabled && 'bg-muted',
                  'placeholder:text-muted-foreground',
                )}
                disabled={disabled}
                aria-invalid={variant === 'error'}
                aria-describedby={message ? `${inputId}-message` : undefined}
                {...props}
              />
              {iconRight && (
                <div
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center',
                    onIconRightClick
                      ? 'cursor-pointer pointer-events-auto hover:text-foreground transition-colors'
                      : 'pointer-events-none',
                  )}
                  onClick={onIconRightClick}
                  role={onIconRightClick ? 'button' : undefined}
                  tabIndex={onIconRightClick ? 0 : undefined}
                  aria-label={onIconRightClick ? 'Toggle icon action' : undefined}
                  onKeyDown={
                    onIconRightClick
                      ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onIconRightClick();
                        }
                      }
                      : undefined
                  }
                >
                  {iconRight}
                </div>
              )}
            </>
          )}

          {/* Textarea variant */}
          {as === 'textarea' && (
            <div className="relative">
              <TextareaAutosize
                id={inputId}
                minRows={3}
                className={cn(
                  'flex w-full border bg-muted px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                  'resize-y text-body-sm font-light rounded-[var(--radius-input)]',
                  borderClass,
                  disabled && 'opacity-50',
                )}
                disabled={disabled}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange as any}
                aria-invalid={variant === 'error'}
                aria-describedby={message ? `${inputId}-message` : undefined}
              />
            </div>
          )}

          {/* Select variant */}
          {as === 'select' && (
            <Select disabled={disabled}>
              <SelectTrigger
                id={inputId}
                className={cn(
                  'h-input bg-muted border-input text-body-sm font-light rounded-[var(--radius-input)]',
                  borderClass,
                )}
                aria-invalid={variant === 'error'}
                aria-describedby={message ? `${inputId}-message` : undefined}
              >
                <SelectValue placeholder={props.placeholder || 'Select...'} />
              </SelectTrigger>
              <SelectContent className="bg-card-background-c">
                {selectOptions?.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className={cn(
                      'text-body-sm font-light focus:bg-accent-a focus:text-accent-foreground-a',
                      opt.selected && 'bg-accent-a text-accent-foreground-a',
                    )}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Helper text or error message */}
        {message && (
          <p
            id={`${inputId}-message`}
            className={cn('font-light', messageClass)}
            role={variant === 'error' ? 'alert' : undefined}
            aria-live={variant === 'error' ? 'polite' : undefined}
          >
            {message}
          </p>
        )}
      </div>
    );
  },
);

InputGroup.displayName = 'InputGroup';

export default InputGroup;
