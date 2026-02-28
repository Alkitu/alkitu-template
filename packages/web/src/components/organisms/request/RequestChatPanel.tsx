'use client';

import React, { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/primitives/ui/card';
import { Button } from '@/components/primitives/ui/button';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/primitives/ui/textarea';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/trpc-error-handler';
import { ScrollArea } from '@/components/primitives/ui/scroll-area';
import { Avatar } from '@/components/primitives/ui/avatar';

interface RequestChatPanelProps {
  requestId: string;
}

export function RequestChatPanel({ requestId }: RequestChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');

  // Get or create conversation for this request
  const createConversation =
    trpc.chat.getOrCreateRequestConversation.useMutation({
      onSuccess: (conversation) => {
        setConversationId(conversation.id);
      },
      onError: (error) => handleApiError(error),
    });

  // Get messages for the conversation
  const { data: messages, refetch: refetchMessages } =
    trpc.chat.getMessages.useQuery(
      { conversationId: conversationId || '' },
      {
        enabled: !!conversationId,
        refetchInterval: 3000, // Poll every 3 seconds for new messages
      },
    );

  // Send message mutation
  const sendMessage = trpc.chat.replyToMessage.useMutation({
    onSuccess: () => {
      setMessageContent('');
      refetchMessages();
      toast.success('Message sent');
    },
    onError: (error) => handleApiError(error),
  });

  const handleOpenChat = async () => {
    if (!conversationId && !createConversation.isPending) {
      createConversation.mutate({ requestId });
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (!messageContent.trim() || !conversationId) return;

    sendMessage.mutate({
      conversationId,
      content: messageContent,
      senderUserId: 'current-user', // This will be handled by the backend context
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Internal Team Chat</h3>
          <p className="text-sm text-muted-foreground">
            Discuss this request with your team
          </p>
        </div>
        <Button onClick={handleOpenChat} variant="outline" size="sm">
          {createConversation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <MessageSquare className="h-4 w-4 mr-2" />
          )}
          {isOpen ? 'Hide Chat' : 'Open Chat'}
        </Button>
      </div>

      {isOpen && (
        <div className="space-y-4 border-t pt-4">
          {/* Messages Area */}
          <ScrollArea className="h-96 w-full rounded-md border p-4">
            <div className="space-y-4">
              {messages && messages.length > 0 ? (
                messages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.isFromVisitor
                        ? 'flex-row'
                        : 'flex-row-reverse'
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-sm font-medium">
                        {message.senderUser
                          ? message.senderUser.firstname?.[0]?.toUpperCase()
                          : 'U'}
                      </div>
                    </Avatar>
                    <div
                      className={`flex flex-col gap-1 ${
                        message.isFromVisitor ? 'items-start' : 'items-end'
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-md ${
                          message.isFromVisitor
                            ? 'bg-muted'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[60px] resize-none"
              disabled={sendMessage.isPending || !conversationId}
            />
            <Button
              onClick={handleSendMessage}
              disabled={
                !messageContent.trim() ||
                sendMessage.isPending ||
                !conversationId
              }
              size="icon"
              className="h-[60px] w-[60px]"
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
