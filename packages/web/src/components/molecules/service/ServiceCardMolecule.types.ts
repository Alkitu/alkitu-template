/**
 * Service type with category info (ALI-118)
 */
export interface Service {
  id: string;
  name: string;
  categoryId: string;
  thumbnail?: string | null;
  requestTemplate: any; // JSON object
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
}

/**
 * ServiceCardMolecule Props (ALI-118)
 */
export interface ServiceCardMoleculeProps {
  /** Service data to display */
  service: Service;

  /** Optional className for custom styling */
  className?: string;

  /** Show edit button */
  showEdit?: boolean;

  /** Show delete button */
  showDelete?: boolean;

  /** Callback when edit button is clicked */
  onEdit?: (service: Service) => void;

  /** Callback when delete button is clicked */
  onDelete?: (service: Service) => void;

  /** Loading state for delete operation */
  isDeleting?: boolean;
}
