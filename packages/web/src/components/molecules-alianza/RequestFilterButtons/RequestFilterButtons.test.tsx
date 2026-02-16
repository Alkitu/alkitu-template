import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RequestFilterButtons } from './RequestFilterButtons';
import type { RequestFilterType } from './RequestFilterButtons.types';

expect.extend(toHaveNoViolations);

describe('RequestFilterButtons Molecule', () => {
  // ========================================================================
  // Test Data & Setup
  // ========================================================================
  const mockOnFilterChange = vi.fn();

  const defaultProps = {
    activeFilter: 'all' as RequestFilterType,
    onFilterChange: mockOnFilterChange,
  };

  const filterTypes: RequestFilterType[] = [
    'all',
    'pending',
    'ongoing',
    'completed',
    'cancelled',
  ];

  const filterLabels: Record<RequestFilterType, string> = {
    all: 'Todas',
    pending: 'Pendientes',
    ongoing: 'En Progreso',
    completed: 'Completadas',
    cancelled: 'Canceladas',
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // Basic Rendering Tests
  // ========================================================================
  describe('Rendering', () => {
    it('renders the select trigger', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toBeInTheDocument();
    });

    it('renders as a combobox element', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const combobox = screen.getByRole('combobox');
      expect(combobox).toBeInTheDocument();
    });

    it('displays the active filter label in the trigger', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toHaveTextContent('Todas');
    });

    it('displays "Pendientes" when activeFilter is "pending"', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="pending" />);

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toHaveTextContent('Pendientes');
    });

    it('displays "En Progreso" when activeFilter is "ongoing"', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="ongoing" />);

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toHaveTextContent('En Progreso');
    });

    it('displays "Completadas" when activeFilter is "completed"', () => {
      render(
        <RequestFilterButtons {...defaultProps} activeFilter="completed" />
      );

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toHaveTextContent('Completadas');
    });

    it('displays "Canceladas" when activeFilter is "cancelled"', () => {
      render(
        <RequestFilterButtons {...defaultProps} activeFilter="cancelled" />
      );

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toHaveTextContent('Canceladas');
    });

    it('renders with custom className on the trigger', () => {
      render(
        <RequestFilterButtons {...defaultProps} className="custom-class" />
      );

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toHaveClass('custom-class');
    });

    it('renders with default w-[200px] class on the trigger', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toHaveClass('w-[200px]');
    });

    it('renders the trigger as a button element', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger.tagName).toBe('BUTTON');
    });
  });

  // ========================================================================
  // Active Filter Display Tests
  // ========================================================================
  describe('Active Filter Display', () => {
    it('shows the correct label for each filter type', () => {
      filterTypes.forEach((filter) => {
        const { unmount } = render(
          <RequestFilterButtons {...defaultProps} activeFilter={filter} />
        );

        const trigger = screen.getByTestId('request-filter-select');
        expect(trigger).toHaveTextContent(filterLabels[filter]);
        unmount();
      });
    });

    it('updates displayed value when activeFilter prop changes', () => {
      const { rerender } = render(
        <RequestFilterButtons {...defaultProps} activeFilter="all" />
      );

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toHaveTextContent('Todas');

      rerender(
        <RequestFilterButtons {...defaultProps} activeFilter="pending" />
      );
      expect(trigger).toHaveTextContent('Pendientes');
    });

    it('updates displayed value through multiple prop changes', () => {
      const { rerender } = render(
        <RequestFilterButtons {...defaultProps} activeFilter="all" />
      );

      const trigger = screen.getByTestId('request-filter-select');

      filterTypes.forEach((filter) => {
        rerender(
          <RequestFilterButtons {...defaultProps} activeFilter={filter} />
        );
        expect(trigger).toHaveTextContent(filterLabels[filter]);
      });
    });
  });

  // ========================================================================
  // className Tests
  // ========================================================================
  describe('className Prop', () => {
    it('applies custom className to the trigger element', () => {
      render(
        <RequestFilterButtons
          {...defaultProps}
          className="justify-center max-w-screen-lg"
        />
      );

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toHaveClass('justify-center');
      expect(trigger).toHaveClass('max-w-screen-lg');
    });

    it('handles undefined className gracefully', () => {
      const propsWithoutClassName = {
        activeFilter: 'all' as RequestFilterType,
        onFilterChange: mockOnFilterChange,
        className: undefined,
      };

      render(<RequestFilterButtons {...propsWithoutClassName} />);

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveClass('w-[200px]');
    });

    it('handles empty string className', () => {
      render(<RequestFilterButtons {...defaultProps} className="" />);

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toBeInTheDocument();
    });

    it('handles long className strings', () => {
      const longClassName =
        'custom-1 custom-2 custom-3 custom-4 custom-5 custom-6 custom-7 custom-8';
      render(
        <RequestFilterButtons {...defaultProps} className={longClassName} />
      );

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toHaveClass('custom-1');
      expect(trigger).toHaveClass('custom-8');
    });
  });

  // ========================================================================
  // Integration and Rerender Tests
  // ========================================================================
  describe('Component Integration', () => {
    it('works as a controlled component with rerendering', () => {
      const { rerender } = render(
        <RequestFilterButtons {...defaultProps} activeFilter="all" />
      );

      expect(screen.getByTestId('request-filter-select')).toHaveTextContent(
        'Todas'
      );

      rerender(
        <RequestFilterButtons {...defaultProps} activeFilter="pending" />
      );

      expect(screen.getByTestId('request-filter-select')).toHaveTextContent(
        'Pendientes'
      );
    });

    it('can be rerendered multiple times without issues', () => {
      const { rerender } = render(
        <RequestFilterButtons {...defaultProps} activeFilter="all" />
      );

      for (let i = 0; i < 10; i++) {
        const filter = filterTypes[i % filterTypes.length];
        rerender(
          <RequestFilterButtons {...defaultProps} activeFilter={filter} />
        );
        expect(screen.getByTestId('request-filter-select')).toBeInTheDocument();
      }
    });

    it('handles onFilterChange function changes', () => {
      const firstHandler = vi.fn();
      const secondHandler = vi.fn();

      const { rerender } = render(
        <RequestFilterButtons
          activeFilter="all"
          onFilterChange={firstHandler}
        />
      );

      rerender(
        <RequestFilterButtons
          activeFilter="all"
          onFilterChange={secondHandler}
        />
      );

      // Component should accept the new handler without breaking
      expect(screen.getByTestId('request-filter-select')).toBeInTheDocument();
    });

    it('maintains component stability with rapid filter changes', () => {
      const { rerender } = render(
        <RequestFilterButtons {...defaultProps} activeFilter="all" />
      );

      filterTypes.forEach((filter) => {
        rerender(
          <RequestFilterButtons {...defaultProps} activeFilter={filter} />
        );
        expect(screen.getByTestId('request-filter-select')).toBeInTheDocument();
      });
    });
  });

  // ========================================================================
  // Type Safety Tests
  // ========================================================================
  describe('Type Safety', () => {
    it('accepts all valid RequestFilterType values', () => {
      filterTypes.forEach((filter) => {
        const { unmount } = render(
          <RequestFilterButtons
            activeFilter={filter}
            onFilterChange={mockOnFilterChange}
          />
        );
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        unmount();
      });
    });
  });

  // ========================================================================
  // Accessibility Tests
  // ========================================================================
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <RequestFilterButtons {...defaultProps} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with different active states', async () => {
      for (const filter of filterTypes) {
        const { container, unmount } = render(
          <RequestFilterButtons {...defaultProps} activeFilter={filter} />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
        unmount();
      }
    });

    it('has the aria-label "Request status filters"', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger).toHaveAttribute('aria-label', 'Request status filters');
    });

    it('trigger is focusable', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('request-filter-select');
      trigger.focus();
      expect(trigger).toHaveFocus();
    });

    it('trigger has accessible text content', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('request-filter-select');
      expect(trigger.textContent).toBeTruthy();
      expect(trigger.textContent!.length).toBeGreaterThan(0);
    });
  });
});
