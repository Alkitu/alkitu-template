'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { io } from 'socket.io-client';

export function useChat() {
  const queryClient = useQueryClient();
  const [conversation, setConversation] = useState<any>(null);

  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['chatMessages', conversation?.id],
    queryFn: () =>
      trpc.chat.getConversations.query({ conversationId: conversation.id }), // TODO: Implement this
    enabled: !!conversation,
    select: (data) => data?.messages || [],
  });

  const startConversationMutation = useMutation({
    mutationFn: (data: any) => trpc.chat.startConversation.mutate(data),
    onSuccess: (data) => {
      setConversation(data.conversation);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      trpc.chat.sendMessage.mutate({
        conversationId: conversation.id,
        content,
        isFromVisitor: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chatMessages', conversation.id],
      });
    },
  });

  useEffect(() => {
    if (conversation) {
      const socket = io(); // Replace with your socket server URL

      socket.on('newMessage', (message) => {
        if (message.conversationId === conversation.id) {
          queryClient.invalidateQueries({
            queryKey: ['chatMessages', conversation.id],
          });
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [conversation, queryClient]);

  return {
    conversation,
    messages,
    isLoading:
      startConversationMutation.isPending || sendMessageMutation.isPending,
    startConversation: startConversationMutation.mutateAsync,
    sendMessage: (content: string) => sendMessageMutation.mutateAsync(content),
  };
}
