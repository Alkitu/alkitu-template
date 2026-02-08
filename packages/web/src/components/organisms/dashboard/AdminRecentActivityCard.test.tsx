import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AdminRecentActivityCard } from './AdminRecentActivityCard';
import type { AdminRecentActivityCardProps } from './AdminRecentActivityCard.types';

describe('AdminRecentActivityCard', () => {
  const defaultProps: AdminRecentActivityCardProps = {
    title: 'Recent Activity',
    subtitle: 'Last 30 days',
    newUsersLabel: 'New users',
    newUsersCount: 12,
    totalUsers: 150,
    isLoading: false,
  };

  it('should render title and subtitle', () => {
    render(<AdminRecentActivityCard {...defaultProps} />);

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });

  it('should render new users label and count', () => {
    render(<AdminRecentActivityCard {...defaultProps} />);

    expect(screen.getByText('New users')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(<AdminRecentActivityCard {...defaultProps} isLoading={true} />);

    expect(screen.getByText('New users')).toBeInTheDocument();
    expect(screen.queryByText('12')).not.toBeInTheDocument();

    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('should calculate and display progress bar correctly', () => {
    const { container } = render(<AdminRecentActivityCard {...defaultProps} />);

    const progressBar = container.querySelector('.bg-orange-500');
    expect(progressBar).toBeInTheDocument();

    // 12/150 = 8%
    expect(progressBar).toHaveStyle({ width: '8%' });
  });

  it('should handle zero total users gracefully', () => {
    const { container } = render(
      <AdminRecentActivityCard {...defaultProps} totalUsers={0} />
    );

    const progressBar = container.querySelector('.bg-orange-500');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });

  it('should cap percentage at 100%', () => {
    const { container } = render(
      <AdminRecentActivityCard
        {...defaultProps}
        newUsersCount={200}
        totalUsers={100}
      />
    );

    const progressBar = container.querySelector('.bg-orange-500');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  it('should render TrendingUp icon', () => {
    const { container } = render(<AdminRecentActivityCard {...defaultProps} />);

    const icon = container.querySelector('.text-orange-600');
    expect(icon).toBeInTheDocument();
  });

  it('should render with zero new users', () => {
    render(<AdminRecentActivityCard {...defaultProps} newUsersCount={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should apply correct card styling', () => {
    const { container } = render(<AdminRecentActivityCard {...defaultProps} />);

    const card = container.querySelector('.p-6');
    expect(card).toBeInTheDocument();
  });

  it('should handle large numbers correctly', () => {
    render(
      <AdminRecentActivityCard
        {...defaultProps}
        newUsersCount={9999}
        totalUsers={100000}
      />
    );

    expect(screen.getByText('9999')).toBeInTheDocument();
  });

  it('should render with custom title and subtitle', () => {
    render(
      <AdminRecentActivityCard
        {...defaultProps}
        title="Custom Title"
        subtitle="Custom Subtitle"
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  it('should calculate percentage for equal values', () => {
    const { container } = render(
      <AdminRecentActivityCard
        {...defaultProps}
        newUsersCount={50}
        totalUsers={50}
      />
    );

    const progressBar = container.querySelector('.bg-orange-500');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });
});
