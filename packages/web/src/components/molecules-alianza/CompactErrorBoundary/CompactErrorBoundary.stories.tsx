import type { Meta, StoryObj } from '@storybook/react';
import { CompactErrorBoundary } from './CompactErrorBoundary';
import { useState } from 'react';
import { Button } from '@/components/molecules-alianza/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

/**
 * CompactErrorBoundary - Molecule Component
 *
 * A lightweight error boundary for inline error handling in cards, sections, and forms.
 * Shows compact error messages with retry functionality without breaking the entire page.
 *
 * ## Features
 * - React Error Boundary lifecycle
 * - Compact error display using Alert
 * - Retry/reset functionality
 * - Optional custom fallback UI
 * - Error details toggle (dev mode)
 * - Stack trace display (dev only)
 * - Error logging callback
 * - Theme-aware styling
 * - Full ARIA support
 * - Size variants (sm, md, lg)
 *
 * ## Usage Guidelines
 * - Use for component-level error isolation
 * - Ideal for dashboard widgets and cards
 * - Perfect for async data loading sections
 * - Prevents errors from breaking sibling components
 * - Always provide meaningful error messages
 */
const meta = {
  title: 'Molecules/CompactErrorBoundary',
  component: CompactErrorBoundary,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A molecule component that catches JavaScript errors in child components, logs errors, and displays a fallback UI.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Child components to wrap with error boundary',
      control: false,
    },
    errorMessage: {
      description: 'Custom error message to display',
      control: 'text',
    },
    showRetry: {
      description: 'Whether to show the retry button',
      control: 'boolean',
    },
    showErrorDetails: {
      description: 'Whether to show error details in development',
      control: 'boolean',
    },
    size: {
      description: 'Size variant for the error UI',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    className: {
      description: 'Custom CSS classes',
      control: 'text',
    },
    fallback: {
      description: 'Custom fallback UI',
      control: false,
    },
    onError: {
      description: 'Callback when error is caught',
      action: 'error caught',
    },
  },
} satisfies Meta<typeof CompactErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

// Error-throwing component for stories
const ThrowError = ({ message = 'Component error occurred' }: { message?: string }) => {
  throw new Error(message);
};

// Working component
const WorkingComponent = () => (
  <div className="p-4 border rounded-lg bg-background">
    <p className="text-sm text-muted-foreground">
      This component is working correctly! No errors here.
    </p>
  </div>
);

// Async error component
const AsyncErrorComponent = () => {
  throw new Error('Network request failed: Unable to fetch data');
};

/**
 * Normal State - No Error
 *
 * Shows the component in its normal state when no errors occur.
 * Children render normally without any error UI.
 */
export const NormalState: Story = {
  args: {
    children: <WorkingComponent />,
  },
};

/**
 * Basic Error
 *
 * Shows the default error state with standard error message and retry button.
 * This is the most common use case for error boundaries.
 */
export const BasicError: Story = {
  args: {
    children: <ThrowError />,
  },
};

/**
 * Error with Custom Message
 *
 * Demonstrates how to provide a custom, user-friendly error message.
 * Use this to give context-specific error information.
 */
export const CustomMessage: Story = {
  args: {
    children: <ThrowError />,
    errorMessage: 'Failed to load user dashboard',
  },
};

/**
 * Error with Details (Development)
 *
 * In development mode, shows expandable error details including
 * the error message and stack trace for debugging.
 */
export const WithErrorDetails: Story = {
  args: {
    children: <ThrowError message="Detailed error for debugging" />,
    showErrorDetails: true,
  },
};

/**
 * Error Without Retry
 *
 * Shows error state without the retry button.
 * Use this when retry doesn't make sense or when you want
 * to handle recovery differently.
 */
export const NoRetryButton: Story = {
  args: {
    children: <ThrowError />,
    showRetry: false,
    errorMessage: 'This feature is currently unavailable',
  },
};

/**
 * Custom Fallback UI
 *
 * Demonstrates using a completely custom fallback UI
 * instead of the default error display.
 */
export const CustomFallback: Story = {
  args: {
    children: <ThrowError />,
    fallback: (
      <div className="p-6 text-center border-2 border-dashed border-muted rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Oops! Something went wrong</h3>
        <p className="text-sm text-muted-foreground">
          We're working on fixing this. Please try again later.
        </p>
      </div>
    ),
  },
};

/**
 * Network Error Example
 *
 * Shows a realistic example of handling network/API errors.
 * Common scenario in dashboard widgets and data-loading components.
 */
export const NetworkError: Story = {
  args: {
    children: <AsyncErrorComponent />,
    errorMessage: 'Unable to connect to the server',
    showRetry: true,
  },
};

/**
 * Validation Error Example
 *
 * Example of handling validation or data processing errors.
 * Useful in forms and data entry sections.
 */
export const ValidationError: Story = {
  args: {
    children: <ThrowError message="Validation failed: Invalid email format" />,
    errorMessage: 'Please check your input and try again',
    showRetry: true,
  },
};

