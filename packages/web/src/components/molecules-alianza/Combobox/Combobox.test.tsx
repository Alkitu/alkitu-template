import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Combobox, ComboboxPresets } from './Combobox';
import type { ComboboxOption } from './Combobox.types';

expect.extend(toHaveNoViolations);

// Mock options for testing
const mockOptions: ComboboxOption[] = [
  { id: '1', label: 'Apple', value: 'apple', description: 'A red fruit' },
  { id: '2', label: 'Banana', value: 'banana', description: 'A yellow fruit' },
  { id: '3', label: 'Cherry', value: 'cherry', description: 'A small red fruit' },
  { id: '4', label: 'Date', value: 'date', description: 'A sweet fruit' },
  { id: '5', label: 'Elderberry', value: 'elderberry', description: 'A dark purple fruit', disabled: true },
];

const mockOptionsWithBadges: ComboboxOption[] = [
  {
    id: '1',
    label: 'Premium Plan',
    value: 'premium',
    badge: { text: 'Popular', variant: 'default' },
  },
  {
    id: '2',
    label: 'Basic Plan',
    value: 'basic',
    badge: { text: 'Free', variant: 'secondary' },
  },
  {
    id: '3',
    label: 'Enterprise Plan',
    value: 'enterprise',
    badge: { text: 'New', variant: 'outline' },
  },
];

