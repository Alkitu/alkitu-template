import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Radial } from './Radial';
import type { RadialProps } from './Radial.types';

expect.extend(toHaveNoViolations);

describe('Radial Atom (atoms-alianza)', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('data-name', 'Radial');
    });

    it('renders as a button element', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button.tagName).toBe('BUTTON');
    });

    it('renders with role="radio"', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByRole('radio');
      expect(button).toBeInTheDocument();
    });

    it('renders in unchecked state by default', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('aria-checked', 'false');

      const dot = screen.queryByTestId('radial-dot');
      expect(dot).not.toBeInTheDocument();
    });

    it('renders in checked state when checked prop is true', () => {
      render(<Radial checked={true} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('aria-checked', 'true');

      const dot = screen.getByTestId('radial-dot');
      expect(dot).toBeInTheDocument();
    });

    it('renders the checked dot with correct classes', () => {
      render(<Radial checked={true} data-testid="radial" />);

      const dot = screen.getByTestId('radial-dot');
      expect(dot).toHaveClass('bg-accent-a', 'rounded-full', 'shrink-0', 'size-[var(--icon-size-xs)]');
    });

    it('does not render dot when unchecked', () => {
      render(<Radial checked={false} data-testid="radial" />);

      const dot = screen.queryByTestId('radial-dot');
      expect(dot).not.toBeInTheDocument();
    });
  });

  // 2. CHECKED STATE TESTS
  describe('Checked State', () => {
    it('applies checked border color when checked', () => {
      render(<Radial checked={true} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button.className).toMatch(/border-accent-a/);
    });

    it('applies unchecked border color when not checked', () => {
      render(<Radial checked={false} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button.className).toMatch(/border-input/);
    });

    it('changes border color from unchecked to checked', () => {
      const { rerender } = render(<Radial checked={false} data-testid="radial" />);

      let button = screen.getByTestId('radial');
      expect(button.className).toMatch(/border-input/);

      rerender(<Radial checked={true} data-testid="radial" />);

      button = screen.getByTestId('radial');
      expect(button.className).toMatch(/border-accent-a/);
    });

    it('syncs checked prop changes', () => {
      const { rerender } = render(<Radial checked={false} data-testid="radial" />);

      let button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('aria-checked', 'false');
      expect(screen.queryByTestId('radial-dot')).not.toBeInTheDocument();

      rerender(<Radial checked={true} data-testid="radial" />);

      button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByTestId('radial-dot')).toBeInTheDocument();
    });
  });

  // 3. INTERACTION TESTS
  describe('Interactions', () => {
    it('calls onCheckedChange when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Radial checked={false} onCheckedChange={handleChange} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      await user.click(button);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('toggles from true to false when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Radial checked={true} onCheckedChange={handleChange} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      await user.click(button);

      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('toggles from false to true when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Radial checked={false} onCheckedChange={handleChange} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      await user.click(button);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('handles multiple rapid clicks', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Radial checked={false} onCheckedChange={handleChange} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleChange).toHaveBeenCalledTimes(3);
      // Component is controlled, so it always toggles based on current checked prop
      // Since checked stays false (controlled), each click calls with true
      expect(handleChange).toHaveBeenNthCalledWith(1, true);
      expect(handleChange).toHaveBeenNthCalledWith(2, true);
      expect(handleChange).toHaveBeenNthCalledWith(3, true);
    });

    it('works without onCheckedChange callback', async () => {
      const user = userEvent.setup();

      render(<Radial checked={false} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      await expect(user.click(button)).resolves.not.toThrow();
    });
  });

  // 4. DISABLED STATE TESTS
  describe('Disabled State', () => {
    it('renders disabled state correctly', () => {
      render(<Radial disabled={true} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('disabled');
    });

    it('applies disabled cursor class', () => {
      render(<Radial disabled={true} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass('cursor-not-allowed');
      expect(button).not.toHaveClass('cursor-pointer');
    });

    it('applies disabled opacity', () => {
      render(<Radial disabled={true} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass('opacity-50');
    });

    it('does not call onCheckedChange when disabled and clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Radial
          checked={false}
          disabled={true}
          onCheckedChange={handleChange}
          data-testid="radial"
        />
      );

      const button = screen.getByTestId('radial');
      await user.click(button);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('stays in disabled state when checked', () => {
      render(<Radial checked={true} disabled={true} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('cursor-not-allowed', 'opacity-50');

      const dot = screen.getByTestId('radial-dot');
      expect(dot).toBeInTheDocument();
    });

    it('can transition from enabled to disabled', () => {
      const { rerender } = render(<Radial disabled={false} data-testid="radial" />);

      let button = screen.getByTestId('radial');
      expect(button).not.toBeDisabled();
      expect(button).toHaveClass('cursor-pointer');

      rerender(<Radial disabled={true} data-testid="radial" />);

      button = screen.getByTestId('radial');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('cursor-not-allowed');
    });
  });

  // 5. STYLING TESTS
  describe('Styling', () => {
    it('applies base layout classes', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'relative'
      );
    });

    it('applies size classes', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass('shrink-0', 'size-[var(--icon-size-md)]');
    });

    it('applies border classes', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass('border', 'border-solid');
    });

    it('applies rounded pill shape', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass('rounded-[var(--radius-pill)]');
    });

    it('applies background color', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass('bg-card-background-c');
    });

    it('applies custom className', () => {
      render(<Radial className="custom-class" data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass('custom-class');
    });

    it('merges custom className with default classes', () => {
      render(<Radial className="custom-class another-class" data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass('custom-class', 'another-class');
      expect(button).toHaveClass('flex', 'items-center'); // Default classes still present
    });

    it('applies content-stretch class', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass('content-stretch');
    });
  });

  // 6. PROPS TESTS
  describe('Props', () => {
    it('forwards data-testid prop', () => {
      render(<Radial data-testid="custom-radial" />);

      expect(screen.getByTestId('custom-radial')).toBeInTheDocument();
    });

    it('applies data-testid to dot when checked', () => {
      render(<Radial checked={true} data-testid="custom-radial" />);

      expect(screen.getByTestId('custom-radial-dot')).toBeInTheDocument();
    });

    it('applies aria-label when provided', () => {
      render(<Radial aria-label="Select option" data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('aria-label', 'Select option');
    });

    it('applies aria-describedby when provided', () => {
      render(<Radial aria-describedby="description-id" data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('aria-describedby', 'description-id');
    });

    it('handles all props together', () => {
      const handleChange = vi.fn();

      render(
        <Radial
          checked={true}
          onCheckedChange={handleChange}
          disabled={false}
          className="custom-class"
          data-testid="full-radial"
          aria-label="Test label"
          aria-describedby="test-desc"
        />
      );

      const button = screen.getByTestId('full-radial');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-checked', 'true');
      expect(button).not.toBeDisabled();
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveAttribute('aria-label', 'Test label');
      expect(button).toHaveAttribute('aria-describedby', 'test-desc');
    });
  });

  // 7. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Radial checked={false} aria-label="Select option" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when checked', async () => {
      const { container } = render(
        <Radial checked={true} aria-label="Selected option" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when disabled', async () => {
      const { container } = render(
        <Radial disabled={true} aria-label="Disabled option" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has role="radio"', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByRole('radio');
      expect(button).toBeInTheDocument();
    });

    it('has aria-checked="false" when unchecked', () => {
      render(<Radial checked={false} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('aria-checked', 'false');
    });

    it('has aria-checked="true" when checked', () => {
      render(<Radial checked={true} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('aria-checked', 'true');
    });

    it('supports keyboard navigation with Enter key', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Radial checked={false} onCheckedChange={handleChange} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('supports keyboard navigation with Space key', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Radial checked={false} onCheckedChange={handleChange} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      button.focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('is keyboard focusable when enabled', () => {
      render(<Radial disabled={false} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      button.focus();

      expect(button).toHaveFocus();
    });

    it('is not keyboard focusable when disabled', () => {
      render(<Radial disabled={true} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      button.focus();

      // Disabled buttons cannot receive focus
      expect(button).not.toHaveFocus();
    });

    it('provides accessible name via aria-label', () => {
      render(<Radial aria-label="Option 1" data-testid="radial" />);

      const button = screen.getByLabelText('Option 1');
      expect(button).toBeInTheDocument();
    });

    it('links to description via aria-describedby', () => {
      render(
        <>
          <p id="desc">This is a description</p>
          <Radial aria-describedby="desc" data-testid="radial" />
        </>
      );

      const button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('aria-describedby', 'desc');
    });
  });

  // 8. THEME INTEGRATION TESTS
  describe('Theme Integration', () => {
    it('uses theme CSS variables for size', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass('size-[var(--icon-size-md)]');
    });

    it('uses theme CSS variables for border radius', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass('rounded-[var(--radius-pill)]');
    });

    it('uses theme CSS variables for dot size', () => {
      render(<Radial checked={true} data-testid="radial" />);

      const dot = screen.getByTestId('radial-dot');
      expect(dot).toHaveClass('size-[var(--icon-size-xs)]');
    });

    it('uses theme color classes for background', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveClass('bg-card-background-c');
    });

    it('uses theme color classes for checked border', () => {
      render(<Radial checked={true} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button.className).toMatch(/border-accent-a/);
    });

    it('uses theme color classes for unchecked border', () => {
      render(<Radial checked={false} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button.className).toMatch(/border-input/);
    });

    it('uses theme color classes for dot', () => {
      render(<Radial checked={true} data-testid="radial" />);

      const dot = screen.getByTestId('radial-dot');
      expect(dot).toHaveClass('bg-accent-a');
    });
  });

  // 9. EDGE CASES
  describe('Edge Cases', () => {
    it('handles undefined checked prop', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('aria-checked', 'false');
    });

    it('handles null className', () => {
      render(<Radial className={undefined} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toBeInTheDocument();
    });

    it('handles empty className', () => {
      render(<Radial className="" data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toBeInTheDocument();
    });

    it('handles click without onCheckedChange', async () => {
      const user = userEvent.setup();

      render(<Radial checked={false} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      await expect(user.click(button)).resolves.not.toThrow();
    });

    it('handles disabled with onCheckedChange', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Radial
          disabled={true}
          onCheckedChange={handleChange}
          data-testid="radial"
        />
      );

      const button = screen.getByTestId('radial');
      await user.click(button);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('renders correctly with checked and disabled', () => {
      render(<Radial checked={true} disabled={true} data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-checked', 'true');

      const dot = screen.getByTestId('radial-dot');
      expect(dot).toBeInTheDocument();
    });

    it('handles data-name attribute correctly', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('data-name', 'Radial');
    });

    it('maintains type="button"', () => {
      render(<Radial data-testid="radial" />);

      const button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  // 10. CONTROLLED MODE TESTS
  describe('Controlled Mode', () => {
    it('stays controlled with checked prop', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      const { rerender } = render(
        <Radial checked={false} onCheckedChange={handleChange} data-testid="radial" />
      );

      const button = screen.getByTestId('radial');

      // Click should call handler
      await user.click(button);
      expect(handleChange).toHaveBeenCalledWith(true);

      // But state doesn't change until prop changes
      expect(button).toHaveAttribute('aria-checked', 'false');

      // Parent updates prop
      rerender(<Radial checked={true} onCheckedChange={handleChange} data-testid="radial" />);

      expect(button).toHaveAttribute('aria-checked', 'true');
    });

    it('respects external state changes', () => {
      const { rerender } = render(<Radial checked={false} data-testid="radial" />);

      let button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('aria-checked', 'false');

      rerender(<Radial checked={true} data-testid="radial" />);

      button = screen.getByTestId('radial');
      expect(button).toHaveAttribute('aria-checked', 'true');
    });

    it('handles prop changes while disabled', () => {
      const { rerender } = render(
        <Radial checked={false} disabled={true} data-testid="radial" />
      );

      let button = screen.getByTestId('radial');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-checked', 'false');

      rerender(<Radial checked={true} disabled={true} data-testid="radial" />);

      button = screen.getByTestId('radial');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-checked', 'true');
    });
  });
});
