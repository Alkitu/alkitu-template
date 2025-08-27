'use client';

import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

interface CustomScrollbarProps {
  children: ReactNode;
  className?: string;
  height?: string;
  width?: string;
}

/**
 * Custom Scrollbar Component - Solución 2
 * Reemplaza scrollbars nativos con implementación React completamente controlada
 */
export function CustomScrollbar({ 
  children, 
  className = '', 
  height = '100%',
  width = '100%' 
}: CustomScrollbarProps) {
  const { state } = useThemeEditor();
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  
  const scroll = state.currentTheme.scroll;
  const trackColor = state.currentTheme.colors.scrollbarTrack?.value || '#ffffff';
  const thumbColor = state.currentTheme.colors.scrollbarThumb?.value || '#cdcdcd';
  
  // Calcular dimensiones del thumb
  const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 20);
  const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbHeight);
  
  // Actualizar métricas de scroll
  const updateScrollMetrics = () => {
    if (contentRef.current) {
      setScrollTop(contentRef.current.scrollTop);
      setScrollHeight(contentRef.current.scrollHeight);
      setClientHeight(contentRef.current.clientHeight);
    }
  };
  
  useEffect(() => {
    updateScrollMetrics();
    window.addEventListener('resize', updateScrollMetrics);
    return () => window.removeEventListener('resize', updateScrollMetrics);
  }, [children]);
  
  const handleScroll = () => {
    updateScrollMetrics();
  };
  
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleTrackClick = (e: React.MouseEvent) => {
    if (!contentRef.current || !scrollTrackRef.current) return;
    
    const trackRect = scrollTrackRef.current.getBoundingClientRect();
    const clickY = e.clientY - trackRect.top;
    const newScrollTop = (clickY / clientHeight) * (scrollHeight - clientHeight);
    
    contentRef.current.scrollTop = newScrollTop;
  };
  
  // Mostrar scrollbar solo si el contenido es scrolleable
  const showScrollbar = scrollHeight > clientHeight;
  
  return (
    <div 
      className={`relative ${className}`}
      style={{ height, width }}
    >
      {/* Contenido scrolleable */}
      <div
        ref={contentRef}
        className="h-full w-full overflow-hidden"
        onScroll={handleScroll}
        style={{
          paddingRight: showScrollbar ? scroll.width : '0px'
        }}
      >
        {children}
      </div>
      
      {/* Custom Scrollbar Track */}
      {showScrollbar && (
        <div
          ref={scrollTrackRef}
          className="absolute top-0 right-0 cursor-pointer"
          style={{
            width: scroll.width,
            height: '100%',
            background: trackColor,
            borderRadius: scroll.trackRadius || '0px'
          }}
          onClick={handleTrackClick}
        >
          {/* Custom Scrollbar Thumb */}
          <div
            ref={scrollThumbRef}
            className="absolute cursor-grab active:cursor-grabbing transition-opacity hover:opacity-80"
            style={{
              width: `calc(${scroll.width} - 2px)`,
              height: `${thumbHeight}px`,
              top: `${thumbTop}px`,
              left: '1px',
              background: thumbColor,
              borderRadius: scroll.thumbRadius || '4px',
              border: `1px solid ${trackColor}`
            }}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      )}
    </div>
  );
}