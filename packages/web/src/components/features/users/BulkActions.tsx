import { Button } from '@/components/primitives/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/ui/dropdown-menu';
import { UserRole, UserStatus } from '@alkitu/shared';

interface BulkActionsProps {
  selectedUserIds: string[];
  onBulkDelete: (userIds: string[]) => void;
  onBulkUpdateRole: (userIds: string[], role: UserRole) => void;
  onBulkUpdateStatus: (userIds: string[], status: UserStatus) => void;
}

export function BulkActions({
  selectedUserIds,
  onBulkDelete,
  onBulkUpdateRole,
  onBulkUpdateStatus,
}: BulkActionsProps) {
  const disabled = selectedUserIds.length === 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled}>Bulk Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onBulkDelete(selectedUserIds)}>
          Delete Selected
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onBulkUpdateRole(selectedUserIds, UserRole.ADMIN)}
        >
          Set as Admin
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onBulkUpdateRole(selectedUserIds, UserRole.EMPLOYEE)}
        >
          Set as Employee
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onBulkUpdateRole(selectedUserIds, UserRole.CLIENT)}
        >
          Set as Client
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onBulkUpdateStatus(selectedUserIds, UserStatus.VERIFIED)}
        >
          Mark as Verified
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            onBulkUpdateStatus(selectedUserIds, UserStatus.SUSPENDED)
          }
        >
          Suspend Selected
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
