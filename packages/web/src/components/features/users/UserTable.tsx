import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/primitives/ui/table';
import { Checkbox } from '@/components/primitives/ui/checkbox';
import { Button } from '@/components/primitives/ui/button';
import { User } from '@alkitu/shared';
import { BulkActions } from './BulkActions';
import { StatusBadge } from '@/components/atoms/StatusBadge';

interface UserTableProps {
  users: User[];
  onBulkDelete: (userIds: string[]) => void;
  onBulkUpdateRole: (userIds: string[], role: any) => void;
  onBulkUpdateStatus: (userIds: string[], status: any) => void;
  onResetPassword: (userId: string) => void;
}

export function UserTable({
  users,
  onBulkDelete,
  onBulkUpdateRole,
  onBulkUpdateStatus,
  onResetPassword,
}: UserTableProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedUserIds(checked ? users.map((user) => user.id) : []);
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUserIds((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId),
    );
  };

  return (
    <div>
      <div className="mb-4">
        <BulkActions
          selectedUserIds={selectedUserIds}
          onBulkDelete={onBulkDelete}
          onBulkUpdateRole={onBulkUpdateRole}
          onBulkUpdateStatus={onBulkUpdateStatus}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox onCheckedChange={handleSelectAll} />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUserIds.includes(user.id)}
                  onCheckedChange={(checked) =>
                    handleSelectUser(user.id, !!checked)
                  }
                />
              </TableCell>
              <TableCell>
                {user.firstname} {user.lastname}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <StatusBadge status={user.status} isActive={user.isActive} />
              </TableCell>
              <TableCell>
                <Button onClick={() => onResetPassword(user.id)}>
                  Reset Password
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
