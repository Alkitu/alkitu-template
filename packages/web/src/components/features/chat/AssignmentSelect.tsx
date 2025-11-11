import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/Select';
import { Label } from '@/components/primitives/ui/label';

interface AssignmentSelectProps {
  currentAssignment?: string | null;
  onAssign: (assignedToId: string) => void;
}

export function AssignmentSelect({
  currentAssignment,
  onAssign,
}: AssignmentSelectProps) {
  // In a real implementation, you would fetch the list of available admins/agents
  const availableAgents = [
    { id: 'unassigned', name: 'Unassigned' },
    { id: 'admin-1', name: 'Admin User' },
    { id: 'agent-1', name: 'Support Agent 1' },
    { id: 'agent-2', name: 'Support Agent 2' },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="assignment">Assigned to</Label>
      <Select
        value={currentAssignment || 'unassigned'}
        onValueChange={onAssign}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select agent" />
        </SelectTrigger>
        <SelectContent>
          {availableAgents.map((agent) => (
            <SelectItem key={agent.id} value={agent.id}>
              {agent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
