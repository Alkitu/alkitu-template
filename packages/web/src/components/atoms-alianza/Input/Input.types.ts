import type { InputHTMLAttributes } from 'react';

/**
 * Input variant types
 */
export type InputVariant = 'default' | 'filled' | 'outline';

/**
 * Input size types
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input validation state types
 */
export type InputState = 'default' | 'error' | 'success' | 'warning';

/**
 * Props for Input component (Pure Atom - No label/description)
 *
 * This is a pure atom component that handles only the input element itself.
 * For composed inputs with labels, use FormInput molecule.
 *
 * @example
 * ```tsx
 * // Pure atom usage
 * <Input type="email" placeholder="Enter email" />
 * <Input variant="filled" size="lg" />
 * <Input state="error" />
 * ```
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Visual variant of the input
   * @default 'default'
   */
  variant?: InputVariant;

  /**
   * Size of the input
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Validation state of the input
   * @default 'default'
   */
  state?: InputState;

  /**
   * Icon element to display on the left side of the input
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon element to display on the right side of the input
   */
  rightIcon?: React.ReactNode;

  /**
   * Show a password visibility toggle button on the right side
   * Only applicable when type="password"
   * @default false
   */
  showPasswordToggle?: boolean;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: React.CSSProperties;

  /**
   * Whether to use system colors (for special cases)
   * @default true
   */
  useSystemColors?: boolean;
}
