import * as React from 'react';

/**
 * Navigation item data structure
 */
export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display label for the navigation item */
  label: string;
  /** URL to navigate to */
  href?: string;
  /** Whether the link opens in a new tab */
  external?: boolean;
  /** Optional badge configuration */
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  /** Child navigation items for multi-level menus */
  children?: NavigationItem[];
  /** Optional description text */
  description?: string;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Whether this item should be featured/highlighted */
  featured?: boolean;
}

/**
 * Variants for the NavigationMenu component
 */
export type NavigationMenuVariant = 'default' | 'compact' | 'featured';

/**
 * Orientation options for the NavigationMenu
 */
export type NavigationMenuOrientation = 'horizontal' | 'vertical';

/**
 * Props for the NavigationMenu molecule component
 */
export interface NavigationMenuProps {
  /** Array of navigation items to display */
  items: NavigationItem[];
  /** Visual variant of the navigation menu */
  variant?: NavigationMenuVariant;
  /** Orientation of the navigation menu */
  orientation?: NavigationMenuOrientation;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the viewport for dropdown content */
  viewport?: boolean;
}

/**
 * Preset configurations for common NavigationMenu layouts
 */
export interface NavigationMenuPresetConfig {
  variant: NavigationMenuVariant;
  orientation: NavigationMenuOrientation;
}
