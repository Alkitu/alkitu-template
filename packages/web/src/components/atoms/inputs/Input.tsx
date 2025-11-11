import { cn } from '@/lib/utils';
import React, { forwardRef } from 'react';
import type { InputProps, InputVariant, InputSize } from './Input.types';

const variantClasses: Record<InputVariant, string> = {
  default: 'border-input bg-background',
  filled: 'border-transparent bg-muted',
  outline: 'border-2 border-input bg-transparent',
};

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
};

const baseClasses = 'flex w-full rounded-md border transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  label,
  helperText,
  error,
  required = false,
  className,
  themeOverride,
  useSystemColors = true,
  ...props
}, ref) => {
  const variantClass = useSystemColors ? variantClasses[variant] : '';
  const sizeClass = sizeClasses[size];
  const errorClass = error ? 'border-destructive focus-visible:ring-destructive' : '';

  const inputElement = (
    <input
      ref={ref}
      className={cn(baseClasses, variantClass, sizeClass, errorClass, className)}
      style={themeOverride}
      {...props}
    />
  );

  if (label || helperText || error) {
    return (
      <div className="w-full">
        {label && (
          <label className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', 'mb-2 block')}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        {inputElement}
        {(helperText || error) && (
          <p className={cn('text-sm mt-2', error ? 'text-destructive' : 'text-muted-foreground')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }

  return inputElement;
});

Input.displayName = 'Input';

export default Input;