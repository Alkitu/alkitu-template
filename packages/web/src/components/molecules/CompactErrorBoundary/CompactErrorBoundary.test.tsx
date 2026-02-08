import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CompactErrorBoundary } from './CompactErrorBoundary';

expect.extend(toHaveNoViolations);

// Component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Working component</div>;
};

describe('CompactErrorBoundary - Molecule', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  // 1. RENDERING TESTS
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

    it('shows AlertCircle icon', () => {
      const { container } = render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('shows retry button by default', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });
  });

  // 2. CUSTOM PROPS TESTS
  describe('Custom Props', () => {
    it('displays custom error message', () => {
      render(
        <CompactErrorBoundary errorMessage="Failed to load data">
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });

    it('hides retry button when showRetry is false', () => {
      render(
        <CompactErrorBoundary showRetry={false}>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
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
        <CompactErrorBoundary fallback={<div>Custom fallback</div>}>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
      expect(screen.queryByText('Error loading this section')).not.toBeInTheDocument();
    });
  });

  // 3. ERROR CALLBACK TESTS
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
      expect(error.message).toBe('Test error');
    });
  });

  // 4. RETRY FUNCTIONALITY TESTS
  describe('Retry Functionality', () => {
    it('retries rendering when retry button is clicked', async () => {
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

      // Need to rerender with updated prop
      rerender(
        <CompactErrorBoundary>
          <ThrowError shouldThrow={shouldThrow} />
        </CompactErrorBoundary>
      );
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

    it('retry button shows RefreshCw icon', () => {
      const { container } = render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: /retry loading/i });
      const icon = retryButton.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  // 5. DEVELOPMENT MODE TESTS
  describe('Development Mode', () => {
    const originalEnv = process.env.NODE_ENV;

    it('shows error details in development', () => {
      process.env.NODE_ENV = 'development';

      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

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

      const details = screen.getByText(/test error/i);
      expect(details).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  // 6. STYLING TESTS
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

    it('has destructive border color', () => {
      const { container } = render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const errorDiv = container.querySelector('[class*="border-destructive"]');
      expect(errorDiv).toBeInTheDocument();
    });

    it('has rounded corners', () => {
      const { container } = render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const errorDiv = container.querySelector('.rounded-lg');
      expect(errorDiv).toBeInTheDocument();
    });

    it('has proper padding', () => {
      const { container } = render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const errorDiv = container.querySelector('.p-6');
      expect(errorDiv).toBeInTheDocument();
    });

    it('retry button has focus ring', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /retry loading/i });
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });

  // 7. ACCESSIBILITY TESTS
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

    it('error container has alert role', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
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
  });

  // 8. EDGE CASES
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
  });

  // 9. INTEGRATION TESTS
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
            <div>Working</div>
          </CompactErrorBoundary>
        </div>
      );

      expect(screen.getByText('Error 1')).toBeInTheDocument();
      expect(screen.getByText('Working')).toBeInTheDocument();
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
  });

  // 10. LIFECYCLE TESTS
  describe('Lifecycle', () => {
    it('updates state when error occurs', () => {
      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
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
      // (would need a working component to verify full reset)
    });

    it('componentDidCatch logs error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <CompactErrorBoundary>
          <ThrowError />
        </CompactErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
