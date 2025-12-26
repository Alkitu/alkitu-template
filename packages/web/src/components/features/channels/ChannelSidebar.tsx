'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/primitives/ui/button';
import { Plus, Hash, Lock, User as UserIcon, MoreHorizontal, Pencil, Trash, Star } from 'lucide-react';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import { CreateChannelDialog } from './CreateChannelDialog';
import { EditChannelDialog } from './EditChannelDialog';
import { DeleteChannelAlert } from './DeleteChannelAlert';
import { NewDMDialog } from './NewDMDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/ui/dropdown-menu';

export function ChannelSidebar() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNewDMOpen, setIsNewDMOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<any>(null);
  const [deletingChannel, setDeletingChannel] = useState<any>(null);
  
  const params = useParams();
  const currentLang = params.lang as string || 'en';
  const currentChannelId = params.channelId as string;
  
  const { data: channels, isLoading: channelsLoading } = trpc.channels.getMyChannels.useQuery();
  const { data: me, isLoading: userLoading } = trpc.user.me.useQuery();

  if (channelsLoading || userLoading) {
    return <SidebarSkeleton />;
  }

  // @ts-ignore
  const groupChannels = channels?.filter((c: any) => c.type !== 'DM') || [];
  // @ts-ignore
  const directMessages = channels?.filter((c: any) => c.type === 'DM') || [];

  const getDMName = (channel: any) => {
    if (!channel.members) return 'Unknown User';
    const otherMember = channel.members.find((m: any) => m.user.id !== me?.id);
    return otherMember ? `${otherMember.user.firstname} ${otherMember.user.lastname}` : 'Unknown User';
  };

  return (
    <>
      <div className="w-64 border-r h-full bg-gray-50 flex flex-col shrink-0 text-sm">
        <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 h-14">
          <h2 className="font-bold text-gray-800">Team Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {/* Favorites Section */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2 group">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Favorites</h3>
            </div>
            <div className="space-y-0.5">
               {/* @ts-ignore */}
               {channels?.filter(c => c.members?.find(m => m.userId === me?.id)?.isFavorite).map((channel: any) => (
                 <div 
                    key={`fav-${channel.id}`} 
                    className={`group flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${
                        currentChannelId === channel.id 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Link 
                      href={`/${currentLang}/admin/channels/${channel.id}`}
                      className="flex-1 flex items-center gap-2 min-w-0"
                    >
                      {channel.type === 'PRIVATE' ? <Lock className="w-3.5 h-3.5 opacity-70 shrink-0" /> : 
                       channel.type === 'PUBLIC' ? <Hash className="w-3.5 h-3.5 opacity-70 shrink-0" /> :
                       <UserIcon className="w-3.5 h-3.5 opacity-70 shrink-0" />}
                      <span className="truncate font-medium">
                          {channel.name || getDMName(channel)}
                      </span>
                    </Link>
                </div>
               ))}
               {/* @ts-ignore */}
               {(!channels?.some(c => c.members?.find(m => m.userId === me?.id)?.isFavorite)) && (
                   <p className="text-xs text-gray-400 px-2 italic">No favorites.</p>
               )}
            </div>
          </div>

          {/* Channels Section */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2 group">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Channels</h3>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => setIsCreateOpen(true)} 
                  title="Create Channel"
                >
                  <Plus className="h-3 w-3" />
                </Button>
            </div>
            <div className="space-y-0.5">
              {groupChannels.map((channel: any) => (
                <div 
                    key={channel.id} 
                    className={`group flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${
                        currentChannelId === channel.id 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Link 
                      href={`/${currentLang}/admin/channels/${channel.id}`}
                      className="flex-1 flex items-center gap-2 min-w-0"
                    >
                      {channel.type === 'PRIVATE' ? <Lock className="w-3.5 h-3.5 opacity-70 shrink-0" /> : <Hash className="w-3.5 h-3.5 opacity-70 shrink-0" />}
                      <span className="truncate font-medium">{channel.name}</span>
                    </Link>
                    
                    {/* Action Menu (Visible on Hover or Active) */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-3 w-3" />
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingChannel(channel); }}>
                           <Pencil className="mr-2 h-3 w-3" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={(e) => { e.stopPropagation(); setDeletingChannel(channel); }}
                        >
                           <Trash className="mr-2 h-3 w-3" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              ))}
              {groupChannels.length === 0 && (
                <p className="text-xs text-gray-400 px-2 italic">No channels yet.</p>
              )}
            </div>
          </div>

            {/* Direct Messages Section */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2 group">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Direct Messages</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsNewDMOpen(true)}
                  title="New Message"
                >
                  <Plus className="h-3 w-3" />
                </Button>
            </div>
            <div className="space-y-0.5">
              {directMessages.map((channel: any) => (
                 <div 
                    key={channel.id} 
                    className={`flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${
                        currentChannelId === channel.id 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Link 
                      href={`/${currentLang}/admin/channels/${channel.id}`}
                      className="flex-1 flex items-center gap-2 min-w-0"
                    >
                      <UserIcon className="w-3.5 h-3.5 opacity-70 shrink-0" />
                      <span className="truncate">{getDMName(channel)}</span>
                    </Link>
                </div>
              ))}
               {directMessages.length === 0 && (
                <p className="text-xs text-gray-400 px-2 italic">No DMs yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <CreateChannelDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <NewDMDialog open={isNewDMOpen} onOpenChange={setIsNewDMOpen} />
      
      {editingChannel && (
          <EditChannelDialog 
            open={!!editingChannel} 
            onOpenChange={(open) => !open && setEditingChannel(null)} 
            channel={editingChannel} 
          />
      )}
      
      {deletingChannel && (
          <DeleteChannelAlert 
            open={!!deletingChannel} 
            onOpenChange={(open) => !open && setDeletingChannel(null)}
            channelId={deletingChannel.id}
            channelName={deletingChannel.name}
          />
      )}
    </>
  );
}

function SidebarSkeleton() {
  return (
    <div className="w-64 border-r h-full bg-gray-50 p-4 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  );
}
