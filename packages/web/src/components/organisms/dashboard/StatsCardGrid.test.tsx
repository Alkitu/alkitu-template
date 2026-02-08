import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatsCardGrid } from './StatsCardGrid';
import type { StatsCardGridProps } from './StatsCardGrid.types';
import { Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

describe('StatsCardGrid', () => {
  const defaultStats: StatsCardGridProps['stats'] = [
    {
      label: 'Active Requests',
      value: 12,
      icon: Clock,
      iconColor: 'text-orange-500',
      subtitle: 'In progress',
    },
    {
      label: 'Completed',
      value: 45,
      icon: CheckCircle,
      iconColor: 'text-green-500',
      subtitle: 'This month',
    },
    {
      label: 'Pending',
      value: 8,
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
    },
  ];

  const defaultProps: StatsCardGridProps = {
    stats: defaultStats,
    isLoading: false,
  };

  it('should render all stat cards correctly', () => {
    render(<StatsCardGrid {...defaultProps} />);

    expect(screen.getByText('Active Requests')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('This month')).toBeInTheDocument();

    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('should render with loading state', () => {
    render(<StatsCardGrid stats={defaultStats} isLoading={true} />);

    // StatCard component should handle loading state - label still shows, but value is replaced with skeleton
    expect(screen.getByText('Active Requests')).toBeInTheDocument();
    expect(screen.queryByText('12')).not.toBeInTheDocument();
    // Skeleton should be visible
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render with custom columns', () => {
    const { container } = render(
      <StatsCardGrid {...defaultProps} columns={4} />
    );

    const gridElement = container.querySelector('.grid');
    expect(gridElement).toHaveClass('lg:grid-cols-4');
  });

  it('should apply default grid columns when not specified', () => {
    const { container } = render(<StatsCardGrid {...defaultProps} />);

    const gridElement = container.querySelector('.grid');
    expect(gridElement).toHaveClass('grid-cols-1');
    expect(gridElement).toHaveClass('md:grid-cols-3');
  });

  it('should render with custom className', () => {
    const { container } = render(
      <StatsCardGrid {...defaultProps} className="custom-class" />
    );

    const gridElement = container.querySelector('.grid');
    expect(gridElement).toHaveClass('custom-class');
  });

  it('should render single stat card', () => {
    const singleStat: StatsCardGridProps = {
      stats: [
        {
          label: 'Total Users',
          value: 150,
          icon: TrendingUp,
          iconColor: 'text-blue-500',
        },
      ],
      isLoading: false,
    };

    render(<StatsCardGrid {...singleStat} />);

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('should render empty stats array', () => {
    const { container } = render(
      <StatsCardGrid stats={[]} isLoading={false} />
    );

    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeInTheDocument();
    expect(gridElement?.children.length).toBe(0);
  });

  it('should render stats with trend information', () => {
    const statsWithTrend: StatsCardGridProps = {
      stats: [
        {
          label: 'Revenue',
          value: 25000,
          icon: TrendingUp,
          iconColor: 'text-green-500',
          subtitle: 'This month',
          trend: '+15%',
        },
      ],
      isLoading: false,
    };

    render(<StatsCardGrid {...statsWithTrend} />);

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('25000')).toBeInTheDocument();
    expect(screen.getByText('+15%')).toBeInTheDocument();
  });

  it('should render stats without subtitle', () => {
    const statsNoSubtitle: StatsCardGridProps = {
      stats: [
        {
          label: 'Total',
          value: 100,
          icon: CheckCircle,
          iconColor: 'text-blue-500',
        },
      ],
      isLoading: false,
    };

    render(<StatsCardGrid {...statsNoSubtitle} />);

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should handle large numbers', () => {
    const largeNumberStats: StatsCardGridProps = {
      stats: [
        {
          label: 'Page Views',
          value: 1234567,
          icon: TrendingUp,
          iconColor: 'text-purple-500',
        },
      ],
      isLoading: false,
    };

    render(<StatsCardGrid {...largeNumberStats} />);

    expect(screen.getByText('1234567')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    const zeroStats: StatsCardGridProps = {
      stats: [
        {
          label: 'Errors',
          value: 0,
          icon: AlertCircle,
          iconColor: 'text-gray-500',
        },
      ],
      isLoading: false,
    };

    render(<StatsCardGrid {...zeroStats} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render with maximum columns constraint', () => {
    const { container } = render(
      <StatsCardGrid {...defaultProps} columns={6} />
    );

    const gridElement = container.querySelector('.grid');
    // Should cap at 2 for md breakpoint
    expect(gridElement).toHaveClass('md:grid-cols-2');
  });

  it('should apply gap and margin styles', () => {
    const { container } = render(<StatsCardGrid {...defaultProps} />);

    const gridElement = container.querySelector('.grid');
    expect(gridElement).toHaveClass('gap-6');
    expect(gridElement).toHaveClass('mb-8');
  });

  it('should render unique keys for each stat card', () => {
    const { container } = render(<StatsCardGrid {...defaultProps} />);

    const gridElement = container.querySelector('.grid');
    const cards = gridElement?.children;

    expect(cards?.length).toBe(defaultStats.length);
  });

  it('should pass loading state to all StatCard children', () => {
    const { container } = render(
      <StatsCardGrid stats={defaultStats} isLoading={true} />
    );

    const gridElement = container.querySelector('.grid');
    // When loading, StatCard components render skeleton
    expect(gridElement?.children.length).toBe(defaultStats.length);
  });
});
