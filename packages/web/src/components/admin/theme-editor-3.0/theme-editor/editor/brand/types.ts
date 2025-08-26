// Tipos específicos para el Brand Editor
export interface LogoColorVariants {
  original: string;
  white: string;
  black: string;
  gray: string;
}

export interface LogoModeConfig {
  variants: LogoColorVariants;
  monoColor: string;
  isLinkedToPrimary: boolean;
}

export interface LogoVariant {
  id: string;
  name: string;
  type: 'icon' | 'horizontal' | 'vertical';
  aspectRatio: string;
  svgContent: string;
  detectedColors: string[];
  // Configuraciones separadas para light y dark mode - ÚNICA FUENTE DE VERDAD
  lightMode: LogoModeConfig;
  darkMode: LogoModeConfig;
  metadata: {
    fileName: string;
    fileSize: string;
    dimensions: string;
    viewBox: string;
    colorCount: number;
    hasGradients: boolean;
  };
}

export interface BrandAssets {
  icon: LogoVariant | null;
  horizontal: LogoVariant | null;
  vertical: LogoVariant | null;
}

export interface ColorPickerData {
  isOpen: boolean;
  logoId: string | null;
  colorIndex: number;
  currentColor: string;
}

export const LOGO_SIZE_MAP = {
  s: 16,
  m: 64,
  l: 100
} as const;

export type LogoSize = keyof typeof LOGO_SIZE_MAP;