import { render, screen, waitFor } from '@testing-library/react';
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
    },
  },
}));

// Mock toast hook
vi.mock('@/components/primitives/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
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
    userRole: 'EMPLOYEE',
  };

  beforeEach(() => {
    vi.clearAllMocks();
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

    render(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // Loader icon
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

    render(<RequestDetailOrganism {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/EMERGENCY PLUMBING/i)).toBeInTheDocument();
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
    });
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

    render(<RequestDetailOrganism {...defaultProps} />);

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

    render(<RequestDetailOrganism {...defaultProps} onBack={onBack} />);

    const backButton = screen.getByRole('button', { name: /volver/i });
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

    render(<RequestDetailOrganism {...defaultProps} onBack={onBack} />);

    const backButton = screen.getByRole('button', { name: /volver/i });
    await user.click(backButton);

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

    render(<RequestDetailOrganism {...defaultProps} userRole="EMPLOYEE" />);

    expect(screen.getByRole('button', { name: /asignar empleado/i })).toBeInTheDocument();
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

    render(<RequestDetailOrganism {...defaultProps} userRole="CLIENT" />);

    expect(screen.queryByRole('button', { name: /asignar empleado/i })).not.toBeInTheDocument();
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

    render(<RequestDetailOrganism {...defaultProps} userRole="ADMIN" />);

    expect(screen.getByRole('button', { name: /cambiar estado/i })).toBeInTheDocument();
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

    render(<RequestDetailOrganism {...defaultProps} />);

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

    render(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByText(/Información del Cliente/i)).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
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

    render(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByText(/Detalles del Servicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency Plumbing/i)).toBeInTheDocument();
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

    render(<RequestDetailOrganism {...defaultProps} />);

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

    render(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByText(/Empleado Asignado/i)).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should render edit button when onEdit provided and user is not CLIENT', () => {
    const onEdit = vi.fn();

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

    render(<RequestDetailOrganism {...defaultProps} onEdit={onEdit} userRole="EMPLOYEE" />);

    expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
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

    const { container } = render(<RequestDetailOrganism {...defaultProps} className="custom-detail" />);

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

    render(<RequestDetailOrganism {...defaultProps} />);

    expect(screen.getByText('Urgent repair needed')).toBeInTheDocument();
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

    render(<RequestDetailOrganism {...defaultProps} />);

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

    render(<RequestDetailOrganism {...defaultProps} userRole="EMPLOYEE" />);

    expect(screen.queryByRole('button', { name: /asignar empleado/i })).not.toBeInTheDocument();
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

    render(<RequestDetailOrganism {...defaultProps} userRole="EMPLOYEE" />);

    expect(screen.queryByRole('button', { name: /asignar empleado/i })).not.toBeInTheDocument();
  });
});