/**
 * Small Size Variant
 *
 * Compact error display for smaller UI elements like cards or widgets.
 */
export const SmallSize: Story = {
  args: {
    children: <ThrowError />,
    size: 'sm',
    errorMessage: 'Widget failed to load',
  },
};

/**
 * Large Size Variant
 *
 * Larger error display for prominent sections or full-width containers.
 */
export const LargeSize: Story = {
  args: {
    children: <ThrowError />,
    size: 'lg',
    errorMessage: 'Failed to load content',
  },
};

/**
 * Nested Error Boundaries
 *
 * Demonstrates how multiple error boundaries can work together.
 * Each boundary catches errors in its own children without affecting siblings.
 */
export const NestedBoundaries: Story = {
  render: () => (
    <div className="space-y-4">
      <CompactErrorBoundary errorMessage="Card 1 failed">
        <ThrowError message="Error in card 1" />
      </CompactErrorBoundary>

      <CompactErrorBoundary errorMessage="Card 2 failed">
        <WorkingComponent />
      </CompactErrorBoundary>

      <CompactErrorBoundary errorMessage="Card 3 failed">
        <WorkingComponent />
      </CompactErrorBoundary>
    </div>
  ),
};

/**
 * Dashboard Layout Example
 *
 * Realistic example showing error boundaries in a dashboard grid layout.
 * Demonstrates error isolation - one failed card doesn't break others.
 */
export const DashboardLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CompactErrorBoundary errorMessage="Failed to load analytics">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-semibold mb-2">Analytics Widget</h3>
          <WorkingComponent />
        </div>
      </CompactErrorBoundary>

      <CompactErrorBoundary errorMessage="Failed to load user stats">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-semibold mb-2">User Stats</h3>
          <ThrowError message="API request failed" />
        </div>
      </CompactErrorBoundary>

      <CompactErrorBoundary errorMessage="Failed to load recent activity">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <WorkingComponent />
        </div>
      </CompactErrorBoundary>

      <CompactErrorBoundary errorMessage="Failed to load notifications">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-semibold mb-2">Notifications</h3>
          <WorkingComponent />
        </div>
      </CompactErrorBoundary>
    </div>
  ),
};

/**
 * With Error Logging
 *
 * Demonstrates error logging callback for monitoring and analytics.
 * In production, you would send errors to a service like Sentry.
 */
export const WithErrorLogging: Story = {
  args: {
    children: <ThrowError message="Critical error that should be logged" />,
    errorMessage: 'Something went wrong',
    onError: (error, errorInfo) => {
      console.log('Error caught:', error.message);
      console.log('Component stack:', errorInfo.componentStack);
      // In production: send to Sentry, LogRocket, etc.
    },
  },
};

/**
 * Interactive Retry Demo
 *
 * Interactive demo showing retry functionality.
 * Click the trigger button to simulate an error, then use retry to recover.
 */
export const InteractiveRetryDemo: Story = {
  render: () => {
    const [shouldError, setShouldError] = useState(false);

    const ConditionalError = () => {
      if (shouldError) {
        throw new Error('Simulated error for demo');
      }
      return (
        <div className="p-4 border rounded-lg bg-success/10 text-success">
          <p className="font-medium">Component loaded successfully!</p>
          <Button
            onClick={() => setShouldError(true)}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Trigger Error
          </Button>
        </div>
      );
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Click "Trigger Error" to simulate an error, then use "Try again" to recover.
        </p>
        <CompactErrorBoundary
          errorMessage="Component encountered an error"
          onError={() => setShouldError(false)}
        >
          <ConditionalError />
        </CompactErrorBoundary>
      </div>
    );
  },
};

/**
 * Form Section Error
 *
 * Example of using error boundaries in form sections.
 * Useful for multi-step forms where one section failing shouldn't break others.
 */
export const FormSectionError: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <CompactErrorBoundary errorMessage="Failed to load personal information">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-3">Personal Information</h3>
          <WorkingComponent />
        </div>
      </CompactErrorBoundary>

      <CompactErrorBoundary errorMessage="Failed to load payment details" size="sm">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-3">Payment Details</h3>
          <ThrowError message="Payment service unavailable" />
        </div>
      </CompactErrorBoundary>

      <CompactErrorBoundary errorMessage="Failed to load preferences">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-3">Preferences</h3>
          <WorkingComponent />
        </div>
      </CompactErrorBoundary>
    </div>
  ),
};

/**
 * Card Integration Example
 *
 * Shows integration with Card components for polished UI.
 */
export const CardIntegration: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Working Card</CardTitle>
        </CardHeader>
        <CardContent>
          <CompactErrorBoundary>
            <WorkingComponent />
          </CompactErrorBoundary>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Card with Error</CardTitle>
        </CardHeader>
        <CardContent>
          <CompactErrorBoundary errorMessage="Failed to load card content" size="sm">
            <ThrowError />
          </CompactErrorBoundary>
        </CardContent>
      </Card>
    </div>
  ),
};
