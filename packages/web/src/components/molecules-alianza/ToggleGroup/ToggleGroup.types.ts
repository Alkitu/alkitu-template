import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/**
 * Toggle group item definition
 */
export interface ToggleGroupItem {
  /**
   * Unique value for this item
   */
  value: string;

  /**
   * Label content to display
   */
  label: ReactNode;

  /**
   * Optional icon name (Lucide icon) to display before label
   */
  icon?: string;

  /**
   * Whether this specific item is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Selection type for toggle group
 */
export type ToggleGroupType = 'single' | 'multiple';

/**
 * Size variants for toggle group
 */
export type ToggleGroupSize = 'sm' | 'md' | 'lg';

/**
 * Visual variants for toggle group
 */
export type ToggleGroupVariant = 'default' | 'outline';

/**
 * Orientation of toggle group
 */
export type ToggleGroupOrientation = 'horizontal' | 'vertical';

/**
 * Props for ToggleGroup molecule
 */
export interface ToggleGroupProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /**
   * Toggle group items
   */
  items: ToggleGroupItem[];

  /**
   * Selection type
   * @default 'single'
   */
  type?: ToggleGroupType;

  /**
   * Selected values (controlled mode)
   */
  value?: string | string[];

  /**
   * Default selected values (uncontrolled mode)
   */
  defaultValue?: string | string[];

  /**
   * Size variant
   * @default 'md'
   */
  size?: ToggleGroupSize;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: ToggleGroupVariant;

  /**
   * Orientation of the toggle group
   * @default 'horizontal'
   */
  orientation?: ToggleGroupOrientation;

  /**
   * Whether entire toggle group is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Change handler for value changes
   */
  onValueChange?: (value: string | string[]) => void;

  /**
   * ARIA label for the group
   */
  'aria-label'?: string;

  /**
   * Test ID for testing
   */
  'data-testid'?: string;

  /**
   * Theme variable overrides
   */
  themeOverride?: React.CSSProperties;
}
