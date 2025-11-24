import type { LucideIcon } from 'lucide-react';
import type { IconProps } from '../icons/Icon.types';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonIconPosition = 'left' | 'right';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   * @default 'primary'
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
   * @default false
   */
  loading?: boolean;

  /**
   * Icon to display in the button (Lucide icon name)
   */
  icon?: IconProps['name'];

  /**
   * Position of the icon relative to text
   * @default 'left'
   */
  iconPosition?: ButtonIconPosition;

  /**
   * Whether the button should take full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Button content
   */
  children: React.ReactNode;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: Record<string, string>;

  /**
   * Whether to use system colors (for special cases)
   * @default true
   */
  useSystemColors?: boolean;

  /**
   * Use as child component (advanced usage)
   * @default false
   */
  asChild?: boolean;
}
