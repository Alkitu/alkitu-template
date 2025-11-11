'use client';

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { useThemeVariables } from '@/hooks/useThemeVariables';
import { Icon, Spinner } from '..';
import type { ButtonProps, ButtonIconPosition } from './Button.types';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      children,
      className = '',
      onClick,
      themeOverride,
      useSystemColors = true,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    // Theme integration (if needed in future)
    // const themeVars = useThemeVariables();

    // Dynamic variant classes using CSS variables
    const variantClasses = {
      primary: [
        'bg-primary text-primary-foreground',
        'border-primary',
        'hover:bg-primary/90',
        'focus-visible:ring-primary/20',
        'disabled:bg-primary/50',
      ].join(' '),

      secondary: [
        'bg-secondary text-secondary-foreground',
        'border-secondary',
        'hover:bg-secondary/90',
        'focus-visible:ring-secondary/20',
        'disabled:bg-secondary/50',
      ].join(' '),

      outline: [
        'bg-transparent text-foreground',
        'border-border',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:ring-ring/20',
        'disabled:bg-transparent disabled:text-muted-foreground',
      ].join(' '),

      ghost: [
        'bg-transparent text-foreground border-transparent',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:ring-ring/20',
        'disabled:bg-transparent disabled:text-muted-foreground',
      ].join(' '),

      destructive: [
        'bg-destructive text-destructive-foreground',
        'border-destructive',
        'hover:bg-destructive/90',
        'focus-visible:ring-destructive/20',
        'disabled:bg-destructive/50',
      ].join(' '),
    }[variant];

    const sizeClasses = {
      sm: 'h-8 px-3 text-xs rounded-sm gap-1.5',
      md: 'h-10 px-4 text-sm rounded-md gap-2',
      lg: 'h-12 px-6 text-base rounded-lg gap-2',
    }[size];

    const iconSize = {
      sm: 'sm' as const,
      md: 'sm' as const,
      lg: 'md' as const,
    }[size];

    const isDisabled = disabled || loading;

    const classes = cn([
      // Base classes
      'inline-flex items-center justify-center',
      'border font-medium transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
      'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',

      // Dynamic theme classes
      variantClasses,
      sizeClasses,

      // Conditional classes
      fullWidth && 'w-full',

      // User-provided classes
      className,
    ]);

    // Apply theme overrides if provided
    const inlineStyles = React.useMemo(() => {
      if (!themeOverride) return undefined;

      const styles: React.CSSProperties = {};
      Object.entries(themeOverride).forEach(([property, value]) => {
        // Convert CSS custom property names
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

    const renderContent = () => {
      if (loading) {
        return (
          <>
            <Spinner size="sm" className="shrink-0" />
            {children}
          </>
        );
      }

      if (icon) {
        const iconElement = (
          <Icon name={icon} size={iconSize} className="shrink-0" />
        );

        return iconPosition === 'left' ? (
          <>
            {iconElement}
            {children}
          </>
        ) : (
          <>
            {children}
            {iconElement}
          </>
        );
      }

      return children;
    };

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={classes}
        disabled={isDisabled}
        onClick={handleClick}
        style={inlineStyles}
        data-testid="button"
        {...props}
      >
        {renderContent()}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export default Button;
