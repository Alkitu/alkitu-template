'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  className?: string;
  variant?: 'default' | 'ghost' | 'filled';
  selectSize?: 'sm' | 'md' | 'lg';
  isInvalid?: boolean;
  isValid?: boolean;
  isWarning?: boolean;
  // Accessibility props (NEW - additive only)
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

const getSelectVariantClasses = (variant: string, isInvalid: boolean, isValid: boolean, isWarning: boolean) => {
  const baseClasses = 'flex items-center justify-between w-full transition-colors duration-200 cursor-pointer';
  
  if (isInvalid) {
    return `${baseClasses} bg-background text-foreground border-destructive hover:border-destructive/80 focus:border-destructive focus:ring-2 focus:ring-destructive/20`;
  }
  
  if (isValid) {
    return `${baseClasses} bg-background text-foreground border-success hover:border-success/80 focus:border-success focus:ring-2 focus:ring-success/20`;
  }
  
  if (isWarning) {
    return `${baseClasses} bg-background text-foreground border-warning hover:border-warning/80 focus:border-warning focus:ring-2 focus:ring-warning/20`;
  }

  switch (variant) {
    case 'ghost':
      return `${baseClasses} bg-transparent text-foreground border-transparent hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground`;
    case 'filled':
      return `${baseClasses} bg-muted text-foreground border-transparent hover:bg-muted/80 focus:bg-background focus:border-input focus:ring-2 focus:ring-primary/20`;
    default:
      return `${baseClasses} bg-background text-foreground border-input hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20`;
  }
};

const getSizeClasses = (selectSize: string) => {
  switch (selectSize) {
    case 'sm':
      return 'h-8 px-2 text-sm';
    case 'lg':
      return 'h-12 px-4 text-base';
    default:
      return 'h-10 px-3 text-sm';
  }
};

export function Select({
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
  'aria-required': ariaRequired
}: SelectProps) {
  const [internalValue, setInternalValue] = useState(value || defaultValue || '');
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find(option => option.value === currentValue);

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

  // Keyboard accessibility enhancements (NEW - additive only)
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
          // Navigate to next option
          const currentIndex = options.findIndex(opt => opt.value === currentValue);
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
          // Navigate to previous option
          const currentIndex = options.findIndex(opt => opt.value === currentValue);
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

  // Accessibility helper function (NEW - additive only)
  const getAccessibilityProps = () => ({
    'aria-label': ariaLabel || 'Select an option',
    'aria-describedby': ariaDescribedby,
    'aria-invalid': isInvalid || ariaInvalid ? 'true' : 'false',
    'aria-required': ariaRequired ? 'true' : undefined,
    'aria-disabled': disabled ? 'true' : undefined,
  });

  const variantClasses = getSelectVariantClasses(variant, isInvalid, isValid, isWarning);
  const sizeClasses = getSizeClasses(selectSize);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <div
        className={`
          ${variantClasses}
          ${sizeClasses}
          border rounded outline-none
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{
          borderRadius: 'var(--radius)',
          fontFamily: 'var(--typography-paragraph-font-family)',
          fontSize: 'var(--typography-paragraph-font-size)',
          letterSpacing: 'var(--typography-paragraph-letter-spacing)',
          lineHeight: 'var(--typography-paragraph-line-height)',
          // Enhanced focus indicators (CSS only) - NEW accessibility enhancement
          '--focus-ring-color': isInvalid
            ? 'var(--colors-destructive, #DC2626)'
            : isWarning
            ? 'var(--colors-warning, #D97706)'
            : isValid
            ? 'var(--colors-success, #16A34A)'
            : 'var(--colors-primary, #0066CC)',
        } as React.CSSProperties}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          // Enhanced focus ring for accessibility
          e.currentTarget.style.outline = '2px solid var(--focus-ring-color)';
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          // Remove focus ring when not focused
          e.currentTarget.style.outline = 'none';
        }}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        {...(getAccessibilityProps() as React.HTMLAttributes<HTMLDivElement>)}
      >
        <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
              className={`
                flex items-center justify-between px-3 py-2 cursor-pointer transition-colors duration-200
                ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground'}
                ${currentValue === option.value ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'}
              `}
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
              {currentValue === option.value && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Performance Optimization Wrapper (NEW - ETAPA 3: Performance Optimization)
// React.memo wrapper para Select component con optimizaciones específicas
export const MemoizedSelect = React.memo(Select, (prevProps, nextProps) => {
  // Optimización crítica para Select - evitar re-renders cuando las options no cambian

  // Comparación rápida de props escalares
  const scalarProps = [
    'value', 'defaultValue', 'placeholder', 'disabled', 'variant',
    'selectSize', 'isInvalid', 'isValid', 'isWarning', 'className'
  ];

  for (const prop of scalarProps) {
    if ((prevProps as Record<string, unknown>)[prop] !== (nextProps as Record<string, unknown>)[prop]) return false;
  }

  // Comparación optimizada de opciones (array complejo)
  if (prevProps.options.length !== nextProps.options.length) return false;

  for (let i = 0; i < prevProps.options.length; i++) {
    const prevOption = prevProps.options[i];
    const nextOption = nextProps.options[i];

    if (prevOption.value !== nextOption.value ||
        prevOption.label !== nextOption.label ||
        prevOption.disabled !== nextOption.disabled) {
      return false;
    }
  }

  // Verificar handlers críticos
  if (prevProps.onValueChange !== nextProps.onValueChange) return false;

  return true; // Todas las props relevantes son iguales
});

MemoizedSelect.displayName = 'MemoizedSelect';

export default Select;