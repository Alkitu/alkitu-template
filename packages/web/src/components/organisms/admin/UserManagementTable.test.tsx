import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserManagementTable } from './UserManagementTable';
import type { UserManagementLabels } from './UserManagementTable.types';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.mock('@/lib/trpc', () => ({
  trpc: {
    user: {
      getFilteredUsers: {
        useQuery: vi.fn(),
      },
      getUserStats: {
        useQuery: vi.fn(),
      },
      bulkDeleteUsers: {
        useMutation: vi.fn(),
      },
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock child components
vi.mock('@/components/atoms-alianza/UserStatsCard', () => ({
  UserStatsCard: ({ label, value }: any) => (
    <div data-testid="user-stats-card">
      {label}: {value}
    </div>
  ),
}));

vi.mock('@/components/molecules-alianza/Button', () => ({
  Button: ({ children, onClick, iconLeft }: any) => (
    <button onClick={onClick} data-testid="button">
      {iconLeft}
      {children}
    </button>
  ),
}));

vi.mock('@/components/molecules-alianza/InputGroup', () => ({
  InputGroup: ({ placeholder, value, onChange, iconLeft }: any) => (
    <div>
      {iconLeft}
      <input
        data-testid="search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  ),
}));

vi.mock('@/components/molecules-alianza/UserFilterButtons', () => ({
  UserFilterButtons: ({ activeFilter, onFilterChange }: any) => (
    <div data-testid="filter-buttons">
      <button onClick={() => onFilterChange('all')}>All</button>
      <button onClick={() => onFilterChange('admin')}>Admin</button>
      <button onClick={() => onFilterChange('employee')}>Employee</button>
      <button onClick={() => onFilterChange('client')}>Client</button>
    </div>
  ),
}));

vi.mock('@/components/organisms-alianza/UsersTableAlianza', () => ({
  UsersTableAlianza: ({ users, onEditUser, onDeleteUser }: any) => (
    <div data-testid="users-table">
      {users.map((user: any) => (
        <div key={user.id} data-testid={`user-row-${user.id}`}>
          <span>{user.email}</span>
          <button onClick={() => onEditUser(user.id, user.email)}>Edit</button>
          <button onClick={() => onDeleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('@/components/organisms-alianza/UsersTableSkeleton', () => ({
  UsersTableSkeleton: () => <div data-testid="table-skeleton">Loading...</div>,
}));

vi.mock('@/components/molecules-alianza/UserPagination', () => ({
  UserPagination: ({ currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

const mockLabels: UserManagementLabels = {
  table: {
    user: 'User',
    role: 'Role',
    phone: 'Phone',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
  },
  roles: {
    ADMIN: 'Administrator',
    EMPLOYEE: 'Employee',
    CLIENT: 'Client',
    LEAD: 'Lead',
  },
  filters: {
    all: 'All',
    admin: 'Administrators',
    employee: 'Employees',
    client: 'Clients',
  },
  stats: {
    total: 'Total Users',
    admins: 'Administrators',
    employees: 'Employees',
    clients: 'Clients',
  },
  actions: {
    search: 'Search users...',
    createUser: 'Create new user',
  },
  deleteConfirm: 'Are you sure you want to delete this user?',
  deleteSuccess: 'User deleted successfully',
  deleteError: 'Error loading users',
};

const mockUsers = [
  {
    id: '1',
    email: 'admin@test.com',
    firstname: 'John',
    lastname: 'Doe',
    phone: '123-456-7890',
    role: 'ADMIN',
  },
  {
    id: '2',
    email: 'employee@test.com',
    firstname: 'Jane',
    lastname: 'Smith',
    phone: '098-765-4321',
    role: 'EMPLOYEE',
  },
];

const mockUsersData = {
  users: mockUsers,
  pagination: {
    page: 1,
    totalPages: 5,
    total: 100,
    limit: 20,
  },
};

const mockStatsData = {
  total: 100,
  byRole: {
    ADMIN: 10,
    EMPLOYEE: 30,
    CLIENT: 60,
  },
};

describe('UserManagementTable', () => {
  let mockPush: any;
  let mockRefetch: any;
  let mockMutateAsync: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockPush = vi.fn();
    mockRefetch = vi.fn();
    mockMutateAsync = vi.fn();

    const { trpc } = await import('@/lib/trpc');
    const { useRouter } = await import('next/navigation');

    (useRouter as any).mockReturnValue({ push: mockPush });

    (trpc.user.getFilteredUsers.useQuery as any).mockReturnValue({
      data: mockUsersData,
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });

    (trpc.user.getUserStats.useQuery as any).mockReturnValue({
      data: mockStatsData,
    });

    (trpc.user.bulkDeleteUsers.useMutation as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    // Mock window.confirm
    global.confirm = vi.fn(() => true);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Rendering', () => {
    it('should render stats cards with correct values', () => {
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const statsCards = screen.getAllByTestId('user-stats-card');
      expect(statsCards).toHaveLength(4);
      expect(statsCards[0]).toHaveTextContent('Total Users: 100');
      expect(statsCards[1]).toHaveTextContent('Administrators: 10');
      expect(statsCards[2]).toHaveTextContent('Employees: 30');
      expect(statsCards[3]).toHaveTextContent('Clients: 60');
    });

    it('should render filter buttons', () => {
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const filterButtons = screen.getByTestId('filter-buttons');
      expect(filterButtons).toBeInTheDocument();
    });

    it('should render search input with correct placeholder', () => {
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveAttribute('placeholder', 'Search users...');
    });

    it('should render create user button', () => {
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const buttons = screen.getAllByTestId('button');
      const createButton = buttons.find((btn) =>
        btn.textContent?.includes('Create new user')
      );
      expect(createButton).toBeInTheDocument();
    });

    it('should render users table with user data', () => {
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const table = screen.getByTestId('users-table');
      expect(table).toBeInTheDocument();
      expect(screen.getByTestId('user-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('user-row-2')).toBeInTheDocument();
    });

    it('should render pagination controls', () => {
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const pagination = screen.getByTestId('pagination');
      expect(pagination).toBeInTheDocument();
      expect(pagination).toHaveTextContent('Page 1 of 5');
    });
  });

  describe('Loading State', () => {
    it('should render skeleton when loading', async () => {
      const { trpc } = await import('@/lib/trpc');

      (trpc.user.getFilteredUsers.useQuery as any).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: mockRefetch,
      });

      render(<UserManagementTable lang="es" labels={mockLabels} />);

      expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('users-table')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should render error message when query fails', async () => {
      const { trpc } = await import('@/lib/trpc');

      (trpc.user.getFilteredUsers.useQuery as any).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch: mockRefetch,
      });

      render(<UserManagementTable lang="es" labels={mockLabels} />);

      expect(screen.getByText('Error loading users')).toBeInTheDocument();
      expect(screen.queryByTestId('users-table')).not.toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should update search value on input change', async () => {
      const user = userEvent.setup();
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'test query');

      expect(searchInput).toHaveValue('test query');
    });

    it('should debounce search query', async () => {
      const { trpc } = await import('@/lib/trpc');

      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'test');

      // Should not call immediately
      expect(trpc.user.getFilteredUsers.useQuery).toHaveBeenCalledTimes(1);

      // Fast-forward time
      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(trpc.user.getFilteredUsers.useQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            search: 'test',
            page: 1,
          })
        );
      });

      vi.useRealTimers();
    });
  });

  describe('Filter Functionality', () => {
    it('should filter users by admin role', async () => {
      const { trpc } = await import('@/lib/trpc');
      const user = userEvent.setup();
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const filterButtons = screen.getByTestId('filter-buttons');
      const adminButton = within(filterButtons).getByText('Admin');

      await user.click(adminButton);

      await waitFor(() => {
        expect(trpc.user.getFilteredUsers.useQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            role: 'ADMIN',
          })
        );
      });
    });

    it('should filter users by employee role', async () => {
      const { trpc } = await import('@/lib/trpc');
      const user = userEvent.setup();
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const filterButtons = screen.getByTestId('filter-buttons');
      const employeeButton = within(filterButtons).getByText('Employee');

      await user.click(employeeButton);

      await waitFor(() => {
        expect(trpc.user.getFilteredUsers.useQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            role: 'EMPLOYEE',
          })
        );
      });
    });

    it('should show all users when all filter is selected', async () => {
      const { trpc } = await import('@/lib/trpc');
      const user = userEvent.setup();
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const filterButtons = screen.getByTestId('filter-buttons');
      const allButton = within(filterButtons).getByText('All');

      await user.click(allButton);

      await waitFor(() => {
        const lastCall =
          (trpc.user.getFilteredUsers.useQuery as any).mock.calls[
            (trpc.user.getFilteredUsers.useQuery as any).mock.calls.length - 1
          ][0];
        expect(lastCall).not.toHaveProperty('role');
      });
    });
  });

  describe('User Actions', () => {
    it('should navigate to create user page when create button is clicked', async () => {
      const user = userEvent.setup();
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const buttons = screen.getAllByTestId('button');
      const createButton = buttons.find((btn) =>
        btn.textContent?.includes('Create new user')
      );

      await user.click(createButton!);

      expect(mockPush).toHaveBeenCalledWith('/es/admin/users/create');
    });

    it('should navigate to edit user page when edit is clicked', async () => {
      const user = userEvent.setup();
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const userRow = screen.getByTestId('user-row-1');
      const editButton = within(userRow).getByText('Edit');

      await user.click(editButton);

      expect(mockPush).toHaveBeenCalledWith('/es/admin/users/admin%40test.com');
    });

    it('should delete user when delete is confirmed', async () => {
      const { toast } = await import('sonner');
      const user = userEvent.setup();
      mockMutateAsync.mockResolvedValue({});

      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const userRow = screen.getByTestId('user-row-1');
      const deleteButton = within(userRow).getByText('Delete');

      await user.click(deleteButton);

      expect(global.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete this user?'
      );
      expect(mockMutateAsync).toHaveBeenCalledWith({ userIds: ['1'] });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('User deleted successfully');
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it('should not delete user when delete is cancelled', async () => {
      const user = userEvent.setup();
      global.confirm = vi.fn(() => false);

      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const userRow = screen.getByTestId('user-row-1');
      const deleteButton = within(userRow).getByText('Delete');

      await user.click(deleteButton);

      expect(global.confirm).toHaveBeenCalled();
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('should show error toast when delete fails', async () => {
      const { toast } = await import('sonner');
      const user = userEvent.setup();
      mockMutateAsync.mockRejectedValue(new Error('Delete failed'));

      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const userRow = screen.getByTestId('user-row-1');
      const deleteButton = within(userRow).getByText('Delete');

      await user.click(deleteButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error loading users');
      });
    });
  });

  describe('Pagination', () => {
    it('should change page when pagination is clicked', async () => {
      const { trpc } = await import('@/lib/trpc');
      const user = userEvent.setup();
      render(<UserManagementTable lang="es" labels={mockLabels} />);

      const pagination = screen.getByTestId('pagination');
      const nextButton = within(pagination).getByText('Next');

      await user.click(nextButton);

      await waitFor(() => {
        expect(trpc.user.getFilteredUsers.useQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            page: 2,
          })
        );
      });
    });
  });

  describe('Callbacks', () => {
    it('should call onUserCreated when create button is clicked', async () => {
      const user = userEvent.setup();
      const onUserCreated = vi.fn();

      render(
        <UserManagementTable
          lang="es"
          labels={mockLabels}
          onUserCreated={onUserCreated}
        />
      );

      const buttons = screen.getAllByTestId('button');
      const createButton = buttons.find((btn) =>
        btn.textContent?.includes('Create new user')
      );

      await user.click(createButton!);

      expect(onUserCreated).toHaveBeenCalled();
    });

    it('should call onUserDeleted when user is successfully deleted', async () => {
      const user = userEvent.setup();
      const onUserDeleted = vi.fn();
      mockMutateAsync.mockResolvedValue({});

      render(
        <UserManagementTable
          lang="es"
          labels={mockLabels}
          onUserDeleted={onUserDeleted}
        />
      );

      const userRow = screen.getByTestId('user-row-1');
      const deleteButton = within(userRow).getByText('Delete');

      await user.click(deleteButton);

      await waitFor(() => {
        expect(onUserDeleted).toHaveBeenCalled();
      });
    });
  });
});
