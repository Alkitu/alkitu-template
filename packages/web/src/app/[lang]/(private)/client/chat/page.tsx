'use client';

import { useState, useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/ui/card';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { MessageCircle, Send, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import {
  getStoredConversations,
  saveConversation,
  getActiveConversationId,
  setActiveConversationId,
} from '@/components/features/ChatWidget/utils/conversationStorage';
import type { StoredConversation } from '@/components/features/ChatWidget/utils/conversationStorage';

/**
 * Client Chat Page
 *
 * Full-page chat interface for authenticated clients.
 * Uses the same localStorage conversation tracking as the ChatWidget
 * and the public tRPC chat endpoints.
 */
export default function ClientChatPage() {
  const [storedConversations, setStoredConversations] = useState<StoredConversation[]>([]);
  const [activeConversationId, setActiveConvId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  // Load stored conversations from localStorage on mount
  useEffect(() => {
    const stored = getStoredConversations();
    setStoredConversations(stored);
    const activeId = getActiveConversationId();
    if (activeId && stored.some((c) => c.conversationId === activeId)) {
      setActiveConvId(activeId);
    }
  }, []);

  // Fetch conversation details from backend
  const conversationIds = storedConversations.map((c) => c.conversationId);
  const { data: conversations } = trpc.chat.getConversationsVisitor.useQuery(
    { conversationIds },
    { enabled: conversationIds.length > 0, refetchInterval: 10000 },
  );

  // Fetch messages for active conversation
  const { data: messages, isLoading: messagesLoading } = trpc.chat.getMessages.useQuery(
    { conversationId: activeConversationId! },
    { enabled: !!activeConversationId, refetchInterval: 5000 },
  );

  // Mutations
  const startConversationMutation = trpc.chat.startConversation.useMutation();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartConversation = async () => {
    try {
      const result = await startConversationMutation.mutateAsync({
        source: 'client-portal',
        message: 'Hola, necesito ayuda.',
      });

      const convId = result.conversation.id;
      const newConv: StoredConversation = {
        conversationId: convId,
        lastMessage: 'Hola, necesito ayuda.',
        timestamp: new Date(),
        status: 'active',
        unreadCount: 0,
      };

      saveConversation(newConv);
      setStoredConversations(getStoredConversations());
      setActiveConvId(convId);
      setActiveConversationId(convId);
      utils.chat.getConversationsVisitor.invalidate();
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversationId || isSending) return;

    const content = messageInput.trim();
    setMessageInput('');
    setIsSending(true);

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: activeConversationId,
        content,
        isFromVisitor: true,
      });

      // Update stored conversation
      const stored = getStoredConversations();
      const existing = stored.find((c) => c.conversationId === activeConversationId);
      if (existing) {
        saveConversation({ ...existing, lastMessage: content, timestamp: new Date() });
        setStoredConversations(getStoredConversations());
      }

      utils.chat.getMessages.invalidate({ conversationId: activeConversationId });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageInput(content); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConvId(conversationId);
    setActiveConversationId(conversationId);
  };

  const handleBackToList = () => {
    setActiveConvId(null);
    setActiveConversationId(null);
  };

  // Get enriched conversation data (merge localStorage + backend)
  const enrichedConversations = storedConversations.map((stored) => {
    const backend = conversations?.find(
      (c: { id: string }) => c.id === stored.conversationId,
    ) as { id: string; status: string; lastMessageAt: string | Date; contactInfo?: { name?: string; email?: string } } | undefined;
    return {
      ...stored,
      backendStatus: backend?.status,
      lastMessageAt: backend?.lastMessageAt,
      contactInfo: backend?.contactInfo || stored.contactInfo,
    };
  });

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Chat de Soporte</h1>
        <p className="text-muted-foreground">Comunícate con nuestro equipo de soporte</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Conversation List */}
        <Card className={`lg:col-span-1 flex flex-col ${activeConversationId ? 'hidden lg:flex' : 'flex'}`}>
          <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Conversaciones</CardTitle>
            <Button size="sm" onClick={handleStartConversation} disabled={startConversationMutation.isPending}>
              {startConversationMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="ml-1">Nueva</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-2 p-4 pt-0">
            {enrichedConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
                <MessageCircle className="h-12 w-12 mb-4 opacity-40" />
                <p className="text-sm font-medium">No hay conversaciones</p>
                <p className="text-xs mt-1">Inicia una nueva conversación con soporte</p>
              </div>
            ) : (
              enrichedConversations.map((conv) => (
                <button
                  key={conv.conversationId}
                  onClick={() => handleSelectConversation(conv.conversationId)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    activeConversationId === conv.conversationId
                      ? 'bg-primary/10 border-primary/30'
                      : 'hover:bg-muted/50 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">
                      {conv.contactInfo?.name || 'Conversación'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {conv.lastMessageAt
                        ? new Date(conv.lastMessageAt).toLocaleDateString()
                        : new Date(conv.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  {conv.backendStatus === 'CLOSED' && (
                    <span className="text-xs text-muted-foreground/60 mt-1 inline-block">Cerrada</span>
                  )}
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className={`lg:col-span-2 flex flex-col ${!activeConversationId ? 'hidden lg:flex' : 'flex'}`}>
          {activeConversationId ? (
            <>
              {/* Chat Header */}
              <CardHeader className="flex-shrink-0 flex flex-row items-center gap-3 border-b py-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={handleBackToList}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <MessageCircle className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Chat con Soporte</CardTitle>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : messages && messages.length > 0 ? (
                  messages.map((msg: { id: string; isFromVisitor: boolean; content: string; createdAt: string | Date }) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isFromVisitor ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 text-sm ${
                          msg.isFromVisitor
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <span className="text-[10px] opacity-70 mt-1 block">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No hay mensajes aún. Envía el primero.
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="flex-shrink-0 border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    disabled={isSending}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!messageInput.trim() || isSending}>
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageCircle className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">Selecciona una conversación</p>
              <p className="text-sm mt-1">O inicia una nueva para contactar a soporte</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
