import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AdminUserDistributionCard } from './AdminUserDistributionCard';
import type { AdminUserDistributionCardProps, RoleDistribution } from './AdminUserDistributionCard.types';

describe('AdminUserDistributionCard', () => {
  const defaultRoles: RoleDistribution[] = [
    { label: 'Clients', count: 80, color: 'green' },
    { label: 'Employees', count: 50, color: 'purple' },
    { label: 'Admins', count: 5, color: 'red' },
  ];

  const defaultProps: AdminUserDistributionCardProps = {
    title: 'User Distribution',
    subtitle: 'By role type',
    roles: defaultRoles,
    totalUsers: 135,
    isLoading: false,
  };

  it('should render title and subtitle', () => {
    render(<AdminUserDistributionCard {...defaultProps} />);

    expect(screen.getByText('User Distribution')).toBeInTheDocument();
    expect(screen.getByText('By role type')).toBeInTheDocument();
  });

  it('should render all role labels', () => {
    render(<AdminUserDistributionCard {...defaultProps} />);

    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByText('Admins')).toBeInTheDocument();
  });

  it('should calculate and display percentages correctly', () => {
    render(<AdminUserDistributionCard {...defaultProps} />);

    // 80/135 ≈ 59%
    expect(screen.getByText('59%')).toBeInTheDocument();
    // 50/135 ≈ 37%
    expect(screen.getByText('37%')).toBeInTheDocument();
    // 5/135 ≈ 4%
    expect(screen.getByText('4%')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(<AdminUserDistributionCard {...defaultProps} isLoading={true} />);

    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.queryByText('59%')).not.toBeInTheDocument();

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should handle zero total users gracefully', () => {
    render(<AdminUserDistributionCard {...defaultProps} totalUsers={0} />);

    const percentages = screen.getAllByText('0%');
    expect(percentages.length).toBe(defaultRoles.length);
  });

  it('should apply correct color classes', () => {
    const { container } = render(<AdminUserDistributionCard {...defaultProps} />);

    expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-purple-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument();
  });

  it('should handle empty roles array', () => {
    render(<AdminUserDistributionCard {...defaultProps} roles={[]} />);

    expect(screen.getByText('User Distribution')).toBeInTheDocument();
  });

  it('should handle single role', () => {
    const singleRole: RoleDistribution[] = [
      { label: 'Admin', count: 100, color: 'blue' },
    ];

    render(
      <AdminUserDistributionCard {...defaultProps} roles={singleRole} totalUsers={100} />
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should render Users icon', () => {
    const { container } = render(<AdminUserDistributionCard {...defaultProps} />);

    const icon = container.querySelector('.text-indigo-600');
    expect(icon).toBeInTheDocument();
  });

  it('should handle unknown color gracefully', () => {
    const rolesWithUnknownColor: RoleDistribution[] = [
      { label: 'Test', count: 50, color: 'unknown-color' },
    ];

    const { container } = render(
      <AdminUserDistributionCard
        {...defaultProps}
        roles={rolesWithUnknownColor}
        totalUsers={100}
      />
    );

    // Should fallback to gray
    expect(container.querySelector('.bg-gray-500')).toBeInTheDocument();
  });

  it('should round percentages correctly', () => {
    const roles: RoleDistribution[] = [
      { label: 'Role 1', count: 33, color: 'green' },
      { label: 'Role 2', count: 33, color: 'blue' },
      { label: 'Role 3', count: 34, color: 'red' },
    ];

    render(<AdminUserDistributionCard {...defaultProps} roles={roles} totalUsers={100} />);

    const thirtyThree = screen.getAllByText('33%');
    expect(thirtyThree.length).toBe(2);
    expect(screen.getByText('34%')).toBeInTheDocument();
  });

  it('should render with custom title and subtitle', () => {
    render(
      <AdminUserDistributionCard
        {...defaultProps}
        title="Custom Distribution"
        subtitle="Custom Subtitle"
      />
    );

    expect(screen.getByText('Custom Distribution')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  it('should apply card styling', () => {
    const { container } = render(<AdminUserDistributionCard {...defaultProps} />);

    const card = container.querySelector('.p-6');
    expect(card).toBeInTheDocument();
  });

  it('should handle large numbers correctly', () => {
    const roles: RoleDistribution[] = [
      { label: 'Users', count: 9999, color: 'green' },
    ];

    render(
      <AdminUserDistributionCard {...defaultProps} roles={roles} totalUsers={10000} />
    );

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should handle all supported colors', () => {
    const roles: RoleDistribution[] = [
      { label: 'Green', count: 10, color: 'green' },
      { label: 'Purple', count: 10, color: 'purple' },
      { label: 'Red', count: 10, color: 'red' },
      { label: 'Blue', count: 10, color: 'blue' },
      { label: 'Orange', count: 10, color: 'orange' },
      { label: 'Yellow', count: 10, color: 'yellow' },
    ];

    const { container } = render(
      <AdminUserDistributionCard {...defaultProps} roles={roles} totalUsers={60} />
    );

    expect(container.querySelector('.bg-green-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-purple-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-blue-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-orange-500')).toBeInTheDocument();
    expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument();
  });
});
