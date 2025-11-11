/**
 * Theme Editor 3.0 - Error Boundaries
 *
 * ETAPA 6: Production Preparation
 *
 * Error boundaries ESPECÍFICOS para Theme Editor - NO modifican componentes existentes
 * REGLA: Solo agregar wrappers protectivos alrededor de funcionalidad existente
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

// ===== TYPES =====

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

// ===== BASE ERROR BOUNDARY =====

/**
 * Error Boundary base para Theme Editor
 * Captura errores sin romper toda la aplicación
 */
export class ThemeEditorErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state para mostrar UI de error
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const eventId = this.generateEventId();

    this.setState({
      error,
      errorInfo,
      eventId
    });

    // Log error para monitoring
    this.logErrorToMonitoring(error, errorInfo, eventId);

    // Notificar callback si existe
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset automático cuando props cambian (si está habilitado)
    if (hasError && prevProps.resetKeys !== resetKeys && resetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) =>
        prevProps.resetKeys?.[index] !== key
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  generateEventId(): string {
    return `theme-editor-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  logErrorToMonitoring(error: Error, errorInfo: ErrorInfo, eventId: string) {
    const errorReport = {
      eventId,
      timestamp: new Date().toISOString(),
      component: 'ThemeEditor',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      context: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        timestamp: Date.now()
      }
    };

    // En producción, enviar a servicio de monitoring
    if (process.env.NODE_ENV === 'production') {
      console.error('[Theme Editor Error Boundary]', errorReport);
      // Aquí se integraría con Sentry, LogRocket, etc.
    } else {
      console.group(`🚨 Theme Editor Error [${eventId}]`);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Full Report:', errorReport);
      console.groupEnd();
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    });
  };

  render() {
    const { hasError, error, eventId } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Fallback personalizado o UI de error default
      return fallback || (
        <ThemeEditorErrorFallback
          error={error}
          eventId={eventId}
          onReset={this.resetErrorBoundary}
        />
      );
    }

    return children;
  }
}

// ===== ERROR FALLBACK COMPONENTS =====

interface ErrorFallbackProps {
  error: Error | null;
  eventId: string | null;
  onReset: () => void;
}

/**
 * UI de fallback cuando hay error en Theme Editor
 */
export const ThemeEditorErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  eventId,
  onReset
}) => {
  return (
    <div
      className="theme-editor-error-boundary"
      style={{
        padding: '2rem',
        margin: '1rem',
        border: '2px solid #ef4444',
        borderRadius: '8px',
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        fontFamily: 'system-ui, sans-serif'
      }}
      role="alert"
      aria-live="assertive"
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>⚠️</span>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
          Theme Editor Error
        </h2>
      </div>

      <p style={{ margin: '0 0 1rem 0', lineHeight: '1.5' }}>
        An error occurred in the Theme Editor. The current theme settings are preserved
        and you can continue using other parts of the application.
      </p>

      {error && (
        <details style={{ marginBottom: '1rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: '500' }}>
            Error Details
          </summary>
          <pre
            style={{
              marginTop: '0.5rem',
              padding: '1rem',
              backgroundColor: '#fee2e2',
              borderRadius: '4px',
              fontSize: '0.875rem',
              overflow: 'auto'
            }}
          >
            {error.message}
          </pre>
        </details>
      )}

      {eventId && (
        <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#7f1d1d' }}>
          Error ID: <code>{eventId}</code>
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={onReset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Reset Theme Editor
        </button>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

/**
 * Error fallback minimalista para componentes críticos
 */
export const MinimalErrorFallback: React.FC<Pick<ErrorFallbackProps, 'onReset'>> = ({
  onReset
}) => {
  return (
    <div
      style={{
        padding: '1rem',
        textAlign: 'center',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '4px',
        color: '#991b1b'
      }}
    >
      <p style={{ margin: '0 0 0.5rem 0' }}>⚠️ Component Error</p>
      <button
        onClick={onReset}
        style={{
          padding: '0.25rem 0.5rem',
          fontSize: '0.875rem',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retry
      </button>
    </div>
  );
};

// ===== SPECIALIZED ERROR BOUNDARIES =====

/**
 * Error boundary específico para Design System Components
 */
export const DesignSystemErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  return (
    <ThemeEditorErrorBoundary
      fallback={<MinimalErrorFallback onReset={() => window.location.reload()} />}
      onError={(error, errorInfo) => {
        console.error('[Design System Error]', error, errorInfo);
      }}
    >
      {children}
    </ThemeEditorErrorBoundary>
  );
};

/**
 * Error boundary para Preview Components
 */
export const PreviewErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  return (
    <ThemeEditorErrorBoundary
      fallback={
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            color: '#6b7280'
          }}
        >
          <p>⚠️ Preview temporarily unavailable</p>
          <p style={{ fontSize: '0.875rem' }}>
            Theme settings are preserved. Try refreshing the page.
          </p>
        </div>
      }
    >
      {children}
    </ThemeEditorErrorBoundary>
  );
};

/**
 * Error boundary para Color Picker
 */
export const ColorPickerErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  return (
    <ThemeEditorErrorBoundary
      fallback={
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '4px',
            color: '#92400e'
          }}
        >
          <p style={{ margin: '0 0 0.5rem 0' }}>⚠️ Color picker error</p>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            You can still modify themes using the export/import feature.
          </p>
        </div>
      }
    >
      {children}
    </ThemeEditorErrorBoundary>
  );
};

// ===== WRAPPER HOOK =====

/**
 * Hook para usar error boundaries programáticamente
 */
export const useThemeEditorErrorHandler = () => {
  const reportError = (error: Error, context?: any) => {
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context
    };

    if (process.env.NODE_ENV === 'production') {
      console.error('[Theme Editor Runtime Error]', errorReport);
    } else {
      console.error('[Theme Editor Dev Runtime Error]', error, context);
    }
  };

  const safeExecute = async <T,>(
    operation: () => Promise<T> | T,
    fallback?: T
  ): Promise<T | undefined> => {
    try {
      return await operation();
    } catch (error) {
      reportError(error as Error, { operation: operation.name });
      return fallback;
    }
  };

  return {
    reportError,
    safeExecute
  };
};

// ===== EXPORTS =====

export default ThemeEditorErrorBoundary;