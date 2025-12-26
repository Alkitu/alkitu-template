'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { Textarea } from '@/components/primitives/ui/textarea';
import { Hash, Lock, Loader2 } from 'lucide-react';
import { Separator } from '@/components/primitives/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/ui/select';

interface ChannelSettingsTabProps {
  channelId: string;
  isOwner: boolean;
}

export function ChannelSettingsTab({ channelId, isOwner }: ChannelSettingsTabProps) {
  const ctx = trpc.useContext();
  const { data: channel, isLoading } = trpc.channels.getChannel.useQuery({ channelId });
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');

  useEffect(() => {
    if (channel) {
        setName(channel.name || '');
        setDescription(channel.description || '');
        // @ts-ignore
        setType(channel.type || 'PUBLIC');
    }
  }, [channel]);

  const updateMutation = trpc.channels.update.useMutation({
      onSuccess: () => {
          ctx.channels.getChannel.invalidate({ channelId });
          // toast?
      }
  });

  const handleUpdate = () => {
      updateMutation.mutate({
          channelId: channelId,
          name,
          description,
          // @ts-ignore
          type,
          allowedRoles: channel?.allowedRoles // preserve roles
      });
  };

  if (isLoading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;
  if (!isOwner) return <div className="p-8 text-center text-gray-500">Only channel owners can modify settings.</div>;

  return (
    <div className="p-6 space-y-8 max-w-2xl">
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Channel Settings</h3>
            
            <div className="grid gap-2">
                <Label htmlFor="name">Channel Name</Label>
                <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="# channel-name"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="What's this channel about?"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="type">Channel Type</Label>
                <Select value={type} onValueChange={(value: 'PUBLIC' | 'PRIVATE') => setType(value)}>
                  <SelectTrigger id="type" className="w-full">
                    <div className="flex items-center gap-2">
                      {type === 'PUBLIC' ? <Hash className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        <span>Public - Anyone can join</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="PRIVATE">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>Private - Invite only</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {type === 'PUBLIC' ? 'Public channels are visible to everyone and anyone can join.' : 'Private channels require an invitation to join.'}
                </p>
            </div>

            <div className="pt-2">
                <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>

        <Separator />

        <div className="space-y-4">
            <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-500">Deleting a channel cannot be undone. All messages and data will be lost.</p>
            <Button variant="destructive" disabled>Delete Channel (Not Implemented)</Button>
        </div>
    </div>
  );
}
