'use client';

import { Button } from '@/components/primitives/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/ui/card';
import { Search, MessageSquarePlus, Clock } from 'lucide-react';
import { useChatTheme } from '../hooks/useChatTheme';
import Image from 'next/image';

interface WelcomeScreenProps {
  onStartNewChat: () => void;
  onContinueChat: (conversationId: string) => void;
  onSeeConversations?: () => void;
  recentConversations: any[];
}

export function WelcomeScreen({
  onStartNewChat,
  onContinueChat,
  onSeeConversations,
  recentConversations,
}: WelcomeScreenProps) {
  const theme = useChatTheme();
  const hasRecentChats = recentConversations.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header with branding */}
      <div 
        className="p-6 text-white"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <div className="flex items-center gap-3 mb-4">
          {theme.logoIcon && (
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <div dangerouslySetInnerHTML={{ __html: theme.logoIcon }} className="w-6 h-6" />
            </div>
          )}
          <h1 className="text-xl font-bold">{theme.companyName}</h1>
        </div>
        <p className="text-sm opacity-90">
          We're here to help 24/7. Start a conversation or continue where you left off.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {/* New Conversation Card */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2"
          style={{ borderColor: `${theme.primaryColor}20` }}
          onClick={onStartNewChat}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${theme.primaryColor}10` }}
              >
                <MessageSquarePlus 
                  className="w-5 h-5" 
                  style={{ color: theme.primaryColor }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">New Conversation</h3>
                <p className="text-sm text-gray-500">We typically reply in a few minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Conversations */}
        {hasRecentChats && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-medium text-gray-500 uppercase">Recent Chats</h3>
              {onSeeConversations && (
                <button 
                  onClick={onSeeConversations}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  See all
                </button>
              )}
            </div>
            {recentConversations.slice(0, 2).map((conv) => (
              <Card
                key={conv.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-gray-100"
                onClick={() => onContinueChat(conv.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                         style={{ backgroundColor: `${theme.primaryColor}10` }}>
                      <Clock className="w-4 h-4" style={{ color: theme.primaryColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {conv.lastMessage?.content || 'Continue your chat...'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatTimestamp(new Date(conv.updatedAt || conv.createdAt))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Center (Optional) */}
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Need quick answers?</h3>
                <p className="text-xs text-gray-500">Search our knowledge base</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="p-3 border-t text-center">
        <p className="text-xs text-gray-400">
          Powered by {theme.companyName}
        </p>
      </div>
    </div>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
