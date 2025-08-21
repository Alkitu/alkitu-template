// Theme Editor 3.0 - Default Themes V2 with Precise Colors
import { ThemeData, ColorToken } from '../types/theme.types';
import { createPreciseColorToken } from '../utils/color-conversions-v2';

// Legacy helper function (deprecated - use createPreciseColorToken instead)
function createColorToken(name: string, value: string, l: number, c: number, h: number, description?: string): ColorToken {
  // Convert to precise token for backward compatibility
  const preciseToken = createPreciseColorToken(name, { l, c, h }, description);
  return {
    ...preciseToken,
    value // Keep legacy value for compatibility
  };
}

// Light mode colors (original default theme)
const DEFAULT_LIGHT_COLORS: import('../types/theme.types').ThemeColors = {
  // Base colors
  background: createColorToken('background', 'oklch(1 0 0)', 1, 0, 0),
  foreground: createColorToken('foreground', 'oklch(0.1450 0 0)', 0.1450, 0, 0),
  
  // UI container colors
  card: createColorToken('card', 'oklch(1 0 0)', 1, 0, 0),
  cardForeground: createColorToken('card-foreground', 'oklch(0.1450 0 0)', 0.1450, 0, 0),
  popover: createColorToken('popover', 'oklch(1 0 0)', 1, 0, 0),
  popoverForeground: createColorToken('popover-foreground', 'oklch(0.1450 0 0)', 0.1450, 0, 0),
  
  // Primary colors
  primary: createColorToken('primary', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  primaryForeground: createColorToken('primary-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  
  // Secondary colors
  secondary: createColorToken('secondary', 'oklch(0.9700 0 0)', 0.9700, 0, 0),
  secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  
  // Accent colors
  accent: createColorToken('accent', 'oklch(0.9700 0 0)', 0.9700, 0, 0),
  accentForeground: createColorToken('accent-foreground', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  
  // Muted colors
  muted: createColorToken('muted', 'oklch(0.9700 0 0)', 0.9700, 0, 0),
  mutedForeground: createColorToken('muted-foreground', 'oklch(0.5560 0 0)', 0.5560, 0, 0),
  
  // Destructive colors
  destructive: createColorToken('destructive', 'oklch(0.5770 0.2450 27.3250)', 0.5770, 0.2450, 27.3250),
  destructiveForeground: createColorToken('destructive-foreground', 'oklch(1 0 0)', 1, 0, 0),
  
  // Border & Input colors
  border: createColorToken('border', 'oklch(0.9220 0 0)', 0.9220, 0, 0),
  input: createColorToken('input', 'oklch(0.9220 0 0)', 0.9220, 0, 0),
  ring: createColorToken('ring', 'oklch(0.7080 0 0)', 0.7080, 0, 0),
  
  // Chart colors
  chart1: createColorToken('chart-1', 'oklch(0.8100 0.1000 252)', 0.8100, 0.1000, 252),
  chart2: createColorToken('chart-2', 'oklch(0.6200 0.1900 260)', 0.6200, 0.1900, 260),
  chart3: createColorToken('chart-3', 'oklch(0.5500 0.2200 263)', 0.5500, 0.2200, 263),
  chart4: createColorToken('chart-4', 'oklch(0.4900 0.2200 264)', 0.4900, 0.2200, 264),
  chart5: createColorToken('chart-5', 'oklch(0.4200 0.1800 266)', 0.4200, 0.1800, 266),
  
  // Sidebar colors
  sidebar: createColorToken('sidebar', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.1450 0 0)', 0.1450, 0, 0),
  sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.9700 0 0)', 0.9700, 0, 0),
  sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  sidebarBorder: createColorToken('sidebar-border', 'oklch(0.9220 0 0)', 0.9220, 0, 0),
  sidebarRing: createColorToken('sidebar-ring', 'oklch(0.7080 0 0)', 0.7080, 0, 0),
  
  // Scrollbar colors - Using precise conversions
  scrollbarTrack: createPreciseColorToken('Scrollbar Track', '#ffffff', 'Light mode scrollbar track background'),
  scrollbarThumb: createPreciseColorToken('Scrollbar Thumb', '#cdcdcd', 'Light mode scrollbar thumb color')
};

// Dark mode colors (original default theme)
const DEFAULT_DARK_COLORS: import('../types/theme.types').ThemeColors = {
  // Base colors
  background: createColorToken('background', 'oklch(0.1450 0 0)', 0.1450, 0, 0),
  foreground: createColorToken('foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  
  // UI container colors
  card: createColorToken('card', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  cardForeground: createColorToken('card-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  popover: createColorToken('popover', 'oklch(0.2690 0 0)', 0.2690, 0, 0),
  popoverForeground: createColorToken('popover-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  
  // Primary colors
  primary: createColorToken('primary', 'oklch(0.9220 0 0)', 0.9220, 0, 0),
  primaryForeground: createColorToken('primary-foreground', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  
  // Secondary colors
  secondary: createColorToken('secondary', 'oklch(0.2690 0 0)', 0.2690, 0, 0),
  secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  
  // Accent colors
  accent: createColorToken('accent', 'oklch(0.3710 0 0)', 0.3710, 0, 0),
  accentForeground: createColorToken('accent-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  
  // Muted colors
  muted: createColorToken('muted', 'oklch(0.2690 0 0)', 0.2690, 0, 0),
  mutedForeground: createColorToken('muted-foreground', 'oklch(0.7080 0 0)', 0.7080, 0, 0),
  
  // Destructive colors
  destructive: createColorToken('destructive', 'oklch(0.7040 0.1910 22.2160)', 0.7040, 0.1910, 22.2160),
  destructiveForeground: createColorToken('destructive-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  
  // Border & Input colors
  border: createColorToken('border', 'oklch(0.2750 0 0)', 0.2750, 0, 0),
  input: createColorToken('input', 'oklch(0.3250 0 0)', 0.3250, 0, 0),
  ring: createColorToken('ring', 'oklch(0.5560 0 0)', 0.5560, 0, 0),
  
  // Chart colors (same as light for consistency)
  chart1: createColorToken('chart-1', 'oklch(0.8100 0.1000 252)', 0.8100, 0.1000, 252),
  chart2: createColorToken('chart-2', 'oklch(0.6200 0.1900 260)', 0.6200, 0.1900, 260),
  chart3: createColorToken('chart-3', 'oklch(0.5500 0.2200 263)', 0.5500, 0.2200, 263),
  chart4: createColorToken('chart-4', 'oklch(0.4900 0.2200 264)', 0.4900, 0.2200, 264),
  chart5: createColorToken('chart-5', 'oklch(0.4200 0.1800 266)', 0.4200, 0.1800, 266),
  
  // Sidebar colors
  sidebar: createColorToken('sidebar', 'oklch(0.2050 0 0)', 0.2050, 0, 0),
  sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.4880 0.2430 264.3760)', 0.4880, 0.2430, 264.3760),
  sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.2690 0 0)', 0.2690, 0, 0),
  sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0),
  sidebarBorder: createColorToken('sidebar-border', 'oklch(0.2750 0 0)', 0.2750, 0, 0),
  sidebarRing: createColorToken('sidebar-ring', 'oklch(0.4390 0 0)', 0.4390, 0, 0),
  
  // Scrollbar colors - Using precise conversions  
  scrollbarTrack: createPreciseColorToken('Scrollbar Track', '#0A0A0A', 'Dark mode scrollbar track background'),
  scrollbarThumb: createPreciseColorToken('Scrollbar Thumb', '#2E2929', 'Dark mode scrollbar thumb color')
};

// Default Theme - Dual configuration structure
export const DEFAULT_THEME: ThemeData = {
  id: 'default',
  name: 'Default',
  description: '',
  version: '1.0.0',
  author: 'Theme Editor 3.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  // Dual color configurations
  lightColors: DEFAULT_LIGHT_COLORS,
  darkColors: DEFAULT_DARK_COLORS,
  typography: {
    fontFamilies: {
      sans: 'Poppins, ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono: 'ui-monospace, SFMono-Regular, monospace'
    },
    trackingNormal: '0em'
  },
  brand: {
    name: 'Default Brand',
    primaryColor: createColorToken('primary', 'oklch(0.2050 0 0)', 0.2050, 0, 0),  // Migrated from brand-primary
    secondaryColor: createColorToken('secondary', 'oklch(0.9700 0 0)', 0.9700, 0, 0)  // Migrated from brand-secondary
  },
  spacing: {
    spacing: '0.25rem'
  },
  borders: {
    radius: '0.625rem',
    radiusSm: 'calc(var(--radius) - 4px)',
    radiusMd: 'calc(var(--radius) - 2px)', 
    radiusLg: 'var(--radius)',
    radiusXl: 'calc(var(--radius) + 4px)'
  },
  shadows: {
    shadow2xs: '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
    shadowXs: '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
    shadowSm: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
    shadow: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
    shadowMd: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)',
    shadowLg: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)',
    shadowXl: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)',
    shadow2xl: '0 1px 3px 0px hsl(0 0% 0% / 0.25)'
  },
  scroll: {
    width: '8px',
    behavior: 'smooth',
    smooth: true,
    hide: false
  },
  tags: ['default', 'clean', 'modern'],
  isPublic: true,
  isFavorite: false
};

// Helper function to create themed variants
function createThemedVariants(
  baseColors: typeof DEFAULT_LIGHT_COLORS,
  darkColors: typeof DEFAULT_DARK_COLORS,
  accentColors: Partial<import('../types/theme.types').ThemeColors>
): { lightColors: typeof DEFAULT_LIGHT_COLORS, darkColors: typeof DEFAULT_DARK_COLORS } {
  return {
    lightColors: { ...baseColors, ...accentColors },
    darkColors: { ...darkColors, ...accentColors }
  };
}

// Themed variants using helper function
export const AMBER_MINIMAL_THEME: ThemeData = {
  id: 'amber-minimal',
  name: 'Amber Minimal',
  description: 'Warm amber theme',
  version: '1.0.0',
  author: 'Theme Editor 3.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  // Light mode colors
  lightColors: {
    background: createColorToken('background', 'oklch(1 0 0)', 1, 0, 0),
    foreground: createColorToken('foreground', 'oklch(0.1490 0 0)', 0.1490, 0, 0),
    card: createColorToken('card', 'oklch(1 0 0)', 1, 0, 0),
    cardForeground: createColorToken('card-foreground', 'oklch(0.1490 0 0)', 0.1490, 0, 0),
    popover: createColorToken('popover', 'oklch(1 0 0)', 1, 0, 0),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.1490 0 0)', 0.1490, 0, 0),
    primary: createColorToken('primary', 'oklch(0.6830 0.1468 55.4)', 0.6830, 0.1468, 55.4),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0 0 0)', 0, 0, 0),
    secondary: createColorToken('secondary', 'oklch(0.9558 0.0044 106.78)', 0.9558, 0.0044, 106.78),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.2950 0.0044 272.31)', 0.2950, 0.0044, 272.31),
    muted: createColorToken('muted', 'oklch(0.9853 0.0029 120.00)', 0.9853, 0.0029, 120.00),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.4242 0.0044 272.31)', 0.4242, 0.0044, 272.31),
    accent: createColorToken('accent', 'oklch(0.9938 0.0362 79.65)', 0.9938, 0.0362, 79.65),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.4640 0.1050 28.62)', 0.4640, 0.1050, 28.62),
    destructive: createColorToken('destructive', 'oklch(0.6279 0.2574 27.33)', 0.6279, 0.2574, 27.33),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(1 0 0)', 1, 0, 0),
    border: createColorToken('border', 'oklch(0.8985 0.0044 272.31)', 0.8985, 0.0044, 272.31),
    input: createColorToken('input', 'oklch(0.8985 0.0044 272.31)', 0.8985, 0.0044, 272.31),
    ring: createColorToken('ring', 'oklch(0.6830 0.1468 55.4)', 0.6830, 0.1468, 55.4),
    chart1: createColorToken('chart-1', 'oklch(0.6830 0.1468 55.4)', 0.6830, 0.1468, 55.4),
    chart2: createColorToken('chart-2', 'oklch(0.6144 0.1468 43.09)', 0.6144, 0.1468, 43.09),
    chart3: createColorToken('chart-3', 'oklch(0.5460 0.1468 30.78)', 0.5460, 0.1468, 30.78),
    chart4: createColorToken('chart-4', 'oklch(0.4640 0.1050 28.62)', 0.4640, 0.1050, 28.62),
    chart5: createColorToken('chart-5', 'oklch(0.3900 0.0840 22.09)', 0.3900, 0.0840, 22.09),
    sidebar: createColorToken('sidebar', 'oklch(0.9853 0.0029 120.00)', 0.9853, 0.0029, 120.00),
    sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.1490 0 0)', 0.1490, 0, 0),
    sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.6830 0.1468 55.4)', 0.6830, 0.1468, 55.4),
    sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(1 0 0)', 1, 0, 0),
    sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.9938 0.0362 79.65)', 0.9938, 0.0362, 79.65),
    sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.4640 0.1050 28.62)', 0.4640, 0.1050, 28.62),
    sidebarBorder: createColorToken('sidebar-border', 'oklch(0.8985 0.0044 272.31)', 0.8985, 0.0044, 272.31),
    sidebarRing: createColorToken('sidebar-ring', 'oklch(0.6830 0.1468 55.4)', 0.6830, 0.1468, 55.4),
    scrollbarTrack: createColorToken('scrollbar-track', 'oklch(1 0 0)', 1, 0, 0),
    scrollbarThumb: createColorToken('scrollbar-thumb', 'oklch(0.8985 0.0044 272.31)', 0.8985, 0.0044, 272.31)
  },
  
  // Dark mode colors
  darkColors: {
    background: createColorToken('background', 'oklch(0.0900 0 0)', 0.0900, 0, 0),
    foreground: createColorToken('foreground', 'oklch(0.8970 0 0)', 0.8970, 0, 0),
    card: createColorToken('card', 'oklch(0.1490 0 0)', 0.1490, 0, 0),
    cardForeground: createColorToken('card-foreground', 'oklch(0.8970 0 0)', 0.8970, 0, 0),
    popover: createColorToken('popover', 'oklch(0.1490 0 0)', 0.1490, 0, 0),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.8970 0 0)', 0.8970, 0, 0),
    primary: createColorToken('primary', 'oklch(0.6830 0.1468 55.4)', 0.6830, 0.1468, 55.4),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0 0 0)', 0, 0, 0),
    secondary: createColorToken('secondary', 'oklch(0.1490 0 0)', 0.1490, 0, 0),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.8970 0 0)', 0.8970, 0, 0),
    muted: createColorToken('muted', 'oklch(0.1490 0 0)', 0.1490, 0, 0),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.6391 0 0)', 0.6391, 0, 0),
    accent: createColorToken('accent', 'oklch(0.4640 0.1050 28.62)', 0.4640, 0.1050, 28.62),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.9445 0.0516 81.85)', 0.9445, 0.0516, 81.85),
    destructive: createColorToken('destructive', 'oklch(0.6279 0.2574 27.33)', 0.6279, 0.2574, 27.33),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(1 0 0)', 1, 0, 0),
    border: createColorToken('border', 'oklch(0.2518 0 0)', 0.2518, 0, 0),
    input: createColorToken('input', 'oklch(0.2518 0 0)', 0.2518, 0, 0),
    ring: createColorToken('ring', 'oklch(0.6830 0.1468 55.4)', 0.6830, 0.1468, 55.4),
    chart1: createColorToken('chart-1', 'oklch(0.7450 0.1468 55.4)', 0.7450, 0.1468, 55.4),
    chart2: createColorToken('chart-2', 'oklch(0.6144 0.1468 43.09)', 0.6144, 0.1468, 43.09),
    chart3: createColorToken('chart-3', 'oklch(0.4640 0.1050 28.62)', 0.4640, 0.1050, 28.62),
    chart4: createColorToken('chart-4', 'oklch(0.5460 0.1468 30.78)', 0.5460, 0.1468, 30.78),
    chart5: createColorToken('chart-5', 'oklch(0.4640 0.1050 28.62)', 0.4640, 0.1050, 28.62),
    sidebar: createColorToken('sidebar', 'oklch(0.0588 0 0)', 0.0588, 0, 0),
    sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.8970 0 0)', 0.8970, 0, 0),
    sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.6830 0.1468 55.4)', 0.6830, 0.1468, 55.4),
    sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(1 0 0)', 1, 0, 0),
    sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.4640 0.1050 28.62)', 0.4640, 0.1050, 28.62),
    sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.9445 0.0516 81.85)', 0.9445, 0.0516, 81.85),
    sidebarBorder: createColorToken('sidebar-border', 'oklch(0.2518 0 0)', 0.2518, 0, 0),
    sidebarRing: createColorToken('sidebar-ring', 'oklch(0.6830 0.1468 55.4)', 0.6830, 0.1468, 55.4),
    scrollbarTrack: createColorToken('scrollbar-track', 'oklch(0.0900 0 0)', 0.0900, 0, 0),
    scrollbarThumb: createColorToken('scrollbar-thumb', 'oklch(0.2518 0 0)', 0.2518, 0, 0)
  },
  
  typography: {
    fontFamilies: {
      sans: 'var(--font-sans)',
      serif: 'var(--font-serif)',
      mono: 'var(--font-mono)'
    },
    trackingNormal: 'var(--tracking-normal)'
  },
  brand: {
    name: 'Amber Minimal Brand',
    primaryColor: createColorToken('primary', 'oklch(0.6830 0.1468 55.4)', 0.6830, 0.1468, 55.4),  // Migrated from brand-primary
    secondaryColor: createColorToken('secondary', 'oklch(0.9558 0.0044 106.78)', 0.9558, 0.0044, 106.78)  // Migrated from brand-secondary
  },
  spacing: {
    spacing: '0.25rem'
  },
  borders: {
    radius: '0.375rem',
    radiusSm: 'calc(var(--radius) - 4px)',
    radiusMd: 'calc(var(--radius) - 2px)', 
    radiusLg: 'var(--radius)',
    radiusXl: 'calc(var(--radius) + 4px)'
  },
  shadows: {
    shadow2xs: '0px 4px 8px -1px hsl(var(--foreground) / 0.05)',
    shadowXs: '0px 4px 8px -1px hsl(var(--foreground) / 0.05)',
    shadowSm: '0px 4px 8px -1px hsl(var(--foreground) / 0.10), 0px 1px 2px -2px hsl(var(--foreground) / 0.10)',
    shadow: '0px 4px 8px -1px hsl(var(--foreground) / 0.10), 0px 1px 2px -2px hsl(var(--foreground) / 0.10)',
    shadowMd: '0px 4px 8px -1px hsl(var(--foreground) / 0.10), 0px 2px 4px -2px hsl(var(--foreground) / 0.10)',
    shadowLg: '0px 4px 8px -1px hsl(var(--foreground) / 0.10), 0px 4px 6px -2px hsl(var(--foreground) / 0.10)',
    shadowXl: '0px 4px 8px -1px hsl(var(--foreground) / 0.10), 0px 8px 10px -2px hsl(var(--foreground) / 0.10)',
    shadow2xl: '0px 4px 8px -1px hsl(var(--foreground) / 0.25)'
  },
  scroll: {
    width: '8px',
    behavior: 'smooth',
    smooth: true,
    hide: false
  },
  tags: ['amber', 'warm', 'minimal'],
  isPublic: true,
  isFavorite: false
};

