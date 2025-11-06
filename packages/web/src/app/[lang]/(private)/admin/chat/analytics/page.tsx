'use client';

import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { ChatAnalyticsDashboard } from '@/components/chat/ChatAnalyticsDashboard';
import { Typography } from '@/components/atomic-design/atoms/typography';

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
    <div className="container mx-auto py-10">
      <Typography variant="h1" className="text-3xl font-bold mb-6">
        Chatbot Analytics
      </Typography>
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
