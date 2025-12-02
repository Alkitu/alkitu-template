import type { Service } from '@/components/molecules/service';

/**
 * ServiceListOrganism Props (ALI-118)
 */
export interface ServiceListOrganismProps {
  /** Optional className for custom styling */
  className?: string;

  /** Show add new service button */
  showAddButton?: boolean;

  /** Optional category ID to filter services */
  categoryId?: string;

  /** Callback when a service is created/updated/deleted */
  onServiceChange?: () => void;
}

/**
 * Service list state (ALI-118)
 */
export interface ServiceListState {
  services: Service[];
  isLoading: boolean;
  error: string;
  showForm: boolean;
  editingService: Service | null;
  deletingServiceId: string | null;
}
