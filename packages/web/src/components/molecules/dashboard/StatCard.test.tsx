import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import type { StatCardProps } from './StatCard.types';

expect.extend(toHaveNoViolations);

describe('StatCard - Molecule', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders StatCard with required props', () => {
      render(<StatCard label="Active Requests" value={12} icon={Clock} />);

      expect(screen.getByText('Active Requests')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('renders with all props provided', () => {
      render(
        <StatCard
          label="Total Users"
          value={150}
          icon={Users}
          iconColor="text-blue-500"
          subtitle="Registered users"
          trend="+12% from last month"
          isLoading={false}
        />
      );

      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('Registered users')).toBeInTheDocument();
      expect(screen.getByText('+12% from last month')).toBeInTheDocument();
    });

    it('renders with Card component wrapper', () => {
      const { container } = render(
        <StatCard label="Test" value={5} icon={Clock} />
      );

      expect(container.querySelector('.p-6')).toBeInTheDocument();
    });

    it('displays icon with default color', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} />
      );

      const icon = container.querySelector('.text-primary');
      expect(icon).toBeInTheDocument();
    });

    it('displays icon with custom color', () => {
      const { container } = render(
        <StatCard
          label="Test"
          value={10}
          icon={Clock}
          iconColor="text-red-500"
        />
      );

      const icon = container.querySelector('.text-red-500');
      expect(icon).toBeInTheDocument();
    });
  });

  // 2. LOADING STATE TESTS
  describe('Loading State', () => {
    it('shows loading skeleton when isLoading is true', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} isLoading={true} />
      );

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('h-8', 'bg-muted', 'rounded', 'w-16');
    });

    it('hides value and trend when loading', () => {
      render(
        <StatCard
          label="Test"
          value={10}
          icon={Clock}
          trend="+5%"
          isLoading={true}
        />
      );

      expect(screen.queryByText('10')).not.toBeInTheDocument();
      expect(screen.queryByText('+5%')).not.toBeInTheDocument();
    });

    it('shows label and icon when loading', () => {
      render(
        <StatCard label="Loading Test" value={10} icon={Clock} isLoading={true} />
      );

      expect(screen.getByText('Loading Test')).toBeInTheDocument();
    });

    it('does not show loading skeleton when isLoading is false', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} isLoading={false} />
      );

      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });

    it('defaults to not loading when isLoading prop is omitted', () => {
      const { container } = render(<StatCard label="Test" value={10} icon={Clock} />);

      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  // 3. VALUE TYPES TESTS
  describe('Value Types', () => {
    it('renders numeric value', () => {
      render(<StatCard label="Count" value={42} icon={Clock} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders string value', () => {
      render(<StatCard label="Status" value="Active" icon={CheckCircle} />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders zero value', () => {
      render(<StatCard label="Count" value={0} icon={Clock} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders large numbers', () => {
      render(<StatCard label="Total" value={1000000} icon={Users} />);
      expect(screen.getByText('1000000')).toBeInTheDocument();
    });

    it('renders formatted string values', () => {
      render(<StatCard label="Revenue" value="$1,234.56" icon={Clock} />);
      expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    });
  });

  // 4. OPTIONAL PROPS TESTS
  describe('Optional Props', () => {
    it('renders without subtitle', () => {
      render(<StatCard label="Test" value={10} icon={Clock} />);
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('renders with subtitle', () => {
      render(
        <StatCard
          label="Test"
          value={10}
          icon={Clock}
          subtitle="Additional info"
        />
      );
      expect(screen.getByText('Additional info')).toBeInTheDocument();
    });

    it('renders without trend', () => {
      render(<StatCard label="Test" value={10} icon={Clock} />);
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('renders with trend', () => {
      render(
        <StatCard label="Test" value={10} icon={Clock} trend="+15%" />
      );
      expect(screen.getByText('+15%')).toBeInTheDocument();
    });

    it('renders with both subtitle and trend', () => {
      render(
        <StatCard
          label="Test"
          value={10}
          icon={Clock}
          subtitle="Description"
          trend="+20%"
        />
      );
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('+20%')).toBeInTheDocument();
    });
  });

  // 5. ICON VARIANTS TESTS
  describe('Icon Variants', () => {
    it('renders with Clock icon', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders with Users icon', () => {
      const { container } = render(
        <StatCard label="Users" value={50} icon={Users} />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders with CheckCircle icon', () => {
      const { container } = render(
        <StatCard label="Completed" value={25} icon={CheckCircle} />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders with XCircle icon', () => {
      const { container } = render(
        <StatCard label="Failed" value={3} icon={XCircle} />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('icon has correct size classes', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} />
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-4', 'w-4');
    });
  });

  // 6. LAYOUT TESTS
  describe('Layout', () => {
    it('has flex layout for header', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} />
      );
      const header = container.querySelector('.flex.items-center.justify-between');
      expect(header).toBeInTheDocument();
    });

    it('has proper spacing', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} />
      );
      expect(container.querySelector('.mb-4')).toBeInTheDocument();
    });

    it('trend has proper margin', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} trend="+5%" />
      );
      const trend = screen.getByText('+5%');
      expect(trend).toHaveClass('mt-1');
    });

    it('subtitle has proper margin', () => {
      const { container } = render(
        <StatCard label="Test" value={10} icon={Clock} subtitle="Info" />
      );
      const subtitle = screen.getByText('Info');
      expect(subtitle).toHaveClass('mt-2');
    });
  });

  // 7. STYLING TESTS
  describe('Styling', () => {
    it('label has muted foreground color', () => {
      render(<StatCard label="Test Label" value={10} icon={Clock} />);
      const label = screen.getByText('Test Label');
      expect(label).toHaveClass('text-muted-foreground');
    });

    it('value has bold font', () => {
      render(<StatCard label="Test" value={10} icon={Clock} />);
      const value = screen.getByText('10');
      expect(value).toHaveClass('font-bold');
    });

    it('value has large text size', () => {
      render(<StatCard label="Test" value={10} icon={Clock} />);
      const value = screen.getByText('10');
      expect(value).toHaveClass('text-3xl');
    });

    it('trend has primary color', () => {
      render(<StatCard label="Test" value={10} icon={Clock} trend="+10%" />);
      const trend = screen.getByText('+10%');
      expect(trend).toHaveClass('text-primary');
    });

    it('subtitle has small text', () => {
      render(<StatCard label="Test" value={10} icon={Clock} subtitle="Info" />);
      const subtitle = screen.getByText('Info');
      expect(subtitle).toHaveClass('text-xs');
    });
  });

  // 8. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <StatCard
          label="Accessible Stat"
          value={100}
          icon={Clock}
          subtitle="Description"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('label is a heading element', () => {
      render(<StatCard label="Test Heading" value={10} icon={Clock} />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Test Heading');
    });

    it('value is a paragraph element', () => {
      render(<StatCard label="Test" value={10} icon={Clock} />);
      const value = screen.getByText('10');
      expect(value.tagName).toBe('P');
    });

    it('trend is a paragraph element', () => {
      render(<StatCard label="Test" value={10} icon={Clock} trend="+5%" />);
      const trend = screen.getByText('+5%');
      expect(trend.tagName).toBe('P');
    });

    it('subtitle is a paragraph element', () => {
      render(<StatCard label="Test" value={10} icon={Clock} subtitle="Info" />);
      const subtitle = screen.getByText('Info');
      expect(subtitle.tagName).toBe('P');
    });
  });

  // 9. EDGE CASES
  describe('Edge Cases', () => {
    it('handles empty string value', () => {
      render(<StatCard label="Test" value="" icon={Clock} />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('handles very long label', () => {
      const longLabel = 'A'.repeat(100);
      render(<StatCard label={longLabel} value={10} icon={Clock} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles very long subtitle', () => {
      const longSubtitle = 'B'.repeat(200);
      render(
        <StatCard label="Test" value={10} icon={Clock} subtitle={longSubtitle} />
      );
      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });

    it('handles very long trend', () => {
      const longTrend = 'C'.repeat(50);
      render(<StatCard label="Test" value={10} icon={Clock} trend={longTrend} />);
      expect(screen.getByText(longTrend)).toBeInTheDocument();
    });

    it('handles negative numbers', () => {
      render(<StatCard label="Test" value={-50} icon={Clock} />);
      expect(screen.getByText('-50')).toBeInTheDocument();
    });

    it('handles decimal numbers', () => {
      render(<StatCard label="Test" value={3.14159} icon={Clock} />);
      expect(screen.getByText('3.14159')).toBeInTheDocument();
    });
  });

  // 10. INTEGRATION TESTS
  describe('Integration', () => {
    it('works with multiple StatCards side by side', () => {
      const { container } = render(
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Card 1" value={10} icon={Clock} />
          <StatCard label="Card 2" value={20} icon={Users} />
          <StatCard label="Card 3" value={30} icon={CheckCircle} />
        </div>
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });

    it('updates when props change', () => {
      const { rerender } = render(
        <StatCard label="Test" value={10} icon={Clock} />
      );
      expect(screen.getByText('10')).toBeInTheDocument();

      rerender(<StatCard label="Test" value={20} icon={Clock} />);
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.queryByText('10')).not.toBeInTheDocument();
    });

    it('transitions between loading states', () => {
      const { rerender, container } = render(
        <StatCard label="Test" value={10} icon={Clock} isLoading={true} />
      );
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();

      rerender(<StatCard label="Test" value={10} icon={Clock} isLoading={false} />);
      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });
});
