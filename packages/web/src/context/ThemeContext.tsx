import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import type { ThemeTypography } from '@/types/typography';
import { DEFAULT_TYPOGRAPHY } from '@/types/typography';

export interface Theme {
  id: string;
  companyId: string;
  name: string;
  lightModeConfig: Record<string, string>;
  darkModeConfig?: Record<string, string>;
  typography?: ThemeTypography;
  isActive: boolean;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeRule {
  id: string;
  themeId: string;
  selector: string;
  properties: Record<string, string>;
  specificity: 'GLOBAL' | 'COMPONENT' | 'CONTEXTUAL' | 'INSTANCE';
}

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme | null;
  loading: boolean;
  error: string | null;
  tokens: Record<string, string>;
  typography: ThemeTypography;
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  updateTheme: (themeData: Partial<Theme>) => Promise<void>;
  updateTypography: (typography: ThemeTypography) => Promise<void>;
  applyThemeRule: (rule: ThemeRule) => void;
  applyTheme: (themeId: string, companyId?: string) => Promise<void>;
  refreshTheme: () => Promise<void>;
  setCurrentTheme: (theme: Theme) => void;
  updateThemeColors: (colors: Record<string, string>, mode: 'light' | 'dark') => void;
  clearPreviewTokens: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface DynamicThemeProviderProps {
  companyId?: string;
  themeId?: string;
  themeData?: Theme;
  fallbackTheme?: 'light' | 'dark';
  defaultMode?: ThemeMode;
  children: React.ReactNode;
}

// Helper functions
function computeContrastColor(color: string): string {
  if (!color || color === 'transparent') return 'oklch(0 0 0)';
  
  if (color.includes('oklch')) {
    const match = color.match(/oklch\(\s*([0-9.]+)/);
    if (match) {
      const lightness = parseFloat(match[1]);
      return lightness > 0.5 ? 'oklch(0 0 0)' : 'oklch(1 0 0)';
    }
  }

  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? 'oklch(0 0 0)' : 'oklch(1 0 0)';
  }

  return 'oklch(1 0 0)';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}

// Convert hex color to OKLCH format
function hexToOklch(hex: string): string {
  if (!hex || !hex.startsWith('#')) return 'oklch(0.5 0.1 250)';
  
  const rgb = hexToRgb(hex);
  
  // Convert RGB to linear RGB
  const toLinear = (c: number) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  
  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);
  
  // Convert to XYZ
  const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
  const z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
  
  // Convert to LAB
  const fx = x > 0.008856 ? Math.pow(x, 1/3) : (903.3 * x + 16) / 116;
  const fy = y > 0.008856 ? Math.pow(y, 1/3) : (903.3 * y + 16) / 116;
  const fz = z > 0.008856 ? Math.pow(z, 1/3) : (903.3 * z + 16) / 116;
  
  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bLab = 200 * (fy - fz);
  
  // Convert LAB to OKLCH (simplified approximation)
  const lightness = Math.max(0, Math.min(1, L / 100));
  const chroma = Math.sqrt(a * a + bLab * bLab) / 150; // Normalized chroma
  let hue = Math.atan2(bLab, a) * 180 / Math.PI;
  if (hue < 0) hue += 360;
  
  return `oklch(${lightness.toFixed(4)} ${Math.min(0.4, chroma).toFixed(4)} ${hue.toFixed(1)})`;
}

// Define which properties are colors vs other CSS properties
function isColorProperty(key: string): boolean {
  const colorProperties = new Set([
    // Base colors
    'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
    // Primary colors
    'primary', 'primary-foreground',
    // Secondary colors  
    'secondary', 'secondary-foreground',
    // Muted colors
    'muted', 'muted-foreground',
    // Accent colors
    'accent', 'accent-foreground',
    // Destructive colors
    'destructive', 'destructive-foreground',
    // Status colors
    'success', 'success-foreground', 'warning', 'warning-foreground',
    // Border and input
    'border', 'input', 'ring',
    // Chart colors
    'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
    // Sidebar colors
    'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
    'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
    // Shadow color (but not other shadow properties)
    'shadow-color'
  ]);

  return colorProperties.has(key);
}

