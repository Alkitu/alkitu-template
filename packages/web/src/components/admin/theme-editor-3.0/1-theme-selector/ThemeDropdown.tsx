'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Check, Heart } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { ThemeData } from '../types/theme.types';
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
}

export function ThemeDropdown({
  themes,
  selectedTheme,
  searchQuery,
  onSearchChange,
  onThemeSelect,
  isOpen,
  onOpenChange,
  savedThemes = []
}: ThemeDropdownProps) {
  
  // Filter themes based on search query
  const filteredThemes = themes.filter(theme =>
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
            {filteredThemes.length} theme{filteredThemes.length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              Built-in
            </Badge>
          </div>
        </div>

        {/* Saved Themes Section */}
        {savedThemes.length > 0 && (
          <>
            <div className="px-3 py-2 border-b border-border bg-muted">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Heart className="h-4 w-4" />
                <span>Saved Themes</span>
              </div>
            </div>
            <div className="max-h-32 overflow-y-auto border-b border-border">
              {savedThemes.map((theme) => (
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
                  </div>
                  {theme.id === selectedTheme.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Built-in Themes Header */}
        <div className="px-3 py-2 border-b border-border">
          <span className="text-sm font-medium text-foreground">Built-in Themes</span>
        </div>

        {/* Themes List */}
        <div className="max-h-64 overflow-y-auto">
          {filteredThemes.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No themes found for "{searchQuery}"
            </div>
          ) : (
            filteredThemes.map((theme) => (
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