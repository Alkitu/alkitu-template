import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { UserFilterButtons } from './UserFilterButtons';
import type { UserFilterType, UserFilterLabels } from './UserFilterButtons.types';

expect.extend(toHaveNoViolations);

describe('UserFilterButtons - Molecule', () => {
  const defaultProps = {
    activeFilter: 'all' as UserFilterType,
    onFilterChange: vi.fn(),
  };

  const filterTypes: UserFilterType[] = ['all', 'admin', 'employee', 'client'];

  const defaultLabels: Record<UserFilterType, string> = {
    all: 'Todos',
    admin: 'Administradores',
    employee: 'Empleados',
    client: 'Clientes',
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // Basic Rendering Tests
  // ========================================================================
  describe('Basic Rendering', () => {
    it('renders the select trigger', () => {
      render(<UserFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toBeInTheDocument();
    });

    it('renders as a combobox element', () => {
      render(<UserFilterButtons {...defaultProps} />);

      const combobox = screen.getByRole('combobox');
      expect(combobox).toBeInTheDocument();
    });

    it('renders the trigger as a button element', () => {
      render(<UserFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger.tagName).toBe('BUTTON');
    });

    it('has displayName set', () => {
      expect(UserFilterButtons.displayName).toBe('UserFilterButtons');
    });

    it('renders with default w-[200px] class on the trigger', () => {
      render(<UserFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveClass('w-[200px]');
    });
  });

  // ========================================================================
  // Default Labels Tests
  // ========================================================================
  describe('Default Labels', () => {
    it('displays "Todos" when activeFilter is "all"', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="all" />);

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('Todos');
    });

    it('displays "Administradores" when activeFilter is "admin"', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="admin" />);

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('Administradores');
    });

    it('displays "Empleados" when activeFilter is "employee"', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="employee" />);

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('Empleados');
    });

    it('displays "Clientes" when activeFilter is "client"', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="client" />);

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('Clientes');
    });

    it('shows the correct label for each filter type', () => {
      filterTypes.forEach((filter) => {
        const { unmount } = render(
          <UserFilterButtons {...defaultProps} activeFilter={filter} />
        );

        const trigger = screen.getByTestId('user-filter-select');
        expect(trigger).toHaveTextContent(defaultLabels[filter]);
        unmount();
      });
    });
  });

  // ========================================================================
  // Custom Labels Tests
  // ========================================================================
  describe('Custom Labels', () => {
    const customLabels: UserFilterLabels = {
      all: 'All Users',
      admin: 'Admins',
      employee: 'Employees',
      client: 'Clients',
    };

    it('renders custom label for "all" filter', () => {
      render(
        <UserFilterButtons
          {...defaultProps}
          activeFilter="all"
          labels={customLabels}
        />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('All Users');
    });

    it('renders custom label for "admin" filter', () => {
      render(
        <UserFilterButtons
          {...defaultProps}
          activeFilter="admin"
          labels={customLabels}
        />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('Admins');
    });

    it('renders custom label for "employee" filter', () => {
      render(
        <UserFilterButtons
          {...defaultProps}
          activeFilter="employee"
          labels={customLabels}
        />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('Employees');
    });

    it('renders custom label for "client" filter', () => {
      render(
        <UserFilterButtons
          {...defaultProps}
          activeFilter="client"
          labels={customLabels}
        />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('Clients');
    });

    it('overrides all default labels with custom ones', () => {
      render(
        <UserFilterButtons
          {...defaultProps}
          activeFilter="all"
          labels={customLabels}
        />
      );

      const trigger = screen.getByTestId('user-filter-select');
      // Should show custom "All Users" not default "Todos"
      expect(trigger).toHaveTextContent('All Users');
      expect(trigger).not.toHaveTextContent('Todos');
    });
  });

  // ========================================================================
  // Active Filter Display Tests
  // ========================================================================
  describe('Active Filter Display', () => {
    it('updates displayed value when activeFilter prop changes', () => {
      const { rerender } = render(
        <UserFilterButtons {...defaultProps} activeFilter="all" />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('Todos');

      rerender(
        <UserFilterButtons {...defaultProps} activeFilter="admin" />
      );
      expect(trigger).toHaveTextContent('Administradores');

      rerender(
        <UserFilterButtons {...defaultProps} activeFilter="employee" />
      );
      expect(trigger).toHaveTextContent('Empleados');

      rerender(
        <UserFilterButtons {...defaultProps} activeFilter="client" />
      );
      expect(trigger).toHaveTextContent('Clientes');
    });

    it('updates displayed value through all filter types sequentially', () => {
      const { rerender } = render(
        <UserFilterButtons {...defaultProps} activeFilter="all" />
      );

      const trigger = screen.getByTestId('user-filter-select');

      filterTypes.forEach((filter) => {
        rerender(
          <UserFilterButtons {...defaultProps} activeFilter={filter} />
        );
        expect(trigger).toHaveTextContent(defaultLabels[filter]);
      });
    });

    it('updates labels when labels prop changes via rerender', () => {
      const { rerender } = render(
        <UserFilterButtons {...defaultProps} activeFilter="all" />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('Todos');

      const newLabels: UserFilterLabels = {
        all: 'All Users',
        admin: 'Admins',
        employee: 'Employees',
        client: 'Clients',
      };

      rerender(
        <UserFilterButtons
          {...defaultProps}
          activeFilter="all"
          labels={newLabels}
        />
      );
      expect(trigger).toHaveTextContent('All Users');
    });
  });

  // ========================================================================
  // className Prop Tests
  // ========================================================================
  describe('className Prop', () => {
    it('applies custom className to the trigger', () => {
      render(
        <UserFilterButtons
          {...defaultProps}
          className="custom-filter-class"
        />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveClass('custom-filter-class');
    });

    it('preserves default w-[200px] class with custom className', () => {
      render(
        <UserFilterButtons
          {...defaultProps}
          className="custom-filter-class"
        />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveClass('w-[200px]');
      expect(trigger).toHaveClass('custom-filter-class');
    });

    it('applies multiple custom classes separated by space', () => {
      render(
        <UserFilterButtons
          {...defaultProps}
          className="class-one class-two class-three"
        />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveClass('class-one');
      expect(trigger).toHaveClass('class-two');
      expect(trigger).toHaveClass('class-three');
    });

    it('handles undefined className gracefully', () => {
      render(<UserFilterButtons {...defaultProps} className={undefined} />);

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveClass('w-[200px]');
    });
  });

  // ========================================================================
  // Accessibility Tests
  // ========================================================================
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <UserFilterButtons {...defaultProps} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has the aria-label "User role filters"', () => {
      render(<UserFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveAttribute('aria-label', 'User role filters');
    });

    it('has no accessibility violations with custom labels', async () => {
      const customLabels: UserFilterLabels = {
        all: 'All Users',
        admin: 'Admins',
        employee: 'Employees',
        client: 'Clients',
      };

      const { container } = render(
        <UserFilterButtons {...defaultProps} labels={customLabels} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with different active filters', async () => {
      for (const filter of filterTypes) {
        const { container, unmount } = render(
          <UserFilterButtons {...defaultProps} activeFilter={filter} />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
        unmount();
      }
    });

    it('trigger is focusable', () => {
      render(<UserFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('user-filter-select');
      trigger.focus();
      expect(trigger).toHaveFocus();
    });

    it('trigger has accessible text content', () => {
      render(<UserFilterButtons {...defaultProps} />);

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger.textContent).toBeTruthy();
      expect(trigger.textContent!.length).toBeGreaterThan(0);
    });
  });

  // ========================================================================
  // Integration & Re-rendering Tests
  // ========================================================================
  describe('Re-rendering and Updates', () => {
    it('works as a controlled component', () => {
      const { rerender } = render(
        <UserFilterButtons {...defaultProps} activeFilter="all" />
      );

      expect(screen.getByTestId('user-filter-select')).toHaveTextContent(
        'Todos'
      );

      rerender(
        <UserFilterButtons {...defaultProps} activeFilter="admin" />
      );

      expect(screen.getByTestId('user-filter-select')).toHaveTextContent(
        'Administradores'
      );
    });

    it('can be rerendered multiple times without issues', () => {
      const { rerender } = render(
        <UserFilterButtons {...defaultProps} activeFilter="all" />
      );

      for (let i = 0; i < 10; i++) {
        const filter = filterTypes[i % filterTypes.length];
        rerender(
          <UserFilterButtons {...defaultProps} activeFilter={filter} />
        );
        expect(screen.getByTestId('user-filter-select')).toBeInTheDocument();
      }
    });

    it('handles onFilterChange function changes', () => {
      const firstHandler = vi.fn();
      const secondHandler = vi.fn();

      const { rerender } = render(
        <UserFilterButtons {...defaultProps} onFilterChange={firstHandler} />
      );

      rerender(
        <UserFilterButtons {...defaultProps} onFilterChange={secondHandler} />
      );

      // Component should accept the new handler without breaking
      expect(screen.getByTestId('user-filter-select')).toBeInTheDocument();
    });

    it('re-renders without issues when parent re-renders with same props', () => {
      const { rerender } = render(
        <UserFilterButtons {...defaultProps} activeFilter="admin" />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('Administradores');

      rerender(
        <UserFilterButtons
          {...defaultProps}
          activeFilter="admin"
          className="new-class"
        />
      );

      expect(trigger).toHaveTextContent('Administradores');
      expect(trigger).toHaveClass('new-class');
    });
  });

  // ========================================================================
  // Edge Cases
  // ========================================================================
  describe('Edge Cases', () => {
    it('handles very long label text', () => {
      const longLabels: UserFilterLabels = {
        all: 'All Users in the Entire System',
        admin: 'System Administrators with Full Access',
        employee: 'Regular Employees with Limited Access',
        client: 'External Client Users',
      };

      render(
        <UserFilterButtons
          {...defaultProps}
          activeFilter="all"
          labels={longLabels}
        />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('All Users in the Entire System');
    });

    it('handles special characters in labels', () => {
      const specialLabels: UserFilterLabels = {
        all: 'All (100%)',
        admin: 'Admin & Super',
        employee: 'Employee < Manager',
        client: 'Client @ Company',
      };

      render(
        <UserFilterButtons
          {...defaultProps}
          activeFilter="all"
          labels={specialLabels}
        />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('All (100%)');
    });

    it('handles unicode characters in labels', () => {
      const unicodeLabels: UserFilterLabels = {
        all: 'Todos 🌐',
        admin: 'Administradores 👨‍💼',
        employee: 'Empleados 👷',
        client: 'Clientes 🤝',
      };

      render(
        <UserFilterButtons
          {...defaultProps}
          activeFilter="all"
          labels={unicodeLabels}
        />
      );

      const trigger = screen.getByTestId('user-filter-select');
      expect(trigger).toHaveTextContent('Todos 🌐');
    });

    it('accepts all valid UserFilterType values', () => {
      filterTypes.forEach((filter) => {
        const { unmount } = render(
          <UserFilterButtons
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
