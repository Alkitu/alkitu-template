// Theme Editor 3.0 - CSS Variables Management
import { ThemeData, ThemeColors, ThemeBorders, ThemeSpacing, OklchColor } from '../../../core/types/theme.types';
import { CSS_VARIABLE_MAP } from '../../../core/types/color-sections.types';
import { oklchToHex } from '../color/color-conversions';
import { TypographyElements } from '../../../theme-editor/editor/typography/types';

/**
 * Converts OKLCH color object to CSS oklch() string
 */
export function oklchToString(oklch: OklchColor): string {
  const { l, c, h } = oklch;
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(4)})`;
}

/**
 * Parses OKLCH string to OKLCH color object
 */
export function parseOklchString(value: string): OklchColor | null {
  // Match oklch(l c h) - no alpha support
  const match = value.match(/oklch\(([^)]+)\)/);
  if (!match) return null;

  const parts = match[1].split(/\s+/);
  if (parts.length < 3) return null;

  const l = parseFloat(parts[0]);
  const c = parseFloat(parts[1]);
  const h = parseFloat(parts[2]);

  if (isNaN(l) || isNaN(c) || isNaN(h)) return null;

  return { l, c, h };
}

/**
 * Applies mode-specific colors to CSS root variables V2
 * Uses OKLCH strings as source of truth for precise color representation
 */
export function applyModeSpecificColors(colors: ThemeColors): void {
  const root = document.documentElement;

  Object.entries(colors).forEach(([colorKey, colorToken]) => {
    const cssVariable = CSS_VARIABLE_MAP[colorKey as keyof ThemeColors];
    if (cssVariable) {
      // Prefer oklchString for precise colors, fallback to legacy value
      const colorValue = colorToken.oklchString || colorToken.value;
      if (colorValue) {
        root.style.setProperty(cssVariable, colorValue);
      }
    }
  });
}

/**
 * Applies complete theme to CSS root variables
 * NOTE: For colors, use applyModeSpecificColors() instead
 */
export function applyThemeToRoot(theme: ThemeData, mode: 'light' | 'dark' = 'light'): void {
  const root = document.documentElement;

  // Apply mode-specific colors
  const colors = mode === 'dark' ? theme.darkColors : theme.lightColors;
  applyModeSpecificColors(colors);

  // Apply typography
  root.style.setProperty('--font-sans', theme.typography.fontFamilies.sans);
  root.style.setProperty('--font-serif', theme.typography.fontFamilies.serif);
  root.style.setProperty('--font-mono', theme.typography.fontFamilies.mono);
  root.style.setProperty('--tracking-normal', theme.typography.trackingNormal);

  // Apply borders
  root.style.setProperty('--radius', theme.borders.radius);

  // Apply specific border radius variables if available
  if (theme.borders.radiusButton) {
    root.style.setProperty('--radius-button', theme.borders.radiusButton);
  }
  if (theme.borders.radiusCard) {
    root.style.setProperty('--radius-card', theme.borders.radiusCard);
  }
  if (theme.borders.radiusCheckbox) {
    root.style.setProperty('--radius-checkbox', theme.borders.radiusCheckbox);
  }
  if (theme.borders.radiusButtonInner) {
    root.style.setProperty('--radius-button-inner', theme.borders.radiusButtonInner);
  }
  if (theme.borders.radiusCardInner) {
    root.style.setProperty('--radius-card-inner', theme.borders.radiusCardInner);
  }
  if (theme.borders.radiusCheckboxInner) {
    root.style.setProperty('--radius-checkbox-inner', theme.borders.radiusCheckboxInner);
  }

  // Apply spacing (use --theme-spacing-base to avoid overriding Tailwind v4's --spacing)
  root.style.setProperty('--theme-spacing-base', theme.spacing.spacing);

  // Apply shadows
  Object.entries({
    '--shadow-2xs': theme.shadows.shadow2xs,
    '--shadow-xs': theme.shadows.shadowXs,
    '--shadow-sm': theme.shadows.shadowSm,
    '--shadow': theme.shadows.shadow,
    '--shadow-md': theme.shadows.shadowMd,
    '--shadow-lg': theme.shadows.shadowLg,
    '--shadow-xl': theme.shadows.shadowXl,
    '--shadow-2xl': theme.shadows.shadow2xl
  }).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Apply scroll settings
  applyScrollElements(theme.scroll);
}

/**
 * Valid TypographyElement keys — used to filter out non-element keys
 * (e.g. fontFamilies, trackingNormal) that come from ThemeTypography merge.
 */
const TYPOGRAPHY_ELEMENT_KEYS: (keyof TypographyElements)[] = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'paragraph', 'quote', 'emphasis',
];

/**
 * Applies typography elements to CSS root variables
 */
export function applyTypographyElements(typography: TypographyElements): void {
  const root = document.documentElement;

  // Apply each typography element as CSS variables
  Object.entries(typography).forEach(([elementKey, element]) => {
    // Skip non-element keys (fontFamilies, trackingNormal) that come from ThemeTypography merge
    if (!TYPOGRAPHY_ELEMENT_KEYS.includes(elementKey as keyof TypographyElements)) return;

    const prefix = `--typography-${elementKey}`;

    root.style.setProperty(`${prefix}-font-family`, element.fontFamily);
    root.style.setProperty(`${prefix}-font-size`, element.fontSize);
    root.style.setProperty(`${prefix}-font-weight`, element.fontWeight);
    root.style.setProperty(`${prefix}-line-height`, element.lineHeight);
    root.style.setProperty(`${prefix}-letter-spacing`, element.letterSpacing);
    root.style.setProperty(`${prefix}-word-spacing`, element.wordSpacing);
    root.style.setProperty(`${prefix}-text-decoration`, element.textDecoration);
    root.style.setProperty(`${prefix}-font-style`, element.fontStyle);
  });
}

/**
 * Applies borders values to CSS root variables
 */
export function applyBorderElements(borders: ThemeBorders): void {
  const root = document.documentElement;

  // Create a safe borders object with fallbacks to prevent "undefined" CSS variable values
  // which break tailwind rendering leading to 0px radii (sharp corners).
  const safeBorders = {
    radius: borders?.radius || '0.625rem',
    radiusSm: borders?.radiusSm,
    radiusMd: borders?.radiusMd,
    radiusLg: borders?.radiusLg,
    radiusXl: borders?.radiusXl,
    radiusButton: borders?.radiusButton,
    radiusCard: borders?.radiusCard,
    radiusCheckbox: borders?.radiusCheckbox,
    radiusButtonInner: borders?.radiusButtonInner,
    radiusCardInner: borders?.radiusCardInner,
    radiusCheckboxInner: borders?.radiusCheckboxInner,
  };

  // Apply main radius
  root.style.setProperty('--radius', safeBorders.radius);

  // Apply specific border radius variables
  if (safeBorders.radiusButton) {
    root.style.setProperty('--radius-button', safeBorders.radiusButton);
  }
  if (safeBorders.radiusCard) {
    root.style.setProperty('--radius-card', safeBorders.radiusCard);
  }
  if (safeBorders.radiusCheckbox) {
    root.style.setProperty('--radius-checkbox', safeBorders.radiusCheckbox);
  }
  if (safeBorders.radiusButtonInner) {
    root.style.setProperty('--radius-button-inner', safeBorders.radiusButtonInner);
  }
  if (safeBorders.radiusCardInner) {
    root.style.setProperty('--radius-card-inner', safeBorders.radiusCardInner);
  }
  if (safeBorders.radiusCheckboxInner) {
    root.style.setProperty('--radius-checkbox-inner', safeBorders.radiusCheckboxInner);
  }
  if (safeBorders.radiusSm) {
    root.style.setProperty('--radius-sm', safeBorders.radiusSm);
  }
  if (safeBorders.radiusMd) {
    root.style.setProperty('--radius-md', safeBorders.radiusMd);
  }
  if (safeBorders.radiusLg) {
    root.style.setProperty('--radius-lg', safeBorders.radiusLg);
  }
  if (safeBorders.radiusXl) {
    root.style.setProperty('--radius-xl', safeBorders.radiusXl);
  }
}

/**
 * Applies spacing values to CSS root variables.
 * Accepts either a ThemeSpacing object { spacing, scale } or a flat Record<string, string>.
 */
export function applySpacingElements(spacing: ThemeSpacing | Record<string, string>): void {
  const root = document.documentElement;

  // Handle ThemeSpacing structure: { spacing: string, scale?: Record<string, string> }
  if ('spacing' in spacing && typeof (spacing as ThemeSpacing).spacing === 'string') {
    const themeSpacing = spacing as ThemeSpacing;
    root.style.setProperty('--theme-spacing-base', themeSpacing.spacing);
    if (themeSpacing.scale && typeof themeSpacing.scale === 'object') {
      Object.entries(themeSpacing.scale).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--spacing-${key}`, value);
        }
      });
    }
    return;
  }

  // Handle flat Record<string, string> (e.g., from SpacingEditor's currentScale)
  Object.entries(spacing).forEach(([spacingKey, value]) => {
    if (typeof value === 'string') {
      root.style.setProperty(`--spacing-${spacingKey}`, value);
    }
  });
}

