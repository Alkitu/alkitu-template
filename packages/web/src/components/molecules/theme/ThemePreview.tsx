'use client';

/**
 * ThemePreview Component - Molecule
 *
 * Shows a visual preview of a theme with sample UI elements.
 * Useful for theme selection interfaces and theme management.
 *
 * Uses comprehensive CSS variable system for dynamic theming:
 * - All styling uses migrated components (Card, Button, Badge)
 * - Automatically responds to theme changes
 * - Can preview themes without applying them globally
 *
 * @see docs/CSS-VARIABLES-REFERENCE.md for complete variable documentation
 */

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/primitives/Card';
import { Button } from '@/components/primitives/ui/button';
import { Badge } from '@/components/atoms/badge';
import type { Theme } from '@/types/theme';

export interface ThemePreviewProps {
  /**
   * Theme to preview
   */
  theme?: Partial<Theme>;

  /**
   * Size of the preview
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg';

  /**
   * Show theme name
   * @default true
   */
  showName?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;

  /**
   * Callback when preview is clicked
   */
  onClick?: () => void;

  /**
   * Show interactive elements in preview
   * @default true
   */
  interactive?: boolean;
}

/**
 * ThemePreview - Visual preview of a theme
 *
 * @example
 * ```tsx
 * // Basic preview
 * <ThemePreview theme={myTheme} />
 *
 * // Small preview with click handler
 * <ThemePreview
 *   theme={myTheme}
 *   size="sm"
 *   onClick={() => console.log('Theme selected')}
 * />
 *
 * // Non-interactive preview without name
 * <ThemePreview
 *   theme={myTheme}
 *   showName={false}
 *   interactive={false}
 * />
 * ```
 */
export function ThemePreview({
  theme,
  size = 'default',
  showName = true,
  className,
  onClick,
  interactive = true,
}: ThemePreviewProps) {
  const previewStyles: React.CSSProperties = React.useMemo(() => {
    if (!theme?.colors) return {};

    // Apply theme colors as CSS variables for preview
    return {
      '--preview-primary': theme.colors.primary,
      '--preview-background': theme.colors.background,
      '--preview-foreground': theme.colors.foreground,
      '--preview-muted': theme.colors.muted,
      '--preview-accent': theme.colors.accent,
    } as React.CSSProperties;
  }, [theme]);

  const sizeClasses = {
    sm: 'scale-75',
    default: '',
    lg: 'scale-110',
  };

  return (
    <div
      className={`${sizeClasses[size]} transition-transform ${className || ''}`}
      style={previewStyles}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <Card
        className={`w-full max-w-sm ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      >
        {showName && theme?.name && (
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{theme.name}</CardTitle>
              {theme.isDefault && (
                <Badge variant="secondary" size="sm">
                  Default
                </Badge>
              )}
            </div>
            {theme.description && (
              <CardDescription className="text-xs">
                {theme.description}
              </CardDescription>
            )}
          </CardHeader>
        )}

        <CardContent className="space-y-3">
          {/* Color Palette Preview */}
          <div className="flex gap-2">
            <div
              className="h-8 w-8 rounded-md border"
              style={{ backgroundColor: theme?.colors?.primary || 'var(--primary)' }}
              title="Primary"
            />
            <div
              className="h-8 w-8 rounded-md border"
              style={{ backgroundColor: theme?.colors?.secondary || 'var(--secondary)' }}
              title="Secondary"
            />
            <div
              className="h-8 w-8 rounded-md border"
              style={{ backgroundColor: theme?.colors?.accent || 'var(--accent)' }}
              title="Accent"
            />
            <div
              className="h-8 w-8 rounded-md border"
              style={{ backgroundColor: theme?.colors?.muted || 'var(--muted)' }}
              title="Muted"
            />
          </div>

          {/* Interactive Elements Preview */}
          {interactive && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button size="sm" variant="default" disabled>
                  Primary
                </Button>
                <Button size="sm" variant="secondary" disabled>
                  Secondary
                </Button>
                <Button size="sm" variant="outline" disabled>
                  Outline
                </Button>
              </div>

              <div className="flex gap-2">
                <Badge variant="default" size="sm">Badge</Badge>
                <Badge variant="secondary" size="sm">Status</Badge>
                <Badge variant="outline" size="sm">Tag</Badge>
              </div>

              {/* Sample Text */}
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-foreground">
                  Sample Heading
                </p>
                <p className="text-muted-foreground">
                  This is sample body text to show how the theme looks.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

ThemePreview.displayName = 'ThemePreview';
