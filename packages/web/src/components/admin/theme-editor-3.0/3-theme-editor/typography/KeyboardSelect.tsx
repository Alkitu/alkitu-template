'use client';

import React, { useState, useCallback, KeyboardEvent } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface KeyboardSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
}

export function KeyboardSelect({ 
  value, 
  onValueChange, 
  options,
  placeholder,
  className = "",
  children
}: KeyboardSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      
      const currentIndex = options.findIndex(opt => opt.value === value);
      let newIndex = currentIndex;
      
      if (e.key === 'ArrowUp') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
      } else if (e.key === 'ArrowDown') {
        newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
      }
      
      if (newIndex !== currentIndex && options[newIndex]) {
        onValueChange(options[newIndex].value);
      }
    }
  }, [value, options, onValueChange, isOpen]);

  return (
    <Select 
      value={value} 
      onValueChange={onValueChange}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger 
        className={`h-8 text-xs ${className}`}
        onKeyDown={handleKeyDown}
        title="Use ↑/↓ arrows to navigate options"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children || options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}