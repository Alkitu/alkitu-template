'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/primitives/ui/alert-dialog';
import { trpc } from '@/lib/trpc';
import { useRouter, useParams } from 'next/navigation';

interface DeleteChannelAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelId: string;
  channelName: string;
}

export function DeleteChannelAlert({ open, onOpenChange, channelId, channelName }: DeleteChannelAlertProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const ctx = trpc.useContext();

  const deleteMutation = trpc.channels.delete.useMutation({
    onSuccess: () => {
      ctx.channels.getMyChannels.invalidate();
      onOpenChange(false);
      // Redirect to channels root or first channel
      router.push(`/${lang}/admin/channels`); // Or just refresh
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({ channelId });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the channel 
            <span className="font-semibold text-gray-900"> #{channelName}</span> and all of its messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Channel'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
