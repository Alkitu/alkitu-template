export interface ServiceIconProps {
  /**
   * Service category name to determine which icon to display (fallback)
   */
  category: string;

  /**
   * Icon name (Lucide) or emoji character from the service thumbnail field.
   * Priority: emoji → Lucide icon → category fallback.
   */
  thumbnail?: string | null;

  /**
   * Hex color for the icon (e.g. "#FF5500")
   */
  color?: string | null;

  /**
   * Additional CSS classes for styling
   */
  className?: string;
}
