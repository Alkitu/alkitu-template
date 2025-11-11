'use client';

import { Button } from '@/components/primitives/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/primitives/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/primitives/ui/popover';
import { ScrollArea } from '@/components/primitives/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/primitives/ui/tabs';
import { Separator } from '@/components/primitives/ui/separator';
import { cn } from '@/lib/utils';
import { TAILWIND_PALETTE } from '@/lib/tailwind-colors';
import { oklchToHex } from '@/lib/themeUtils';
import { Check, LayoutGrid, List, Palette } from 'lucide-react';
import { useCallback, useState } from 'react';

type ColorSelectorPopoverProps = {
  currentColor: string;
  onChange: (color: string) => void;
};

export function ColorSelectorPopover({
  currentColor,
  onChange,
}: ColorSelectorPopoverProps) {
  const [colorSelectorTab, setColorSelectorTab] = useState<'list' | 'palette'>(
    'list',
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      // Convert OKLCH to HEX before passing to onChange
      const hexColor = color.includes('oklch(')
        ? oklchToHex(color.replace('oklch(', '').replace(')', ''))
        : color;
      onChange(hexColor);
    },
    [onChange],
  );

  const handleTabChange = useCallback((value: string) => {
    setColorSelectorTab(value as 'list' | 'palette');
  }, []);

  const isColorSelected = useCallback(
    (color: string) => {
      // Normalize colors for comparison (support both hex and oklch)
      const normalize = (str: string) => {
        if (str.includes('oklch(')) {
          return str.match(/oklch\(([^)]+)\)/)?.[1] || str;
        }
        return str.toLowerCase();
      };

      const current = normalize(currentColor);
      const compare = normalize(color);

      return current === compare;
    },
    [currentColor],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="size-8 p-0"
          title="Tailwind Colors"
        >
          <Palette className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto gap-0 overflow-hidden p-0" align="end">
        <Tabs defaultValue={colorSelectorTab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between gap-4">
            <div className="ml-2 flex items-center gap-1.5">
              <Palette className="size-4" />
              <span className="text-muted-foreground text-sm">
                Tailwind Colors
              </span>
            </div>

            <TabsList className="bg-transparent">
              <TabsTrigger
                value="list"
                className="data-[state=active]:bg-muted size-8 p-0"
              >
                <List className="size-4" />
              </TabsTrigger>
              <TabsTrigger
                value="palette"
                className="data-[state=active]:bg-muted size-8 p-0"
              >
                <LayoutGrid className="size-4" />
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />

          <TabsContent value="list" className="my-0 min-w-[300px]">
            <Command className="flex h-84 flex-col">
              <CommandInput
                className="h-10"
                placeholder="Search Tailwind colors..."
              />
              <ScrollArea className="flex-1 overflow-hidden max-h-80">
                <CommandEmpty className="text-muted-foreground p-4 text-center">
                  No Tailwind color found.
                </CommandEmpty>

                {Object.entries(TAILWIND_PALETTE).map(([key, colors]) => {
                  const colorName = key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <CommandGroup heading={colorName} key={key}>
                      {Object.entries(colors).map(([shade, color]) => {
                        const isSelected = isColorSelected(color);
                        // Extract OKLCH values without oklch() wrapper
                        const oklchValue = color
                          .replace('oklch(', '')
                          .replace(')', '');

                        return (
                          <CommandItem
                            key={color}
                            onSelect={() => handleColorSelect(color)}
                            className="flex items-center gap-2"
                          >
                            <ColorSwatch
                              color={color}
                              name={`${key}-${shade}`}
                              isSelected={isSelected}
                              size="md"
                            />
                            <span>{`${key}-${shade}`}</span>
                            {isSelected && (
                              <Check className="ml-auto size-4 opacity-70" />
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  );
                })}
              </ScrollArea>
            </Command>
          </TabsContent>

          <TabsContent value="palette" className="my-0 w-full">
            <ScrollArea className="h-80 w-full">
              <div className="flex flex-col gap-0.5 p-1">
                {Object.entries(TAILWIND_PALETTE).map(([key, colors]) => {
                  return (
                    <div key={key} className="flex gap-0.5">
                      {Object.entries(colors).map(([shade, color]) => {
                        return (
                          <ColorSwatch
                            key={`${key}-${shade}`}
                            name={`${key}-${shade}`}
                            color={color}
                            isSelected={isColorSelected(color)}
                            onClick={() => handleColorSelect(color)}
                            className="rounded-none"
                            size="md"
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

interface ColorSwatchProps extends React.HTMLAttributes<HTMLButtonElement> {
  isSelected: boolean;
  color: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

function ColorSwatch({
  color,
  name,
  className,
  isSelected,
  size = 'sm',
  ...props
}: ColorSwatchProps) {
  const sizeClasses = {
    sm: 'size-5',
    md: 'size-6',
    lg: 'size-8',
  };

  return (
    <button
      aria-label={`Select color ${name}`}
      title={name}
      className={cn(
        'group relative cursor-pointer rounded-md border transition-all hover:z-10 hover:scale-110 hover:shadow-lg',
        sizeClasses[size],
        isSelected && 'ring-2 ring-primary',
        className,
      )}
      style={{
        backgroundColor: color.startsWith('oklch') ? color : `oklch(${color})`,
      }}
      {...props}
    >
      <div className="group-hover:ring-foreground/50 absolute inset-0 rounded-[inherit] ring-2 ring-transparent transition-all duration-200" />
    </button>
  );
}
