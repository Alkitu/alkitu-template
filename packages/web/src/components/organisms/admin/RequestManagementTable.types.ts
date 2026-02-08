import { RequestStatus } from '@alkitu/shared';

/**
 * Filter types for request management
 */
export type RequestFilterType = 'all' | 'pending' | 'ongoing' | 'completed' | 'cancelled';

/**
 * Request filters state
 */
export interface RequestFilters {
  search: string;
  status: RequestStatus | undefined;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * Request stats data
 */
export interface RequestStats {
  total: number;
  pending: number;
  ongoing: number;
  completed: number;
  cancelled: number;
}

/**
 * Table item structure for requests
 */
export interface RequestTableItem {
  id: string;
  serviceName: string;
  categoryName: string;
  clientName: string;
  clientEmail: string;
  status: RequestStatus;
  executionDateTime: string;
  assignedTo?: string;
  executionTime: string;
  locationCity?: string;
  locationState?: string;
}

/**
 * Props for RequestManagementTable organism
 */
export interface RequestManagementTableProps {
  /**
   * Current language for routing
   */
  lang: string;

  /**
   * Callback when a request is updated (e.g., assigned)
   */
  onRequestUpdated?: () => void;

  /**
   * Callback when a request is cancelled
   */
  onRequestCancelled?: () => void;

  /**
   * Callback when a request is completed
   */
  onRequestCompleted?: () => void;
}
