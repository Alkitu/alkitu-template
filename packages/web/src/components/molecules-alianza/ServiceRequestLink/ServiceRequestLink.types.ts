/**
 * ServiceRequestLink Component Types
 *
 * Molecule component that displays request statistics for a service
 * with a link to view filtered requests.
 */

export interface ServiceRequestLinkProps {
  /**
   * Service ID for linking to requests
   */
  serviceId: string;

  /**
   * Service name for display
   */
  serviceName: string;

  /**
   * Total number of requests for this service
   * @default 0
   */
  requestCount?: number;

  /**
   * Number of pending requests
   * @default 0
   */
  pendingCount?: number;

  /**
   * Number of ongoing requests
   * @default 0
   */
  ongoingCount?: number;

  /**
   * Base href for the link (usually /admin/requests or /employee/requests)
   * @default '/admin/requests'
   */
  baseHref?: string;

  /**
   * Language for routing
   */
  lang?: string;

  /**
   * Whether to show detailed stats or compact view
   * @default false
   */
  detailed?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;
}