// Normalize color value to consistent format
function normalizeColorValue(color: string): string {
  if (!color) return 'oklch(0.5 0.1 250)';
  
  // Already in oklch format
  if (color.includes('oklch(')) return color;
  
  // Convert hex to oklch
  if (color.startsWith('#')) {
    return hexToOklch(color);
  }
  
  // Handle RGB values
  if (color.startsWith('rgb(')) {
    // Extract RGB values and convert to hex first
    const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (matches) {
      const r = parseInt(matches[1]);
      const g = parseInt(matches[2]);
      const b = parseInt(matches[3]);
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      return hexToOklch(hex);
    }
  }
  
  // Handle HSL values (basic conversion)
  if (color.startsWith('hsl(')) {
    // For now, return a safe fallback - in production you'd want full HSL to OKLCH conversion
    return 'oklch(0.5 0.1 250)';
  }
  
  // If it's already a raw oklch value (like "0.5 0.1 250")
  if (/^[\d.]+\s+[\d.]+\s+[\d.]+$/.test(color.trim())) {
    return `oklch(${color})`;
  }
  
  // Default fallback
  return 'oklch(0.5 0.1 250)';
}

function generateCSSFromRule(rule: ThemeRule): string {
  const selector = rule.selector || ':root';
  const properties = Object.entries(rule.properties || {})
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `
    /* Theme Rule: ${rule.id} (${rule.specificity}) */
    ${selector} {
      ${properties}
    }
  `;
}

function generateTokensFromTheme(theme: Theme, isDarkMode: boolean): Record<string, string> {
  const tokens: Record<string, string> = {};

  // Use appropriate config based on mode
  const config = isDarkMode ? theme.darkModeConfig : theme.lightModeConfig;
  
  if (config) {
    Object.entries(config).forEach(([key, value]) => {
      // Normalize color values to ensure consistency
      if (isColorProperty(key) && typeof value === 'string') {
        tokens[key] = normalizeColorValue(value);
      } else {
        tokens[key] = value;
      }
    });
  } else if (theme.lightModeConfig) {
    // Fallback to light mode if dark mode not available
    Object.entries(theme.lightModeConfig).forEach(([key, value]) => {
      if (isColorProperty(key) && typeof value === 'string') {
        tokens[key] = normalizeColorValue(value);
      } else {
        tokens[key] = value;
      }
    });
  }

  // Compute contrast colors if not explicitly defined
  if (!tokens['primary-foreground']) {
    tokens['primary-foreground'] = computeContrastColor(tokens['primary'] || '#000000');
  }
  if (!tokens['secondary-foreground']) {
    tokens['secondary-foreground'] = computeContrastColor(tokens['secondary'] || '#666666');
  }
  if (!tokens['destructive-foreground']) {
    tokens['destructive-foreground'] = computeContrastColor(tokens['destructive'] || '#dc2626');
  }

  return tokens;
}

