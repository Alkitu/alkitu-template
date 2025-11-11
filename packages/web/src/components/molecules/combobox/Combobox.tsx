'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/features/theme-editor-3.0/design-system/primitives/Button';
import { Badge } from '@/components/atoms/badges';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/primitives/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/primitives/ui/popover';
import type { ComboboxProps, ComboboxOption } from './Combobox.types';

/**
 * Combobox - Atomic Design Molecule
 *
 * Advanced combobox component with search, multi-selection, and async support.
 * Composes: Popover + Command + Button + Badge atoms
 *
 * Features:
 * - Single and multiple selection modes
 * - Searchable with custom filtering
 * - Rich options with icons, descriptions, and badges
 * - Async data loading support
 * - Clearable selections
 * - Fully theme-integrated with CSS variables
 * - Keyboard navigation support
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * // Basic single selection
 * <Combobox
 *   options={[
 *     { id: '1', label: 'Option 1', value: 'opt1' },
 *     { id: '2', label: 'Option 2', value: 'opt2' }
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 *
 * // Multiple selection with icons
 * <Combobox
 *   variant="multiple"
 *   options={options}
 *   value={selectedItems}
 *   onChange={setSelectedItems}
 *   maxSelections={5}
 * />
 *
 * // Async loading
 * <Combobox
 *   variant="async"
 *   options={results}
 *   loading={isLoading}
 *   onSearch={handleSearch}
 * />
 * ```
 */
