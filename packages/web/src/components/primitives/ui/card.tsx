/**
 * Card Component - Theme-Aware Implementation
 *
 * Uses comprehensive CSS variable system for dynamic theming:
 * - Border Radius: --radius-card
 * - Shadows: --shadow-card (with hover state)
 * - Spacing: --spacing-* for padding and gaps
 * - Transitions: --transition-base
 * - Colors: Tailwind classes with CSS variables
 *
 * All variables automatically respond to theme changes via DynamicThemeProvider.
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */

import * as React from 'react';

import { cn } from './utils';

function Card({ className, style, ...props }: React.ComponentProps<'div'>) {
  const baseStyles: React.CSSProperties = {
    // Border radius - Use component-specific card radius
    borderRadius: 'var(--radius-card, calc(var(--radius, 0.375rem) + 4px))',

    // Shadow - Use card shadow with hover enhancement
    boxShadow: 'var(--shadow-card, var(--shadow-md))',

    // Gap - Use spacing system
    gap: 'var(--spacing-lg, 1.5rem)',

    // Transition - Smooth hover effects
    transition: 'all var(--transition-base, 200ms cubic-bezier(0.4, 0, 0.2, 1))',
  };

  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col border',
        'hover:shadow-[var(--shadow-card-hover,var(--shadow-lg))]',
        className,
      )}
      style={{
        ...baseStyles,
        ...style
      }}
      {...props}
    />
  );
}

function CardHeader({ className, style, ...props }: React.ComponentProps<'div'>) {
  const headerStyles: React.CSSProperties = {
    paddingLeft: 'var(--spacing-lg, 1.5rem)',
    paddingRight: 'var(--spacing-lg, 1.5rem)',
    paddingTop: 'var(--spacing-lg, 1.5rem)',
  };

  return (
    <div
      data-slot="card-header"
      style={{ ...headerStyles, ...style }}
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <h4
      data-slot="card-title"
      className={cn('leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, style, ...props }: React.ComponentProps<'div'>) {
  const contentStyles: React.CSSProperties = {
    paddingLeft: 'var(--spacing-lg, 1.5rem)',
    paddingRight: 'var(--spacing-lg, 1.5rem)',
  };

  return (
    <div
      data-slot="card-content"
      style={{ ...contentStyles, ...style }}
      className={cn('[&:last-child]:pb-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, style, ...props }: React.ComponentProps<'div'>) {
  const footerStyles: React.CSSProperties = {
    paddingLeft: 'var(--spacing-lg, 1.5rem)',
    paddingRight: 'var(--spacing-lg, 1.5rem)',
    paddingBottom: 'var(--spacing-lg, 1.5rem)',
  };

  return (
    <div
      data-slot="card-footer"
      style={{ ...footerStyles, ...style }}
      className={cn('flex items-center [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
