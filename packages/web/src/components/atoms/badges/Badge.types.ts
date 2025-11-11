export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /**
   * Visual variant of the badge
   * @default 'default'
   */
  variant?: BadgeVariant;

  /**
   * Size of the badge
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Badge content
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