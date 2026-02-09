/**
 * RequestListOrganism - Type definitions
 * Atomic Design: Organism
 */

import { RequestStatus } from '@alkitu/shared';
import { Priority } from '@/components/atoms-alianza/PriorityIcon/PriorityIcon.types';

export interface RequestItem {
  id: string;
  title: string;
  status: RequestStatus;
  priority: Priority;
  createdAt: string;
  client?: {
    name: string;
  };
}

export interface RequestListOrganismProps {
  requests: RequestItem[];
  isLoading: boolean;
  emptyMessage: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
  baseHref: string;
  title?: string;
  showClientName?: boolean;
}
