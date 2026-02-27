import { UserRole } from '@alkitu/shared';

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
   * Current locale for i18n
   * @default 'es'
   */
  lang?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Callback when request is updated (assign, status change, inline edit)
   */
  onUpdate?: () => void;

  /**
   * Callback when back button is clicked
   */
  onBack?: () => void;
}
