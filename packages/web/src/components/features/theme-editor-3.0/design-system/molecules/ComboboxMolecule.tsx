'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/atoms-alianza/Input';
import { Badge } from '@/components/atoms-alianza/Badge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/primitives/ui/popover';
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '../primitives/command-local';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export interface ComboboxOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  disabled?: boolean;
}

export interface ComboboxMoleculeProps {
  options: ComboboxOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  variant?: 'default' | 'multiple' | 'creatable' | 'async';
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  className?: string;
  emptyMessage?: string;
  maxSelections?: number;
  onSearch?: (query: string) => void;
  loading?: boolean;
}

/**
 * ComboboxMolecule - Advanced combobox with search and multi-selection
 * 
 * Combines: Popover + Command + Input + Button + Badge
 * Features: Multi-select, search, async loading, creatable options
 * Spacing: Small (item padding), Medium (popover gaps), Large (section spacing)
 */
export function ComboboxMolecule({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar opción...',
  searchPlaceholder = 'Buscar...',
  variant = 'default',
  disabled = false,
  clearable = true,
  searchable = true,
  className = '',
  emptyMessage = 'No se encontraron opciones',
  maxSelections = 10,
  onSearch,
  loading = false
}: ComboboxMoleculeProps) {
  const { state } = useThemeEditor();
  
  // Theme integration
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const shadows = state.currentTheme?.shadows;
  const spacing = state.currentTheme?.spacing;

  // Spacing system
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const smallSpacing = `var(--spacing-small, ${baseValue}px)`;
  const mediumSpacing = `var(--spacing-medium, ${baseValue * 2}px)`;

  // Local state
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(value) ? value : (value ? [value] : [])
  );

  // Update selected values when external value changes
  useEffect(() => {
    setSelectedValues(Array.isArray(value) ? value : (value ? [value] : []));
  }, [value]);

  // Handle selection
  const handleSelect = (optionValue: string) => {
    if (variant === 'multiple') {
      const isSelected = selectedValues.includes(optionValue);
      let newValues: string[];
      
      if (isSelected) {
        newValues = selectedValues.filter(v => v !== optionValue);
      } else {
        if (selectedValues.length >= maxSelections) return;
        newValues = [...selectedValues, optionValue];
      }
      
      setSelectedValues(newValues);
      onChange?.(newValues);
    } else {
      setSelectedValues([optionValue]);
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchValue(query);
    onSearch?.(query);
  };

  // Clear selection
  const handleClear = () => {
    setSelectedValues([]);
    onChange?.(variant === 'multiple' ? [] : '');
  };

  // Get display value
  const getDisplayValue = () => {
    if (selectedValues.length === 0) return placeholder;
    
    if (variant === 'multiple') {
      return `${selectedValues.length} seleccionados`;
    }
    
    const selectedOption = options.find(opt => opt.value === selectedValues[0]);
    return selectedOption?.label || selectedValues[0];
  };

  // Filter options based on search
  const filteredOptions = searchable && searchValue
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : options;

  // Enhanced styles with better visual feedback
  const getTriggerStyles = () => ({
    width: '100%',
    justifyContent: 'space-between',
    fontWeight: selectedValues.length > 0 ? 500 : 400,
    color: selectedValues.length > 0 
      ? (colors?.foreground?.value || 'var(--color-foreground)')
      : (colors?.mutedForeground?.value || 'var(--color-muted-foreground)'),
    minHeight: '40px',
    padding: `8px ${smallSpacing}`,
    borderRadius: 'var(--radius, 8px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: isOpen 
      ? `2px solid ${colors?.primary?.value || 'var(--color-primary)'}` 
      : `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
    boxShadow: isOpen 
      ? `0 0 0 2px ${colors?.primary?.value || 'var(--color-primary)'}20`
      : 'none'
  });

  const getPopoverStyles = () => ({
    background: `${colors?.popover?.value || 'var(--color-popover)'}f8`,
    border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
    borderRadius: 'var(--radius-popover, 12px)',
    boxShadow: `${shadows?.shadowLg || 'var(--shadow-lg)'}, 0 0 0 1px ${colors?.border?.value || 'var(--color-border)'}20`,
    minWidth: 'min(320px, calc(100vw - 40px))',
    maxWidth: 'min(420px, calc(100vw - 20px))',
    backdropFilter: 'blur(8px)',
    animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'var(--radix-popover-content-transform-origin)'
  });

  const getSelectedBadgesStyles = () => ({
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    maxHeight: '80px',
    overflowY: 'auto' as const,
    padding: '4px 0',
    alignItems: 'center'
  });

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            style={getTriggerStyles()}
            className={`
              text-left group relative overflow-hidden
              ${!disabled ? 'hover:bg-accent/50 hover:scale-[0.99] active:scale-[0.98]' : ''}
              ${isOpen ? 'bg-accent/30' : ''}
              transition-all duration-300 ease-out
            `}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              {variant === 'multiple' && selectedValues.length > 0 ? (
                <div style={getSelectedBadgesStyles()}>
                  {selectedValues.slice(0, 3).map(val => {
                    const option = options.find(opt => opt.value === val);
                    return (
                      <Badge 
                        key={val} 
                        variant="secondary" 
                        size="sm"
                        style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          borderRadius: '6px',
                          background: `${colors?.primary?.value || 'var(--color-primary)'}15`,
                          color: colors?.primary?.value || 'var(--color-primary)',
                          border: `1px solid ${colors?.primary?.value || 'var(--color-primary)'}30`,
                          transition: 'all 0.2s ease'
                        }}
                        className="hover:scale-105"
                      >
                        {option?.label || val}
                      </Badge>
                    );
                  })}
                  {selectedValues.length > 3 && (
                    <Badge 
                      variant="outline" 
                      size="sm"
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        background: colors?.mutedForeground?.value + '10' || 'var(--color-muted-foreground)10',
                        color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                        transition: 'all 0.2s ease'
                      }}
                      className="hover:scale-105"
                    >
                      +{selectedValues.length - 3} más
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="truncate">{getDisplayValue()}</span>
              )}
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              flexShrink: 0
            }}>
              {clearable && selectedValues.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    padding: '0',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    background: 'transparent'
                  }}
                  className="hover:bg-destructive/20 hover:scale-110 active:scale-95"
                >
                  <X className="h-3 w-3" style={{
                    color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                    transition: 'color 0.2s ease'
                  }} />
                </Button>
              )}
              <ChevronDown 
                className="h-4 w-4" 
                style={{
                  color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                  transition: 'transform 0.3s ease, color 0.2s ease',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }} 
              />
            </div>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent style={getPopoverStyles()}>
          <Command>
            {searchable && (
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchValue}
                onValueChange={handleSearch}
              />
            )}
            
            <CommandList>
              {loading ? (
                <div style={{ 
                  padding: `${mediumSpacing} ${smallSpacing}`, 
                  textAlign: 'center' as const,
                  color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  minHeight: '60px'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: `2px solid ${colors?.border?.value || 'var(--color-border)'}`,
                    borderTop: `2px solid ${colors?.primary?.value || 'var(--color-primary)'}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 500
                  }}>Cargando...</span>
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  
                  <CommandGroup>
                    {filteredOptions.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      
                      return (
                        <CommandItem
                          key={option.id}
                          value={option.value}
                          onSelect={() => handleSelect(option.value)}
                          disabled={option.disabled}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: `10px ${smallSpacing}`,
                            cursor: option.disabled ? 'not-allowed' : 'pointer',
                            fontFamily: 'var(--typography-paragraph-font-family)',
                            fontSize: '14px',
                            opacity: option.disabled ? 0.5 : 1,
                            borderRadius: '6px',
                            margin: '2px 4px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative' as const,
                            minHeight: '44px',
                            background: isSelected ? `${colors?.primary?.value || 'var(--color-primary)'}10` : 'transparent'
                          }}
                          className={`
                            ${!option.disabled ? 'hover:bg-accent/60 hover:scale-[0.98] hover:shadow-sm focus:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1' : ''}
                            ${isSelected ? 'bg-primary/5' : ''}
                            group transition-all duration-300 ease-out
                          `}
                        >
                          {variant === 'multiple' && (
                            <div style={{
                              width: '18px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `2px solid ${isSelected ? (colors?.primary?.value || 'var(--color-primary)') : (colors?.border?.value || 'var(--color-border)')}`,
                              borderRadius: '4px',
                              background: isSelected ? (colors?.primary?.value || 'var(--color-primary)') : 'transparent',
                              transition: 'all 0.3s ease',
                              flexShrink: 0
                            }}>
                              {isSelected && (
                                <Check 
                                  className="h-3 w-3" 
                                  style={{ 
                                    color: colors?.primaryForeground?.value || 'var(--color-primary-foreground)',
                                    animation: 'fadeIn 0.2s ease-in-out'
                                  }} 
                                />
                              )}
                            </div>
                          )}
                          
                          {option.icon && (
                            <div style={{
                              flexShrink: 0,
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '4px',
                              background: isSelected ? `${colors?.primary?.value || 'var(--color-primary)'}20` : 'transparent',
                              transition: 'all 0.3s ease'
                            }} className="group-hover:bg-primary/20">
                              <div style={{
                                color: isSelected ? (colors?.primary?.value || 'var(--color-primary)') : 'inherit',
                                width: '16px',
                                height: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'color 0.3s ease'
                              }}>
                                {option.icon}
                              </div>
                            </div>
                          )}
                          
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ 
                              color: isSelected ? (colors?.primary?.value || 'var(--color-primary)') : (colors?.foreground?.value || 'var(--color-foreground)'),
                              fontWeight: isSelected ? 600 : 450,
                              lineHeight: 1.4,
                              transition: 'all 0.3s ease'
                            }} className="group-hover:font-medium">
                              {option.label}
                            </div>
                            {option.description && (
                              <div style={{
                                fontSize: '12px',
                                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                                marginTop: '2px',
                                lineHeight: 1.3,
                                transition: 'color 0.3s ease'
                              }} className="group-hover:opacity-80">
                                {option.description}
                              </div>
                            )}
                          </div>
                          
                          {option.badge && (
                            <Badge 
                              variant={isSelected ? 'default' : (option.badge.variant || 'outline')} 
                              size="sm"
                              style={{
                                flexShrink: 0,
                                fontSize: '11px',
                                fontWeight: 500,
                                transition: 'all 0.3s ease',
                                transform: isSelected ? 'scale(0.95)' : 'scale(0.9)'
                              }}
                              className="group-hover:scale-100 group-hover:shadow-sm"
                            >
                              {option.badge.text}
                            </Badge>
                          )}
                          
                          {!variant.includes('multiple') && isSelected && (
                            <div style={{
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '50%',
                              background: `${colors?.primary?.value || 'var(--color-primary)'}20`,
                              flexShrink: 0
                            }}>
                              <Check 
                                className="h-4 w-4" 
                                style={{ 
                                  color: colors?.primary?.value || 'var(--color-primary)',
                                  animation: 'fadeIn 0.2s ease-in-out'
                                }} 
                              />
                            </div>
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Export preset configurations
export const ComboboxPresets = {
  basic: {
    variant: 'default' as const,
    searchable: true,
    clearable: true
  },
  
  multiple: {
    variant: 'multiple' as const,
    searchable: true,
    clearable: true,
    maxSelections: 5
  },
  
  async: {
    variant: 'async' as const,
    searchable: true,
    clearable: true,
    loading: false
  }
};