/**
 * Performance Monitoring Utilities - ETAPA 3: Performance Optimization
 *
 * Sistema de monitoreo de rendimiento para Theme Editor 3.0
 * ADITIVO - NO modifica funcionalidad existente, solo agrega capacidades de monitoreo
 */

import React from 'react';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface ComponentRenderMetric {
  componentName: string;
  renderCount: number;
  lastRender: number;
  averageRenderTime: number;
  totalRenderTime: number;
}

class ThemeEditorPerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private componentMetrics: Map<string, ComponentRenderMetric> = new Map();
  private isEnabled: boolean = false;

  constructor() {
    // Solo habilitar en development
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  /**
   * Iniciar medición de rendimiento
   */
  startMeasure(name: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata
    };

    this.metrics.set(name, metric);

    // Marcar en Performance API del navegador
    if (typeof performance.mark === 'function') {
      performance.mark(`theme-editor-${name}-start`);
    }
  }

  /**
   * Finalizar medición de rendimiento
   */
  endMeasure(name: string): number | null {
    if (!this.isEnabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) return null;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    // Marcar en Performance API del navegador
    if (typeof performance.mark === 'function' && typeof performance.measure === 'function') {
      performance.mark(`theme-editor-${name}-end`);
      performance.measure(
        `theme-editor-${name}`,
        `theme-editor-${name}-start`,
        `theme-editor-${name}-end`
      );
    }

    console.debug(`🎯 [Theme Editor] ${name}: ${duration.toFixed(2)}ms`, metric.metadata);

    return duration;
  }

  /**
   * Registrar render de componente
   */
  recordComponentRender(componentName: string, renderTime?: number): void {
    if (!this.isEnabled) return;

    const now = performance.now();
    const actualRenderTime = renderTime || 0;

    const existing = this.componentMetrics.get(componentName);

    if (existing) {
      existing.renderCount++;
      existing.lastRender = now;
      existing.totalRenderTime += actualRenderTime;
      existing.averageRenderTime = existing.totalRenderTime / existing.renderCount;
    } else {
      this.componentMetrics.set(componentName, {
        componentName,
        renderCount: 1,
        lastRender: now,
        averageRenderTime: actualRenderTime,
        totalRenderTime: actualRenderTime
      });
    }
  }

  /**
   * Obtener métricas de rendimiento
   */
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(metric => metric.duration !== undefined);
  }

  /**
   * Obtener métricas de componentes
   */
  getComponentMetrics(): ComponentRenderMetric[] {
    return Array.from(this.componentMetrics.values());
  }

  /**
   * Limpiar métricas
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.componentMetrics.clear();
  }

  /**
   * Generar reporte de rendimiento
   */
  generateReport(): string {
    if (!this.isEnabled) return 'Performance monitoring disabled';

    const metrics = this.getMetrics();
    const componentMetrics = this.getComponentMetrics();

    let report = '📊 Theme Editor Performance Report\n\n';

    // Métricas generales
    report += '🔧 General Metrics:\n';
    metrics.forEach(metric => {
      report += `  • ${metric.name}: ${metric.duration?.toFixed(2)}ms\n`;
    });

    // Métricas de componentes
    report += '\n🧩 Component Metrics:\n';
    componentMetrics
      .sort((a, b) => b.renderCount - a.renderCount)
      .forEach(metric => {
        report += `  • ${metric.componentName}: ${metric.renderCount} renders, avg: ${metric.averageRenderTime.toFixed(2)}ms\n`;
      });

    return report;
  }

  /**
   * Detectar componentes con muchos re-renders
   */
  detectPerformanceIssues(): string[] {
    const issues: string[] = [];
    const componentMetrics = this.getComponentMetrics();

    componentMetrics.forEach(metric => {
      // Detectar demasiados re-renders
      if (metric.renderCount > 10) {
        issues.push(`⚠️ ${metric.componentName} has ${metric.renderCount} renders - consider memoization`);
      }

      // Detectar renders lentos
      if (metric.averageRenderTime > 16.67) { // 60fps = 16.67ms per frame
        issues.push(`🐌 ${metric.componentName} average render time ${metric.averageRenderTime.toFixed(2)}ms - too slow`);
      }
    });

    return issues;
  }
}

// Singleton instance
export const performanceMonitor = new ThemeEditorPerformanceMonitor();

/**
 * Hook para monitorear renders de componentes
 */
export function usePerformanceMonitor(componentName: string) {
  if (process.env.NODE_ENV === 'development') {
    const renderStart = performance.now();

    // Registrar cuando el componente se renderiza
    React.useEffect(() => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;
      performanceMonitor.recordComponentRender(componentName, renderTime);
    });
  }
}

/**
 * HOC para monitorear automáticamente componentes
 */
export function withPerformanceMonitor<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  const displayName = componentName || Component.displayName || Component.name || 'Anonymous';

  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    usePerformanceMonitor(displayName);
    return React.createElement(Component, { ...props, ref } as any);
  });

  WrappedComponent.displayName = `withPerformanceMonitor(${displayName})`;

  return WrappedComponent;
}

/**
 * Utilidades de medición rápida
 */
export const measure = {
  start: (name: string, metadata?: Record<string, any>) =>
    performanceMonitor.startMeasure(name, metadata),

  end: (name: string) =>
    performanceMonitor.endMeasure(name),

  wrap: <T extends (...args: any[]) => any>(fn: T, name: string): T => {
    return ((...args: any[]) => {
      performanceMonitor.startMeasure(name);
      try {
        const result = fn(...args);
        performanceMonitor.endMeasure(name);
        return result;
      } catch (error) {
        performanceMonitor.endMeasure(name);
        throw error;
      }
    }) as T;
  }
};

// Exponer en window para debugging en development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).themeEditorPerformance = performanceMonitor;
}