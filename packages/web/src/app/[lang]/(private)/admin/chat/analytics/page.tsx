'use client';

import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { ChatAnalyticsDashboard } from '@/components/features/chat/ChatAnalyticsDashboard';
import { Typography } from '@/components/atoms/typography';
import { AdminPageHeader } from '@/components/molecules/admin-page-header';

export default function ChatAnalyticsPage() {
  const {
    data: analytics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chatAnalytics'],
    queryFn: () => trpc.chat.getChatAnalytics.query(), // TODO: Implement this
  });

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics: {error.message}</div>;

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Chatbot Analytics"
        description="View chatbot performance metrics"
        backHref={`/admin/chat`}
        backLabel="Back to Chat"
      />
      <ChatAnalyticsDashboard
        analytics={
          analytics || {
            totalConversations: 0,
            openConversations: 0,
            resolvedConversations: 0,
            leadsCaptured: 0,
            averageResponseTime: 0,
          }
        }
      />
    </div>
  );
}
