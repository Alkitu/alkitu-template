'use client';

import React, { useState } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AccordionProps, AccordionPresetConfig } from './Accordion.types';

/**
 * Accordion - Atomic Design Molecule
 *
 * A collapsible content component that combines Radix UI Accordion primitives with
 * enhanced styling, animations, and theme integration. Composes typography atoms,
 * icon atoms, and spacing utilities.
 *
 * **Atoms Composed:**
 * - Typography (headings and paragraph styles)
 * - Icons (ChevronDown, custom icons)
 * - Spacing system (small/medium/large)
 * - Border and shadow utilities
 *
 * **Features:**
 * - 4 visual variants (default, card, bordered, minimal)
 * - Single or multiple selection modes
 * - Smooth animations with cubic-bezier
 * - Custom icons per item
 * - Badge support
 * - Disabled state
 * - Default open state
 * - Full keyboard navigation
 * - Screen reader support (ARIA)
 *
 * @example
 * ```tsx
 * <Accordion
 *   variant="card"
 *   items={[
 *     {
 *       id: '1',
 *       title: 'What is Atomic Design?',
 *       content: 'Atomic Design is a methodology...',
 *       badge: { text: 'New', variant: 'outline' }
 *     }
 *   ]}
 * />
 * ```
 */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      variant = 'default',
      multiple = false,
      animated = true,
      collapsible = true,
      className = '',
    },
    ref,
  ) => {
    // Initialize open items state based on defaultOpen
    const [openItems, setOpenItems] = useState<string[]>(
      items.filter((item) => item.defaultOpen).map((item) => item.id),
    );

    // Handle value changes for both single and multiple modes
    const handleValueChange = (value: string | string[]) => {
      if (multiple) {
        setOpenItems(Array.isArray(value) ? value : [value]);
      } else {
        setOpenItems(Array.isArray(value) ? value : [value]);
      }
    };

    // Variant-specific container styles
    const containerClasses = cn(
      // Base styles
      'w-full rounded-xl overflow-hidden transition-all duration-300 ease-out',

      // Variant styles
      {
        // Default variant
        'bg-background border border-border': variant === 'default',

        // Card variant with shadow
        'bg-card border border-border shadow-md': variant === 'card',

        // Bordered variant with thicker border
        'bg-background border-2 border-border': variant === 'bordered',

        // Minimal variant without background/border
        'bg-transparent border-none': variant === 'minimal',
      },

      className,
    );

    // Trigger button styles
    const getTriggerClasses = (isOpen: boolean, disabled: boolean) =>
      cn(
        // Base styles
        'flex w-full items-center justify-between gap-3 text-left transition-all duration-300 ease-out',
        'min-h-[44px]', // Minimum touch target
        'rounded-lg',

        // Padding based on variant
        variant === 'minimal' ? 'px-0 py-3' : 'px-4 py-3',

        // Typography
        'font-heading text-base font-medium',

        // Interactive states
        !disabled && [
          'hover:bg-accent/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        ],

        // Active state
        isOpen && 'bg-accent/30',

        // Disabled state
        disabled && 'cursor-not-allowed opacity-50',

        // Color based on state
        isOpen ? 'text-primary font-semibold' : 'text-foreground',
      );

    // Content area styles
    const getContentClasses = () =>
      cn(
        'overflow-hidden transition-all duration-300 ease-out',
        'data-[state=closed]:animate-accordion-up',
        'data-[state=open]:animate-accordion-down',
      );

    // Icon container styles
    const getIconClasses = (isOpen: boolean) =>
      cn(
        'flex h-5 w-5 items-center justify-center rounded transition-all duration-300 ease-out',
        isOpen && 'bg-primary/20 rotate-180 scale-110',
        animated && 'transform',
      );

    const accordionType = multiple ? 'multiple' : 'single';
    const accordionValue = multiple ? openItems : openItems[0] || '';

    return (
      <div ref={ref} className={containerClasses} data-testid="accordion">
        <AccordionPrimitive.Root
          type={accordionType}
          value={accordionValue}
          onValueChange={handleValueChange}
          collapsible={collapsible}
          className="w-full"
        >
          {items.map((item, index) => {
            const isOpen = openItems.includes(item.id);
            const isLast = index === items.length - 1;

            return (
              <AccordionPrimitive.Item
                key={item.id}
                value={item.id}
                className={cn(
                  variant !== 'minimal' && !isLast && 'border-b border-border',
                  variant === 'minimal' && 'mb-4',
                )}
                data-testid={`accordion-item-${item.id}`}
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    disabled={item.disabled}
                    className={getTriggerClasses(isOpen, item.disabled || false)}
                    data-testid={`accordion-trigger-${item.id}`}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      {/* Icon container */}
                      <div
                        className={getIconClasses(isOpen)}
                        data-testid={`accordion-icon-${item.id}`}
                      >
                        {item.icon ? (
                          <div
                            className={cn(
                              'flex h-4 w-4 items-center justify-center transition-colors duration-300',
                              isOpen ? 'text-primary' : 'text-muted-foreground',
                            )}
                          >
                            {item.icon}
                          </div>
                        ) : (
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 shrink-0 transition-colors duration-300',
                              isOpen ? 'text-primary' : 'text-muted-foreground',
                            )}
                            data-testid={`accordion-chevron-${item.id}`}
                          />
                        )}
                      </div>

                      {/* Title */}
                      <span className="flex-1">{item.title}</span>

                      {/* Badge (if provided) */}
                      {item.badge && (
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium transition-all duration-300',
                            'ring-1 ring-inset',
                            // Badge variant styles
                            {
                              'bg-secondary text-secondary-foreground ring-secondary/20':
                                (item.badge.variant || 'outline') === 'secondary',
                              'bg-destructive text-destructive-foreground ring-destructive/20':
                                item.badge.variant === 'destructive',
                              'bg-background text-foreground ring-border':
                                (item.badge.variant || 'outline') === 'outline' ||
                                item.badge.variant === 'default',
                            },
                            // Badge animations
                            isOpen && 'scale-95 opacity-90',
                          )}
                          data-testid={`accordion-badge-${item.id}`}
                        >
                          {item.badge.text}
                        </span>
                      )}
                    </div>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>

                <AccordionPrimitive.Content
                  className={getContentClasses()}
                  data-testid={`accordion-content-${item.id}`}
                >
                  <div
                    className={cn(
                      'pb-4 pt-0',
                      variant === 'minimal' ? 'px-0' : 'px-4',
                      'pl-11', // Align with title (icon width + gap)
                    )}
                  >
                    {typeof item.content === 'string' ? (
                      <p className="font-body text-sm leading-relaxed text-muted-foreground">
                        {item.content}
                      </p>
                    ) : (
                      <div className="text-sm text-muted-foreground">{item.content}</div>
                    )}
                  </div>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            );
          })}
        </AccordionPrimitive.Root>
      </div>
    );
  },
);

Accordion.displayName = 'Accordion';

/**
 * Preset configurations for common accordion patterns
 */
export const AccordionPresets: Record<string, AccordionPresetConfig> = {
  /**
   * Basic single-selection accordion
   */
  basic: {
    variant: 'default',
    multiple: false,
    animated: true,
    collapsible: true,
  },

  /**
   * Card-style accordion with shadow
   */
  card: {
    variant: 'card',
    multiple: false,
    animated: true,
    collapsible: true,
  },

  /**
   * Multi-select accordion with borders
   */
  multiSelect: {
    variant: 'bordered',
    multiple: true,
    animated: true,
    collapsible: true,
  },

  /**
   * Minimal accordion without background
   */
  minimal: {
    variant: 'minimal',
    multiple: false,
    animated: false,
    collapsible: true,
  },
};

export default Accordion;
