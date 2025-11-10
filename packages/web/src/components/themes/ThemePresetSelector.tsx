'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Badge } from '@/components/atomic-design/atoms/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/atomic-design/atoms/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/atomic-design/atoms/tooltip';
import { cn } from '@/lib/utils';
import { useCompanyTheme } from '@/components/providers/DynamicThemeProvider';
import { trpc } from '@/lib/trpc';
import { PREDEFINED_THEMES, PredefinedTheme } from '@/lib/predefined-themes';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Search,
  Settings,
  Shuffle,
  Sun,
  Moon,
} from 'lucide-react';

interface ColorBoxProps {
  color: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color }) => (
  <div
    className="border-muted h-3 w-3 rounded-sm border"
    style={{ backgroundColor: color }}
  />
);

interface ThemeColorsProps {
  theme: PredefinedTheme | any;
  mode: 'light' | 'dark';
}

const ThemeColors: React.FC<ThemeColorsProps> = ({ theme, mode }) => {
  const config = mode === 'dark' ? theme.darkModeConfig : theme.lightModeConfig;
  const colors = config || theme.colors;

  return (
    <div className="flex gap-0.5">
      <ColorBox color={colors.primary} />
      <ColorBox color={colors.secondary || colors.accent} />
      <ColorBox color={colors.accent || colors.secondary} />
      <ColorBox color={colors.border || colors.foreground} />
    </div>
  );
};

const isThemeNew = (theme: any) => {
  if (!theme.createdAt) return false;
  const createdAt = new Date(theme.createdAt);
  const timePeriod = new Date();
  timePeriod.setDate(timePeriod.getDate() - 5);
  return createdAt > timePeriod;
};

