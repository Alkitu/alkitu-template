import { ReactNode, ErrorInfo } from 'react';

/**
 * Props for CompactErrorBoundary component
 *
 * @see CompactErrorBoundary
 */
export interface CompactErrorBoundaryProps {
  /**
   * Child components to wrap with error boundary
   */
  children: ReactNode;

  /**
   * Optional custom fallback UI to show when error occurs
   * If not provided, uses default inline error UI
   */
  fallback?: ReactNode;

  /**
   * Optional callback when error is caught
   * Useful for error logging/monitoring
   *
   * @example
   * ```tsx
   * onError={(error, errorInfo) => {
   *   // Log to monitoring service
   *   Sentry.captureException(error, { extra: errorInfo });
   * }}
   * ```
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /**
   * Optional custom error message to display
   * @default "Error loading this section"
   */
  errorMessage?: string;

  /**
   * Whether to show the retry button
   * @default true
   */
  showRetry?: boolean;

  /**
   * Custom className for the error container
   */
  className?: string;

  /**
   * Whether to show error details toggle in development mode
   * @default true
   */
  showErrorDetails?: boolean;

  /**
   * Size variant for the error UI
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Internal state for CompactErrorBoundary
 */
export interface CompactErrorBoundaryState {
  /**
   * Whether an error has been caught
   */
  hasError: boolean;

  /**
   * The caught error instance
   */
  error: Error | null;
}