export const AMETHYST_HAZE_THEME: ThemeData = {
  id: 'amethyst-haze',
  name: 'Amethyst Haze',
  description: 'Purple mystical theme',
  version: '1.0.0',
  author: 'Theme Editor 3.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  // Light mode colors
  lightColors: {
    background: createColorToken('background', 'oklch(0.9780 0.0070 300.00)', 0.9780, 0.0070, 300.00),
    foreground: createColorToken('foreground', 'oklch(0.2550 0.0250 260.00)', 0.2550, 0.0250, 260.00),
    card: createColorToken('card', 'oklch(1 0 0)', 1, 0, 0),
    cardForeground: createColorToken('card-foreground', 'oklch(0.2550 0.0250 260.00)', 0.2550, 0.0250, 260.00),
    popover: createColorToken('popover', 'oklch(1 0 0)', 1, 0, 0),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.2550 0.0250 260.00)', 0.2550, 0.0250, 260.00),
    primary: createColorToken('primary', 'oklch(0.6370 0.0850 280.00)', 0.6370, 0.0850, 280.00),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0.9780 0.0070 300.00)', 0.9780, 0.0070, 300.00),
    secondary: createColorToken('secondary', 'oklch(0.8970 0.0380 270.00)', 0.8970, 0.0380, 270.00),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.2550 0.0250 260.00)', 0.2550, 0.0250, 260.00),
    muted: createColorToken('muted', 'oklch(0.8840 0.0210 260.00)', 0.8840, 0.0210, 260.00),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.4210 0.0150 260.00)', 0.4210, 0.0150, 260.00),
    accent: createColorToken('accent', 'oklch(0.7610 0.0750 340.00)', 0.7610, 0.0750, 340.00),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.2980 0.0450 20.00)', 0.2980, 0.0450, 20.00),
    destructive: createColorToken('destructive', 'oklch(0.6420 0.1350 15.00)', 0.6420, 0.1350, 15.00),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(0.9780 0.0070 300.00)', 0.9780, 0.0070, 300.00),
    border: createColorToken('border', 'oklch(0.8320 0.0320 270.00)', 0.8320, 0.0320, 270.00),
    input: createColorToken('input', 'oklch(0.9240 0.0180 280.00)', 0.9240, 0.0180, 280.00),
    ring: createColorToken('ring', 'oklch(0.6370 0.0850 280.00)', 0.6370, 0.0850, 280.00),
    chart1: createColorToken('chart-1', 'oklch(0.6370 0.0850 280.00)', 0.6370, 0.0850, 280.00),
    chart2: createColorToken('chart-2', 'oklch(0.7610 0.0750 340.00)', 0.7610, 0.0750, 340.00),
    chart3: createColorToken('chart-3', 'oklch(0.6820 0.0980 165.00)', 0.6820, 0.0980, 165.00),
    chart4: createColorToken('chart-4', 'oklch(0.8370 0.0620 60.00)', 0.8370, 0.0620, 60.00),
    chart5: createColorToken('chart-5', 'oklch(0.7190 0.0750 230.00)', 0.7190, 0.0750, 230.00),
    sidebar: createColorToken('sidebar', 'oklch(0.9540 0.0150 280.00)', 0.9540, 0.0150, 280.00),
    sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.2550 0.0250 260.00)', 0.2550, 0.0250, 260.00),
    sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.6370 0.0850 280.00)', 0.6370, 0.0850, 280.00),
    sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(0.9780 0.0070 300.00)', 0.9780, 0.0070, 300.00),
    sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.7610 0.0750 340.00)', 0.7610, 0.0750, 340.00),
    sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.2980 0.0450 20.00)', 0.2980, 0.0450, 20.00),
    sidebarBorder: createColorToken('sidebar-border', 'oklch(0.8650 0.0250 280.00)', 0.8650, 0.0250, 280.00),
    sidebarRing: createColorToken('sidebar-ring', 'oklch(0.6370 0.0850 280.00)', 0.6370, 0.0850, 280.00),
    scrollbarTrack: createColorToken('scrollbar-track', 'oklch(0.9780 0.0070 300.00)', 0.9780, 0.0070, 300.00),
    scrollbarThumb: createColorToken('scrollbar-thumb', 'oklch(0.8320 0.0320 270.00)', 0.8320, 0.0320, 270.00)
  },
  
  // Dark mode colors
  darkColors: {
    background: createColorToken('background', 'oklch(0.1060 0.0130 260.00)', 0.1060, 0.0130, 260.00),
    foreground: createColorToken('foreground', 'oklch(0.8930 0.0180 280.00)', 0.8930, 0.0180, 280.00),
    card: createColorToken('card', 'oklch(0.1420 0.0180 260.00)', 0.1420, 0.0180, 260.00),
    cardForeground: createColorToken('card-foreground', 'oklch(0.8930 0.0180 280.00)', 0.8930, 0.0180, 280.00),
    popover: createColorToken('popover', 'oklch(0.1420 0.0180 260.00)', 0.1420, 0.0180, 260.00),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.8930 0.0180 280.00)', 0.8930, 0.0180, 280.00),
    primary: createColorToken('primary', 'oklch(0.7120 0.0950 280.00)', 0.7120, 0.0950, 280.00),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0.1060 0.0130 260.00)', 0.1060, 0.0130, 260.00),
    secondary: createColorToken('secondary', 'oklch(0.3490 0.0520 270.00)', 0.3490, 0.0520, 270.00),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.8930 0.0180 280.00)', 0.8930, 0.0180, 280.00),
    muted: createColorToken('muted', 'oklch(0.1450 0.0200 260.00)', 0.1450, 0.0200, 260.00),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.6290 0.0380 280.00)', 0.6290, 0.0380, 280.00),
    accent: createColorToken('accent', 'oklch(0.2190 0.0280 260.00)', 0.2190, 0.0280, 260.00),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.8350 0.0650 340.00)', 0.8350, 0.0650, 340.00),
    destructive: createColorToken('destructive', 'oklch(0.7020 0.1480 15.00)', 0.7020, 0.1480, 15.00),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(0.1060 0.0130 260.00)', 0.1060, 0.0130, 260.00),
    border: createColorToken('border', 'oklch(0.1980 0.0250 260.00)', 0.1980, 0.0250, 260.00),
    input: createColorToken('input', 'oklch(0.1730 0.0220 260.00)', 0.1730, 0.0220, 260.00),
    ring: createColorToken('ring', 'oklch(0.7120 0.0950 280.00)', 0.7120, 0.0950, 280.00),
    chart1: createColorToken('chart-1', 'oklch(0.7120 0.0950 280.00)', 0.7120, 0.0950, 280.00),
    chart2: createColorToken('chart-2', 'oklch(0.8350 0.0650 340.00)', 0.8350, 0.0650, 340.00),
    chart3: createColorToken('chart-3', 'oklch(0.6820 0.0980 165.00)', 0.6820, 0.0980, 165.00),
    chart4: createColorToken('chart-4', 'oklch(0.8370 0.0620 60.00)', 0.8370, 0.0620, 60.00),
    chart5: createColorToken('chart-5', 'oklch(0.7190 0.0750 230.00)', 0.7190, 0.0750, 230.00),
    sidebar: createColorToken('sidebar', 'oklch(0.0890 0.0110 260.00)', 0.0890, 0.0110, 260.00),
    sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.8930 0.0180 280.00)', 0.8930, 0.0180, 280.00),
    sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.7120 0.0950 280.00)', 0.7120, 0.0950, 280.00),
    sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(0.1060 0.0130 260.00)', 0.1060, 0.0130, 260.00),
    sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.2190 0.0280 260.00)', 0.2190, 0.0280, 260.00),
    sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.8350 0.0650 340.00)', 0.8350, 0.0650, 340.00),
    sidebarBorder: createColorToken('sidebar-border', 'oklch(0.1730 0.0220 260.00)', 0.1730, 0.0220, 260.00),
    sidebarRing: createColorToken('sidebar-ring', 'oklch(0.7120 0.0950 280.00)', 0.7120, 0.0950, 280.00),
    scrollbarTrack: createColorToken('scrollbar-track', 'oklch(0.1060 0.0130 260.00)', 0.1060, 0.0130, 260.00),
    scrollbarThumb: createColorToken('scrollbar-thumb', 'oklch(0.1980 0.0250 260.00)', 0.1980, 0.0250, 260.00)
  },
  
  typography: {
    fontFamilies: {
      sans: 'Geist, sans-serif',
      serif: 'Lora, Georgia, serif',
      mono: 'Fira Code, Courier New, monospace'
    },
    trackingNormal: '0em'
  },
  brand: {
    name: 'Amethyst Haze Brand',
    primaryColor: createColorToken('primary', 'oklch(0.6370 0.0850 280.00)', 0.6370, 0.0850, 280.00),  // Migrated from brand-primary
    secondaryColor: createColorToken('secondary', 'oklch(0.7610 0.0750 340.00)', 0.7610, 0.0750, 340.00)  // Migrated from brand-secondary
  },
  spacing: {
    spacing: '0.25rem'
  },
  borders: {
    radius: '0.5rem',
    radiusSm: 'calc(var(--radius) - 4px)',
    radiusMd: 'calc(var(--radius) - 2px)', 
    radiusLg: 'var(--radius)',
    radiusXl: 'calc(var(--radius) + 4px)'
  },
  shadows: {
    shadow2xs: '1px 2px 5px 1px hsl(0 0% 0% / 0.03)',
    shadowXs: '1px 2px 5px 1px hsl(0 0% 0% / 0.03)',
    shadowSm: '1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06)',
    shadow: '1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 1px 2px 0px hsl(0 0% 0% / 0.06)',
    shadowMd: '1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 2px 4px 0px hsl(0 0% 0% / 0.06)',
    shadowLg: '1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 4px 6px 0px hsl(0 0% 0% / 0.06)',
    shadowXl: '1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 8px 10px 0px hsl(0 0% 0% / 0.06)',
    shadow2xl: '1px 2px 5px 1px hsl(0 0% 0% / 0.15)'
  },
  scroll: {
    width: '8px',
    behavior: 'smooth',
    smooth: true,
    hide: false
  },
  tags: ['purple', 'elegant', 'mystical'],
  isPublic: true,
  isFavorite: false
};