/**
 * Applies shadow values to CSS root variables
 */
export function applyShadowElements(shadows: Record<string, string>): void {
  const root = document.documentElement;

  // Map shadow keys to CSS variable names
  const shadowMap: Record<string, string> = {
    'shadow2xs': '--shadow-2xs',
    'shadowXs': '--shadow-xs',
    'shadowSm': '--shadow-sm',
    'shadow': '--shadow',
    'shadowMd': '--shadow-md',
    'shadowLg': '--shadow-lg',
    'shadowXl': '--shadow-xl',
    'shadow2xl': '--shadow-2xl'
  };

  // Apply each shadow value as CSS variables
  Object.entries(shadows).forEach(([shadowKey, value]) => {
    const cssVar = shadowMap[shadowKey];
    if (cssVar) {
      root.style.setProperty(cssVar, value);
    }
  });
}

/**
 * Applies scroll values to CSS root variables and scrollbar styles
 * UNIFIED SCROLLBAR SYSTEM - Replaces all other scrollbar styling
 */
export function applyScrollElements(scroll: { width: string; behavior: 'auto' | 'smooth' | 'instant'; smooth: boolean; hide: boolean; trackRadius?: string; thumbRadius?: string; }): void {
  const root = document.documentElement;

  // Apply scroll behavior to html element
  root.style.setProperty('scroll-behavior', scroll.behavior);

  // Apply scrollbar style variables for reference
  root.style.setProperty('--scrollbar-width', scroll.width);
  root.style.setProperty('--scrollbar-track-radius', scroll.trackRadius || '0px');
  root.style.setProperty('--scrollbar-thumb-radius', scroll.thumbRadius || '4px');

  // REMOVE OLD STYLE ELEMENTS FIRST to prevent conflicts
  const oldStaticStyles = document.getElementById('theme-scrollbar-styles');
  if (oldStaticStyles) {
    oldStaticStyles.remove();
  }

  // Apply scrollbar visibility and styling
  if (scroll.hide) {
    // Hide scrollbars completely
    const style = `
      /* Hide all scrollbars across all browsers */
      * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      *::-webkit-scrollbar {
        display: none !important;
        width: 0px !important;
        height: 0px !important;
      }
    `;

    // Apply hidden scrollbar styles
    let scrollbarStyleElement = document.getElementById('unified-scrollbar-styles');
    if (!scrollbarStyleElement) {
      scrollbarStyleElement = document.createElement('style');
      scrollbarStyleElement.id = 'unified-scrollbar-styles';
      document.head.appendChild(scrollbarStyleElement);
    }
    scrollbarStyleElement.textContent = style;
  } else {
    // Show custom scrollbars - SIMPLIFIED VERSION focusing on colors first
    const style = `
      /* UNIFIED SCROLLBAR SYSTEM - STEP 1: COLORS ONLY */
      
      /* Firefox scrollbars - Simple colors */
      * {
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
      }
      
      /* Webkit scrollbars - Focus on width and colors */  
      *::-webkit-scrollbar {
        width: ${scroll.width} !important;
        height: ${scroll.width} !important;
      }
      
      *::-webkit-scrollbar-track {
        background: var(--scrollbar-track);
        border-radius: ${scroll.trackRadius || '0px'};
      }
      
      *::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb);
        border-radius: ${scroll.thumbRadius || '4px'};
        border: 1px solid var(--scrollbar-track);
      }
      
      *::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-thumb);
        opacity: 0.8;
      }
      
      /* Override static classes - INCLUDING WIDTH */
      .scrollbar-thin::-webkit-scrollbar {
        width: ${scroll.width} !important;
        height: ${scroll.width} !important;
      }
      
      .scrollbar-thin::-webkit-scrollbar-track {
        background: var(--scrollbar-track) !important;
      }
      
      .scrollbar-thin::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb) !important;
      }
      
      /* Additional overrides for common scrollbar containers */
      div::-webkit-scrollbar,
      section::-webkit-scrollbar,
      article::-webkit-scrollbar {
        width: ${scroll.width} !important;
        height: ${scroll.width} !important;
      }
    `;

    // Apply custom scrollbar styles
    let scrollbarStyleElement = document.getElementById('unified-scrollbar-styles');
    if (!scrollbarStyleElement) {
      scrollbarStyleElement = document.createElement('style');
      scrollbarStyleElement.id = 'unified-scrollbar-styles';
      document.head.appendChild(scrollbarStyleElement);
    }
    scrollbarStyleElement.textContent = style;
  }
}

