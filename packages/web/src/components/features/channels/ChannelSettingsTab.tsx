'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { Textarea } from '@/components/primitives/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/primitives/ui/separator';

interface ChannelSettingsTabProps {
  channelId: string;
  isOwner: boolean;
}

export function ChannelSettingsTab({ channelId, isOwner }: ChannelSettingsTabProps) {
  const ctx = trpc.useContext();
  const { data: channel, isLoading } = trpc.channels.getChannel.useQuery({ channelId });
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (channel) {
        setName(channel.name || '');
        setDescription(channel.description || '');
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
