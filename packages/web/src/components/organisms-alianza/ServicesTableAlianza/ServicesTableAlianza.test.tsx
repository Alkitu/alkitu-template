import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServicesTableAlianza } from './ServicesTableAlianza';
import type { ServiceTableItem } from './ServicesTableAlianza.types';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('ServicesTableAlianza', () => {
  const mockServices: ServiceTableItem[] = [
    {
      id: 'service-1',
      name: 'Tech Support',
      category: 'IT Services',
      status: 'ACTIVE',
      questionsCount: 5,
    },
    {
      id: 'service-2',
      name: 'HR Consultation',
      category: 'Human Resources',
      status: 'INACTIVE',
      questionsCount: 3,
    },
    {
      id: 'service-3',
      name: 'Accounting',
      category: 'Finance',
      status: 'ACTIVE',
      questionsCount: 8,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // RENDERING TESTS
  describe('Rendering', () => {
    it('should render table with services list', () => {
      render(<ServicesTableAlianza services={mockServices} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Check that all services are rendered
      expect(screen.getByText('Tech Support')).toBeInTheDocument();
      expect(screen.getByText('HR Consultation')).toBeInTheDocument();
      expect(screen.getByText('Accounting')).toBeInTheDocument();
    });

    it('should render table with empty services array', () => {
      const { container } = render(<ServicesTableAlianza services={[]} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Should have header row only
      const tbody = container.querySelector('tbody');
      const rows = tbody?.querySelectorAll('tr');
      expect(rows?.length).toBe(0);
    });

    it('should apply custom className to wrapper', () => {
      const { container } = render(
        <ServicesTableAlianza services={mockServices} className="custom-test-class" />
      );

      const wrapper = container.querySelector('.custom-test-class');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('w-full');
      expect(wrapper).toHaveClass('relative');
      expect(wrapper).toHaveClass('border');
    });
  });

  // SERVICE DISPLAY TESTS
  describe('Service Display', () => {
    it('should display service name and category', () => {
      render(<ServicesTableAlianza services={mockServices} />);

      expect(screen.getByText('Tech Support')).toBeInTheDocument();
      expect(screen.getByText('IT Services')).toBeInTheDocument();
      expect(screen.getByText('HR Consultation')).toBeInTheDocument();
      expect(screen.getByText('Human Resources')).toBeInTheDocument();
    });

    it('should display ACTIVE status badge with correct styling', () => {
      render(<ServicesTableAlianza services={[mockServices[0]]} />);

      const activeBadge = screen.getByText('Activo');
      expect(activeBadge).toBeInTheDocument();

      // Check active styling
      expect(activeBadge).toHaveClass('bg-emerald-100');
      expect(activeBadge).toHaveClass('text-emerald-800');
      expect(activeBadge).toHaveClass('dark:bg-emerald-900/30');
      expect(activeBadge).toHaveClass('dark:text-emerald-400');
    });

    it('should display INACTIVE status badge with correct styling', () => {
      render(<ServicesTableAlianza services={[mockServices[1]]} />);

      const inactiveBadge = screen.getByText('Inactivo');
      expect(inactiveBadge).toBeInTheDocument();

      // Check inactive styling
      expect(inactiveBadge).toHaveClass('bg-gray-100');
      expect(inactiveBadge).toHaveClass('text-gray-800');
      expect(inactiveBadge).toHaveClass('dark:bg-gray-800/30');
      expect(inactiveBadge).toHaveClass('dark:text-gray-400');
    });

    it('should display questions count for each service', () => {
      render(<ServicesTableAlianza services={mockServices} />);

      expect(screen.getByText('5')).toBeInTheDocument(); // Tech Support
      expect(screen.getByText('3')).toBeInTheDocument(); // HR Consultation
      expect(screen.getByText('8')).toBeInTheDocument(); // Accounting
    });

    it('should display service name with proper formatting', () => {
      const { container } = render(<ServicesTableAlianza services={[mockServices[0]]} />);

      const tbody = container.querySelector('tbody');
      const nameCell = tbody?.querySelector('td:first-child');

      expect(nameCell).toHaveClass('font-semibold');
      expect(nameCell).toHaveClass('text-foreground');
      expect(nameCell?.textContent).toBe('Tech Support');
    });
  });

  // INTERACTION TESTS
  describe('Interactions', () => {
    it('should call onEdit when edit menu item is clicked', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();

      render(<ServicesTableAlianza services={mockServices} onEdit={onEdit} />);

      // Find and click the first dropdown trigger
      const dropdownTriggers = screen.getAllByRole('button');
      await user.click(dropdownTriggers[0]);

      // Find and click the edit option
      const editOption = await screen.findByText('Editar');
      await user.click(editOption);

      expect(onEdit).toHaveBeenCalledWith('service-1');
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete when delete menu item is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      render(<ServicesTableAlianza services={mockServices} onDelete={onDelete} />);

      // Find and click the first dropdown trigger
      const dropdownTriggers = screen.getAllByRole('button');
      await user.click(dropdownTriggers[0]);

      // Find and click the delete option
      const deleteOption = await screen.findByText('Eliminar');
      await user.click(deleteOption);

      expect(onDelete).toHaveBeenCalledWith('service-1');
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('should not show edit option when onEdit is not provided', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      render(<ServicesTableAlianza services={mockServices} onDelete={onDelete} />);

      // Open dropdown
      const dropdownTriggers = screen.getAllByRole('button');
      await user.click(dropdownTriggers[0]);

      // Edit option should not be present
      const editOption = screen.queryByText('Editar');
      expect(editOption).not.toBeInTheDocument();
    });

    it('should not show delete option when onDelete is not provided', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();

      render(<ServicesTableAlianza services={mockServices} onEdit={onEdit} />);

      // Open dropdown
      const dropdownTriggers = screen.getAllByRole('button');
      await user.click(dropdownTriggers[0]);

      // Delete option should not be present
      const deleteOption = screen.queryByText('Eliminar');
      expect(deleteOption).not.toBeInTheDocument();
    });

    it('should open dropdown menu when trigger is clicked', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();

      render(<ServicesTableAlianza services={mockServices} onEdit={onEdit} />);

      // Find the first dropdown trigger
      const dropdownTriggers = screen.getAllByRole('button');
      await user.click(dropdownTriggers[0]);

      // Menu should be visible
      const editOption = await screen.findByText('Editar');
      expect(editOption).toBeVisible();
    });
  });

  // STATUSBADGE INLINE COMPONENT TESTS
  describe('StatusBadge Inline Component', () => {
    it('should render active badge with emerald colors', () => {
      render(<ServicesTableAlianza services={[mockServices[0]]} />);

      const badge = screen.getByText('Activo');

      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('px-2.5');
      expect(badge).toHaveClass('py-0.5');
      expect(badge).toHaveClass('rounded-full');
      expect(badge).toHaveClass('bg-emerald-100');
    });

    it('should render inactive badge with gray colors', () => {
      render(<ServicesTableAlianza services={[mockServices[1]]} />);

      const badge = screen.getByText('Inactivo');

      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('px-2.5');
      expect(badge).toHaveClass('py-0.5');
      expect(badge).toHaveClass('rounded-full');
      expect(badge).toHaveClass('bg-gray-100');
    });

    it('should display correct label for active status', () => {
      const customLabels = {
        service: 'Service',
        category: 'Category',
        status: 'Status',
        questions: 'Questions',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        active: 'Active Now',
        inactive: 'Not Active',
      };

      render(
        <ServicesTableAlianza services={[mockServices[0]]} labels={customLabels} />
      );

      expect(screen.getByText('Active Now')).toBeInTheDocument();
    });

    it('should display correct label for inactive status', () => {
      const customLabels = {
        service: 'Service',
        category: 'Category',
        status: 'Status',
        questions: 'Questions',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        active: 'Active Now',
        inactive: 'Not Active',
      };

      render(
        <ServicesTableAlianza services={[mockServices[1]]} labels={customLabels} />
      );

      expect(screen.getByText('Not Active')).toBeInTheDocument();
    });
  });

  // LABEL CUSTOMIZATION TESTS
  describe('Label Customization', () => {
    it('should use custom labels when provided', () => {
      const customLabels = {
        service: 'Custom Service',
        category: 'Custom Category',
        status: 'Custom Status',
        questions: 'Custom Questions',
        actions: 'Custom Actions',
        edit: 'Custom Edit',
        delete: 'Custom Delete',
        active: 'Custom Active',
        inactive: 'Custom Inactive',
      };

      render(<ServicesTableAlianza services={mockServices} labels={customLabels} />);

      expect(screen.getByText('Custom Service')).toBeInTheDocument();
      expect(screen.getByText('Custom Category')).toBeInTheDocument();
      expect(screen.getByText('Custom Status')).toBeInTheDocument();
      expect(screen.getByText('Custom Questions')).toBeInTheDocument();

      // "Custom Actions" appears multiple times (header + sr-only for each row)
      const customActionsElements = screen.getAllByText('Custom Actions');
      expect(customActionsElements.length).toBeGreaterThan(0);
    });

    it('should use default Spanish labels when not provided', () => {
      render(<ServicesTableAlianza services={mockServices} />);

      expect(screen.getByText('Servicio')).toBeInTheDocument();
      expect(screen.getByText('Categoría')).toBeInTheDocument();
      expect(screen.getByText('Estado')).toBeInTheDocument();
      expect(screen.getByText('Preguntas')).toBeInTheDocument();

      // "Acciones" appears multiple times (header + sr-only for each row)
      const accionesElements = screen.getAllByText('Acciones');
      expect(accionesElements.length).toBeGreaterThan(0);
    });
  });

  // ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('should have proper table structure', () => {
      render(<ServicesTableAlianza services={mockServices} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      const thead = table.querySelector('thead');
      expect(thead).toBeInTheDocument();

      const tbody = table.querySelector('tbody');
      expect(tbody).toBeInTheDocument();
    });

    it('should have correct number of table rows', () => {
      render(<ServicesTableAlianza services={mockServices} />);

      const rows = screen.getAllByRole('row');
      // 1 header row + 3 data rows = 4 total
      expect(rows).toHaveLength(4);
    });

    it('should have sr-only text for dropdown menu accessibility', () => {
      const onEdit = vi.fn();

      const { container } = render(<ServicesTableAlianza services={mockServices} onEdit={onEdit} />);

      // Check for screen reader text within dropdown buttons
      const srOnlyElements = container.querySelectorAll('.sr-only');
      const hasAccionesText = Array.from(srOnlyElements).some(el => el.textContent === 'Acciones');
      expect(hasAccionesText).toBe(true);
    });

    it('should have proper column headers', () => {
      render(<ServicesTableAlianza services={mockServices} />);

      const columnHeaders = screen.getAllByRole('columnheader');
      expect(columnHeaders).toHaveLength(5);
    });

    it('should apply hover styles for table rows', () => {
      const { container } = render(<ServicesTableAlianza services={mockServices} />);

      const tbody = container.querySelector('tbody');
      const rows = tbody?.querySelectorAll('tr');

      rows?.forEach(row => {
        expect(row).toHaveClass('group');
        expect(row).toHaveClass('hover:bg-muted/50');
      });
    });

    it('should have destructive styling for delete menu item', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      render(<ServicesTableAlianza services={mockServices} onDelete={onDelete} />);

      // Open dropdown
      const dropdownTriggers = screen.getAllByRole('button');
      await user.click(dropdownTriggers[0]);

      // Find delete option
      const deleteOption = await screen.findByText('Eliminar');
      expect(deleteOption).toHaveClass('text-destructive');
      expect(deleteOption).toHaveClass('focus:text-destructive');
    });
  });
});
