'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/primitives/ui/dialog';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { trpc } from '@/lib/trpc';
import { User } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/primitives/ui/avatar';

interface NewDMDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewDMDialog({ open, onOpenChange }: NewDMDialogProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  // Use getFilteredUsers to search
  const { data: usersData, isLoading } = trpc.user.getFilteredUsers.useQuery(
    { search: search, limit: 10 },
    { enabled: open }
  );

  const createDMMutation = trpc.channels.createDM.useMutation({
    onSuccess: (channel) => {
      onOpenChange(false);
      setSelectedUsers([]);
      setSearch('');
      router.push(`/${lang}/admin/channels/${channel.id}`);
    },
  });

  const handleToggleUser = (user: any) => {
    if (selectedUsers.find(u => u.id === user.id)) {
        setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    } else {
        setSelectedUsers(prev => [...prev, user]);
    }
  };

  const handleCreateChat = () => {
    if (selectedUsers.length === 0) return;
    createDMMutation.mutate({ targetUserIds: selectedUsers.map(u => u.id) });
  };

  const users = usersData ? (Array.isArray(usersData) ? usersData : usersData.users || []) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-wrap gap-2 mb-2">
             {selectedUsers.map(user => (
                 <div key={user.id} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                     <span>{user.firstname} {user.lastname}</span>
                     <button onClick={() => handleToggleUser(user)} className="hover:text-blue-900">
                         <span className="sr-only">Remove</span>
                         &times;
                     </button>
                 </div>
             ))}
          </div>

          <Input
            placeholder="Search for a user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
            {isLoading && <div className="text-center text-gray-500 py-4">Loading...</div>}
            
            {!isLoading && users.length === 0 && (
                <div className="text-center text-gray-500 py-4">No users found</div>
            )}

            {users.map((user: any) => {
              const isSelected = !!selectedUsers.find(u => u.id === user.id);
              return (
              <button
                key={user.id}
                className={`flex items-center gap-3 p-2 rounded-md transition-colors text-left w-full ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                onClick={() => handleToggleUser(user)}
              >
                <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} alt={user.firstname} />
                    <AvatarFallback>{user.firstname?.[0]}{user.lastname?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{user.firstname} {user.lastname}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </button>
            )})}
          </div>

          <div className="flex justify-end pt-2">
             <Button onClick={handleCreateChat} disabled={selectedUsers.length === 0 || createDMMutation.isPending}>
                 {createDMMutation.isPending ? 'Creating...' : 'Create Chat'}
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
