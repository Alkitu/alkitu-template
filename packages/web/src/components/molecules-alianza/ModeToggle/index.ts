/**
 * ModeToggle - Atomic Design Molecule
 *
 * Theme mode toggle component for switching between light, dark, and system themes.
 * Integrates with next-themes and provides two display variants.
 *
 * @example Icon dropdown (default)
 * ```tsx
 * import { ModeToggle } from '@/components/molecules-alianza/ModeToggle';
 * <ModeToggle />
 * ```
 *
 * @example Button group with labels
 * ```tsx
 * <ModeToggle variant="buttons" showLabels />
 * ```
 *
 * @module molecules-alianza/ModeToggle
 */

export { ModeToggle, default } from './ModeToggle';
export type {
  ModeToggleProps,
  ModeToggleVariant,
  ModeToggleSize,
  ThemeMode,
  ThemeOption,
} from './ModeToggle.types';
