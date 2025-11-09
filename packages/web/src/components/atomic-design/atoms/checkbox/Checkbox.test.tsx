import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Checkbox } from './Checkbox';
import type { CheckboxProps } from './Checkbox.types';

expect.extend(toHaveNoViolations);

describe('Checkbox Atom', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders checkbox correctly', () => {
      render(<Checkbox id="test-checkbox" />);
      const checkboxes = screen.getAllByRole('checkbox');
      // We have both hidden input and custom div with checkbox role
      expect(checkboxes.length).toBeGreaterThanOrEqual(1);
    });

    it('renders with label', () => {
      render(<Checkbox id="with-label" label="Accept terms" />);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('renders with description', () => {
      render(
        <Checkbox
          id="with-desc"
          label="Newsletter"
          description="Receive updates via email"
        />
      );
      expect(screen.getByText('Receive updates via email')).toBeInTheDocument();
    });

    it('renders without label or description', () => {
      render(<Checkbox id="bare-checkbox" data-testid="bare" />);
      const checkbox = screen.getByTestId('bare-box');
      expect(checkbox).toBeInTheDocument();
    });
  });

  // 2. VARIANT TESTS
  describe('Variants', () => {
    it.each([
      ['default', 'border-input'],
      ['error', 'border-destructive'],
      ['success', 'border-success'],
      ['warning', 'border-warning'],
    ] as const)('applies %s variant correctly', (variant, expectedClass) => {
      render(
        <Checkbox
          id={`variant-${variant}`}
          variant={variant}
          data-testid="checkbox-variant"
        />
      );
      const checkbox = screen.getByTestId('checkbox-variant-box');
      expect(checkbox).toHaveClass(expectedClass);
    });

    it('applies disabled styles regardless of variant', () => {
      render(
        <Checkbox
          id="disabled-variant"
          variant="error"
          disabled
          data-testid="disabled-checkbox"
        />
      );
      const checkbox = screen.getByTestId('disabled-checkbox-box');
      expect(checkbox).toHaveClass('border-muted', 'text-muted-foreground');
    });
  });

  // 3. SIZE TESTS
  describe('Sizes', () => {
    it.each([
      ['sm', 'h-4', 'w-4'],
      ['md', 'h-5', 'w-5'],
      ['lg', 'h-6', 'w-6'],
    ] as const)('applies %s size correctly', (size, heightClass, widthClass) => {
      render(
        <Checkbox id={`size-${size}`} size={size} data-testid="checkbox-size" />
      );
      const checkbox = screen.getByTestId('checkbox-size-box');
      expect(checkbox).toHaveClass(heightClass, widthClass);
    });
  });

  // 4. STATE TESTS
  describe('States', () => {
    it('renders unchecked by default', () => {
      render(<Checkbox id="unchecked" data-testid="unchecked-box" />);
      const checkbox = screen.getByTestId('unchecked-box-box');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('renders checked when checked prop is true', () => {
      render(<Checkbox id="checked" checked data-testid="checked-box" />);
      const checkbox = screen.getByTestId('checked-box-box');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      // Check icon should be visible
      expect(screen.getByTestId('checked-box-check-icon')).toBeInTheDocument();
    });

    it('renders indeterminate state', () => {
      render(
        <Checkbox
          id="indeterminate"
          indeterminate
          data-testid="indeterminate-box"
        />
      );
      const checkbox = screen.getByTestId('indeterminate-box-box');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
      // Minus icon should be visible
      expect(
        screen.getByTestId('indeterminate-box-indeterminate-icon')
      ).toBeInTheDocument();
    });

    it('prioritizes indeterminate over checked', () => {
      render(
        <Checkbox
          id="priority-test"
          checked
          indeterminate
          data-testid="priority-box"
        />
      );
      const checkbox = screen.getByTestId('priority-box-box');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
      // Should show minus icon, not check icon
      expect(
        screen.getByTestId('priority-box-indeterminate-icon')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('priority-box-check-icon')
      ).not.toBeInTheDocument();
    });
  });

  // 5. INTERACTION TESTS
  describe('Interactions', () => {
    it('handles click to check', async () => {
      const handleChange = vi.fn();
      render(
        <Checkbox id="click-test" onChange={handleChange} data-testid="click-box" />
      );

      const checkbox = screen.getByTestId('click-box-box');
      await userEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('handles click to uncheck', async () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          id="unclick-test"
          checked
          onChange={handleChange}
          data-testid="unclick-box"
        />
      );

      const checkbox = screen.getByTestId('unclick-box-box');
      await userEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('does not call onChange when disabled', async () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          id="disabled-click"
          disabled
          onChange={handleChange}
          data-testid="disabled-box"
        />
      );

      const checkbox = screen.getByTestId('disabled-box-box');
      await userEvent.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('handles keyboard Space key', async () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          id="space-test"
          onChange={handleChange}
          data-testid="space-box"
        />
      );

      const checkbox = screen.getByTestId('space-box-box');
      checkbox.focus();
      await userEvent.keyboard(' ');

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('handles keyboard Enter key', async () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          id="enter-test"
          onChange={handleChange}
          data-testid="enter-box"
        />
      );

      const checkbox = screen.getByTestId('enter-box-box');
      checkbox.focus();
      await userEvent.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('clicking label triggers checkbox', async () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          id="label-click-test"
          label="Click this label"
          onChange={handleChange}
        />
      );

      const label = screen.getByText('Click this label');
      await userEvent.click(label);

      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  // 6. PROPS TESTS
  describe('Props', () => {
    it('applies custom className', () => {
      render(
        <Checkbox
          id="custom-class"
          className="custom-test-class"
          data-testid="custom-box"
        />
      );
      const container = screen.getByTestId('custom-box');
      expect(container).toHaveClass('custom-test-class');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Checkbox id="ref-test" ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('applies disabled state to checkbox and label', () => {
      render(
        <Checkbox
          id="disabled-test"
          label="Disabled checkbox"
          disabled
          data-testid="disabled-label"
        />
      );
      const checkbox = screen.getByTestId('disabled-label-box');
      expect(checkbox).toHaveAttribute('aria-disabled', 'true');
      expect(checkbox).toHaveAttribute('tabIndex', '-1');

      const label = screen.getByTestId('disabled-label-label');
      expect(label).toHaveClass('text-muted-foreground', 'cursor-not-allowed');
    });

    it('supports name attribute for forms', () => {
      render(
        <Checkbox
          id="form-checkbox"
          name="terms"
          data-testid="form-box"
        />
      );
      const input = screen.getByTestId('form-box-input');
      expect(input).toHaveAttribute('name', 'terms');
    });
  });

  // 7. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <main>
          <Checkbox id="a11y-test" label="Accessible checkbox" />
        </main>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation with Tab', () => {
      render(<Checkbox id="tab-test" data-testid="tab-box" />);
      const checkbox = screen.getByTestId('tab-box-box');

      expect(checkbox).toHaveAttribute('tabIndex', '0');
    });

    it('has correct ARIA attributes', () => {
      render(
        <Checkbox
          id="aria-test"
          label="Required field"
          aria-required
          aria-label="Custom ARIA label"
          data-testid="aria-box"
        />
      );
      const checkbox = screen.getByTestId('aria-box-box');

      expect(checkbox).toHaveAttribute('aria-label', 'Custom ARIA label');
      expect(checkbox).toHaveAttribute('aria-required', 'true');
    });

    it('associates description with aria-describedby', () => {
      render(
        <Checkbox
          id="describedby-test"
          label="Newsletter"
          description="Get weekly updates"
          data-testid="describedby-box"
        />
      );
      const checkbox = screen.getByTestId('describedby-box-box');
      expect(checkbox).toHaveAttribute(
        'aria-describedby',
        'describedby-test-description'
      );
    });

    it('provides default aria-label when no label is provided', () => {
      render(<Checkbox id="default-aria" data-testid="default-aria-box" />);
      const checkbox = screen.getByTestId('default-aria-box-box');
      expect(checkbox).toHaveAttribute('aria-label', 'Checkbox');
    });
  });

  // 8. THEME INTEGRATION TESTS
  describe('Theme Integration', () => {
    it('uses CSS variables for border-radius', () => {
      render(<Checkbox id="theme-radius" data-testid="theme-box" />);
      const checkbox = screen.getByTestId('theme-box-box');
      expect(checkbox).toHaveStyle({
        borderRadius: 'var(--radius-checkbox, var(--radius))',
      });
    });

    it('uses theme classes for checked state', () => {
      render(
        <Checkbox id="theme-checked" checked data-testid="theme-checked-box" />
      );
      const checkbox = screen.getByTestId('theme-checked-box-box');
      expect(checkbox).toHaveClass('bg-primary', 'border-primary');
    });

    it('applies typography CSS variables to label', () => {
      render(
        <Checkbox
          id="theme-typography"
          label="Themed label"
          data-testid="themed-label"
        />
      );
      const label = screen.getByTestId('themed-label-label');
      const styles = window.getComputedStyle(label);

      // Verify style attributes are set (actual computed values depend on CSS variables)
      expect(label).toHaveAttribute('style');
      expect(label.getAttribute('style')).toContain('font-family');
    });

    it('applies typography CSS variables to description', () => {
      render(
        <Checkbox
          id="theme-desc"
          description="Themed description"
          data-testid="themed-desc"
        />
      );
      const description = screen.getByTestId('themed-desc-description');
      const styles = window.getComputedStyle(description);

      // Verify style attributes are set
      expect(description).toHaveAttribute('style');
      expect(description.getAttribute('style')).toContain('font-family');
    });
  });

  // 9. CONTROLLED/UNCONTROLLED BEHAVIOR
  describe('Controlled/Uncontrolled Behavior', () => {
    it('works as uncontrolled component', async () => {
      render(<Checkbox id="uncontrolled" data-testid="uncontrolled-box" />);

      const checkbox = screen.getByTestId('uncontrolled-box-box');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');

      await userEvent.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('works as controlled component', async () => {
      const TestComponent = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <Checkbox
            id="controlled"
            checked={checked}
            onChange={setChecked}
            data-testid="controlled-box"
          />
        );
      };

      render(<TestComponent />);

      const checkbox = screen.getByTestId('controlled-box-box');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');

      await userEvent.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('updates when checked prop changes', () => {
      const { rerender } = render(
        <Checkbox id="prop-change" checked={false} data-testid="prop-box" />
      );
      const checkbox = screen.getByTestId('prop-box-box');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');

      rerender(<Checkbox id="prop-change" checked={true} data-testid="prop-box" />);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });
  });

  // 10. EDGE CASES
  describe('Edge Cases', () => {
    it('handles missing id gracefully', () => {
      render(<Checkbox label="No ID checkbox" />);
      expect(screen.getByText('No ID checkbox')).toBeInTheDocument();
    });

    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(200);
      render(<Checkbox id="long-label" label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles multiple checkboxes in the same form', () => {
      render(
        <div>
          <Checkbox id="checkbox-1" label="Option 1" data-testid="box-1" />
          <Checkbox id="checkbox-2" label="Option 2" data-testid="box-2" />
          <Checkbox id="checkbox-3" label="Option 3" data-testid="box-3" />
        </div>
      );

      // Verify each checkbox exists using test IDs
      expect(screen.getByTestId('box-1-box')).toBeInTheDocument();
      expect(screen.getByTestId('box-2-box')).toBeInTheDocument();
      expect(screen.getByTestId('box-3-box')).toBeInTheDocument();
    });

    it('handles rapid state changes', async () => {
      const handleChange = vi.fn();
      render(
        <Checkbox
          id="rapid-change"
          onChange={handleChange}
          data-testid="rapid-box"
        />
      );

      const checkbox = screen.getByTestId('rapid-box-box');

      // Click multiple times rapidly
      await userEvent.click(checkbox);
      await userEvent.click(checkbox);
      await userEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });
  });
});

// Add React import for the test component
import React from 'react';
