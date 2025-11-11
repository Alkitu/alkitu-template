export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'caption' | 'overline' | 'lead' | 'blockquote';
export type TypographySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
export type TypographyWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
export type TypographyColor = 'foreground' | 'muted' | 'accent' | 'primary' | 'secondary' | 'destructive' | 'inherit';
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
  as?: keyof JSX.IntrinsicElements;
  
  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: Record<string, string>;
}