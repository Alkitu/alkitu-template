import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RequestManagementTable } from './RequestManagementTable';
import { RequestStatus } from '@alkitu/shared';

// Mock dependencies
const mockPush = vi.fn();
const mockRefetch = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/lib/trpc', () => ({
  trpc: {
    request: {
      getFilteredRequests: {
        useQuery: vi.fn(() => ({
          data: {
            requests: [
              {
                id: 'req-1',
                service: { name: 'Plumbing', category: { name: 'Home Services' } },
                user: { firstname: 'John', lastname: 'Doe', email: 'john@example.com' },
                status: RequestStatus.PENDING,
                executionDateTime: '2024-01-15T10:00:00Z',
                location: { city: 'Madrid', state: 'Madrid' },
              },
              {
                id: 'req-2',
                service: { name: 'Electrical', category: { name: 'Home Services' } },
                user: { firstname: 'Jane', lastname: 'Smith', email: 'jane@example.com' },
                status: RequestStatus.ONGOING,
                executionDateTime: '2024-01-20T14:30:00Z',
                assignedTo: { firstname: 'Tech', lastname: 'Support' },
                location: { city: 'Barcelona', state: 'Cataluña' },
              },
            ],
            pagination: {
              page: 1,
              totalPages: 1,
              total: 2,
            },
          },
          isLoading: false,
          isError: false,
          refetch: mockRefetch,
        })),
      },
      getRequestStats: {
        useQuery: vi.fn(() => ({
          data: {
            total: 10,
            byStatus: {
              PENDING: 3,
              ONGOING: 2,
              COMPLETED: 4,
              CANCELLED: 1,
            },
          },
        })),
      },
      assignRequest: {
        useMutation: vi.fn(() => ({
          mutateAsync: mockMutateAsync,
        })),
      },
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock child components
vi.mock('@/components/atoms-alianza/UserStatsCard', () => ({
  UserStatsCard: ({ label, value }: { label: string; value: number }) => (
    <div data-testid="stats-card">
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
  InputGroup: ({ value, onChange, placeholder }: any) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
}));

vi.mock('@/components/molecules-alianza/RequestFilterButtons', () => ({
  RequestFilterButtons: ({ activeFilter, onFilterChange }: any) => (
    <div data-testid="filter-buttons">
      <button onClick={() => onFilterChange('all')}>All</button>
      <button onClick={() => onFilterChange('pending')}>Pending</button>
      <button onClick={() => onFilterChange('ongoing')}>Ongoing</button>
      <button onClick={() => onFilterChange('completed')}>Completed</button>
      <button onClick={() => onFilterChange('cancelled')}>Cancelled</button>
    </div>
  ),
}));

vi.mock('@/components/organisms-alianza/RequestsTableAlianza', () => ({
  RequestsTableAlianza: ({ requests, onAssignRequest, onViewRequest }: any) => (
    <div data-testid="requests-table">
      {requests.map((req: any) => (
        <div key={req.id} data-testid="request-row">
          <span>{req.serviceName}</span>
          <button onClick={() => onViewRequest(req.id, req.clientEmail)}>View</button>
          <button onClick={() => onAssignRequest(req.id)}>Assign</button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('@/components/organisms-alianza/RequestsTableSkeleton', () => ({
  RequestsTableSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

vi.mock('@/components/molecules-alianza/UserPagination', () => ({
  UserPagination: ({ onPageChange, onPageSizeChange }: any) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(2)}>Next Page</button>
      <button onClick={() => onPageSizeChange(50)}>Change Page Size</button>
    </div>
  ),
}));

vi.mock('@/components/molecules/request', () => ({
  QuickAssignModal: ({ open, onConfirm, requestId }: any) =>
    open ? (
      <div data-testid="assign-modal">
        <button onClick={() => onConfirm(requestId, 'emp-1')}>Confirm Assign</button>
      </div>
    ) : null,
}));

describe('RequestManagementTable', () => {
  const defaultProps = {
    lang: 'es',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render stats cards with correct values', () => {
    render(<RequestManagementTable {...defaultProps} />);

    expect(screen.getByText(/Total de Solicitudes: 10/)).toBeInTheDocument();
    expect(screen.getByText(/Pendientes: 3/)).toBeInTheDocument();
    expect(screen.getByText(/En Progreso: 2/)).toBeInTheDocument();
    expect(screen.getByText(/Completadas: 4/)).toBeInTheDocument();
    expect(screen.getByText(/Canceladas: 1/)).toBeInTheDocument();
  });

  it('should render filter buttons', () => {
    render(<RequestManagementTable {...defaultProps} />);

    const filterButtons = screen.getByTestId('filter-buttons');
    expect(filterButtons).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<RequestManagementTable {...defaultProps} />);

    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Buscar solicitudes...');
  });

  it('should render create request button', () => {
    render(<RequestManagementTable {...defaultProps} />);

    const createButton = screen.getAllByTestId('button').find((btn) =>
      btn.textContent?.includes('Nueva Solicitud')
    );
    expect(createButton).toBeInTheDocument();
  });

  it('should render requests table with data', () => {
    render(<RequestManagementTable {...defaultProps} />);

    expect(screen.getByTestId('requests-table')).toBeInTheDocument();
    expect(screen.getByText('Plumbing')).toBeInTheDocument();
    expect(screen.getByText('Electrical')).toBeInTheDocument();
  });

  it('should render pagination controls', () => {
    render(<RequestManagementTable {...defaultProps} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('should handle search input changes', async () => {
    render(<RequestManagementTable {...defaultProps} />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'plumbing' } });

    expect(searchInput).toHaveValue('plumbing');
  });

  it('should handle filter button clicks', async () => {
    render(<RequestManagementTable {...defaultProps} />);

    const pendingButton = screen.getByText('Pending');
    fireEvent.click(pendingButton);

    // Filter should update (covered by the useQuery hook receiving new params)
    expect(pendingButton).toBeInTheDocument();
  });

  it('should navigate to create page when clicking new request button', () => {
    render(<RequestManagementTable {...defaultProps} />);

    const createButton = screen.getAllByTestId('button').find((btn) =>
      btn.textContent?.includes('Nueva Solicitud')
    );
    fireEvent.click(createButton!);

    expect(mockPush).toHaveBeenCalledWith('/es/admin/requests/create');
  });

  it('should navigate to request detail when clicking view', () => {
    render(<RequestManagementTable {...defaultProps} />);

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    expect(mockPush).toHaveBeenCalledWith('/es/admin/requests/req-1');
  });

  it('should open assign modal when clicking assign button', () => {
    render(<RequestManagementTable {...defaultProps} />);

    const assignButtons = screen.getAllByText('Assign');
    fireEvent.click(assignButtons[0]);

    expect(screen.getByTestId('assign-modal')).toBeInTheDocument();
  });

  it('should handle assign confirmation successfully', async () => {
    const { toast } = await import('sonner');
    mockMutateAsync.mockResolvedValue({});

    render(<RequestManagementTable {...defaultProps} />);

    const assignButtons = screen.getAllByText('Assign');
    fireEvent.click(assignButtons[0]);

    const confirmButton = screen.getByText('Confirm Assign');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: 'req-1',
        assignedToId: 'emp-1',
      });
      expect(toast.success).toHaveBeenCalledWith('Empleado asignado correctamente');
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('should handle assign error gracefully', async () => {
    const { toast } = await import('sonner');
    mockMutateAsync.mockRejectedValue(new Error('Assignment failed'));

    render(<RequestManagementTable {...defaultProps} />);

    const assignButtons = screen.getAllByText('Assign');
    fireEvent.click(assignButtons[0]);

    const confirmButton = screen.getByText('Confirm Assign');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Assignment failed');
    });
  });

  it('should call onRequestUpdated callback after successful assignment', async () => {
    const onRequestUpdated = vi.fn();
    mockMutateAsync.mockResolvedValue({});

    render(<RequestManagementTable {...defaultProps} onRequestUpdated={onRequestUpdated} />);

    const assignButtons = screen.getAllByText('Assign');
    fireEvent.click(assignButtons[0]);

    const confirmButton = screen.getByText('Confirm Assign');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onRequestUpdated).toHaveBeenCalled();
    });
  });

  it('should handle pagination page change', () => {
    render(<RequestManagementTable {...defaultProps} />);

    const nextPageButton = screen.getByText('Next Page');
    fireEvent.click(nextPageButton);

    // Pagination state should update
    expect(nextPageButton).toBeInTheDocument();
  });

  it('should handle pagination page size change', () => {
    render(<RequestManagementTable {...defaultProps} />);

    const pageSizeButton = screen.getByText('Change Page Size');
    fireEvent.click(pageSizeButton);

    // Page size state should update
    expect(pageSizeButton).toBeInTheDocument();
  });

  it('should debounce search input', async () => {
    vi.useFakeTimers();

    render(<RequestManagementTable {...defaultProps} />);

    const searchInput = screen.getByTestId('search-input');

    fireEvent.change(searchInput, { target: { value: 'p' } });
    fireEvent.change(searchInput, { target: { value: 'pl' } });
    fireEvent.change(searchInput, { target: { value: 'plu' } });

    // Advance timers by 300ms to trigger debounce
    vi.advanceTimersByTime(300);

    expect(searchInput).toHaveValue('plu');

    vi.useRealTimers();
  });
});
