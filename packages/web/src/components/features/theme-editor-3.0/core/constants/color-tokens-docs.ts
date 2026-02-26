/**
 * DOCUMENTACIÓN DE TOKENS DE COLOR - THEME EDITOR 3.0
 * 
 * Este archivo documenta los tokens de color utilizados en el Theme Editor 3.0
 * y su relación con el sistema global de colores.
 */

export const COLOR_TOKENS_DOCUMENTATION = {
  /**
   * TOKENS ESTÁNDAR DEL SISTEMA
   * Estos tokens están definidos en globals.css y son utilizados consistentemente
   */
  STANDARD_TOKENS: {
    // Colores principales
    'primary': 'Color primario de la marca',
    'primary-foreground': 'Texto sobre fondo primario',
    'secondary': 'Color secundario de la marca',
    'secondary-foreground': 'Texto sobre fondo secundario',
    'accent': 'Color de acento/énfasis',
    'accent-foreground': 'Texto sobre fondo de acento',
    
    // Colores de superficie
    'background': 'Fondo principal de la aplicación',
    'foreground': 'Texto principal',
    'card': 'Fondo de tarjetas y contenedores',
    'card-foreground': 'Texto sobre tarjetas',
    'popover': 'Fondo de popovers y menús',
    'popover-foreground': 'Texto en popovers',
    
    // Estados y utilidades
    'muted': 'Fondo silenciado/secundario',
    'muted-foreground': 'Texto silenciado/secundario',
    'destructive': 'Color de error/peligro',
    'destructive-foreground': 'Texto sobre fondo destructivo',
    'border': 'Color de bordes',
    'input': 'Fondo de campos de entrada',
    'ring': 'Color del anillo de enfoque',
    
    // Colores de gráficos
    'chart-1': 'Primer color de gráficos',
    'chart-2': 'Segundo color de gráficos',
    'chart-3': 'Tercer color de gráficos',
    'chart-4': 'Cuarto color de gráficos',
    'chart-5': 'Quinto color de gráficos',
    
    // Sistema de alertas (añadido en globals.css)
    'success': 'Color de éxito',
    'success-foreground': 'Texto sobre fondo de éxito',
    'warning': 'Color de advertencia',
    'warning-foreground': 'Texto sobre fondo de advertencia',
    'info': 'Color informativo',
    'info-foreground': 'Texto sobre fondo informativo',
    
    // Sidebar
    'sidebar': 'Fondo de barra lateral',
    'sidebar-foreground': 'Texto de barra lateral',
    'sidebar-primary': 'Elementos primarios de sidebar',
    'sidebar-primary-foreground': 'Texto sobre elementos primarios de sidebar',
    'sidebar-accent': 'Elementos de acento de sidebar',
    'sidebar-accent-foreground': 'Texto sobre elementos de acento de sidebar',
    'sidebar-border': 'Bordes de sidebar',
    'sidebar-ring': 'Anillo de enfoque en sidebar'
  },

  /**
   * TOKENS ESPECÍFICOS DEL THEME EDITOR
   * Estos tokens son específicos del Theme Editor 3.0 y se documentan aquí
   */
  THEME_EDITOR_TOKENS: {
    'scrollbar-track': {
      description: 'Fondo de la pista del scrollbar personalizado',
      usage: 'Usado solo en componentes con scrollbar personalizado del Theme Editor',
      fallback: 'var(--muted)',
      note: 'Se mapea automáticamente al sistema global'
    },
    'scrollbar-thumb': {
      description: 'Color del control deslizante del scrollbar',
      usage: 'Usado solo en componentes con scrollbar personalizado del Theme Editor',
      fallback: 'var(--foreground)',
      note: 'Se mapea automáticamente al sistema global'
    }
  },

  /**
   * TOKENS LEGACY (DEPRECADOS)
   * Estos tokens han sido completamente migrados al sistema estándar
   */
  LEGACY_TOKENS: {} as Record<string, { replacement: string; description?: string }>,

  /**
   * GUÍAS DE USO
   */
  USAGE_GUIDELINES: {
    DO: [
      'Usar siempre variables CSS: hsl(var(--token-name))',
      'Preferir tokens semánticos (primary, secondary) sobre colores específicos',
      'Usar tokens de foreground para texto sobre colores de fondo correspondientes',
      'Consultar esta documentación antes de crear nuevos tokens'
    ],
    DONT: [
      'Nunca usar colores hardcodeados como #000000 o rgb(0,0,0)',
      'Evitar crear tokens duplicados para el mismo propósito',
      'No usar tokens legacy (brand-*) en código nuevo',
      'No mezclar espacios de color (usar solo OKLCH en el Theme Editor)'
    ]
  },

  /**
   * MAPEO DE TOKENS LEGACY
   * Mapeo automático para mantener compatibilidad
   */
  LEGACY_MAPPING: {
    '--scrollbar-track': 'var(--muted)',
    '--scrollbar-thumb': 'var(--foreground)'
  }
};

/**
 * Función de utilidad para validar el uso de tokens
 */
export function validateColorToken(token: string): {
  isValid: boolean;
  isLegacy: boolean;
  recommendation?: string;
} {
  const standardTokens = Object.keys(COLOR_TOKENS_DOCUMENTATION.STANDARD_TOKENS);
  const legacyTokens = Object.keys(COLOR_TOKENS_DOCUMENTATION.LEGACY_TOKENS);
  
  if (standardTokens.includes(token)) {
    return { isValid: true, isLegacy: false };
  }
  
  if (legacyTokens.includes(token)) {
    const legacyInfo = COLOR_TOKENS_DOCUMENTATION.LEGACY_TOKENS[token as keyof typeof COLOR_TOKENS_DOCUMENTATION.LEGACY_TOKENS];
    return {
      isValid: true,
      isLegacy: true,
      recommendation: `Token legacy detectado. Usar ${legacyInfo.replacement} en su lugar.`
    };
  }
  
  return {
    isValid: false,
    isLegacy: false,
    recommendation: 'Token no reconocido. Consultar documentación de tokens estándar.'
  };
}

export type ColorTokenName = keyof typeof COLOR_TOKENS_DOCUMENTATION.STANDARD_TOKENS;
export type LegacyColorTokenName = keyof typeof COLOR_TOKENS_DOCUMENTATION.LEGACY_TOKENS;