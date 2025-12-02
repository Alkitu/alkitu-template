import type { Category } from '@/components/molecules/category';

/**
 * CategoryFormOrganism Props (ALI-118)
 */
export interface CategoryFormOrganismProps {
  /** Optional className for custom styling */
  className?: string;

  /** Initial form data for editing (if undefined, form is in create mode) */
  initialData?: Category;

  /** Callback when category is successfully created/updated */
  onSuccess?: (category: Category) => void;

  /** Callback when operation fails */
  onError?: (error: string) => void;

  /** Callback when cancel button is clicked */
  onCancel?: () => void;

  /** Show cancel button */
  showCancel?: boolean;
}

/**
 * Category form data (ALI-118)
 */
export interface CategoryFormData {
  name: string;
}
