'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from './utils';
import { Button } from '@/components/primitives/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  buttonClass?: string;
  popoverClass?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No option found.',
  className,
  disabled = false,
  buttonClass,
  popoverClass,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Filter options based on search query, prioritizing label over value
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(lowerCaseQuery) ||
        option.value.toLowerCase().includes(lowerCaseQuery),
    );
  }, [options, searchQuery]);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between text-white font-bold bg-zinc-900 border-zinc-700',
              buttonClass,
            )}
          >
            {value && options.find((option) => option.value === value)
              ? options.find((option) => option.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            'p-0 bg-zinc-900 border-zinc-700 z-[100]',
            popoverClass,
          )}
          align="start"
          side="bottom"
        >
          <Command className="bg-zinc-900" shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              className="h-9 bg-zinc-900 text-white"
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {filteredOptions.length === 0 && (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              )}
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onChange(option.value === value ? '' : option.value);
                      setOpen(false);
                    }}
                    className="text-white data-[selected=true]:bg-zinc-800 data-[selected=true]:text-inside hover:bg-zinc-800"
                  >
                    {option.label}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === option.value
                          ? 'opacity-100 text-inside'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
