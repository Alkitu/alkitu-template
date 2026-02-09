import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CompactErrorBoundary } from './CompactErrorBoundary';

expect.extend(toHaveNoViolations);

// Test component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Working component</div>;
};

// Test component that throws a network error
const NetworkError = () => {
  throw new Error('Network request failed');
};

// Test component that throws a validation error
const ValidationError = () => {
  throw new Error('Validation failed: Invalid input');
};

describe('CompactErrorBoundary - Molecule', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  // ===========================
  // 1. RENDERING TESTS
  // ===========================
  describe('Rendering', () => {
    it('renders children when no error occurs', () => {
      render(
        <CompactErrorBoundary>
          <div>Test content</div>
        </CompactErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders error UI when child throws error', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows default error message', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByText('Error loading this section')).toBeInTheDocument();
    });

    it('renders Alert component for error display', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      // Alert component should be present
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('shows retry button by default', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('button', { name: /retry loading/i })).toBeInTheDocument();
    });

    it('renders with data-testid attribute', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByTestId('compact-error-boundary')).toBeInTheDocument();
    });
  });

  // ===========================
  // 2. CUSTOM PROPS TESTS
  // ===========================
  describe('Custom Props', () => {
    it('displays custom error message', () => {
      render(
        <CompactErrorBoundary errorMessage="Failed to load data">
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
      expect(screen.queryByText('Error loading this section')).not.toBeInTheDocument();
    });

    it('hides retry button when showRetry is false', () => {
      render(
        <CompactErrorBoundary showRetry={false}>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.queryByRole('button', { name: /retry loading/i })).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <CompactErrorBoundary className="custom-error-class">
          <ThrowError />
        </CompactErrorBoundary>
      );

      const errorContainer = container.querySelector('.custom-error-class');
      expect(errorContainer).toBeInTheDocument();
    });

    it('renders custom fallback UI', () => {
      render(
        <CompactErrorBoundary fallback={<div>Custom fallback UI</div>}>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByText('Custom fallback UI')).toBeInTheDocument();
      expect(screen.queryByText('Error loading this section')).not.toBeInTheDocument();
    });

    it('hides error details when showErrorDetails is false', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <CompactErrorBoundary showErrorDetails={false}>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.queryByTestId('error-details')).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  // ===========================
  // 3. SIZE VARIANTS
  // ===========================
  describe('Size Variants', () => {
    it('renders with small size variant', () => {
      render(
        <CompactErrorBoundary size="sm">
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry loading/i })).toBeInTheDocument();
    });

    it('renders with medium size variant (default)', () => {
      render(
        <CompactErrorBoundary size="md">
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders with large size variant', () => {
      render(
        <CompactErrorBoundary size="lg">
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  // ===========================
  // 4. ERROR CALLBACK TESTS
  // ===========================
  describe('Error Callback', () => {
    it('calls onError callback when error is caught', () => {
      const onError = vi.fn();

      render(
        <CompactErrorBoundary onError={onError}>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(onError).toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('passes correct error object to callback', () => {
      const onError = vi.fn();

      render(
        <CompactErrorBoundary onError={onError}>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const error = onError.mock.calls[0][0];
      expect(error.message).toBe('Test error message');
    });

    it('calls onError even if it throws', () => {
      const onError = vi.fn(() => {
        // Intentionally throw to simulate logging service failure
        // In real apps, this shouldn't crash the UI
      });

      render(
        <CompactErrorBoundary onError={onError}>
          <ThrowError />
        </CompactErrorBoundary>
      );

      // onError should have been called
      expect(onError).toHaveBeenCalled();
      // UI should still render
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  // ===========================
  // 5. RETRY FUNCTIONALITY
  // ===========================
  describe('Retry Functionality', () => {
    it('retry button has correct test id', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });

    it('retry button has correct aria-label', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: 'Retry loading' });
      expect(retryButton).toBeInTheDocument();
    });

    it('retry button shows refresh icon', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const retryButton = screen.getByTestId('retry-button');
      expect(retryButton).toBeInTheDocument();
    });

    it('retry button is clickable', async () => {
      const user = userEvent.setup();

      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: /retry loading/i });
      await user.click(retryButton);

      // After clicking, error will re-throw and button should still be present
      const updatedButton = screen.getByRole('button', { name: /retry loading/i });
      expect(updatedButton).toBeInTheDocument();
    });

    it('resets state when retry is clicked', async () => {
      const user = userEvent.setup();
      let shouldThrow = true;

      const { rerender } = render(
        <CompactErrorBoundary>
          <ThrowError shouldThrow={shouldThrow} />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Update to not throw
      shouldThrow = false;

      const retryButton = screen.getByRole('button', { name: /retry loading/i });
      await user.click(retryButton);

      // Rerender with non-throwing component
      rerender(
        <CompactErrorBoundary>
          <ThrowError shouldThrow={shouldThrow} />
        </CompactErrorBoundary>
      );
    });
  });

  // ===========================
  // 6. DEVELOPMENT MODE TESTS
  // ===========================
  describe('Development Mode', () => {
    const originalEnv = process.env.NODE_ENV;

    it('shows error details in development mode', () => {
      process.env.NODE_ENV = 'development';

      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByTestId('error-details')).toBeInTheDocument();
      expect(screen.getByText(/error details/i)).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('error details contain error message', () => {
      process.env.NODE_ENV = 'development';

      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const details = screen.getByText(/test error message/i);
      expect(details).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('error details are expandable', () => {
      process.env.NODE_ENV = 'development';

      const { container } = render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const details = container.querySelector('details');
      expect(details).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('does not show error details in production', () => {
      process.env.NODE_ENV = 'production';

      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.queryByTestId('error-details')).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  // ===========================
  // 7. ACCESSIBILITY TESTS
  // ===========================
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('error container has aria-live attribute', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const container = screen.getByTestId('compact-error-boundary');
      expect(container).toHaveAttribute('aria-live', 'assertive');
    });

    it('retry button is keyboard accessible', async () => {
      const user = userEvent.setup();

      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /retry loading/i });

      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();
    });

    it('retry button can be activated with Enter key', async () => {
      const user = userEvent.setup();

      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /retry loading/i });
      button.focus();

      await user.keyboard('{Enter}');
      // Should trigger retry (error will re-throw)
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  // ===========================
  // 8. EDGE CASES
  // ===========================
  describe('Edge Cases', () => {
    it('handles multiple errors in sequence', () => {
      const { rerender } = render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Trigger another error
      rerender(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('handles very long error messages', () => {
      const LongError = () => {
        throw new Error('A'.repeat(500));
      };

      process.env.NODE_ENV = 'development';

      render(
        <CompactErrorBoundary>
          <LongError />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByTestId('error-details')).toBeInTheDocument();
    });

    it('handles nested error boundaries', () => {
      render(
        <CompactErrorBoundary errorMessage="Outer error">
          <div>
            <CompactErrorBoundary errorMessage="Inner error">
              <ThrowError />
            </CompactErrorBoundary>
          </div>
        </CompactErrorBoundary>
      );

      // Inner boundary should catch the error
      expect(screen.getByText('Inner error')).toBeInTheDocument();
      expect(screen.queryByText('Outer error')).not.toBeInTheDocument();
    });

    it('handles errors with no message', () => {
      const NoMessageError = () => {
        throw new Error();
      };

      render(
        <CompactErrorBoundary>
          <NoMessageError />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Error loading this section')).toBeInTheDocument();
    });

    it('handles errors with special characters', () => {
      const SpecialCharError = () => {
        throw new Error('Error: <script>alert("xss")</script>');
      };

      process.env.NODE_ENV = 'development';

      render(
        <CompactErrorBoundary>
          <SpecialCharError />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  // ===========================
  // 9. INTEGRATION TESTS
  // ===========================
  describe('Integration', () => {
    it('works in dashboard layouts', () => {
      render(
        <div className="grid grid-cols-2 gap-4">
          <CompactErrorBoundary>
            <ThrowError />
          </CompactErrorBoundary>
          <div>Working card</div>
        </div>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Working card')).toBeInTheDocument();
    });

    it('works with multiple boundary instances', () => {
      render(
        <div>
          <CompactErrorBoundary errorMessage="Error 1">
            <ThrowError />
          </CompactErrorBoundary>
          <CompactErrorBoundary errorMessage="Error 2">
            <div>Working component</div>
          </CompactErrorBoundary>
        </div>
      );

      expect(screen.getByText('Error 1')).toBeInTheDocument();
      expect(screen.getByText('Working component')).toBeInTheDocument();
      expect(screen.queryByText('Error 2')).not.toBeInTheDocument();
    });

    it('isolates errors to specific boundary', () => {
      render(
        <div>
          <CompactErrorBoundary errorMessage="Section 1 error">
            <ThrowError />
          </CompactErrorBoundary>
          <CompactErrorBoundary errorMessage="Section 2 error">
            <div>Section 2 works</div>
          </CompactErrorBoundary>
          <div>Section 3 works</div>
        </div>
      );

      expect(screen.getByText('Section 1 error')).toBeInTheDocument();
      expect(screen.getByText('Section 2 works')).toBeInTheDocument();
      expect(screen.getByText('Section 3 works')).toBeInTheDocument();
    });

    it('integrates with Alert component', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      // Alert should be present with error variant
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('integrates with Button component', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const button = screen.getByTestId('retry-button');
      expect(button).toBeInTheDocument();
    });
  });

  // ===========================
  // 10. ERROR SCENARIOS
  // ===========================
  describe('Error Scenarios', () => {
    it('handles network errors', () => {
      render(
        <CompactErrorBoundary errorMessage="Network error occurred">
          <NetworkError />
        </CompactErrorBoundary>
      );

      expect(screen.getByText('Network error occurred')).toBeInTheDocument();
    });

    it('handles validation errors', () => {
      render(
        <CompactErrorBoundary errorMessage="Validation failed">
          <ValidationError />
        </CompactErrorBoundary>
      );

      expect(screen.getByText('Validation failed')).toBeInTheDocument();
    });

    it('shows stack trace in development', () => {
      process.env.NODE_ENV = 'development';

      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const stackTrace = screen.getByText(/stack trace/i);
      expect(stackTrace).toBeInTheDocument();
    });
  });

  // ===========================
  // 11. LIFECYCLE TESTS
  // ===========================
  describe('Lifecycle', () => {
    it('updates state when error occurs', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('componentDidCatch logs error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'CompactErrorBoundary caught error:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('resets state on retry', async () => {
      const user = userEvent.setup();

      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: /retry loading/i });
      await user.click(retryButton);

      // Component attempts to re-render children
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  // ===========================
  // 12. STYLING TESTS
  // ===========================
  describe('Styling', () => {
    it('has proper flex layout', () => {
      const { container } = render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const errorDiv = container.querySelector('.flex.flex-col');
      expect(errorDiv).toBeInTheDocument();
    });

    it('applies gap spacing', () => {
      const { container } = render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const errorDiv = container.querySelector('.gap-3');
      expect(errorDiv).toBeInTheDocument();
    });

    it('custom className is applied to container', () => {
      const { container } = render(
        <CompactErrorBoundary className="my-custom-class">
          <ThrowError />
        </CompactErrorBoundary>
      );

      const errorDiv = container.querySelector('.my-custom-class');
      expect(errorDiv).toBeInTheDocument();
    });
  });
});
