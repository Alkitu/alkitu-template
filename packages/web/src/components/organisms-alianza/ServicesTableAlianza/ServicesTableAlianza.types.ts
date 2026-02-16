export interface ServiceTableItem {
  id: string;
  name: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
  questionsCount: number;
  thumbnail?: string | null;
  iconColor?: string;
  requestStats?: {
    total: number;
    pending: number;
    ongoing: number;
  };
}

export interface ServicesTableAlianzaProps {
  services: ServiceTableItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  /**
   * Whether to show the requests column with cross-linking
   * @default false
   */
  showRequestsColumn?: boolean;
  /**
   * Language for routing (used in ServiceRequestLink)
   * @default 'es'
   */
  lang?: string;
  /**
   * Base href for request links
   * @default '/admin/requests'
   */
  requestsBaseHref?: string;
  labels?: {
    service: string;
    category: string;
    status: string;
    questions: string;
    requests?: string;
    actions: string;
    edit: string;
    delete: string;
    active: string;
    inactive: string;
  };
  requestLinkLabels?: {
    noRequests: string;
    request: string;
    requests: string;
    pending: string;
    pendingPlural: string;
    pendingTitle: string;
    ongoingTitle: string;
    viewRequests: string;
  };
  className?: string;
}
