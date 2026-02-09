import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RequestsTableAlianza } from './RequestsTableAlianza';
import type { RequestTableItem } from './RequestsTableAlianza.types';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Eye: ({ className }: { className?: string }) => (
    <span data-testid="eye-icon" className={className} />
  ),
  UserPlus: ({ className }: { className?: string }) => (
    <span data-testid="user-plus-icon" className={className} />
  ),
  CheckCircle: ({ className }: { className?: string }) => (
    <span data-testid="check-circle-icon" className={className} />
  ),
  XCircle: ({ className }: { className?: string }) => (
    <span data-testid="x-circle-icon" className={className} />
  ),
  Clock: ({ className }: { className?: string }) => (
    <span data-testid="clock-icon" className={className} />
  ),
  MapPin: ({ className }: { className?: string }) => (
    <span data-testid="map-pin-icon" className={className} />
  ),
  Pencil: ({ className }: { className?: string }) => (
    <span data-testid="pencil-icon" className={className} />
  ),
  UserCog: ({ className }: { className?: string }) => (
    <span data-testid="user-cog-icon" className={className} />
  ),
}));

// Mock ServiceIcon component
vi.mock('@/components/atoms-alianza/ServiceIcon', () => ({
  ServiceIcon: ({ category, className }: { category: string; className?: string }) => (
    <span data-testid={`service-icon-${category}`} className={className}>
      {category}
    </span>
  ),
}));

// Mock data
const mockRequests: RequestTableItem[] = [
  {
    id: 'req-1',
    serviceName: 'Test Service',
    categoryName: 'Mantenimiento',
    clientName: 'John Doe',
    clientEmail: 'john@example.com',
    status: 'PENDING',
    executionDateTime: '2024-01-15T10:00:00Z',
    executionTime: '10:00 AM',
    locationCity: 'Escazú',
    locationState: 'San José',
    assignedTo: 'Jane Smith',
  },
  {
    id: 'req-2',
    serviceName: 'Another Service',
    categoryName: 'Limpieza',
    clientName: 'Jane Doe',
    clientEmail: 'jane@example.com',
    status: 'ONGOING',
    executionDateTime: '2024-01-20T14:00:00Z',
    assignedTo: 'Bob Johnson',
  },
];

