import { RequestStatus } from '@prisma/client';

/**
 * RequestTimeline Component Types
 *
 * Organism component that displays visual timeline of request progress
 */

export interface RequestTimelineProps {
  /**
   * Request object with status and dates
   */
  request: {
    id: string;
    status: RequestStatus;
    createdAt: Date | string;
    executionDateTime: Date | string;
    completedAt?: Date | string | null;
    cancelledAt?: Date | string | null;
  };

  /**
   * Whether to show dates for each step
   * @default true
   */
  showDates?: boolean;

  /**
   * Whether to use compact view
   * @default false
   */
  compact?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;
}

export interface TimelineStep {
  label: string;
  date?: Date | string | null;
  completed: boolean;
  active?: boolean;
  variant?: 'default' | 'success' | 'destructive';
  icon: React.ComponentType<{ className?: string }>;
}
