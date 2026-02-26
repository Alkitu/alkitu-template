export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'label'
  | 'caption'
  | 'overline'
  | 'lead'
  | 'blockquote'
  | 'body'
  | 'body2';

export type TypographySize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

export type TypographyWeight =
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold';

export type TypographyColor =
  | 'foreground'
  | 'muted'
  | 'accent'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'inherit';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Semantic variant that determines the HTML element and default styling
   * @default 'p'
   */
  variant?: TypographyVariant;

  /**
   * Size of the text (overrides variant defaults)
   */
  size?: TypographySize;

  /**
   * Font weight
   */
  weight?: TypographyWeight;

  /**
   * Text color using theme colors
   * @default 'inherit'
   */
  color?: TypographyColor;

  /**
   * Text alignment
   * @default 'left'
   */
  align?: TypographyAlign;

  /**
   * Whether text should be truncated with ellipsis
   * @default false
   */
  truncate?: boolean;

  /**
   * Content to display
   */
  children: React.ReactNode;

  /**
   * Custom HTML element to use (overrides variant default)
   */
  as?: keyof React.JSX.IntrinsicElements;

  /**
   * Theme variable overrides for custom styling
   * Supports both Alianza CSS variables and direct properties
   */
  themeOverride?: Record<string, string>;

  /**
   * Use Alianza design system CSS variables
   * When true, uses --typography-h{level}-* variables from theme
   * @default false
   */
  useAlianzaTheme?: boolean;
}

/**
 * Backward compatibility: Heading-specific props for Alianza
 * Supports legacy Heading component usage
 */
export interface HeadingProps {
  /**
   * Heading level (1-6)
   * @default 1
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Content to display
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Use Alianza design system CSS variables
   * @default true
   */
  useAlianzaTheme?: boolean;
}
