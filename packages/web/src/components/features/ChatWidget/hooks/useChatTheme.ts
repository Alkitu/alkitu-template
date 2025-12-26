import { useCompanyTheme } from '@/context/GlobalThemeProvider';

/**
 * Custom hook to access chat widget theme from global theme
 * Automatically pulls logo and colors from the application theme
 * Falls back to defaults if providers are not available
 */
export function useChatTheme() {
  // Try to get theme, but provide fallbacks if not available
  let theme = null;
  let brandConfig = null;

  try {
    const companyTheme = useCompanyTheme();
    theme = companyTheme?.theme;
  } catch (e) {
    // GlobalThemeProvider not available, use defaults
  }

  // BrandConfig is optional - not all apps will have it
  try {
    const { useBrandConfig } = require('@/context/BrandContext');
    const brand = useBrandConfig();
    brandConfig = brand?.config;
  } catch (e) {
    // BrandProvider not available, use defaults
  }

  return {
    // Primary brand color from theme or fallback
    primaryColor: theme?.colors?.primary?.hex || theme?.colors?.primaryColor?.hex || '#22c55e',
    
    // Secondary colors
    backgroundColor: '#FFFFFF',
    textColor: theme?.colors?.foreground?.hex || '#000000',
   
    // Logo from brand config (optional)
    logoIcon: brandConfig?.customSvg || null,
    logoHorizontal: brandConfig?.customSvg || null,
    
    // Company name
    companyName: brandConfig?.primaryText || 'Support',
    
    // Full theme object for advanced customization
    fullTheme: theme,
    brandConfig,
  };
}
