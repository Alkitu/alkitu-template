import { MessageBubble } from './MessageBubble';

interface ConversationDetailProps {
  messages: any[];
}

export function ConversationDetail({ messages }: ConversationDetailProps) {
  return (
    <div className="border rounded-lg p-4 h-[500px] overflow-y-auto flex flex-col-reverse">
      {[...messages].reverse().map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