export const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Select option...',
      searchPlaceholder = 'Search...',
      variant = 'default',
      disabled = false,
      clearable = true,
      searchable = true,
      className = '',
      emptyMessage = 'No option found.',
      maxSelections = 10,
      onSearch,
      loading = false,
      buttonClass,
      popoverClass,
    },
    ref,
  ) => {
    // Local state
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedValues, setSelectedValues] = useState<string[]>(
      Array.isArray(value) ? value : value ? [value] : [],
    );

    // Update selected values when external value changes
    useEffect(() => {
      setSelectedValues(Array.isArray(value) ? value : value ? [value] : []);
    }, [value]);

    // Handle selection
    const handleSelect = (optionValue: string) => {
      if (variant === 'multiple') {
        const isSelected = selectedValues.includes(optionValue);
        let newValues: string[];

        if (isSelected) {
          newValues = selectedValues.filter((v) => v !== optionValue);
        } else {
          if (selectedValues.length >= maxSelections) return;
          newValues = [...selectedValues, optionValue];
        }

        setSelectedValues(newValues);
        onChange?.(newValues);
      } else {
        const newValue = optionValue === selectedValues[0] ? '' : optionValue;
        setSelectedValues(newValue ? [newValue] : []);
        onChange?.(newValue);
        setIsOpen(false);
      }
    };

    // Handle search
    const handleSearch = (query: string) => {
      setSearchValue(query);
      onSearch?.(query);
    };

    // Clear selection
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedValues([]);
      onChange?.(variant === 'multiple' ? [] : '');
    };

    // Get display value
    const getDisplayValue = () => {
      if (selectedValues.length === 0) return placeholder;

      if (variant === 'multiple') {
        return `${selectedValues.length} selected`;
      }

      const selectedOption = options.find(
        (opt) => opt.value === selectedValues[0],
      );
      return selectedOption?.label || selectedValues[0];
    };

    // Filter options based on search
    const filteredOptions = useMemo(() => {
      if (!searchable || !searchValue) return options;

      const lowerCaseQuery = searchValue.toLowerCase();
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(lowerCaseQuery) ||
          option.value.toLowerCase().includes(lowerCaseQuery) ||
          option.description?.toLowerCase().includes(lowerCaseQuery),
      );
    }, [options, searchValue, searchable]);

    // Render loading state
    const renderLoading = () => (
      <div className="flex items-center justify-center gap-2 py-6 text-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
        <span className="text-sm font-medium text-muted-foreground">
          Loading...
        </span>
      </div>
    );

    // Render option content
    const renderOption = (option: ComboboxOption) => {
      const isSelected = selectedValues.includes(option.value);

      return (
        <CommandItem
          key={option.id}
          value={option.value}
          onSelect={() => handleSelect(option.value)}
          disabled={option.disabled}
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5',
            'transition-all duration-200',
            'hover:bg-accent/60 focus:bg-accent/80',
            'focus:outline-none focus:ring-2 focus:ring-ring',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            isSelected && 'bg-primary/5',
          )}
        >
          {/* Multiple selection checkbox */}
          {variant === 'multiple' && (
            <div
              className={cn(
                'flex h-4.5 w-4.5 items-center justify-center rounded border-2 transition-all',
                isSelected
                  ? 'border-primary bg-primary'
                  : 'border-border bg-transparent',
              )}
            >
              {isSelected && (
                <Check className="h-3 w-3 text-primary-foreground" />
              )}
            </div>
          )}

          {/* Option icon */}
          {option.icon && (
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded transition-all',
                isSelected && 'text-primary',
              )}
            >
              {option.icon}
            </div>
          )}

          {/* Option content */}
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                'font-medium transition-all',
                isSelected ? 'text-primary font-semibold' : 'text-foreground',
              )}
            >
              {option.label}
            </div>
            {option.description && (
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {option.description}
              </div>
            )}
          </div>

          {/* Option badge */}
          {option.badge && (
            <Badge
              variant={
                isSelected ? 'default' : option.badge.variant || 'outline'
              }
              className="text-xs flex-shrink-0"
            >
              {option.badge.text}
            </Badge>
          )}

          {/* Single selection check mark */}
          {variant !== 'multiple' && isSelected && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
              <Check className="h-4 w-4 text-primary" />
            </div>
          )}
        </CommandItem>
      );
    };

    // Render selected badges for multiple variant
    const renderSelectedBadges = () => {
      if (variant !== 'multiple' || selectedValues.length === 0) {
        return null;
      }

      const displayCount = 3;
      const visibleValues = selectedValues.slice(0, displayCount);
      const remainingCount = selectedValues.length - displayCount;

      return (
        <div className="flex flex-wrap items-center gap-1.5 max-h-20 overflow-y-auto py-1">
          {visibleValues.map((val) => {
            const option = options.find((opt) => opt.value === val);
            return (
              <Badge
                key={val}
                variant="secondary"
                className="text-xs font-medium border border-primary/30 bg-primary/10 text-primary"
              >
                {option?.label || val}
              </Badge>
            );
          })}
          {remainingCount > 0 && (
            <Badge
              variant="outline"
              className="text-xs font-semibold bg-muted/50 text-muted-foreground"
            >
              +{remainingCount} more
            </Badge>
          )}
        </div>
      );
    };

    return (
      <div ref={ref} className={cn('relative', className)}>
        <Popover open={isOpen} onOpenChange={disabled ? undefined : setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-label={
                selectedValues.length > 0
                  ? `Selected: ${getDisplayValue()}`
                  : placeholder
              }
              disabled={disabled}
              className={cn(
                'w-full justify-between text-left font-normal',
                'min-h-10 transition-all duration-300',
                isOpen && 'ring-2 ring-ring ring-offset-2',
                !selectedValues.length && 'text-muted-foreground',
                buttonClass,
              )}
            >
              <div className="flex-1 min-w-0">
                {variant === 'multiple' && selectedValues.length > 0 ? (
                  renderSelectedBadges()
                ) : (
                  <span className="truncate">{getDisplayValue()}</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                {clearable && selectedValues.length > 0 && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleClear}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClear(e as unknown as React.MouseEvent);
                      }
                    }}
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded cursor-pointer',
                      'hover:bg-destructive/20 transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-ring',
                    )}
                    aria-label="Clear selection"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform duration-300',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </div>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className={cn(
              'w-full p-0',
              'min-w-[320px] max-w-[420px]',
              popoverClass,
            )}
            align="start"
          >
            <Command shouldFilter={false}>
              {searchable && (
                <CommandInput
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onValueChange={handleSearch}
                  className="h-9"
                />
              )}

              <CommandList>
                {loading ? (
                  renderLoading()
                ) : (
                  <>
                    {filteredOptions.length === 0 && (
                      <CommandEmpty>{emptyMessage}</CommandEmpty>
                    )}
                    <CommandGroup>
                      {filteredOptions.map(renderOption)}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';

/**
 * Preset configurations for common use cases
 */
export const ComboboxPresets = {
  /**
   * Basic single selection combobox
   */
  basic: {
    variant: 'default' as const,
    searchable: true,
    clearable: true,
  },

  /**
   * Multiple selection combobox with max limit
   */
  multiple: {
    variant: 'multiple' as const,
    searchable: true,
    clearable: true,
    maxSelections: 5,
  },

  /**
   * Async combobox with loading state
   */
  async: {
    variant: 'async' as const,
    searchable: true,
    clearable: true,
    loading: false,
  },
} as const;

export default Combobox;
