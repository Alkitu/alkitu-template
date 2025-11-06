// Theme Editor 3.0 - Color Sections Organization
export interface ColorSection {
  id: string;
  title: string;
  description?: string;
  colorKeys: (keyof import('./theme.types').ThemeColors)[];
  defaultExpanded?: boolean;
}

export const COLOR_SECTIONS: ColorSection[] = [
  {
    id: 'primary',
    title: 'Primary Colors',
    description: 'Main brand colors used for primary actions and emphasis',
    colorKeys: ['primary', 'primaryForeground'],
    defaultExpanded: true
  },
  {
    id: 'secondary',
    title: 'Secondary Colors', 
    description: 'Secondary brand colors for supporting elements',
    colorKeys: ['secondary', 'secondaryForeground']
  },
  {
    id: 'accent',
    title: 'Accent Colors',
    description: 'Accent colors for highlights and special elements',
    colorKeys: ['accent', 'accentForeground']
  },
  {
    id: 'base',
    title: 'Base Colors',
    description: 'Foundation colors for backgrounds and text',
    colorKeys: ['background', 'foreground']
  },
  {
    id: 'card',
    title: 'Card Colors',
    description: 'Colors for card containers and their content',
    colorKeys: ['card', 'cardForeground']
  },
  {
    id: 'popover',
    title: 'Popover Colors',
    description: 'Colors for popovers, dropdowns, and floating elements',
    colorKeys: ['popover', 'popoverForeground']
  },
  {
    id: 'muted',
    title: 'Muted Colors',
    description: 'Subdued colors for less prominent content',
    colorKeys: ['muted', 'mutedForeground']
  },
  {
    id: 'destructive',
    title: 'Destructive Colors',
    description: 'Colors for errors, warnings, and destructive actions',
    colorKeys: ['destructive', 'destructiveForeground']
  },
  {
    id: 'border-input',
    title: 'Border & Input Colors',
    description: 'Colors for borders, inputs, and focus rings',
    colorKeys: ['border', 'input', 'ring']
  },
  {
    id: 'chart',
    title: 'Chart Colors',
    description: 'Color palette for data visualization and charts',
    colorKeys: ['chart1', 'chart2', 'chart3', 'chart4', 'chart5']
  },
  {
    id: 'sidebar',
    title: 'Sidebar Colors',
    description: 'Colors specifically for sidebar navigation',
    colorKeys: [
      'sidebar', 
      'sidebarForeground', 
      'sidebarPrimary', 
      'sidebarPrimaryForeground',
      'sidebarAccent',
      'sidebarAccentForeground', 
      'sidebarBorder',
      'sidebarRing'
    ]
  },
  {
    id: 'scrollbar',
    title: 'Scrollbar Colors',
    description: 'Colors for scrollbar track and thumb elements',
    colorKeys: [
      'scrollbarTrack',
      'scrollbarThumb'
    ]
  }
];

// CSS Variable mapping for each color key
export const CSS_VARIABLE_MAP: Record<keyof import('./theme.types').ThemeColors, string> = {
  background: '--background',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  popover: '--popover',
  popoverForeground: '--popover-foreground',
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  destructive: '--destructive',
  destructiveForeground: '--destructive-foreground',
  border: '--border',
  input: '--input',
  ring: '--ring',
  chart1: '--chart-1',
  chart2: '--chart-2',
  chart3: '--chart-3',
  chart4: '--chart-4',
  chart5: '--chart-5',
  sidebar: '--sidebar',
  sidebarForeground: '--sidebar-foreground',
  sidebarPrimary: '--sidebar-primary',
  sidebarPrimaryForeground: '--sidebar-primary-foreground',
  sidebarAccent: '--sidebar-accent',
  sidebarAccentForeground: '--sidebar-accent-foreground',
  sidebarBorder: '--sidebar-border',
  sidebarRing: '--sidebar-ring',
  scrollbarTrack: '--scrollbar-track',
  scrollbarThumb: '--scrollbar-thumb'
};

// Human readable labels for each color (matching JSON structure exactly)
export const COLOR_LABELS: Record<keyof import('./theme.types').ThemeColors, string> = {
  background: 'Background',
  foreground: 'Foreground',
  card: 'Card Background',
  cardForeground: 'Card Foreground',
  popover: 'Popover Background',
  popoverForeground: 'Popover Foreground',
  primary: 'Primary',
  primaryForeground: 'Primary Foreground',
  secondary: 'Secondary',
  secondaryForeground: 'Secondary Foreground',
  accent: 'Accent',
  accentForeground: 'Accent Foreground',
  muted: 'Muted',
  mutedForeground: 'Muted Foreground',
  destructive: 'Destructive',
  destructiveForeground: 'Destructive Foreground',
  border: 'Border',
  input: 'Input',
  ring: 'Ring',
  chart1: 'Chart 1',
  chart2: 'Chart 2',
  chart3: 'Chart 3',
  chart4: 'Chart 4',
  chart5: 'Chart 5',
  sidebar: 'Sidebar Background',
  sidebarForeground: 'Sidebar Foreground',
  sidebarPrimary: 'Sidebar Primary',
  sidebarPrimaryForeground: 'Sidebar Primary Foreground',
  sidebarAccent: 'Sidebar Accent',
  sidebarAccentForeground: 'Sidebar Accent Foreground',
  sidebarBorder: 'Sidebar Border',
  sidebarRing: 'Sidebar Ring',
  scrollbarTrack: 'Scrollbar Track',
  scrollbarThumb: 'Scrollbar Thumb'
};