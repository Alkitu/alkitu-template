'use client';

/**
 * ThemeSwitcher Component - Organism
 *
 * Allows users to switch between saved themes and preview them.
 * Integrates with DynamicThemeProvider for real-time theme switching.
 *
 * Uses comprehensive CSS variable system for dynamic theming:
 * - All styling uses migrated components (Button, DropdownMenu, Card, Badge)
 * - Automatically responds to theme changes
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */

import * as React from 'react';
import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/primitives/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/primitives/DropdownMenu';
import { Badge } from '@/components/atoms-alianza/Badge';
import { useGlobalTheme } from '@/hooks/useGlobalTheme';
import type { ThemeSwitcherProps } from './ThemeSwitcher.types';

/**
 * ThemeSwitcher - Allows users to switch between saved themes
 *
 * @example
 * ```tsx
 * // Dropdown mode (default)
 * <ThemeSwitcher />
 *
 * // Inline mode with custom callback
 * <ThemeSwitcher
 *   mode="inline"
 *   onThemeChange={(themeId) => console.log('Theme changed:', themeId)}
 * />
 *
 * // With theme preview disabled
 * <ThemeSwitcher showPreview={false} />
 * ```
 */
export function ThemeSwitcher({
  mode = 'dropdown',
  showPreview = true,
  className,
  onThemeChange,
}: ThemeSwitcherProps) {
  const {
    currentTheme,
    savedThemes,
    loadTheme,
    isLoading,
  } = useGlobalTheme();

  const handleThemeChange = React.useCallback(
    (themeId: string) => {
      loadTheme(themeId);
      onThemeChange?.(themeId);
    },
    [loadTheme, onThemeChange],
  );

  // Dropdown mode
  if (mode === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={className}
            disabled={isLoading}
          >
            <Palette className="h-4 w-4 mr-2" />
            {currentTheme?.name || 'Select Theme'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {savedThemes.length === 0 ? (
            <DropdownMenuItem disabled>
              No themes available
            </DropdownMenuItem>
          ) : (
            savedThemes.map((theme) => (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  {theme.name}
                  {theme.isDefault && (
                    <Badge variant="secondary" size="sm">
                      Default
                    </Badge>
                  )}
                </span>
                {currentTheme?.id === theme.id && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/admin/settings/themes">
              Manage Themes
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Inline mode - render as a list of buttons
  return (
    <div className={`flex flex-wrap gap-2 ${className || ''}`}>
      {savedThemes.length === 0 ? (
        <p className="text-muted-foreground text-sm">No themes available</p>
      ) : (
        savedThemes.map((theme) => (
          <Button
            key={theme.id}
            variant={currentTheme?.id === theme.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleThemeChange(theme.id)}
            disabled={isLoading}
            className="gap-2"
          >
            {theme.name}
            {theme.isDefault && (
              <Badge variant="secondary" size="sm">
                Default
              </Badge>
            )}
            {currentTheme?.id === theme.id && (
              <Check className="h-4 w-4" />
            )}
          </Button>
        ))
      )}
    </div>
  );
}

ThemeSwitcher.displayName = 'ThemeSwitcher';
