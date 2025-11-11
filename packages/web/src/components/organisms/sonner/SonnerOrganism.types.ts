import type { ReactNode } from 'react';

/**
 * Toast type options for Sonner
 */
export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

/**
 * Toast position options
 */
export type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center';

/**
 * Toast action button configuration
 */
export interface ToastAction {
  /**
   * Label text for the action button
   */
  label: string;

  /**
   * Click handler for the action button
   */
  onClick: () => void;
}

/**
 * Individual toast configuration
 */
export interface Toast {
  /**
   * Unique identifier for the toast
   */
  id: string;

  /**
   * Toast title (main message)
   */
  title?: string;

  /**
   * Toast description (secondary message)
   */
  description?: string;

  /**
   * Visual type of the toast
   * @default 'default'
   */
  type?: ToastType;

  /**
   * Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
   * @default 4000
   */
  duration?: number;

  /**
   * Whether the toast can be manually dismissed
   * @default true
   */
  dismissible?: boolean;

  /**
   * Optional action button
   */
  action?: ToastAction;

  /**
   * Custom icon (overrides default type icon)
   */
  icon?: ReactNode;

  /**
   * Toast position on screen
   * @default 'bottom-right'
   */
  position?: ToastPosition;
}

/**
 * Toast context value type
 */
export interface ToastContextType {
  /**
   * Array of all active toasts
   */
  toasts: Toast[];

  /**
   * Add a new toast to the queue
   * @returns Toast ID
   */
  addToast: (toast: Omit<Toast, 'id'>) => string;

  /**
   * Remove a specific toast by ID
   */
  removeToast: (id: string) => void;

  /**
   * Clear all active toasts
   */
  clearAll: () => void;
}

/**
 * Props for the ToastProvider (SonnerOrganism)
 */
export interface SonnerOrganismProps {
  /**
   * Children components that will have access to toast context
   */
  children: ReactNode;

  /**
   * Maximum number of toasts to display at once
   * @default 5
   */
  maxToasts?: number;

  /**
   * Default position for toasts if not specified
   * @default 'bottom-right'
   */
  defaultPosition?: ToastPosition;

  /**
   * Default duration for toasts if not specified (milliseconds)
   * @default 4000
   */
  defaultDuration?: number;
}

/**
 * Toast helper functions return type
 */
export interface ToastHelpers {
  /**
   * Show a success toast
   */
  success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => string;

  /**
   * Show an error toast
   */
  error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => string;

  /**
   * Show a warning toast
   */
  warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => string;

  /**
   * Show an info toast
   */
  info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => string;

  /**
   * Show a default toast
   */
  default: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => string;
}