function generateFallbackTokens(fallback: 'light' | 'dark'): Record<string, string> {
  const isLight = fallback === 'light';
  
  return {
    // Primary Colors
    primary: isLight ? 'oklch(0.5634 0.1517 146.7438)' : 'oklch(0.6735 0.1851 146.7724)',
    'primary-foreground': isLight ? 'oklch(1 0 0)' : 'oklch(0.1 0 0)',
    
    // Secondary Colors  
    secondary: isLight ? 'oklch(0.9683 0.0069 247.8956)' : 'oklch(0.2 0.01 247.8956)',
    'secondary-foreground': isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.9 0.01 259.2010)',
    
    // Accent Colors
    accent: isLight ? 'oklch(0.96 0.01 247.8956)' : 'oklch(0.15 0.01 247.8956)',
    'accent-foreground': isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.95 0.01 259.2010)',
    
    // Base Colors
    background: isLight ? 'oklch(1 0 0)' : 'oklch(0.09 0 0)',
    foreground: isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.95 0.01 259.2010)',
    
    // Card Colors
    card: isLight ? 'oklch(1 0 0)' : 'oklch(0.09 0 0)',
    'card-foreground': isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.95 0.01 259.2010)',
    
    // Popover Colors
    popover: isLight ? 'oklch(1 0 0)' : 'oklch(0.09 0 0)',
    'popover-foreground': isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.95 0.01 259.2010)',
    
    // Muted Colors
    muted: isLight ? 'oklch(0.96 0.01 247.8956)' : 'oklch(0.15 0.01 247.8956)',
    'muted-foreground': isLight ? 'oklch(0.45 0.01 247.8956)' : 'oklch(0.6 0.01 247.8956)',
    
    // Status Colors
    success: isLight ? 'oklch(0.65 0.15 160)' : 'oklch(0.7 0.17 160)',
    'success-foreground': isLight ? 'oklch(1 0 0)' : 'oklch(0.1 0 0)',
    warning: isLight ? 'oklch(0.75 0.15 85)' : 'oklch(0.8 0.17 85)',
    'warning-foreground': isLight ? 'oklch(0.1 0 0)' : 'oklch(0.1 0 0)',
    destructive: isLight ? 'oklch(0.627 0.22 29.2329)' : 'oklch(0.7 0.25 29.2329)',
    'destructive-foreground': 'oklch(1 0 0)',
    
    // Border & Input Colors
    border: isLight ? 'oklch(0.9288 0.0126 255.5078)' : 'oklch(0.2 0.01 255.5078)',
    input: isLight ? 'oklch(0.9288 0.0126 255.5078)' : 'oklch(0.2 0.01 255.5078)',
    ring: 'oklch(0.5634 0.1517 146.7438)',
    
    // Chart Colors
    'chart-1': isLight ? 'oklch(0.55 0.15 250)' : 'oklch(0.65 0.18 250)',
    'chart-2': isLight ? 'oklch(0.6 0.18 280)' : 'oklch(0.7 0.2 280)',
    'chart-3': isLight ? 'oklch(0.75 0.15 85)' : 'oklch(0.8 0.17 85)',
    'chart-4': isLight ? 'oklch(0.65 0.18 340)' : 'oklch(0.75 0.2 340)',
    'chart-5': isLight ? 'oklch(0.7 0.15 120)' : 'oklch(0.8 0.17 120)',
    
    // Sidebar Colors
    sidebar: isLight ? 'oklch(0.98 0.005 247.8956)' : 'oklch(0.12 0.005 247.8956)',
    'sidebar-foreground': isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.95 0.01 259.2010)',
    'sidebar-primary': isLight ? 'oklch(0.5634 0.1517 146.7438)' : 'oklch(0.6735 0.1851 146.7724)',
    'sidebar-primary-foreground': isLight ? 'oklch(1 0 0)' : 'oklch(0.1 0 0)',
    'sidebar-accent': isLight ? 'oklch(0.96 0.01 247.8956)' : 'oklch(0.15 0.01 247.8956)',
    'sidebar-accent-foreground': isLight ? 'oklch(0.1363 0.0364 259.2010)' : 'oklch(0.95 0.01 259.2010)',
    'sidebar-border': isLight ? 'oklch(0.9288 0.0126 255.5078)' : 'oklch(0.2 0.01 255.5078)',
    'sidebar-ring': 'oklch(0.5634 0.1517 146.7438)',
    
    // Typography and Layout
    radius: '0.5rem',
    'font-sans': 'Inter, system-ui, sans-serif', 
    'font-mono': 'ui-monospace, SFMono-Regular, monospace',
  };
}

