import { RequestDetail, UserRole } from '@alkitu/shared';

/**
 * Props for RequestDetailOrganism component
 */
export interface RequestDetailOrganismProps {
  /**
   * Request ID to display
   */
  requestId: string;

  /**
   * User role (determines which actions are shown)
   */
  userRole: UserRole;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Callback when request is updated
   */
  onUpdate?: (request: RequestDetail) => void;

  /**
   * Callback when back button is clicked
   */
  onBack?: () => void;

  /**
   * Callback when edit button is clicked (admin-only)
   */
  onEdit?: () => void;
}
