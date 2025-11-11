/**
 * Theme Editor 3.0 - Production Monitoring
 *
 * ETAPA 6: Production Preparation
 *
 * Sistema de monitoring para métricas EXISTENTES del Theme Editor
 * REGLA: Solo monitorear funcionalidades actuales, NO agregar nuevas features
 */

// ===== TYPES =====

interface ThemeEditorMetrics {
  // Performance metrics
  themeUpdateDuration: number;
  colorConversionTime: number;
  cssApplicationTime: number;
  previewRenderTime: number;
  exportGenerationTime: number;

  // User interaction metrics
  totalThemeChanges: number;
  undoRedoOperations: number;
  colorPickerUsage: number;
  exportOperations: number;
  viewportSwitches: number;

  // Error metrics
  errorCount: number;
  errorRate: number;
  lastErrorTime: Date | null;

  // Memory metrics
  memoryUsage: number;
  cacheSize: number;
  historySize: number;

  // Session metrics
  sessionStart: Date;
  sessionDuration: number;
  themesCreated: number;
}

interface PerformanceMark {
  name: string;
  startTime: number;
  duration?: number;
  metadata?: any;
}

interface UserAction {
  type: string;
  timestamp: Date;
  details?: any;
  performance?: number;
}

// ===== MONITORING CLASS =====

/**
 * Clase principal para monitoring del Theme Editor
 */
class ThemeEditorMonitoring {
  private metrics: ThemeEditorMetrics;
  private performanceMarks: Map<string, PerformanceMark> = new Map();
  private userActions: UserAction[] = [];
  private isEnabled: boolean = true;
  private reportingInterval: number | null = null;

  constructor() {
    this.metrics = {
      themeUpdateDuration: 0,
      colorConversionTime: 0,
      cssApplicationTime: 0,
      previewRenderTime: 0,
      exportGenerationTime: 0,
      totalThemeChanges: 0,
      undoRedoOperations: 0,
      colorPickerUsage: 0,
      exportOperations: 0,
      viewportSwitches: 0,
      errorCount: 0,
      errorRate: 0,
      lastErrorTime: null,
      memoryUsage: 0,
      cacheSize: 0,
      historySize: 0,
      sessionStart: new Date(),
      sessionDuration: 0,
      themesCreated: 0
    };

    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    // Solo habilitar en producción o con flag específico
    this.isEnabled = process.env.NODE_ENV === 'production' ||
                    localStorage.getItem('theme-editor-monitoring') === 'enabled';

    if (this.isEnabled) {
      this.setupPerformanceObserver();
      this.startPeriodicReporting();
      console.log('[Theme Editor Monitoring] Started ✅');
    }
  }

