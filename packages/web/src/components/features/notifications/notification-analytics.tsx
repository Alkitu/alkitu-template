'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/primitives/Card';
import { Button } from '@/components/primitives/ui/button';
import { Badge } from '@/components/atoms-alianza/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/Select';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Eye,
  EyeOff,
  Activity,
  Loader2,
} from 'lucide-react';

interface NotificationAnalytics {
  period: string;
  totalNotifications: number;
  unreadNotifications: number;
  readingRate: string;
  typeDistribution: Array<{
    type: string;
    count: number;
    percentage: string;
  }>;
  dailyActivity: Array<{
    date: string;
    count: number;
  }>;
  readVsUnread: Array<{
    status: string;
    count: number;
  }>;
}

interface NotificationAnalyticsProps {
  userId: string;
}

const PERIOD_OPTIONS = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 3 months' },
  { value: 365, label: 'Last year' },
];

const TYPE_COLORS: Record<string, string> = {
  welcome: 'bg-green-100 text-green-800',
  security: 'bg-red-100 text-red-800',
  system: 'bg-blue-100 text-blue-800',
  report: 'bg-purple-100 text-purple-800',
  feature: 'bg-indigo-100 text-indigo-800',
  maintenance: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
  info: 'bg-gray-100 text-gray-800',
};

export function NotificationAnalytics({ userId }: NotificationAnalyticsProps) {
  const [analytics, setAnalytics] = useState<NotificationAnalytics | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  const fetchAnalytics = useCallback(
    async (days: number) => {
      try {
        setLoading(true);
        setError(null);

        const encodedInput = encodeURIComponent(
          JSON.stringify({ userId, days }),
        );
        const response = await fetch(
          `http://localhost:3001/trpc/notification.getNotificationAnalytics?input=${encodedInput}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        setAnalytics(data.result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    fetchAnalytics(selectedPeriod);
  }, [selectedPeriod, userId, fetchAnalytics]);

  const handlePeriodChange = (value: string) => {
    const days = parseInt(value, 10);
    setSelectedPeriod(days);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Loading analytics...
          </span>
        </CardContent>
      </Card>
    );
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-2 text-red-600">Error</CardTitle>
          <CardDescription className="text-center">
            {error || 'Failed to load analytics'}
          </CardDescription>
          <Button
            onClick={() => fetchAnalytics(selectedPeriod)}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const readingRateNum = parseFloat(analytics.readingRate);
  const isGoodReadingRate = readingRateNum >= 80;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Notification Analytics
          </h2>
          <p className="text-muted-foreground">
            Insights and statistics for your notifications
          </p>
        </div>
        <Select
          value={selectedPeriod.toString()}
          onValueChange={handlePeriodChange}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Notifications
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalNotifications}
            </div>
            <p className="text-xs text-muted-foreground">
              in {analytics.period}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {analytics.unreadNotifications}
            </div>
            <p className="text-xs text-muted-foreground">
              pending notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reading Rate</CardTitle>
            {isGoodReadingRate ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${isGoodReadingRate ? 'text-green-600' : 'text-red-600'}`}
            >
              {analytics.readingRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {isGoodReadingRate ? 'Excellent!' : 'Needs attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Active Day
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.dailyActivity && analytics.dailyActivity.length > 0
                ? Math.max(...analytics.dailyActivity.map((d) => d.count))
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              notifications in one day
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Notification Types Distribution
          </CardTitle>
          <CardDescription>
            Breakdown of notifications by type over {analytics.period}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.typeDistribution &&
          analytics.typeDistribution.length > 0 ? (
            <div className="space-y-3">
              {analytics.typeDistribution.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      className={TYPE_COLORS[item.type] || TYPE_COLORS.info}
                      variant="secondary"
                    >
                      {item.type}
                    </Badge>
                    <span className="text-sm font-medium">
                      {item.count} notifications
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground min-w-[40px]">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No notifications in this period
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Daily Activity (Last 7 days)
          </CardTitle>
          <CardDescription>
            Number of notifications received each day
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.dailyActivity && analytics.dailyActivity.length > 0 ? (
            <div className="space-y-3">
              {analytics.dailyActivity.map((item) => {
                const maxCount = Math.max(
                  ...analytics.dailyActivity.map((d) => d.count),
                );
                const percentage =
                  maxCount > 0 ? (item.count / maxCount) * 100 : 0;

                return (
                  <div
                    key={item.date}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <span className="text-sm font-medium">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex-1 bg-muted rounded-full h-2 max-w-[200px]">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground min-w-[30px]">
                        {item.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No activity data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Read vs Unread */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Reading Behavior
          </CardTitle>
          <CardDescription>
            Comparison of read vs unread notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {analytics.readVsUnread &&
              analytics.readVsUnread.map((item) => (
                <div
                  key={item.status}
                  className="text-center p-4 rounded-lg border"
                >
                  <div
                    className={`text-3xl font-bold ${
                      item.status === 'read'
                        ? 'text-green-600'
                        : 'text-orange-600'
                    }`}
                  >
                    {item.count}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {item.status} notifications
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {readingRateNum < 50 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Low Reading Rate:</strong> You have many unread
                  notifications. Consider adjusting your notification
                  preferences to reduce noise.
                </p>
              </div>
            )}

            {analytics.unreadNotifications > 50 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>High Unread Count:</strong> Consider using bulk
                  actions to mark multiple notifications as read or delete old
                  ones.
                </p>
              </div>
            )}

            {analytics.totalNotifications === 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>No Activity:</strong> No notifications received in
                  this period. This might indicate good notification management
                  or low system activity.
                </p>
              </div>
            )}

            {readingRateNum >= 80 && analytics.unreadNotifications < 10 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Excellent Management:</strong> You&apos;re doing great
                  at staying on top of your notifications! Keep up the good
                  work.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
