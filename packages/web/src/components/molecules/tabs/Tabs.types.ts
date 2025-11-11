import type { ReactNode } from 'react';

/**
 * Visual variant options for Tabs molecule
 */
export type TabsVariant =
  | 'default'
  | 'pills'
  | 'underline'
  | 'vertical'
  | 'scrollable';

/**
 * Orientation options for tabs
 */
export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Activation mode for tabs
 */
export type TabsActivationMode = 'automatic' | 'manual';

/**
 * Badge variant options
 */
export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

/**
 * Configuration for a tab badge
 */
export interface TabBadge {
  /**
   * Badge text content
   */
  text: string;

  /**
   * Badge visual variant
   * @default 'default'
   */
  variant?: BadgeVariant;
}

/**
 * Individual tab item configuration
 */
export interface TabItem {
  /**
   * Unique identifier for the tab
   */
  id: string;

  /**
   * Tab label text
   */
  label: string;

  /**
   * Tab panel content
   */
  content: ReactNode;

  /**
   * Optional icon to display before the label
   */
  icon?: ReactNode;

  /**
   * Optional badge to display after the label
   */
  badge?: TabBadge;

  /**
   * Whether the tab can be closed
   * @default false
   */
  closeable?: boolean;

  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Props for Tabs molecule
 */
export interface TabsProps {
  /**
   * Array of tab items to display
   */
  tabs: TabItem[];

  /**
   * Default active tab value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Active tab value (controlled)
   */
  value?: string;

  /**
   * Callback when active tab changes
   */
  onValueChange?: (value: string) => void;

  /**
   * Visual variant of the tabs
   * @default 'default'
   */
  variant?: TabsVariant;

  /**
   * Orientation of the tabs
   * @default 'horizontal'
   */
  orientation?: TabsOrientation;

  /**
   * Tab activation mode
   * @default 'automatic'
   */
  activationMode?: TabsActivationMode;

  /**
   * Callback when a tab is closed
   */
  onTabClose?: (tabId: string) => void;

  /**
   * Callback when add tab button is clicked
   */
  onTabAdd?: () => void;

  /**
   * Whether to show add tab button
   * @default false
   */
  addable?: boolean;

  /**
   * Whether tabs should be scrollable
   * @default false
   */
  scrollable?: boolean;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Maximum number of tabs allowed
   * @default 10
   */
  maxTabs?: number;
}

/**
 * Preset configurations for common tab patterns
 */
export interface TabsPreset {
  variant: TabsVariant;
  orientation: TabsOrientation;
  activationMode: TabsActivationMode;
  scrollable: boolean;
  addable: boolean;
}

/**
 * Collection of preset tab configurations
 */
export const TabsPresets: Record<string, TabsPreset> = {
  basic: {
    variant: 'default',
    orientation: 'horizontal',
    activationMode: 'automatic',
    scrollable: false,
    addable: false,
  },

  pills: {
    variant: 'pills',
    orientation: 'horizontal',
    activationMode: 'automatic',
    scrollable: false,
    addable: false,
  },

  underline: {
    variant: 'underline',
    orientation: 'horizontal',
    activationMode: 'automatic',
    scrollable: false,
    addable: false,
  },

  closeable: {
    variant: 'default',
    orientation: 'horizontal',
    activationMode: 'automatic',
    scrollable: true,
    addable: true,
  },

  vertical: {
    variant: 'vertical',
    orientation: 'vertical',
    activationMode: 'manual',
    scrollable: false,
    addable: false,
  },
};