export const BOLD_TECH_THEME: ThemeData = {
  id: 'bold-tech',
  name: 'Bold Tech',
  description: 'Bold blue tech theme',
  version: '1.0.0',
  author: 'Theme Editor 3.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  lightColors: {
    background: createColorToken('background', 'oklch(1 0 0)', 1, 0, 0),
    foreground: createColorToken('foreground', 'oklch(0.1960 0.0690 264.52)', 0.1960, 0.0690, 264.52),
    card: createColorToken('card', 'oklch(1 0 0)', 1, 0, 0),
    cardForeground: createColorToken('card-foreground', 'oklch(0.1960 0.0690 264.52)', 0.1960, 0.0690, 264.52),
    popover: createColorToken('popover', 'oklch(1 0 0)', 1, 0, 0),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.1960 0.0690 264.52)', 0.1960, 0.0690, 264.52),
    primary: createColorToken('primary', 'oklch(0.6330 0.1950 280.50)', 0.6330, 0.1950, 280.50),
    primaryForeground: createColorToken('primary-foreground', 'oklch(1 0 0)', 1, 0, 0),
    secondary: createColorToken('secondary', 'oklch(0.9680 0.0090 285.00)', 0.9680, 0.0090, 285.00),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.2830 0.0820 264.52)', 0.2830, 0.0820, 264.52),
    muted: createColorToken('muted', 'oklch(0.9740 0.0110 285.00)', 0.9740, 0.0110, 285.00),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.4900 0.1480 280.50)', 0.4900, 0.1480, 280.50),
    accent: createColorToken('accent', 'oklch(0.8730 0.0750 210.00)', 0.8730, 0.0750, 210.00),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.1250 0.0650 220.00)', 0.1250, 0.0650, 220.00),
    destructive: createColorToken('destructive', 'oklch(0.6279 0.2574 27.33)', 0.6279, 0.2574, 27.33),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(1 0 0)', 1, 0, 0),
    border: createColorToken('border', 'oklch(0.8920 0.0350 280.50)', 0.8920, 0.0350, 280.50),
    input: createColorToken('input', 'oklch(0.8920 0.0350 280.50)', 0.8920, 0.0350, 280.50),
    ring: createColorToken('ring', 'oklch(0.6330 0.1950 280.50)', 0.6330, 0.1950, 280.50),
    chart1: createColorToken('chart-1', 'oklch(0.6330 0.1950 280.50)', 0.6330, 0.1950, 280.50),
    chart2: createColorToken('chart-2', 'oklch(0.4900 0.1480 280.50)', 0.4900, 0.1480, 280.50),
    chart3: createColorToken('chart-3', 'oklch(0.4320 0.1750 284.60)', 0.4320, 0.1750, 284.60),
    chart4: createColorToken('chart-4', 'oklch(0.3630 0.1750 289.70)', 0.3630, 0.1750, 289.70),
    chart5: createColorToken('chart-5', 'oklch(0.3050 0.1480 294.80)', 0.3050, 0.1480, 294.80),
    sidebar: createColorToken('sidebar', 'oklch(0.9740 0.0110 285.00)', 0.9740, 0.0110, 285.00),
    sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.1960 0.0690 264.52)', 0.1960, 0.0690, 264.52),
    sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.6330 0.1950 280.50)', 0.6330, 0.1950, 280.50),
    sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(1 0 0)', 1, 0, 0),
    sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.8730 0.0750 210.00)', 0.8730, 0.0750, 210.00),
    sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.1250 0.0650 220.00)', 0.1250, 0.0650, 220.00),
    sidebarBorder: createColorToken('sidebar-border', 'oklch(0.8920 0.0350 280.50)', 0.8920, 0.0350, 280.50),
    sidebarRing: createColorToken('sidebar-ring', 'oklch(0.6330 0.1950 280.50)', 0.6330, 0.1950, 280.50),
    scrollbarTrack: createColorToken('scrollbar-track', 'oklch(1 0 0)', 1, 0, 0),
    scrollbarThumb: createColorToken('scrollbar-thumb', 'oklch(0.8920 0.0350 280.50)', 0.8920, 0.0350, 280.50)
  },
  
  darkColors: {
    background: createColorToken('background', 'oklch(0.0950 0 0)', 0.0950, 0, 0),
    foreground: createColorToken('foreground', 'oklch(0.8920 0.0350 280.50)', 0.8920, 0.0350, 280.50),
    card: createColorToken('card', 'oklch(0.1160 0.0690 264.52)', 0.1160, 0.0690, 264.52),
    cardForeground: createColorToken('card-foreground', 'oklch(0.8920 0.0350 280.50)', 0.8920, 0.0350, 280.50),
    popover: createColorToken('popover', 'oklch(0.1160 0.0690 264.52)', 0.1160, 0.0690, 264.52),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.8920 0.0350 280.50)', 0.8920, 0.0350, 280.50),
    primary: createColorToken('primary', 'oklch(0.6330 0.1950 280.50)', 0.6330, 0.1950, 280.50),
    primaryForeground: createColorToken('primary-foreground', 'oklch(1 0 0)', 1, 0, 0),
    secondary: createColorToken('secondary', 'oklch(0.1160 0.0690 264.52)', 0.1160, 0.0690, 264.52),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.8920 0.0350 280.50)', 0.8920, 0.0350, 280.50),
    muted: createColorToken('muted', 'oklch(0.1160 0.0690 264.52)', 0.1160, 0.0690, 264.52),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.7780 0.0810 280.50)', 0.7780, 0.0810, 280.50),
    accent: createColorToken('accent', 'oklch(0.2830 0.0820 264.52)', 0.2830, 0.0820, 264.52),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.8920 0.0350 280.50)', 0.8920, 0.0350, 280.50),
    destructive: createColorToken('destructive', 'oklch(0.6279 0.2574 27.33)', 0.6279, 0.2574, 27.33),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(1 0 0)', 1, 0, 0),
    border: createColorToken('border', 'oklch(0.1880 0.0830 289.70)', 0.1880, 0.0830, 289.70),
    input: createColorToken('input', 'oklch(0.1880 0.0830 289.70)', 0.1880, 0.0830, 289.70),
    ring: createColorToken('ring', 'oklch(0.6330 0.1950 280.50)', 0.6330, 0.1950, 280.50),
    chart1: createColorToken('chart-1', 'oklch(0.6870 0.1480 280.50)', 0.6870, 0.1480, 280.50),
    chart2: createColorToken('chart-2', 'oklch(0.6330 0.1950 280.50)', 0.6330, 0.1950, 280.50),
    chart3: createColorToken('chart-3', 'oklch(0.4900 0.1480 280.50)', 0.4900, 0.1480, 280.50),
    chart4: createColorToken('chart-4', 'oklch(0.4320 0.1750 284.60)', 0.4320, 0.1750, 284.60),
    chart5: createColorToken('chart-5', 'oklch(0.3630 0.1750 289.70)', 0.3630, 0.1750, 289.70),
    sidebar: createColorToken('sidebar', 'oklch(0.0950 0 0)', 0.0950, 0, 0),
    sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.8920 0.0350 280.50)', 0.8920, 0.0350, 280.50),
    sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.6330 0.1950 280.50)', 0.6330, 0.1950, 280.50),
    sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(1 0 0)', 1, 0, 0),
    sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.2830 0.0820 264.52)', 0.2830, 0.0820, 264.52),
    sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.8920 0.0350 280.50)', 0.8920, 0.0350, 280.50),
    sidebarBorder: createColorToken('sidebar-border', 'oklch(0.1880 0.0830 289.70)', 0.1880, 0.0830, 289.70),
    sidebarRing: createColorToken('sidebar-ring', 'oklch(0.6330 0.1950 280.50)', 0.6330, 0.1950, 280.50),
    scrollbarTrack: createColorToken('scrollbar-track', 'oklch(0.0950 0 0)', 0.0950, 0, 0),
    scrollbarThumb: createColorToken('scrollbar-thumb', 'oklch(0.1880 0.0830 289.70)', 0.1880, 0.0830, 289.70)
  },
  
  typography: {
    fontFamilies: {
      sans: 'Roboto, sans-serif',
      serif: 'Playfair Display, serif',
      mono: 'Fira Code, monospace'
    },
    trackingNormal: '0em'
  },
  brand: {
    name: 'Bold Tech Brand',
    primaryColor: createColorToken('primary', 'oklch(0.6330 0.1950 280.50)', 0.6330, 0.1950, 280.50),  // Migrated from brand-primary
    secondaryColor: createColorToken('secondary', 'oklch(0.8730 0.0750 210.00)', 0.8730, 0.0750, 210.00)  // Migrated from brand-secondary
  },
  spacing: { spacing: '0.25rem' },
  borders: {
    radius: '0.625rem',
    radiusSm: 'calc(var(--radius) - 4px)',
    radiusMd: 'calc(var(--radius) - 2px)', 
    radiusLg: 'var(--radius)',
    radiusXl: 'calc(var(--radius) + 4px)'
  },
  shadows: {
    shadow2xs: '2px 2px 4px 0px hsl(255 86% 66% / 0.10)',
    shadowXs: '2px 2px 4px 0px hsl(255 86% 66% / 0.10)',
    shadowSm: '2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 1px 2px -1px hsl(255 86% 66% / 0.20)',
    shadow: '2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 1px 2px -1px hsl(255 86% 66% / 0.20)',
    shadowMd: '2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 2px 4px -1px hsl(255 86% 66% / 0.20)',
    shadowLg: '2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 4px 6px -1px hsl(255 86% 66% / 0.20)',
    shadowXl: '2px 2px 4px 0px hsl(255 86% 66% / 0.20), 2px 8px 10px -1px hsl(255 86% 66% / 0.20)',
    shadow2xl: '2px 2px 4px 0px hsl(255 86% 66% / 0.50)'
  },
  scroll: { width: '8px', behavior: 'smooth', smooth: true, hide: false },
  tags: ['blue', 'tech', 'bold'],
  isPublic: true,
  isFavorite: false
};

