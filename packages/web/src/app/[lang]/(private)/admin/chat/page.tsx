'use client';

import { trpc } from '@/lib/trpc';
import { ChatConversationsTableAlianza } from '@/components/organisms-alianza/ChatConversationsTableAlianza';
import { ConversationFilters } from '@/components/features/chat/ConversationFilters';
import { Typography } from '@/components/atoms-alianza/Typography';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';

export default function ChatDashboardPage() {
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const utils = trpc.useUtils();

  // Test con endpoint simple primero
  const {
    data: helloData,
    isLoading: helloLoading,
    error: helloError,
  } = trpc.hello.useQuery({ name: 'World' });

  // Usar el patrón tRPC recomendado con React Query integrado
  const {
    data: queryResult,
    isLoading,
    error,
  } = trpc.chat.getConversations.useQuery({ ...filters, ...pagination }, {
    refetchOnWindowFocus: true,
    refetchInterval: 2000, // Poll every 2 seconds for real-time updates
  });

  const conversations = queryResult?.conversations || [];
  const total = queryResult?.total || 0;
  const totalPages = queryResult?.totalPages || 1;

  // TODO: Implement delete conversation endpoint in backend
  // const deleteMutation = trpc.chat.deleteConversation.useMutation({
  //   onSuccess: () => {
  //     utils.chat.getConversations.invalidate();
  //   },
  // });

  const handleDelete = (conversationId: string) => {
    // TODO: Implement when backend endpoint is ready
    alert(`Delete conversation ${conversationId}. Backend endpoint not implemented yet.`);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  if (helloLoading) return <div>Loading tRPC test...</div>;
  if (helloError) return <div>tRPC Error: {helloError.message}</div>;

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Chat Conversations"
        description="Monitor and manage support conversations"
      />

      {/* Debug info */}
      {helloData && (
        <div className="p-4 bg-green-100 rounded-lg">
          <p className="text-sm">✅ tRPC Connection OK: {helloData.greeting}</p>
        </div>
      )}

      <ConversationFilters onApplyFilters={setFilters} />
      <ChatConversationsTableAlianza 
        conversations={conversations} 
        onDelete={handleDelete}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    </div>
  );
}
