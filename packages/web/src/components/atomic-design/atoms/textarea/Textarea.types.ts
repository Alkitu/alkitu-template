import type { ReactNode, CSSProperties, TextareaHTMLAttributes } from 'react';

/**
 * Variant options for Textarea
 */
export type TextareaVariant = 'default' | 'error' | 'success';

/**
 * Size options for Textarea
 */
export type TextareaSize = 'sm' | 'md' | 'lg';

/**
 * Autosize reference type for imperative handle
 */
export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement;
  focus: () => void;
  maxHeight: number;
  minHeight: number;
};

/**
 * Props for Textarea component
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Visual variant of the textarea
   * @default 'default'
   */
  variant?: TextareaVariant;

  /**
   * Size of the textarea
   * @default 'md'
   */
  size?: TextareaSize;

  /**
   * Enable auto-resize functionality
   * @default false
   */
  autosize?: boolean;

  /**
   * Maximum height for autosize (in pixels)
   * @default Number.MAX_SAFE_INTEGER
   */
  maxHeight?: number;

  /**
   * Minimum height for autosize (in pixels)
   * @default 52
   */
  minHeight?: number;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Theme override using CSS custom properties
   * Allows dynamic theming without CSS classes
   */
  themeOverride?: CSSProperties;

  /**
   * Use system color variables from theme
   * @default true
   */
  useSystemColors?: boolean;

  /**
   * Use typography CSS variables from theme
   * @default true
   */
  useTypographyVars?: boolean;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}
