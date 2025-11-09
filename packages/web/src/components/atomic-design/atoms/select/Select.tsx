'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SelectProps } from './Select.types';

/**
 * Select - Atomic Design Atom
 *
 * A custom dropdown select component with keyboard navigation,
 * accessibility features, and theme integration.
 *
 * @example
 * ```tsx
 * <Select
 *   options={[
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2' }
 *   ]}
 *   placeholder="Choose an option"
 *   onValueChange={(value) => console.log(value)}
 * />
 * ```
 */
export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
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
      selectSize = 'md',
      isInvalid = false,
      isValid = false,
      isWarning = false,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-invalid': ariaInvalid,
      'aria-required': ariaRequired,
      'data-testid': dataTestId,
      themeOverride,
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(value || defaultValue || '');
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentValue = value !== undefined ? value : internalValue;
    const selectedOption = options.find((option) => option.value === currentValue);

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    const handleOptionClick = (optionValue: string) => {
      if (value === undefined) {
        setInternalValue(optionValue);
      }
      onValueChange?.(optionValue);
      setIsOpen(false);
    };

    // Keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          setIsOpen(!isOpen);
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            const currentIndex = options.findIndex((opt) => opt.value === currentValue);
            const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
            const nextOption = options[nextIndex];
            if (nextOption && !nextOption.disabled) {
              handleOptionClick(nextOption.value);
            }
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            const currentIndex = options.findIndex((opt) => opt.value === currentValue);
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
            const prevOption = options[prevIndex];
            if (prevOption && !prevOption.disabled) {
              handleOptionClick(prevOption.value);
            }
          }
          break;
        case 'Escape':
          if (isOpen) {
            event.preventDefault();
            setIsOpen(false);
          }
          break;
      }
    };

    // Variant classes
    const getSelectVariantClasses = () => {
      const baseClasses =
        'flex items-center justify-between w-full transition-colors duration-200 cursor-pointer';

      if (isInvalid) {
        return cn(
          baseClasses,
          'bg-background text-foreground border-destructive',
          'hover:border-destructive/80',
          'focus:border-destructive focus:ring-2 focus:ring-destructive/20',
        );
      }

      if (isValid) {
        return cn(
          baseClasses,
          'bg-background text-foreground border-green-500',
          'hover:border-green-600',
          'focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
        );
      }

      if (isWarning) {
        return cn(
          baseClasses,
          'bg-background text-foreground border-yellow-500',
          'hover:border-yellow-600',
          'focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20',
        );
      }

      switch (variant) {
        case 'ghost':
          return cn(
            baseClasses,
            'bg-transparent text-foreground border-transparent',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:bg-accent focus:text-accent-foreground',
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
            'hover:border-primary/50',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
          );
      }
    };

    // Size classes
    const getSizeClasses = () => {
      switch (selectSize) {
        case 'sm':
          return 'h-8 px-2 text-sm';
        case 'lg':
          return 'h-12 px-4 text-base';
        default:
          return 'h-10 px-3 text-sm';
      }
    };

    // Accessibility props
    const getAccessibilityProps = () => ({
      'aria-label': ariaLabel || 'Select an option',
      'aria-describedby': ariaDescribedby,
      'aria-invalid': isInvalid || ariaInvalid ? 'true' : 'false',
      'aria-required': ariaRequired ? 'true' : undefined,
      'aria-disabled': disabled ? 'true' : undefined,
    });

    const variantClasses = getSelectVariantClasses();
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

    return (
      <div className={cn('relative', className)} ref={selectRef} data-testid={dataTestId}>
        <div
          ref={ref}
          className={cn(variantClasses, sizeClasses, 'border rounded outline-none', {
            'opacity-50 cursor-not-allowed': disabled,
          })}
          style={combinedStyle}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid var(--focus-ring-color)';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          {...getAccessibilityProps()}
        >
          <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', {
              'rotate-180': isOpen,
            })}
          />
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-popover border border-border shadow-md max-h-60 overflow-auto"
            style={{ borderRadius: 'var(--radius)' }}
            role="listbox"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'flex items-center justify-between px-3 py-2 cursor-pointer transition-colors duration-200',
                  {
                    'opacity-50 cursor-not-allowed': option.disabled,
                    'hover:bg-accent hover:text-accent-foreground': !option.disabled,
                    'bg-accent text-accent-foreground': currentValue === option.value,
                    'text-popover-foreground': currentValue !== option.value,
                  },
                )}
                style={{
                  fontFamily: 'var(--typography-paragraph-font-family)',
                  fontSize: 'var(--typography-paragraph-font-size)',
                  letterSpacing: 'var(--typography-paragraph-letter-spacing)',
                  lineHeight: 'var(--typography-paragraph-line-height)',
                }}
                onClick={() => !option.disabled && handleOptionClick(option.value)}
                role="option"
                aria-selected={currentValue === option.value}
                aria-disabled={option.disabled ? 'true' : undefined}
              >
                <span>{option.label}</span>
                {currentValue === option.value && <Check className="h-4 w-4 text-primary" />}
              </div>
            ))}
          </div>
        )}
      </div>
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
    'selectSize',
    'isInvalid',
    'isValid',
    'isWarning',
    'className',
  ] as const;

  for (const prop of scalarProps) {
    if (prevProps[prop] !== nextProps[prop]) return false;
  }

  // Options array comparison
  if (prevProps.options.length !== nextProps.options.length) return false;

  for (let i = 0; i < prevProps.options.length; i++) {
    const prevOption = prevProps.options[i];
    const nextOption = nextProps.options[i];

    if (
      prevOption.value !== nextOption.value ||
      prevOption.label !== nextOption.label ||
      prevOption.disabled !== nextOption.disabled
    ) {
      return false;
    }
  }

  // Handler comparison
  if (prevProps.onValueChange !== nextProps.onValueChange) return false;

  return true;
});

MemoizedSelect.displayName = 'MemoizedSelect';

export default Select;
