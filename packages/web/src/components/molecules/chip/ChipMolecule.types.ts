import type { HTMLAttributes } from 'react';

/**
 * Variant options for ChipMolecule
 */
export type ChipVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'destructive'
  | 'warning'
  | 'success'
  | 'outline';

/**
 * Size options for ChipMolecule
 */
export type ChipSize = 'sm' | 'md' | 'lg';

/**
 * Props for ChipMolecule component
 */
export interface ChipMoleculeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * Chip content/label
   */
  children: React.ReactNode;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: ChipVariant;

  /**
   * Size variant
   * @default 'md'
   */
  size?: ChipSize;

  /**
   * Whether chip is removable
   * @default false
   */
  removable?: boolean;

  /**
   * Whether chip is selected/active
   * @default false
   */
  selected?: boolean;

  /**
   * Whether chip is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon to display at the start
   */
  startIcon?: React.ComponentType<any>;

  /**
   * Icon to display at the end (before remove button if removable)
   */
  endIcon?: React.ComponentType<any>;

  /**
   * Avatar/image to display at the start
   */
  avatar?: React.ReactNode;

  /**
   * Click handler for the chip
   */
  onClick?: () => void;

  /**
   * Remove handler (only works if removable=true)
   */
  onRemove?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}
