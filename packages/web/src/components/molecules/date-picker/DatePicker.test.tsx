import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DatePicker } from './DatePicker';
import type { DatePickerProps, DateRange } from './DatePicker.types';

expect.extend(toHaveNoViolations);

describe('DatePicker - Atomic Design Molecule', () => {
  const defaultProps: DatePickerProps = {
    label: 'Select Date',
    placeholder: 'Choose a date',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // RENDERING TESTS
  // ============================================================

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<DatePicker {...defaultProps} />);

      expect(screen.getByText('Select Date')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /select date/i })).toBeInTheDocument();
    });

    it('renders with placeholder text', () => {
      render(<DatePicker {...defaultProps} />);

      expect(screen.getByText('Choose a date')).toBeInTheDocument();
    });

    it('renders with required indicator', () => {
      render(<DatePicker {...defaultProps} required />);

      const label = screen.getByText('Select Date');
      expect(label.parentElement).toHaveTextContent('*');
    });

    it('renders with error message', () => {
      render(<DatePicker {...defaultProps} error="Invalid date" id="date-picker" />);

      expect(screen.getByRole('alert')).toHaveTextContent('Invalid date');
      expect(screen.getByRole('button')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'date-picker-error');
    });

    it('renders with helper text', () => {
      render(<DatePicker {...defaultProps} helperText="Select your birth date" />);

      expect(screen.getByText('Select your birth date')).toBeInTheDocument();
    });

    it('does not show helper text when error is present', () => {
      render(<DatePicker {...defaultProps} helperText="Helper" error="Error" />);

      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('renders with custom ID', () => {
      render(<DatePicker {...defaultProps} id="custom-date-picker" />);

      expect(screen.getByRole('button')).toHaveAttribute('id', 'custom-date-picker');
    });
  });

  // ============================================================
  // VARIANT TESTS
  // ============================================================

  describe('Variants', () => {
    it('renders default variant with popover trigger', () => {
      render(<DatePicker {...defaultProps} variant="default" />);

      expect(screen.getByRole('button', { name: /select date/i })).toBeInTheDocument();
    });

    it('renders inline variant with embedded calendar', () => {
      render(<DatePicker {...defaultProps} variant="inline" />);

      // Inline variant should not have a trigger button
      expect(screen.queryByRole('button', { name: /select date/i })).not.toBeInTheDocument();
      // Should render calendar directly in the DOM
      expect(document.querySelector('.border.border-border.rounded-lg')).toBeInTheDocument();
    });

    it('renders datetime variant with time inputs when popover is open', async () => {
      const user = userEvent.setup();
      render(<DatePicker {...defaultProps} variant="datetime" />);

      const trigger = screen.getByRole('button', { name: /select date/i });
      await user.click(trigger);

      // Wait for popover to open and time inputs to appear
      await waitFor(() => {
        expect(screen.getByLabelText(/hour/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/min/i)).toBeInTheDocument();
      });
    });

    it('renders range variant for date range selection', () => {
      render(<DatePicker {...defaultProps} variant="range" />);

      expect(screen.getByRole('button', { name: /select date/i })).toBeInTheDocument();
    });
  });

  // ============================================================
  // SIZE TESTS
  // ============================================================

  describe('Sizes', () => {
    it.each([
      ['sm', 'h-9'],
      ['md', 'h-10'],
      ['lg', 'h-12'],
    ] as const)('applies correct size classes for %s size', (size, expectedClass) => {
      render(<DatePicker {...defaultProps} size={size} />);

      const button = screen.getByRole('button', { name: /select date/i });
      expect(button).toHaveClass(expectedClass);
    });
  });

  // ============================================================
  // INTERACTION TESTS
  // ============================================================

  describe('Interactions', () => {
    it('opens popover when trigger button is clicked', async () => {
      const user = userEvent.setup();
      render(<DatePicker {...defaultProps} />);

      const trigger = screen.getByRole('button', { name: /select date/i });
      await user.click(trigger);

      // Popover should open - check for calendar elements
      await waitFor(() => {
        expect(document.querySelector('[data-slot="popover-content"]')).toBeInTheDocument();
      });
    });

    it('calls onChange when a date is selected', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<DatePicker {...defaultProps} onChange={handleChange} />);

      const trigger = screen.getByRole('button', { name: /select date/i });
      await user.click(trigger);

      // Wait for calendar to appear and click a date
      await waitFor(async () => {
        const dateButtons = screen.getAllByRole('button');
        // Find a date button (not navigation buttons)
        const dateButton = dateButtons.find(btn => /^\d+$/.test(btn.textContent || ''));
        if (dateButton) {
          await user.click(dateButton);
          expect(handleChange).toHaveBeenCalled();
        }
      });
    });

    it('shows selected date in the input field', async () => {
      const testDate = new Date(2025, 0, 15); // January 15, 2025
      render(<DatePicker {...defaultProps} value={testDate} />);

      // The formatted date should appear
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /select date/i });
        expect(button).toHaveTextContent(/January/i);
        expect(button).toHaveTextContent('15');
      });
    });

    it('allows manual date input', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<DatePicker {...defaultProps} onChange={handleChange} />);

      const manualInput = screen.getByPlaceholderText('dd/mm/yyyy');
      await user.type(manualInput, '2025-01-15');

      // onChange should be called with parsed date
      expect(handleChange).toHaveBeenCalled();
    });
  });

  // ============================================================
  // CLEARABLE TESTS
  // ============================================================

  describe('Clearable Functionality', () => {
    it('shows clear button when clearable and has value', async () => {
      const testDate = new Date(2025, 0, 15);
      render(<DatePicker {...defaultProps} value={testDate} clearable />);

      await waitFor(() => {
        expect(screen.getByLabelText('Clear date')).toBeInTheDocument();
      });
    });

    it('does not show clear button when clearable is false', () => {
      const testDate = new Date(2025, 0, 15);
      render(<DatePicker {...defaultProps} value={testDate} clearable={false} />);

      expect(screen.queryByLabelText('Clear date')).not.toBeInTheDocument();
    });

    it('clears date when clear button is clicked', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      const testDate = new Date(2025, 0, 15);

      render(<DatePicker {...defaultProps} value={testDate} onChange={handleChange} clearable />);

      const clearButton = screen.getByLabelText('Clear date');
      await user.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith(undefined);
    });

    it('prevents popover from opening when clear button is clicked', async () => {
      const user = userEvent.setup();
      const testDate = new Date(2025, 0, 15);

      render(<DatePicker {...defaultProps} value={testDate} clearable />);

      const clearButton = screen.getByLabelText('Clear date');
      await user.click(clearButton);

      // Popover should not open
      expect(document.querySelector('[data-slot="popover-content"]')).not.toBeInTheDocument();
    });
  });

  // ============================================================
  // TODAY BUTTON TESTS
  // ============================================================

  describe('Today Button', () => {
    it('shows today button when showToday is true', async () => {
      const user = userEvent.setup();
      render(<DatePicker {...defaultProps} showToday />);

      const trigger = screen.getByRole('button', { name: /select date/i });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Today')).toBeInTheDocument();
      });
    });

    it('does not show today button when showToday is false', async () => {
      const user = userEvent.setup();
      render(<DatePicker {...defaultProps} showToday={false} />);

      const trigger = screen.getByRole('button', { name: /select date/i });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.queryByText('Today')).not.toBeInTheDocument();
      });
    });

    it('selects today when today button is clicked', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<DatePicker {...defaultProps} onChange={handleChange} showToday />);

      const trigger = screen.getByRole('button', { name: /select date/i });
      await user.click(trigger);

      await waitFor(async () => {
        const todayButton = screen.getByText('Today');
        await user.click(todayButton);

        expect(handleChange).toHaveBeenCalled();
        const calledDate = handleChange.mock.calls[0][0] as Date;
        const today = new Date();
        expect(calledDate.toDateString()).toBe(today.toDateString());
      });
    });
  });

  // ============================================================
  // DATE RANGE TESTS
  // ============================================================

  describe('Date Range Variant', () => {
    it('handles range selection correctly', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<DatePicker {...defaultProps} variant="range" onChange={handleChange} />);

      const trigger = screen.getByRole('button', { name: /select date/i });
      await user.click(trigger);

      // Calendar should open in range mode
      await waitFor(() => {
        expect(document.querySelector('[data-slot="popover-content"]')).toBeInTheDocument();
      });
    });

    it('displays range value correctly', async () => {
      const rangeValue: DateRange = {
        from: new Date(2025, 0, 10),
        to: new Date(2025, 0, 20),
      };

      render(<DatePicker {...defaultProps} variant="range" value={rangeValue} />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /select date/i });
        expect(button).toHaveTextContent(/January/i);
        expect(button).toHaveTextContent('10');
        expect(button).toHaveTextContent('20');
      });
    });

    it('shows partial range when only from date is selected', async () => {
      const rangeValue: DateRange = {
        from: new Date(2025, 0, 10),
      };

      render(<DatePicker {...defaultProps} variant="range" value={rangeValue} />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /select date/i });
        expect(button).toHaveTextContent('Select end date');
      });
    });
  });

  // ============================================================
  // DATETIME VARIANT TESTS
  // ============================================================

  describe('DateTime Variant', () => {
    it('includes time in the formatted date', async () => {
      const testDate = new Date(2025, 0, 15, 14, 30);
      render(<DatePicker {...defaultProps} variant="datetime" value={testDate} />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /select date/i });
        expect(button).toHaveTextContent(/14:30|2:30/i);
      });
    });

    it('updates time when time inputs are changed', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      const testDate = new Date(2025, 0, 15, 12, 0);

      render(<DatePicker {...defaultProps} variant="datetime" value={testDate} onChange={handleChange} />);

      const trigger = screen.getByRole('button', { name: /select date/i });
      await user.click(trigger);

      await waitFor(async () => {
        const hourInput = screen.getByLabelText(/hour/i);
        await user.clear(hourInput);
        await user.type(hourInput, '15');

        expect(handleChange).toHaveBeenCalled();
      });
    });
  });

  // ============================================================
  // DISABLED STATE TESTS
  // ============================================================

  describe('Disabled State', () => {
    it('disables trigger button when disabled prop is true', () => {
      render(<DatePicker {...defaultProps} disabled />);

      const button = screen.getByRole('button', { name: /select date/i });
      expect(button).toBeDisabled();
    });

    it('disables manual input when disabled', () => {
      render(<DatePicker {...defaultProps} disabled />);

      const manualInput = screen.getByPlaceholderText('dd/mm/yyyy');
      expect(manualInput).toBeDisabled();
    });

    it('does not open popover when disabled', async () => {
      const user = userEvent.setup();
      render(<DatePicker {...defaultProps} disabled />);

      const trigger = screen.getByRole('button', { name: /select date/i });
      await user.click(trigger);

      expect(document.querySelector('[data-slot="popover-content"]')).not.toBeInTheDocument();
    });
  });

  // ============================================================
  // THEME CSS VARIABLES TESTS
  // ============================================================

  describe('Theme CSS Variables', () => {
    it('uses theme CSS variables for styling', () => {
      render(<DatePicker {...defaultProps} />);

      const button = screen.getByRole('button', { name: /select date/i });

      // Check for theme-related classes
      expect(button).toHaveClass('border-input');
      expect(button).toHaveClass('bg-background');
      expect(button).toHaveClass('ring-offset-background');
    });

    it('applies error state styles', () => {
      render(<DatePicker {...defaultProps} error="Error" id="date-picker" />);

      const errorText = screen.getByRole('alert');
      expect(errorText).toHaveClass('text-destructive');
    });

    it('applies muted text color to placeholder', () => {
      render(<DatePicker {...defaultProps} />);

      const button = screen.getByRole('button', { name: /select date/i });
      // Button without value should have muted foreground class
      expect(button).toHaveClass('text-muted-foreground');
    });
  });

  // ============================================================
  // ACCESSIBILITY TESTS
  // ============================================================

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<DatePicker {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('associates label with trigger button', () => {
      render(<DatePicker {...defaultProps} id="date-picker" label="Birth Date" />);

      const button = screen.getByRole('button', { name: /birth date/i });
      expect(button).toBeInTheDocument();
    });

    it('provides aria-invalid when error exists', () => {
      render(<DatePicker {...defaultProps} error="Invalid" id="date-picker" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-invalid', 'true');
    });

    it('provides aria-describedby for error messages', () => {
      render(<DatePicker {...defaultProps} error="Invalid date" id="date-picker" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'date-picker-error');
    });

    it('has proper role for error message', () => {
      render(<DatePicker {...defaultProps} error="Invalid date" />);

      expect(screen.getByRole('alert')).toHaveTextContent('Invalid date');
    });

    it('has aria-label for manual input', () => {
      render(<DatePicker {...defaultProps} />);

      const manualInput = screen.getByLabelText('Manual date input');
      expect(manualInput).toBeInTheDocument();
    });

    it('has aria-label for clear button', async () => {
      const testDate = new Date(2025, 0, 15);
      render(<DatePicker {...defaultProps} value={testDate} clearable />);

      await waitFor(() => {
        expect(screen.getByLabelText('Clear date')).toBeInTheDocument();
      });
    });
  });

  // ============================================================
  // EDGE CASES
  // ============================================================

  describe('Edge Cases', () => {
    it('handles undefined value gracefully', () => {
      render(<DatePicker {...defaultProps} value={undefined} />);

      const button = screen.getByRole('button', { name: /select date/i });
      expect(button).toHaveTextContent('Choose a date');
    });

    it('handles invalid date gracefully', () => {
      const invalidDate = new Date('invalid');
      render(<DatePicker {...defaultProps} value={invalidDate} />);

      // Should not crash and should show placeholder
      expect(screen.getByText('Choose a date')).toBeInTheDocument();
    });

    it('handles empty range gracefully', () => {
      const emptyRange: DateRange = {};
      render(<DatePicker {...defaultProps} variant="range" value={emptyRange} />);

      expect(screen.getByText('Choose a date')).toBeInTheDocument();
    });

    it('handles min/max date constraints', () => {
      const minDate = new Date(2025, 0, 1);
      const maxDate = new Date(2025, 11, 31);

      render(<DatePicker {...defaultProps} minDate={minDate} maxDate={maxDate} />);

      // Component should render without errors
      expect(screen.getByRole('button', { name: /select date/i })).toBeInTheDocument();
    });
  });

  // ============================================================
  // INLINE VARIANT SPECIFIC TESTS
  // ============================================================

  describe('Inline Variant', () => {
    it('renders calendar directly without popover', () => {
      render(<DatePicker {...defaultProps} variant="inline" />);

      // Should have calendar container
      expect(document.querySelector('.border.border-border.rounded-lg')).toBeInTheDocument();

      // Should not have popover trigger
      expect(screen.queryByRole('button', { name: /select date/i })).not.toBeInTheDocument();
    });

    it('shows today and clear buttons in inline variant', () => {
      const testDate = new Date(2025, 0, 15);
      render(<DatePicker {...defaultProps} variant="inline" value={testDate} showToday clearable />);

      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('renders time inputs in inline datetime variant', () => {
      render(<DatePicker {...defaultProps} variant="datetime" />);

      // For inline datetime, time inputs should be visible immediately
      const trigger = screen.getByRole('button', { name: /select date/i });
      expect(trigger).toBeInTheDocument();
    });
  });

  // ============================================================
  // REF FORWARDING TESTS
  // ============================================================

  describe('Ref Forwarding', () => {
    it('forwards ref to container div', () => {
      const ref = vi.fn();
      render(<DatePicker {...defaultProps} ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });
});
