'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { useChat } from './hooks/useChat';
import { Button } from '@/components/primitives/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/primitives/Card';
import { MessageCircle, X } from 'lucide-react';
import { ContactForm } from './ContactForm';
import { ChatInterface } from './ChatInterface';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'contact' | 'chat'>('contact');

  const { data: config } = useQuery({
    queryKey: ['chatbotConfig'],
    queryFn: () => trpc.chatbotConfig.get.query(), // TODO: Implement this
  });

  const { conversation, messages, isLoading, sendMessage, startConversation } =
    useChat();

  const handleStartChat = async (contactData: any) => {
    await startConversation(contactData);
    setStep('chat');
  };

  if (!isOpen) {
    return (
      <div
        className="fixed z-40"
        style={{
          bottom: config?.position === 'bottom-left' ? '1rem' : '1rem',
          right: config?.position === 'bottom-right' ? '1rem' : 'auto',
          left: config?.position === 'bottom-left' ? '1rem' : 'auto',
        }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg"
          style={{ backgroundColor: config?.primaryColor || '#007ee6' }}
        >
          <MessageCircle
            className="h-6 w-6"
            style={{ color: config?.textColor || '#FFFFFF' }}
          />
        </Button>
      </div>
    );
  }

  return (
    <div
      className="fixed z-40 w-80 h-96"
      style={{
        bottom: config?.position === 'bottom-left' ? '1rem' : '1rem',
        right: config?.position === 'bottom-right' ? '1rem' : 'auto',
        left: config?.position === 'bottom-left' ? '1rem' : 'auto',
      }}
    >
      <Card
        className="h-full flex flex-col shadow-2xl"
        style={{
          borderRadius: config?.borderRadius
            ? `${config.borderRadius}px`
            : '8px',
        }}
      >
        <CardHeader
          className="flex-row items-center justify-between p-4"
          style={{
            backgroundColor: config?.primaryColor || '#007ee6',
            color: config?.textColor || '#FFFFFF',
          }}
        >
          <CardTitle className="text-sm">
            {config?.welcomeMessage || 'Chat with us'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X
              className="h-4 w-4"
              style={{ color: config?.textColor || '#FFFFFF' }}
            />
          </Button>
        </CardHeader>

        <CardContent
          className="flex-1 p-0"
          style={{ backgroundColor: config?.backgroundColor || '#FFFFFF' }}
        >
          {step === 'contact' ? (
            <ContactForm
              onSubmit={handleStartChat}
              isLoading={isLoading}
              config={config}
            />
          ) : (
            <ChatInterface
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              config={config}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
