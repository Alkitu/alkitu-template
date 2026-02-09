import type { ReactNode } from 'react';

export type ChipVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'solid'
  | 'destructive';

export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual variant of the chip
   * @default 'default'
   */
  variant?: ChipVariant;

  /**
   * Size of the chip
   * @default 'md'
   */
  size?: ChipSize;

  /**
   * Whether the chip can be removed/deleted
   * @default false
   */
  deletable?: boolean;

  /**
   * Callback when chip is deleted
   */
  onDelete?: () => void;

  /**
   * Whether the chip is selected (for selectable chips)
   * @default false
   */
  selected?: boolean;

  /**
   * Whether the chip is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon to display at the start of the chip
   */
  startIcon?: ReactNode;

  /**
   * Icon to display at the end of the chip (before delete button if deletable)
   */
  endIcon?: ReactNode;

  /**
   * Chip content
   */
  children?: ReactNode;

  /**
   * Additional CSS classes
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
