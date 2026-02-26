'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type {
  TypographyProps,
  HeadingProps,
  TypographyVariant,
} from './Typography.types';

/**
 * Typography Component (Alianza Design System - Atom)
 *
 * Unified typography system supporting:
 * - All semantic variants (h1-h6, p, span, label, caption, etc.)
 * - Flexible sizing, weights, colors, and alignment
 * - Alianza theme integration with CSS variables
 * - Backward compatibility with legacy Heading component
 *
 * @example
 * ```tsx
 * // Heading variants
 * <Typography variant="h1">Main Title</Typography>
 * <Typography variant="h2" weight="bold">Section</Typography>
 *
 * // Body text
 * <Typography variant="p">Paragraph text</Typography>
 * <Typography variant="span" size="sm" color="muted">Small text</Typography>
 *
 * // With Alianza theme variables
 * <Typography variant="h1" useAlianzaTheme>Themed Heading</Typography>
 * ```
 */
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
      useAlianzaTheme = false,
      ...props
    },
    ref,
  ) => {
    // Map variants to appropriate HTML elements and default styling
    const getElementConfig = (variant: TypographyVariant) => {
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
        case 'label':
          return {
            element: 'label',
            defaultSize: 'sm',
            defaultWeight: 'medium',
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
        case 'body':
          return { element: 'p', defaultSize: 'md', defaultWeight: 'normal' };
        case 'body2':
          return { element: 'p', defaultSize: 'sm', defaultWeight: 'normal' };
        default:
          return { element: 'p', defaultSize: 'md', defaultWeight: 'normal' };
      }
    };

    const config = getElementConfig(variant);
    const Element = (as || config.element) as React.ElementType;

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
      label: 'leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      caption: 'opacity-75',
      overline: 'uppercase tracking-wide opacity-75',
      lead: 'leading-7',
      blockquote: 'border-l-2 border-muted pl-6 italic',
      body: 'leading-7',
      body2: 'leading-6',
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

    // Apply theme overrides and Alianza theme variables if provided
    const inlineStyles = React.useMemo(() => {
      const styles: React.CSSProperties = {};

      // Apply Alianza theme variables for heading variants
      if (useAlianzaTheme && variant.startsWith('h')) {
        const level = variant.charAt(1); // Extract number from h1, h2, etc.
        return {
          fontFamily: `var(--typography-h${level}-font-family)`,
          fontSize: `var(--typography-h${level}-font-size)`,
          fontWeight: `var(--typography-h${level}-font-weight)`,
          lineHeight: `var(--typography-h${level}-line-height)`,
          letterSpacing: `var(--typography-h${level}-letter-spacing)`,
        } as React.CSSProperties;
      }

      // Apply custom theme overrides
      if (themeOverride) {
        Object.entries(themeOverride).forEach(([property, value]) => {
          // Convert CSS custom property names
          const cssProp = property.startsWith('--') ? property : `--${property}`;
          (styles as Record<string, string>)[cssProp] = value;
        });
      }

      return Object.keys(styles).length > 0 ? styles : undefined;
    }, [themeOverride, useAlianzaTheme, variant]);

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

/**
 * Heading Component (Backward Compatibility)
 *
 * Legacy component for Alianza Heading usage.
 * Wraps Typography with heading-specific defaults.
 *
 * @example
 * ```tsx
 * <Heading level={1}>Main Title</Heading>
 * <Heading level={2}>Section Title</Heading>
 * ```
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, children, className, useAlianzaTheme = true, ...props }, ref) => {
    const variant = `h${level}` as TypographyVariant;

    return (
      <Typography
        ref={ref as any}
        variant={variant}
        className={className}
        useAlianzaTheme={useAlianzaTheme}
        {...props}
      >
        {children}
      </Typography>
    );
  },
);

Heading.displayName = 'Heading';

export default Typography;
