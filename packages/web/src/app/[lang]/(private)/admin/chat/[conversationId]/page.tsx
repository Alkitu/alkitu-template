'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { useParams } from 'next/navigation';
import { ConversationDetail } from '@/components/chat/ConversationDetail';
import { ReplyForm } from '@/components/chat/ReplyForm';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { AssignmentSelect } from '@/components/chat/AssignmentSelect';
import { StatusSelect } from '@/components/chat/StatusSelect';
import { InternalNotes } from '@/components/chat/InternalNotes';
import { Typography } from '@/components/atomic-design/atoms/typography';

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const queryClient = useQueryClient();

  const {
    data: conversationsData,
    isLoading: isLoadingConversation,
    error: conversationError,
  } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => trpc.chat.getConversations.query({}),
    enabled: !!conversationId,
  });

  // Find the specific conversation from the list
  const conversation = conversationsData?.find(
    (conv) => conv.id === conversationId,
  );

  // Get messages from the conversation (this will need to be handled differently since messages aren't in the conversation object)
  const messages: any[] = []; // Placeholder - messages should be fetched separately

  const replyMutation = useMutation({
    mutationFn: (content: string) =>
      trpc.chat.sendMessage.mutate({
        conversationId,
        content,
        isFromVisitor: false,
        senderUserId: 'admin', // This should be the actual admin user ID
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId],
      });
    },
  });

  const assignMutation = useMutation({
    mutationFn: (assignedToId: string) => {
      // This would need a backend implementation
      console.log('Assigning conversation', conversationId, 'to', assignedToId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId],
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => {
      // This would need a backend implementation
      console.log('Updating conversation status', conversationId, 'to', status);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId],
      });
    },
  });

  useEffect(() => {
    if (conversationId) {
      const socket = io(); // Replace with your socket server URL

      socket.on('newMessage', (message) => {
        if (message.conversationId === conversationId) {
          queryClient.invalidateQueries({
            queryKey: ['chatMessages', conversationId],
          });
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [conversationId, queryClient]);

  if (isLoadingConversation) return <div>Loading conversation...</div>;
  if (conversationError)
    return <div>Error loading conversation: {conversationError.message}</div>;
  if (!conversation) return <div>Conversation not found.</div>;

  return (
    <div className="container mx-auto py-10">
      <Typography
        variant="h1"
        className="text-3xl font-bold mb-6"
        migrated={true}
      >
        Conversation with {conversationId}
      </Typography>
      <div className="flex space-x-4 mb-4">
        <AssignmentSelect
          currentAssignment={conversation.assignedToId}
          onAssign={assignMutation.mutate}
        />
        <StatusSelect
          currentStatus={conversation.status as any}
          onStatusChange={updateStatusMutation.mutate}
        />
      </div>
      <ConversationDetail messages={messages} />
      <ReplyForm
        onSend={replyMutation.mutate}
        isLoading={replyMutation.isPending}
      />
      <InternalNotes
        conversationId={conversation.id}
        initialNotes={conversation.internalNotes || ''}
      />
    </div>
  );
}
