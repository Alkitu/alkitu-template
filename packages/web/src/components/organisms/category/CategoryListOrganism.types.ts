import type { Category } from '@/components/molecules-alianza/CategoryCard';

/**
 * CategoryListOrganism Props (ALI-118)
 */
export interface CategoryListOrganismProps {
  /** Optional className for custom styling */
  className?: string;

  /** Show add new category button */
  showAddButton?: boolean;

  /** Callback when a category is created/updated/deleted */
  onCategoryChange?: () => void;
}

/**
 * Category list state (ALI-118)
 */
export interface CategoryListState {
  categories: Category[];
  isLoading: boolean;
  error: string;
  showForm: boolean;
  editingCategory: Category | null;
  deletingCategoryId: string | null;
}
