'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { TypographyProps } from './Typography.types';

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'p',
      size,
      weight,
      color = 'inherit',
      align = 'left',
      truncate = false,
      children,
      className = '',
      as,
      themeOverride,
      ...props
    },
    ref,
  ) => {
    // Map variants to appropriate HTML elements and default styling
    const getElementConfig = (variant: string) => {
      switch (variant) {
        case 'h1':
          return {
            element: 'h1',
            defaultSize: '4xl',
            defaultWeight: 'extrabold',
          };
        case 'h2':
          return { element: 'h2', defaultSize: '3xl', defaultWeight: 'bold' };
        case 'h3':
          return { element: 'h3', defaultSize: '2xl', defaultWeight: 'bold' };
        case 'h4':
          return {
            element: 'h4',
            defaultSize: 'xl',
            defaultWeight: 'semibold',
          };
        case 'h5':
          return {
            element: 'h5',
            defaultSize: 'lg',
            defaultWeight: 'semibold',
          };
        case 'h6':
          return {
            element: 'h6',
            defaultSize: 'md',
            defaultWeight: 'semibold',
          };
        case 'p':
          return { element: 'p', defaultSize: 'md', defaultWeight: 'normal' };
        case 'span':
          return {
            element: 'span',
            defaultSize: 'md',
            defaultWeight: 'normal',
          };
        case 'caption':
          return {
            element: 'span',
            defaultSize: 'sm',
            defaultWeight: 'normal',
          };
        case 'overline':
          return {
            element: 'span',
            defaultSize: 'xs',
            defaultWeight: 'medium',
          };
        case 'lead':
          return { element: 'p', defaultSize: 'lg', defaultWeight: 'normal' };
        case 'blockquote':
          return {
            element: 'blockquote',
            defaultSize: 'md',
            defaultWeight: 'normal',
          };
        default:
          return { element: 'p', defaultSize: 'md', defaultWeight: 'normal' };
      }
    };

    const config = getElementConfig(variant);
    const Element = (as || config.element) as keyof JSX.IntrinsicElements;

    // Size classes
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
    }[size || config.defaultSize];

    // Weight classes
    const weightClasses = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    }[weight || config.defaultWeight];

    // Color classes using CSS variables
    const colorClasses = {
      foreground: 'text-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-accent-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive',
      inherit: '',
    }[color];

    // Alignment classes
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    }[align];

    // Variant-specific styling
    const variantClasses = {
      h1: 'scroll-m-20 tracking-tight',
      h2: 'scroll-m-20 tracking-tight',
      h3: 'scroll-m-20 tracking-tight',
      h4: 'scroll-m-20 tracking-tight',
      h5: 'scroll-m-20 tracking-tight',
      h6: 'scroll-m-20 tracking-tight',
      p: 'leading-7',
      span: '',
      caption: 'opacity-75',
      overline: 'uppercase tracking-wide opacity-75',
      lead: 'leading-7',
      blockquote: 'border-l-2 border-muted pl-6 italic',
    }[variant];

    const classes = cn([
      // Base classes
      'transition-colors',

      // Dynamic classes
      sizeClasses,
      weightClasses,
      colorClasses,
      alignClasses,
      variantClasses,

      // Conditional classes
      truncate && 'truncate',

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

    return (
      <Element
        ref={ref as any}
        className={classes}
        style={inlineStyles}
        data-testid="typography"
        {...props}
      >
        {children}
      </Element>
    );
  },
);

Typography.displayName = 'Typography';

export default Typography;
