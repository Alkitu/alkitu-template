/**
 * Error Boundary Template
 *
 * Production-ready React Error Boundary components for Next.js applications.
 * Provides graceful error handling with fallback UI.
 *
 * Usage:
 * 1. Copy this file to your components directory (e.g., components/ErrorBoundary.tsx)
 * 2. Wrap components that might error: <ErrorBoundary><YourComponent /></ErrorBoundary>
 * 3. Optionally provide custom fallback UI
 * 4. Consider integrating error reporting (Sentry, LogRocket, etc.)
 */

'use client';

import React from 'react';

// ============================================================================
// Type Definitions
// ============================================================================

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: any[];
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ============================================================================
// Basic Error Boundary
// ============================================================================

/**
 * Basic error boundary with default fallback UI
 *
 * Usage:
 * <ErrorBoundary>
 *   <ComponentThatMightError />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console
    console.error('Error Boundary caught error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send to error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error state if resetKeys change
    if (this.state.hasError && this.props.resetKeys) {
      if (
        prevProps.resetKeys &&
        prevProps.resetKeys.some((key, index) => key !== this.props.resetKeys![index])
      ) {
        this.setState({ hasError: false, error: null });
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-3">
              <svg
                className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-destructive">
                  Something went wrong
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Compact Error Boundary
// ============================================================================

/**
 * Compact error boundary for inline errors (e.g., within a card or section)
 *
 * Usage:
 * <CompactErrorBoundary>
 *   <DashboardWidget />
 * </CompactErrorBoundary>
 */
export class CompactErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Compact Error Boundary caught error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <svg
              className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">
                {this.state.error?.message || 'Failed to load content'}
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Feature-Specific Error Boundaries
// ============================================================================

/**
 * Theme Error Boundary for theme loading errors
 */
export class ThemeErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Theme Error Boundary caught error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold text-destructive">
              Theme Loading Error
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {this.state.error?.message || 'Failed to load application theme'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Error Display Components
// ============================================================================

/**
 * Standalone error display component for showing errors without boundary
 */
export interface ErrorDisplayProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorDisplay({
  message,
  title = 'Error',
  onRetry,
  onDismiss,
}: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <div className="flex items-start gap-3">
        <svg
          className="h-5 w-5 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm mt-1">{message}</p>
          {(onRetry || onDismiss) && (
            <div className="flex gap-2 mt-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-sm text-red-700 hover:text-red-900 underline"
                >
                  Try again
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-sm text-red-700 hover:text-red-900 underline"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Form error display component
 */
export interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className = '' }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className={`bg-destructive/15 flex items-center gap-2 p-3 rounded-md text-sm text-destructive ${className}`}
    >
      <svg
        className="h-5 w-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Hook for handling async errors in functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((err: Error | unknown) => {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    setError(errorObj);
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  if (error) {
    throw error; // Will be caught by nearest error boundary
  }

  return { handleError, resetError };
}

/**
 * Example usage of useErrorHandler:
 *
 * function MyComponent() {
 *   const { handleError } = useErrorHandler();
 *
 *   const fetchData = async () => {
 *     try {
 *       const data = await fetch('/api/data');
 *       // process data
 *     } catch (err) {
 *       handleError(err);
 *     }
 *   };
 *
 *   return <div>...</div>;
 * }
 */
