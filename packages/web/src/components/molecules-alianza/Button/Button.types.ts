import type { LucideIcon } from 'lucide-react';

export type ButtonVariant =
  | 'main'      // Primary action (maps to 'primary' from Standard)
  | 'active'    // Accent/highlight
  | 'outline'   // Outlined button
  | 'nude'      // Transparent, minimal (maps to 'ghost' from Standard)
  | 'solid'     // Alias for 'main' (backward compat)
  | 'ghost'     // Alias for 'nude' (backward compat)
  | 'destructive' // Danger/delete actions
  | 'primary'   // Standard compat
  | 'secondary' // Standard compat
  | 'default'   // Legacy compat → main
  | 'link'      // Legacy compat → nude
  | 'loading'   // Legacy compat → main (loading handled via loading prop)
  | 'icon'      // Legacy compat → main (icon-only handled via iconOnly prop)
  | 'warning'   // Legacy compat → main
  | 'error'     // Legacy compat → destructive
  | 'success';  // Legacy compat → main

export type ButtonSize = 'sm' | 'md' | 'lg' | 'default' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default 'main'
   */
  variant?: ButtonVariant;

  /**
   * Size of the button
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button is in loading state
   * Shows spinner and disables interaction
   * @default false
   */
  loading?: boolean;

  /**
   * Icon to display on the left side
   * Can be a React node or Lucide icon name
   */
  iconLeft?: React.ReactNode;

  /**
   * Icon to display on the right side
   * Can be a React node or Lucide icon name
   */
  iconRight?: React.ReactNode;

  /**
   * Whether this is an icon-only button (no text)
   * Makes button square aspect ratio
   * @default false
   */
  iconOnly?: boolean;

  /**
   * Whether the button should take full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Button content
   */
  children?: React.ReactNode;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: Record<string, string>;

  /**
   * Use as child component (advanced usage with Radix Slot)
   * Renders the button styles on the child element instead
   * @default false
   */
  asChild?: boolean;

  /**
   * Custom class name to merge with button styles
   */
  className?: string;
}
