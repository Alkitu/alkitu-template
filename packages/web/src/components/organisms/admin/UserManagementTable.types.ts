import type { HTMLAttributes } from 'react';

/**
 * User filter options for filtering users by role
 */
export type UserFilterType = 'all' | 'admin' | 'employee' | 'client';

/**
 * User item structure for table display
 */
export interface UserTableItem {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
}

/**
 * User statistics structure
 */
export interface UserStats {
  total: number;
  admins: number;
  employees: number;
  clients: number;
}

/**
 * Translated labels for the table
 */
export interface TableLabels {
  user: string;
  role: string;
  phone: string;
  actions: string;
  edit: string;
  delete: string;
}

/**
 * Translated labels for role names
 */
export interface RoleLabels {
  [key: string]: string | undefined;
  ADMIN: string;
  EMPLOYEE: string;
  CLIENT: string;
  LEAD?: string;
}

/**
 * Translated labels for filter buttons
 */
export interface FilterLabels {
  all: string;
  admin: string;
  employee: string;
  client: string;
}

/**
 * Translated labels for stats cards
 */
export interface StatsLabels {
  total: string;
  admins: string;
  employees: string;
  clients: string;
}

/**
 * Translated labels for search and actions
 */
export interface ActionLabels {
  search: string;
  createUser: string;
}

/**
 * Translated labels for pagination
 */
export interface PaginationLabels {
  showing: string;
  to: string;
  of: string;
  results: string;
  rowsPerPage: string;
  page: string;
  previous: string;
  next: string;
}

/**
 * All translated labels required by the organism
 */
export interface UserManagementLabels {
  table: TableLabels;
  roles: RoleLabels;
  filters: FilterLabels;
  stats: StatsLabels;
  actions: ActionLabels;
  pagination?: Partial<PaginationLabels>;
  deleteConfirm: string;
  deleteSuccess: string;
  deleteError: string;
}

/**
 * Props for UserManagementTable organism
 *
 * IMPORTANT: All text props should be **translated strings** passed from page components.
 * This organism does NOT handle translations internally.
 */
export interface UserManagementTableProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Current language code (for routing)
   */
  lang: string;

  /**
   * All translated labels (pre-translated in page)
   */
  labels: UserManagementLabels;

  /**
   * Optional callback when user is created (for navigation)
   */
  onUserCreated?: () => void;

  /**
   * Optional callback when user is deleted (for refetching)
   */
  onUserDeleted?: () => void;

  /**
   * Custom className for container
   */
  className?: string;
}
