export type ChipVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps {
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
   * Callback when chip is clicked
   */
  onClick?: () => void;

  /**
   * Whether the chip is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Chip content
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: Record<string, string>;

  /**
   * Whether to use system colors (for special cases)
   * @default true
   */
  useSystemColors?: boolean;
}