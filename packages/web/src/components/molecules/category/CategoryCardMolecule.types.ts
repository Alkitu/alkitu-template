/**
 * Category type with service count (ALI-118)
 */
export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    services: number;
  };
}

/**
 * CategoryCardMolecule Props (ALI-118)
 */
export interface CategoryCardMoleculeProps {
  /** Category data to display */
  category: Category;

  /** Optional className for custom styling */
  className?: string;

  /** Show edit button */
  showEdit?: boolean;

  /** Show delete button */
  showDelete?: boolean;

  /** Callback when edit button is clicked */
  onEdit?: (category: Category) => void;

  /** Callback when delete button is clicked */
  onDelete?: (category: Category) => void;

  /** Loading state for delete operation */
  isDeleting?: boolean;
}
