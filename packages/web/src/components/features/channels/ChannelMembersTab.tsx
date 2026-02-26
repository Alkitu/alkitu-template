'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/primitives/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/primitives/ui/avatar';
import { Loader2, Trash2, Shield, ShieldAlert, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/primitives/ui/dialog';
import { Input } from '@/components/primitives/ui/input';
import { ScrollArea } from '@/components/primitives/ui/scroll-area';

/** Extended type for channel members with included user relation */
interface ChannelMemberWithUser {
  id: string;
  userId: string;
  role: string;
  isFavorite?: boolean;
  user: { id: string; firstname: string; lastname: string; image?: string | null; email?: string };
}

interface ChannelMembersTabProps {
  channelId: string;
  isOwner: boolean;
}

export function ChannelMembersTab({ channelId, isOwner }: ChannelMembersTabProps) {
  const ctx = trpc.useContext();
  const { data: rawChannel, isLoading } = trpc.channels.getChannel.useQuery({ channelId });
  const channel = rawChannel as (typeof rawChannel & { members?: ChannelMemberWithUser[] }) | undefined;
  const { data: me } = trpc.user.me.useQuery();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Search users to add
  const { data: searchResults } = trpc.user.getFilteredUsers.useQuery(
    { search, limit: 5 },
    { enabled: isAddOpen && search.length > 0 }
  );

  const addMemberMutation = trpc.channels.addMember.useMutation({
    onSuccess: () => {
        ctx.channels.getChannel.invalidate({ channelId });
        setIsAddOpen(false);
        setSearch('');
    }
  });

  const handleAdd = (userId: string) => {
      // @ts-ignore
      addMemberMutation.mutate({ channelId, userId });
  };

  if (isLoading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Members ({channel?.members?.length || 0})</h3>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-2">
                        <UserPlus className="w-4 h-4" /> Add Member
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add People</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input 
                            placeholder="Search by name..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                        <div className="space-y-2">
                             {/* @ts-ignore */}
                            {searchResults?.users?.map((u: any) => {
                                const isMember = channel?.members?.some((m) => m.userId === u.id);
                                return (
                                <div key={u.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={u.image} />
                                            <AvatarFallback>{u.firstname?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <span>{u.firstname} {u.lastname}</span>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        disabled={isMember || addMemberMutation.isPending}
                                        onClick={() => handleAdd(u.id)}
                                    >
                                        {isMember ? 'Joined' : 'Add'}
                                    </Button>
                                </div>
                            )})}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>

        <div className="space-y-2">
            {channel?.members?.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                         <Avatar>
                            <AvatarImage src={member.user.image || undefined} />
                            <AvatarFallback>{member.user.firstname?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium flex items-center gap-2">
                                {member.user.firstname} {member.user.lastname}
                                {member.role === 'OWNER' && <Shield className="w-3 h-3 text-yellow-500" />}
                                {member.userId === me?.id && <span className="text-xs text-gray-500">(You)</span>}
                            </div>
                            <div className="text-xs text-gray-500">{member.user.email}</div>
                        </div>
                    </div>
                    {/* Actions - Only if isOwner and target is not self */}
                    {isOwner && member.userId !== me?.id && (
                        <div className="flex items-center gap-1">
                            {/* Placeholder actions */}
                            <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
}
