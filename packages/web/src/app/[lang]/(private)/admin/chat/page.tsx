'use client';

import { trpc } from '@/lib/trpc';
import { ConversationList } from '@/components/features/chat/ConversationList';
import { ConversationFilters } from '@/components/features/chat/ConversationFilters';
import { Typography } from '@/components/atoms/typography';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/molecules/admin-page-header';

export default function ChatDashboardPage() {
  const [filters, setFilters] = useState({});
  const utils = trpc.useUtils();

  // Test con endpoint simple primero
  const {
    data: helloData,
    isLoading: helloLoading,
    error: helloError,
  } = trpc.hello.useQuery({ name: 'World' });

  // Usar el patrón tRPC recomendado con React Query integrado
  const {
    data: conversations,
    isLoading,
    error,
  } = trpc.chat.getConversations.useQuery(filters, {
    refetchOnWindowFocus: true,
    refetchInterval: 2000, // Poll every 2 seconds for real-time updates
  });

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
      <ConversationList 
        conversations={conversations || []} 
        onDelete={handleDelete}
      />
    </div>
  );
}
