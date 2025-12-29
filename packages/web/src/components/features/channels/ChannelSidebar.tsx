'use client';

import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/primitives/ui/button';
import { Plus, Hash, Lock, User as UserIcon, MoreHorizontal, Pencil, Trash, Star, Users, ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/primitives/ui/avatar';
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

// Export custom hook for sidebar collapse state
export function useSidebarCollapse() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) setIsCollapsed(saved === 'true');
  }, []);
  
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', newState.toString());
  };
  
  return { isCollapsed, toggleCollapse };
}

export function ChannelSidebar() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNewDMOpen, setIsNewDMOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<any>(null);
  const [deletingChannel, setDeletingChannel] = useState<any>(null);
  
  // Collapsible sections state
  const [favoritesExpanded, setFavoritesExpanded] = useState(true);
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [dmsExpanded, setDmsExpanded] = useState(true);
  const [archivedExpanded, setArchivedExpanded] = useState(false); // Default collapsed
  
  // Sidebar resize and collapse state
  const [sidebarWidth, setSidebarWidth] = useState(256); // 16rem = 256px
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const params = useParams();
  const currentLang = params.lang as string || 'en';
  const currentChannelId = params.channelId as string;
  
  // Load sidebar width from localStorage (collapse state is handled by hook)
  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebar-width');
    if (savedWidth) setSidebarWidth(parseInt(savedWidth));
  }, []);
  
  // Handle resize
  const startResizing = () => setIsResizing(true);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 240 && newWidth <= 400) {
        setSidebarWidth(newWidth);
        localStorage.setItem('sidebar-width', newWidth.toString());
      }
    };
    
    const handleMouseUp = () => setIsResizing(false);
    
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);
  

  
  const { data: channels, isLoading: channelsLoading } = trpc.channels.getMyChannels.useQuery();
  const { data: me, isLoading: userLoading } = trpc.user.me.useQuery();

  if (channelsLoading || userLoading) {
    return <SidebarSkeleton />;
  }

  // Filter out hidden channels and separate active/archived
  // @ts-ignore
  const activeChannels = channels?.filter((c: any) => {
    const myMember = c.members?.find((m: any) => m.userId === me?.id);
    return !myMember?.isHidden && !myMember?.isArchived;
  }) || [];
  
  // @ts-ignore
  const archivedChannels = channels?.filter((c: any) => {
    const myMember = c.members?.find((m: any) => m.userId === me?.id);
    return !myMember?.isHidden && myMember?.isArchived;
  }) || [];
  
  // @ts-ignore
  const groupChannels = activeChannels.filter((c: any) => c.type !== 'DM');
  // @ts-ignore
  const directMessages = activeChannels.filter((c: any) => c.type === 'DM');

  const getDMDetails = (channel: any) => {
    if (!channel.members) return { name: 'Unknown User', isGroup: false, count: 0 };
    const others = channel.members.filter((m: any) => m.user.id !== me?.id);
    
    if (others.length === 0) return { name: 'Just You', isGroup: false, count: 0 };
    
    if (others.length === 1) {
       const m = others[0];
       return { name: `${m.user.firstname} ${m.user.lastname}`, isGroup: false, count: 1 };
    }
    
    // Group DM
    const names = others.map((m: any) => `${m.user.firstname} ${m.user.lastname}`).join(', ');
    return { name: names, isGroup: true, count: others.length };
  };

  return (
    <>
      <div 
        ref={sidebarRef}
        style={{ width: isCollapsed ? '64px' : `${sidebarWidth}px` }}
        className="relative border-r h-full bg-gray-50 flex flex-col shrink-0 text-sm transition-all duration-200"
      >
        <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 h-14">
          {!isCollapsed && <h2 className="font-bold text-gray-800">Team Chat</h2>}
        </div>

        {!isCollapsed && (<div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {/* Favorites Section */}
          <div>
            <div 
              className="flex items-center justify-between w-full px-2 mb-2 hover:bg-gray-100 rounded transition-colors cursor-pointer"
              onClick={() => setFavoritesExpanded(!favoritesExpanded)}
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-1">Favorites</h3>
              {favoritesExpanded ? <ChevronDown className="h-3 w-3 text-gray-400" /> : <ChevronRight className="h-3 w-3 text-gray-400" />}
            </div>
            {favoritesExpanded && (
              <div className="space-y-0.5">
               {/* @ts-ignore */}
               {channels?.filter(c => c.members?.find(m => m.userId === me?.id)?.isFavorite).map((channel: any) => {
                 const dmInfo = getDMDetails(channel);
                 return (
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
                          {channel.name || dmInfo.name}
                      </span>
                      {dmInfo.isGroup && (
                          <span className="bg-gray-800 text-white text-[10px] font-medium px-1.5 rounded-md min-w-[20px] text-center shrink-0">
                               {dmInfo.count}
                          </span>
                      )}
                    </Link>
                </div>
               )})}
               {/* @ts-ignore */}
               {(!channels?.some(c => c.members?.find(m => m.userId === me?.id)?.isFavorite)) && (
                   <p className="text-xs text-gray-400 px-2 italic">No favorites.</p>
               )}
              </div>
            )}

          {/* Channels Section */}
          <div>
            <div 
              className="flex items-center justify-between w-full px-2 mb-2 group hover:bg-gray-100 rounded transition-colors"
            >
              <div 
                className="flex-1 flex items-center gap-2 cursor-pointer"
                onClick={() => setChannelsExpanded(!channelsExpanded)}
              >
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-1">Channels</h3>
                {channelsExpanded ? <ChevronDown className="h-3 w-3 text-gray-400" /> : <ChevronRight className="h-3 w-3 text-gray-400" />}
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={(e) => { e.stopPropagation(); setIsCreateOpen(true); }} 
                title="Create Channel"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {channelsExpanded && (
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
            )}
            </div>
          </div>

            {/* Direct Messages Section */}
          <div>
            <div 
              className="flex items-center justify-between w-full px-2 mb-2 group hover:bg-gray-100 rounded transition-colors"
            >
              <div 
                className="flex-1 flex items-center gap-2 cursor-pointer"
                onClick={() => setDmsExpanded(!dmsExpanded)}
              >
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-1">Direct Messages</h3>
                {dmsExpanded ? <ChevronDown className="h-3 w-3 text-gray-400" /> : <ChevronRight className="h-3 w-3 text-gray-400" />}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); setIsNewDMOpen(true); }}
                title="New Message"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {dmsExpanded && (
              <div className="space-y-0.5">
              {directMessages.map((channel: any) => {
                 const dmInfo = getDMDetails(channel);
                 return (
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
                      {dmInfo.isGroup ? (
                        <Users className="w-3.5 h-3.5 opacity-70 shrink-0" />
                      ) : (
                        <Avatar className="h-5 w-5 shrink-0">
                          <AvatarImage src={channel.members?.find((m: any) => m.user.id !== me?.id)?.user.image || undefined} />
                          <AvatarFallback className="text-[10px]">
                            {channel.members?.find((m: any) => m.user.id !== me?.id)?.user.firstname?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="truncate">{dmInfo.name}</span>
                      {dmInfo.isGroup && (
                          <span className="bg-gray-800 text-white text-[10px] font-medium px-1.5 rounded-md min-w-[20px] text-center shrink-0">
                               {dmInfo.count}
                          </span>
                      )}
                    </Link>
                </div>
              )})}
               {directMessages.length === 0 && (
                <p className="text-xs text-gray-400 px-2 italic">No DMs yet.</p>
              )}
              </div>
            )}
          </div>

          {/* Archived Section */}
          {archivedChannels.length > 0 && (
            <div>
              <div 
                className="flex items-center justify-between w-full px-2 mb-2 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                onClick={() => setArchivedExpanded(!archivedExpanded)}
              >
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-1">Archived</h3>
                {archivedExpanded ? <ChevronDown className="h-3 w-3 text-gray-400" /> : <ChevronRight className="h-3 w-3 text-gray-400" />}
              </div>
              {archivedExpanded && (
                <div className="space-y-0.5">
                  {archivedChannels.map((channel: any) => {
                    const dmInfo = channel.type === 'DM' ? getDMDetails(channel) : null;
                    const isChannel = channel.type !== 'DM';
                    return (
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
                          {isChannel ? (
                            channel.type === 'PRIVATE' ? <Lock className="w-3.5 h-3.5 opacity-70 shrink-0" /> : <Hash className="w-3.5 h-3.5 opacity-70 shrink-0" />
                          ) : dmInfo?.isGroup ? (
                            <Users className="w-3.5 h-3.5 opacity-70 shrink-0" />
                          ) : (
                            <Avatar className="h-5 w-5 shrink-0">
                              <AvatarImage src={channel.members?.find((m: any) => m.user.id !== me?.id)?.user.image || undefined} />
                              <AvatarFallback className="text-[10px]">
                                {channel.members?.find((m: any) => m.user.id !== me?.id)?.user.firstname?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <span className="truncate text-gray-500">{isChannel ? channel.name : dmInfo?.name}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>)}
        
        {/* Resize Handle */}
        {!isCollapsed && (
          <div
            onMouseDown={startResizing}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors group"
          >
            <div className="absolute top-1/2 right-0 w-1 h-8 bg-gray-300 group-hover:bg-blue-500 rounded-l" />
          </div>
        )}
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
