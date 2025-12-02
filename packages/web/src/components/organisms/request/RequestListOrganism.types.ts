import { RequestListItem, RequestStatus } from '@alkitu/shared';

/**
 * Props for RequestListOrganism component
 */
export interface RequestListOrganismProps {
  /**
   * User role (determines which actions are shown)
   */
  userRole: 'CLIENT' | 'EMPLOYEE' | 'ADMIN';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Callback when a request is clicked
   */
  onRequestClick?: (request: RequestListItem) => void;

  /**
   * Initial status filter
   */
  initialStatusFilter?: RequestStatus;
}

/**
 * Filter state interface
 */
export interface RequestFilters {
  status?: RequestStatus;
  serviceId?: string;
  assignedToId?: string;
}