  private setupPerformanceObserver() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.startsWith('theme-editor-')) {
          this.recordPerformanceEntry(entry.name, entry.duration);
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });
  }

  private startPeriodicReporting() {
    // Reportar métricas cada 30 segundos en producción
    this.reportingInterval = window.setInterval(() => {
      this.updateSessionMetrics();
      this.generateReport();
    }, 30000);
  }

  // ===== PERFORMANCE TRACKING =====

  /**
   * Inicia tracking de una operación
   */
  startOperation(operationName: string, metadata?: any): void {
    if (!this.isEnabled) return;

    const markName = `theme-editor-${operationName}`;

    if (window.performance) {
      window.performance.mark(`${markName}-start`);
    }

    this.performanceMarks.set(operationName, {
      name: operationName,
      startTime: Date.now(),
      metadata
    });
  }

  /**
   * Finaliza tracking de una operación
   */
  endOperation(operationName: string): number | null {
    if (!this.isEnabled) return null;

    const mark = this.performanceMarks.get(operationName);
    if (!mark) return null;

    const duration = Date.now() - mark.startTime;
    mark.duration = duration;

    // Performance API measurement
    if (window.performance) {
      const markName = `theme-editor-${operationName}`;
      try {
        window.performance.mark(`${markName}-end`);
        window.performance.measure(markName, `${markName}-start`, `${markName}-end`);
      } catch (error) {
        console.warn('[Monitoring] Performance measurement failed:', error);
      }
    }

    // Update metrics
    this.updateMetricFromOperation(operationName, duration);

    return duration;
  }

  private updateMetricFromOperation(operationName: string, duration: number) {
    switch (operationName) {
      case 'theme-update':
        this.metrics.themeUpdateDuration = duration;
        this.metrics.totalThemeChanges++;
        break;
      case 'color-conversion':
        this.metrics.colorConversionTime = duration;
        break;
      case 'css-application':
        this.metrics.cssApplicationTime = duration;
        break;
      case 'preview-render':
        this.metrics.previewRenderTime = duration;
        break;
      case 'export-generation':
        this.metrics.exportGenerationTime = duration;
        this.metrics.exportOperations++;
        break;
      case 'undo-redo':
        this.metrics.undoRedoOperations++;
        break;
    }
  }

  private recordPerformanceEntry(name: string, duration: number) {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }

  // ===== USER ACTION TRACKING =====

  /**
   * Registra una acción del usuario
   */
  trackUserAction(actionType: string, details?: any): void {
    if (!this.isEnabled) return;

    const action: UserAction = {
      type: actionType,
      timestamp: new Date(),
      details
    };

    this.userActions.push(action);

    // Mantener solo últimas 100 acciones para evitar memory leak
    if (this.userActions.length > 100) {
      this.userActions = this.userActions.slice(-100);
    }

    // Update specific counters
    this.updateActionCounters(actionType);
  }

  private updateActionCounters(actionType: string) {
    switch (actionType) {
      case 'color-picker-used':
        this.metrics.colorPickerUsage++;
        break;
      case 'viewport-switched':
        this.metrics.viewportSwitches++;
        break;
      case 'theme-created':
        this.metrics.themesCreated++;
        break;
    }
  }

  // ===== ERROR TRACKING =====

  /**
   * Registra un error
   */
  trackError(error: Error, context?: any): void {
    if (!this.isEnabled) return;

    this.metrics.errorCount++;
    this.metrics.lastErrorTime = new Date();
    this.metrics.errorRate = this.calculateErrorRate();

    const errorReport = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context,
      metrics: this.getMetricsSummary()
    };

    console.error('[Theme Editor Error Tracked]', errorReport);

    // En producción, enviar a servicio de monitoring
    if (process.env.NODE_ENV === 'production') {
      this.sendErrorReport(errorReport);
    }
  }

  private calculateErrorRate(): number {
    const totalOperations = this.metrics.totalThemeChanges +
                           this.metrics.exportOperations +
                           this.metrics.undoRedoOperations;

    return totalOperations > 0 ? this.metrics.errorCount / totalOperations : 0;
  }

  private sendErrorReport(errorReport: any) {
    // Placeholder para integración con servicio real
    // (Sentry, LogRocket, custom endpoint, etc.)
    console.log('[Monitoring] Would send error report:', errorReport);
  }

  // ===== MEMORY TRACKING =====

  /**
   * Actualiza métricas de memoria
   */
  updateMemoryMetrics(cacheSize?: number, historySize?: number): void {
    if (!this.isEnabled) return;

    // Performance memory API (si está disponible)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize;
    }

    if (cacheSize !== undefined) {
      this.metrics.cacheSize = cacheSize;
    }

    if (historySize !== undefined) {
      this.metrics.historySize = historySize;
    }
  }

  // ===== REPORTING =====

  /**
   * Actualiza métricas de sesión
   */
  private updateSessionMetrics() {
    this.metrics.sessionDuration = Date.now() - this.metrics.sessionStart.getTime();
  }

  /**
   * Genera reporte de métricas
   */
  generateReport(): ThemeEditorMetrics {
    this.updateSessionMetrics();

    const report = { ...this.metrics };

    if (process.env.NODE_ENV === 'development') {
      console.group('[Theme Editor Metrics Report]');
      console.table({
        'Performance': {
          'Theme Update': `${report.themeUpdateDuration}ms`,
          'Color Conversion': `${report.colorConversionTime}ms`,
          'CSS Application': `${report.cssApplicationTime}ms`,
          'Preview Render': `${report.previewRenderTime}ms`
        },
        'Usage': {
          'Theme Changes': report.totalThemeChanges,
          'Export Operations': report.exportOperations,
          'Undo/Redo': report.undoRedoOperations,
          'Error Rate': `${(report.errorRate * 100).toFixed(2)}%`
        },
        'Session': {
          'Duration': `${Math.round(report.sessionDuration / 1000)}s`,
          'Themes Created': report.themesCreated,
          'Memory Usage': `${Math.round(report.memoryUsage / 1024 / 1024)}MB`
        }
      });
      console.groupEnd();
    }

    return report;
  }

  /**
   * Obtiene resumen de métricas
   */
  getMetricsSummary() {
    return {
      performance: {
        avgThemeUpdate: this.metrics.themeUpdateDuration,
        avgExport: this.metrics.exportGenerationTime
      },
      usage: {
        totalChanges: this.metrics.totalThemeChanges,
        errorRate: this.metrics.errorRate
      },
      session: {
        duration: this.metrics.sessionDuration,
        themesCreated: this.metrics.themesCreated
      }
    };
  }

  /**
   * Exporta datos para análisis externo
   */
  exportData() {
    return {
      metrics: this.metrics,
      recentActions: this.userActions.slice(-20), // Últimas 20 acciones
      performanceMarks: Array.from(this.performanceMarks.entries()),
      timestamp: new Date().toISOString()
    };
  }

  // ===== CONFIGURATION =====

  /**
   * Habilita/deshabilita monitoring
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;

    if (enabled) {
      localStorage.setItem('theme-editor-monitoring', 'enabled');
    } else {
      localStorage.removeItem('theme-editor-monitoring');
      if (this.reportingInterval) {
        clearInterval(this.reportingInterval);
        this.reportingInterval = null;
      }
    }
  }

  /**
   * Limpia datos de monitoring
   */
  reset() {
    this.metrics = {
      ...this.metrics,
      themeUpdateDuration: 0,
      colorConversionTime: 0,
      cssApplicationTime: 0,
      previewRenderTime: 0,
      exportGenerationTime: 0,
      totalThemeChanges: 0,
      undoRedoOperations: 0,
      colorPickerUsage: 0,
      exportOperations: 0,
      viewportSwitches: 0,
      errorCount: 0,
      errorRate: 0,
      sessionStart: new Date(),
      sessionDuration: 0,
      themesCreated: 0
    };

    this.performanceMarks.clear();
    this.userActions = [];
  }

  /**
   * Cleanup al destruir
   */
  destroy() {
    if (this.reportingInterval) {
      clearInterval(this.reportingInterval);
    }
  }
}

