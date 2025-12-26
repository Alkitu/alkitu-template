'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useRouter, useParams } from 'next/navigation';
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

interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateChannelDialog({ open, onOpenChange }: CreateChannelDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [allowedRoles, setAllowedRoles] = useState<string[]>([]);
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const ctx = trpc.useContext();

  const createChannelMutation = trpc.channels.create.useMutation({
    onSuccess: (channel) => {
      ctx.channels.getMyChannels.invalidate();
      onOpenChange(false);
      setName('');
      setDescription('');
      setAllowedRoles([]);
      router.push(`/${lang}/admin/channels/${channel.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createChannelMutation.mutate({
      name,
      description,
      type: 'PUBLIC', // Hardcoded for now, add validation if needed
      allowedRoles: allowedRoles as any, // Cast to match TRPC enum expectation
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Create a new channel to collaborate with your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. marketing, general"
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              required
            />
            <p className="text-xs text-gray-500">Channel names must be lowercase and without spaces.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
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
                            id={`role-${role}`}
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
                        <Label htmlFor={`role-${role}`} className="font-normal">{role}</Label>
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
            <Button type="submit" disabled={createChannelMutation.isPending || !name}>
              {createChannelMutation.isPending ? 'Creating...' : 'Create Channel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
