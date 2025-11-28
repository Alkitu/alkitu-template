import type { WorkLocation } from '@alkitu/shared';

/**
 * LocationListOrganism Props (ALI-117)
 */
export interface LocationListOrganismProps {
  /** Optional className for custom styling */
  className?: string;

  /** Show add new location button */
  showAddButton?: boolean;

  /** Callback when a location is created/updated/deleted */
  onLocationChange?: () => void;
}

/**
 * Location list state (ALI-117)
 */
export interface LocationListState {
  locations: WorkLocation[];
  isLoading: boolean;
  error: string;
  showForm: boolean;
  editingLocation: WorkLocation | null;
}
