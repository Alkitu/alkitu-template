/**
 * Employee Assignment Button Types
 *
 * Type definitions for the EmployeeAssignmentButton molecule component
 */

export interface Employee {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  department?: string;
}

export interface EmployeeAssignmentButtonProps {
  /**
   * List of employee names or objects to choose from
   */
  options?: string[] | Employee[];

  /**
   * Currently assigned employee (name or ID)
   */
  defaultAssigned?: string | null;

  /**
   * Callback when an employee is assigned
   */
  onAssign?: (value: string | null) => void;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Loading state (e.g., fetching employees)
   */
  isLoading?: boolean;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Placeholder text when no employee is assigned
   */
  placeholder?: string;

  /**
   * Enable search/filter in the dropdown
   */
  searchable?: boolean;

  /**
   * Custom class name for the button
   */
  className?: string;

  /**
   * Test ID for testing
   */
  'data-testid'?: string;
}
