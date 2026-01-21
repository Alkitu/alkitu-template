'use client';

/**
 * Button Component - Theme-Aware Implementation
 *
 * Uses comprehensive CSS variable system for dynamic theming:
 * - Typography: --typography-button-* variables
 * - Border Radius: --radius-button
 * - Shadows: --shadow-button
 * - Spacing: --spacing-* variables
 * - Transitions: --transition-fast
 * - Colors: Tailwind classes with CSS variables (--primary, --destructive, etc.)
 *
 * All variables automatically respond to theme changes via DynamicThemeProvider.
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { ButtonProps } from './Button.types';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { 
      className = '', 
      variant = 'default', 
      size = 'default', 
      loading = false, 
      icon, 
      style,
      asChild = false,
      ...restProps 
    } = props;

    // Base button styles using comprehensive CSS variable system
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none',
      cursor: props.disabled ? 'not-allowed' : 'pointer',

      // Typography - Use component-specific button typography variables
      fontFamily: 'var(--typography-button-family, var(--font-sans))',
      fontSize: 'var(--typography-button-size, 0.875rem)',
      fontWeight: 'var(--typography-button-weight, 500)',
      lineHeight: 'var(--typography-button-line-height, 1.25rem)',
      letterSpacing: 'var(--typography-button-letter-spacing, 0.01em)',

      // Border radius - Use component-specific button radius
      borderRadius: 'var(--radius-button, var(--radius, 0.375rem))',

      // Transitions - Use standardized transition variables
      transition: 'all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1))',

      // Size variants using spacing system
      ...(size === 'sm' && {
        height: '32px',
        paddingLeft: 'var(--spacing-sm, 0.5rem)',
        paddingRight: 'var(--spacing-sm, 0.5rem)',
        fontSize: '0.8125rem', // Slightly smaller than default
      }),
      ...(size === 'default' && {
        height: '40px',
        paddingLeft: 'var(--spacing-md, 1rem)',
        paddingRight: 'var(--spacing-md, 1rem)',
      }),
      ...(size === 'lg' && {
        height: '44px',
        paddingLeft: 'var(--spacing-lg, 1.5rem)',
        paddingRight: 'var(--spacing-lg, 1.5rem)',
        fontSize: '0.9375rem', // Slightly larger than default
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

      // Shadows - Use standardized shadow variables
      boxShadow: (loading || variant === 'ghost' || variant === 'link') ? 'none' : 'var(--shadow-button, var(--shadow-sm))',
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
        'aria-disabled': (restProps.disabled || loading) ? 'true' : undefined,
      };

      // Add aria-label for icon-only buttons
      if (variant === 'icon' && !restProps.children && !restProps['aria-label']) {
        accessibilityProps['aria-label'] = 'Button';
      }

      // Add aria-live for loading state changes
      if (loading && !restProps['aria-live']) {
        accessibilityProps['aria-live'] = 'polite';
      }

      return accessibilityProps;
    };

    // Disable asChild when button has decorations (icon/loading)
    // because Slot expects exactly one child element
    const hasMultipleChildren = React.Children.count(restProps.children) > 1;
    const shouldUseSlot = asChild && !icon && !loading && !hasMultipleChildren;
    const Comp = shouldUseSlot ? Slot : 'button';

    // When using asChild with valid single child, render with minimal decoration
    if (shouldUseSlot) {
      return (
        <Comp
          ref={ref}
          className={`${getVariantClasses()} ${className} border`}
          style={{
            ...baseStyles,
            ...style,
          } as React.CSSProperties}
          onFocus={(e: any) => {
            if (restProps.onFocus) restProps.onFocus(e);
          }}
          onBlur={(e: any) => {
            if (restProps.onBlur) restProps.onBlur(e);
          }}
          {...getAccessibilityProps()}
          {...restProps}
        >
          {restProps.children}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        className={`${getVariantClasses()} ${className} border`}
        style={{
          ...baseStyles,
          ...style,
        } as React.CSSProperties}
        onFocus={(e: any) => {
          if (restProps.onFocus) restProps.onFocus(e);
        }}
        onBlur={(e: any) => {
          if (restProps.onBlur) restProps.onBlur(e);
        }}
        disabled={restProps.disabled || loading}
        {...getAccessibilityProps()}
        {...restProps}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            style={{ marginRight: restProps.children ? '8px' : '0' }}
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
          <span style={{ marginRight: restProps.children ? '8px' : '0' }}>
            {icon}
          </span>
        )}
        {restProps.children}
      </Comp>
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
