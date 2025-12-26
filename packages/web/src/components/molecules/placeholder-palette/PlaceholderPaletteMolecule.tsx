'use client';

import { useState } from 'react';
import type { PlaceholderPaletteMoleculeProps } from './PlaceholderPaletteMolecule.types';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';

/**
 * PlaceholderPaletteMolecule
 *
 * A reusable component that displays available email template placeholders
 * in a categorized grid. Supports click-to-insert and copy-to-clipboard functionality.
 *
 * @component
 * @example
 * ```tsx
 * <PlaceholderPaletteMolecule
 *   placeholders={availablePlaceholders}
 *   onPlaceholderClick={(placeholder) => insertIntoEditor(placeholder)}
 *   enableCopy
 * />
 * ```
 */
export function PlaceholderPaletteMolecule({
  placeholders,
  onPlaceholderClick,
  showCategoryHeaders = true,
  enableCopy = false,
  className,
  columns = 5,
}: PlaceholderPaletteMoleculeProps) {
  const [copiedPlaceholder, setCopiedPlaceholder] = useState<string | null>(null);

  const handleClick = async (placeholder: string) => {
    // Call the onPlaceholderClick callback if provided
    onPlaceholderClick?.(placeholder);

    // Copy to clipboard if enabled
    if (enableCopy) {
      try {
        await navigator.clipboard.writeText(placeholder);
        setCopiedPlaceholder(placeholder);
        setTimeout(() => setCopiedPlaceholder(null), 2000);
      } catch (error) {
        console.error('Failed to copy placeholder:', error);
      }
    }
  };

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }[columns];

  return (
    <div className={cn('grid gap-4', gridColsClass, className)}>
      {Object.entries(placeholders).map(([category, items]) => (
        <div key={category} className="space-y-2">
          {showCategoryHeaders && (
            <h4 className="text-sm font-semibold capitalize text-foreground">
              {category}
            </h4>
          )}
          <div className="space-y-1">
            {(items as string[]).map((placeholder) => {
              const isCopied = copiedPlaceholder === placeholder;

              return (
                <button
                  key={placeholder}
                  type="button"
                  onClick={() => handleClick(placeholder)}
                  className={cn(
                    'group relative flex items-center justify-between w-full text-left text-xs px-2 py-1.5 rounded transition-colors',
                    'bg-gray-100 dark:bg-gray-800',
                    'hover:bg-gray-200 dark:hover:bg-gray-700',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                    isCopied && 'bg-green-100 dark:bg-green-900'
                  )}
                  title={
                    enableCopy
                      ? isCopied
                        ? 'Copied!'
                        : 'Click to copy'
                      : 'Click to insert'
                  }
                >
                  <code className="font-mono text-xs truncate">{placeholder}</code>
                  {enableCopy && (
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isCopied ? (
                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
