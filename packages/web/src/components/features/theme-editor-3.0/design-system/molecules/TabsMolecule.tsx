'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '../primitives/tabs';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  closeable?: boolean;
  disabled?: boolean;
}

export interface TabsMoleculeProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'vertical' | 'scrollable';
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  onTabClose?: (tabId: string) => void;
  onTabAdd?: () => void;
  addable?: boolean;
  scrollable?: boolean;
  className?: string;
  maxTabs?: number;
}

/**
 * TabsMolecule - Advanced tabs component with theme integration
 * 
 * Combines: Tabs (primitive) + Button + Badge + Icons + Typography
 * Features: Closeable tabs, scrollable tabs, different variants, theme-responsive
 * Spacing: Small (tab padding), Medium (content gaps), Large (section spacing)
 */
export function TabsMolecule({
  tabs,
  defaultValue,
  value,
  onValueChange,
  variant = 'default',
  orientation = 'horizontal',
  activationMode = 'automatic',
  onTabClose,
  onTabAdd,
  addable = false,
  scrollable = false,
  className = '',
  maxTabs = 10
}: TabsMoleculeProps) {
  // DEBUG: Log tabs to identify the issue
  console.log('TabsMolecule received tabs:', tabs);
  
  // Early return if no tabs provided
  if (!tabs || tabs.length === 0) {
    console.log('TabsMolecule: No tabs provided, returning fallback');
    return <div className="text-muted-foreground">No tabs available</div>;
  }

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
  const largeSpacing = `var(--spacing-large, ${baseValue * 4}px)`;

  // Local state
  const [activeTab, setActiveTab] = useState(value || defaultValue || (tabs && tabs.length > 0 ? tabs[0].id : ''));
  const [scrollPosition, setScrollPosition] = useState(0);
  const tabsListRef = useRef<HTMLDivElement>(null);

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    if (value === undefined) {
      setActiveTab(tabId);
    }
    onValueChange?.(tabId);
  };

  // Handle tab close
  const handleTabClose = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onTabClose?.(tabId);
  };

  // Handle tab add
  const handleTabAdd = () => {
    if (tabs.length < maxTabs) {
      onTabAdd?.();
    }
  };

  // Scroll tabs
  const scrollTabs = (direction: 'left' | 'right') => {
    if (!tabsListRef.current) return;
    
    const scrollAmount = 200;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
    
    setScrollPosition(newPosition);
    tabsListRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  // Effect to update active tab when value changes
  useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  // Styles
  const getContainerStyles = (): React.CSSProperties => ({
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'row' : 'column',
    gap: mediumSpacing,
    marginBottom: largeSpacing
  });

  const getTabsListContainerStyles = () => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative' as const
  });

  const getTabsListStyles = () => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: variant === 'pills' ? `6px ${smallSpacing}` : '0',
    background: variant === 'pills' 
      ? `linear-gradient(135deg, ${colors?.muted?.value || 'var(--color-muted)'}80, ${colors?.accent?.value || 'var(--color-accent)'}20)`
      : 'transparent',
    borderRadius: variant === 'pills' ? 'var(--radius, 10px)' : '0',
    borderBottom: variant === 'underline' 
      ? `1px solid ${colors?.border?.value || 'var(--color-border)'}60` 
      : 'none',
    overflow: scrollable ? 'hidden' : 'visible',
    maxWidth: scrollable ? 'calc(100% - 120px)' : '100%',
    scrollBehavior: 'smooth' as const,
    backdropFilter: variant === 'pills' ? 'blur(8px)' : 'none',
    border: variant === 'pills' ? `1px solid ${colors?.border?.value || 'var(--color-border)'}40` : 'none',
    // Responsive smartphone adaptation
    width: '100%'
  });

  const getTabTriggerStyles = (tabId: string, isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: `8px ${smallSpacing}`,
    background: variant === 'pills' && isActive
      ? `linear-gradient(135deg, ${colors?.background?.value || 'var(--color-background)'}, ${colors?.accent?.value || 'var(--color-accent)'}20)`
      : isActive && variant !== 'underline'
        ? `${colors?.primary?.value || 'var(--color-primary)'}10`
        : 'transparent',
    color: isActive 
      ? (colors?.primary?.value || 'var(--color-primary)')
      : (colors?.mutedForeground?.value || 'var(--color-muted-foreground)'),
    border: variant === 'pills' && isActive
      ? `1px solid ${colors?.primary?.value || 'var(--color-primary)'}40`
      : 'none',
    borderRadius: variant === 'pills' ? 'var(--radius, 8px)' : '0',
    borderBottom: variant === 'underline' && isActive
      ? `3px solid ${colors?.primary?.value || 'var(--color-primary)'}`
      : variant === 'underline' 
        ? '3px solid transparent'
        : 'none',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'var(--typography-paragraph-font-family)',
    fontSize: '13px',
    fontWeight: isActive ? 600 : 450,
    whiteSpace: 'nowrap' as const,
    minWidth: 'fit-content',
    minHeight: '36px',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    boxShadow: variant === 'pills' && isActive
      ? `${shadows?.shadowMd || 'var(--shadow-md)'}, 0 0 0 1px ${colors?.primary?.value || 'var(--color-primary)'}20`
      : isActive && variant !== 'underline' && variant !== 'pills'
        ? `inset 0 -1px 0 ${colors?.primary?.value || 'var(--color-primary)'}`
        : 'none',
    // Responsive smartphone adaptation handled by CSS classes
  });

  const getTabContentStyles = () => ({
    padding: mediumSpacing,
    background: colors?.background?.value || 'var(--color-background)',
    borderRadius: 'var(--radius-card, 8px)',
    border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
    minHeight: '200px',
    fontFamily: 'var(--typography-paragraph-font-family)',
    fontSize: 'var(--typography-paragraph-font-size)',
    color: colors?.foreground?.value || 'var(--color-foreground)'
  });

  const currentValue = value ?? activeTab;
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollable && tabsListRef.current 
    ? scrollPosition < (tabsListRef.current.scrollWidth - tabsListRef.current.clientWidth)
    : false;

  return (
    <div className={className} style={getContainerStyles()}>
      <Tabs
        value={currentValue}
        onValueChange={handleTabChange}
        orientation={orientation}
        activationMode={activationMode}
      >
        <div style={getTabsListContainerStyles()} className="flex items-center gap-2 max-sm:flex-col max-sm:items-stretch max-sm:gap-1">
          {/* Scroll left button */}
          {scrollable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollTabs('left')}
              disabled={!canScrollLeft}
              style={{ 
                flexShrink: 0,
                borderRadius: 'var(--radius, 8px)',
                minWidth: '36px',
                minHeight: '36px',
                transition: 'all 0.3s ease',
                background: colors?.background?.value || 'var(--color-background)',
                borderColor: colors?.border?.value || 'var(--color-border)'
              }}
              className={`
                ${!canScrollLeft ? 'opacity-50' : 'hover:bg-accent/60 hover:scale-105 hover:shadow-md active:scale-95'}
                transition-all duration-300 ease-out max-sm:hidden
              `}
            >
              <ChevronLeft 
                className="h-4 w-4" 
                style={{
                  transition: 'transform 0.3s ease',
                  color: !canScrollLeft 
                    ? (colors?.mutedForeground?.value || 'var(--color-muted-foreground)') 
                    : (colors?.foreground?.value || 'var(--color-foreground)')
                }}
              />
            </Button>
          )}

          {/* Tabs list */}
          <TabsList 
            ref={tabsListRef}
            style={getTabsListStyles()}
            className={`${scrollable ? 'overflow-x-auto scrollbar-hide' : ''} w-full flex max-sm:flex-col max-sm:w-full`}
          >
            {tabs.map((tab) => {
              const isActive = currentValue === tab.id;
              const isDisabled = tab.disabled;
              
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  disabled={isDisabled}
                  style={getTabTriggerStyles(tab.id, isActive)}
                  className={`
                    group relative
                    ${!isDisabled ? 'hover:bg-accent/60 hover:scale-[0.98] hover:shadow-md' : ''}
                    ${isActive ? 'shadow-sm' : ''}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    transition-all duration-300 ease-out
                    max-sm:w-full max-sm:justify-center max-sm:text-sm max-sm:py-2 max-sm:px-3
                  `}
                >
                  {/* Enhanced Tab icon */}
                  {tab.icon && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: isActive ? `${colors?.primary?.value || 'var(--color-primary)'}20` : 'transparent',
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }} className="group-hover:bg-primary/20">
                      <div style={{
                        color: isActive ? (colors?.primary?.value || 'var(--color-primary)') : 'inherit',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }} className="group-hover:scale-110">
                        {tab.icon}
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Tab label */}
                  <span style={{
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    fontWeight: isActive ? 600 : 450,
                    color: isActive ? (colors?.primary?.value || 'var(--color-primary)') : 'inherit'
                  }} className="group-hover:font-medium group-hover:scale-105">
                    {tab.label}
                  </span>
                  
                  {/* Enhanced Tab badge */}
                  {tab.badge && (
                    <Badge 
                      variant={isActive ? 'default' : (tab.badge.variant || 'outline')} 
                      size="sm"
                      style={{ 
                        marginLeft: '2px',
                        flexShrink: 0,
                        fontSize: '11px',
                        fontWeight: 500,
                        borderRadius: '6px',
                        transition: 'all 0.3s ease',
                        background: isActive 
                          ? (colors?.primary?.value || 'var(--color-primary)')
                          : undefined,
                        color: isActive 
                          ? (colors?.primaryForeground?.value || 'var(--color-primary-foreground)')
                          : undefined
                      }}
                      className="group-hover:scale-105 group-hover:shadow-sm"
                    >
                      {tab.badge.text}
                    </Badge>
                  )}
                  
                  {/* Enhanced Close button */}
                  {tab.closeable && onTabClose && (
                    <div
                      onClick={(e) => handleTabClose(tab.id, e)}
                      style={{
                        width: '18px',
                        height: '18px',
                        padding: '0',
                        marginLeft: '4px',
                        opacity: isActive ? 0.8 : 0,
                        flexShrink: 0,
                        borderRadius: '50%',
                        transition: 'all 0.3s ease',
                        background: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      className="group-hover:opacity-100 hover:bg-destructive/20 hover:scale-110 active:scale-90"
                    >
                      <X 
                        className="h-3 w-3 hover:rotate-90 hover:text-destructive" 
                        style={{
                          transition: 'transform 0.3s ease',
                          color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
                        }} 
                      />
                    </div>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Scroll right button */}
          {scrollable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scrollTabs('right')}
              disabled={!canScrollRight}
              style={{ flexShrink: 0 }}
              className="max-sm:hidden"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {/* Add tab button */}
          {addable && onTabAdd && tabs.length < maxTabs && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTabAdd}
              style={{ flexShrink: 0 }}
              className="max-sm:w-full max-sm:mt-2"
            >
              <Plus className="h-4 w-4" />
              <span className="ml-2 max-sm:inline hidden">Add Tab</span>
            </Button>
          )}

          {/* More options button */}
          {tabs.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              style={{ flexShrink: 0 }}
              className="max-sm:w-full max-sm:mt-2"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="ml-2 max-sm:inline hidden">More</span>
            </Button>
          )}
        </div>

        {/* Tab contents */}
        <div style={{ flex: 1 }}>
          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              style={getTabContentStyles()}
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

// Export preset configurations
export const TabsPresets = {
  basic: {
    variant: 'default' as const,
    orientation: 'horizontal' as const,
    activationMode: 'automatic' as const,
    scrollable: false,
    addable: false
  },
  
  pills: {
    variant: 'pills' as const,
    orientation: 'horizontal' as const,
    activationMode: 'automatic' as const,
    scrollable: false,
    addable: false
  },
  
  underline: {
    variant: 'underline' as const,
    orientation: 'horizontal' as const,
    activationMode: 'automatic' as const,
    scrollable: false,
    addable: false
  },
  
  closeable: {
    variant: 'default' as const,
    orientation: 'horizontal' as const,
    activationMode: 'automatic' as const,
    scrollable: true,
    addable: true
  },
  
  vertical: {
    variant: 'default' as const,
    orientation: 'vertical' as const,
    activationMode: 'manual' as const,
    scrollable: false,
    addable: false
  }
};