/**
 * DashboardOverview - Unit Tests
 * Atomic Design: Organism
 *
 * Test Coverage:
 * - Rendering with different states
 * - Under construction mode
 * - Normal mode with stats and actions
 * - Loading states
 * - Accessibility
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardOverview } from './DashboardOverview';
import { Plus, ClipboardList, Settings } from 'lucide-react';

describe('DashboardOverview', () => {
  const defaultProps = {
    statsLabels: {
      pending: 'Pending',
      active: 'Active',
      completed: 'Completed',
    },
  };

  describe('Rendering - Basic', () => {
    it('should render without crashing', () => {
      render(<DashboardOverview {...defaultProps} />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should render with custom welcome message', () => {
      render(
        <DashboardOverview
          {...defaultProps}
          welcomeMessage="Welcome to Dashboard"
        />,
      );
      expect(screen.getByText('Welcome to Dashboard')).toBeInTheDocument();
    });

    it('should render welcome message with user name', () => {
      render(
        <DashboardOverview
          {...defaultProps}
          welcomeMessage="Welcome"
          userName="John Doe"
        />,
      );
      expect(screen.getByText(/Welcome John Doe/i)).toBeInTheDocument();
    });

    it('should render subtitle when provided', () => {
      render(
        <DashboardOverview
          {...defaultProps}
          subtitle="Panel principal de tu cuenta"
        />,
      );
      expect(
        screen.getByText('Panel principal de tu cuenta'),
      ).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <DashboardOverview {...defaultProps} className="custom-class" />,
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });
  });

  describe('Under Construction Mode', () => {
    it('should render under construction state when isUnderConstruction is true', () => {
      render(
        <DashboardOverview
          {...defaultProps}
          isUnderConstruction={true}
          constructionTitle="Dashboard en Construcción"
        />,
      );
      expect(
        screen.getByText('Dashboard en Construcción'),
      ).toBeInTheDocument();
    });

    it('should render construction message', () => {
      const message = 'We are working on your personalized panel';
      render(
        <DashboardOverview
          {...defaultProps}
          isUnderConstruction={true}
          constructionMessage={message}
        />,
      );
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should render construction status', () => {
      const status = 'System in active development';
      render(
        <DashboardOverview
          {...defaultProps}
          isUnderConstruction={true}
          constructionStatus={status}
        />,
      );
      expect(screen.getByText(status)).toBeInTheDocument();
    });

    it('should render placeholder stats in construction mode', () => {
      render(
        <DashboardOverview {...defaultProps} isUnderConstruction={true} />,
      );
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      // Check for placeholder values
      expect(screen.getAllByText('---')).toHaveLength(3);
    });
  });

  describe('Normal Mode - Stats Display', () => {
    const statsData = {
      pending: 5,
      active: 3,
      completed: 12,
    };

    it('should render stats when statsData is provided', () => {
      render(
        <DashboardOverview {...defaultProps} statsData={statsData} />,
      );
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('should render stats labels', () => {
      render(
        <DashboardOverview {...defaultProps} statsData={statsData} />,
      );
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('should render stats with string values', () => {
      const stringStatsData = {
        pending: '---',
        active: 'N/A',
        completed: '100+',
      };
      render(
        <DashboardOverview {...defaultProps} statsData={stringStatsData} />,
      );
      expect(screen.getByText('---')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.getByText('100+')).toBeInTheDocument();
    });

    it('should not render stats section when statsData is not provided', () => {
      const { container } = render(<DashboardOverview {...defaultProps} />);
      // Stats should not be visible if statsData is undefined
      expect(container.querySelector('.grid-cols-1.md\\:grid-cols-3')).toBeNull();
    });
  });

  describe('Quick Actions', () => {
    const actions = [
      {
        label: 'New Request',
        subtitle: 'Create',
        href: '/requests/new',
        icon: Plus,
        variant: 'primary' as const,
      },
      {
        label: 'View All',
        href: '/requests',
        icon: ClipboardList,
        iconColor: 'text-blue-500',
      },
    ] as any[];

    it('should render quick action buttons', () => {
      render(<DashboardOverview {...defaultProps} actions={actions} />);
      expect(screen.getByText('New Request')).toBeInTheDocument();
      expect(screen.getByText('View All')).toBeInTheDocument();
    });

    it('should render action subtitle when provided', () => {
      render(<DashboardOverview {...defaultProps} actions={actions} />);
      expect(screen.getByText('Create')).toBeInTheDocument();
    });

    it('should not render actions section when actions array is empty', () => {
      render(<DashboardOverview {...defaultProps} actions={[]} />);
      expect(screen.queryByText('New Request')).not.toBeInTheDocument();
    });

    it('should not render actions section when actions is undefined', () => {
      const { container } = render(<DashboardOverview {...defaultProps} />);
      // Quick actions grid should not exist
      expect(
        container.querySelector('.grid-cols-1.md\\:grid-cols-2'),
      ).toBeNull();
    });
  });

  describe('Loading States', () => {
    const statsData = {
      pending: 5,
      active: 3,
      completed: 12,
    };

    it('should show loading state for stats when isLoadingStats is true', () => {
      const { container } = render(
        <DashboardOverview
          {...defaultProps}
          statsData={statsData}
          isLoadingStats={true}
        />,
      );
      // Loading skeleton should be present
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should not show loading state when isLoadingStats is false', () => {
      render(
        <DashboardOverview
          {...defaultProps}
          statsData={statsData}
          isLoadingStats={false}
        />,
      );
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <DashboardOverview
          {...defaultProps}
          welcomeMessage="Dashboard"
          isUnderConstruction={true}
          constructionTitle="Under Construction"
        />,
      );
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h1).toHaveTextContent('Dashboard');
      expect(h2).toHaveTextContent('Under Construction');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<DashboardOverview {...defaultProps} ref={ref} />);
      expect(ref.current).toBeTruthy();
    });

    it('should spread additional HTML attributes', () => {
      const { container } = render(
        <DashboardOverview
          {...defaultProps}
          data-testid="dashboard-overview"
        />,
      );
      expect(
        container.querySelector('[data-testid="dashboard-overview"]'),
      ).toBeInTheDocument();
    });
  });

  describe('Combined States', () => {
    it('should render complete dashboard with all elements', () => {
      const statsData = {
        pending: 5,
        active: 3,
        completed: 12,
      };
      const actions = [
        {
          label: 'New Request',
          href: '/requests/new',
          icon: Plus,
          variant: 'primary' as const,
        },
      ];

      render(
        <DashboardOverview
          {...defaultProps}
          userName="John Doe"
          welcomeMessage="Welcome"
          subtitle="Your dashboard overview"
          statsData={statsData}
          actions={actions}
          isLoadingStats={false}
        />,
      );

      expect(screen.getByText(/Welcome John Doe/i)).toBeInTheDocument();
      expect(screen.getByText('Your dashboard overview')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('New Request')).toBeInTheDocument();
    });

    it('should prioritize construction mode over normal mode', () => {
      const statsData = {
        pending: 5,
        active: 3,
        completed: 12,
      };

      render(
        <DashboardOverview
          {...defaultProps}
          statsData={statsData}
          isUnderConstruction={true}
          constructionTitle="Under Construction"
        />,
      );

      // Should show construction mode, not actual stats
      expect(screen.getByText('Under Construction')).toBeInTheDocument();
      expect(screen.getAllByText('---')).toHaveLength(3);
      expect(screen.queryByText('5')).not.toBeInTheDocument();
    });
  });
});
