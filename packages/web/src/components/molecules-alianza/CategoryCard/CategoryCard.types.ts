import type { ReactNode } from 'react';

/**
 * Category data interface
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    services: number;
  };
}

/**
 * Icon color variants for category icon background
 */
export type CategoryIconVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error';

/**
 * CategoryCard Props
 *
 * A molecule component that displays category information in a card format.
 */
export interface CategoryCardProps {
  /** Category data to display */
  category: Category;

  /** Optional custom icon (defaults to Folder icon) */
  icon?: ReactNode;

  /** Icon color variant */
  iconVariant?: CategoryIconVariant;

  /** Show edit button */
  showEdit?: boolean;

  /** Show delete button */
  showDelete?: boolean;

  /** Callback when card is clicked */
  onClick?: (category: Category) => void;

  /** Callback when edit button is clicked */
  onEdit?: (category: Category) => void;

  /** Callback when delete button is clicked */
  onDelete?: (category: Category) => void;

  /** Loading state for delete operation */
  isDeleting?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Show item count badge */
  showCount?: boolean;

  /** Show creation date */
  showDate?: boolean;

  /** Optional className for custom styling */
  className?: string;

  /** Additional props for accessibility and HTML attributes */
  [key: string]: any;
}
