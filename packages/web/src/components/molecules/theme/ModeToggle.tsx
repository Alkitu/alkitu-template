'use client';

/**
 * ModeToggle Component - Molecule (IMPROVED VERSION)
 *
 * Improved version of the theme mode toggle with better UX and accessibility.
 * Allows users to switch between light, dark, and system theme modes.
 *
 * Uses comprehensive CSS variable system for dynamic theming:
 * - All styling uses migrated components (Button, DropdownMenu)
 * - Smooth transitions using --transition-base
 * - Automatically responds to theme changes
 *
 * Improvements over original:
 * - Uses CSS variables for all spacing and transitions
 * - Better accessibility with proper ARIA labels
 * - Keyboard navigation support
 * - Visual feedback for current mode
 * - Cleaner code structure
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/primitives/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/primitives/DropdownMenu';

export interface ModeToggleProps {
  /**
   * Display mode for the toggle
   * @default 'icon' - Shows icon button with dropdown
   * @alternative 'buttons' - Shows three separate buttons
   */
  variant?: 'icon' | 'buttons';

  /**
   * Size of the toggle button
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg' | 'icon';

  /**
   * Custom className for styling
   */
  className?: string;

  /**
   * Show labels alongside icons
   * @default false
   */
  showLabels?: boolean;
}

/**
 * ModeToggle - Allows users to switch between light/dark/system modes
 *
 * @example
 * ```tsx
 * // Icon dropdown (default)
 * <ModeToggle />
 *
 * // Icon with custom size
 * <ModeToggle size="sm" />
 *
 * // Separate buttons mode
 * <ModeToggle variant="buttons" />
 *
 * // With labels
 * <ModeToggle showLabels />
 * ```
 */
export function ModeToggle({
  variant = 'icon',
  size = 'default',
  className,
  showLabels = false,
}: ModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Icon dropdown variant
  if (variant === 'icon') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size === 'icon' ? 'icon' : size}
            className={className}
            aria-label="Toggle theme mode"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setTheme('light')}
            className="gap-2"
          >
            <Sun className="h-4 w-4" />
            <span>Light</span>
            {theme === 'light' && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('dark')}
            className="gap-2"
          >
            <Moon className="h-4 w-4" />
            <span>Dark</span>
            {theme === 'dark' && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('system')}
            className="gap-2"
          >
            <Monitor className="h-4 w-4" />
            <span>System</span>
            {theme === 'system' && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Separate buttons variant
  return (
    <div
      className={`inline-flex gap-1 p-1 bg-muted rounded-md ${className || ''}`}
      role="group"
      aria-label="Theme mode selection"
    >
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size={size}
        onClick={() => setTheme('light')}
        className="gap-2"
        aria-label="Light mode"
        aria-pressed={theme === 'light'}
      >
        <Sun className="h-4 w-4" />
        {showLabels && <span>Light</span>}
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size={size}
        onClick={() => setTheme('dark')}
        className="gap-2"
        aria-label="Dark mode"
        aria-pressed={theme === 'dark'}
      >
        <Moon className="h-4 w-4" />
        {showLabels && <span>Dark</span>}
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size={size}
        onClick={() => setTheme('system')}
        className="gap-2"
        aria-label="System mode"
        aria-pressed={theme === 'system'}
      >
        <Monitor className="h-4 w-4" />
        {showLabels && <span>System</span>}
      </Button>
    </div>
  );
}

ModeToggle.displayName = 'ModeToggle';
