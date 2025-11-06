'use client';

import React from 'react';
import { Card } from '../../../design-system/primitives/card';
import { useThemeEditor } from '../../../core/context/ThemeEditorContext';

interface ShowcaseContainerProps {
  name: string;
  tokenId: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  actionButton?: React.ReactNode;
}

/**
 * Universal Showcase Container for all atomic design previews
 * Connected to complete Card system: radius + spacing + shadows
 * Uses atoms and follows spacing hierarchy
 */
export function ShowcaseContainer({
  name,
  tokenId,
  children,
  className = '',
  style = {},
  actionButton
}: ShowcaseContainerProps) {
  const { state } = useThemeEditor();
  const spacing = state.currentTheme?.spacing;
  const shadows = state.currentTheme?.shadows;
  
  // Get spacing values for card system (follows atomic design spacing hierarchy)
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16; // Convert to px
  const smallSpacing = `var(--spacing-small, ${baseValue}px)`; // Card padding (small spacing)

  return (
    <Card 
      className={`overflow-visible border-muted ${className}`}
      style={{
        padding: smallSpacing, // Connected to spacing system
        boxShadow: shadows?.shadowMd || 'var(--shadow-md)', // Connected to shadow system
        gap: smallSpacing, // Internal spacing using small spacing
        ...style
      }}
    >
      {/* Header with typography atoms */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="text-muted-foreground"
            style={{
              fontFamily: 'var(--typography-emphasis-font-family)',
              fontSize: 'calc(var(--typography-emphasis-font-size) * 0.75)', // Smaller than emphasis
              fontWeight: 'var(--typography-emphasis-font-weight)',
              letterSpacing: 'var(--typography-emphasis-letter-spacing)'
            }}
          >
            {name}
          </span>
          {actionButton}
        </div>
        <span
          className="text-muted-foreground font-mono"
          style={{
            fontFamily: 'var(--typography-emphasis-font-family)',
            fontSize: 'calc(var(--typography-emphasis-font-size) * 0.75)', // Smaller than emphasis
            fontWeight: 'var(--typography-emphasis-font-weight)',
            letterSpacing: 'var(--typography-emphasis-letter-spacing)'
          }}
        >
          {tokenId}
        </span>
      </div>
      
      {/* Content area - with overflow visible for dropdowns */}
      <div className="flex items-center justify-center min-h-[40px] relative overflow-visible">
        {children}
      </div>
    </Card>
  );
}