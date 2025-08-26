'use client';

import React from 'react';
import { Input } from '../../design-system/primitives/input';
import { Search } from 'lucide-react';

interface ThemeSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ThemeSearch({ 
  value, 
  onChange, 
  placeholder = "Search themes...",
  className = ""
}: ThemeSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 h-8 text-sm"
      />
    </div>
  );
}