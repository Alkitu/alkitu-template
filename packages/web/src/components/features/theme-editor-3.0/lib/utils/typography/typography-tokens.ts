/**
 * SISTEMA DE TOKENS TIPOGRÁFICOS - THEME EDITOR 3.0
 * 
 * Utilidades para generar y aplicar tokens tipográficos consistentes
 * que se integran con el sistema global de tipografía.
 */

import { TYPOGRAPHY_CLASSES, FONT_SIZE_TOKENS, LINE_HEIGHT_TOKENS, LETTER_SPACING_TOKENS } from '../../../core/constants/typography-classes';

/**
 * Interface para un token tipográfico completo
 */
export interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textDecoration?: string;
  textTransform?: string;
  color?: string;
}

/**
 * Tokens tipográficos basados en el sistema global
 */
export const SYSTEM_TYPOGRAPHY_TOKENS = {
  // Headers
  h1: {
    fontFamily: 'var(--font-sans)',
    fontSize: '2.25rem', // text-4xl
    fontWeight: '700',    // font-bold
    lineHeight: '1.25',   // leading-tight
    letterSpacing: '-0.025em', // tracking-tight
    textDecoration: 'none'
  },
  h2: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.875rem', // text-3xl
    fontWeight: '600',     // font-semibold
    lineHeight: '1.25',    // leading-tight
    letterSpacing: '-0.025em', // tracking-tight
    textDecoration: 'none'
  },
  h3: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.5rem',   // text-2xl
    fontWeight: '600',     // font-semibold
    lineHeight: '1.375',   // leading-snug
    letterSpacing: '0em',  // tracking-normal
    textDecoration: 'none'
  },
  h4: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.25rem',  // text-xl
    fontWeight: '500',     // font-medium
    lineHeight: '1.375',   // leading-snug
    letterSpacing: '0em',  // tracking-normal
    textDecoration: 'none'
  },
  h5: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.125rem', // text-lg
    fontWeight: '500',     // font-medium
    lineHeight: '1.5',     // leading-normal
    letterSpacing: '0em',  // tracking-normal
    textDecoration: 'none'
  },
  h6: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',     // text-base
    fontWeight: '500',     // font-medium
    lineHeight: '1.5',     // leading-normal
    letterSpacing: '0em',  // tracking-normal
    textDecoration: 'none'
  },
  
  // Content
  paragraph: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',     // text-base
    fontWeight: '400',     // font-normal
    lineHeight: '1.625',   // leading-relaxed
    letterSpacing: '0em',  // tracking-normal
    textDecoration: 'none'
  },
  lead: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.125rem', // text-lg
    fontWeight: '400',     // font-normal
    lineHeight: '1.625',   // leading-relaxed
    letterSpacing: '0em',  // tracking-normal
    textDecoration: 'none',
    color: 'hsl(var(--muted-foreground))'
  },
  quote: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.125rem', // text-lg
    fontWeight: '400',     // font-normal
    lineHeight: '1.625',   // leading-relaxed
    letterSpacing: '0.01em', // tracking-wide
    textDecoration: 'none'
  },
  
  // UI Components
  label: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',  // text-xs
    fontWeight: '500',     // font-medium
    lineHeight: '1.5',     // leading-normal
    letterSpacing: '0.05em', // tracking-wider
    textDecoration: 'none',
    textTransform: 'uppercase',
    color: 'hsl(var(--muted-foreground))'
  },
  caption: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',  // text-xs
    fontWeight: '400',     // font-normal
    lineHeight: '1.5',     // leading-normal
    letterSpacing: '0em',  // tracking-normal
    textDecoration: 'none',
    color: 'hsl(var(--muted-foreground))'
  },
  small: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem', // text-sm
    fontWeight: '400',     // font-normal
    lineHeight: '1.5',     // leading-normal
    letterSpacing: '0em',  // tracking-normal
    textDecoration: 'none'
  },
  
  // Code
  code: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem', // text-sm
    fontWeight: '400',     // font-normal
    lineHeight: '1.5',     // leading-normal
    letterSpacing: '0em',  // tracking-normal
    textDecoration: 'none'
  }
} as const;

/**
 * Función para aplicar tokens tipográficos a un elemento
 */
