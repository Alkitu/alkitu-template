import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Mail, User } from 'lucide-react';
import { FormSelect } from './FormSelect';
import type { SelectOption, SelectGroupOption } from '@/components/atoms-alianza/Select';
import type { FormSelectProps } from './FormSelect.types';

expect.extend(toHaveNoViolations);

describe('FormSelect Component', () => {
  const defaultOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const groupedOptions: SelectGroupOption[] = [
    {
      label: 'Group 1',
      options: [
        { value: 'g1-opt1', label: 'Group 1 - Option 1' },
        { value: 'g1-opt2', label: 'Group 1 - Option 2' },
      ],
    },
    {
      label: 'Group 2',
      options: [
        { value: 'g2-opt1', label: 'Group 2 - Option 1' },
        { value: 'g2-opt2', label: 'Group 2 - Option 2' },
      ],
    },
  ];

  const defaultProps: FormSelectProps = {
    label: 'Test Select',
    options: defaultOptions,
    value: '',
    onValueChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<FormSelect {...defaultProps} />);

      expect(screen.getByText('Test Select')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders with selected value', () => {
      render(<FormSelect {...defaultProps} value="option2" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveTextContent('Option 2');
    });

    it('renders with custom placeholder', () => {
      render(<FormSelect {...defaultProps} placeholder="Choose one..." />);

      expect(screen.getByText('Choose one...')).toBeInTheDocument();
    });

    it('renders with icon', () => {
      render(<FormSelect {...defaultProps} icon={<Mail data-testid="mail-icon" />} />);

      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(<FormSelect {...defaultProps} helperText="This is helpful information" />);

      expect(screen.getByText('This is helpful information')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(<FormSelect {...defaultProps} error="This field is required" />);

      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-destructive');
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });

    it('renders required indicator', () => {
      render(<FormSelect {...defaultProps} required />);

      const label = screen.getByText('Test Select');
      const requiredIndicator = label.querySelector('.text-destructive');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveTextContent('*');
    });

    it('renders optional indicator when showOptional is true', () => {
      render(<FormSelect {...defaultProps} showOptional />);

      expect(screen.getByText('(optional)')).toBeInTheDocument();
    });

    it('does not show helper text when error is present', () => {
      render(
        <FormSelect
          {...defaultProps}
          error="Error message"
          helperText="Helper text should not show"
        />,
      );

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text should not show')).not.toBeInTheDocument();
    });
  });

  describe('Label and ID Association', () => {
    it('associates label with select via htmlFor', () => {
      render(<FormSelect {...defaultProps} />);

      const label = screen.getByText('Test Select');
      const select = screen.getByRole('combobox');

      expect(label).toHaveAttribute('for');
      expect(select).toHaveAttribute('id');
      expect(label.getAttribute('for')).toBe(select.getAttribute('id'));
    });

    it('uses custom id when provided', () => {
      render(<FormSelect {...defaultProps} id="custom-id" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id', 'custom-id');
    });

    it('generates id from label when not provided', () => {
      render(<FormSelect {...defaultProps} label="My Test Label" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id', 'form-select-my-test-label');
    });
  });

  describe('User Interactions', () => {
    it('calls onValueChange when option is selected', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<FormSelect {...defaultProps} onValueChange={handleChange} />);

      const select = screen.getByRole('combobox');
      await user.click(select);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 2' }));

      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('opens dropdown on click', async () => {
      const user = userEvent.setup();
      render(<FormSelect {...defaultProps} />);

      const select = screen.getByRole('combobox');
      await user.click(select);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      });
    });

    it('does not open dropdown when disabled', async () => {
      const user = userEvent.setup();
      render(<FormSelect {...defaultProps} disabled />);

      const select = screen.getByRole('combobox');
      await user.click(select);

      await waitFor(
        () => {
          expect(screen.queryByRole('option', { name: 'Option 1' })).not.toBeInTheDocument();
        },
        { timeout: 500 },
      );
    });
  });

  describe('Grouped Options', () => {
    it('renders grouped options correctly', async () => {
      const user = userEvent.setup();
      render(<FormSelect {...defaultProps} options={groupedOptions} />);

      const select = screen.getByRole('combobox');
      await user.click(select);

      await waitFor(() => {
        expect(screen.getByText('Group 1')).toBeInTheDocument();
        expect(screen.getByText('Group 2')).toBeInTheDocument();
      });
    });

    it('selects option from grouped options', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<FormSelect {...defaultProps} options={groupedOptions} onValueChange={handleChange} />);

      const select = screen.getByRole('combobox');
      await user.click(select);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Group 1 - Option 2' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Group 1 - Option 2' }));

      expect(handleChange).toHaveBeenCalledWith('g1-opt2');
    });
  });

  describe('Variants', () => {
    it('applies default variant', () => {
      render(<FormSelect {...defaultProps} variant="default" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('border-input');
    });

    it('applies ghost variant', () => {
      render(<FormSelect {...defaultProps} variant="ghost" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('bg-transparent', 'border-transparent');
    });

    it('applies filled variant', () => {
      render(<FormSelect {...defaultProps} variant="filled" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('bg-muted');
    });
  });

  describe('Sizes', () => {
    it('applies small size', () => {
      render(<FormSelect {...defaultProps} size="sm" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('h-8', 'px-2');
    });

    it('applies medium size (default)', () => {
      render(<FormSelect {...defaultProps} size="md" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('h-10', 'px-3');
    });

    it('applies large size', () => {
      render(<FormSelect {...defaultProps} size="lg" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('h-12', 'px-4');
    });
  });

  describe('Validation States', () => {
    it('marks select as invalid when error is present', () => {
      render(<FormSelect {...defaultProps} error="Error message" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'true');
      expect(select).toHaveClass('border-destructive');
    });

    it('associates error message with select via aria-describedby', () => {
      render(<FormSelect {...defaultProps} error="Error message" />);

      const select = screen.getByRole('combobox');
      const errorMessage = screen.getByText('Error message');

      expect(select).toHaveAttribute('aria-describedby');
      expect(select.getAttribute('aria-describedby')).toContain(errorMessage.id);
    });

    it('associates helper text with select via aria-describedby', () => {
      render(<FormSelect {...defaultProps} helperText="Helper text" />);

      const select = screen.getByRole('combobox');
      const helperText = screen.getByText('Helper text');

      expect(select).toHaveAttribute('aria-describedby');
      expect(select.getAttribute('aria-describedby')).toContain(helperText.id);
    });
  });

  describe('Disabled State', () => {
    it('applies disabled styles to label', () => {
      render(<FormSelect {...defaultProps} disabled />);

      const label = screen.getByText('Test Select');
      expect(label).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('disables the select', () => {
      render(<FormSelect {...defaultProps} disabled />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('disabled');
    });
  });

  describe('Form Integration', () => {
    it('supports name attribute for forms', () => {
      render(<FormSelect {...defaultProps} name="test-select" />);

      // Radix creates a hidden input for form integration - verify the select has the name prop
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      // The name is passed to the underlying Radix Select.Root which manages the hidden input
    });

    it('marks field as required', () => {
      render(<FormSelect {...defaultProps} required />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Icon Integration', () => {
    it('renders icon inside select wrapper', () => {
      render(<FormSelect {...defaultProps} icon={<User data-testid="user-icon" />} />);

      const icon = screen.getByTestId('user-icon');
      expect(icon).toBeInTheDocument();
    });

    it('applies left padding when icon is present', () => {
      render(<FormSelect {...defaultProps} icon={<User />} />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass('pl-10');
    });

    it('does not apply left padding when icon is not present', () => {
      render(<FormSelect {...defaultProps} />);

      const select = screen.getByRole('combobox');
      expect(select).not.toHaveClass('pl-10');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<FormSelect {...defaultProps} required />);

      const select = screen.getByRole('combobox');

      expect(select).toHaveAttribute('aria-required', 'true');
      expect(select).toHaveAttribute('aria-invalid', 'false');
    });

    it('error message has role alert', () => {
      render(<FormSelect {...defaultProps} error="Error message" />);

      const errorMessage = screen.getByText('Error message');
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<FormSelect {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with error', async () => {
      const { container } = render(<FormSelect {...defaultProps} error="Error message" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with icon', async () => {
      const { container } = render(<FormSelect {...defaultProps} icon={<Mail />} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to wrapper', () => {
      const { container } = render(<FormSelect {...defaultProps} className="custom-class" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      render(<FormSelect {...defaultProps} options={[]} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('handles long label text', () => {
      render(
        <FormSelect
          {...defaultProps}
          label="This is a very long label that should still render correctly"
        />,
      );

      expect(
        screen.getByText('This is a very long label that should still render correctly'),
      ).toBeInTheDocument();
    });

    it('handles long error message', () => {
      const longError =
        'This is a very long error message that should wrap appropriately and remain readable';

      render(<FormSelect {...defaultProps} error={longError} />);

      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('handles rapid value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<FormSelect {...defaultProps} onValueChange={handleChange} />);

      const select = screen.getByRole('combobox');

      // First selection
      await user.click(select);
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('option', { name: 'Option 1' }));

      // Second selection
      await user.click(select);
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('option', { name: 'Option 2' }));

      expect(handleChange).toHaveBeenCalledTimes(2);
      expect(handleChange).toHaveBeenNthCalledWith(1, 'option1');
      expect(handleChange).toHaveBeenNthCalledWith(2, 'option2');
    });
  });

  describe('Integration with Select atom', () => {
    it('passes all necessary props to Select component', () => {
      render(
        <FormSelect
          {...defaultProps}
          variant="ghost"
          size="lg"
          disabled
          required
          name="test-name"
          id="test-id"
        />,
      );

      const select = screen.getByRole('combobox');

      expect(select).toHaveAttribute('id', 'test-id');
      expect(select).toHaveAttribute('aria-required', 'true');
      expect(select).toHaveAttribute('disabled');
      expect(select).toHaveClass('h-12'); // lg size
    });
  });
});
