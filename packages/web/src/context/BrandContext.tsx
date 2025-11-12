'use client';

import React from 'react';
import { useCompanyTheme } from '@/context/GlobalThemeProvider';

// Brand Configuration Types
export interface BrandConfig {
  customSvg?: string;
  primaryText: string;
  secondaryText: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  monochromeMode: 'none' | 'white' | 'black';
  // Icon colors
  iconBackgroundColor: string;
  iconColor: string;
  // Flags to track if colors are linked to system or overridden
  primaryTextColorLinked: boolean;
  secondaryTextColorLinked: boolean;
  iconBackgroundColorLinked: boolean;
  iconColorLinked: boolean;
  // Track which theme colors they're linked to
  primaryTextColorLinkedTo?: string;
  secondaryTextColorLinkedTo?: string;
  iconBackgroundColorLinkedTo?: string;
  iconColorLinkedTo?: string;
}

// Brand Context for sharing state between editor and preview
export const BrandContext = React.createContext<{
  config: BrandConfig;
  updateConfig: (updates: Partial<BrandConfig>) => void;
  relinkToSystem: (colorType: keyof BrandConfig) => void;
} | null>(null);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const { theme, updateThemeColors, isDarkMode } = useCompanyTheme();
  
  const [config, setConfig] = React.useState<BrandConfig>({
    primaryText: 'Alkitu',
    secondaryText: 'Design System',
    primaryTextColor: '', // Will use system foreground
    secondaryTextColor: '', // Will use system muted-foreground  
    monochromeMode: 'none',
    iconBackgroundColor: '', // Will use system primary
    iconColor: '', // Will use system primary-foreground
    primaryTextColorLinked: true, // Linked to system by default
    secondaryTextColorLinked: true, // Linked to system by default
    iconBackgroundColorLinked: true, // Linked to system by default
    iconColorLinked: true, // Linked to system by default
    primaryTextColorLinkedTo: 'foreground',
    secondaryTextColorLinkedTo: 'muted-foreground',
    iconBackgroundColorLinkedTo: 'primary',
    iconColorLinkedTo: 'primary-foreground',
  });

  // Helper function to get current system color value
  const getSystemColor = (colorName: string) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const colorValue = getComputedStyle(root).getPropertyValue(`--${colorName}`).trim();
      if (colorValue) {
        // Convert HSL to hex if needed, or return as is
        return colorValue.startsWith('hsl') || colorValue.includes(' ') 
          ? `hsl(${colorValue})` 
          : colorValue;
      }
    }
    return '';
  };

  // Update linked colors when theme changes
  React.useEffect(() => {
    if (config.primaryTextColorLinked || config.secondaryTextColorLinked || 
        config.iconBackgroundColorLinked || config.iconColorLinked) {
      
      const updates: Partial<BrandConfig> = {};
      
      if (config.primaryTextColorLinked) {
        updates.primaryTextColor = getSystemColor('foreground');
      }
      if (config.secondaryTextColorLinked) {
        updates.secondaryTextColor = getSystemColor('muted-foreground');
      }
      if (config.iconBackgroundColorLinked) {
        updates.iconBackgroundColor = getSystemColor('primary');
      }
      if (config.iconColorLinked) {
        updates.iconColor = getSystemColor('primary-foreground');
      }

      if (Object.keys(updates).length > 0) {
        setConfig(prev => ({ ...prev, ...updates }));
      }
    }
  }, [theme, config.primaryTextColorLinked, config.secondaryTextColorLinked, 
      config.iconBackgroundColorLinked, config.iconColorLinked]);

  const updateConfig = React.useCallback((updates: Partial<BrandConfig>) => {
    console.log('BrandProvider updateConfig called with:', updates);
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      
      // Break the link when colors are manually changed
      if ('primaryTextColor' in updates && updates.primaryTextColor) {
        newConfig.primaryTextColorLinked = false;
        console.log('Breaking primary text color link - now using custom color');
      }
      if ('secondaryTextColor' in updates && updates.secondaryTextColor) {
        newConfig.secondaryTextColorLinked = false;
        console.log('Breaking secondary text color link - now using custom color');
      }
      if ('iconBackgroundColor' in updates && updates.iconBackgroundColor) {
        newConfig.iconBackgroundColorLinked = false;
        console.log('Breaking icon background color link - now using custom color');
      }
      if ('iconColor' in updates && updates.iconColor) {
        newConfig.iconColorLinked = false;
        console.log('Breaking icon color link - now using custom color');
      }
      
      console.log('BrandProvider new config:', newConfig);
      return newConfig;
    });

    // Apply color changes immediately when unlinking (customizing)
    const immediateColorUpdates: Record<string, string> = {};
    
    if ('primaryTextColor' in updates && updates.primaryTextColor && updates.primaryTextColorLinked === false) {
      immediateColorUpdates['foreground'] = updates.primaryTextColor;
    }
    if ('secondaryTextColor' in updates && updates.secondaryTextColor && updates.secondaryTextColorLinked === false) {
      immediateColorUpdates['muted-foreground'] = updates.secondaryTextColor;
    }
    if ('iconBackgroundColor' in updates && updates.iconBackgroundColor && updates.iconBackgroundColorLinked === false) {
      immediateColorUpdates['primary'] = updates.iconBackgroundColor;
    }
    if ('iconColor' in updates && updates.iconColor && updates.iconColorLinked === false) {
      immediateColorUpdates['primary-foreground'] = updates.iconColor;
    }

    if (Object.keys(immediateColorUpdates).length > 0) {
      updateThemeColors(immediateColorUpdates, isDarkMode ? 'dark' : 'light');
    }
  }, [updateThemeColors, isDarkMode]);

  // Function to re-link a color to system
  const relinkToSystem = React.useCallback((colorType: keyof BrandConfig) => {
    const updates: Partial<BrandConfig> = {};
    
    switch (colorType) {
      case 'primaryTextColor':
        updates.primaryTextColor = getSystemColor('foreground');
        updates.primaryTextColorLinked = true;
        break;
      case 'secondaryTextColor':
        updates.secondaryTextColor = getSystemColor('muted-foreground');
        updates.secondaryTextColorLinked = true;
        break;
      case 'iconBackgroundColor':
        updates.iconBackgroundColor = getSystemColor('primary');
        updates.iconBackgroundColorLinked = true;
        break;
      case 'iconColor':
        updates.iconColor = getSystemColor('primary-foreground');
        updates.iconColorLinked = true;
        break;
    }
    
    if (Object.keys(updates).length > 0) {
      setConfig(prev => ({ ...prev, ...updates }));
    }
  }, []);

  const contextValue = React.useMemo(() => ({ 
    config, 
    updateConfig, 
    relinkToSystem 
  }), [config, updateConfig, relinkToSystem]);
  
  return (
    <BrandContext.Provider value={contextValue}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrandConfig() {
  const context = React.useContext(BrandContext);
  if (!context) {
    throw new Error('useBrandConfig must be used within BrandProvider');
  }
  return context;
}