'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * CompactErrorBoundary Props
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
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /**
   * Optional custom error message to display
   * Defaults to "Error loading this section"
   */
  errorMessage?: string;

  /**
   * Whether to show the retry button
   * Defaults to true
   */
  showRetry?: boolean;

  /**
   * Custom className for the error container
   */
  className?: string;
}

/**
 * CompactErrorBoundary State
 */
interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * CompactErrorBoundary Component
 *
 * A lightweight error boundary for inline error handling in cards, sections, and forms.
 * Unlike page-level error boundaries, this shows a compact inline error message
 * and allows retry without affecting sibling components.
 *
 * Use Cases:
 * - Form sections that may fail independently
 * - Dashboard cards that load data
 * - Feature sections that shouldn't break the entire page
 * - Dynamic content blocks
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CompactErrorBoundary>
 *   <RequestListCard />
 * </CompactErrorBoundary>
 *
 * // With custom error message
 * <CompactErrorBoundary errorMessage="Failed to load requests">
 *   <RequestListCard />
 * </CompactErrorBoundary>
 *
 * // With error logging
 * <CompactErrorBoundary
 *   onError={(error, errorInfo) => {
 *     console.error('Component error:', error, errorInfo);
 *     // Send to monitoring service
 *   }}
 * >
 *   <CriticalComponent />
 * </CompactErrorBoundary>
 *
 * // With custom fallback
 * <CompactErrorBoundary
 *   fallback={<div>Custom error UI</div>}
 * >
 *   <MyComponent />
 * </CompactErrorBoundary>
 * ```
 */
export class CompactErrorBoundary extends Component<CompactErrorBoundaryProps, State> {
  constructor(props: CompactErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so next render shows fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('CompactErrorBoundary caught error:', error);
    console.error('Error info:', errorInfo.componentStack);

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    // Reset error state to retry rendering
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const {
      children,
      fallback,
      errorMessage = 'Error loading this section',
      showRetry = true,
      className = '',
    } = this.props;

    if (this.state.hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default compact error UI
      return (
        <div
          className={`
            flex flex-col items-center justify-center gap-3
            p-6 rounded-lg border border-destructive/20 bg-destructive/5
            ${className}
          `}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>

          {showRetry && (
            <button
              onClick={this.handleRetry}
              className="
                flex items-center gap-2 px-3 py-1.5 text-xs
                rounded-md border border-destructive/30
                hover:bg-destructive/10 transition-colors
                focus:outline-none focus:ring-2 focus:ring-destructive/50
              "
              aria-label="Retry loading"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </button>
          )}

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-2 w-full">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                Error details (dev only)
              </summary>
              <pre className="mt-2 p-2 text-xs bg-muted rounded overflow-auto max-h-32">
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return children;
  }
}
