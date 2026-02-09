'use client';

import { trpc } from '@/lib/trpc';
import { useParams } from 'next/navigation';
import { ConversationDetail } from '@/components/features/chat/ConversationDetail';
import { ReplyForm } from '@/components/features/chat/ReplyForm';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { AssignmentSelect } from '@/components/features/chat/AssignmentSelect';
import { StatusSelect } from '@/components/features/chat/StatusSelect';
import { InternalNotes } from '@/components/features/chat/InternalNotes';
import { Typography } from '@/components/atoms-alianza/Typography';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const utils = trpc.useUtils();

  // Get current user (admin) data
  const { data: currentUser } = trpc.user.me.useQuery();

  // Fetch messages for this conversation
  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    error: messagesError,
  } = trpc.chat.getMessages.useQuery(
    { conversationId },
    {
      enabled: !!conversationId,
      refetchInterval: 2000, // Refresh every 2 seconds for near real-time updates
      refetchOnWindowFocus: true,
    }
  );

  // Fetch conversation details (for metadata like status, assignment)
  const {
    data: conversation,
    isLoading: isLoadingConversation,
  } = trpc.chat.getConversation.useQuery(
    { conversationId },
    {
      enabled: !!conversationId,
    }
  );

  const replyMutation = trpc.chat.replyToMessage.useMutation({
    onSuccess: () => {
      utils.chat.getMessages.invalidate({ conversationId });
    },
  });

  const assignMutation = trpc.chat.assignConversation.useMutation({
    onSuccess: () => {
      utils.chat.getConversations.invalidate();
    },
  });

  const updateStatusMutation = trpc.chat.updateStatus.useMutation({
    onSuccess: () => {
      utils.chat.getConversations.invalidate();
    },
  });

  const markAsReadMutation = trpc.chat.markAsRead.useMutation();
  const markAsDeliveredMutation = trpc.chat.markAsDelivered.useMutation();

  // Mark as read and delivered when viewing
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      markAsReadMutation.mutate({ conversationId, userId: currentUser?.id || 'admin' });
      markAsDeliveredMutation.mutate({ conversationId });
    }
  }, [conversationId, messages.length, currentUser?.id]);

  useEffect(() => {
    if (conversationId) {
      const socket = io(); // Replace with your socket server URL

      socket.on('newMessage', (message) => {
        if (message.conversationId === conversationId) {
          utils.chat.getMessages.invalidate({ conversationId });
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [conversationId, utils]);

  if (isLoadingConversation || isLoadingMessages) return <div>Loading conversation...</div>;
  if (messagesError)
    return <div>Error loading messages: {messagesError.message}</div>;
  if (!conversation) return <div>Conversation not found.</div>;

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title={`Conversation ${conversation.id}`}
        description="Manage support conversation"
        backHref={`/admin/chat`}
        backLabel="Back to Chat"
        actions={
          <>
            <AssignmentSelect
              currentAssignment={conversation.assignedToId}
              onAssign={(assignedToId) => assignMutation.mutate({ conversationId, assignedToId })}
            />
            <StatusSelect
              currentStatus={conversation.status}
              onStatusChange={(status) => updateStatusMutation.mutate({ conversationId, status })}
            />
          </>
        }
      />
      <ConversationDetail messages={messages} currentUserId={currentUser?.id} />
      <ReplyForm
        onSend={(content) => replyMutation.mutate({ 
          conversationId, 
          content,
          senderUserId: currentUser?.id || 'admin'
        })}
        isLoading={replyMutation.isPending}
      />
      <InternalNotes
        conversationId={conversation.id}
        initialNotes={conversation.internalNotes || ''}
      />
    </div>
  );
}
