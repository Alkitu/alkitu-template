import type { WorkLocation } from '@alkitu/shared';

/**
 * LocationCardMolecule Props (ALI-117)
 */
export interface LocationCardMoleculeProps {
  /** Location data to display */
  location: WorkLocation;

  /** Optional className for custom styling */
  className?: string;

  /** Show edit button */
  showEdit?: boolean;

  /** Show delete button */
  showDelete?: boolean;

  /** Callback when edit button is clicked */
  onEdit?: (location: WorkLocation) => void;

  /** Callback when delete button is clicked */
  onDelete?: (location: WorkLocation) => void;

  /** Loading state for delete operation */
  isDeleting?: boolean;
}
