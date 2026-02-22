'use client';

import React from 'react';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/molecules-alianza/UserAvatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/primitives/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/DropdownMenu';
import { Button } from '@/components/primitives/ui/button';
import type { UserTableItem, UsersTableAlianzaProps } from './UsersTableAlianza.types';

const defaultLabels = {
  user: 'Usuario',
  role: 'Rol',
  phone: 'Teléfono',
  actions: 'Acciones',
  edit: 'Editar',
  delete: 'Eliminar',
};

const defaultRoleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  EMPLOYEE: 'Employee',
  CLIENT: 'Cliente',
  LEAD: 'Lead',
};

/**
 * UsersTableAlianza - Organism for displaying users in a styled table
 * 
 * Following the Figma design with:
 * - Golden/amber header row
 * - Avatar with initials
 * - User column (name + email stacked)
 * - Role as text (not badge)
 * - Phone column
 * - 3-dot actions menu
 * 
 * @example
 * ```tsx
 * <UsersTableAlianza
 *   users={usersData}
 *   lang="es"
 *   onEditUser={(id, email) => router.push(`/admin/users/${email}`)}
 *   onDeleteUser={(id) => handleDelete(id)}
 * />
 * ```
 */
export function UsersTableAlianza({
  users,
  lang,
  onEditUser,
  onDeleteUser,
  labels = defaultLabels,
  roleLabels = defaultRoleLabels,
  className,
}: UsersTableAlianzaProps) {
  const getDisplayName = (user: UserTableItem): string => {
    const firstName = user.name || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim() || user.email.split('@')[0];
  };

  const getRoleLabel = (role: string): string => {
    return roleLabels[role] || role;
  };

  return (
    <div className={cn("w-full relative max-h-[600px] overflow-auto rounded-lg border border-border", className)}>
      <table className="w-full caption-bottom text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border h-[46px] sticky top-0 z-20">
            <TableHead className="text-foreground font-semibold text-sm px-4 w-[316px]">
              {labels.user}
            </TableHead>
            <TableHead className="text-foreground font-semibold text-sm px-4 w-[149px]">
              {labels.role}
            </TableHead>
            <TableHead className="text-foreground font-semibold text-sm px-4 w-[149px]">
              {labels.phone}
            </TableHead>
            <TableHead className="text-foreground font-semibold text-sm px-4 text-right w-[100px] sticky right-0 z-20 bg-muted/50">
              {labels.actions}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="group bg-background hover:bg-muted/30 border-b border-border/50 transition-colors"
            >
              {/* User Column: Avatar + Name + Email */}
              <TableCell className="py-4 px-4">
                <div className="flex items-center gap-4">
                  <UserAvatar
                    name={user.name || user.email}
                    lastName={user.lastName || undefined}
                    size="md"
                  />
                  <div className="flex flex-col">
                    <Link
                      href={`/${lang}/admin/users/${encodeURIComponent(user.email)}`}
                      className="font-medium text-foreground hover:text-primary transition-colors body-sm"
                    >
                      {getDisplayName(user)}
                    </Link>
                    <span className="body-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* Role Column */}
              <TableCell className="text-sm text-muted-foreground py-4 px-4">
                {getRoleLabel(user.role)}
              </TableCell>

              {/* Phone Column */}
              <TableCell className="text-sm text-muted-foreground py-4 px-4">
                {user.phone || '—'}
              </TableCell>

              {/* Actions Column */}
              <TableCell className="text-right py-4 px-4 sticky right-0 z-10 bg-background group-hover:bg-muted/30 transition-colors">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">{labels.actions}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEditUser && (
                      <DropdownMenuItem
                        onClick={() => onEditUser(user.id, user.email)}
                      >
                        {labels.edit}
                      </DropdownMenuItem>
                    )}
                    {onDeleteUser && (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        {labels.delete}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </div>
  );
}
