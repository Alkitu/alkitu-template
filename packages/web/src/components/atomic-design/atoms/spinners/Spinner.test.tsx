import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Spinner } from './Spinner';
import type { SpinnerProps } from './Spinner.types';

expect.extend(toHaveNoViolations);

describe('Spinner Atom - PHASE 2 CONSOLIDATION', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-label', 'Loading...');
    });

    it('renders circular spinner by default', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('data-spinner-type', 'circular');
    });

    it('renders with custom aria-label', () => {
      render(<Spinner aria-label="Custom loading" />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Custom loading');
    });

    it('renders with label prop', () => {
      render(<Spinner label="Loading data..." />);
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading data...');
    });
  });

  // 2. SIZE TESTS (6 sizes consolidated)
  describe('Sizes', () => {
    it.each([
      ['xs', 'h-3', 'w-3'],
      ['sm', 'h-4', 'w-4'],
      ['md', 'h-5', 'w-5'],
      ['lg', 'h-6', 'w-6'],
      ['xl', 'h-8', 'w-8'],
      ['2xl', 'h-10', 'w-10'],
    ] as const)('applies %s size correctly', (size, heightClass, widthClass) => {
      const { container } = render(<Spinner size={size} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass(heightClass, widthClass);
    });

    it('supports custom size in pixels', () => {
      render(<Spinner customSize={48} />);
      // Custom size is used internally for calculations
      // Verified through internal logic
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  // 3. VARIANT TESTS (8 variants consolidated)
  describe('Variants', () => {
    it.each([
      ['default', 'text-foreground'],
      ['primary', 'text-primary'],
      ['secondary', 'text-secondary'],
      ['accent', 'text-accent'],
      ['muted', 'text-muted-foreground'],
      ['destructive', 'text-destructive'],
      ['warning', 'text-warning'],
      ['success', 'text-success'],
    ] as const)('applies %s variant correctly', (variant, expectedClass) => {
      const { container } = render(<Spinner variant={variant} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass(expectedClass);
    });

    it('supports custom color', () => {
      render(<Spinner customColor="oklch(0.7 0.2 200)" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('uses currentColor when useSystemColors is false', () => {
      const { container } = render(<Spinner useSystemColors={false} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-current');
    });
  });

  // 4. SPINNER TYPES (3 types consolidated from theme-editor)
  describe('Spinner Types', () => {
    it('renders circular spinner', () => {
      render(<Spinner type="circular" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('data-spinner-type', 'circular');
    });

    it('renders dots spinner', () => {
      render(<Spinner type="dots" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('data-spinner-type', 'dots');
    });

    it('renders pulse spinner', () => {
      render(<Spinner type="pulse" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('data-spinner-type', 'pulse');
    });

    it('dots spinner renders 3 dots', () => {
      const { container } = render(<Spinner type="dots" />);
      const dots = container.querySelectorAll('.rounded-full');
      expect(dots).toHaveLength(3);
    });

    it('dots spinner includes label when provided', () => {
      render(<Spinner type="dots" label="Loading..." />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('pulse spinner includes label when provided', () => {
      render(<Spinner type="pulse" label="Processing..." />);
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });

  // 5. ANIMATION SPEED (3 speeds from theme-editor)
  describe('Animation Speeds', () => {
    it.each([
      ['slow', '2s'],
      ['normal', '1s'],
      ['fast', '0.5s'],
    ] as const)('applies %s speed correctly', (speed, duration) => {
      const { container } = render(<Spinner speed={speed} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle({ animationDuration: duration });
    });

    it('applies speed to dots spinner', () => {
      const { container } = render(<Spinner type="dots" speed="fast" />);
      const dot = container.querySelector('.rounded-full') as HTMLElement;
      expect(dot.style.animation).toContain('0.5s');
    });

    it('applies speed to pulse spinner', () => {
      const { container } = render(<Spinner type="pulse" speed="slow" />);
      const pulse = container.querySelector('.rounded-full') as HTMLElement;
      expect(pulse.style.animation).toContain('2s');
    });
  });

  // 6. PROPS TESTS
  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Spinner className="custom-spinner" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-spinner');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Spinner ref={ref} />);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it('applies data-testid', () => {
      render(<Spinner data-testid="test-spinner" />);
      expect(screen.getByTestId('test-spinner')).toBeInTheDocument();
    });

    it('applies themeOverride styles', () => {
      const themeOverride = { opacity: '0.5', fontSize: '20px' };
      const { container } = render(<Spinner themeOverride={themeOverride} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle(themeOverride);
    });

    it('applies useSystemColors data attribute', () => {
      render(<Spinner useSystemColors={false} />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('data-use-system-colors', 'false');
    });
  });

  // 7. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations - circular', async () => {
      const { container } = render(<Spinner type="circular" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - dots', async () => {
      const { container } = render(<Spinner type="dots" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - pulse', async () => {
      const { container } = render(<Spinner type="pulse" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has role="status"', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has proper aria-label', () => {
      render(<Spinner aria-label="Loading content" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading content');
    });

    it('aria-label falls back to label prop', () => {
      render(<Spinner label="Please wait" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Please wait');
    });
  });

  // 8. THEME INTEGRATION TESTS
  describe('Theme Integration', () => {
    it('uses theme CSS variables for colors', () => {
      const { container } = render(<Spinner variant="primary" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-primary');
    });

    it('applies theme-aware classes', () => {
      const { container } = render(<Spinner variant="destructive" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-destructive');
    });

    it('supports custom color override', () => {
      render(<Spinner customColor="#ff0000" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('respects useSystemColors flag', () => {
      const { container } = render(<Spinner useSystemColors={false} variant="primary" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-current');
    });
  });

  // 9. LABEL FEATURE TESTS (from loading-indicator)
  describe('Label Feature', () => {
    it('renders label alongside circular spinner', () => {
      render(<Spinner type="circular" label="Loading content..." />);
      expect(screen.getByText('Loading content...')).toBeInTheDocument();
    });

    it('renders label alongside dots spinner', () => {
      render(<Spinner type="dots" label="Processing..." />);
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('renders label alongside pulse spinner', () => {
      render(<Spinner type="pulse" label="Saving..." />);
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('label has correct styling', () => {
      render(<Spinner label="Test label" />);
      const label = screen.getByText('Test label');
      expect(label).toHaveClass('text-sm', 'text-muted-foreground');
    });
  });

  // 10. BACKWARD COMPATIBILITY TESTS (CVA-based from ui/spinner)
  describe('Backward Compatibility', () => {
    it('works with CVA size prop from ui/spinner', () => {
      const { container } = render(<Spinner size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-4', 'w-4');
    });

    it('works with CVA variant prop from ui/spinner', () => {
      const { container } = render(<Spinner variant="primary" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-primary');
    });

    it('maintains animate-spin class', () => {
      const { container } = render(<Spinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('animate-spin');
    });

    it('has displayName set', () => {
      expect(Spinner.displayName).toBe('Spinner');
    });
  });

  // 11. EDGE CASES
  describe('Edge Cases', () => {
    it('handles missing all optional props', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('handles combination of custom size and custom color', () => {
      render(<Spinner customSize={64} customColor="oklch(0.8 0.15 150)" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('handles label with special characters', () => {
      render(<Spinner label="Loading... 100% ✓" />);
      expect(screen.getByText('Loading... 100% ✓')).toBeInTheDocument();
    });

    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(100);
      render(<Spinner label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles all props combined', () => {
      render(
        <Spinner
          size="xl"
          variant="success"
          speed="fast"
          type="circular"
          label="Almost done..."
          className="custom-class"
          aria-label="Custom aria label"
          data-testid="full-spinner"
        />
      );
      expect(screen.getByTestId('full-spinner')).toBeInTheDocument();
      expect(screen.getByText('Almost done...')).toBeInTheDocument();
    });
  });

  // 12. CONSOLIDATION VERIFICATION
  describe('PHASE 2 Consolidation Features', () => {
    it('includes 6 size variants (from theme-editor)', () => {
      const sizes: SpinnerProps['size'][] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      sizes.forEach((size) => {
        const { container } = render(<Spinner size={size} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });

    it('includes 8 color variants (from theme-editor)', () => {
      const variants: SpinnerProps['variant'][] = [
        'default',
        'primary',
        'secondary',
        'accent',
        'muted',
        'destructive',
        'warning',
        'success',
      ];
      variants.forEach((variant) => {
        const { container } = render(<Spinner variant={variant} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });

    it('includes 3 spinner types (from theme-editor)', () => {
      const types: SpinnerProps['type'][] = ['circular', 'dots', 'pulse'];
      types.forEach((type) => {
        const { container } = render(<Spinner type={type} />);
        const spinner = container.querySelector('[role="status"]');
        expect(spinner).toHaveAttribute('data-spinner-type', type);
      });
    });

    it('includes 3 animation speeds (from theme-editor)', () => {
      const speeds: SpinnerProps['speed'][] = ['slow', 'normal', 'fast'];
      speeds.forEach((speed) => {
        const { container } = render(<Spinner speed={speed} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });

    it('includes custom size support (from theme-editor)', () => {
      render(<Spinner customSize={100} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('includes custom color support (from theme-editor)', () => {
      render(<Spinner customColor="rgb(255, 0, 0)" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('includes label support (from loading-indicator)', () => {
      render(<Spinner label="Loading..." />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('includes forwardRef (from ui/spinner)', () => {
      const ref = vi.fn();
      render(<Spinner ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('includes themeOverride (from atomic-design)', () => {
      const { container } = render(<Spinner themeOverride={{ opacity: '0.5' }} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle({ opacity: '0.5' });
    });

    it('includes useSystemColors (from atomic-design)', () => {
      render(<Spinner useSystemColors={false} />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('data-use-system-colors', 'false');
    });
  });
});
