'use client';

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/atoms-alianza/Spinner';
import type { ButtonProps } from './Button.types';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = 'main',
      size = 'md',
      disabled = false,
      loading = false,
      iconLeft,
      iconRight,
      iconOnly = false,
      fullWidth = false,
      children,
      className = '',
      onClick,
      themeOverride,
      asChild = false,
      ...restProps
    } = props;

    // Map legacy/Standard variants to Alianza variants
    const variantMap: Record<string, string> = {
      solid: 'main',
      ghost: 'nude',
      primary: 'main',
      secondary: 'outline',
      main: 'main',
      active: 'active',
      outline: 'outline',
      nude: 'nude',
      destructive: 'destructive',
    };
    const finalVariant = variantMap[variant] || 'main';

    // Variant styles using CSS variables
    const variantClasses: Record<string, string> = {
      main: [
        'bg-primary text-primary-foreground',
        'border-transparent',
        'hover:bg-primary/90',
        'focus-visible:ring-primary/20',
        'shadow-sm',
      ].join(' '),

      active: [
        'bg-accent text-accent-foreground',
        'border-transparent',
        'hover:opacity-90',
      ].join(' '),

      outline: [
        'border-primary text-primary',
        'bg-background',
        'hover:bg-primary/10',
      ].join(' '),

      nude: [
        'text-primary bg-transparent',
        'border-transparent',
        'hover:bg-primary/10',
        'shadow-none',
      ].join(' '),

      destructive: [
        'bg-destructive text-destructive-foreground',
        'border-transparent',
        'hover:bg-destructive/90',
        'shadow-sm',
      ].join(' '),
    };

    // Size styles
    const sizeClasses: Record<string, string> = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    // Icon only: square aspect ratio, remove horizontal padding
    const iconOnlyClasses: Record<string, string> = {
      sm: 'aspect-square px-0 w-8',
      md: 'aspect-square px-0 w-10',
      lg: 'aspect-square px-0 w-12',
    };

    // Icon size for inline icons
    const iconSizeClasses = size === 'sm' ? '[&>svg]:size-3.5' : '[&>svg]:size-4';

    const isDisabled = disabled || loading;

    const classes = cn([
      // Base classes
      'cursor-pointer inline-flex items-center justify-center',
      'rounded-[var(--radius-button)]',
      'transition-all duration-200',
      'font-medium border whitespace-nowrap gap-2',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',

      // Dynamic variant and size
      variantClasses[finalVariant],
      sizeClasses[size],

      // Icon only
      iconOnly && iconOnlyClasses[size],

      // Full width
      fullWidth && 'w-full',

      // User-provided classes
      className,
    ]);

    // Apply theme overrides if provided
    const inlineStyles = React.useMemo(() => {
      if (!themeOverride) return undefined;

      const styles: React.CSSProperties = {};
      Object.entries(themeOverride).forEach(([property, value]) => {
        const cssProp = property.startsWith('--') ? property : `--${property}`;
        (styles as Record<string, string>)[cssProp] = value;
      });

      return styles;
    }, [themeOverride]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled && onClick) {
        onClick(e);
      }
    };

    // Disable asChild when button has decorations (icon/loading)
    // or when children contains multiple React elements
    const hasMultipleChildren = React.Children.count(children) > 1;
    const shouldUseSlot =
      asChild && !iconLeft && !iconRight && !loading && !hasMultipleChildren;
    const Comp = shouldUseSlot ? Slot : 'button';

    const renderContent = () => {
      // If using asChild with valid single child, return as-is
      if (shouldUseSlot) {
        return children;
      }

      return (
        <>
          {loading && (
            <span className={`shrink-0 flex items-center justify-center`}>
              <Spinner size="sm" />
            </span>
          )}
          {!loading && iconLeft && (
            <span
              className={`${iconSizeClasses} shrink-0 flex items-center justify-center`}
            >
              {iconLeft}
            </span>
          )}
          {children}
          {!loading && iconRight && (
            <span
              className={`${iconSizeClasses} shrink-0 flex items-center justify-center`}
            >
              {iconRight}
            </span>
          )}
        </>
      );
    };

    return (
      <Comp
        ref={ref}
        className={classes}
        disabled={isDisabled}
        onClick={handleClick}
        style={inlineStyles}
        data-testid="button"
        {...restProps}
      >
        {renderContent()}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export default Button;
