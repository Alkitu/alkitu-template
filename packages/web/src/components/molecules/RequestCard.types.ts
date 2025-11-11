import type { ReactNode } from 'react';

export type RequestStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'rejected';
export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface RequestCardProps {
  /**
   * Unique identifier for the request
   */
  id: string;

  /**
   * Request title
   */
  title: string;

  /**
   * Request description
   */
  description: string;

  /**
   * Current status of the request
   */
  status: RequestStatus;

  /**
   * Type of request
   */
  requestType?: string;

  /**
   * Priority level of the request
   */
  priority?: RequestPriority;

  /**
   * Created date
   */
  createdAt?: string;

  /**
   * Due date
   */
  dueDate?: string;

  /**
   * Assignee name
   */
  assignee?: string;

  /**
   * Custom actions or buttons
   */
  actions?: ReactNode;

  /**
   * Click handler for the card
   */
  onClick?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: Record<string, string>;
}