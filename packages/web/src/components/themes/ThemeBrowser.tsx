'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/atomic-design/molecules/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/atomic-design/atoms/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Sun, 
  Moon, 
  Shuffle, 
  Eye,
  Check,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompanyTheme } from '@/components/providers/DynamicThemeProvider';
import { trpc } from '@/lib/trpc';
import { PREDEFINED_THEMES, PredefinedTheme } from '@/lib/predefined-themes';
import { toast } from 'sonner';

interface ThemePreview {
  id: string;
  name: string;
  category?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  lightModeConfig?: Record<string, string>;
  darkModeConfig?: Record<string, string>;
  isDefault?: boolean;
  isBuiltIn?: boolean;
}

type ThemeMode = 'light' | 'dark';

export function ThemeBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const { theme: currentTheme, refreshTheme, isDarkMode, toggleThemeMode, setThemeMode, applyTheme, updateThemeColors } = useCompanyTheme();

  // Fetch company themes from backend
  const companyId = currentTheme?.companyId;
  const { data: companyThemes, isLoading } = trpc.theme.getCompanyThemes.useQuery(
    { companyId: companyId! },
    { enabled: !!companyId && companyId.length === 24 } // MongoDB ObjectID is 24 chars
  );

  // tRPC mutations for saving themes
  const utils = trpc.useUtils();
  const createThemeMutation = trpc.theme.createTheme.useMutation({
    onSuccess: () => {
      toast.success('Theme saved successfully');
      utils.theme.getCompanyThemes.invalidate();
      refreshTheme();
    },
    onError: (error) => {
      toast.error(`Failed to save theme: ${error.message}`);
    },
  });

  // Combine built-in themes with company themes
  const allThemes = useMemo(() => {
    // Map predefined themes to ThemePreview format
    const predefinedThemesPreviews: ThemePreview[] = PREDEFINED_THEMES.map(theme => ({
      id: theme.id,
      name: theme.name,
      category: theme.category,
      isBuiltIn: true,
      lightModeConfig: theme.lightModeConfig,
      darkModeConfig: theme.darkModeConfig,
      colors: theme.colors
    }));

    const companyThemesPreviews: ThemePreview[] = (companyThemes || []).map(theme => ({
      id: theme.id,
      name: theme.name,
      category: 'custom',
      isDefault: theme.isDefault,
      isBuiltIn: false,
      lightModeConfig: theme.lightModeConfig as Record<string, string>,
      darkModeConfig: theme.darkModeConfig as Record<string, string>,
      colors: {
        primary: (theme.lightModeConfig as any)?.primary || '217 91% 60%',
        secondary: (theme.lightModeConfig as any)?.secondary || '215 20% 65%',
        accent: (theme.lightModeConfig as any)?.accent || '142 76% 73%',
        background: (theme.lightModeConfig as any)?.background || '0 0% 100%',
        foreground: (theme.lightModeConfig as any)?.foreground || '222 84% 5%',
      }
    }));

    return [...predefinedThemesPreviews, ...companyThemesPreviews];
  }, [companyThemes]);

  // Filter themes based on search and category
  const filteredThemes = useMemo(() => {
    let filtered = allThemes;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(theme => 
        theme.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(theme => theme.category === selectedCategory);
    }
    
    return filtered;
  }, [allThemes, searchQuery, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(allThemes.map(theme => theme.category).filter(Boolean))];
    return cats;
  }, [allThemes]);

  // Get random theme
  const getRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * filteredThemes.length);
    const randomTheme = filteredThemes[randomIndex];
    if (randomTheme) {
      setSelectedTheme(randomTheme.id);
      const config = isDarkMode ? randomTheme.darkModeConfig : randomTheme.lightModeConfig;
      const colorsToApply = config || randomTheme.colors;
      
      if (updateThemeColors) {
        updateThemeColors(colorsToApply, isDarkMode ? 'dark' : 'light');
      } else {
        console.warn('updateThemeColors not available yet');
      }
    }
  };

  // Apply theme preview using DynamicThemeProvider's updateThemeColors method
  const applyThemePreview = (themePreview: ThemePreview) => {
    const config = isDarkMode ? themePreview.darkModeConfig : themePreview.lightModeConfig;
    
    // Apply colors based on mode
    const colorsToApply = config || themePreview.colors;
    
    // Use the theme context's updateThemeColors method instead of direct DOM manipulation
    if (updateThemeColors) {
      updateThemeColors(colorsToApply, isDarkMode ? 'dark' : 'light');
    } else {
      console.warn('updateThemeColors not available yet');
    }
  };

  // Save theme to company
  const saveThemeToCompany = async (themePreview: ThemePreview) => {
    if (!companyId || companyId.length !== 24) {
      toast.error('No valid company ID found. Please ensure you are logged in.');
      return;
    }

    const themeName = prompt(`Save "${themePreview.name}" to your company themes?\nEnter a name for this theme:`, themePreview.name);
    if (!themeName) return;

    try {
      await createThemeMutation.mutateAsync({
        name: themeName,
        companyId,
        createdById: 'default-user', // TODO: Get from auth context
        lightModeConfig: themePreview.lightModeConfig || {},
        darkModeConfig: themePreview.darkModeConfig || {},
        isDefault: false,
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  // Apply theme as default for company
  const applySelectedTheme = async () => {
    if (!selectedTheme || !companyId) {
      toast.error('No theme selected or company ID available');
      return;
    }

    const theme = allThemes.find(t => t.id === selectedTheme);
    if (!theme) {
      toast.error('Selected theme not found');
      return;
    }

    try {
      // If it's a built-in theme, we need to save it first
      if (theme.isBuiltIn) {
        await createThemeMutation.mutateAsync({
          name: `${theme.name} (Applied)`,
          companyId,
          createdById: 'default-user', // TODO: Get from auth context
          lightModeConfig: theme.lightModeConfig || {},
          darkModeConfig: theme.darkModeConfig || {},
          isDefault: true,
        });
      } else {
        // If it's already a company theme, just set it as default
        await applyTheme(selectedTheme, companyId);
      }
      
      toast.success(`Applied "${theme.name}" theme successfully`);
    } catch (error) {
      console.error('Failed to apply theme:', error);
      toast.error('Failed to apply theme');
    }
  };

  // Set initial selected theme based on current theme
  useEffect(() => {
    if (currentTheme && !selectedTheme) {
      setSelectedTheme(currentTheme.id);
    }
  }, [currentTheme, selectedTheme]);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Header with search and controls */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredThemes.length} themes
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Category Filter */}
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 text-sm border rounded-md bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : 
                     category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* Theme Mode Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleThemeMode}
                className="flex items-center gap-2"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Light
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Dark
                  </>
                )}
              </Button>

              {/* Random Theme Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={getRandomTheme}
                className="flex items-center gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Random
              </Button>
            </div>
          </div>
        </div>

        {/* Theme List */}
        <ScrollArea className="h-[400px] mt-6">
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-sm text-muted-foreground">Loading themes...</div>
              </div>
            ) : filteredThemes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-sm text-muted-foreground">No themes found</div>
              </div>
            ) : (
              filteredThemes.map((themePreview) => (
                <div
                  key={themePreview.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                    "hover:bg-accent/50",
                    selectedTheme === themePreview.id && "bg-accent border-primary"
                  )}
                  onClick={() => {
                    setSelectedTheme(themePreview.id);
                    applyThemePreview(themePreview);
                  }}
                >
                  {/* Theme Info */}
                  <div className="flex items-center gap-3">
                    {/* Color Preview */}
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: themePreview.colors.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: themePreview.colors.secondary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: themePreview.colors.accent }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: themePreview.colors.background }}
                      />
                    </div>

                    {/* Theme Name */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{themePreview.name}</span>
                      {themePreview.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                      {themePreview.isBuiltIn && (
                        <Badge variant="outline" className="text-xs">Built-in</Badge>
                      )}
                      {themePreview.category && (
                        <Badge variant="secondary" className="text-xs capitalize">
                          {themePreview.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Save Built-in Theme */}
                    {themePreview.isBuiltIn && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveThemeToCompany(themePreview);
                        }}
                        title="Save to company themes"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {/* Selection Indicator */}
                    {selectedTheme === themePreview.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Preview Section */}
        {selectedTheme && (
          <div className="mt-6 p-4 border rounded-lg bg-background">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium">Preview</h4>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const theme = allThemes.find(t => t.id === selectedTheme);
                    if (theme && theme.isBuiltIn) {
                      saveThemeToCompany(theme);
                    }
                  }}
                  disabled={!selectedTheme || !allThemes.find(t => t.id === selectedTheme)?.isBuiltIn}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save Theme
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={applySelectedTheme}
                  disabled={!selectedTheme || !companyId}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Apply Theme
                </Button>
              </div>
            </div>

            {/* Component Previews */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm">Primary</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="outline" size="sm">Outline</Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              
              <Card>
                <CardContent className="p-3">
                  <div className="text-sm">Sample card content with current theme</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}