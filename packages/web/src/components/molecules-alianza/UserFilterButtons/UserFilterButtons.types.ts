export type UserFilterType = 'all' | 'admin' | 'employee' | 'client';

export interface UserFilterLabels {
  all: string;
  admin: string;
  employee: string;
  client: string;
}

export interface UserFilterButtonsProps {
  /**
   * Currently active filter
   */
  activeFilter: UserFilterType;

  /**
   * Callback when filter changes
   */
  onFilterChange: (filter: UserFilterType) => void;

  /**
   * Custom labels for filter buttons
   * @default { all: 'Todos', admin: 'Administradores', employee: 'Employee', client: 'Clientes' }
   */
  labels?: UserFilterLabels;

  /**
   * Additional CSS classes
   */
  className?: string;
}
