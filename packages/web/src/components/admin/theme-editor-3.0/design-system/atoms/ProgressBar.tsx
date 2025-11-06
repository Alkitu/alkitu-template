'use client';

import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showPercentage?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

const getProgressVariantClasses = (variant: string) => {
  switch (variant) {
    case 'success':
      return {
        container: 'bg-success/20',
        bar: 'bg-success'
      };
    case 'warning':
      return {
        container: 'bg-warning/20',
        bar: 'bg-warning'
      };
    case 'error':
      return {
        container: 'bg-destructive/20',
        bar: 'bg-destructive'
      };
    default:
      return {
        container: 'bg-muted',
        bar: 'bg-primary'
      };
  }
};

const getProgressSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return 'h-1';
    case 'lg':
      return 'h-4';
    default:
      return 'h-2';
  }
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  showPercentage = false,
  label,
  className = '',
  animated = false
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const variantClasses = getProgressVariantClasses(variant);
  const sizeClasses = getProgressSizeClasses(size);

  return (
    <div className={`w-full ${className}`}>
      {/* Label and percentage */}
      {(showLabel || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {showLabel && label && (
            <span 
              className="text-sm text-foreground"
              style={{
                fontFamily: 'var(--typography-emphasis-font-family)',
                fontSize: 'var(--typography-emphasis-font-size)',
                fontWeight: 'var(--typography-emphasis-font-weight)',
                letterSpacing: 'var(--typography-emphasis-letter-spacing)',
              }}
            >
              {label}
            </span>
          )}
          {showPercentage && (
            <span 
              className="text-sm text-muted-foreground"
              style={{
                fontFamily: 'var(--typography-emphasis-font-family)',
                fontSize: 'var(--typography-emphasis-font-size)',
                fontWeight: 'var(--typography-emphasis-font-weight)',
                letterSpacing: 'var(--typography-emphasis-letter-spacing)',
              }}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress container */}
      <div
        className={`
          ${variantClasses.container} ${sizeClasses}
          rounded-full overflow-hidden
        `}
        style={{
          borderRadius: 'var(--radius-progress, var(--radius))',
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${Math.round(percentage)}%`}
      >
        {/* Progress bar */}
        <div
          className={`
            ${variantClasses.bar} ${sizeClasses}
            transition-all duration-500 ease-out rounded-full
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{
            width: `${percentage}%`,
            borderRadius: 'var(--radius-progress, var(--radius))',
          }}
        />
      </div>
    </div>
  );
}