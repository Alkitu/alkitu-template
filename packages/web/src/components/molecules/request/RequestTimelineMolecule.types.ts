import { RequestStatus } from '@alkitu/shared';

export interface TimelineEvent {
  status: RequestStatus;
  date: Date;
  label: string;
  isCompleted: boolean;
  isActive: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export interface RequestTimelineMoleculeProps {
  events: TimelineEvent[];
  className?: string;
}
