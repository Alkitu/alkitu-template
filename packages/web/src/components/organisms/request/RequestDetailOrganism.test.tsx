import { renderWithProviders, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { RequestDetailOrganism } from './RequestDetailOrganism';
import type { RequestDetailOrganismProps } from './RequestDetailOrganism.types';
import { RequestStatus } from '@alkitu/shared';

// Mock tRPC
vi.mock('@/lib/trpc', () => ({
  trpc: {
    request: {
      getRequestById: {
        useQuery: vi.fn(),
      },
      assignRequest: {
        useMutation: vi.fn(),
      },
      updateRequestStatus: {
        useMutation: vi.fn(),
      },
      updateRequest: {
        useMutation: vi.fn(),
      },
    },
    service: {
      getAllServices: {
        useQuery: vi.fn(),
      },
    },
    location: {
      getAllLocations: {
        useQuery: vi.fn(),
      },
    },
    user: {
      getFilteredUsers: {
        useQuery: vi.fn(),
      },
    },
  },
}));

// Mock Sonner toast
vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock feature flag hook
vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: () => ({
    isEnabled: false,
  }),
}));

import { trpc } from '@/lib/trpc';

const mockRequest = {
  id: 'req-1',
  service: {
    id: 'service-1',
    name: 'Emergency Plumbing',
  },
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
    email: 'john.doe@example.com',
    phone: '+1234567890',
  },
  assignedTo: null,
  assignedToId: null,
  status: RequestStatus.PENDING,
  executionDateTime: new Date('2024-06-15T10:00:00Z'),
  createdAt: new Date('2024-06-01T08:00:00Z'),
  updatedAt: new Date('2024-06-01T08:00:00Z'),
  completedAt: null,
  note: 'Urgent repair needed',
};

describe('RequestDetailOrganism', () => {
  const defaultProps: RequestDetailOrganismProps = {
    requestId: 'req-1',
    userRole: 'EMPLOYEE' as any,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock for user.getFilteredUsers
    (trpc.user.getFilteredUsers.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
      error: null,
    });

    // Default mocks for inline edit hook dependencies
    (trpc.service.getAllServices.useQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
    });
    (trpc.location.getAllLocations.useQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
    });
    (trpc.request.updateRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it('should show loading state initially', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} />);

    // Component renders Loader2 with animate-spin class
    const loader = document.querySelector('.animate-spin');
    expect(loader).toBeInTheDocument();
  });

  it('should render request details after successful fetch', async () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} />);

    // Service name is rendered in uppercase
    expect(screen.getByText('EMERGENCY PLUMBING')).toBeInTheDocument();

    // Location details
    expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();

    // Client name is rendered separately (firstname and lastname)
    expect(screen.getByText(/John/i)).toBeInTheDocument();
    expect(screen.getByText(/Doe/i)).toBeInTheDocument();
  });

  it('should show error state on fetch failure', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: 'Failed to fetch request' },
      data: null,
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch request')).toBeInTheDocument();
  });

  it('should render back button when onBack provided', () => {
    const onBack = vi.fn();

    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} onBack={onBack} />);

    // Back button contains "VOLVER" text in uppercase
    const backButton = screen.getByText(/volver/i);
    expect(backButton).toBeInTheDocument();
  });

  it('should call onBack when back button clicked', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} onBack={onBack} />);

    // Find the button element containing "Volver" text
    const backButton = screen.getByText(/volver/i).closest('button');
    expect(backButton).toBeInTheDocument();
    if (backButton) {
      await user.click(backButton);
    }

    expect(onBack).toHaveBeenCalled();
  });

  it('should show assign button for EMPLOYEE/ADMIN', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} userRole={"EMPLOYEE" as any} />);

    // Button shows "Asignar Empleado" when no employee assigned
    expect(screen.getByText(/asignar empleado/i)).toBeInTheDocument();
  });

  it('should hide assign button for CLIENT', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} userRole={"CLIENT" as any} />);

    expect(screen.queryByText(/asignar empleado/i)).not.toBeInTheDocument();
  });

  it('should show change status button for EMPLOYEE/ADMIN', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} userRole={"ADMIN" as any} />);

    expect(screen.getByText(/cambiar estado/i)).toBeInTheDocument();
  });

  it('should render request timeline', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByText(/Estado de la Solicitud/i)).toBeInTheDocument();
  });

  it('should render client information', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByText(/Información del Cliente/i)).toBeInTheDocument();
    expect(screen.getByText(/John/i)).toBeInTheDocument();
    expect(screen.getByText(/Doe/i)).toBeInTheDocument();
  });

  it('should render service details', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByText(/Detalles del Servicio/i)).toBeInTheDocument();

    // Service name may appear multiple times in the UI
    const serviceName = screen.getAllByText(/Emergency Plumbing/i);
    expect(serviceName.length).toBeGreaterThan(0);
  });

  it('should render location details', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
    expect(screen.getByText(/Building A/i)).toBeInTheDocument();
  });

  it('should render assigned employee when present', () => {
    const requestWithEmployee = {
      ...mockRequest,
      assignedTo: {
        id: 'emp-1',
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane@example.com',
      },
      assignedToId: 'emp-1',
    };

    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: requestWithEmployee,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByText(/Empleado Asignado/i)).toBeInTheDocument();

    // Name may appear multiple times in the UI (e.g., in employee selector)
    const janeElements = screen.getAllByText(/Jane/i);
    const smithElements = screen.getAllByText(/Smith/i);
    expect(janeElements.length).toBeGreaterThan(0);
    expect(smithElements.length).toBeGreaterThan(0);
  });

  it('should render edit button for non-CLIENT users with editable status', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} userRole={"EMPLOYEE" as any} />);

    expect(screen.getByText(/editar/i)).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    const { container } = renderWithProviders(<RequestDetailOrganism {...defaultProps} className="custom-detail" />);

    expect(container.firstChild).toHaveClass('custom-detail');
  });

  it('should render request notes', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByText(/Urgent repair needed/i)).toBeInTheDocument();
  });

  it('should render evidence section', () => {
    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByText(/Fotos y Evidencia/i)).toBeInTheDocument();
  });

  it('should disable assign button for cancelled requests', () => {
    const cancelledRequest = {
      ...mockRequest,
      status: RequestStatus.CANCELLED,
    };

    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: cancelledRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} userRole={"EMPLOYEE" as any} />);

    // Button should not show for cancelled requests (canAssign is false)
    expect(screen.queryByText(/asignar empleado/i)).not.toBeInTheDocument();
  });

  it('should disable assign button for completed requests', () => {
    const completedRequest = {
      ...mockRequest,
      status: RequestStatus.COMPLETED,
    };

    (trpc.request.getRequestById.useQuery as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: completedRequest,
      refetch: vi.fn(),
    });

    (trpc.request.assignRequest.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    (trpc.request.updateRequestStatus.useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
    });

    renderWithProviders(<RequestDetailOrganism {...defaultProps} userRole={"EMPLOYEE" as any} />);

    // Button should not show for completed requests (canAssign is false)
    expect(screen.queryByText(/asignar empleado/i)).not.toBeInTheDocument();
  });
});
