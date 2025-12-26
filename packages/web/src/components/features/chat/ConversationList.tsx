import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/primitives/ui/table';
import Link from 'next/link';
import { Button } from '@/components/primitives/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';

interface ConversationListProps {
  conversations: any[];
  onDelete?: (conversationId: string) => void;
}

export function ConversationList({ conversations, onDelete }: ConversationListProps) {
  const params = useParams();
  const lang = params.lang as string || 'en';
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Message</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {conversations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No conversations found
            </TableCell>
          </TableRow>
        ) : (
          conversations.map((conversation) => (
            <TableRow key={conversation.id}>
              <TableCell className="font-mono text-xs">{conversation.id.slice(0, 8)}...</TableCell>
              <TableCell>{conversation.contactInfo?.email || '-'}</TableCell>
              <TableCell>{conversation.contactInfo?.name || '-'}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  conversation.status === 'active' ? 'bg-green-100 text-green-700' :
                  conversation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  conversation.status === 'resolved' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {conversation.status}
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(conversation.lastMessageAt).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/${lang}/admin/chat/${conversation.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  {onDelete && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => onDelete(conversation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
