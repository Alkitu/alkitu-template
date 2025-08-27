'use client';

import React from 'react';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

/**
 * Scrollbar Styled Component - Solución 3
 * Usa CSS-in-JS con mejor soporte para pseudo-elementos
 */

interface StyledScrollbarProps {
  children: React.ReactNode;
  className?: string;
}

export function StyledScrollbar({ children, className = '' }: StyledScrollbarProps) {
  const { state } = useThemeEditor();
  const scroll = state.currentTheme.scroll;
  const trackColor = state.currentTheme.colors.scrollbarTrack?.value || '#ffffff';
  const thumbColor = state.currentTheme.colors.scrollbarThumb?.value || '#cdcdcd';
  
  // Generate unique class name to avoid conflicts
  const uniqueId = `styled-scrollbar-${Date.now()}`;
  
  React.useEffect(() => {
    // Create dynamic stylesheet for this specific component
    const styleId = `${uniqueId}-styles`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    const css = `
      .${uniqueId} {
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: ${thumbColor} ${trackColor};
      }
      
      .${uniqueId}::-webkit-scrollbar {
        width: ${scroll.width};
        height: ${scroll.width};
      }
      
      .${uniqueId}::-webkit-scrollbar-track {
        background: ${trackColor};
        border-radius: ${scroll.trackRadius || '0px'};
      }
      
      .${uniqueId}::-webkit-scrollbar-thumb {
        background: ${thumbColor};
        border-radius: ${scroll.thumbRadius || '4px'};
        border: 1px solid ${trackColor};
      }
      
      .${uniqueId}::-webkit-scrollbar-thumb:hover {
        background: ${thumbColor};
        opacity: 0.8;
      }
    `;
    
    styleElement.textContent = css;
    
    // Cleanup on unmount
    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [scroll.width, scroll.trackRadius, scroll.thumbRadius, trackColor, thumbColor, uniqueId]);
  
  return (
    <div className={`${uniqueId} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Hook para aplicar scrollbar styling a cualquier elemento
 */
export function useStyledScrollbar() {
  const { state } = useThemeEditor();
  const scroll = state.currentTheme.scroll;
  const trackColor = state.currentTheme.colors.scrollbarTrack?.value || '#ffffff';
  const thumbColor = state.currentTheme.colors.scrollbarThumb?.value || '#cdcdcd';
  
  return React.useMemo(() => {
    const uniqueId = `hook-scrollbar-${Math.random().toString(36).substr(2, 9)}`;
    
    const applyScrollbarStyles = (element: HTMLElement) => {
      if (!element) return;
      
      element.classList.add(uniqueId);
      
      // Create stylesheet for this hook instance
      const styleId = `${uniqueId}-styles`;
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      const css = `
        .${uniqueId}::-webkit-scrollbar {
          width: ${scroll.width} !important;
          height: ${scroll.width} !important;
        }
        
        .${uniqueId}::-webkit-scrollbar-track {
          background: ${trackColor} !important;
          border-radius: ${scroll.trackRadius || '0px'} !important;
        }
        
        .${uniqueId}::-webkit-scrollbar-thumb {
          background: ${thumbColor} !important;
          border-radius: ${scroll.thumbRadius || '4px'} !important;
          border: 1px solid ${trackColor} !important;
        }
        
        .${uniqueId}::-webkit-scrollbar-thumb:hover {
          opacity: 0.8 !important;
        }
      `;
      
      styleElement.textContent = css;
    };
    
    return { applyScrollbarStyles, className: uniqueId };
  }, [scroll.width, scroll.trackRadius, scroll.thumbRadius, trackColor, thumbColor]);
}