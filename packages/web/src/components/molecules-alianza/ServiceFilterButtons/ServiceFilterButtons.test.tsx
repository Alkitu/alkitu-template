import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ServiceFilterButtons } from './ServiceFilterButtons';
import type { ServiceFilterButtonsProps, ServiceFilterOption } from './ServiceFilterButtons.types';
import type { ServiceFilterType } from './ServiceFilterButtons.types';

expect.extend(toHaveNoViolations);

describe('ServiceFilterButtons Component', () => {
  const defaultProps: ServiceFilterButtonsProps = {
    activeFilter: 'all',
    onFilterChange: vi.fn(),
  };

  const customFilterOptions: ServiceFilterOption[] = [
    { id: 'all', label: 'All Services' },
    { id: 'active', label: 'Active Only' },
    { id: 'inactive', label: 'Inactive Only' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      expect(screen.getByText('Todas')).toBeInTheDocument();
      expect(screen.getByText('Activos')).toBeInTheDocument();
      expect(screen.getByText('Inactivos')).toBeInTheDocument();
    });

    it('renders with custom filter options', () => {
      render(<ServiceFilterButtons {...defaultProps} filterOptions={customFilterOptions} />);

      expect(screen.getByText('All Services')).toBeInTheDocument();
      expect(screen.getByText('Active Only')).toBeInTheDocument();
      expect(screen.getByText('Inactive Only')).toBeInTheDocument();
    });

    it('renders all filter buttons', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('renders with correct testid', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      expect(screen.getByTestId('service-filter-buttons')).toBeInTheDocument();
    });

    it('applies custom className to wrapper', () => {
      render(<ServiceFilterButtons {...defaultProps} className="custom-class" />);

      const wrapper = screen.getByTestId('service-filter-buttons');
      expect(wrapper).toHaveClass('custom-class');
    });

    it('renders with role group', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const wrapper = screen.getByRole('group');
      expect(wrapper).toBeInTheDocument();
    });

    it('applies default aria-label', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const wrapper = screen.getByRole('group');
      expect(wrapper).toHaveAttribute('aria-label', 'Service filters');
    });

    it('applies custom aria-label', () => {
      render(<ServiceFilterButtons {...defaultProps} aria-label="Custom filter group" />);

      const wrapper = screen.getByRole('group');
      expect(wrapper).toHaveAttribute('aria-label', 'Custom filter group');
    });
  });

  describe('Active State Styling', () => {
    it('highlights the active filter', () => {
      render(<ServiceFilterButtons {...defaultProps} activeFilter="active" />);

      const activeButton = screen.getByTestId('filter-button-active');
      expect(activeButton).toHaveClass('border-primary', 'bg-primary', 'text-primary-foreground');
    });

    it('applies inactive styling to non-active filters', () => {
      render(<ServiceFilterButtons {...defaultProps} activeFilter="active" />);

      const inactiveButton = screen.getByTestId('filter-button-all');
      expect(inactiveButton).toHaveClass('border-input', 'bg-background', 'text-muted-foreground');
    });

    it('sets aria-pressed attribute correctly', () => {
      render(<ServiceFilterButtons {...defaultProps} activeFilter="inactive" />);

      const activeButton = screen.getByTestId('filter-button-inactive');
      const inactiveButton = screen.getByTestId('filter-button-all');

      expect(activeButton).toHaveAttribute('aria-pressed', 'true');
      expect(inactiveButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('uses active variant for active filter', () => {
      render(<ServiceFilterButtons {...defaultProps} activeFilter="all" />);

      const activeButton = screen.getByTestId('filter-button-all');
      expect(activeButton).toBeInTheDocument();
    });

    it('uses outline variant for inactive filters', () => {
      render(<ServiceFilterButtons {...defaultProps} activeFilter="all" />);

      const inactiveButton = screen.getByTestId('filter-button-active');
      expect(inactiveButton).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('calls onFilterChange when filter is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ServiceFilterButtons {...defaultProps} onFilterChange={handleChange} />);

      const activeButton = screen.getByTestId('filter-button-active');
      await user.click(activeButton);

      expect(handleChange).toHaveBeenCalledWith('active');
    });

    it('calls onFilterChange with correct filter id', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ServiceFilterButtons {...defaultProps} onFilterChange={handleChange} />);

      await user.click(screen.getByTestId('filter-button-inactive'));

      expect(handleChange).toHaveBeenCalledWith('inactive');
    });

    it('allows clicking the same filter multiple times', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ServiceFilterButtons {...defaultProps} onFilterChange={handleChange} />);

      const button = screen.getByTestId('filter-button-all');
      await user.click(button);
      await user.click(button);

      expect(handleChange).toHaveBeenCalledTimes(2);
    });

    it('handles rapid clicks on different filters', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ServiceFilterButtons {...defaultProps} onFilterChange={handleChange} />);

      await user.click(screen.getByTestId('filter-button-all'));
      await user.click(screen.getByTestId('filter-button-active'));
      await user.click(screen.getByTestId('filter-button-inactive'));

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenNthCalledWith(1, 'all');
      expect(handleChange).toHaveBeenNthCalledWith(2, 'active');
      expect(handleChange).toHaveBeenNthCalledWith(3, 'inactive');
    });
  });

  describe('Count Badges', () => {
    it('does not show counts by default', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      expect(screen.queryByTestId('filter-count-all')).not.toBeInTheDocument();
    });

    it('shows counts when showCounts is true and counts are provided', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          showCounts
          counts={{ all: 10, active: 5, inactive: 5 }}
        />,
      );

      expect(screen.getByTestId('filter-count-all')).toHaveTextContent('10');
      expect(screen.getByTestId('filter-count-active')).toHaveTextContent('5');
      expect(screen.getByTestId('filter-count-inactive')).toHaveTextContent('5');
    });

    it('does not show counts when showCounts is false', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          showCounts={false}
          counts={{ all: 10, active: 5, inactive: 5 }}
        />,
      );

      expect(screen.queryByTestId('filter-count-all')).not.toBeInTheDocument();
    });

    it('does not show counts when counts object is not provided', () => {
      render(<ServiceFilterButtons {...defaultProps} showCounts />);

      expect(screen.queryByTestId('filter-count-all')).not.toBeInTheDocument();
    });

    it('shows zero count correctly', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          showCounts
          counts={{ all: 0, active: 0, inactive: 0 }}
        />,
      );

      expect(screen.getByTestId('filter-count-all')).toHaveTextContent('0');
    });

    it('shows large count numbers', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          showCounts
          counts={{ all: 999, active: 100, inactive: 50 }}
        />,
      );

      expect(screen.getByTestId('filter-count-all')).toHaveTextContent('999');
    });

    it('applies different styling to count badge on active filter', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          activeFilter="active"
          showCounts
          counts={{ all: 10, active: 5, inactive: 5 }}
        />,
      );

      const activeCountBadge = screen.getByTestId('filter-count-active');
      expect(activeCountBadge).toHaveClass('bg-primary-foreground/20', 'text-primary-foreground');
    });

    it('applies different styling to count badge on inactive filter', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          activeFilter="active"
          showCounts
          counts={{ all: 10, active: 5, inactive: 5 }}
        />,
      );

      const inactiveCountBadge = screen.getByTestId('filter-count-all');
      expect(inactiveCountBadge).toHaveClass('bg-muted', 'text-muted-foreground');
    });
  });

  describe('Multi-Select Mode', () => {
    it('highlights multiple selected filters', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          multiSelect
          selectedFilters={['active', 'inactive']}
        />,
      );

      const activeButton = screen.getByTestId('filter-button-active');
      const inactiveButton = screen.getByTestId('filter-button-inactive');

      expect(activeButton).toHaveClass('border-primary', 'bg-primary');
      expect(inactiveButton).toHaveClass('border-primary', 'bg-primary');
    });

    it('shows non-selected filters as inactive in multi-select mode', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          multiSelect
          selectedFilters={['active']}
        />,
      );

      const allButton = screen.getByTestId('filter-button-all');
      expect(allButton).toHaveClass('border-input', 'bg-background');
    });

    it('sets aria-pressed correctly in multi-select mode', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          multiSelect
          selectedFilters={['active', 'inactive']}
        />,
      );

      expect(screen.getByTestId('filter-button-active')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('filter-button-inactive')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('filter-button-all')).toHaveAttribute('aria-pressed', 'false');
    });

    it('handles empty selectedFilters array', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          multiSelect
          selectedFilters={[]}
        />,
      );

      expect(screen.getByTestId('filter-button-all')).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Clear All Functionality', () => {
    it('does not show clear all button by default', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      expect(screen.queryByTestId('clear-all-button')).not.toBeInTheDocument();
    });

    it('shows clear all button when showClearAll is true and filter is not "all"', () => {
      render(<ServiceFilterButtons {...defaultProps} activeFilter="active" showClearAll />);

      expect(screen.getByTestId('clear-all-button')).toBeInTheDocument();
    });

    it('does not show clear all button when filter is "all"', () => {
      render(<ServiceFilterButtons {...defaultProps} activeFilter="all" showClearAll />);

      expect(screen.queryByTestId('clear-all-button')).not.toBeInTheDocument();
    });

    it('shows clear all button in multi-select mode when filters are selected', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          multiSelect
          selectedFilters={['active']}
          showClearAll
        />,
      );

      expect(screen.getByTestId('clear-all-button')).toBeInTheDocument();
    });

    it('does not show clear all button in multi-select mode when no filters selected', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          multiSelect
          selectedFilters={[]}
          showClearAll
        />,
      );

      expect(screen.queryByTestId('clear-all-button')).not.toBeInTheDocument();
    });

    it('calls onClearAll when clear all button is clicked', async () => {
      const user = userEvent.setup();
      const handleClearAll = vi.fn();

      render(
        <ServiceFilterButtons
          {...defaultProps}
          activeFilter="active"
          showClearAll
          onClearAll={handleClearAll}
        />,
      );

      await user.click(screen.getByTestId('clear-all-button'));

      expect(handleClearAll).toHaveBeenCalled();
    });

    it('displays correct text on clear all button', () => {
      render(<ServiceFilterButtons {...defaultProps} activeFilter="active" showClearAll />);

      expect(screen.getByTestId('clear-all-button')).toHaveTextContent('Limpiar filtros');
    });
  });

  describe('Disabled Filters', () => {
    it('disables specific filters from disabledFilters array', () => {
      render(<ServiceFilterButtons {...defaultProps} disabledFilters={['active', 'inactive']} />);

      expect(screen.getByTestId('filter-button-active')).toBeDisabled();
      expect(screen.getByTestId('filter-button-inactive')).toBeDisabled();
      expect(screen.getByTestId('filter-button-all')).not.toBeDisabled();
    });

    it('applies disabled styling to disabled filters', () => {
      render(<ServiceFilterButtons {...defaultProps} disabledFilters={['active']} />);

      const disabledButton = screen.getByTestId('filter-button-active');
      expect(disabledButton).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('does not call onFilterChange when disabled filter is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <ServiceFilterButtons
          {...defaultProps}
          onFilterChange={handleChange}
          disabledFilters={['active']}
        />,
      );

      const disabledButton = screen.getByTestId('filter-button-active');
      await user.click(disabledButton);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('disables all filters when disabled prop is true', () => {
      render(<ServiceFilterButtons {...defaultProps} disabled />);

      expect(screen.getByTestId('filter-button-all')).toBeDisabled();
      expect(screen.getByTestId('filter-button-active')).toBeDisabled();
      expect(screen.getByTestId('filter-button-inactive')).toBeDisabled();
    });

    it('does not call onFilterChange when globally disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<ServiceFilterButtons {...defaultProps} onFilterChange={handleChange} disabled />);

      await user.click(screen.getByTestId('filter-button-all'));

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('disables clear all button when disabled', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          activeFilter="active"
          showClearAll
          disabled
        />,
      );

      expect(screen.getByTestId('clear-all-button')).toBeDisabled();
    });
  });

  describe('Variants', () => {
    it('applies default variant styling', () => {
      render(<ServiceFilterButtons {...defaultProps} variant="default" />);

      const button = screen.getByTestId('filter-button-all');
      expect(button).toHaveClass('rounded-[8px]');
    });

    it('applies compact variant styling', () => {
      render(<ServiceFilterButtons {...defaultProps} variant="compact" />);

      const button = screen.getByTestId('filter-button-all');
      expect(button).toHaveClass('rounded-[6px]');
    });

    it('applies pill variant styling', () => {
      render(<ServiceFilterButtons {...defaultProps} variant="pill" />);

      const button = screen.getByTestId('filter-button-all');
      expect(button).toHaveClass('rounded-full');
    });
  });

  describe('Sizes', () => {
    it('applies small size', () => {
      render(<ServiceFilterButtons {...defaultProps} size="sm" />);

      const button = screen.getByTestId('filter-button-all');
      expect(button).toHaveClass('h-[28px]', 'px-4', 'text-xs');
    });

    it('applies medium size (default)', () => {
      render(<ServiceFilterButtons {...defaultProps} size="md" />);

      const button = screen.getByTestId('filter-button-all');
      expect(button).toHaveClass('h-[32px]', 'px-6', 'text-xs');
    });

    it('applies large size', () => {
      render(<ServiceFilterButtons {...defaultProps} size="lg" />);

      const button = screen.getByTestId('filter-button-all');
      expect(button).toHaveClass('h-[36px]', 'px-8', 'text-sm');
    });
  });

  describe('Responsive Behavior', () => {
    it('applies wrap responsive mode by default', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const wrapper = screen.getByTestId('service-filter-buttons');
      expect(wrapper).toHaveClass('flex-wrap');
    });

    it('applies wrap responsive mode explicitly', () => {
      render(<ServiceFilterButtons {...defaultProps} responsive="wrap" />);

      const wrapper = screen.getByTestId('service-filter-buttons');
      expect(wrapper).toHaveClass('flex-wrap');
    });

    it('applies scroll responsive mode', () => {
      render(<ServiceFilterButtons {...defaultProps} responsive="scroll" />);

      const wrapper = screen.getByTestId('service-filter-buttons');
      expect(wrapper).toHaveClass('flex-nowrap', 'overflow-x-auto');
    });
  });

  describe('Custom Filter Options', () => {
    it('renders custom filter labels', () => {
      render(<ServiceFilterButtons {...defaultProps} filterOptions={customFilterOptions} />);

      expect(screen.getByText('All Services')).toBeInTheDocument();
      expect(screen.getByText('Active Only')).toBeInTheDocument();
      expect(screen.getByText('Inactive Only')).toBeInTheDocument();
    });

    it('handles custom filter options with counts', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          filterOptions={customFilterOptions}
          showCounts
          counts={{ all: 15, active: 8, inactive: 7 }}
        />,
      );

      expect(screen.getByTestId('filter-count-all')).toHaveTextContent('15');
      expect(screen.getByTestId('filter-count-active')).toHaveTextContent('8');
    });

    it('renders different number of filter options', () => {
      const twoOptions: ServiceFilterOption[] = [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
      ];

      render(<ServiceFilterButtons {...defaultProps} filterOptions={twoOptions} />);

      expect(screen.getAllByRole('button')).toHaveLength(2);
    });
  });

  describe('Data Attributes', () => {
    it('includes data-filter-id attribute on buttons', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      expect(screen.getByTestId('filter-button-all')).toHaveAttribute('data-filter-id', 'all');
      expect(screen.getByTestId('filter-button-active')).toHaveAttribute('data-filter-id', 'active');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on buttons', () => {
      render(<ServiceFilterButtons {...defaultProps} activeFilter="active" />);

      const activeButton = screen.getByTestId('filter-button-active');
      const inactiveButton = screen.getByTestId('filter-button-all');

      expect(activeButton).toHaveAttribute('aria-pressed', 'true');
      expect(inactiveButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('has role group on container', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const wrapper = screen.getByTestId('service-filter-buttons');
      expect(wrapper).toHaveAttribute('role', 'group');
    });

    it('has aria-label on container', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const wrapper = screen.getByTestId('service-filter-buttons');
      expect(wrapper).toHaveAttribute('aria-label');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<ServiceFilterButtons {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with counts', async () => {
      const { container } = render(
        <ServiceFilterButtons
          {...defaultProps}
          showCounts
          counts={{ all: 10, active: 5, inactive: 5 }}
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations in multi-select mode', async () => {
      const { container } = render(
        <ServiceFilterButtons
          {...defaultProps}
          multiSelect
          selectedFilters={['active', 'inactive']}
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with disabled filters', async () => {
      const { container } = render(
        <ServiceFilterButtons {...defaultProps} disabledFilters={['inactive']} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with clear all button', async () => {
      const { container } = render(
        <ServiceFilterButtons {...defaultProps} activeFilter="active" showClearAll />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty filter options array', () => {
      render(<ServiceFilterButtons {...defaultProps} filterOptions={[]} />);

      const wrapper = screen.getByTestId('service-filter-buttons');
      expect(wrapper).toBeInTheDocument();
      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('handles long filter labels', () => {
      const longLabelOptions: ServiceFilterOption[] = [
        { id: 'all', label: 'This is a very long filter label that should still render correctly' },
        { id: 'active', label: 'Active Services' },
        { id: 'inactive', label: 'Inactive Services' },
      ];

      render(<ServiceFilterButtons {...defaultProps} filterOptions={longLabelOptions} />);

      expect(
        screen.getByText('This is a very long filter label that should still render correctly'),
      ).toBeInTheDocument();
    });

    it('handles very large count numbers', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          showCounts
          counts={{ all: 999999, active: 500000, inactive: 499999 }}
        />,
      );

      expect(screen.getByTestId('filter-count-all')).toHaveTextContent('999999');
    });

    it('handles activeFilter value that does not exist', () => {
      render(<ServiceFilterButtons {...defaultProps} activeFilter={'nonexistent' as ServiceFilterType} />);

      const wrapper = screen.getByTestId('service-filter-buttons');
      expect(wrapper).toBeInTheDocument();
    });

    it('handles selectedFilters with values that do not exist', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          multiSelect
          selectedFilters={['nonexistent' as ServiceFilterType, 'another' as ServiceFilterType]}
        />,
      );

      const wrapper = screen.getByTestId('service-filter-buttons');
      expect(wrapper).toBeInTheDocument();
    });

    it('handles disabledFilters with values that do not exist', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          disabledFilters={['nonexistent' as ServiceFilterType]}
        />,
      );

      expect(screen.getByTestId('filter-button-all')).not.toBeDisabled();
    });

    it('handles missing onClearAll callback', async () => {
      const user = userEvent.setup();

      render(<ServiceFilterButtons {...defaultProps} activeFilter="active" showClearAll />);

      const clearButton = screen.getByTestId('clear-all-button');
      await user.click(clearButton);

      // Should not throw error
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('changes active state when activeFilter prop changes', () => {
      const { rerender } = render(<ServiceFilterButtons {...defaultProps} activeFilter="all" />);

      expect(screen.getByTestId('filter-button-all')).toHaveAttribute('aria-pressed', 'true');

      rerender(<ServiceFilterButtons {...defaultProps} activeFilter="active" />);

      expect(screen.getByTestId('filter-button-all')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByTestId('filter-button-active')).toHaveAttribute('aria-pressed', 'true');
    });

    it('updates counts when counts prop changes', () => {
      const { rerender } = render(
        <ServiceFilterButtons
          {...defaultProps}
          showCounts
          counts={{ all: 10, active: 5, inactive: 5 }}
        />,
      );

      expect(screen.getByTestId('filter-count-all')).toHaveTextContent('10');

      rerender(
        <ServiceFilterButtons
          {...defaultProps}
          showCounts
          counts={{ all: 20, active: 10, inactive: 10 }}
        />,
      );

      expect(screen.getByTestId('filter-count-all')).toHaveTextContent('20');
    });

    it('updates disabled filters when disabledFilters prop changes', () => {
      const { rerender } = render(
        <ServiceFilterButtons {...defaultProps} disabledFilters={['active']} />,
      );

      expect(screen.getByTestId('filter-button-active')).toBeDisabled();

      rerender(<ServiceFilterButtons {...defaultProps} disabledFilters={['inactive']} />);

      expect(screen.getByTestId('filter-button-active')).not.toBeDisabled();
      expect(screen.getByTestId('filter-button-inactive')).toBeDisabled();
    });

    it('combines all features together', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const handleClearAll = vi.fn();

      render(
        <ServiceFilterButtons
          {...defaultProps}
          activeFilter="active"
          onFilterChange={handleChange}
          showCounts
          counts={{ all: 15, active: 8, inactive: 7 }}
          disabledFilters={['inactive']}
          showClearAll
          onClearAll={handleClearAll}
          variant="pill"
          size="lg"
          responsive="scroll"
          className="custom-wrapper"
          aria-label="Test filters"
        />,
      );

      // Check all features are applied
      const wrapper = screen.getByTestId('service-filter-buttons');
      expect(wrapper).toHaveClass('custom-wrapper', 'flex-nowrap', 'overflow-x-auto');
      expect(wrapper).toHaveAttribute('aria-label', 'Test filters');

      // Check counts
      expect(screen.getByTestId('filter-count-active')).toHaveTextContent('8');

      // Check disabled
      expect(screen.getByTestId('filter-button-inactive')).toBeDisabled();

      // Check clear all
      expect(screen.getByTestId('clear-all-button')).toBeInTheDocument();
      await user.click(screen.getByTestId('clear-all-button'));
      expect(handleClearAll).toHaveBeenCalled();

      // Check filter change
      await user.click(screen.getByTestId('filter-button-all'));
      expect(handleChange).toHaveBeenCalledWith('all');
    });
  });
});
