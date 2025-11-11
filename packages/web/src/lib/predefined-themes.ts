export interface PredefinedTheme {
  id: string;
  name: string;
  category:
    | 'popular'
    | 'nature'
    | 'corporate'
    | 'creative'
    | 'monochrome'
    | 'specialty';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  lightModeConfig: {
    // Base colors
    background: string;
    foreground: string;
    card: string;
    'card-foreground': string;
    popover: string;
    'popover-foreground': string;

    // Primary colors
    primary: string;
    'primary-foreground': string;

    // Secondary colors
    secondary: string;
    'secondary-foreground': string;

    // Muted colors
    muted: string;
    'muted-foreground': string;

    // Accent colors
    accent: string;
    'accent-foreground': string;

    // Destructive colors
    destructive: string;
    'destructive-foreground': string;

    // Border and input
    border: string;
    input: string;
    ring: string;

    // Chart colors
    'chart-1': string;
    'chart-2': string;
    'chart-3': string;
    'chart-4': string;
    'chart-5': string;

    // Sidebar colors
    sidebar: string;
    'sidebar-foreground': string;
    'sidebar-primary': string;
    'sidebar-primary-foreground': string;
    'sidebar-accent': string;
    'sidebar-accent-foreground': string;
    'sidebar-border': string;
    'sidebar-ring': string;

    // Typography
    'font-sans': string;
    'font-serif': string;
    'font-mono': string;
    'letter-spacing': string;

    // Border radius
    radius: string;

    // Shadow system
    'shadow-color': string;
    'shadow-opacity': string;
    'shadow-blur': string;
    'shadow-spread': string;
    'shadow-offset-x': string;
    'shadow-offset-y': string;
  };
  darkModeConfig: {
    // Same structure as lightModeConfig
    background: string;
    foreground: string;
    card: string;
    'card-foreground': string;
    popover: string;
    'popover-foreground': string;
    primary: string;
    'primary-foreground': string;
    secondary: string;
    'secondary-foreground': string;
    muted: string;
    'muted-foreground': string;
    accent: string;
    'accent-foreground': string;
    destructive: string;
    'destructive-foreground': string;
    border: string;
    input: string;
    ring: string;
    'chart-1': string;
    'chart-2': string;
    'chart-3': string;
    'chart-4': string;
    'chart-5': string;
    sidebar: string;
    'sidebar-foreground': string;
    'sidebar-primary': string;
    'sidebar-primary-foreground': string;
    'sidebar-accent': string;
    'sidebar-accent-foreground': string;
    'sidebar-border': string;
    'sidebar-ring': string;
    'font-sans': string;
    'font-serif': string;
    'font-mono': string;
    'letter-spacing': string;
    radius: string;
    'shadow-color': string;
    'shadow-opacity': string;
    'shadow-blur': string;
    'shadow-spread': string;
    'shadow-offset-x': string;
    'shadow-offset-y': string;
  };
}

// Helper function to generate complete theme config with all required properties using tweakcn defaults
const generateCompleteThemeConfig = (baseConfig: Record<string, string>) => {
  // Define defaults first
  const defaults = {
    // All base colors - using tweakcn defaults
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.145 0 0)',
    card: 'oklch(1 0 0)',
    'card-foreground': 'oklch(0.145 0 0)',
    popover: 'oklch(1 0 0)',
    'popover-foreground': 'oklch(0.145 0 0)',
    primary: 'oklch(0.205 0 0)',
    'primary-foreground': 'oklch(0.985 0 0)',
    secondary: 'oklch(0.97 0 0)',
    'secondary-foreground': 'oklch(0.205 0 0)',
    muted: 'oklch(0.97 0 0)',
    'muted-foreground': 'oklch(0.556 0 0)',
    accent: 'oklch(0.97 0 0)',
    'accent-foreground': 'oklch(0.205 0 0)',
    destructive: 'oklch(0.577 0.245 27.325)',
    'destructive-foreground': 'oklch(1 0 0)',
    border: 'oklch(0.922 0 0)',
    input: 'oklch(0.922 0 0)',
    ring: 'oklch(0.708 0 0)',

    // Chart colors - using defaults from tweakcn
    'chart-1': 'oklch(0.81 0.10 252)',
    'chart-2': 'oklch(0.62 0.19 260)',
    'chart-3': 'oklch(0.55 0.22 263)',
    'chart-4': 'oklch(0.49 0.22 264)',
    'chart-5': 'oklch(0.42 0.18 266)',

    // Sidebar colors - using defaults from tweakcn
    sidebar: 'oklch(0.985 0 0)',
    'sidebar-foreground': 'oklch(0.145 0 0)',
    'sidebar-primary': 'oklch(0.205 0 0)',
    'sidebar-primary-foreground': 'oklch(0.985 0 0)',
    'sidebar-accent': 'oklch(0.97 0 0)',
    'sidebar-accent-foreground': 'oklch(0.205 0 0)',
    'sidebar-border': 'oklch(0.922 0 0)',
    'sidebar-ring': 'oklch(0.708 0 0)',

    // Typography - using defaults from tweakcn
    'font-sans':
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    'font-serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    'letter-spacing': '0em',

    // Other properties - using defaults from tweakcn
    radius: '0.625rem',
    spacing: '0.25rem',

    // Shadow system - using defaults from tweakcn
    'shadow-color': 'oklch(0 0 0)',
    'shadow-opacity': '0.1',
    'shadow-blur': '3px',
    'shadow-spread': '0px',
    'shadow-offset-x': '0',
    'shadow-offset-y': '1px',
  };

  // Start with defaults, then override with user values
  const result = { ...defaults, ...baseConfig };

  // Apply intelligent fallbacks for related colors
  if (baseConfig.primary && !baseConfig['sidebar-primary']) {
    result['sidebar-primary'] = baseConfig.primary;
  }
  if (
    baseConfig['primary-foreground'] &&
    !baseConfig['sidebar-primary-foreground']
  ) {
    result['sidebar-primary-foreground'] = baseConfig['primary-foreground'];
  }
  if (baseConfig.background && !baseConfig.card) {
    result.card = baseConfig.background;
  }
  if (baseConfig.foreground && !baseConfig['card-foreground']) {
    result['card-foreground'] = baseConfig.foreground;
  }
  if (result.card && !baseConfig.popover) {
    result.popover = result.card;
  }
  if (result['card-foreground'] && !baseConfig['popover-foreground']) {
    result['popover-foreground'] = result['card-foreground'];
  }

  return result;
};

