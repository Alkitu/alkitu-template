'use client';

import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useChat } from './hooks/useChat';
import { useChatTheme } from './hooks/useChatTheme';
import { Button } from '@/components/primitives/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/primitives/Card';
import { saveConversation } from './utils/conversationStorage';
import { ConversationList } from './components/ConversationList';
import { ChevronLeft, MessageCircle, X } from 'lucide-react';
import { ContactForm } from './ContactForm';
import { ChatInterface } from './ChatInterface';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuickReplies, defaultQuickReplies } from './components/QuickReplies';
import { TypingIndicator } from './components/TypingIndicator';
import { ChatRating } from './components/ChatRating';
import { ChatOptionsMenu } from './components/ChatOptionsMenu';
import { ChangeNameDialog } from './components/ChangeNameDialog';
import { playNotificationSound, requestAudioPermission } from './utils/notificationSounds';

type ViewState = 'welcome' | 'conversations' | 'contact' | 'chat' | 'rating';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewState>('welcome');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showChangeNameDialog, setShowChangeNameDialog] = useState(false);
  // const [userName, setUserName] = useState('Guest'); // Removed in favor of user/lead

  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const isDraggingRef = useRef(false);
  const previousMessageCountRef = useRef(0);

  const { data: config } = trpc.chatbotConfig.get.useQuery();
  const theme = useChatTheme();

  const {
    conversation,
    messages,
    isLoading,
    isTyping,
    sendMessage,
    startConversation,
    resumeConversation,
    recentConversations,
    isLoadingHistory,
    hasStoredConversations,
    user,
    lead,
    saveLead,
  } = useChat();

  const displayName = user 
    ? `${user.firstname} ${user.lastname}`.trim() 
    : lead?.name || 'Guest';

  const sendTranscriptMutation = trpc.chat.sendEmailTranscript.useMutation({
    onSuccess: () => {
      alert('Transcript sent to your email!');
    },
    onError: (err) => {
      alert(`Error sending transcript: ${err.message}`);
    },
  });

  // Determine initial view
  useEffect(() => {
    if (isOpen) {
      if (conversation) {
        setView('chat');
      } else if (recentConversations.length > 0) {
        setView('welcome');
      } else {
        setView('contact');
      }
    }
  }, [isOpen, conversation, recentConversations]);

  // Play sound on new messages
  useEffect(() => {
    if (soundEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isFromVisitor) {
        playNotificationSound('message');
      }
    }
  }, [messages.length, soundEnabled]);

  // Track new messages for notification badge
  useEffect(() => {
    if (messages.length > previousMessageCountRef.current && !isOpen) {
      const newMessages = messages.slice(previousMessageCountRef.current);
      const unreadFromAdmin = newMessages.filter((m: any) => !m.isFromVisitor).length;
      if (unreadFromAdmin > 0) {
        setUnreadCount(prev => prev + unreadFromAdmin);
        setHasNewMessage(true);
      }
    }
    previousMessageCountRef.current = messages.length;
  }, [messages.length, isOpen]);

  const markAsReadMutation = trpc.chat.markAsReadVisitor.useMutation();
  const markAsDeliveredMutation = trpc.chat.markAsDeliveredVisitor.useMutation();

  // Reset unread count when opening
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setHasNewMessage(false);
      if (conversation?.id) {
        markAsReadMutation.mutate({ conversationId: conversation.id });
        markAsDeliveredMutation.mutate({ conversationId: conversation.id });
      }
    }
  }, [isOpen, conversation?.id]);

  // Mark new messages as delivered if we are in the chat view
  useEffect(() => {
    if (isOpen && conversation?.id && messages.length > 0) {
      markAsDeliveredMutation.mutate({ conversationId: conversation.id });
    }
  }, [messages.length, isOpen, conversation?.id]);

  const handleStartNewChat = () => {
    if (user || lead) {
       setView('chat');
    } else {
       setView('contact');
    }
  };

  const handleSeeConversations = () => {
    setView('conversations');
  };

  const handleContinueChat = (conversationId: string) => {
    resumeConversation(conversationId);
    setView('chat');
  };

  const handleBack = () => {
    if (view === 'chat' || view === 'contact') {
      if (hasStoredConversations) {
        setView('conversations');
      } else {
        setView('welcome');
      }
    } else if (view === 'conversations') {
      setView('welcome');
    }
  };

  const handleContactSubmit = async (contactData: any) => {
    saveLead({ name: contactData.name, email: contactData.email, phone: contactData.phone });
    await startConversation({
      ...contactData,
      message: contactData.initialMessage || 'Hello',
    });
    setView('chat');
    setShowQuickReplies(true);
  };

  const handleQuickReply = (reply: { text: string; value?: string }) => {
    if (soundEnabled) playNotificationSound('sent');
    sendMessage(reply.value || reply.text);
    setShowQuickReplies(false);
  };

  const handleRatingSubmit = (rating: number, feedback?: string) => {
    console.log('Rating:', { rating, feedback, conversationId: conversation?.id });
    setView('welcome');
  };

  const handleEmailTranscript = (email?: string) => {
    if (conversation?.id) {
      const recipientEmail = email || 
                            (recentConversations as any[]).find((c: any) => c.id === conversation.id)?.contactInfo?.email;
      
      if (recipientEmail) {
        sendTranscriptMutation.mutate({ 
          conversationId: conversation.id,
          email: recipientEmail 
        });
      } else {
        const userEmail = prompt('Please enter your email to receive the transcript:');
        if (userEmail) {
          sendTranscriptMutation.mutate({ 
            conversationId: conversation.id, 
            email: userEmail 
          });
        }
      }
    }
  };

  const openPopup = () => {
    const url = `/chat/popup/${conversation?.id || 'new'}`;
    window.open(url, 'ChatWidget', 'width=400,height=600');
  };

  // Position
  const positionStyles = {
    bottom: '1rem',
    left: config?.position === 'bottom-left' ? '1rem' : 'auto',
    right: config?.position === 'bottom-left' ? 'auto' : '1rem',
  };

  const baseMotionProps = {
    drag: true,
    dragMomentum: false,
    onDragStart: () => { isDraggingRef.current = true; },
    onDragEnd: () => { setTimeout(() => { isDraggingRef.current = false; }, 100); },
    style: { ...positionStyles, touchAction: 'none' },
  };

  const buttonMotionProps = {
    ...baseMotionProps,
    className: 'scale-60  border-2 border-primary/40 rounded-full fixed z-40 cursor-move aspect-square w-20 h-20 p-0 shadow-none flex items-center justify-center bg-primary/10',
  };

  const widgetMotionProps = {
    ...baseMotionProps,
    className: 'fixed z-40 cursor-move',
    style: { 
      ...positionStyles, 
      touchAction: 'none',
      bottom: '1rem', // Ensure it stays anchored to the bottom area
      maxHeight: 'calc(100vh - 2rem)',
    },
  };

  return (
    <AnimatePresence mode="wait">
      {!isOpen ? (
        <motion.div key="button" {...buttonMotionProps} >
          <motion.div
            className="relative p-0 flex items-center justify-center m-auto s "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={(e) => {
                if (isDraggingRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                setIsOpen(true);
              }}
              className="p-0 m-auto shadow-none bg-transparent border-none hover:bg-transparent flex items-center justify-center overflow-visible focus-visible:outline-primary focus-visible:outline-[3px] focus-visible:outline-offset-[6px]"
              style={{ 
                boxShadow: 'none',
                width: '100%', 
                height: '100%',
                borderRadius: '50%',
              }}
            >
              
              {/* Icon */}
              <MessageCircle className="h-10 w-10 text-primary relative z-10 " />
              
              {/* Notification Badge / Pulsing Light */}
              {hasNewMessage && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 z-20 "
                >
                  <div className="relative">
                    {/* Pulsing light behind the badge */}
                    <motion.div
                      className="absolute inset-0 bg-red-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    
                    {/* The Badge itself (Dot only, no text) */}
                    <div className="relative bg-red-500 rounded-full w-4 h-4 shadow-lg border-2 border-white" />
                  </div>
                </motion.div>
              )}
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="widget"
          {...widgetMotionProps}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
        >
          <Card className="w-[380px] h-[600px] max-h-[calc(100vh-2rem)] shadow-2xl p-0 flex flex-col">
            <CardHeader
              className="flex flex-row items-center justify-between p-4"
              style={{
                backgroundColor: theme.primaryColor,
                borderRadius: '0.5rem 0.5rem 0 0',
              }}
            >
              <div className="flex items-center gap-2">
                {(view === 'chat' || view === 'conversations' || view === 'contact') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                    onClick={handleBack}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                )}
                <CardTitle className="text-white text-lg">
                  {view === 'conversations' ? 'Messages' : theme.companyName}
                </CardTitle>
              </div>
              <div className="flex gap-1">
                <ChatOptionsMenu
                  onChangeName={() => setShowChangeNameDialog(true)}
                  onEmailTranscript={view === 'chat' ? () => handleEmailTranscript() : undefined}
                  soundEnabled={soundEnabled}
                  onToggleSound={() => setSoundEnabled(!soundEnabled)}
                  onPopOut={view === 'chat' ? openPopup : undefined}
                  primaryColor={theme.primaryColor}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-white/20"
                  onClick={() => { setIsOpen(false); setTimeout(() => setView('welcome'), 300); }}
                >
                  <X className="h-5 w-5 text-white" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden pointer-events-auto">
              {view === 'welcome' && (
                <WelcomeScreen
                  onStartNewChat={handleStartNewChat}
                  onContinueChat={handleContinueChat}
                  onSeeConversations={handleSeeConversations}
                  recentConversations={recentConversations}
                />
              )}

              {view === 'conversations' && (
                <div className="flex-1 overflow-y-auto">
                  <ConversationList
                    conversations={recentConversations}
                    onSelect={handleContinueChat}
                    isLoading={isLoading}
                  />
                </div>
              )}

              {view === 'contact' && (
                <div className="p-4 overflow-y-auto">
                  <ContactForm 
                    onSubmit={handleContactSubmit} 
                    config={config} 
                    isLoading={isLoading}
                    initialData={lead} 
                  />
                </div>
              )}

              {view === 'chat' && (
                <div className="flex flex-col h-full">
                  <ChatInterface
                    messages={messages}
                    onSendMessage={sendMessage}
                    isLoading={isLoading}
                    config={config}
                    soundEnabled={soundEnabled}
                  />
                  
                  {isTyping && (
                    <TypingIndicator userName="Support" primaryColor={theme.primaryColor} />
                  )}
                  
                  {showQuickReplies && messages.length > 0 && !isLoading && (
                    <QuickReplies
                      options={defaultQuickReplies}
                      onSelect={handleQuickReply}
                      primaryColor={theme.primaryColor}
                    />
                  )}
                </div>
              )}

              {view === 'rating' && (
                <ChatRating
                  onSubmit={handleRatingSubmit}
                  onSkip={() => setView('welcome')}
                  primaryColor={theme.primaryColor}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Dialogs */}
      {showChangeNameDialog && (
        <ChangeNameDialog
          currentName={displayName}
          onSave={(newName) => {
            saveLead({
              name: newName,
              email: lead?.email || '',
              phone: lead?.phone,
            });
            setShowChangeNameDialog(false);
          }}
          onClose={() => setShowChangeNameDialog(false)}
        />
      )}
    </AnimatePresence>
  );
}
