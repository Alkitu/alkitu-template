'use client';

import React from 'react';
import { useGlobalTheme } from '@/context/GlobalThemeProvider';
import { useThemeSelector } from '@/components/features/theme-editor-3.0/core/hooks/useThemeSelector';
import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle';
import { Button } from '@/components/primitives/ui/LoadingButton';
import { Card } from '@/components/primitives/ui/card';
import { Badge } from '@/components/atoms/badge/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import { ChevronLeft, ChevronRight, Shuffle, Star } from 'lucide-react';

/**
 * Theme Test Page
 *
 * Public page for testing theme switching functionality.
 * Used for manual testing and Playwright E2E tests.
 */
export default function ThemeTestPage() {
  const { state } = useGlobalTheme();
  const {
    currentTheme,
    themes,
    savedThemes,
    handleThemeSelect,
    handlePreviousTheme,
    handleNextTheme,
    handleRandomTheme,
    handleToggleFavorite,
  } = useThemeSelector();

  const currentColors = state.themeMode === 'dark' ? currentTheme.darkColors : currentTheme.lightColors;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground" data-testid="test-page-title">
              Theme Test Page
            </h1>
            <p className="text-muted-foreground mt-2">
              Test theme switching, persistence, and database updates
            </p>
          </div>
          <ThemeToggle data-testid="theme-mode-toggle" />
        </div>

        {/* Current Theme Info */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Current Theme</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Theme Name</p>
                <p className="text-xl font-medium" data-testid="current-theme-name">
                  {currentTheme.name}
                </p>
              </div>
              {currentTheme.isDefault && (
                <Badge variant="default" data-testid="default-badge">
                  Default
                </Badge>
              )}
              {currentTheme.isFavorite && (
                <Badge variant="secondary" data-testid="favorite-badge">
                  <Star className="w-3 h-3 mr-1" />
                  Favorite
                </Badge>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Theme ID</p>
              <p className="font-mono text-sm" data-testid="current-theme-id">
                {currentTheme.id}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Mode</p>
              <p className="text-lg capitalize" data-testid="current-theme-mode">
                {state.themeMode}
              </p>
            </div>

            {currentTheme.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{currentTheme.description}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Theme Selector */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Theme Selector</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Select Theme
              </label>
              <Select
                value={currentTheme.id}
                onValueChange={(value) => {
                  const theme = themes.find((t) => t.id === value);
                  if (theme) handleThemeSelect(theme);
                }}
              >
                <SelectTrigger data-testid="theme-selector">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {savedThemes.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        Saved Themes
                      </div>
                      {savedThemes.map((theme) => (
                        <SelectItem
                          key={theme.id}
                          value={theme.id}
                          data-testid={`theme-option-${theme.id}`}
                        >
                          <div className="flex items-center gap-2">
                            {theme.name}
                            {theme.isDefault && (
                              <Badge variant="outline" className="text-xs">
                                Default
                              </Badge>
                            )}
                            {theme.isFavorite && <Star className="w-3 h-3" />}
                          </div>
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handlePreviousTheme}
                variant="outline"
                size="sm"
                data-testid="previous-theme-btn"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                onClick={handleNextTheme}
                variant="outline"
                size="sm"
                data-testid="next-theme-btn"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                onClick={handleRandomTheme}
                variant="outline"
                size="sm"
                data-testid="random-theme-btn"
              >
                <Shuffle className="w-4 h-4 mr-1" />
                Random
              </Button>
            </div>
          </div>
        </Card>

        {/* Color Preview */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Color Preview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(currentColors).slice(0, 12).map(([name, color]: [string, any]) => (
              <div
                key={name}
                className="space-y-2"
                data-testid={`color-preview-${name}`}
              >
                <div
                  className="h-20 rounded-lg border border-border"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <p className="text-xs font-medium capitalize">
                    {name.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Saved Themes List */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Saved Themes ({savedThemes.length})
          </h2>
          <div className="space-y-2">
            {savedThemes.map((theme) => (
              <div
                key={theme.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                data-testid={`saved-theme-${theme.id}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded border border-border"
                    style={{
                      backgroundColor: theme.lightColors?.primary?.hex || '#000',
                    }}
                  />
                  <div>
                    <p className="font-medium">{theme.name}</p>
                    <p className="text-xs text-muted-foreground">{theme.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {theme.isDefault && (
                    <Badge variant="default" className="text-xs">
                      Default
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(theme.id)}
                    data-testid={`toggle-favorite-${theme.id}`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        theme.isFavorite
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleThemeSelect(theme)}
                    data-testid={`select-theme-${theme.id}`}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Theme Debug Info */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Debug Info</h2>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Themes:</span>
              <span data-testid="debug-total-themes">{themes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Saved Themes:</span>
              <span data-testid="debug-saved-themes">{savedThemes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Loading:</span>
              <span data-testid="debug-loading">{state.isLoading.toString()}</span>
            </div>
            {state.error && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Error:</span>
                <span className="text-destructive" data-testid="debug-error">
                  {state.error}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
