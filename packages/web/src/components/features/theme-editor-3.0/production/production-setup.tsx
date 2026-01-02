/**
 * Theme Editor 3.0 - Production Setup Integration
 *
 * ETAPA 6: Production Preparation
 *
 * Integración automática de ALL optimizations de producción
 * REGLA: Solo agregar wrappers y optimizaciones - NO modificar componentes existentes
 */

'use client';

import React, { useEffect, ReactNode } from 'react';
import { ThemeEditorErrorBoundary, DesignSystemErrorBoundary, PreviewErrorBoundary } from './ErrorBoundary';
import { themeEditorMonitoring, useThemeEditorMonitoring } from './monitoring';
import { initializeThemeEditorProduction } from './build-optimization';

// ===== TYPES =====

interface ProductionWrapperProps {
  children: ReactNode;
  enableMonitoring?: boolean;
  enableErrorBoundaries?: boolean;
  enablePerformanceTracking?: boolean;
}

interface ThemeEditorProductionProviderProps {
  children: ReactNode;
  config?: {
    monitoring?: boolean;
    errorBoundaries?: boolean;
    performanceTracking?: boolean;
    autoInitialize?: boolean;
  };
}

// ===== PRODUCTION WRAPPER COMPONENTS =====

/**
 * Wrapper principal que integra todas las optimizaciones de producción
 */
export const ProductionOptimizedThemeEditor: React.FC<ProductionWrapperProps> = ({
  children,
  enableMonitoring = true,
  enableErrorBoundaries = true,
  enablePerformanceTracking = true
}) => {
  useEffect(() => {
    // Initialize production optimizations
    if (process.env.NODE_ENV === 'production') {
      initializeThemeEditorProduction();

      // Setup performance tracking
      if (enablePerformanceTracking) {
        console.log('[Theme Editor] Production performance tracking enabled');
      }

      // Setup monitoring
      if (enableMonitoring) {
        themeEditorMonitoring.setEnabled(true);
        console.log('[Theme Editor] Production monitoring enabled');
      }
    }
  }, [enableMonitoring, enablePerformanceTracking]);

  // Wrap with error boundaries if enabled
  if (enableErrorBoundaries) {
    return (
      <ThemeEditorErrorBoundary>
        <ProductionMonitoringWrapper enableMonitoring={enableMonitoring}>
          {children}
        </ProductionMonitoringWrapper>
      </ThemeEditorErrorBoundary>
    );
  }

  return (
    <ProductionMonitoringWrapper enableMonitoring={enableMonitoring}>
      {children}
    </ProductionMonitoringWrapper>
  );
};

/**
 * Wrapper para monitoring de producción
 */
const ProductionMonitoringWrapper: React.FC<{
  children: ReactNode;
  enableMonitoring: boolean;
}> = ({ children, enableMonitoring }) => {
  const { trackAction } = useThemeEditorMonitoring();

  useEffect(() => {
    if (enableMonitoring) {
      // Track Theme Editor initialization
      trackAction('theme-editor-initialized', {
        timestamp: Date.now(),
        environment: process.env.NODE_ENV
      });

      // Track page visibility changes (for session metrics)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          trackAction('theme-editor-hidden');
        } else {
          trackAction('theme-editor-visible');
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [enableMonitoring, trackAction]);

  return children;
};

// ===== SPECIALIZED WRAPPERS =====

/**
 * Wrapper optimizado para Design System components
 */
export const ProductionDesignSystem: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  return (
    <DesignSystemErrorBoundary>
      {children}
    </DesignSystemErrorBoundary>
  );
};

/**
 * Wrapper optimizado para Preview components
 */
export const ProductionPreviewContainer: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const { trackAction } = useThemeEditorMonitoring();

  useEffect(() => {
    // Track preview usage
    trackAction('preview-container-mounted');

    return () => {
      trackAction('preview-container-unmounted');
    };
  }, [trackAction]);

  return (
    <PreviewErrorBoundary>
      {children}
    </PreviewErrorBoundary>
  );
};

// ===== MAIN PROVIDER =====

/**
 * Provider principal que setup toda la infraestructura de producción
 */
export const ThemeEditorProductionProvider: React.FC<ThemeEditorProductionProviderProps> = ({
  children,
  config = {}
}) => {
  const {
    monitoring = true,
    errorBoundaries = true,
    performanceTracking = true,
    autoInitialize = true
  } = config;

  useEffect(() => {
    if (autoInitialize && process.env.NODE_ENV === 'production') {
      // Auto-setup production environment
      setupProductionEnvironment();
    }
  }, [autoInitialize]);

  return (
    <ProductionOptimizedThemeEditor
      enableMonitoring={monitoring}
      enableErrorBoundaries={errorBoundaries}
      enablePerformanceTracking={performanceTracking}
    >
      {children}
    </ProductionOptimizedThemeEditor>
  );
};

// ===== PRODUCTION SETUP FUNCTIONS =====

/**
 * Setup completo del entorno de producción
 */
const setupProductionEnvironment = () => {
  console.log('[Theme Editor] Setting up production environment...');

  // 1. Initialize core production features
  initializeThemeEditorProduction();

  // 2. Setup global error handling para Theme Editor
  setupGlobalErrorHandling();

  // 3. Setup performance monitoring
  setupPerformanceMonitoring();

  // 4. Setup cache strategies
  setupCacheStrategies();

  // 5. Setup cleanup handlers
  setupCleanupHandlers();

  console.log('[Theme Editor] Production environment ready ✅');
};

