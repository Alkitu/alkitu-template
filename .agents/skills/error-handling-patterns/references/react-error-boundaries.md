# React Error Boundaries

Comprehensive guide to implementing error boundaries in Next.js and React applications.

## Overview

Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI. They provide graceful error handling for the component tree.

**Important**: Error boundaries do NOT catch:
- Errors in event handlers
- Errors in async code (setTimeout, requestAnimationFrame)
- Errors in server-side rendering
- Errors thrown in the error boundary itself

## Class-Based Error Boundary

Error boundaries must be class components (React limitation).

### Basic Implementation

```typescript
'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

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
    // Log error to error reporting service
    console.error('Error Boundary caught error:', error, errorInfo);

    // Example: Send to error tracking service
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold text-destructive">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Usage

```typescript
// Wrap components that might error
export function MyPage() {
  return (
    <ErrorBoundary>
      <ComponentThatMightError />
    </ErrorBoundary>
  );
}

// With custom fallback
export function MyPageWithCustomFallback() {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3>Oops! Something went wrong</h3>
          <p>Please try refreshing the page.</p>
        </div>
      }
    >
      <ComponentThatMightError />
    </ErrorBoundary>
  );
}
```

## Next.js Error Handling

### Global Error Page

Next.js provides special `error.tsx` files for route-level error handling.

```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 border border-input bg-background hover:bg-accent rounded-md"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Route-Specific Error Pages

```typescript
// app/dashboard/error.tsx
'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Dashboard Error</h2>
        <p className="text-muted-foreground mb-4">
          Failed to load dashboard data
        </p>
        <button onClick={reset} className="btn-primary">
          Retry
        </button>
      </div>
    </div>
  );
}
```

### Global Not Found Page

```typescript
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}
```

## Specialized Error Boundaries

### Theme Error Boundary

For theme loading errors (from the Alkitu Template project):

```typescript
'use client';

import React from 'react';
import { useCompanyTheme } from '@/hooks/useCompanyTheme';

interface ThemeErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Functional component for theme errors
export const ThemeErrorBoundary: React.FC<ThemeErrorBoundaryProps> = ({
  children,
  fallback,
}) => {
  const { error, isLoading } = useCompanyTheme();

  if (error && !fallback) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-destructive">
            Theme Loading Error
          </h3>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (fallback && error) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Class component for React errors
export class ThemeErrorBoundaryClass extends React.Component<
  ThemeErrorBoundaryProps,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: ThemeErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Theme Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold text-destructive">
                Application Error
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {this.state.error?.message}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Reload
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### Query Error Boundary

For React Query errors:

```typescript
'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

export function QueryErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-semibold text-red-700">
                Failed to load data
              </h3>
              <p className="text-sm text-red-600 mt-1">{error.message}</p>
              <button
                onClick={resetErrorBoundary}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

## Error Reporting Integration

### Sentry Integration

```typescript
'use client';

import * as Sentry from '@sentry/nextjs';
import React from 'react';

export class SentryErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Send error to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              We've been notified and are working on a fix.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Error Display Components

### Inline Error Display

```typescript
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  title?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  message,
  title = 'Error',
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
```

### Form Error Display

```typescript
import { AlertTriangle } from 'lucide-react';

interface FormErrorProps {
  message?: string;
  className?: string;
}

export const FormError = ({ message, className = '' }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div
      className={`bg-destructive/15 flex items-center gap-2 p-3 rounded-md text-sm text-destructive ${className}`}
    >
      <AlertTriangle size={20} className="flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};
```

## Best Practices

1. **Granular Boundaries**: Place error boundaries at different levels of your component tree
2. **Meaningful Fallbacks**: Provide context-specific fallback UIs
3. **User Actions**: Always offer a way to recover (retry, go home, refresh)
4. **Log Errors**: Always log errors for debugging
5. **Don't Overuse**: Not every component needs an error boundary
6. **Reset State**: Provide a way to reset the error boundary
7. **Avoid Cascading**: Don't nest too many error boundaries
8. **Production vs Development**: Show more details in development

### Recommended Structure

```typescript
// Root level - catch all errors
<RootErrorBoundary>
  <App>
    {/* Feature level - granular error handling */}
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>

    <ErrorBoundary>
      <UserProfile />
    </ErrorBoundary>

    {/* Critical sections */}
    <ErrorBoundary>
      <Payment />
    </ErrorBoundary>
  </App>
</RootErrorBoundary>
```

## Handling Async Errors

Error boundaries don't catch async errors. Use try-catch:

```typescript
function MyComponent() {
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const data = await fetch('/api/data');
      // Process data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    }
  };

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchData} />;
  }

  return <div>{/* Component content */}</div>;
}
```

## Event Handler Errors

Error boundaries don't catch event handler errors. Use try-catch:

```typescript
function MyComponent() {
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    try {
      // Operation that might throw
      riskyOperation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
      console.error('Button click error:', err);
    }
  };

  return (
    <div>
      {error && <FormError message={error} />}
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```

## Testing Error Boundaries

```typescript
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// Component that throws an error
const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('should render fallback UI when error occurs', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('should render custom fallback', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();

    spy.mockRestore();
  });
});
```

## See Also

- [Error Boundary Template](../templates/error-boundary.template.tsx)
- [tRPC Error Patterns](./trpc-error-patterns.md) - Client-side error handling
- [Frontend Error Patterns](../assets/frontend-error-patterns.md) - Toast notifications, form errors
- [React Error Boundaries Documentation](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
