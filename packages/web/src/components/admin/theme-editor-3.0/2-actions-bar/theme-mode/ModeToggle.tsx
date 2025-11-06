'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../../types/theme.types';

interface ModeToggleProps {
  mode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
  className?: string;
}

export function ModeToggle({ mode, onModeChange, className = '' }: ModeToggleProps) {
  const isDark = mode === 'dark';
  
  const handleToggle = () => {
    onModeChange(isDark ? 'light' : 'dark');
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Sun className="h-3 w-3 text-muted-foreground" />
      
      {/* Toggle Switch */}
      <div 
        className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${
          isDark 
            ? 'bg-primary' 
            : 'bg-muted-foreground/20'
        }`}
        onClick={handleToggle}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <div 
          className={`w-4 h-4 rounded-full bg-background transition-transform duration-200 ${
            isDark ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      
      <Moon className="h-3 w-3 text-muted-foreground" />
    </div>
  );
}