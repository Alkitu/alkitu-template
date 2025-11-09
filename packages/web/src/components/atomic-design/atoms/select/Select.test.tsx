import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Select, MemoizedSelect } from './Select';
import type { SelectOption, SelectProps } from './Select.types';

expect.extend(toHaveNoViolations);

describe('Select Component', () => {
  const defaultOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps: SelectProps = {
    options: defaultOptions,
    placeholder: 'Select an option',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<Select {...defaultProps} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('renders with selected value', () => {
      render(<Select {...defaultProps} value="option2" />);
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(<Select {...defaultProps} className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('renders with data-testid', () => {
      render(<Select {...defaultProps} data-testid="test-select" />);
      expect(screen.getByTestId('test-select')).toBeInTheDocument();
    });

    it('renders placeholder when no value is selected', () => {
      render(<Select {...defaultProps} placeholder="Choose..." />);
      expect(screen.getByText('Choose...')).toBeInTheDocument();
    });

    it('displays selected option label', () => {
      render(<Select {...defaultProps} value="option1" />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies default variant classes', () => {
      const { container } = render(<Select {...defaultProps} variant="default" />);
      const selectElement = container.querySelector('[role="combobox"]');
      expect(selectElement).toHaveClass('bg-background', 'text-foreground', 'border-input');
    });

    it('applies ghost variant classes', () => {
      const { container } = render(<Select {...defaultProps} variant="ghost" />);
      const selectElement = container.querySelector('[role="combobox"]');
      expect(selectElement).toHaveClass('bg-transparent', 'border-transparent');
    });

    it('applies filled variant classes', () => {
      const { container } = render(<Select {...defaultProps} variant="filled" />);
      const selectElement = container.querySelector('[role="combobox"]');
      expect(selectElement).toHaveClass('bg-muted', 'border-transparent');
    });
  });

  describe('Sizes', () => {
    it('applies small size classes', () => {
      const { container } = render(<Select {...defaultProps} selectSize="sm" />);
      const selectElement = container.querySelector('[role="combobox"]');
      expect(selectElement).toHaveClass('h-8', 'px-2', 'text-sm');
    });

    it('applies medium size classes (default)', () => {
      const { container } = render(<Select {...defaultProps} selectSize="md" />);
      const selectElement = container.querySelector('[role="combobox"]');
      expect(selectElement).toHaveClass('h-10', 'px-3', 'text-sm');
    });

    it('applies large size classes', () => {
      const { container } = render(<Select {...defaultProps} selectSize="lg" />);
      const selectElement = container.querySelector('[role="combobox"]');
      expect(selectElement).toHaveClass('h-12', 'px-4', 'text-base');
    });
  });

  describe('Validation States', () => {
    it('applies invalid state classes', () => {
      const { container } = render(<Select {...defaultProps} isInvalid />);
      const selectElement = container.querySelector('[role="combobox"]');
      expect(selectElement).toHaveClass('border-destructive');
    });

    it('applies valid state classes', () => {
      const { container } = render(<Select {...defaultProps} isValid />);
      const selectElement = container.querySelector('[role="combobox"]');
      expect(selectElement).toHaveClass('border-green-500');
    });

    it('applies warning state classes', () => {
      const { container } = render(<Select {...defaultProps} isWarning />);
      const selectElement = container.querySelector('[role="combobox"]');
      expect(selectElement).toHaveClass('border-yellow-500');
    });

    it('sets aria-invalid when isInvalid is true', () => {
      render(<Select {...defaultProps} isInvalid />);
      const selectElement = screen.getByRole('combobox');
      expect(selectElement).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('User Interactions', () => {
    it('opens dropdown on click', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectElement = screen.getByRole('combobox');
      await user.click(selectElement);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', async () => {
      render(<Select {...defaultProps} />);

      const selectElement = screen.getByRole('combobox');
      fireEvent.click(selectElement);

      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('selects option on click', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select {...defaultProps} onValueChange={handleChange} />);

      const selectElement = screen.getByRole('combobox');
      await user.click(selectElement);

      const option = screen.getByText('Option 2');
      await user.click(option);

      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} disabled />);

      const selectElement = screen.getByRole('combobox');
      await user.click(selectElement);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('does not select disabled option', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const optionsWithDisabled: SelectOption[] = [
        ...defaultOptions,
        { value: 'disabled', label: 'Disabled Option', disabled: true },
      ];

      render(<Select options={optionsWithDisabled} onValueChange={handleChange} />);

      const selectElement = screen.getByRole('combobox');
      await user.click(selectElement);

      const disabledOption = screen.getByText('Disabled Option');
      await user.click(disabledOption);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens dropdown on Enter key', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectElement = screen.getByRole('combobox');
      selectElement.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('opens dropdown on Space key', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectElement = screen.getByRole('combobox');
      selectElement.focus();
      await user.keyboard(' ');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes dropdown on Escape key', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectElement = screen.getByRole('combobox');
      await user.click(selectElement);

      expect(screen.getByRole('listbox')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('navigates options with ArrowDown', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select {...defaultProps} onValueChange={handleChange} />);

      const selectElement = screen.getByRole('combobox');
      selectElement.focus();

      // First ArrowDown opens dropdown
      await user.keyboard('{ArrowDown}');

      // Dropdown should be open
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // Second ArrowDown navigates to next option
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });

    it('navigates options with ArrowUp', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select {...defaultProps} value="option2" onValueChange={handleChange} />);

      const selectElement = screen.getByRole('combobox');
      selectElement.focus();

      // First ArrowUp opens dropdown
      await user.keyboard('{ArrowUp}');

      // Dropdown should be open
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // Second ArrowUp navigates to previous option
      await user.keyboard('{ArrowUp}');

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });

    it('wraps around when navigating past last option', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select {...defaultProps} value="option3" onValueChange={handleChange} />);

      const selectElement = screen.getByRole('combobox');
      selectElement.focus();

      // First ArrowDown opens dropdown
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // Second ArrowDown should wrap to first option
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });

    it('wraps around when navigating before first option', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select {...defaultProps} value="option1" onValueChange={handleChange} />);

      const selectElement = screen.getByRole('combobox');
      selectElement.focus();

      // First ArrowUp opens dropdown
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // Second ArrowUp should wrap to last option
      await user.keyboard('{ArrowUp}');

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });

    it('does not respond to keyboard when disabled', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} disabled />);

      const selectElement = screen.getByRole('combobox');
      selectElement.focus();
      await user.keyboard('{Enter}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as controlled component', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { rerender } = render(
        <Select {...defaultProps} value="option1" onValueChange={handleChange} />,
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();

      const selectElement = screen.getByRole('combobox');
      await user.click(selectElement);
      await user.click(screen.getByText('Option 2'));

      expect(handleChange).toHaveBeenCalledWith('option2');

      rerender(<Select {...defaultProps} value="option2" onValueChange={handleChange} />);
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('works as uncontrolled component', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} defaultValue="option1" />);

      expect(screen.getByText('Option 1')).toBeInTheDocument();

      const selectElement = screen.getByRole('combobox');
      await user.click(selectElement);
      await user.click(screen.getByText('Option 2'));

      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('uses CSS variables for theming', () => {
      const { container } = render(<Select {...defaultProps} />);
      const selectElement = container.querySelector('[role="combobox"]') as HTMLElement;

      expect(selectElement.style.borderRadius).toBe('var(--radius)');
      expect(selectElement.style.fontFamily).toBe('var(--typography-paragraph-font-family)');
    });

    it('applies custom theme override', () => {
      const themeOverride = { backgroundColor: 'red', color: 'blue' };
      const { container } = render(<Select {...defaultProps} themeOverride={themeOverride} />);
      const selectElement = container.querySelector('[role="combobox"]') as HTMLElement;

      expect(selectElement.style.backgroundColor).toBe('red');
      expect(selectElement.style.color).toBe('blue');
    });

    it('updates focus ring color based on validation state', () => {
      const { container } = render(<Select {...defaultProps} isInvalid />);
      const selectElement = container.querySelector('[role="combobox"]') as HTMLElement;

      // Check if focus ring color variable is set for invalid state
      expect(selectElement.style.getPropertyValue('--focus-ring-color')).toContain('destructive');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Select {...defaultProps} aria-label="Test select" />);
      const selectElement = screen.getByRole('combobox');

      expect(selectElement).toHaveAttribute('aria-label', 'Test select');
      expect(selectElement).toHaveAttribute('aria-expanded', 'false');
      expect(selectElement).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('sets aria-expanded when dropdown is open', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectElement = screen.getByRole('combobox');
      await user.click(selectElement);

      expect(selectElement).toHaveAttribute('aria-expanded', 'true');
    });

    it('has proper tabindex when enabled', () => {
      render(<Select {...defaultProps} />);
      const selectElement = screen.getByRole('combobox');
      expect(selectElement).toHaveAttribute('tabindex', '0');
    });

    it('has tabindex -1 when disabled', () => {
      render(<Select {...defaultProps} disabled />);
      const selectElement = screen.getByRole('combobox');
      expect(selectElement).toHaveAttribute('tabindex', '-1');
    });

    it('sets aria-required when specified', () => {
      render(<Select {...defaultProps} aria-required />);
      const selectElement = screen.getByRole('combobox');
      expect(selectElement).toHaveAttribute('aria-required', 'true');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<Select {...defaultProps} aria-label="Accessible select" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('options have proper aria-selected', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} value="option2" />);

      const selectElement = screen.getByRole('combobox');
      await user.click(selectElement);

      const selectedOption = screen.getByRole('option', { name: 'Option 2' });
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');

      const unselectedOption = screen.getByRole('option', { name: 'Option 1' });
      expect(unselectedOption).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Performance - MemoizedSelect', () => {
    it('memoizes correctly when props do not change', () => {
      const { rerender } = render(<MemoizedSelect {...defaultProps} />);

      const firstRender = screen.getByRole('combobox');

      rerender(<MemoizedSelect {...defaultProps} />);

      const secondRender = screen.getByRole('combobox');

      expect(firstRender).toBe(secondRender);
    });

    it('re-renders when value changes', () => {
      const handleChange = vi.fn();
      const { rerender } = render(
        <MemoizedSelect {...defaultProps} value="option1" onValueChange={handleChange} />,
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();

      rerender(
        <MemoizedSelect {...defaultProps} value="option2" onValueChange={handleChange} />,
      );

      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('re-renders when options change', () => {
      const { rerender } = render(<MemoizedSelect {...defaultProps} />);

      const newOptions: SelectOption[] = [
        { value: 'new1', label: 'New Option 1' },
        { value: 'new2', label: 'New Option 2' },
      ];

      rerender(<MemoizedSelect options={newOptions} placeholder="Select" />);

      fireEvent.click(screen.getByRole('combobox'));
      expect(screen.getByText('New Option 1')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      render(<Select options={[]} placeholder="No options" />);
      expect(screen.getByText('No options')).toBeInTheDocument();
    });

    it('handles long option labels', async () => {
      const user = userEvent.setup();
      const longOptions: SelectOption[] = [
        {
          value: 'long',
          label: 'This is a very long option label that might cause layout issues',
        },
      ];

      render(<Select options={longOptions} />);

      const selectElement = screen.getByRole('combobox');
      await user.click(selectElement);

      expect(
        screen.getByText('This is a very long option label that might cause layout issues'),
      ).toBeInTheDocument();
    });

    it('handles rapid open/close', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const selectElement = screen.getByRole('combobox');

      // Open
      await user.click(selectElement);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // Close
      await user.click(selectElement);
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });

      // Open again
      await user.click(selectElement);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('displays check icon for selected option', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} value="option1" />);

      const selectElement = screen.getByRole('combobox');
      await user.click(selectElement);

      const listbox = screen.getByRole('listbox');
      const checkIcon = listbox.querySelector('.lucide-check');

      expect(checkIcon).toBeInTheDocument();
    });
  });
});
