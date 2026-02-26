// Tipos específicos para el Brand Editor
// Re-export canonical types from theme.types
export type {
  LogoColorVariants,
  LogoModeConfig,
  LogoVariant,
} from '../../../core/types/theme.types';

export interface BrandAssets {
  icon: import('../../../core/types/theme.types').LogoVariant | null;
  horizontal: import('../../../core/types/theme.types').LogoVariant | null;
  vertical: import('../../../core/types/theme.types').LogoVariant | null;
}

export interface ColorPickerData {
  isOpen: boolean;
  logoId: string | null;
  colorIndex: number;
  currentColor: string;
}

export const LOGO_SIZE_MAP = {
  xs: 16,
  sm: 24,
  md: 48,
  lg: 80,
  xl: 120,
  // Legacy aliases
  s: 16,
  m: 64,
  l: 100
} as const;

export type LogoSize = keyof typeof LOGO_SIZE_MAP;
