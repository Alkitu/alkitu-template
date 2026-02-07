export interface RequestTableItem {
  id: string;
  serviceName: string;
  categoryName: string;
  clientName: string;
  clientEmail?: string;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  executionDateTime: string;
  assignedTo?: string;
  // Enhanced fields for improved display
  executionTime?: string;      // "10:00 AM"
  locationCity?: string;        // "Escazú"
  locationState?: string;       // "San José"
}

export interface RequestsTableAlianzaProps {
  /**
   * Array of requests to display
   */
  requests: RequestTableItem[];

  /**
   * Current language/locale
   */
  lang: string;

  /**
   * Callback when viewing request details
   */
  onViewRequest: (requestId: string, clientEmail: string) => void;

  /**
   * Callback when assigning request (optional)
   */
  onAssignRequest?: (requestId: string) => void;

  /**
   * Callback when completing request (optional)
   */
  onCompleteRequest?: (requestId: string) => void;

  /**
   * Callback when canceling request (optional)
   */
  onCancelRequest?: (requestId: string) => void;

  /**
   * Callback when editing request (optional, admin-only)
   */
  onEditRequest?: (requestId: string) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
