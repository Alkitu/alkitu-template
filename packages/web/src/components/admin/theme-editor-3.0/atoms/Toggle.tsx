'use client';

import React from 'react';

interface ToggleProps {
  id?: string;
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const getToggleVariantClasses = (variant: string, disabled: boolean, checked: boolean) => {
  const baseClasses = 'relative inline-flex cursor-pointer transition-colors duration-300 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  if (disabled) {
    return `${baseClasses} bg-muted cursor-not-allowed focus:ring-muted`;
  }

  if (!checked) {
    return `${baseClasses} bg-input hover:bg-muted focus:ring-primary/20`;
  }

  switch (variant) {
    case 'success':
      return `${baseClasses} bg-success hover:bg-success/90 focus:ring-success/20`;
    case 'warning':
      return `${baseClasses} bg-warning hover:bg-warning/90 focus:ring-warning/20`;
    case 'error':
      return `${baseClasses} bg-destructive hover:bg-destructive/90 focus:ring-destructive/20`;
    default:
      return `${baseClasses} bg-primary hover:bg-primary/90 focus:ring-primary/20`;
  }
};

const getToggleSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return {
        container: 'h-5 w-9',
        thumb: 'h-3.5 w-3.5',
        translate: 'translate-x-4'
      };
    case 'lg':
      return {
        container: 'h-7 w-12',
        thumb: 'h-5.5 w-5.5',
        translate: 'translate-x-5'
      };
    default:
      return {
        container: 'h-6 w-11',
        thumb: 'h-4.5 w-4.5',
        translate: 'translate-x-5'
      };
  }
};

export function Toggle({
  id,
  name,
  checked = false,
  disabled = false,
  variant = 'default',
  size = 'md',
  label,
  description,
  onChange,
  className = ''
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = React.useState(checked);
  
  React.useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const newChecked = !internalChecked;
    setInternalChecked(newChecked);
    onChange?.(newChecked);
  };

  const toggleClasses = getToggleVariantClasses(variant, disabled, internalChecked);
  const sizeClasses = getToggleSizeClasses(size);

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {/* Hidden native checkbox for accessibility */}
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={internalChecked}
        disabled={disabled}
        onChange={handleToggle}
        className="sr-only"
        aria-describedby={description ? `${id}-description` : undefined}
      />
      
      {/* Toggle switch */}
      <button
        type="button"
        role="switch"
        aria-checked={internalChecked}
        aria-disabled={disabled}
        onClick={handleToggle}
        className={`${toggleClasses} ${sizeClasses.container} relative`}
        disabled={disabled}
      >
        {/* Toggle thumb */}
        <span
          className={`
            absolute ${sizeClasses.thumb} rounded-full bg-background shadow-lg
            transition-transform duration-300 ease-in-out top-1/2 left-1 -translate-y-1/2
            ${internalChecked ? sizeClasses.translate : 'translate-x-0'}
          `}
        />
      </button>

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
              className="text-muted-foreground text-sm mt-1"
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