// ===== SINGLETON INSTANCE =====

export const themeEditorMonitoring = new ThemeEditorMonitoring();

// ===== HELPER FUNCTIONS =====

/**
 * Wrapper para operaciones que necesitan tracking
 */
export const withPerformanceTracking = async <T>(
  operationName: string,
  operation: () => Promise<T> | T,
  metadata?: any
): Promise<T> => {
  themeEditorMonitoring.startOperation(operationName, metadata);

  try {
    const result = await operation();
    return result;
  } finally {
    themeEditorMonitoring.endOperation(operationName);
  }
};

/**
 * Hook React para monitoring
 */
export const useThemeEditorMonitoring = () => {
  const trackAction = (actionType: string, details?: any) => {
    themeEditorMonitoring.trackUserAction(actionType, details);
  };

  const trackError = (error: Error, context?: any) => {
    themeEditorMonitoring.trackError(error, context);
  };

  const getMetrics = () => {
    return themeEditorMonitoring.generateReport();
  };

  return {
    trackAction,
    trackError,
    getMetrics,
    withPerformanceTracking
  };
};

// ===== INTEGRATION HELPERS =====

/**
 * Integrar monitoring en ThemeEditorContext
 */
export const integrateMo니토ring = {
  // Para theme updates
  onThemeUpdate: () => {
    themeEditorMonitoring.trackUserAction('theme-updated');
  },

  // Para export operations
  onExport: (format: string) => {
    themeEditorMonitoring.trackUserAction('theme-exported', { format });
  },

  // Para undo/redo
  onUndoRedo: (type: 'undo' | 'redo') => {
    themeEditorMonitoring.trackUserAction('undo-redo', { type });
  },

  // Para errores
  onError: (error: Error, context?: any) => {
    themeEditorMonitoring.trackError(error, context);
  }
};

// ===== EXPORTS =====

export default themeEditorMonitoring;
export type { ThemeEditorMetrics, UserAction, PerformanceMark };