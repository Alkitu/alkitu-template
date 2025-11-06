'use client';

import React from 'react';

interface RadioButtonProps {
  id?: string;
  name: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'error' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const getRadioVariantClasses = (variant: string, disabled: boolean) => {
  const baseClasses = 'flex items-center justify-center transition-all duration-200 border-2 rounded-full relative';
  
  if (disabled) {
    return `${baseClasses} bg-muted border-muted text-muted-foreground cursor-not-allowed`;
  }

  switch (variant) {
    case 'error':
      return `${baseClasses} border-destructive hover:border-destructive/80 focus:border-destructive focus:ring-2 focus:ring-destructive/20`;
    case 'success':
      return `${baseClasses} border-success hover:border-success/80 focus:border-success focus:ring-2 focus:ring-success/20`;
    case 'warning':
      return `${baseClasses} border-warning hover:border-warning/80 focus:border-warning focus:ring-2 focus:ring-warning/20`;
    default:
      return `${baseClasses} border-input hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20`;
  }
};

const getRadioSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return 'h-4 w-4';
    case 'lg':
      return 'h-6 w-6';
    default:
      return 'h-5 w-5';
  }
};

const getDotSize = (size: string) => {
  switch (size) {
    case 'sm':
      return 'h-2 w-2';
    case 'lg':
      return 'h-3 w-3';
    default:
      return 'h-2.5 w-2.5';
  }
};

const getDotColor = (variant: string) => {
  switch (variant) {
    case 'error':
      return 'bg-destructive';
    case 'success':
      return 'bg-success';
    case 'warning':
      return 'bg-warning';
    default:
      return 'bg-primary';
  }
};

export function RadioButton({
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
  className = ''
}: RadioButtonProps) {
  const handleChange = () => {
    if (disabled) return;
    onChange?.(value);
  };

  const radioClasses = getRadioVariantClasses(variant, disabled);
  const sizeClasses = getRadioSizeClasses(size);
  const dotSizeClasses = getDotSize(size);
  const dotColorClasses = getDotColor(variant);

  return (
    <div className={`flex items-start gap-3 ${className}`}>
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
      />
      
      {/* Custom radio */}
      <div
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleChange}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleChange();
          }
        }}
        className={`${radioClasses} ${sizeClasses} cursor-pointer focus:outline-none bg-background`}
      >
        {/* Radio dot */}
        {checked && (
          <div 
            className={`${dotSizeClasses} ${dotColorClasses} rounded-full transition-all duration-200`}
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