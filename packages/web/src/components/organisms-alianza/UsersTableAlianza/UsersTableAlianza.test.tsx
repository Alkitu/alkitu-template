import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsersTableAlianza } from './UsersTableAlianza';
import type { UserTableItem } from './UsersTableAlianza.types';

// Mock UserAvatar component
vi.mock('@/components/molecules-alianza/UserAvatar', () => ({
  UserAvatar: ({ name, lastName, size }: { name: string; lastName?: string; size?: string }) => (
    <div data-testid="user-avatar" data-name={name} data-lastname={lastName} data-size={size}>
      Avatar: {name} {lastName}
    </div>
  ),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('UsersTableAlianza', () => {
  const mockUsers: UserTableItem[] = [
    {
      id: 'user-1',
      name: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'ADMIN',
      phone: '+1234567890',
    },
    {
      id: 'user-2',
      name: 'Jane',
      lastName: null,
      email: 'jane@example.com',
      role: 'EMPLOYEE',
      phone: null,
    },
    {
      id: 'user-3',
      name: null,
      lastName: null,
      email: 'noname@example.com',
      role: 'CLIENT',
      phone: '+9876543210',
    },
  ];

  const mockRoleLabels = {
    ADMIN: 'Administrator',
    EMPLOYEE: 'Employee',
    CLIENT: 'Client',
  };

  const mockLabels = {
    user: 'User',
    role: 'Role',
    phone: 'Phone',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
  };

  // ====================================
  // 1. RENDERING TESTS (4 tests)
  // ====================================

  it('should render users list with all users', () => {
    render(
      <UsersTableAlianza
        users={mockUsers}
        lang="en"
      />
    );

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check that all users are rendered (3 data rows + 1 header row = 4 total)
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4);

    // Verify each user's email is displayed
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('noname@example.com')).toBeInTheDocument();
  });

  it('should render with empty users array', () => {
    render(
      <UsersTableAlianza
        users={[]}
        lang="en"
      />
    );

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Only header row should be present
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });

  it('should render with custom className', () => {
    const { container } = render(
      <UsersTableAlianza
        users={mockUsers}
        lang="en"
        className="custom-class"
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
    expect(wrapper).toHaveClass('w-full');
  });

  it('should render correct table structure with headers', () => {
    render(
      <UsersTableAlianza
        users={mockUsers}
        lang="en"
        labels={mockLabels}
      />
    );

    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(4);

    // Check for all column headers
    expect(headers[0]).toHaveTextContent('User');
    expect(headers[1]).toHaveTextContent('Role');
    expect(headers[2]).toHaveTextContent('Phone');
    expect(headers[3]).toHaveTextContent('Actions');
  });

  // ====================================
  // 2. DISPLAY TESTS (5 tests)
  // ====================================

  it('should display user avatar with correct props', () => {
    render(
      <UsersTableAlianza
        users={[mockUsers[0]]}
        lang="en"
      />
    );

    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('data-name', 'John');
    expect(avatar).toHaveAttribute('data-lastname', 'Doe');
    expect(avatar).toHaveAttribute('data-size', 'md');
  });

  it('should display user name and email correctly', () => {
    render(
      <UsersTableAlianza
        users={[mockUsers[0]]}
        lang="en"
      />
    );

    // Check for name (link text)
    const nameLink = screen.getByRole('link', { name: 'John Doe' });
    expect(nameLink).toBeInTheDocument();

    // Check for email (separate text)
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should map role labels correctly', () => {
    render(
      <UsersTableAlianza
        users={mockUsers}
        lang="en"
        roleLabels={mockRoleLabels}
      />
    );

    expect(screen.getByText('Administrator')).toBeInTheDocument();
    expect(screen.getByText('Employee')).toBeInTheDocument();
    expect(screen.getByText('Client')).toBeInTheDocument();
  });

  it('should display phone number when present', () => {
    render(
      <UsersTableAlianza
        users={[mockUsers[0]]}
        lang="en"
      />
    );

    expect(screen.getByText('+1234567890')).toBeInTheDocument();
  });

  it('should display phone fallback (dash) when phone is null', () => {
    render(
      <UsersTableAlianza
        users={[mockUsers[1]]}
        lang="en"
      />
    );

    const rows = screen.getAllByRole('row');
    const bodyRow = rows[1]; // Skip header
    const cells = within(bodyRow).getAllByRole('cell');
    const phoneCell = cells[2]; // Phone is the 3rd column

    expect(phoneCell).toHaveTextContent('—');
  });

  // ====================================
  // 3. HELPER FUNCTION TESTS (2 tests)
  // ====================================

  it('should use getDisplayName helper - full name when both available', () => {
    render(
      <UsersTableAlianza
        users={[mockUsers[0]]}
        lang="en"
      />
    );

    // Should display "John Doe"
    expect(screen.getByRole('link', { name: 'John Doe' })).toBeInTheDocument();
  });

  it('should use getDisplayName helper - email fallback when name is null', () => {
    render(
      <UsersTableAlianza
        users={[mockUsers[2]]}
        lang="en"
      />
    );

    // Should display email username part (before @)
    expect(screen.getByRole('link', { name: 'noname' })).toBeInTheDocument();
  });

  it('should use getRoleLabel helper - fallback to role when not in mapping', () => {
    const userWithUnknownRole: UserTableItem = {
      id: 'user-4',
      name: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'UNKNOWN_ROLE',
      phone: null,
    };

    render(
      <UsersTableAlianza
        users={[userWithUnknownRole]}
        lang="en"
        roleLabels={mockRoleLabels}
      />
    );

    // Should display the raw role string when not in mapping
    expect(screen.getByText('UNKNOWN_ROLE')).toBeInTheDocument();
  });

  // ====================================
  // 4. INTERACTION TESTS (3 tests)
  // ====================================

  it('should call onEditUser with correct user id and email when edit is clicked', async () => {
    const user = userEvent.setup();
    const mockEditCallback = vi.fn();

    render(
      <UsersTableAlianza
        users={[mockUsers[0]]}
        lang="en"
        onEditUser={mockEditCallback}
        labels={mockLabels}
      />
    );

    // Open dropdown menu
    const dropdownTrigger = screen.getByRole('button', { name: /actions/i });
    await user.click(dropdownTrigger);

    // Click edit option
    const editOption = screen.getByText('Edit');
    await user.click(editOption);

    expect(mockEditCallback).toHaveBeenCalledWith('user-1', 'john@example.com');
    expect(mockEditCallback).toHaveBeenCalledTimes(1);
  });

  it('should call onDeleteUser with correct user id when delete is clicked', async () => {
    const user = userEvent.setup();
    const mockDeleteCallback = vi.fn();

    render(
      <UsersTableAlianza
        users={[mockUsers[0]]}
        lang="en"
        onDeleteUser={mockDeleteCallback}
        labels={mockLabels}
      />
    );

    // Open dropdown menu
    const dropdownTrigger = screen.getByRole('button', { name: /actions/i });
    await user.click(dropdownTrigger);

    // Click delete option
    const deleteOption = screen.getByText('Delete');
    await user.click(deleteOption);

    expect(mockDeleteCallback).toHaveBeenCalledWith('user-1');
    expect(mockDeleteCallback).toHaveBeenCalledTimes(1);
  });

  it('should create correct link to user detail page', () => {
    render(
      <UsersTableAlianza
        users={[mockUsers[0]]}
        lang="en"
      />
    );

    const nameLink = screen.getByRole('link', { name: 'John Doe' });
    expect(nameLink).toHaveAttribute('href', '/en/admin/users/john%40example.com');
  });

  // ====================================
  // 5. ACCESSIBILITY TESTS (2 tests)
  // ====================================

  it('should have accessible table structure with thead and tbody', () => {
    const { container } = render(
      <UsersTableAlianza
        users={mockUsers}
        lang="en"
      />
    );

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check for thead
    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();

    // Check for tbody
    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
  });

  it('should have accessible table headers with columnheader role', () => {
    render(
      <UsersTableAlianza
        users={mockUsers}
        lang="en"
        labels={mockLabels}
      />
    );

    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(4);

    // Verify header text content
    expect(headers[0]).toHaveTextContent('User');
    expect(headers[1]).toHaveTextContent('Role');
    expect(headers[2]).toHaveTextContent('Phone');
    expect(headers[3]).toHaveTextContent('Actions');
  });

  // ====================================
  // 6. EDGE CASES & CONDITIONAL RENDERING (2 tests)
  // ====================================

  it('should not render edit option when onEditUser is not provided', async () => {
    const user = userEvent.setup();

    render(
      <UsersTableAlianza
        users={[mockUsers[0]]}
        lang="en"
        onDeleteUser={vi.fn()}
        labels={mockLabels}
      />
    );

    // Open dropdown menu
    const dropdownTrigger = screen.getByRole('button', { name: /actions/i });
    await user.click(dropdownTrigger);

    // Edit option should not exist
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    // Delete should still be there
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should not render delete option when onDeleteUser is not provided', async () => {
    const user = userEvent.setup();

    render(
      <UsersTableAlianza
        users={[mockUsers[0]]}
        lang="en"
        onEditUser={vi.fn()}
        labels={mockLabels}
      />
    );

    // Open dropdown menu
    const dropdownTrigger = screen.getByRole('button', { name: /actions/i });
    await user.click(dropdownTrigger);

    // Delete option should not exist
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    // Edit should still be there
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});
