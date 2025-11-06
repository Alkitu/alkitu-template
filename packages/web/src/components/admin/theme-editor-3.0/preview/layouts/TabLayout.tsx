'use client';

import React, { useRef, useEffect, ReactNode } from 'react';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

interface TabLayoutProps {
  children: ReactNode;
  tabId: string;
  className?: string;
  enableScroll?: boolean;
  onScrollChange?: (scrollTop: number) => void;
}

/**
 * Layout reutilizable para todos los tabs del Preview
 * Maneja scroll preservation y estilos consistentes
 */
export function TabLayout({ 
  children, 
  tabId, 
  className = '',
  enableScroll = true,
  onScrollChange
}: TabLayoutProps) {
  const { state } = useThemeEditor();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const isTV = state.viewport.current === 'tv';

  // Preserve scroll position when switching tabs
  useEffect(() => {
    if (scrollRef.current && scrollPositionRef.current > 0) {
      scrollRef.current.scrollTop = scrollPositionRef.current;
    }
  }, [tabId]);

  // Handle scroll events
  const handleScroll = () => {
    if (scrollRef.current) {
      scrollPositionRef.current = scrollRef.current.scrollTop;
      onScrollChange?.(scrollRef.current.scrollTop);
    }
  };

  // Base classes for all tabs
  const baseClasses = `
    h-full 
    ${enableScroll ? 'overflow-y-auto' : 'overflow-hidden'}
    pb-4 
    scrollbar-thin 
    scrollbar-thumb-border 
    scrollbar-track-background 
    ${isTV ? 'px-6' : 'px-2'}
  `;

  // TV mode scaling classes
  const tvScalingClasses = isTV ? `
    [&_h1]:text-5xl [&_h2]:text-4xl [&_h3]:text-3xl [&_h4]:text-2xl [&_h5]:text-xl 
    [&_p]:text-lg [&_.text-xs]:text-base [&_.text-sm]:text-lg [&_.text-base]:text-xl 
    [&_.text-lg]:text-2xl [&_.text-xl]:text-3xl [&_.text-2xl]:text-4xl 
    [&_.h-3]:h-5 [&_.w-3]:w-5 [&_.h-4]:h-6 [&_.w-4]:w-6 
    [&_.p-2]:p-3 [&_.p-3]:p-4 [&_.p-4]:p-6 
    [&_.gap-2]:gap-3 [&_.gap-3]:gap-4
  ` : '';

  return (
    <div 
      ref={scrollRef}
      className={`${baseClasses} ${className}`}
      onScroll={enableScroll ? handleScroll : undefined}
      style={{ scrollBehavior: 'auto' }}
      data-tab-id={tabId}
    >
      <div className={tvScalingClasses}>
        {children}
      </div>
    </div>
  );
}