import type { ReactNode } from 'react';

/**
 * Variant options for Accordion
 */
export type AccordionVariant = 'default' | 'card' | 'bordered' | 'minimal';

/**
 * Badge variant options for accordion items
 */
export type AccordionBadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

/**
 * Individual accordion item configuration
 */
export interface AccordionItem {
  /**
   * Unique identifier for the accordion item
   */
  id: string;

  /**
   * Title text displayed in the trigger
   */
  title: string;

  /**
   * Content displayed when item is expanded
   */
  content: ReactNode;

  /**
   * Optional badge configuration
   */
  badge?: {
    /**
     * Badge text
     */
    text: string;
    /**
     * Badge variant
     * @default 'outline'
     */
    variant?: AccordionBadgeVariant;
  };

  /**
   * Optional custom icon to display (replaces default chevron)
   */
  icon?: ReactNode;

  /**
   * Whether this item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether this item is open by default
   * @default false
   */
  defaultOpen?: boolean;
}

/**
 * Props for Accordion molecule
 */
export interface AccordionProps {
  /**
   * Array of accordion items to display
   */
  items: AccordionItem[];

  /**
   * Visual variant of the accordion
   * @default 'default'
   */
  variant?: AccordionVariant;

  /**
   * Allow multiple items to be open simultaneously
   * @default false
   */
  multiple?: boolean;

  /**
   * Enable smooth animations
   * @default true
   */
  animated?: boolean;

  /**
   * Allow all items to be collapsed
   * @default true
   */
  collapsible?: boolean;

  /**
   * Custom className for the accordion container
   */
  className?: string;
}

/**
 * Preset configurations for common accordion patterns
 */
export interface AccordionPresetConfig {
  variant: AccordionVariant;
  multiple: boolean;
  animated: boolean;
  collapsible: boolean;
}
