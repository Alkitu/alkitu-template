'use client';

import React from 'react';
import type { ButtonProps } from './Button.types';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', loading = false, icon, style, ...props }, ref) => {

    // Base button styles
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '500',
      outline: 'none',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s ease-in-out',

      // Global theme variables
      fontFamily: 'var(--typography-paragraph-font-family)',
      fontSize: 'var(--typography-paragraph-font-size)',
      letterSpacing: 'var(--typography-paragraph-letter-spacing)',
      borderRadius: 'var(--radius-button, var(--radius))',

      // Size variants
      ...(size === 'sm' && {
        height: '36px',
        paddingLeft: '12px',
        paddingRight: '12px',
      }),
      ...(size === 'default' && {
        height: '40px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }),
      ...(size === 'lg' && {
        height: '44px',
        paddingLeft: '20px',
        paddingRight: '20px',
        fontSize: 'calc(var(--typography-paragraph-font-size) * 1.1)',
      }),
      ...(size === 'icon' && {
        height: '40px',
        width: '40px',
        padding: '0',
      }),

      // Disabled state
      ...(props.disabled && {
        opacity: 0.5,
        cursor: 'not-allowed',
      }),
    };

    // Variant classes using global color system
    const getVariantClasses = (): string => {
      switch (variant) {
        case 'default':
          return 'bg-primary text-primary-foreground border-primary hover:bg-primary/90';

        case 'outline':
          return 'bg-transparent text-primary border-primary hover:bg-primary/10';

        case 'ghost':
          return 'bg-transparent text-primary border-transparent hover:bg-muted';

        case 'destructive':
          return 'bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90';

        case 'secondary':
          return 'bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80';

        case 'loading':
          return 'bg-primary text-primary-foreground border-primary opacity-70 cursor-not-allowed';

        case 'icon':
          return 'bg-primary text-primary-foreground border-primary hover:bg-primary/90';

        default:
          return 'bg-primary text-primary-foreground border-primary hover:bg-primary/90';
      }
    };

    // Accessibility props
    const getAccessibilityProps = () => {
      const accessibilityProps: Record<string, any> = {
        'data-focus-visible': true,
        'aria-busy': loading ? 'true' : undefined,
        'aria-disabled': (props.disabled || loading) ? 'true' : undefined,
      };

      // Add aria-label for icon-only buttons
      if (variant === 'icon' && !props.children && !props['aria-label']) {
        accessibilityProps['aria-label'] = 'Button';
      }

      // Add aria-live for loading state changes
      if (loading && !props['aria-live']) {
        accessibilityProps['aria-live'] = 'polite';
      }

      return accessibilityProps;
    };

    return (
      <button
        ref={ref}
        className={`${getVariantClasses()} ${className} border`}
        style={{
          ...baseStyles,
          ...style,
          outline: '2px solid transparent',
          outlineOffset: '2px',
          '--focus-ring-color': 'var(--colors-primary, #0066CC)',
          boxShadow: loading ? 'none' : undefined,
        } as React.CSSProperties}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid var(--focus-ring-color)';
          e.currentTarget.style.outlineOffset = '2px';
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = '2px solid transparent';
          if (props.onBlur) props.onBlur(e);
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !props.disabled && !loading) {
            e.preventDefault();
            if (props.onClick) {
              props.onClick(e as any);
            }
          }
          if (props.onKeyDown) props.onKeyDown(e);
        }}
        disabled={props.disabled || loading}
        {...getAccessibilityProps()}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            style={{ marginRight: props.children ? '8px' : '0' }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !loading && (
          <span style={{ marginRight: props.children ? '8px' : '0' }}>
            {icon}
          </span>
        )}
        {props.children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Performance optimization wrapper
export const MemoizedButton = React.memo(Button, (prevProps, nextProps) => {
  if (prevProps.loading !== nextProps.loading) return false;
  if (prevProps.disabled !== nextProps.disabled) return false;
  if (prevProps.variant !== nextProps.variant) return false;
  if (prevProps.size !== nextProps.size) return false;
  if (prevProps.className !== nextProps.className) return false;
  if (JSON.stringify(prevProps.children) !== JSON.stringify(nextProps.children)) return false;
  return true;
});

MemoizedButton.displayName = 'MemoizedButton';

export default Button;
