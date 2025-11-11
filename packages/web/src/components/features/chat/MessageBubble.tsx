import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'bot' | 'admin';
    createdAt: string | Date;
    metadata?: Record<string, any>;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isFromUser = message.sender === 'user';
  const isFromBot = message.sender === 'bot';

  return (
    <div
      className={cn('flex mb-3', isFromUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[70%] rounded-lg px-3 py-2 text-sm',
          isFromUser
            ? 'bg-blue-500 text-white rounded-br-sm'
            : isFromBot
              ? 'bg-gray-100 text-gray-800 rounded-bl-sm'
              : 'bg-green-100 text-green-800 rounded-bl-sm',
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div
          className={cn(
            'text-xs mt-1 opacity-70',
            isFromUser ? 'text-blue-100' : 'text-gray-500',
          )}
        >
          {new Date(message.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {!isFromUser && (
            <span className="ml-2 capitalize">{message.sender}</span>
          )}
        </div>
      </div>
    </div>
  );
}
