/**
 * Theme Editor 3.0 - Production Build Optimization
 *
 * ETAPA 6: Production Preparation
 *
 * Optimizaciones ESPECÍFICAS para Theme Editor sin modificar configuración global
 * REGLA: No modificar next.config.js existente - solo agregar optimizaciones aditivas
 */

// ===== BUNDLE ANALYZER ESPECÍFICO PARA THEME EDITOR =====

/**
 * Analiza el impacto del Theme Editor en el bundle de producción
 */
export const analyzeThemeEditorBundle = () => {
  if (typeof window === 'undefined') return;

  // Componentes principales del Theme Editor
  const themeEditorComponents = [
    'ThemeEditorContext',
    'Button', 'MemoizedButton',
    'Input', 'MemoizedInput',
    'Select', 'MemoizedSelect',
    'ColorPicker',
    'PreviewContainer',
    'ExportDialog'
  ];

  const analysis = {
    timestamp: new Date().toISOString(),
    environment: 'production',
    components: {},
    totalSize: 0,
    optimizations: []
  };

  // Estimar tamaños de componentes (solo para monitoring)
  themeEditorComponents.forEach(component => {
    analysis.components[component] = {
      estimated_size: '~5-15KB', // Estimación conservadora
      memoized: component.startsWith('Memoized'),
      critical: ['ThemeEditorContext', 'Button', 'Input'].includes(component)
    };
  });

  // Log para monitoring de producción
  console.groupCollapsed('[Theme Editor] Bundle Analysis');
  console.table(analysis.components);
  console.log('Analysis:', analysis);
  console.groupEnd();

  return analysis;
};

// ===== LAZY LOADING CONFIGURATION =====

/**
 * Configuración para lazy loading de componentes Theme Editor
 * SOLO para componentes no críticos
 */
export const themeEditorLazyComponents = {
  // Componentes que pueden cargarse bajo demanda
  'ExportDialog': () => import('../theme-editor/export/ExportDialog'),
  'PreviewTabs': () => import('../preview/PreviewTabs'),
  'ColorHistory': () => import('../theme-editor/editor/ColorHistory'),

  // Stories de Storybook (solo development)
  'ButtonStories': () => import('../design-system/atoms/Button.stories'),
  'InputStories': () => import('../design-system/atoms/Input.stories'),
  'SelectStories': () => import('../design-system/atoms/Select.stories')
};

/**
 * Preload crítico para componentes esenciales
 */
export const preloadCriticalComponents = () => {
  if (typeof window === 'undefined') return;

  // Precargar solo componentes críticos
  const criticalComponents = [
    '../core/context/ThemeEditorContext',
    '../design-system/atoms/Button',
    '../design-system/atoms/Input',
    '../design-system/atoms/Select'
  ];

  criticalComponents.forEach(component => {
    // Hint al browser para precargar
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = component;
    document.head.appendChild(link);
  });
};

// ===== PERFORMANCE MONITORING =====

/**
 * Métricas específicas del Theme Editor para producción
 */
export const trackThemeEditorPerformance = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  const metrics = {
    // Theme switching performance
    themeSwitchTime: null,
    colorUpdateTime: null,
    previewRenderTime: null,
    exportTime: null,

    // Memory usage
    memoryBefore: null,
    memoryAfter: null,

    // User interactions
    totalThemeChanges: 0,
    totalExports: 0,
    totalUndoRedo: 0
  };

  // Performance observers para métricas críticas
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('theme-')) {
          console.log(`[Theme Editor Performance] ${entry.name}: ${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });
  }

  return metrics;
};

// ===== CACHE OPTIMIZATION =====

/**
 * Cache estratégico para Theme Editor
 */
export const themeEditorCacheStrategy = {
  // Cache de temas en memoria
  themeCache: new Map(),

  // Cache de conversiones de color (costosas)
  colorCache: new Map(),

  // Cache de CSS variables aplicadas
  cssVariableCache: new Map(),

  // Métodos de cache
  cacheTheme: (themeId, theme) => {
    if (themeEditorCacheStrategy.themeCache.size > 10) {
      // LRU eviction simple
      const firstKey = themeEditorCacheStrategy.themeCache.keys().next().value;
      themeEditorCacheStrategy.themeCache.delete(firstKey);
    }
    themeEditorCacheStrategy.themeCache.set(themeId, theme);
  },

  getCachedTheme: (themeId) => {
    return themeEditorCacheStrategy.themeCache.get(themeId);
  },

  clearCache: () => {
    themeEditorCacheStrategy.themeCache.clear();
    themeEditorCacheStrategy.colorCache.clear();
    themeEditorCacheStrategy.cssVariableCache.clear();
  }
};

// ===== PRODUCTION ERROR HANDLING =====

/**
 * Error handling específico para producción
 */
export const themeEditorErrorReporting = {
  // Errores silenciosos que no deberían romper la app
  silentErrors: [
    'localStorage not available',
    'Color conversion failed',
    'Theme export cancelled'
  ],

  // Log de errores para monitoring
  logError: (error, context = {}) => {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // En producción, enviar a servicio de monitoring
    if (process.env.NODE_ENV === 'production') {
      // Placeholder para servicio real (Sentry, LogRocket, etc.)
      console.error('[Theme Editor Error]', errorInfo);
    } else {
      console.error('[Theme Editor Dev Error]', error, context);
    }
  },

  // Wrapper para operaciones que pueden fallar
  safeExecute: async (operation, fallback = null) => {
    try {
      return await operation();
    } catch (error) {
      themeEditorErrorReporting.logError(error, { operation: operation.name });
      return fallback;
    }
  }
};

// ===== PRODUCTION INITIALIZATION =====

/**
 * Inicialización específica para producción
 */
export const initializeThemeEditorProduction = () => {
  // Solo en browser y producción
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
    return;
  }

  console.log('[Theme Editor] Initializing production mode...');

  // 1. Analizar bundle
  analyzeThemeEditorBundle();

  // 2. Precargar componentes críticos
  preloadCriticalComponents();

  // 3. Inicializar performance tracking
  trackThemeEditorPerformance();

  // 4. Setup error reporting
  window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('theme-editor')) {
      themeEditorErrorReporting.logError(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    }
  });

  console.log('[Theme Editor] Production mode initialized ✅');
};

// ===== EXPORT DEFAULT =====

export default {
  analyzeThemeEditorBundle,
  themeEditorLazyComponents,
  preloadCriticalComponents,
  trackThemeEditorPerformance,
  themeEditorCacheStrategy,
  themeEditorErrorReporting,
  initializeThemeEditorProduction
};