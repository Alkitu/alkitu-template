'use client';

import React from 'react';
import { Button } from '../../design-system/primitives/Button';
import { Check, Heart, Star } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../design-system/primitives/popover';
import { Badge } from '../../design-system/primitives/badge';
import { ThemeData } from '../../core/types/theme.types';
import { ThemePreview } from './ThemePreview';
import { ThemeSearch } from './ThemeSearch';

interface ThemeDropdownProps {
  themes: ThemeData[];
  selectedTheme: ThemeData;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onThemeSelect: (theme: ThemeData) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  savedThemes?: ThemeData[];
  builtInThemes?: ThemeData[];
  onToggleFavorite?: (themeId: string) => void;
}

export function ThemeDropdown({
  themes,
  selectedTheme,
  searchQuery,
  onSearchChange,
  onThemeSelect,
  isOpen,
  onOpenChange,
  savedThemes = [],
  builtInThemes = [],
  onToggleFavorite
}: ThemeDropdownProps) {

  // Filter saved themes and built-in themes separately
  const filteredSavedThemes = savedThemes.filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredBuiltInThemes = builtInThemes.filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleThemeSelect = (theme: ThemeData) => {
    onThemeSelect(theme);
    onOpenChange(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full h-auto justify-start bg-transparent border-0 shadow-none focus:ring-0 hover:bg-muted p-2"
        >
          <div className="flex items-center gap-3 w-full">
            <ThemePreview theme={selectedTheme} size="md" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm text-foreground">{selectedTheme.name}</div>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 bg-popover border-border" align="start">
        {/* Search Header */}
        <div className="p-3 border-b border-border">
          <ThemeSearch
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search themes..."
          />
        </div>

        {/* Theme Stats */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted">
          <span className="text-sm text-muted-foreground">
            {filteredSavedThemes.length + filteredBuiltInThemes.length} theme{filteredSavedThemes.length + filteredBuiltInThemes.length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            {filteredSavedThemes.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {filteredSavedThemes.length} My Themes
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {filteredBuiltInThemes.length} Built-in
            </Badge>
          </div>
        </div>

        {/* My Themes Section */}
        {filteredSavedThemes.length > 0 && (
          <>
            <div className="px-3 py-2 border-b border-border bg-muted">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Star className="h-4 w-4" />
                  <span>My Themes</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {filteredSavedThemes.length}
                </Badge>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto border-b border-border">
              {filteredSavedThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`flex items-center gap-3 px-3 py-2 hover:bg-muted group ${
                    theme.id === selectedTheme.id ? 'bg-muted' : ''
                  }`}
                >
                  <ThemePreview theme={theme} size="sm" />
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleThemeSelect(theme)}
                  >
                    <div className="text-sm font-medium truncate text-foreground">{theme.name}</div>
                    {theme.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {theme.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {onToggleFavorite && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(theme.id);
                        }}
                        className="p-1 hover:bg-muted-foreground/10 rounded transition-colors"
                        title={theme.isDefault ? 'Remove as default theme' : 'Set as default theme'}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            theme.isDefault
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </button>
                    )}
                    {theme.id === selectedTheme.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Built-in Themes Header */}
        <div className="px-3 py-2 border-b border-border bg-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Heart className="h-4 w-4" />
              <span>Built-in Themes</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {filteredBuiltInThemes.length}
            </Badge>
          </div>
        </div>

        {/* Themes List */}
        <div className="max-h-64 overflow-y-auto">
          {filteredBuiltInThemes.length === 0 && filteredSavedThemes.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No themes found for "{searchQuery}"
            </div>
          ) : (
            filteredBuiltInThemes.map((theme) => (
              <div
                key={theme.id}
                className={`flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer ${
                  theme.id === selectedTheme.id ? 'bg-muted' : ''
                }`}
                onClick={() => handleThemeSelect(theme)}
              >
                <ThemePreview theme={theme} size="sm" />
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-foreground">{theme.name}</div>
                  {theme.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {theme.description}
                    </div>
                  )}
                  {theme.tags && theme.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {theme.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {theme.id === selectedTheme.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}