import { RequestListItem } from '@alkitu/shared';

/**
 * Props for RequestCardMolecule component
 */
export interface RequestCardMoleculeProps {
  /**
   * Request data to display
   */
  request: RequestListItem;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Show view details button
   * @default true
   */
  showViewDetails?: boolean;

  /**
   * Show cancel button (for PENDING/ONGOING requests)
   * @default false
   */
  showCancel?: boolean;

  /**
   * Show assign button (for PENDING requests, EMPLOYEE/ADMIN only)
   * @default false
   */
  showAssign?: boolean;

  /**
   * Show complete button (for ONGOING requests, EMPLOYEE/ADMIN only)
   * @default false
   */
  showComplete?: boolean;

  /**
   * Callback when view details is clicked
   */
  onViewDetails?: (request: RequestListItem) => void;

  /**
   * Callback when cancel is clicked
   */
  onCancel?: (request: RequestListItem) => void;

  /**
   * Callback when assign is clicked
   */
  onAssign?: (request: RequestListItem) => void;

  /**
   * Callback when complete is clicked
   */
  onComplete?: (request: RequestListItem) => void;

  /**
   * Loading state for actions
   * @default false
   */
  isLoading?: boolean;
}