/**
 * Gets current CSS variable value from root
 */
export function getCSSVariableValue(variableName: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}

/**
 * Updates a single CSS variable in root
 */
export function updateCSSVariable(variableName: string, value: string): void {
  document.documentElement.style.setProperty(variableName, value);
}

/**
 * Applies ONLY scrollbar colors from theme colors
 * This ensures scrollbar colors update immediately when changed in Theme Editor
 */
export function applyScrollbarColors(colors: import('../../../core/types/theme.types').ThemeColors): void {
  const root = document.documentElement;

  if (colors.scrollbarTrack) {
    const trackValue = colors.scrollbarTrack.oklchString || colors.scrollbarTrack.value || null;
    root.style.setProperty('--scrollbar-track', trackValue);
  }

  if (colors.scrollbarThumb) {
    const thumbValue = colors.scrollbarThumb.oklchString || colors.scrollbarThumb.value || null;
    root.style.setProperty('--scrollbar-thumb', thumbValue);
  }
}

/**
 * SOLUTION 1: Apply scrollbar styling using CSS Custom Properties + Utility Classes
 * This is more reliable than dynamic CSS injection
 */
export function applyScrollbarUtilityClass(scroll: { width: string; behavior: 'auto' | 'smooth' | 'instant'; smooth: boolean; hide: boolean; trackRadius?: string; thumbRadius?: string; }, colors: { scrollbarTrack?: { value?: string }; scrollbarThumb?: { value?: string } }): void {
  const root = document.documentElement;

  // Step 1: Add the utility class to body/html
  if (!document.body.classList.contains('dynamic-scrollbar')) {
    document.body.classList.add('dynamic-scrollbar');
  }

  // Step 2: Update CSS custom properties
  root.style.setProperty('--dynamic-scrollbar-width', scroll.width);
  root.style.setProperty('--dynamic-scrollbar-track-radius', scroll.trackRadius || '0px');
  root.style.setProperty('--dynamic-scrollbar-thumb-radius', scroll.thumbRadius || '4px');
  root.style.setProperty('--dynamic-scrollbar-track-color', colors.scrollbarTrack?.value || '#ffffff');
  root.style.setProperty('--dynamic-scrollbar-thumb-color', colors.scrollbarThumb?.value || '#cdcdcd');

  // Step 3: Apply scroll behavior
  root.style.setProperty('scroll-behavior', scroll.behavior);

  // Step 4: Handle hide/show
  if (scroll.hide) {
    document.body.classList.add('scrollbar-hidden');
    document.body.classList.remove('dynamic-scrollbar');
  } else {
    document.body.classList.remove('scrollbar-hidden');
    document.body.classList.add('dynamic-scrollbar');
  }
}

