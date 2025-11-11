import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/primitives/ui/table';
import Link from 'next/link';

interface ConversationListProps {
  conversations: any[];
}

export function ConversationList({ conversations }: ConversationListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Message</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {conversations.map((conversation) => (
          <TableRow key={conversation.id}>
            <TableCell>{conversation.id}</TableCell>
            <TableCell>{conversation.contactInfo?.email}</TableCell>
            <TableCell>{conversation.contactInfo?.name}</TableCell>
            <TableCell>{conversation.status}</TableCell>
            <TableCell>
              {new Date(conversation.lastMessageAt).toLocaleString()}
            </TableCell>
            <TableCell>
              <Link href={`/dashboard/chat/${conversation.id}`}>View</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
