'use client';

import React, { useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { PreviewSection } from '../types';
import { VIEWPORT_CONFIGS } from '../types/viewport.types';
import { Palette, Type, Building, Atom, Layers, Layout, Battery, Wifi, Signal } from 'lucide-react';
import { ContrastChecker } from './colors/ContrastChecker';
import { TypographyPreview } from './typography/TypographyPreview';
import { BrandPreview } from './brand-preview';
import { AtomsShowcase } from './atoms-showcase/AtomsShowcase';

// Custom hook to preserve scroll positions
function useScrollPreservation() {
  const scrollPositions = useRef<Record<string, number>>({});
  
  const preserveScroll = (key: string, element: HTMLElement | null) => {
    if (element) {
      scrollPositions.current[key] = element.scrollTop;
    }
  };
  
  const restoreScroll = (key: string, element: HTMLElement | null) => {
    if (element && scrollPositions.current[key] !== undefined) {
      // Use requestAnimationFrame to ensure the element is rendered
      requestAnimationFrame(() => {
        element.scrollTop = scrollPositions.current[key] || 0;
      });
    }
  };
  
  return { preserveScroll, restoreScroll };
}

export function Preview() {
  const { state, setPreviewSection } = useThemeEditor();
  const { preserveScroll, restoreScroll } = useScrollPreservation();
  
  // Refs for scroll containers
  const desktopScrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabletScrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const smartphoneScrollRefs = useRef<Record<string, HTMLDivElement | null>>({});


  // Early return if theme is not loaded
  if (!state?.preview) {
    return (
      <div className="h-full bg-card flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Loading preview...</div>
        </div>
      </div>
    );
  }

  // Get current viewport configuration
  const currentViewport = state.viewport.current;
  const viewportConfig = VIEWPORT_CONFIGS[currentViewport];
  
  // Calculate responsive container dimensions with proper scaling for visibility
  const getPreviewDimensions = () => {
    if (currentViewport === 'desktop') {
      return {
        width: '100%',
        height: '100%',
        containerClass: '',
        mockupClass: '',
        showMockup: false
      };
    }
    
    // Make viewports easily visible with minimum scale of 0.7
    let scale = 1;
    let showMockup = false;
    let mockupClass = '';
    
    if (currentViewport === 'smartphone') {
      scale = 0.9; // Reduce scale to fit better and allow more scroll area
      showMockup = true;
      mockupClass = 'phone-mockup';
    } else if (currentViewport === 'tablet') {
      scale = 0.7; // Reduce scale to fit better
      showMockup = true;
      mockupClass = 'tablet-mockup';
    } else if (currentViewport === 'tv') {
      // Calculate optimal scale for TV to fit in available space
      // Estimate available space: viewport - sidebar(~240px) - padding(~32px) = ~calc(100vw - 280px)
      // For height: viewport - header(~60px) - indicator(~40px) - padding(~32px) = ~calc(100vh - 140px)
      
      const tvWidth = 1920;
      const tvHeight = 1080;
      
      // Conservative estimates of available space
      const availableWidth = Math.min(window.innerWidth - 300, 1400); // Max reasonable width
      const availableHeight = Math.min(window.innerHeight - 200, 800); // Max reasonable height
      
      // Calculate scale to fit both dimensions, prioritizing width usage
      const scaleByWidth = availableWidth / tvWidth;
      const scaleByHeight = availableHeight / tvHeight;
      
      // Use the smaller scale to ensure it fits, but minimum 0.3 for visibility
      scale = Math.max(Math.min(scaleByWidth, scaleByHeight), 0.3);
      
      showMockup = false;
      mockupClass = 'tv-mockup';
    }
    
    return {
      width: `${viewportConfig.width}px`,
      height: `${viewportConfig.height}px`,
      scale,
      containerClass: mockupClass,
      showMockup,
      mockupClass
    };
  };

  const dimensions = getPreviewDimensions();

  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'brand', label: 'Brand', icon: Building },
    { id: 'atomos', label: 'Átomos', icon: Atom },
    { id: 'moleculas', label: 'Moléculas', icon: Layers },
    { id: 'organismos', label: 'Organismos', icon: Layout }
  ];

  return (
    <div className="h-full bg-card flex flex-col">
      {/* Viewport indicator */}
      <div className="flex-shrink-0 px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {viewportConfig.name}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {viewportConfig.width} × {viewportConfig.height}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {currentViewport === 'desktop' ? 'Native View' : `${Math.round(dimensions.scale * 100)}% Scale`}
            {currentViewport === 'tv' && (
              <span className="ml-2 text-xs text-muted-foreground">
                (Fit: {Math.round((viewportConfig.width * dimensions.scale))}×{Math.round((viewportConfig.height * dimensions.scale))})
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Preview container - always same structure */}
      <div className="flex-1 min-h-0 p-4 pt-2">
        <div className="h-full flex flex-col">
          {/* Navigation tabs only for smartphone/tablet */}
          {(currentViewport === 'smartphone' || currentViewport === 'tablet') && (
            <Tabs 
              value={state.preview.activeSection} 
              onValueChange={(value) => {
                // Preserve scroll before changing section for mobile devices
                const activeSection = state.preview.activeSection;
                if (currentViewport === 'smartphone') {
                  const currentEl = smartphoneScrollRefs.current[activeSection];
                  if (currentEl) {
                    preserveScroll(`smartphone-${activeSection}`, currentEl);
                  }
                } else if (currentViewport === 'tablet') {
                  const currentEl = tabletScrollRefs.current[activeSection];
                  if (currentEl) {
                    preserveScroll(`tablet-${activeSection}`, currentEl);
                  }
                }
                setPreviewSection(value as PreviewSection);
              }}
              className="w-full h-full flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-3 gap-1 h-auto p-1 flex-shrink-0 mb-6">
                {sections.map(({ id, label, icon: Icon }) => (
                  <TabsTrigger 
                    key={id} 
                    value={id}
                    className="flex flex-col gap-1 h-12 text-xs"
                  >
                    <Icon className="h-3 w-3" />
                    <span>{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Content area for smartphone/tablet */}
              <div className="flex-1 min-h-0">
                <div className={`h-full flex ${currentViewport === 'smartphone' ? 'items-start pt-4' : 'items-start pt-4'} justify-center`}>
                  <div 
                    className={`bg-background border-4 border-border overflow-hidden ${currentViewport === 'smartphone' ? 'rounded-3xl' : 'rounded-2xl'}`}
                    style={{
                      width: `${viewportConfig.width}px`,
                      height: `${viewportConfig.height}px`,
                      transform: `scale(${dimensions.scale})`,
                      transformOrigin: 'top center'
                    }}
                  >
                    {currentViewport === 'smartphone' ? <SmartphoneContent /> : <TabletContent />}
                  </div>
                </div>
              </div>
            </Tabs>
          )}

          {/* Desktop/TV View with internal navigation */}
          {(currentViewport === 'desktop' || currentViewport === 'tv') && (
            <div className={`h-full ${currentViewport === 'tv' ? 'flex items-center justify-center overflow-hidden' : ''}`}>
              <div 
                className={`${currentViewport === 'tv' ? 'flex-shrink-0' : 'h-full mx-auto'} bg-background border rounded-lg overflow-hidden shadow-lg`}
                style={{
                  width: currentViewport === 'tv' ? '1920px' : dimensions.width,
                  height: currentViewport === 'tv' ? '1080px' : dimensions.height,
                  transform: currentViewport === 'tv' ? `scale(${dimensions.scale})` : 'none',
                  transformOrigin: 'center'
                }}
              >
                <TVDesktopContent />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // TV/Desktop Content with internal navigation and TV scaling
  function TVDesktopContent() {
    const activeSection = state.preview.activeSection;
    const isTV = currentViewport === 'tv';
    
    // Create scroll preservation handlers for desktop/TV
    const handleScrollRef = (section: string) => (el: HTMLDivElement | null) => {
      if (el) {
        // Preserve current scroll position before ref changes
        const currentEl = desktopScrollRefs.current[section];
        if (currentEl) {
          preserveScroll(`desktop-${section}`, currentEl);
        }
        
        // Set new ref
        desktopScrollRefs.current[section] = el;
        
        // Restore scroll position
        restoreScroll(`desktop-${section}`, el);
      }
    };
    
    return (
      <Tabs 
        value={state.preview.activeSection} 
        onValueChange={(value) => {
          // Preserve scroll before changing section
          const currentEl = desktopScrollRefs.current[activeSection];
          if (currentEl) {
            preserveScroll(`desktop-${activeSection}`, currentEl);
          }
          setPreviewSection(value as PreviewSection);
        }}
        className="w-full h-full flex flex-col"
      >
        {/* Internal navigation tabs - much larger for TV */}
        <TabsList className={`grid w-full grid-cols-3 gap-2 h-auto ${isTV ? 'p-4' : 'p-1'} flex-shrink-0 ${isTV ? 'mx-4 mt-4' : 'mx-2 mt-2'}`}>
          {sections.map(({ id, label, icon: Icon }) => (
            <TabsTrigger 
              key={id} 
              value={id}
              className={`flex flex-col ${isTV ? 'gap-4 h-32 text-2xl font-bold py-6' : 'gap-1 h-12 text-xs'}`}
            >
              <Icon className={`${isTV ? 'h-12 w-12' : 'h-3 w-3'}`} />
              <span className={isTV ? 'text-2xl' : ''}>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content with TV scaling - 30% larger text for ALL elements */}
        <TabsContent value="colors" className="mt-2 flex-1 min-h-0 overflow-hidden">
          <div 
            ref={handleScrollRef('colors')}
            className={`h-full overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background ${isTV ? 'px-6' : 'px-2'}`}
            style={{ scrollBehavior: 'auto' }} // Prevent smooth scrolling that might interfere
          >
            <div className={isTV ? '[&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl [&_p]:text-lg [&_.text-xs]:text-base [&_.text-sm]:text-lg [&_.text-base]:text-xl [&_.text-lg]:text-2xl [&_.text-2xl]:text-3xl [&_.h-3]:h-5 [&_.w-3]:w-5 [&_.h-2]:h-4 [&_.w-2]:w-4 [&_.h-6]:h-8 [&_.w-6]:w-8 [&_.h-24]:h-32 [&_.p-4]:p-6 [&_.gap-2]:gap-3 [&_.gap-1]:gap-2' : ''}>
              <ContrastChecker />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="mt-2 flex-1 min-h-0 overflow-hidden">
          <div 
            ref={handleScrollRef('typography')}
            className={`h-full overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background ${isTV ? 'px-6' : 'px-2'}`}
            style={{ scrollBehavior: 'auto' }}
          >
            <div className={isTV ? '[&_h1]:text-5xl [&_h2]:text-4xl [&_h3]:text-3xl [&_h4]:text-2xl [&_h5]:text-xl [&_p]:text-lg [&_.text-xs]:text-base [&_.text-sm]:text-lg [&_.text-base]:text-xl [&_.text-lg]:text-2xl [&_.text-xl]:text-3xl [&_.text-2xl]:text-4xl [&_.h-3]:h-5 [&_.w-3]:w-5 [&_.h-4]:h-6 [&_.w-4]:w-6 [&_.p-2]:p-3 [&_.p-3]:p-4 [&_.p-4]:p-6 [&_.gap-2]:gap-3 [&_.gap-3]:gap-4' : ''}>
              <TypographyPreview />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="brand" className="mt-2 flex-1 min-h-0 overflow-hidden">
          <div 
            ref={handleScrollRef('brand')}
            className={`h-full overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background ${isTV ? 'px-6' : 'px-2'}`}
            style={{ scrollBehavior: 'auto' }}
          >
            <div className={isTV ? '[&_h1]:text-5xl [&_h2]:text-4xl [&_h3]:text-3xl [&_h4]:text-2xl [&_h5]:text-xl [&_p]:text-lg [&_.text-xs]:text-base [&_.text-sm]:text-lg [&_.text-base]:text-xl [&_.text-lg]:text-2xl [&_.text-xl]:text-3xl [&_.text-2xl]:text-4xl [&_.h-3]:h-5 [&_.w-3]:w-5 [&_.h-4]:h-6 [&_.w-4]:w-6 [&_.p-2]:p-3 [&_.p-3]:p-4 [&_.p-4]:p-6 [&_.gap-2]:gap-3 [&_.gap-3]:gap-4' : ''}>
              <BrandPreview brand={state.currentTheme.brand} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="atomos" className="mt-2 flex-1 min-h-0 overflow-hidden">
          <div 
            ref={handleScrollRef('atomos')}
            className={`h-full overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background ${isTV ? 'px-6' : 'px-2'}`}
            style={{ scrollBehavior: 'auto' }}
          >
            <div className={isTV ? '[&_h1]:text-5xl [&_h2]:text-4xl [&_h3]:text-3xl [&_h4]:text-2xl [&_h5]:text-xl [&_p]:text-lg [&_.text-xs]:text-base [&_.text-sm]:text-lg [&_.text-base]:text-xl [&_.text-lg]:text-2xl [&_.text-xl]:text-3xl [&_.text-2xl]:text-4xl [&_.h-3]:h-5 [&_.w-3]:w-5 [&_.h-4]:h-6 [&_.w-4]:w-6 [&_.p-2]:p-3 [&_.p-3]:p-4 [&_.p-4]:p-6 [&_.gap-2]:gap-3 [&_.gap-3]:gap-4' : ''}>
              <AtomsShowcase />
            </div>
          </div>
        </TabsContent>

        {sections.slice(4).map(({ id, label }) => (
          <TabsContent key={id} value={id} className="mt-2 flex-1 min-h-0 overflow-hidden">
            <div 
              ref={handleScrollRef(id)}
              className={`h-full overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background ${isTV ? 'px-6' : 'px-2'}`}
              style={{ scrollBehavior: 'auto' }}
            >
              <Card className={isTV ? 'p-6' : 'p-4'}>
                <div className={`bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center ${isTV ? 'h-40' : 'h-24'}`}>
                  <span className={`text-muted-foreground text-center ${isTV ? 'text-2xl font-semibold' : 'text-xs'}`}>
                    {label} showcase will be here
                  </span>
                </div>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  }

  // Tablet-specific content component with status bar
  function TabletContent() {
    const activeSection = state.preview.activeSection;
    
    // Create scroll preservation handlers for tablet
    const handleTabletScrollRef = (section: string) => (el: HTMLDivElement | null) => {
      if (el) {
        const currentEl = tabletScrollRefs.current[section];
        if (currentEl) {
          preserveScroll(`tablet-${section}`, currentEl);
        }
        tabletScrollRefs.current[section] = el;
        restoreScroll(`tablet-${section}`, el);
      }
    };
    
    // Get current time for status bar
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
    
    return (
      <div className="w-full h-full flex flex-col">
        {/* Status Bar Header */}
        <div className="flex-shrink-0 px-4 py-1 bg-background border-b border-border/50">
          <div className="flex items-center justify-between text-xs">
            {/* Left side - Time */}
            <div className="text-muted-foreground font-bold">
              {currentTime}
            </div>
            
            {/* Right side - Icons */}
            <div className="flex items-center gap-1">
              <Signal className="h-3 w-3 text-muted-foreground fill-current" />
              <Wifi className="h-3 w-3 text-muted-foreground" />
              <Battery className="h-3 w-3 text-muted-foreground fill-current" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 px-2 pb-1 overflow-hidden">
          {activeSection === 'colors' && (
            <div 
              ref={handleTabletScrollRef('colors')}
              className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
              style={{ scrollBehavior: 'auto' }}
            >
              <div className="p-2 pb-[400px]">
                <ContrastChecker />
              </div>
            </div>
          )}
          
          {activeSection === 'typography' && (
            <div 
              ref={handleTabletScrollRef('typography')}
              className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
              style={{ scrollBehavior: 'auto' }}
            >
              <div className="p-2 pb-[400px]">
                <TypographyPreview />
              </div>
            </div>
          )}

          {activeSection === 'brand' && (
            <div 
              ref={handleTabletScrollRef('brand')}
              className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
              style={{ scrollBehavior: 'auto' }}
            >
              <div className="p-2 pb-[400px]">
                <BrandPreview brand={state.currentTheme.brand} />
              </div>
            </div>
          )}

          {activeSection === 'atomos' && (
            <div 
              ref={handleTabletScrollRef('atomos')}
              className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
              style={{ scrollBehavior: 'auto' }}
            >
              <div className="p-2 pb-[400px]">
                <AtomsShowcase />
              </div>
            </div>
          )}
          
          {!['colors', 'typography', 'brand', 'atomos'].includes(activeSection) && (
            <div className="h-full flex items-center justify-center overflow-y-auto">
              <Card className="p-4 w-full mx-2">
                <div className="h-32 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground text-center">
                    {sections.find(s => s.id === activeSection)?.label} showcase will be here
                  </span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Smartphone-specific content component with status bar
  function SmartphoneContent() {
    const activeSection = state.preview.activeSection;
    
    // Create scroll preservation handlers for smartphone
    const handleSmartphoneScrollRef = (section: string) => (el: HTMLDivElement | null) => {
      if (el) {
        const currentEl = smartphoneScrollRefs.current[section];
        if (currentEl) {
          preserveScroll(`smartphone-${section}`, currentEl);
        }
        smartphoneScrollRefs.current[section] = el;
        restoreScroll(`smartphone-${section}`, el);
      }
    };
    
    // Get current time for status bar
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
    
    return (
      <div className="w-full h-full flex flex-col">
        {/* Status Bar Header */}
        <div className="flex-shrink-0 px-4 py-1 bg-background border-b border-border/50">
          <div className="flex items-center justify-between text-xs">
            {/* Left side - Time */}
            <div className="text-muted-foreground font-bold">
              {currentTime}
            </div>
            
            {/* Right side - Icons */}
            <div className="flex items-center gap-1">
              <Signal className="h-3 w-3 text-muted-foreground fill-current" />
              <Wifi className="h-3 w-3 text-muted-foreground" />
              <Battery className="h-3 w-3 text-muted-foreground fill-current" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 px-1 pb-1 overflow-hidden">
          {activeSection === 'colors' && (
            <div 
              ref={handleSmartphoneScrollRef('colors')}
              className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
              style={{ scrollBehavior: 'auto' }}
            >
              <div className="p-1 pb-52">
                <ContrastChecker />
              </div>
            </div>
          )}
          
          {activeSection === 'typography' && (
            <div 
              ref={handleSmartphoneScrollRef('typography')}
              className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
              style={{ scrollBehavior: 'auto' }}
            >
              <div className="p-1 pb-52">
                <TypographyPreview />
              </div>
            </div>
          )}

          {activeSection === 'brand' && (
            <div 
              ref={handleSmartphoneScrollRef('brand')}
              className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
              style={{ scrollBehavior: 'auto' }}
            >
              <div className="p-1 pb-52">
                <BrandPreview brand={state.currentTheme.brand} />
              </div>
            </div>
          )}

          {activeSection === 'atomos' && (
            <div 
              ref={handleSmartphoneScrollRef('atomos')}
              className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
              style={{ scrollBehavior: 'auto' }}
            >
              <div className="p-1 pb-52">
                <AtomsShowcase />
              </div>
            </div>
          )}
          
          {!['colors', 'typography', 'brand', 'atomos'].includes(activeSection) && (
            <div className="h-full flex items-center justify-center overflow-y-auto">
              <Card className="p-2 w-full mx-1">
                <div className="h-32 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground text-center">
                    {sections.find(s => s.id === activeSection)?.label} showcase will be here
                  </span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }
}