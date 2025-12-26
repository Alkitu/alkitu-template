'use client';

import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ChevronRight, Clock } from 'lucide-react';
import { Badge } from '@/components/atoms/badge';
import { cn } from '@/lib/utils';
import { ConversationStatus } from '@prisma/client';

interface ConversationListProps {
  conversations: any[];
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

const statusColors: Record<ConversationStatus, string> = {
  OPEN: 'bg-green-100 text-green-800 border-green-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  WAITING_CUSTOMER: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  RESOLVED: 'bg-purple-100 text-purple-800 border-purple-200',
  CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function ConversationList({ conversations, onSelect, isLoading }: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-gray-500">Loading your conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10 px-6 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
          <MessageSquare className="h-8 w-8 text-gray-300" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">No conversations yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            Start a new chat to get help from our team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2 p-4 animate-in fade-in slide-in-from-bottom-2">
      <h3 className="text-sm font-semibold text-gray-500 px-1 mb-2 uppercase tracking-wider">
        Past Conversations
      </h3>
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 transition-all text-left shadow-sm group active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <MessageSquare className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(conv.updatedAt || conv.createdAt), { addSuffix: true })}
              </span>
              <Badge variant="outline" className={cn("text-[10px] py-0 px-1.5 h-4", statusColors[conv.status as ConversationStatus])}>
                {conv.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <p className="text-sm font-medium text-gray-900 line-clamp-1">
              Conversation #{conv.id.slice(-6).toUpperCase()}
            </p>
            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 italic">
              {conv.lastMessage?.content || 'Continue your chat...'}
            </p>
          </div>

          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 mt-5 transition-colors" />
        </button>
      ))}
    </div>
  );
}
