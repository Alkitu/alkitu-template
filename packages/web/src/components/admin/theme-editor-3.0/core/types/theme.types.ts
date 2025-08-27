// Theme Editor 3.0 - Core Theme Types V2
// Enhanced types for precise color handling

export interface OklchColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.5+) - Increased range for vivid colors
  h: number; // Hue (0-360)
}

export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HSVColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface ColorToken {
  name: string;
  hex: string;           // NEW: Display principal (#RRGGBB)
  oklch: OklchColor;     // Fuente de verdad numérica
  oklchString: string;   // NEW: Para mostrar en UI "oklch(0.62 0.19 259.81)"
  rgb: RGBColor;         // NEW: Para inputs RGB
  hsv: HSVColor;         // NEW: Para color picker
  description?: string;
  
  // Color linking system
  linkedTo?: string;     // Name of the parent color this is linked to
  linkedColors?: string[]; // Names of colors that are linked to this color
  
  // Legacy compatibility
  value: string;         // DEPRECATED: Use oklchString instead
}

export interface ThemeColors {
  // Base colors
  background: ColorToken;
  foreground: ColorToken;
  
  // UI container colors
  card: ColorToken;
  cardForeground: ColorToken;
  popover: ColorToken;
  popoverForeground: ColorToken;
  
  // Primary colors
  primary: ColorToken;
  primaryForeground: ColorToken;
  
  // Secondary colors  
  secondary: ColorToken;
  secondaryForeground: ColorToken;
  
  // Accent colors
  accent: ColorToken;
  accentForeground: ColorToken;
  
  // Muted colors
  muted: ColorToken;
  mutedForeground: ColorToken;
  
  // Alert colors (destructive, warning, success)
  destructive: ColorToken;
  destructiveForeground: ColorToken;
  warning: ColorToken;
  warningForeground: ColorToken;
  success: ColorToken;
  successForeground: ColorToken;
  
  // Border & Input colors
  border: ColorToken;
  input: ColorToken;
  ring: ColorToken;
  
  // Chart colors
  chart1: ColorToken;
  chart2: ColorToken;
  chart3: ColorToken;
  chart4: ColorToken;
  chart5: ColorToken;
  
  // Sidebar colors
  sidebar: ColorToken;
  sidebarForeground: ColorToken;
  sidebarPrimary: ColorToken;
  sidebarPrimaryForeground: ColorToken;
  sidebarAccent: ColorToken;
  sidebarAccentForeground: ColorToken;
  sidebarBorder: ColorToken;
  sidebarRing: ColorToken;
  
  // Scrollbar colors
  scrollbarTrack: ColorToken;
  scrollbarThumb: ColorToken;
}

export interface ThemeTypography {
  fontFamilies: {
    sans: string;
    serif: string;
    mono: string;
  };
  trackingNormal: string;
}

export interface LogoVariant {
  id: string;
  name: string;
  type: 'icon' | 'horizontal' | 'vertical';
  aspectRatio: string;
  svgContent: string;
  detectedColors: string[];
  variants: {
    original: string;
    white: string;
    black: string;
    gray: string;
  };
  // Logo específico para modo oscuro (opcional)
  darkModeVersion?: {
    svgContent: string;
    variants: {
      original: string;
      white: string;
      black: string;
      gray: string;
    };
    metadata: {
      fileName: string;
      fileSize: string;
      dimensions: string;
      viewBox: string;
      colorCount: number;
      hasGradients: boolean;
    };
  };
  metadata: {
    fileName: string;
    fileSize: string;
    dimensions: string;
    viewBox: string;
    colorCount: number;
    hasGradients: boolean;
  };
}

export interface ThemeBrand {
  // Brand Identity
  name: string;
  tagline?: string;
  description?: string;
  voice?: string;
  tone?: string;
  colorGuidelines?: string;
  
  // Logo variants
  logos: {
    icon: LogoVariant | null;
    horizontal: LogoVariant | null;
    vertical: LogoVariant | null;
  };
  
  // Colors
  primaryColor: ColorToken;
  secondaryColor: ColorToken;
  brandColors?: ColorToken[];
  
  // Legacy support
  logo?: string;
}

export interface ThemeSpacing {
  spacing: string; // Base spacing value (0.25rem)
  scale: Record<string, string>; // Individual spacing scale values
}

export interface BorderRadiusController {
  value: number; // Base value in px
  isLinked: boolean; // Whether it's linked to global radius
  formula: string; // CSS calc formula for nested elements
}

export interface ThemeBorders {
  // Global Controllers
  globalRadius: BorderRadiusController;
  cardsRadius: BorderRadiusController;
  buttonsRadius: BorderRadiusController;
  checkboxRadius: BorderRadiusController;
  
  // Computed CSS values (auto-generated from controllers)
  radius: string; // Base radius value from globalRadius
  radiusSm: string; // calc(var(--radius) - 4px)
  radiusMd: string; // calc(var(--radius) - 2px)
  radiusLg: string; // var(--radius)
  radiusXl: string; // calc(var(--radius) + 4px)
  
  // Component-specific values
  radiusCard: string; // From cardsRadius controller
  radiusCardInner: string; // With automatic padding formula
  radiusButton: string; // From buttonsRadius controller
  radiusButtonInner: string; // With automatic padding formula
  radiusCheckbox: string; // From checkboxRadius controller
  radiusCheckboxInner: string; // With automatic padding formula
}

export interface ThemeShadows {
  shadow2xs: string;
  shadowXs: string;
  shadowSm: string;
  shadow: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  shadow2xl: string;
}

export interface ThemeScroll {
  width: string;
  behavior: 'auto' | 'smooth' | 'instant';
  smooth: boolean;
  hide: boolean;
  
  // Border radius controls for scrollbar elements
  trackRadius: string;   // Border radius for scrollbar track (riel)
  thumbRadius: string;   // Border radius for scrollbar thumb (deslizador)
}

export interface ThemeData {
  id: string;
  name: string;
  description?: string;
  version: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  
  // Dual-mode theme properties
  lightColors: ThemeColors;   // Light mode color configuration
  darkColors: ThemeColors;    // Dark mode color configuration
  
  // Shared properties (mode-independent)
  typography: ThemeTypography;
  brand: ThemeBrand;
  spacing: ThemeSpacing;
  borders: ThemeBorders;
  shadows: ThemeShadows;
  scroll: ThemeScroll;
  
  // Metadata
  tags?: string[];
  isPublic: boolean;
  isFavorite: boolean;
}

// Helper to get current colors based on mode
export interface ThemeWithCurrentColors extends Omit<ThemeData, 'lightColors' | 'darkColors'> {
  colors: ThemeColors; // Current active colors based on mode
  lightColors: ThemeColors;
  darkColors: ThemeColors;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeExportFormat {
  format: 'css' | 'json' | 'tailwind' | 'scss' | 'figma';
  content: string;
  filename: string;
}