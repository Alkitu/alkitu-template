// Theme Editor 3.0 - Bubblegum Theme
import { ThemeData, ColorToken } from '../types/theme.types';

// Helper function to create color tokens
function createColorToken(name: string, value: string, l: number, c: number, h: number, description?: string): ColorToken {
  return {
    name,
    value,
    oklch: { l, c, h },
    description
  };
}

/**
 * Bubblegum Theme - A vibrant, candy-colored theme with pink and cyan accents
 * All colors have been converted from HEX to OKLCH for better color consistency
 */
export const BUBBLEGUM_THEME: ThemeData = {
  // Light Mode Colors
  lightColors: {
    // Primary Colors
    primary: createColorToken('primary', 'oklch(0.6180 0.1830 340.2470)', 0.6180, 0.1830, 340.2470, 'Primary brand color #d04f99'),
    primaryForeground: createColorToken('primary-foreground', 'oklch(1 0 0)', 1, 0, 0, 'Text on primary background'),

    // Secondary Colors
    secondary: createColorToken('secondary', 'oklch(0.7950 0.0820 187.4630)', 0.7950, 0.0820, 187.4630, 'Secondary brand color #8acfd1'),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.2690 0 0)', 0.2690, 0, 0, 'Text on secondary background'),

    // Accent Colors
    accent: createColorToken('accent', 'oklch(0.9020 0.0640 78.7340)', 0.9020, 0.0640, 78.7340, 'Accent color #fbe2a7'),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.2690 0 0)', 0.2690, 0, 0, 'Text on accent background'),

    // Base Colors
    background: createColorToken('background', 'oklch(0.9420 0.0280 342.8570)', 0.9420, 0.0280, 342.8570, 'Main page background #f6e6ee'),
    foreground: createColorToken('foreground', 'oklch(0.4520 0 0)', 0.4520, 0, 0, 'Primary text color'),

    // Card Colors
    card: createColorToken('card', 'oklch(0.9380 0.0450 75.2810)', 0.9380, 0.0450, 75.2810, 'Card container background #fdedc9'),
    cardForeground: createColorToken('card-foreground', 'oklch(0.4520 0 0)', 0.4520, 0, 0, 'Text on card surfaces'),

    // Popover Colors
    popover: createColorToken('popover', 'oklch(1 0 0)', 1, 0, 0, 'Popover background'),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.4520 0 0)', 0.4520, 0, 0, 'Text in popovers'),

    // Muted Colors
    muted: createColorToken('muted', 'oklch(0.8790 0.0580 189.2340)', 0.8790, 0.0580, 189.2340, 'Muted background color #b2e1eb'),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.5560 0 0)', 0.5560, 0, 0, 'Subdued text color'),

    // Destructive Colors
    destructive: createColorToken('destructive', 'oklch(0.7020 0.1620 12.3950)', 0.7020, 0.1620, 12.3950, 'Error color #f96f70'),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(1 0 0)', 1, 0, 0, 'Text on destructive background'),

    // Border & Input Colors
    border: createColorToken('border', 'oklch(0.6180 0.1830 340.2470)', 0.6180, 0.1830, 340.2470, 'Default border color'),
    input: createColorToken('input', 'oklch(0.9220 0 0)', 0.9220, 0, 0, 'Input field background'),
    ring: createColorToken('ring', 'oklch(0.7080 0.1440 336.7820)', 0.7080, 0.1440, 336.7820, 'Focus ring color'),

    // Chart Colors
    chart1: createColorToken('chart-1', 'oklch(0.7080 0.1440 336.7820)', 0.7080, 0.1440, 336.7820, 'First chart color'),
    chart2: createColorToken('chart-2', 'oklch(0.8150 0.0720 189.8760)', 0.8150, 0.0720, 189.8760, 'Second chart color'),
    chart3: createColorToken('chart-3', 'oklch(0.9020 0.0640 78.7340)', 0.9020, 0.0640, 78.7340, 'Third chart color'),
    chart4: createColorToken('chart-4', 'oklch(0.7850 0.1180 335.2140)', 0.7850, 0.1180, 335.2140, 'Fourth chart color'),
    chart5: createColorToken('chart-5', 'oklch(0.5980 0.1650 339.4560)', 0.5980, 0.1650, 339.4560, 'Fifth chart color'),

    // Sidebar Colors
    sidebar: createColorToken('sidebar', 'oklch(0.9180 0.0380 342.1750)', 0.9180, 0.0380, 342.1750, 'Sidebar background #f8d8ea'),
    sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.2690 0 0)', 0.2690, 0, 0, 'Sidebar text color'),
    sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.6450 0.1980 339.7850)', 0.6450, 0.1980, 339.7850, 'Sidebar primary elements #ec4899'),
    sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(1 0 0)', 1, 0, 0, 'Text on sidebar primary'),
    sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.8420 0.1020 337.6540)', 0.8420, 0.1020, 337.6540, 'Sidebar accent color #f9a8d4'),
    sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.2690 0 0)', 0.2690, 0, 0, 'Text on sidebar accent'),
    sidebarBorder: createColorToken('sidebar-border', 'oklch(0.9650 0.0280 288.7450)', 0.9650, 0.0280, 288.7450, 'Sidebar border color #f3e8ff'),
    sidebarRing: createColorToken('sidebar-ring', 'oklch(0.6450 0.1980 339.7850)', 0.6450, 0.1980, 339.7850, 'Sidebar focus ring'),

    // Scrollbar Colors
    scrollbarTrack: createColorToken('scrollbar-track', 'oklch(0.9420 0.0280 342.8570)', 0.9420, 0.0280, 342.8570, 'Scrollbar track - light bubblegum'),
    scrollbarThumb: createColorToken('scrollbar-thumb', 'oklch(0.7080 0.1440 336.7820)', 0.7080, 0.1440, 336.7820, 'Scrollbar thumb - pink accent')
  },

  // Dark Mode Colors (adapted with darker backgrounds and adjusted contrast)
  darkColors: {
    // Primary Colors
    primary: createColorToken('primary', 'oklch(0.7180 0.1830 340.2470)', 0.7180, 0.1830, 340.2470, 'Primary brand color - dark mode'),
    primaryForeground: createColorToken('primary-foreground', 'oklch(0.1450 0 0)', 0.1450, 0, 0, 'Text on primary background - dark mode'),

    // Secondary Colors
    secondary: createColorToken('secondary', 'oklch(0.4950 0.0820 187.4630)', 0.4950, 0.0820, 187.4630, 'Secondary brand color - dark mode'),
    secondaryForeground: createColorToken('secondary-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0, 'Text on secondary background - dark mode'),

    // Accent Colors
    accent: createColorToken('accent', 'oklch(0.6020 0.0640 78.7340)', 0.6020, 0.0640, 78.7340, 'Accent color - dark mode'),
    accentForeground: createColorToken('accent-foreground', 'oklch(0.1450 0 0)', 0.1450, 0, 0, 'Text on accent background - dark mode'),

    // Base Colors
    background: createColorToken('background', 'oklch(0.1650 0.0180 342.8570)', 0.1650, 0.0180, 342.8570, 'Main page background - dark mode'),
    foreground: createColorToken('foreground', 'oklch(0.9220 0 0)', 0.9220, 0, 0, 'Primary text color - dark mode'),

    // Card Colors
    card: createColorToken('card', 'oklch(0.2380 0.0250 342.8570)', 0.2380, 0.0250, 342.8570, 'Card container background - dark mode'),
    cardForeground: createColorToken('card-foreground', 'oklch(0.9220 0 0)', 0.9220, 0, 0, 'Text on card surfaces - dark mode'),

    // Popover Colors
    popover: createColorToken('popover', 'oklch(0.2050 0.0150 342.8570)', 0.2050, 0.0150, 342.8570, 'Popover background - dark mode'),
    popoverForeground: createColorToken('popover-foreground', 'oklch(0.9220 0 0)', 0.9220, 0, 0, 'Text in popovers - dark mode'),

    // Muted Colors
    muted: createColorToken('muted', 'oklch(0.3790 0.0380 187.4630)', 0.3790, 0.0380, 187.4630, 'Muted background color - dark mode'),
    mutedForeground: createColorToken('muted-foreground', 'oklch(0.7080 0 0)', 0.7080, 0, 0, 'Subdued text color - dark mode'),

    // Destructive Colors
    destructive: createColorToken('destructive', 'oklch(0.7520 0.1620 12.3950)', 0.7520, 0.1620, 12.3950, 'Error color - dark mode'),
    destructiveForeground: createColorToken('destructive-foreground', 'oklch(0.9850 0 0)', 0.9850, 0, 0, 'Text on destructive background - dark mode'),

    // Border & Input Colors
    border: createColorToken('border', 'oklch(0.3750 0.0830 340.2470)', 0.3750, 0.0830, 340.2470, 'Default border color - dark mode'),
    input: createColorToken('input', 'oklch(0.3250 0.0180 342.8570)', 0.3250, 0.0180, 342.8570, 'Input field background - dark mode'),
    ring: createColorToken('ring', 'oklch(0.7180 0.1440 336.7820)', 0.7180, 0.1440, 336.7820, 'Focus ring color - dark mode'),

    // Chart Colors (maintained similar hues but adjusted for dark mode)
    chart1: createColorToken('chart-1', 'oklch(0.7180 0.1440 336.7820)', 0.7180, 0.1440, 336.7820, 'First chart color - dark mode'),
    chart2: createColorToken('chart-2', 'oklch(0.6150 0.0720 189.8760)', 0.6150, 0.0720, 189.8760, 'Second chart color - dark mode'),
    chart3: createColorToken('chart-3', 'oklch(0.7020 0.0640 78.7340)', 0.7020, 0.0640, 78.7340, 'Third chart color - dark mode'),
    chart4: createColorToken('chart-4', 'oklch(0.6850 0.1180 335.2140)', 0.6850, 0.1180, 335.2140, 'Fourth chart color - dark mode'),
    chart5: createColorToken('chart-5', 'oklch(0.5480 0.1650 339.4560)', 0.5480, 0.1650, 339.4560, 'Fifth chart color - dark mode'),

    // Sidebar Colors
    sidebar: createColorToken('sidebar', 'oklch(0.2180 0.0280 342.1750)', 0.2180, 0.0280, 342.1750, 'Sidebar background - dark mode'),
    sidebarForeground: createColorToken('sidebar-foreground', 'oklch(0.9220 0 0)', 0.9220, 0, 0, 'Sidebar text color - dark mode'),
    sidebarPrimary: createColorToken('sidebar-primary', 'oklch(0.6950 0.1980 339.7850)', 0.6950, 0.1980, 339.7850, 'Sidebar primary elements - dark mode'),
    sidebarPrimaryForeground: createColorToken('sidebar-primary-foreground', 'oklch(0.1450 0 0)', 0.1450, 0, 0, 'Text on sidebar primary - dark mode'),
    sidebarAccent: createColorToken('sidebar-accent', 'oklch(0.4420 0.0720 337.6540)', 0.4420, 0.0720, 337.6540, 'Sidebar accent color - dark mode'),
    sidebarAccentForeground: createColorToken('sidebar-accent-foreground', 'oklch(0.9220 0 0)', 0.9220, 0, 0, 'Text on sidebar accent - dark mode'),
    sidebarBorder: createColorToken('sidebar-border', 'oklch(0.3650 0.0180 288.7450)', 0.3650, 0.0180, 288.7450, 'Sidebar border color - dark mode'),
    sidebarRing: createColorToken('sidebar-ring', 'oklch(0.6950 0.1980 339.7850)', 0.6950, 0.1980, 339.7850, 'Sidebar focus ring - dark mode'),

    // Scrollbar Colors
    scrollbarTrack: createColorToken('scrollbar-track', 'oklch(0.1650 0.0180 342.8570)', 0.1650, 0.0180, 342.8570, 'Scrollbar track - dark bubblegum'),
    scrollbarThumb: createColorToken('scrollbar-thumb', 'oklch(0.4750 0.0830 340.2470)', 0.4750, 0.0830, 340.2470, 'Scrollbar thumb - dark pink')
  },

  // Typography
  typography: {
    fontFamilies: {
      sans: 'var(--font-sans)',
      serif: 'var(--font-serif)',
      mono: 'var(--font-mono)'
    },
    trackingNormal: 'var(--tracking-normal)'
  },

  // Brand
  brand: {
    name: 'Bubblegum Theme',
    primaryColor: createColorToken('primary', 'oklch(0.6180 0.1830 340.2470)', 0.6180, 0.1830, 340.2470, 'Primary brand color'),  // Migrated from brand-primary
    secondaryColor: createColorToken('secondary', 'oklch(0.7950 0.0820 187.4630)', 0.7950, 0.0820, 187.4630, 'Secondary brand color')  // Migrated from brand-secondary
  },

  // Borders
  borders: {
    radius: '0.4rem',
    radiusSm: 'calc(var(--radius) - 4px)',
    radiusMd: 'calc(var(--radius) - 2px)', 
    radiusLg: 'var(--radius)',
    radiusXl: 'calc(var(--radius) + 4px)'
  },

  // Spacing
  spacing: {
    spacing: '0.25rem'
  },

  // Shadows
  shadows: {
    shadow2xs: '0 1px 3px 0px hsl(var(--foreground) / 0.05)',
    shadowXs: '0 1px 3px 0px hsl(var(--foreground) / 0.05)',
    shadowSm: '0 1px 3px 0px hsl(var(--foreground) / 0.10), 0 1px 2px -1px hsl(var(--foreground) / 0.10)',
    shadow: '0 1px 3px 0px hsl(var(--foreground) / 0.10), 0 1px 2px -1px hsl(var(--foreground) / 0.10)',
    shadowMd: '0 1px 3px 0px hsl(var(--foreground) / 0.10), 0 2px 4px -1px hsl(var(--foreground) / 0.10)',
    shadowLg: '0 1px 3px 0px hsl(var(--foreground) / 0.10), 0 4px 6px -1px hsl(var(--foreground) / 0.10)',
    shadowXl: '0 1px 3px 0px hsl(var(--foreground) / 0.10), 0 8px 10px -1px hsl(var(--foreground) / 0.10)',
    shadow2xl: '0 1px 3px 0px hsl(var(--foreground) / 0.25)'
  },

  // Scroll
  scroll: {
    width: '8px',
    behavior: 'smooth',
    smooth: true,
    hide: false
  },

  // Theme metadata
  id: 'bubblegum-complete',
  name: 'Bubblegum',
  description: 'A vibrant, candy-colored theme with pink and cyan accents',
  version: '1.0.0',
  author: 'Theme Editor 3.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  tags: ['pink', 'playful', 'fun', 'vibrant', 'candy'],
  isPublic: true,
  isFavorite: false
};