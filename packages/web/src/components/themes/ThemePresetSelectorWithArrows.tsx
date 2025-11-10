'use client';

import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/atomic-design/atoms/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCompanyTheme } from '@/components/providers/DynamicThemeProvider';
import { trpc } from '@/lib/trpc';
import { PREDEFINED_THEMES } from '@/lib/predefined-themes';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ThemePresetSelector } from './ThemePresetSelector';

interface ThemeCycleButtonProps extends React.ComponentProps<typeof Button> {
  direction: 'prev' | 'next';
}

const ThemeCycleButton: React.FC<ThemeCycleButtonProps> = ({
  direction,
  onClick,
  className,
  ...props
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className={cn('aspect-square h-full shrink-0', className)}
        onClick={onClick}
        {...props}
      >
        {direction === 'prev' ? (
          <ArrowLeft className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      {direction === 'prev' ? 'Previous theme' : 'Next theme'}
    </TooltipContent>
  </Tooltip>
);

interface ThemePresetCycleControlsProps
  extends React.ComponentProps<typeof Button> {
  allThemes: any[];
  currentTheme: any;
  className?: string;
  onThemeSelect?: (themeId: string) => void;
}

const ThemePresetCycleControls: React.FC<ThemePresetCycleControlsProps> = ({
  allThemes,
  currentTheme,
  className,
  onThemeSelect,
  ...props
}) => {
  const { isDarkMode, applyTheme, setCurrentTheme, updateThemeColors } = useCompanyTheme();

  // Get current theme index
  const currentIndex = useMemo(() => {
    if (!currentTheme || allThemes.length === 0) return 0;

    // First try to find by exact ID match
    let index = allThemes.findIndex((theme) => theme.id === currentTheme.id);

    // If not found by ID, try to find by name for built-in themes
    if (index === -1) {
      index = allThemes.findIndex(
        (theme) =>
          theme.name === currentTheme.name ||
          (theme.isBuiltIn && currentTheme.name.includes(theme.name)),
      );
    }

    console.log(
      'Current theme:',
      currentTheme.name,
      'Index found:',
      index,
      'Total themes:',
      allThemes.length,
    );
    return Math.max(0, index);
  }, [allThemes, currentTheme]);

  // tRPC mutations for applying themes
  const companyId = currentTheme?.companyId;
  const createThemeMutation = trpc.theme.createTheme.useMutation({
    // TODO: Implement this
    onSuccess: () => {
      toast.success('Theme applied successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to apply theme: ${error.message}`);
    },
  });

  const cycleTheme = useCallback(
    async (direction: 'prev' | 'next') => {
      if (allThemes.length === 0) return;

      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % allThemes.length
          : (currentIndex - 1 + allThemes.length) % allThemes.length;

      const selectedTheme = allThemes[newIndex];
      if (!selectedTheme) return;

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
        onThemeSelect?.(selectedTheme.id);
      } catch (error) {
        console.error('Failed to cycle theme:', error);
        toast.error('Failed to apply theme');
      }
    },
    [
      currentIndex,
      allThemes,
      isDarkMode,
      companyId,
      applyTheme,
      createThemeMutation,
      onThemeSelect,
      setCurrentTheme,
      updateThemeColors,
    ],
  );

  return (
    <>
      <Separator orientation="vertical" className="min-h-8" />

      <ThemeCycleButton
        direction="prev"
        size="icon"
        className={cn('aspect-square min-h-8 w-auto', className)}
        onClick={() => cycleTheme('prev')}
        disabled={allThemes.length <= 1}
        {...props}
      />

      <Separator orientation="vertical" className="min-h-8" />

      <ThemeCycleButton
        direction="next"
        size="icon"
        className={cn('aspect-square min-h-8 w-auto', className)}
        onClick={() => cycleTheme('next')}
        disabled={allThemes.length <= 1}
        {...props}
      />
    </>
  );
};

interface ThemePresetSelectorWithArrowsProps {
  className?: string;
  onThemeSelect?: (themeId: string) => void;
  withCycleThemes?: boolean;
}

export const ThemePresetSelectorWithArrows: React.FC<
  ThemePresetSelectorWithArrowsProps
> = ({ className, onThemeSelect, withCycleThemes = true }) => {
  const { theme: currentTheme, setCurrentTheme } = useCompanyTheme();

  // Handle theme selection from the dropdown
  const handleThemeSelectFromDropdown = useCallback(
    async (themeId: string) => {
      console.log('🔥 Theme selected from dropdown:', themeId);
      // The ThemePresetSelector already handles the theme application and context update
      // We just need to call the parent callback
      onThemeSelect?.(themeId);

      // Force refresh of the current theme display
      setTimeout(() => {
        console.log(
          '🔥 Current theme after dropdown selection:',
          currentTheme?.name,
        );
      }, 200);
    },
    [onThemeSelect, currentTheme],
  );

  // Fetch company themes from backend
  const companyId = currentTheme?.companyId;
  const { data: companyThemes = [] } = trpc.theme.getCompanyThemes.useQuery(
    // TODO: Implement this
    { companyId: companyId! },
    { enabled: !!companyId && companyId.length === 24 },
  );

  // Combine all themes (same logic as ThemePresetSelector)
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

  return (
    <div className={cn('flex w-full items-center', className)}>
      <ThemePresetSelector
        className="flex-1"
        onThemeSelect={handleThemeSelectFromDropdown}
      />
      {withCycleThemes && (
        <ThemePresetCycleControls
          allThemes={allThemes}
          currentTheme={currentTheme}
          onThemeSelect={onThemeSelect}
        />
      )}
    </div>
  );
};

export default ThemePresetSelectorWithArrows;