export const BUBBLEGUM_THEME: ThemeData = {
  id: 'bubblegum',
  name: 'Bubblegum',
  description: 'A vibrant, candy-colored theme with pink and cyan accents',
  version: '1.0.0',
  author: 'Theme Editor 3.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  lightColors: {
    background: createPreciseColorToken('background', '#f6e6ee'),
    foreground: createPreciseColorToken('foreground', '#737373'),
    card: createPreciseColorToken('card', '#fdedc9'),
    cardForeground: createPreciseColorToken('card-foreground', '#737373'),
    popover: createPreciseColorToken('popover', '#ffffff'),
    popoverForeground: createPreciseColorToken('popover-foreground', '#737373'),
    primary: createPreciseColorToken('primary', '#d04f99'),
    primaryForeground: createPreciseColorToken('primary-foreground', '#ffffff'),
    secondary: createPreciseColorToken('secondary', '#8acfd1'),
    secondaryForeground: createPreciseColorToken('secondary-foreground', '#525252'),
    accent: createPreciseColorToken('accent', '#fbe2a7'),
    accentForeground: createPreciseColorToken('accent-foreground', '#525252'),
    muted: createPreciseColorToken('muted', '#b2e1eb'),
    mutedForeground: createPreciseColorToken('muted-foreground', '#898989'),
    destructive: createPreciseColorToken('destructive', '#f96f70'),
    destructiveForeground: createPreciseColorToken('destructive-foreground', '#ffffff'),
    border: createPreciseColorToken('border', '#f4cee4'),
    input: createPreciseColorToken('input', '#f4cee4'),
    ring: createPreciseColorToken('ring', '#d04f99'),
    chart1: createPreciseColorToken('chart-1', '#d04f99'),
    chart2: createPreciseColorToken('chart-2', '#8acfd1'),
    chart3: createPreciseColorToken('chart-3', '#fbe2a7'),
    chart4: createPreciseColorToken('chart-4', '#f96f70'),
    chart5: createPreciseColorToken('chart-5', '#7dd3c2'),
    sidebar: createPreciseColorToken('sidebar', '#f8f0f4'),
    sidebarForeground: createPreciseColorToken('sidebar-foreground', '#737373'),
    sidebarPrimary: createPreciseColorToken('sidebar-primary', '#d04f99'),
    sidebarPrimaryForeground: createPreciseColorToken('sidebar-primary-foreground', '#ffffff'),
    sidebarAccent: createPreciseColorToken('sidebar-accent', '#fbe2a7'),
    sidebarAccentForeground: createPreciseColorToken('sidebar-accent-foreground', '#525252'),
    sidebarBorder: createPreciseColorToken('sidebar-border', '#f4cee4'),
    sidebarRing: createPreciseColorToken('sidebar-ring', '#d04f99'),
    scrollbarTrack: createPreciseColorToken('scrollbar-track', '#f6e6ee'),
    scrollbarThumb: createPreciseColorToken('scrollbar-thumb', '#f4cee4')
  },
  
  darkColors: {
    background: createPreciseColorToken('background', '#2d1b26'),
    foreground: createPreciseColorToken('foreground', '#f0d5e5'),
    card: createPreciseColorToken('card', '#3d2832'),
    cardForeground: createPreciseColorToken('card-foreground', '#f0d5e5'),
    popover: createPreciseColorToken('popover', '#3d2832'),
    popoverForeground: createPreciseColorToken('popover-foreground', '#f0d5e5'),
    primary: createPreciseColorToken('primary', '#e85da8'),
    primaryForeground: createPreciseColorToken('primary-foreground', '#2d1b26'),
    secondary: createPreciseColorToken('secondary', '#5a9fa3'),
    secondaryForeground: createPreciseColorToken('secondary-foreground', '#f0d5e5'),
    accent: createPreciseColorToken('accent', '#4a3d2f'),
    accentForeground: createPreciseColorToken('accent-foreground', '#d4b88a'),
    muted: createPreciseColorToken('muted', '#3d2832'),
    mutedForeground: createPreciseColorToken('muted-foreground', '#c7a5bb'),
    destructive: createPreciseColorToken('destructive', '#f96f70'),
    destructiveForeground: createPreciseColorToken('destructive-foreground', '#2d1b26'),
    border: createPreciseColorToken('border', '#4d3140'),
    input: createPreciseColorToken('input', '#4d3140'),
    ring: createPreciseColorToken('ring', '#e85da8'),
    chart1: createPreciseColorToken('chart-1', '#e85da8'),
    chart2: createPreciseColorToken('chart-2', '#5a9fa3'),
    chart3: createPreciseColorToken('chart-3', '#d4b88a'),
    chart4: createPreciseColorToken('chart-4', '#f96f70'),
    chart5: createPreciseColorToken('chart-5', '#4dbfa8'),
    sidebar: createPreciseColorToken('sidebar', '#251520'),
    sidebarForeground: createPreciseColorToken('sidebar-foreground', '#f0d5e5'),
    sidebarPrimary: createPreciseColorToken('sidebar-primary', '#e85da8'),
    sidebarPrimaryForeground: createPreciseColorToken('sidebar-primary-foreground', '#2d1b26'),
    sidebarAccent: createPreciseColorToken('sidebar-accent', '#4a3d2f'),
    sidebarAccentForeground: createPreciseColorToken('sidebar-accent-foreground', '#d4b88a'),
    sidebarBorder: createPreciseColorToken('sidebar-border', '#4d3140'),
    sidebarRing: createPreciseColorToken('sidebar-ring', '#e85da8'),
    scrollbarTrack: createPreciseColorToken('scrollbar-track', '#2d1b26'),
    scrollbarThumb: createPreciseColorToken('scrollbar-thumb', '#4d3140')
  },
  
  typography: {
    fontFamilies: {
      sans: 'Inter, sans-serif',
      serif: 'Georgia, serif',
      mono: 'Fira Code, monospace'
    },
    trackingNormal: '0em'
  },
  brand: {
    name: 'Bubblegum Brand',
    primaryColor: createPreciseColorToken('primary', '#d04f99'),  // Migrated from brand-primary
    secondaryColor: createPreciseColorToken('secondary', '#8acfd1')  // Migrated from brand-secondary
  },
  spacing: { spacing: '0.25rem' },
  borders: {
    radius: '0.5rem',
    radiusSm: 'calc(var(--radius) - 4px)',
    radiusMd: 'calc(var(--radius) - 2px)', 
    radiusLg: 'var(--radius)',
    radiusXl: 'calc(var(--radius) + 4px)'
  },
  shadows: {
    shadow2xs: '0 1px 3px 0px hsl(340 50% 70% / 0.05)',
    shadowXs: '0 1px 3px 0px hsl(340 50% 70% / 0.05)',
    shadowSm: '0 1px 3px 0px hsl(340 50% 70% / 0.10), 0 1px 2px -1px hsl(340 50% 70% / 0.10)',
    shadow: '0 1px 3px 0px hsl(340 50% 70% / 0.10), 0 1px 2px -1px hsl(340 50% 70% / 0.10)',
    shadowMd: '0 1px 3px 0px hsl(340 50% 70% / 0.10), 0 2px 4px -1px hsl(340 50% 70% / 0.10)',
    shadowLg: '0 1px 3px 0px hsl(340 50% 70% / 0.10), 0 4px 6px -1px hsl(340 50% 70% / 0.10)',
    shadowXl: '0 1px 3px 0px hsl(340 50% 70% / 0.10), 0 8px 10px -1px hsl(340 50% 70% / 0.10)',
    shadow2xl: '0 1px 3px 0px hsl(340 50% 70% / 0.25)'
  },
  scroll: { width: '8px', behavior: 'smooth', smooth: true, hide: false },
  tags: ['pink', 'playful', 'fun', 'vibrant', 'candy'],
  isPublic: true,
  isFavorite: false
};

