'use client';

import React from 'react';
import { useThemeSelector } from '../../core/hooks/useThemeSelector';
import { ThemeDropdown } from './ThemeDropdown';
import { ThemeNavigation } from './ThemeNavigation';

export function ThemeSelector() {
  const {
    currentTheme,
    searchQuery,
    isDropdownOpen,
    savedThemes,
    themes,
    builtInThemes,
    setSearchQuery,
    setIsDropdownOpen,
    handleThemeSelect,
    handlePreviousTheme,
    handleNextTheme,
    handleRandomTheme,
    handleToggleFavorite
  } = useThemeSelector();

  return (
    <div className="h-[75px] border-b border-border bg-card flex items-center justify-between px-4">
      {/* Theme Dropdown */}
      <div className="flex-1 max-w-xs">
        <ThemeDropdown
          themes={themes}
          selectedTheme={currentTheme}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onThemeSelect={handleThemeSelect}
          isOpen={isDropdownOpen}
          onOpenChange={setIsDropdownOpen}
          savedThemes={savedThemes}
          builtInThemes={builtInThemes}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      {/* Navigation Controls */}
      <div className="ml-2">
        <ThemeNavigation
          onPrevious={handlePreviousTheme}
          onNext={handleNextTheme}
          onRandom={handleRandomTheme}
        />
      </div>
    </div>
  );
}