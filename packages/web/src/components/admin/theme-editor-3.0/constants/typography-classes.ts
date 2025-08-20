/**
 * SISTEMA ESTANDARIZADO DE CLASES TIPOGRÁFICAS - THEME EDITOR 3.0
 * 
 * Este archivo define las clases tipográficas estándar para uso consistente
 * en todo el Theme Editor 3.0, basadas en variables CSS globales.
 */

/**
 * Clases tipográficas semánticas usando las fuentes del sistema global
 */
export const TYPOGRAPHY_CLASSES = {
  // Headers - usando font-sans del sistema global
  h1: 'font-sans text-4xl font-bold leading-tight tracking-tight',
  h2: 'font-sans text-3xl font-semibold leading-tight tracking-tight', 
  h3: 'font-sans text-2xl font-semibold leading-snug',
  h4: 'font-sans text-xl font-medium leading-snug',
  h5: 'font-sans text-lg font-medium leading-normal',
  h6: 'font-sans text-base font-medium leading-normal',
  
  // Content - usando font-sans del sistema global
  paragraph: 'font-sans text-base font-normal leading-relaxed',
  lead: 'font-sans text-lg font-normal leading-relaxed text-muted-foreground',
  large: 'font-sans text-lg font-medium',
  small: 'font-sans text-sm font-normal',
  muted: 'font-sans text-sm font-normal text-muted-foreground',
  
  // Special content - usando font-serif para quotes
  quote: 'font-serif text-lg font-normal leading-relaxed italic',
  blockquote: 'font-serif text-lg font-normal leading-relaxed italic border-l-4 border-primary pl-4',
  
  // Code and technical - usando font-mono del sistema global  
  code: 'font-mono text-sm font-normal bg-muted px-1 rounded',
  pre: 'font-mono text-sm font-normal bg-muted p-4 rounded-lg overflow-auto',
  kbd: 'font-mono text-xs font-medium bg-muted border border-border px-1 rounded',
  
  // UI Labels - estandarizadas para Theme Editor
  label: 'font-sans text-xs font-medium text-muted-foreground uppercase tracking-wide',
  caption: 'font-sans text-xs font-normal text-muted-foreground',
  overline: 'font-sans text-xs font-medium text-muted-foreground uppercase tracking-wider',
  
  // Button text variants
  'button-sm': 'font-sans text-sm font-medium',
  'button-base': 'font-sans text-base font-medium',
  'button-lg': 'font-sans text-lg font-medium',
  
  // Input text
  'input-text': 'font-sans text-base font-normal',
  'input-label': 'font-sans text-sm font-medium text-foreground',
  'input-help': 'font-sans text-xs font-normal text-muted-foreground',
  'input-error': 'font-sans text-xs font-medium text-destructive'
} as const;

/**
 * Tokens de tamaño de fuente usando rem (consistente con Tailwind)
 */
export const FONT_SIZE_TOKENS = {
  'font-size-xs': '0.75rem',     // 12px
  'font-size-sm': '0.875rem',    // 14px  
  'font-size-base': '1rem',      // 16px
  'font-size-lg': '1.125rem',    // 18px
  'font-size-xl': '1.25rem',     // 20px
  'font-size-2xl': '1.5rem',     // 24px
  'font-size-3xl': '1.875rem',   // 30px
  'font-size-4xl': '2.25rem',    // 36px
  'font-size-5xl': '3rem',       // 48px
  'font-size-6xl': '3.75rem',    // 60px
} as const;

/**
 * Tokens de line-height consistentes
 */
export const LINE_HEIGHT_TOKENS = {
  'line-height-none': '1',
  'line-height-tight': '1.25',
  'line-height-snug': '1.375',
  'line-height-normal': '1.5',
  'line-height-relaxed': '1.625',
  'line-height-loose': '2'
} as const;

/**
 * Tokens de letter-spacing
 */
export const LETTER_SPACING_TOKENS = {
  'letter-spacing-tighter': '-0.05em',
  'letter-spacing-tight': '-0.025em', 
  'letter-spacing-normal': '0em',
  'letter-spacing-wide': '0.025em',
  'letter-spacing-wider': '0.05em',
  'letter-spacing-widest': '0.1em'
} as const;

/**
 * Función utilitaria para obtener una clase tipográfica
 */
export function getTypographyClass(variant: keyof typeof TYPOGRAPHY_CLASSES): string {
  return TYPOGRAPHY_CLASSES[variant];
}

/**
 * Función utilitaria para crear clases tipográficas personalizadas
 */
export function createTypographyClass({
  family = 'sans',
  size = 'base', 
  weight = 'normal',
  leading = 'normal',
  tracking = 'normal'
}: {
  family?: 'sans' | 'serif' | 'mono';
  size?: keyof typeof FONT_SIZE_TOKENS | string;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | string;
  leading?: keyof typeof LINE_HEIGHT_TOKENS | string;
  tracking?: keyof typeof LETTER_SPACING_TOKENS | string;
}): string {
  const fontFamily = `font-${family}`;
  const fontSize = size in FONT_SIZE_TOKENS ? `text-${size}` : `text-${size}`;
  const fontWeight = `font-${weight}`;
  const lineHeight = leading in LINE_HEIGHT_TOKENS ? `leading-${leading}` : `leading-${leading}`;
  const letterSpacing = tracking in LETTER_SPACING_TOKENS ? `tracking-${tracking}` : `tracking-${tracking}`;
  
  return `${fontFamily} ${fontSize} ${fontWeight} ${lineHeight} ${letterSpacing}`;
}

/**
 * Mapeo de clases legacy a clases estándar (para migración)
 */
export const LEGACY_CLASS_MAPPING = {
  // Clases comunes que se encontraron en el análisis
  'text-xs font-medium text-muted-foreground': TYPOGRAPHY_CLASSES.label,
  'text-sm font-medium': TYPOGRAPHY_CLASSES['button-sm'],
  'text-lg font-semibold': TYPOGRAPHY_CLASSES.h5,
  'font-medium text-sm': TYPOGRAPHY_CLASSES['button-sm'],
  'text-xs': TYPOGRAPHY_CLASSES.caption,
  'text-sm': TYPOGRAPHY_CLASSES.small,
} as const;

/**
 * Tipos TypeScript para mejor DX
 */
export type TypographyVariant = keyof typeof TYPOGRAPHY_CLASSES;
export type FontSizeToken = keyof typeof FONT_SIZE_TOKENS;
export type LineHeightToken = keyof typeof LINE_HEIGHT_TOKENS;
export type LetterSpacingToken = keyof typeof LETTER_SPACING_TOKENS;