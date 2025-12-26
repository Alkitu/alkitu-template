'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/primitives/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/ui/dialog';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { Textarea } from '@/components/primitives/ui/textarea';

interface EditChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: {
    id: string;
    name: string;
    description: string | null;
    allowedRoles: string[];
    type: string;
  };
}

export function EditChannelDialog({ open, onOpenChange, channel }: EditChannelDialogProps) {
  const [name, setName] = useState(channel.name);
  const [description, setDescription] = useState(channel.description || '');
  const [allowedRoles, setAllowedRoles] = useState<string[]>(channel.allowedRoles || []);
  
  const ctx = trpc.useContext();

  const updateChannelMutation = trpc.channels.update.useMutation({
    onSuccess: () => {
      ctx.channels.getMyChannels.invalidate();
      ctx.channels.getChannel.invalidate({ channelId: channel.id });
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateChannelMutation.mutate({
      channelId: channel.id,
      name,
      description,
      allowedRoles: allowedRoles as any, 
    });
  };

  useEffect(() => {
    if (open) {
        setName(channel.name);
        setDescription(channel.description || '');
        setAllowedRoles(channel.allowedRoles || []);
    }
  }, [open, channel]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Channel</DialogTitle>
          <DialogDescription>
            Update channel details and access settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g. marketing"
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="What's this channel about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Access Control</Label>
            <div className="flex flex-col gap-2 border p-3 rounded-md">
                <p className="text-sm text-gray-500 mb-2">Who can access this channel?</p>
                {['ADMIN', 'EMPLOYEE', 'CLIENT'].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`edit-role-${role}`}
                            checked={allowedRoles.includes(role)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setAllowedRoles([...allowedRoles, role]);
                                } else {
                                    setAllowedRoles(allowedRoles.filter((r) => r !== role));
                                }
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={`edit-role-${role}`} className="font-normal">{role}</Label>
                    </div>
                ))}
                <p className="text-xs text-gray-400 mt-1">
                    {allowedRoles.length === 0 ? "Visible to everyone (Public)" : `Restricted to: ${allowedRoles.join(', ')}`}
                </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateChannelMutation.isPending || !name}>
              {updateChannelMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
