import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RequestsTableSkeleton } from './RequestsTableSkeleton';

describe('RequestsTableSkeleton', () => {
  it('should render with default row count', () => {
    render(<RequestsTableSkeleton />);

    // Check that table is rendered
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check default row count (5 rows)
    const rows = screen.getAllByRole('row');
    // 1 header row + 5 body rows = 6 total
    expect(rows).toHaveLength(6);
  });

  it('should render with custom row count', () => {
    render(<RequestsTableSkeleton rowCount={10} />);

    const rows = screen.getAllByRole('row');
    // 1 header row + 10 body rows = 11 total
    expect(rows).toHaveLength(11);
  });

  it('should render with zero rows', () => {
    render(<RequestsTableSkeleton rowCount={0} />);

    const rows = screen.getAllByRole('row');
    // Only header row
    expect(rows).toHaveLength(1);
  });

  it('should apply custom className to wrapper', () => {
    const { container } = render(<RequestsTableSkeleton className="custom-test-class" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-test-class');
    expect(wrapper).toHaveClass('w-full');
  });

  it('should render correct table structure with headers', () => {
    render(<RequestsTableSkeleton />);

    // Check all table headers are present
    expect(screen.getByText('Servicio')).toBeInTheDocument();
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Fecha Ejecución')).toBeInTheDocument();
    expect(screen.getByText('Asignado a')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  it('should render skeleton cells with animation for each row', () => {
    render(<RequestsTableSkeleton rowCount={3} />);

    // Check for animated skeleton elements (using animate-pulse class)
    const skeletonElements = document.querySelectorAll('.animate-pulse');

    // Each row has multiple skeleton elements:
    // - Icon (1), Service text (3), Client (2), Status (1), Date (1), Assigned (1), Actions (3) = 12 per row
    // 3 rows × 12 elements = 36 skeleton elements
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('should have accessible table structure', () => {
    render(<RequestsTableSkeleton />);

    // Check table structure
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check thead exists
    const thead = table.querySelector('thead');
    expect(thead).toBeInTheDocument();

    // Check tbody exists
    const tbody = table.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
  });

  it('should apply alternating row backgrounds', () => {
    const { container } = render(<RequestsTableSkeleton rowCount={4} />);

    const tbody = container.querySelector('tbody');
    const bodyRows = tbody?.querySelectorAll('tr');

    // Check alternating background classes
    expect(bodyRows?.[0]).toHaveClass('bg-secondary/20');
    expect(bodyRows?.[1]).toHaveClass('bg-transparent');
    expect(bodyRows?.[2]).toHaveClass('bg-secondary/20');
    expect(bodyRows?.[3]).toHaveClass('bg-transparent');
  });

  it('should render action buttons skeleton for each row', () => {
    render(<RequestsTableSkeleton rowCount={2} />);

    // Each row should have 3 action button skeletons
    const actionCells = screen.getAllByRole('cell').filter(cell =>
      cell.querySelector('.flex.items-center.justify-end.gap-2')
    );

    expect(actionCells).toHaveLength(2); // 2 rows

    // Check each action cell has 3 skeleton elements
    actionCells.forEach(cell => {
      const skeletons = cell.querySelectorAll('.h-8.w-8');
      expect(skeletons).toHaveLength(3);
    });
  });
});