/**
 * Removes theme-related CSS variables from root
 */
export function resetThemeVariables(): void {
  const root = document.documentElement;

  // Remove all color variables
  Object.values(CSS_VARIABLE_MAP).forEach(variable => {
    root.style.removeProperty(variable);
  });

  // Remove polluted typography variables from non-element keys (fontFamilies, trackingNormal)
  const pollutedTypographyPrefixes = ['--typography-fontFamilies', '--typography-trackingNormal'];
  const typographySuffixes = [
    '-font-family', '-font-size', '-font-weight', '-line-height',
    '-letter-spacing', '-word-spacing', '-text-decoration', '-font-style',
  ];
  pollutedTypographyPrefixes.forEach(prefix => {
    typographySuffixes.forEach(suffix => {
      root.style.removeProperty(`${prefix}${suffix}`);
    });
  });

  // Remove other theme variables
  const themeVariables = [
    '--font-sans', '--font-serif', '--font-mono', '--tracking-normal',
    '--radius', '--theme-spacing-base',
    '--shadow-2xs', '--shadow-xs', '--shadow-sm', '--shadow',
    '--shadow-md', '--shadow-lg', '--shadow-xl', '--shadow-2xl',
    '--scrollbar-width', '--scrollbar-track-radius', '--scrollbar-thumb-radius'
  ];

  themeVariables.forEach(variable => {
    root.style.removeProperty(variable);
  });

  // Remove scroll behavior and scrollbar styles
  root.style.removeProperty('scroll-behavior');

  // Remove both old and new scrollbar style elements
  const oldScrollbarStyleElement = document.getElementById('theme-scrollbar-styles');
  if (oldScrollbarStyleElement) {
    oldScrollbarStyleElement.remove();
  }

  const unifiedScrollbarStyleElement = document.getElementById('unified-scrollbar-styles');
  if (unifiedScrollbarStyleElement) {
    unifiedScrollbarStyleElement.remove();
  }
}

