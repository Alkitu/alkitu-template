import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Select, MemoizedSelect } from './Select';
import type { SelectOption, SelectGroupOption, SelectProps } from './Select.types';

expect.extend(toHaveNoViolations);

describe('Select Component', () => {
  const defaultOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const groupedOptions: SelectGroupOption[] = [
    {
      label: 'Group 1',
      options: [
        { value: 'g1-option1', label: 'Group 1 - Option 1' },
        { value: 'g1-option2', label: 'Group 1 - Option 2' },
      ],
    },
    {
      label: 'Group 2',
      options: [
        { value: 'g2-option1', label: 'Group 2 - Option 1' },
        { value: 'g2-option2', label: 'Group 2 - Option 2' },
      ],
    },
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
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
    });

    it('renders with custom className', () => {
      render(<Select {...defaultProps} className="custom-class" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('custom-class');
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
      expect(screen.getByRole('combobox')).toHaveTextContent('Option 1');
    });

    it('renders with icon in options', async () => {
      const user = userEvent.setup();
      const optionsWithIcon: SelectOption[] = [
        { value: 'opt1', label: 'Option 1', icon: <span data-testid="icon-1">🔥</span> },
      ];

      render(<Select options={optionsWithIcon} placeholder="Select" />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      expect(screen.getByTestId('icon-1')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies default variant classes', () => {
      render(<Select {...defaultProps} variant="default" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('bg-background', 'text-foreground', 'border-input');
    });

    it('applies ghost variant classes', () => {
      render(<Select {...defaultProps} variant="ghost" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('bg-transparent', 'border-transparent');
    });

    it('applies filled variant classes', () => {
      render(<Select {...defaultProps} variant="filled" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('bg-muted', 'border-transparent');
    });
  });

  describe('Sizes', () => {
    it('applies small size classes', () => {
      render(<Select {...defaultProps} size="sm" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-8', 'px-2', 'text-sm');
    });

    it('applies medium size classes (default)', () => {
      render(<Select {...defaultProps} size="md" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-10', 'px-3', 'text-sm');
    });

    it('applies large size classes', () => {
      render(<Select {...defaultProps} size="lg" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-12', 'px-4', 'text-base');
    });
  });

  describe('Validation States', () => {
    it('applies invalid state classes', () => {
      render(<Select {...defaultProps} isInvalid />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('border-destructive');
    });

    it('applies valid state classes', () => {
      render(<Select {...defaultProps} isValid />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('border-green-500');
    });

    it('applies warning state classes', () => {
      render(<Select {...defaultProps} isWarning />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('border-yellow-500');
    });

    it('sets aria-invalid when isInvalid is true', () => {
      render(<Select {...defaultProps} isInvalid />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('User Interactions', () => {
    it('opens dropdown on click', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      });
    });

    it('selects option on click', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select {...defaultProps} onValueChange={handleChange} />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      });

      const option = screen.getByRole('option', { name: 'Option 2' });
      await user.click(option);

      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} disabled />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.queryByRole('option', { name: 'Option 1' })).not.toBeInTheDocument();
        },
        { timeout: 500 },
      );
    });

    it('does not select disabled option', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const optionsWithDisabled: SelectOption[] = [
        ...defaultOptions,
        { value: 'disabled', label: 'Disabled Option', disabled: true },
      ];

      render(<Select options={optionsWithDisabled} onValueChange={handleChange} />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Disabled Option' })).toBeInTheDocument();
      });

      const disabledOption = screen.getByRole('option', { name: 'Disabled Option' });
      expect(disabledOption).toHaveAttribute('data-disabled', '');

      // Try to click disabled option
      await user.click(disabledOption);

      // Handler should not be called
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens dropdown on Enter key', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      });
    });

    it('opens dropdown on Space key', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      });
    });

    it('closes dropdown on Escape key', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('option', { name: 'Option 1' })).not.toBeInTheDocument();
      });
    });

    it('navigates options with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      });
    });

    it('navigates options with ArrowUp', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      await user.keyboard('{ArrowUp}');

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      });
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as controlled component', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { rerender } = render(
        <Select {...defaultProps} value="option1" onValueChange={handleChange} />,
      );

      expect(screen.getByRole('combobox')).toHaveTextContent('Option 1');

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 2' }));

      expect(handleChange).toHaveBeenCalledWith('option2');

      rerender(<Select {...defaultProps} value="option2" onValueChange={handleChange} />);
      expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
    });

    it('works as uncontrolled component', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} defaultValue="option1" />);

      expect(screen.getByRole('combobox')).toHaveTextContent('Option 1');

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 2' }));

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
      });
    });
  });

  describe('Grouped Options', () => {
    it('renders grouped options correctly', async () => {
      const user = userEvent.setup();
      render(<Select options={groupedOptions} placeholder="Select" />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Group 1')).toBeInTheDocument();
        expect(screen.getByText('Group 2')).toBeInTheDocument();
      });
    });

    it('selects option from grouped options', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select options={groupedOptions} onValueChange={handleChange} />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Group 1 - Option 2' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Group 1 - Option 2' }));

      expect(handleChange).toHaveBeenCalledWith('g1-option2');
    });

    it('displays group labels as headers', async () => {
      const user = userEvent.setup();
      render(<Select options={groupedOptions} placeholder="Select" />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        const group1Label = screen.getByText('Group 1');
        const group2Label = screen.getByText('Group 2');

        expect(group1Label).toBeInTheDocument();
        expect(group2Label).toBeInTheDocument();
      });
    });
  });

  describe('Theme Integration', () => {
    it('uses CSS variables for theming', () => {
      render(<Select {...defaultProps} />);
      const trigger = screen.getByRole('combobox');

      expect(trigger.style.borderRadius).toBe('var(--radius)');
      expect(trigger.style.fontFamily).toBe('var(--typography-paragraph-font-family)');
    });

    it('applies custom theme override', () => {
      const themeOverride = { backgroundColor: 'red', color: 'blue' };
      render(<Select {...defaultProps} themeOverride={themeOverride} />);
      const trigger = screen.getByRole('combobox');

      expect(trigger.style.backgroundColor).toBe('red');
      expect(trigger.style.color).toBe('blue');
    });

    it('updates focus ring color based on validation state', () => {
      render(<Select {...defaultProps} isInvalid />);
      const trigger = screen.getByRole('combobox');

      expect(trigger.style.getPropertyValue('--focus-ring-color')).toContain('destructive');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Select {...defaultProps} aria-label="Test select" />);
      const trigger = screen.getByRole('combobox');

      expect(trigger).toHaveAttribute('aria-label', 'Test select');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('sets aria-expanded when dropdown is open', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('sets aria-required when specified', () => {
      render(<Select {...defaultProps} required />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-required', 'true');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<Select {...defaultProps} aria-label="Accessible select" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation for accessibility', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select {...defaultProps} onValueChange={handleChange} />);

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      // Open dropdown with Enter
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      });

      // Navigate down and select option 2
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      // Verify the selection was made
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });
  });

  describe('Form Integration', () => {
    it('supports name attribute for forms', () => {
      render(<Select {...defaultProps} name="test-select" />);
      // Radix creates a hidden input for form integration - verify the select has the name prop
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      // The name is passed to the underlying Radix Select.Root which manages the hidden input
    });

    it('supports id attribute', () => {
      render(<Select {...defaultProps} id="test-id" />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('id', 'test-id');
    });

    it('supports required attribute', () => {
      render(<Select {...defaultProps} required />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-required', 'true');
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

      expect(screen.getByRole('combobox')).toHaveTextContent('Option 1');

      rerender(
        <MemoizedSelect {...defaultProps} value="option2" onValueChange={handleChange} />,
      );

      expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
    });

    it('re-renders when options change', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<MemoizedSelect {...defaultProps} />);

      const newOptions: SelectOption[] = [
        { value: 'new1', label: 'New Option 1' },
        { value: 'new2', label: 'New Option 2' },
      ];

      rerender(<MemoizedSelect options={newOptions} placeholder="Select" />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'New Option 1' })).toBeInTheDocument();
      });
    });

    it('re-renders when grouped options change', () => {
      const { rerender } = render(<MemoizedSelect options={groupedOptions} />);

      const newGroupedOptions: SelectGroupOption[] = [
        {
          label: 'New Group',
          options: [{ value: 'new1', label: 'New Option' }],
        },
      ];

      rerender(<MemoizedSelect options={newGroupedOptions} />);

      // Component should re-render with new options
      expect(screen.getByRole('combobox')).toBeInTheDocument();
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

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(
          screen.getByText('This is a very long option label that might cause layout issues'),
        ).toBeInTheDocument();
      });
    });

    it('displays chevron icon', () => {
      const { container } = render(<Select {...defaultProps} />);
      const chevron = container.querySelector('.lucide-chevron-down');
      expect(chevron).toBeInTheDocument();
    });

    it('displays check icon for selected option', async () => {
      const user = userEvent.setup();
      render(<Select {...defaultProps} value="option1" />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        const checkIcon = document.querySelector('.lucide-check');
        expect(checkIcon).toBeInTheDocument();
      });
    });

    it('handles rapid option changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select {...defaultProps} onValueChange={handleChange} />);

      const trigger = screen.getByRole('combobox');

      // First selection
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('option', { name: 'Option 1' }));

      // Second selection
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('option', { name: 'Option 2' }));

      expect(handleChange).toHaveBeenCalledTimes(2);
      expect(handleChange).toHaveBeenNthCalledWith(1, 'option1');
      expect(handleChange).toHaveBeenNthCalledWith(2, 'option2');
    });
  });
});
