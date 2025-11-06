'use client';

import { trpc } from '@/lib/trpc';
import { ConversationList } from '@/components/chat/ConversationList';
import { ConversationFilters } from '@/components/chat/ConversationFilters';
import { Typography } from '@/components/atomic-design/atoms/typography';
import { useState } from 'react';

export default function ChatDashboardPage() {
  const [filters, setFilters] = useState({});

  // Test con endpoint simple primero
  const {
    data: helloData,
    isLoading: helloLoading,
    error: helloError,
  } = trpc.hello.useQuery({ name: 'World' }); // TODO: Implement this

  // Usar el patrón tRPC recomendado con React Query integrado
  const {
    data: conversations,
    isLoading,
    error,
  } = trpc.chat.getConversations.useQuery(filters, { // TODO: Implement this
    refetchOnWindowFocus: false,
    refetchInterval: 30000, // Refetch cada 30 segundos para datos actualizados
    enabled: false, // Deshabilitado por ahora para testing
  });

  if (helloLoading) return <div>Loading tRPC test...</div>;
  if (helloError) return <div>tRPC Error: {helloError.message}</div>;

  return (
    <div className="space-y-6">
      <Typography variant="h1" className="text-3xl font-bold">
        Chat Conversations
      </Typography>

      {/* Debug info */}
      {helloData && (
        <div className="p-4 bg-green-100 rounded-lg">
          <p className="text-sm">✅ tRPC Connection OK: {helloData.greeting}</p>
        </div>
      )}

      <ConversationFilters onApplyFilters={setFilters} />
      <ConversationList conversations={conversations || []} />
    </div>
  );
}
