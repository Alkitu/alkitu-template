import type { AvailablePlaceholders } from '@alkitu/shared/types';

export interface PlaceholderPaletteMoleculeProps {
  /**
   * The available placeholders grouped by category
   */
  placeholders: AvailablePlaceholders;

  /**
   * Callback when a placeholder is clicked
   * @param placeholder - The placeholder string (e.g., "{{user.email}}")
   */
  onPlaceholderClick?: (placeholder: string) => void;

  /**
   * Whether to show the category headers
   * @default true
   */
  showCategoryHeaders?: boolean;

  /**
   * Whether to enable copying to clipboard on click
   * @default false
   */
  enableCopy?: boolean;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Number of columns in the grid
   * @default 5
   */
  columns?: 2 | 3 | 4 | 5 | 6;
}
