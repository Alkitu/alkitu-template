'use client';

import React from 'react';
import { Check, Minus } from 'lucide-react';

interface CheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'error' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
  // Accessibility props (NEW - additive only)
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
}

const getCheckboxVariantClasses = (variant: string, disabled: boolean) => {
  const baseClasses = 'flex items-center justify-center transition-all duration-200 border-2 rounded';
  
  if (disabled) {
    return `${baseClasses} bg-muted border-muted text-muted-foreground`;
  }

  switch (variant) {
    case 'error':
      return `${baseClasses} border-destructive hover:border-destructive/80 focus:border-destructive focus:ring-2 focus:ring-destructive/20`;
    case 'success':
      return `${baseClasses} border-success hover:border-success/80 focus:border-success focus:ring-2 focus:ring-success/20`;
    default:
      return `${baseClasses} border-input hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20`;
  }
};

const getCheckboxSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return 'h-4 w-4';
    case 'lg':
      return 'h-6 w-6';
    default:
      return 'h-5 w-5';
  }
};

const getIconSize = (size: string) => {
  switch (size) {
    case 'sm':
      return 'h-3 w-3';
    case 'lg':
      return 'h-4 w-4';
    default:
      return 'h-3.5 w-3.5';
  }
};

export function Checkbox({
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
  'aria-required': ariaRequired
}: CheckboxProps) {
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

  const checkboxClasses = getCheckboxVariantClasses(variant, disabled);
  const sizeClasses = getCheckboxSizeClasses(size);
  const iconSizeClasses = getIconSize(size);

  const showCheck = internalChecked && !indeterminate;
  const showIndeterminate = indeterminate;

  return (
    <div className={`flex items-start gap-3 ${className}`}>
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
      />
      
      {/* Custom checkbox */}
      <div
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : internalChecked}
        aria-disabled={disabled}
        aria-label={ariaLabel || (label ? undefined : 'Checkbox')}
        aria-describedby={ariaDescribedby || (description ? `${id}-description` : undefined)}
        aria-required={ariaRequired ? 'true' : undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={handleChange}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleChange();
          }
        }}
        onFocus={(e) => {
          // Enhanced focus ring for accessibility
          const focusColor = variant === 'error'
            ? 'var(--colors-destructive, #DC2626)'
            : variant === 'success'
            ? 'var(--colors-success, #16A34A)'
            : 'var(--colors-primary, #0066CC)';
          e.currentTarget.style.outline = `2px solid ${focusColor}`;
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          // Remove focus ring
          e.currentTarget.style.outline = 'none';
        }}
        className={`${checkboxClasses} ${sizeClasses} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} focus:outline-none relative ${
          internalChecked ? 'bg-primary border-primary' : 'bg-background'
        }`}
        style={{
          borderRadius: 'var(--radius-checkbox, var(--radius))',
        }}
      >
        {/* Check icon */}
        {showCheck && (
          <Check 
            className={`${iconSizeClasses} text-primary-foreground transition-all duration-200`}
            strokeWidth={3}
          />
        )}
        
        {/* Indeterminate icon */}
        {showIndeterminate && (
          <Minus 
            className={`${iconSizeClasses} text-primary-foreground transition-all duration-200`}
            strokeWidth={3}
          />
        )}
      </div>

      {/* Label and description */}
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={id}
              className={`text-foreground cursor-pointer ${disabled ? 'text-muted-foreground cursor-not-allowed' : ''}`}
              style={{
                fontFamily: 'var(--typography-emphasis-font-family)',
                fontSize: 'var(--typography-emphasis-font-size)',
                fontWeight: 'var(--typography-emphasis-font-weight)',
                letterSpacing: 'var(--typography-emphasis-letter-spacing)',
                lineHeight: 'var(--typography-emphasis-line-height)',
              }}
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
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}