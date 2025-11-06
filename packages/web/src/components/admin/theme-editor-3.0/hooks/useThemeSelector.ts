'use client';

import { useState } from 'react';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { DEFAULT_THEMES } from '../constants/default-themes';
import { ThemeData } from '../types/theme.types';

/**
 * Custom hook para el Theme Selector
 * Elimina la lógica duplicada de manejo de temas
 */
export function useThemeSelector() {
  const { state, setTheme } = useThemeEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [savedThemes] = useState<ThemeData[]>([]); // Future: load from localStorage/API

  // Usar currentTheme del context directamente (sin duplicar estado local)
  const currentTheme = state.currentTheme;

  // Theme navigation handlers
  const handleThemeSelect = (theme: ThemeData) => {
    setTheme(theme);
  };

  const handlePreviousTheme = () => {
    const currentIndex = DEFAULT_THEMES.findIndex(t => t.id === currentTheme.id);
    const previousIndex = currentIndex <= 0 ? DEFAULT_THEMES.length - 1 : currentIndex - 1;
    const previousTheme = DEFAULT_THEMES[previousIndex];
    handleThemeSelect(previousTheme);
  };

  const handleNextTheme = () => {
    const currentIndex = DEFAULT_THEMES.findIndex(t => t.id === currentTheme.id);
    const nextIndex = currentIndex >= DEFAULT_THEMES.length - 1 ? 0 : currentIndex + 1;
    const nextTheme = DEFAULT_THEMES[nextIndex];
    handleThemeSelect(nextTheme);
  };

  const handleRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_THEMES.length);
    const randomTheme = DEFAULT_THEMES[randomIndex];
    handleThemeSelect(randomTheme);
  };

  return {
    // State
    currentTheme,
    searchQuery,
    isDropdownOpen,
    savedThemes,
    
    // Setters
    setSearchQuery,
    setIsDropdownOpen,
    
    // Handlers
    handleThemeSelect,
    handlePreviousTheme,
    handleNextTheme,
    handleRandomTheme,
    
    // Data
    themes: DEFAULT_THEMES
  };
}