describe('RequestsTableAlianza', () => {
  // Test 1: Default rendering
  it('should render table with requests', () => {
    render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('Another Service')).toBeInTheDocument();
  });

  // Test 2: Empty state
  it('should handle empty requests array', () => {
    render(
      <RequestsTableAlianza
        requests={[]}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('No se encontraron solicitudes')).toBeInTheDocument();
  });

  // Test 3: Status badge rendering - PENDING
  it('should display PENDING status badge correctly', () => {
    const pendingRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'PENDING' },
    ];

    render(
      <RequestsTableAlianza
        requests={pendingRequest}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    const badge = screen.getByText('Pendiente');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800', 'border-yellow-200');
  });

  // Test 4: Status badge rendering - ONGOING
  it('should display ONGOING status badge correctly', () => {
    const ongoingRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'ONGOING' },
    ];

    render(
      <RequestsTableAlianza
        requests={ongoingRequest}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    const badge = screen.getByText('En Progreso');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800', 'border-blue-200');
  });

  // Test 5: Status badge rendering - COMPLETED
  it('should display COMPLETED status badge correctly', () => {
    const completedRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'COMPLETED' },
    ];

    render(
      <RequestsTableAlianza
        requests={completedRequest}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    const badge = screen.getByText('Completada');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'border-green-200');
  });

  // Test 6: Status badge rendering - CANCELLED
  it('should display CANCELLED status badge correctly', () => {
    const cancelledRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'CANCELLED' },
    ];

    render(
      <RequestsTableAlianza
        requests={cancelledRequest}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    const badge = screen.getByText('Cancelada');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-800', 'border-red-200');
  });

  // Test 7: Service icon rendering
  it('should render service icon for each request', () => {
    render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    expect(screen.getByTestId('service-icon-Mantenimiento')).toBeInTheDocument();
    expect(screen.getByTestId('service-icon-Limpieza')).toBeInTheDocument();
  });

  // Test 8: Client information display
  it('should display client name and email correctly', () => {
    render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  // Test 9: Date formatting
  it('should format created date correctly', () => {
    render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    // Check that formatted dates are rendered (getAllByText for multiple dates)
    const formattedDates = screen.getAllByText(/ene/i); // January in Spanish
    expect(formattedDates.length).toBeGreaterThan(0);
    expect(formattedDates[0]).toBeInTheDocument();
  });

  // Test 10: Assigned employee display
  it('should display assigned employee name', () => {
    render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  // Test 11: Unassigned request display
  it('should display "Sin asignar" for unassigned requests', () => {
    const unassignedRequest: RequestTableItem[] = [
      { ...mockRequests[0], assignedTo: undefined },
    ];

    render(
      <RequestsTableAlianza
        requests={unassignedRequest}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    expect(screen.getByText('Sin asignar')).toBeInTheDocument();
  });

  // Test 12: View request callback
  it('should call onViewRequest when view button is clicked', async () => {
    const user = userEvent.setup();
    const onViewRequest = vi.fn();

    render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={onViewRequest}
      />
    );

    const viewButtons = screen.getAllByTitle('Ver detalles');
    await user.click(viewButtons[0]);

    expect(onViewRequest).toHaveBeenCalledWith('req-1', 'john@example.com');
  });

  // Test 13: Assign request callback for PENDING status
  it('should call onAssignRequest when assign button is clicked for PENDING request', async () => {
    const user = userEvent.setup();
    const onAssignRequest = vi.fn();
    const pendingRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'PENDING' },
    ];

    render(
      <RequestsTableAlianza
        requests={pendingRequest}
        lang="en"
        onViewRequest={vi.fn()}
        onAssignRequest={onAssignRequest}
      />
    );

    const assignButton = screen.getByTitle('Asignar');
    await user.click(assignButton);

    expect(onAssignRequest).toHaveBeenCalledWith('req-1');
  });

  // Test 14: Complete request callback for ONGOING status
  it('should call onCompleteRequest when complete button is clicked for ONGOING request', async () => {
    const user = userEvent.setup();
    const onCompleteRequest = vi.fn();
    const ongoingRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'ONGOING' },
    ];

    render(
      <RequestsTableAlianza
        requests={ongoingRequest}
        lang="en"
        onViewRequest={vi.fn()}
        onCompleteRequest={onCompleteRequest}
      />
    );

    const completeButton = screen.getByTitle('Completar');
    await user.click(completeButton);

    expect(onCompleteRequest).toHaveBeenCalledWith('req-1');
  });

  // Test 15: Cancel request callback for PENDING status
  it('should call onCancelRequest when cancel button is clicked for PENDING request', async () => {
    const user = userEvent.setup();
    const onCancelRequest = vi.fn();
    const pendingRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'PENDING' },
    ];

    render(
      <RequestsTableAlianza
        requests={pendingRequest}
        lang="en"
        onViewRequest={vi.fn()}
        onCancelRequest={onCancelRequest}
      />
    );

    const cancelButton = screen.getByTitle('Cancelar');
    await user.click(cancelButton);

    expect(onCancelRequest).toHaveBeenCalledWith('req-1');
  });

  // Test 16: Cancel request callback for ONGOING status
  it('should call onCancelRequest when cancel button is clicked for ONGOING request', async () => {
    const user = userEvent.setup();
    const onCancelRequest = vi.fn();
    const ongoingRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'ONGOING' },
    ];

    render(
      <RequestsTableAlianza
        requests={ongoingRequest}
        lang="en"
        onViewRequest={vi.fn()}
        onCancelRequest={onCancelRequest}
      />
    );

    const cancelButton = screen.getByTitle('Cancelar');
    await user.click(cancelButton);

    expect(onCancelRequest).toHaveBeenCalledWith('req-1');
  });

  // Test 17: Edit request callback
  it('should call onEditRequest when edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEditRequest = vi.fn();

    render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
        onEditRequest={onEditRequest}
      />
    );

    const editButtons = screen.getAllByTitle('Editar solicitud');
    await user.click(editButtons[0]);

    expect(onEditRequest).toHaveBeenCalledWith('req-1');
  });

  // Test 18: Edit button only shown when onEditRequest is provided
  it('should not show edit button when onEditRequest is not provided', () => {
    render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    expect(screen.queryByTitle('Editar solicitud')).not.toBeInTheDocument();
  });

  // Test 19: Assign button only shown for PENDING requests
  it('should only show assign button for PENDING requests', () => {
    const mixedRequests: RequestTableItem[] = [
      { ...mockRequests[0], status: 'PENDING' },
      { ...mockRequests[1], status: 'ONGOING' },
    ];

    render(
      <RequestsTableAlianza
        requests={mixedRequests}
        lang="en"
        onViewRequest={vi.fn()}
        onAssignRequest={vi.fn()}
      />
    );

    const assignButtons = screen.queryAllByTitle('Asignar');
    expect(assignButtons).toHaveLength(1);
  });

  // Test 20: Complete button only shown for ONGOING requests
  it('should only show complete button for ONGOING requests', () => {
    const mixedRequests: RequestTableItem[] = [
      { ...mockRequests[0], status: 'PENDING' },
      { ...mockRequests[1], status: 'ONGOING' },
    ];

    render(
      <RequestsTableAlianza
        requests={mixedRequests}
        lang="en"
        onViewRequest={vi.fn()}
        onCompleteRequest={vi.fn()}
      />
    );

    const completeButtons = screen.queryAllByTitle('Completar');
    expect(completeButtons).toHaveLength(1);
  });

  // Test 21: Cancel button not shown for COMPLETED requests
  it('should not show cancel button for COMPLETED requests', () => {
    const completedRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'COMPLETED' },
    ];

    render(
      <RequestsTableAlianza
        requests={completedRequest}
        lang="en"
        onViewRequest={vi.fn()}
        onCancelRequest={vi.fn()}
      />
    );

    expect(screen.queryByTitle('Cancelar')).not.toBeInTheDocument();
  });

  // Test 22: Cancel button not shown for CANCELLED requests
  it('should not show cancel button for CANCELLED requests', () => {
    const cancelledRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'CANCELLED' },
    ];

    render(
      <RequestsTableAlianza
        requests={cancelledRequest}
        lang="en"
        onViewRequest={vi.fn()}
        onCancelRequest={vi.fn()}
      />
    );

    expect(screen.queryByTitle('Cancelar')).not.toBeInTheDocument();
  });

  // Test 23: Custom className
  it('should apply custom className', () => {
    const { container } = render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
        className="custom-test-class"
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-test-class');
  });

  // Test 24: Accessible table structure
  it('should have accessible table structure with proper headings', () => {
    render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Servicio')).toBeInTheDocument();
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Fecha Ejecución')).toBeInTheDocument();
    expect(screen.getByText('Asignado a')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  // Test 25: Display execution time when provided
  it('should display execution time when provided', () => {
    render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  // Test 26: Display location when provided
  it('should display location city and state when provided', () => {
    render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    expect(screen.getByText(/Escazú, San José/)).toBeInTheDocument();
    expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
  });

  // Test 27: Display category name
  it('should display category name for each service', () => {
    render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    // Category names appear twice: in the icon mock and in the category label
    const mantenimientoElements = screen.getAllByText('Mantenimiento');
    expect(mantenimientoElements.length).toBeGreaterThan(0);

    const limpiezaElements = screen.getAllByText('Limpieza');
    expect(limpiezaElements.length).toBeGreaterThan(0);
  });

  // Test 28: Reassign button for assigned PENDING/ONGOING requests
  it('should show reassign button (UserCog icon) for assigned non-completed requests', async () => {
    const user = userEvent.setup();
    const onAssignRequest = vi.fn();
    const assignedPendingRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'PENDING', assignedTo: 'John Smith' },
    ];

    render(
      <RequestsTableAlianza
        requests={assignedPendingRequest}
        lang="en"
        onViewRequest={vi.fn()}
        onAssignRequest={onAssignRequest}
      />
    );

    const reassignButton = screen.getByTitle('Cambiar empleado asignado');
    expect(reassignButton).toBeInTheDocument();

    await user.click(reassignButton);
    expect(onAssignRequest).toHaveBeenCalledWith('req-1');
  });

  // Test 29: No reassign button for COMPLETED requests
  it('should not show reassign button for COMPLETED requests', () => {
    const completedRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'COMPLETED', assignedTo: 'John Smith' },
    ];

    render(
      <RequestsTableAlianza
        requests={completedRequest}
        lang="en"
        onViewRequest={vi.fn()}
        onAssignRequest={vi.fn()}
      />
    );

    expect(screen.queryByTitle('Cambiar empleado asignado')).not.toBeInTheDocument();
  });

  // Test 30: No reassign button for CANCELLED requests
  it('should not show reassign button for CANCELLED requests', () => {
    const cancelledRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'CANCELLED', assignedTo: 'John Smith' },
    ];

    render(
      <RequestsTableAlianza
        requests={cancelledRequest}
        lang="en"
        onViewRequest={vi.fn()}
        onAssignRequest={vi.fn()}
      />
    );

    expect(screen.queryByTitle('Cambiar empleado asignado')).not.toBeInTheDocument();
  });

  // Test 31: Multiple requests render correctly
  it('should render multiple requests with alternating row colors', () => {
    const { container } = render(
      <RequestsTableAlianza
        requests={mockRequests}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveClass('bg-secondary/20');
    expect(rows[1]).toHaveClass('bg-transparent');
  });

  // Test 32: Client email is optional
  it('should render correctly when client email is not provided', () => {
    const requestWithoutEmail: RequestTableItem[] = [
      { ...mockRequests[0], clientEmail: undefined },
    ];

    render(
      <RequestsTableAlianza
        requests={requestWithoutEmail}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
  });

  // Test 33: onViewRequest called with empty string when email is missing
  it('should call onViewRequest with empty string when client email is missing', async () => {
    const user = userEvent.setup();
    const onViewRequest = vi.fn();
    const requestWithoutEmail: RequestTableItem[] = [
      { ...mockRequests[0], clientEmail: undefined },
    ];

    render(
      <RequestsTableAlianza
        requests={requestWithoutEmail}
        lang="en"
        onViewRequest={onViewRequest}
      />
    );

    const viewButton = screen.getByTitle('Ver detalles');
    await user.click(viewButton);

    expect(onViewRequest).toHaveBeenCalledWith('req-1', '');
  });

  // Test 34: Unknown status defaults to PENDING badge
  it('should default to PENDING badge for unknown status', () => {
    const unknownStatusRequest: RequestTableItem[] = [
      { ...mockRequests[0], status: 'UNKNOWN' as any },
    ];

    render(
      <RequestsTableAlianza
        requests={unknownStatusRequest}
        lang="en"
        onViewRequest={vi.fn()}
      />
    );

    // Should fallback to PENDING styling
    const badge = screen.getByText('Pendiente');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800', 'border-yellow-200');
  });
});
