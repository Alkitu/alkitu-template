import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ServiceFilterButtons } from './ServiceFilterButtons';
import type {
  ServiceFilterButtonsProps,
  ServiceFilterOption,
  ServiceFilterType,
} from './ServiceFilterButtons.types';

expect.extend(toHaveNoViolations);

describe('ServiceFilterButtons Component', () => {
  const defaultProps: ServiceFilterButtonsProps = {
    activeFilter: 'all',
    onFilterChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // Rendering Tests
  // ========================================================================
  describe('Rendering', () => {
    it('renders the select trigger', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toBeInTheDocument();
    });

    it('renders as a combobox element', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const combobox = screen.getByRole('combobox');
      expect(combobox).toBeInTheDocument();
    });

    it('renders the trigger as a button element', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger.tagName).toBe('BUTTON');
    });

    it('has displayName set', () => {
      expect(ServiceFilterButtons.displayName).toBe('ServiceFilterButtons');
    });

    it('renders with default w-[200px] class on the trigger', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveClass('w-[200px]');
    });
  });

  // ========================================================================
  // Default Labels Tests
  // ========================================================================
  describe('Default Labels', () => {
    it('displays "Todas" when activeFilter is "all"', () => {
      render(<ServiceFilterButtons {...defaultProps} activeFilter="all" />);

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveTextContent('Todas');
    });

    it('displays "Activos" when activeFilter is "active"', () => {
      render(<ServiceFilterButtons {...defaultProps} activeFilter="active" />);

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveTextContent('Activos');
    });

    it('displays "Inactivos" when activeFilter is "inactive"', () => {
      render(
        <ServiceFilterButtons {...defaultProps} activeFilter="inactive" />
      );

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveTextContent('Inactivos');
    });
  });

  // ========================================================================
  // Custom Labels Tests
  // ========================================================================
  describe('Custom Labels', () => {
    it('uses custom labels when labels prop is provided', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          activeFilter="all"
          labels={{ all: 'All Services', active: 'Active Only', inactive: 'Inactive Only' }}
        />
      );

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveTextContent('All Services');
    });

    it('uses partial custom labels merged with defaults', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          activeFilter="active"
          labels={{ active: 'Custom Active' }}
        />
      );

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveTextContent('Custom Active');
    });

    it('keeps default labels for keys not overridden', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          activeFilter="all"
          labels={{ active: 'Custom Active' }}
        />
      );

      const trigger = screen.getByTestId('service-filter-select');
      // "all" was not overridden, so it should use the default "Todas"
      expect(trigger).toHaveTextContent('Todas');
    });
  });

  // ========================================================================
  // Custom Filter Options Tests
  // ========================================================================
  describe('Custom Filter Options', () => {
    const customFilterOptions: ServiceFilterOption[] = [
      { id: 'all', label: 'All Services' },
      { id: 'active', label: 'Active Only' },
      { id: 'inactive', label: 'Inactive Only' },
    ];

    it('renders custom filter option label in trigger when selected', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          activeFilter="all"
          filterOptions={customFilterOptions}
        />
      );

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveTextContent('All Services');
    });

    it('renders "Active Only" when filterOptions are custom and active is selected', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          activeFilter="active"
          filterOptions={customFilterOptions}
        />
      );

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveTextContent('Active Only');
    });
  });

  // ========================================================================
  // Active Filter Display Tests
  // ========================================================================
  describe('Active Filter Display', () => {
    const filterTypes: ServiceFilterType[] = ['all', 'active', 'inactive'];
    const defaultFilterLabels: Record<ServiceFilterType, string> = {
      all: 'Todas',
      active: 'Activos',
      inactive: 'Inactivos',
    };

    it('shows the correct label for each filter type', () => {
      filterTypes.forEach((filter) => {
        const { unmount } = render(
          <ServiceFilterButtons {...defaultProps} activeFilter={filter} />
        );

        const trigger = screen.getByTestId('service-filter-select');
        expect(trigger).toHaveTextContent(defaultFilterLabels[filter]);
        unmount();
      });
    });

    it('updates displayed value when activeFilter prop changes', () => {
      const { rerender } = render(
        <ServiceFilterButtons {...defaultProps} activeFilter="all" />
      );

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveTextContent('Todas');

      rerender(
        <ServiceFilterButtons {...defaultProps} activeFilter="active" />
      );
      expect(trigger).toHaveTextContent('Activos');

      rerender(
        <ServiceFilterButtons {...defaultProps} activeFilter="inactive" />
      );
      expect(trigger).toHaveTextContent('Inactivos');
    });
  });

  // ========================================================================
  // Disabled State Tests
  // ========================================================================
  describe('Disabled State', () => {
    it('disables the select trigger when disabled is true', () => {
      render(<ServiceFilterButtons {...defaultProps} disabled />);

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toBeDisabled();
    });

    it('is not disabled by default', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).not.toBeDisabled();
    });

    it('is not disabled when disabled is explicitly false', () => {
      render(<ServiceFilterButtons {...defaultProps} disabled={false} />);

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).not.toBeDisabled();
    });
  });

  // ========================================================================
  // ARIA and Accessibility Tests
  // ========================================================================
  describe('Accessibility', () => {
    it('has the default aria-label "Service filters"', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveAttribute('aria-label', 'Service filters');
    });

    it('applies custom aria-label', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          aria-label="Custom filter group"
        />
      );

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveAttribute('aria-label', 'Custom filter group');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(
        <ServiceFilterButtons {...defaultProps} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when disabled', async () => {
      const { container } = render(
        <ServiceFilterButtons {...defaultProps} disabled />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with different active states', async () => {
      const filters: ServiceFilterType[] = ['all', 'active', 'inactive'];

      for (const filter of filters) {
        const { container, unmount } = render(
          <ServiceFilterButtons {...defaultProps} activeFilter={filter} />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
        unmount();
      }
    });

    it('trigger is focusable', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('service-filter-select');
      trigger.focus();
      expect(trigger).toHaveFocus();
    });

    it('trigger has accessible text content', () => {
      render(<ServiceFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger.textContent).toBeTruthy();
      expect(trigger.textContent!.length).toBeGreaterThan(0);
    });
  });

  // ========================================================================
  // className Prop Tests
  // ========================================================================
  describe('className Prop', () => {
    it('applies custom className to the trigger', () => {
      render(
        <ServiceFilterButtons {...defaultProps} className="custom-class" />
      );

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveClass('custom-class');
    });

    it('preserves default w-[200px] class with custom className', () => {
      render(
        <ServiceFilterButtons {...defaultProps} className="extra-class" />
      );

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveClass('w-[200px]');
      expect(trigger).toHaveClass('extra-class');
    });

    it('handles undefined className gracefully', () => {
      render(
        <ServiceFilterButtons {...defaultProps} className={undefined} />
      );

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveClass('w-[200px]');
    });
  });

  // ========================================================================
  // Integration Tests
  // ========================================================================
  describe('Integration', () => {
    it('changes displayed value when activeFilter prop changes', () => {
      const { rerender } = render(
        <ServiceFilterButtons {...defaultProps} activeFilter="all" />
      );

      expect(screen.getByTestId('service-filter-select')).toHaveTextContent(
        'Todas'
      );

      rerender(
        <ServiceFilterButtons {...defaultProps} activeFilter="active" />
      );

      expect(screen.getByTestId('service-filter-select')).toHaveTextContent(
        'Activos'
      );
    });

    it('can be rerendered multiple times without issues', () => {
      const filters: ServiceFilterType[] = ['all', 'active', 'inactive'];
      const { rerender } = render(
        <ServiceFilterButtons {...defaultProps} activeFilter="all" />
      );

      for (let i = 0; i < 10; i++) {
        const filter = filters[i % filters.length];
        rerender(
          <ServiceFilterButtons {...defaultProps} activeFilter={filter} />
        );
        expect(
          screen.getByTestId('service-filter-select')
        ).toBeInTheDocument();
      }
    });

    it('handles onFilterChange function replacement', () => {
      const firstHandler = vi.fn();
      const secondHandler = vi.fn();

      const { rerender } = render(
        <ServiceFilterButtons
          activeFilter="all"
          onFilterChange={firstHandler}
        />
      );

      rerender(
        <ServiceFilterButtons
          activeFilter="all"
          onFilterChange={secondHandler}
        />
      );

      expect(screen.getByTestId('service-filter-select')).toBeInTheDocument();
    });

    it('handles non-existent activeFilter value gracefully', () => {
      render(
        <ServiceFilterButtons
          {...defaultProps}
          activeFilter={'nonexistent' as ServiceFilterType}
        />
      );

      // Should still render the trigger without crashing
      expect(screen.getByTestId('service-filter-select')).toBeInTheDocument();
    });
  });

  // ========================================================================
  // Edge Cases
  // ========================================================================
  describe('Edge Cases', () => {
    it('handles long filter labels in custom options', () => {
      const longLabelOptions: ServiceFilterOption[] = [
        {
          id: 'all',
          label:
            'This is a very long filter label that should still render correctly',
        },
        { id: 'active', label: 'Active Services' },
        { id: 'inactive', label: 'Inactive Services' },
      ];

      render(
        <ServiceFilterButtons
          {...defaultProps}
          activeFilter="all"
          filterOptions={longLabelOptions}
        />
      );

      const trigger = screen.getByTestId('service-filter-select');
      expect(trigger).toHaveTextContent(
        'This is a very long filter label that should still render correctly'
      );
    });

    it('accepts all valid ServiceFilterType values', () => {
      const filters: ServiceFilterType[] = ['all', 'active', 'inactive'];

      filters.forEach((filter) => {
        const { unmount } = render(
          <ServiceFilterButtons
            activeFilter={filter}
            onFilterChange={vi.fn()}
          />
        );
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        unmount();
      });
    });
  });
});
