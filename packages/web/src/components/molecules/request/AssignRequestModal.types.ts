import type { Request } from '@alkitu/shared';

/**
 * Employee data structure for assignment dropdown
 */
export interface Employee {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

/**
 * Props for AssignRequestModal component
 */
export interface AssignRequestModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * The request to assign
   */
  request: Request | null;

  /**
   * Callback when assignment is confirmed
   * @param requestId - ID of the request to assign
   * @param employeeId - ID of the employee to assign to
   */
  onConfirm: (requestId: string, employeeId: string) => Promise<void>;

  /**
   * Loading state during assignment
   */
  isLoading?: boolean;
}
