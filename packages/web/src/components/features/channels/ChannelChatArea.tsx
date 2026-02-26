'use client';

import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { ScrollArea } from '@/components/primitives/ui/scroll-area';
import { Input } from '@/components/primitives/ui/input';
import { Button } from '@/components/primitives/ui/button';
import { Send, Paperclip, Check, CheckCheck, Star, PanelLeftClose, PanelLeftOpen, Hash, Lock, Users } from 'lucide-react';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/primitives/ui/avatar';
import { format } from 'date-fns';

import { ThreadView } from './ThreadView';

/** Extended types for Prisma relations included by the API but not reflected in tRPC output types */
interface ChannelMemberWithUser {
  userId: string;
  role: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  isHidden?: boolean;
  user: { id: string; firstname: string; lastname: string; image?: string | null; email?: string };
}

interface MessageWithSender {
  id: string;
  content: string;
  senderId: string;
  channelId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  readBy: string[];
  metadata: unknown;
  replyCount?: number;
  sender: { id: string; firstname: string; lastname: string; image?: string | null };
}

interface ChannelChatAreaProps {
  channelId: string;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/ui/tabs';
import { ChannelMembersTab } from './ChannelMembersTab';
import { ChannelSettingsTab } from './ChannelSettingsTab';

export function ChannelChatArea({ channelId, onToggleSidebar, isSidebarCollapsed }: ChannelChatAreaProps) {
  const [activeThread, setActiveThread] = useState<any | null>(null);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const ctx = trpc.useContext();
  const { data: rawChannel, isLoading: isChannelLoading } = trpc.channels.getChannel.useQuery({ channelId });
  const channel = rawChannel as (typeof rawChannel & { members?: ChannelMemberWithUser[] }) | undefined;
  const { data: rawMessages, isLoading: isMessagesLoading } = trpc.channels.getMessages.useQuery(
    { channelId },
    {
      refetchInterval: 3000
    }
  );
  const messages = rawMessages as MessageWithSender[] | undefined;

  const { data: me } = trpc.user.me.useQuery();
  const markAsReadMutation = trpc.channels.markAsRead.useMutation();

  const toggleFavoriteMutation = trpc.channels.toggleFavorite.useMutation({
    onSuccess: () => {
       ctx.channels.getMyChannels.invalidate();
       ctx.channels.getChannel.invalidate({ channelId });
    }
  });
  

  // Determine permissions
  const myMember = channel?.members?.find((m) => m.userId === me?.id);
  const isOwner = myMember?.role === 'OWNER';
  const isDM = channel?.type === 'DM';
  
  // Get DM display name
  const getDMName = () => {
    if (!isDM || !channel?.members) return null;
    const others = channel.members.filter((m) => m.user.id !== me?.id);
    if (others.length === 0) return 'Just You';
    if (others.length === 1) {
      const user = others[0].user;
      return `${user.firstname} ${user.lastname}`;
    }
    // Group DM
    return others.map((m) => `${m.user.firstname} ${m.user.lastname}`).join(', ');
  };
  
  const displayName = isDM ? getDMName() : channel?.name;

  const activeMessagesLength = messages?.length || 0;
  useEffect(() => {
    if (channelId && activeMessagesLength > 0) {
        markAsReadMutation.mutate({ channelId });
    }
  }, [channelId, activeMessagesLength]);

  const getStatusIcon = (msg: any) => {
      if (!me || msg.senderId !== me.id) return null;
      const isRead = msg.readBy && msg.readBy.some((id: string) => id !== me.id);
      if (isRead) return <CheckCheck className="w-3 h-3 text-blue-500 ml-1" />;
      return <Check className="w-3 h-3 text-gray-400 ml-1" />;
  };

  const sendMessageMutation = trpc.channels.sendMessage.useMutation({
    onSuccess: () => {
      setMessage('');
      ctx.channels.getMessages.invalidate({ channelId });
    },
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessageMutation.mutate({
      channelId,
      content: message,
    });
  };
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
       // scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isChannelLoading) {
    return <ChatAreaSkeleton />;
  }

  return (
    <>
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                console.log('Toggle clicked!', { onToggleSidebar, isSidebarCollapsed });
                onToggleSidebar();
              }}
              className="h-8 w-8 shrink-0 mr-2"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          )}
          <div className="flex items-center gap-2">
            {isDM ? (
              channel.members && channel.members.filter((m) => m.user.id !== me?.id).length > 1 ? (
                <Users className="w-5 h-5 text-gray-500" />
              ) : null
            ) : (
              channel?.type === 'PRIVATE' ? <Lock className="w-5 h-5 text-gray-500" /> : <Hash className="w-5 h-5 text-gray-500" />
            )}
            <h2 className="font-semibold text-gray-800 truncate">
              {isDM ? displayName : `#${displayName || 'Channel'}`}
            </h2>
          </div>
          {channel?.description && (
              <span className="ml-4 text-xs text-gray-500 truncate">{channel.description}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-yellow-400"
                disabled={toggleFavoriteMutation.isPending}
                onClick={() => {
                    if (channel) {
                        toggleFavoriteMutation.mutate({ channelId: channel.id });
                    }
                }}
            >
                {/* @ts-ignore */}
                <Star className={`h-5 w-5 ${myMember?.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} /> 
            </Button>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 border-b bg-gray-50/50">
              <TabsList className="bg-transparent h-10 p-0 -mb-px">
                  <TabsTrigger value="chat" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 pb-2 pt-2">Chat</TabsTrigger>
                  <TabsTrigger value="members" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 pb-2 pt-2">Members</TabsTrigger>
                  <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 pb-2 pt-2">Settings</TabsTrigger>
              </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 data-[state=inactive]:hidden mt-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-white" ref={scrollRef}>
                    <div className="space-y-4 max-w-4xl mx-auto">
                    {(!messages || messages.length === 0) && !isMessagesLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                            <p>No messages yet.</p>
                            <p className="text-xs">Start the conversation!</p>
                        </div>
                    )}
                    
                    {messages?.map((msg) => (
                        <div key={msg.id} className="group flex gap-3 hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors relative">
                        <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={msg.sender.image || undefined} />
                            <AvatarFallback>{msg.sender.firstname?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-sm text-gray-900">
                                {msg.sender.firstname} {msg.sender.lastname}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center">
                                {format(new Date(msg.createdAt), 'h:mm a')}
                                {getStatusIcon(msg)}
                            </span>
                            </div>
                            <p className="text-gray-700 text-sm mt-0.5 whitespace-pre-wrap break-words">
                            {msg.content}
                            </p>
                            
                            {/* Thread Info */}
                            {((msg.replyCount ?? 0) > 0 || activeThread?.id === msg.id) && (
                                <div
                                    className="mt-1 flex items-center gap-2 cursor-pointer group/thread"
                                    onClick={() => setActiveThread(msg)}
                                >
                                    <span className="text-xs text-blue-600 font-medium group-hover/thread:underline">
                                        {msg.replyCount ?? 0} {msg.replyCount === 1 ? 'reply' : 'replies'}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* Message Actions */}
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm border rounded-md flex">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-gray-500 hover:text-gray-900"
                                title="Reply in thread"
                                onClick={() => setActiveThread(msg)}
                            >
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3C5.5 2.72386 5.27614 2.5 5 2.5H2.5C1.67157 2.5 1 3.17157 1 4V11C1 11.8284 1.67157 12.5 2.5 12.5H11.5C12.3284 12.5 13 11.8284 13 11V9.5C13 9.22386 12.7761 9 12.5 9C12.2239 9 12 9.22386 12 9.5V11C12 11.2761 11.7761 11.5 11.5 11.5H2.5C2.22386 11.5 2 11.2761 2 11V4C2 3.72386 2.22386 3.5 2.5 3.5H5C5.27614 3.5 5.5 3.27614 5.5 3ZM10.8536 2.14645C10.6583 2.34171 10.6583 2.65829 10.8536 2.85355L12.7929 4.79289L5.5 4.79289C5.22386 4.79289 5 5.01675 5 5.29289C5 5.56903 5.22386 5.79289 5.5 5.79289L12.7929 5.79289L10.8536 7.73223C10.6583 7.92749 10.6583 8.24408 10.8536 8.43934C11.0488 8.6346 11.3654 8.6346 11.5607 8.43934L14.3536 5.64645C14.5488 5.45118 14.5488 5.1346 14.3536 4.93934L11.5607 2.14645C11.3654 1.95118 11.0488 1.95118 10.8536 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            </Button>
                        </div>
                        </div>
                    ))}
                    </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t bg-white shrink-0">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-gray-600">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Message #${channel?.name || 'channel'}`}
                        className="flex-1"
                    />
                    <Button 
                        type="submit" 
                        disabled={!message.trim() || sendMessageMutation.isPending}
                        className={!message.trim() ? "opacity-50" : ""}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                    </form>
                </div>
          </TabsContent>

          <TabsContent value="members" className="flex-1 overflow-auto data-[state=inactive]:hidden mt-0">
             <ChannelMembersTab channelId={channelId} isOwner={isOwner} />
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-auto data-[state=inactive]:hidden mt-0">
             <ChannelSettingsTab channelId={channelId} isOwner={isOwner} />
          </TabsContent>
      </Tabs>
    </div>
    
    <ThreadView 
        parentMessage={activeThread} 
        onClose={() => setActiveThread(null)} 
        channelId={channelId}
    />
    </>
  );
}

function ChatAreaSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="h-14 border-b flex items-center px-6">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="flex-1 p-6 space-y-6">
         <Skeleton className="h-12 w-full" />
         <Skeleton className="h-12 w-full" />
         <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}
