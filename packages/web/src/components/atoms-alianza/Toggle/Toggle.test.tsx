import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Toggle } from './Toggle';
import type { ToggleProps } from './Toggle.types';

expect.extend(toHaveNoViolations);

describe('Toggle Atom (atoms-alianza)', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Toggle id="test-toggle" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('renders with label', () => {
      render(<Toggle id="test-toggle" label="Enable feature" />);

      expect(screen.getByText('Enable feature')).toBeInTheDocument();
      // Verify the label element exists
      const label = screen.getByText('Enable feature');
      expect(label.tagName).toBe('LABEL');
    });

    it('renders with label and description', () => {
      render(
        <Toggle
          id="test-toggle"
          label="Enable notifications"
          description="Receive email notifications"
        />,
      );

      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
      expect(screen.getByText('Receive email notifications')).toBeInTheDocument();
    });

    it('renders in checked state', () => {
      render(<Toggle id="test-toggle" checked={true} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('renders in unchecked state', () => {
      render(<Toggle id="test-toggle" checked={false} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });
  });

  // 2. VARIANT TESTS
  describe('Variants', () => {
    it.each([
      ['default', 'bg-primary'],
      ['success', 'bg-success'],
      ['warning', 'bg-warning'],
      ['error', 'bg-destructive'],
    ])('applies %s variant correctly when checked', (variant, expectedClass) => {
      render(<Toggle id="test-toggle" variant={variant as any} checked={true} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass(expectedClass);
    });

    it('applies unchecked state classes', () => {
      render(<Toggle id="test-toggle" checked={false} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('bg-input');
    });

    it('applies disabled state classes', () => {
      render(<Toggle id="test-toggle" disabled checked={true} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('bg-muted', 'cursor-not-allowed');
    });
  });

  // 3. SIZE TESTS
  describe('Sizes', () => {
    it.each([
      ['sm', 'h-5', 'w-9'],
      ['md', 'h-6', 'w-11'],
      ['lg', 'h-7', 'w-12'],
    ])('applies %s size correctly', (size, heightClass, widthClass) => {
      render(<Toggle id="test-toggle" size={size as any} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass(heightClass, widthClass);
    });
  });

  // 4. INTERACTION TESTS - CONTROLLED MODE
  describe('Controlled Mode Interactions', () => {
    it('calls onChange when clicked', async () => {
      const handleChange = vi.fn();
      render(<Toggle id="test-toggle" checked={false} onChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('toggles from true to false', async () => {
      const handleChange = vi.fn();
      render(<Toggle id="test-toggle" checked={true} onChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('does not call onChange when disabled', async () => {
      const handleChange = vi.fn();
      render(
        <Toggle id="test-toggle" checked={false} disabled onChange={handleChange} />,
      );

      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('supports onCheckedChange callback (Radix-compatible API)', async () => {
      const handleChange = vi.fn();
      render(<Toggle id="test-toggle" checked={false} onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('calls both onChange and onCheckedChange when both provided', async () => {
      const handleChange = vi.fn();
      const handleCheckedChange = vi.fn();
      render(
        <Toggle
          id="test-toggle"
          checked={false}
          onChange={handleChange}
          onCheckedChange={handleCheckedChange}
        />
      );

      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledWith(true);
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  // 5. INTERACTION TESTS - UNCONTROLLED MODE
  describe('Uncontrolled Mode Interactions', () => {
    it('toggles internal state when clicked', async () => {
      const handleChange = vi.fn();
      render(<Toggle id="test-toggle" onChange={handleChange} />);

      const switchElement = screen.getByRole('switch');

      // Initially unchecked
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      // Click to check
      await userEvent.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
      expect(handleChange).toHaveBeenCalledWith(true);

      // Click to uncheck
      await userEvent.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('respects defaultChecked prop', () => {
      render(<Toggle id="test-toggle" defaultChecked={true} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('toggles from defaultChecked state', async () => {
      render(<Toggle id="test-toggle" defaultChecked={true} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');

      await userEvent.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });
  });

  // 6. PROPS TESTS
  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Toggle id="test-toggle" className="custom-class" />,
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Toggle id="test-toggle" ref={ref} />);

      expect(ref).toHaveBeenCalled();
    });

    it('applies disabled state to switch', () => {
      render(<Toggle id="test-toggle" disabled />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
      expect(switchElement).toHaveAttribute('aria-disabled', 'true');
    });

    it('applies disabled state to checkbox', () => {
      render(<Toggle id="test-toggle" disabled />);

      const checkbox = screen.getByRole('checkbox', { hidden: true });
      expect(checkbox).toBeDisabled();
    });

    it('applies id to hidden checkbox', () => {
      render(<Toggle id="test-toggle" />);

      const checkbox = screen.getByRole('checkbox', { hidden: true });
      expect(checkbox).toHaveAttribute('id', 'test-toggle');
    });

    it('applies name to hidden checkbox', () => {
      render(<Toggle id="test-toggle" name="feature-toggle" />);

      const checkbox = screen.getByRole('checkbox', { hidden: true });
      expect(checkbox).toHaveAttribute('name', 'feature-toggle');
    });

    it('applies data-testid correctly', () => {
      render(<Toggle id="test-toggle" data-testid="custom-toggle" />);

      expect(screen.getByTestId('custom-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('custom-toggle-button')).toBeInTheDocument();
      expect(screen.getByTestId('custom-toggle-thumb')).toBeInTheDocument();
    });
  });

  // 7. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Toggle
          id="test-toggle"
          label="Enable notifications"
          description="Receive email notifications"
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', () => {
      render(<Toggle id="test-toggle" checked={true} disabled />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
      expect(switchElement).toHaveAttribute('aria-disabled', 'true');
    });

    it('links description with aria-describedby', () => {
      render(
        <Toggle
          id="test-toggle"
          description="This is a description"
        />,
      );

      const checkbox = screen.getByRole('checkbox', { hidden: true });
      expect(checkbox).toHaveAttribute('aria-describedby', 'test-toggle-description');
      expect(screen.getByText('This is a description')).toHaveAttribute(
        'id',
        'test-toggle-description',
      );
    });

    it('supports keyboard navigation via Space key', async () => {
      const handleChange = vi.fn();
      render(<Toggle id="test-toggle" onChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await userEvent.keyboard(' ');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('supports keyboard navigation via Enter key', async () => {
      const handleChange = vi.fn();
      render(<Toggle id="test-toggle" onChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await userEvent.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('has visible focus indicator', () => {
      render(<Toggle id="test-toggle" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });

  // 8. THEME INTEGRATION TESTS
  describe('Theme Integration', () => {
    it('uses theme CSS variables for colors', () => {
      render(<Toggle id="test-toggle" variant="default" checked={true} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('bg-primary');
    });

    it('uses typography CSS variables for label', () => {
      render(<Toggle id="test-toggle" label="Test Label" />);

      const label = screen.getByText('Test Label');
      const styles = window.getComputedStyle(label);

      // Label should have inline styles for typography
      expect(label).toHaveAttribute('style');
    });

    it('uses typography CSS variables for description', () => {
      render(<Toggle id="test-toggle" description="Test Description" />);

      const description = screen.getByText('Test Description');

      // Description should have inline styles for typography
      expect(description).toHaveAttribute('style');
    });
  });

  // 9. ANIMATION & VISUAL TESTS
  describe('Animation & Visual States', () => {
    it('applies transition classes to switch', () => {
      render(<Toggle id="test-toggle" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('transition-colors', 'duration-300', 'ease-in-out');
    });

    it('applies transition classes to thumb', () => {
      const { container } = render(<Toggle id="test-toggle" data-testid="toggle" />);

      const thumb = screen.getByTestId('toggle-thumb');
      expect(thumb).toHaveClass('transition-transform', 'duration-300', 'ease-in-out');
    });

    it('thumb translates when checked', () => {
      const { rerender } = render(<Toggle id="test-toggle" checked={false} data-testid="toggle" />);

      let thumb = screen.getByTestId('toggle-thumb');
      expect(thumb).toHaveClass('translate-x-0');

      rerender(<Toggle id="test-toggle" checked={true} data-testid="toggle" />);

      thumb = screen.getByTestId('toggle-thumb');
      expect(thumb).toHaveClass('translate-x-5'); // md size default
    });

    it('applies hover classes', () => {
      render(<Toggle id="test-toggle" checked={true} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement.className).toMatch(/hover:bg-primary\/90/);
    });
  });

  // 10. EDGE CASES
  describe('Edge Cases', () => {
    it('handles missing id gracefully', () => {
      render(<Toggle label="No ID" />);

      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('handles label click to toggle', async () => {
      const handleChange = vi.fn();
      render(
        <Toggle id="test-toggle" label="Click Label" onChange={handleChange} />,
      );

      // Click the label (which triggers the hidden checkbox)
      const label = screen.getByText('Click Label');
      await userEvent.click(label);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('handles rapid toggling', async () => {
      const handleChange = vi.fn();
      render(<Toggle id="test-toggle" onChange={handleChange} />);

      const switchElement = screen.getByRole('switch');

      await userEvent.click(switchElement);
      await userEvent.click(switchElement);
      await userEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('syncs controlled prop changes', () => {
      const { rerender } = render(<Toggle id="test-toggle" checked={false} />);

      let switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      rerender(<Toggle id="test-toggle" checked={true} />);

      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('handles disabled state with label cursor', () => {
      render(<Toggle id="test-toggle" label="Disabled Toggle" disabled />);

      const label = screen.getByText('Disabled Toggle');
      expect(label).toHaveClass('cursor-not-allowed');
    });
  });

  // 11. BACKWARD COMPATIBILITY TESTS
  describe('Backward Compatibility', () => {
    it('supports both onChange and onCheckedChange simultaneously', async () => {
      const onChangeHandler = vi.fn();
      const onCheckedChangeHandler = vi.fn();

      render(
        <Toggle
          id="test-toggle"
          onChange={onChangeHandler}
          onCheckedChange={onCheckedChangeHandler}
        />
      );

      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);

      expect(onChangeHandler).toHaveBeenCalledWith(true);
      expect(onCheckedChangeHandler).toHaveBeenCalledWith(true);
    });

    it('works with only onCheckedChange (Radix pattern)', async () => {
      const handleChange = vi.fn();
      render(<Toggle id="test-toggle" onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('works with only onChange (Standard pattern)', async () => {
      const handleChange = vi.fn();
      render(<Toggle id="test-toggle" onChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });
});
