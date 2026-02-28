'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/atoms-alianza/Input';

export interface CommandProps {
  children?: React.ReactNode;
  className?: string;
}

export function Command({ children, className = '' }: CommandProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export interface CommandInputProps {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function CommandInput({ 
  placeholder = 'Buscar...', 
  value,
  onValueChange 
}: CommandInputProps) {
  const [inputValue, setInputValue] = useState(value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange?.(newValue);
  };

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  return (
    <div className="flex items-center px-3 pb-3">
      <Search className="mr-2 h-4 w-4 opacity-50" />
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="flex-1"
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          boxShadow: 'none'
        }}
      />
    </div>
  );
}

export interface CommandListProps {
  children?: React.ReactNode;
}

export function CommandList({ children }: CommandListProps) {
  return (
    <div className="max-h-[300px] overflow-y-auto">
      {children}
    </div>
  );
}

export interface CommandEmptyProps {
  children?: React.ReactNode;
}

export function CommandEmpty({ children }: CommandEmptyProps) {
  const hasChildren = React.Children.count(children) > 0;
  
  if (!hasChildren) return null;
  
  return (
    <div className="py-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export interface CommandGroupProps {
  children?: React.ReactNode;
  heading?: string;
}

export function CommandGroup({ children, heading }: CommandGroupProps) {
  return (
    <div>
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export interface CommandItemProps {
  children?: React.ReactNode;
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CommandItem({ 
  children, 
  value = '',
  onSelect,
  disabled = false,
  className = '',
  style = {}
}: CommandItemProps) {
  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(value);
    }
  };

  return (
    <div
      className={`
        relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground'}
        ${className}
      `}
      onClick={handleClick}
      style={style}
    >
      {children}
    </div>
  );
}

export interface CommandSeparatorProps {
  className?: string;
}

export function CommandSeparator({ className = '' }: CommandSeparatorProps) {
  return (
    <div className={`-mx-1 h-px bg-border ${className}`} />
  );
}

export interface CommandShortcutProps {
  children?: React.ReactNode;
}

export function CommandShortcut({ children }: CommandShortcutProps) {
  return (
    <span className="ml-auto text-xs tracking-widest text-muted-foreground">
      {children}
    </span>
  );
}