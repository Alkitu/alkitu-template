'use client';

/**
 * ThemePreview Component - Molecule
 *
 * Displays a visual preview of a theme with color swatches and optional interactive elements.
 * Supports color value display, copy-to-clipboard functionality, and theme selection.
 *
 * Features:
 * - Color palette preview with swatches
 * - Multiple display formats (hex, rgb, hsl, oklch)
 * - Copy color values to clipboard
 * - Compact and expanded modes
 * - Light/dark mode support
 * - Active theme indicator
 * - Interactive elements preview (buttons, badges)
 * - Click to select theme
 * - Responsive layout
 *
 * Uses comprehensive CSS variable system for dynamic theming.
 *
 * @example
 * ```tsx
 * // Basic preview
 * <ThemePreview theme={myTheme} />
 *
 * // Expanded mode with color values
 * <ThemePreview
 *   theme={myTheme}
 *   mode="expanded"
 *   colorFormat="hex"
 * />
 *
 * // Active theme with click handler
 * <ThemePreview
 *   theme={myTheme}
 *   isActive
 *   onClick={() => selectTheme(myTheme.id)}
 * />
 *
 * // Grid of multiple themes
 * <div className="grid grid-cols-3 gap-4">
 *   {themes.map(theme => (
 *     <ThemePreview key={theme.id} theme={theme} />
 *   ))}
 * </div>
 * ```
 */

import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/molecules-alianza/Card';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Button } from '@/components/molecules-alianza/Button';
import { Tooltip } from '@/components/atoms-alianza/Tooltip';
import { Typography } from '@/components/atoms-alianza/Typography';
import type { ThemePreviewProps, ColorSwatchProps } from './ThemePreview.types';

/**
 * ColorSwatch - Individual color swatch with copy functionality
 */
const ColorSwatch = React.forwardRef<HTMLDivElement, ColorSwatchProps>(
  (
    {
      name,
      value,
      hexValue,
      rgbValue,
      hslValue,
      oklchValue,
      enableCopy = true,
      format = 'hex',
      size = 'md',
      onClick,
      className,
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);

    // Get display value based on format
    const getDisplayValue = () => {
      switch (format) {
        case 'hex':
          return hexValue || value;
        case 'rgb':
          return rgbValue || value;
        case 'hsl':
          return hslValue || value;
        case 'oklch':
          return oklchValue || value;
        default:
          return value;
      }
    };

    const displayValue = getDisplayValue();

    // Handle copy to clipboard
    const handleCopy = async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!enableCopy) return;

      try {
        await navigator.clipboard.writeText(displayValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy color value:', err);
      }
    };

    // Size classes
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
    }[size];

    const colorSwatch = (
      <div
        ref={ref}
        className={cn(
          'group relative rounded-md border border-border shadow-sm transition-all duration-200',
          sizeClasses,
          onClick && 'cursor-pointer hover:scale-110 hover:shadow-md',
          enableCopy && 'cursor-pointer hover:ring-2 hover:ring-primary/20',
          className,
        )}
        style={{ backgroundColor: value }}
        onClick={onClick || (enableCopy ? handleCopy : undefined)}
        role={onClick || enableCopy ? 'button' : undefined}
        tabIndex={onClick || enableCopy ? 0 : undefined}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && (onClick || enableCopy)) {
            e.preventDefault();
            if (onClick) onClick();
            else if (enableCopy) handleCopy(e as any);
          }
        }}
        aria-label={`${name} color: ${displayValue}`}
      >
        {/* Copy feedback icon */}
        {enableCopy && (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center rounded-md bg-black/50 opacity-0 transition-opacity duration-200',
              'group-hover:opacity-100',
            )}
          >
            {copied ? (
              <Check className="h-4 w-4 text-white" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4 text-white" aria-hidden="true" />
            )}
          </div>
        )}
      </div>
    );

    // Wrap with tooltip if copy is enabled
    if (enableCopy) {
      return (
        <Tooltip
          content={copied ? 'Copied!' : `Click to copy ${displayValue}`}
          placement="top"
        >
          {colorSwatch}
        </Tooltip>
      );
    }

    return colorSwatch;
  },
);

ColorSwatch.displayName = 'ColorSwatch';

/**
 * ThemePreview - Visual preview of a theme
 */
