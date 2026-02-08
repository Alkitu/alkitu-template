import { RequestListItem } from '@alkitu/shared';

/**
 * Props for ClientRequestsView organism component
 */
export interface ClientRequestsViewProps {
  /**
   * Callback when a request is clicked
   */
  onRequestClick?: (request: RequestListItem) => void;

  /**
   * Callback when create new request button is clicked
   */
  onCreateRequest?: () => void;

  /**
   * Translated labels for filters
   */
  filterLabels?: {
    all: string;
    pending: string;
    active: string;
    completed: string;
  };

  /**
   * Empty state message when no requests exist
   */
  emptyStateMessage?: string;

  /**
   * Empty state action button text
   */
  emptyStateAction?: string;

  /**
   * Loading state message
   */
  loadingMessage?: string;

  /**
   * Error state message
   */
  errorMessage?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
