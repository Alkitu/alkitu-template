import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Clock,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Activity,
} from 'lucide-react';
import { StatCard } from './StatCard';

expect.extend(toHaveNoViolations);

describe('StatCard - Molecule', () => {
  // 1. BASIC RENDERING TESTS
  describe('Basic Rendering', () => {
    it('renders with required props only', () => {
      render(<StatCard label="Active Requests" value={12} icon={Clock} />);

      expect(screen.getByText('Active Requests')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('renders with all props provided', () => {
      render(
        <StatCard
          label="Total Revenue"
          value={50000}
          icon={DollarSign}
          iconColor="text-green-500"
          subtitle="Year to date"
          trend="+15%"
          trendDirection="up"
          comparison="vs last quarter"
          badge="Premium"
          badgeVariant="success"
        />,
      );

      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('50000')).toBeInTheDocument();
      expect(screen.getByText('Year to date')).toBeInTheDocument();
      expect(screen.getByText('+15%')).toBeInTheDocument();
      expect(screen.getByText('vs last quarter')).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    it('renders icon with default color', () => {
      const { container } = render(<StatCard label="Test" value={10} icon={Clock} />);
      const icon = container.querySelector('.text-primary');
      expect(icon).toBeInTheDocument();
    });

    it('renders icon with custom color', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} iconColor="text-red-500" />,
      );
      const icon = container.querySelector('.text-red-500');
      expect(icon).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} className="custom-class" />,
      );
      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });

    it('renders with data-testid', () => {
      render(<StatCard label="Test" value={10} icon={Clock} data-testid="my-stat-card" />);
      expect(screen.getByTestId('my-stat-card')).toBeInTheDocument();
    });
  });

  // 2. VALUE DISPLAY TESTS
  describe('Value Display', () => {
    it('renders numeric value', () => {
      render(<StatCard label="Count" value={42} icon={Clock} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders string value', () => {
      render(<StatCard label="Status" value="Active" icon={Clock} />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders zero value', () => {
      render(<StatCard label="Count" value={0} icon={Clock} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders negative numbers', () => {
      render(<StatCard label="Loss" value={-50} icon={Clock} />);
      expect(screen.getByText('-50')).toBeInTheDocument();
    });

    it('renders decimal numbers', () => {
      render(<StatCard label="Rate" value={3.14159} icon={Clock} />);
      expect(screen.getByText('3.14159')).toBeInTheDocument();
    });

    it('renders large numbers without formatting', () => {
      render(<StatCard label="Total" value={1000000} icon={Users} />);
      expect(screen.getByText('1000000')).toBeInTheDocument();
    });

    it('renders formatted string values', () => {
      render(<StatCard label="Revenue" value="$1,234.56" icon={DollarSign} />);
      expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    });

    it('renders empty string value', () => {
      render(<StatCard label="Test" value="" icon={Clock} />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  // 3. NUMBER FORMATTING TESTS
  describe('Number Formatting', () => {
    it('formats thousands (K) with default decimals', () => {
      render(<StatCard label="Users" value={1234} icon={Users} formatNumber />);
      expect(screen.getByText('1.2K')).toBeInTheDocument();
    });

    it('formats millions (M) with default decimals', () => {
      render(<StatCard label="Revenue" value={5678900} icon={DollarSign} formatNumber />);
      expect(screen.getByText('5.7M')).toBeInTheDocument();
    });

    it('formats billions (B) with default decimals', () => {
      render(<StatCard label="Budget" value={1234567890} icon={DollarSign} formatNumber />);
      expect(screen.getByText('1.2B')).toBeInTheDocument();
    });

    it('formats with custom decimal places', () => {
      render(
        <StatCard label="Users" value={1234} icon={Users} formatNumber decimals={2} />,
      );
      expect(screen.getByText('1.23K')).toBeInTheDocument();
    });

    it('formats with zero decimal places', () => {
      render(
        <StatCard label="Users" value={1234} icon={Users} formatNumber decimals={0} />,
      );
      expect(screen.getByText('1K')).toBeInTheDocument();
    });

    it('does not format numbers below 1000', () => {
      render(<StatCard label="Count" value={999} icon={Clock} formatNumber />);
      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('formats negative large numbers', () => {
      render(<StatCard label="Loss" value={-5000} icon={Clock} formatNumber />);
      expect(screen.getByText('-5.0K')).toBeInTheDocument();
    });

    it('does not format string values', () => {
      render(
        <StatCard label="Status" value="1000 users" icon={Users} formatNumber />,
      );
      expect(screen.getByText('1000 users')).toBeInTheDocument();
    });

    it('handles NaN gracefully', () => {
      render(<StatCard label="Test" value={NaN} icon={Clock} formatNumber />);
      expect(screen.getByText('NaN')).toBeInTheDocument();
    });

    it('formats exactly 1000', () => {
      render(<StatCard label="Count" value={1000} icon={Clock} formatNumber />);
      expect(screen.getByText('1.0K')).toBeInTheDocument();
    });

    it('formats exactly 1 million', () => {
      render(<StatCard label="Count" value={1000000} icon={Clock} formatNumber />);
      expect(screen.getByText('1.0M')).toBeInTheDocument();
    });

    it('formats exactly 1 billion', () => {
      render(<StatCard label="Count" value={1000000000} icon={Clock} formatNumber />);
      expect(screen.getByText('1.0B')).toBeInTheDocument();
    });
  });

  // 4. TREND INDICATOR TESTS
  describe('Trend Indicators', () => {
    it('renders trend text only', () => {
      render(<StatCard label="Sales" value={100} icon={ShoppingCart} trend="+12%" />);
      expect(screen.getByText('+12%')).toBeInTheDocument();
    });

    it('renders up trend arrow', () => {
      render(
        <StatCard
          label="Growth"
          value={100}
          icon={TrendingUp}
          trendDirection="up"
        />,
      );
      expect(screen.getByLabelText('Trending up')).toBeInTheDocument();
    });

    it('renders down trend arrow', () => {
      render(
        <StatCard label="Decline" value={80} icon={Clock} trendDirection="down" />,
      );
      expect(screen.getByLabelText('Trending down')).toBeInTheDocument();
    });

    it('renders neutral trend indicator', () => {
      render(
        <StatCard label="Stable" value={100} icon={Clock} trendDirection="neutral" />,
      );
      expect(screen.getByLabelText('Neutral trend')).toBeInTheDocument();
    });

    it('renders trend with text and direction', () => {
      render(
        <StatCard
          label="Revenue"
          value={5000}
          icon={DollarSign}
          trend="+25%"
          trendDirection="up"
        />,
      );
      expect(screen.getByText('+25%')).toBeInTheDocument();
      expect(screen.getByLabelText('Trending up')).toBeInTheDocument();
    });

    it('applies success color to up trend', () => {
      render(
        <StatCard label="Test" value={100} icon={Clock} trendDirection="up" />,
      );
      const trendElement = screen.getByTestId('stat-card-trend');
      expect(trendElement).toHaveClass('text-success');
    });

    it('applies error color to down trend', () => {
      render(
        <StatCard label="Test" value={100} icon={Clock} trendDirection="down" />,
      );
      const trendElement = screen.getByTestId('stat-card-trend');
      expect(trendElement).toHaveClass('text-error');
    });

    it('applies muted color to neutral trend', () => {
      render(
        <StatCard label="Test" value={100} icon={Clock} trendDirection="neutral" />,
      );
      const trendElement = screen.getByTestId('stat-card-trend');
      expect(trendElement).toHaveClass('text-muted-foreground');
    });

    it('applies primary color when no direction specified', () => {
      render(<StatCard label="Test" value={100} icon={Clock} trend="+5%" />);
      const trendElement = screen.getByTestId('stat-card-trend');
      expect(trendElement).toHaveClass('text-primary');
    });

    it('does not render trend when not provided', () => {
      render(<StatCard label="Test" value={100} icon={Clock} />);
      expect(screen.queryByTestId('stat-card-trend')).not.toBeInTheDocument();
    });
  });

  // 5. OPTIONAL PROPS TESTS
  describe('Optional Props', () => {
    it('renders without subtitle', () => {
      render(<StatCard label="Test" value={10} icon={Clock} />);
      expect(screen.queryByTestId('stat-card-subtitle')).not.toBeInTheDocument();
    });

    it('renders with subtitle', () => {
      render(
        <StatCard
          label="Test"
          value={10}
          icon={Clock}
          subtitle="Additional info"
        />,
      );
      expect(screen.getByText('Additional info')).toBeInTheDocument();
    });

    it('renders without comparison', () => {
      render(<StatCard label="Test" value={10} icon={Clock} />);
      expect(screen.queryByTestId('stat-card-comparison')).not.toBeInTheDocument();
    });

    it('renders with comparison', () => {
      render(
        <StatCard label="Test" value={10} icon={Clock} comparison="vs last month" />,
      );
      expect(screen.getByText('vs last month')).toBeInTheDocument();
    });

    it('renders without badge', () => {
      render(<StatCard label="Test" value={10} icon={Clock} />);
      expect(screen.queryByTestId('stat-card-badge')).not.toBeInTheDocument();
    });

    it('renders with badge', () => {
      render(<StatCard label="Test" value={10} icon={Clock} badge="New" />);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders badge with custom variant', () => {
      render(
        <StatCard
          label="Test"
          value={10}
          icon={Clock}
          badge="Premium"
          badgeVariant="success"
        />,
      );
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    it('renders without chart', () => {
      render(<StatCard label="Test" value={10} icon={Clock} />);
      expect(screen.queryByTestId('stat-card-chart')).not.toBeInTheDocument();
    });

    it('renders with chart component', () => {
      const chart = <div data-testid="mini-chart">Chart</div>;
      render(<StatCard label="Test" value={10} icon={Clock} chart={chart} />);
      expect(screen.getByTestId('mini-chart')).toBeInTheDocument();
    });
  });

  // 6. LOADING STATE TESTS
  describe('Loading State', () => {
    it('shows loading skeleton when isLoading is true', () => {
      render(<StatCard label="Test" value={10} icon={Clock} isLoading />);
      expect(screen.getByTestId('stat-card-skeleton')).toBeInTheDocument();
    });

    it('hides value when loading', () => {
      render(<StatCard label="Test" value={10} icon={Clock} isLoading />);
      expect(screen.queryByText('10')).not.toBeInTheDocument();
    });

    it('hides trend when loading', () => {
      render(
        <StatCard label="Test" value={10} icon={Clock} trend="+5%" isLoading />,
      );
      expect(screen.queryByText('+5%')).not.toBeInTheDocument();
    });

    it('shows label when loading', () => {
      render(<StatCard label="Loading Test" value={10} icon={Clock} isLoading />);
      expect(screen.getByText('Loading Test')).toBeInTheDocument();
    });

    it('shows icon when loading', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} isLoading />,
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('does not show loading when isLoading is false', () => {
      render(<StatCard label="Test" value={10} icon={Clock} isLoading={false} />);
      expect(screen.queryByTestId('stat-card-skeleton')).not.toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('defaults to not loading', () => {
      render(<StatCard label="Test" value={10} icon={Clock} />);
      expect(screen.queryByTestId('stat-card-skeleton')).not.toBeInTheDocument();
    });

    it('shows secondary skeleton when trend or subtitle exists', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} trend="+5%" isLoading />,
      );
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(1);
    });
  });

  // 7. VARIANT TESTS
  describe('Variants', () => {
    it('renders default variant', () => {
      render(<StatCard label="Test" value={10} icon={Clock} variant="default" />);
      expect(screen.getByTestId('stat-card-value')).toBeInTheDocument();
    });

    it('renders success variant with left border', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} variant="success" />,
      );
      const card = container.querySelector('[data-variant="success"]');
      expect(card).toHaveClass('border-l-4', 'border-l-success');
    });

    it('renders warning variant with left border', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} variant="warning" />,
      );
      const card = container.querySelector('[data-variant="warning"]');
      expect(card).toHaveClass('border-l-4', 'border-l-warning');
    });

    it('renders error variant with left border', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} variant="error" />,
      );
      const card = container.querySelector('[data-variant="error"]');
      expect(card).toHaveClass('border-l-4', 'border-l-error');
    });

    it('renders neutral variant with left border', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} variant="neutral" />,
      );
      const card = container.querySelector('[data-variant="neutral"]');
      expect(card).toHaveClass('border-l-4', 'border-l-muted');
    });
  });

  // 8. CLICKABLE/INTERACTIVE TESTS
  describe('Clickable Behavior', () => {
    it('is not clickable by default', () => {
      const { container } = render(<StatCard label="Test" value={10} icon={Clock} />);
      const card = container.querySelector('[data-clickable="true"]');
      expect(card).not.toBeInTheDocument();
    });

    it('becomes clickable when onClick is provided', () => {
      const handleClick = vi.fn();
      render(<StatCard label="Test" value={10} icon={Clock} onClick={handleClick} />);
      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
    });

    it('becomes clickable when clickable prop is true', () => {
      render(<StatCard label="Test" value={10} icon={Clock} clickable />);
      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
    });

    it('calls onClick when card is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<StatCard label="Test" value={10} icon={Clock} onClick={handleClick} />);

      const card = screen.getByRole('button');
      await user.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Enter key is pressed', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<StatCard label="Test" value={10} icon={Clock} onClick={handleClick} />);

      const card = screen.getByRole('button');
      card.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Space key is pressed', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<StatCard label="Test" value={10} icon={Clock} onClick={handleClick} />);

      const card = screen.getByRole('button');
      card.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies hover styles when clickable', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} clickable />,
      );
      const card = container.querySelector('[data-clickable="true"]');
      expect(card).toHaveClass('cursor-pointer', 'hover:shadow-md');
    });

    it('is focusable when clickable', () => {
      render(<StatCard label="Test" value={10} icon={Clock} clickable />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('has no tabIndex when not clickable', () => {
      const { container } = render(<StatCard label="Test" value={10} icon={Clock} />);
      const card = container.firstChild;
      expect(card).not.toHaveAttribute('tabIndex');
    });
  });

  // 9. ICON VARIANTS TESTS
  describe('Icon Variants', () => {
    it('renders Clock icon', () => {
      const { container } = render(<StatCard label="Time" value={10} icon={Clock} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders Users icon', () => {
      const { container } = render(<StatCard label="Users" value={50} icon={Users} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders DollarSign icon', () => {
      const { container } = render(
        <StatCard label="Revenue" value={1000} icon={DollarSign} />,
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders TrendingUp icon', () => {
      const { container } = render(
        <StatCard label="Growth" value={15} icon={TrendingUp} />,
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('icon has correct size classes', () => {
      const { container } = render(<StatCard label="Test" value={10} icon={Clock} />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-5', 'w-5');
    });

    it('icon has aria-hidden attribute', () => {
      const { container } = render(<StatCard label="Test" value={10} icon={Clock} />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // 10. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <StatCard
          label="Accessible Stat"
          value={100}
          icon={Activity}
          subtitle="Description"
          trend="+10%"
          trendDirection="up"
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('label is a heading element', () => {
      render(<StatCard label="Test Heading" value={10} icon={Clock} />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Test Heading');
    });

    it('trend arrows have aria-label', () => {
      render(
        <StatCard label="Test" value={10} icon={Clock} trendDirection="up" />,
      );
      expect(screen.getByLabelText('Trending up')).toBeInTheDocument();
    });

    it('icon has aria-hidden', () => {
      const { container } = render(<StatCard label="Test" value={10} icon={Clock} />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('clickable card has button role', () => {
      render(<StatCard label="Test" value={10} icon={Clock} clickable />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('non-clickable card has no button role', () => {
      render(<StatCard label="Test" value={10} icon={Clock} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  // 11. EDGE CASES
  describe('Edge Cases', () => {
    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(100);
      render(<StatCard label={longLabel} value={10} icon={Clock} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles very long subtitle', () => {
      const longSubtitle = 'B'.repeat(200);
      render(
        <StatCard label="Test" value={10} icon={Clock} subtitle={longSubtitle} />,
      );
      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });

    it('handles very long trend text', () => {
      const longTrend = 'C'.repeat(50);
      render(<StatCard label="Test" value={10} icon={Clock} trend={longTrend} />);
      expect(screen.getByText(longTrend)).toBeInTheDocument();
    });

    it('handles very large numbers', () => {
      render(<StatCard label="Test" value={9999999999} icon={Clock} />);
      expect(screen.getByText('9999999999')).toBeInTheDocument();
    });

    it('handles very small decimals', () => {
      render(<StatCard label="Test" value={0.00001} icon={Clock} />);
      expect(screen.getByText('0.00001')).toBeInTheDocument();
    });

    it('handles special characters in value', () => {
      render(<StatCard label="Test" value="$1,234.56 USD" icon={DollarSign} />);
      expect(screen.getByText('$1,234.56 USD')).toBeInTheDocument();
    });

    it('handles emoji in badge', () => {
      render(<StatCard label="Test" value={10} icon={Clock} badge="🔥 Hot" />);
      expect(screen.getByText('🔥 Hot')).toBeInTheDocument();
    });
  });

  // 12. INTEGRATION TESTS
  describe('Integration', () => {
    it('works with multiple StatCards side by side', () => {
      render(
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Card 1" value={10} icon={Clock} />
          <StatCard label="Card 2" value={20} icon={Users} />
          <StatCard label="Card 3" value={30} icon={DollarSign} />
        </div>,
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });

    it('updates when props change', () => {
      const { rerender } = render(<StatCard label="Test" value={10} icon={Clock} />);
      expect(screen.getByText('10')).toBeInTheDocument();

      rerender(<StatCard label="Test" value={20} icon={Clock} />);
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.queryByText('10')).not.toBeInTheDocument();
    });

    it('transitions between loading states', () => {
      const { rerender } = render(
        <StatCard label="Test" value={10} icon={Clock} isLoading />,
      );
      expect(screen.getByTestId('stat-card-skeleton')).toBeInTheDocument();

      rerender(<StatCard label="Test" value={10} icon={Clock} isLoading={false} />);
      expect(screen.queryByTestId('stat-card-skeleton')).not.toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('combines all features together', () => {
      const handleClick = vi.fn();
      render(
        <StatCard
          label="Complete Feature Test"
          value={1234567}
          icon={TrendingUp}
          iconColor="text-green-500"
          subtitle="All features enabled"
          trend="+42%"
          trendDirection="up"
          comparison="vs last month"
          variant="success"
          badge="Live"
          badgeVariant="success"
          formatNumber
          decimals={2}
          onClick={handleClick}
          chart={<div>Chart</div>}
        />,
      );

      expect(screen.getByText('Complete Feature Test')).toBeInTheDocument();
      expect(screen.getByText('1.23M')).toBeInTheDocument();
      expect(screen.getByText('All features enabled')).toBeInTheDocument();
      expect(screen.getByText('+42%')).toBeInTheDocument();
      expect(screen.getByText('vs last month')).toBeInTheDocument();
      expect(screen.getByText('Live')).toBeInTheDocument();
      expect(screen.getByText('Chart')).toBeInTheDocument();
      expect(screen.getByLabelText('Trending up')).toBeInTheDocument();
    });
  });
});
