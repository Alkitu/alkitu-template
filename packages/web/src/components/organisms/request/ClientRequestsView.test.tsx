import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ClientRequestsView } from './ClientRequestsView';
import type { ClientRequestsViewProps } from './ClientRequestsView.types';
import { RequestStatus } from '@alkitu/shared';
import { TranslationsProvider } from '@/context/TranslationsContext';

// Mock tRPC
vi.mock('@/lib/trpc', () => ({
  trpc: {
    request: {
      getFilteredRequests: {
        useQuery: vi.fn(),
      },
    },
  },
}));

// Mock fetch
global.fetch = vi.fn();

import { trpc } from '@/lib/trpc';

// Test wrapper with TranslationsProvider
const mockTranslations = {
  requests: {
    title: 'Service Requests',
    subtitle: 'Manage your service requests',
    filters: {
      all: 'All',
      pending: 'Pending',
      active: 'Active',
      completed: 'Completed',
    },
    empty: {
      message: 'No requests found',
      action: 'Create Request',
    },
    loading: 'Loading requests...',
    error: 'Failed to load requests',
    actions: {
      viewDetails: 'View Details',
      cancel: 'Cancel',
      assign: 'Assign',
      complete: 'Complete',
      assignedTo: 'Assigned to',
    },
    cancel: {
      title: 'Cancel Request',
      description: 'Please provide a reason for canceling this request.',
      reason: 'Cancellation Reason',
      reasonPlaceholder: 'Explain why this request is being canceled...',
      reasonRequired: 'Please provide a reason for cancellation',
      back: 'Back',
      confirm: 'Cancel Request',
      canceling: 'Canceling...',
    },
  },
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TranslationsProvider initialLocale="en" initialTranslations={mockTranslations}>
    {children}
  </TranslationsProvider>
);

const renderWithProviders = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: TestWrapper, ...options });

const mockRequests = [
  {
    id: 'req-1',
    service: { id: 'service-1', name: 'Plumbing' },
    location: {
      id: 'loc-1',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      building: 'Building A',
    },
    user: {
      id: 'user-1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
    },
    assignedTo: null,
    assignedToId: null,
    status: RequestStatus.PENDING,
    executionDateTime: new Date('2024-06-15T10:00:00Z'),
    createdAt: new Date('2024-06-01T08:00:00Z'),
    updatedAt: new Date('2024-06-01T08:00:00Z'),
    completedAt: null,
    note: 'Fix leak',
  },
  {
    id: 'req-2',
    service: { id: 'service-2', name: 'Electrical' },
    location: {
      id: 'loc-1',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      building: 'Building A',
    },
    user: {
      id: 'user-1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
    },
    assignedTo: { id: 'emp-1', firstname: 'Jane', lastname: 'Smith' },
    assignedToId: 'emp-1',
    status: RequestStatus.ONGOING,
    executionDateTime: new Date('2024-06-16T14:00:00Z'),
    createdAt: new Date('2024-06-02T09:00:00Z'),
    updatedAt: new Date('2024-06-03T10:00:00Z'),
    completedAt: null,
    note: 'Replace wiring',
  },
];

