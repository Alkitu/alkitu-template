'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Send } from 'lucide-react';
import { MessageBubble } from '../chat/MessageBubble';
import { playNotificationSound } from './utils/notificationSounds';

interface ChatInterfaceProps {
  messages: any[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  config: any;
  soundEnabled?: boolean;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  config,
  soundEnabled = true,
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      if (soundEnabled) playNotificationSound('sent');
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: config?.backgroundColor || '#FFFFFF' }}
    >
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={{
              id: msg.id,
              content: msg.content,
              sender: msg.isFromVisitor ? 'user' : 'admin',
              createdAt: msg.createdAt,
              senderName: msg.senderName,
              senderRole: msg.senderRole,
              isFromVisitor: msg.isFromVisitor,
              isRead: msg.isRead,
              isDelivered: msg.isDelivered,
              metadata: msg.metadata,
            }}
            isMe={msg.isFromVisitor}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t flex items-center space-x-2"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
