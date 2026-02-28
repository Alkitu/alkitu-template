import { useState } from 'react';
import { Input } from '@/components/primitives/ui/input';
import { Button } from '@/components/primitives/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import {
  ConversationStatus,
  ConversationFilters as ChatFilters,
} from '@/types/chat';

interface ConversationFiltersProps {
  onApplyFilters: (filters: ChatFilters) => void;
}

export function ConversationFilters({
  onApplyFilters,
}: ConversationFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ConversationStatus | '' | undefined>(
    undefined,
  );

  const handleApply = () => {
    onApplyFilters({
      search: search || undefined,
      status: status || undefined,
    });
  };

  return (
    <div className="flex space-x-4 mb-6">
      <Input
        placeholder="Search by email, name, or content..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1"
      />
      <Select
        onValueChange={(value: ConversationStatus | 'all') =>
          setStatus(value === 'all' ? undefined : value)
        }
        value={status || 'all'}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="OPEN">🟢 Open</SelectItem>
          <SelectItem value="IN_PROGRESS">🟡 In Progress</SelectItem>
          <SelectItem value="WAITING_CUSTOMER">⏳ Waiting Customer</SelectItem>
          <SelectItem value="RESOLVED">✅ Resolved</SelectItem>
          <SelectItem value="CLOSED">🔴 Closed</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleApply}>Apply Filters</Button>
    </div>
  );
}
