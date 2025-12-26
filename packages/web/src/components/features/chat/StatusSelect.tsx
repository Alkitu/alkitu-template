import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/Select';
import { Label } from '@/components/primitives/ui/label';
import { Badge } from '@/components/atoms/badge';

import { ConversationStatus } from '@prisma/client';

interface StatusSelectProps {
  currentStatus: ConversationStatus;
  onStatusChange: (status: ConversationStatus) => void;
}

const statusOptions = [
  { value: ConversationStatus.OPEN, label: 'Open', color: 'bg-green-100 text-green-800' },
  {
    value: ConversationStatus.IN_PROGRESS,
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: ConversationStatus.WAITING_CUSTOMER,
    label: 'Waiting Customer',
    color: 'bg-yellow-100 text-yellow-800',
  },
  { value: ConversationStatus.RESOLVED, label: 'Resolved', color: 'bg-purple-100 text-purple-800' },
  { value: ConversationStatus.CLOSED, label: 'Closed', color: 'bg-gray-100 text-gray-800' },
] as const;

export function StatusSelect({
  currentStatus,
  onStatusChange,
}: StatusSelectProps) {
  const currentStatusOption = statusOptions.find(
    (option) => option.value === currentStatus,
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <div className="flex items-center gap-3">
        <Select
          value={currentStatus}
          onValueChange={(value) => onStatusChange(value as ConversationStatus)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`}
                  />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {currentStatusOption && (
          <Badge className={currentStatusOption.color}>
            {currentStatusOption.label}
          </Badge>
        )}
      </div>
    </div>
  );
}
