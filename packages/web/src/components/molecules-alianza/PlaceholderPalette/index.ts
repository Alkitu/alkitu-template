/**
 * PlaceholderPalette Component
 *
 * A color palette component for selecting and displaying colors.
 * Supports predefined palettes (Material, Tailwind, Grayscale, Rainbow)
 * and custom color arrays with features like:
 * - Color selection with visual feedback
 * - Color names and values display (hex, rgb, hsl)
 * - Copy to clipboard functionality
 * - Keyboard navigation (arrow keys, Enter, Space)
 * - Multiple size and shape variants
 * - Disabled state
 * - Grid layout customization
 *
 * @example
 * ```tsx
 * import { PlaceholderPalette } from '@/components/molecules-alianza/PlaceholderPalette';
 *
 * <PlaceholderPalette
 *   palette="material"
 *   selectedColor="#F44336"
 *   onSelect={(color) => console.log(color)}
 *   showColorNames
 * />
 * ```
 */

export { PlaceholderPalette } from './PlaceholderPalette';
export type {
  PlaceholderPaletteProps,
  ColorData,
  PaletteName,
  PaletteSize,
  SwatchShape,
  PaletteConfig,
} from './PlaceholderPalette.types';
