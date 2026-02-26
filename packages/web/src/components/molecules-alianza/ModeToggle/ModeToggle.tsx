'use client';

import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/molecules-alianza/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/molecules-alianza/DropdownMenu';
import type { ModeToggleProps, ThemeMode } from './ModeToggle.types';

/**
 * ModeToggle - Atomic Design Molecule
 *
 * Theme mode toggle component that allows users to switch between light, dark, and system themes.
 * Integrates with next-themes for theme management and provides two display variants:
 * - Icon dropdown: Compact button with dropdown menu
 * - Button group: Three separate buttons for each theme option
 *
 * Features:
 * - Light/Dark/System mode support
 * - Two display variants (icon dropdown and button group)
 * - Smooth icon transitions
 * - Active state indicators
 * - Full keyboard accessibility
 * - Proper ARIA labels
 * - Hydration-safe rendering
 *
 * @example Icon dropdown (default)
 * ```tsx
 * <ModeToggle />
 * ```
 *
 * @example Button group with labels
 * ```tsx
 * <ModeToggle variant="buttons" showLabels />
 * ```
 *
 * @example With change callback
 * ```tsx
 * <ModeToggle onThemeChange={(theme) => console.log('Theme:', theme)} />
 * ```
 */
export const ModeToggle = React.forwardRef<HTMLDivElement, ModeToggleProps>(
  (
    {
      variant = 'icon',
      size = 'md',
      showLabels = false,
      className = '',
      onThemeChange,
      iconSize,
      showTooltip = false,
      tooltipText = 'Toggle theme',
      align = 'end',
      disabled = false,
    },
    ref,
  ) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch by waiting for client-side mount
    React.useEffect(() => {
      setMounted(true);
    }, []);

    // Handle theme change with optional callback
    const handleThemeChange = React.useCallback(
      (newTheme: ThemeMode) => {
        setTheme(newTheme);
        onThemeChange?.(newTheme);
      },
      [setTheme, onThemeChange],
    );

    // Calculate icon size based on button size
    const getIconSize = React.useMemo(() => {
      if (iconSize) return `${iconSize}px`;
      const sizeMap = {
        sm: '0.875rem', // 14px
        md: '1.125rem', // 18px
        lg: '1.25rem', // 20px
      };
      return sizeMap[size];
    }, [size, iconSize]);

    // Icon classes for smooth transitions
    const iconClasses = cn('transition-all duration-200', {
      'h-3.5 w-3.5': size === 'sm' && !iconSize,
      'h-[1.125rem] w-[1.125rem]': size === 'md' && !iconSize,
      'h-5 w-5': size === 'lg' && !iconSize,
    });

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
      return null;
    }

    // Icon dropdown variant
    if (variant === 'icon') {
      return (
        <div ref={ref} className={cn('inline-flex', className)}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={size}
                iconOnly
                className="relative"
                disabled={disabled}
                aria-label="Toggle theme mode"
                title={showTooltip ? tooltipText : undefined}
              >
                <Sun
                  className={cn(
                    iconClasses,
                    'rotate-0 scale-100 dark:-rotate-90 dark:scale-0',
                  )}
                  style={{ width: getIconSize, height: getIconSize }}
                />
                <Moon
                  className={cn(
                    iconClasses,
                    'absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100',
                  )}
                  style={{ width: getIconSize, height: getIconSize }}
                />
                <span className="sr-only">{tooltipText}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} sideOffset={8}>
              <DropdownMenuItem
                onClick={() => handleThemeChange('light')}
                className="gap-2 cursor-pointer"
                disabled={disabled}
              >
                <Sun className="h-4 w-4" />
                <span>Light</span>
                {theme === 'light' && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleThemeChange('dark')}
                className="gap-2 cursor-pointer"
                disabled={disabled}
              >
                <Moon className="h-4 w-4" />
                <span>Dark</span>
                {theme === 'dark' && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleThemeChange('system')}
                className="gap-2 cursor-pointer"
                disabled={disabled}
              >
                <Monitor className="h-4 w-4" />
                <span>System</span>
                {theme === 'system' && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    // Button group variant
    const buttonClasses = cn('gap-1 p-1 bg-muted rounded-[var(--radius-button)]', className);

    return (
      <div
        ref={ref}
        className={cn('inline-flex', buttonClasses)}
        role="group"
        aria-label="Theme mode selection"
      >
        <Button
          variant={theme === 'light' ? 'main' : 'nude'}
          size={size}
          onClick={() => handleThemeChange('light')}
          className="gap-2"
          disabled={disabled}
          aria-label="Light mode"
          aria-pressed={theme === 'light'}
        >
          <Sun className={iconClasses} style={{ width: getIconSize, height: getIconSize }} />
          {showLabels && <span>Light</span>}
        </Button>
        <Button
          variant={theme === 'dark' ? 'main' : 'nude'}
          size={size}
          onClick={() => handleThemeChange('dark')}
          className="gap-2"
          disabled={disabled}
          aria-label="Dark mode"
          aria-pressed={theme === 'dark'}
        >
          <Moon className={iconClasses} style={{ width: getIconSize, height: getIconSize }} />
          {showLabels && <span>Dark</span>}
        </Button>
        <Button
          variant={theme === 'system' ? 'main' : 'nude'}
          size={size}
          onClick={() => handleThemeChange('system')}
          className="gap-2"
          disabled={disabled}
          aria-label="System mode"
          aria-pressed={theme === 'system'}
        >
          <Monitor className={iconClasses} style={{ width: getIconSize, height: getIconSize }} />
          {showLabels && <span>System</span>}
        </Button>
      </div>
    );
  },
);

ModeToggle.displayName = 'ModeToggle';

export default ModeToggle;