const ThemeControls = () => {
  const { toggleThemeMode, isDarkMode, updateThemeColors } = useCompanyTheme();

  const allThemes = [...PREDEFINED_THEMES];

  const randomize = useCallback(() => {
    if (!updateThemeColors) {
      console.warn('updateThemeColors not available yet');
      return;
    }

    const random = Math.floor(Math.random() * allThemes.length);
    const randomTheme = allThemes[random];
    if (randomTheme) {
      // Apply theme preview using DynamicThemeProvider's updateThemeColors method
      const config = isDarkMode
        ? randomTheme.darkModeConfig
        : randomTheme.lightModeConfig;
      const colorsToApply = config || randomTheme.colors;

      // Use the theme context's updateThemeColors method instead of direct DOM manipulation
      updateThemeColors(colorsToApply, isDarkMode ? 'dark' : 'light');

      toast.success(`Applied random theme: ${randomTheme.name}`);
    }
  }, [allThemes, isDarkMode, updateThemeColors]);

  return (
    <div className="flex gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="size-6 p-1"
            onClick={toggleThemeMode}
          >
            {isDarkMode ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle theme mode</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="size-6 p-1"
            onClick={randomize}
          >
            <Shuffle className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Random theme</TooltipContent>
      </Tooltip>
    </div>
  );
};

interface ThemePresetSelectorProps {
  className?: string;
  onThemeSelect?: (themeId: string) => void;
}

export const ThemePresetSelector: React.FC<ThemePresetSelectorProps> = ({
  className,
  onThemeSelect,
}) => {
  const {
    theme: currentTheme,
    isDarkMode,
    applyTheme,
    loading,
    setCurrentTheme,
    updateThemeColors,
  } = useCompanyTheme();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  // Fetch company themes from backend
  const companyId = currentTheme?.companyId;
  const { data: companyThemes = [], isLoading } =
    trpc.theme.getCompanyThemes.useQuery(
      // TODO: Implement this
      { companyId: companyId! },
      { enabled: !!companyId && companyId.length === 24 },
    );

  // tRPC mutations for saving themes
  const utils = trpc.useUtils();
  const createThemeMutation = trpc.theme.createTheme.useMutation({
    // TODO: Implement this
    onSuccess: (newTheme) => {
      console.log('🚀 Theme created successfully:', newTheme.name);
      toast.success('Theme applied successfully');
      // Invalidate and refetch company themes
      utils.theme.getCompanyThemes.invalidate();
    },
    onError: (error: any) => {
      console.error('❌ Failed to create theme:', error);
      toast.error(`Failed to apply theme: ${error.message}`);
    },
  });

  // Combine all themes
  const allThemes = useMemo(() => {
    const predefinedThemesPreviews = PREDEFINED_THEMES.map((theme) => ({
      ...theme,
      isBuiltIn: true,
      isDefault: false,
    }));

    const companyThemesPreviews = companyThemes.map((theme: any) => ({
      id: theme.id,
      name: theme.name,
      category: 'custom' as const,
      isDefault: theme.isDefault,
      isBuiltIn: false,
      lightModeConfig: theme.lightModeConfig as Record<string, string>,
      darkModeConfig: theme.darkModeConfig as Record<string, string>,
      colors: {
        primary: (theme.lightModeConfig as any)?.primary || '#3b82f6',
        secondary: (theme.lightModeConfig as any)?.secondary || '#f3f4f6',
        accent: (theme.lightModeConfig as any)?.accent || '#e0f2fe',
        background: (theme.lightModeConfig as any)?.background || '#ffffff',
        foreground: (theme.lightModeConfig as any)?.foreground || '#333333',
      },
      createdAt: theme.createdAt,
    }));

    return [...companyThemesPreviews, ...predefinedThemesPreviews];
  }, [companyThemes]);

  // Filter themes based on search
  const filteredThemes = useMemo(() => {
    return search.trim() === ''
      ? allThemes
      : allThemes.filter((theme) =>
          theme.name.toLowerCase().includes(search.toLowerCase()),
        );
  }, [allThemes, search]);

  // Separate saved and built-in themes
  const savedThemes = useMemo(() => {
    return filteredThemes.filter((theme) => !theme.isBuiltIn);
  }, [filteredThemes]);

  const builtInThemes = useMemo(() => {
    return filteredThemes.filter((theme) => theme.isBuiltIn);
  }, [filteredThemes]);

  // Get current theme colors for display
  const currentThemeColors = useMemo(() => {
    // Only use actual current theme, don't fallback to first theme
    if (!currentTheme) {
      console.log('🎨 No current theme for color display');
      return {
        primary: '#6b7280', // Gray fallback when no theme
        secondary: '#f3f4f6',
        accent: '#e5e7eb',
        border: '#d1d5db',
      };
    }

    const config = isDarkMode
      ? currentTheme.darkModeConfig
      : currentTheme.lightModeConfig;
    const colors = config || currentTheme.colors; // TODO: Implement this

    console.log('🎨 Theme colors for display:', {
      theme: currentTheme.name,
      mode: isDarkMode ? 'dark' : 'light',
      colors: {
        primary: colors?.primary,
        secondary: colors?.secondary,
        accent: colors?.accent,
        border: colors?.border,
      },
    });

    return {
      primary: colors?.primary || '#3b82f6',
      secondary: colors?.secondary || '#f3f4f6',
      accent: colors?.accent || '#e0f2fe',
      border: colors?.border || '#e5e7eb',
    };
  }, [currentTheme, isDarkMode]);

  // Save theme to company
  const saveThemeToCompany = async (themeToSave: any) => {
    if (!companyId || companyId.length !== 24) {
      toast.error(
        'No valid company ID found. Please ensure you are logged in.',
      );
      return;
    }

    const themeName = prompt(
      `Save "${themeToSave.name}" to your company themes?\nEnter a name for this theme:`,
      themeToSave.name,
    );
    if (!themeName) return;

    try {
      await createThemeMutation.mutateAsync({
        name: themeName,
        companyId,
        createdById: 'default-user', // TODO: Get from auth context
        lightModeConfig: themeToSave.lightModeConfig || {},
        darkModeConfig: themeToSave.darkModeConfig || {},
        isDefault: false,
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  // Apply theme
  const handleThemeSelect = useCallback(
    async (selectedTheme: any) => {
      try {
        if (!updateThemeColors) {
          console.warn('updateThemeColors not available yet');
          return;
        }

        // Apply preview first using DynamicThemeProvider's updateThemeColors method
        const config = isDarkMode
          ? selectedTheme.darkModeConfig
          : selectedTheme.lightModeConfig;
        const colorsToApply = config || selectedTheme.colors;

        // Use the theme context's updateThemeColors method instead of direct DOM manipulation
        updateThemeColors(colorsToApply, isDarkMode ? 'dark' : 'light');

        // If it's a built-in theme, save it to company first
        let themeToApply = selectedTheme;

        if (selectedTheme.isBuiltIn && companyId && companyId.length === 24) {
          console.log(
            '🎯 Saving built-in theme to company:',
            selectedTheme.name,
          );
          themeToApply = await createThemeMutation.mutateAsync({
            name: selectedTheme.name,
            companyId,
            createdById: 'default-user',
            lightModeConfig: selectedTheme.lightModeConfig || {},
            darkModeConfig: selectedTheme.darkModeConfig || {},
            isDefault: true, // Make it the default theme
          });
        } else if (!selectedTheme.isBuiltIn && companyId && applyTheme) {
          // If it's already a company theme, just set it as default
          console.log(
            '🎯 Setting company theme as default:',
            selectedTheme.name,
          );
          await applyTheme(selectedTheme.id, companyId);
        }

        // Update the current theme in context immediately
        console.log('🎯 Updating current theme in context:', themeToApply.name);
        setCurrentTheme(themeToApply);

        toast.success(`Applied "${selectedTheme.name}" theme`);
        onThemeSelect?.(themeToApply.id || selectedTheme.id);
        setOpen(false);

        // Force a small delay to ensure state updates
        setTimeout(() => {
          console.log(
            '🔄 Theme selection completed, current theme should be:',
            themeToApply.name,
          );
        }, 100);
      } catch (error) {
        console.error('Failed to apply theme:', error);
        toast.error('Failed to apply theme');
      }
    },
    [
      isDarkMode,
      companyId,
      applyTheme,
      createThemeMutation,
      onThemeSelect,
      setCurrentTheme,
      updateThemeColors,
    ],
  );

  // Auto-select first theme if no current theme is selected (disabled to prevent conflicts)
  // useEffect(() => {
  //   if (!loading && !currentTheme && allThemes.length > 0 && companyId) {
  //     const firstTheme = allThemes[0];
  //     console.log('Auto-selecting first available theme:', firstTheme.name);
  //     handleThemeSelect(firstTheme);
  //   }
  // }, [loading, currentTheme, allThemes, companyId, handleThemeSelect]);

  return (
    <div className="flex w-full items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'group relative w-full justify-between md:min-w-56',
              className,
            )}
          >
            <div className="flex w-full items-center gap-3 overflow-hidden">
              <div className="flex gap-0.5">
                {currentThemeColors && (
                  <>
                    <ColorBox color={currentThemeColors.primary} />
                    <ColorBox color={currentThemeColors.secondary} />
                    <ColorBox color={currentThemeColors.accent} />
                    <ColorBox color={currentThemeColors.border} />
                  </>
                )}
              </div>
              {(currentTheme || allThemes[0]) &&
                !(currentTheme || allThemes[0])?.isBuiltIn && (
                  <div className="bg-muted rounded-full p-1">
                    <Heart
                      className="size-1"
                      stroke="var(--muted)"
                      fill="var(--muted-foreground)"
                    />
                  </div>
                )}
              <span className="truncate text-left font-medium capitalize">
                {loading
                  ? 'Loading...'
                  : currentTheme?.name || 'Select a theme'}
              </span>
            </div>
            <ChevronDown className="size-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="center">
          <Command className="h-100 w-full">
            <div className="flex w-full items-center">
              <div className="flex w-full items-center border-b px-3 py-1">
                <Search className="size-4 shrink-0 opacity-50" />
                <Input
                  placeholder="Search themes..."
                  className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-muted-foreground text-sm">
                {filteredThemes.length} theme
                {filteredThemes.length !== 1 ? 's' : ''}
              </div>
              <ThemeControls />
            </div>
            <Separator />
            <ScrollArea className="h-[500px] max-h-[70vh]">
              <CommandEmpty>No themes found.</CommandEmpty>

              {/* Saved Themes Group */}
              {savedThemes.length > 0 && (
                <>
                  <CommandGroup
                    heading={
                      <div className="flex w-full items-center justify-between">
                        <span>Saved Themes</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 p-0 text-xs"
                        >
                          <span>Manage</span>
                          <Settings className="size-3.5" />
                        </Button>
                      </div>
                    }
                  >
                    {savedThemes.map((theme, index) => (
                      <CommandItem
                        key={`${theme.id}-${index}`}
                        value={`${theme.id}-${index}`}
                        onSelect={() => handleThemeSelect(theme)}
                        className="data-[highlighted]:bg-secondary/50 flex items-center gap-2 py-2"
                      >
                        <ThemeColors
                          theme={theme}
                          mode={isDarkMode ? 'dark' : 'light'}
                        />
                        <div className="flex flex-1 items-center gap-2">
                          <span className="line-clamp-1 text-sm font-medium capitalize">
                            {theme.name}
                          </span>
                          {isThemeNew(theme) && (
                            <Badge
                              variant="secondary"
                              className="rounded-full text-xs"
                            >
                              New
                            </Badge>
                          )}
                          {theme.isDefault && (
                            <Badge
                              variant="outline"
                              className="rounded-full text-xs"
                            >
                              Default
                            </Badge>
                          )}
                        </div>
                        {theme.id === currentTheme?.id && (
                          <Check className="h-4 w-4 shrink-0 opacity-70" />
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                saveThemeToCompany(theme);
                              }}
                            >
                              <Heart className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Save theme</TooltipContent>
                        </Tooltip>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <Separator className="my-2" />
                </>
              )}

              {savedThemes.length === 0 && search.trim() === '' && (
                <>
                  <div className="text-muted-foreground flex items-center gap-1.5 px-3 py-2 text-xs font-medium">
                    <div className="bg-muted flex items-center gap-1 rounded-md border px-2 py-0.5">
                      <Heart className="fill-muted-foreground size-3" />
                      <span>Save</span>
                    </div>
                    <span className="text-muted-foreground">
                      a theme to find it here.
                    </span>
                  </div>
                  <Separator />
                </>
              )}

              {/* Built-in Themes Group */}
              {builtInThemes.length > 0 && (
                <CommandGroup heading="Built-in Themes">
                  {builtInThemes.map((theme, index) => (
                    <CommandItem
                      key={`${theme.id}-${index}`}
                      value={`${theme.id}-${index}`}
                      onSelect={() => handleThemeSelect(theme)}
                      className="data-[highlighted]:bg-secondary/50 group flex items-center gap-2 py-2"
                    >
                      <ThemeColors
                        theme={theme}
                        mode={isDarkMode ? 'dark' : 'light'}
                      />
                      <div className="flex flex-1 items-center gap-2">
                        <span className="text-sm font-medium capitalize">
                          {theme.name}
                        </span>
                        {theme.category && (
                          <Badge
                            variant="outline"
                            className="rounded-full text-xs capitalize"
                          >
                            {theme.category}
                          </Badge>
                        )}
                      </div>
                      {theme.id === currentTheme?.id && (
                        <Check className="h-4 w-4 shrink-0 opacity-70" />
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              saveThemeToCompany(theme);
                            }}
                          >
                            <Heart className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save theme</TooltipContent>
                      </Tooltip>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ThemePresetSelector;