export const CAFFEINE_THEME: ThemeData = {
  id: 'caffeine',
  name: 'Caffeine',
  description: 'Energetic cyan theme',
  version: '1.0.0',
  author: 'Theme Editor 3.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lightColors: {
    background: createColorToken('background', 'oklch(0.9850 0.0020 120.00)', 0.9850, 0.0020, 120.00),
    foreground: createColorToken('foreground', 'oklch(0.1255 0 0)', 0.1255, 0, 0),
    card: createColorToken('card', 'oklch(0.9930 0.0010 120.00)', 0.9930, 0.0010, 120.00),
    cardForeground: createColorToken('card-foreground', 'oklch(0.1255 0 0)', 0.1255, 0, 0),
    popover: createColorToken('popover', 'oklch(0.9930 0.0010 120.00)', 0.9930, 0.0010, 120.00),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.1255 0 0)', 0.1255, 0, 0),
    primary: createColorToken('primary', 'oklch(0.2980 0.0430 40.00)', 0.2980, 0.0430, 40.00),
    primaryForeground: createColorToken('primary-foreground', 'oklch(1 0 0)', 1, 0, 0),
    secondary: createColorToken('secondary', 'oklch(0.9130 0.0890 50.00)', 0.9130, 0.0890, 50.00),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.1950 0.0650 30.00)', 0.1950, 0.0650, 30.00),
    muted: createColorToken('muted', 'oklch(0.9370 0 0)', 0.9370, 0, 0),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.3920 0 0)', 0.3920, 0, 0),
    accent: createColorToken('accent', 'oklch(0.9100 0 0)', 0.9100, 0, 0),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.1255 0 0)', 0.1255, 0, 0),
    destructive: createColorToken('destructive', 'oklch(0.5590 0.2070 25.33)', 0.5590, 0.2070, 25.33),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(1 0 0)', 1, 0, 0),
    border: createColorToken('border', 'oklch(0.8470 0 0)', 0.8470, 0, 0),
    input: createColorToken('input', 'oklch(0.8470 0 0)', 0.8470, 0, 0),
    ring: createColorToken('ring', 'oklch(0.2980 0.0430 40.00)', 0.2980, 0.0430, 40.00),
    chart1: createColorToken('chart-1', 'oklch(0.2980 0.0430 40.00)', 0.2980, 0.0430, 40.00),
    chart2: createColorToken('chart-2', 'oklch(0.9130 0.0890 50.00)', 0.9130, 0.0890, 50.00),
    chart3: createColorToken('chart-3', 'oklch(0.9100 0 0)', 0.9100, 0, 0),
    chart4: createColorToken('chart-4', 'oklch(0.9200 0.0490 60.00)', 0.9200, 0.0490, 60.00),
    chart5: createColorToken('chart-5', 'oklch(0.3130 0.0450 35.00)', 0.3130, 0.0450, 35.00),
    sidebar: createColorToken('sidebar', 'oklch(0.9820 0.0015 120.00)', 0.9820, 0.0015, 120.00),
    sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.1450 0 0)', 0.1450, 0, 0),
    sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.2040 0 0)', 0.2040, 0, 0),
    sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(0.9820 0.0015 120.00)', 0.9820, 0.0015, 120.00),
    sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.9680 0 0)', 0.9680, 0, 0),
    sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.2040 0 0)', 0.2040, 0, 0),
    sidebarBorder: createColorToken('sidebar-border', 'oklch(0.9220 0 0)', 0.9220, 0, 0),
    sidebarRing: createColorToken('sidebar-ring', 'oklch(0.7080 0 0)', 0.7080, 0, 0),
    scrollbarTrack: createColorToken('scrollbar-track', 'oklch(0.9850 0.0020 120.00)', 0.9850, 0.0020, 120.00),
    scrollbarThumb: createColorToken('scrollbar-thumb', 'oklch(0.8470 0 0)', 0.8470, 0, 0)
  },
  darkColors: {
    background: createColorToken('background', 'oklch(0.0670 0 0)', 0.0670, 0, 0),
    foreground: createColorToken('foreground', 'oklch(0.9340 0 0)', 0.9340, 0, 0),
    card: createColorToken('card', 'oklch(0.0980 0 0)', 0.0980, 0, 0),
    cardForeground: createColorToken('card-foreground', 'oklch(0.9340 0 0)', 0.9340, 0, 0),
    popover: createColorToken('popover', 'oklch(0.0980 0 0)', 0.0980, 0, 0),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.9340 0 0)', 0.9340, 0, 0),
    primary: createColorToken('primary', 'oklch(0.8960 0.0890 50.00)', 0.8960, 0.0890, 50.00),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0.0530 0.0110 191.81)', 0.0530, 0.0110, 191.81),
    secondary: createColorToken('secondary', 'oklch(0.2200 0.0430 40.00)', 0.2200, 0.0430, 40.00),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.8960 0.0890 50.00)', 0.8960, 0.0890, 50.00),
    muted: createColorToken('muted', 'oklch(0.1330 0 0)', 0.1330, 0, 0),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.7060 0 0)', 0.7060, 0, 0),
    accent: createColorToken('accent', 'oklch(0.1670 0 0)', 0.1670, 0, 0),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.9340 0 0)', 0.9340, 0, 0),
    destructive: createColorToken('destructive', 'oklch(0.5590 0.2070 25.33)', 0.5590, 0.2070, 25.33),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(1 0 0)', 1, 0, 0),
    border: createColorToken('border', 'oklch(0.1270 0.0180 10.00)', 0.1270, 0.0180, 10.00),
    input: createColorToken('input', 'oklch(0.2840 0 0)', 0.2840, 0, 0),
    ring: createColorToken('ring', 'oklch(0.8960 0.0890 50.00)', 0.8960, 0.0890, 50.00),
    chart1: createColorToken('chart-1', 'oklch(0.8960 0.0890 50.00)', 0.8960, 0.0890, 50.00),
    chart2: createColorToken('chart-2', 'oklch(0.2200 0.0430 40.00)', 0.2200, 0.0430, 40.00),
    chart3: createColorToken('chart-3', 'oklch(0.1670 0 0)', 0.1670, 0, 0),
    chart4: createColorToken('chart-4', 'oklch(0.2620 0.0490 35.00)', 0.2620, 0.0490, 35.00),
    chart5: createColorToken('chart-5', 'oklch(0.8820 0.0890 52.00)', 0.8820, 0.0890, 52.00),
    sidebar: createColorToken('sidebar', 'oklch(0.0940 0 0)', 0.0940, 0, 0),
    sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.9570 0 0)', 0.9570, 0, 0),
    sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.1250 0.0650 220.00)', 0.1250, 0.0650, 220.00),
    sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(1 0 0)', 1, 0, 0),
    sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.1540 0 0)', 0.1540, 0, 0),
    sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.9570 0 0)', 0.9570, 0, 0),
    sidebarBorder: createColorToken('sidebar-border', 'oklch(0.1540 0 0)', 0.1540, 0, 0),
    sidebarRing: createColorToken('sidebar-ring', 'oklch(0.8300 0 0)', 0.8300, 0, 0),
    scrollbarTrack: createColorToken('scrollbar-track', 'oklch(0.0670 0 0)', 0.0670, 0, 0),
    scrollbarThumb: createColorToken('scrollbar-thumb', 'oklch(0.1270 0.0180 10.00)', 0.1270, 0.0180, 10.00)
  },
  typography: { fontFamilies: { sans: 'ui-sans-serif, system-ui, sans-serif', serif: 'ui-serif, Georgia, serif', mono: 'ui-monospace, SFMono-Regular, monospace' }, trackingNormal: '0em' },
  brand: { name: 'Caffeine Brand', primaryColor: createColorToken('primary', 'oklch(0.2980 0.0430 40.00)', 0.2980, 0.0430, 40.00), secondaryColor: createColorToken('secondary', 'oklch(0.9130 0.0890 50.00)', 0.9130, 0.0890, 50.00) },  // Migrated from brand-*
  spacing: { spacing: '0.25rem' },
  borders: { radius: '0.5rem', radiusSm: 'calc(var(--radius) - 4px)', radiusMd: 'calc(var(--radius) - 2px)', radiusLg: 'var(--radius)', radiusXl: 'calc(var(--radius) + 4px)' },
  shadows: { shadow2xs: '0 1px 3px 0px hsl(0 0% 0% / 0.05)', shadowXs: '0 1px 3px 0px hsl(0 0% 0% / 0.05)', shadowSm: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)', shadow: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)', shadowMd: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)', shadowLg: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)', shadowXl: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)', shadow2xl: '0 1px 3px 0px hsl(0 0% 0% / 0.25)' },
  scroll: { width: '8px', behavior: 'smooth', smooth: true, hide: false },
  tags: ['cyan', 'energetic', 'productivity'],
  isPublic: true,
  isFavorite: false
};

