'use client';

import React from 'react';
import { X } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onRemove?: () => void;
  // Accessibility props (NEW - additive only)
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
}

const getBadgeVariantClasses = (variant: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-primary text-primary-foreground hover:bg-primary/90';
    case 'secondary':
      return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
    case 'success':
      return 'bg-success text-success-foreground hover:bg-success/90';
    case 'warning':
      return 'bg-warning text-warning-foreground hover:bg-warning/90';
    case 'error':
    case 'destructive':
      return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
    case 'outline':
      return 'border-2 border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground';
    case 'ghost':
      return 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground';
    default:
      return 'bg-muted text-muted-foreground hover:bg-muted/80';
  }
};

const getBadgeSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return 'px-2.5 py-1';
    case 'lg':
      return 'px-4 py-2';
    default:
      return 'px-3 py-1.5';
  }
};

const getIconSize = (size: string) => {
  switch (size) {
    case 'sm':
      return 'h-2.5 w-2.5';
    case 'lg':
      return 'h-3.5 w-3.5';
    default:
      return 'h-3 w-3';
  }
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  icon,
  className = '',
  style: externalStyle,
  onRemove,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  role = 'status'
}: BadgeProps) {
  const variantClasses = getBadgeVariantClasses(variant);
  const sizeClasses = getBadgeSizeClasses(size);
  const iconSizeClasses = getIconSize(size);

  // Accessibility enhancements (NEW - additive only)
  const getAccessibilityProps = () => {
    const accessibilityProps: Record<string, any> = {
      role,
      'aria-label': ariaLabel || (typeof children === 'string' ? `Badge: ${children}` : 'Badge'),
      'aria-describedby': ariaDescribedby,
    };

    // Add semantic meaning based on variant
    if (variant === 'error' || variant === 'destructive' || variant === 'warning') {
      accessibilityProps['aria-live'] = 'polite';
    }

    return accessibilityProps;
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium transition-colors duration-200
        ${variantClasses} ${sizeClasses} ${className}
      `}
      style={{
        fontFamily: 'var(--typography-emphasis-font-family)',
        fontSize: size === 'lg' ? 'var(--typography-emphasis-font-size)' : 'calc(var(--typography-emphasis-font-size) * 0.85)',
        letterSpacing: 'var(--typography-emphasis-letter-spacing)',
        borderRadius: 'var(--radius-badge, var(--radius))',
        ...externalStyle,
      }}
      {...getAccessibilityProps()}
    >
      {/* Icon */}
      {icon && (
        <span className={`${iconSizeClasses} flex-shrink-0 flex items-center justify-center`} style={{ aspectRatio: '1' }}>
          {React.cloneElement(icon as React.ReactElement<Record<string, unknown>>, {
            className: `${iconSizeClasses}`,
            style: { width: '100%', height: '100%' }
          })}
        </span>
      )}
      
      {/* Content */}
      <span className="flex-shrink-0">
        {children}
      </span>
      
      {/* Remove button */}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            // Enhanced keyboard accessibility
            if ((e.key === 'Enter' || e.key === ' ') && e.currentTarget === e.target) {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }
          }}
          onFocus={(e) => {
            // Enhanced focus ring for accessibility
            e.currentTarget.style.outline = '2px solid var(--colors-primary, #0066CC)';
            e.currentTarget.style.outlineOffset = '1px';
          }}
          onBlur={(e) => {
            // Remove focus ring
            e.currentTarget.style.outline = 'none';
          }}
          className={`
            ${iconSizeClasses} flex-shrink-0 rounded-full
            hover:bg-black/10 dark:hover:bg-white/10
            transition-colors duration-200
          `}
          aria-label={`Remove ${typeof children === 'string' ? children : 'badge'}`}
          tabIndex={0}
        >
          <X className={iconSizeClasses} />
        </button>
      )}
    </span>
  );
}