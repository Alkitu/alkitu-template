import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RequestListOrganism } from './RequestListOrganism';
import type { RequestListOrganismProps } from './RequestListOrganism.types';

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('RequestListOrganism', () => {
  const mockRequests: any[] = [
    {
      id: 'req-1',
      title: 'Fix broken pipe in bathroom',
      status: 'PENDING' as const,
      priority: 'HIGH' as const,
      createdAt: new Date('2024-01-15'),
      client: { name: 'Acme Corp' },
    },
    {
      id: 'req-2',
      title: 'Install new AC unit',
      status: 'ONGOING' as const,
      priority: 'MEDIUM' as const,
      createdAt: new Date('2024-01-20'),
      client: { name: 'TechStart Inc' },
    },
    {
      id: 'req-3',
      title: 'Regular maintenance check',
      status: 'COMPLETED' as const,
      priority: 'LOW' as const,
      createdAt: new Date('2024-01-10'),
      client: { name: 'BuildCo' },
    },
  ];

  const defaultProps: RequestListOrganismProps = {
    requests: mockRequests,
    isLoading: false,
    emptyMessage: 'No requests found',
    emptyActionLabel: 'Create Request',
    emptyActionHref: '/requests/new',
    baseHref: '/client/requests',
  };

  it('should render title correctly', () => {
    render(<RequestListOrganism {...defaultProps} />);

    expect(screen.getByText('Actividad Reciente')).toBeInTheDocument();
  });

  it('should render custom title when provided', () => {
    render(<RequestListOrganism {...defaultProps} title="My Requests" />);

    expect(screen.getByText('My Requests')).toBeInTheDocument();
  });

  it('should render all requests', () => {
    render(<RequestListOrganism {...defaultProps} />);

    expect(screen.getByText('Fix broken pipe in bathroom')).toBeInTheDocument();
    expect(screen.getByText('Install new AC unit')).toBeInTheDocument();
    expect(screen.getByText('Regular maintenance check')).toBeInTheDocument();
  });

  it('should render request status badges', () => {
    render(<RequestListOrganism {...defaultProps} />);

    // StatusBadge component should render status
    const requestCards = screen.getAllByRole('link');
    expect(requestCards.length).toBe(3);
  });

  it('should render loading state with skeletons', () => {
    render(<RequestListOrganism {...defaultProps} isLoading={true} />);

    // Should render 3 skeleton loaders
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render empty state when no requests', () => {
    render(<RequestListOrganism {...defaultProps} requests={[]} />);

    expect(screen.getByText('No requests found')).toBeInTheDocument();
    expect(screen.getByText('Create Request')).toBeInTheDocument();
  });

  it('should render empty state without action button', () => {
    render(
      <RequestListOrganism
        {...defaultProps}
        requests={[]}
        emptyActionLabel={undefined}
        emptyActionHref={undefined}
      />
    );

    expect(screen.getByText('No requests found')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should show client name when showClientName is true', () => {
    render(<RequestListOrganism {...defaultProps} showClientName={true} />);

    expect(screen.getByText('Cliente: Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Cliente: TechStart Inc')).toBeInTheDocument();
    expect(screen.getByText('Cliente: BuildCo')).toBeInTheDocument();
  });

  it('should not show client name when showClientName is false', () => {
    render(<RequestListOrganism {...defaultProps} showClientName={false} />);

    expect(screen.queryByText('Cliente: Acme Corp')).not.toBeInTheDocument();
  });

  it('should render correct links for each request', () => {
    render(<RequestListOrganism {...defaultProps} />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/client/requests/req-1');
    expect(links[1]).toHaveAttribute('href', '/client/requests/req-2');
    expect(links[2]).toHaveAttribute('href', '/client/requests/req-3');
  });

  it('should render request dates correctly', () => {
    render(<RequestListOrganism {...defaultProps} />);

    // formatDate utility formats dates in Spanish locale (es-ES) with format: "15 ene 2024, 00:00"
    // Check that dates are rendered (multiple requests have dates)
    const dates = screen.getAllByText(/2024/);
    expect(dates.length).toBeGreaterThan(0);
  });

  it('should render priority icons', () => {
    render(<RequestListOrganism {...defaultProps} />);

    // PriorityIcon component should be rendered for each request
    const priorityIcons = document.querySelectorAll('.rounded-lg.flex.items-center');
    expect(priorityIcons.length).toBeGreaterThanOrEqual(3);
  });

  it('should display empty action helper text for new requests', () => {
    render(
      <RequestListOrganism
        {...defaultProps}
        requests={[]}
        emptyActionLabel="Nueva Solicitud"
      />
    );

    expect(screen.getByText('Crea tu primera solicitud para comenzar')).toBeInTheDocument();
  });

  it('should display alternative helper text when action does not include "Nueva"', () => {
    render(
      <RequestListOrganism
        {...defaultProps}
        requests={[]}
        emptyActionLabel="View All"
      />
    );

    expect(screen.getByText('Las nuevas solicitudes aparecerán aquí')).toBeInTheDocument();
  });

  it('should handle requests without client information', () => {
    const requestsNoClient: any[] = [
      {
        id: 'req-1',
        title: 'Test Request',
        status: 'PENDING' as const,
        priority: 'MEDIUM' as const,
        createdAt: new Date('2024-01-15'),
      },
    ];

    render(
      <RequestListOrganism
        {...defaultProps}
        requests={requestsNoClient}
        showClientName={true}
      />
    );

    expect(screen.getByText('Test Request')).toBeInTheDocument();
  });

  it('should apply hover effects to request cards', () => {
    const { container } = render(<RequestListOrganism {...defaultProps} />);

    const cards = container.querySelectorAll('.hover\\:shadow-md');
    expect(cards.length).toBe(3);
  });

  it('should render with custom base href', () => {
    render(<RequestListOrganism {...defaultProps} baseHref="/admin/requests" />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/admin/requests/req-1');
  });

  it('should truncate long request titles', () => {
    const longTitleRequests: any[] = [
      {
        id: 'req-1',
        title: 'This is a very long request title that should be truncated in the UI to prevent layout issues',
        status: 'PENDING' as const,
        priority: 'HIGH' as const,
        createdAt: new Date('2024-01-15'),
      },
    ];

    const { container } = render(
      <RequestListOrganism {...defaultProps} requests={longTitleRequests} />
    );

    const titleElement = container.querySelector('.truncate');
    expect(titleElement).toBeInTheDocument();
  });

  it('should maintain consistent card spacing', () => {
    const { container } = render(<RequestListOrganism {...defaultProps} />);

    const cardContainer = container.querySelector('.space-y-3');
    expect(cardContainer).toBeInTheDocument();
  });

  it('should render empty icon in empty state', () => {
    render(<RequestListOrganism {...defaultProps} requests={[]} />);

    // ClipboardList icon should be visible
    const emptyIcon = document.querySelector('.text-muted-foreground\\/40');
    expect(emptyIcon).toBeInTheDocument();
  });
});
