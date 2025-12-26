import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'bot' | 'admin';
    createdAt: string | Date;
    senderName?: string;
    senderRole?: string;
    isFromVisitor?: boolean;
    isRead?: boolean;
    isDelivered?: boolean;
    metadata?: Record<string, any>;
  };
  isMe?: boolean;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getRelativeTime(date: string | Date): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

export function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const isFromUser = message.sender === 'user' || message.isFromVisitor;
  const isFromBot = message.sender === 'bot';
  const isFromAdmin = message.sender === 'admin' && !message.isFromVisitor;

  // Use the isMe prop to determine alignment and status visibility
  // If no isMe prop is provided, fallback to visitor perspective (user = me)
  const isMyMessage = isMe !== undefined ? isMe : isFromUser;

  const senderName = message.senderName || 
    (isFromBot ? 'Bot' : isFromAdmin ? 'Support' : 'You');
  
  const senderRole = message.senderRole || 
    (isFromBot ? 'Automated' : isFromAdmin ? 'Admin' : undefined);

  return (
    <div className={cn('flex mb-4 gap-3', isMyMessage ? 'justify-end' : 'justify-start')}>
      {/* Avatar - only show if NOT my message */}
      {!isMyMessage && (
        <div className="flex-shrink-0">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
            isFromBot 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-green-100 text-green-700'
          )}>
            {getInitials(senderName)}
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div className={cn('flex flex-col', isMyMessage ? 'items-end' : 'items-start')}>
        {/* Sender name and role - only show if NOT my message OR if specifically requested to identify participants */}
        {!isMyMessage && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-xs font-medium text-gray-700">{senderName}</span>
            {senderRole && (
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                isFromBot 
                  ? 'bg-purple-50 text-purple-600'
                  : 'bg-green-50 text-green-600'
              )}>
                {senderRole}
              </span>
            )}
          </div>
        )}

        {/* Message content */}
        <div
          className={cn(
            'max-w-[340px] rounded-2xl px-4 py-2.5 shadow-sm',
            isFromUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : isFromBot
                ? 'bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200'
                : 'bg-green-50 text-gray-900 rounded-bl-md border border-green-200',
          )}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <div className={cn(
          'text-[11px] mt-1 px-1 flex items-center gap-1',
          isFromUser ? 'text-gray-500' : 'text-gray-400'
        )}>
          {getRelativeTime(message.createdAt)}
          
          {isMyMessage && (
            <span className="flex items-center ml-1">
              {message.isRead ? (
                <CheckCheck className="h-3.5 w-3.5 text-green-500" />
              ) : message.isDelivered ? (
                <CheckCheck className="h-3.5 w-3.5 text-gray-500" />
              ) : (
                <Check className="h-3.5 w-3.5 text-gray-400" />
              )}
            </span>
          )}
        </div>
      </div>

      {/* Avatar placeholder for me (to maintain alignment) */}
      {isMyMessage && <div className="w-8 flex-shrink-0" />}
    </div>
  );
}