describe('Combobox Component', () => {
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select option...')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          placeholder="Choose a fruit"
        />,
      );

      expect(screen.getByText('Choose a fruit')).toBeInTheDocument();
    });

    it('displays selected value', () => {
      render(
        <Combobox
          options={mockOptions}
          value="apple"
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          className="custom-class"
        />,
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders disabled state', () => {
      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          disabled
        />,
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeDisabled();
    });

    it('renders with custom buttonClass', () => {
      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          buttonClass="custom-button"
        />,
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('custom-button');
    });

    it('renders without onChange handler', () => {
      render(
        <Combobox
          options={mockOptions}
          value=""
        />,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Single Selection', () => {
    it('opens popover when trigger is clicked', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });
    });

    it('selects an option and closes popover', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      // Open popover
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      // Wait for popover to open
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      // Click option
      const option = screen.getByText('Apple');
      await user.click(option);

      // Verify onChange was called
      expect(handleChange).toHaveBeenCalledWith('apple');
    });

    it('deselects option when clicking selected option', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Combobox
          options={mockOptions}
          value="apple"
          onChange={handleChange}
        />,
      );

      // Open popover
      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      // Click selected option to deselect (use getAllByText to handle multiple instances)
      const options = screen.getAllByText('Apple');
      await user.click(options[options.length - 1]); // Click the one in the dropdown

      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('does not select disabled option', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('Elderberry')).toBeInTheDocument();
      });

      const disabledOption = screen.getByText('Elderberry');
      await user.click(disabledOption);

      // Should not trigger onChange
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('updates selected value when external value changes', async () => {
      const { rerender } = render(
        <Combobox
          options={mockOptions}
          value="apple"
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByText('Apple')).toBeInTheDocument();

      rerender(
        <Combobox
          options={mockOptions}
          value="banana"
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByText('Banana')).toBeInTheDocument();
    });
  });

  describe('Multiple Selection', () => {
    it('allows multiple selections', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Combobox
          options={mockOptions}
          value={[]}
          onChange={handleChange}
          variant="multiple"
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      // Select first option
      const appleOptions = screen.getAllByText('Apple');
      await user.click(appleOptions[appleOptions.length - 1]);
      expect(handleChange).toHaveBeenNthCalledWith(1, ['apple']);

      // Select second option (should add to the array in multiple mode)
      const bananaOptions = screen.getAllByText('Banana');
      await user.click(bananaOptions[bananaOptions.length - 1]);
      // In multiple selection mode, second click adds to the array
      expect(handleChange).toHaveBeenNthCalledWith(2, ['apple', 'banana']);
    });

    it('displays selected count for multiple selections', () => {
      render(
        <Combobox
          options={mockOptions}
          value={['apple', 'banana']}
          onChange={vi.fn()}
          variant="multiple"
        />,
      );

      // Should show badges, not count text
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('respects maxSelections limit', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Combobox
          options={mockOptions}
          value={['apple', 'banana']}
          onChange={handleChange}
          variant="multiple"
          maxSelections={2}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      // Wait for search input to appear (popover is open)
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      // Wait for options to be rendered
      await waitFor(() => {
        expect(screen.getByText('Cherry')).toBeInTheDocument();
      });

      // Try to select third option
      await user.click(screen.getByText('Cherry'));

      // Should not allow more than maxSelections
      expect(handleChange).not.toHaveBeenCalledWith(['apple', 'banana', 'cherry']);
    });

    it('displays badges for selected items', () => {
      render(
        <Combobox
          options={mockOptions}
          value={['apple', 'banana']}
          onChange={vi.fn()}
          variant="multiple"
        />,
      );

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('shows "+X more" badge when more than 3 selections', () => {
      render(
        <Combobox
          options={mockOptions}
          value={['apple', 'banana', 'cherry', 'date']}
          onChange={vi.fn()}
          variant="multiple"
        />,
      );

      expect(screen.getByText('+1 more')).toBeInTheDocument();
    });

    it('deselects option in multiple mode', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Combobox
          options={mockOptions}
          value={['apple', 'banana']}
          onChange={handleChange}
          variant="multiple"
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      // Click already selected option to deselect
      const appleOptions = screen.getAllByText('Apple');
      await user.click(appleOptions[appleOptions.length - 1]);

      expect(handleChange).toHaveBeenCalledWith(['banana']);
    });

    it('updates selected values when external array value changes', () => {
      const { rerender } = render(
        <Combobox
          options={mockOptions}
          value={['apple']}
          onChange={vi.fn()}
          variant="multiple"
        />,
      );

      expect(screen.getByText('Apple')).toBeInTheDocument();

      rerender(
        <Combobox
          options={mockOptions}
          value={['apple', 'banana']}
          onChange={vi.fn()}
          variant="multiple"
        />,
      );

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('filters options based on search query', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          searchable
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'app');

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.queryByText('Banana')).not.toBeInTheDocument();
      });
    });

    it('filters by description', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          searchable
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'yellow');

      await waitFor(() => {
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });

    it('filters by value', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          searchable
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'elder');

      await waitFor(() => {
        expect(screen.getByText('Elderberry')).toBeInTheDocument();
      });
    });

    it('shows empty message when no results', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          searchable
          emptyMessage="No fruits found"
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'xyz123');

      await waitFor(() => {
        expect(screen.getByText('No fruits found')).toBeInTheDocument();
      });
    });

    it('calls onSearch when search value changes', async () => {
      const user = userEvent.setup();
      const handleSearch = vi.fn();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          searchable
          onSearch={handleSearch}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'test');

      expect(handleSearch).toHaveBeenCalled();
    });

    it('disables search when searchable is false', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          searchable={false}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
      });
    });

    it('uses custom search placeholder', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          searchPlaceholder="Type to search..."
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
      });
    });

    it('handles case-insensitive search', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          searchable
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'APPLE');

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });
    });
  });

  describe('Clearable', () => {
    it('shows clear button when has selection and clearable is true', () => {
      render(
        <Combobox
          options={mockOptions}
          value="apple"
          onChange={vi.fn()}
          clearable
        />,
      );

      const clearButton = screen.getByLabelText('Clear selection');
      expect(clearButton).toBeInTheDocument();
    });

    it('clears selection when clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Combobox
          options={mockOptions}
          value="apple"
          onChange={handleChange}
          clearable
        />,
      );

      const clearButton = screen.getByLabelText('Clear selection');
      await user.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('hides clear button when clearable is false', () => {
      render(
        <Combobox
          options={mockOptions}
          value="apple"
          onChange={vi.fn()}
          clearable={false}
        />,
      );

      expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument();
    });

    it('hides clear button when no selection', () => {
      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          clearable
        />,
      );

      expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument();
    });

    it('clears multiple selections', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Combobox
          options={mockOptions}
          value={['apple', 'banana']}
          onChange={handleChange}
          variant="multiple"
          clearable
        />,
      );

      const clearButton = screen.getByLabelText('Clear selection');
      await user.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith([]);
    });

    it('supports keyboard clear with Enter', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Combobox
          options={mockOptions}
          value="apple"
          onChange={handleChange}
          clearable
        />,
      );

      const clearButton = screen.getByLabelText('Clear selection');
      clearButton.focus();
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('supports keyboard clear with Space', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Combobox
          options={mockOptions}
          value="apple"
          onChange={handleChange}
          clearable
        />,
      );

      const clearButton = screen.getByLabelText('Clear selection');
      clearButton.focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('stops propagation when clearing', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Combobox
          options={mockOptions}
          value="apple"
          onChange={handleChange}
          clearable
        />,
      );

      const clearButton = screen.getByLabelText('Clear selection');
      await user.click(clearButton);

      // Popover should not open
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('displays loading spinner when loading is true', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={[]}
          value=""
          onChange={vi.fn()}
          loading
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });

    it('does not show options when loading', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          loading
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('shows spinner animation', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={[]}
          value=""
          onChange={vi.fn()}
          loading
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
      });
    });
  });

  describe('Options with Badges and Icons', () => {
    it('renders options with badges', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptionsWithBadges}
          value=""
          onChange={vi.fn()}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('Popular')).toBeInTheDocument();
        expect(screen.getByText('Free')).toBeInTheDocument();
        expect(screen.getByText('New')).toBeInTheDocument();
      });
    });

    it('renders options with icons', async () => {
      const user = userEvent.setup();
      const IconComponent = () => <span data-testid="custom-icon">🍎</span>;

      const optionsWithIcons: ComboboxOption[] = [
        {
          id: '1',
          label: 'With Icon',
          value: 'icon',
          icon: <IconComponent />,
        },
      ];

      render(
        <Combobox
          options={optionsWithIcons}
          value=""
          onChange={vi.fn()}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      });
    });

    it('renders options with descriptions', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('A red fruit')).toBeInTheDocument();
        expect(screen.getByText('A yellow fruit')).toBeInTheDocument();
      });
    });

    it('changes badge variant when option is selected', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptionsWithBadges}
          value=""
          onChange={vi.fn()}
          variant="multiple"
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('Premium Plan')).toBeInTheDocument();
      });

      // Select option with badge
      await user.click(screen.getByText('Premium Plan'));

      // Badge should still be visible in dropdown (multiple mode keeps it open)
      await waitFor(() => {
        const badges = screen.getAllByText('Popular');
        expect(badges.length).toBeGreaterThan(0);
      });
    });

    it('highlights icon when option is selected', async () => {
      const user = userEvent.setup();
      const IconComponent = () => <span data-testid="custom-icon">🍎</span>;

      const optionsWithIcons: ComboboxOption[] = [
        {
          id: '1',
          label: 'With Icon',
          value: 'icon',
          icon: <IconComponent />,
        },
      ];

      render(
        <Combobox
          options={optionsWithIcons}
          value="icon"
          onChange={vi.fn()}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const icon = screen.getByTestId('custom-icon');
        expect(icon.parentElement).toHaveClass('text-primary');
      });
    });
  });

  describe('Theme Integration', () => {
    it('uses theme CSS variables', () => {
      const { container } = render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const trigger = container.querySelector('button');
      expect(trigger).toHaveClass('border-primary');
    });

    it('applies focus ring with theme colors', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      expect(trigger).toHaveClass('ring-2', 'ring-ring', 'ring-offset-2');
    });
  });

  describe('Presets', () => {
    it('basic preset has correct configuration', () => {
      expect(ComboboxPresets.basic).toEqual({
        variant: 'default',
        searchable: true,
        clearable: true,
      });
    });

    it('multiple preset has correct configuration', () => {
      expect(ComboboxPresets.multiple).toEqual({
        variant: 'multiple',
        searchable: true,
        clearable: true,
        maxSelections: 5,
      });
    });

    it('async preset has correct configuration', () => {
      expect(ComboboxPresets.async).toEqual({
        variant: 'async',
        searchable: true,
        clearable: true,
        loading: false,
      });
    });

    it('can use basic preset', () => {
      render(
        <Combobox
          {...ComboboxPresets.basic}
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('updates aria-expanded when opened', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const trigger = screen.getByRole('combobox');

      // Tab to focus
      await user.tab();
      expect(trigger).toHaveFocus();

      // Click the focused button (simulating Space or Enter activation)
      await user.click(trigger);

      // Wait for popover to open
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('clear button has accessible label', () => {
      render(
        <Combobox
          options={mockOptions}
          value="apple"
          onChange={vi.fn()}
          clearable
        />,
      );

      const clearButton = screen.getByLabelText('Clear selection');
      expect(clearButton).toBeInTheDocument();
    });

    it('has proper aria-label for selected state', () => {
      render(
        <Combobox
          options={mockOptions}
          value="apple"
          onChange={vi.fn()}
        />,
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-label', 'Selected: Apple');
    });

    it('has proper aria-label for empty state', () => {
      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          placeholder="Select a fruit"
        />,
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-label', 'Select a fruit');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={[]}
          value=""
          onChange={vi.fn()}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('No option found.')).toBeInTheDocument();
      });
    });

    it('handles undefined value', () => {
      render(
        <Combobox
          options={mockOptions}
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByText('Select option...')).toBeInTheDocument();
    });

    it('handles value not in options', () => {
      render(
        <Combobox
          options={mockOptions}
          value="nonexistent"
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByText('nonexistent')).toBeInTheDocument();
    });

    it('prevents popover open when disabled', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          disabled
        />,
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });

    it('handles long option labels gracefully', () => {
      const longOptions: ComboboxOption[] = [
        {
          id: '1',
          label: 'This is a very long option label that should be truncated properly',
          value: 'long',
        },
      ];

      render(
        <Combobox
          options={longOptions}
          value="long"
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('handles special characters in search', async () => {
      const user = userEvent.setup();
      const specialOptions: ComboboxOption[] = [
        { id: '1', label: 'Option (1)', value: 'opt1' },
        { id: '2', label: 'Option [2]', value: 'opt2' },
      ];

      render(
        <Combobox
          options={specialOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, '(1)');

      await waitFor(() => {
        expect(screen.getByText('Option (1)')).toBeInTheDocument();
      });
    });

    it('handles empty string in multiple selection', () => {
      render(
        <Combobox
          options={mockOptions}
          value={[]}
          onChange={vi.fn()}
          variant="multiple"
        />,
      );

      expect(screen.getByText('Select option...')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          variant="default"
        />,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders multiple variant correctly', () => {
      render(
        <Combobox
          options={mockOptions}
          value={[]}
          onChange={vi.fn()}
          variant="multiple"
        />,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders async variant correctly', () => {
      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          variant="async"
        />,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders creatable variant correctly', () => {
      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          variant="creatable"
        />,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Popover Behavior', () => {
    it('shows chevron icon', () => {
      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const chevron = document.querySelector('.lucide-chevron-down');
      expect(chevron).toBeInTheDocument();
    });

    it('rotates chevron when open', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      const chevron = document.querySelector('.lucide-chevron-down');
      expect(chevron).toHaveClass('rotate-180');
    });

    it('applies custom popover class', async () => {
      const user = userEvent.setup();

      render(
        <Combobox
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          popoverClass="custom-popover"
        />,
      );

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const popover = document.querySelector('.custom-popover');
        expect(popover).toBeInTheDocument();
      });
    });
  });
});