/**
 * Setup global error handling
 */
const setupGlobalErrorHandling = () => {
  // Global error handler para errores no capturados del Theme Editor
  window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('theme-editor')) {
      themeEditorMonitoring.trackError(
        new Error(event.message),
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          type: 'global-error'
        }
      );
    }
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.stack && event.reason.stack.includes('theme-editor')) {
      themeEditorMonitoring.trackError(
        event.reason,
        {
          type: 'unhandled-promise-rejection'
        }
      );
    }
  });
};

/**
 * Setup performance monitoring
 */
const setupPerformanceMonitoring = () => {
  // Web Vitals tracking específico para Theme Editor
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('theme-editor')) {
          console.log(`[Performance] ${entry.name}: ${entry.duration?.toFixed(2)}ms`);

          // Report to monitoring service in production
          if (process.env.NODE_ENV === 'production') {
            // This would integrate with external monitoring service
            reportPerformanceMetric(entry.name, entry.duration);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });
  }
};

/**
 * Setup cache strategies
 */
const setupCacheStrategies = () => {
  // Service Worker registration for Theme Editor resources (if available)
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('/sw-theme-editor.js').catch((error) => {
      console.warn('[Theme Editor] Service Worker registration failed:', error);
    });
  }

  // Memory management para theme cache
  const cleanupThemeCache = () => {
    const themeEditorState = localStorage.getItem('alkitu-theme-editor-state');
    if (themeEditorState) {
      try {
        const state = JSON.parse(themeEditorState);
        // Keep only last 10 history entries to prevent localStorage bloat
        if (state.history && state.history.length > 10) {
          state.history = state.history.slice(-10);
          localStorage.setItem('alkitu-theme-editor-state', JSON.stringify(state));
        }
      } catch (error) {
        console.warn('[Theme Editor] Cache cleanup failed:', error);
      }
    }
  };

  // Run cleanup every 30 minutes
  setInterval(cleanupThemeCache, 30 * 60 * 1000);
};

/**
 * Setup cleanup handlers
 */
const setupCleanupHandlers = () => {
  // Cleanup when page is about to unload
  window.addEventListener('beforeunload', () => {
    // Final metrics report
    themeEditorMonitoring.generateReport();

    // Cleanup monitoring
    themeEditorMonitoring.destroy();
  });

  // Cleanup when tab becomes inactive
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause intensive monitoring when tab is hidden
      themeEditorMonitoring.setEnabled(false);
    } else {
      // Resume monitoring when tab becomes visible
      themeEditorMonitoring.setEnabled(true);
    }
  });
};

// ===== HELPER FUNCTIONS =====

/**
 * Report performance metric to external service
 */
const reportPerformanceMetric = (name: string, duration?: number) => {
  // Placeholder for external monitoring service integration
  // (Sentry, New Relic, DataDog, etc.)
  console.log(`[Monitoring] Performance metric: ${name} = ${duration}ms`);
};

/**
 * Check if Theme Editor is in production mode
 */
export const isProductionMode = (): boolean => {
  return process.env.NODE_ENV === 'production' &&
         typeof window !== 'undefined';
};

/**
 * Get production configuration
 */
export const getProductionConfig = () => {
  return {
    monitoring: process.env.NEXT_PUBLIC_THEME_EDITOR_MONITORING === 'enabled',
    errorBoundaries: process.env.NEXT_PUBLIC_ERROR_BOUNDARY_ENABLED !== 'false',
    performanceTracking: process.env.NEXT_PUBLIC_PERFORMANCE_TRACKING !== 'false',
    debug: process.env.NEXT_PUBLIC_THEME_EDITOR_DEBUG === 'true'
  };
};

// ===== INTEGRATION HELPERS =====

/**
 * HOC para componentes que necesitan optimizaciones de producción
 */
export const withProductionOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    errorBoundary?: boolean;
    monitoring?: boolean;
    performance?: boolean;
  } = {}
) => {
  const {
    errorBoundary = true,
    monitoring = true,
    performance = true
  } = options;

  const WrappedComponent: React.FC<P> = (props) => {
    const { trackAction } = useThemeEditorMonitoring();

    useEffect(() => {
      if (monitoring) {
        trackAction('component-mounted', {
          component: Component.displayName || Component.name
        });

        return () => {
          trackAction('component-unmounted', {
            component: Component.displayName || Component.name
          });
        };
      }
    }, [trackAction, monitoring]);

    const ComponentWithOptimizations = (
      <Component {...props} />
    );

    if (errorBoundary) {
      return (
        <ThemeEditorErrorBoundary>
          {ComponentWithOptimizations}
        </ThemeEditorErrorBoundary>
      );
    }

    return ComponentWithOptimizations;
  };

  WrappedComponent.displayName = `withProductionOptimization(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

// ===== EXPORTS =====

export default ThemeEditorProductionProvider;

export {
  ProductionOptimizedThemeEditor,
  ProductionDesignSystem,
  ProductionPreviewContainer,
  setupProductionEnvironment,
  withProductionOptimization
};