export const DynamicThemeProvider: React.FC<DynamicThemeProviderProps> = ({
  companyId,
  themeId,
  themeData,
  fallbackTheme = 'light',
  defaultMode = 'system',
  children,
}) => {
  const [theme, setTheme] = useState<Theme | null>(themeData || null);
  const [typography, setTypography] = useState<ThemeTypography>(theme?.typography || DEFAULT_TYPOGRAPHY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultMode);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  
  // Use tRPC to fetch theme
  const { data: fetchedTheme, isLoading, error: trpcError } = trpc.theme.getThemeById.useQuery(
    { themeId: themeId || '' },
    { 
      enabled: !!themeId && !themeData,
      retry: false,
    }
  );
  
  // Fetch company themes if no specific theme ID
  const { data: companyThemes, isLoading: isLoadingCompanyThemes } = trpc.theme.getCompanyThemes.useQuery(
    { companyId: companyId || '' },
    { 
      enabled: !!companyId && !themeId && !themeData,
      retry: false,
    }
  );

  // Determine if dark mode should be active
  const isDarkMode = useMemo(() => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    return systemPrefersDark; // system mode
  }, [themeMode, systemPrefersDark]);

  // Base tokens from theme
  const baseTokens = useMemo(() => {
    if (!theme) return generateFallbackTokens(isDarkMode ? 'dark' : 'light');
    return generateTokensFromTheme(theme, isDarkMode);
  }, [theme, isDarkMode]);

  // Preview tokens for dynamic updates (can be overridden)
  const [previewTokens, setPreviewTokens] = useState<Record<string, string>>({});

  // Combined tokens (base + preview overrides)
  const tokens = useMemo(() => ({
    ...baseTokens,
    ...previewTokens
  }), [baseTokens, previewTokens]);

  // Clear preview tokens when base theme changes
  useEffect(() => {
    setPreviewTokens({});
  }, [theme?.id, isDarkMode]);

  // System theme preference detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load theme mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
      setThemeModeState(savedMode);
    }
  }, []);

  // Update theme when tRPC data changes
  useEffect(() => {
    if (fetchedTheme) {
      console.log('🎯 Setting theme from fetchedTheme:', fetchedTheme.name);
      setTheme(fetchedTheme as Theme);
      setTypography(fetchedTheme.typography || DEFAULT_TYPOGRAPHY);
    } else if (companyThemes && companyThemes.length > 0) {
      // Find the default theme first (marked as isDefault)
      const defaultTheme = companyThemes.find(t => t.isDefault);
      
      if (defaultTheme) {
        console.log('🎯 Found DEFAULT theme:', defaultTheme.name, 'isDefault:', defaultTheme.isDefault);
        setTheme(defaultTheme as Theme);
        setTypography(defaultTheme.typography || DEFAULT_TYPOGRAPHY);
      } else {
        // If no default theme exists, create a basic default theme
        console.log('🎯 No default theme found. Creating default theme...');
        if (companyId && companyId.length === 24) {
          createDefaultThemeMutation.mutate({
            name: 'Default',
            companyId,
            createdById: 'system',
            lightModeConfig: generateFallbackTokens('light'),
            darkModeConfig: generateFallbackTokens('dark'),
            isDefault: true,
          });
        }
      }
    } else {
      console.log('🎯 No themes available yet');
    }
  }, [fetchedTheme, companyThemes]);
  
  // Update loading and error states
  useEffect(() => {
    setLoading(isLoading || isLoadingCompanyThemes);
    if (trpcError) {
      setError(trpcError.message);
      console.warn('Theme fetch failed, using fallback:', trpcError.message);
    }
  }, [isLoading, isLoadingCompanyThemes, trpcError]);

  const utils = trpc.useUtils();
  const updateThemeMutation = trpc.theme.updateTheme.useMutation({
    onSuccess: () => {
      // Invalidate theme queries to refetch
      utils.theme.getThemeById.invalidate();
      utils.theme.getCompanyThemes.invalidate();
    },
  });

  const createDefaultThemeMutation = trpc.theme.createTheme.useMutation({
    onSuccess: (newTheme) => {
      console.log('🎯 Created default theme:', newTheme.name);
      setTheme(newTheme as Theme);
      utils.theme.getCompanyThemes.invalidate();
    },
  });

  const setDefaultThemeMutation = trpc.theme.setDefaultTheme.useMutation({
    onSuccess: () => {
      // Invalidate theme queries to refetch
      utils.theme.getCompanyThemes.invalidate();
    },
  });

  const updateTheme = async (themeData: Partial<Theme>): Promise<void> => {
    if (!theme?.id) {
      console.warn('Cannot update theme: no active theme');
      return;
    }

    const updatedTheme = { ...theme, ...themeData };
    setTheme(updatedTheme);
    
    // Update typography if included
    if (themeData.typography) {
      setTypography(themeData.typography);
    }

    try {
      await updateThemeMutation.mutateAsync({
        themeId: theme.id,
        userId: 'default-user', // TODO: Get from auth context
        ...themeData,
      });
    } catch (err) {
      console.error('Failed to persist theme update:', err);
    }
  };

  const updateTypography = async (newTypography: ThemeTypography): Promise<void> => {
    setTypography(newTypography);
    await updateTheme({ typography: newTypography });
  };

  const applyThemeRule = (rule: ThemeRule): void => {
    const styleId = `theme-rule-${rule.id}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = generateCSSFromRule(rule);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('theme-mode', mode);
  };

  const toggleThemeMode = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const refreshTheme = async (): Promise<void> => {
    // Invalidate and refetch theme queries
    if (themeId) {
      await utils.theme.getThemeById.invalidate({ themeId });
    } else if (companyId) {
      await utils.theme.getCompanyThemes.invalidate({ companyId, activeOnly: true });
    }
  };

  const applyTheme = async (themeId: string, targetCompanyId?: string): Promise<void> => {
    const currentCompanyId = targetCompanyId || companyId;
    
    if (!currentCompanyId) {
      console.warn('Cannot apply theme: no company ID available');
      return;
    }

    try {
      await setDefaultThemeMutation.mutateAsync({
        themeId,
        companyId: currentCompanyId,
        userId: 'default-user', // TODO: Get from auth context
      });
      
      // Refresh to get the updated default theme
      await refreshTheme();
    } catch (err) {
      console.error('Failed to apply theme:', err);
      throw err;
    }
  };

  const setCurrentTheme = (newTheme: Theme) => {
    console.log('🎯 [CONTEXT] Setting current theme:', newTheme.name, 'ID:', newTheme.id);
    setTheme(newTheme);
    
    // Force a re-render by dispatching custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('theme-context-updated', {
        detail: { theme: newTheme }
      }));
    }
  };

  const updateThemeColors = (colors: Record<string, string>, mode: 'light' | 'dark') => {
    // Update preview tokens for dynamic color changes
    // This ensures consistency with the DynamicThemeProvider's token management
    if ((mode === 'light' && !isDarkMode) || (mode === 'dark' && isDarkMode)) {
      // Normalize all color values to ensure consistent OKLCH format
      const normalizedColors: Record<string, string> = {};
      
      Object.entries(colors).forEach(([key, value]) => {
        // Check if this is a color property (not typography, radius, etc.)
        if (isColorProperty(key) && typeof value === 'string') {
          normalizedColors[key] = normalizeColorValue(value);
        } else {
          normalizedColors[key] = value;
        }
      });
      
      setPreviewTokens(prevTokens => ({
        ...prevTokens,
        ...normalizedColors
      }));
    }
  };

  // Clear preview tokens to return to base theme
  const clearPreviewTokens = () => {
    setPreviewTokens({});
  };

  // Initial theme data is handled by tRPC queries above

  // Apply theme tokens and manage dark class
  useEffect(() => {
    try {
      const styleId = 'dynamic-theme-vars';
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      const cssVariables = Object.entries(tokens)
        .map(([key, value]) => {
          try {
            // Ensure proper CSS variable formatting
            let formattedValue = value;
            
            // Check if this is a color property
            if (isColorProperty(key) && typeof value === 'string') {
              // Normalize color values to ensure consistency
              formattedValue = normalizeColorValue(value);
            }
            
            return `  --${key}: ${formattedValue};`;
          } catch (err) {
            console.warn(`Failed to process token ${key}:`, err);
            return `  --${key}: oklch(0.5 0.1 250);`; // Safe fallback
          }
        })
        .join('\n');

      styleElement.textContent = `
        :root {
          ${cssVariables}
        }
        
        /* Ensure theme variables override default CSS */
        html:root {
          ${cssVariables}
        }
        
        .theme-transition * {
          transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
        }
      `;

      return () => {
        const element = document.getElementById(styleId);
        if (element) {
          element.remove();
        }
      };
    } catch (err) {
      console.error('Failed to apply theme tokens:', err);
    }
  }, [tokens]);

  // Manage dark class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Apply typography styles
  useEffect(() => {
    const styleId = 'dynamic-typography-vars';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Generate CSS for typography
    const generateTypographyStyles = (selector: string, style: import('@/types/typography').TypographyStyle) => {
      const fontUrl = style.fontFamily !== 'inherit' && !['Arial', 'Helvetica', 'Georgia', 'Times New Roman'].includes(style.fontFamily)
        ? `@import url('https://fonts.googleapis.com/css2?family=${style.fontFamily.replace(/\s+/g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap');\n`
        : '';
      
      return `${fontUrl}${selector} {
        font-family: '${style.fontFamily}', sans-serif;
        font-size: ${style.fontSize}px;
        font-weight: ${style.fontWeight};
        font-style: ${style.fontStyle};
        text-transform: ${style.textTransform};
        text-decoration: ${style.textDecoration};
        line-height: ${style.lineHeight};
        letter-spacing: ${style.letterSpacing}em;
        word-spacing: ${style.wordSpacing}em;
      }`;
    };

    const styles = `
      /* Base typography */
      ${generateTypographyStyles('body, p', typography.base)}
      
      /* Accent typography */
      ${generateTypographyStyles('.text-accent, strong, b, em', typography.accent)}
      
      /* Quote typography */
      ${generateTypographyStyles('blockquote, .quote', typography.quote)}
      
      /* Headings */
      ${generateTypographyStyles('h1, .text-h1', typography.h1)}
      ${generateTypographyStyles('h2, .text-h2', typography.h2)}
      ${generateTypographyStyles('h3, .text-h3', typography.h3)}
      ${generateTypographyStyles('h4, .text-h4', typography.h4)}
      ${generateTypographyStyles('h5, .text-h5', typography.h5)}
    `;

    styleElement.textContent = styles;

    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [typography]);

  const contextValue: ThemeContextValue = {
    theme,
    loading,
    error,
    tokens,
    typography,
    themeMode,
    isDarkMode,
    setThemeMode,
    toggleThemeMode,
    updateTheme,
    updateTypography,
    applyThemeRule,
    applyTheme,
    refreshTheme,
    setCurrentTheme,
    updateThemeColors,
    clearPreviewTokens,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useCompanyTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useCompanyTheme must be used within DynamicThemeProvider');
  }
  return context;
};