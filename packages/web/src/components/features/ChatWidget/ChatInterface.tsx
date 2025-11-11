'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/Input';
import { Send } from 'lucide-react';

interface ChatInterfaceProps {
  messages: any[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  config: any;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  config,
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
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.isFromVisitor ? 'text-left' : 'text-right'}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${msg.isFromVisitor ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
            >
              {msg.content}
            </div>
          </div>
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
