'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { ScrollArea } from '@/components/primitives/ui/scroll-area';
import { Input } from '@/components/primitives/ui/input';
import { Button } from '@/components/primitives/ui/button';
import { Send, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/primitives/ui/avatar';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/primitives/ui/sheet';

interface ThreadViewProps {
  parentMessage: any | null; // Using any for simplicity with complex Prisma types
  onClose: () => void;
  channelId: string;
}

export function ThreadView({ parentMessage, onClose, channelId }: ThreadViewProps) {
  const [replyContent, setReplyContent] = useState('');
  const ctx = trpc.useContext();
  
  const { data: replies, isLoading } = trpc.channels.getReplies.useQuery(
    { parentId: parentMessage?.id },
    { 
      enabled: !!parentMessage,
      refetchInterval: 3000 
    }
  );

  const sendMessageMutation = trpc.channels.sendMessage.useMutation({
    onSuccess: () => {
      setReplyContent('');
      ctx.channels.getReplies.invalidate({ parentId: parentMessage?.id });
      // Invalidate channel messages too to update reply counts if we display them
      ctx.channels.getMessages.invalidate({ channelId });
    },
  });

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !parentMessage) return;

    await sendMessageMutation.mutate({
      channelId,
      content: replyContent,
      parentId: parentMessage.id,
    });
  };

  if (!parentMessage) return null;

  return (
    <Sheet open={!!parentMessage} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
        <SheetHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-base font-bold">Thread</SheetTitle>
          {/* Close button handled by Sheet automatically usually, but ensuring it's clear */}
        </SheetHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-4">
                {/* Parent Message */}
                <div className="mb-6 pb-4 border-b">
                     <div className="flex gap-3">
                        <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={parentMessage.sender.image || undefined} />
                            <AvatarFallback>{parentMessage.sender.firstname?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-sm text-gray-900">
                                {parentMessage.sender.firstname} {parentMessage.sender.lastname}
                            </span>
                            <span className="text-xs text-gray-400">
                                {format(new Date(parentMessage.createdAt), 'h:mm a')}
                            </span>
                            </div>
                            <p className="text-gray-700 text-sm mt-0.5 whitespace-pre-wrap">
                                {parentMessage.content}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Replies */}
                <div className="space-y-4">
                    {isLoading ? (
                        <p className="text-sm text-gray-400 text-center">Loading replies...</p>
                    ) : replies?.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center">No replies yet.</p>
                    ) : (
                        replies?.map((msg: any) => (
                            <div key={msg.id} className="flex gap-3">
                                <Avatar className="h-6 w-6 mt-1">
                                    <AvatarImage src={msg.sender.image || undefined} />
                                    <AvatarFallback>{msg.sender.firstname?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2">
                                    <span className="font-semibold text-sm text-gray-900">
                                        {msg.sender.firstname} {msg.sender.lastname}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {format(new Date(msg.createdAt), 'h:mm a')}
                                    </span>
                                    </div>
                                    <p className="text-gray-700 text-sm mt-0.5 whitespace-pre-wrap">
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-white">
                <form onSubmit={handleSendReply} className="relative flex items-center gap-2">
                <Input 
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Reply..."
                    className="flex-1"
                />
                <Button 
                    type="submit" 
                    size="icon"
                    disabled={!replyContent.trim() || sendMessageMutation.isPending}
                >
                    <Send className="h-4 w-4" />
                </Button>
                </form>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
