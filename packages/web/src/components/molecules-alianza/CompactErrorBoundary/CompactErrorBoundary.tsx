'use client';

import React, { Component, ErrorInfo } from 'react';
import { Alert } from '@/components/atoms-alianza/Alert';
import { Button } from '@/components/molecules-alianza/Button';
import { Icon } from '@/components/atoms-alianza/Icon';
import { cn } from '@/lib/utils';
import type {
  CompactErrorBoundaryProps,
  CompactErrorBoundaryState,
} from './CompactErrorBoundary.types';

/**
 * CompactErrorBoundary - Molecule Component
 *
 * A lightweight error boundary for inline error handling in cards, sections, and forms.
 * Unlike page-level error boundaries, this shows a compact inline error message
 * and allows retry without affecting sibling components.
 *
 * Features:
 * - React error boundary with componentDidCatch lifecycle
 * - Compact error display using Alert atom
 * - Reset/retry functionality with Button molecule
 * - Optional custom fallback UI
 * - Error details toggle (development mode)
 * - Stack trace display (dev only)
 * - Error logging callback support
 * - Theme-aware styling
 * - Full accessibility support (ARIA)
 * - Nested error boundary support
 *
 * Use Cases:
 * - Form sections that may fail independently
 * - Dashboard cards that load data
 * - Feature sections that shouldn't break the entire page
 * - Dynamic content blocks
 * - Async data loading components
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CompactErrorBoundary>
 *   <RequestListCard />
 * </CompactErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * // With custom error message
 * <CompactErrorBoundary errorMessage="Failed to load requests">
 *   <RequestListCard />
 * </CompactErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * // With error logging
 * <CompactErrorBoundary
 *   onError={(error, errorInfo) => {
 *     console.error('Component error:', error, errorInfo);
 *     Sentry.captureException(error, { extra: errorInfo });
 *   }}
 * >
 *   <CriticalComponent />
 * </CompactErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * // With custom fallback
 * <CompactErrorBoundary
 *   fallback={<CustomErrorUI />}
 * >
 *   <MyComponent />
 * </CompactErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * // Different sizes
 * <CompactErrorBoundary size="sm">
 *   <SmallWidget />
 * </CompactErrorBoundary>
 * ```
 */
export class CompactErrorBoundary extends Component<
  CompactErrorBoundaryProps,
  CompactErrorBoundaryState
> {
  constructor(props: CompactErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): CompactErrorBoundaryState {
    // Update state so next render shows fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details to console
    console.error('CompactErrorBoundary caught error:', error);
    console.error('Error component stack:', errorInfo.componentStack);

    // Call optional error callback for external logging
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    // Reset error state to retry rendering children
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
      showErrorDetails = true,
      size = 'md',
    } = this.props;

    // Normal state - render children
    if (!this.state.hasError) {
      return children;
    }

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Size configurations
    const sizeConfig = {
      sm: {
        alert: 'sm' as const,
        button: 'sm' as const,
        iconSize: 'sm' as const,
        padding: 'p-3',
      },
      md: {
        alert: 'md' as const,
        button: 'md' as const,
        iconSize: 'md' as const,
        padding: 'p-4',
      },
      lg: {
        alert: 'lg' as const,
        button: 'md' as const,
        iconSize: 'lg' as const,
        padding: 'p-5',
      },
    };

    const config = sizeConfig[size];

    // Default compact error UI using Alianza components
    return (
      <div
        className={cn('flex flex-col gap-3', className)}
        aria-live="assertive"
        data-testid="compact-error-boundary"
      >
        <Alert
          variant="error"
          size={config.alert}
          showIcon
          className="w-full"
        >
          <div className="flex flex-col gap-2">
            <p className="font-medium">{errorMessage}</p>

            {showRetry && (
              <div className="flex items-center gap-2 mt-1">
                <Button
                  onClick={this.handleRetry}
                  variant="outline"
                  size={config.button}
                  iconLeft={<Icon name="refreshCw" size={config.iconSize} />}
                  aria-label="Retry loading"
                  data-testid="retry-button"
                >
                  Try again
                </Button>
              </div>
            )}
          </div>
        </Alert>

        {/* Development-only error details */}
        {process.env.NODE_ENV === 'development' &&
          showErrorDetails &&
          this.state.error && (
            <details
              className={cn(
                'w-full rounded-md border border-border bg-muted/50',
                config.padding
              )}
              data-testid="error-details"
            >
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground font-medium">
                Error details (dev only)
              </summary>
              <pre className="mt-3 p-3 text-xs bg-background rounded border border-border overflow-auto max-h-48 whitespace-pre-wrap break-words">
                <strong>Message:</strong>
                {'\n'}
                {this.state.error.message}
                {'\n\n'}
                <strong>Stack Trace:</strong>
                {'\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
      </div>
    );
  }
}

export default CompactErrorBoundary;
