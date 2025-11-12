'use client';

/**
 * ScrollArea Component - Theme-Aware Implementation
 *
 * Uses comprehensive CSS variable system for dynamic theming:
 * - Scrollbar Width: --scrollbar-width, --scrollbar-width-thin
 * - Scrollbar Colors: --scrollbar-track, --scrollbar-thumb, --scrollbar-thumb-hover
 * - Border Radius: --scrollbar-border-radius
 * - Transitions: --transition-base for smooth changes
 * - Colors: Tailwind classes with CSS variables
 *
 * All variables automatically respond to theme changes via DynamicThemeProvider.
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from './utils';

function ScrollArea({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      style={style}
      className={cn('relative', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = 'vertical',
  style,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  const scrollbarStyles: React.CSSProperties = {
    // Width - Use scrollbar width variable (thin variant)
    ...(orientation === 'vertical' && {
      width: 'var(--scrollbar-width-thin, 10px)',
    }),
    ...(orientation === 'horizontal' && {
      height: 'var(--scrollbar-width-thin, 10px)',
    }),

    // Transition - Use standardized transition for smooth changes
    transition: 'all var(--transition-base, 200ms cubic-bezier(0.4, 0, 0.2, 1))',
  };

  const thumbStyles: React.CSSProperties = {
    // Border radius - Use scrollbar-specific radius
    borderRadius: 'var(--scrollbar-border-radius, 9999px)',

    // Background color - Using CSS variable approach for consistency
    // Note: bg-border Tailwind class will still work, but this adds the CSS variable layer
  };

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      style={{ ...scrollbarStyles, ...style }}
      className={cn(
        'flex touch-none p-px select-none',
        orientation === 'vertical' &&
          'h-full border-l border-l-transparent',
        orientation === 'horizontal' &&
          'flex-col border-t border-t-transparent',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        style={thumbStyles}
        className="bg-border relative flex-1"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