describe('ClientRequestsView', () => {
  const defaultProps: ClientRequestsViewProps = {
    onRequestClick: vi.fn(),
    onCreateRequest: vi.fn(),
    filterLabels: {
      all: 'All',
      pending: 'Pending',
      active: 'Active',
      completed: 'Completed',
    },
    emptyStateMessage: 'No requests found',
    emptyStateAction: 'Create Request',
    loadingMessage: 'Loading requests...',
    errorMessage: 'Failed to load requests',
  };

  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  it('renders loading state initially', () => {
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    expect(screen.getByText('Loading requests...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeDisabled();
  });

  it('renders error state when query fails', () => {
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Network error' },
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('renders empty state when no requests exist', () => {
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: { requests: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    expect(screen.getByText('No requests found')).toBeInTheDocument();
    expect(screen.getByText(/get started by creating your first service request/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /create request/i }).length).toBeGreaterThan(0);
  });

  it('renders request list when data is available', () => {
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: { requests: mockRequests },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    expect(screen.getByText(/showing 2 requests/i)).toBeInTheDocument();
  });

  it('calls onCreateRequest when create button is clicked', async () => {
    const user = userEvent.setup();
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: { requests: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    const createButtons = screen.getAllByRole('button', { name: /create request/i });
    await user.click(createButtons[0]);

    expect(defaultProps.onCreateRequest).toHaveBeenCalledTimes(1);
  });

  it('opens and closes filter panel', async () => {
    const user = userEvent.setup();
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: { requests: mockRequests },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    // Open filters
    const filterButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filterButton);

    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('filters requests by status', async () => {
    const user = userEvent.setup();
    const mockUseQuery = vi.fn();

    (trpc.request.getFilteredRequests.useQuery as any).mockImplementation(mockUseQuery);

    mockUseQuery.mockReturnValue({
      data: { requests: mockRequests },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    // Open filters
    const filterButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filterButton);

    // Select pending status
    const statusSelect = screen.getByRole('combobox');
    await user.selectOptions(statusSelect, RequestStatus.PENDING);

    // Verify the query was called with the correct filter
    await waitFor(() => {
      const lastCall = mockUseQuery.mock.calls[mockUseQuery.mock.calls.length - 1];
      expect(lastCall[0].status).toBe(RequestStatus.PENDING);
    });
  });

  it('clears filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    const mockUseQuery = vi.fn();

    (trpc.request.getFilteredRequests.useQuery as any).mockImplementation(mockUseQuery);

    mockUseQuery.mockReturnValue({
      data: { requests: mockRequests },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    // Open filters
    const filterButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filterButton);

    // Select a filter
    const statusSelect = screen.getByRole('combobox');
    await user.selectOptions(statusSelect, RequestStatus.PENDING);

    // Clear filters
    const clearButton = screen.getByRole('button', { name: /clear all/i });
    await user.click(clearButton);

    // Verify filters are cleared
    await waitFor(() => {
      const lastCall = mockUseQuery.mock.calls[mockUseQuery.mock.calls.length - 1];
      expect(lastCall[0].status).toBeUndefined();
    });
  });

  it('calls refetch when refresh button is clicked', async () => {
    const user = userEvent.setup();
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: { requests: mockRequests },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('shows active filter badge when filter is applied', async () => {
    const user = userEvent.setup();
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: { requests: mockRequests },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    // Open filters
    const filterButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filterButton);

    // Apply filter
    const statusSelect = screen.getByRole('combobox');
    await user.selectOptions(statusSelect, RequestStatus.PENDING);

    // Check for badge
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('displays correct empty state message when filters are active', async () => {
    const user = userEvent.setup();
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: { requests: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    // Open and apply filter
    const filterButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filterButton);

    const statusSelect = screen.getByRole('combobox');
    await user.selectOptions(statusSelect, RequestStatus.PENDING);

    // Check empty state message
    await waitFor(() => {
      expect(screen.getByText('No matching requests')).toBeInTheDocument();
      expect(screen.getByText(/try adjusting your filters/i)).toBeInTheDocument();
    });
  });

  it('renders with custom filter labels', () => {
    const customLabels = {
      all: 'Todas',
      pending: 'Pendientes',
      active: 'Activas',
      completed: 'Completadas',
    };

    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: { requests: mockRequests },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} filterLabels={customLabels} />);

    // This verifies the component accepts custom labels
    expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: { requests: mockRequests },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    const { container } = renderWithProviders(<ClientRequestsView {...defaultProps} className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('displays singular "request" when count is 1', () => {
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: { requests: [mockRequests[0]] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    expect(screen.getByText(/showing 1 request$/i)).toBeInTheDocument();
  });

  it('displays plural "requests" when count is greater than 1', () => {
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: { requests: mockRequests },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    expect(screen.getByText(/showing 2 requests/i)).toBeInTheDocument();
  });

  it('uses default error message when none provided in error object', () => {
    (trpc.request.getFilteredRequests.useQuery as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: {},
      refetch: mockRefetch,
    });

    renderWithProviders(<ClientRequestsView {...defaultProps} />);

    expect(screen.getByText('Failed to load requests')).toBeInTheDocument();
  });
});
