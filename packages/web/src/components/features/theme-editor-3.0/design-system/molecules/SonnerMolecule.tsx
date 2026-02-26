'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { X, Check, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * SonnerMolecule - Advanced toast notification system with theme integration
 * 
 * Combines: Portal + Animation + Button + Badge + Icons + Typography
 * Features: Multiple types, positioning, actions, auto-dismiss, theme-responsive
 * Spacing: Small (toast padding), Medium (toast gaps), Large (container spacing)
 */

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  defaultPosition?: Toast['position'];
  defaultDuration?: number;
}

export function ToastProvider({ 
  children, 
  maxToasts = 5,
  defaultPosition = 'bottom-right',
  defaultDuration = 4000 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { state } = useThemeEditor();
  
  // Theme integration
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const shadows = state.currentTheme?.shadows;
  const spacing = state.currentTheme?.spacing;

  // Spacing system
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const smallSpacing = `var(--spacing-small, ${baseValue}px)`;
  const mediumSpacing = `var(--spacing-medium, ${baseValue * 2}px)`;

  const addToast = (toast: Omit<Toast, 'id'>): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      position: toast.position || defaultPosition,
      duration: toast.duration ?? defaultDuration,
      dismissible: toast.dismissible ?? true
    };

    setToasts(prev => {
      const filtered = prev.slice(-(maxToasts - 1));
      return [...filtered, newToast];
    });

    // Auto dismiss
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  // Group toasts by position
  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position || defaultPosition;
    if (!acc[position]) acc[position] = [];
    acc[position].push(toast);
    return acc;
  }, {} as Record<string, Toast[]>);

  // Enhanced icons with styling
  const getToastIcon = (type: Toast['type']) => {
    const iconStyles = {
      width: '18px',
      height: '18px',
      flexShrink: 0,
      transition: 'all 0.3s ease'
    };
    
    switch (type) {
      case 'success':
        return (
          <div style={{
            background: `${colors?.success?.value || 'var(--color-success)'}20`,
            borderRadius: '50%',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Check style={{ 
              ...iconStyles, 
              color: colors?.success?.value || 'var(--color-success)' 
            }} />
          </div>
        );
      case 'error':
        return (
          <div style={{
            background: `${colors?.destructive?.value || 'var(--color-destructive)'}20`,
            borderRadius: '50%',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertCircle style={{ 
              ...iconStyles, 
              color: colors?.destructive?.value || 'var(--color-destructive)' 
            }} />
          </div>
        );
      case 'warning':
        return (
          <div style={{
            background: `${colors?.warning?.value || '#f59e0b'}20`,
            borderRadius: '50%',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle style={{ 
              ...iconStyles, 
              color: colors?.warning?.value || '#f59e0b' 
            }} />
          </div>
        );
      case 'info':
        return (
          <div style={{
            background: `${colors?.primary?.value || 'var(--color-primary)'}20`,
            borderRadius: '50%',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Info style={{ 
              ...iconStyles, 
              color: colors?.primary?.value || 'var(--color-primary)' 
            }} />
          </div>
        );
      default:
        return null;
    }
  };

  // Enhanced toast type styles with gradients and better theming
  const getToastTypeStyles = (type: Toast['type']) => {
    const baseStyles = {
      backdropFilter: 'blur(12px)',
      borderRadius: 'var(--radius-card, 12px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    };
    
    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${colors?.success?.value || 'var(--color-success)'}15, ${colors?.success?.value || 'var(--color-success)'}08)`,
          color: colors?.foreground?.value || 'var(--color-foreground)',
          border: `1px solid ${colors?.success?.value || 'var(--color-success)'}40`,
          boxShadow: `0 8px 32px ${colors?.success?.value || 'var(--color-success)'}20, inset 0 1px 0 ${colors?.success?.value || 'var(--color-success)'}20`
        };
      case 'error':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${colors?.destructive?.value || 'var(--color-destructive)'}15, ${colors?.destructive?.value || 'var(--color-destructive)'}08)`,
          color: colors?.foreground?.value || 'var(--color-foreground)',
          border: `1px solid ${colors?.destructive?.value || 'var(--color-destructive)'}40`,
          boxShadow: `0 8px 32px ${colors?.destructive?.value || 'var(--color-destructive)'}20, inset 0 1px 0 ${colors?.destructive?.value || 'var(--color-destructive)'}20`
        };
      case 'warning':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${colors?.warning?.value || '#f59e0b'}15, ${colors?.warning?.value || '#f59e0b'}08)`,
          color: colors?.foreground?.value || 'var(--color-foreground)',
          border: `1px solid ${colors?.warning?.value || '#f59e0b'}40`,
          boxShadow: `0 8px 32px ${colors?.warning?.value || '#f59e0b'}20, inset 0 1px 0 ${colors?.warning?.value || '#f59e0b'}20`
        };
      case 'info':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${colors?.primary?.value || 'var(--color-primary)'}15, ${colors?.primary?.value || 'var(--color-primary)'}08)`,
          color: colors?.foreground?.value || 'var(--color-foreground)',
          border: `1px solid ${colors?.primary?.value || 'var(--color-primary)'}40`,
          boxShadow: `0 8px 32px ${colors?.primary?.value || 'var(--color-primary)'}20, inset 0 1px 0 ${colors?.primary?.value || 'var(--color-primary)'}20`
        };
      default:
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${colors?.background?.value || 'var(--color-background)'}f8, ${colors?.accent?.value || 'var(--color-accent)'}20)`,
          color: colors?.foreground?.value || 'var(--color-foreground)',
          border: `1px solid ${colors?.border?.value || 'var(--color-border)'}60`,
          boxShadow: `0 8px 32px ${colors?.accent?.value || 'var(--color-accent)'}10, inset 0 1px 0 ${colors?.accent?.value || 'var(--color-accent)'}20`
        };
    }
  };

  // Get container position styles
  const getPositionStyles = (position: string) => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      maxWidth: 'min(400px, calc(100vw - 40px))',
      padding: mediumSpacing
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyles, top: 0, left: 0 };
      case 'top-right':
        return { ...baseStyles, top: 0, right: 0 };
      case 'bottom-left':
        return { ...baseStyles, bottom: 0, left: 0 };
      case 'bottom-right':
        return { ...baseStyles, bottom: 0, right: 0 };
      case 'top-center':
        return { ...baseStyles, top: 0, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-center':
        return { ...baseStyles, bottom: 0, left: '50%', transform: 'translateX(-50%)' };
      default:
        return { ...baseStyles, bottom: 0, right: 0 };
    }
  };

  // Toast component
  const ToastComponent = ({ toast }: { toast: Toast }) => {
    const typeStyles = getToastTypeStyles(toast.type);
    
    return (
      <div
        style={{
          ...typeStyles,
          padding: `${smallSpacing} ${smallSpacing}`,
          minWidth: 'min(320px, calc(100vw - 40px))',
          maxWidth: 'min(420px, calc(100vw - 20px))',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          animation: 'toastSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          fontFamily: 'var(--typography-paragraph-font-family)',
          fontSize: '14px',
          position: 'relative' as const,
          overflow: 'hidden' as const
        }}
        className="group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 ease-out"
      >
        {/* Enhanced Icon */}
        {(toast.icon || toast.type) && (
          <div style={{ 
            flexShrink: 0, 
            marginTop: '2px',
            transition: 'transform 0.3s ease'
          }} className="group-hover:scale-110">
            {toast.icon || getToastIcon(toast.type)}
          </div>
        )}
        
        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {toast.title && (
            <div style={{
              fontWeight: 600,
              marginBottom: toast.description ? '6px' : '0',
              lineHeight: 1.4,
              fontSize: '15px',
              transition: 'all 0.3s ease'
            }} className="group-hover:font-bold">
              {toast.title}
            </div>
          )}
          
          {toast.description && (
            <div style={{
              opacity: 0.8,
              lineHeight: 1.5,
              fontSize: '13px',
              color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
              transition: 'opacity 0.3s ease'
            }} className="group-hover:opacity-90">
              {toast.description}
            </div>
          )}
          
          {/* Enhanced Action Button */}
          {toast.action && (
            <div style={{ marginTop: '10px' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toast.action.onClick}
                style={{
                  color: 'inherit',
                  padding: '6px 12px',
                  height: '32px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: 'var(--radius, 6px)',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255,255,255,0.1)',
                  border: `1px solid ${colors?.border?.value || 'var(--color-border)'}40`,
                  backdropFilter: 'blur(4px)'
                }}
                className="hover:scale-105 hover:shadow-md hover:bg-accent/30 active:scale-95"
              >
                {toast.action.label}
              </Button>
            </div>
          )}
        </div>
        
        {/* Enhanced Close Button */}
        {toast.dismissible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeToast(toast.id)}
            style={{
              color: 'inherit',
              width: '24px',
              height: '24px',
              padding: '0',
              flexShrink: 0,
              borderRadius: '50%',
              transition: 'all 0.3s ease',
              background: 'rgba(255,255,255,0.1)',
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}20`,
              opacity: 0.7
            }}
            className="hover:scale-110 hover:bg-destructive/20 hover:opacity-100 hover:shadow-md active:scale-90"
          >
            <X
              className="h-3 w-3 group-hover:rotate-90"
              style={{
                transition: 'transform 0.3s ease'
              }}
            />
          </Button>
        )}
      </div>
    );
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      
      {/* Render toast containers */}
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div key={position} style={getPositionStyles(position)}>
          {positionToasts.map(toast => (
            <ToastComponent key={toast.id} toast={toast} />
          ))}
        </div>
      ))}
      
      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes toastSlideIn {
          from {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
            filter: blur(4px);
          }
          50% {
            transform: translateX(-5px) scale(1.02);
            opacity: 0.8;
            filter: blur(2px);
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
        }
        
        @keyframes toastSlideOut {
          from {
            transform: translateX(0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          to {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
            filter: blur(4px);
          }
        }
        
        @keyframes toastBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-4px);
          }
          60% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

// Convenience function for creating toasts
export const toast = {
  success: (message: string, options?: Partial<Toast>) => {
    const context = useContext(ToastContext);
    return context?.addToast({
      title: message,
      type: 'success',
      ...options
    });
  },
  
  error: (message: string, options?: Partial<Toast>) => {
    const context = useContext(ToastContext);
    return context?.addToast({
      title: message,
      type: 'error',
      ...options
    });
  },
  
  warning: (message: string, options?: Partial<Toast>) => {
    const context = useContext(ToastContext);
    return context?.addToast({
      title: message,
      type: 'warning',
      ...options
    });
  },
  
  info: (message: string, options?: Partial<Toast>) => {
    const context = useContext(ToastContext);
    return context?.addToast({
      title: message,
      type: 'info',
      ...options
    });
  },
  
  default: (message: string, options?: Partial<Toast>) => {
    const context = useContext(ToastContext);
    return context?.addToast({
      title: message,
      type: 'default',
      ...options
    });
  }
};

// Main component export
export const SonnerMolecule = ToastProvider;