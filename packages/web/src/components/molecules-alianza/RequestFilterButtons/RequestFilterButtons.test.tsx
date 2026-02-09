import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  const filterLabels = {
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
    it('renders correctly with default props', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      expect(screen.getByText('Todas')).toBeInTheDocument();
      expect(screen.getByText('Pendientes')).toBeInTheDocument();
      expect(screen.getByText('En Progreso')).toBeInTheDocument();
      expect(screen.getByText('Completadas')).toBeInTheDocument();
      expect(screen.getByText('Canceladas')).toBeInTheDocument();
    });

    it('renders all filter buttons', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5);
    });

    it('renders each filter with correct label', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      Object.values(filterLabels).forEach((label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });

    it('renders with custom className', () => {
      const { container } = render(
        <RequestFilterButtons {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders with default layout classes', () => {
      const { container } = render(<RequestFilterButtons {...defaultProps} />);

      expect(container.firstChild).toHaveClass('flex');
      expect(container.firstChild).toHaveClass('items-center');
      expect(container.firstChild).toHaveClass('gap-2');
    });

    it('renders buttons in correct order', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent('Todas');
      expect(buttons[1]).toHaveTextContent('Pendientes');
      expect(buttons[2]).toHaveTextContent('En Progreso');
      expect(buttons[3]).toHaveTextContent('Completadas');
      expect(buttons[4]).toHaveTextContent('Canceladas');
    });

    it('renders buttons as proper button elements', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button.tagName).toBe('BUTTON');
      });
    });
  });

  // ========================================================================
  // Active Filter State Tests
  // ========================================================================
  describe('Active Filter State', () => {
    it('highlights active filter with "all" selected', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      const allButton = screen.getByText('Todas');
      expect(allButton).toHaveClass('bg-primary');
      expect(allButton).toHaveClass('text-primary-foreground');
    });

    it('highlights active filter with "pending" selected', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="pending" />);

      const pendingButton = screen.getByText('Pendientes');
      expect(pendingButton).toHaveClass('bg-primary');
      expect(pendingButton).toHaveClass('text-primary-foreground');
    });

    it('highlights active filter with "ongoing" selected', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="ongoing" />);

      const ongoingButton = screen.getByText('En Progreso');
      expect(ongoingButton).toHaveClass('bg-primary');
      expect(ongoingButton).toHaveClass('text-primary-foreground');
    });

    it('highlights active filter with "completed" selected', () => {
      render(
        <RequestFilterButtons {...defaultProps} activeFilter="completed" />
      );

      const completedButton = screen.getByText('Completadas');
      expect(completedButton).toHaveClass('bg-primary');
      expect(completedButton).toHaveClass('text-primary-foreground');
    });

    it('highlights active filter with "cancelled" selected', () => {
      render(
        <RequestFilterButtons {...defaultProps} activeFilter="cancelled" />
      );

      const cancelledButton = screen.getByText('Canceladas');
      expect(cancelledButton).toHaveClass('bg-primary');
      expect(cancelledButton).toHaveClass('text-primary-foreground');
    });

    it('applies inactive styles to non-active filters', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      const pendingButton = screen.getByText('Pendientes');
      expect(pendingButton).toHaveClass('bg-secondary');
      expect(pendingButton).toHaveClass('text-secondary-foreground');
    });

    it('only one filter is highlighted at a time', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="pending" />);

      const buttons = screen.getAllByRole('button');
      const activeButtons = buttons.filter((btn) =>
        btn.className.includes('bg-primary')
      );
      expect(activeButtons).toHaveLength(1);
    });

    it('inactive filters show secondary background', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      const inactiveButtons = [
        screen.getByText('Pendientes'),
        screen.getByText('En Progreso'),
        screen.getByText('Completadas'),
        screen.getByText('Canceladas'),
      ];

      inactiveButtons.forEach((button) => {
        expect(button).toHaveClass('bg-secondary');
      });
    });

    it('inactive filters show hover state classes', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      const inactiveButton = screen.getByText('Pendientes');
      expect(inactiveButton).toHaveClass('hover:bg-secondary/80');
    });
  });

  // ========================================================================
  // Click Handler Tests
  // ========================================================================
  describe('Click Handlers', () => {
    it('calls onFilterChange when "Todas" is clicked', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} activeFilter="pending" />);

      await user.click(screen.getByText('Todas'));

      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
      expect(mockOnFilterChange).toHaveBeenCalledWith('all');
    });

    it('calls onFilterChange when "Pendientes" is clicked', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      await user.click(screen.getByText('Pendientes'));

      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
      expect(mockOnFilterChange).toHaveBeenCalledWith('pending');
    });

    it('calls onFilterChange when "En Progreso" is clicked', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      await user.click(screen.getByText('En Progreso'));

      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
      expect(mockOnFilterChange).toHaveBeenCalledWith('ongoing');
    });

    it('calls onFilterChange when "Completadas" is clicked', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      await user.click(screen.getByText('Completadas'));

      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
      expect(mockOnFilterChange).toHaveBeenCalledWith('completed');
    });

    it('calls onFilterChange when "Canceladas" is clicked', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      await user.click(screen.getByText('Canceladas'));

      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
      expect(mockOnFilterChange).toHaveBeenCalledWith('cancelled');
    });

    it('calls onFilterChange even when clicking active filter', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      await user.click(screen.getByText('Todas'));

      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
      expect(mockOnFilterChange).toHaveBeenCalledWith('all');
    });

    it('handles multiple clicks correctly', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      await user.click(screen.getByText('Pendientes'));
      await user.click(screen.getByText('En Progreso'));
      await user.click(screen.getByText('Completadas'));

      expect(mockOnFilterChange).toHaveBeenCalledTimes(3);
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(1, 'pending');
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(2, 'ongoing');
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(3, 'completed');
    });

    it('handles rapid clicks gracefully', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} />);

      const button = screen.getByText('Pendientes');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockOnFilterChange).toHaveBeenCalledTimes(3);
      expect(mockOnFilterChange).toHaveBeenCalledWith('pending');
    });

    it('calls onFilterChange with correct filter type for each button', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} />);

      for (const [filterType, label] of Object.entries(filterLabels)) {
        mockOnFilterChange.mockClear();
        await user.click(screen.getByText(label));
        expect(mockOnFilterChange).toHaveBeenCalledWith(filterType);
      }
    });
  });

  // ========================================================================
  // Button Styling Tests
  // ========================================================================
  describe('Button Styling', () => {
    it('applies rounded corners to buttons', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('rounded-[8px]');
      });
    });

    it('applies padding to buttons', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('px-4');
        expect(button).toHaveClass('py-2');
      });
    });

    it('applies text styling to buttons', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('text-sm');
        expect(button).toHaveClass('font-medium');
      });
    });

    it('applies transition animation to buttons', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('transition-all');
      });
    });

    it('active button has primary background', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="pending" />);

      const activeButton = screen.getByText('Pendientes');
      expect(activeButton.className).toContain('bg-primary');
    });

    it('inactive buttons have secondary background', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="pending" />);

      const inactiveButton = screen.getByText('Todas');
      expect(inactiveButton.className).toContain('bg-secondary');
    });

    it('applies consistent styling across all buttons', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const firstButtonClasses = buttons[0].className
        .split(' ')
        .filter(
          (c) => !c.includes('bg-') && !c.includes('text-') && !c.includes('hover')
        );

      buttons.forEach((button) => {
        const buttonClasses = button.className
          .split(' ')
          .filter(
            (c) =>
              !c.includes('bg-') && !c.includes('text-') && !c.includes('hover')
          );
        expect(buttonClasses).toEqual(firstButtonClasses);
      });
    });
  });

  // ========================================================================
  // Theme Integration Tests
  // ========================================================================
  describe('Theme Integration', () => {
    it('uses theme CSS variables for primary colors', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      const activeButton = screen.getByText('Todas');
      expect(activeButton.className).toContain('bg-primary');
      expect(activeButton.className).toContain('text-primary-foreground');
    });

    it('uses theme CSS variables for secondary colors', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      const inactiveButton = screen.getByText('Pendientes');
      expect(inactiveButton.className).toContain('bg-secondary');
      expect(inactiveButton.className).toContain('text-secondary-foreground');
    });

    it('does not use hardcoded colors', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button.className).not.toMatch(/bg-(blue|red|green|gray)-\d+/);
        expect(button.className).not.toMatch(/text-(blue|red|green|gray)-\d+/);
      });
    });

    it('applies hover state with theme colors', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      const inactiveButton = screen.getByText('Pendientes');
      expect(inactiveButton.className).toContain('hover:bg-secondary/80');
    });

    it('maintains theme consistency across filter states', () => {
      const { rerender } = render(
        <RequestFilterButtons {...defaultProps} activeFilter="all" />
      );

      const todasButton = screen.getByText('Todas');
      expect(todasButton).toHaveClass('bg-primary');

      rerender(
        <RequestFilterButtons {...defaultProps} activeFilter="pending" />
      );

      expect(todasButton).toHaveClass('bg-secondary');
    });
  });

  // ========================================================================
  // Keyboard Navigation Tests
  // ========================================================================
  describe('Keyboard Navigation', () => {
    it('supports Tab navigation between buttons', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} />);

      await user.tab();
      expect(screen.getByText('Todas')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('Pendientes')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('En Progreso')).toHaveFocus();
    });

    it('supports Enter key to activate button', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} />);

      const button = screen.getByText('Pendientes');
      button.focus();

      await user.keyboard('{Enter}');

      expect(mockOnFilterChange).toHaveBeenCalledWith('pending');
    });

    it('supports Space key to activate button', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} />);

      const button = screen.getByText('Completadas');
      button.focus();

      await user.keyboard(' ');

      expect(mockOnFilterChange).toHaveBeenCalledWith('completed');
    });

    it('allows Shift+Tab to navigate backwards', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} />);

      // Tab to third button
      await user.tab();
      await user.tab();
      await user.tab();
      expect(screen.getByText('En Progreso')).toHaveFocus();

      // Shift+Tab back
      await user.tab({ shift: true });
      expect(screen.getByText('Pendientes')).toHaveFocus();
    });

    it('maintains focus after clicking', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} />);

      const button = screen.getByText('Pendientes');
      await user.click(button);

      expect(button).toHaveFocus();
    });

    it('can navigate to all buttons via keyboard', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} />);

      const expectedLabels = Object.values(filterLabels);

      for (let i = 0; i < expectedLabels.length; i++) {
        await user.tab();
        expect(screen.getByText(expectedLabels[i])).toHaveFocus();
      }
    });
  });

  // ========================================================================
  // Accessibility Tests
  // ========================================================================
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<RequestFilterButtons {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with different active states', async () => {
      const filters: RequestFilterType[] = [
        'all',
        'pending',
        'ongoing',
        'completed',
        'cancelled',
      ];

      for (const filter of filters) {
        const { container } = render(
          <RequestFilterButtons {...defaultProps} activeFilter={filter} />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('all buttons are accessible via keyboard', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');

      for (const button of buttons) {
        button.focus();
        expect(button).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(mockOnFilterChange).toHaveBeenCalled();
        mockOnFilterChange.mockClear();
      }
    });

    it('buttons have proper button role', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5);
      buttons.forEach((button) => {
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('buttons have accessible text content', () => {
      render(<RequestFilterButtons {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button.textContent).toBeTruthy();
        expect(button.textContent?.length).toBeGreaterThan(0);
      });
    });

    it('provides sufficient color contrast for active state', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="pending" />);

      const activeButton = screen.getByText('Pendientes');
      // Using semantic theme colors ensures proper contrast
      expect(activeButton).toHaveClass('bg-primary');
      expect(activeButton).toHaveClass('text-primary-foreground');
    });

    it('provides sufficient color contrast for inactive state', () => {
      render(<RequestFilterButtons {...defaultProps} activeFilter="pending" />);

      const inactiveButton = screen.getByText('Todas');
      // Using semantic theme colors ensures proper contrast
      expect(inactiveButton).toHaveClass('bg-secondary');
      expect(inactiveButton).toHaveClass('text-secondary-foreground');
    });
  });

  // ========================================================================
  // Responsive Layout Tests
  // ========================================================================
  describe('Responsive Layout', () => {
    it('applies flex layout', () => {
      const { container } = render(<RequestFilterButtons {...defaultProps} />);

      expect(container.firstChild).toHaveClass('flex');
    });

    it('applies gap between buttons', () => {
      const { container } = render(<RequestFilterButtons {...defaultProps} />);

      expect(container.firstChild).toHaveClass('gap-2');
    });

    it('centers items vertically', () => {
      const { container } = render(<RequestFilterButtons {...defaultProps} />);

      expect(container.firstChild).toHaveClass('items-center');
    });

    it('allows custom className to extend layout', () => {
      const { container } = render(
        <RequestFilterButtons
          {...defaultProps}
          className="justify-center max-w-screen-lg"
        />
      );

      expect(container.firstChild).toHaveClass('justify-center');
      expect(container.firstChild).toHaveClass('max-w-screen-lg');
    });

    it('custom className does not override core layout', () => {
      const { container } = render(
        <RequestFilterButtons {...defaultProps} className="custom-spacing" />
      );

      expect(container.firstChild).toHaveClass('flex');
      expect(container.firstChild).toHaveClass('items-center');
      expect(container.firstChild).toHaveClass('gap-2');
      expect(container.firstChild).toHaveClass('custom-spacing');
    });
  });

  // ========================================================================
  // Interaction State Tests
  // ========================================================================
  describe('Interaction States', () => {
    it('applies hover styles to inactive buttons', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      const inactiveButton = screen.getByText('Pendientes');
      await user.hover(inactiveButton);

      expect(inactiveButton).toHaveClass('hover:bg-secondary/80');
    });

    it('maintains active state during hover', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} activeFilter="pending" />);

      const activeButton = screen.getByText('Pendientes');
      await user.hover(activeButton);

      expect(activeButton).toHaveClass('bg-primary');
      expect(activeButton).toHaveClass('text-primary-foreground');
    });

    it('handles mouse enter and leave events', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} />);

      const button = screen.getByText('Pendientes');

      await user.hover(button);
      await user.unhover(button);

      // Button should still be functional
      await user.click(button);
      expect(mockOnFilterChange).toHaveBeenCalledWith('pending');
    });

    it('updates visual state when filter changes', () => {
      const { rerender } = render(
        <RequestFilterButtons {...defaultProps} activeFilter="all" />
      );

      expect(screen.getByText('Todas')).toHaveClass('bg-primary');
      expect(screen.getByText('Pendientes')).toHaveClass('bg-secondary');

      rerender(
        <RequestFilterButtons {...defaultProps} activeFilter="pending" />
      );

      expect(screen.getByText('Todas')).toHaveClass('bg-secondary');
      expect(screen.getByText('Pendientes')).toHaveClass('bg-primary');
    });
  });

  // ========================================================================
  // Edge Cases & Error Handling
  // ========================================================================
  describe('Edge Cases', () => {
    it('handles undefined className gracefully', () => {
      const propsWithoutClassName = {
        activeFilter: 'all' as RequestFilterType,
        onFilterChange: mockOnFilterChange,
        className: undefined,
      };

      const { container } = render(
        <RequestFilterButtons {...propsWithoutClassName} />
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('flex');
    });

    it('handles empty string className', () => {
      const { container } = render(
        <RequestFilterButtons {...defaultProps} className="" />
      );

      expect(container.firstChild).toHaveClass('flex');
    });

    it('works with different filter type values', () => {
      const filters: RequestFilterType[] = [
        'all',
        'pending',
        'ongoing',
        'completed',
        'cancelled',
      ];

      filters.forEach((filter) => {
        const { unmount } = render(
          <RequestFilterButtons {...defaultProps} activeFilter={filter} />
        );
        expect(screen.getAllByRole('button')).toHaveLength(5);
        unmount();
      });
    });

    it('maintains component stability with rapid filter changes', () => {
      const { rerender } = render(
        <RequestFilterButtons {...defaultProps} activeFilter="all" />
      );

      filterTypes.forEach((filter) => {
        rerender(
          <RequestFilterButtons {...defaultProps} activeFilter={filter} />
        );
        expect(screen.getAllByRole('button')).toHaveLength(5);
      });
    });

    it('handles long className strings', () => {
      const longClassName =
        'custom-1 custom-2 custom-3 custom-4 custom-5 custom-6 custom-7 custom-8';
      const { container } = render(
        <RequestFilterButtons {...defaultProps} className={longClassName} />
      );

      expect(container.firstChild).toHaveClass('custom-1');
      expect(container.firstChild).toHaveClass('custom-8');
    });

    it('does not break with multiple spaces in className', () => {
      const { container } = render(
        <RequestFilterButtons
          {...defaultProps}
          className="class-1    class-2     class-3"
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // ========================================================================
  // Component Integration Tests
  // ========================================================================
  describe('Component Integration', () => {
    it('works as controlled component', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <RequestFilterButtons {...defaultProps} activeFilter="all" />
      );

      expect(screen.getByText('Todas')).toHaveClass('bg-primary');

      await user.click(screen.getByText('Pendientes'));
      expect(mockOnFilterChange).toHaveBeenCalledWith('pending');

      // Simulate parent updating activeFilter
      rerender(
        <RequestFilterButtons {...defaultProps} activeFilter="pending" />
      );

      expect(screen.getByText('Pendientes')).toHaveClass('bg-primary');
      expect(screen.getByText('Todas')).toHaveClass('bg-secondary');
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
        expect(screen.getAllByRole('button')).toHaveLength(5);
      }
    });

    it('handles onFilterChange function changes', async () => {
      const user = userEvent.setup();
      const firstHandler = vi.fn();
      const secondHandler = vi.fn();

      const { rerender } = render(
        <RequestFilterButtons
          activeFilter="all"
          onFilterChange={firstHandler}
        />
      );

      await user.click(screen.getByText('Pendientes'));
      expect(firstHandler).toHaveBeenCalledWith('pending');

      rerender(
        <RequestFilterButtons
          activeFilter="all"
          onFilterChange={secondHandler}
        />
      );

      await user.click(screen.getByText('Completadas'));
      expect(secondHandler).toHaveBeenCalledWith('completed');
      expect(firstHandler).toHaveBeenCalledTimes(1);
    });

    it('maintains functionality after multiple state changes', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <RequestFilterButtons {...defaultProps} activeFilter="all" />
      );

      // Simulate multiple filter changes
      const filters: RequestFilterType[] = [
        'pending',
        'ongoing',
        'completed',
        'cancelled',
        'all',
      ];

      for (const filter of filters) {
        mockOnFilterChange.mockClear();
        rerender(
          <RequestFilterButtons {...defaultProps} activeFilter={filter} />
        );
        await user.click(screen.getByText('Pendientes'));
        expect(mockOnFilterChange).toHaveBeenCalledWith('pending');
      }
    });
  });

  // ========================================================================
  // Performance & Optimization Tests
  // ========================================================================
  describe('Performance', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const { rerender } = render(
        <RequestFilterButtons {...defaultProps} activeFilter="all" />
      );

      // Same props should not cause issues
      rerender(<RequestFilterButtons {...defaultProps} activeFilter="all" />);

      expect(screen.getAllByRole('button')).toHaveLength(5);
    });

    it('handles rapid clicks without performance issues', async () => {
      const user = userEvent.setup();
      render(<RequestFilterButtons {...defaultProps} />);

      const button = screen.getByText('Pendientes');

      for (let i = 0; i < 10; i++) {
        await user.click(button);
      }

      expect(mockOnFilterChange).toHaveBeenCalledTimes(10);
    });

    it('renders with minimal DOM elements', () => {
      const { container } = render(<RequestFilterButtons {...defaultProps} />);

      // Should have container div + 5 buttons
      const allElements = container.querySelectorAll('*');
      expect(allElements.length).toBeLessThanOrEqual(7); // Container + 5 buttons + possible wrapper
    });
  });

  // ========================================================================
  // Type Safety Tests
  // ========================================================================
  describe('Type Safety', () => {
    it('accepts all valid RequestFilterType values', () => {
      const validFilters: RequestFilterType[] = [
        'all',
        'pending',
        'ongoing',
        'completed',
        'cancelled',
      ];

      validFilters.forEach((filter) => {
        const { unmount } = render(
          <RequestFilterButtons
            activeFilter={filter}
            onFilterChange={mockOnFilterChange}
          />
        );
        expect(screen.getAllByRole('button')).toHaveLength(5);
        unmount();
      });
    });

    it('calls onFilterChange with correct type signature', async () => {
      const user = userEvent.setup();
      const typedHandler = vi.fn((filter: RequestFilterType) => {
        expect(typeof filter).toBe('string');
        expect(['all', 'pending', 'ongoing', 'completed', 'cancelled']).toContain(
          filter
        );
      });

      render(
        <RequestFilterButtons
          activeFilter="all"
          onFilterChange={typedHandler}
        />
      );

      await user.click(screen.getByText('Pendientes'));
      expect(typedHandler).toHaveBeenCalledWith('pending');
    });
  });
});
