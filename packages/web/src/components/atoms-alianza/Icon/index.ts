/**
 * Icon Component - Atomic Design Atom
 *
 * Universal icon component that wraps Lucide React icons with consistent
 * sizing, theming, and accessibility features.
 *
 * @module atoms-alianza/Icon
 */

export { Icon, default } from './Icon';
export type {
  IconProps,
  IconVariant,
  IconSize,
  IconPosition,
  IconComponent,
  IconSizeMap,
  IconVariantMap,
} from './Icon.types';

// Re-export Icons registry for convenience
export { Icons, type IconKeys } from '@/components/primitives/icons';
