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
  isWarning = false
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
        }}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
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