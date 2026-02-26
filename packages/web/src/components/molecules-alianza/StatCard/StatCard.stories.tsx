import type { Meta, StoryObj } from '@storybook/react';
import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { StatCard } from './StatCard';

const meta = {
  title: 'Molecules/StatCard',
  component: StatCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A statistical information card for displaying key metrics and statistics with trend indicators, icons, and comparison data. Perfect for dashboard views and analytics displays.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label/title for the statistic',
    },
    value: {
      control: 'text',
      description: 'Primary value to display',
    },
    icon: {
      control: false,
      description: 'Icon component from lucide-react',
    },
    iconColor: {
      control: 'text',
      description: 'Custom color class for the icon',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle/description text',
    },
    trend: {
      control: 'text',
      description: 'Trend indicator text',
    },
    trendDirection: {
      control: 'select',
      options: ['up', 'down', 'neutral', undefined],
      description: 'Trend direction for visual indicator',
    },
    comparison: {
      control: 'text',
      description: 'Comparison text for context',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state - shows skeleton',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'neutral'],
      description: 'Visual variant for the card',
    },
    badge: {
      control: 'text',
      description: 'Badge text to display',
    },
    badgeVariant: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'outline',
      ],
      description: 'Badge variant',
    },
    formatNumber: {
      control: 'boolean',
      description: 'Auto-format large numbers (1000 → 1K)',
    },
    decimals: {
      control: 'number',
      description: 'Number of decimal places for formatted numbers',
    },
    clickable: {
      control: 'boolean',
      description: 'Makes the card focusable and shows hover state',
    },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = Omit<StoryObj<typeof meta>, 'args'> & Partial<Pick<StoryObj<typeof meta>, 'args'>>;

// Basic Examples
export const Default: Story = {
  args: {
    label: 'Total Users',
    value: 1234,
    icon: Users,
  },
};

export const WithTrend: Story = {
  args: {
    label: 'Revenue',
    value: 54320,
    icon: DollarSign,
    iconColor: 'text-green-500',
    trend: '+12.5%',
    trendDirection: 'up',
    comparison: 'vs last month',
  },
};

export const WithSubtitle: Story = {
  args: {
    label: 'Active Orders',
    value: 48,
    icon: ShoppingCart,
    iconColor: 'text-blue-500',
    subtitle: 'Currently processing',
  },
};

export const WithBadge: Story = {
  args: {
    label: 'Premium Users',
    value: 342,
    icon: Star,
    iconColor: 'text-yellow-500',
    badge: 'Live',
    badgeVariant: 'success',
    trend: '+8%',
    trendDirection: 'up',
  },
};

// Trend Directions
export const TrendUp: Story = {
  args: {
    label: 'Sales Growth',
    value: 25678,
    icon: TrendingUp,
    iconColor: 'text-green-500',
    trend: '+18.2%',
    trendDirection: 'up',
    comparison: 'vs last quarter',
  },
};

export const TrendDown: Story = {
  args: {
    label: 'Response Time',
    value: 245,
    icon: Clock,
    iconColor: 'text-red-500',
    trend: '-5.3%',
    trendDirection: 'down',
    comparison: 'improvement from last week',
  },
};

export const TrendNeutral: Story = {
  args: {
    label: 'Active Sessions',
    value: 1543,
    icon: Activity,
    trend: '0.0%',
    trendDirection: 'neutral',
    comparison: 'no change',
  },
};

// Number Formatting
export const FormattedThousands: Story = {
  args: {
    label: 'Total Downloads',
    value: 5432,
    icon: TrendingUp,
    formatNumber: true,
    trend: '+2.1K this week',
  },
};

export const FormattedMillions: Story = {
  args: {
    label: 'Page Views',
    value: 3456789,
    icon: Activity,
    iconColor: 'text-purple-500',
    formatNumber: true,
    decimals: 2,
    trend: '+1.2M',
    trendDirection: 'up',
  },
};

export const FormattedBillions: Story = {
  args: {
    label: 'Total Revenue',
    value: 1234567890,
    icon: DollarSign,
    iconColor: 'text-green-500',
    formatNumber: true,
    decimals: 1,
    subtitle: 'All time earnings',
  },
};

// Variants
export const VariantSuccess: Story = {
  args: {
    label: 'Tasks Completed',
    value: 127,
    icon: CheckCircle,
    iconColor: 'text-success',
    variant: 'success',
    trend: '+15%',
    trendDirection: 'up',
  },
};

export const VariantWarning: Story = {
  args: {
    label: 'Pending Reviews',
    value: 23,
    icon: AlertCircle,
    iconColor: 'text-warning',
    variant: 'warning',
    subtitle: 'Requires attention',
  },
};

