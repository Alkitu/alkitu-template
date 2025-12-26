import { MessageBubble } from './MessageBubble';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';

interface ConversationDetailProps {
  messages: any[];
  currentUserId?: string;
}

function getDateLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d, yyyy');
}

function groupMessagesByDate(messages: any[]) {
  const groups: { date: Date; label: string; messages: any[] }[] = [];
  
  messages.forEach((message) => {
    const messageDate = new Date(message.createdAt);
    const lastGroup = groups[groups.length - 1];
    
    if (lastGroup && isSameDay(lastGroup.date, messageDate)) {
      lastGroup.messages.push(message);
    } else {
      groups.push({
        date: messageDate,
        label: getDateLabel(messageDate),
        messages: [message],
      });
    }
  });
  
  return groups;
}

export function ConversationDetail({ messages, currentUserId }: ConversationDetailProps) {
  const groupedMessages = groupMessagesByDate([...messages]);

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="p-6 h-[600px] overflow-y-auto space-y-6">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            {/* Date divider */}
            <div className="flex items-center justify-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <div className="px-4">
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  {group.label}
                </span>
              </div>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-1">
              {group.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={{
                    id: message.id,
                    content: message.content,
                    sender: message.isFromVisitor ? 'user' : 'admin',
                    createdAt: message.createdAt,
                    senderName: message.senderName,
                    senderRole: message.senderRole,
                    isFromVisitor: message.isFromVisitor,
                    isRead: message.isRead,
                    isDelivered: message.isDelivered,
                    metadata: message.metadata,
                  }}
                  isMe={message.isFromVisitor ? false : (currentUserId ? message.senderUserId === currentUserId : true)}
                />
              ))}
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}
