'use client';

import React from 'react';
import { Card } from '../../design-system/primitives/card';
import { Badge } from '../../design-system/primitives/badge';
import { Check, AlertTriangle, X, Sun } from 'lucide-react';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { getContrastRatio, getContrastGrade } from '../../lib/utils/color/contrast';
import { ThemeColors } from '../../core/types/theme.types';
import { DesignSystemColorsShowcase } from './DesignSystemColorsShowcase';

interface ContrastPair {
  background: keyof ThemeColors;
  foreground: keyof ThemeColors;
  name: string;
}

interface ContrastCardProps {
  pair: ContrastPair;
  colors: ThemeColors;
}

function ContrastCard({ pair, colors }: ContrastCardProps) {
  const bgColor = colors[pair.background]?.oklchString || colors[pair.background]?.value || 'oklch(1 0 0)';
  const fgColor = colors[pair.foreground]?.oklchString || colors[pair.foreground]?.value || 'oklch(0 0 0)';
  
  const ratio = getContrastRatio(bgColor, fgColor);
  const { grade, largeTextGrade } = getContrastGrade(ratio);
  
  const getGradeIcon = (grade: string) => {
    if (grade === 'AAA' || grade === 'AA') return <Check className="h-3 w-3" />;
    return <X className="h-3 w-3" />;
  };
  
  const getGradeColor = (grade: string) => {
    if (grade === 'AAA') return 'text-primary';
    if (grade === 'AA') return 'text-muted-foreground';
    return 'text-destructive';
  };
  
  return (
    <Card className="p-4 bg-card border-border">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 style={{
            fontFamily: 'var(--typography-h5-font-family)',
            fontSize: 'var(--typography-h5-font-size)',
            fontWeight: 'var(--typography-h5-font-weight)',
            lineHeight: 'var(--typography-h5-line-height)',
            letterSpacing: 'var(--typography-h5-letter-spacing)'
          }} className="text-foreground">{pair.name}</h4>
          <Badge 
            variant={grade === 'Fail' ? 'destructive' : 'secondary'}
            className="flex items-center gap-1"
            style={{
              fontFamily: 'var(--typography-emphasis-font-family)',
              fontSize: 'var(--typography-emphasis-font-size)',
              fontWeight: 'var(--typography-emphasis-font-weight)',
              letterSpacing: 'var(--typography-emphasis-letter-spacing)'
            }}
          >
            {getGradeIcon(grade)}
            <span>{ratio.toFixed(2)}</span>
          </Badge>
        </div>
        
        <div 
          className="relative h-24 rounded-md overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <span 
            style={{ 
              color: fgColor,
              fontFamily: 'var(--typography-h1-font-family)',
              fontSize: 'var(--typography-h1-font-size)',
              fontWeight: 'var(--typography-h1-font-weight)',
              lineHeight: 'var(--typography-h1-line-height)',
              letterSpacing: 'var(--typography-h1-letter-spacing)'
            }}
          >
            Aa
          </span>
          <span 
            className="ml-4"
            style={{ 
              color: fgColor,
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: 'var(--typography-paragraph-font-size)',
              fontWeight: 'var(--typography-paragraph-font-weight)',
              lineHeight: 'var(--typography-paragraph-line-height)',
              letterSpacing: 'var(--typography-paragraph-letter-spacing)'
            }}
          >
            Sample Text
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded border border-border flex-shrink-0"
              style={{ backgroundColor: bgColor }}
            />
            <div className="flex-1 min-w-0">
              <p style={{
                fontFamily: 'var(--typography-emphasis-font-family)',
                fontSize: 'var(--typography-emphasis-font-size)',
                fontWeight: 'var(--typography-emphasis-font-weight)',
                letterSpacing: 'var(--typography-emphasis-letter-spacing)'
              }} className="text-foreground">Background</p>
              <p style={{
                fontFamily: 'var(--typography-emphasis-font-family)',
                fontSize: 'var(--typography-emphasis-font-size)',
                fontWeight: 'var(--typography-emphasis-font-weight)',
                letterSpacing: 'var(--typography-emphasis-letter-spacing)'
              }} className="text-muted-foreground truncate font-mono">{bgColor}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded border border-border flex-shrink-0"
              style={{ backgroundColor: fgColor }}
            />
            <div className="flex-1 min-w-0">
              <p style={{
                fontFamily: 'var(--typography-emphasis-font-family)',
                fontSize: 'var(--typography-emphasis-font-size)',
                fontWeight: 'var(--typography-emphasis-font-weight)',
                letterSpacing: 'var(--typography-emphasis-letter-spacing)'
              }} className="text-foreground">Foreground</p>
              <p style={{
                fontFamily: 'var(--typography-emphasis-font-family)',
                fontSize: 'var(--typography-emphasis-font-size)',
                fontWeight: 'var(--typography-emphasis-font-weight)',
                letterSpacing: 'var(--typography-emphasis-letter-spacing)'
              }} className="text-muted-foreground truncate font-mono">{fgColor}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export const ContrastChecker = React.memo(function ContrastChecker() {
  const { state } = useThemeEditor();
  
  // Get responsive grid classes based on current viewport - memoized to prevent re-renders
  const gridClasses = React.useMemo(() => {
    const currentViewport = state.viewport.current;
    if (currentViewport === 'smartphone') {
      return 'grid grid-cols-1 gap-4';
    }
    if (currentViewport === 'tablet') {
      return 'grid grid-cols-2 gap-4';
    }
    if (currentViewport === 'tv') {
      return 'grid grid-cols-3 xl:grid-cols-4 gap-6';
    }
    // Desktop
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
  }, [state.viewport.current]);

  const interactiveGridClasses = React.useMemo(() => {
    const currentViewport = state.viewport.current;
    if (currentViewport === 'smartphone') {
      return 'grid grid-cols-1 gap-4';
    }
    if (currentViewport === 'tablet') {
      return 'grid grid-cols-3 gap-4';
    }
    if (currentViewport === 'tv') {
      return 'grid grid-cols-3 gap-6';
    }
    // Desktop
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
  }, [state.viewport.current]);
  
  // Use current mode colors for contrast checking - memoized to prevent unnecessary re-renders
  const colors = React.useMemo(() => {
    return state.themeMode === 'dark' 
      ? state.currentTheme?.darkColors 
      : state.currentTheme?.lightColors;
  }, [state.themeMode, state.currentTheme?.darkColors, state.currentTheme?.lightColors]);

  if (!colors) {
    return (
      <div className="text-center text-muted-foreground" style={{
        fontFamily: 'var(--typography-paragraph-font-family)',
        fontSize: 'var(--typography-paragraph-font-size)',
        fontWeight: 'var(--typography-paragraph-font-weight)',
        lineHeight: 'var(--typography-paragraph-line-height)',
        letterSpacing: 'var(--typography-paragraph-letter-spacing)'
      }}>
        No theme colors available
      </div>
    );
  }

  // Define all contrast pairs from the images
  const contentContainers: ContrastPair[] = [
    { background: 'background', foreground: 'foreground', name: 'Base' },
    { background: 'card', foreground: 'cardForeground', name: 'Card' },
    { background: 'popover', foreground: 'popoverForeground', name: 'Popover' },
    { background: 'muted', foreground: 'mutedForeground', name: 'Muted' },
  ];

  const interactiveElements: ContrastPair[] = [
    { background: 'primary', foreground: 'primaryForeground', name: 'Primary' },
    { background: 'secondary', foreground: 'secondaryForeground', name: 'Secondary' },
    { background: 'accent', foreground: 'accentForeground', name: 'Accent' },
  ];

  const navigationFunctional: ContrastPair[] = [
    { background: 'destructive', foreground: 'destructiveForeground', name: 'Destructive' },
    { background: 'sidebar', foreground: 'sidebarForeground', name: 'Sidebar Base' },
    { background: 'sidebarPrimary', foreground: 'sidebarPrimaryForeground', name: 'Sidebar Primary' },
    { background: 'sidebarAccent', foreground: 'sidebarAccentForeground', name: 'Sidebar Accent' },
  ];

  // Calculate total contrast issues
  const allPairs = [...contentContainers, ...interactiveElements, ...navigationFunctional];
  const contrastIssues = allPairs.filter(pair => {
    const bgColor = colors[pair.background]?.oklchString || colors[pair.background]?.value || 'oklch(1 0 0)';
    const fgColor = colors[pair.foreground]?.oklchString || colors[pair.foreground]?.value || 'oklch(0 0 0)';
    const ratio = getContrastRatio(bgColor, fgColor);
    const { grade } = getContrastGrade(ratio);
    return grade === 'Fail';
  }).length;

  return (
    <div className={`${state.viewport.current === 'smartphone' ? 'space-y-3' : 'space-y-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 style={{
          fontFamily: 'var(--typography-h3-font-family)',
          fontSize: 'var(--typography-h3-font-size)',
          fontWeight: 'var(--typography-h3-font-weight)',
          lineHeight: 'var(--typography-h3-line-height)',
          letterSpacing: 'var(--typography-h3-letter-spacing)'
        }} className="text-foreground">Contrast Checker</h3>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="cursor-pointer" style={{
          fontFamily: 'var(--typography-emphasis-font-family)',
          fontSize: 'var(--typography-emphasis-font-size)',
          fontWeight: 'var(--typography-emphasis-font-weight)',
          letterSpacing: 'var(--typography-emphasis-letter-spacing)'
        }}>All</Badge>
        <Badge 
          variant="outline" 
          className={`cursor-pointer flex items-center gap-1 ${
            contrastIssues > 0 ? 'text-destructive border-destructive/30' : ''
          }`}
          style={{
            fontFamily: 'var(--typography-emphasis-font-family)',
            fontSize: 'var(--typography-emphasis-font-size)',
            fontWeight: 'var(--typography-emphasis-font-weight)',
            letterSpacing: 'var(--typography-emphasis-letter-spacing)'
          }}
        >
          <AlertTriangle className="h-2 w-2" />
          Issues ({contrastIssues})
        </Badge>
      </div>

      {/* Content & Containers */}
      <div>
        <h4 style={{
          fontFamily: 'var(--typography-h4-font-family)',
          fontSize: 'var(--typography-h4-font-size)',
          fontWeight: 'var(--typography-h4-font-weight)',
          lineHeight: 'var(--typography-h4-line-height)',
          letterSpacing: 'var(--typography-h4-letter-spacing)'
        }} className={`text-foreground ${state.viewport.current === 'smartphone' ? 'mb-2' : 'mb-3'}`}>Content & Containers</h4>
        <div className={gridClasses}>
          {contentContainers.map((pair) => (
            <ContrastCard key={pair.name} pair={pair} colors={colors} />
          ))}
        </div>
      </div>

      {/* Interactive Elements */}
      <div>
        <h4 style={{
          fontFamily: 'var(--typography-h4-font-family)',
          fontSize: 'var(--typography-h4-font-size)',
          fontWeight: 'var(--typography-h4-font-weight)',
          lineHeight: 'var(--typography-h4-line-height)',
          letterSpacing: 'var(--typography-h4-letter-spacing)'
        }} className={`text-foreground ${state.viewport.current === 'smartphone' ? 'mb-2' : 'mb-3'}`}>Interactive Elements</h4>
        <div className={interactiveGridClasses}>
          {interactiveElements.map((pair) => (
            <ContrastCard key={pair.name} pair={pair} colors={colors} />
          ))}
        </div>
      </div>

      {/* Navigation & Functional */}
      <div>
        <h4 style={{
          fontFamily: 'var(--typography-h4-font-family)',
          fontSize: 'var(--typography-h4-font-size)',
          fontWeight: 'var(--typography-h4-font-weight)',
          lineHeight: 'var(--typography-h4-line-height)',
          letterSpacing: 'var(--typography-h4-letter-spacing)'
        }} className={`text-foreground ${state.viewport.current === 'smartphone' ? 'mb-2' : 'mb-3'}`}>Navigation & Functional</h4>
        <div className={gridClasses}>
          {navigationFunctional.map((pair) => (
            <ContrastCard key={pair.name} pair={pair} colors={colors} />
          ))}
        </div>
      </div>

      {/* Design System Colors Showcase */}
      <DesignSystemColorsShowcase colors={colors} />
    </div>
  );
});