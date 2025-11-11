interface ChatAnalyticsDashboardProps {
  analytics: {
    totalConversations: number;
    openConversations: number;
    resolvedConversations: number;
    leadsCaptured: number;
    averageResponseTime: number;
  };
}

export function ChatAnalyticsDashboard({ analytics }: ChatAnalyticsDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold">Total Conversations</h2>
        <p className="text-2xl font-bold">{analytics.totalConversations}</p>
      </div>
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold">Open Conversations</h2>
        <p className="text-2xl font-bold">{analytics.openConversations}</p>
      </div>
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold">Resolved Conversations</h2>
        <p className="text-2xl font-bold">{analytics.resolvedConversations}</p>
      </div>
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold">Leads Captured</h2>
        <p className="text-2xl font-bold">{analytics.leadsCaptured}</p>
      </div>
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold">Average Response Time</h2>
        <p className="text-2xl font-bold">{analytics.averageResponseTime}s</p>
      </div>
    </div>
  );
}
