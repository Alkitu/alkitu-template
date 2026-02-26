'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { io, Socket } from 'socket.io-client';
import { logger } from '@/lib/logger';
import { 
  getStoredConversations, 
  saveConversation, 
  getActiveConversationId,
  setActiveConversationId 
} from '../utils/conversationStorage';

export function useChat() {
  const utils = trpc.useUtils();
  const [conversation, setConversation] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Auth & Lead State
  const { data: user, isLoading: isLoadingUser } = trpc.user.me.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const [lead, setLead] = useState<{ name: string; email: string; phone?: string } | null>(null);

  useEffect(() => {
    // Load lead from local storage on mount
    const storedLead = localStorage.getItem('alkitu_chat_lead');
    if (storedLead) {
      try {
        setLead(JSON.parse(storedLead));
      } catch {
        // Corrupted lead data in localStorage, ignore
      }
    }
  }, []);

  const saveLead = (leadData: { name: string; email: string; phone?: string }) => {
    setLead(leadData);
    localStorage.setItem('alkitu_chat_lead', JSON.stringify(leadData));
  };


  // Auto-resume active conversation on mount
  // Auto-resume active conversation and hydration lead
  useEffect(() => {
    const activeId = getActiveConversationId();
    if (activeId) {
      const stored = getStoredConversations().find(c => c.conversationId === activeId);
      if (stored) {
        setConversation({ id: activeId, ...stored });
        
        // Hydrate lead from stored conversation if missing
        if (!lead && stored.contactInfo) {
          const restoredLead = {
            name: stored.contactInfo.name || '',
            email: stored.contactInfo.email || '',
            phone: (stored.contactInfo as any).phone || '',
          };
          setLead(restoredLead);
          // Sync to lead storage too for future
          localStorage.setItem('alkitu_chat_lead', JSON.stringify(restoredLead));
        }
      } else {
        setConversation({ id: activeId });
      }
    }
  }, [lead]); // Dependency on lead to ensure we don't overwrite if already set? 
  // Actually, empty dependency array is better for mount, but lead check inside ensures safety.
  // We need to be careful not to create infinite loop if we add dependencies.
  // Let's keep dependencies safe.

  const { data: messages = [] } = trpc.chat.getMessages.useQuery(
    { conversationId: conversation?.id },
    {
      enabled: !!conversation,
      refetchInterval: 2000,
      refetchOnWindowFocus: true,
    }
  );

  const storedConversations = getStoredConversations();
  const conversationIds = storedConversations.map(c => c.conversationId);

  // Fetch Visitor Conversations (Local IDs)
  const { data: visitorConversations = [], isLoading: isLoadingVisitor } = trpc.chat.getConversationsVisitor.useQuery(
    { conversationIds },
    {
      enabled: !user && conversationIds.length > 0,
      refetchInterval: 10000,
    }
  );

  // Fetch User Conversations (Backend ID)
  const { data: userConversations = [], isLoading: isLoadingUserChat } = trpc.chat.getMyConversations.useQuery(
    undefined,
    {
      enabled: !!user,
      refetchInterval: 10000,
    }
  );

  // Unified Conversations List
  const recentConversations = user ? userConversations : visitorConversations;
  const isLoadingHistory = user ? isLoadingUserChat : isLoadingVisitor;
  const hasStoredConversations = user ? userConversations.length > 0 : storedConversations.length > 0;

  const startConversationMutation = trpc.chat.startConversation.useMutation({
    onSuccess: (data) => {
      setConversation(data.conversation);
      setActiveConversationId(data.conversation.id);
      
      // Save locally only if visitor
      if (!user) {
        saveConversation({
          conversationId: data.conversation.id,
          lastMessage: 'Conversation started',
          timestamp: new Date(),
          status: 'active',
          unreadCount: 0,
          contactInfo: data.contactInfo as any,
        });
      }
    },
  });

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      utils.chat.getMessages.invalidate({ conversationId: conversation?.id });
      
      if (data.message && !user) {
        saveConversation({
          conversationId: conversation.id,
          lastMessage: data.message.content,
          timestamp: new Date(),
          status: 'active',
          unreadCount: 0,
        });
      }
    },
  });

  useEffect(() => {
    if (conversation?.id) {
      const chatUrl =
        process.env.NODE_ENV === 'production'
          ? '/chat'
          : 'http://localhost:3001/chat';

      const socket: Socket = io(chatUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        logger.debug('Chat WebSocket connected');
        socket.emit('chat:join', { conversationId: conversation.id });
      });

      socket.on('chat:typing', (data: { isTyping: boolean }) => {
        setIsTyping(data.isTyping);
        if (data.isTyping) {
          setTimeout(() => setIsTyping(false), 3000);
        }
      });

      socket.on('chat:newMessage', () => {
        utils.chat.getMessages.invalidate({ conversationId: conversation.id });
      });

      return () => {
        socket.emit('chat:leave', { conversationId: conversation.id });
        socket.disconnect();
      };
    }
  }, [conversation?.id, utils]);

  const resumeConversation = (conversationId: string) => {
    setConversation({ id: conversationId });
    setActiveConversationId(conversationId);
  };

  return {
    user,
    lead,
    saveLead,
    conversation,
    messages,
    isLoading: startConversationMutation.isPending || sendMessageMutation.isPending || isLoadingUser,
    isTyping,
    startConversation: (data: any) => startConversationMutation.mutateAsync({
      ...data,
      userId: user?.id, // Attach userId if logged in
    }),
    sendMessage: async (content: string) => {
      if (!conversation?.id) {
        const name = user ? `${user.firstname} ${user.lastname}` : lead?.name;
        const email = user?.email || lead?.email;
        const phone = (user as any)?.contactNumber || lead?.phone;

        if (!name && !email) {
          throw new Error('No identity found');
        }

        return startConversationMutation.mutateAsync({
          name,
          email,
          phone,
          userId: user?.id,
          message: content,
          source: 'website',
        });
      }

      return sendMessageMutation.mutateAsync({
        conversationId: conversation.id,
        content,
        isFromVisitor: true,
        senderUserId: user?.id,
      });
    },
    resumeConversation,
    recentConversations,
    isLoadingHistory,
    hasStoredConversations,
  };
}
