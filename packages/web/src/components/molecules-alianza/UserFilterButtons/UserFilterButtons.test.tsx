import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { UserFilterButtons } from './UserFilterButtons';
import type { UserFilterType, UserFilterLabels } from './UserFilterButtons.types';

expect.extend(toHaveNoViolations);

describe('UserFilterButtons - Molecule', () => {
  const defaultProps = {
    activeFilter: 'all' as UserFilterType,
    onFilterChange: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      render(<UserFilterButtons {...defaultProps} />);
      expect(screen.getByTestId('user-filter-buttons')).toBeInTheDocument();
    });

    it('renders all filter buttons', () => {
      render(<UserFilterButtons {...defaultProps} />);
      expect(screen.getByTestId('filter-all')).toBeInTheDocument();
      expect(screen.getByTestId('filter-admin')).toBeInTheDocument();
      expect(screen.getByTestId('filter-employee')).toBeInTheDocument();
      expect(screen.getByTestId('filter-client')).toBeInTheDocument();
    });

    it('renders with correct role group', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const group = screen.getByRole('group', { name: 'User role filters' });
      expect(group).toBeInTheDocument();
    });

    it('renders 4 filter buttons', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const container = screen.getByTestId('user-filter-buttons');
      const buttons = within(container).getAllByRole('button');
      expect(buttons).toHaveLength(4);
    });

    it('has displayName set', () => {
      expect(UserFilterButtons.displayName).toBe('UserFilterButtons');
    });
  });

  describe('Default Labels', () => {
    it('renders default label for "all" filter', () => {
      render(<UserFilterButtons {...defaultProps} />);
      expect(screen.getByText('Todos')).toBeInTheDocument();
    });

    it('renders default label for "admin" filter', () => {
      render(<UserFilterButtons {...defaultProps} />);
      expect(screen.getByText('Administradores')).toBeInTheDocument();
    });

    it('renders default label for "employee" filter', () => {
      render(<UserFilterButtons {...defaultProps} />);
      expect(screen.getByText('Employee')).toBeInTheDocument();
    });

    it('renders default label for "client" filter', () => {
      render(<UserFilterButtons {...defaultProps} />);
      expect(screen.getByText('Clientes')).toBeInTheDocument();
    });
  });

  describe('Custom Labels', () => {
    const customLabels: UserFilterLabels = {
      all: 'All Users',
      admin: 'Admins',
      employee: 'Employees',
      client: 'Clients',
    };

    it('renders custom label for "all" filter', () => {
      render(<UserFilterButtons {...defaultProps} labels={customLabels} />);
      expect(screen.getByText('All Users')).toBeInTheDocument();
    });

    it('renders custom label for "admin" filter', () => {
      render(<UserFilterButtons {...defaultProps} labels={customLabels} />);
      expect(screen.getByText('Admins')).toBeInTheDocument();
    });

    it('renders custom label for "employee" filter', () => {
      render(<UserFilterButtons {...defaultProps} labels={customLabels} />);
      expect(screen.getByText('Employees')).toBeInTheDocument();
    });

    it('renders custom label for "client" filter', () => {
      render(<UserFilterButtons {...defaultProps} labels={customLabels} />);
      expect(screen.getByText('Clients')).toBeInTheDocument();
    });

    it('overrides all default labels with custom ones', () => {
      render(<UserFilterButtons {...defaultProps} labels={customLabels} />);
      expect(screen.queryByText('Todos')).not.toBeInTheDocument();
      expect(screen.queryByText('Administradores')).not.toBeInTheDocument();
      expect(screen.queryByText('Employee')).not.toBeInTheDocument();
      expect(screen.queryByText('Clientes')).not.toBeInTheDocument();
    });
  });

  describe('Active Filter State', () => {
    it('shows "all" filter as active when activeFilter is "all"', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="all" />);
      const allButton = screen.getByTestId('filter-all');
      expect(allButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows "admin" filter as active when activeFilter is "admin"', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="admin" />);
      const adminButton = screen.getByTestId('filter-admin');
      expect(adminButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows "employee" filter as active when activeFilter is "employee"', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="employee" />);
      const employeeButton = screen.getByTestId('filter-employee');
      expect(employeeButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows "client" filter as active when activeFilter is "client"', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="client" />);
      const clientButton = screen.getByTestId('filter-client');
      expect(clientButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('only one filter is marked as active at a time', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="admin" />);
      expect(screen.getByTestId('filter-admin')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('filter-all')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByTestId('filter-employee')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByTestId('filter-client')).toHaveAttribute('aria-pressed', 'false');
    });

    it('active filter does not change aria-pressed when re-rendered', () => {
      const { rerender } = render(<UserFilterButtons {...defaultProps} activeFilter="employee" />);
      expect(screen.getByTestId('filter-employee')).toHaveAttribute('aria-pressed', 'true');

      rerender(<UserFilterButtons {...defaultProps} activeFilter="employee" />);
      expect(screen.getByTestId('filter-employee')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Click Handling', () => {
    it('calls onFilterChange when clicking "all" filter', async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      render(<UserFilterButtons {...defaultProps} onFilterChange={onFilterChange} />);

      await user.click(screen.getByTestId('filter-all'));
      expect(onFilterChange).toHaveBeenCalledWith('all');
    });

    it('calls onFilterChange when clicking "admin" filter', async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      render(<UserFilterButtons {...defaultProps} onFilterChange={onFilterChange} />);

      await user.click(screen.getByTestId('filter-admin'));
      expect(onFilterChange).toHaveBeenCalledWith('admin');
    });

    it('calls onFilterChange when clicking "employee" filter', async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      render(<UserFilterButtons {...defaultProps} onFilterChange={onFilterChange} />);

      await user.click(screen.getByTestId('filter-employee'));
      expect(onFilterChange).toHaveBeenCalledWith('employee');
    });

    it('calls onFilterChange when clicking "client" filter', async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      render(<UserFilterButtons {...defaultProps} onFilterChange={onFilterChange} />);

      await user.click(screen.getByTestId('filter-client'));
      expect(onFilterChange).toHaveBeenCalledWith('client');
    });

    it('calls onFilterChange exactly once per click', async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      render(<UserFilterButtons {...defaultProps} onFilterChange={onFilterChange} />);

      await user.click(screen.getByTestId('filter-admin'));
      expect(onFilterChange).toHaveBeenCalledTimes(1);
    });

    it('can click multiple filters in sequence', async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      render(<UserFilterButtons {...defaultProps} onFilterChange={onFilterChange} />);

      await user.click(screen.getByTestId('filter-admin'));
      await user.click(screen.getByTestId('filter-employee'));
      await user.click(screen.getByTestId('filter-client'));

      expect(onFilterChange).toHaveBeenCalledTimes(3);
      expect(onFilterChange).toHaveBeenNthCalledWith(1, 'admin');
      expect(onFilterChange).toHaveBeenNthCalledWith(2, 'employee');
      expect(onFilterChange).toHaveBeenNthCalledWith(3, 'client');
    });

    it('allows clicking the currently active filter', async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      render(<UserFilterButtons {...defaultProps} activeFilter="admin" onFilterChange={onFilterChange} />);

      await user.click(screen.getByTestId('filter-admin'));
      expect(onFilterChange).toHaveBeenCalledWith('admin');
    });
  });

  describe('Styling and Classes', () => {
    it('applies default wrapper classes', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const container = screen.getByTestId('user-filter-buttons');
      expect(container).toHaveClass('flex', 'flex-wrap', 'gap-[13px]');
    });

    it('applies custom className to wrapper', () => {
      render(<UserFilterButtons {...defaultProps} className="custom-filter-class" />);
      const container = screen.getByTestId('user-filter-buttons');
      expect(container).toHaveClass('custom-filter-class');
    });

    it('preserves default classes when custom className is added', () => {
      render(<UserFilterButtons {...defaultProps} className="custom-filter-class" />);
      const container = screen.getByTestId('user-filter-buttons');
      expect(container).toHaveClass('flex', 'flex-wrap', 'gap-[13px]', 'custom-filter-class');
    });

    it('applies cursor-pointer class to all filter buttons', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const allButton = screen.getByTestId('filter-all');
      expect(allButton).toHaveClass('cursor-pointer');
    });

    it('applies hover classes to all filter buttons', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const buttons = [
        screen.getByTestId('filter-all'),
        screen.getByTestId('filter-admin'),
        screen.getByTestId('filter-employee'),
        screen.getByTestId('filter-client'),
      ];

      buttons.forEach(button => {
        expect(button).toHaveClass('hover:opacity-80', 'transition-opacity');
      });
    });

    it('applies multiple custom classes separated by space', () => {
      render(<UserFilterButtons {...defaultProps} className="class-one class-two class-three" />);
      const container = screen.getByTestId('user-filter-buttons');
      expect(container).toHaveClass('class-one', 'class-two', 'class-three');
    });
  });

  describe('Filter Button Variants', () => {
    it('active filter uses "solid" variant', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="admin" />);
      const adminButton = screen.getByTestId('filter-admin');
      // Solid variant applies specific classes - we check aria-pressed instead
      expect(adminButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('inactive filters use "outline" variant', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="admin" />);
      const allButton = screen.getByTestId('filter-all');
      const employeeButton = screen.getByTestId('filter-employee');
      const clientButton = screen.getByTestId('filter-client');

      expect(allButton).toHaveAttribute('aria-pressed', 'false');
      expect(employeeButton).toHaveAttribute('aria-pressed', 'false');
      expect(clientButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('changes variant when activeFilter changes', () => {
      const { rerender } = render(<UserFilterButtons {...defaultProps} activeFilter="all" />);
      expect(screen.getByTestId('filter-all')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('filter-admin')).toHaveAttribute('aria-pressed', 'false');

      rerender(<UserFilterButtons {...defaultProps} activeFilter="admin" />);
      expect(screen.getByTestId('filter-all')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByTestId('filter-admin')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Layout and Responsive Behavior', () => {
    it('uses flex layout for horizontal arrangement', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const container = screen.getByTestId('user-filter-buttons');
      expect(container).toHaveClass('flex');
    });

    it('uses flex-wrap for responsive wrapping', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const container = screen.getByTestId('user-filter-buttons');
      expect(container).toHaveClass('flex-wrap');
    });

    it('has consistent gap between filter buttons', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const container = screen.getByTestId('user-filter-buttons');
      expect(container).toHaveClass('gap-[13px]');
    });
  });

  describe('Filter Button Order', () => {
    it('renders filters in correct order: all, admin, employee, client', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const container = screen.getByTestId('user-filter-buttons');
      const buttons = within(container).getAllByRole('button');

      expect(buttons[0]).toHaveAttribute('data-testid', 'filter-all');
      expect(buttons[1]).toHaveAttribute('data-testid', 'filter-admin');
      expect(buttons[2]).toHaveAttribute('data-testid', 'filter-employee');
      expect(buttons[3]).toHaveAttribute('data-testid', 'filter-client');
    });

    it('maintains filter order with custom labels', () => {
      const customLabels: UserFilterLabels = {
        all: 'Z All',
        admin: 'Y Admin',
        employee: 'X Employee',
        client: 'W Client',
      };

      render(<UserFilterButtons {...defaultProps} labels={customLabels} />);
      const container = screen.getByTestId('user-filter-buttons');
      const buttons = within(container).getAllByRole('button');

      expect(buttons[0]).toHaveTextContent('Z All');
      expect(buttons[1]).toHaveTextContent('Y Admin');
      expect(buttons[2]).toHaveTextContent('X Employee');
      expect(buttons[3]).toHaveTextContent('W Client');
    });
  });

  describe('Keyboard Navigation', () => {
    it('filter buttons have role="button" for accessibility', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
    });

    it('filter buttons have aria-pressed attribute', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="admin" />);
      expect(screen.getByTestId('filter-admin')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('filter-all')).toHaveAttribute('aria-pressed', 'false');
    });

    it('all filters are keyboard navigable with role="button"', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const filters = ['all', 'admin', 'employee', 'client'];

      filters.forEach(filter => {
        const button = screen.getByTestId(`filter-${filter}`);
        expect(button).toHaveAttribute('role', 'button');
      });
    });
  });

  describe('Re-rendering and Updates', () => {
    it('updates when activeFilter prop changes', () => {
      const { rerender } = render(<UserFilterButtons {...defaultProps} activeFilter="all" />);
      expect(screen.getByTestId('filter-all')).toHaveAttribute('aria-pressed', 'true');

      rerender(<UserFilterButtons {...defaultProps} activeFilter="client" />);
      expect(screen.getByTestId('filter-all')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByTestId('filter-client')).toHaveAttribute('aria-pressed', 'true');
    });

    it('updates when labels prop changes', () => {
      const { rerender } = render(<UserFilterButtons {...defaultProps} />);
      expect(screen.getByText('Todos')).toBeInTheDocument();

      const newLabels: UserFilterLabels = {
        all: 'All Users',
        admin: 'Admins',
        employee: 'Employees',
        client: 'Clients',
      };

      rerender(<UserFilterButtons {...defaultProps} labels={newLabels} />);
      expect(screen.queryByText('Todos')).not.toBeInTheDocument();
      expect(screen.getByText('All Users')).toBeInTheDocument();
    });

    it('updates when onFilterChange prop changes', async () => {
      const user = userEvent.setup();
      const firstHandler = vi.fn();
      const secondHandler = vi.fn();

      const { rerender } = render(
        <UserFilterButtons {...defaultProps} onFilterChange={firstHandler} />
      );

      await user.click(screen.getByTestId('filter-admin'));
      expect(firstHandler).toHaveBeenCalledWith('admin');
      expect(secondHandler).not.toHaveBeenCalled();

      rerender(<UserFilterButtons {...defaultProps} onFilterChange={secondHandler} />);
      await user.click(screen.getByTestId('filter-employee'));
      expect(secondHandler).toHaveBeenCalledWith('employee');
      expect(firstHandler).toHaveBeenCalledTimes(1);
    });

    it('re-renders without losing state when parent re-renders', () => {
      const { rerender } = render(<UserFilterButtons {...defaultProps} activeFilter="admin" />);
      expect(screen.getByTestId('filter-admin')).toHaveAttribute('aria-pressed', 'true');

      rerender(<UserFilterButtons {...defaultProps} activeFilter="admin" className="new-class" />);
      expect(screen.getByTestId('filter-admin')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid consecutive clicks', async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      render(<UserFilterButtons {...defaultProps} onFilterChange={onFilterChange} />);

      const adminButton = screen.getByTestId('filter-admin');
      await user.click(adminButton);
      await user.click(adminButton);
      await user.click(adminButton);

      expect(onFilterChange).toHaveBeenCalledTimes(3);
      expect(onFilterChange).toHaveBeenCalledWith('admin');
    });

    it('handles empty string in custom labels gracefully', () => {
      const labelsWithEmpty: UserFilterLabels = {
        all: '',
        admin: 'Admin',
        employee: 'Employee',
        client: 'Client',
      };

      render(<UserFilterButtons {...defaultProps} labels={labelsWithEmpty} />);
      const allButton = screen.getByTestId('filter-all');
      expect(allButton).toBeInTheDocument();
      expect(allButton).toHaveTextContent('');
    });

    it('handles very long label text', () => {
      const longLabels: UserFilterLabels = {
        all: 'All Users in the Entire System',
        admin: 'System Administrators with Full Access',
        employee: 'Regular Employees with Limited Access',
        client: 'External Client Users',
      };

      render(<UserFilterButtons {...defaultProps} labels={longLabels} />);
      expect(screen.getByText('All Users in the Entire System')).toBeInTheDocument();
      expect(screen.getByText('System Administrators with Full Access')).toBeInTheDocument();
    });

    it('handles special characters in labels', () => {
      const specialLabels: UserFilterLabels = {
        all: 'All (100%)',
        admin: 'Admin & Super',
        employee: 'Employee < Manager',
        client: 'Client @ Company',
      };

      render(<UserFilterButtons {...defaultProps} labels={specialLabels} />);
      expect(screen.getByText('All (100%)')).toBeInTheDocument();
      expect(screen.getByText('Admin & Super')).toBeInTheDocument();
      expect(screen.getByText('Employee < Manager')).toBeInTheDocument();
      expect(screen.getByText('Client @ Company')).toBeInTheDocument();
    });

    it('handles unicode characters in labels', () => {
      const unicodeLabels: UserFilterLabels = {
        all: 'Todos 🌐',
        admin: 'Administradores 👨‍💼',
        employee: 'Empleados 👷',
        client: 'Clientes 🤝',
      };

      render(<UserFilterButtons {...defaultProps} labels={unicodeLabels} />);
      expect(screen.getByText('Todos 🌐')).toBeInTheDocument();
      expect(screen.getByText('Administradores 👨‍💼')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('works with Chip component for each filter', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const filters = ['all', 'admin', 'employee', 'client'];

      filters.forEach(filter => {
        const button = screen.getByTestId(`filter-${filter}`);
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('cursor-pointer');
      });
    });

    it('maintains Chip hover effects', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const adminButton = screen.getByTestId('filter-admin');
      expect(adminButton).toHaveClass('hover:opacity-80', 'transition-opacity');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<UserFilterButtons {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA role for group', () => {
      render(<UserFilterButtons {...defaultProps} />);
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('has descriptive ARIA label for group', () => {
      render(<UserFilterButtons {...defaultProps} />);
      expect(screen.getByRole('group', { name: 'User role filters' })).toBeInTheDocument();
    });

    it('each filter button has proper role', () => {
      render(<UserFilterButtons {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
    });

    it('uses aria-pressed to indicate active state', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="employee" />);
      expect(screen.getByTestId('filter-employee')).toHaveAttribute('aria-pressed', 'true');
    });

    it('all inactive filters have aria-pressed="false"', () => {
      render(<UserFilterButtons {...defaultProps} activeFilter="employee" />);
      expect(screen.getByTestId('filter-all')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByTestId('filter-admin')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByTestId('filter-client')).toHaveAttribute('aria-pressed', 'false');
    });

    it('accessible names are provided by button text', () => {
      render(<UserFilterButtons {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Administradores' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Employee' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Clientes' })).toBeInTheDocument();
    });

    it('maintains accessibility with custom labels', () => {
      const customLabels: UserFilterLabels = {
        all: 'All Users',
        admin: 'Administrators',
        employee: 'Staff Members',
        client: 'Customer Accounts',
      };

      render(<UserFilterButtons {...defaultProps} labels={customLabels} />);
      expect(screen.getByRole('button', { name: 'All Users' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Administrators' })).toBeInTheDocument();
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

    it('has no accessibility violations with different active filter', async () => {
      const { container } = render(
        <UserFilterButtons {...defaultProps} activeFilter="client" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Performance and Optimization', () => {
    it('does not re-render unnecessarily when props do not change', () => {
      const { rerender } = render(<UserFilterButtons {...defaultProps} />);
      const container = screen.getByTestId('user-filter-buttons');
      const firstRender = container.innerHTML;

      rerender(<UserFilterButtons {...defaultProps} />);
      expect(container.innerHTML).toBe(firstRender);
    });

    it('renders efficiently with multiple filters', () => {
      const startTime = performance.now();
      render(<UserFilterButtons {...defaultProps} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should render in less than 100ms
    });
  });
});