export const ThemePreview = React.forwardRef<HTMLDivElement, ThemePreviewProps>(
  (
    {
      theme,
      size = 'md',
      mode = 'compact',
      showName = true,
      showDescription = false,
      showInteractivePreview = true,
      className,
      onClick,
      isActive = false,
      enableCopy = true,
      colorFormat = 'hex',
      themeMode = 'light',
      showDefaultBadge = true,
      style,
    },
    ref,
  ) => {
    // Get colors based on theme mode
    const colors = React.useMemo(() => {
      if (!theme) return null;

      if (themeMode === 'dark' && theme.darkColors) {
        return theme.darkColors;
      }

      if (theme.lightColors) {
        return theme.lightColors;
      }

      // Fallback for old theme format
      return null;
    }, [theme, themeMode]);

    // Color palette to display
    const colorTokens = React.useMemo(() => {
      if (!colors) return [];

      const tokens = [];
      if (colors.primary) tokens.push({ name: 'Primary', key: 'primary', value: colors.primary });
      if (colors.secondary) tokens.push({ name: 'Secondary', key: 'secondary', value: colors.secondary });
      if (colors.accent) tokens.push({ name: 'Accent', key: 'accent', value: colors.accent });
      if (colors.muted) tokens.push({ name: 'Muted', key: 'muted', value: colors.muted });
      if (colors.destructive) tokens.push({ name: 'Destructive', key: 'destructive', value: colors.destructive });
      if (colors.background) tokens.push({ name: 'Background', key: 'background', value: colors.background });
      if (colors.foreground) tokens.push({ name: 'Foreground', key: 'foreground', value: colors.foreground });
      if (colors.border) tokens.push({ name: 'Border', key: 'border', value: colors.border });

      return tokens;
    }, [colors]);

    // Size scale
    const scaleClasses = {
      sm: 'scale-90',
      md: 'scale-100',
      lg: 'scale-105',
    }[size];

    // Card padding based on mode
    const cardPadding = mode === 'compact' ? 'sm' : 'md';

    return (
      <div
        ref={ref}
        className={cn('transition-transform', scaleClasses, className)}
        style={style}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        <Card
          variant={isActive ? 'elevated' : 'default'}
          padding={cardPadding}
          className={cn(
            'w-full max-w-sm transition-all duration-200',
            onClick && 'cursor-pointer hover:shadow-lg',
            isActive && 'ring-2 ring-primary',
          )}
        >
          {/* Header */}
          {showName && theme?.name && (
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{theme.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {isActive && (
                    <Badge variant="primary" size="sm" icon={<Check className="h-3 w-3" />}>
                      Active
                    </Badge>
                  )}
                  {showDefaultBadge && theme.isDefault && (
                    <Badge variant="secondary" size="sm">
                      Default
                    </Badge>
                  )}
                </div>
              </div>
              {showDescription && theme.description && (
                <CardDescription className="text-xs mt-1">
                  {theme.description}
                </CardDescription>
              )}
            </CardHeader>
          )}

          {/* Content */}
          <CardContent className="space-y-4">
            {/* Color Palette */}
            {colorTokens.length > 0 && (
              <div className="space-y-2">
                {mode === 'compact' ? (
                  // Compact mode: Grid of swatches only
                  <div className="grid grid-cols-4 gap-2">
                    {colorTokens.map((token) => (
                      <ColorSwatch
                        key={token.key}
                        name={token.name}
                        value={token.value.hex}
                        hexValue={token.value.hex}
                        oklchValue={token.value.oklchString}
                        enableCopy={enableCopy}
                        format={colorFormat}
                        size={size}
                      />
                    ))}
                  </div>
                ) : (
                  // Expanded mode: Swatches with labels and values
                  <div className="space-y-2">
                    {colorTokens.map((token) => (
                      <div
                        key={token.key}
                        className="flex items-center gap-3"
                      >
                        <ColorSwatch
                          name={token.name}
                          value={token.value.hex}
                          hexValue={token.value.hex}
                          oklchValue={token.value.oklchString}
                          enableCopy={enableCopy}
                          format={colorFormat}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <Typography
                            variant="body"
                            className="text-xs font-medium text-foreground"
                          >
                            {token.name}
                          </Typography>
                          <Typography
                            variant="body"
                            className="text-xs text-muted-foreground font-mono truncate"
                          >
                            {colorFormat === 'hex' ? token.value.hex : token.value.oklchString}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Interactive Elements Preview */}
            {showInteractivePreview && mode === 'compact' && (
              <div className="space-y-2 pt-2 border-t border-border">
                {/* Buttons */}
                <div className="flex gap-2">
                  <Button size="sm" variant="main" disabled>
                    Primary
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    Outline
                  </Button>
                  <Button size="sm" variant="nude" disabled>
                    Nude
                  </Button>
                </div>

                {/* Badges */}
                <div className="flex gap-2">
                  <Badge variant="default" size="sm">
                    Default
                  </Badge>
                  <Badge variant="primary" size="sm">
                    Primary
                  </Badge>
                  <Badge variant="outline" size="sm">
                    Outline
                  </Badge>
                </div>

                {/* Sample Text */}
                <div className="space-y-1">
                  <Typography variant="body" className="text-xs font-semibold text-foreground">
                    Sample Heading
                  </Typography>
                  <Typography variant="body" className="text-xs text-muted-foreground">
                    This is sample body text showing the theme.
                  </Typography>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  },
);

ThemePreview.displayName = 'ThemePreview';

export default ThemePreview;
