'use client';

/**
 * Badge Component - Theme-Aware Implementation (PHASE 2 CONSOLIDATION)
 *
 * Uses comprehensive CSS variable system for dynamic theming:
 * - Typography: --typography-emphasis-* (font-family, font-size, letter-spacing)
 * - Border Radius: --radius-badge
 * - Transitions: Tailwind transition-colors
 * - Colors: Tailwind classes with CSS variables (variant-based colors)
 *
 * All variables automatically respond to theme changes via DynamicThemeProvider.
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BadgeProps } from './Badge.types';

/**
 * Badge variant styles using CVA
 * Consolidated from all Badge implementations across the codebase
 */
const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1.5 font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden whitespace-nowrap shrink-0 [&>svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground hover:bg-muted/80',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        success: 'bg-success text-success-foreground hover:bg-success/90',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
        error:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border-2 border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
        ghost:
          'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-5 px-2 py-0.5 text-xs [&>svg]:size-2.5',
        md: 'h-6 px-2.5 py-0.5 text-sm [&>svg]:size-3',
        lg: 'h-7 px-3 py-1 text-base [&>svg]:size-3.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

/**
 * Badge - Atomic Design Atom (PHASE 2 CONSOLIDATION)
 *
 * A versatile badge component for displaying labels, tags, and status indicators.
 * Consolidated from 4 implementations:
 * - ui/badge.tsx (Shadcn base with CVA + Radix Slot)
 * - atoms/badges/Badge.tsx (6 variants, theme override)
 * - theme-editor-3.0/atoms/Badge.tsx (8 variants, icons, removable, accessibility)
 * - theme-editor-3.0/primitives/badge.tsx (re-export)
 *
 * @example
 * ```tsx
 * // Basic badge
 * <Badge variant="primary">New</Badge>
 *
 * // With icon
 * <Badge variant="success" icon={<CheckCircle />}>Completed</Badge>
 *
 * // Removable badge
 * <Badge variant="outline" removable onRemove={() => console.log('removed')}>
 *   Tag
 * </Badge>
 *
 * // As link (using asChild)
 * <Badge asChild>
 *   <a href="/profile">Profile</a>
 * </Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (props, ref) => {
    const {
      variant = 'default',
      size = 'md',
      icon,
      removable = false,
      onRemove,
      asChild = false,
      className,
      children,
      themeOverride,
      useSystemColors = true,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      role = 'status',
      ...restProps
    } = props;
    // asChild cannot be used with icon or removable as Slot requires single child
    const Comp = asChild && !icon && !removable ? Slot : 'span';

    // Compute accessibility props
    const accessibilityProps = React.useMemo(() => {
      const baseProps: Record<string, any> = {
        role,
        'aria-label':
          ariaLabel ||
          (typeof children === 'string' ? `Badge: ${children}` : 'Badge'),
        'aria-describedby': ariaDescribedby,
      };

      // Add aria-live for error/warning variants
      if (
        variant === 'error' ||
        variant === 'destructive' ||
        variant === 'warning'
      ) {
        baseProps['aria-live'] = 'polite';
      }

      return baseProps;
    }, [role, ariaLabel, ariaDescribedby, children, variant]);

    // Compose styles with theme overrides
    const style = React.useMemo(() => {
      const baseStyle: React.CSSProperties = {
        fontFamily: 'var(--typography-emphasis-font-family, inherit)',
        fontSize:
          size === 'lg'
            ? 'var(--typography-emphasis-font-size, inherit)'
            : 'calc(var(--typography-emphasis-font-size, 0.875rem) * 0.85)',
        letterSpacing: 'var(--typography-emphasis-letter-spacing, inherit)',
        borderRadius: 'var(--radius-badge, var(--radius, 0.375rem))',
      };

      return themeOverride ? { ...baseStyle, ...themeOverride } : baseStyle;
    }, [size, themeOverride]);

    // If asChild is true, we can only render a single child element
    // So we don't support icon or removable in asChild mode
    if (asChild && !icon && !removable) {
      return (
        <Comp
          ref={ref}
          className={cn(badgeVariants({ variant, size }), className)}
          style={style}
          data-slot="badge"
          data-use-system-colors={useSystemColors}
          {...accessibilityProps}
          {...restProps}
        >
          {children}
        </Comp>
      );
    }

    // Normal rendering with icon and removable support
    return (
      <Comp
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        style={style}
        data-slot="badge"
        data-use-system-colors={useSystemColors}
        {...accessibilityProps}
        {...restProps}
      >
        {/* Left icon */}
        {icon && (
          <span
            className="flex-shrink-0 flex items-center justify-center"
            aria-hidden="true"
          >
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<any>, {
                  className: cn(
                    'w-full h-full',
                    size === 'sm' && 'size-2.5',
                    size === 'md' && 'size-3',
                    size === 'lg' && 'size-3.5',
                  ),
                })
              : icon}
          </span>
        )}

        {/* Content */}
        {children}

        {/* Remove button */}
        {removable && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            onKeyDown={(e) => {
              if (
                (e.key === 'Enter' || e.key === ' ') &&
                e.currentTarget === e.target
              ) {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
              }
            }}
            className={cn(
              'flex-shrink-0 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              size === 'sm' && 'size-2.5',
              size === 'md' && 'size-3',
              size === 'lg' && 'size-3.5',
            )}
            aria-label={`Remove ${typeof children === 'string' ? children : 'badge'}`}
            tabIndex={0}
          >
            <X
              className={cn(
                'w-full h-full',
                size === 'sm' && 'size-2.5',
                size === 'md' && 'size-3',
                size === 'lg' && 'size-3.5',
              )}
            />
          </button>
        )}
      </Comp>
    );
  },
);

Badge.displayName = 'Badge';

export { badgeVariants };
export default Badge;
