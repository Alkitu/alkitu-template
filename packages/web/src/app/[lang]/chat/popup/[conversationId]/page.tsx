'use client';

import { useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { ChatInterface } from '@/components/features/ChatWidget/ChatInterface';
import { useChatTheme } from '@/components/features/ChatWidget/hooks/useChatTheme';

export default function ChatPopupPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const theme = useChatTheme();

  const { data: messages = [], isLoading } = trpc.chat.getMessages.useQuery(
    { conversationId },
    {
      enabled: !!conversationId && conversationId !== 'new',
      refetchInterval: 2000,
    }
  );

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  const handleSendMessage = async (content: string) => {
    if (conversationId && conversationId !== 'new') {
      await sendMessageMutation.mutateAsync({
        conversationId,
        content,
        isFromVisitor: true,
      });
    }
  };

  if (conversationId === 'new') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Please start a conversation first</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div 
        className="p-4 text-white"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <h1 className="text-lg font-semibold">{theme.companyName} - Chat</h1>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={sendMessageMutation.isPending}
          config={{}}
        />
      </div>
    </div>
  );
}
