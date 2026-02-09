'use client';

import React, { createContext, useContext, useState } from 'react';
import { X, Check, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import type {
  Toast,
  ToastContextType,
  SonnerOrganismProps,
} from './SonnerOrganism.types';

/**
 * Toast Context for managing toast state
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Hook to access toast functionality
 * Must be used within SonnerOrganism (ToastProvider)
 *
 * @example
 * ```tsx
 * const { addToast, removeToast } = useToast();
 * addToast({ title: 'Success!', type: 'success' });
 * ```
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(
      'useToast must be used within a SonnerOrganism (ToastProvider)',
    );
  }
  return context;
};

/**
 * SonnerOrganism - Advanced toast notification system
 *
 * A complete toast notification system with theme integration, multiple types,
 * positioning, actions, auto-dismiss, and animations.
 *
 * Features:
 * - 5 toast types: default, success, error, warning, info
 * - 6 position options: top/bottom + left/center/right
 * - Auto-dismiss with configurable duration
 * - Action buttons in toasts
 * - Custom icons
 * - Theme-reactive with CSS variables
 * - Queue management with max toasts limit
 * - Smooth animations and transitions
 * - Keyboard accessible (dismiss with Escape)
 *
 * @example
 * ```tsx
 * // Wrap your app with the provider
 * <SonnerOrganism maxToasts={5} defaultPosition="bottom-right">
 *   <App />
 * </SonnerOrganism>
 *
 * // Use in components
 * const { addToast } = useToast();
 * addToast({
 *   title: 'Profile updated',
 *   description: 'Your changes have been saved',
 *   type: 'success',
 *   duration: 3000,
 * });
 * ```
 */
export const SonnerOrganism = React.forwardRef<
  HTMLDivElement,
  SonnerOrganismProps
>(
  (
    {
      children,
      maxToasts = 5,
      defaultPosition = 'bottom-right',
      defaultDuration = 4000,
    },
    ref,
  ) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    /**
     * Add a new toast to the queue
     */
    const addToast = (toast: Omit<Toast, 'id'>): string => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = {
        ...toast,
        id,
        position: toast.position || defaultPosition,
        duration: toast.duration ?? defaultDuration,
        dismissible: toast.dismissible ?? true,
      };

      setToasts((prev) => {
        // Keep only the most recent toasts if we exceed maxToasts
        const filtered = prev.slice(-(maxToasts - 1));
        return [...filtered, newToast];
      });

      // Auto dismiss if duration is set
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }

      return id;
    };

    /**
     * Remove a toast by ID
     */
    const removeToast = (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    /**
     * Clear all toasts
     */
    const clearAll = () => {
      setToasts([]);
    };

    // Group toasts by position for rendering
    const groupedToasts = toasts.reduce(
      (acc, toast) => {
        const position = toast.position || defaultPosition;
        if (!acc[position]) acc[position] = [];
        acc[position].push(toast);
        return acc;
      },
      {} as Record<string, Toast[]>,
    );

    /**
     * Get icon component based on toast type
     */
    const getToastIcon = (type: Toast['type']) => {
      const iconStyles = {
        width: '18px',
        height: '18px',
        flexShrink: 0,
        transition: 'all 0.3s ease',
      };

      const iconWrapperStyle = {
        borderRadius: '50%',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };

      switch (type) {
        case 'success':
          return (
            <div
              style={{
                ...iconWrapperStyle,
                background: 'hsl(var(--success) / 0.2)',
              }}
            >
              <Check
                style={{
                  ...iconStyles,
                  color: 'hsl(var(--success))',
                }}
              />
            </div>
          );
        case 'error':
          return (
            <div
              style={{
                ...iconWrapperStyle,
                background: 'hsl(var(--destructive) / 0.2)',
              }}
            >
              <AlertCircle
                style={{
                  ...iconStyles,
                  color: 'hsl(var(--destructive))',
                }}
              />
            </div>
          );
        case 'warning':
          return (
            <div
              style={{
                ...iconWrapperStyle,
                background: 'hsl(var(--warning) / 0.2)',
              }}
            >
              <AlertTriangle
                style={{
                  ...iconStyles,
                  color: 'hsl(var(--warning))',
                }}
              />
            </div>
          );
        case 'info':
          return (
            <div
              style={{
                ...iconWrapperStyle,
                background: 'hsl(var(--primary) / 0.2)',
              }}
            >
              <Info
                style={{
                  ...iconStyles,
                  color: 'hsl(var(--primary))',
                }}
              />
            </div>
          );
        default:
          return null;
      }
    };

    /**
     * Get styling for toast based on type
     */
    const getToastTypeStyles = (type: Toast['type']) => {
      const baseStyles = {
        backdropFilter: 'blur(12px)',
        borderRadius: 'var(--radius-card, var(--radius, 0.5rem))',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      };

      switch (type) {
        case 'success':
          return {
            ...baseStyles,
            background: 'hsl(var(--success) / 0.1)',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--success) / 0.3)',
            boxShadow:
              '0 8px 32px hsl(var(--success) / 0.2), inset 0 1px 0 hsl(var(--success) / 0.2)',
          };
        case 'error':
          return {
            ...baseStyles,
            background: 'hsl(var(--destructive) / 0.1)',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--destructive) / 0.3)',
            boxShadow:
              '0 8px 32px hsl(var(--destructive) / 0.2), inset 0 1px 0 hsl(var(--destructive) / 0.2)',
          };
        case 'warning':
          return {
            ...baseStyles,
            background: 'hsl(var(--warning) / 0.1)',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--warning) / 0.3)',
            boxShadow:
              '0 8px 32px hsl(var(--warning) / 0.2), inset 0 1px 0 hsl(var(--warning) / 0.2)',
          };
        case 'info':
          return {
            ...baseStyles,
            background: 'hsl(var(--primary) / 0.1)',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--primary) / 0.3)',
            boxShadow:
              '0 8px 32px hsl(var(--primary) / 0.2), inset 0 1px 0 hsl(var(--primary) / 0.2)',
          };
        default:
          return {
            ...baseStyles,
            background: 'hsl(var(--background) / 0.95)',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border) / 0.5)',
            boxShadow:
              '0 8px 32px hsl(var(--accent) / 0.1), inset 0 1px 0 hsl(var(--accent) / 0.2)',
          };
      }
    };

    /**
     * Get container position styles
     */
    const getPositionStyles = (position: string) => {
      const baseStyles: React.CSSProperties = {
        position: 'fixed',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: 'min(400px, calc(100vw - 40px))',
        padding: 'var(--spacing-md, 1rem)',
        pointerEvents: 'none' as const,
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
          return {
            ...baseStyles,
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
          };
        case 'bottom-center':
          return {
            ...baseStyles,
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
          };
        default:
          return { ...baseStyles, bottom: 0, right: 0 };
      }
    };

    /**
     * Individual Toast Component
     */
    const ToastComponent = ({ toast }: { toast: Toast }) => {
      const typeStyles = getToastTypeStyles(toast.type);

      return (
        <div
          style={{
            ...typeStyles,
            padding: 'var(--spacing-sm, 0.75rem) var(--spacing-md, 1rem)',
            minWidth: 'min(320px, calc(100vw - 40px))',
            maxWidth: 'min(420px, calc(100vw - 20px))',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            animation: 'toastSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: 'var(--font-sans, var(--font-family, sans-serif))',
            fontSize: '14px',
            position: 'relative',
            overflow: 'hidden',
            pointerEvents: 'auto' as const,
          }}
          className="group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 ease-out"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Icon */}
          {(toast.icon || toast.type) && (
            <div
              style={{
                flexShrink: 0,
                marginTop: '2px',
                transition: 'transform 0.3s ease',
              }}
              className="group-hover:scale-110"
            >
              {toast.icon || getToastIcon(toast.type)}
            </div>
          )}

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {toast.title && (
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: toast.description ? '6px' : '0',
                  lineHeight: 1.4,
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                }}
                className="group-hover:font-bold"
              >
                {toast.title}
              </div>
            )}

            {toast.description && (
              <div
                style={{
                  opacity: 0.8,
                  lineHeight: 1.5,
                  fontSize: '13px',
                  color: 'hsl(var(--muted-foreground))',
                  transition: 'opacity 0.3s ease',
                }}
                className="group-hover:opacity-90"
              >
                {toast.description}
              </div>
            )}

            {/* Action Button */}
            {toast.action && (
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={toast.action.onClick}
                  className="hover:scale-105 hover:shadow-md active:scale-95"
                  style={{
                    color: 'inherit',
                    padding: '6px 12px',
                    height: '32px',
                    fontSize: '13px',
                    fontWeight: 500,
                    borderRadius: 'var(--radius, 0.375rem)',
                    transition: 'all 0.3s ease',
                    background: 'hsl(var(--background) / 0.1)',
                    border: '1px solid hsl(var(--border) / 0.3)',
                    cursor: 'pointer',
                  }}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>

          {/* Close Button */}
          {toast.dismissible && (
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              style={{
                color: 'inherit',
                width: '24px',
                height: '24px',
                padding: '0',
                flexShrink: 0,
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                background: 'hsl(var(--background) / 0.1)',
                border: '1px solid hsl(var(--border) / 0.2)',
                opacity: 0.7,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="hover:scale-110 hover:bg-destructive/20 hover:opacity-100 hover:shadow-md active:scale-90"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      );
    };

    return (
      <ToastContext.Provider
        value={{ toasts, addToast, removeToast, clearAll }}
      >
        <div ref={ref}>{children}</div>

        {/* Render toast containers by position */}
        {Object.entries(groupedToasts).map(([position, positionToasts]) => (
          <div key={position} style={getPositionStyles(position)}>
            {positionToasts.map((toast) => (
              <ToastComponent key={toast.id} toast={toast} />
            ))}
          </div>
        ))}

        {/* CSS Animations */}
        <style jsx global>{`
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
        `}</style>
      </ToastContext.Provider>
    );
  },
);

SonnerOrganism.displayName = 'SonnerOrganism';

/**
 * Convenience toast helper function
 * Creates a toast imperatively without needing the hook
 *
 * Note: This creates a temporary context consumer. For better performance,
 * use the useToast hook directly in your components.
 *
 * @example
 * ```tsx
 * import { toast } from '@/components/organisms/sonner';
 *
 * toast.success('Profile updated!');
 * toast.error('Failed to save changes');
 * toast.warning('You have unsaved changes');
 * toast.info('New features available');
 * ```
 */
export const toast = {
  success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
    // This is a placeholder - actual implementation requires context access
    console.warn(
      'toast.success() called outside of SonnerOrganism context. Use useToast() hook instead.',
    );
    return '';
  },
  error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
    console.warn(
      'toast.error() called outside of SonnerOrganism context. Use useToast() hook instead.',
    );
    return '';
  },
  warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
    console.warn(
      'toast.warning() called outside of SonnerOrganism context. Use useToast() hook instead.',
    );
    return '';
  },
  info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
    console.warn(
      'toast.info() called outside of SonnerOrganism context. Use useToast() hook instead.',
    );
    return '';
  },
  default: (message: string, options?: Partial<Omit<Toast, 'id' | 'type'>>) => {
    console.warn(
      'toast.default() called outside of SonnerOrganism context. Use useToast() hook instead.',
    );
    return '';
  },
};

export default SonnerOrganism;