export const VariantError: Story = {
  args: {
    label: 'Failed Requests',
    value: 8,
    icon: AlertCircle,
    iconColor: 'text-error',
    variant: 'error',
    trend: '+3',
    trendDirection: 'down',
  },
};

export const VariantNeutral: Story = {
  args: {
    label: 'On Hold',
    value: 12,
    icon: Clock,
    variant: 'neutral',
    subtitle: 'Awaiting response',
  },
};

// States
export const Loading: Story = {
  args: {
    label: 'Loading Data',
    value: 0,
    icon: Activity,
    isLoading: true,
    trend: '+0%',
    subtitle: 'Please wait...',
  },
};

export const Clickable: Story = {
  args: {
    label: 'View Details',
    value: 456,
    icon: Users,
    trend: '+12%',
    trendDirection: 'up',
    clickable: true,
    onClick: () => alert('Card clicked!'),
  },
};

export const WithChart: Story = {
  args: {
    label: 'Performance',
    value: 98,
    icon: Activity,
    iconColor: 'text-blue-500',
    trend: '+5%',
    trendDirection: 'up',
    chart: (
      <div className="h-12 bg-gradient-to-r from-blue-500/20 to-blue-500/50 rounded" />
    ),
  },
};

// Complex Examples
export const DashboardExample: Story = {
  args: {
    label: 'Monthly Revenue',
    value: 125480,
    icon: DollarSign,
    iconColor: 'text-green-500',
    subtitle: 'Subscription income',
    trend: '+23.5%',
    trendDirection: 'up',
    comparison: 'vs last month',
    variant: 'success',
    badge: 'New Record',
    badgeVariant: 'success',
    formatNumber: true,
    decimals: 1,
  },
};

export const EcommerceMetric: Story = {
  args: {
    label: 'Total Orders',
    value: 8234,
    icon: ShoppingCart,
    iconColor: 'text-blue-500',
    subtitle: 'Last 30 days',
    trend: '+342 orders',
    trendDirection: 'up',
    comparison: 'vs previous period',
    formatNumber: true,
  },
};

export const UserEngagement: Story = {
  args: {
    label: 'Active Users',
    value: 12456,
    icon: Users,
    iconColor: 'text-purple-500',
    subtitle: 'Currently online',
    trend: '↑ 18%',
    badge: 'Peak Time',
    badgeVariant: 'warning',
    formatNumber: true,
  },
};

// Grid Layout Example
export const DashboardGrid: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard label="Total Users" value={12456} icon={Users} trend="+12%" trendDirection="up" formatNumber />
  <StatCard label="Revenue" value={54320} icon={DollarSign} trend="+18%" trendDirection="up" formatNumber />
  <StatCard label="Orders" value={892} icon={ShoppingCart} trend="+5%" trendDirection="up" />
  <StatCard label="Success Rate" value="98.5%" icon={CheckCircle} trend="+0.5%" trendDirection="up" variant="success" />
</div>`,
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Users"
        value={12456}
        icon={Users}
        iconColor="text-blue-500"
        trend="+12%"
        trendDirection="up"
        formatNumber
      />
      <StatCard
        label="Revenue"
        value={54320}
        icon={DollarSign}
        iconColor="text-green-500"
        trend="+18%"
        trendDirection="up"
        formatNumber
      />
      <StatCard
        label="Orders"
        value={892}
        icon={ShoppingCart}
        iconColor="text-purple-500"
        trend="+5%"
        trendDirection="up"
      />
      <StatCard
        label="Success Rate"
        value="98.5%"
        icon={CheckCircle}
        iconColor="text-success"
        trend="+0.5%"
        trendDirection="up"
        variant="success"
      />
    </div>
  ),
};

// Edge Cases
export const ZeroValue: Story = {
  args: {
    label: 'Errors',
    value: 0,
    icon: CheckCircle,
    iconColor: 'text-success',
    subtitle: 'No errors detected',
  },
};

export const NegativeValue: Story = {
  args: {
    label: 'Net Change',
    value: -250,
    icon: TrendingDown,
    iconColor: 'text-red-500',
    trend: '-12%',
    trendDirection: 'down',
  },
};

export const VeryLargeNumber: Story = {
  args: {
    label: 'Total Impressions',
    value: 999999999,
    icon: Activity,
    formatNumber: true,
    decimals: 0,
  },
};

export const StringValue: Story = {
  args: {
    label: 'Status',
    value: 'Operational',
    icon: CheckCircle,
    iconColor: 'text-success',
    variant: 'success',
  },
};

export const FormattedStringValue: Story = {
  args: {
    label: 'Average Order',
    value: '$1,234.56',
    icon: DollarSign,
    iconColor: 'text-green-500',
    trend: '+8.2%',
    trendDirection: 'up',
  },
};