// Complete TweakCN Theme Collection - 40 Themes
export const PREDEFINED_THEMES: PredefinedTheme[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    category: 'popular',
    colors: {
      primary: 'oklch(0.62 0.19 259.81)',
      secondary: 'oklch(0.97 0.00 264.54)',
      accent: 'oklch(0.95 0.03 236.82)',
      background: 'oklch(1.00 0 0)',
      foreground: 'oklch(0.32 0 0)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      // Exact values from tweakcn Modern Minimal theme
      background: 'oklch(1.00 0 0)',
      foreground: 'oklch(0.32 0 0)',
      card: 'oklch(1.00 0 0)',
      'card-foreground': 'oklch(0.32 0 0)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.32 0 0)',
      primary: 'oklch(0.62 0.19 259.81)',
      'primary-foreground': 'oklch(1.00 0 0)',
      secondary: 'oklch(0.97 0.00 264.54)',
      'secondary-foreground': 'oklch(0.45 0.03 256.80)',
      muted: 'oklch(0.98 0.00 247.84)',
      'muted-foreground': 'oklch(0.55 0.02 264.36)',
      accent: 'oklch(0.95 0.03 236.82)',
      'accent-foreground': 'oklch(0.38 0.14 265.52)',
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',
      border: 'oklch(0.93 0.01 264.53)',
      input: 'oklch(0.93 0.01 264.53)',
      ring: 'oklch(0.62 0.19 259.81)',
      // Chart colors from tweakcn
      'chart-1': 'oklch(0.62 0.19 259.81)',
      'chart-2': 'oklch(0.55 0.22 262.88)',
      'chart-3': 'oklch(0.49 0.22 264.38)',
      'chart-4': 'oklch(0.42 0.18 265.64)',
      'chart-5': 'oklch(0.38 0.14 265.52)',
      // Sidebar colors from tweakcn
      sidebar: 'oklch(0.98 0.00 247.84)',
      'sidebar-foreground': 'oklch(0.32 0 0)',
      'sidebar-primary': 'oklch(0.62 0.19 259.81)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.95 0.03 236.82)',
      'sidebar-accent-foreground': 'oklch(0.38 0.14 265.52)',
      'sidebar-border': 'oklch(0.93 0.01 264.53)',
      'sidebar-ring': 'oklch(0.62 0.19 259.81)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      // Dark mode values extrapolated from light mode values
      background: 'oklch(0.08 0 0)',
      foreground: 'oklch(0.90 0 0)',
      card: 'oklch(0.12 0 0)',
      'card-foreground': 'oklch(0.90 0 0)',
      popover: 'oklch(0.12 0 0)',
      'popover-foreground': 'oklch(0.90 0 0)',
      primary: 'oklch(0.65 0.19 259.81)',
      'primary-foreground': 'oklch(1.00 0 0)',
      secondary: 'oklch(0.15 0.00 264.54)',
      'secondary-foreground': 'oklch(0.85 0.03 256.80)',
      muted: 'oklch(0.12 0.00 247.84)',
      'muted-foreground': 'oklch(0.60 0.02 264.36)',
      accent: 'oklch(0.18 0.03 236.82)',
      'accent-foreground': 'oklch(0.75 0.14 265.52)',
      destructive: 'oklch(0.68 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',
      border: 'oklch(0.25 0.01 264.53)',
      input: 'oklch(0.25 0.01 264.53)',
      ring: 'oklch(0.65 0.19 259.81)',
    }),
  },{
    id: 'starry-night',
    name: 'Starry Night',
    category: 'nature',
    colors: {
      primary: 'oklch(0.48 0.118 263)',
      secondary: 'oklch(0.86 0.116 81)',
      accent: 'oklch(0.69 0.071 234)',
      background: 'oklch(0.98 0.005 258)',
      foreground: 'oklch(0.26 0.043 268)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.98 0.005 258)',
      foreground: 'oklch(0.26 0.043 268)',
      card: 'oklch(0.93 0.013 252)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(0.99 0.028 98)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.48 0.118 263)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.86 0.116 81)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.92 0.008 107)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.69 0.071 234)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.26 0.038 323)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.78 0.016 251)',
      input: 'oklch(0.69 0.071 234)',
      ring: 'oklch(0.86 0.116 81)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.22 0.020 276)',
      foreground: 'oklch(0.94 0.013 267)',
      card: 'oklch(0.27 0.041 281)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.27 0.041 281)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.48 0.118 263)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.91 0.144 95)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.27 0.041 281)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.85 0.052 265)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(0.53 0.120 357)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.31 0.029 282)',
      input: 'oklch(0.48 0.118 263)',
      ring: 'oklch(0.91 0.144 95)',
    }),
  },
  {
    id: 'sunset-horizon',
    name: 'Sunset Horizon',
    category: 'nature',
    colors: {
      primary: 'oklch(0.74 0.164 35)',
      secondary: 'oklch(0.96 0.020 29)',
      accent: 'oklch(0.83 0.113 58)',
      background: 'oklch(0.99 0.008 56)',
      foreground: 'oklch(0.34 0.013 3)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.99 0.008 56)',
      foreground: 'oklch(0.34 0.013 3)',
      card: 'oklch(1.00 0.000 90)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(1.00 0.000 90)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.74 0.164 35)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.96 0.020 29)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.97 0.018 39)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.83 0.113 58)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.61 0.208 22)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.93 0.037 39)',
      input: 'oklch(0.93 0.037 39)',
      ring: 'oklch(0.74 0.164 35)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.26 0.017 352)',
      foreground: 'oklch(0.94 0.012 51)',
      card: 'oklch(0.32 0.018 341)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.32 0.018 341)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.74 0.164 35)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.36 0.020 342)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.32 0.018 341)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.83 0.113 58)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(0.61 0.208 22)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.36 0.020 342)',
      input: 'oklch(0.36 0.020 342)',
      ring: 'oklch(0.74 0.164 35)',
    }),
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    category: 'nature',
    colors: {
      primary: 'oklch(0.72 0.192 150)',
      secondary: 'oklch(0.95 0.025 237)',
      accent: 'oklch(0.95 0.051 163)',
      background: 'oklch(0.98 0.013 244)',
      foreground: 'oklch(0.37 0.031 260)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.98 0.013 244)',
      foreground: 'oklch(0.37 0.031 260)',
      card: 'oklch(1.00 0.000 90)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(1.00 0.000 90)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.72 0.192 150)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.95 0.025 237)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.97 0.003 265)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.95 0.051 163)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.64 0.208 25)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.93 0.006 265)',
      input: 'oklch(0.93 0.006 265)',
      ring: 'oklch(0.72 0.192 150)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.21 0.040 266)',
      foreground: 'oklch(0.87 0.009 258)',
      card: 'oklch(0.28 0.037 260)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.28 0.037 260)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.77 0.153 163)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.34 0.033 261)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.28 0.037 260)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.37 0.031 260)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(0.64 0.208 25)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.45 0.026 257)',
      input: 'oklch(0.45 0.026 257)',
      ring: 'oklch(0.77 0.153 163)',
    }),
  },
  {
    id: 'twitter',
    name: 'Twitter',
    category: 'popular',
    colors: {
      primary: 'oklch(0.67 0.161 245)',
      secondary: 'oklch(0.19 0.013 249)',
      accent: 'oklch(0.94 0.017 251)',
      background: 'oklch(1.00 0.000 90)',
      foreground: 'oklch(0.19 0.013 249)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(1.00 0.000 90)',
      foreground: 'oklch(0.19 0.013 249)',
      card: 'oklch(0.98 0.001 197)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(1.00 0.000 90)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.67 0.161 245)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.19 0.013 249)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.92 0.001 286)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.94 0.017 251)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.62 0.238 26)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.93 0.012 232)',
      input: 'oklch(0.98 0.003 229)',
      ring: 'oklch(0.68 0.158 243)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.00 0.000 0)',
      foreground: 'oklch(0.93 0.003 229)',
      card: 'oklch(0.21 0.008 275)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.00 0.000 0)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.67 0.161 245)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.96 0.003 220)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.21 0.000 90)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.19 0.033 243)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(0.62 0.238 26)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.27 0.005 248)',
      input: 'oklch(0.30 0.029 245)',
      ring: 'oklch(0.68 0.158 243)',
    }),
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'popular',
    colors: {
      primary: 'oklch(0.62 0.188 260)',
      secondary: 'oklch(0.97 0.007 248)',
      accent: 'oklch(0.97 0.007 248)',
      background: 'oklch(1.00 0.000 90)',
      foreground: 'oklch(0.00 0.000 0)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(1.00 0.000 90)',
      foreground: 'oklch(0.00 0.000 0)',
      card: 'oklch(1.00 0.000 90)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(1.00 0.000 90)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.62 0.188 260)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.97 0.007 248)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.97 0.007 248)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.97 0.007 248)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.64 0.208 25)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.93 0.013 256)',
      input: 'oklch(0.93 0.013 256)',
      ring: 'oklch(0.62 0.188 260)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.21 0.040 266)',
      foreground: 'oklch(0.98 0.003 248)',
      card: 'oklch(0.28 0.037 260)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.28 0.037 260)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.62 0.188 260)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.28 0.037 260)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.28 0.037 260)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.28 0.037 260)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(0.64 0.208 25)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.37 0.039 257)',
      input: 'oklch(0.37 0.039 257)',
      ring: 'oklch(0.62 0.188 260)',
    }),
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'popular',
    colors: {
      primary: 'oklch(0.62 0.138 39)',
      secondary: 'oklch(0.92 0.014 93)',
      accent: 'oklch(0.92 0.014 93)',
      background: 'oklch(0.98 0.005 95)',
      foreground: 'oklch(0.34 0.027 96)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.98 0.005 95)',
      foreground: 'oklch(0.34 0.027 96)',
      card: 'oklch(0.98 0.005 95)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(1.00 0.000 90)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.62 0.138 39)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.92 0.014 93)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.93 0.015 90)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.92 0.014 93)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.19 0.002 107)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.88 0.007 97)',
      input: 'oklch(0.76 0.016 98)',
      ring: 'oklch(0.62 0.138 39)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.27 0.004 107)',
      foreground: 'oklch(0.81 0.014 93)',
      card: 'oklch(0.27 0.004 107)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.31 0.004 107)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.67 0.131 39)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.98 0.005 95)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.22 0.004 107)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.21 0.008 95)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(0.64 0.208 25)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.36 0.010 107)',
      input: 'oklch(0.43 0.011 100)',
      ring: 'oklch(0.67 0.131 39)',
    }),
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'popular',
    colors: {
      primary: 'oklch(0.83 0.130 161)',
      secondary: 'oklch(0.99 0.000 90)',
      accent: 'oklch(0.95 0.000 90)',
      background: 'oklch(0.99 0.000 90)',
      foreground: 'oklch(0.20 0.000 90)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.99 0.000 90)',
      foreground: 'oklch(0.20 0.000 90)',
      card: 'oklch(0.99 0.000 90)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(0.99 0.000 90)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.83 0.130 161)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.99 0.000 90)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.95 0.000 90)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.95 0.000 90)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.55 0.193 33)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.90 0.000 90)',
      input: 'oklch(0.97 0.000 90)',
      ring: 'oklch(0.83 0.130 161)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.18 0.000 90)',
      foreground: 'oklch(0.93 0.013 256)',
      card: 'oklch(0.20 0.000 90)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.26 0.000 90)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.44 0.104 157)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.26 0.000 90)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.24 0.000 90)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.31 0.000 90)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(0.31 0.085 30)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.28 0.000 90)',
      input: 'oklch(0.26 0.000 90)',
      ring: 'oklch(0.80 0.182 152)',
    }),
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    category: 'creative',
    colors: {
      primary: 'oklch(0.67 0.290 341)',
      secondary: 'oklch(0.96 0.020 286)',
      accent: 'oklch(0.89 0.174 171)',
      background: 'oklch(0.98 0.002 248)',
      foreground: 'oklch(0.16 0.035 282)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.98 0.002 248)',
      foreground: 'oklch(0.16 0.035 282)',
      card: 'oklch(1.00 0.000 90)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(1.00 0.000 90)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.67 0.290 341)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.96 0.020 286)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.96 0.020 286)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.89 0.174 171)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.65 0.235 34)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.92 0.009 225)',
      input: 'oklch(0.92 0.009 225)',
      ring: 'oklch(0.67 0.290 341)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.16 0.035 282)',
      foreground: 'oklch(0.95 0.007 261)',
      card: 'oklch(0.25 0.061 281)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.25 0.061 281)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.67 0.290 341)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.25 0.061 281)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.25 0.061 281)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.89 0.174 171)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(0.65 0.235 34)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.33 0.083 281)',
      input: 'oklch(0.33 0.083 281)',
      ring: 'oklch(0.67 0.290 341)',
    }),
  },
  {
    id: 'neo-brutalism',
    name: 'Neo Brutalism',
    category: 'creative',
    colors: {
      primary: 'oklch(0.65 0.237 27)',
      secondary: 'oklch(0.97 0.211 110)',
      accent: 'oklch(0.56 0.241 261)',
      background: 'oklch(1.00 0.000 90)',
      foreground: 'oklch(0.00 0.000 0)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(1.00 0.000 90)',
      foreground: 'oklch(0.00 0.000 0)',
      card: 'oklch(1.00 0.000 90)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(1.00 0.000 90)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.65 0.237 27)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.97 0.211 110)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.96 0.000 90)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.56 0.241 261)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.00 0.000 0)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.00 0.000 0)',
      input: 'oklch(0.00 0.000 0)',
      ring: 'oklch(0.65 0.237 27)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.00 0.000 0)',
      foreground: 'oklch(1.00 0.000 90)',
      card: 'oklch(0.32 0.000 90)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.32 0.000 90)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.70 0.187 23)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.97 0.201 110)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.32 0.000 90)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.68 0.176 252)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(1.00 0.000 90)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(1.00 0.000 90)',
      input: 'oklch(1.00 0.000 90)',
      ring: 'oklch(0.70 0.187 23)',
    }),
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin',
    category: 'specialty',
    colors: {
      primary: 'oklch(0.55 0.250 297)',
      secondary: 'oklch(0.86 0.014 268)',
      accent: 'oklch(0.68 0.145 235)',
      background: 'oklch(0.96 0.006 265)',
      foreground: 'oklch(0.44 0.043 279)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.96 0.006 265)',
      foreground: 'oklch(0.44 0.043 279)',
      card: 'oklch(1.00 0.000 90)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(0.86 0.014 268)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.55 0.250 297)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.86 0.014 268)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.91 0.012 265)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.68 0.145 235)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.55 0.216 20)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.81 0.017 271)',
      input: 'oklch(0.86 0.014 268)',
      ring: 'oklch(0.55 0.250 297)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.22 0.025 284)',
      foreground: 'oklch(0.88 0.043 272)',
      card: 'oklch(0.24 0.030 284)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.40 0.032 280)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.79 0.119 305)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.48 0.034 279)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.30 0.029 276)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.85 0.083 210)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(0.76 0.130 3)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.32 0.032 282)',
      input: 'oklch(0.32 0.032 282)',
      ring: 'oklch(0.79 0.119 305)',
    }),
  },
  {
    id: 'retro-arcade',
    name: 'Retro Arcade',
    category: 'creative',
    colors: {
      primary: 'oklch(0.59 0.202 356)',
      secondary: 'oklch(0.64 0.102 187)',
      accent: 'oklch(0.58 0.173 40)',
      background: 'oklch(0.97 0.026 90)',
      foreground: 'oklch(0.31 0.052 220)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.97 0.026 90)',
      foreground: 'oklch(0.31 0.052 220)',
      card: 'oklch(0.93 0.026 92)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(0.93 0.026 92)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.59 0.202 356)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.64 0.102 187)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.70 0.016 197)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.58 0.173 40)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.59 0.206 27)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.65 0.020 205)',
      input: 'oklch(0.65 0.020 205)',
      ring: 'oklch(0.59 0.202 356)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.27 0.049 220)',
      foreground: 'oklch(0.70 0.016 197)',
      card: 'oklch(0.31 0.052 220)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.31 0.052 220)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.59 0.202 356)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.64 0.102 187)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.52 0.028 219)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.58 0.173 40)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(0.59 0.206 27)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.52 0.028 219)',
      input: 'oklch(0.52 0.028 219)',
      ring: 'oklch(0.59 0.202 356)',
    }),
  },
  {
    id: 'mono',
    name: 'Mono',
    category: 'monochrome',
    colors: {
      primary: 'oklch(0.56 0.000 90)',
      secondary: 'oklch(0.97 0.000 90)',
      accent: 'oklch(0.97 0.000 90)',
      background: 'oklch(1.00 0.000 90)',
      foreground: 'oklch(0.14 0.000 90)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(1.00 0.000 90)',
      foreground: 'oklch(0.14 0.000 90)',
      card: 'oklch(1.00 0.000 90)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(1.00 0.000 90)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.56 0.000 90)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.97 0.000 90)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.97 0.000 90)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.97 0.000 90)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.58 0.239 28)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.92 0.000 90)',
      input: 'oklch(0.92 0.000 90)',
      ring: 'oklch(0.71 0.000 90)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.14 0.000 90)',
      foreground: 'oklch(0.99 0.000 90)',
      card: 'oklch(0.21 0.000 90)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.27 0.000 90)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.56 0.000 90)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.27 0.000 90)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.27 0.000 90)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.37 0.000 90)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(0.70 0.189 22)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.34 0.000 90)',
      input: 'oklch(0.44 0.000 90)',
      ring: 'oklch(0.56 0.000 90)',
    }),
  },
  {
    id: 'vintage-paper',
    name: 'Vintage Paper',
    category: 'monochrome',
    colors: {
      primary: 'oklch(0.62 0.078 66)',
      secondary: 'oklch(0.88 0.030 86)',
      accent: 'oklch(0.83 0.043 89)',
      background: 'oklch(0.96 0.015 90)',
      foreground: 'oklch(0.38 0.022 64)',
    },
    lightModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.96 0.015 90)',
      foreground: 'oklch(0.38 0.022 64)',
      card: 'oklch(0.99 0.010 87)',
      'card-foreground': 'oklch(0.00 0.000 0)',
      popover: 'oklch(0.99 0.010 87)',
      'popover-foreground': 'oklch(0.00 0.000 0)',
      primary: 'oklch(0.62 0.078 66)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.88 0.030 86)',
      'secondary-foreground': 'oklch(0.21 0.040 266)',
      muted: 'oklch(0.92 0.019 83)',
      'muted-foreground': 'oklch(0.55 0.041 257)',
      accent: 'oklch(0.83 0.043 89)',
      'accent-foreground': 'oklch(0.21 0.040 266)',
      destructive: 'oklch(0.55 0.144 33)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.86 0.032 85)',
      input: 'oklch(0.86 0.032 85)',
      ring: 'oklch(0.62 0.078 66)',
    }),
    darkModeConfig: generateCompleteThemeConfig({
      background: 'oklch(0.27 0.014 58)',
      foreground: 'oklch(0.92 0.019 83)',
      card: 'oklch(0.32 0.016 59)',
      'card-foreground': 'oklch(0.98 0.003 248)',
      popover: 'oklch(0.32 0.016 59)',
      'popover-foreground': 'oklch(0.98 0.003 248)',
      primary: 'oklch(0.73 0.058 67)',
      'primary-foreground': 'oklch(1.00 0.000 90)',
      secondary: 'oklch(0.38 0.018 57)',
      'secondary-foreground': 'oklch(0.98 0.003 248)',
      muted: 'oklch(0.32 0.016 59)',
      'muted-foreground': 'oklch(0.71 0.035 257)',
      accent: 'oklch(0.42 0.028 56)',
      'accent-foreground': 'oklch(0.98 0.003 248)',
      destructive: 'oklch(0.55 0.144 33)',
      'destructive-foreground': 'oklch(1.00 0.000 90)',
      border: 'oklch(0.38 0.018 57)',
      input: 'oklch(0.38 0.018 57)',
      ring: 'oklch(0.73 0.058 67)',
    }),
  },{
    id: 'bubblegum',
    name: 'Bubblegum',
    category: 'popular',
    colors: {
      primary: 'oklch(0.62 0.18 348.14)',
      secondary: 'oklch(0.81 0.07 198.19)',
      accent: 'oklch(0.92 0.08 87.67)',
      background: 'oklch(0.94 0.02 345.70)',
      foreground: 'oklch(0.47 0 0)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.94 0.02 345.70)',
      foreground: 'oklch(0.47 0 0)',
      card: 'oklch(0.95 0.05 86.89)',
      'card-foreground': 'oklch(0.47 0 0)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.47 0 0)',

      // Primary colors
      primary: 'oklch(0.62 0.18 348.14)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.81 0.07 198.19)',
      'secondary-foreground': 'oklch(0.32 0 0)',

      // Muted colors
      muted: 'oklch(0.88 0.05 212.10)',
      'muted-foreground': 'oklch(0.58 0 0)',

      // Accent colors
      accent: 'oklch(0.92 0.08 87.67)',
      'accent-foreground': 'oklch(0.32 0 0)',

      // Destructive colors
      destructive: 'oklch(0.71 0.17 21.96)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.62 0.18 348.14)',
      input: 'oklch(0.92 0 0)',
      ring: 'oklch(0.70 0.16 350.75)',

      // Chart colors
      'chart-1': 'oklch(0.70 0.16 350.75)',
      'chart-2': 'oklch(0.82 0.08 212.09)',
      'chart-3': 'oklch(0.92 0.08 87.67)',
      'chart-4': 'oklch(0.80 0.11 348.18)',
      'chart-5': 'oklch(0.62 0.19 353.91)',

      // Sidebar colors
      sidebar: 'oklch(0.91 0.04 343.09)',
      'sidebar-foreground': 'oklch(0.32 0 0)',
      'sidebar-primary': 'oklch(0.66 0.21 354.31)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.82 0.11 346.02)',
      'sidebar-accent-foreground': 'oklch(0.32 0 0)',
      'sidebar-border': 'oklch(0.95 0.03 307.17)',
      'sidebar-ring': 'oklch(0.66 0.21 354.31)',

      // Typography
      'font-sans': "'Poppins', sans-serif",
      'font-serif': "'Lora', serif",
      'font-mono': "'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.4rem',

      // Shadow system
      'shadow-color': 'oklch(0.62 0.18 348.14)',
      'shadow-opacity': '0.5',
      'shadow-blur': '0px',
      'shadow-spread': '0px',
      'shadow-offset-x': '3px',
      'shadow-offset-y': '3px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.25 0.03 234.16)',
      foreground: 'oklch(0.93 0.02 349.08)',
      card: 'oklch(0.29 0.03 233.54)',
      'card-foreground': 'oklch(0.93 0.02 349.08)',
      popover: 'oklch(0.29 0.03 233.54)',
      'popover-foreground': 'oklch(0.93 0.02 349.08)',

      // Primary colors
      primary: 'oklch(0.92 0.08 87.67)',
      'primary-foreground': 'oklch(0.25 0.03 234.16)',

      // Secondary colors
      secondary: 'oklch(0.78 0.08 4.13)',
      'secondary-foreground': 'oklch(0.25 0.03 234.16)',

      // Muted colors
      muted: 'oklch(0.27 0.01 255.58)',
      'muted-foreground': 'oklch(0.78 0.08 4.13)',

      // Accent colors
      accent: 'oklch(0.67 0.10 356.98)',
      'accent-foreground': 'oklch(0.93 0.02 349.08)',

      // Destructive colors
      destructive: 'oklch(0.67 0.18 350.36)',
      'destructive-foreground': 'oklch(0.25 0.03 234.16)',

      // Border and input
      border: 'oklch(0.39 0.04 242.22)',
      input: 'oklch(0.31 0.03 232.00)',
      ring: 'oklch(0.70 0.09 201.87)',

      // Chart colors
      'chart-1': 'oklch(0.70 0.09 201.87)',
      'chart-2': 'oklch(0.78 0.08 4.13)',
      'chart-3': 'oklch(0.67 0.10 356.98)',
      'chart-4': 'oklch(0.44 0.07 217.08)',
      'chart-5': 'oklch(0.27 0.01 255.58)',

      // Sidebar colors
      sidebar: 'oklch(0.23 0.03 235.97)',
      'sidebar-foreground': 'oklch(0.97 0.00 264.54)',
      'sidebar-primary': 'oklch(0.66 0.21 354.31)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.82 0.11 346.02)',
      'sidebar-accent-foreground': 'oklch(0.28 0.03 256.85)',
      'sidebar-border': 'oklch(0.37 0.03 259.73)',
      'sidebar-ring': 'oklch(0.66 0.21 354.31)',

      // Typography
      'font-sans': "'Poppins', sans-serif",
      'font-serif': "'Lora', serif",
      'font-mono': "'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.4rem',

      // Shadow system
      'shadow-color': 'oklch(0.27 0.08 206.15)',
      'shadow-opacity': '0.5',
      'shadow-blur': '0px',
      'shadow-spread': '0px',
      'shadow-offset-x': '3px',
      'shadow-offset-y': '3px',
    },
  },

  {
    id: 't3-chat',
    name: 'T3 Chat',
    category: 'popular',
    colors: {
      primary: 'oklch(0.53 0.14 355.20)',
      secondary: 'oklch(0.87 0.07 334.90)',
      accent: 'oklch(0.87 0.07 334.90)',
      background: 'oklch(0.98 0.01 325.64)',
      foreground: 'oklch(0.33 0.12 325.04)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.98 0.01 325.64)',
      foreground: 'oklch(0.33 0.12 325.04)',
      card: 'oklch(0.98 0.01 325.64)',
      'card-foreground': 'oklch(0.33 0.12 325.04)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.33 0.12 325.04)',

      // Primary colors
      primary: 'oklch(0.53 0.14 355.20)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.87 0.07 334.90)',
      'secondary-foreground': 'oklch(0.44 0.13 324.80)',

      // Muted colors
      muted: 'oklch(0.94 0.03 331.55)',
      'muted-foreground': 'oklch(0.49 0.12 324.45)',

      // Accent colors
      accent: 'oklch(0.87 0.07 334.90)',
      'accent-foreground': 'oklch(0.44 0.13 324.80)',

      // Destructive colors
      destructive: 'oklch(0.52 0.14 20.83)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.86 0.08 328.91)',
      input: 'oklch(0.85 0.06 336.60)',
      ring: 'oklch(0.59 0.22 0.58)',

      // Chart colors
      'chart-1': 'oklch(0.60 0.24 344.47)',
      'chart-2': 'oklch(0.44 0.23 300.62)',
      'chart-3': 'oklch(0.38 0.04 226.15)',
      'chart-4': 'oklch(0.83 0.12 88.35)',
      'chart-5': 'oklch(0.78 0.13 59.00)',

      // Sidebar colors
      sidebar: 'oklch(0.94 0.03 320.58)',
      'sidebar-foreground': 'oklch(0.49 0.19 354.54)',
      'sidebar-primary': 'oklch(0.40 0.03 285.20)',
      'sidebar-primary-foreground': 'oklch(0.97 0.01 337.52)',
      'sidebar-accent': 'oklch(0.98 0.00 106.42)',
      'sidebar-accent-foreground': 'oklch(0.40 0.03 285.20)',
      'sidebar-border': 'oklch(0.94 0.00 48.72)',
      'sidebar-ring': 'oklch(0.59 0.22 0.58)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0',
      'shadow-offset-y': '1px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.24 0.02 307.53)',
      foreground: 'oklch(0.84 0.04 309.54)',
      card: 'oklch(0.28 0.02 307.54)',
      'card-foreground': 'oklch(0.85 0.03 341.46)',
      popover: 'oklch(0.15 0.01 338.90)',
      'popover-foreground': 'oklch(0.96 0.01 341.80)',

      // Primary colors
      primary: 'oklch(0.46 0.19 4.10)',
      'primary-foreground': 'oklch(0.86 0.06 346.37)',

      // Secondary colors
      secondary: 'oklch(0.31 0.03 310.06)',
      'secondary-foreground': 'oklch(0.85 0.04 307.96)',

      // Muted colors
      muted: 'oklch(0.26 0.02 309.47)',
      'muted-foreground': 'oklch(0.79 0.04 307.10)',

      // Accent colors
      accent: 'oklch(0.36 0.05 308.49)',
      'accent-foreground': 'oklch(0.96 0.01 341.80)',

      // Destructive colors
      destructive: 'oklch(0.23 0.05 12.61)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.33 0.02 343.45)',
      input: 'oklch(0.34 0.02 332.83)',
      ring: 'oklch(0.59 0.22 0.58)',

      // Chart colors
      'chart-1': 'oklch(0.53 0.14 355.20)',
      'chart-2': 'oklch(0.56 0.19 306.86)',
      'chart-3': 'oklch(0.72 0.15 60.58)',
      'chart-4': 'oklch(0.62 0.20 312.74)',
      'chart-5': 'oklch(0.61 0.21 6.14)',

      // Sidebar colors
      sidebar: 'oklch(0.19 0.02 331.05)',
      'sidebar-foreground': 'oklch(0.86 0.03 343.66)',
      'sidebar-primary': 'oklch(0.49 0.22 264.38)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.23 0.03 338.20)',
      'sidebar-accent-foreground': 'oklch(0.97 0.00 286.38)',
      'sidebar-border': 'oklch(0 0 0)',
      'sidebar-ring': 'oklch(0.59 0.22 0.58)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0',
      'shadow-offset-y': '1px',
    },
  },

  {
    id: 'mocha-mousse',
    name: 'Mocha Mousse',
    category: 'popular',
    colors: {
      primary: 'oklch(0.61 0.06 44.36)',
      secondary: 'oklch(0.75 0.04 80.55)',
      accent: 'oklch(0.85 0.04 49.09)',
      background: 'oklch(0.95 0.01 102.46)',
      foreground: 'oklch(0.41 0.03 40.36)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.95 0.01 102.46)',
      foreground: 'oklch(0.41 0.03 40.36)',
      card: 'oklch(0.95 0.01 102.46)',
      'card-foreground': 'oklch(0.41 0.03 40.36)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.41 0.03 40.36)',

      // Primary colors
      primary: 'oklch(0.61 0.06 44.36)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.75 0.04 80.55)',
      'secondary-foreground': 'oklch(1.00 0 0)',

      // Muted colors
      muted: 'oklch(0.85 0.04 49.09)',
      'muted-foreground': 'oklch(0.54 0.05 37.21)',

      // Accent colors
      accent: 'oklch(0.85 0.04 49.09)',
      'accent-foreground': 'oklch(0.41 0.03 40.36)',

      // Destructive colors
      destructive: 'oklch(0.22 0.01 52.96)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.75 0.04 80.55)',
      input: 'oklch(0.75 0.04 80.55)',
      ring: 'oklch(0.61 0.06 44.36)',

      // Chart colors
      'chart-1': 'oklch(0.61 0.06 44.36)',
      'chart-2': 'oklch(0.54 0.05 37.21)',
      'chart-3': 'oklch(0.73 0.05 52.33)',
      'chart-4': 'oklch(0.75 0.04 80.55)',
      'chart-5': 'oklch(0.64 0.04 52.39)',

      // Sidebar colors
      sidebar: 'oklch(0.89 0.03 49.57)',
      'sidebar-foreground': 'oklch(0.41 0.03 40.36)',
      'sidebar-primary': 'oklch(0.61 0.06 44.36)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.73 0.05 52.33)',
      'sidebar-accent-foreground': 'oklch(1.00 0 0)',
      'sidebar-border': 'oklch(0.64 0.04 52.39)',
      'sidebar-ring': 'oklch(0.61 0.06 44.36)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.51 0.090 20)',
      'shadow-opacity': '0.11',
      'shadow-blur': '0px',
      'shadow-spread': '0px',
      'shadow-offset-x': '2px',
      'shadow-offset-y': '2px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.27 0.01 48.18)',
      foreground: 'oklch(0.95 0.01 102.46)',
      card: 'oklch(0.33 0.02 50.89)',
      'card-foreground': 'oklch(0.95 0.01 102.46)',
      popover: 'oklch(0.33 0.02 50.89)',
      'popover-foreground': 'oklch(0.95 0.01 102.46)',

      // Primary colors
      primary: 'oklch(0.73 0.05 52.33)',
      'primary-foreground': 'oklch(0.27 0.01 48.18)',

      // Secondary colors
      secondary: 'oklch(0.54 0.05 37.21)',
      'secondary-foreground': 'oklch(0.95 0.01 102.46)',

      // Muted colors
      muted: 'oklch(0.41 0.03 40.36)',
      'muted-foreground': 'oklch(0.76 0.04 50.86)',

      // Accent colors
      accent: 'oklch(0.75 0.04 80.55)',
      'accent-foreground': 'oklch(0.27 0.01 48.18)',

      // Destructive colors
      destructive: 'oklch(0.69 0.14 21.46)',
      'destructive-foreground': 'oklch(0.27 0.01 48.18)',

      // Border and input
      border: 'oklch(0.41 0.03 40.36)',
      input: 'oklch(0.41 0.03 40.36)',
      ring: 'oklch(0.73 0.05 52.33)',

      // Chart colors
      'chart-1': 'oklch(0.73 0.05 52.33)',
      'chart-2': 'oklch(0.75 0.04 80.55)',
      'chart-3': 'oklch(0.61 0.06 44.36)',
      'chart-4': 'oklch(0.54 0.05 37.21)',
      'chart-5': 'oklch(0.64 0.04 52.39)',

      // Sidebar colors
      sidebar: 'oklch(0.22 0.01 52.96)',
      'sidebar-foreground': 'oklch(0.95 0.01 102.46)',
      'sidebar-primary': 'oklch(0.73 0.05 52.33)',
      'sidebar-primary-foreground': 'oklch(0.22 0.01 52.96)',
      'sidebar-accent': 'oklch(0.75 0.04 80.55)',
      'sidebar-accent-foreground': 'oklch(0.22 0.01 52.96)',
      'sidebar-border': 'oklch(0.41 0.03 40.36)',
      'sidebar-ring': 'oklch(0.73 0.05 52.33)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.30 0.076 20)',
      'shadow-opacity': '0.11',
      'shadow-blur': '0px',
      'shadow-spread': '0px',
      'shadow-offset-x': '2px',
      'shadow-offset-y': '2px',
    },
  },

  {
    id: 'doom-64',
    name: 'Doom 64',
    category: 'popular',
    colors: {
      primary: 'oklch(0.50 0.19 27.48)',
      secondary: 'oklch(0.50 0.09 126.19)',
      accent: 'oklch(0.59 0.10 245.74)',
      background: 'oklch(0.85 0 0)',
      foreground: 'oklch(0.24 0 0)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.85 0 0)',
      foreground: 'oklch(0.24 0 0)',
      card: 'oklch(0.76 0 0)',
      'card-foreground': 'oklch(0.24 0 0)',
      popover: 'oklch(0.76 0 0)',
      'popover-foreground': 'oklch(0.24 0 0)',

      // Primary colors
      primary: 'oklch(0.50 0.19 27.48)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.50 0.09 126.19)',
      'secondary-foreground': 'oklch(1.00 0 0)',

      // Muted colors
      muted: 'oklch(0.78 0 0)',
      'muted-foreground': 'oklch(0.41 0 0)',

      // Accent colors
      accent: 'oklch(0.59 0.10 245.74)',
      'accent-foreground': 'oklch(1.00 0 0)',

      // Destructive colors
      destructive: 'oklch(0.71 0.20 46.46)',
      'destructive-foreground': 'oklch(0 0 0)',

      // Border and input
      border: 'oklch(0.43 0 0)',
      input: 'oklch(0.43 0 0)',
      ring: 'oklch(0.50 0.19 27.48)',

      // Chart colors
      'chart-1': 'oklch(0.50 0.19 27.48)',
      'chart-2': 'oklch(0.50 0.09 126.19)',
      'chart-3': 'oklch(0.59 0.10 245.74)',
      'chart-4': 'oklch(0.71 0.20 46.46)',
      'chart-5': 'oklch(0.57 0.04 40.43)',

      // Sidebar colors
      sidebar: 'oklch(0.76 0 0)',
      'sidebar-foreground': 'oklch(0.24 0 0)',
      'sidebar-primary': 'oklch(0.50 0.19 27.48)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.59 0.10 245.74)',
      'sidebar-accent-foreground': 'oklch(1.00 0 0)',
      'sidebar-border': 'oklch(0.43 0 0)',
      'sidebar-ring': 'oklch(0.50 0.19 27.48)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0px',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.4',
      'shadow-blur': '4px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '2px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.22 0 0)',
      foreground: 'oklch(0.91 0 0)',
      card: 'oklch(0.29 0 0)',
      'card-foreground': 'oklch(0.91 0 0)',
      popover: 'oklch(0.29 0 0)',
      'popover-foreground': 'oklch(0.91 0 0)',

      // Primary colors
      primary: 'oklch(0.61 0.21 27.03)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.64 0.15 133.01)',
      'secondary-foreground': 'oklch(0 0 0)',

      // Muted colors
      muted: 'oklch(0.26 0 0)',
      'muted-foreground': 'oklch(0.71 0 0)',

      // Accent colors
      accent: 'oklch(0.75 0.12 244.75)',
      'accent-foreground': 'oklch(0 0 0)',

      // Destructive colors
      destructive: 'oklch(0.78 0.17 68.09)',
      'destructive-foreground': 'oklch(0 0 0)',

      // Border and input
      border: 'oklch(0.41 0 0)',
      input: 'oklch(0.41 0 0)',
      ring: 'oklch(0.61 0.21 27.03)',

      // Chart colors
      'chart-1': 'oklch(0.61 0.21 27.03)',
      'chart-2': 'oklch(0.64 0.15 133.01)',
      'chart-3': 'oklch(0.75 0.12 244.75)',
      'chart-4': 'oklch(0.78 0.17 68.09)',
      'chart-5': 'oklch(0.65 0.03 40.80)',

      // Sidebar colors
      sidebar: 'oklch(0.19 0 0)',
      'sidebar-foreground': 'oklch(0.91 0 0)',
      'sidebar-primary': 'oklch(0.61 0.21 27.03)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.75 0.12 244.75)',
      'sidebar-accent-foreground': 'oklch(0 0 0)',
      'sidebar-border': 'oklch(0.41 0 0)',
      'sidebar-ring': 'oklch(0.61 0.21 27.03)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0px',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.6',
      'shadow-blur': '5px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '2px',
    },
  },

  {
    id: 'graphite',
    name: 'Graphite',
    category: 'specialty',
    colors: {
      primary: 'oklch(0.49 0 0)',
      secondary: 'oklch(0.91 0 0)',
      accent: 'oklch(0.81 0 0)',
      background: 'oklch(0.96 0 0)',
      foreground: 'oklch(0.32 0 0)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.96 0 0)',
      foreground: 'oklch(0.32 0 0)',
      card: 'oklch(0.97 0 0)',
      'card-foreground': 'oklch(0.32 0 0)',
      popover: 'oklch(0.97 0 0)',
      'popover-foreground': 'oklch(0.32 0 0)',

      // Primary colors
      primary: 'oklch(0.49 0 0)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.91 0 0)',
      'secondary-foreground': 'oklch(0.32 0 0)',

      // Muted colors
      muted: 'oklch(0.89 0 0)',
      'muted-foreground': 'oklch(0.51 0 0)',

      // Accent colors
      accent: 'oklch(0.81 0 0)',
      'accent-foreground': 'oklch(0.32 0 0)',

      // Destructive colors
      destructive: 'oklch(0.56 0.19 25.86)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.86 0 0)',
      input: 'oklch(0.91 0 0)',
      ring: 'oklch(0.49 0 0)',

      // Chart colors
      'chart-1': 'oklch(0.49 0 0)',
      'chart-2': 'oklch(0.49 0.04 196.03)',
      'chart-3': 'oklch(0.65 0 0)',
      'chart-4': 'oklch(0.73 0 0)',
      'chart-5': 'oklch(0.81 0 0)',

      // Sidebar colors
      sidebar: 'oklch(0.94 0 0)',
      'sidebar-foreground': 'oklch(0.32 0 0)',
      'sidebar-primary': 'oklch(0.49 0 0)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.81 0 0)',
      'sidebar-accent-foreground': 'oklch(0.32 0 0)',
      'sidebar-border': 'oklch(0.86 0 0)',
      'sidebar-ring': 'oklch(0.49 0 0)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.35rem',

      // Shadow system
      'shadow-color': 'oklch(0.20 0.000 0)',
      'shadow-opacity': '0.15',
      'shadow-blur': '0px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '2px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.22 0 0)',
      foreground: 'oklch(0.89 0 0)',
      card: 'oklch(0.24 0 0)',
      'card-foreground': 'oklch(0.89 0 0)',
      popover: 'oklch(0.24 0 0)',
      'popover-foreground': 'oklch(0.89 0 0)',

      // Primary colors
      primary: 'oklch(0.71 0 0)',
      'primary-foreground': 'oklch(0.22 0 0)',

      // Secondary colors
      secondary: 'oklch(0.31 0 0)',
      'secondary-foreground': 'oklch(0.89 0 0)',

      // Muted colors
      muted: 'oklch(0.29 0 0)',
      'muted-foreground': 'oklch(0.60 0 0)',

      // Accent colors
      accent: 'oklch(0.37 0 0)',
      'accent-foreground': 'oklch(0.89 0 0)',

      // Destructive colors
      destructive: 'oklch(0.66 0.15 22.17)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.33 0 0)',
      input: 'oklch(0.31 0 0)',
      ring: 'oklch(0.71 0 0)',

      // Chart colors
      'chart-1': 'oklch(0.71 0 0)',
      'chart-2': 'oklch(0.67 0.03 206.35)',
      'chart-3': 'oklch(0.55 0 0)',
      'chart-4': 'oklch(0.46 0 0)',
      'chart-5': 'oklch(0.37 0 0)',

      // Sidebar colors
      sidebar: 'oklch(0.24 0 0)',
      'sidebar-foreground': 'oklch(0.89 0 0)',
      'sidebar-primary': 'oklch(0.71 0 0)',
      'sidebar-primary-foreground': 'oklch(0.22 0 0)',
      'sidebar-accent': 'oklch(0.37 0 0)',
      'sidebar-accent-foreground': 'oklch(0.89 0 0)',
      'sidebar-border': 'oklch(0.33 0 0)',
      'sidebar-ring': 'oklch(0.71 0 0)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.35rem',

      // Shadow system
      'shadow-color': 'oklch(0.20 0.000 0)',
      'shadow-opacity': '0.15',
      'shadow-blur': '0px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '2px',
    },
  },

  {
    id: 'perpetuity',
    name: 'Perpetuity',
    category: 'specialty',
    colors: {
      primary: 'oklch(0.56 0.09 203.28)',
      secondary: 'oklch(0.92 0.02 196.84)',
      accent: 'oklch(0.90 0.03 201.89)',
      background: 'oklch(0.95 0.01 197.01)',
      foreground: 'oklch(0.38 0.06 212.66)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.95 0.01 197.01)',
      foreground: 'oklch(0.38 0.06 212.66)',
      card: 'oklch(0.97 0.01 197.07)',
      'card-foreground': 'oklch(0.38 0.06 212.66)',
      popover: 'oklch(0.97 0.01 197.07)',
      'popover-foreground': 'oklch(0.38 0.06 212.66)',

      // Primary colors
      primary: 'oklch(0.56 0.09 203.28)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.92 0.02 196.84)',
      'secondary-foreground': 'oklch(0.38 0.06 212.66)',

      // Muted colors
      muted: 'oklch(0.93 0.01 196.97)',
      'muted-foreground': 'oklch(0.54 0.06 201.57)',

      // Accent colors
      accent: 'oklch(0.90 0.03 201.89)',
      'accent-foreground': 'oklch(0.38 0.06 212.66)',

      // Destructive colors
      destructive: 'oklch(0.57 0.19 25.54)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.89 0.02 204.41)',
      input: 'oklch(0.92 0.02 196.84)',
      ring: 'oklch(0.56 0.09 203.28)',

      // Chart colors
      'chart-1': 'oklch(0.56 0.09 203.28)',
      'chart-2': 'oklch(0.64 0.10 201.59)',
      'chart-3': 'oklch(0.71 0.11 201.25)',
      'chart-4': 'oklch(0.77 0.10 201.18)',
      'chart-5': 'oklch(0.83 0.08 200.97)',

      // Sidebar colors
      sidebar: 'oklch(0.93 0.02 205.32)',
      'sidebar-foreground': 'oklch(0.38 0.06 212.66)',
      'sidebar-primary': 'oklch(0.56 0.09 203.28)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.90 0.03 201.89)',
      'sidebar-accent-foreground': 'oklch(0.38 0.06 212.66)',
      'sidebar-border': 'oklch(0.89 0.02 204.41)',
      'sidebar-ring': 'oklch(0.56 0.09 203.28)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.125rem',

      // Shadow system
      'shadow-color': 'oklch(0.30 0.294 185)',
      'shadow-opacity': '0.15',
      'shadow-blur': '2px',
      'shadow-spread': '0px',
      'shadow-offset-x': '1px',
      'shadow-offset-y': '1px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.21 0.02 224.45)',
      foreground: 'oklch(0.85 0.13 195.04)',
      card: 'oklch(0.23 0.03 216.07)',
      'card-foreground': 'oklch(0.85 0.13 195.04)',
      popover: 'oklch(0.23 0.03 216.07)',
      'popover-foreground': 'oklch(0.85 0.13 195.04)',

      // Primary colors
      primary: 'oklch(0.85 0.13 195.04)',
      'primary-foreground': 'oklch(0.21 0.02 224.45)',

      // Secondary colors
      secondary: 'oklch(0.38 0.06 216.50)',
      'secondary-foreground': 'oklch(0.85 0.13 195.04)',

      // Muted colors
      muted: 'oklch(0.29 0.04 218.82)',
      'muted-foreground': 'oklch(0.66 0.10 195.05)',

      // Accent colors
      accent: 'oklch(0.38 0.06 216.50)',
      'accent-foreground': 'oklch(0.85 0.13 195.04)',

      // Destructive colors
      destructive: 'oklch(0.62 0.21 25.81)',
      'destructive-foreground': 'oklch(0.96 0 0)',

      // Border and input
      border: 'oklch(0.38 0.06 216.50)',
      input: 'oklch(0.38 0.06 216.50)',
      ring: 'oklch(0.85 0.13 195.04)',

      // Chart colors
      'chart-1': 'oklch(0.85 0.13 195.04)',
      'chart-2': 'oklch(0.66 0.10 195.05)',
      'chart-3': 'oklch(0.58 0.08 195.07)',
      'chart-4': 'oklch(0.43 0.06 202.62)',
      'chart-5': 'oklch(0.31 0.05 204.16)',

      // Sidebar colors
      sidebar: 'oklch(0.21 0.02 224.45)',
      'sidebar-foreground': 'oklch(0.85 0.13 195.04)',
      'sidebar-primary': 'oklch(0.85 0.13 195.04)',
      'sidebar-primary-foreground': 'oklch(0.21 0.02 224.45)',
      'sidebar-accent': 'oklch(0.38 0.06 216.50)',
      'sidebar-accent-foreground': 'oklch(0.85 0.13 195.04)',
      'sidebar-border': 'oklch(0.38 0.06 216.50)',
      'sidebar-ring': 'oklch(0.85 0.13 195.04)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.125rem',

      // Shadow system
      'shadow-color': 'oklch(0.60 0.336 180)',
      'shadow-opacity': '0.2',
      'shadow-blur': '2px',
      'shadow-spread': '0px',
      'shadow-offset-x': '1px',
      'shadow-offset-y': '1px',
    },
  },

  {
    id: 'kodama-grove',
    name: 'Kodama Grove',
    category: 'nature',
    colors: {
      primary: 'oklch(0.67 0.11 118.91)',
      secondary: 'oklch(0.85 0.06 91.15)',
      accent: 'oklch(0.84 0.07 90.33)',
      background: 'oklch(0.88 0.05 91.79)',
      foreground: 'oklch(0.43 0.03 59.22)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.88 0.05 91.79)',
      foreground: 'oklch(0.43 0.03 59.22)',
      card: 'oklch(0.89 0.04 87.57)',
      'card-foreground': 'oklch(0.43 0.03 59.22)',
      popover: 'oklch(0.94 0.03 89.85)',
      'popover-foreground': 'oklch(0.43 0.03 59.22)',

      // Primary colors
      primary: 'oklch(0.67 0.11 118.91)',
      'primary-foreground': 'oklch(0.99 0.01 88.64)',

      // Secondary colors
      secondary: 'oklch(0.85 0.06 91.15)',
      'secondary-foreground': 'oklch(0.43 0.03 59.22)',

      // Muted colors
      muted: 'oklch(0.85 0.06 91.15)',
      'muted-foreground': 'oklch(0.58 0.03 60.93)',

      // Accent colors
      accent: 'oklch(0.84 0.07 90.33)',
      'accent-foreground': 'oklch(0.43 0.03 59.22)',

      // Destructive colors
      destructive: 'oklch(0.71 0.10 29.98)',
      'destructive-foreground': 'oklch(0.98 0.01 91.48)',

      // Border and input
      border: 'oklch(0.69 0.04 59.84)',
      input: 'oklch(0.84 0.07 90.33)',
      ring: 'oklch(0.73 0.06 130.85)',

      // Chart colors
      'chart-1': 'oklch(0.73 0.06 130.85)',
      'chart-2': 'oklch(0.68 0.06 132.45)',
      'chart-3': 'oklch(0.82 0.03 136.65)',
      'chart-4': 'oklch(0.59 0.05 137.62)',
      'chart-5': 'oklch(0.52 0.04 137.19)',

      // Sidebar colors
      sidebar: 'oklch(0.86 0.06 90.52)',
      'sidebar-foreground': 'oklch(0.43 0.03 59.22)',
      'sidebar-primary': 'oklch(0.73 0.06 130.85)',
      'sidebar-primary-foreground': 'oklch(0.99 0.01 88.64)',
      'sidebar-accent': 'oklch(0.92 0.02 88.00)',
      'sidebar-accent-foreground': 'oklch(0.43 0.03 59.22)',
      'sidebar-border': 'oklch(0.91 0.02 88.00)',
      'sidebar-ring': 'oklch(0.73 0.06 130.85)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.425rem',

      // Shadow system
      'shadow-color': 'oklch(0.35 0.100 88)',
      'shadow-opacity': '0.15',
      'shadow-blur': '2px',
      'shadow-spread': '0px',
      'shadow-offset-x': '3px',
      'shadow-offset-y': '3px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.33 0.02 88.07)',
      foreground: 'oklch(0.92 0.02 82.12)',
      card: 'oklch(0.36 0.02 82.33)',
      'card-foreground': 'oklch(0.92 0.02 82.12)',
      popover: 'oklch(0.36 0.02 82.33)',
      'popover-foreground': 'oklch(0.92 0.02 82.12)',

      // Primary colors
      primary: 'oklch(0.68 0.06 132.45)',
      'primary-foreground': 'oklch(0.27 0.01 61.02)',

      // Secondary colors
      secondary: 'oklch(0.44 0.02 84.55)',
      'secondary-foreground': 'oklch(0.92 0.02 82.12)',

      // Muted colors
      muted: 'oklch(0.39 0.02 82.71)',
      'muted-foreground': 'oklch(0.71 0.02 73.62)',

      // Accent colors
      accent: 'oklch(0.65 0.07 90.76)',
      'accent-foreground': 'oklch(0.27 0.01 61.02)',

      // Destructive colors
      destructive: 'oklch(0.63 0.08 31.30)',
      'destructive-foreground': 'oklch(0.94 0.02 84.59)',

      // Border and input
      border: 'oklch(0.44 0.02 84.55)',
      input: 'oklch(0.44 0.02 84.55)',
      ring: 'oklch(0.68 0.06 132.45)',

      // Chart colors
      'chart-1': 'oklch(0.68 0.06 132.45)',
      'chart-2': 'oklch(0.73 0.06 130.85)',
      'chart-3': 'oklch(0.59 0.05 137.62)',
      'chart-4': 'oklch(0.65 0.07 90.76)',
      'chart-5': 'oklch(0.52 0.04 137.19)',

      // Sidebar colors
      sidebar: 'oklch(0.33 0.02 88.07)',
      'sidebar-foreground': 'oklch(0.92 0.02 82.12)',
      'sidebar-primary': 'oklch(0.68 0.06 132.45)',
      'sidebar-primary-foreground': 'oklch(0.27 0.01 61.02)',
      'sidebar-accent': 'oklch(0.65 0.07 90.76)',
      'sidebar-accent-foreground': 'oklch(0.27 0.01 61.02)',
      'sidebar-border': 'oklch(0.44 0.02 84.55)',
      'sidebar-ring': 'oklch(0.68 0.06 132.45)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.425rem',

      // Shadow system
      'shadow-color': 'oklch(0.35 0.100 88)',
      'shadow-opacity': '0.15',
      'shadow-blur': '2px',
      'shadow-spread': '0px',
      'shadow-offset-x': '3px',
      'shadow-offset-y': '3px',
    },
  },

  {
    id: 'cosmic-night',
    name: 'Cosmic Night',
    category: 'nature',
    colors: {
      primary: 'oklch(0.54 0.18 288.03)',
      secondary: 'oklch(0.92 0.04 292.69)',
      accent: 'oklch(0.92 0.04 262.14)',
      background: 'oklch(0.97 0.01 286.15)',
      foreground: 'oklch(0.30 0.06 282.42)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.97 0.01 286.15)',
      foreground: 'oklch(0.30 0.06 282.42)',
      card: 'oklch(1.00 0 0)',
      'card-foreground': 'oklch(0.30 0.06 282.42)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.30 0.06 282.42)',

      // Primary colors
      primary: 'oklch(0.54 0.18 288.03)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.92 0.04 292.69)',
      'secondary-foreground': 'oklch(0.41 0.10 288.17)',

      // Muted colors
      muted: 'oklch(0.96 0.01 286.15)',
      'muted-foreground': 'oklch(0.54 0.05 284.74)',

      // Accent colors
      accent: 'oklch(0.92 0.04 262.14)',
      'accent-foreground': 'oklch(0.30 0.06 282.42)',

      // Destructive colors
      destructive: 'oklch(0.69 0.21 14.99)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.91 0.02 285.96)',
      input: 'oklch(0.91 0.02 285.96)',
      ring: 'oklch(0.54 0.18 288.03)',

      // Chart colors
      'chart-1': 'oklch(0.54 0.18 288.03)',
      'chart-2': 'oklch(0.70 0.16 288.99)',
      'chart-3': 'oklch(0.57 0.21 276.71)',
      'chart-4': 'oklch(0.64 0.19 281.81)',
      'chart-5': 'oklch(0.45 0.18 279.38)',

      // Sidebar colors
      sidebar: 'oklch(0.96 0.01 286.15)',
      'sidebar-foreground': 'oklch(0.30 0.06 282.42)',
      'sidebar-primary': 'oklch(0.54 0.18 288.03)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.92 0.04 262.14)',
      'sidebar-accent-foreground': 'oklch(0.30 0.06 282.42)',
      'sidebar-border': 'oklch(0.91 0.02 285.96)',
      'sidebar-ring': 'oklch(0.54 0.18 288.03)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.25 0.090 240)',
      'shadow-opacity': '0.12',
      'shadow-blur': '10px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '4px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.17 0.02 283.80)',
      foreground: 'oklch(0.92 0.03 285.88)',
      card: 'oklch(0.23 0.04 282.93)',
      'card-foreground': 'oklch(0.92 0.03 285.88)',
      popover: 'oklch(0.23 0.04 282.93)',
      'popover-foreground': 'oklch(0.92 0.03 285.88)',

      // Primary colors
      primary: 'oklch(0.72 0.16 290.40)',
      'primary-foreground': 'oklch(0.17 0.02 283.80)',

      // Secondary colors
      secondary: 'oklch(0.31 0.07 283.46)',
      'secondary-foreground': 'oklch(0.84 0.08 285.91)',

      // Muted colors
      muted: 'oklch(0.27 0.06 281.44)',
      'muted-foreground': 'oklch(0.72 0.05 285.17)',

      // Accent colors
      accent: 'oklch(0.34 0.08 280.97)',
      'accent-foreground': 'oklch(0.92 0.03 285.88)',

      // Destructive colors
      destructive: 'oklch(0.69 0.21 14.99)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.33 0.06 282.58)',
      input: 'oklch(0.33 0.06 282.58)',
      ring: 'oklch(0.72 0.16 290.40)',

      // Chart colors
      'chart-1': 'oklch(0.72 0.16 290.40)',
      'chart-2': 'oklch(0.64 0.10 274.91)',
      'chart-3': 'oklch(0.75 0.12 244.75)',
      'chart-4': 'oklch(0.71 0.10 186.68)',
      'chart-5': 'oklch(0.75 0.18 346.81)',

      // Sidebar colors
      sidebar: 'oklch(0.23 0.04 282.93)',
      'sidebar-foreground': 'oklch(0.92 0.03 285.88)',
      'sidebar-primary': 'oklch(0.72 0.16 290.40)',
      'sidebar-primary-foreground': 'oklch(0.17 0.02 283.80)',
      'sidebar-accent': 'oklch(0.34 0.08 280.97)',
      'sidebar-accent-foreground': 'oklch(0.92 0.03 285.88)',
      'sidebar-border': 'oklch(0.33 0.06 282.58)',
      'sidebar-ring': 'oklch(0.72 0.16 290.40)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.25 0.090 240)',
      'shadow-opacity': '0.12',
      'shadow-blur': '10px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '4px',
    },
  },

  {
    id: 'tangerine',
    name: 'Tangerine',
    category: 'creative',
    colors: {
      primary: 'oklch(0.64 0.17 36.44)',
      secondary: 'oklch(0.97 0.00 264.54)',
      accent: 'oklch(0.91 0.02 243.82)',
      background: 'oklch(0.94 0.00 236.50)',
      foreground: 'oklch(0.32 0 0)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.94 0.00 236.50)',
      foreground: 'oklch(0.32 0 0)',
      card: 'oklch(1.00 0 0)',
      'card-foreground': 'oklch(0.32 0 0)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.32 0 0)',

      // Primary colors
      primary: 'oklch(0.64 0.17 36.44)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.97 0.00 264.54)',
      'secondary-foreground': 'oklch(0.45 0.03 256.80)',

      // Muted colors
      muted: 'oklch(0.98 0.00 247.84)',
      'muted-foreground': 'oklch(0.55 0.02 264.36)',

      // Accent colors
      accent: 'oklch(0.91 0.02 243.82)',
      'accent-foreground': 'oklch(0.38 0.14 265.52)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.90 0.01 247.88)',
      input: 'oklch(0.97 0.00 264.54)',
      ring: 'oklch(0.64 0.17 36.44)',

      // Chart colors
      'chart-1': 'oklch(0.72 0.06 248.68)',
      'chart-2': 'oklch(0.79 0.09 35.96)',
      'chart-3': 'oklch(0.58 0.08 254.16)',
      'chart-4': 'oklch(0.50 0.08 259.49)',
      'chart-5': 'oklch(0.42 0.10 264.03)',

      // Sidebar colors
      sidebar: 'oklch(0.90 0.00 258.33)',
      'sidebar-foreground': 'oklch(0.32 0 0)',
      'sidebar-primary': 'oklch(0.64 0.17 36.44)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.91 0.02 243.82)',
      'sidebar-accent-foreground': 'oklch(0.38 0.14 265.52)',
      'sidebar-border': 'oklch(0.93 0.01 264.53)',
      'sidebar-ring': 'oklch(0.64 0.17 36.44)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.75rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '1px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.26 0.03 262.67)',
      foreground: 'oklch(0.92 0 0)',
      card: 'oklch(0.31 0.03 268.64)',
      'card-foreground': 'oklch(0.92 0 0)',
      popover: 'oklch(0.29 0.02 268.40)',
      'popover-foreground': 'oklch(0.92 0 0)',

      // Primary colors
      primary: 'oklch(0.64 0.17 36.44)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.31 0.03 266.71)',
      'secondary-foreground': 'oklch(0.92 0 0)',

      // Muted colors
      muted: 'oklch(0.31 0.03 266.71)',
      'muted-foreground': 'oklch(0.72 0 0)',

      // Accent colors
      accent: 'oklch(0.34 0.06 267.59)',
      'accent-foreground': 'oklch(0.88 0.06 254.13)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.38 0.03 269.73)',
      input: 'oklch(0.38 0.03 269.73)',
      ring: 'oklch(0.64 0.17 36.44)',

      // Chart colors
      'chart-1': 'oklch(0.72 0.06 248.68)',
      'chart-2': 'oklch(0.77 0.09 34.19)',
      'chart-3': 'oklch(0.58 0.08 254.16)',
      'chart-4': 'oklch(0.50 0.08 259.49)',
      'chart-5': 'oklch(0.42 0.10 264.03)',

      // Sidebar colors
      sidebar: 'oklch(0.31 0.03 267.74)',
      'sidebar-foreground': 'oklch(0.92 0 0)',
      'sidebar-primary': 'oklch(0.64 0.17 36.44)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.34 0.06 267.59)',
      'sidebar-accent-foreground': 'oklch(0.88 0.06 254.13)',
      'sidebar-border': 'oklch(0.38 0.03 269.73)',
      'sidebar-ring': 'oklch(0.64 0.17 36.44)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.75rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '1px',
    },
  },

  {
    id: 'quantum-rose',
    name: 'Quantum Rose',
    category: 'creative',
    colors: {
      primary: 'oklch(0.60 0.24 0.13)',
      secondary: 'oklch(0.92 0.07 326.13)',
      accent: 'oklch(0.88 0.08 344.88)',
      background: 'oklch(0.97 0.02 343.93)',
      foreground: 'oklch(0.44 0.17 352.38)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.97 0.02 343.93)',
      foreground: 'oklch(0.44 0.17 352.38)',
      card: 'oklch(0.98 0.01 339.33)',
      'card-foreground': 'oklch(0.44 0.17 352.38)',
      popover: 'oklch(0.98 0.01 339.33)',
      'popover-foreground': 'oklch(0.44 0.17 352.38)',

      // Primary colors
      primary: 'oklch(0.60 0.24 0.13)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.92 0.07 326.13)',
      'secondary-foreground': 'oklch(0.44 0.17 352.38)',

      // Muted colors
      muted: 'oklch(0.94 0.04 344.26)',
      'muted-foreground': 'oklch(0.57 0.17 352.05)',

      // Accent colors
      accent: 'oklch(0.88 0.08 344.88)',
      'accent-foreground': 'oklch(0.44 0.17 352.38)',

      // Destructive colors
      destructive: 'oklch(0.58 0.19 6.34)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.89 0.07 344.39)',
      input: 'oklch(0.92 0.07 326.13)',
      ring: 'oklch(0.60 0.24 0.13)',

      // Chart colors
      'chart-1': 'oklch(0.60 0.24 0.13)',
      'chart-2': 'oklch(0.60 0.17 345.04)',
      'chart-3': 'oklch(0.60 0.12 311.80)',
      'chart-4': 'oklch(0.58 0.12 283.29)',
      'chart-5': 'oklch(0.65 0.19 267.97)',

      // Sidebar colors
      sidebar: 'oklch(0.96 0.02 345.75)',
      'sidebar-foreground': 'oklch(0.44 0.17 352.38)',
      'sidebar-primary': 'oklch(0.60 0.24 0.13)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.88 0.08 344.88)',
      'sidebar-accent-foreground': 'oklch(0.44 0.17 352.38)',
      'sidebar-border': 'oklch(0.93 0.04 343.31)',
      'sidebar-ring': 'oklch(0.60 0.24 0.13)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.30 0.294 330)',
      'shadow-opacity': '0.18',
      'shadow-blur': '0px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '3px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.18 0.05 313.72)',
      foreground: 'oklch(0.86 0.13 326.64)',
      card: 'oklch(0.24 0.07 313.23)',
      'card-foreground': 'oklch(0.86 0.13 326.64)',
      popover: 'oklch(0.24 0.07 313.23)',
      'popover-foreground': 'oklch(0.86 0.13 326.64)',

      // Primary colors
      primary: 'oklch(0.75 0.23 332.02)',
      'primary-foreground': 'oklch(0.16 0.05 327.57)',

      // Secondary colors
      secondary: 'oklch(0.32 0.09 319.65)',
      'secondary-foreground': 'oklch(0.86 0.13 326.64)',

      // Muted colors
      muted: 'oklch(0.27 0.08 312.35)',
      'muted-foreground': 'oklch(0.71 0.16 327.11)',

      // Accent colors
      accent: 'oklch(0.36 0.12 325.77)',
      'accent-foreground': 'oklch(0.86 0.13 326.64)',

      // Destructive colors
      destructive: 'oklch(0.65 0.24 7.17)',
      'destructive-foreground': 'oklch(0.98 0 0)',

      // Border and input
      border: 'oklch(0.33 0.12 313.54)',
      input: 'oklch(0.32 0.09 319.65)',
      ring: 'oklch(0.75 0.23 332.02)',

      // Chart colors
      'chart-1': 'oklch(0.75 0.23 332.02)',
      'chart-2': 'oklch(0.65 0.22 317.63)',
      'chart-3': 'oklch(0.62 0.22 292.77)',
      'chart-4': 'oklch(0.61 0.16 278.72)',
      'chart-5': 'oklch(0.62 0.20 268.05)',

      // Sidebar colors
      sidebar: 'oklch(0.19 0.05 311.40)',
      'sidebar-foreground': 'oklch(0.86 0.13 326.64)',
      'sidebar-primary': 'oklch(0.75 0.23 332.02)',
      'sidebar-primary-foreground': 'oklch(0.16 0.05 327.57)',
      'sidebar-accent': 'oklch(0.36 0.12 325.77)',
      'sidebar-accent-foreground': 'oklch(0.86 0.13 326.64)',
      'sidebar-border': 'oklch(0.33 0.12 313.54)',
      'sidebar-ring': 'oklch(0.75 0.23 332.02)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.50 0.400 300)',
      'shadow-opacity': '0.18',
      'shadow-blur': '0px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '3px',
    },
  },

  {
    id: 'nature',
    name: 'Nature',
    category: 'nature',
    colors: {
      primary: 'oklch(0.52 0.13 144.17)',
      secondary: 'oklch(0.96 0.02 147.64)',
      accent: 'oklch(0.90 0.05 146.04)',
      background: 'oklch(0.97 0.01 80.72)',
      foreground: 'oklch(0.30 0.04 30.20)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.97 0.01 80.72)',
      foreground: 'oklch(0.30 0.04 30.20)',
      card: 'oklch(0.97 0.01 80.72)',
      'card-foreground': 'oklch(0.30 0.04 30.20)',
      popover: 'oklch(0.97 0.01 80.72)',
      'popover-foreground': 'oklch(0.30 0.04 30.20)',

      // Primary colors
      primary: 'oklch(0.52 0.13 144.17)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.96 0.02 147.64)',
      'secondary-foreground': 'oklch(0.43 0.12 144.31)',

      // Muted colors
      muted: 'oklch(0.94 0.01 74.42)',
      'muted-foreground': 'oklch(0.45 0.05 39.21)',

      // Accent colors
      accent: 'oklch(0.90 0.05 146.04)',
      'accent-foreground': 'oklch(0.43 0.12 144.31)',

      // Destructive colors
      destructive: 'oklch(0.54 0.19 26.72)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.88 0.02 74.64)',
      input: 'oklch(0.88 0.02 74.64)',
      ring: 'oklch(0.52 0.13 144.17)',

      // Chart colors
      'chart-1': 'oklch(0.67 0.16 144.21)',
      'chart-2': 'oklch(0.58 0.14 144.18)',
      'chart-3': 'oklch(0.52 0.13 144.17)',
      'chart-4': 'oklch(0.43 0.12 144.31)',
      'chart-5': 'oklch(0.22 0.05 145.73)',

      // Sidebar colors
      sidebar: 'oklch(0.94 0.01 74.42)',
      'sidebar-foreground': 'oklch(0.30 0.04 30.20)',
      'sidebar-primary': 'oklch(0.52 0.13 144.17)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.90 0.05 146.04)',
      'sidebar-accent-foreground': 'oklch(0.43 0.12 144.31)',
      'sidebar-border': 'oklch(0.88 0.02 74.64)',
      'sidebar-ring': 'oklch(0.52 0.13 144.17)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0',
      'shadow-offset-y': '1px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.27 0.03 150.77)',
      foreground: 'oklch(0.94 0.01 72.66)',
      card: 'oklch(0.33 0.03 146.99)',
      'card-foreground': 'oklch(0.94 0.01 72.66)',
      popover: 'oklch(0.33 0.03 146.99)',
      'popover-foreground': 'oklch(0.94 0.01 72.66)',

      // Primary colors
      primary: 'oklch(0.67 0.16 144.21)',
      'primary-foreground': 'oklch(0.22 0.05 145.73)',

      // Secondary colors
      secondary: 'oklch(0.39 0.03 142.99)',
      'secondary-foreground': 'oklch(0.90 0.02 142.55)',

      // Muted colors
      muted: 'oklch(0.33 0.03 146.99)',
      'muted-foreground': 'oklch(0.86 0.02 76.10)',

      // Accent colors
      accent: 'oklch(0.58 0.14 144.18)',
      'accent-foreground': 'oklch(0.94 0.01 72.66)',

      // Destructive colors
      destructive: 'oklch(0.54 0.19 26.72)',
      'destructive-foreground': 'oklch(0.94 0.01 72.66)',

      // Border and input
      border: 'oklch(0.39 0.03 142.99)',
      input: 'oklch(0.39 0.03 142.99)',
      ring: 'oklch(0.67 0.16 144.21)',

      // Chart colors
      'chart-1': 'oklch(0.77 0.12 145.30)',
      'chart-2': 'oklch(0.72 0.14 144.89)',
      'chart-3': 'oklch(0.67 0.16 144.21)',
      'chart-4': 'oklch(0.63 0.15 144.20)',
      'chart-5': 'oklch(0.58 0.14 144.18)',

      // Sidebar colors
      sidebar: 'oklch(0.27 0.03 150.77)',
      'sidebar-foreground': 'oklch(0.94 0.01 72.66)',
      'sidebar-primary': 'oklch(0.67 0.16 144.21)',
      'sidebar-primary-foreground': 'oklch(0.22 0.05 145.73)',
      'sidebar-accent': 'oklch(0.58 0.14 144.18)',
      'sidebar-accent-foreground': 'oklch(0.94 0.01 72.66)',
      'sidebar-border': 'oklch(0.39 0.03 142.99)',
      'sidebar-ring': 'oklch(0.67 0.16 144.21)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0',
      'shadow-offset-y': '1px',
    },
  },

  {
    id: 'bold-tech',
    name: 'Bold Tech',
    category: 'creative',
    colors: {
      primary: 'oklch(0.61 0.22 292.72)',
      secondary: 'oklch(0.96 0.02 295.19)',
      accent: 'oklch(0.93 0.03 255.59)',
      background: 'oklch(1.00 0 0)',
      foreground: 'oklch(0.36 0.14 278.70)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(1.00 0 0)',
      foreground: 'oklch(0.36 0.14 278.70)',
      card: 'oklch(1.00 0 0)',
      'card-foreground': 'oklch(0.36 0.14 278.70)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.36 0.14 278.70)',

      // Primary colors
      primary: 'oklch(0.61 0.22 292.72)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.96 0.02 295.19)',
      'secondary-foreground': 'oklch(0.46 0.21 277.02)',

      // Muted colors
      muted: 'oklch(0.97 0.02 293.76)',
      'muted-foreground': 'oklch(0.54 0.25 293.01)',

      // Accent colors
      accent: 'oklch(0.93 0.03 255.59)',
      'accent-foreground': 'oklch(0.42 0.18 265.64)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.93 0.03 272.79)',
      input: 'oklch(0.93 0.03 272.79)',
      ring: 'oklch(0.61 0.22 292.72)',

      // Chart colors
      'chart-1': 'oklch(0.61 0.22 292.72)',
      'chart-2': 'oklch(0.54 0.25 293.01)',
      'chart-3': 'oklch(0.49 0.24 292.58)',
      'chart-4': 'oklch(0.43 0.21 292.76)',
      'chart-5': 'oklch(0.38 0.18 293.74)',

      // Sidebar colors
      sidebar: 'oklch(0.97 0.02 293.76)',
      'sidebar-foreground': 'oklch(0.36 0.14 278.70)',
      'sidebar-primary': 'oklch(0.61 0.22 292.72)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.93 0.03 255.59)',
      'sidebar-accent-foreground': 'oklch(0.42 0.18 265.64)',
      'sidebar-border': 'oklch(0.93 0.03 272.79)',
      'sidebar-ring': 'oklch(0.61 0.22 292.72)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.625rem',

      // Shadow system
      'shadow-color': 'oklch(0.66 0.258 255)',
      'shadow-opacity': '0.2',
      'shadow-blur': '4px',
      'shadow-spread': '0px',
      'shadow-offset-x': '2px',
      'shadow-offset-y': '2px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.21 0.04 265.75)',
      foreground: 'oklch(0.93 0.03 272.79)',
      card: 'oklch(0.26 0.09 281.29)',
      'card-foreground': 'oklch(0.93 0.03 272.79)',
      popover: 'oklch(0.26 0.09 281.29)',
      'popover-foreground': 'oklch(0.93 0.03 272.79)',

      // Primary colors
      primary: 'oklch(0.61 0.22 292.72)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.26 0.09 281.29)',
      'secondary-foreground': 'oklch(0.93 0.03 272.79)',

      // Muted colors
      muted: 'oklch(0.26 0.09 281.29)',
      'muted-foreground': 'oklch(0.81 0.10 293.57)',

      // Accent colors
      accent: 'oklch(0.46 0.21 277.02)',
      'accent-foreground': 'oklch(0.93 0.03 272.79)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.28 0.14 291.09)',
      input: 'oklch(0.28 0.14 291.09)',
      ring: 'oklch(0.61 0.22 292.72)',

      // Chart colors
      'chart-1': 'oklch(0.71 0.16 293.54)',
      'chart-2': 'oklch(0.61 0.22 292.72)',
      'chart-3': 'oklch(0.54 0.25 293.01)',
      'chart-4': 'oklch(0.49 0.24 292.58)',
      'chart-5': 'oklch(0.43 0.21 292.76)',

      // Sidebar colors
      sidebar: 'oklch(0.21 0.04 265.75)',
      'sidebar-foreground': 'oklch(0.93 0.03 272.79)',
      'sidebar-primary': 'oklch(0.61 0.22 292.72)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.46 0.21 277.02)',
      'sidebar-accent-foreground': 'oklch(0.93 0.03 272.79)',
      'sidebar-border': 'oklch(0.28 0.14 291.09)',
      'sidebar-ring': 'oklch(0.61 0.22 292.72)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.625rem',

      // Shadow system
      'shadow-color': 'oklch(0.66 0.258 255)',
      'shadow-opacity': '0.2',
      'shadow-blur': '4px',
      'shadow-spread': '0px',
      'shadow-offset-x': '2px',
      'shadow-offset-y': '2px',
    },
  },

  {
    id: 'elegant-luxury',
    name: 'Elegant Luxury',
    category: 'creative',
    colors: {
      primary: 'oklch(0.47 0.15 24.94)',
      secondary: 'oklch(0.96 0.04 89.09)',
      accent: 'oklch(0.96 0.06 95.62)',
      background: 'oklch(0.98 0.00 56.38)',
      foreground: 'oklch(0.22 0 0)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.98 0.00 56.38)',
      foreground: 'oklch(0.22 0 0)',
      card: 'oklch(0.98 0.00 56.38)',
      'card-foreground': 'oklch(0.22 0 0)',
      popover: 'oklch(0.98 0.00 56.38)',
      'popover-foreground': 'oklch(0.22 0 0)',

      // Primary colors
      primary: 'oklch(0.47 0.15 24.94)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.96 0.04 89.09)',
      'secondary-foreground': 'oklch(0.48 0.10 75.12)',

      // Muted colors
      muted: 'oklch(0.94 0.01 53.44)',
      'muted-foreground': 'oklch(0.44 0.01 73.64)',

      // Accent colors
      accent: 'oklch(0.96 0.06 95.62)',
      'accent-foreground': 'oklch(0.40 0.13 25.72)',

      // Destructive colors
      destructive: 'oklch(0.44 0.16 26.90)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.94 0.03 80.99)',
      input: 'oklch(0.94 0.03 80.99)',
      ring: 'oklch(0.47 0.15 24.94)',

      // Chart colors
      'chart-1': 'oklch(0.51 0.19 27.52)',
      'chart-2': 'oklch(0.47 0.15 24.94)',
      'chart-3': 'oklch(0.40 0.13 25.72)',
      'chart-4': 'oklch(0.56 0.15 49.00)',
      'chart-5': 'oklch(0.47 0.12 46.20)',

      // Sidebar colors
      sidebar: 'oklch(0.94 0.01 53.44)',
      'sidebar-foreground': 'oklch(0.22 0 0)',
      'sidebar-primary': 'oklch(0.47 0.15 24.94)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.96 0.06 95.62)',
      'sidebar-accent-foreground': 'oklch(0.40 0.13 25.72)',
      'sidebar-border': 'oklch(0.94 0.03 80.99)',
      'sidebar-ring': 'oklch(0.47 0.15 24.94)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.375rem',

      // Shadow system
      'shadow-color': 'oklch(0.18 0.189 0)',
      'shadow-opacity': '0.12',
      'shadow-blur': '16px',
      'shadow-spread': '-2px',
      'shadow-offset-x': '1px',
      'shadow-offset-y': '1px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.22 0.01 56.04)',
      foreground: 'oklch(0.97 0.00 106.42)',
      card: 'oklch(0.27 0.01 34.30)',
      'card-foreground': 'oklch(0.97 0.00 106.42)',
      popover: 'oklch(0.27 0.01 34.30)',
      'popover-foreground': 'oklch(0.97 0.00 106.42)',

      // Primary colors
      primary: 'oklch(0.51 0.19 27.52)',
      'primary-foreground': 'oklch(0.98 0.00 56.38)',

      // Secondary colors
      secondary: 'oklch(0.47 0.12 46.20)',
      'secondary-foreground': 'oklch(0.96 0.06 95.62)',

      // Muted colors
      muted: 'oklch(0.27 0.01 34.30)',
      'muted-foreground': 'oklch(0.87 0.00 56.37)',

      // Accent colors
      accent: 'oklch(0.56 0.15 49.00)',
      'accent-foreground': 'oklch(0.96 0.06 95.62)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.37 0.01 67.56)',
      input: 'oklch(0.37 0.01 67.56)',
      ring: 'oklch(0.51 0.19 27.52)',

      // Chart colors
      'chart-1': 'oklch(0.71 0.17 22.22)',
      'chart-2': 'oklch(0.64 0.21 25.33)',
      'chart-3': 'oklch(0.58 0.22 27.33)',
      'chart-4': 'oklch(0.84 0.16 84.43)',
      'chart-5': 'oklch(0.77 0.16 70.08)',

      // Sidebar colors
      sidebar: 'oklch(0.22 0.01 56.04)',
      'sidebar-foreground': 'oklch(0.97 0.00 106.42)',
      'sidebar-primary': 'oklch(0.51 0.19 27.52)',
      'sidebar-primary-foreground': 'oklch(0.98 0.00 56.38)',
      'sidebar-accent': 'oklch(0.56 0.15 49.00)',
      'sidebar-accent-foreground': 'oklch(0.96 0.06 95.62)',
      'sidebar-border': 'oklch(0.37 0.01 67.56)',
      'sidebar-ring': 'oklch(0.51 0.19 27.52)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.375rem',

      // Shadow system
      'shadow-color': 'oklch(0.18 0.189 0)',
      'shadow-opacity': '0.12',
      'shadow-blur': '16px',
      'shadow-spread': '-2px',
      'shadow-offset-x': '1px',
      'shadow-offset-y': '1px',
    },
  },

  {
    id: 'amber-minimal',
    name: 'Amber Minimal',
    category: 'creative',
    colors: {
      primary: 'oklch(0.77 0.16 70.08)',
      secondary: 'oklch(0.97 0.00 264.54)',
      accent: 'oklch(0.99 0.02 95.28)',
      background: 'oklch(1.00 0 0)',
      foreground: 'oklch(0.27 0 0)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(1.00 0 0)',
      foreground: 'oklch(0.27 0 0)',
      card: 'oklch(1.00 0 0)',
      'card-foreground': 'oklch(0.27 0 0)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.27 0 0)',

      // Primary colors
      primary: 'oklch(0.77 0.16 70.08)',
      'primary-foreground': 'oklch(0 0 0)',

      // Secondary colors
      secondary: 'oklch(0.97 0.00 264.54)',
      'secondary-foreground': 'oklch(0.45 0.03 256.80)',

      // Muted colors
      muted: 'oklch(0.98 0.00 247.84)',
      'muted-foreground': 'oklch(0.55 0.02 264.36)',

      // Accent colors
      accent: 'oklch(0.99 0.02 95.28)',
      'accent-foreground': 'oklch(0.47 0.12 46.20)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.93 0.01 264.53)',
      input: 'oklch(0.93 0.01 264.53)',
      ring: 'oklch(0.77 0.16 70.08)',

      // Chart colors
      'chart-1': 'oklch(0.77 0.16 70.08)',
      'chart-2': 'oklch(0.67 0.16 58.32)',
      'chart-3': 'oklch(0.56 0.15 49.00)',
      'chart-4': 'oklch(0.47 0.12 46.20)',
      'chart-5': 'oklch(0.41 0.11 45.90)',

      // Sidebar colors
      sidebar: 'oklch(0.98 0.00 247.84)',
      'sidebar-foreground': 'oklch(0.27 0 0)',
      'sidebar-primary': 'oklch(0.77 0.16 70.08)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.99 0.02 95.28)',
      'sidebar-accent-foreground': 'oklch(0.47 0.12 46.20)',
      'sidebar-border': 'oklch(0.93 0.01 264.53)',
      'sidebar-ring': 'oklch(0.77 0.16 70.08)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.375rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '8px',
      'shadow-spread': '-1px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '4px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.20 0 0)',
      foreground: 'oklch(0.92 0 0)',
      card: 'oklch(0.27 0 0)',
      'card-foreground': 'oklch(0.92 0 0)',
      popover: 'oklch(0.27 0 0)',
      'popover-foreground': 'oklch(0.92 0 0)',

      // Primary colors
      primary: 'oklch(0.77 0.16 70.08)',
      'primary-foreground': 'oklch(0 0 0)',

      // Secondary colors
      secondary: 'oklch(0.27 0 0)',
      'secondary-foreground': 'oklch(0.92 0 0)',

      // Muted colors
      muted: 'oklch(0.27 0 0)',
      'muted-foreground': 'oklch(0.72 0 0)',

      // Accent colors
      accent: 'oklch(0.47 0.12 46.20)',
      'accent-foreground': 'oklch(0.92 0.12 95.75)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.37 0 0)',
      input: 'oklch(0.37 0 0)',
      ring: 'oklch(0.77 0.16 70.08)',

      // Chart colors
      'chart-1': 'oklch(0.84 0.16 84.43)',
      'chart-2': 'oklch(0.67 0.16 58.32)',
      'chart-3': 'oklch(0.47 0.12 46.20)',
      'chart-4': 'oklch(0.56 0.15 49.00)',
      'chart-5': 'oklch(0.47 0.12 46.20)',

      // Sidebar colors
      sidebar: 'oklch(0.17 0 0)',
      'sidebar-foreground': 'oklch(0.92 0 0)',
      'sidebar-primary': 'oklch(0.77 0.16 70.08)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.47 0.12 46.20)',
      'sidebar-accent-foreground': 'oklch(0.92 0.12 95.75)',
      'sidebar-border': 'oklch(0.37 0 0)',
      'sidebar-ring': 'oklch(0.77 0.16 70.08)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.375rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '8px',
      'shadow-spread': '-1px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '4px',
    },
  },

  {
    id: 'solar-dusk',
    name: 'Solar Dusk',
    category: 'creative',
    colors: {
      primary: 'oklch(0.56 0.15 49.00)',
      secondary: 'oklch(0.83 0.08 74.44)',
      accent: 'oklch(0.90 0.05 74.99)',
      background: 'oklch(0.99 0.01 84.57)',
      foreground: 'oklch(0.37 0.03 49.61)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.99 0.01 84.57)',
      foreground: 'oklch(0.37 0.03 49.61)',
      card: 'oklch(0.97 0.01 78.28)',
      'card-foreground': 'oklch(0.37 0.03 49.61)',
      popover: 'oklch(0.97 0.01 78.28)',
      'popover-foreground': 'oklch(0.37 0.03 49.61)',

      // Primary colors
      primary: 'oklch(0.56 0.15 49.00)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.83 0.08 74.44)',
      'secondary-foreground': 'oklch(0.44 0.01 73.64)',

      // Muted colors
      muted: 'oklch(0.94 0.02 83.26)',
      'muted-foreground': 'oklch(0.55 0.01 58.07)',

      // Accent colors
      accent: 'oklch(0.90 0.05 74.99)',
      'accent-foreground': 'oklch(0.44 0.01 73.64)',

      // Destructive colors
      destructive: 'oklch(0.44 0.16 26.90)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.89 0.04 89.70)',
      input: 'oklch(0.89 0.04 89.70)',
      ring: 'oklch(0.56 0.15 49.00)',

      // Chart colors
      'chart-1': 'oklch(0.56 0.15 49.00)',
      'chart-2': 'oklch(0.55 0.01 58.07)',
      'chart-3': 'oklch(0.55 0.12 66.44)',
      'chart-4': 'oklch(0.55 0.01 58.07)',
      'chart-5': 'oklch(0.68 0.14 75.83)',

      // Sidebar colors
      sidebar: 'oklch(0.94 0.02 83.26)',
      'sidebar-foreground': 'oklch(0.37 0.03 49.61)',
      'sidebar-primary': 'oklch(0.56 0.15 49.00)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.55 0.12 66.44)',
      'sidebar-accent-foreground': 'oklch(1.00 0 0)',
      'sidebar-border': 'oklch(0.89 0.04 89.70)',
      'sidebar-ring': 'oklch(0.56 0.15 49.00)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.3rem',

      // Shadow system
      'shadow-color': 'oklch(0.25 0.054 28)',
      'shadow-opacity': '0.18',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '2px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.22 0.01 56.04)',
      foreground: 'oklch(0.97 0.00 106.42)',
      card: 'oklch(0.27 0.01 34.30)',
      'card-foreground': 'oklch(0.97 0.00 106.42)',
      popover: 'oklch(0.27 0.01 34.30)',
      'popover-foreground': 'oklch(0.97 0.00 106.42)',

      // Primary colors
      primary: 'oklch(0.70 0.19 47.60)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.44 0.01 73.64)',
      'secondary-foreground': 'oklch(0.92 0.00 48.72)',

      // Muted colors
      muted: 'oklch(0.27 0.01 34.30)',
      'muted-foreground': 'oklch(0.72 0.01 56.26)',

      // Accent colors
      accent: 'oklch(0.36 0.05 229.32)',
      'accent-foreground': 'oklch(0.92 0.00 48.72)',

      // Destructive colors
      destructive: 'oklch(0.58 0.22 27.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.37 0.01 67.56)',
      input: 'oklch(0.37 0.01 67.56)',
      ring: 'oklch(0.70 0.19 47.60)',

      // Chart colors
      'chart-1': 'oklch(0.70 0.19 47.60)',
      'chart-2': 'oklch(0.68 0.15 237.32)',
      'chart-3': 'oklch(0.80 0.16 86.05)',
      'chart-4': 'oklch(0.72 0.01 56.26)',
      'chart-5': 'oklch(0.55 0.01 58.07)',

      // Sidebar colors
      sidebar: 'oklch(0.27 0.01 34.30)',
      'sidebar-foreground': 'oklch(0.97 0.00 106.42)',
      'sidebar-primary': 'oklch(0.70 0.19 47.60)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.68 0.15 237.32)',
      'sidebar-accent-foreground': 'oklch(0.28 0.07 254.54)',
      'sidebar-border': 'oklch(0.37 0.01 67.56)',
      'sidebar-ring': 'oklch(0.70 0.19 47.60)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.3rem',

      // Shadow system
      'shadow-color': 'oklch(0.05 0.000 0)',
      'shadow-opacity': '0.18',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '2px',
    },
  },

  {
    id: 'claymorphism',
    name: 'Claymorphism',
    category: 'creative',
    colors: {
      primary: 'oklch(0.59 0.20 277.12)',
      secondary: 'oklch(0.87 0.00 56.37)',
      accent: 'oklch(0.94 0.03 321.94)',
      background: 'oklch(0.92 0.00 48.72)',
      foreground: 'oklch(0.28 0.04 260.03)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.92 0.00 48.72)',
      foreground: 'oklch(0.28 0.04 260.03)',
      card: 'oklch(0.97 0.00 106.42)',
      'card-foreground': 'oklch(0.28 0.04 260.03)',
      popover: 'oklch(0.97 0.00 106.42)',
      'popover-foreground': 'oklch(0.28 0.04 260.03)',

      // Primary colors
      primary: 'oklch(0.59 0.20 277.12)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.87 0.00 56.37)',
      'secondary-foreground': 'oklch(0.45 0.03 256.80)',

      // Muted colors
      muted: 'oklch(0.92 0.00 48.72)',
      'muted-foreground': 'oklch(0.55 0.02 264.36)',

      // Accent colors
      accent: 'oklch(0.94 0.03 321.94)',
      'accent-foreground': 'oklch(0.37 0.03 259.73)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.87 0.00 56.37)',
      input: 'oklch(0.87 0.00 56.37)',
      ring: 'oklch(0.59 0.20 277.12)',

      // Chart colors
      'chart-1': 'oklch(0.59 0.20 277.12)',
      'chart-2': 'oklch(0.51 0.23 276.97)',
      'chart-3': 'oklch(0.46 0.21 277.02)',
      'chart-4': 'oklch(0.40 0.18 277.37)',
      'chart-5': 'oklch(0.36 0.14 278.70)',

      // Sidebar colors
      sidebar: 'oklch(0.87 0.00 56.37)',
      'sidebar-foreground': 'oklch(0.28 0.04 260.03)',
      'sidebar-primary': 'oklch(0.59 0.20 277.12)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.94 0.03 321.94)',
      'sidebar-accent-foreground': 'oklch(0.37 0.03 259.73)',
      'sidebar-border': 'oklch(0.87 0.00 56.37)',
      'sidebar-ring': 'oklch(0.59 0.20 277.12)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '1.25rem',

      // Shadow system
      'shadow-color': 'oklch(0.60 0.012 240)',
      'shadow-opacity': '0.18',
      'shadow-blur': '10px',
      'shadow-spread': '4px',
      'shadow-offset-x': '2px',
      'shadow-offset-y': '2px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.22 0.01 67.44)',
      foreground: 'oklch(0.93 0.01 255.51)',
      card: 'oklch(0.28 0.01 59.34)',
      'card-foreground': 'oklch(0.93 0.01 255.51)',
      popover: 'oklch(0.28 0.01 59.34)',
      'popover-foreground': 'oklch(0.93 0.01 255.51)',

      // Primary colors
      primary: 'oklch(0.68 0.16 276.93)',
      'primary-foreground': 'oklch(0.22 0.01 67.44)',

      // Secondary colors
      secondary: 'oklch(0.34 0.01 59.42)',
      'secondary-foreground': 'oklch(0.87 0.01 258.34)',

      // Muted colors
      muted: 'oklch(0.28 0.01 59.34)',
      'muted-foreground': 'oklch(0.71 0.02 261.32)',

      // Accent colors
      accent: 'oklch(0.39 0.01 59.47)',
      'accent-foreground': 'oklch(0.87 0.01 258.34)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(0.22 0.01 67.44)',

      // Border and input
      border: 'oklch(0.34 0.01 59.42)',
      input: 'oklch(0.34 0.01 59.42)',
      ring: 'oklch(0.68 0.16 276.93)',

      // Chart colors
      'chart-1': 'oklch(0.68 0.16 276.93)',
      'chart-2': 'oklch(0.59 0.20 277.12)',
      'chart-3': 'oklch(0.51 0.23 276.97)',
      'chart-4': 'oklch(0.46 0.21 277.02)',
      'chart-5': 'oklch(0.40 0.18 277.37)',

      // Sidebar colors
      sidebar: 'oklch(0.34 0.01 59.42)',
      'sidebar-foreground': 'oklch(0.93 0.01 255.51)',
      'sidebar-primary': 'oklch(0.68 0.16 276.93)',
      'sidebar-primary-foreground': 'oklch(0.22 0.01 67.44)',
      'sidebar-accent': 'oklch(0.39 0.01 59.47)',
      'sidebar-accent-foreground': 'oklch(0.87 0.01 258.34)',
      'sidebar-border': 'oklch(0.34 0.01 59.42)',
      'sidebar-ring': 'oklch(0.68 0.16 276.93)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '1.25rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.18',
      'shadow-blur': '10px',
      'shadow-spread': '4px',
      'shadow-offset-x': '2px',
      'shadow-offset-y': '2px',
    },
  },

  {
    id: 'pastel-dreams',
    name: 'Pastel Dreams',
    category: 'creative',
    colors: {
      primary: 'oklch(0.71 0.16 293.54)',
      secondary: 'oklch(0.91 0.05 306.09)',
      accent: 'oklch(0.94 0.03 321.94)',
      background: 'oklch(0.97 0.01 314.78)',
      foreground: 'oklch(0.37 0.03 259.73)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.97 0.01 314.78)',
      foreground: 'oklch(0.37 0.03 259.73)',
      card: 'oklch(1.00 0 0)',
      'card-foreground': 'oklch(0.37 0.03 259.73)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.37 0.03 259.73)',

      // Primary colors
      primary: 'oklch(0.71 0.16 293.54)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.91 0.05 306.09)',
      'secondary-foreground': 'oklch(0.45 0.03 256.80)',

      // Muted colors
      muted: 'oklch(0.95 0.03 307.17)',
      'muted-foreground': 'oklch(0.55 0.02 264.36)',

      // Accent colors
      accent: 'oklch(0.94 0.03 321.94)',
      'accent-foreground': 'oklch(0.37 0.03 259.73)',

      // Destructive colors
      destructive: 'oklch(0.81 0.10 19.57)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.91 0.05 306.09)',
      input: 'oklch(0.91 0.05 306.09)',
      ring: 'oklch(0.71 0.16 293.54)',

      // Chart colors
      'chart-1': 'oklch(0.71 0.16 293.54)',
      'chart-2': 'oklch(0.61 0.22 292.72)',
      'chart-3': 'oklch(0.54 0.25 293.01)',
      'chart-4': 'oklch(0.49 0.24 292.58)',
      'chart-5': 'oklch(0.43 0.21 292.76)',

      // Sidebar colors
      sidebar: 'oklch(0.91 0.05 306.09)',
      'sidebar-foreground': 'oklch(0.37 0.03 259.73)',
      'sidebar-primary': 'oklch(0.71 0.16 293.54)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.94 0.03 321.94)',
      'sidebar-accent-foreground': 'oklch(0.37 0.03 259.73)',
      'sidebar-border': 'oklch(0.91 0.05 306.09)',
      'sidebar-ring': 'oklch(0.71 0.16 293.54)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '1.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.08',
      'shadow-blur': '16px',
      'shadow-spread': '-4px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '8px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.22 0.01 56.04)',
      foreground: 'oklch(0.93 0.03 272.79)',
      card: 'oklch(0.28 0.03 307.23)',
      'card-foreground': 'oklch(0.93 0.03 272.79)',
      popover: 'oklch(0.28 0.03 307.23)',
      'popover-foreground': 'oklch(0.93 0.03 272.79)',

      // Primary colors
      primary: 'oklch(0.79 0.12 295.75)',
      'primary-foreground': 'oklch(0.22 0.01 56.04)',

      // Secondary colors
      secondary: 'oklch(0.34 0.04 308.85)',
      'secondary-foreground': 'oklch(0.87 0.01 258.34)',

      // Muted colors
      muted: 'oklch(0.28 0.03 307.23)',
      'muted-foreground': 'oklch(0.71 0.02 261.32)',

      // Accent colors
      accent: 'oklch(0.39 0.05 304.64)',
      'accent-foreground': 'oklch(0.87 0.01 258.34)',

      // Destructive colors
      destructive: 'oklch(0.81 0.10 19.57)',
      'destructive-foreground': 'oklch(0.22 0.01 56.04)',

      // Border and input
      border: 'oklch(0.34 0.04 308.85)',
      input: 'oklch(0.34 0.04 308.85)',
      ring: 'oklch(0.79 0.12 295.75)',

      // Chart colors
      'chart-1': 'oklch(0.79 0.12 295.75)',
      'chart-2': 'oklch(0.71 0.16 293.54)',
      'chart-3': 'oklch(0.61 0.22 292.72)',
      'chart-4': 'oklch(0.54 0.25 293.01)',
      'chart-5': 'oklch(0.49 0.24 292.58)',

      // Sidebar colors
      sidebar: 'oklch(0.34 0.04 308.85)',
      'sidebar-foreground': 'oklch(0.93 0.03 272.79)',
      'sidebar-primary': 'oklch(0.79 0.12 295.75)',
      'sidebar-primary-foreground': 'oklch(0.22 0.01 56.04)',
      'sidebar-accent': 'oklch(0.39 0.05 304.64)',
      'sidebar-accent-foreground': 'oklch(0.87 0.01 258.34)',
      'sidebar-border': 'oklch(0.34 0.04 308.85)',
      'sidebar-ring': 'oklch(0.79 0.12 295.75)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '1.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.08',
      'shadow-blur': '16px',
      'shadow-spread': '-4px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '8px',
    },
  },

  {
    id: 'clean-slate',
    name: 'Clean Slate',
    category: 'specialty',
    colors: {
      primary: 'oklch(0.59 0.20 277.12)',
      secondary: 'oklch(0.93 0.01 264.53)',
      accent: 'oklch(0.93 0.03 272.79)',
      background: 'oklch(0.98 0.00 247.86)',
      foreground: 'oklch(0.28 0.04 260.03)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.98 0.00 247.86)',
      foreground: 'oklch(0.28 0.04 260.03)',
      card: 'oklch(1.00 0 0)',
      'card-foreground': 'oklch(0.28 0.04 260.03)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.28 0.04 260.03)',

      // Primary colors
      primary: 'oklch(0.59 0.20 277.12)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.93 0.01 264.53)',
      'secondary-foreground': 'oklch(0.37 0.03 259.73)',

      // Muted colors
      muted: 'oklch(0.97 0.00 264.54)',
      'muted-foreground': 'oklch(0.55 0.02 264.36)',

      // Accent colors
      accent: 'oklch(0.93 0.03 272.79)',
      'accent-foreground': 'oklch(0.37 0.03 259.73)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.87 0.01 258.34)',
      input: 'oklch(0.87 0.01 258.34)',
      ring: 'oklch(0.59 0.20 277.12)',

      // Chart colors
      'chart-1': 'oklch(0.59 0.20 277.12)',
      'chart-2': 'oklch(0.51 0.23 276.97)',
      'chart-3': 'oklch(0.46 0.21 277.02)',
      'chart-4': 'oklch(0.40 0.18 277.37)',
      'chart-5': 'oklch(0.36 0.14 278.70)',

      // Sidebar colors
      sidebar: 'oklch(0.97 0.00 264.54)',
      'sidebar-foreground': 'oklch(0.28 0.04 260.03)',
      'sidebar-primary': 'oklch(0.59 0.20 277.12)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.93 0.03 272.79)',
      'sidebar-accent-foreground': 'oklch(0.37 0.03 259.73)',
      'sidebar-border': 'oklch(0.87 0.01 258.34)',
      'sidebar-ring': 'oklch(0.59 0.20 277.12)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '8px',
      'shadow-spread': '-1px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '4px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.21 0.04 265.75)',
      foreground: 'oklch(0.93 0.01 255.51)',
      card: 'oklch(0.28 0.04 260.03)',
      'card-foreground': 'oklch(0.93 0.01 255.51)',
      popover: 'oklch(0.28 0.04 260.03)',
      'popover-foreground': 'oklch(0.93 0.01 255.51)',

      // Primary colors
      primary: 'oklch(0.68 0.16 276.93)',
      'primary-foreground': 'oklch(0.21 0.04 265.75)',

      // Secondary colors
      secondary: 'oklch(0.34 0.03 260.91)',
      'secondary-foreground': 'oklch(0.87 0.01 258.34)',

      // Muted colors
      muted: 'oklch(0.28 0.04 260.03)',
      'muted-foreground': 'oklch(0.71 0.02 261.32)',

      // Accent colors
      accent: 'oklch(0.37 0.03 259.73)',
      'accent-foreground': 'oklch(0.87 0.01 258.34)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(0.21 0.04 265.75)',

      // Border and input
      border: 'oklch(0.45 0.03 256.80)',
      input: 'oklch(0.45 0.03 256.80)',
      ring: 'oklch(0.68 0.16 276.93)',

      // Chart colors
      'chart-1': 'oklch(0.68 0.16 276.93)',
      'chart-2': 'oklch(0.59 0.20 277.12)',
      'chart-3': 'oklch(0.51 0.23 276.97)',
      'chart-4': 'oklch(0.46 0.21 277.02)',
      'chart-5': 'oklch(0.40 0.18 277.37)',

      // Sidebar colors
      sidebar: 'oklch(0.28 0.04 260.03)',
      'sidebar-foreground': 'oklch(0.93 0.01 255.51)',
      'sidebar-primary': 'oklch(0.68 0.16 276.93)',
      'sidebar-primary-foreground': 'oklch(0.21 0.04 265.75)',
      'sidebar-accent': 'oklch(0.37 0.03 259.73)',
      'sidebar-accent-foreground': 'oklch(0.87 0.01 258.34)',
      'sidebar-border': 'oklch(0.45 0.03 256.80)',
      'sidebar-ring': 'oklch(0.68 0.16 276.93)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '8px',
      'shadow-spread': '-1px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '4px',
    },
  },

  {
    id: 'caffeine',
    name: 'Caffeine',
    category: 'specialty',
    colors: {
      primary: 'oklch(0.43 0.04 41.99)',
      secondary: 'oklch(0.92 0.07 74.37)',
      accent: 'oklch(0.93 0 0)',
      background: 'oklch(0.98 0 0)',
      foreground: 'oklch(0.24 0 0)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.98 0 0)',
      foreground: 'oklch(0.24 0 0)',
      card: 'oklch(0.99 0 0)',
      'card-foreground': 'oklch(0.24 0 0)',
      popover: 'oklch(0.99 0 0)',
      'popover-foreground': 'oklch(0.24 0 0)',

      // Primary colors
      primary: 'oklch(0.43 0.04 41.99)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.92 0.07 74.37)',
      'secondary-foreground': 'oklch(0.35 0.07 40.83)',

      // Muted colors
      muted: 'oklch(0.95 0 0)',
      'muted-foreground': 'oklch(0.50 0 0)',

      // Accent colors
      accent: 'oklch(0.93 0 0)',
      'accent-foreground': 'oklch(0.24 0 0)',

      // Destructive colors
      destructive: 'oklch(0.63 0.19 33.34)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.88 0 0)',
      input: 'oklch(0.88 0 0)',
      ring: 'oklch(0.43 0.04 41.99)',

      // Chart colors
      'chart-1': 'oklch(0.43 0.04 41.99)',
      'chart-2': 'oklch(0.92 0.07 74.37)',
      'chart-3': 'oklch(0.93 0 0)',
      'chart-4': 'oklch(0.94 0.05 75.50)',
      'chart-5': 'oklch(0.43 0.04 41.67)',

      // Sidebar colors
      sidebar: 'oklch(0.99 0 0)',
      'sidebar-foreground': 'oklch(0.26 0 0)',
      'sidebar-primary': 'oklch(0.33 0 0)',
      'sidebar-primary-foreground': 'oklch(0.99 0 0)',
      'sidebar-accent': 'oklch(0.98 0 0)',
      'sidebar-accent-foreground': 'oklch(0.33 0 0)',
      'sidebar-border': 'oklch(0.94 0 0)',
      'sidebar-ring': 'oklch(0.77 0 0)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0',
      'shadow-offset-y': '1px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.18 0 0)',
      foreground: 'oklch(0.95 0 0)',
      card: 'oklch(0.21 0 0)',
      'card-foreground': 'oklch(0.95 0 0)',
      popover: 'oklch(0.21 0 0)',
      'popover-foreground': 'oklch(0.95 0 0)',

      // Primary colors
      primary: 'oklch(0.92 0.05 66.17)',
      'primary-foreground': 'oklch(0.20 0.02 200.20)',

      // Secondary colors
      secondary: 'oklch(0.32 0.02 63.70)',
      'secondary-foreground': 'oklch(0.92 0.05 66.17)',

      // Muted colors
      muted: 'oklch(0.25 0 0)',
      'muted-foreground': 'oklch(0.77 0 0)',

      // Accent colors
      accent: 'oklch(0.29 0 0)',
      'accent-foreground': 'oklch(0.95 0 0)',

      // Destructive colors
      destructive: 'oklch(0.63 0.19 33.34)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.24 0.01 91.75)',
      input: 'oklch(0.40 0 0)',
      ring: 'oklch(0.92 0.05 66.17)',

      // Chart colors
      'chart-1': 'oklch(0.92 0.05 66.17)',
      'chart-2': 'oklch(0.32 0.02 63.70)',
      'chart-3': 'oklch(0.29 0 0)',
      'chart-4': 'oklch(0.35 0.02 67.00)',
      'chart-5': 'oklch(0.92 0.05 67.09)',

      // Sidebar colors
      sidebar: 'oklch(0.21 0.01 285.89)',
      'sidebar-foreground': 'oklch(0.97 0.00 286.38)',
      'sidebar-primary': 'oklch(0.49 0.22 264.38)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.27 0.01 286.03)',
      'sidebar-accent-foreground': 'oklch(0.97 0.00 286.38)',
      'sidebar-border': 'oklch(0.27 0.01 286.03)',
      'sidebar-ring': 'oklch(0.87 0.01 286.29)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0',
      'shadow-offset-y': '1px',
    },
  },

  {
    id: 'midnight-bloom',
    name: 'Midnight Bloom',
    category: 'creative',
    colors: {
      primary: 'oklch(0.57 0.20 283.08)',
      secondary: 'oklch(0.82 0.07 249.35)',
      accent: 'oklch(0.65 0.06 117.43)',
      background: 'oklch(0.98 0 0)',
      foreground: 'oklch(0.32 0 0)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.98 0 0)',
      foreground: 'oklch(0.32 0 0)',
      card: 'oklch(1.00 0 0)',
      'card-foreground': 'oklch(0.32 0 0)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.32 0 0)',

      // Primary colors
      primary: 'oklch(0.57 0.20 283.08)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.82 0.07 249.35)',
      'secondary-foreground': 'oklch(0.32 0 0)',

      // Muted colors
      muted: 'oklch(0.82 0.02 91.62)',
      'muted-foreground': 'oklch(0.54 0 0)',

      // Accent colors
      accent: 'oklch(0.65 0.06 117.43)',
      'accent-foreground': 'oklch(1.00 0 0)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.87 0 0)',
      input: 'oklch(0.87 0 0)',
      ring: 'oklch(0.57 0.20 283.08)',

      // Chart colors
      'chart-1': 'oklch(0.57 0.20 283.08)',
      'chart-2': 'oklch(0.53 0.17 314.65)',
      'chart-3': 'oklch(0.34 0.18 301.68)',
      'chart-4': 'oklch(0.67 0.14 261.34)',
      'chart-5': 'oklch(0.59 0.10 245.74)',

      // Sidebar colors
      sidebar: 'oklch(0.98 0 0)',
      'sidebar-foreground': 'oklch(0.32 0 0)',
      'sidebar-primary': 'oklch(0.57 0.20 283.08)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.65 0.06 117.43)',
      'sidebar-accent-foreground': 'oklch(1.00 0 0)',
      'sidebar-border': 'oklch(0.87 0 0)',
      'sidebar-ring': 'oklch(0.57 0.20 283.08)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '10px',
      'shadow-spread': '-2px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '5px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.23 0.01 264.29)',
      foreground: 'oklch(0.92 0 0)',
      card: 'oklch(0.32 0.01 223.67)',
      'card-foreground': 'oklch(0.92 0 0)',
      popover: 'oklch(0.32 0.01 223.67)',
      'popover-foreground': 'oklch(0.92 0 0)',

      // Primary colors
      primary: 'oklch(0.57 0.20 283.08)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.34 0.18 301.68)',
      'secondary-foreground': 'oklch(0.92 0 0)',

      // Muted colors
      muted: 'oklch(0.39 0 0)',
      'muted-foreground': 'oklch(0.72 0 0)',

      // Accent colors
      accent: 'oklch(0.67 0.14 261.34)',
      'accent-foreground': 'oklch(0.92 0 0)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.39 0 0)',
      input: 'oklch(0.39 0 0)',
      ring: 'oklch(0.57 0.20 283.08)',

      // Chart colors
      'chart-1': 'oklch(0.57 0.20 283.08)',
      'chart-2': 'oklch(0.53 0.17 314.65)',
      'chart-3': 'oklch(0.34 0.18 301.68)',
      'chart-4': 'oklch(0.67 0.14 261.34)',
      'chart-5': 'oklch(0.59 0.10 245.74)',

      // Sidebar colors
      sidebar: 'oklch(0.23 0.01 264.29)',
      'sidebar-foreground': 'oklch(0.92 0 0)',
      'sidebar-primary': 'oklch(0.57 0.20 283.08)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.67 0.14 261.34)',
      'sidebar-accent-foreground': 'oklch(0.92 0 0)',
      'sidebar-border': 'oklch(0.39 0 0)',
      'sidebar-ring': 'oklch(0.57 0.20 283.08)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '10px',
      'shadow-spread': '-2px',
      'shadow-offset-x': '0px',
      'shadow-offset-y': '5px',
    },
  },

  {
    id: 'candyland',
    name: 'Candyland',
    category: 'creative',
    colors: {
      primary: 'oklch(0.87 0.07 7.09)',
      secondary: 'oklch(0.81 0.08 225.75)',
      accent: 'oklch(0.97 0.21 109.77)',
      background: 'oklch(0.98 0.00 228.78)',
      foreground: 'oklch(0.32 0 0)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.98 0.00 228.78)',
      foreground: 'oklch(0.32 0 0)',
      card: 'oklch(1.00 0 0)',
      'card-foreground': 'oklch(0.32 0 0)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.32 0 0)',

      // Primary colors
      primary: 'oklch(0.87 0.07 7.09)',
      'primary-foreground': 'oklch(0 0 0)',

      // Secondary colors
      secondary: 'oklch(0.81 0.08 225.75)',
      'secondary-foreground': 'oklch(0 0 0)',

      // Muted colors
      muted: 'oklch(0.88 0.03 98.10)',
      'muted-foreground': 'oklch(0.54 0 0)',

      // Accent colors
      accent: 'oklch(0.97 0.21 109.77)',
      'accent-foreground': 'oklch(0 0 0)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.87 0 0)',
      input: 'oklch(0.87 0 0)',
      ring: 'oklch(0.87 0.07 7.09)',

      // Chart colors
      'chart-1': 'oklch(0.87 0.07 7.09)',
      'chart-2': 'oklch(0.81 0.08 225.75)',
      'chart-3': 'oklch(0.97 0.21 109.77)',
      'chart-4': 'oklch(0.80 0.14 349.23)',
      'chart-5': 'oklch(0.74 0.23 142.85)',

      // Sidebar colors
      sidebar: 'oklch(0.98 0.00 228.78)',
      'sidebar-foreground': 'oklch(0.32 0 0)',
      'sidebar-primary': 'oklch(0.87 0.07 7.09)',
      'sidebar-primary-foreground': 'oklch(0 0 0)',
      'sidebar-accent': 'oklch(0.97 0.21 109.77)',
      'sidebar-accent-foreground': 'oklch(0 0 0)',
      'sidebar-border': 'oklch(0.87 0 0)',
      'sidebar-ring': 'oklch(0.87 0.07 7.09)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0',
      'shadow-offset-y': '1px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.23 0.01 264.29)',
      foreground: 'oklch(0.92 0 0)',
      card: 'oklch(0.32 0.01 223.67)',
      'card-foreground': 'oklch(0.92 0 0)',
      popover: 'oklch(0.32 0.01 223.67)',
      'popover-foreground': 'oklch(0.92 0 0)',

      // Primary colors
      primary: 'oklch(0.80 0.14 349.23)',
      'primary-foreground': 'oklch(0 0 0)',

      // Secondary colors
      secondary: 'oklch(0.74 0.23 142.85)',
      'secondary-foreground': 'oklch(0 0 0)',

      // Muted colors
      muted: 'oklch(0.39 0 0)',
      'muted-foreground': 'oklch(0.72 0 0)',

      // Accent colors
      accent: 'oklch(0.81 0.08 225.75)',
      'accent-foreground': 'oklch(0 0 0)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.39 0 0)',
      input: 'oklch(0.39 0 0)',
      ring: 'oklch(0.80 0.14 349.23)',

      // Chart colors
      'chart-1': 'oklch(0.80 0.14 349.23)',
      'chart-2': 'oklch(0.74 0.23 142.85)',
      'chart-3': 'oklch(0.81 0.08 225.75)',
      'chart-4': 'oklch(0.97 0.21 109.77)',
      'chart-5': 'oklch(0.87 0.18 90.38)',

      // Sidebar colors
      sidebar: 'oklch(0.23 0.01 264.29)',
      'sidebar-foreground': 'oklch(0.92 0 0)',
      'sidebar-primary': 'oklch(0.80 0.14 349.23)',
      'sidebar-primary-foreground': 'oklch(0 0 0)',
      'sidebar-accent': 'oklch(0.81 0.08 225.75)',
      'sidebar-accent-foreground': 'oklch(0 0 0)',
      'sidebar-border': 'oklch(0.39 0 0)',
      'sidebar-ring': 'oklch(0.80 0.14 349.23)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0',
      'shadow-offset-y': '1px',
    },
  },

  {
    id: 'northern-lights',
    name: 'Northern Lights',
    category: 'creative',
    colors: {
      primary: 'oklch(0.65 0.15 150.31)',
      secondary: 'oklch(0.67 0.14 261.34)',
      accent: 'oklch(0.83 0.11 211.96)',
      background: 'oklch(0.98 0.00 286.38)',
      foreground: 'oklch(0.32 0 0)',
    },
    lightModeConfig: {
      // Base colors
      background: 'oklch(0.98 0.00 286.38)',
      foreground: 'oklch(0.32 0 0)',
      card: 'oklch(1.00 0 0)',
      'card-foreground': 'oklch(0.32 0 0)',
      popover: 'oklch(1.00 0 0)',
      'popover-foreground': 'oklch(0.32 0 0)',

      // Primary colors
      primary: 'oklch(0.65 0.15 150.31)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.67 0.14 261.34)',
      'secondary-foreground': 'oklch(1.00 0 0)',

      // Muted colors
      muted: 'oklch(0.88 0.03 98.10)',
      'muted-foreground': 'oklch(0.54 0 0)',

      // Accent colors
      accent: 'oklch(0.83 0.11 211.96)',
      'accent-foreground': 'oklch(0.32 0 0)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.87 0 0)',
      input: 'oklch(0.87 0 0)',
      ring: 'oklch(0.65 0.15 150.31)',

      // Chart colors
      'chart-1': 'oklch(0.65 0.15 150.31)',
      'chart-2': 'oklch(0.67 0.14 261.34)',
      'chart-3': 'oklch(0.83 0.11 211.96)',
      'chart-4': 'oklch(0.59 0.10 245.74)',
      'chart-5': 'oklch(0.59 0.16 148.24)',

      // Sidebar colors
      sidebar: 'oklch(0.98 0.00 286.38)',
      'sidebar-foreground': 'oklch(0.32 0 0)',
      'sidebar-primary': 'oklch(0.65 0.15 150.31)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.83 0.11 211.96)',
      'sidebar-accent-foreground': 'oklch(0.32 0 0)',
      'sidebar-border': 'oklch(0.87 0 0)',
      'sidebar-ring': 'oklch(0.65 0.15 150.31)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0',
      'shadow-offset-y': '1px',
    },
    darkModeConfig: {
      // Base colors
      background: 'oklch(0.23 0.01 264.29)',
      foreground: 'oklch(0.92 0 0)',
      card: 'oklch(0.32 0.01 223.67)',
      'card-foreground': 'oklch(0.92 0 0)',
      popover: 'oklch(0.32 0.01 223.67)',
      'popover-foreground': 'oklch(0.92 0 0)',

      // Primary colors
      primary: 'oklch(0.65 0.15 150.31)',
      'primary-foreground': 'oklch(1.00 0 0)',

      // Secondary colors
      secondary: 'oklch(0.59 0.10 245.74)',
      'secondary-foreground': 'oklch(0.92 0 0)',

      // Muted colors
      muted: 'oklch(0.39 0 0)',
      'muted-foreground': 'oklch(0.72 0 0)',

      // Accent colors
      accent: 'oklch(0.67 0.14 261.34)',
      'accent-foreground': 'oklch(0.92 0 0)',

      // Destructive colors
      destructive: 'oklch(0.64 0.21 25.33)',
      'destructive-foreground': 'oklch(1.00 0 0)',

      // Border and input
      border: 'oklch(0.39 0 0)',
      input: 'oklch(0.39 0 0)',
      ring: 'oklch(0.65 0.15 150.31)',

      // Chart colors
      'chart-1': 'oklch(0.65 0.15 150.31)',
      'chart-2': 'oklch(0.59 0.10 245.74)',
      'chart-3': 'oklch(0.67 0.14 261.34)',
      'chart-4': 'oklch(0.83 0.11 211.96)',
      'chart-5': 'oklch(0.59 0.16 148.24)',

      // Sidebar colors
      sidebar: 'oklch(0.23 0.01 264.29)',
      'sidebar-foreground': 'oklch(0.92 0 0)',
      'sidebar-primary': 'oklch(0.65 0.15 150.31)',
      'sidebar-primary-foreground': 'oklch(1.00 0 0)',
      'sidebar-accent': 'oklch(0.67 0.14 261.34)',
      'sidebar-accent-foreground': 'oklch(0.92 0 0)',
      'sidebar-border': 'oklch(0.39 0 0)',
      'sidebar-ring': 'oklch(0.65 0.15 150.31)',

      // Typography
      'font-sans': "'Inter', system-ui, -apple-system, sans-serif",
      'font-serif': "'Georgia', serif",
      'font-mono': "'JetBrains Mono', 'Fira Code', monospace",
      'letter-spacing': '0em',

      // Border radius
      radius: '0.5rem',

      // Shadow system
      'shadow-color': 'oklch(0.00 0.000 0)',
      'shadow-opacity': '0.1',
      'shadow-blur': '3px',
      'shadow-spread': '0px',
      'shadow-offset-x': '0',
      'shadow-offset-y': '1px',
    },
  }
];

export const getThemesByCategory = (category: PredefinedTheme['category']) => {
  return PREDEFINED_THEMES.filter((theme) => theme.category === category);
};

export const getThemeById = (id: string) => {
  return PREDEFINED_THEMES.find((theme) => theme.id === id);
};

export const getAllCategories = (): PredefinedTheme['category'][] => {
  return [
    'popular',
    'nature',
    'corporate',
    'creative',
    'monochrome',
    'specialty'
];
};