/**
 * Generates CSS string for theme export
 */
export function generateThemeCSS(theme: ThemeData, includeLight = true, includeDark = true): string {
  let css = '';

  if (includeLight) {
    css += `:root {\n`;

    // Light mode colors
    Object.entries(theme.lightColors).forEach(([colorKey, colorToken]) => {
      const cssVariable = CSS_VARIABLE_MAP[colorKey as keyof ThemeColors];
      if (cssVariable) {
        const hexValue = oklchToHex(colorToken.oklch);
        css += `  ${cssVariable}: ${colorToken.value}; /* ${hexValue} */\n`;
      }
    });

    // Typography
    css += `  --font-sans: ${theme.typography.fontFamilies.sans};\n`;
    css += `  --font-serif: ${theme.typography.fontFamilies.serif};\n`;
    css += `  --font-mono: ${theme.typography.fontFamilies.mono};\n`;
    css += `  --tracking-normal: ${theme.typography.trackingNormal};\n`;

    // Borders
    css += `  --radius: ${theme.borders.radius};\n`;

    // Spacing (use --theme-spacing-base to avoid overriding Tailwind v4's --spacing)
    css += `  --theme-spacing-base: ${theme.spacing.spacing};\n`;

    // Shadows
    css += `  --shadow-2xs: ${theme.shadows.shadow2xs};\n`;
    css += `  --shadow-xs: ${theme.shadows.shadowXs};\n`;
    css += `  --shadow-sm: ${theme.shadows.shadowSm};\n`;
    css += `  --shadow: ${theme.shadows.shadow};\n`;
    css += `  --shadow-md: ${theme.shadows.shadowMd};\n`;
    css += `  --shadow-lg: ${theme.shadows.shadowLg};\n`;
    css += `  --shadow-xl: ${theme.shadows.shadowXl};\n`;
    css += `  --shadow-2xl: ${theme.shadows.shadow2xl};\n`;

    // Scroll settings
    css += `  --scrollbar-width: ${theme.scroll.width};\n`;
    css += `  --scrollbar-track-radius: ${theme.scroll.trackRadius || '0px'};\n`;
    css += `  --scrollbar-thumb-radius: ${theme.scroll.thumbRadius || '4px'};\n`;
    css += `  scroll-behavior: ${theme.scroll.behavior};\n`;

    css += `}\n\n`;
  }

  if (includeDark) {
    css += `.dark {\n`;

    // Dark mode colors
    Object.entries(theme.darkColors).forEach(([colorKey, colorToken]) => {
      const cssVariable = CSS_VARIABLE_MAP[colorKey as keyof ThemeColors];
      if (cssVariable) {
        const hexValue = oklchToHex(colorToken.oklch);
        css += `  ${cssVariable}: ${colorToken.value}; /* ${hexValue} */\n`;
      }
    });

    css += `}\n\n`;
  }

  return css;
}

/**
 * Applies theme mode (light/dark) by toggling CSS class
 */
export function applyThemeMode(mode: 'light' | 'dark'): void {
  const html = document.documentElement;

  if (mode === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}