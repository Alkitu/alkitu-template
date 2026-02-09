import type { ReactNode } from 'react';

/**
 * TabItem - Individual tab configuration
 */
export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

/**
 * TabsAlianza Props
 */
export interface TabsAlianzaProps {
  /** The value of the tab that should be active by default */
  defaultValue?: string;
  /** The controlled value of the active tab */
  value?: string;
  /** Callback fired when the active tab changes */
  onValueChange?: (value: string) => void;
  /** Array of tab items to render */
  tabs: TabItem[];
  /** Optional CSS class name */
  className?: string;
  /** Orientation of the tabs */
  orientation?: 'horizontal' | 'vertical';
}
