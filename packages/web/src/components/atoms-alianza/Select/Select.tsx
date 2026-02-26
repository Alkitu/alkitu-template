'use client';

import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SelectProps, SelectOption, SelectGroupOption } from './Select.types';

/**
 * Select - Atomic Design Atom (Alianza)
 *
 * A robust dropdown select component built on Radix UI primitives.
 * Features keyboard navigation, accessibility, validation states, and theme integration.
 *
 * @example
 * ```tsx
 * // Simple usage
 * <Select
 *   options={[
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2' }
 *   ]}
 *   placeholder="Choose an option"
 *   onValueChange={(value) => console.log(value)}
 * />
 *
 * // Grouped options
 * <Select
 *   options={[
 *     {
 *       label: 'Fruits',
 *       options: [
 *         { value: 'apple', label: 'Apple' },
 *         { value: 'banana', label: 'Banana' }
 *       ]
 *     },
 *     {
 *       label: 'Vegetables',
 *       options: [
 *         { value: 'carrot', label: 'Carrot' },
 *         { value: 'lettuce', label: 'Lettuce' }
 *       ]
 *     }
 *   ]}
 * />
 *
 * // With validation
 * <Select
 *   options={options}
 *   value={value}
 *   onValueChange={setValue}
 *   isInvalid={!!error}
 *   required
 * />
 * ```
 */
