import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProgressBar } from './ProgressBar';
import type { ProgressBarProps } from './ProgressBar.types';

// Extend Vitest's expect with jest-axe matchers
expect.extend(toHaveNoViolations);

describe('ProgressBar Atom', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders correctly with basic props', () => {
      render(<ProgressBar value={50} data-testid="progress" />);
      expect(screen.getByTestId('progress')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(<ProgressBar value={0} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('renders with custom max value', () => {
      render(<ProgressBar value={50} max={200} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuemax', '200');
    });
  });

  // 2. VARIANT TESTS
  describe('Variants', () => {
    it.each([
      ['default', 'bg-primary'],
      ['success', 'bg-success'],
      ['warning', 'bg-warning'],
      ['error', 'bg-destructive'],
    ])('applies %s variant correctly', (variant, expectedClass) => {
      const { container } = render(
        <ProgressBar
          value={50}
          variant={variant as ProgressBarProps['variant']}
          data-testid="progress"
        />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveClass(expectedClass);
    });

    it('applies default variant container classes', () => {
      const { container } = render(
        <ProgressBar value={50} variant="default" data-testid="progress" />
      );
      const progressContainer = screen.getByTestId('progress-container');
      expect(progressContainer).toHaveClass('bg-muted');
    });

    it('applies success variant container classes', () => {
      const { container } = render(
        <ProgressBar value={50} variant="success" data-testid="progress" />
      );
      const progressContainer = screen.getByTestId('progress-container');
      expect(progressContainer).toHaveClass('bg-success/20');
    });
  });

  // 3. SIZE TESTS
  describe('Sizes', () => {
    it.each([
      ['sm', 'h-1'],
      ['md', 'h-2'],
      ['lg', 'h-4'],
    ])('applies %s size correctly', (size, expectedClass) => {
      const { container } = render(
        <ProgressBar
          value={50}
          size={size as ProgressBarProps['size']}
          data-testid="progress"
        />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveClass(expectedClass);
    });
  });

  // 4. PERCENTAGE CALCULATION TESTS
  describe('Percentage Calculation', () => {
    it('calculates percentage correctly for max=100', () => {
      const { container } = render(
        <ProgressBar value={65} data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveStyle({ width: '65%' });
    });

    it('calculates percentage correctly for custom max', () => {
      const { container } = render(
        <ProgressBar value={50} max={200} data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveStyle({ width: '25%' });
    });

    it('constrains percentage to 0% minimum', () => {
      const { container } = render(
        <ProgressBar value={-50} data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveStyle({ width: '0%' });
    });

    it('constrains percentage to 100% maximum', () => {
      const { container } = render(
        <ProgressBar value={150} max={100} data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveStyle({ width: '100%' });
    });

    it('handles zero value', () => {
      const { container } = render(
        <ProgressBar value={0} data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveStyle({ width: '0%' });
    });

    it('handles full value', () => {
      const { container } = render(
        <ProgressBar value={100} data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveStyle({ width: '100%' });
    });
  });

  // 5. LABEL AND PERCENTAGE DISPLAY TESTS
  describe('Label and Percentage Display', () => {
    it('does not show label by default', () => {
      render(<ProgressBar value={50} label="Loading" />);
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });

    it('shows label when showLabel is true', () => {
      render(
        <ProgressBar value={50} label="Loading" showLabel data-testid="progress" />
      );
      expect(screen.getByTestId('progress-label')).toHaveTextContent('Loading');
    });

    it('does not show percentage by default', () => {
      render(<ProgressBar value={50} data-testid="progress" />);
      expect(screen.queryByTestId('progress-percentage')).not.toBeInTheDocument();
    });

    it('shows percentage when showPercentage is true', () => {
      render(
        <ProgressBar value={65} showPercentage data-testid="progress" />
      );
      expect(screen.getByTestId('progress-percentage')).toHaveTextContent('65%');
    });

    it('shows both label and percentage when both flags are true', () => {
      render(
        <ProgressBar
          value={75}
          label="Profile completion"
          showLabel
          showPercentage
          data-testid="progress"
        />
      );
      expect(screen.getByTestId('progress-label')).toHaveTextContent('Profile completion');
      expect(screen.getByTestId('progress-percentage')).toHaveTextContent('75%');
    });

    it('rounds percentage to nearest integer', () => {
      render(
        <ProgressBar value={33.333} showPercentage data-testid="progress" />
      );
      expect(screen.getByTestId('progress-percentage')).toHaveTextContent('33%');
    });
  });

  // 6. ANIMATION TESTS
  describe('Animation', () => {
    it('does not animate by default', () => {
      const { container } = render(
        <ProgressBar value={50} data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).not.toHaveClass('animate-pulse');
    });

    it('applies animation when animated is true', () => {
      const { container } = render(
        <ProgressBar value={50} animated data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveClass('animate-pulse');
    });
  });

  // 7. PROPS TESTS
  describe('Props', () => {
    it('applies custom className', () => {
      render(
        <ProgressBar value={50} className="custom-class" data-testid="progress" />
      );
      expect(screen.getByTestId('progress')).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<ProgressBar value={50} ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('passes through additional props', () => {
      render(
        <ProgressBar value={50} data-custom="custom-value" data-testid="progress" />
      );
      expect(screen.getByTestId('progress')).toHaveAttribute('data-custom', 'custom-value');
    });
  });

  // 8. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ProgressBar value={50} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA role', () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('has correct ARIA attributes', () => {
      render(<ProgressBar value={50} max={200} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '200');
    });

    it('has default aria-label with percentage', () => {
      render(<ProgressBar value={65} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-label', 'Progress: 65%');
    });

    it('uses custom label for aria-label', () => {
      render(<ProgressBar value={75} label="Profile completion" />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-label', 'Profile completion');
    });
  });

  // 9. THEME INTEGRATION TESTS
  describe('Theme Integration', () => {
    it('applies theme transition classes', () => {
      const { container } = render(
        <ProgressBar value={50} data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveClass('transition-all', 'duration-500', 'ease-out');
    });

    it('applies rounded-full classes', () => {
      const { container } = render(
        <ProgressBar value={50} data-testid="progress" />
      );
      const container_element = screen.getByTestId('progress-container');
      const bar = screen.getByTestId('progress-bar');
      expect(container_element).toHaveClass('rounded-full');
      expect(bar).toHaveClass('rounded-full');
    });

    it('applies typography CSS variables to label', () => {
      render(
        <ProgressBar value={50} label="Loading" showLabel data-testid="progress" />
      );
      const label = screen.getByTestId('progress-label');
      const style = window.getComputedStyle(label);
      // Verify that inline styles are applied (actual values depend on CSS variables)
      expect(label).toHaveStyle({
        fontFamily: 'var(--typography-emphasis-font-family)',
      });
    });

    it('applies border radius CSS variable', () => {
      const { container } = render(
        <ProgressBar value={50} data-testid="progress" />
      );
      const progressContainer = screen.getByTestId('progress-container');
      expect(progressContainer).toHaveStyle({
        borderRadius: 'var(--radius-progress, var(--radius))',
      });
    });
  });

  // 10. EDGE CASES
  describe('Edge Cases', () => {
    it('handles decimal values correctly', () => {
      const { container } = render(
        <ProgressBar value={33.7} data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveStyle({ width: '33.7%' });
    });

    it('handles very small values', () => {
      const { container } = render(
        <ProgressBar value={0.1} data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveStyle({ width: '0.1%' });
    });

    it('handles values exceeding max gracefully', () => {
      const { container } = render(
        <ProgressBar value={500} max={100} data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      expect(bar).toHaveStyle({ width: '100%' });
    });

    it('handles negative max value', () => {
      const { container } = render(
        <ProgressBar value={50} max={-100} data-testid="progress" />
      );
      const bar = screen.getByTestId('progress-bar');
      // Should constrain to 0-100%
      expect(bar).toHaveStyle({ width: '0%' });
    });

    it('renders without label when showLabel is true but label is undefined', () => {
      render(
        <ProgressBar value={50} showLabel data-testid="progress" />
      );
      expect(screen.queryByTestId('progress-label')).not.toBeInTheDocument();
    });
  });
});