export function applyTypographyToken(
  element: HTMLElement,
  token: TypographyToken
): void {
  element.style.fontFamily = token.fontFamily;
  element.style.fontSize = token.fontSize;
  element.style.fontWeight = token.fontWeight;
  element.style.lineHeight = token.lineHeight;
  element.style.letterSpacing = token.letterSpacing;

  if (token.textDecoration) {
    element.style.textDecoration = token.textDecoration;
  }
  if ('textTransform' in token && token.textTransform) {
    element.style.textTransform = token.textTransform;
  }
  if ('color' in token && token.color) {
    element.style.color = token.color;
  }
}

/**
 * Función para generar CSS variables de tipografía
 */
export function generateTypographyCSSVariables(
  prefix: string = '--typography'
): string {
  let css = '';
  
  (Object.entries(SYSTEM_TYPOGRAPHY_TOKENS) as [string, TypographyToken][]).forEach(([name, token]) => {
    css += `  ${prefix}-${name}-font-family: ${token.fontFamily};\n`;
    css += `  ${prefix}-${name}-font-size: ${token.fontSize};\n`;
    css += `  ${prefix}-${name}-font-weight: ${token.fontWeight};\n`;
    css += `  ${prefix}-${name}-line-height: ${token.lineHeight};\n`;
    css += `  ${prefix}-${name}-letter-spacing: ${token.letterSpacing};\n`;

    if (token.textDecoration) {
      css += `  ${prefix}-${name}-text-decoration: ${token.textDecoration};\n`;
    }
    if (token.textTransform) {
      css += `  ${prefix}-${name}-text-transform: ${token.textTransform};\n`;
    }
    if (token.color) {
      css += `  ${prefix}-${name}-color: ${token.color};\n`;
    }
    css += '\n';
  });
  
  return css;
}

/**
 * Función para inyectar tokens tipográficos en el DOM
 */
export function injectTypographyTokens(): void {
  const existingStyle = document.getElementById('typography-tokens');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  const style = document.createElement('style');
  style.id = 'typography-tokens';
  style.textContent = `
:root {
${generateTypographyCSSVariables()}
}

/* Clases utilitarias basadas en tokens */
${(Object.entries(SYSTEM_TYPOGRAPHY_TOKENS) as [string, TypographyToken][]).map(([name, token]) => `
.typography-${name} {
  font-family: var(--typography-${name}-font-family);
  font-size: var(--typography-${name}-font-size);
  font-weight: var(--typography-${name}-font-weight);
  line-height: var(--typography-${name}-line-height);
  letter-spacing: var(--typography-${name}-letter-spacing);
  ${token.textDecoration ? `text-decoration: var(--typography-${name}-text-decoration);` : ''}
  ${token.textTransform ? `text-transform: var(--typography-${name}-text-transform);` : ''}
  ${token.color ? `color: var(--typography-${name}-color);` : ''}
}`).join('')}
  `;
  
  document.head.appendChild(style);
}

/**
 * Función para crear un token tipográfico personalizado
 */
export function createTypographyToken(
  config: Partial<TypographyToken> & { fontFamily: string }
): TypographyToken {
  return {
    fontSize: config.fontSize || '1rem',
    fontWeight: config.fontWeight || '400',
    lineHeight: config.lineHeight || '1.5',
    letterSpacing: config.letterSpacing || '0em',
    textDecoration: config.textDecoration || 'none',
    ...config
  };
}

/**
 * Función para validar tokens tipográficos
 */
export function validateTypographyToken(token: TypographyToken): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Validar font-family
  if (!token.fontFamily.includes('var(--font-')) {
    errors.push('Font family should use CSS variables (var(--font-*))');
  }
  
  // Validar font-size
  if (!token.fontSize.match(/^\d+(\.\d+)?(rem|em|px)$/)) {
    errors.push('Font size should be in rem, em, or px units');
  }
  
  // Validar font-weight
  if (!token.fontWeight.match(/^(100|200|300|400|500|600|700|800|900)$/)) {
    errors.push('Font weight should be a numeric value (100-900)');
  }
  
  // Validar line-height
  if (!token.lineHeight.match(/^\d+(\.\d+)?$/)) {
    errors.push('Line height should be a unitless number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Función para obtener un token tipográfico por nombre
 */
export function getTypographyToken(name: keyof typeof SYSTEM_TYPOGRAPHY_TOKENS): TypographyToken {
  return SYSTEM_TYPOGRAPHY_TOKENS[name];
}

/**
 * Tipos exportados para TypeScript
 */
export type SystemTypographyTokenName = keyof typeof SYSTEM_TYPOGRAPHY_TOKENS;
export type TypographyTokenConfig = Partial<TypographyToken> & { fontFamily: string };