/**
 * ModeToggle Types - Atomic Design Molecule
 *
 * Type definitions for the theme mode toggle component.
 * Supports light/dark/system theme switching with multiple display variants.
 *
 * @module molecules-alianza/ModeToggle
 */

/**
 * Theme mode options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Display variant for the toggle
 */
export type ModeToggleVariant = 'icon' | 'buttons';

/**
 * Button size options
 */
export type ModeToggleSize = 'sm' | 'md' | 'lg';

/**
 * Props for ModeToggle component
 */
export interface ModeToggleProps {
  /**
   * Display mode for the toggle
   * - 'icon': Shows icon button with dropdown menu
   * - 'buttons': Shows three separate buttons
   * @default 'icon'
   */
  variant?: ModeToggleVariant;

  /**
   * Size of the toggle button(s)
   * @default 'md'
   */
  size?: ModeToggleSize;

  /**
   * Show labels alongside icons (buttons variant only)
   * @default false
   */
  showLabels?: boolean;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Callback when theme changes (optional)
   * Useful for tracking theme changes or syncing with external state
   */
  onThemeChange?: (theme: ThemeMode) => void;

  /**
   * Custom icon sizes (overrides default sizes)
   */
  iconSize?: number;

  /**
   * Show tooltip on hover (icon variant only)
   * @default false
   */
  showTooltip?: boolean;

  /**
   * Custom tooltip text
   * @default 'Toggle theme'
   */
  tooltipText?: string;

  /**
   * Dropdown menu alignment (icon variant only)
   * @default 'end'
   */
  align?: 'start' | 'center' | 'end';

  /**
   * Disable theme switching
   * @default false
   */
  disabled?: boolean;
}

/**
 * Theme option configuration
 */
export interface ThemeOption {
  /**
   * Theme mode value
   */
  value: ThemeMode;

  /**
   * Display label
   */
  label: string;

  /**
   * Icon component
   */
  icon: React.ComponentType<{ className?: string }>;

  /**
   * Aria label for accessibility
   */
  ariaLabel: string;
}