export const CANDYLAND_THEME: ThemeData = {
  id: 'candyland',
  name: 'Candyland',
  description: 'Sweet orange theme',
  version: '1.0.0',
  author: 'Theme Editor 3.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lightColors: {
    background: createColorToken('background', 'oklch(0.9830 0.0050 120.00)', 0.9830, 0.0050, 120.00),
    foreground: createColorToken('foreground', 'oklch(0.2000 0 0)', 0.2000, 0, 0),
    card: createColorToken('card', 'oklch(1 0 0)', 1, 0, 0),
    cardForeground: createColorToken('card-foreground', 'oklch(0.2000 0 0)', 0.2000, 0, 0),
    popover: createColorToken('popover', 'oklch(1 0 0)', 1, 0, 0),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.2000 0 0)', 0.2000, 0, 0),
    primary: createColorToken('primary', 'oklch(0.8200 0.1110 350.00)', 0.8200, 0.1110, 350.00),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0 0 0)', 0, 0, 0),
    secondary: createColorToken('secondary', 'oklch(0.7780 0.1050 205.00)', 0.7780, 0.1050, 205.00),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0 0 0)', 0, 0, 0),
    muted: createColorToken('muted', 'oklch(0.8670 0.0390 75.00)', 0.8670, 0.0390, 75.00),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.4310 0 0)', 0.4310, 0, 0),
    accent: createColorToken('accent', 'oklch(1 0.1800 90.00)', 1, 0.1800, 90.00),
    accentForeground: createColorToken('accent-foreground', 'oklch(0 0 0)', 0, 0, 0),
    destructive: createColorToken('destructive', 'oklch(0.6279 0.2574 27.33)', 0.6279, 0.2574, 27.33),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(1 0 0)', 1, 0, 0),
    border: createColorToken('border', 'oklch(0.8310 0 0)', 0.8310, 0, 0),
    input: createColorToken('input', 'oklch(0.8310 0 0)', 0.8310, 0, 0),
    ring: createColorToken('ring', 'oklch(0.8200 0.1110 350.00)', 0.8200, 0.1110, 350.00),
    chart1: createColorToken('chart-1', 'oklch(0.8200 0.1110 350.00)', 0.8200, 0.1110, 350.00),
    chart2: createColorToken('chart-2', 'oklch(0.7780 0.1050 205.00)', 0.7780, 0.1050, 205.00),
    chart3: createColorToken('chart-3', 'oklch(1 0.1800 90.00)', 1, 0.1800, 90.00),
    chart4: createColorToken('chart-4', 'oklch(0.8760 0.1080 325.00)', 0.8760, 0.1080, 325.00),
    chart5: createColorToken('chart-5', 'oklch(0.5980 0.1980 145.00)', 0.5980, 0.1980, 145.00),
    sidebar: createColorToken('sidebar', 'oklch(0.9830 0.0050 120.00)', 0.9830, 0.0050, 120.00),
    sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.2000 0 0)', 0.2000, 0, 0),
    sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.8200 0.1110 350.00)', 0.8200, 0.1110, 350.00),
    sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(0 0 0)', 0, 0, 0),
    sidebarAccent: createColorToken('sidebar-accent', 'oklch(1 0.1800 90.00)', 1, 0.1800, 90.00),
    sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0 0 0)', 0, 0, 0),
    sidebarBorder: createColorToken('sidebar-border', 'oklch(0.8310 0 0)', 0.8310, 0, 0),
    sidebarRing: createColorToken('sidebar-ring', 'oklch(0.8200 0.1110 350.00)', 0.8200, 0.1110, 350.00),
    scrollbarTrack: createColorToken('scrollbar-track', 'oklch(0.9830 0.0050 120.00)', 0.9830, 0.0050, 120.00),
    scrollbarThumb: createColorToken('scrollbar-thumb', 'oklch(0.8310 0 0)', 0.8310, 0, 0)
  },
  darkColors: {
    background: createColorToken('background', 'oklch(0.1040 0.0150 230.00)', 0.1040, 0.0150, 230.00),
    foreground: createColorToken('foreground', 'oklch(0.8970 0 0)', 0.8970, 0, 0),
    card: createColorToken('card', 'oklch(0.1860 0.0190 220.00)', 0.1860, 0.0190, 220.00),
    cardForeground: createColorToken('card-foreground', 'oklch(0.8970 0 0)', 0.8970, 0, 0),
    popover: createColorToken('popover', 'oklch(0.1860 0.0190 220.00)', 0.1860, 0.0190, 220.00),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.8970 0 0)', 0.8970, 0, 0),
    primary: createColorToken('primary', 'oklch(0.8760 0.1080 325.00)', 0.8760, 0.1080, 325.00),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0 0 0)', 0, 0, 0),
    secondary: createColorToken('secondary', 'oklch(0.5980 0.1980 145.00)', 0.5980, 0.1980, 145.00),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0 0 0)', 0, 0, 0),
    muted: createColorToken('muted', 'oklch(0.2750 0 0)', 0.2750, 0, 0),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.6391 0 0)', 0.6391, 0, 0),
    accent: createColorToken('accent', 'oklch(0.7780 0.1050 205.00)', 0.7780, 0.1050, 205.00),
    accentForeground: createColorToken('accent-foreground', 'oklch(0 0 0)', 0, 0, 0),
    destructive: createColorToken('destructive', 'oklch(0.6279 0.2574 27.33)', 0.6279, 0.2574, 27.33),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(1 0 0)', 1, 0, 0),
    border: createColorToken('border', 'oklch(0.2750 0 0)', 0.2750, 0, 0),
    input: createColorToken('input', 'oklch(0.2750 0 0)', 0.2750, 0, 0),
    ring: createColorToken('ring', 'oklch(0.8760 0.1080 325.00)', 0.8760, 0.1080, 325.00),
    chart1: createColorToken('chart-1', 'oklch(0.8760 0.1080 325.00)', 0.8760, 0.1080, 325.00),
    chart2: createColorToken('chart-2', 'oklch(0.5980 0.1980 145.00)', 0.5980, 0.1980, 145.00),
    chart3: createColorToken('chart-3', 'oklch(0.7780 0.1050 205.00)', 0.7780, 0.1050, 205.00),
    chart4: createColorToken('chart-4', 'oklch(1 0.1800 90.00)', 1, 0.1800, 90.00),
    chart5: createColorToken('chart-5', 'oklch(0.9200 0.1350 65.00)', 0.9200, 0.1350, 65.00),
    sidebar: createColorToken('sidebar', 'oklch(0.1040 0.0150 230.00)', 0.1040, 0.0150, 230.00),
    sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.8970 0 0)', 0.8970, 0, 0),
    sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.8760 0.1080 325.00)', 0.8760, 0.1080, 325.00),
    sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(0 0 0)', 0, 0, 0),
    sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.7780 0.1050 205.00)', 0.7780, 0.1050, 205.00),
    sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0 0 0)', 0, 0, 0),
    sidebarBorder: createColorToken('sidebar-border', 'oklch(0.2750 0 0)', 0.2750, 0, 0),
    sidebarRing: createColorToken('sidebar-ring', 'oklch(0.8760 0.1080 325.00)', 0.8760, 0.1080, 325.00),
    scrollbarTrack: createColorToken('scrollbar-track', 'oklch(0.1040 0.0150 230.00)', 0.1040, 0.0150, 230.00),
    scrollbarThumb: createColorToken('scrollbar-thumb', 'oklch(0.2750 0 0)', 0.2750, 0, 0)
  },
  typography: { fontFamilies: { sans: 'Poppins, sans-serif', serif: 'ui-serif, Georgia, serif', mono: 'Roboto Mono, monospace' }, trackingNormal: '0em' },
  brand: { name: 'Candyland Brand', primaryColor: createColorToken('primary', 'oklch(0.8200 0.1110 350.00)', 0.8200, 0.1110, 350.00), secondaryColor: createColorToken('secondary', 'oklch(0.7780 0.1050 205.00)', 0.7780, 0.1050, 205.00) },  // Migrated from brand-*
  spacing: { spacing: '0.25rem' },
  borders: { radius: '0.5rem', radiusSm: 'calc(var(--radius) - 4px)', radiusMd: 'calc(var(--radius) - 2px)', radiusLg: 'var(--radius)', radiusXl: 'calc(var(--radius) + 4px)' },
  shadows: { shadow2xs: '0 1px 3px 0px hsl(0 0% 0% / 0.05)', shadowXs: '0 1px 3px 0px hsl(0 0% 0% / 0.05)', shadowSm: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)', shadow: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)', shadowMd: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)', shadowLg: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)', shadowXl: '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)', shadow2xl: '0 1px 3px 0px hsl(0 0% 0% / 0.25)' },
  scroll: { width: '8px', behavior: 'smooth', smooth: true, hide: false },
  tags: ['orange', 'sweet', 'candy'],
  isPublic: true,
  isFavorite: false
};

// Export all themes
export const DEFAULT_THEMES: ThemeData[] = [
  DEFAULT_THEME,
  AMBER_MINIMAL_THEME,
  AMETHYST_HAZE_THEME,
  BOLD_TECH_THEME,
  BUBBLEGUM_THEME,
  CAFFEINE_THEME,
  CANDYLAND_THEME
];

// Theme lookup
export const THEMES_BY_ID = DEFAULT_THEMES.reduce((acc, theme) => {
  acc[theme.id] = theme;
  return acc;
}, {} as Record<string, ThemeData>);