export const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectProps
>(
  (
    {
      options,
      value,
      defaultValue,
      placeholder = 'Select an option...',
      disabled = false,
      onValueChange,
      className = '',
      variant = 'default',
      size = 'md',
      isInvalid = false,
      isValid = false,
      isWarning = false,
      required = false,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-invalid': ariaInvalid,
      'aria-required': ariaRequired,
      'data-testid': dataTestId,
      themeOverride,
      name,
      id,
    },
    ref,
  ) => {
    // Check if options are grouped
    const isGrouped = options.length > 0 && 'options' in options[0];

    // Get all flat options for easier lookup
    const flatOptions: SelectOption[] = isGrouped
      ? (options as SelectGroupOption[]).flatMap((group) => group.options)
      : (options as SelectOption[]);

    // Variant classes for trigger
    const getVariantClasses = () => {
      const baseClasses =
        'flex items-center justify-between w-full transition-colors duration-200';

      if (isInvalid) {
        return cn(
          baseClasses,
          'bg-background text-foreground border-destructive',
          'hover:bg-accent hover:border-destructive/80',
          'focus:border-destructive focus:ring-2 focus:ring-destructive/20',
        );
      }

      if (isValid) {
        return cn(
          baseClasses,
          'bg-background text-foreground border-green-500',
          'hover:bg-accent hover:border-green-600',
          'focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
        );
      }

      if (isWarning) {
        return cn(
          baseClasses,
          'bg-background text-foreground border-yellow-500',
          'hover:bg-accent hover:border-yellow-600',
          'focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20',
        );
      }

      switch (variant) {
        case 'ghost':
          return cn(
            baseClasses,
            'bg-transparent text-foreground border-transparent',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:bg-accent focus:text-accent-foreground focus:ring-2 focus:ring-primary/20',
          );
        case 'filled':
          return cn(
            baseClasses,
            'bg-muted text-foreground border-transparent',
            'hover:bg-muted/80',
            'focus:bg-background focus:border-input focus:ring-2 focus:ring-primary/20',
          );
        default:
          return cn(
            baseClasses,
            'bg-background text-foreground border-input',
            'hover:bg-accent hover:border-primary/50',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
          );
      }
    };

    // Size classes
    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'h-8 px-2 text-sm';
        case 'lg':
          return 'h-12 px-4 text-base';
        default:
          return 'h-10 px-3 text-sm';
      }
    };

    const variantClasses = getVariantClasses();
    const sizeClasses = getSizeClasses();

    // Focus ring color based on state
    const focusRingColor = isInvalid
      ? 'var(--colors-destructive, #DC2626)'
      : isWarning
        ? 'var(--colors-warning, #D97706)'
        : isValid
          ? 'var(--colors-success, #16A34A)'
          : 'var(--colors-primary, #0066CC)';

    const combinedStyle = {
      borderRadius: 'var(--radius)',
      fontFamily: 'var(--typography-paragraph-font-family)',
      fontSize: 'var(--typography-paragraph-font-size)',
      letterSpacing: 'var(--typography-paragraph-letter-spacing)',
      lineHeight: 'var(--typography-paragraph-line-height)',
      '--focus-ring-color': focusRingColor,
      ...themeOverride,
    } as React.CSSProperties;

    // Render options
    const renderOptions = () => {
      if (isGrouped) {
        return (options as SelectGroupOption[]).map((group) => (
          <SelectPrimitive.Group key={group.label}>
            <SelectPrimitive.Label className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              {group.label}
            </SelectPrimitive.Label>
            {group.options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={cn(
                  'relative flex items-center gap-2 px-8 py-2 text-sm cursor-pointer',
                  'outline-none select-none transition-colors duration-200',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground',
                  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                )}
                style={{
                  fontFamily: 'var(--typography-paragraph-font-family)',
                  fontSize: 'var(--typography-paragraph-font-size)',
                }}
              >
                <SelectPrimitive.ItemText>
                  <span className="flex items-center gap-2">
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <span>{option.label}</span>
                  </span>
                </SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute left-2 flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
            <SelectPrimitive.Separator className="my-1 h-px bg-border" />
          </SelectPrimitive.Group>
        ));
      }

      return (flatOptions as SelectOption[]).map((option) => (
        <SelectPrimitive.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className={cn(
            'relative flex items-center gap-2 px-8 py-2 text-sm cursor-pointer',
            'outline-none select-none transition-colors duration-200',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:bg-accent focus:text-accent-foreground',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          )}
          style={{
            fontFamily: 'var(--typography-paragraph-font-family)',
            fontSize: 'var(--typography-paragraph-font-size)',
          }}
        >
          <SelectPrimitive.ItemText>
            <span className="flex items-center gap-2">
              {option.icon && <span className="shrink-0">{option.icon}</span>}
              <span>{option.label}</span>
            </span>
          </SelectPrimitive.ItemText>
          <SelectPrimitive.ItemIndicator className="absolute left-2 flex items-center justify-center">
            <Check className="h-4 w-4" />
          </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
      ));
    };

    return (
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
        required={required}
      >
        <SelectPrimitive.Trigger
          ref={ref}
          id={id}
          className={cn(
            variantClasses,
            sizeClasses,
            'border rounded outline-none',
            {
              'opacity-50 cursor-not-allowed': disabled,
            },
            className,
          )}
          style={combinedStyle}
          aria-label={ariaLabel || placeholder}
          aria-describedby={ariaDescribedby}
          aria-invalid={isInvalid || ariaInvalid ? 'true' : 'false'}
          aria-required={required || ariaRequired ? 'true' : undefined}
          data-testid={dataTestId}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              'relative z-50 max-h-96 min-w-[8rem] overflow-hidden',
              'rounded-[var(--radius-select)] border bg-popover text-popover-foreground shadow-md',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'data-[side=bottom]:slide-in-from-top-2',
              'data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2',
              'data-[side=top]:slide-in-from-bottom-2',
            )}
            style={{ borderRadius: 'var(--radius)' }}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1">{renderOptions()}</SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  },
);

Select.displayName = 'Select';

/**
 * Memoized Select component for performance optimization
 * Use this when passing stable options arrays
 */
export const MemoizedSelect = React.memo(Select, (prevProps, nextProps) => {
  // Quick scalar props comparison
  const scalarProps = [
    'value',
    'defaultValue',
    'placeholder',
    'disabled',
    'variant',
    'size',
    'isInvalid',
    'isValid',
    'isWarning',
    'required',
    'className',
    'name',
    'id',
  ] as const;

  for (const prop of scalarProps) {
    if (prevProps[prop] !== nextProps[prop]) return false;
  }

  // Options array comparison
  if (prevProps.options.length !== nextProps.options.length) return false;

  // Check if grouped or flat
  const prevIsGrouped = prevProps.options.length > 0 && 'options' in prevProps.options[0];
  const nextIsGrouped = nextProps.options.length > 0 && 'options' in nextProps.options[0];

  if (prevIsGrouped !== nextIsGrouped) return false;

  // Deep comparison of options
  for (let i = 0; i < prevProps.options.length; i++) {
    const prevOpt = prevProps.options[i];
    const nextOpt = nextProps.options[i];

    if (prevIsGrouped) {
      const prevGroup = prevOpt as SelectGroupOption;
      const nextGroup = nextOpt as SelectGroupOption;

      if (prevGroup.label !== nextGroup.label) return false;
      if (prevGroup.options.length !== nextGroup.options.length) return false;

      for (let j = 0; j < prevGroup.options.length; j++) {
        if (
          prevGroup.options[j].value !== nextGroup.options[j].value ||
          prevGroup.options[j].label !== nextGroup.options[j].label ||
          prevGroup.options[j].disabled !== nextGroup.options[j].disabled
        ) {
          return false;
        }
      }
    } else {
      const prevOption = prevOpt as SelectOption;
      const nextOption = nextOpt as SelectOption;

      if (
        prevOption.value !== nextOption.value ||
        prevOption.label !== nextOption.label ||
        prevOption.disabled !== nextOption.disabled
      ) {
        return false;
      }
    }
  }

  // Handler comparison
  if (prevProps.onValueChange !== nextProps.onValueChange) return false;

  return true;
});

MemoizedSelect.displayName = 'MemoizedSelect';

export default Select;
