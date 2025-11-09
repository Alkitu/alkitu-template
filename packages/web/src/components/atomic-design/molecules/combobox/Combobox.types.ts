import type { ReactNode } from 'react';

/**
 * Option structure for Combobox
 */
export interface ComboboxOption {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Value to use */
  value: string;
  /** Optional description text */
  description?: string;
  /** Optional icon element */
  icon?: ReactNode;
  /** Optional badge configuration */
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  /** Disabled state for this option */
  disabled?: boolean;
}

/**
 * Variant options for Combobox
 */
export type ComboboxVariant = 'default' | 'multiple' | 'creatable' | 'async';

/**
 * Props for Combobox molecule
 */
export interface ComboboxProps {
  /**
   * List of options to display
   */
  options: ComboboxOption[];

  /**
   * Current selected value(s)
   * Can be string for single selection or string[] for multiple
   */
  value?: string | string[];

  /**
   * Change handler - receives string or string[] based on variant
   */
  onChange?: (value: string | string[]) => void;

  /**
   * Placeholder text when no selection
   * @default 'Select option...'
   */
  placeholder?: string;

  /**
   * Placeholder text for search input
   * @default 'Search...'
   */
  searchPlaceholder?: string;

  /**
   * Variant of the combobox
   * - default: single selection
   * - multiple: multi-selection with badges
   * - creatable: allows creating new options
   * - async: supports async data loading
   * @default 'default'
   */
  variant?: ComboboxVariant;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Show clear button when has selection
   * @default true
   */
  clearable?: boolean;

  /**
   * Enable search functionality
   * @default true
   */
  searchable?: boolean;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Message to show when no options found
   * @default 'No option found.'
   */
  emptyMessage?: string;

  /**
   * Maximum number of selections allowed (for multiple variant)
   * @default 10
   */
  maxSelections?: number;

  /**
   * Search handler for async loading
   */
  onSearch?: (query: string) => void;

  /**
   * Loading state for async variant
   * @default false
   */
  loading?: boolean;

  /**
   * Custom className for trigger button
   */
  buttonClass?: string;

  /**
   * Custom className for popover content
   */
  popoverClass?: string;
}

/**
 * Preset configurations for common use cases
 */
export interface ComboboxPreset {
  variant: ComboboxVariant;
  searchable: boolean;
  clearable: boolean;
  maxSelections?: number;
  loading?: boolean;
}
