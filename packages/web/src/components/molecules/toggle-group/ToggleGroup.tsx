'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type {
  ToggleGroupProps,
  ToggleGroupItem,
  ToggleGroupSize,
  ToggleGroupVariant,
} from './ToggleGroup.types';

/**
 * ToggleGroup - Atomic Design Molecule
 *
 * A group of toggle buttons for single or multiple selection with support for
 * different orientations, sizes, and visual variants. Combines multiple Toggle
 * atoms into a cohesive selection interface.
 *
 * @example
 * ```tsx
 * // Single selection
 * <ToggleGroup
 *   items={[
 *     { value: 'left', label: 'Left' },
 *     { value: 'center', label: 'Center' },
 *     { value: 'right', label: 'Right' },
 *   ]}
 *   value="center"
 *   onChange={(value) => console.log(value)}
 * />
 *
 * // Multiple selection
 * <ToggleGroup
 *   type="multiple"
 *   items={[
 *     { value: 'bold', label: 'B' },
 *     { value: 'italic', label: 'I' },
 *     { value: 'underline', label: 'U' },
 *   ]}
 *   value={['bold', 'italic']}
 * />
 * ```
 */
export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      items,
      type = 'single',
      value: controlledValue,
      defaultValue,
      size = 'md',
      variant = 'default',
      orientation = 'horizontal',
      disabled = false,
      connected = true,
      onChange,
      className = '',
      'aria-label': ariaLabel,
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState<string | string[]>(() => {
      if (defaultValue !== undefined) return defaultValue;
      return type === 'single' ? '' : [];
    });

    // Use controlled or uncontrolled value
    const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

    // Get size styles
    const getSizeStyles = (size: ToggleGroupSize) => {
      const sizeMap = {
        sm: {
          padding: 'px-3 py-1.5',
          fontSize: 'text-xs',
          gap: 'gap-1.5',
          iconSize: 'w-3.5 h-3.5',
          height: 'h-8',
        },
        md: {
          padding: 'px-4 py-2',
          fontSize: 'text-sm',
          gap: 'gap-1.5',
          iconSize: 'w-4 h-4',
          height: 'h-9',
        },
        lg: {
          padding: 'px-5 py-3',
          fontSize: 'text-base',
          gap: 'gap-2',
          iconSize: 'w-5 h-5',
          height: 'h-11',
        },
      };
      return sizeMap[size];
    };

    // Get variant classes
    const getVariantClasses = (variant: ToggleGroupVariant, isSelected: boolean) => {
      if (isSelected) {
        const selectedMap = {
          default: 'bg-accent text-accent-foreground',
          primary: 'bg-primary text-primary-foreground',
          secondary: 'bg-secondary text-secondary-foreground',
          outline: 'bg-accent text-accent-foreground border-accent',
        };
        return selectedMap[variant];
      }

      const unselectedMap = {
        default: 'bg-transparent hover:bg-muted hover:text-muted-foreground',
        primary: 'bg-card hover:bg-accent hover:text-accent-foreground border-primary',
        secondary: 'bg-card hover:bg-accent hover:text-accent-foreground border-secondary',
        outline: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
      };
      return unselectedMap[variant];
    };

    // Check if item is selected
    const isSelected = (itemValue: string) => {
      if (type === 'single') {
        return currentValue === itemValue;
      }
      return Array.isArray(currentValue) && currentValue.includes(itemValue);
    };

    // Handle item selection
    const handleItemToggle = (itemValue: string) => {
      if (disabled) return;

      let newValue: string | string[];

      if (type === 'single') {
        // Single selection - toggle off if same item, otherwise select new item
        newValue = currentValue === itemValue ? '' : itemValue;
      } else {
        // Multiple selection - toggle item in array
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        if (currentArray.includes(itemValue)) {
          newValue = currentArray.filter((v) => v !== itemValue);
        } else {
          newValue = [...currentArray, itemValue];
        }
      }

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent, itemValue: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleItemToggle(itemValue);
      }
    };

    const sizeStyles = getSizeStyles(size);

    // Get border radius classes based on position and connection
    const getBorderRadiusClasses = (index: number, totalItems: number) => {
      if (!connected || totalItems === 1) {
        return 'rounded-md';
      }

      if (orientation === 'horizontal') {
        if (index === 0) return 'rounded-l-md';
        if (index === totalItems - 1) return 'rounded-r-md';
        return '';
      } else {
        if (index === 0) return 'rounded-t-md';
        if (index === totalItems - 1) return 'rounded-b-md';
        return '';
      }
    };

    // Get border classes for connected items
    const getBorderClasses = (index: number) => {
      const baseClasses = 'border border-border';

      if (!connected) return baseClasses;

      if (orientation === 'horizontal' && index > 0) {
        return `${baseClasses} -ml-px`;
      }

      if (orientation === 'vertical' && index > 0) {
        return `${baseClasses} -mt-px`;
      }

      return baseClasses;
    };

    // Container classes
    const containerClasses = cn(
      'inline-flex',
      orientation === 'horizontal' ? 'flex-row' : 'flex-col',
      connected ? '' : 'gap-1',
      className,
    );

    return (
      <div
        ref={ref}
        className={containerClasses}
        role="group"
        aria-label={ariaLabel}
        data-testid={dataTestId}
        {...props}
      >
        {items.map((item: ToggleGroupItem, index: number) => {
          const isItemSelected = isSelected(item.value);
          const isItemDisabled = disabled || item.disabled;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleItemToggle(item.value)}
              onKeyDown={(e) => handleKeyDown(e, item.value)}
              disabled={isItemDisabled}
              aria-pressed={isItemSelected}
              aria-disabled={isItemDisabled}
              data-testid={dataTestId ? `${dataTestId}-item-${item.value}` : undefined}
              className={cn(
                // Base styles
                'inline-flex items-center justify-center',
                'font-medium whitespace-nowrap',
                'transition-all duration-200 ease-in-out',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20',
                'select-none',

                // Size classes
                sizeStyles.padding,
                sizeStyles.height,
                sizeStyles.fontSize,
                sizeStyles.gap,

                // Border and radius
                getBorderClasses(index),
                getBorderRadiusClasses(index, items.length),

                // Variant classes
                getVariantClasses(variant, isItemSelected),

                // Disabled state
                isItemDisabled && 'opacity-50 cursor-not-allowed',
                !isItemDisabled && 'cursor-pointer',
              )}
            >
              {item.icon && (
                <item.icon
                  className={cn('flex-shrink-0', sizeStyles.iconSize)}
                  aria-hidden="true"
                />
              )}
              {item.label}
            </button>
          );
        })}
      </div>
    );
  },
);

ToggleGroup.displayName = 'ToggleGroup';

export default ToggleGroup;
