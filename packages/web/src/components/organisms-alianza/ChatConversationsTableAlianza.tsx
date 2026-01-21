'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/primitives/ui/table';
import { Button } from '@/components/molecules-alianza/Button';
import { Chip } from '@/components/atoms-alianza/Chip';
import { useParams } from 'next/navigation';
import { UserPagination } from '@/components/molecules-alianza/UserPagination';

export interface ChatConversationItem {
  id: string;
  contactInfo?: {
    email?: string;
    name?: string;
  };
  status: string;
  lastMessageAt: string | Date;
}

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
}

export interface ChatConversationsTableAlianzaProps {
  conversations: ChatConversationItem[];
  onDelete?: (conversationId: string) => void;
  labels?: {
    id: string;
    email: string;
    name: string;
    status: string;
    lastMessage: string;
    actions: string;
  };
  className?: string;
  pagination?: PaginationProps;
}

const defaultLabels = {
  id: 'ID',
  email: 'Email',
  name: 'Nombre',
  status: 'Estado',
  lastMessage: 'Último Mensaje',
  actions: 'Acciones',
};

export function ChatConversationsTableAlianza({
  conversations,
  onDelete,
  labels = defaultLabels,
  className,
  pagination,
}: ChatConversationsTableAlianzaProps) {
  const params = useParams();
  const lang = params.lang as string || 'en';

  return (
    <div className="flex flex-col h-full gap-4">
      <div className={cn("w-full relative max-h-[600px] overflow-auto", className)}>
        <table className="w-full caption-bottom text-sm">
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary border-b border-secondary-foreground h-[46px] sticky top-0 z-20">
              <TableHead className="text-card-foreground font-medium text-base px-[9px] w-[100px]">{labels.id}</TableHead>
              <TableHead className="text-card-foreground font-medium text-base px-[9px]">{labels.email}</TableHead>
              <TableHead className="text-card-foreground font-medium text-base px-[9px]">{labels.name}</TableHead>
              <TableHead className="text-card-foreground font-medium text-base px-[9px] w-[120px]">{labels.status}</TableHead>
              <TableHead className="text-card-foreground font-medium text-base px-[9px] w-[180px]">{labels.lastMessage}</TableHead>
              <TableHead className="text-card-foreground font-medium text-base px-[9px] text-right w-[100px] sticky right-0 z-20 bg-secondary">{labels.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conversations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No conversations found
                </TableCell>
              </TableRow>
            ) : (
              conversations.map((conversation) => (
                <TableRow 
                  key={conversation.id}
                  className="group hover:bg-muted/50 border-b border-border/50"
                >
                  <TableCell className="font-mono text-xs py-4 bg-background group-hover:bg-muted/50 transition-colors">
                    {conversation.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="py-4 bg-background group-hover:bg-muted/50 transition-colors">
                    {conversation.contactInfo?.email || '-'}
                  </TableCell>
                  <TableCell className="py-4 bg-background group-hover:bg-muted/50 transition-colors">
                    {conversation.contactInfo?.name || '-'}
                  </TableCell>
                  <TableCell className="py-4 bg-background group-hover:bg-muted/50 transition-colors">
                    <Chip variant={conversation.status === 'active' ? 'solid' : 'outline'}>
                      {conversation.status}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-4 bg-background group-hover:bg-muted/50 transition-colors">
                    {new Date(conversation.lastMessageAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right py-4 sticky right-0 z-10 bg-background group-hover:bg-muted/50 transition-colors">
                    <div className="flex justify-end gap-2">
                      <Link href={`/${lang}/admin/chat/${conversation.id}`}>
                        <Button variant="nude" size="sm" iconOnly iconLeft={<Eye className="h-4 w-4" />} />
                      </Link>
                      {onDelete && (
                        <Button 
                          variant="nude" 
                          size="sm" 
                          iconOnly
                          className="text-destructive hover:text-destructive"
                          iconLeft={<Trash2 className="h-4 w-4" />}
                          onClick={() => onDelete(conversation.id)}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </table>
      </div>
      
      {pagination && (
        <UserPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          pageSize={pagination.limit}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          className="border-t border-border/50 pt-4"
        />
      )}
    </div>
  );
}
