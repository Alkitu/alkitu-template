import type { ReactNode, CSSProperties, HTMLAttributes } from 'react';

/**
 * Variant options for Alert component
 */
export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'default';

/**
 * Size options for Alert component
 */
export type AlertSize = 'sm' | 'md' | 'lg';

/**
 * Props for Alert component
 */
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Alert content
   */
  children: ReactNode;

  /**
   * Visual variant of the alert
   * @default 'default'
   */
  variant?: AlertVariant;

  /**
   * Alert title (optional)
   */
  title?: string;

  /**
   * Custom icon component (overrides default variant icon)
   */
  icon?: React.ComponentType<any>;

  /**
   * Whether to show the icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Whether the alert can be dismissed
   * @default false
   */
  dismissible?: boolean;

  /**
   * Callback when alert is dismissed
   */
  onDismiss?: () => void;

  /**
   * Size of the alert
   * @default 'md'
   */
  size?: AlertSize;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Custom inline styles
   */
  style?: CSSProperties;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
