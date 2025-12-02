import { RequestStatus } from '@alkitu/shared';

/**
 * Props for RequestStatusBadgeMolecule component
 */
export interface RequestStatusBadgeMoleculeProps {
  /**
   * Request status to display
   */
  status: RequestStatus;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}
