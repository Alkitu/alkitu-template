import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { UsersTableSkeleton } from './UsersTableSkeleton';

describe('UsersTableSkeleton', () => {
  it('should render with default row count', () => {
    render(<UsersTableSkeleton />);

    // Check that table is rendered
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check default row count (5 rows)
    const rows = screen.getAllByRole('row');
    // 1 header row + 5 body rows = 6 total
    expect(rows).toHaveLength(6);
  });

  it('should render with custom row count', () => {
    render(<UsersTableSkeleton rowCount={10} />);

    const rows = screen.getAllByRole('row');
    // 1 header row + 10 body rows = 11 total
    expect(rows).toHaveLength(11);
  });

  it('should render with zero rows', () => {
    render(<UsersTableSkeleton rowCount={0} />);

    const rows = screen.getAllByRole('row');
    // Only header row
    expect(rows).toHaveLength(1);
  });

  it('should render correct table structure with header skeletons', () => {
    render(<UsersTableSkeleton />);

    // Check table structure
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check for header row
    const headerRow = screen.getAllByRole('row')[0];
    expect(headerRow).toHaveClass('bg-secondary');

    // Check for 4 column headers (User, Role, Phone, Actions)
    const headers = within(headerRow).getAllByRole('columnheader');
    expect(headers).toHaveLength(4);
  });

  it('should render skeleton elements for each row', () => {
    render(<UsersTableSkeleton rowCount={3} />);

    const rows = screen.getAllByRole('row');
    const bodyRows = rows.slice(1); // Skip header row

    // Each body row should have 4 cells
    bodyRows.forEach(row => {
      const cells = within(row).getAllByRole('cell');
      expect(cells).toHaveLength(4);
    });
  });

  it('should render user column with avatar and text skeletons', () => {
    render(<UsersTableSkeleton rowCount={2} />);

    const rows = screen.getAllByRole('row');
    const bodyRows = rows.slice(1);

    bodyRows.forEach(row => {
      const cells = within(row).getAllByRole('cell');
      const userCell = cells[0];

      // Check for avatar skeleton (rounded-full)
      const avatar = userCell.querySelector('.rounded-full');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveClass('size-10');

      // Check for text skeletons (2 lines: name and email)
      const textSkeletons = userCell.querySelectorAll('.flex.flex-col.gap-2 > *');
      expect(textSkeletons).toHaveLength(2);
    });
  });

  it('should have accessible table structure', () => {
    render(<UsersTableSkeleton />);

    // Check table structure
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check for header
    const header = table.querySelector('thead');
    expect(header).toBeInTheDocument();

    // Check for body
    const tbody = table.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
  });

  it('should render sticky header and actions column', () => {
    const { container } = render(<UsersTableSkeleton />);

    // Check header row has sticky positioning
    const headerRow = container.querySelector('.sticky.top-0');
    expect(headerRow).toBeInTheDocument();

    // Check last header (Actions) has sticky right positioning
    const actionHeader = container.querySelector('.sticky.right-0.z-20');
    expect(actionHeader).toBeInTheDocument();
  });

  it('should render action column with single skeleton button', () => {
    render(<UsersTableSkeleton rowCount={3} />);

    const rows = screen.getAllByRole('row');
    const bodyRows = rows.slice(1);

    bodyRows.forEach(row => {
      const cells = within(row).getAllByRole('cell');
      const actionCell = cells[3]; // Last cell

      // Check for action button skeleton
      const actionButton = actionCell.querySelector('.h-8.w-8.rounded-full');
      expect(actionButton).toBeInTheDocument();
    });
  });

  it('should render wrapper with correct classes', () => {
    const { container } = render(<UsersTableSkeleton />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('w-full');
    expect(wrapper).toHaveClass('relative');
    expect(wrapper).toHaveClass('max-h-[600px]');
    expect(wrapper).toHaveClass('overflow-auto');
  });
});
